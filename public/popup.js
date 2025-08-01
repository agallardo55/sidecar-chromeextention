// Popup script for SidecarAI Bid Scanner

document.addEventListener('DOMContentLoaded', function() {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const scanButton = document.getElementById('scanButton');
  const vehicleInfo = document.getElementById('vehicleInfo');
  const vehicleData = document.getElementById('vehicleData');
  const openSidePanelButton = document.getElementById('openSidePanel');
  
  // Check if current tab is on a supported site
  async function checkCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url) {
        updateStatus('No active tab found', false);
        return;
      }
      
      const supportedSites = [
        'copart.com',
        'iaai.com',
        'manheim.com',
        'adesa.com'
      ];
      
      const isSupportedSite = supportedSites.some(site => tab.url.includes(site));
      
      if (isSupportedSite) {
        updateStatus('Site supported - Ready to scan', true);
        scanButton.disabled = false;
        
        // Try to get existing data from content script
        try {
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: 'GET_EXTRACTED_DATA'
          });
          
          if (response && response.success && response.data) {
            displayVehicleData(response.data);
          }
        } catch (error) {
          console.log('No content script found or error getting data:', error);
        }
      } else {
        updateStatus('Site not supported', false);
        scanButton.disabled = true;
      }
    } catch (error) {
      console.error('Error checking current tab:', error);
      updateStatus('Error checking tab', false);
    }
  }
  
  // Update status display
  function updateStatus(text, isActive) {
    statusText.textContent = text;
    statusDot.className = `status-dot ${isActive ? 'active' : 'inactive'}`;
  }
  
  // Display vehicle data
  function displayVehicleData(data) {
    if (data && (data.vehicle || data.bids)) {
      vehicleInfo.classList.remove('hidden');
      
      let displayText = '';
      
      if (data.vehicle) {
        if (data.vehicle.vin) displayText += `VIN: ${data.vehicle.vin}\n`;
        if (data.vehicle.title) displayText += `Title: ${data.vehicle.title}\n`;
        if (data.vehicle.lotNumber) displayText += `Lot: ${data.vehicle.lotNumber}\n`;
        if (data.vehicle.currentBid) displayText += `Current Bid: ${data.vehicle.currentBid}\n`;
      }
      
      if (data.bids && data.bids.length > 0) {
        displayText += `\nFound ${data.bids.length} bid opportunities`;
      }
      
      if (data.scanTime) {
        displayText += `\n\nLast scanned: ${new Date(data.scanTime).toLocaleTimeString()}`;
      }
      
      vehicleData.textContent = displayText || 'No vehicle data found';
    } else {
      vehicleInfo.classList.add('hidden');
    }
  }
  
  // Handle scan button click
  scanButton.addEventListener('click', async function() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url) {
        updateStatus('No active tab found', false);
        return;
      }
      
      updateStatus('Scanning...', true);
      scanButton.disabled = true;
      
      // Send message to content script to perform scan
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'SCAN_VEHICLE_DATA'
      });
      
      if (response && response.success) {
        displayVehicleData(response.data);
        updateStatus('Scan completed', true);
      } else {
        updateStatus('Scan failed', false);
      }
    } catch (error) {
      console.error('Error during scan:', error);
      updateStatus('Scan error - Check console', false);
    } finally {
      scanButton.disabled = false;
    }
  });
  
  // Handle side panel button click
  openSidePanelButton.addEventListener('click', async function() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        await chrome.runtime.sendMessage({
          type: 'OPEN_SIDE_PANEL'
        });
        
        // Close popup after opening side panel
        window.close();
      }
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  });
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'VEHICLE_DATA_EXTRACTED') {
      displayVehicleData(request.data);
    }
  });
  
  // Initialize popup
  checkCurrentTab();
  
  // Refresh status every 5 seconds
  setInterval(checkCurrentTab, 5000);
}); 