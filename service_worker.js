const iconPaths = {
  enabled: {
    16: "images/icon16-enabled.png",
    32: "images/icon32-enabled.png",
    48: "images/icon48-enabled.png",
    128: "images/icon128-enabled.png",
  },
  disabled: {
    16: "images/icon16-disabled.png",
    32: "images/icon32-disabled.png",
    48: "images/icon48-disabled.png",
    128: "images/icon128-disabled.png",
  },
};

async function updateAction(enabled) {
  await chrome.action.setIcon({
    path: iconPaths[enabled ? "enabled" : "disabled"],
  });
  await chrome.action.setTitle({
    title: enabled ? "Amazon Clear is enabled" : "Amazon Clear is disabled",
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get("enabled");
  const currentEnabled = enabled ?? true;
  await chrome.storage.local.set({ enabled: currentEnabled });
  await updateAction(currentEnabled);
});

chrome.runtime.onStartup.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  await updateAction(enabled);
});

chrome.action.onClicked.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  const nextEnabled = !enabled;
  await chrome.storage.local.set({ enabled: nextEnabled });
  await updateAction(nextEnabled);
});
