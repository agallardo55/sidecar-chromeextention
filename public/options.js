// Options page script for SidecarAI Bid Scanner

document.addEventListener('DOMContentLoaded', function() {
  const autoScanCheckbox = document.getElementById('autoScan');
  const notificationsCheckbox = document.getElementById('notifications');
  const scanIntervalInput = document.getElementById('scanInterval');
  const dataRetentionSelect = document.getElementById('dataRetention');
  const clearDataButton = document.getElementById('clearData');
  const statusDiv = document.getElementById('status');
  
  // Load saved settings
  function loadSettings() {
    chrome.storage.sync.get({
      autoScan: false,
      notifications: true,
      scanInterval: 30,
      dataRetention: 30
    }, function(items) {
      autoScanCheckbox.checked = items.autoScan;
      notificationsCheckbox.checked = items.notifications;
      scanIntervalInput.value = items.scanInterval;
      dataRetentionSelect.value = items.dataRetention;
    });
  }
  
  // Save settings
  function saveSettings() {
    const settings = {
      autoScan: autoScanCheckbox.checked,
      notifications: notificationsCheckbox.checked,
      scanInterval: parseInt(scanIntervalInput.value),
      dataRetention: parseInt(dataRetentionSelect.value)
    };
    
    chrome.storage.sync.set(settings, function() {
      showStatus('Settings saved successfully!', 'success');
    });
  }
  
  // Show status message
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
  
  // Clear all extension data
  function clearAllData() {
    if (confirm('Are you sure you want to clear all extension data? This action cannot be undone.')) {
      chrome.storage.local.clear(function() {
        chrome.storage.sync.clear(function() {
          showStatus('All data cleared successfully!', 'success');
        });
      });
    }
  }
  
  // Event listeners
  autoScanCheckbox.addEventListener('change', saveSettings);
  notificationsCheckbox.addEventListener('change', saveSettings);
  scanIntervalInput.addEventListener('change', saveSettings);
  dataRetentionSelect.addEventListener('change', saveSettings);
  clearDataButton.addEventListener('click', clearAllData);
  
  // Load settings on page load
  loadSettings();
  
  // Show extension info
  const manifest = chrome.runtime.getManifest();
  console.log('Extension version:', manifest.version);
}); 