<?php error_reporting(-1);
$icon = $_POST['icon'];
//$icon = str_replace('fa-', '', $icon);
$size = !empty($_POST['size']) ? $_POST['size'] : 16;
$color = !empty($_POST['color']) ? $_POST['color'] : "#000000";
if(file_exists("$icon-$size-$color.png")){
	echo "file exists";
	return "$icon.png";
}

var_dump(exec("./font-awesome-to-png.py --size $size --color '$color' --filename '$icon-$size-$color.png' $icon"));
die();?>