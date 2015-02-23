function colorpickersInit(){
	$('.color-picker-input').iris({
		hide:true,
		change: function(event, ui) {
			var color = ui.color.toString();
			if($(this).data('selector') === '.element-background-editing'){
				if($('.element-background-editing').find('.main-bg-color').length){
					$(".builder-container " + $(this).data('selector') + " .main-bg-color").attr('bgcolor',color);
				}else{
					$(".builder-container " + $(this).data('selector') + " > table > tbody > tr > td").attr('bgcolor',color);
				}
				if(!$(this).data('auto-color')){
					if($('.element-background-editing').find('.image_bg')){
						var prev_value = $('.element-background-editing').find('.image_bg').css('background-image');
						add_undo($('.element-background-editing'),'bg_activate',{state:true,value:prev_value},{state:false,value:color});
						add_undo($('.element-background-editing'),'bg_activate',$(this).val(),color);
					}
					else{
						add_undo($('.element-background-editing'),'bg_activate',$(this).val(),color);
					}
				}else
					$(this).data('auto-color',false);
			}else{
				if(!$(this).data('undo-event')){
					add_undo($(this),'color',$(this).val(),color);
				}else{
					$(this).data('undo-event',false)
				}
				$(this).data('colorpicker-used',true);
		        var all_selectors_objects = $(this).data('selector');
		        
				$.each(all_selectors_objects,function(index,selectors){
					
					$.each(selectors,function(selectors_string,properties_string){
						var selectors_array = selectors_string.split(',');
						var properties_array = properties_string.split(',');
						$.each(selectors_array,function(ss_index,single_selector){
							$.each(properties_array,function(p_index,single_property){
								$(".builder-container " + single_selector).css(single_property,color);
								console.log(single_selector,single_property);
							});
						});
					});

				});
			}
	    }
	});
	
	$('#background-item-control-input').iris('show');
	//Toggle colorpickers    
    $(document).click(function (e) {
        if (!$(e.target).is(".color-picker-input, .iris-picker, .iris-picker-inner, .item-control-content *")) {
            $('.color-picker-input').not('#background-item-control-input').iris('hide');
            $('.background-item-control .item-control-content').hide()
            
        }
    });
    $('.color-picker-input').on('click',function (event) {
        $('.color-picker-input').not('#background-item-control-input').iris('hide');
        $(this).iris('show');
        //return false;
    });

	$('.color-picker').unbind().on('click',function(event){
		$('.color-picker-input').not(this).hide().iris('hide');
		$(this).children('.color-picker-input').toggle().iris('toggle');
		event.stopPropagation();
	});
	$('.bg-picker').unbind().on('click',function(event){
		$('.bg-picker-input').not(this).hide();
		$(this).children('.bg-picker-input').toggle();
		event.stopPropagation();
	});
	$('.color-picker-input,.bg-picker-input').on('click',function(event){
		event.preventDefault();
		return false;
	});
	$('.bg-picker-input').on('input',function(event){
		$('.element-background-editing .image_bg').css({'background-image':'url('+$(this).val()+')'})
		if($('.element-background-editing').find('.main-bg-color').length){
			$(".builder-container .element-background-editing .main-bg-color").attr('bgcolor','');
		}else{
			$(".builder-container .element-background-editing > table > tbody > tr > td").attr('bgcolor','');
		}
	});	
}

function sortable_init(){
	$('.builder-container > div > ul').sortable({
		//handle: '.menu-item-control-trigger',
		start: function(event,ui){
			var index = $('.builder-container > div > ul > li').index($(ui.item[0]))
			$(ui.item[0]).data('index',index)
			$('.email-element').css('left', '0');
			$('.email-element').css('right', '0');
		},
		update: function(event,ui){
			var curr_index = $('.builder-container > div > ul > li').index($(ui.item[0]))
			add_undo($(ui.item[0]),'sortable',$(ui.item[0]).data('index'),curr_index)
		}
	});
}

