/// <reference types="chrome"/>

// Extend Chrome types for any custom APIs you might need
declare namespace chrome {
  namespace sidePanel {
    function open(options: { windowId: number }): Promise<void>;
  }
  
  namespace action {
    const onClicked: {
      addListener: (callback: (tab: chrome.tabs.Tab) => void) => void;
    };
  }
} 