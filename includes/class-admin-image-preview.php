<?php
/**
 * Main plugin class.
 *
 * @package AdminImagePreview
 * @since   1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main plugin class.
 *
 * Handles the initialization and functionality of the Admin Image Preview plugin.
 *
 * @since 1.0.0
 */
class Admin_Image_Preview {

	/**
	 * Plugin version.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	const VERSION = '1.0.0';

	/**
	 * Single instance of the plugin.
	 *
	 * @since 1.0.0
	 * @var Admin_Image_Preview|null
	 */
	private static $instance = null;

	/**
	 * Plugin directory path.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	private $plugin_path;

	/**
	 * Plugin directory URL.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	private $plugin_url;

	/**
	 * Returns the single instance of the plugin.
	 *
	 * @since 1.0.0
	 *
	 * @param string $plugin_file Main plugin file path.
	 * @return Admin_Image_Preview The single instance.
	 */
	public static function get_instance( $plugin_file = '' ) {
		if ( null === self::$instance ) {
			self::$instance = new self( $plugin_file );
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * Initializes hooks for the plugin.
	 *
	 * @since 1.0.0
	 *
	 * @param string $plugin_file Main plugin file path.
	 */
	private function __construct( $plugin_file ) {
		$this->plugin_path = plugin_dir_path( $plugin_file );
		$this->plugin_url  = plugin_dir_url( $plugin_file );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'wp_ajax_aip_get_image_info', array( $this, 'ajax_get_image_info' ) );
	}

	/**
	 * Enqueue CSS and JavaScript assets in the admin area.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		wp_enqueue_style(
			'admin-image-preview',
			$this->plugin_url . 'assets/css/admin-image-preview.css',
			array(),
			self::VERSION
		);

		wp_enqueue_script(
			'admin-image-preview',
			$this->plugin_url . 'assets/js/admin-image-preview.js',
			array(),
			self::VERSION,
			true
		);

		wp_localize_script(
			'admin-image-preview',
			'aipData',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'aip_nonce' ),
				'i18n'    => array(
					'loading'    => __( 'Loading...', 'admin-image-preview' ),
					'dimensions' => __( 'Dimensions', 'admin-image-preview' ),
					'filesize'   => __( 'File size', 'admin-image-preview' ),
				),
			)
		);
	}

	/**
	 * Retrieve image information via AJAX.
	 *
	 * Returns the full-size URL, dimensions, file size, and filename
	 * for a given attachment ID.
	 *
	 * @since 1.0.0
	 *
	 * @return void Outputs JSON response.
	 */
	public function ajax_get_image_info() {
		check_ajax_referer( 'aip_nonce', 'nonce' );

		$attachment_id = isset( $_POST['attachment_id'] ) ? intval( $_POST['attachment_id'] ) : 0;

		if ( ! $attachment_id ) {
			wp_send_json_error( 'Invalid ID' );
		}

		$full_src  = wp_get_attachment_image_src( $attachment_id, 'full' );
		$file_path = get_attached_file( $attachment_id );
		$file_size = $file_path && file_exists( $file_path ) ? filesize( $file_path ) : 0;

		if ( ! $full_src ) {
			wp_send_json_error( 'Image not found' );
		}

		wp_send_json_success(
			array(
				'url'      => $full_src[0],
				'width'    => $full_src[1],
				'height'   => $full_src[2],
				'filesize' => $file_size ? size_format( $file_size ) : '',
				'filename' => basename( $full_src[0] ),
			)
		);
	}
}
