const style = document.createElement("style");
style.textContent = `
.amazon-clear-enabled div.s-result-item.AdHolder,
.amazon-clear-enabled div.s-result-item:has(a[href*="/sspa/click"]),
.amazon-clear-enabled div.s-result-item:has(.puis-sponsored-label-text),
.amazon-clear-enabled div.s-result-item:has(a[href*="sponsored-ads.amazon.com"]),
.amazon-clear-enabled div.s-result-item:has([data-card-metrics-id*="sb-themed-collection"]),
.amazon-clear-enabled div.s-result-item:has(.sb-video-creative),
.amazon-clear-enabled div.s-result-item:has([data-card-metrics-id*="loom-desktop-inline-slot"]),
.amazon-clear-enabled div.s-result-item:has(a[href*="aax-us-east-retail-direct.amazon.com"]),
.amazon-clear-enabled div.s-result-item:has(video[aria-label*="Sponsored video"]),
.amazon-clear-hidden {
	display: none !important;
}

.amazon-clear-enabled #nav-logo-sprites .nav-logo-base,
.amazon-clear-enabled #nav-logo-sprites #logo-ext,
.amazon-clear-enabled #nav-logo-sprites .nav-logo-locale,
.amazon-clear-enabled #nav-tagline {
	display: none !important;
}

.amazon-clear-enabled #nav-logo-sprites {
	background: none !important;
	display: flex !important;
	align-items: center !important;
	text-decoration: none !important;
	height: 100% !important;
}

.amazon-clear-enabled #nav-logo-sprites::before {
	content: 'amazon';
	color: #ffffff;
	font-family: 'Amazon Ember', Arial, sans-serif;
	font-size: 18px;
	font-weight: 700;
	letter-spacing: -0.5px;
}

.amazon-clear-enabled #nav-logo-sprites::after {
	content: 'clear';
	color: #febd69;
	font-family: 'Amazon Ember', Arial, sans-serif;
	font-size: 18px;
	font-weight: 400;
	margin-left: 3px;
}
`;
document.documentElement.append(style);

const adSelectors = [
  "div.s-result-item.AdHolder",
  'div.s-result-item:has(a[href*="/sspa/click"])',
  "div.s-result-item:has(.puis-sponsored-label-text)",
  'div.s-result-item:has(a[href*="sponsored-ads.amazon.com"])',
  'div.s-result-item:has([data-card-metrics-id*="sb-themed-collection"])',
  "div.s-result-item:has(.sb-video-creative)",
  'div.s-result-item:has([data-card-metrics-id*="loom-desktop-inline-slot"])',
  'div.s-result-item:has(a[href*="aax-us-east-retail-direct.amazon.com"])',
  'div.s-result-item:has(video[aria-label*="Sponsored video"])',
].join(",");

function hideInlineAds() {
  const ads = document.querySelectorAll(adSelectors);
  ads.forEach((ad) => ad.classList.add("amazon-clear-hidden"));
}

function setEnabled(enabled) {
  document.documentElement.classList.toggle("amazon-clear-enabled", enabled);
  if (enabled) {
    hideInlineAds();
  }
}

chrome.storage.local.get({ enabled: true }).then(({ enabled }) => {
  setEnabled(enabled);
  if (enabled) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || !changes.enabled) {
    return;
  }

  setEnabled(changes.enabled.newValue);
  if (changes.enabled.newValue) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  } else {
    document.querySelectorAll(".amazon-clear-hidden").forEach((ad) => {
      ad.classList.remove("amazon-clear-hidden");
    });
    observer.disconnect();
  }
});

const observer = new MutationObserver(hideInlineAds);
