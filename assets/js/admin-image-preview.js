(function () {
	'use strict';

	var tooltip = null;
	var cache = {};
	var currentRequest = null;
	var hideTimeout = null;

	/**
	 * Create the tooltip element.
	 */
	function createTooltip() {
		if (tooltip) return tooltip;

		tooltip = document.createElement('div');
		tooltip.className = 'aip-tooltip';
		tooltip.innerHTML = '<div class="aip-tooltip__loading">' + aipData.i18n.loading + '</div>';
		document.body.appendChild(tooltip);

		return tooltip;
	}

	/**
	 * Get the attachment ID from an image element.
	 */
	function getAttachmentId(img) {
		// First: try to find data-id on closest li
		var closestLi = img.closest('li[data-id]');
		if (closestLi && closestLi.dataset.id) {
			return closestLi.dataset.id;
		}

		// Second: try to find data-id on any parent element
		var closestDataId = img.closest('[data-id]');
		if (closestDataId && closestDataId.dataset.id) {
			return closestDataId.dataset.id;
		}

		// ACF Image: hidden input with value
		var acfImageUploader = img.closest('.acf-image-uploader');
		if (acfImageUploader) {
			var input = acfImageUploader.querySelector('input[type="hidden"]');
			if (input && input.value) {
				return input.value;
			}
		}

		// Featured Image: look in the container
		var postImageDiv = img.closest('#postimagediv');
		if (postImageDiv) {
			var postThumbnailId = document.getElementById('_thumbnail_id');
			if (postThumbnailId && postThumbnailId.value) {
				return postThumbnailId.value;
			}
		}

		return null;
	}

	/**
	 * Position the tooltip near the mouse cursor.
	 */
	function positionTooltip(e) {
		if (!tooltip) return;

		var x = e.clientX + 15;
		var y = e.clientY + 15;
		var tooltipRect = tooltip.getBoundingClientRect();

		// Prevent overflow on the right
		if (x + tooltipRect.width > window.innerWidth - 10) {
			x = e.clientX - tooltipRect.width - 15;
		}

		// Prevent overflow at the bottom
		if (y + tooltipRect.height > window.innerHeight - 10) {
			y = e.clientY - tooltipRect.height - 15;
		}

		tooltip.style.left = x + 'px';
		tooltip.style.top = y + 'px';
	}

	/**
	 * Display the tooltip with image info.
	 */
	function showTooltip(data, e) {
		if (!tooltip) return;

		var html = '<img class="aip-tooltip__image" src="' + data.url + '" alt="">';
		html += '<div class="aip-tooltip__info">';
		html += '<div class="aip-tooltip__filename">' + data.filename + '</div>';
		html += '<div class="aip-tooltip__row">';
		html += '<span class="aip-tooltip__label">' + aipData.i18n.dimensions + '</span>';
		html += '<span class="aip-tooltip__value">' + data.width + ' × ' + data.height + ' px</span>';
		html += '</div>';
		if (data.filesize) {
			html += '<div class="aip-tooltip__row">';
			html += '<span class="aip-tooltip__label">' + aipData.i18n.filesize + '</span>';
			html += '<span class="aip-tooltip__value">' + data.filesize + '</span>';
			html += '</div>';
		}
		html += '</div>';

		tooltip.innerHTML = html;
		positionTooltip(e);
		tooltip.classList.add('aip-visible');
	}

	/**
	 * Hide the tooltip.
	 */
	function hideTooltip() {
		if (tooltip) {
			tooltip.classList.remove('aip-visible');
		}
		if (currentRequest) {
			currentRequest.abort();
			currentRequest = null;
		}
	}

	/**
	 * Load image info via AJAX.
	 */
	function loadImageInfo(attachmentId, e) {
		// Check cache
		if (cache[attachmentId]) {
			showTooltip(cache[attachmentId], e);
			return;
		}

		// Show loading state
		createTooltip();
		tooltip.innerHTML = '<div class="aip-tooltip__loading">' + aipData.i18n.loading + '</div>';
		positionTooltip(e);
		tooltip.classList.add('aip-visible');

		// AJAX request
		var formData = new FormData();
		formData.append('action', 'aip_get_image_info');
		formData.append('nonce', aipData.nonce);
		formData.append('attachment_id', attachmentId);

		currentRequest = new XMLHttpRequest();
		currentRequest.open('POST', aipData.ajaxUrl, true);

		currentRequest.onload = function () {
			if (this.status === 200) {
				try {
					var response = JSON.parse(this.responseText);
					if (response.success && response.data) {
						cache[attachmentId] = response.data;
						showTooltip(response.data, e);
					} else {
						hideTooltip();
					}
				} catch (err) {
					hideTooltip();
				}
			}
			currentRequest = null;
		};

		currentRequest.onerror = function () {
			hideTooltip();
			currentRequest = null;
		};

		currentRequest.send(formData);
	}

	/**
	 * Handle mouseover event.
	 */
	function handleMouseOver(e) {
		var img = e.target;

		// If not an IMG, try to find one inside (for Media Library)
		if (img.tagName !== 'IMG') {
			img = e.target.querySelector('img');
			if (!img) return;
		}

		if (hideTimeout) {
			clearTimeout(hideTimeout);
			hideTimeout = null;
		}

		var attachmentId = getAttachmentId(img);
		if (!attachmentId) return;

		createTooltip();
		loadImageInfo(attachmentId, e);
	}

	/**
	 * Handle mousemove event.
	 */
	function handleMouseMove(e) {
		if (tooltip && tooltip.classList.contains('aip-visible')) {
			positionTooltip(e);
		}
	}

	/**
	 * Handle mouseleave event.
	 */
	function handleMouseLeave(e) {
		hideTimeout = setTimeout(function () {
			hideTooltip();
		}, 100);
	}

	/**
	 * Initialize event listeners.
	 */
	function init() {
		document.body.addEventListener('mouseover', handleMouseOver);
		document.body.addEventListener('mousemove', handleMouseMove);
		document.body.addEventListener('mouseout', handleMouseLeave);
	}

	// Wait for DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
