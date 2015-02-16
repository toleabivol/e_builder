<?php
	if(isset($_GET['theme']))
		$template = $_GET['theme'];
	else
		$template = 'marco';
	$elements = file_get_contents('templates/' . $template . '/html/elements.html');
	$head = file_get_contents('templates/' . $template . '/html/head.html');
	if(file_exists('templates/' . $template . '/html/footer.html')){
		$footer = file_get_contents('templates/' . $template . '/html/footer.html');
	}
	$config = json_decode(file_get_contents('templates/' . $template . '/config.json'));
	if(preg_match('@<body.*?style="([^"]+)"@is', $head,$matches))
		$body_style = $matches[1];
	$hedear_bg_color = !empty($config->header_color) ? " style='background-color:$config->header_color'" : '';
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset='UTF-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1.0'>
		<link rel='stylesheet' type='text/css' href='http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.0/normalize.min.css'>
		<link rel='stylesheet' type='text/css' href='css/iris.min.css'>
		<link rel="stylesheet" type='text/css' href="css/tinyeditor.css">
		<link rel="stylesheet" type='text/css' href="css/materialPreloader.min.css">
		<link rel='stylesheet' type='text/css' href='css/style.css'>
		<title>SnoopyIndustries Email Builder</title>
		<!-- fonts used for mails -->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400,700,800,300italic' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300' rel='stylesheet' type='text/css'>

		<link href='http://fonts.googleapis.com/css?family=Jura:400,600,500' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
		<!-- ends fonts used for mails -->

		<script type="text/javascript">
			var template ='<?php echo isset($template) ? $template : "false" ?>';
			var def_layout = <?php echo !empty( $config->def_layout ) ? "'{$config->def_layout}'" : "false"?>;
			var responsive_tablet = <?php echo !empty( $config->responsive_tablet ) ? "'{$config->responsive_tablet}'" : "false"?>;
			var boxed_width = '<?php echo !empty( $config->boxed_width ) ? "{$config->boxed_width}" : "600px"?>';
			var template_v = '<?php echo !empty($_GET['v']) ? $_GET['v'] : '0' ?>'
		</script>
		<?php if(!empty( $config->boxed_width  )) : 
		$boxed_width = (int)$config->boxed_width === 600 ? '615px' : $config->boxed_width;
		?>
			<style>
				.boxed-view-mode main > iframe{
					width: <?php echo $config->boxed_width ?>
				}
			</style>
		<?php endif; ?>
	</head>
	<body>
		<div id="mask"></div>
		<div id="fakeLoader"></div>
		<div class='left-nav-container open-left-menu'>
			<a href='#' class='trigger-menu'></a>
			<header class='left-nav-fixed'>
				<h1 class='logo-wrap'>
					<a href='#'>
						<img src='img/logo.png' alt='Am builder'/>
					</a>
				</h1>
				<nav>
					<ul id='accordion-menu'>
						<li class='options-list upper-items'>
							<a href='#'>Save / Load</a>
							<ul class='block-list'>
								<li>
									<p class="token-save"></p>
									<a href='#' class="save-button">Save</a>
								</li>
								<li>
									<a href='#' class="load-button">Load</a>
									<p class="token-load"></p>
									<input class="token-to-load" type="text" placeholder="#Saved Token">
								</li>
							</ul>
						</li>
						<li class='style-list upper-items'>
							<a href='#'>Style</a>
							<ul>
								<li>
									<a href="#">Background Image</a>
									<div class="menu-input">
										<input type='text' class='menu-input-input bg-image-input' placeholder="http://yourdomain.com/image.jpg">
									</div>
								</li>
								<li>
									<a href='#'>Colors</a>
									<?php foreach ($config->colorpickers as $name => $colorpicker) : 
										$def_color = array_pop($colorpicker);
									?>
										<div class='menu-input'>
											<p class='menu-input-text'><?php echo $name ?></p>
											<input type='text' class='menu-input-input color-picker-input' data-selector='<?php echo json_encode($colorpicker) ?>' value="<?php echo $def_color ?>">
										</div>
									<?php endforeach; ?>
								</li>
								<li>
									<a href='#'>Elements</a>
									<?php if(!empty($config->sliders))
										foreach ($config->sliders as $name => $slider) : ?>
											<div class='menu-input'>
												<p class='menu-input-text'><?php echo $name ?></p>
												<form>
											        <input name='rad_<?php echo $name?>' type='range' class='range-slider' min='<?php echo $slider[3] ?>' max='<?php echo $slider[4] ?>' value='<?php echo $slider[5] ?>' step='<?php echo $slider[6] ?>' data-selector="<?php echo $slider[0] ?>" data-properties="<?php echo $slider[1] ?>" data-unit="<?php echo $slider[2] ?>"<?php if(!empty($slider[7])) echo ' data-important="true"'?>>
													<div><output name='rad_val' for='rad' class='range-output'><?php echo $slider[5] ?></output><span><?php echo $slider[2] ?></span></div>
											    </form>
										    </div>
										<?php endforeach; ?>
								</li>							
							</ul>
						</li>
						<li class='export-list upper-items'>
							<a href='#' class="active">Download Layout</a>
							<ul class='block-list'>
								<li class="export-html">
									<a href='#' class="export" data-solution="html">HTML</a>
									<p class="download-input">
										<input type="text" class="purchase-code" placeholder="Purchase Code">
										<button href="#" class="download">Download</button>
									</p>
								</li>
								<li class="export-mailchimp">
									<a href='#' class="export" data-solution="mailchimp">Mail Chimp</a>
									<p class="download-input">
										<input type="text" class="purchase-code" placeholder="Purchase Code">
										<button href="#" class="download">Download</button>
									</p>
								</li>
								<li class="export-campaign">
									<a href='#' class="export" data-solution="campaign">Campaign Monitor</a>
									<p class="download-input">
										<input type="text" class="purchase-code" placeholder="Purchase Code">
										<button href="#" class="download">Download</button>
									</p>
								</li>
							</ul>
						</li>
					</ul>
					<?php if(empty($config->no_layout_opt)) : ?>
						<div class='size-buttons'>
							<a href='#' class="full-layout">Fullwidth</a>
							<a href='#' class="boxed-layout">Boxed</a>
						</div>
					<?php endif; ?>
					<footer>
						<a href='<?php echo $config->link ?>' target="_blank">Purchase</a>
						<a href='http://themeforest.net/downloads' target="_blank" class="rate-button">Rate <span><b></b><b></b><b></b><b></b><b></b></span></a><br/>
						<a href='http://youtu.be/-jaBpG8Helw' target="_blank">Video Tutorial</a>
					</footer>
				</nav>
			</header>
		</div>
		<main>
			<header class='top-nav-bar full-width white item'>
				<div class='view-controls'>
					<a href='#' class='edit-mode active'>Edit Mode</a>
					<a href='#' class='preview-mode'>Preview Mode</a>
				</div>
				<div class='device-controls'>
					<?php if(!empty( $config->responsive_tablet )) : ?>
						<a class="responsive-switch mobile" data-device="mobile" href="#"></a>
						<a class="responsive-switch tablet" data-device="tablet" href="#"></a>
						<a class="responsive-switch desktop" data-device="desktop" href="#"></a>
					<?php else: ?>
						<span class='phone-control control-selector'></span>
						<div class='view-switch-wrap'>
							<input type="checkbox" id="view-switch" name="view-switch" class="view-switch" checked />
							<label for="view-switch"></label>
						</div>
						<span class='desktop-control control-selector view-selected'></span>
					<?php endif; ?>
				</div>
				<div class='action-controls'>
					<a href='#' class='undo' title="undo"></a>
					<a href='#' class="redo" title="redo"></a>
				</div>
				<div class="loading-wrapper"></div>
			</header>
			<div class="builder-container"<?php if(!empty($config->builder_bg_color)) echo ' style="background:'.$config->builder_bg_color.'"'?>>
				<div<?php if($body_style) echo ' style="'.str_replace('"',"'",$body_style).'"' ?>>
					<!-- Templates Start -->
					<?php echo $elements ?>
					<!-- Templates END -->
				</div>
				<div class='item-controls-wrap'>
					<div class='menu-item-control item-control'>
						<a href='#' class='menu-item-control-trigger item-control-trigger' title="Move Element"></a>
					</div>
					<div class='background-item-control item-control'>
						<a href='#' class='background-item-control-trigger item-control-trigger' title="Edit Background Color"></a>
						<div class='item-control-content'>
							<h3 class='item-control-title'>Choose Background Color</h3>
							<input type='text' class='item-control-input color-picker-input' id='background-item-control-input' data-selector=".element-background-editing"/>
							
						</div>
					</div>
					<div class='background-color-item-control item-control'>
						<a href='#' class='background-color-item-control-trigger item-control-trigger' title="Edit Background Image"></a>
						<div class='item-control-content'>
							<h3 class='item-control-title'>Background Image (Insert url)</h3>
							<input type='text' class='item-control-input' id='element-bg-picker'/>
							<label class="bg-switcher"><input type="checkbox" class="bg-activate"><span><b>On</b><b>Off</b></span></label>
						</div>
					</div>
				</div>

				<div class='item-toggle-wrap'>
					<a href='#' class='item-toggle-duplicate' title="Duplicate Element">Duplicate</a>
					<a href='#' class='item-hide-duplicate' title="Hide Element">Hide</a>
					<a href='#' class='item-remove-duplicate' title="Remove Element">Remove</a>
					<a href='#' class='item-show-duplicate' title="Show Element">Show</a>
				</div>

				
				
			</div>
			<div class="edit-text-wrapper">
				<a href='#' class='edit-text-button' title="Edit Text"></a>
			</div>
			<div class="edit-image-wrapper">
				<a href='#' class='edit-image-button' title="Edit Image"></a>
			</div>
			<div class="edit-link-wrapper">
				<a href='#' class='edit-link-button' title="Edit Link"></a>
			</div>
		</main>

		<div class="edit-modal">
			<div class="modal-header"><span>Modal</span></div>
			<div class="modal-body">
				
			</div>
			<div class="modal-footer">
				<a href="#" class="edit-save">Save</a>
				<a href="#" class="edit-cancel">Cancel</a>
			</div>
		</div>

		<div class="tooltip-hint">
			<div class="tooltip-message">
				Use these arrows to Undo/Redo changes. Always save your work by going to Options. <br/><br/><span style="font-size: 11px;">* This is not a replacement for saving progress, but a helpful way to go a couple of steps back or forward.</span>
			</div>
			<div class="tooltip-control">
				<button class="close-tooltip">Thanks for the tip</button>
			</div>
		</div>

		<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>
		<script type='text/javascript' src='http://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.2.1/jquery-migrate.min.js'></script>
		<script type='text/javascript' src='js/menu-acc.min.js'></script>
		<script type='text/javascript' src='js/html5slider.js'></script>
	    <script type='text/javascript' src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
		<script type='text/javascript' src="js/iris.min.js"></script>
		<script type='text/javascript' src="js/tiny.editor.packed.js"></script>
		<script type='text/javascript' src="js/jquery.cookie.js"></script>
		<script type='text/javascript' src="js/imagesloaded.pkgd.min.js"></script>
		<script type='text/javascript' src="js/materialPreloader.min.js"></script>
		<script type='text/javascript' src='js/custom.js'></script>
	</body>
</html>