jQuery(document).ready(function($) {
	'use strict';

    jQuery('#accordion-menu').dcAccordion();

    $('input.view-switch').change(function(){
		if(this.checked){
         	$('.phone-control').removeClass('view-selected');
			$('.desktop-control').addClass('view-selected');
	    }
	    else {
	       	$('.desktop-control').removeClass('view-selected');
			$('.phone-control').addClass('view-selected');
	    }
	});

	$('.trigger-menu').click(function(e) {
		e.preventDefault();
		$('.left-nav-fixed').toggleClass('left-nav-fixed-opened');
		$('.left-nav-container').toggleClass('left-nav-container-opened');
		$('.trigger-menu').toggleClass('trigger-menu-smaller');
	});

	//==Boxed/Full width toggle===============================================
	if(!def_layout || def_layout === "boxed"){	//if default is boxed or not specified
		$('.builder-container .wrapper_table,.builder-container .email-element').css('max-width',boxed_width);
		$('body').addClass('boxed-view-mode');
		$('.builder-container > div').css({
			'max-width':boxed_width,
			'margin':'0 auto'
		});
	}else{
		$('body').addClass('full-view-mode');
		$('.builder-container .wrapper_table,.builder-container .email-element').css('max-width','none');
		$('.builder-container > div').css({
			'max-width':'none',
		});
	}

	$('.boxed-layout').click(function(e) {
		e.preventDefault();
		$('body').removeClass('full-view-mode').addClass('boxed-view-mode');
		add_undo($(this),'layout',$('.builder-container .wrapper_table').css('max-width'),boxed_width);
		$('.builder-container .wrapper_table,.builder-container .email-element').css('max-width',boxed_width);
		$('.builder-container > div').css({
			'max-width':boxed_width,
			'margin':'0 auto'
		});
		return false;
	});
	$('.full-layout').click(function(e) {
		e.preventDefault();
		$('body').removeClass('boxed-view-mode').addClass('full-view-mode');
		//$('.builder-container > div').css('background-color',$('.builder-container > div').data('bg-color'));
		add_undo($(this),'layout',$('.builder-container .wrapper_table').css('max-width'),'none');
		$('.builder-container .wrapper_table,.builder-container .email-element').css('max-width','none');
		$('.builder-container > div').css({
			'max-width':'none',
		});
		return false;
	});
	//==Mobile/Desktop view=========================================================
	$('#view-switch').change(function(event) {
		if($(this).is(":checked")){
			$('.builder-container').css('width','100%');
			$('main').removeClass('mobile-preview').addClass('desktop-preview');
			/*if($('iframe').length){
				//$('iframe').css('width','100%');
				
			}*/
		}else{
			if(!$('iframe').length){
				$('.preview-mode').trigger('click');
			}
			//$('iframe').width(320);
			//$('main').css('text-align','center');
			$('main').removeClass('desktop-preview').addClass('mobile-preview');
		}
	});
	var preview_device = false;
	$('.responsive-switch').click(function(){
		$('.responsive-switch').removeClass('view-selected');
		$(this).addClass('view-selected');
		preview_device = $(this).data('device');
		if(!$('body').hasClass('showing-preview')){
			$('.preview-mode').trigger('click');
		}
		$('main').removeClass('mobile-preview desktop-preview tablet-preview').addClass(preview_device + '-preview');
	});
	//=================PREVIEW MODE======================================
	$('.preview-mode').click(function(e){
		e.preventDefault();
		$('.loading-wrapper').fadeIn(function(){$('.loading-wrapper').css('width','50%')});
		$('.view-controls .active').removeClass('active');
		$('.element-background-editing .image_bg').removeClass('image_bg');
		$(this).addClass('active');
		//sending html for sesion
		$('.item-controls-wrap,.item-toggle-wrap,.edit-text-wrapper,.edit-image-wrapper,.edit-link-wrapper').hide();
		var html = $('.builder-container > div > ul').html();
		$.post('preview.php', {html: html,template:template}, function(data, textStatus, xhr) {
			$('.builder-container').hide();
			$('body').addClass('showing-preview');
			$('.left-nav-container').css('left',-300);
			$('main').css('padding-left',0);
			var iframe_height = $(window).height()-46;
			var iframe_width;
			if(preview_device){
				$('main').removeClass('mobile-preview desktop-preview tablet-preview').addClass(preview_device + '-preview');
			}else{
				$('a[data-device=desktop]').addClass('view-selected');
			}
			$('main').append('<iframe height="100%" frameborder="0" style="overflow:hidden;height:'+iframe_height+'px;" src="preview.php">');
			$('.loading-wrapper').css('width','100%');
			setTimeout(function(){$('.loading-wrapper').fadeOut('slow',function(){$('.loading-wrapper').css('width','0')});},2500);
		});
	});

	//=================Edit MODE======================================
	$('.edit-mode').click(function(e){
		e.preventDefault();
		$('#view-switch').prop('checked', true);
		$('.view-controls .active').removeClass('active');
		$(this).addClass('active');
		//$('main').css('text-align','inherit');
		$('iframe').remove();
		$('.builder-container').show();
		$('main').css('padding-left',300).removeClass('mobile-preview desktop-preview');
		$('body').removeClass('showing-preview');
		$('.left-nav-container').css('left',0);
	});

	//==Hide item===================================================================
	$('body').on('click','.item-hide-duplicate',function(e) {
		e.preventDefault();
		console.log('yes')
		$(this).parent().parent('.email-element').addClass('hidden');
		$('.item-hide-duplicate,.item-toggle-duplicate').hide();
		$('.item-show-duplicate,.item-remove-duplicate').show();
	});
	//==Remove item===================================================================
	$('body').on('click','.item-remove-duplicate',function(e) {
		e.preventDefault();
		console.log($(this))
		$(this).parent().parent('.email-element').addClass('to-remove');
		$('.item-controls-wrap,.item-toggle-wrap').hide().prependTo('.builder-container');
		var index = $('.builder-container > div > ul > li').index($('.email-element.to-remove'));
		index = index <= -1 ? -1 : index - 1;
		add_undo($('.email-element.to-remove'),'remove',{html:$('.email-element.to-remove')[0].outerHTML,index:index},'')
		$('.email-element.to-remove').remove();
	});
	//==Show item===================================================================
	$('body').on('click','.item-show-duplicate',function(e) {
		e.preventDefault();
		console.log('yes2')
		$(this).parent().parent('.email-element').removeClass('hidden');
		$('.item-hide-duplicate,.item-toggle-duplicate').show();
		$('.item-show-duplicate,.item-remove-duplicate').hide();
	});
	//==Duplicate item===================================================================
	$('body').on('click','.item-toggle-duplicate',function(e) {
		e.preventDefault();
		var $element = $(this).parent().parent('.email-element').clone();
		$element.find('.item-controls-wrap,.item-toggle-wrap').remove().html()
		$(this).parent().parent('.email-element').after($element);
		var index = $('.builder-container > div > ul > li').index($(this).parent().parent('.email-element')) - 1;
		add_undo($element,'duplicate','',index);
	});
	//==Sortable enabling======================================================
	sortable_init();
	
	//Colorpickers init----
	colorpickersInit();
	//==Element controls==============================================
	$('.builder-container').on('mouseenter','.email-element',function(event){
		var the_height = $(this).height() ;
		//Show Hide buttons for this element
		if($(this).hasClass('hidden')){
			$('.item-hide-duplicate,.item-toggle-duplicate').hide();
			$('.item-show-duplicate,.item-remove-duplicate').show();
		}else{
			$('.item-hide-duplicate,.item-toggle-duplicate').show();
			$('.item-show-duplicate,.item-remove-duplicate').hide();
		}
		//position the controls
		$('.item-controls-wrap,.item-toggle-wrap').prependTo($(this)).show();
				
		//background class assign
		$('.element-background-editing').removeClass('element-background-editing');
		$(this).addClass('element-background-editing');
		//color-bg-picker
		$('#background-item-control-input').data('auto-color',true)//for undo fine tunning
		if($(this).find('.main-bg-color').length){
			$('#background-item-control-input').iris('color',$(this).find('.main-bg-color').attr('bgcolor'));
		}else{
			$('#background-item-control-input').iris('color',$(this).find('table > tbody > tr > td').attr('bgcolor'));
		}
		$('#background-item-control-input').data('auto-color',false);//for undo fine tunning
		//image-bg-picker
		if($(this).find('.image_bg').length){
			$('.bg-activate').prop('checked', true);
			$('#element-bg-picker').val($(this).find('.image_bg').css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, ""));
		}else{
			$('.bg-activate').prop('checked', false)
			$('#element-bg-picker').val('');
			//$('#element-bg-picker').parent().prev().hide();
		}
		
	});
	//Image BG picker
	$('#element-bg-picker').on('input',function(){
		if($('.element-background-editing').find('.main-bg-color').length){
			$('.element-background-editing').find('.main-bg-color').attr('bgcolor','');
		}else{
			$('.element-background-editing').find('table > tbody > tr > td').attr('bgcolor','');
		}
		if($('.element-background-editing').find('.image_bg').length){
			$('.element-background-editing .image_bg').css({'background-image':'url('+$(this).val()+')'});
		}else{
			$('.element-background-editing > table').addClass('image_bg').css({'background-image':'url('+$(this).val()+')'});
		}
		
	})
	//On / OFF background Image
	$('.bg-activate').change(function(event) {
		var value;
		var prev_value;
		if($(this).is(":checked")) {
			if($('.element-background-editing').find('.main-bg-color').length){
				$('.element-background-editing').find('.main-bg-color').attr('bgcolor','');
				prev_value = $('.element-background-editing').find('.main-bg-color').attr('bgcolor');
			}else{
				$('.element-background-editing').find('table > tbody > tr > td').attr('bgcolor','');
				prev_value = $('.element-background-editing').find('table > tbody > tr > td').attr('bgcolor');
			}
			value = $('#element-bg-picker').val();
			$('.element-background-editing > table').addClass('image_bg').css({'background-image':'url('+value+')'});
		}else{
			if($('.element-background-editing').find('.main-bg-color').length){
				prev_value = $('.element-background-editing').find('.main-bg-color').attr('bgcolor');
				$('.element-background-editing').find('.main-bg-color').attr('bgcolor',$('#background-item-control-input').iris('color', true));
			}else{
				prev_value = $('.element-background-editing').find('table > tbody > tr > td').attr('bgcolor');
				$('.element-background-editing').find('table > tbody > tr > td').attr('bgcolor',$('#background-item-control-input').iris('color', true));
			}
			if($('.element-background-editing .image_bg').length){
				prev_value = $('.element-background-editing .image_bg').css('background-image');
				$('.element-background-editing .image_bg').css({'background-image':''}).removeClass('image_bg');
			}
			
			value = $('#background-item-control-input').iris('color', true);
		}
		add_undo($('.element-background-editing'),'bg_activate',{state:!$(this).is(":checked"),value:prev_value},{state:$(this).is(":checked"),value:value});
	});
	
	$('body').on('click','.background-item-control-trigger,.background-color-item-control-trigger',function(e){
		e.preventDefault();
		$('.background-item-control-trigger,.background-color-item-control-trigger').not($(this)).next().hide();
		$(this).next().toggle();
		return false;
	});

	//Range sliders============
	$('.range-slider').on('change input',function(){
		var number = $(this).val();
		var selectors = $(this).data('selector').split(',');
        var properties = $(this).data('properties').split(',');
        var unit = $(this).data('unit');
        var important = typeof $(this).data('important') !== "undefined" ? " !important" : '';
        if(!$(this).data('undo-event')){
        	add_undo($(this),'range-slider',parseInt($(this).next().find('output').html()),number);
        }else{
        	$(this).data('undo-event',false);
        }
		$(this).next().find('output').html(number);
		$.each(selectors,function(index,selector){
			$.each(properties,function(pindex,propery){
				$(".builder-container table " + selector).css(propery,number + unit + important);
			});
		});
	});

	//Saving layout=============================================================
	$('.save-button').on('click',function(){
		var htmlToSave = $('.builder-container').html();
		$('.token-load').removeClass('show-token');
		$('.token-to-load,.token-load').hide();
		if(!htmlToSave || htmlToSave.trim() === ''){
			$('.token-save').removeClass('show-token').addClass('show-token');
			$('.token-save').text('Layout empty ... Nothing to save.');
			return;
		}
		$.ajax({
			url: 'ajax.php',
			type: 'POST',
			dataType: 'html',
			data: {
				html: htmlToSave,
				action: 'save',
				template:template
			},
		})
		.done(function(result) {
			$('.token-save').removeClass('show-token');
            $('.token-save').addClass('show-token');
			$('.token-save').html('Your Saved Token is : <span>' + result + '</span> . Use it to load this layout later.').show();	
		})
		.fail(function() {
			console.log("error");
			$('.token-save').removeClass('show-token');
            $('.token-save').addClass('show-token');
			$('.token-save').text('error saving');
		});
		
	});

	//Loading layout=============================================================
	$('.load-button').on('click',function(){
		$('.token-save').removeClass('show-token');
		$('.token-to-load').show();
		$('.token-save').hide();
	});
	$('.token-to-load').on('input',function(){
		var token = $('.token-to-load').val();
		if(!token || token === ''){
			$('.token-save').removeClass('show-token').addClass('show-token');
			$('.token-load').text('Insert a token');
			return;
		}
		$.ajax({
			url: 'ajax.php',
			type: 'POST',
			dataType: 'json',
			data: {
				action: 'load',
				token:token,
				template:template
			},
		})
		.done(function(result) {
			console.log(result);
			$('.token-save').removeClass('show-token').addClass('show-token');
			$('.token-load').html(result.message).show();
			if(result.html){
				$('.builder-container').html(result.html);
				sortable_init();
				colorpickersInit();
			}
		})
		.fail(function(error) {
			console.log("error");
			$('.token-save').removeClass('show-token');
            $('.token-save').addClass('show-token');
			$('.token-save').text('error loading').show();
		});
	});

	//Edit element text===============================
	$('.builder-container').on('mouseenter','[data-editable]:not(.button)',function(){
		$(this).append($('.edit-text-wrapper'));
		$('.edit-text-wrapper').show();
	});
	$('.builder-container').on('mouseleave','[data-editable]:not(.button)',function(){
		$('.edit-text-wrapper').appendTo('main').hide();
	});
	var editor;
	var editable_content_initial;
	$('.edit-text-button').on('click',function(e){
		e.preventDefault();
		$('.text-editing').removeClass('text-editing');
		$('.edit-modal .modal-header span').html('Edit Text');
		$('.edit-modal').removeClass('modal-editing-image');
		$('.edit-modal').addClass('modal-editing-text');
		var editable_content = $(this).parent().parent().addClass('text-editing');
		$('.edit-text-wrapper').appendTo('main');
		editable_content_initial = $('.text-editing').html();
		
		$('.modal-body').html('<textarea id="tinyeditor"></textarea>');
		
		$('#tinyeditor').html(editable_content_initial);
		editor = new TINY.editor.edit('editor', {
			id: 'tinyeditor',
			width: 500,
			height: 175,
			cssclass: 'tinyeditor',
			controlclass: 'tinyeditor-control',
			rowclass: 'tinyeditor-header',
			dividerclass: 'tinyeditor-divider',
			controls: ['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|',
				'orderedlist', 'unorderedlist', '|', 'outdent', 'indent', '|', 'leftalign',
				'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'n',
				'font', 'size', 'style', '|', 'hr', 'link', 'unlink', 'colour'],
			footer: true,
			fonts: ['Verdana','Arial','Georgia','Trebuchet MS'],
			//xhtml: true,
			bodyid: 'editor',
			footerclass: 'tinyeditor-footer',
			toggle: {text: 'source', activetext: 'wysiwyg', cssclass: 'toggle'},
			resize: {cssclass: 'resize'}
		});
		$('.edit-modal,#mask').addClass('show-modal');
		$('html').addClass('modal-opened')
		return false;
	});
	$('body').on('click','.modal-editing-text .edit-save',function(e){
		e.preventDefault();
		editor.post();
		$('.text-editing').html(editor.t.value);
		add_undo($('.text-editing'),'text-editing',editable_content_initial,editor.t.value)
		$('.text-editing').removeClass('text-editing');
		$('.edit-modal,#mask').removeClass('show-modal');
		$('html').removeClass('modal-opened');
	});
	$('body').on('click','.modal-editing-text .edit-cancel',function(e){
		e.preventDefault();
		$('.text-editing').removeClass('text-editing');
		$('.edit-modal,#mask').removeClass('show-modal');
		$('html').removeClass('modal-opened');
	});

	//edit element image======================
	$('.builder-container').on('mouseenter','img',function(){
		$(this).after($('.edit-image-wrapper'));
		$('.edit-image-wrapper').width($(this).width())
		$('.edit-image-wrapper').show();
	});
	$('.builder-container').on('mouseleave','a,td',function(e){
		if (e.relatedTarget != $('.edit-image-button')[0]) {
			$('.edit-image-wrapper').appendTo('main').hide();
		}
	});
	$('.builder-container').on('mouseleave','.edit-image-wrapper',function(e){
		$('.edit-image-wrapper').appendTo('main').hide();
	});
	var fa_select = '<select id="fa-select"><option value="">Choose Icon</option>';
	var fa_json = $.getJSON('fa/fa.json', function(json, textStatus) {
		$.each(json, function(index, val) {
			fa_select += '<option value="'+index+'">'+index+'</option>';
		});
		fa_select += '</select>';
	});
	$('.builder-container').on('click','.edit-image-button',function(e){
		e.preventDefault();
		$('.editing-image').removeClass('editing-image');
		$(this).parent().siblings('img').addClass('editing-image');
		$('.edit-modal').removeClass('modal-editing-text');
		$('.edit-modal').addClass('modal-editing-image');
		$('.edit-modal .modal-header span').html('Edit Image');
		$('.modal-body').html('<p><label>Image src</label><input id="image-src" type="text"></p>');
		$('.modal-body')
			.append('<p style="float: left; width: 220px; margin-right: 40px;"><label>Image Height</label><input id="image-height" type="text"></p><p style="float: left; width: 220px; clear:right;"><label>Image Width</label><input id="image-width" type="text"></p>')
			//.append('<p style="float: left; width: 220px; margin-right: 40px;"><label>Icon</label>' + fa_select + '</p>')
			//.append('<p style="float: left; width: 220px; clear:right;"><label>Use Icon</label><input id="use-icon" type="checkbox" value="1"></p>')
			//.append('<p style="float: left; width: 220px; clear:right;"><label>Icon Color</label><input id="icon-color" type="text" value="#000000"></p>')
		if($('.editing-image').parent('a').length){
			$('.modal-body').append('<p style="margin-top: 20px;"><label>Link URL</label><input id="image-link" type="text"></p>');
			$('#image-link').val($('.editing-image').parent('a').attr('href'));
		}
		$('#image-src').val($('.editing-image').attr('src'));
		$('#image-width').val($('.editing-image').width());
		$('#image-height').val($('.editing-image').height());
		$('.edit-modal,#mask').addClass('show-modal');
		$('html').addClass('modal-opened')
	});
	$('body').on('click','.modal-editing-image .edit-save',function(e){
		e.preventDefault();
		add_undo($('.editing-image'),'image-editing',$('.editing-image').attr('src'),$('#image-src').val())
		$('.editing-image').attr('src',$('#image-src').val());
		if( typeof $('#image-width').val() !== undefined ){
			$('.editing-image').width($('#image-width').val()).removeAttr('width');;
		}
		if( typeof $('#image-height').val() !== undefined ){
			$('.editing-image').height($('#image-height').val()).removeAttr('height');;
		}
		if($('#image-link').length){
			$('.editing-image').parent('a').attr('href',$('#image-link').val())
		}
		if( $('#fa-select').val() !== '' ){
			var icon = $('#fa-select').val().replace('fa-','');
			var icon_size = $('#image-width').val();
			var icon_color = $('#icon-color').val()
			$.ajax({
				async:false,
				url: 'fa/index.php',
				type: 'POST',
				data: {
					icon: icon,
					size: icon_size,
					color:icon_color
				},
			})
			.done(function(result) {
				console.log(result);
				console.log(url + icon + '-' + icon_size + '-' + icon_color + '.png')
				$('.editing-image').attr('src',url + 'fa/' + icon + '-' + icon_size + '-' + encodeURIComponent(icon_color) + '.png');
			})
			.fail(function() {
				console.log("error");
			})
			
		}
		$('.editing-image').removeClass('editing-image');
		$('.edit-modal,#mask').removeClass('show-modal');
		$('html').removeClass('modal-opened');
	});
	$('body').on('click','.modal-editing-image .edit-cancel',function(e){
		e.preventDefault();
		$('.edit-modal,#mask').removeClass('show-modal');
		$('html').removeClass('modal-opened');
		$('.editing-image').removeClass('editing-image');
	});

	//Edit element Link======================================
	$('.builder-container').on('mouseenter','.button,[link-editable]',function(){
		$(this).append($('.edit-link-wrapper'));
		$('.edit-link-wrapper').show();
	});
	$('.builder-container').on('mouseleave','.button,[link-editable]',function(){
		$('.edit-link-wrapper').appendTo('main').hide();
	});
	$('.builder-container').on('click','.edit-link-button',function(e){
		e.preventDefault();
		$('.editing-link').removeClass('editing-link');
		$(this).parent().siblings('a').addClass('editing-link');
		$('.edit-link-wrapper').appendTo('main').hide();
		$('.edit-modal').removeClass('modal-editing-text');
		$('.edit-modal').addClass('modal-editing-link');
		$('.edit-modal .modal-header span').html('Edit link');
		$('.modal-body').html('<p><label>Link image</label><input id="link-src" type="text"></p><p><label>Link URL</label><input id="link-name" type="text"></p>');
		$('#link-src').val($('.editing-link').attr('href'));
		$('#link-name').val($('.editing-link').html().trim());
		$('.edit-modal,#mask').addClass('show-modal');
		$('html').addClass('modal-opened');
	});
	$('body').on('click','.modal-editing-link .edit-save',function(e){
		e.preventDefault();
		add_undo($('.editing-link'),'link-editing',{link:$('.editing-link').attr('href'),name:$('.editing-link').html().trim()},{link:$('#link-src').val(),name:$('#link-name').val()})
		$('.editing-link').attr('href',$('#link-src').val());
		$('.editing-link').html($('#link-name').val());
		$('.editing-link').removeClass('editing-link');
		$('.edit-modal,#mask').removeClass('show-modal');
		$('html').removeClass('modal-opened');
	});
	$('body').on('click','.modal-editing-link .edit-cancel',function(e){
		e.preventDefault();
		$('.edit-modal,#mask').removeClass('show-modal');
		$('html').removeClass('modal-opened');
		$('.editing-link').removeClass('editing-link');
	});

	//===============Exporting=========================================
	var solution = 'html';
	$('.export').click(function(e){
		e.preventDefault();
		solution = $(this).data('solution');
		$('.download-input').hide();
		$(this).siblings('p').slideDown();
	});
	$('.download').click(function(){
		var purchase_code = $(this).siblings('input').val();
		$.ajax({
			url: 'ajax.php',
			type: 'POST',
			dataType: 'json',
			data: {
				action: 'check',
				purchase_code: purchase_code,
				template: template,
			},
		})
		.done(function(result) {
			$('.image_bg').removeClass('image_bg');
			if(result.valid){
				$('.item-controls-wrap,.item-toggle-wrap,.edit-text-wrapper,.edit-image-wrapper,.edit-link-wrapper').appendTo('.builder-container > div');
				var html = $('.builder-container > div > ul').html();
				$('#builder-html').remove();
				var bg_image = $('.bg-image-input').val();
				var bg_color = $('.menu-input-input.color-picker-input').eq(0).val();
				var url = 'download.php';
				var form = $('<form action="' + url + '" method="post" id="builder-html">' +
				  '<textarea id="html-container-before-download" name="html"></textarea>' +
				  '<input type="hidden" name="template" value="'+template+'">' +
				  '<input type="hidden" name="solution" value="'+solution+'">' +
				  '<input type="hidden" name="bg_image" value="'+bg_image+'">' +
				  '<input type="hidden" name="bg_color" value="'+bg_color+'">' +
				  '</form>');
				$('body').append(form);

				$('#html-container-before-download').val(html);

				$(form).submit();
				
			}else{
				$('.download').text('Invalid Code').css('color','red')
				setTimeout(function(){
					$('.download').text('Download').css('color','white')
				},2000);
			}
		})
		.fail(function(error) {
			console.log(error);
		});
		
	});

	
	//=================Tooltip======================================
	$('.close-tooltip').click(function() {
		var toolTip = $('.tooltip-hint');
		$.cookie('si-tooltip','shown');
		toolTip.addClass('hide-tooltip');
		setTimeout(function() {toolTip.hide();}, 500);
	});
	if($.cookie('si-tooltip')){
		$('.tooltip-hint').hide();
	}
	//================Rate me popup===================================
	function rate_popup (){
		if( !$.cookie('si-builder-rated') && !$.cookie('si-builder-rate-never') ){
			$('.rate-popup').fadeIn('slow');
			clearInterval(popup_interval)
		}
	}
	var popup_interval = setInterval(rate_popup,1800000);//30min

	$('.rate-later,.rate-close').click(function(event){
		event.preventDefault();
		$('.rate-popup').fadeOut('slow');
		popup_interval = setInterval(rate_popup,1800000);
		return false;
	});
	$('.rate-never').click(function(event){
		event.preventDefault();
		$.cookie('si-builder-rate-never',true,{expires:365});
		$('.rate-popup').fadeOut('slow');
		return false;
	});
	//===============template versioning=================================
	if(template_v !== '0'){
		$('.email-element').each(function(index,element){
			var element_templates = $(element).attr('data-template');
			if(typeof element_templates !== 'undefined'){
				var templates_array = element_templates.split(",");
				if( $.inArray( template_v, templates_array ) == -1)
					$(element).remove();
			}else
				$(element).remove();
		});
	}
	//=================Preloader====================================
	$('.builder-container').imagesLoaded( function() {
		preloader.off();
		$('.top-nav-bar').height(40)
	})
	var preloader = new $.materialPreloader({
        position: 'top',
        height: '5px',
        col_1: '#159756',
        col_2: '#da4733',
        col_3: '#1fb5ad',
        col_4: '#fdba2c',
        fadeIn: 200,
        fadeOut: 200
    })
	preloader.on()

	//================General BG image==================================
	$('.bg-image-input').on('input',function(){
		$('.builder-container > div').css('background-image',"url("+$(this).val()+")");
	});
	$('.remove-bg-image').click(function(){
		$('.bg-image-input').val('');
		$('.builder-container > div').css('background-image',"none");
	})

});


