let activeTabId = null;
let lastActiveTime = Date.now();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now();

  if (activeTabId && activeTabId !== activeInfo.tabId) {
    const timeSpent = Math.floor((now - lastActiveTime) / 1000);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url && timeSpent > 1) {
      const domain = new URL(tab.url).hostname;
      await logTabActivity("michelle123", domain, timeSpent);
    }
  }

  activeTabId = activeInfo.tabId;
  lastActiveTime = now;
});

async function logTabActivity(userId, domain, timeSpent) {
  try {
    await fetch("http://localhost:5000/api/tabs/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, domain, timeSpent }),
    });
  } catch (err) {
    console.error("Error logging tab:", err);
  }
}
