<?php
include 'config.php';

if(isset($_POST['action'])){

	$action = $_POST['action'];
	$template = (isset($_POST['template']))? $_POST['template'] : NULL ;

	//Get template elements
	if( $action == 'get_elements' && isset($_POST['template']) ){
			//$solution = (isset($_POST['solution'])) ? $_POST['solution'] : 'html';
			$solution = 'html';
			$head = file_get_contents('templates/' . $template . '/' . $solution .'/head.html');
			$body_style = '';
			if(preg_match('@<body.*?style="([^"]+)"@is', $head,$matches))
				$body_style = $matches[1];
			$elements = file_get_contents('templates/'. $template . '/' . $solution .'/elements.html');
			echo json_encode(array('head'=>$head,'body_style'=>$body_style,'elements'=>$elements));
			die();
	}

	//Save progress
	if( $action == 'save' && isset($_POST['html']) && isset($_POST['template']) ){
		
		if(!$connection = mysql_connect($host, $username, $password))
		  die('Error connecting to db. '.mysql_error());

		if(!mysql_select_db($database))
		  die('Error selecting DB. '.mysql_error());

		$html = mysql_real_escape_string($_POST['html'],$connection);
		$template = $_POST['template'];
		$token = uniqid(rand(0,99));

		if(mysql_query("INSERT INTO saves (token,template,html) VALUES ('$token','$template','$html')",$connection))
			die($token);
		else
			die(NULL);
	}

	//Load progress
	if( $action == 'load' && isset($_POST['token']) && isset($_POST['template']) ){
		$token = $_POST['token'];
		$template = $_POST['template'];
		
		if(!$connection = mysql_connect($host, $username, $password))
		  die('Error connecting to db. '.mysql_error());

		if(!mysql_select_db($database))
		  die('Error selecting DB. '.mysql_error());

		$query = mysql_query("SELECT * FROM saves WHERE token = '$token'",$connection);
		$result = mysql_fetch_assoc($query);

		if(!empty($result['html'])){
			if($template !== $result['template']){
				$result['html'] = FALSE;
				$result['message'] = 'Wrong template. Your saved Token is from the <a href="?theme='.$result['template'].'">' . ucfirst($result['template']) . '</a> template.';
			}else
				$result['message'] = 'Layout Loaded Successfully.';
		}else{
			$result['message'] = 'No layout found with such token .';
		}

		die(json_encode($result));
	}

	if( $action == 'check'){
		if( isset($_POST['purchase_code']) && isset($_POST['template']) ){
			$purchase_code = $_POST['purchase_code'];
			$template = $_POST['template'];
			$config = json_decode(file_get_contents("templates/".$template."/config.json"));
			
			$valid = false;
			$custom = false;
		    if(!empty($config->purchase_codes) && in_array($purchase_code, $config->purchase_codes)){
		        $valid = true;
		        $custom = true;
		    }else{
		    	require 'Envato_marketplaces.php';
			    require 'config.php';

			    $e = new Envato_marketplaces();
			    $e->set_api_key($TF_config['api_key']);

			    $v = $e->verify_purchase($TF_config['username'],$purchase_code);
			    
			    
			    if(isset($v->item_name) && (strtolower($v->item_name) == strtolower($config->title) || trim(strtolower(preg_replace('@\s*-.*@is', '', $v->item_name))) == strtolower($template)))
			        $valid = true;
		    }
		    die(json_encode(array('valid'=>$valid,'custom'=>$custom)));
		}else{
			die(0);
		}

	}

}