//Undo / Redo ==============================================================
var events = [];	//events array
var events_state = 0;	//events position coutner

function add_undo(element,element_type,prev_state,curr_state){
	var event = {};
	event.element = element;
	event.element_type = element_type;
	event.prev_state = prev_state;
	event.curr_state = curr_state;

	events = events.slice(0, events_state); // deleting all other future events since something was changed
	
	events[events_state] = event;	//adding this event to queue
	events_state ++;
}

function undo(){
	events_state --;
	if(events_state < 0){
		console.log('No more undo')
		events_state = 0;
		$('.undo').addClass('disabled');
		return;
	}
	var event = events[events_state];
	console.log(events_state,event);

	switch(event.element_type) {
		case 'layout':
	    	$('.builder-container .wrapper_table,.builder-container .email-element,.builder-container > div').css('max-width',event.prev_state);
	    	if(event.prev_state === 'none'){
	    		$('body').removeClass('boxed-view-mode').addClass('full-view-mode');$('.builder-container .wrapper_table,.builder-container .email-element').css('max-width','none');
				$('.builder-container > div').css({
					'max-width':'none',
				});
	    	}else{
	    		$('.builder-container .wrapper_table').css('max-width',boxed_width);
				$('body').addClass('boxed-view-mode');
				$('.builder-container > div').css({
					'max-width':boxed_width,
					'margin':'0 auto'
				});
	    	}
	    	break;
	    case 'color':
	    	event.element.data('undo-event',true).iris('color',event.prev_state);
	    	break
    	case 'range-slider':
    		event.element.data('undo-event',true).val(event.prev_state).trigger('change')
    		break;
		case 'sortable':
    		event.element.insertAfter($('.builder-container > div > ul > li').eq(event.prev_state))
    		console.log($('.builder-container > div > ul > li').eq(event.prev_state))
    		break;
		case 'remove':
    		if(event.prev_state.index === -1){
				$(event.prev_state.html).removeClass('to-remove').prependTo($('.builder-container > div > ul'))
				event.element = $('.builder-container > div > ul > li').eq(0)
			}else{
				$(event.prev_state.html).removeClass('to-remove').insertAfter($('.builder-container > div > ul > li').eq(event.prev_state.index ))
    			event.element = $('.builder-container > div > ul > li').eq(event.prev_state.index + 1)
    		}
    		break;
		case 'duplicate':
    		$('.item-controls-wrap,.item-toggle-wrap').hide().prependTo('.builder-container');
			event.element.remove();
    		break;
		case 'bg-color':
			if(event.element.find('.main-bg-color').length){
				event.element.find('.main-bg-color').attr('bgcolor',event.prev_state);
			}else{
				event.element.find("table > tbody > tr > td").attr('bgcolor',event.prev_state);
			}
			break;
		case 'bg_activate':
			if(event.prev_state.state) {
				if(event.element.find('.main-bg-color').length){
					event.element.find('.main-bg-color').attr('bgcolor','');
				}else{
					event.element.find('table > tbody > tr > td').attr('bgcolor','');
				}
				event.element.children('table')
					.addClass('image_bg')
					.css('background-image',event.prev_state.value);
			}else{
				if(event.element.find('.main-bg-color').length){
					event.element.find('.main-bg-color').attr('bgcolor',event.prev_state.value);
				}else{
					event.element.find('table > tbody > tr > td').attr('bgcolor',event.prev_state.value);
				}
				event.element.find('.image_bg').css({'background-image':''}).removeClass('image_bg')
			}
			break;
		case 'text-editing':
			event.element.html(event.prev_state);
			break;
		case 'link-editing':
			event.element.attr('href',event.prev_state.link);
			event.element.html(event.prev_state.name);
			break;
		case 'image-editing':
			event.element.attr('src',event.prev_state);
			break;
		default:
		    console.log('no type')
	}
}

