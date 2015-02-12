<?php
session_start();

if(isset($_POST['html']))
	$_SESSION['html'] = $_POST['html'];
if(isset($_POST['template']))
	$_SESSION['template'] = $_POST['template'];

$html = $_SESSION['html'];
$template = $_SESSION['template'];

if(isset($template))
	$head = file_get_contents('templates/' . $template . '/html/head.html');
else
	$head = "<html><body>ERROR!!!";

$html = preg_replace('@</li>\s*(<li class="email-element[^>]*>|\s*$)@is', '', $html);
$html = preg_replace('@</li>\s*(<li style="display: list-item;" class="email-element[^>]*>|\s*$)@is', '', $html);
$html = preg_replace('@<li class="email-element[^>]*>@is', '', $html);
$html = preg_replace('@<li style="display: list-item;" class="email-element[^>]*>@is', '', $html);
$html = preg_replace('@contenteditable="true"@is', '', $html);

echo $head ?>
		<?php echo $html;?>
	</body>
</html>