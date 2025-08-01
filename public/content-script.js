// Content script for SidecarAI Bid Scanner
// This script runs on supported auction websites to extract vehicle data

(function() {
  'use strict';
  
  console.log('SidecarAI Bid Scanner content script loaded');
  
  // Store extracted data
  let extractedData = {
    vehicles: [],
    bids: [],
    timestamp: new Date().toISOString()
  };
  
  // Function to extract vehicle data from the current page
  function extractVehicleData() {
    const data = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };
    
    // Extract data based on the current website
    const hostname = window.location.hostname;
    
    if (hostname.includes('copart.com')) {
      data.vehicle = extractCopartData();
    } else if (hostname.includes('iaai.com')) {
      data.vehicle = extractIAAIData();
    } else if (hostname.includes('manheim.com')) {
      data.vehicle = extractManheimData();
    } else if (hostname.includes('adesa.com')) {
      data.vehicle = extractAdesaData();
    }
    
    return data;
  }
  
  // Extract data from Copart
  function extractCopartData() {
    const vehicle = {};
    
    // Extract VIN
    const vinElement = document.querySelector('[data-uname="lotsearchVin"]') || 
                      document.querySelector('.vin-number') ||
                      document.querySelector('[data-uname="vin"]');
    if (vinElement) {
      vehicle.vin = vinElement.textContent.trim();
    }
    
    // Extract year, make, model
    const titleElement = document.querySelector('[data-uname="lotsearchTitle"]') ||
                        document.querySelector('.lot-title') ||
                        document.querySelector('h1');
    if (titleElement) {
      vehicle.title = titleElement.textContent.trim();
    }
    
    // Extract current bid
    const bidElement = document.querySelector('[data-uname="lotsearchCurrentbid"]') ||
                      document.querySelector('.current-bid') ||
                      document.querySelector('.bid-amount');
    if (bidElement) {
      vehicle.currentBid = bidElement.textContent.trim();
    }
    
    // Extract lot number
    const lotElement = document.querySelector('[data-uname="lotsearchLotnumber"]') ||
                      document.querySelector('.lot-number');
    if (lotElement) {
      vehicle.lotNumber = lotElement.textContent.trim();
    }
    
    return vehicle;
  }
  
  // Extract data from IAAI
  function extractIAAIData() {
    const vehicle = {};
    
    // Extract VIN
    const vinElement = document.querySelector('.vin-number') ||
                      document.querySelector('[data-testid="vin"]');
    if (vinElement) {
      vehicle.vin = vinElement.textContent.trim();
    }
    
    // Extract title
    const titleElement = document.querySelector('.vehicle-title') ||
                        document.querySelector('h1');
    if (titleElement) {
      vehicle.title = titleElement.textContent.trim();
    }
    
    return vehicle;
  }
  
  // Extract data from Manheim
  function extractManheimData() {
    const vehicle = {};
    
    // Extract VIN
    const vinElement = document.querySelector('.vin') ||
                      document.querySelector('[data-field="vin"]');
    if (vinElement) {
      vehicle.vin = vinElement.textContent.trim();
    }
    
    return vehicle;
  }
  
  // Extract data from Adesa
  function extractAdesaData() {
    const vehicle = {};
    
    // Extract VIN
    const vinElement = document.querySelector('.vin-number') ||
                      document.querySelector('[data-field="vin"]');
    if (vinElement) {
      vehicle.vin = vinElement.textContent.trim();
    }
    
    return vehicle;
  }
  
  // Function to scan for bid opportunities
  function scanForBids() {
    const bidElements = document.querySelectorAll('[class*="bid"], [class*="price"], [class*="amount"]');
    const bids = [];
    
    bidElements.forEach(element => {
      const text = element.textContent.trim();
      const priceMatch = text.match(/\$[\d,]+(?:\.\d{2})?/);
      
      if (priceMatch) {
        bids.push({
          element: element.outerHTML,
          price: priceMatch[0],
          text: text
        });
      }
    });
    
    return bids;
  }
  
  // Function to send data to the extension
  function sendDataToExtension(data) {
    chrome.runtime.sendMessage({
      type: 'VEHICLE_DATA_EXTRACTED',
      data: data
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Error sending data to extension:', chrome.runtime.lastError);
      } else {
        console.log('Data sent to extension:', response);
      }
    });
  }
  
  // Main scanning function
  function performScan() {
    console.log('Performing vehicle data scan...');
    
    const vehicleData = extractVehicleData();
    const bidData = scanForBids();
    
    const scanResult = {
      ...vehicleData,
      bids: bidData,
      scanTime: new Date().toISOString()
    };
    
    // Store in local variable
    extractedData = scanResult;
    
    // Send to extension
    sendDataToExtension(scanResult);
    
    return scanResult;
  }
  
  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    switch (request.type) {
      case 'SCAN_VEHICLE_DATA':
        const result = performScan();
        sendResponse({ success: true, data: result });
        break;
        
      case 'GET_EXTRACTED_DATA':
        sendResponse({ success: true, data: extractedData });
        break;
        
      default:
        sendResponse({ error: 'Unknown message type' });
    }
  });
  
  // Perform initial scan when page loads
  setTimeout(() => {
    performScan();
  }, 2000);
  
  // Set up mutation observer to watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Re-scan when new content is added
        setTimeout(() => {
          performScan();
        }, 1000);
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Expose functions to window for debugging
  window.sidecarAI = {
    performScan,
    extractVehicleData,
    getExtractedData: () => extractedData
  };
  
})(); 