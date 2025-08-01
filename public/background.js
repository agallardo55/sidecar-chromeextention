// Background script for SidecarAI Bid Scanner Chrome Extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('SidecarAI Bid Scanner extension installed:', details.reason);
  
  // Initialize default settings
  if (details.reason === 'install') {
    chrome.storage.local.set({
      isAuthenticated: false,
      userPreferences: {
        autoScan: false,
        notifications: true
      }
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  switch (request.type) {
    case 'GET_AUTH_STATUS':
      chrome.storage.local.get(['isAuthenticated'], (result) => {
        sendResponse({ isAuthenticated: result.isAuthenticated || false });
      });
      return true; // Keep message channel open for async response
      
    case 'SET_AUTH_STATUS':
      chrome.storage.local.set({ isAuthenticated: request.isAuthenticated });
      sendResponse({ success: true });
      break;
      
    case 'OPEN_SIDE_PANEL':
      // Get the current active tab to get the windowId
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].windowId) {
          try {
            chrome.sidePanel.open({ windowId: tabs[0].windowId });
            sendResponse({ success: true });
          } catch (error) {
            console.error('Error opening side panel:', error);
            sendResponse({ error: 'Failed to open side panel' });
          }
        } else {
          sendResponse({ error: 'No active tab found' });
        }
      });
      return true; // Keep message channel open for async response
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

// Handle tab updates to inject content scripts on ALL sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Inject content script on ALL websites (not just auction sites)
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content-script.js']
    }).catch(err => console.log('Content script injection failed:', err));
  }
});

// Handle extension icon click - ALWAYS open side panel
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked, opening side panel...');
  
  try {
    // Always try to open side panel when extension icon is clicked
    if (chrome.sidePanel && tab && tab.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
      console.log('Side panel opened successfully');
    } else {
      // Fallback: get current window
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0] && tabs[0].windowId) {
        await chrome.sidePanel.open({ windowId: tabs[0].windowId });
        console.log('Side panel opened via fallback');
      } else {
        console.error('Could not find window to open side panel');
      }
    }
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
}); 