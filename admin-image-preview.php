<?php
/**
 * Admin Image Preview
 *
 * @package           AdminImagePreview
 * @author            Otis
 * @copyright         2026 Otis
 * @license           GPL-3.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Admin Image Preview
 * Plugin URI:        https://github.com/Adomph/admin-image-preview
 * Description:       Displays a tooltip on image hover in the admin with full size preview and dimensions.
 * Version:           1.0.0
 * Requires at least: 5.0
 * Requires PHP:      7.0
 * Author:            Otis
 * Author URI:        https://www.otis-feru.fr
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       admin-image-preview
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Include the main plugin class.
require_once plugin_dir_path( __FILE__ ) . 'includes/class-admin-image-preview.php';

// Initialize the plugin.
Admin_Image_Preview::get_instance( __FILE__ );
