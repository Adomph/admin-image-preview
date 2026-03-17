=== Admin Image Preview ===
Contributors: otisferu
Tags: image, preview, admin, acf, media-library
Requires at least: 5.0
Tested up to: 6.9
Requires PHP: 7.0
Stable tag: 1.0.0
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Displays a tooltip on image hover in the admin with full size preview and dimensions.

== Description ==

**Admin Image Preview** is a lightweight plugin that enhances your WordPress admin experience by displaying a helpful tooltip when hovering over image thumbnails.

The tooltip shows:

* **Full-size preview** - See the actual image at full resolution
* **Dimensions** - Width × height in pixels
* **File size** - In KB or MB
* **Filename** - Original file name

= Works with =

* ACF Gallery fields
* ACF Image fields
* Featured Images (Post Thumbnails)
* Media Library

= Features =

* Lightweight - No external dependencies, vanilla JavaScript
* Fast - Image info is cached to avoid repeated AJAX calls
* Smooth - Fade-in/out transitions
* Smart positioning - Tooltip stays within viewport

== Installation ==

1. Upload the `admin-image-preview` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. That's it! Hover over any image thumbnail in the admin to see the preview

== Frequently Asked Questions ==

= Does it work with Gutenberg? =

The plugin works with the classic editor, ACF fields, and the Media Library. Gutenberg block editor support is planned for a future release.

= Does it slow down the admin? =

No. The plugin only loads in the admin area and uses AJAX with caching to minimize server requests.

= Does it work with other page builders? =

It works anywhere that displays image thumbnails using standard WordPress markup, including ACF fields in page builders.

== Screenshots ==

1. Tooltip showing full-size preview with dimensions on an ACF Gallery image
2. Featured image preview in the post editor
3. Media Library image preview

== Changelog ==

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.0.0 =
Initial release of Admin Image Preview.
