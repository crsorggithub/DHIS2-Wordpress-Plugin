<?php

/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package OSX
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

function remove_theme_jquery_scripts()
{
	//Add other Theme JQUERY for all Custom themes supported here
	wp_dequeue_script('jquery.min');
}
add_action('wp_print_scripts', 'remove_theme_jquery_scripts', 100);


function dhis2_analytics_assets()
{
	$settings = get_option('dhis2_settings');
	// Register block styles for both frontend + backend.
	wp_register_style(
		'dhis2_analytics-style-css', // Handle.
		plugins_url('dist/blocks.style.build.css', dirname(__FILE__)), // Block style CSS.
		array('wp-editor', 'wp-blocks'), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
	wp_enqueue_style('dhis2_analytics-style-css');
	// Register block styles for both frontend + backend.
	wp_register_style(
		'ext-plugin-gray-css', // Handle.
		plugins_url('src/assets/css/v216_ext-plugin-gray.css', dirname(__FILE__)), // Block style CSS.
		array('wp-editor', 'wp-blocks'), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
	wp_enqueue_style('ext-plugin-gray-css');

	// Register block editor styles for backend.
	wp_register_style(
		'dhis2_analytics-editor-css', // Handle.
		plugins_url('dist/blocks.editor.build.css', dirname(__FILE__)), // Block editor CSS.
		array('wp-edit-blocks'), // Dependency to include the CSS after it.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
		false
	);
	wp_enqueue_style('dhis2_analytics-editor-css');

	wp_deregister_script('jquery');
	wp_register_script(
		'jquery', // Handle.
		plugins_url('src/assets/js/jquery.js', dirname(__FILE__)), // JQuery.js: We register the block here.
		array('wp-blocks', 'wp-components', 'wp-element', 'wp-i18n', 'wp-editor'), // Dependencies, defined above.
		false,
		false // Load script in footer.
	);
	wp_enqueue_script('jquery');

	wp_register_script(
		'ext-all-js',
		plugins_url('src/assets/js/ext-all.js', dirname(__FILE__)),
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'jquery'), // Dependencies, defined above.
		null,
		false
	);
	wp_enqueue_script('ext-all-js');

	wp_register_script(
		'dhis2_analytics-js', // Handle.
		plugins_url('/dist/blocks.build.js', dirname(__FILE__)), // Block.build.js: We register the block here. Built with Webpack.
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'jquery', 'ext-all-js'), // Dependencies, defined above.
		false, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		false // Enqueue the script in the footer.
	);

	wp_enqueue_script('dhis2_analytics-js');

	wp_register_script(
		'openlayer-js',
		plugins_url('src/assets/js/openlayers/OpenLayers.js', dirname(__FILE__)),
		['jquery', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('openlayer-js');

	wp_register_script(
		'googlemaps-js',
		plugins_url('src/assets/js/new/googlemaps.js', dirname(__FILE__)),
		['jquery', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('googlemaps-js');

	wp_register_script(
		'plugin-tables-js',
		plugins_url('src/assets/js/new/reporttable.js', dirname(__FILE__)),
		['jquery', 'dhis2_analytics-js', 'ext-all-js', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('plugin-tables-js');

	wp_enqueue_script('plugin-maps-js');

	wp_register_script(
		'plugin-chart-js',
		plugins_url('src/assets/js/new/chart.js', dirname(__FILE__)),
		['jquery', 'ext-all-js', 'dhis2_analytics-js', 'wp-blocks'],
		null,
		false
	);

	wp_enqueue_script('plugin-chart-js');

	wp_register_script(
		'bxslider-js',
		plugins_url('src/assets/bxslider/jquery.bxslider.min.js', dirname(__FILE__)),
		['jquery', 'wp-blocks', 'wp-editor', 'ext-all-js'],
		true,
		false
	);
	wp_enqueue_script('bxslider-js');

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `osxGlobal` object.

	wp_localize_script(
		'dhis2_analytics-js',
		'osxGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path(__DIR__),
			'pluginDirUrl'  => plugin_dir_url(__DIR__),
			'dhis2setting' => $settings,
			// Add more data here that you want to access from `osxGlobal` object.
		]
	);
	// WP Localozed DHIS2 Settings to JS via dhis2
	wp_localize_script('dhis2-analytics-js', 'dhis2', array(
		'settings' => $settings,
	));

	register_block_type(
		'osx/dhis-block',
		array(
			'attributes'=>array(
				'dhis_info'=>array(
					'type'=>'string',
				),
			),
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'dhis2_analytics-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'dhis2_analytics-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'dhis2_analytics-editor-css',
		)
	);
}

add_action('wp_enqueue_scripts', 'dhis2_analytics_assets');
add_action('admin_enqueue_scripts', 'dhis2_analytics_assets');

add_action('plugins_loaded', 'dhis2_analytics_translation');
function dhis2_analytics_translation()
{
	load_plugin_textdomain('dhis-analytics', false, dirname(plugin_basename(__FILE__)) . '/src/js/new/i18n/i18n_module_en.properties');
}


// Front end Assets ONLY
function dhis2_analytics_style()
{
	// echo($attributes['dhis_info']);
	wp_enqueue_style(
		'dhis2_analytics-material-ui-icons-css',
		'//fonts.googleapis.com/icon?family=Material+Icons',
		false
	);

	wp_enqueue_style(
		'dhis2_analytics-frontend-css',
		plugins_url('src/assets/css/frontend/dhis2-analytics.css', dirname(__FILE__)),
		false
	);

	wp_enqueue_style(
		'bxslider-css',
		plugins_url('src/assets/bxslider/jquery.bxslider.min.css', dirname(__FILE__)),
		false
	);

	wp_enqueue_style(
		'tailwind-css',
		plugins_url('src/assets/css/frontend/tailwind.min.css', dirname(__FILE__)),
		false
	);

	wp_enqueue_style(
		'dhis_analytics_slick-css',
		plugins_url('src/assets/slick/slick.css', dirname(__FILE__)),
		false
	);

	wp_enqueue_style(
		'dhis_analytics_slick-theme-css',
		plugins_url('src/assets/slick/slick-theme.css', dirname(__FILE__)),
		false
	);
}

function dhis2_analytics_script()
{
	$options = get_option('dhis2_settings');
	$version = $options['dhis2_version'];

	if($version == "2.29"){
		wp_enqueue_script(
			'plugin-maps-229-js',
			plugins_url('src/assets/js/new/map29.js', dirname(__FILE__)),
			['jquery', 'openlayer-js', 'dhis2_analytics-js', 'ext-all-js', 'wp-blocks'],
			null,
			false
		);
	}else{ //2.29
		wp_enqueue_script(
			'plugin-maps-js',
			plugins_url('src/assets/js/new/map-plugin-32.0.32.js', dirname(__FILE__)),
			['jquery', 'openlayer-js', 'dhis2_analytics-js', 'ext-all-js', 'wp-blocks'],
			null,
			false
		);
	}

	wp_enqueue_script(
		'dhis2_analytics-frontend-js',
		plugins_url('src/assets/js/frontend/dhis2-analytics.js', dirname(__FILE__)),
		['jquery'],
		false
	);
	wp_enqueue_script(
		'dhis2_analytics-printthis-js',
		plugins_url('src/assets/js/frontend/printThis.js', dirname(__FILE__)),
		['jquery'],
		false
	);

	wp_enqueue_script(
		'dhis2_analytics-showdown-js',
		plugins_url('src/assets/js/frontend/showdown.min.js', dirname(__FILE__)),
		['jquery'],
		false
	);

	wp_enqueue_script(
		'dhis2_analytics-slick-js',
		plugins_url('src/assets/slick/slick.min.js', dirname(__FILE__)),
		['jquery'],
		false
	);
}
add_action('wp_enqueue_scripts', 'dhis2_analytics_style');
add_action('wp_enqueue_scripts', 'dhis2_analytics_script');

//Creates DYnamic Blocks
add_action('plugins_loaded', 'register_dynamic_block');
function register_dynamic_block()
{
	// Only load if Gutenberg is available.
	if (!function_exists('register_block_type')) {
		return;
	}
	// Hook server side rendering into render callback
	// Make sure name matches registerBlockType in ./index.js
	register_block_type('osx/dhis2-analytics', array(
		'attributes' => array(
			'displaySize' => array(
				'type' => 'string',
				'default' => 'fullwidth',
			),
			'displayMode' => array(
				'type' => 'string',
				'default' => 'slideshow',
			),
			'displayItem' => array(
				'type' => 'string',
				'default' => 'single',
			),
			'itemsPerRow' => array(
				'type' => 'string',
				'default' => '2',
			),
			'enableCaption' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'shuffleItems' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'slideshowSettings' => array(
				'type' => 'object',
				'default' => array(),
			)
		),
		'render_callback' => 'render_dynamic_block'
	));
}

function displayTable($objects, $details)
{
	$elements = json_encode($objects);
?>
	<script>
		var dhis2 = <?php echo $details; ?>;
		var rt_objects = <?php echo $elements; ?>;
		reportTablePlugin.url = dhis2.dhis2_uri;
		reportTablePlugin.username = dhis2.dhis2_username;
		reportTablePlugin.password = dhis2.dhis2_password;
		reportTablePlugin.loadingIndicator = true;
		reportTablePlugin.load(rt_objects);
	</script>
<?php
}

function displayMap($map_analysis, $details)
{
	$map_elements = json_encode($map_analysis);
?>
	<script>
		var dhis2 = <?php echo $details; ?>;
		var mp_objects = <?php echo $map_elements; ?>;
		mapPlugin.url = dhis2.dhis2_uri;
		mapPlugin.username = dhis2.dhis2_username;
		mapPlugin.password = dhis2.dhis2_password;
		// mapPlugin.loadingIndicator = true;
		mapPlugin.load(mp_objects);
	</script>
<?php
};


function displayChart($chart_analysis, $details)
{
	$elements = json_encode($chart_analysis);
?>
	<script>
		var dhis2 = <?php echo $details; ?>;
		var ct_objects = <?php echo $elements; ?>;
		// var ct_objects = JSON.parse(chart_objects);
		chartPlugin.url = dhis2.dhis2_uri;
		chartPlugin.username = dhis2.dhis2_username;
		chartPlugin.password = dhis2.dhis2_password;
		chartPlugin.loadingIndicator = true;
		chartPlugin.load(ct_objects);
	</script>
<?php
};

function displaySingleResources($resources_analysis, $details)
{
	$resource_elements = json_encode($resources_analysis);
?>
	<script>
		$(document).ready(function() {
			// alert("Loading Single resource");
			var dhis2 = <?php echo $details; ?>;
			var rs_objects = <?php echo $resource_elements; ?>;
			//  = json_encode($rs_objects[0]['el']);

			rs_objects.forEach(function(rs_object) {
				var node = document.createElement("li");
				var link = document.createElement("a");
				var block_div = rs_object['el'];
				// alert(block_div);
				var resource_list = document.getElementById(block_div);
				var url = dhis2.dhis2_uri + "/api/documents/" + rs_object['id'] + "/data";
				var name = rs_object['displayName'];
				link.innerText = name;
				link.setAttribute('href', url);
				node.setAttribute('class',"list-none list-outside p-1 border-b border-gray-300 w-full hover:bg-gray-200  text-md align-middle");
				node.appendChild(link);
				resource_list.appendChild(node);
			});
		});
	</script>
<?php
}


function displayResources($resources_analysis, $details)
{
	$resource_elements = json_encode($resources_analysis);
?>
	<script>
		$(document).ready(function() {
			var dhis2 = <?php echo $details; ?>;
			var rs_objects = <?php echo $resource_elements; ?>;
			
			// alert(JSON.stringify(rs_objects));
			rs_objects.forEach(function(rs_object) {
				var node = document.createElement("li");
				var link = document.createElement("a");
				var block = rs_object['resource_block'];
				var resource_list = document.getElementById(block);
				var url = dhis2.dhis2_uri + "/api/documents/" + rs_object['id'] + "/data";
				var name = rs_object['displayName'];
				link.innerText = name;
				link.setAttribute('href', url);
				node.setAttribute('class',"list-none list-outside p-1 border border-black-100 w-full hover:bg-gray-200");
				node.appendChild(link);
				resource_list.appendChild(node);
			});
		});
	</script>
<?php
}

function displayText($text)
{
	$description = json_encode($text[0]['text']);
	$el = json_encode($text[0]['el']);
?>
	<script>
		$(document).ready(function() {
			var text = <?php echo $description; ?>;
			var converter = new showdown.Converter();
			var id = <?php echo $el; ?>;
			var textDescription = converter.makeHtml(text);
			document.getElementById(id).innerHTML = textDescription;
		});
	</script>
<?php
}

function gen_uuid()
{
	return sprintf(
		'%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
		// 32 bits for "time_low"
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff),

		// 16 bits for "time_mid"
		mt_rand(0, 0xffff),

		// 16 bits for "time_hi_and_version",
		// four most significant bits holds version number 4
		mt_rand(0, 0x0fff) | 0x4000,

		// 16 bits, 8 bits for "clk_seq_hi_res",
		// 8 bits for "clk_seq_low",
		// two most significant bits holds zero and one for variant DCE1.1
		mt_rand(0, 0x3fff) | 0x8000,

		// 48 bits for "node"
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff)
	);
}

function render_dynamic_block($attributes)
{
	ob_start();
	// print_r($attributes);

	$dashboard_items = $attributes['dashboard_items'];
	$settings = get_option('dhis2_settings');
	$details = json_encode($settings);
	$base = $settings['dhis2_uri'];
	$reporttable_analysis = array();
	$chart_analysis = array();
	$map_analysis = array();
	$resources_analysis = array();
	$text_analysis = array();
	$rt_ids = array();
	$map_ids = array();
	$chart_ids = array();
	$resources_ids = array();
	$text_ids = array();
	$resource_blocks = array();
	$group_resources = true; //TODO: to change to dynamic setting

	if (is_array($dashboard_items) && !empty($dashboard_items)) {
		// print_r($dashboard_items);
		$icon = "help";
		$resource_block_id = gen_uuid();
		foreach ($dashboard_items as $dashboard_item) {
			
			$type = $dashboard_item['type'];
			// echo $dashboard_item['displayName'];
			$uuid = gen_uuid();
			
			switch ($type) {
				case "REPORT_TABLE":
					// print_r($dashboard_item);
					$rt_id = $dashboard_item['reportTable']['id'];
					$rt_name = $dashboard_item['reportTable']['displayName'];
					$rt_element = array("el" => "reportTable_" . $uuid, "id" => $rt_id, "displayName"=>$rt_name);
					array_push($reporttable_analysis, $rt_element);
					$icon = "border_all";
					$table = array("id"=>"reportTable_" . $uuid, "displayName"=>$rt_name, "icon"=>$icon);

					if (!in_array($table, $rt_ids)) {
						array_push($rt_ids, $table);
					}
					break;
				case 'MAP':
					$map_id = $dashboard_item['map']['id'];
					$mp_name = $dashboard_item['map']['displayName'];
					$map_element = array("url" => $base, "el" => "map_" . $uuid, "id" => $map_id, "displayName"=>$mp_name);
					array_push($map_analysis, $map_element);
					$icon = "map";

					$map = array("id"=>"map_" . $uuid, "displayName"=>$mp_name, "icon"=>$icon);
					if (!in_array($map, $map_ids)) {
						array_push($map_ids, $map);
					}
					break;
				case 'CHART':
					$chart_id = $dashboard_item['chart']['id'];
					$ct_name = $dashboard_item['chart']['displayName'];
					$ct_element = array("el" => "chart_" . $uuid, "id" => $chart_id, "displayName"=>$ct_name);
					array_push($chart_analysis, $ct_element);
					$icon = "bar_chart";

					$chart = array("id"=>"chart_" . $uuid, "displayName"=>$ct_name, "icon"=>$icon);

					if (!in_array($chart, $chart_ids)) {
						array_push($chart_ids, $chart);
					}
					break;
				case 'RESOURCES':
					$resource_id = $dashboard_item['resources']['id'];
					$rs_name = $dashboard_item['resources']['displayName'];
					$rs_element = array("el" => "resources_" . $uuid, "id" => $resource_id, "displayName"=>$rs_name, "resource_block"=>$resource_block_id);
					array_push($resources_analysis, $rs_element);
					$icon = "link";
					if(!in_array($resource_block_id, $resource_blocks)){
						array_push($resource_blocks, $resource_block_id);
					}
					
					$resource = array("id"=>"resources_" . $uuid, "displayName"=>$rs_name, "icon"=>$icon, "resource_block"=>$resource_block_id);

					if (!in_array($resource, $resources_ids)) {
						array_push($resources_ids, $resource);
					}
					break;
				case 'TEXT':
					$text_id = $dashboard_item['text']['id'];
					$tx_element = array("el" => "text_" . $uuid, "id" => $text_id, "text" => $dashboard_item['text']['text'], 'text-class' => true);
					array_push($text_analysis, $tx_element);
					$icon = "notes";
					$txtName = $dashboard_item['text']['text'];

					$text = array("id"=>"text_" . $uuid, "displayName"=>"", "icon"=>$icon);

					if (!in_array($text, $text_ids)) {
						array_push($text_ids, $text);
					}
					break;
				default:
					echo "DHIS2 Analytics Object not supported";
					break;
			}
		}
	}
	$print = false;

	if (!empty($reporttable_analysis)) {
		displayTable($reporttable_analysis, $details);
	}
	if (!empty($map_analysis)) {
		displayMap($map_analysis, $details);
	}
	if (!empty($chart_analysis)) {
		displayChart($chart_analysis, $details);
	}

	// echo $group_resources;
	// if (!empty($resources_analysis) && $group_resources) {
	// 	displayResources($resources_analysis, $details);
	// }else{
	// 	displaySingleResources($resources_analysis, $details);
	// }

	if (!empty($text_analysis)) {
		displayText($text_analysis);
	}

	// print_r($resources_analysis);
	$all_ids = array_merge($rt_ids, $map_ids, $chart_ids, $text_ids, $resources_ids);
	// print_r($resources_analysis);
	if(!empty($resources_analysis)){
		// echo "YES YES YES";
		if($group_resources){
			$all_ids = array_merge($rt_ids, $map_ids, $chart_ids, $text_ids);
			displayResources($resources_analysis, $details);
		}else{
			displaySingleResources($resources_analysis, $details);
		}
	}
	
	$displayItems = $attributes['displayItem'];
	$displayMode = $attributes['displayMode'];
	$displaySize = $attributes['displaySize'];
	$enableCaption = $attributes['enableCaption'];
	$itemsPerRow = 'w-1/' . $attributes['itemsPerRow'];
	// $grid_columns = 'grid-cols-'.$attributes['itemsPerRow'].' gap-3';
	$grid = 'dhis2-slide';
	$height = '350px';
	$width = '100%';
	$text = 'text-description';
	$showWidth = true;
	$itemName = "";

	$height = isset($attributes['displayHeight']) ? $attributes['displayHeight'] : $height;
	$height_width_style = 'height:' . $height . ';';

	if (($displaySize == 'custom' && $displayMode != 'slideshow')) {
		$width = isset($attributes['displayWidth']) ? $attributes['displayWidth'] : $width;
		$height_width_style = 'width:' . $width . '; height:' . $height . ';';
	};

	//Slideshow Custom sizes
	// if($displaySize == 'custom' && $displayMode == 'slideshow'){
	// 	$height = isset($attributes['displayHeight']) ? $attributes['displayHeight'] : $height;
	// 	// $width = "100%";
	// }
	// echo $width;
	$slideshowSettings = json_encode($attributes['slideshowSettings']);

	if ($displayMode == 'grid') {
		$print = true;
		$displayMode = 'grid w-full bg-gray-100 p-2';
		$grid = $itemsPerRow;
	}
	// echo $displayMode;
?>
	<!-- style="width: 100%; max-width: 100%; height: 100%; min-height: 100%;" -->

	<div class="flex flex-wrap overflow-hidden bg-gray-200 <?php echo $displayMode; ?>" style="width: 100%; max-width: 100%; height: 100%; min-height: 100%;">
		<?php 
			if($attributes['shuffleItems']){
				shuffle($all_ids);
			}
	
			if (!empty($all_ids)) {
				foreach ($all_ids as $content) {
					// print_r($content);
					$id = $content['id'];
					$itemName = $content['displayName'];
					$ico = $content['icon'];
					// echo $itemName;
	
					$text = explode("_", $id)[0];
					if (strcmp($text, 'text') == 0) {
						$grid = $grid . " text-class";
						$height = "100%";
					}
	
					if (strcmp($text, 'resources') == 0) {
						$grid = $grid . " resource-class";
						$height = "100%";
					}

					// echo $height;
					?>
						<div class="<?php echo $grid;?> m-0.5 bg-gray-100 border border-blue-100 border-solid flex flex-wrap overflow-hidden" title=<?php echo $id; ?>>
							<div id=<?php echo $id; ?> class="relative overflow-auto z-0 m-1 flex-1" style="<?php echo $height_width_style; ?>"></div>
							<?php
								if($attributes['enableCaption']){
								?>
								<div class="bg-gray-800 w-full inset-x-0 opacity-75 z-10 -mt-4 h-auto p-1 z-10">
									<i class="material-icons text-gray-100 pmd-md float-left font-size: text-base font-hairline align-middle mb-2 "><?php echo $ico; ?></i>
									<p id="caption-<?php echo $id; ?>" class="text-gray-100 text-xs font-sans leading-tight w-full font-hairline align-middle"><?php echo $itemName; ?></p>
								</div>	
								<?php
								}
							?>
						</div>
					<?php
				}
				if(!empty($resources_analysis) && ($group_resources)){
					$ico = "link";
					foreach($resource_blocks as $resource_block){
						?>
						<div style="overflow:auto;" class="<?php echo $grid; ?> flex-none bg-gray-100 w-full pb-1 border-all border-gray-200">
							<?php
								if($attributes['enableCaption']){
								?>
									<div class="flex-1 bg-gray-800 w-full opacity-75 pb-1 h-auto align-middle">
										<i class="material-icons text-gray-100 pmd-md float-left font-size: text-base"><?php echo $ico; ?></i>
										<p id="caption-<?php echo $id; ?>" class="mb-0 text-gray-100 text-xs font-sans leading-tight w-full mt-1 font-hairline">Resources</p>
									</div>
								<?php
								}
							?>
							<ul class="flex flex-wrap w-full p-0" id="<?php echo $resource_block; ?>" style="padding:0px; overflow: auto">
		
							</ul>
						</div>
					<?php
					}
				}
			}
		?>
	</div>
<?php
	$theme = "slick"; //TODO: Make it configured from UI
	if (strcmp($displayMode, 'slideshow') == 0) {
		?>
		<script type="text/javascript">
			$(document).ready(function(){
				var slideshowsettings = <?php echo $slideshowSettings; ?>;
				var speed = slideshowsettings['pause'];
				var thespeed = 10000;
				if((typeof speed === 'undefined') || speed < 10000){
					thespeed = 10000;
				}else{
					thespeed = speed;
				}
				$('.slideshow').slick({
					adaptiveHeight: true,
					dots: false,
					pauseOnHover: true,
					slidesToScroll: 1,
					autoplay: true,
					autoplaySpeed: thespeed,
					infinite: true,
					arrows: true,
					swipeToSlide: true,
					prevArrow: '<button type="button" class="slick-prev">Previous</button>',
					nextArrow: '<button type="button" class="slick-next">Next</button>'
				});
			});
		</script>
	<?php
	}

	$output = ob_get_contents(); // collect output
	ob_end_clean(); // Turn off ouput buffer
	return $output; // Print output
}

include __DIR__ . '/lib/settings.php';
//Amin Settings
register_activation_hook(__FILE__, 'get_dhis2_settings');
