!(function ($){

    "use strict"; // jsHint

    window.FIFTYFRAMEWORK = {};
    
    var FF      = window.FIFTYFRAMEWORK;
    var iOS     = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
    var DEBUG   = false;

    /* INITIATE FUNCTIONS
    ================================================== */
    FF.init = function(){
        FF.setElements();
        FF.setVars();
        FF.loadScripts();
        FF.scroll();
        FF.modals();
        FF.backStretch();
        FF.hamburgerNav();
        FF.draw();
    };

    /* SET ELEMENTS
    ================================================== */
    FF.setElements = function(){
        FF.el = {};
        FF.el.page_overlay          = $('.page-overlay');
        FF.el.page_wrap             = $('.page-wrap');
        FF.el.mobile_menu_btn       = $('#mobile-menu-toggle');
        FF.el.debug_box             = $('#debug_box');
        FF.el.modal                 = $('.modal');
        FF.el.modal_close           = $('.modal-close');

        // Site Specific
        FF.el.canvas                = $('#c');
    };


    /* SET VARIABLES
    ================================================== */
    FF.setVars = function() {
        // jquery easing plugin init
        // jQuery.easing.def = "string";
    }
    

    /* LOAD SCRIPTS
    ================================================== */
    FF.loadScripts = function(){

        function loadScript(url, callback) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
        }

        // loadScript('assets/js/vendor/skrollr.js', FF.skrollr);
    };


    /* SCROLL (requires .scroll class on anchor)
    ================================================== */
    FF.scroll = function(){

        // <a> method manual
        $('a.scroll, li.scroll > a').click(function(e){
            e.preventDefault();

            var $this       = $(this),
                target_id   = $this.attr('href'),
                target      = $(target_id),
                duration    = (Math.abs($(window).scrollTop() - $(target).offset().top) / 2.5 );
                // duration    = 650;

            animate_scrollTop(target, duration, 'easeInOutExpo', 0);

            console.log(duration);

            // animate_scrollTop();
            function animate_scrollTop(target, duration, easing, offset){
                if(target){
                    if(/(iPhone|iPod)\sOS\s6/.test(navigator.userAgent)){
                        $('html, body').animate({
                            scrollTop: target.offset().top
                        }, duration, easing);
                    } else {
                        $('html, body').animate({
                            scrollTop: target.offset().top - (offset)
                        }, duration, easing);
                    }
                }
            }

        });
    };
    


    /* MODAL EFFECTS
    ================================================== */
    FF.modals = function() {

        // move all modals to the #modals bay
        FF.el.modal.appendTo('#modals');

        // append the modal overlay to the body
        $('body').append('<div class="modal-overlay"></div>');
        var $modal_overlay = $('.modal-overlay');
        
        // set the width/height to the body w/h
        $modal_overlay.width($('body').width()).height($('body').height());

        // modal trigger click function
        $('.modal-trigger, [role="modal-trigger"]').click(function(e) {
            e.preventDefault();

            // set relative vars
            var modal_id        = $(this).data('id'),
                modal_target    = $(modal_id);

            // set modal negative top margin
            modal_target.css('margin-top', '-'+(modal_target.height() / 2)+'px');

            // modal show func
            function modal_show() {
                $modal_overlay.addClass('show');
                setTimeout(function(){
                    modal_target.addClass('show');
                }, 250)
            } modal_show();

            // modal hide func
            function modal_close() {
                modal_target.removeClass('show');
                setTimeout(function(){
                    $modal_overlay.removeClass('show');
                }, 150)
            }

            // esc keyup
            $(document).keyup(function(event) { 
                if (event.keyCode == 27) { modal_close(); } 
            });
            // close button
            FF.el.modal_close.click(function() { modal_close(); });
            // click anywhere on overlay
            $modal_overlay.click(function() { modal_close(); })

        });    
    };


    /* FLEXLOADER
    ================================================== */
    FF.flexLoader = function(obj, options){

        if ( !obj ) { return; }

        obj.flexslider(options);

    };


    /* SKROLLER
    ================================================== */
    FF.skrollr = function(opts) {
        var s = skrollr.init({
          edgeStrategy: 'set',
          easing: {
            WTF: Math.random,
            inverted: function(p) {
              return 1-p;
            }
          }
        });
    };



    /* BACKSTRETCH
    ================================================== */
    FF.backStretch = function() {

        $('.backstretch').each(function(i){
            var img_src = $(this).data('img-src');

            $(this).backstretch(img_src);
        });
    }


    /* HAMBURGER NAV
    ================================================== */
    FF.hamburgerNav = function() {

        FF.el.mobile_menu_btn.toggle(function(e){
            $(this).addClass('open');
            var nav = $(this).siblings('nav');
            nav.slideToggle(150);

        }, function(e){
            $(this).removeClass('open');
            var nav = $(this).siblings('nav');
            nav.slideToggle(150);
        });

    }


    
    /* DRAW
    ================================================== */
    FF.draw = function() {

        var $canvas     = FF.el.canvas,
            canvas      = document.getElementById('c'),
            context     = canvas.getContext('2d'),
            radius      = 3,
            dragging    = false;

        // set height/width (important for bounding and offset accuracy)
        canvas.width    = $canvas.width();
        canvas.height   = $canvas.height();

        // set the stroke width to be same as dot sizes
        context.lineWidth = radius*2;

        /**
         * putPoint()
         * @param [event]
         */
        var putPoint = function(e){
            // if dragging (mousedown event)
            if ( dragging ) {
            /*  
                                     (0) context.beginPath();  - begins new path
               (1)           (2)     (1) context.moveTo(0, 0); - starts at [0,0]
                 |‾‾‾‾‾‾‾‾‾‾‾|       (2) context.moveTo(0, 0); - connects to [100, 0]
                 |           |       (3) context.moveTo(0, 0); - connects to [100, 80]
                 |           |       (4) context.moveTo(0, 0); - connects to [0, 80]
                 |___________|       (5) context.closePath()   - returns to first point
               (3)           (4)     EX: context.stroke()      - draws line as stroke
                                     EX: contex.fill()         - fill shape
            */  

                context.lineTo(e.offsetX, e.offsetY);
                context.stroke();
                context.beginPath();
                // context.arc(x, y, radius, startAngle, endAngle, [antiClockwise])
                // 2(π)r = C,  2(π)r = 360°, (π)rad = 180°, (π/2) = 90°
                // NOTE: use e.clientX/Y instead of e.offsetX/Y for Firefox
                context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
                // fill the circle
                context.fill();
                context.beginPath();
                context.moveTo(e.offsetX, e.offsetY);

            }
        } 

        
        // 

        /**
         * engage()
         */
        var engage = function(e) { 
            dragging = true;
            putPoint(e);
        }

         /**
         * disengage()
         */
        var disengage = function() { 
            dragging = false;
            context.beginPath();
        }

        /**
         * Event Bindings / Listenders
         * TYPES: mousedown, mouseenter, mouseleave, mousemove, mouseout, 
         *        mouseover, mouseup
         */
        canvas.addEventListener('mousedown', engage);
        canvas.addEventListener('mousemove', putPoint);
        canvas.addEventListener('mouseup', disengage);


        /**
         * Canvas Size/Colors/etc Controls
         */
        var rad_less = document.getElementById('rad_less'),
            rad_more = document.getElementById('rad_more'),
            min_rad  = 0.5,
            max_rad  = 80,
            interval = 2;

        rad_less.addEventListener('click', function(){
            set_radius(radius-interval);
        });
        rad_more.addEventListener('click', function(){
            set_radius(radius+interval);
        });

        var set_radius = function(new_rad) {
            if ( new_rad < min_rad ) {
                new_rad = min_rad;
            } else if ( new_rad > max_rad ) {
                new_rad = max_rad;
            }

            radius  = new_rad;
            context.lineWidth = radius*2;
        }


    }


    /* ================================================================ */
    /*                                                                  */
    /*                     DOCUMENT / WINDOW CALLS                      */
    /*                                                                  */
    /* ================================================================ */



    /* DOCUMENT READY
    ================================================== */
    $(document).ready(function(){
        
        // do stuff on document ready
        FF.init();


    });

    /* WINDOW LOAD
    ================================================== */
    $(window).load(function(){
        
        // do stuff once the page has finished loading
        

    });

    /* WINDOW SCROLL
    ================================================== */
    $(window).scroll(function(){

        // DEBUG - winY position
        if (DEBUG) { var winY = $(window).scrollTop(); console.log(winY);}

        

    });


    /* WINDOW RESIZE
    ================================================== */
    $(window).resize(function(){   
        
        // do stuff on window resize


    }).trigger('resize');   


    /* SELF INVOKING ANONYMOUS FUNCTION(s)
    ================================================== */
    (function(){ 

        FF.setVars(); // set variables
        //FF.skrollr(); // skroller init

        if(window.location.hash) {
            // puts hash in variable, and removes the # character
            var hash = window.location.hash.substring(1); 
            
            if (hash === 'CUSTOM_HASH_HERE') {
                // do something when custom hash is in url
            }
        } else {
            // no hash found, don't do anything
        }        

    })();

})(jQuery);

// Viewport selectors - URL: http://www.appelsiini.net/projects/viewport
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);