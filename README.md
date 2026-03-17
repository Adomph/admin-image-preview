# Admin Image Preview

A lightweight WordPress plugin that displays a tooltip with full-size image preview and dimensions when hovering over images in the admin area.

## Features

- **Full-size preview**: See the actual image at full resolution in a tooltip
- **Image dimensions**: Displays width × height in pixels
- **File size**: Shows the file size (KB, MB)
- **Filename**: Displays the original filename
- **Works with**:
  - ACF Gallery fields
  - ACF Image fields
  - Featured Images (Post Thumbnails)
  - Media Library
- **Lightweight**: No external dependencies, vanilla JavaScript
- **Cached requests**: Image info is cached to avoid repeated AJAX calls
- **Smooth animations**: Fade-in/out transitions

## Installation

1. Download the plugin
2. Upload the `admin-image-preview` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

Simply hover over any image thumbnail in:
- Post/Page editor (Featured Image)
- ACF Gallery fields
- ACF Image fields
- Media Library grid

A tooltip will appear showing:
- Full-size image preview (max 350px width)
- Filename
- Dimensions (width × height px)
- File size

## Screenshots

*Hover over an ACF Gallery image to see the full preview with dimensions.*

## Requirements

- WordPress 5.0+
- PHP 7.0+

## Changelog

### 1.0.0
- Initial release

## License

GPL v3 or later - https://www.gnu.org/licenses/gpl-3.0.html

## Author

**Otis** - [otis-feru.fr](https://www.otis-feru.fr)
