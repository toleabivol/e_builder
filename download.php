<?php
session_start();
$html = $_POST['html'];
$template = $_POST['template'];
$solution = $_POST['solution'];

$config = json_decode(file_get_contents("templates/".$_POST['template']."/config.json"));
$filename = explode(' ',trim($config->title));
date_default_timezone_set('UTC');
$filename = $filename[0] . "_by_SnoopyIndustries_" . $solution . "_" . date('j-n-Y') . ".html";

$html = preg_replace('@</li>\s*(<li class="email-element[^>]*>|\s*$)@is', '', $html);
$html = preg_replace('@</li>\s*(<li style="display: list-item;" class="email-element[^>]*>|\s*$)@is', '', $html);
$html = preg_replace('@</li>\s*(<li style="max-width:[^;]+;" class="email-element[^>]*>|\s*$)@is', '', $html);

$html = preg_replace('@<li class="email-element[^>]*>@is', '', $html);
$html = preg_replace('@<li style="display: list-item;" class="email-element[^>]*>@is', '', $html);
$html = preg_replace('@<li style="max-width:[^;]+;" class="email-element[^>]*>@is', '', $html);
$html = preg_replace('@url\(\&quot;([^\&]+)\&quot;\)@is', 'url($1)', $html);


//url(&quot;http://labs.am-themes.com/Email_Builder/templates/marco/img/bg.jpg&quot;)

$html = preg_replace('@contenteditable="true"@is', '', $html);
$html = preg_replace('@title="Right Click to edit"@is', '', $html);

//Solutions=======================
if( $solution == 'mailchimp' ){
	$html = preg_replace_callback(
		'@<img@is', 
		create_function('$m','
	        static $id = 0;
	        $id++;
			return "<img mc:edit=\'img-$id\'";')
		, 
		$html);
	$html = preg_replace_callback(
		'@data-editable[^\s]*@is', 
		create_function('$m','
	        static $text_id = 0;
	        $text_id++;
			return "mc:edit=\'text-$text_id\'";')
		, 
		$html);
	$html = preg_replace('@mc:repeatable=""@is', 'mc:repeatable', $html);
	$html = preg_replace('@<a id="viewonline".*?href="#"@is', '<a id="viewonline" href="*|ARCHIVE|*"', $html);
	$html = preg_replace('@<a id="unsubscribe".*?href="#"@is', '<a id="unsubscribe" href="*|UNSUB|*"', $html);
	
}elseif ( $solution == 'campaign' ) {
	$html = preg_replace('@<img@is', '<img editable="true"', $html);
	$html = preg_replace('@<a id="viewonline".*?href="#"(.*?)>(.*?)</a>@is', '<webversion $1>$2</webversion>', $html);
	$html = preg_replace('@<a id="unsubscribe".*?href="#"(.*?)>(.*?)</a>@is', '<unsubscribe $1>$2</unsubscribe>', $html);
	$html = preg_replace('@<unsubscribe (.*?)>(.*?)</unsubscribe>\s*</multiline>@is', '</multiline><unsubscribe $1>$2</unsubscribe>', $html);
}
//Solutions END============================

$head = file_get_contents('templates/' . $template . '/html/head.html');

//headers
header ("Content-Type: text/html");
header ("Content-disposition: attachment; filename=".$filename);?>

<?php echo $head ?>
		<?php echo $html;?>
	</body>
</html>