function redo(){
	var event = events[events_state];
	console.log(events_state,events.length);

	if(events_state >= events.length){
		console.log('yes')
		events_state = events.length;
		$('.redo').addClass('disabled');
		return;
	}
	

	switch(event.element_type) {
		case 'layout':
	    	$('.builder-container .wrapper_table,.builder-container .email-element,.builder-container > div').css('max-width',event.curr_state);
	    	if(event.curr_state === 'none'){
	    		$('body').removeClass('boxed-view-mode').addClass('full-view-mode');$('.builder-container .wrapper_table,.builder-container .email-element').css('max-width','none');
				$('.builder-container > div').css({
					'max-width':'none',
				});
	    	}else{
	    		$('.builder-container .wrapper_table').css('max-width',boxed_width);
				$('body').addClass('boxed-view-mode');
				$('.builder-container > div').css({
					'max-width':boxed_width,
					'margin':'0 auto'
				});
	    	}
	    	break;
	    case 'color':
	    	event.element.data('undo-event',true).iris('color',event.curr_state);
	    	break
    	case 'range-slider':
    		event.element.data('undo-event',true).val(event.curr_state);
    		break;
		case 'sortable':
    		event.element.insertAfter($('.builder-container > div > ul > li').eq(event.curr_state));
    		break;
		case 'remove':
			$('.item-controls-wrap,.item-toggle-wrap').hide().prependTo('.builder-container');
			event.element.remove();
    		break;
		case 'duplicate':
    		if(event.curr_state === -1){

				$(event.element).prependTo($('.builder-container > div > ul'))
				event.element = $('.builder-container > div > ul > li').eq(0);
			}else{
				console.log(event.element)
				event.element.insertAfter($('.builder-container > div > ul > li').eq(event.curr_state ))
    			event.element = $('.builder-container > div > ul > li').eq(event.curr_state + 1)
    		}
    		break;
		case 'bg-color':
			if(event.element.find('.main-bg-color').length){
				event.element.find('.main-bg-color').attr('bgcolor',event.curr_state);
			}else{
				event.element.find("table > tbody > tr > td").attr('bgcolor',event.curr_state);
			}
			break;
		case 'bg_activate':
			if(event.curr_state.state) {
				if(event.element.find('.main-bg-color').length){
					event.element.find('.main-bg-color').attr('bgcolor','');
				}else{
					event.element.find('table > tbody > tr > td').attr('bgcolor','');
				}
				console.log(event.curr_state.value)
				event.element.children('table')
					.addClass('image_bg')
					.css('background-image',event.curr_state.value);
			}else{
				if(event.element.find('.main-bg-color').length){
					event.element.find('.main-bg-color').attr('bgcolor',event.curr_state.value);
				}else{
					event.element.find('table > tbody > tr > td').attr('bgcolor',event.curr_state.value);
				}
				event.element.find('.image_bg').css({'background-image':''}).removeClass('image_bg')
			}
			break;
		case 'text-editing':
			event.element.html(event.curr_state);
			break;
		case 'link-editing':
			event.element.attr('href',event.curr_state.link);
			event.element.html(event.curr_state.name);
			break;
		case 'image-editing':
			event.element.attr('src',event.curr_state);
			break;
		default:
		    console.log('no type')
	}
	events_state ++;
}

$('.undo').click(undo);
$('.redo').click(redo);