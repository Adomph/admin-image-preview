(function () {
	'use strict';

	var tooltip = null;
	var cache = {};
	var currentRequest = null;
	var hideTimeout = null;
	var currentImage = null;

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
			if (currentRequest.status === 200) {
				try {
					var response = JSON.parse(currentRequest.responseText);
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
		var target = e.target;
		var img = null;

		// If target is an IMG, use it directly
		if (target.tagName === 'IMG') {
			img = target;
		} else {
			// Otherwise, look for an IMG inside common containers
			var container = target.closest('.thumbnail') ||
			                target.closest('.attachment-preview') ||
			                target.closest('.acf-gallery-attachment') ||
			                target.closest('.acf-image-uploader') ||
			                target.closest('#postimagediv');
			if (container) {
				img = container.querySelector('img');
			}
		}

		if (!img) return;

		console.log('AIP: IMG found', img);

		// Prevent re-triggering if already showing for this image
		if (img === currentImage) return;
		currentImage = img;

		console.log('AIP: processing image');

		if (hideTimeout) {
			clearTimeout(hideTimeout);
			hideTimeout = null;
		}

		var attachmentId = getAttachmentId(img);
		console.log('AIP: attachmentId', attachmentId);

		if (!attachmentId) {
			console.log('AIP: no attachmentId, returning');
			return;
		}

		console.log('AIP: loading image info for', attachmentId);
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
	 * Handle mouseout event.
	 */
	function handleMouseOut(e) {
		var target = e.target;

		// Check if leaving a relevant container
		var container = target.closest('.thumbnail') ||
		                target.closest('.attachment-preview') ||
		                target.closest('.acf-gallery-attachment') ||
		                target.closest('.acf-image-uploader') ||
		                target.closest('#postimagediv');

		if (!container && target.tagName !== 'IMG') return;

		currentImage = null;
		hideTimeout = setTimeout(function () {
			hideTooltip();
		}, 100);
	}

	/**
	 * Initialize event listeners.
	 */
	function init() {
		document.addEventListener('mouseover', handleMouseOver);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseout', handleMouseOut);
	}

	// Wait for DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
