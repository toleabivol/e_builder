$(document).ready(function($){
	

	$(".nav-off-trigger").click(function(e){	
		$(".nav-container-box").css("left","-100%");
		$(".nav-on-trigger").css({
			'transform':'translate(0,0)',
			'-webkit-transform':'translate(0,0)',
			'-o-transform':'translate(0,0)',
			'-moz-transform':'translate(0,0)',
			'height':'100px'});
	});

	$(".ct-search").click(function(e){
		$(this).addClass('ct-search-open');
	});

	$('.isotope-wrapper').isotope({ 
		animationEngine : 'best-available',
		itemSelector: '.isotope-item'
	});
	$('.isotope-wrapper').imagesLoaded( function() {
		$('.isotope-wrapper').isotope('layout');
	});
	$('.isotope-filters button').click(function(){
		var selector = $(this).attr('data-filter');
		$('.isotope-wrapper').isotope({ filter: selector });
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		return false;
	});

	if($('.isotope-filters').length){
		$('.isotope-wrapper').isotope({ filter: $('.isotope-filters button.active').attr('data-filter') });
		
	};


});