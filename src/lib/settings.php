<?php
/**
 * This files will support dynamic creation of the plugin settings for one time registration.
 */

add_action( 'admin_menu', 'dhis2_add_admin_menu' );
add_action( 'admin_init', 'dhis2_settings_init' );


function dhis2_add_admin_menu(  ) { 

	add_menu_page( 
        'DHIS2 Analytics', 
        'DHIS2 Analytics', 
        'manage_options', 
        'dhis2_analytics', 
        'dhis2_options_page' 
    );

}

function dhis2_settings_init(  ) { 

	register_setting( 
        'pluginPage', 
        'dhis2_settings' 
    );

	add_settings_section(
		'dhis2_pluginPage_section', 
		__( 'WP DHIS2 - Configure DHIS2', 'wp-dhis2' ), 
		'dhis2_settings_section_callback', 
		'pluginPage'
	);

	add_settings_field( 
		'dhis2_uri', 
		__( 'DHIS2 URI', 'wp-dhis2' ), 
		'dhis2_uri_render', 
		'pluginPage', 
		'dhis2_pluginPage_section' 
	);

	add_settings_field( 
		'dhis2_username', 
		__( 'DHIS2 Username', 'wp-dhis2' ), 
		'dhis2_username_render', 
		'pluginPage', 
		'dhis2_pluginPage_section' 
	);

	add_settings_field( 
		'dhis2_password', 
		__( 'DHIS2 Password', 'wp-dhis2' ), 
		'dhis2_password_render', 
		'pluginPage', 
		'dhis2_pluginPage_section' 
	);

	add_settings_field( 
		'dhis2_version', 
		__( 'DHIS2 Version', 'wp-dhis2' ), 
		'dhis2_version_render', 
		'pluginPage', 
		'dhis2_pluginPage_section' 
	);
}


function dhis2_uri_render(  ) { 

	$options = get_option( 'dhis2_settings' );
	?>
	<input type='text' name='dhis2_settings[dhis2_uri]' value='<?php echo $options['dhis2_uri']; ?>'>
	<?php

}


function dhis2_username_render(  ) { 

	$options = get_option( 'dhis2_settings' );
	?>
	<input type='text' name='dhis2_settings[dhis2_username]' value='<?php echo $options['dhis2_username']; ?>'>
	<?php

}


function dhis2_password_render(  ) { 

	$options = get_option( 'dhis2_settings' );
	?>
	<input type='password' name='dhis2_settings[dhis2_password]' value='<?php echo $options['dhis2_password']; ?>'>
	<?php

}

function dhis2_version_render(  ) { 

	$options = get_option( 'dhis2_settings' );
	$versions = array("","2.30+","2.29");

	echo "<select id='dhis2_version' name='dhis2_settings[dhis2_version]'>";
	foreach($versions as $version) {
		$selected = ($options['dhis2_version']==$version) ? 'selected="selected"' : '';
		$name = ($version == "") ? "--Select DHIS2 Version --" : $version;
		echo "<option value='$version' $selected>$name</option>";
	}
	echo "</select>";
}


function dhis2_settings_section_callback(  ) { 

	echo __( 'Please specify the details required to connect to a DHIS2 instance to pull dashboards', 'wp-dhis2' );

}


function dhis2_options_page(  ) { 

		?>
		<form action='options.php' method='post'>
			<?php
			settings_fields( 'pluginPage' );
			do_settings_sections( 'pluginPage' );
			submit_button();
			?>
		</form>
	<?php
}