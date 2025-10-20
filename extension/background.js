let activeTabId = null;
let lastActiveTime = Date.now();

// Service worker running
console.log("TabTrack service worker running...");

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now();

  if (activeTabId && activeTabId !== activeInfo.tabId) {
    const timeSpent = Math.max(Math.floor((now - lastActiveTime) / 1000), 1);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && (tab.url.startsWith("http://") || tab.url.startsWith("https://"))) {
        const domain = new URL(tab.url).hostname;

        // Send tab info to backend
        try {
          const res = await fetch("http://localhost:5000/api/tabs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "michelle123", domain, timeSpent })
          });

          if (res.ok) {
            console.log("Logged tab:", domain, "Time:", timeSpent, "Status:", res.status);
          } else {
            console.log("Failed logging tab:", domain, "Time:", timeSpent, "Status:", res.status);
          }
        } catch (err) {
          console.error("Fetch failed:", err);
        }
      } else {
        console.log("Skipping invalid or non-http tab:", tab?.url);
      }
    } catch (err) {
      console.error("Error querying tab:", err);
    }
  }

  activeTabId = activeInfo.tabId;
  lastActiveTime = now;
});

// Optional: handle tab updates (like reloads or navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    lastActiveTime = Date.now();
  }
});
