/*!
 * jPinning v0.1
 * Pin and unpin your headers while you are scrolling
 * MIT License
 */
(function( $ ) {
	$.fn.jPinning = function( options ) {
		// Default settings
		var defaults = {
			delay: 0, //response time for header to hide or show in miliseconds
			onPin: function(){}, //Fires when the header shows up
			onUnpin: function(){} //Fires when the header hides out
		};
		// Merge default settings with user settings
		var settings = $.extend( {}, defaults, options );

		var elements = {
			lastScrollTop: 0,
			window: $(window),
			status: 'pinned'
		};

		var methods = {
			/*
			* This execute the passed function x miliseconds later where x is passed time as miliseconds
			*/
			debounce: function(func, wait, immediate) {
			  var timeout;
			  return function() {
			    var context = this, args = arguments;
			    var later = function() {
			      timeout = null;
			      if (!immediate) func.apply(context, args);
			    };
			    var callNow = immediate && !timeout;
			    clearTimeout(timeout);
			    timeout = setTimeout(later, wait);
			    if (callNow) func.apply(context, args);
			  };
			},

			isUnpinned: function(){
				/*
				* Check if header is unpinned
				*/
				if( elements.status == 'unpinned' )
					return true;
				return false;
			},

			isPinned: function(){
				/*
				* Check if header is pinned
				*/
				if( elements.status == 'pinned' )
					return true;
				return false;
			},

			prepare: function(){
				/*
				* This will add the needed classes for the header to work properly
				*/
				elements.target.addClass('pinning-nav');
				elements.target.css('position', 'fixed');
			},

			pin: function(){
				/*
				* If the header is unpinned this function will update the status to "pinned",
				* update header classes and execute the callback function.
				*/
				if( methods.isUnpinned() ){
					elements.status = 'pinned';
					elements.target.removeClass('unpinned').addClass('pinned');
					settings.onPin.call( elements.target );
				}
			},

			unpin: function(){
				/*
				* If the header is pinned this function will update the status to "unpinned",
				* update header classes and execute the callback function.
				*/

				if( methods.isPinned() ){
					elements.status = 'unpinned';
					elements.target.removeClass('pinned top').addClass('unpinned');
					settings.onUnpin.call( elements.target );
				}
			},

			pinHandler: function(){
				/* 
				* This function will add "top" class to the header when it reachs the top of the page.
				* Also, it will call pin() or unpin() functions depending if the user is scrolling up or down.
				*/
				var st = $(window).scrollTop();

				if ( st == 0 ){
					elements.target.addClass('top');
				}

			  if ( st >= elements.lastScrollTop ){
			    methods.unpin();
			  } else {
			    methods.pin();
			  }

			  elements.lastScrollTop = st;
			}
		};

		// jPinning init
		return this.each(function() {
			elements.target = $(this); //Get initialized element
			methods.prepare(); //Prepare element
			$(window).on( 'scroll', methods.debounce( methods.pinHandler, settings.delay ) ); //Call handler on scroll
		});

	};
}( jQuery ));