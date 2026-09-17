function removeInlineAds() {
	const adSelectors = [
		// Standard inline product grid ads
		'div.s-result-item.AdHolder',
		'div.s-result-item:has(a[href*="/sspa/click"])',
		'div.s-result-item:has(.puis-sponsored-label-text)',

		// Banner carousels
		'div.s-result-item:has(a[href*="sponsored-ads.amazon.com"])',
		'div.s-result-item:has([data-card-metrics-id*="sb-themed-collection"])',

		// Video ad collections
		'div.s-result-item:has(.sb-video-creative)',
		'div.s-result-item:has([data-card-metrics-id*="loom-desktop-inline-slot"])',
		'div.s-result-item:has(a[href*="aax-us-east-retail-direct.amazon.com"])',
		'div.s-result-item:has(video[aria-label*="Sponsored video"])',
	];

	const ads = document.querySelectorAll(adSelectors.join(','));
	ads.forEach((ad) => ad.remove());
}

// Initial pass
removeInlineAds();

// Watch for dynamically lazy-loaded ads
const observer = new MutationObserver(removeInlineAds);
observer.observe(document.documentElement, { childList: true, subtree: true });
