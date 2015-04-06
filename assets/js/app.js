$(function(){
	$('.main-nav a').on( 'click', goAnchor() );
});

function goAnchor(){
	return function(e){
		e.preventDefault();

		var target = $(this).attr('href');

    $('html,body').animate({
      scrollTop: $(target).offset().top
    });
	};
}