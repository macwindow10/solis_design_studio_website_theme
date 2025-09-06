(function ($) {

    'use strict';

    window.mkAddons       = {};
    mkAddons.body         = $( 'body' );
    mkAddons.html         = $( 'html' );
    mkAddons.windowWidth  = $( window ).width();
    mkAddons.windowHeight = $( window ).height();
    mkAddons.scroll       = 0;
    mkAddons.window       = $( window );
    mkAddons.widgetsList   = {};

    $( document ).ready( function () {
        mkAddons.scroll = $( window ).scrollTop();
        mkCustomCursor.init();
        mkEyeCursor.init();
        mkArrowCursor.init();
        mkScrollLoad.init();
    });

    $(window).on('resize', function () {
        mkAddons.windowWidth  = $(window).width();
        mkAddons.windowHeight = $(window).height();
    });

    $(window).on('scroll', function() {
        mkAddons.scroll = $(window).scrollTop();
    });

    $( window ).on('load', function () {
        mkScrollLoad.init();
        mkCustomCursor.init();
    });

    function mkExtObserveTarget(target, callback) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    callback(entry);
                }
            });
        }, options);
        observer.observe(target);
    }

    var getElementSettings = function ( $element ) {
        var elementSettings = {},
            modelCID        = $element.data( 'model-cid' );

        if ( elementorFrontend.isEditMode() && modelCID ) {
            var settings     = elementorFrontend.config.elements.data[ modelCID ],
                settingsKeys = elementorFrontend.config.elements.keys[ settings.attributes.widgetType || settings.attributes.elType ];

            jQuery.each( settings.getActiveControls(), function( controlKey ) {
                if ( -1 !== settingsKeys.indexOf( controlKey ) ) {
                    elementSettings[ controlKey ] = settings.attributes[ controlKey ];
                }
            } );
        } else {
            elementSettings = $element.data('settings') || {};
        }

        return elementSettings;
    }

    function mkCursorSelectors($cursorHolder, dragSelectors) {
        const resetCursorSelectors =
                                '.mk--drag-cursor .swiper-button-prev,' +
                                '.mk--drag-cursor .swiper-button-next,' +
                                '.mk--drag-cursor .mk-slider-pn,' +
                                '.mk--drag-cursor a:not(.mk-pf-slider-image-link),' +
                                '.mk--drag-cursor .swiper-pagination',
        $resetCursorSelectors = $(resetCursorSelectors);

        $resetCursorSelectors.css({cursor: 'pointer'});

        $(document).on('mouseenter', resetCursorSelectors, function () {
            $cursorHolder.addClass('mk--hide');
        }).on('mouseleave', resetCursorSelectors, function () {
            $cursorHolder.removeClass('mk--hide');
        });

        $(document).on('mouseenter', dragSelectors, function () {
            $cursorHolder.addClass('mk--show');
        }).on('mouseleave', dragSelectors, function () {
            $cursorHolder.removeClass('mk--show');
        });
    }

    var mkCustomCursor = {
        cursorApended: false,
        init : function () {
            const dragSelectors = '.mk--drag-cursor';
            const $dragSelectors = $(dragSelectors);

            if ($dragSelectors.length) {

                $dragSelectors.each( function () {

                    if (false === mkCustomCursor.cursorApended) {
                        mkAddons.body.append('<div class="mk-custom-cursor mk-cursor-holder"><div class="mk-custom-cursor-inner"><svg enable-background="new 0 0 256 512" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg"><path d="m52.1 245.3 144-160c5.9-6.6 16-7.1 22.6-1.2 6.9 6.3 6.8 16.4 1.2 22.6l-134.4 149.3 134.4 149.3c5.9 6.6 5.4 16.7-1.2 22.6s-16.7 5.4-22.6-1.2l-144-160c-5.5-6.1-5.5-15.3 0-21.4z"/></svg><svg viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg"><path d="m219.898 266.719-144.01 159.99c-5.906 6.562-16.031 7.094-22.593 1.187-6.918-6.271-6.784-16.394-1.188-22.625l134.367-149.271-134.367-149.271c-5.877-6.594-5.361-16.688 1.188-22.625 6.562-5.907 16.687-5.375 22.593 1.187l144.01 159.99c5.469 6.125 5.469 15.313 0 21.438z"/></svg></div></div>');
                        mkCustomCursor.cursorApended = true;
                    }

                    const $cursorHolder = $('.mk-custom-cursor');

                    if ( $(this).hasClass('mk--drag-cursor-light-skin') ) {
                        $cursorHolder.addClass('mk-skin--light');
                    }

                    if (!mkAddons.html.hasClass('touchevents')) {

                        function handleMoveCursor(event) {
                            $cursorHolder.css({
                                top : event.clientY - 45, // half of svg height
                                left: event.clientX - 45, // half of svg width
                            });
                        }

                        document.addEventListener('pointermove', handleMoveCursor);

                        mkCursorSelectors($cursorHolder, dragSelectors);

                    }

                }); // for each

            } // end if
        },
    };

    mkAddons.body.mkCustomCursor = mkCustomCursor;

    // cursor with eye icon
    var mkEyeCursor = {
        cursorApended: false,
        init : function () {
            const dragSelectors = '.mk--eye-cursor';
            const $dragSelectors = $(dragSelectors);

            if ($dragSelectors.length) {

                $dragSelectors.each( function () {

                    if (false === mkEyeCursor.cursorApended) {
                        mkAddons.body.append( '<div class="mk-eye-cursor"><div class="mk-eye-cursor-inner"><span class="mk-eye-cursor-bg"></span><span class="mk-eye-cursor-icon"><svg height="512" viewBox="0 0 128 128" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m64 29.63c-34.76 0-62.36 31.72-63.52 33.07a2 2 0 0 0 0 2.6c1.16 1.35 28.76 33.07 63.52 33.07s62.36-31.72 63.52-33.07a2 2 0 0 0 0-2.6c-1.16-1.35-28.76-33.07-63.52-33.07zm0 64.74c-29 0-53.7-24.37-59.3-30.37 5.6-6 30.24-30.37 59.3-30.37s53.7 24.37 59.3 30.37c-5.6 6-30.24 30.37-59.3 30.37z"/><path d="m64 38.19a25.81 25.81 0 1 0 25.81 25.81 25.84 25.84 0 0 0 -25.81-25.81zm0 47.63a21.81 21.81 0 1 1 21.81-21.82 21.84 21.84 0 0 1 -21.81 21.81z"/></svg></span></div></div>' );
                        mkEyeCursor.cursorApended = true;
                    }

                    const $cursorHolder = $('.mk-eye-cursor');

                    if ( $(this).hasClass('mk--drag-cursor-light-skin') ) {
                        $cursorHolder.addClass('mk-skin--light');
                    }

                    if (!mkAddons.html.hasClass('touchevents')) {

                        let $bg = $cursorHolder.find('.mk-eye-cursor-bg'),
                            $eye = $cursorHolder.find('.mk-eye-cursor-icon'),
                            xMove = 0,
                            yMove = 0;

                        function handleMoveCursorOne( event ) {
                            xMove = (event.clientX - 60).toFixed(2);
                            yMove = (event.clientY - 60).toFixed(2);

                            gsap.to( $bg, {x: xMove, y: yMove, duration: .39, }, );
                            gsap.to( $eye, {x: xMove, y: yMove, duration: .45, }, );

                            !$cursorHolder.hasClass( 'mk--show' ) && $cursorHolder.addClass( 'mk--show' );
                        }

                        $( document ).on('pointermove', dragSelectors, handleMoveCursorOne );

                        mkCursorSelectors($cursorHolder, dragSelectors);

                    }

                }); // for each

            } // end if
        },
    };

    mkAddons.body.mkEyeCursor = mkEyeCursor;


    // on scroll loading animation class
    var mkScrollLoad = {
        init: function () {
            this.holder = $( '.mk-scroll--load:not(.mk--loaded)' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var holder    = $( this ),
                        loadDelay = $( this ).attr( 'data-appear-delay' );

                    if ( ! loadDelay ) {
                        mkScrollLoad.viewPortStatus( holder, function () {
                            holder.addClass( 'mk--loaded' );
                        });
                    } else {
                        loadDelay = (loadDelay === 'random') ? Math.floor( Math.random() * (450 - 10) + 10 ) : loadDelay;
                        mkScrollLoad.viewPortStatus( holder, function () {
                            setTimeout( function () { holder.addClass( 'mk--loaded' ); }, loadDelay );
                        });
                    }
                });
            }
        },
        viewPortStatus: function($item, callback, onlyOnce) {
            if ( $item.length ) {
                var offset   = typeof $item.data( 'viewport-offset' ) !== 'undefined' ? $item.data( 'viewport-offset' ) : 0.15;
                var observer = new IntersectionObserver(
                    function ( entries ) {
                        if ( entries[0].isIntersecting === true ) {
                            callback.call( $item );
                            if ( onlyOnce !== false ) { observer.disconnect(); }
                        }
                    },
                    { threshold: [offset] }
                );
                observer.observe( $item[0] );
            }
        },
    };

    // Get saved content for panel or popup or store it (if first open occured)
    window.mk_prepare_popup_offcanvas_content = function(container, autoplay) {
        var wrapper = jQuery(container);
        // Store popup content to the data-param or restore it when popup open again (second time)
        // if popup contains audio or video or iframe
        if (wrapper.data('popup-content') === undefined) {
            var iframe = wrapper.find('iframe');
            if ( wrapper.find('audio').length
                || wrapper.find('video').length
                || ( iframe.length
                    && ( ( iframe.data('src') && iframe.data('src').search(/(youtu|vimeo|daily|facebook)/i) > 0 )
                        || iframe.attr('src').search(/(youtu|vimeo|daily|facebook)/i) > 0
                        )
                    )
            ) {
                wrapper.data( 'popup-content', wrapper.html() );
            }
        } else {
            wrapper.html( wrapper.data('popup-content') );
            // Remove class 'inited' to reinit elements
            wrapper.find('.inited').removeClass('inited');
        }
        // Replace src with data-src
        wrapper.find('[data-src]').each(function() {
            jQuery(this).attr( 'src', jQuery(this).data('src') );
        });

        // If popup contain essential grid
        var frame = wrapper.find('.esg-grid');
        if ( frame.length > 0 ) {
            var wrappers = [".esg-tc.eec", ".esg-lc.eec", ".esg-rc.eec", ".esg-cc.eec", ".esg-bc.eec"];
            for (var i = 0; i < wrappers.length; i++) {
                frame.find(wrappers[i]+'>'+wrappers[i]).unwrap();
            }
        }
        // Call resize actions for the new content
        mkAddons.window.trigger('resize');
    };

    // Wait element images to loaded
    var mkWaitForImages = {
        check: function ( $element, callback ) {
            if ( $element.length ) {
                var images = $element.find( 'img' );

                if ( images.length ) {
                    var counter = 0;

                    for ( var index = 0; index < images.length; index++ ) {
                        var img = images[index];

                        if ( img.complete ) {
                            counter++;
                            if ( counter === images.length ) { callback.call( $element ); }
                        } else {
                            var image = new Image();

                            image.addEventListener( 'load', function () {
                                counter++;
                                if ( counter === images.length ) {
                                    callback.call( $element );
                                    return false;
                                }
                            }, false );
                            image.src = img.src;
                        }
                    }
                } else {
                    callback.call( $element );
                }
            }
        },
    };

    // Parallax Scrolll Item
    var mkItemParallaxEffect = {

        init: function () {

            if ( !$('.mk-parallax-scroll-item-on').length ) { return; }

            var items = $('.mk-parallax-scroll-item-on .mk-parallax-item:nth-child(2n)'), // even
                dirY = 25,
                itemsOdd = $('.mk-parallax-scroll-item-on .mk-parallax-item:nth-child(2n+1)'), // odd
                dirYOdd = 14;

            var ease = function (a, b, n) {
                return (1 - n) * a + n * b;
            }

            var inView = function (item) {
                if (window.scrollY + window.innerHeight > item.offset().top &&
                    window.scrollY < item.offset().top + item.outerHeight()) {
                    return true
                }
                return false;
            }

            var itemsInView = function (items) {
                return items.filter(function () {
                    return inView($(this))
                });
            }

            var move = function (items, dirY) {
                items.each(function () {
                    var item = $(this);
                    item.data('y', 0);
                    item.data('c', Math.random());
                });

                function loop() {

                    itemsInView(items).each(function () {
                        var item = $(this);
                        var deltaY = (item.offset().top - window.scrollY) / window.innerHeight - 1;

                        item.data('y', ease(item.data('y'), deltaY, item.data('c') * .1));
                        item.css({
                            'transform': 'translate3d(0,' + (dirY * item.data('y')).toFixed(2) + '%,0)',
                        });
                    });
                    requestAnimationFrame(loop);
                }

                requestAnimationFrame(loop);
            }

            if (itemsOdd.length && !Modernizr.touch && mkAddons.windowWidth>=1024) move(itemsOdd, dirYOdd);
            if (items.length && !Modernizr.touch && mkAddons.windowWidth>=1024) move(items, dirY);
        }
    };

    $( document ).ready( function () {
        mkItemParallaxEffect.init();
    });


    // ###########################################################
    // Custom Widgets ############################################
    // ###########################################################

    var mkScrollLoadAnim = function ($scope, $) {
        mkScrollLoad.init();
    }

    mkAddons.widgetsList.mk_title = {};
    mkAddons.widgetsList.mk_title.mkScrollLoadAnim = mkScrollLoadAnim;

    mkAddons.widgetsList.mk_animated_button = {};
    mkAddons.widgetsList.mk_animated_button.mkScrollLoadAnim = mkScrollLoadAnim;

    mkAddons.widgetsList.mk_page_titlebar = {};
    mkAddons.widgetsList.mk_page_titlebar.mkScrollLoadAnim = mkScrollLoadAnim;

    // ----------------------------------------------------------

    var mkAccordion = function ($scope, $) {
        var elementSettings     = getElementSettings( $scope ),
            $accordion_title    = $scope.find(".mk-accordion-tab-title"),
            $accordion_type     = elementSettings.accordion_type,
            $accordion_speed    = elementSettings.toggle_speed;

            // Open default actived tab
            $accordion_title.each(function(){
                if ( $(this).hasClass('mk-accordion-tab-active-default') ) {
                    $(this).addClass('mk-accordion-tab-show mk-accordion-tab-active');
                    $(this).parent().find('.mk-accordion-tab-content').slideDown($accordion_speed);
                    $(this).parent().addClass('mk-accordion-item-active');
                }
            });

            // Remove multiple click event for nested accordion
            $accordion_title.unbind("click");

            $accordion_title.click(function(e) {
                e.preventDefault();

                var $this = $(this);

                if ( $accordion_type === 'accordion' ) {
                    if ( $this.hasClass("mk-accordion-tab-show") ) {
                        $this.removeClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().parent().find(".mk-accordion-tab-title").removeClass("mk-accordion-tab-active-default");
                        $this.parent().find('.mk-accordion-tab-content').slideUp($accordion_speed);
                        $this.parent().removeClass("mk-accordion-item-active");
                    } else {
                        $this.parent().parent().find(".mk-accordion-tab-title").removeClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().parent().find(".mk-accordion-tab-title").removeClass("mk-accordion-tab-active-default");
                        $this.parent().parent().find(".mk-accordion-tab-content").slideUp($accordion_speed);
                        $this.toggleClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().find('.mk-accordion-tab-content').slideToggle($accordion_speed);
                        $this.parent().parent().find(".mk-accordion-item").removeClass("mk-accordion-item-active");
                        $this.parent().toggleClass('mk-accordion-item-active');
                    }
                } else {
                    // For acccordion type 'toggle'
                    if ( $this.hasClass("mk-accordion-tab-show") ) {
                        $this.removeClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().find('.mk-accordion-tab-content').slideUp($accordion_speed);
                        $this.parent().removeClass("mk-accordion-item-active");
                    } else {
                        $this.addClass("mk-accordion-tab-show mk-accordion-tab-active");
                        $this.parent().find('.mk-accordion-tab-content').slideDown($accordion_speed);
                        $this.parent().addClass('mk-accordion-item-active');
                    }
                }
            });
    }

    mkAddons.widgetsList.mk_accordion = {};
    mkAddons.widgetsList.mk_accordion.mkAccordion = mkAccordion;

    // ----------------------------------------------------------

    var mkContactFormSevenStyler = function ($scope, $) {

        if ( 'undefined' == typeof $scope )
            return;

        var cf7SelectFields = $scope.find('select:not([multiple])'),
            cf7Loader = $scope.find('span.ajax-loader');

        cf7SelectFields.wrap( "<span class='mk-cf7-select-custom'></span>" );

        cf7Loader.wrap( "<div class='mk-cf7-loader-active'></div>" );

        var wpcf7event = document.querySelector( '.wpcf7' );

        if( null !== wpcf7event ) {
            wpcf7event.addEventListener( 'wpcf7submit', function( event ) {
                var cf7ErrorFields = $scope.find('.wpcf7-not-valid-tip');
                cf7ErrorFields.wrap( "<span class='mk-cf7-alert'></span>" );
            }, false );
        }

    }

    mkAddons.widgetsList.mk_contact_form_styler = {};
    mkAddons.widgetsList.mk_contact_form_styler.mkContactFormSevenStyler = mkContactFormSevenStyler;

    // ----------------------------------------------------------

    var mkGoogleMap = function ($scope, $) {

            if ( 'undefined' == typeof $scope )
                return;

            var selector                = $scope.find( '.mk-google-map' ).eq(0),
                locations               = selector.data( 'locations' ),
                map_style               = ( selector.data( 'custom-style' ) != '' ) ? selector.data( 'custom-style' ) : '',
                predefined_style        = ( selector.data( 'predefined-style' ) != '' ) ? selector.data( 'predefined-style' ) : '',
                info_window_size        = ( selector.data( 'max-width' ) != '' ) ? selector.data( 'max-width' ) : '',
                m_cluster               = ( selector.data( 'cluster' ) == 'yes' ) ? true : false,
                animate                 = selector.data( 'animate' ),
                auto_center             = selector.data( 'auto-center' ),
                map_options             = selector.data( 'map_options' ),
                i                       = '',
                bounds                  = new google.maps.LatLngBounds(),
                marker_cluster          = [],
                device_size             = elementorFrontend.getCurrentDeviceMode();

            if( 'drop' == animate ) {
                var animation = google.maps.Animation.DROP;
            } else if( 'bounce' == animate ) {
                var animation = google.maps.Animation.BOUNCE;
            }

            var skins = {
                "silver" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f5f5f5\"}]},{\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#f5f5f5\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#bdbdbd\"}]},{\"featureType\":\"poi\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#eeeeee\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#e5e5e5\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#ffffff\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dadada\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#e5e5e5\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#eeeeee\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#c9c9c9\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]}]",

                "retro" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#ebe3cd\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#523735\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#f5f1e6\"}]},{\"featureType\":\"administrative\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#c9b2a6\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#dcd2be\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#ae9e90\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"poi\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#93817c\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#a5b076\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#447530\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f5f1e6\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#fdfcf8\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f8c967\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#e9bc62\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#e98d58\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#db8555\"}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#806b63\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#8f7d77\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#ebe3cd\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#dfd2ae\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#b9d3c2\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#92998d\"}]}]",

                "dark" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#212121\"}]},{\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#212121\"}]},{\"featureType\":\"administrative\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9e9e9e\"}]},{\"featureType\":\"administrative.land_parcel\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"administrative.locality\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#bdbdbd\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#181818\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1b1b1b\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#2c2c2c\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#8a8a8a\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#373737\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#3c3c3c\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#4e4e4e\"}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#616161\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#757575\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#000000\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#3d3d3d\"}]}]",

                "night" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#242f3e\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#746855\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#242f3e\"}]},{\"featureType\":\"administrative.locality\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#d59563\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#d59563\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#263c3f\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#6b9a76\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#38414e\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#212a37\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#9ca5b3\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#746855\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#1f2835\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#f3d19c\"}]},{\"featureType\":\"transit\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#2f3948\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#d59563\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#17263c\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#515c6d\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#17263c\"}]}]",

                "aubergine" : "[{\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#8ec3b9\"}]},{\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1a3646\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#4b6878\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#64779e\"}]},{\"featureType\":\"administrative.province\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#4b6878\"}]},{\"featureType\":\"landscape.man_made\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#334e87\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#023e58\"}]},{\"featureType\":\"poi\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#283d6a\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#6f9ba5\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#023e58\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#3C7680\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#304a7d\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#98a5be\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#2c6675\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#255763\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#b0d5ce\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#023e58\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#98a5be\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.text.stroke\",\"stylers\":[{\"color\":\"#1d2c4d\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#283d6a\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#3a4762\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#0e1626\"}]},{\"featureType\":\"water\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#4e6d70\"}]}]",

                "magnesium" : "[{\"featureType\":\"all\",\"stylers\":[{\"saturation\":0},{\"hue\":\"#e7ecf0\"}]},{\"featureType\":\"road\",\"stylers\":[{\"saturation\":-70}]},{\"featureType\":\"transit\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"water\",\"stylers\":[{\"visibility\":\"simplified\"},{\"saturation\":-60}]}]",

                "classic_blue" : "[{\"featureType\":\"all\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.country\",\"elementType\":\"labels.text\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.province\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.province\",\"elementType\":\"labels.text\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.locality\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"administrative.neighborhood\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"administrative.land_parcel\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"landscape\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#FFBB00\"},{\"saturation\":43.400000000000006},{\"lightness\":37.599999999999994},{\"gamma\":1}]},{\"featureType\":\"landscape\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"saturation\":\"-40\"},{\"lightness\":\"36\"}]},{\"featureType\":\"landscape.man_made\",\"elementType\":\"geometry\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"saturation\":\"-77\"},{\"lightness\":\"28\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#00FF6A\"},{\"saturation\":-1.0989010989011234},{\"lightness\":11.200000000000017},{\"gamma\":1}]},{\"featureType\":\"poi\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.attraction\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"saturation\":\"-24\"},{\"lightness\":\"61\"}]},{\"featureType\":\"road\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"visibility\":\"on\"}]},{\"featureType\":\"road\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#FFC200\"},{\"saturation\":-61.8},{\"lightness\":45.599999999999994},{\"gamma\":1}]},{\"featureType\":\"road.highway\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.highway.controlled_access\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#FF0300\"},{\"saturation\":-100},{\"lightness\":51.19999999999999},{\"gamma\":1}]},{\"featureType\":\"road.local\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#ff0300\"},{\"saturation\":-100},{\"lightness\":52},{\"gamma\":1}]},{\"featureType\":\"road.local\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"geometry\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit.line\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit.station\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"water\",\"elementType\":\"all\",\"stylers\":[{\"hue\":\"#0078FF\"},{\"saturation\":-13.200000000000003},{\"lightness\":2.4000000000000057},{\"gamma\":1}]},{\"featureType\":\"water\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]}]",

                "aqua" : "[{\"featureType\":\"administrative\",\"elementType\":\"labels.text.fill\",\"stylers\":[{\"color\":\"#444444\"}]},{\"featureType\":\"landscape\",\"elementType\":\"all\",\"stylers\":[{\"color\":\"#f2f2f2\"}]},{\"featureType\":\"poi\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road\",\"elementType\":\"all\",\"stylers\":[{\"saturation\":-100},{\"lightness\":45}]},{\"featureType\":\"road.highway\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"simplified\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"labels.icon\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"transit\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"water\",\"elementType\":\"all\",\"stylers\":[{\"color\":\"#46bcec\"},{\"visibility\":\"on\"}]}]",

                "earth" : "[{\"featureType\":\"landscape.man_made\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#f7f1df\"}]},{\"featureType\":\"landscape.natural\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#d0e3b4\"}]},{\"featureType\":\"landscape.natural.terrain\",\"elementType\":\"geometry\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.business\",\"elementType\":\"all\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"poi.medical\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#fbd3da\"}]},{\"featureType\":\"poi.park\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#bde6ab\"}]},{\"featureType\":\"road\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road\",\"elementType\":\"labels\",\"stylers\":[{\"visibility\":\"off\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#ffe15f\"}]},{\"featureType\":\"road.highway\",\"elementType\":\"geometry.stroke\",\"stylers\":[{\"color\":\"#efd151\"}]},{\"featureType\":\"road.arterial\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#ffffff\"}]},{\"featureType\":\"road.local\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"black\"}]},{\"featureType\":\"transit.station.airport\",\"elementType\":\"geometry.fill\",\"stylers\":[{\"color\":\"#cfb2db\"}]},{\"featureType\":\"water\",\"elementType\":\"geometry\",\"stylers\":[{\"color\":\"#a2daf2\"}]}]"
            };

            if( 'undefined' != typeof skins[predefined_style] ) {
                map_style = JSON.parse( skins[predefined_style] );
            }


            ( function initMap () {

                var latlng = new google.maps.LatLng( locations[0][0], locations[0][1] );

                map_options.center = latlng;
                map_options.styles = map_style;

                var map = new google.maps.Map( $scope.find( '.mk-google-map' )[0], map_options );
                var infowindow = new google.maps.InfoWindow();

                for ( i = 0; i < locations.length; i++ ) {

                    var title = locations[i][3];
                    var description = locations[i][4];
                    var icon_size = parseInt( locations[i][7] );
                    var icon_type = locations[i][5];
                    var icon = '';
                    var icon_url = locations[i][6];
                    var enable_iw = locations[i][2];
                    var click_open = locations[i][8];
                    var lat = locations[i][0];
                    var lng = locations[i][1];

                    if( 'undefined' === typeof locations[i] ) {
                        return;
                    }

                    if ( '' != lat.length && '' != lng.length ) {

                        if ( 'custom' == icon_type ) {

                            icon = {
                                url: icon_url,
                            };
                            if( ! isNaN( icon_size ) ) {

                                icon.scaledSize = new google.maps.Size( icon_size, icon_size );
                                icon.origin = new google.maps.Point( 0, 0 );
                                icon.anchor = new google.maps.Point( icon_size/2, icon_size );

                            }
                        }

                        var marker = new google.maps.Marker( {
                            position:       new google.maps.LatLng( lat, lng ),
                            map:            map,
                            title:          title,
                            icon:           icon,
                            animation:      animation
                        });

                        if( locations.length > 1 ) {

                            // Extend the bounds to include each marker's position
                            bounds.extend( marker.position );
                        }

                        marker_cluster[i] = marker;

                        if ( enable_iw && 'iw_open' == click_open ) {

                            var content_string = '<div class="mk-infowindow-content"><div class="mk-infowindow-title">' + title + '</div>';

                            if ( '' != description.length ) {
                                content_string += '<div class="mk-infowindow-description">' + description + '</div>';
                            }
                            content_string += '</div>';

                            if ( '' != info_window_size  ) {
                                var width_val = parseInt( info_window_size );
                                var infowindow = new google.maps.InfoWindow( {
                                    content: content_string,
                                    maxWidth: width_val
                                } );
                            } else {
                                var infowindow = new google.maps.InfoWindow( {
                                    content: content_string,
                                } );
                            }

                            infowindow.open( map, marker );
                        }

                        // Adding close event for info window
                        google.maps.event.addListener( map, 'click', ( function ( infowindow ) {

                            return function() {
                                infowindow.close();
                            }
                        })( infowindow ));

                        if ( enable_iw && '' != locations[i][3] ) {

                            google.maps.event.addListener( marker, 'click', ( function( marker, i ) {
                                return function() {
                                    var infowindow = new google.maps.InfoWindow();
                                    var content_string = '<div class="mk-infowindow-content"><div class="mk-infowindow-title">' + locations[i][3] + '</div>';

                                    if ( '' != locations[i][4].length ) {
                                        content_string += '<div class="mk-infowindow-description">' + locations[i][4] + '</div>';
                                    }

                                    content_string += '</div>';

                                    infowindow.setContent( content_string );

                                    if ( '' != info_window_size ) {
                                        var width_val = parseInt( info_window_size );
                                        var InfoWindowOptions = { maxWidth : width_val };
                                        infowindow.setOptions( { options:InfoWindowOptions } );
                                    }

                                    infowindow.open( map, marker );
                                }
                            })( marker, i ));
                        }
                    }
                }

                if( locations.length > 1 ) {

                    if ( 'center' == auto_center ) {

                        // Now fit the map to the newly inclusive bounds.
                        map.fitBounds( bounds );
                    }

                    // Restore the zoom level after the map is done scaling.
                    var listener = google.maps.event.addListener( map, "idle", function () {
                        map.setZoom( map_options.zoom );
                        google.maps.event.removeListener( listener );
                    });
                }

                var cluster_listener = google.maps.event.addListener( map, "idle", function () {

                    if( 0 < marker_cluster.length && m_cluster ) {

                        var markerCluster = new MarkerClusterer(
                            map,
                            marker_cluster,
                            {
                                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                            }
                        );
                    }
                    google.maps.event.removeListener( cluster_listener );
                });


            })();
        }

    mkAddons.widgetsList.mk_google_map = {};
    mkAddons.widgetsList.mk_google_map.mkGoogleMap = mkGoogleMap;

    // ----------------------------------------------------------

    var mkVideo = function ($scope, $) {

        var shalPlayVideo = {

            /* Auto Play Video */
            _play: function( selector ) {

                var iframe      = $( "<iframe/>" );
                var vurl        = selector.data( 'src' );

                if ( 0 == selector.find( 'iframe' ).length ) {

                    iframe.attr( 'src', vurl );
                    iframe.attr( 'frameborder', '0' );
                    iframe.attr( 'allowfullscreen', '1' );
                    iframe.attr( 'allow', 'autoplay;encrypted-media;' );

                    selector.html( iframe );
                }

                selector.closest( '.mk-video-container' ).find( '.mk-video-vimeo-wrap' ).hide();
            }
        }

        var video_container = $scope.find( '.mk-video-container' );
        var video_holder = $scope.find( '.mk-video-holder' );

        video_container.off( 'click' ).on( 'click', function( e ) {

            var selector = $( this ).find( '.mk-video__play' );

            shalPlayVideo._play( selector );
        });

        if( '1' == video_container.data( 'autoplay' ) || true == video_container.data( 'device' ) ) {

            shalPlayVideo._play( $scope.find( '.mk-video__play' ) );
        }

    }

    mkAddons.widgetsList.mk_video = {};
    mkAddons.widgetsList.mk_video.mkVideo = mkVideo;

    // ----------------------------------------------------------

    var mkVideoIcon = function ($scope, $) {
        var $this = $scope.find('.mk-video-lightbox'),
            popupDisable = $this.data('hide-popup');

        $this.magnificPopup({
            disableOn: popupDisable, // disable popup
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }

    mkAddons.widgetsList.mk_video_icon = {};
    mkAddons.widgetsList.mk_video_icon.mkVideoIcon = mkVideoIcon;

    mkAddons.widgetsList.mk_circle_text = {};
    mkAddons.widgetsList.mk_circle_text.mkVideoIcon = mkVideoIcon;

    // ----------------------------------------------------------

    var mkSearch = function ($scope, $) {

        $($scope).each(function() {

            var $this = $(this);

            var searchIcon = $this.find(".mk-search-icon");
            var searchForm = $this.find(".mk_search_form");
            var searchWrapper = $this.find(".mk-search-wrapper");

            searchIcon.each(function() {
                var iconBtn = $(this);
                var iconInput = iconBtn.find('a'),
                iconParent = iconBtn.parent();

                iconInput.bind('click', function () {
                    var openDiv = $(this).attr('data-open');
                    iconParent.find('#'+openDiv).addClass('active');

                    $('body').addClass('elementor-no-overflow');
                    $('body').addClass('elementor-search-activate');

                });
            });

            searchForm.each(function() {

                var $self = $(this);

                var wrapper = $self.attr('data-open');
                var formInput = $self.find('input[name="s"]');
                var resultDiv = $self.attr('data-result');

                formInput.bind('click', function () {
                    $("#"+resultDiv).addClass('visible');
                    $("#"+resultDiv).attr('data-mousedown', 'true');
                });

                formInput.bind('focus', function () {
                    $("#"+resultDiv).addClass('visible');
                    formInput.addClass('visible');
                });

                formInput.bind('blur', function () {
                    $("#"+resultDiv).removeClass('visible');
                    formInput.removeClass('visible');
                });

                searchWrapper.bind('click', function () {
                    if(!formInput.hasClass('visible')) {
                        if($("#"+resultDiv).attr('data-mousedown') != 'true') {
                            $("#"+resultDiv).removeClass('visible');
                        }
                        searchWrapper.removeClass('active');
                        $('body').removeClass('elementor-no-overflow');
                        $('body').removeClass('elementor-search-activate');
                    }
                });
            });

        });

    }

    mkAddons.widgetsList.mk_search = {};
    mkAddons.widgetsList.mk_search.mkSearch = mkSearch;

    // ----------------------------------------------------------

    var mkPopup = function ($scope, $) {

        var $window             = jQuery( window ),
            $document           = jQuery( document ),
            $html               = jQuery( 'html' ),
            $body               = jQuery( 'body' ),
            $adminbar           = jQuery( '#wpadminbar' ),
            _adminbar_height    = $adminbar.length === 0 || $adminbar.css( 'display' ) == 'none' || $adminbar.css( 'position' ) == 'absolute' ? 0 : $adminbar.height();

        window.mk_get_cookie = function(name) {
            var defa = arguments[1] !== undefined ? arguments[1] : null;
            var start = document.cookie.indexOf(name + '=');
            var len = start + name.length + 1;
            if ((!start) && (name != document.cookie.substring(0, name.length))) {
                return defa;
            }
            if (start == -1) { return defa; }
            var end = document.cookie.indexOf(';', len);
            if (end == -1) { end = document.cookie.length; }
            return decodeURIComponent(document.cookie.substring(len, end));
        };

        window.mk_set_cookie = function(name, value) {

            var expires  = arguments[2] !== undefined ? arguments[2] : 24 * 60 * 60 * 1000; // 24 hours
            var path     = arguments[3] !== undefined ? arguments[3] : '/';
            var domain   = arguments[4] !== undefined ? arguments[4] : '';
            var secure   = arguments[5] !== undefined ? arguments[5] : '';
            var samesite = arguments[6] !== undefined ? arguments[6] : 'strict';    // strict | lax | none
            var today    = new Date();
            today.setTime(today.getTime());
            var expires_date = new Date(today.getTime() + (expires * 1));
            document.cookie = encodeURIComponent(name) + '='
                    + encodeURIComponent(value)
                    + (expires ? ';expires=' + expires_date.toGMTString() : '')
                    + (path    ? ';path=' + path : '')
                    + (domain  ? ';domain=' + domain : '')
                    + (secure  ? ';secure' : '')
                    + (samesite  ? ';samesite=' + samesite : '');
        };

        // popups & panels content

        var on_leaving_site = [],
            in_page_edit_mode = $body.hasClass('elementor-editor-active')
                                || $body.hasClass('wp-admin')
                                || $body.hasClass('block-editor-page');

        // Init popups and panels links
        $body.find('.mk_sections_popup:not(.inited)').each( function() {

            var $self = jQuery(this),
                id = $self.data('trigger-id'),
                esckey = $self.data('esckey'),
                show = false;
            if (!id) return;

            // add background color dark/light skin
            var $bg_skin = $self.data('skin');
            $body.addClass('popup-bg-skin-'+$bg_skin);

            // close popup with escape key
            if ( 'yes' == esckey ) {
                jQuery(document).on('keydown', function (event) {
                    if (27 === event.keyCode) {
                        mk_close_popup($self);
                    }
                });
            }

            var link = jQuery('a[href="#'+id+'"],' + ( '.mk_popup_link[data-popup-id="'+id+'"]' ) );

            if (link.length === 0) {
                $body.append('<a href="#'+id+'" class="mk_hidden"></a>');
                link = jQuery('a[href="#'+id+'"]');
            }

            if ($self.hasClass('mk_sections_show_on_page_load')) {
                show = true;
            } else if ($self.hasClass('mk_sections_show_on_page_load_once') && mk_get_cookie('mk_show_on_page_load_once_'+id) != '1') {
                mk_set_cookie('mk_show_on_page_load_once_'+id, '1');
                show = true;
            } else if ($self.hasClass('mk_sections_show_on_page_close') && mk_get_cookie('mk_show_on_page_close_'+id) != '1') {
                on_leaving_site.push({ link: link, id: id });
            }

            if (show) {
                // Display popups on the page (site) load
                if ( ! in_page_edit_mode ) {
                    setTimeout( function() {
                        link.trigger('click'); // on click -> mk_popup_link
                    }, 0);
                }
            }

            link.addClass('mk_popup_link')
                .data('popup', $self);

        }); // body.... .each

        // Display popup when user leaving site
        if ( on_leaving_site.length > 0 && ! in_page_edit_mode ) {
            var showed = false;
            $window.on( 'mousemove', function(e) {
                if ( showed ) return;
                var y = typeof e.clientY != 'undefined' ? e.clientY : 999;
                if ( y < _adminbar_height + 15 ) {
                    showed = true;
                    on_leaving_site.forEach( function(item) {
                        item.link.trigger('click');
                        mk_set_cookie('mk_show_on_page_close_'+item.id, '1');
                    });
                }
            } );
        }

        // Close popup
        window.mk_close_popup = function(panel) {
            if ( panel.hasClass('mk_sections_popup') ) {
                // $document.trigger('action.close_popup_elements', [panel]);
            }
            setTimeout( function() {
                panel.removeClass('mk_sections_popup_active');
                if (panel.prev().hasClass('mk-off-canvas-overlay')) {
                    panel.prev().removeClass('mk_sections_popup_active');
                }

                $body.removeClass('mk_sections_popup_active');

                if ( panel.data('popup-content') !== undefined ) {
                    setTimeout( function() { panel.empty(); }, 500 );
                }
            }, 0 );
        };

        // Display lightbox on click on the popup link
        $body.find( '.mk_popup_link:not(.popup_inited)' )
            .addClass('popup_inited')
            .magnificPopup({
                type: 'inline',
                focus: 'input',
                removalDelay: 0,
                tLoading: 'Loading...',
                tClose: 'Close (Esc)',
                closeBtnInside: true,
                callbacks: {
                    // Will fire when this exact popup is opened this - is Magnific Popup object
                    open: function () {
                        // Get saved content or store it (if first open occured)
                        mk_prepare_popup_offcanvas_content(this.content, true);
                    },
                    close: function () {
                        var $mfp = this;
                        // Save and remove content before closing if its contain video, audio or iframe
                        mk_close_popup($mfp.content);
                    },
                    // resize event triggers only when height is changed or layout forced
                    resize: function () {
                        var $mfp = this;
                        // mk_resize_actions(jQuery($mfp.content));
                    }
                }
            });

    };

    mkAddons.widgetsList.mk_popup = {};
    mkAddons.widgetsList.mk_popup.mkPopup = mkPopup;

    // ----------------------------------------------------------

    var mkOffCanvas = function ($scope, $) {

        var $window             = jQuery( window ),
            $document           = jQuery( document ),
            $html               = jQuery( 'html' ),
            $body               = jQuery( 'body' ),
            $adminbar           = jQuery( '#wpadminbar' ),
            _adminbar_height    = $adminbar.length === 0 || $adminbar.css( 'display' ) == 'none' || $adminbar.css( 'position' ) == 'absolute' ? 0 : $adminbar.height();

        var $hamburgerIcon = $scope.find('.mk-hamburger-icon-holder');

        if ( $hamburgerIcon.length ) {
            $hamburgerIcon.html('<span class="mk-hamburger-icon-sp1"></span><span class="mk-hamburger-icon-sp2"></span><span class="mk-hamburger-icon-sp3"></span><span class="mk-hamburger-icon-sp4"></span><span class="mk-hamburger-icon-sp5"></span><span class="mk-hamburger-icon-sp6"></span>');
        }

        $hamburgerIcon.html();

        // Off-Canvas content

        var on_leaving_site = [],
            in_page_edit_mode = $body.hasClass('elementor-editor-active')
                                || $body.hasClass('wp-admin')
                                || $body.hasClass('block-editor-page');

        // Init Off-Canvas links
        $body.find('.mk-off-canvas:not(.inited)').each( function() {

            var $self = jQuery(this),
                getOffCanvasId = $self.data('offcanvas-id'),
                esckey = $self.data('esckey'),
                show = false;
            if (!getOffCanvasId) return;

            $self.attr( 'id', getOffCanvasId ); // add ID attribute

            // close offcanvas with escape key
            if ( 'yes' == esckey ) {
                jQuery(document).on('keydown', function (event) {
                    if (27 === event.keyCode) {
                        mk_close_offcanvas($self);
                    }
                });
            }

            var link = jQuery('a[href="#'+getOffCanvasId+'"],' + ( '.mk_off_canvas_link[data-offcanvas-id="'+getOffCanvasId+'"]' ) );

            if (link.length === 0) {
                $body.append('<a href="#'+getOffCanvasId+'" class="mk_hidden"></a>');
                link = jQuery('a[href="#'+getOffCanvasId+'"]');
            }

            link.addClass('mk_off_canvas_link')
                .data('offcanvas', $self);

            $self.addClass('inited')
                 .on('click', '.mk-off-canvas-close', function(e) {
                    mk_close_offcanvas($self);
                    e.preventDefault();
                    return false;
                });

        }); // body.... .each

        // Open Off-Canvas on click on the off-canvas link
        $body.find( '.mk_off_canvas_link:not(.offcanvas_inited)' )
            .addClass('offcanvas_inited')
            .on('click', function(e) {

                var offCanvas = jQuery(this).data('offcanvas');
                if ( ! offCanvas.hasClass( 'mk-off-canvas-active' ) ) {

                    mk_prepare_popup_offcanvas_content(offCanvas, true);
                    offCanvas.addClass('mk-off-canvas-active');
                    $document.trigger('action.opened_popup_elements', [offCanvas]);

                    if (offCanvas.prev().hasClass('mk-off-canvas-overlay')) {
                        offCanvas.prev().addClass('mk-off-canvas-active');
                    }

                    $body.addClass('mk-off-canvas-active');
                } else {
                    mk_close_offcanvas(offCanvas);
                }
                e.preventDefault();
                return false;
            });

        // Close off-canvas on click on the modal cover
        $body.find('.mk-off-canvas-overlay:not(.inited)')
            .addClass('inited')
            .on('click', function(e) {
                mk_close_offcanvas(jQuery(this).next());
                e.preventDefault();
                return false;
            });

        // Close off-canvas
        window.mk_close_offcanvas = function(offCanvas) {
            setTimeout( function() {
                offCanvas.removeClass('mk-off-canvas-active');
                if (offCanvas.prev().hasClass('mk-off-canvas-overlay')) {
                    offCanvas.prev().removeClass('mk-off-canvas-active');
                }

                $body.removeClass('mk-off-canvas-active mk-off-canvas-active_left mk-off-canvas-active_right');

                if ( offCanvas.data('off-canvas-content') !== undefined ) {
                    setTimeout( function() { offCanvas.empty(); }, 500 );
                }
            }, 0 );
        };

    };

    mkAddons.widgetsList.mk_off_canvas = {};
    mkAddons.widgetsList.mk_off_canvas.mkOffCanvas = mkOffCanvas;

    // ----------------------------------------------------------

    var mkCart = function ($scope, $) {

        var $window             = jQuery( window ),
            $body               = jQuery( 'body' ),
            $adminbar           = jQuery( '#wpadminbar' );

        // panels content
        var in_page_edit_mode = $body.hasClass('elementor-editor-active')
                                || $body.hasClass('wp-admin')
                                || $body.hasClass('block-editor-page');

        // Init panels links
        $body.find('.mk-cart-panel:not(.inited)').each( function() {

            var $self = jQuery(this),
                id = $self.data('trigger-id'),
                esckey = $self.data('esckey');

            if (!id) return;

            // close panel with escape key
            if ( 'yes' == esckey ) {
                jQuery(document).on('keydown', function (event) {
                    if (27 === event.keyCode) {
                        mk_close_cart_panel($self);
                    }
                });
            }

            var link = jQuery('a[href="#'+id+'"],.mk-cart-panel-link[data-panel-id="'+id+'"]' );

            if (link.length === 0) {
                $body.append('<a href="#'+id+'" class="mk-hidden"></a>');
                link = jQuery('a[href="#'+id+'"]');
            }

            link.addClass('mk-cart-panel-link')
                .data('panel', $self);

            $self.addClass('inited')
                 .on('click', '.mk-cart-panel-close', function(e) {
                    mk_close_cart_panel($self);
                    e.preventDefault();
                    return false;
                });

        }); // body.... .each

        // Open panel on click on the panel link
        $body.find( '.mk-cart-panel-link:not(.panel_inited)' )
            .addClass('panel_inited')
            .on('click', function(e) {

                var panel = jQuery(this).data('panel');
                if ( ! panel.hasClass( 'mk-cart-panel-active' ) ) {
                    panel.addClass('mk-cart-panel-active');
                    if (panel.prev().hasClass('mk-cart-panel-overlay')) panel.prev().addClass('mk-cart-panel-active');
                    $body.addClass('mk-cart-panel-active mk-cart-panel-active-' + panel.data('panel-position'));
                } else {
                    mk_close_cart_panel(panel);
                }
                e.preventDefault();
                return false;
            });

        // Close panel on click on the modal cover
        $body.find('.mk-cart-panel-overlay:not(.inited)')
            .addClass('inited')
            .on('click', function(e) {
                mk_close_cart_panel(jQuery(this).next());
                e.preventDefault();
                return false;
            });

        // Close panel
        window.mk_close_cart_panel = function(panel) {
            setTimeout( function() {
                panel.removeClass('mk-cart-panel-active');
                if (panel.prev().hasClass('mk-cart-panel-overlay')) {
                    panel.prev().removeClass('mk-cart-panel-active');
                }

                $body.removeClass('mk-cart-panel-active mk-cart-panel-active-left mk-cart-panel-active-right');

            }, 0 );
        };

    };

    mkAddons.widgetsList.mk_cart = {};
    mkAddons.widgetsList.mk_cart.mkCart = mkCart;

    // ----------------------------------------------------------

    var mkImage = function ($scope, $) {

        var mkImageFigureLink = $scope.find( '.mk-image figure a' ),
            cursonIcon          = mkImageFigureLink.data('cursor-icon') ? mkImageFigureLink.data('cursor-icon') : '';
        if (cursonIcon.length) {
            mkImageFigureLink.css('cursor','url(' + cursonIcon + '),auto');
        }

        if ($scope.hasClass('mk-custom-image-appear-reveal')) {
            var mkImageFigure = $scope.find( '.mk-image figure' )[0];

            if (mkImageFigure) {

                var revealColor     = $(mkImageFigure).data('reveal-color'),
                    revealDirection = $(mkImageFigure).data('reveal-direction'),
                    revealDuration  = $(mkImageFigure).data('reveal-duration'),
                    revealDelay     = $(mkImageFigure).data('reveal-delay'),
                    revealViewport  = $(mkImageFigure).data('reveal-viewport'),
                    finalViewPort   = revealViewport * -1,
                    watcher_1       = scrollMonitor.create(mkImageFigure, finalViewPort);

                var revealBlock = new RevealFx(mkImageFigure, {
                            revealSettings : {
                                bgColors: [revealColor],
                                delay: revealDelay,
                                direction:revealDirection,
                                duration: revealDuration,
                                onHalfway: function(contentEl, revealerEl) {
                                    contentEl.style.opacity = 1;
                                }
                            }
                        });

                watcher_1.enterViewport(function() {
                    revealBlock.reveal();
                    watcher_1.destroy();
                });
            }
        }

        mkScrollLoad.init();

    }

    mkAddons.widgetsList.mk_image = {};
    mkAddons.widgetsList.mk_image.mkImage = mkImage;

    // ----------------------------------------------------------

    var mkIconButton = function ($scope, $) {
        var mkIconButton = $scope.find('.mk-icon-button');

        if ( mkIconButton.length > 0 ) {
            if ( mkIconButton.hasClass( 'mk-icon-button-type--icon-boxed' ) ) {
                var $buttonIcon = mkIconButton.find( '.mk-icon-button-icon' ),
                    height      = mkIconButton.find( '.mk-icon-button-text-holder' ).outerHeight();
                $buttonIcon.css('width', height );
            }
        }
    };

    mkAddons.widgetsList.mk_icon_button = {};
    mkAddons.widgetsList.mk_icon_button.mkIconButton = mkIconButton;

    // ----------------------------------------------------------

    var mkMediaReveal = {

        init: function () {
            let $holder = $( '.mk-reveal-image-wrapper' );

            if ( $holder.length ) {

                gsap.defaults({overwrite: "auto"});
                gsap.registerPlugin(ScrollTrigger);
                gsap.config({nullTargetWarn: false});

                $holder.each( function () {
                    let $thisHolder = $( this );
                    mkMediaReveal.initItem($thisHolder);
                });
            }
        },
        initItem: function ($holder){

            // Clipped Image
            gsap.utils.toArray($holder).forEach((revealMediaWrapper) => {

                let $holder_id = $holder.attr( 'id' );

                const revealMediaPin      = revealMediaWrapper.querySelector('#' + $holder_id + ' .mk-reveal-image-pin'),
                      revealMedia         = revealMediaWrapper.querySelector('#' + $holder_id + ' .mk-reveal-image'),
                      revealMediaContent  = revealMediaWrapper.querySelector('#' + $holder_id + ' .mk-reveal-image-content');

                gsap.set(revealMediaContent, { paddingTop: (window.innerHeight/2) + revealMediaContent.offsetHeight});

                function mkSetMediaRevealImages() {
                    gsap.set(revealMediaContent, { paddingTop:""});
                    gsap.set(revealMedia, { height: window.innerHeight, });
                    gsap.set(revealMediaContent, { paddingTop: (window.innerHeight/2) + revealMediaContent.offsetHeight});
                    gsap.set(revealMediaWrapper, { height: window.innerHeight + revealMediaContent.offsetHeight});
                }

                imagesLoaded('body', function() {
                    mkSetMediaRevealImages();
                });

                window.addEventListener('resize', mkSetMediaRevealImages);

                var revealMediaAnimation = gsap.to(revealMedia, {
                    clipPath: 'inset(0% 0% 0%)',
                    scale: 1,
                    duration: 1,
                    ease: 'Linear.easeNone'
                });

                var revealMediaScene = ScrollTrigger.create({
                    trigger: revealMediaPin,
                    start: function() {
                        const startPin = 0;
                        return "top +=" + startPin;
                      },
                    end: function() {
                        const endPin = revealMediaContent.offsetHeight;
                        return "+=" + endPin;
                    },
                    animation: revealMediaAnimation,
                    scrub: 1,
                    pin: true,
                    pinSpacing: false,
                });

            });

            // Elements Animation
            var contentVideo = gsap.utils.toArray('.mk-media-reveal-video');
            contentVideo.forEach(function(videoPlay) {
                var video = videoPlay.querySelector("video");

                var videoScene = ScrollTrigger.create({
                    trigger: videoPlay,
                    start: "top 100%",
                    end: () => `+=${videoPlay.offsetHeight + window.innerHeight*2}`,
                    onEnter: function() { video.play(); },
                    onLeave: function() { video.pause(); },
                    onEnterBack: function() { video.play(); },
                    onLeaveBack: function() { video.pause(); },
                });
            });

            // Reinit All Scrolltrigger After Page Load
            imagesLoaded('body', function() {
                setTimeout(function() {
                    ScrollTrigger.refresh()
                }, 1000);
            });

        }
    };

    mkAddons.widgetsList.mk_media_reveal = {};
    mkAddons.widgetsList.mk_media_reveal.mkMediaReveal = mkMediaReveal;

    $( document ).ready( function () {
        mkMediaReveal.init();
    });

    // ----------------------------------------------------------

    var mkCircleButton = function ($scope, $) {

        var $holder = $scope.find( '.mk-circle-button' );

        if ( $holder.length ) {


            $holder.each(function () {

                $( this ).on('mouseenter', function (e) {
                    var x = e.pageX - $(this).offset().left;
                    var y = e.pageY - $(this).offset().top;

                    $(this).find('span.mk-circle-button-dot').css({ top: y, left: x });
                  });

                  $( this ).on('mouseout', function (e) {
                    var x = e.pageX - $(this).offset().left;
                    var y = e.pageY - $(this).offset().top;

                    $(this).find('span.mk-circle-button-dot').css({ top: y, left: x });
                  });

            });

        }

    }

    mkAddons.widgetsList.mk_circle_button = {};
    mkAddons.widgetsList.mk_circle_button.mkCircleButton = mkCircleButton;

    // ----------------------------------------------------------

    var mkAnimatedContent = function ($scope, $) {
        var $currentItem = $scope.find('.mk-animated-content.mk--animated-by-letter');
        var $words = $currentItem.find( '.mk-ac-word-holder' );

        mkScrollLoad.init();

        $words.each(
            function () {
                let $word       = $( this ).text(),
                    $split_word = '';

                for (var i = 0; i < $word.length; i++) {
                    $split_word += '<span class="mk-ac-character">' + $word.charAt( i ) + '</span>';
                }

                $( this ).html( $split_word );
            }
        );

        let $characters = $currentItem.find( '.mk-ac-character' );

        $characters.each(
            function (index) {
                let $character         = $( this ),
                    transitionModifier = $currentItem.hasClass( 'mk--appear-from-left' ) ? 20 : 40,
                    transitionDelay    = (index * transitionModifier) + 'ms';

                $character.css( 'transition-delay', transitionDelay );
            }
        );
    };

    mkAddons.widgetsList.mk_animated_content = {};
    mkAddons.widgetsList.mk_animated_content.mkAnimatedContent = mkAnimatedContent;


    // ----------------------------------------------------------

    var mkCountdown = function ($scope, $) {
        var $this = $scope.find('.mk-countdown'),
            year  = $this.find('.mk-cd-year'),
            month = $this.find('.mk-cd-month'),
            week  = $this.find('.mk-cd-week'),
            day   = $this.find('.mk-cd-day'),
            hour  = $this.find('.mk-cd-hour'),
            min   = $this.find('.mk-cd-minute'),
            sec   = $this.find('.mk-cd-second'),
            text  = $this.data('text'),
            standardCountdown  = $this.data('standard-countdown'),
            mesg  = $this.data('message'),
            link  = $this.data('link'),
            time  = $this.data('time'),
            data_text_year    = $this.data('text-year'),
            data_text_years   = $this.data('text-years'),
            data_text_month   = $this.data('text-month'),
            data_text_months  = $this.data('text-months'),
            data_text_week    = $this.data('text-week'),
            data_text_weeks   = $this.data('text-weeks'),
            data_text_day     = $this.data('text-day'),
            data_text_days    = $this.data('text-days'),
            data_text_hour    = $this.data('text-hour'),
            data_text_hours   = $this.data('text-hours'),
            data_text_minute  = $this.data('text-minute'),
            data_text_minutes = $this.data('text-minutes'),
            data_text_second  = $this.data('text-second'),
            data_text_seconds = $this.data('text-seconds');

        $this.countdown( time ).on('update.countdown', function (e) {
            var m = e.strftime('%m'),
                w = e.strftime('%w'),
                Y = Math.floor(m / 12),
                m = m % 12,
                w = w % 4;

            function addZero(val) {
                if ( val < 10 ) {
                    return '0'+val;
                }
                return val;
            }

            if ( standardCountdown == 'yes' ) {
                day.html( e.strftime('%D') );
            } else {
                year.html( addZero(Y) );
                month.html( addZero(m) );
                week.html( '0'+w );
                day.html( e.strftime('%d') );
            }

            hour.html( e.strftime('%H') );
            min.html( e.strftime('%M') );
            sec.html( e.strftime('%S') );

            if ( text == 'yes' ) {

                if ( standardCountdown == 'yes' ) {
                    day.next().html( e.strftime('%D') < 2 ? data_text_day : data_text_days );
                } else {
                    year.next().html( Y < 2 ? data_text_year : data_text_years );
                    month.next().html( m < 2 ? data_text_month : data_text_months );
                    week.next().html( w < 2 ? data_text_week : data_text_weeks );
                    day.next().html( e.strftime('%d') < 2 ? data_text_day : data_text_days );
                }

                hour.next().html( e.strftime('%H') < 2 ? data_text_hour : data_text_hours );
                min.next().html( e.strftime('%M') < 2 ? data_text_minute : data_text_minutes );
                sec.next().html( e.strftime('%S') < 2 ? data_text_second : data_text_seconds );
            }

        }).on('finish.countdown', function (e) {
            $this.children().remove();
            if ( mesg ) {
                $this.append('<div class="mk-cd-message">'+ mesg +'</div>');
            } else if( link && elementorFrontend.isEditMode() ){
                $this.append('<h2>You can\'t redirect url from elementor edit mode!!</h2>');
            } else if (link) {
                window.location.href = link;
            } else{
                $this.append('<h2>May be you don\'t enter a valid redirect url</h2>');
            }
        });
    }

    mkAddons.widgetsList.mk_countdown = {};
    mkAddons.widgetsList.mk_countdown.mkCountdown = mkCountdown;

    // ----------------------------------------------------------

    // full screen menu
    var mkFullScreenMenu = function ($scope, $) {
        var menuHolder = $scope.find('.mk-fullscreen-menu'),
            link = $scope.find('a'),
            subLinks = menuHolder.children().find('li');

        // indicator
        if ($(subLinks).find('.sub-menu').length > 0) {
            $(subLinks).find('.sub-menu').siblings("a").addClass('menu-indicator-icon');
        }

        $(subLinks).on('click touchstart', function(e) {
            e.stopPropagation();
            e.preventDefault();

            var $item          = $(this),
                $subMenus      = $item.children('.sub-menu'),
                $allSubMenus   = $item.find('.sub-menu'),
                indicatorMinus = 'sub-menu-indicator-minus',
                activeClass    = 'mk-fs-active';

            if ($subMenus.length > 0 ) {

                $item.parents('.mk-fullscreen-menu-holder').find('li').removeClass(activeClass);
                $item.siblings('li').removeClass(activeClass);
                $item.addClass(activeClass);

                if ($item.parents().hasClass('sub-menu')) {
                    $item.parents().addClass(activeClass);
                }

                if ($subMenus.css("display") == "none") {
                    $subMenus.slideDown(300).siblings("a").addClass(indicatorMinus);
                    $item.siblings().find('.sub-menu').slideUp(300).end().find("a").removeClass(indicatorMinus);
                    return false;
                } else {
                    $item.find('.sub-menu').delay(0).slideUp(300);
                }

                if ($allSubMenus.siblings("a").hasClass(indicatorMinus)) {
                    $allSubMenus.siblings("a").removeClass(indicatorMinus);
                }
            }

            if (!$('body').hasClass('elementor-editor-active')) {
                window.location.href = $item.children("a").attr("href");
            }

        });
    }

    mkAddons.widgetsList.mk_full_screen_menu = {};
    mkAddons.widgetsList.mk_full_screen_menu.mkFullScreenMenu = mkFullScreenMenu;

    // ----------------------------------------------------------

    var mkCounter = function ($scope, $) {
        mkExtObserveTarget($scope[0], function () {
            var $this = $scope.find('.mk-counter-number'),
                data  = $this.data(),
                digit = data.toValue.toString().match(/\.(.*)/);

            if (digit) {
                data.rounding = digit[1].length;
            }

            $this.numerator(data);
        });
    }

    mkAddons.widgetsList.mk_counter = {};
    mkAddons.widgetsList.mk_counter.mkCounter = mkCounter;

    // ----------------------------------------------------------

    var mkAnimatedTitle = function ($scope, $) {

        mkScrollLoad.init();

        var breakpoints = elementorFrontend.config.responsive.activeBreakpoints,
            elementSettings = getElementSettings( $scope ),
            mkTitle  = $scope.find('.mk--animated-title');

        if (mkTitle.length) {
            var gsapMedia = gsap.matchMedia();

            if ( !$scope.isEdit ) {
                var mediaQuery = "all";
                if (elementSettings.text_animation_breakpoint) {
                    var breakpointValue = breakpoints[elementSettings.text_animation_breakpoint].value;
                    mediaQuery = elementSettings.text_breakpoint_min_max === 'min'
                        ? 'min-width: ' + breakpointValue + 'px'
                        : 'max-width: ' + breakpointValue + 'px';
                }

                if ( elementSettings.mk_text_animation === 'char' || elementSettings.mk_text_animation === 'word' ) {
                    var duration                = elementSettings.text_duration,
                        stagger                 = elementSettings.text_stagger,
                        translateX              = elementSettings.text_translate_x,
                        translateY              = elementSettings.text_translate_y,
                        scrollTrigger           = elementSettings.text_on_scroll,
                        delay                   = elementSettings.text_delay,
                        widgetContainerChildren = $scope.find('.elementor-widget-container').children(),
                        lastChild               = $(widgetContainerChildren[widgetContainerChildren.length - 1]);

                    var gsapProps = {
                        duration: duration,
                        autoAlpha: 0,
                        delay: delay,
                        stagger: stagger
                    };
                    if (translateX) gsapProps.x = translateX;
                    if (translateY) gsapProps.y = translateY;
                    if (scrollTrigger) {
                        gsapProps.scrollTrigger = {
                            trigger: lastChild,
                            start: 'top 90%'
                        };
                    }

                    var splitText = new SplitText(lastChild, {
                        type: 'chars, words'
                    });
                    var elementsToAnimate = elementSettings.mk_text_animation === 'word' ? splitText.words : splitText.chars;

                    if (mediaQuery === 'all') {
                        gsap.from(elementsToAnimate, gsapProps);
                    } else {
                        gsapMedia.add('(' + mediaQuery + ')', function() {
                            gsap.from(elementsToAnimate, gsapProps);
                            return function() {
                                elementsToAnimate.revert();
                            };
                        });
                    }
                }

                if ('text_move' === elementSettings.mk_text_animation) {
                    var duration = elementSettings.text_duration,
                        delay = elementSettings.text_delay,
                        stagger = elementSettings.text_stagger,
                        onScroll = elementSettings.text_on_scroll,
                        rotationDirection = elementSettings.text_rotation_di,
                        rotation = elementSettings.text_rotation,
                        transformOrigin = elementSettings.text_transform_origin,
                        scrollTriggerConfig = {},
                        lastElement = $($scope.find('.mk--animated-title'));

                    if (lastElement.hasClass('mk--text') && lastElement.children().length) {
                        lastElement = lastElement.children();
                    }

                    var animationSettings = {
                        duration: duration,
                        delay: delay,
                        opacity: 0,
                        force3D: true,
                        transformOrigin: transformOrigin,
                        stagger: stagger
                    };

                    if (rotationDirection === 'x') {
                        animationSettings.rotationX = rotation;
                    } else if (rotationDirection === 'y') {
                        animationSettings.rotationY = rotation;
                    }

                    if (onScroll) {
                        scrollTriggerConfig.scrollTrigger = {
                            trigger: lastElement,
                            duration: 2,
                            start: 'top 90%',
                            end: 'bottom 60%',
                            scrub: false,
                            markers: false,
                            toggleActions: 'play none none none'
                        };
                    }

                    if ('all' === mediaQuery) {
                        var timeline = gsap.timeline(scrollTriggerConfig),
                            splitTextInstance = new SplitText(lastElement, { type: 'lines' });

                        gsap.set(lastElement, { perspective: 400 });
                        splitTextInstance.split({ type: 'lines' });
                        timeline.from(splitTextInstance.lines, animationSettings);
                    } else {
                        gsapMedia.add(`(${mediaQuery})`, function() {
                            var timeline = gsap.timeline(scrollTriggerConfig),
                                splitTextInstance = new SplitText(lastElement, { type: 'lines' });

                            gsap.set(lastElement, { perspective: 400 });
                            splitTextInstance.split({ type: 'lines' });
                            timeline.from(splitTextInstance.lines, animationSettings);

                            return function() {
                                splitTextInstance.revert();
                                timeline.revert();
                            };
                        });
                    }
                }

                if ('text_reveal' === elementSettings.mk_text_animation) {
                    var revealDuration = elementSettings.text_duration,
                        revealOnScroll = elementSettings.text_on_scroll,
                        revealStagger = elementSettings.text_stagger,
                        revealDelay = elementSettings.text_delay,
                        revealElement = $scope.find('.mk--animated-title'),
                        revealSettings = {
                            duration: revealDuration,
                            delay: revealDelay,
                            ease: 'circ.out',
                            y: 80,
                            stagger: revealStagger,
                            opacity: 0
                        };

                    if (revealOnScroll) {
                        revealSettings.scrollTrigger = {
                            trigger: revealElement.get(0),
                            start: 'top 85%'
                        };
                    }

                    document.fonts.ready.then(() => {
                        requestAnimationFrame(() => {
                            if (!revealElement.length) return;

                            var splitTextReveal = new SplitText(revealElement.get(0), {
                                type: 'lines,words,chars',
                                linesClass: 'mk-anim-reveal-line'
                            });

                            if ('all' === mediaQuery) {
                                gsap.from(splitTextReveal.chars, revealSettings);
                            } else {
                                gsapMedia.add(`(${mediaQuery})`, function() {
                                    gsap.from(splitTextReveal.chars, revealSettings);
                                    return function () {
                                        splitTextReveal.revert();
                                    };
                                });
                            }
                        });
                    });
                }

                if ('text_invert' === elementSettings.mk_text_animation) {
                    const invertElement = $scope.find('.mk--animated-title');
                    if (!invertElement.length) return;

                    // Convert computed RGB color to HSL
                    let colorValue = invertElement.css('color');
                    const rgb = colorValue.match(/\d+/g)?.map(Number);
                    if (!rgb || rgb.length < 3) return;

                    let [r, g, b] = rgb.map(v => v / 255);
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const delta = max - min;

                    let h = 0;
                    if (delta !== 0) {
                        if (max === r) h = ((g - b) / delta) % 6;
                        else if (max === g) h = (b - r) / delta + 2;
                        else h = (r - g) / delta + 4;
                    }
                    h = Math.round((h * 60 + 360) % 360);
                    const l = (max + min) / 2;
                    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
                    const hsl = `${h.toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%`;

                    invertElement.css('--mk-animated-title-text-color', hsl);

                    document.fonts.ready.then(() => {
                        requestAnimationFrame(() => {
                            if (!invertElement.length) return;

                            const splitText = new SplitText(invertElement.get(0), {
                                type: 'lines',
                                linesClass: 'invert-line'
                            });

                            const animateLine = (line) => {
                                gsap.to(line, {
                                    backgroundPositionX: 0,
                                    ease: 'none',
                                    scrollTrigger: {
                                        trigger: line,
                                        scrub: 1,
                                        start: 'top 85%',
                                        end: 'bottom center'
                                    }
                                });
                            };

                            if (mediaQuery === 'all') {
                                splitText.lines.forEach(animateLine);
                            } else {
                                gsapMedia.add(`(${mediaQuery})`, () => {
                                    const localSplit = new SplitText(invertElement.get(0), {
                                        type: 'lines',
                                        linesClass: 'invert-line'
                                    });
                                    localSplit.lines.forEach(animateLine);

                                    return () => {
                                        localSplit.revert();
                                    };
                                });
                            }
                        });
                    });
                }



            }

        }

    }

    mkAddons.widgetsList.mk_animated_title = {};
    mkAddons.widgetsList.mk_animated_title.mkAnimatedTitle = mkAnimatedTitle;

    // ----------------------------------------------------------

    var verticalMenu = function ($scope, $) {

        var verMenu = $scope.find('.mk-ver-menu-wrap'),
            megaMenuDiv = verMenu.find('ul.mk-sections-megamenu');

            megaMenuDiv.remove();

        // add arrow icon
        verMenu.find('li ul').parent().addClass('mk-has-sub-menu');
        // verMenu.find(".mk-has-sub-menu").prepend('<span class="mk-mini-menu-arrow"></span>');

        verMenu.find('.swm-svg-submenu-indicator').on('click', function(e) {

            e.preventDefault();

            var parentLi = $(this).parent('.menu-item');

            if (parentLi.hasClass('mk-has-sub-active-menu')) {
                parentLi.removeClass('mk-has-sub-active-menu');
            } else {
                parentLi.addClass('mk-has-sub-active-menu');
            }

            if ($(this).parent().siblings('ul').hasClass('open')) {
                $(this).parent().siblings('ul').removeClass('open').slideUp();
            } else {
                $(this).parent().siblings('ul').addClass('open').slideDown();
            }

            if ($(this).hasClass('inactive')) {
                $(this).removeClass('inactive');
            } else {
                $(this).addClass('inactive');
            }
        });

    }

    mkAddons.widgetsList.mk_vertical_menu = {};
    mkAddons.widgetsList.mk_vertical_menu.verticalMenu = verticalMenu;

    // ------------------------------------------------------------
    // Post Grid --------------------------------------------------
    // ------------------------------------------------------------

    // Filter

    var mkFilter = {

        customListQuery: {},
        init: function ( settings ) {
            this.holder = $( '.mk-filter--on' );

            if ( this.holder.length ) {
                this.holder.each(
                    function () {
                        var holder      = $( this ),
                            filterItems = holder.find( '.mk-m-filter-item' );

                        // mkFilter.checkCustomListQuery( holder.data( 'options' ) );
                        mkFilter.clickEvent( holder, filterItems );
                    });
            }
        },
        clickEvent: function ( holder, filterItems ) {
            filterItems.on( 'click', function (e) {
                e.preventDefault();
                var thisItem = $( this );

                if ( ! thisItem.hasClass( 'mk--active' ) ) {
                    holder.addClass( 'mk--filter-loading' );
                    filterItems.removeClass( 'mk--active' );
                    thisItem.addClass( 'mk--active' );

                    mkFilter.setVisibility( holder, thisItem );
                }
            });
        },
        setVisibility: function ( holder, item ) {
            var filterTaxonomy  = item.data( 'taxonomy' ),
                filterValue     = item.data( 'filter' ),
                showAll         = filterValue === '*',
                options         = holder.data( 'options' ),
                taxQueryOptions = {};

            if ( ! showAll ) {
                taxQueryOptions = {
                    0: {
                        taxonomy: filterTaxonomy,
                        field: 'slug',
                        terms: filterValue,
                    },
                };
            } else {
                taxQueryOptions = mkFilter.customListQuery;
            }

            options.additional_query_args = { tax_query: taxQueryOptions };
            mkAddons.body.trigger( 'mk_trigger_load_more', [holder, 1] ); // param1 = holder, param2 = 1
        }

    };

    // Masonry Layout

    var mkMasonryLayout = {
        init: function ( settings ) {
            this.holder = $( '.mk-p-masonry-on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                        mkMasonryLayout.createMasonry( $( this ) );
                    }
                );
            }
        },
        reInit: function ( settings ) {
            this.holder = $( '.mk-p-masonry-on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var masonryDiv = $( this ).find( '.mk-grid-inner' );

                    if ( typeof masonryDiv.isotope === 'function' ) {
                        masonryDiv.isotope( 'layout' );
                    }
                });
            }
        },
        createMasonry: function ( holder ) {
            var masonryDiv   = holder.find( '.mk-grid-inner' ),
                $masonryItem = masonryDiv.find( '.mk-grid-item' );

            mkAddons.mkWaitForImages.check( masonryDiv, function () {
                    if ( typeof masonryDiv.isotope === 'function' ) {
                        masonryDiv.isotope({
                                layoutMode: 'packery',
                                itemSelector: '.mk-grid-item',
                                percentPosition: true,
                                masonry: {
                                    columnWidth: '.mk-grid-masonry-sizer',
                                    gutter: '.mk-grid-masonry-gutter'
                                }
                        });

                        if ( holder.hasClass( 'mk-items--packery' ) ) {
                            var size = mkMasonryLayout.getPackeryImageSize( masonryDiv, $masonryItem );
                            mkMasonryLayout.setPackeryImageProportionSize( masonryDiv, $masonryItem, size );
                        }

                        masonryDiv.isotope( 'layout' );
                    }

                    masonryDiv.addClass( 'mk--masonry-init' );
                }
            );
        },
        getPackeryImageSize: function ( $holder, $item ) {
            var $squareItem = $holder.find( '.mk-item--square' );

            if ( $squareItem.length ) {
                var $squareItemImage      = $squareItem.find( 'img' ),
                    squareItemImageWidth  = $squareItemImage.width(),
                    squareItemImageHeight = $squareItemImage.height();

                if ( squareItemImageWidth !== squareItemImageHeight ) {
                    return squareItemImageHeight;
                } else {
                    return squareItemImageWidth;
                }
            } else {
                var size    = $holder.find( '.mk-grid-masonry-sizer' ).width(),
                    padding = parseInt( $item.css( 'paddingLeft' ), 10 );

                return (size - 2 * padding); // remove item side padding to get real item size
            }
        },
        setPackeryImageProportionSize: function ( $holder, $item, size ) {
            var padding          = parseInt( $item.css( 'paddingLeft' ), 10 ),
                $squareItem      = $holder.find( '.mk-item--square' ),
                $horizontalItem  = $holder.find( '.mk-item--horizontal' ),
                $verticalItem    = $holder.find( '.mk-item--vertical' ),
                $largeSquareItem = $holder.find( '.mk-item--large-square' ),
                isMobileScreen   = mkAddons.windowWidth <= 680;

            $item.css( 'height', size );

            if ( $horizontalItem.length ) {
                $horizontalItem.css( 'height', Math.round( size / 2 ) );
            }

            if ( $verticalItem.length ) {
                $verticalItem.css( 'height', Math.round( 2 * (size + padding) ) );
            }

            if ( ! isMobileScreen ) {

                if ( $horizontalItem.length ) {
                    $horizontalItem.css( 'height', size );
                }

                if ( $largeSquareItem.length ) {
                    $largeSquareItem.css( 'height', Math.round( 2 * (size + padding) ) );
                }
            }
        }
    };

    // Pagination

    var mkPagination = {
        init: function ( settings ) {
            this.holder = $( '.mk-pagination--on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var holder = $( this );
                    mkPagination.initPaginationType( holder );
                });
            }
        },
        initPaginationType: function ( holder ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) )               { mkPagination.initStandard( holder );
            } else if ( holder.hasClass( 'mk-pagination-type--load-more' ) )       { mkPagination.initLoadMore( holder );
            } else if ( holder.hasClass( 'mk-pagination-type--infinite-scroll' ) ) { mkPagination.initInfiniteScroll( holder );
            }
        },
        initStandard: function ( holder, nextPage ) {
            var paginationItems = holder.find( '.mk-m-pagination-items' ); // pagination div 1,2,3...

            if ( paginationItems.length ) {
                var options      = holder.data( 'options' ),
                    current_page = typeof nextPage !== 'undefined' && nextPage !== '' ? parseInt( nextPage, 10 ) : 1;

                mkPagination.changeStandardState( holder, options.max_pages_num, current_page );

                paginationItems.children().each( function () {
                        var thisItem = $( this );

                        thisItem.on( 'click', function (e) {
                            e.preventDefault();
                            if ( ! thisItem.hasClass( 'mk--active' ) ) {
                                mkPagination.getNewPosts( holder, thisItem.data( 'paged' ) );
                            }
                        });
                    }
                );
            }
        },
        changeStandardState: function ( holder, maxPagesNum, nextPage ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) ) {
                var paginationNav = holder.find( '.mk-m-pagination-items' ),
                    numericItem   = paginationNav.children( '.mk--number' ),
                    prevItem      = paginationNav.children( '.mk--prev' ),
                    nextItem      = paginationNav.children( '.mk--next' );

                mkPagination.standardPaginationVisibility( paginationNav, maxPagesNum );

                numericItem.removeClass( 'mk--active' ).eq( nextPage - 1 ).addClass( 'mk--active' );

                // show/hide next prev arrows
                prevItem.data( 'paged', nextPage - 1 );
                nextItem.data( 'paged', nextPage + 1 );

                if ( nextPage > 1 ) {
                    prevItem.show();
                    prevItem.next().removeClass( 'mk-prev--hidden' );
                } else {
                    prevItem.hide();
                    prevItem.next().addClass( 'mk-prev--hidden' );
                }

                if ( nextPage === maxPagesNum ) {
                    nextItem.hide();
                } else {
                    nextItem.show();
                }
            }
        },
        standardPaginationVisibility: function ( paginationNav, maxPagesNum ) {
            if ( maxPagesNum === 1 ) {
                paginationNav.hide();
            } else if ( maxPagesNum > 1 && ! paginationNav.is( ':visible' ) ) {
                paginationNav.show();
            }
        },
        initLoadMore: function ( holder ) {
            var loadMoreButton = holder.find( '.mk-load-more-button' );

            loadMoreButton.on('click', function (e) {
                e.preventDefault();
                mkPagination.getNewPosts( holder );
            });
        },
        initInfiniteScroll: function ( holder ) {
            var holderEndPosition = holder.outerHeight() + holder.offset().top,
                scrollPosition    = mkAddons.scroll + mkAddons.windowHeight,
                options           = holder.data( 'options' );

            if ( ! holder.hasClass( 'mk--loading' ) && scrollPosition > holderEndPosition && options.max_pages_num >= options.next_page ) {
                mkPagination.getNewPosts( holder );
            }
        },
        getNewPosts: function ( holder, nextPage ) {
            holder.addClass( 'mk--loading' );

            var itemsHolder = holder.children( '.mk-grid-inner' );
            var options      = holder.data( 'options' );

            mkPagination.setNextPageValue( options, nextPage, false );

            // paginationRestRoute = mk/v1/get-posts
            // restUrl = http://localhost/mk/wp-json/

            $.ajax({
                    type: 'GET',
                    url: mkWidgetsLocalize.restUrl + mkWidgetsLocalize.paginationRestRoute,
                    data: {
                        options: options
                    },
                    beforeSend: function ( request ) {
                        request.setRequestHeader( 'X-WP-Nonce', mkWidgetsLocalize.restNonce );
                    },
                    success: function ( response ) {

                        if ( response.status === 'success' ) {
                            // Override max page numbers options
                            if ( options.max_pages_num !== response.data.max_pages_num ) {
                                options.max_pages_num = response.data.max_pages_num;
                            }

                            mkPagination.setNextPageValue( options, nextPage, true );
                            mkPagination.changeStandardHtml( holder, options.max_pages_num, nextPage, response.data.pagination_html );

                            mkPagination.addPosts( itemsHolder, response.data.html, nextPage );
                            mkPagination.reInitMasonryPosts( holder, itemsHolder );

                            setTimeout( function () {
                                mkAddons.body.trigger( 'mk_trigger_get_new_posts', [holder, response.data, nextPage] );
                            }, 300 ); // 300ms is set in order to be after the masonry script initialize

                            mkPagination.triggerStandardScrollAnimation( holder );
                            mkPagination.loadMoreButtonVisibility( holder, options );
                        } else {
                            console.log( response.message );
                        }
                    },
                    complete: function () {
                        holder.removeClass( 'mk--loading' );
                    }
            });
        },
        setNextPageValue: function ( options, nextPage, ajaxTrigger ) {
            if ( typeof nextPage !== 'undefined' && nextPage !== '' && ! ajaxTrigger ) {
                options.next_page = nextPage;
            } else if ( ajaxTrigger ) {
                options.next_page = parseInt( options.next_page, 10 ) + 1;
            }
        },
        changeStandardHtml: function ( holder, maxPagesNum, nextPage, pagination_html ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) ) {
                var paginationNav     = holder.find( '.mk-m-pagination' ),
                    paginationSpinner = holder.find( '.mk-m-pagination-spinner' );

                mkPagination.standardPaginationVisibility( paginationNav, maxPagesNum );

                paginationNav.remove();
                paginationSpinner.remove();

                holder.append( pagination_html );
                mkPagination.initStandard( holder, nextPage );
            }
        },
        addPosts: function ( itemsHolder, newItems, nextPage ) {
            if ( typeof nextPage !== 'undefined' && nextPage !== '' ) {
                itemsHolder.html( newItems );
            } else {
                itemsHolder.append( newItems );
            }
        },
        reInitMasonryPosts: function ( holder, itemsHolder ) {
            if ( holder.hasClass( 'mk-p-masonry-on' ) ) {
                itemsHolder.isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
                setTimeout( function () { itemsHolder.isotope( 'layout' ); }, 200 );
            }
        },
        triggerStandardScrollAnimation: function ( holder ) {
            if ( holder.hasClass( 'mk-pagination-type--standard' ) ) {
                $( 'html, body' ).animate( { scrollTop: holder.offset().top - 100 }, 500 ); // move to top after click on pagination link
            }
        },
        loadMoreButtonVisibility: function ( holder, options ) {
            if ( holder.hasClass( 'mk-pagination-type--load-more' ) ) {

                if ( options.next_page > options.max_pages_num || options.max_pages_num === 1 ) {
                    holder.find( '.mk-load-more-button' ).hide();
                } else if ( options.max_pages_num > 1 && options.next_page <= options.max_pages_num ) {
                    holder.find( '.mk-load-more-button' ).show();
                }
            }
        },
        scroll: function ( settings ) {
            this.holder = $( '.mk-pagination--on' );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    var holder = $( this );
                    if ( holder.hasClass( 'mk-pagination-type--infinite-scroll' ) ) {
                        mkPagination.initInfiniteScroll( holder );
                    }
                });
            }
        },
        triggerLoadMore: function ( holder, nextPage ) {
            mkPagination.getNewPosts( holder, nextPage );
        },

    };

    // Portfolio Tooltip

    var mkInfoFollow = {
        init: function() {
            var $portfolioTooltip = $('.mk-portfolio-tooltip');
            if ($portfolioTooltip.length) {

                var getOptions = $portfolioTooltip.data( 'options' );

                mkAddons.body.append('<div class="mk-portfolio-tooltip-box mk-portfolio-tooltip-box-'+ getOptions.data_id +'"><div class="mk-portfolio-tooltip-box-wrap"><div class="mk-portfolio-tooltip-box-title"></div><div class="mk-portfolio-tooltip-box-subtitle"></div></div></div>');

                var $tooltipBox      = $('.mk-portfolio-tooltip-box'),
                    $tooltipTitle    = $tooltipBox.find('.mk-portfolio-tooltip-box-title'),
                    $tooltipSubtitle = $tooltipBox.find('.mk-portfolio-tooltip-box-subtitle');

                $portfolioTooltip.each(function() {

                    $portfolioTooltip.find('.mk-portfolio-wrap').each(function() {
                        var $this = $(this);
                        $this.on('mousemove', function(e) {
                            if (e.clientX + $tooltipBox.width() > mkAddons.windowWidth) {
                                $tooltipBox.addClass('mk-right');
                            } else {
                                $tooltipBox.removeClass('mk-right');
                            }
                            var x = e.clientX,
                                y = e.clientY;
                            TweenMax.to($tooltipBox, 0, {x: x, y: y});
                        });
                        $this.on('mouseenter', function() {

                            var $getTitle    = $(this).find('.mk-portfolio-title'),
                                $getSubTitle = $(this).find('.mk-portfolio-subtitle');

                            if ($getTitle.length)                        { $tooltipTitle.html($getTitle.clone()); }
                            if ($getSubTitle.length)                     { $tooltipSubtitle.html($getSubTitle.html()); }
                            if (!$tooltipBox.hasClass('mk-is-active')) { $tooltipBox.addClass('mk-is-active'); }

                        }).on('mouseleave', function() {
                            if ($tooltipBox.hasClass('mk-is-active')) {
                                $tooltipBox.removeClass('mk-is-active');
                            }
                        });
                    });
                });
            }
        }
    };

    // Appear Animation
    var mkGridItemLoad = {
        init: function() {
            this.holder = $( '.mk-grid--load:not(.mk-grid--loaded)' );

            function swmRandomArbitrary( min, max ) { return Math.floor( Math.random() * (max - min) + min ); }

            if ( this.holder.length ) {
                this.holder.each(
                    function () {
                        var holder      = $( this ),
                            randomNum   = swmRandomArbitrary(10, 400 ),
                            appearDelay = $( this ).attr( 'data-appear-delay' );

                        if ( ! appearDelay ) {
                            mkGridItemLoad.GridItemViewPort( holder, function () {
                                holder.addClass( 'mk-grid--loaded' );
                            });
                        } else {
                            appearDelay = (appearDelay === 'random') ? randomNum : appearDelay;
                            mkGridItemLoad.GridItemViewPort( holder, function () {
                                setTimeout( function () { holder.addClass( 'mk-grid--loaded' ); }, appearDelay );
                            });
                        }
                    });
            }
        },
        GridItemViewPort:function($element, callback, onlyOnce) {
           if ( $element.length ) {
               var offset   = typeof $element.data( 'viewport-offset' ) !== 'undefined' ? $element.data( 'viewport-offset' ) : 0.15; // When item is 15% in the viewport
               var observer = new IntersectionObserver(
                   function ( entries ) {
                       // isIntersecting is true when element and viewport are overlapping
                       // isIntersecting is false when element and viewport don't overlap
                       if ( entries[0].isIntersecting === true ) {
                           callback.call( $element );
                           if ( onlyOnce !== false ) { observer.disconnect(); }  // Stop watching the element when it's initialize
                       }
                   },
                   { threshold: [offset] }
               );
               observer.observe( $element[0] );
           }
        }

    };

    var mkGridParallaxEffect = {

        init: function () {
            let $holder = $( '.mk-p-grid.mk-parallax-scroll-on' );

            if ( $holder.length ) {
                $holder.each( function (i) {
                    let $thisHolder = $( this );
                    mkGridParallaxEffect.initItem($thisHolder, i);
                });
            }
        },
        initItem: function ($holder, i){
            let $articles = $holder.find('.mk-grid-item');

            $articles.each( function (i) {
                let $thisHolder = $( this ),
                    randomScrub = (1.5 + gsap.utils.random(0, .7, .15)).toFixed(2);//num beetween 1.5 and 2.2
                mkGridParallaxEffect.initParallax($thisHolder, i, randomScrub);
            });

        },
        initParallax: function ($holder, i, randomScrub){
            let $image = $holder.find('.mk-post-grid-image img'),
                maxYMove = 6,
                yScrollModifier = gsap.utils.random([1, .86, .73]),
                moveY = i % 2 === 0 ? maxYMove * yScrollModifier : - maxYMove * yScrollModifier,
                scrub = Number.parseFloat(randomScrub);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: $holder,
                    scrub: scrub,
                    start: () => { return "center bottom" },
                    end: () => { return "bottom top"; },
                    // markers: true,
                }
            });

            tl.fromTo ( $image, { yPercent: moveY, }, { yPercent: "*=-1", } )
        }
    };

    // --------------------------------------------------

    mkAddons.mkFilter             = mkFilter;
    mkAddons.mkMasonryLayout      = mkMasonryLayout;
    mkAddons.mkPagination         = mkPagination;
    mkAddons.mkWaitForImages      = mkWaitForImages;
    mkAddons.mkInfoFollow         = mkInfoFollow;
    mkAddons.mkGridItemLoad       = mkGridItemLoad;
    mkAddons.mkGridParallaxEffect = mkGridParallaxEffect;

    $(document).ready(function() {
        scroll = $( window ).scrollTop();
        mkGridItemLoad.init();
        mkPagination.init();
        mkFilter.init();
        mkMasonryLayout.init();
        mkInfoFollow.init();
        mkGridParallaxEffect.init();

        $(window).on('scroll', function () {
            mkAddons.scroll = $(window).scrollTop();
            mkAddons.mkPagination.scroll();
        });

        $(window).on('resize', function () {
            mkAddons.windowWidth = $(window).width();
            mkAddons.windowHeight = $(window).height();

            if (!$("body").hasClass("elementor-editor-active")) {
                mkAddons.mkMasonryLayout.reInit();
            }
        });

        $( document ).on('mk_trigger_get_new_posts', function ( event, holder ) {
            if ( holder.hasClass( 'mk-filter--on' ) )   { holder.removeClass( 'mk--filter-loading' ); }
            if ( holder.hasClass( 'mk-p-masonry-on' ) ) { mkAddons.mkMasonryLayout.init(); }
            mkGridItemLoad.init();
        });

        $( document ).on('mk_trigger_load_more', function ( event, holder, nextPage ) {
            mkAddons.mkPagination.triggerLoadMore( holder, nextPage );
        });

    });

    $( document ).on('mk_trigger_get_new_posts', function ( event, holder ) {
        if ( $('.mk-portfolio-tooltip-box').length ) {
            $('.mk-portfolio-tooltip-box').remove();
        }
         mkInfoFollow.init();
         mkGridItemLoad.init();
    });



    // *****************
    // ****** New ******
    // *****************

    // ----------------------------------------------------------

    var mkTestimonials = function ($scope, $) {
        var $holder = $scope.find('.mk-testimonials-holder'),
        uniqueId = '#' + $($holder).attr('data-uniqueID');

        gsap.registerPlugin(ScrollTrigger);

        gsap.matchMedia().add("(min-width: 767px)", function() {
            gsap
                .timeline({
                    scrollTrigger: {
                        trigger: uniqueId + ".mk-testimonials-holder",
                        start: "top top",
                        end: `+=${document.querySelectorAll(uniqueId + " .mk-testimonials-item").length}00%`,
                        scrub: true,
                        pin: ".mk-testimonials",
                    },
                })
                .from(uniqueId + " .mk-testimonials-item", {
                    y: window.innerHeight,
                    stagger: 1,
                });
        });

    }

    mkAddons.widgetsList.mk_testimonials = {};
    mkAddons.widgetsList.mk_testimonials.mkTestimonials = mkTestimonials;

    // ----------------------------------------------------------

    var mkInteractiveProjects = function ($scope, $) {
        let interactiveProjects = $scope.find('.interactive-projects-links-holder');
        let uniqueId = '#' + $(interactiveProjects).attr('data-uniqueID');

        mkScrollLoad.init();

        gsap.registerPlugin(ScrollTrigger);

        function mk_isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent, );
        }
        if (!mk_isMobile()) {
            gsap.matchMedia().add("(min-width: 1024px)", function() {

                let links = document.querySelectorAll(uniqueId + " .interactive-projects-list li a");
                let listingWrap = document.querySelector(uniqueId + " .interactive-projects-list-wrapper");
                let timeout = 600;

                let trackTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true, repeatDelay: 0.25 });
                trackTl.to(uniqueId + " .interactive-projects-track i", { opacity: 0, duration: 0.1, ease: "linear" });

                setTimeout(function() {
                    listingWrap.addEventListener("mouseenter", function() {
                        gsap.to(uniqueId + " .interactive-projects-track i", { scale: 2, duration: 0.4, ease: "power3" });
                    });
                    listingWrap.addEventListener("mouseleave", function() {
                        gsap.to(uniqueId + " .interactive-projects-track i", { scale: 1, duration: 0.4, ease: "power3" });
                        trackTl.pause().progress(0);
                    });
                }, timeout);

                let containerHeading = new SplitType(uniqueId + " .interactive-projects-heading", { type: "chars" });
                gsap.set(containerHeading.chars, { transformOrigin: "bottom left" });

                let thisImage;
                new SplitType(uniqueId + " .interactive-projects-hero-split", {types: "chars", });

                links.forEach((li) => {
                    let project      = li.querySelectorAll(".interactive-projects-list-title a > span:first-of-type div"),
                        projectHover = li.querySelector(".interactive-projects-list-title .interactive-projects-title-hover"),
                        hoverSplit   = new SplitType(projectHover, { types: "chars" });

                    gsap.set(hoverSplit.chars, { transformOrigin: "left bottom", scaleY: 0, yPercent: 10 });

                    setTimeout(function() {
                        li.addEventListener("mouseenter", function() {
                            let thisData = li.dataset.target;
                            gsap.to(".interactive-projects-list li a", { opacity: 0.2, duration: 0.4, ease: "power4" });
                            // ADD CLASS TO OUR IMAGE
                            li.classList.add("active");
                            thisImage = document.querySelector('[data-page="' + thisData + '"]');
                            gsap.set(thisImage, { "-webkit-filter": "blur(15px)", });
                            gsap.to(thisImage, { opacity: 1, duration: 0.4, "-webkit-filter": "blur(0px)", ease: "power2" });
                            gsap.to(project, { transformOrigin: "top left", yPercent: -35, scaleY: 0, stagger: {amount: 0.1, }, ease: "expo", duration: 0.8 });
                            gsap.to(hoverSplit.chars, { yPercent: 0, scaleY: 1, stagger: { amount: 0.1, }, ease: "expo", duration: 0.8 });
                            gsap.to(containerHeading.chars, { duration: 1, stagger: { amount: 0.2, }, y: "100%", ease: "power4" });
                        });
                        li.addEventListener("mouseleave", function() {
                            let thisData = li.dataset.target;
                            gsap.to(uniqueId + " .interactive-projects-list li a", { opacity: 1, duration: 0.4, ease: "power4" });
                            li.classList.remove("active");
                            thisImage = document.querySelector('[data-page="' + thisData + '"]');

                            gsap.to(thisImage, { opacity: 0, duration: 0.4, "-webkit-filter": "blur(15px)", ease: "power2" });
                            gsap.to(project, { transformOrigin: "top left", yPercent: 0, scaleY: 1, stagger: {amount: 0.1, }, ease: "expo", duration: 0.8 });
                            gsap.to(hoverSplit.chars, { yPercent: 10, scaleY: 0, stagger: {amount: 0.1, }, ease: "expo", duration: 0.8 });
                            gsap.to(containerHeading.chars, { duration: 1, stagger: {amount: 0.2, }, y: "0%", ease: "power4" });
                        });
                    }, timeout);
                });

            });

        }

        if (mk_isMobile()) {

            gsap.matchMedia().add("(max-width: 1024px)", function() {
                let interactiveLinksItemMobile = $scope.find('.interactive-projects-links-item');
                interactiveLinksItemMobile.addClass('mk-scroll--load');
            });

        }

        if (!mk_isMobile()) {

            gsap.matchMedia().add("(min-width: 1024px)", function() {
                let ball        = document.querySelector(uniqueId + " .interactive-projects-track");
                let listingWrap = document.querySelector(uniqueId + " .interactive-projects-list");

                const ballDimensions = ball.getBoundingClientRect();
                const dimensions     = listingWrap.getBoundingClientRect();
                const setY           = gsap.quickSetter(ball, "y", "px");
                const clamperY       = gsap.utils.clamp(0, dimensions.height - ballDimensions.height, );

                // DRAG FOLLOW
                let mouseX = 0;
                let mouseY = 0;

                const offsetTop = dimensions.top;
                const availableHeight = dimensions.height - ballDimensions.height;

                // Add more margin at top and bottom
                const clampWithBuffer = gsap.utils.clamp(-5, availableHeight + 5);

                document.addEventListener("mousemove", function(event) {
                    const relativeY = event.clientY - offsetTop - ballDimensions.height / 2;
                    setY(clampWithBuffer(relativeY));
                });
            });

        }

    };

    mkAddons.widgetsList.mk_interactive_projects = {};
    mkAddons.widgetsList.mk_interactive_projects.mkInteractiveProjects = mkInteractiveProjects;

    // ----------------------------------------------------------

    var mkStickyProjects = function ($scope, $) {

        gsap.registerPlugin(ScrollTrigger);

        // ==== DOM References ====
        const $projects = $scope.find(".mk-sticky-projects-project");
        const sectionDuration = 1;
        const clipStates = {
            start: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            mid: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            end: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        };

        // ==== Timeline Setup ====
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".mk-sticky-projects",
                start: "top top",
                end: "bottom bottom",
                pin: ".mk-sticky-projects-list-wrapper",
                scrub: 1,
                invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
        });

        // ==== ClipPath Transitions ====
        $projects.each(function(index) {
            const isLast = index === $projects.length - 1;
            const $project = $(this);
            const $next = $projects.eq(index + 1);
            const position = index * sectionDuration;

            if (!isLast && $next.length) {
                tl.to($project[0], { clipPath: clipStates.end, duration: 1 }, position);
                tl.fromTo($next[0], { clipPath: clipStates.start }, { clipPath: clipStates.mid, duration: 1 }, position );
            }
        });

        gsap.matchMedia().add("(min-width: 992px)", () => {
            $(".mk-sticky-projects-image").on("mouseenter", function() {
                this.animation && this.animation.kill();

                this.animation = gsap.timeline().fromTo(".mk-sticky-projects-hover-wrapper",
                    { clipPath: "inset(0% 100% 0% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.out" } );
            });

            $(".mk-sticky-projects-image").on("mouseleave", function() {
                this.animation && this.animation.kill();

                this.animation = gsap.timeline().fromTo(".mk-sticky-projects-hover-wrapper",
                    { clipPath: "inset(0% 0% 0% 0%)" },
                    { clipPath: "inset(0% 0% 0% 100%)", duration: 0.5, ease: "expo.out" } );
            });
        });


        // Cursor
        var $cursor = $scope.find(".mk-sticky-projects-cursor");

        if ($cursor.length) {

            var cursorOffset = -35;

            var setX = gsap.quickTo($cursor[0], "x", { duration: 0.4, ease: "power3" });
            var setY = gsap.quickTo($cursor[0], "y", { duration: 0.4, ease: "power3" });

            // Mousemove event for cursor follower
            $(window).on("mousemove", function (e) {
                setX(e.clientX + cursorOffset);
                setY(e.clientY + cursorOffset);
            });

            var projectSlide = $scope.find(".mk-sticky-projects-project");

            // Hover effect on project slides
            projectSlide.each(function () {
                var $card = $(this);
                var tlCursor = gsap.timeline({ paused: true, repeat: -1 });

                $card.on("mouseenter", function () {
                    gsap.to($cursor[0], { opacity: 1 });
                    if (!tlCursor.isActive()) {
                        tlCursor.play();
                    }
                });

                $card.on("mouseleave", function () {
                    gsap.to($cursor[0], { opacity: 0 });
                    tlCursor.pause();
                });
            });

        } // cursor

    };

    mkAddons.widgetsList.mk_sticky_projects = {};
    mkAddons.widgetsList.mk_sticky_projects.mkStickyProjects = mkStickyProjects;



    // ----------------------------------------------------------

    var mkElementsScrollAnimationXXX = function ($scope, $) {

        let mkElementsScrollAnimation = $scope.find('.mk-elements-scroll-animation');
        let uniqueId = '#' + $(mkElementsScrollAnimation).attr('data-uniqueID');
        let titleBlur = 'blur(' + $(mkElementsScrollAnimation).attr('data-titleBlur') + 'px)';


        gsap.registerPlugin(ScrollTrigger, SplitText);
        ScrollTrigger.normalizeScroll();
        const SPEED = 800;

        const stickersWrappers = gsap.utils.toArray(".mk-esa-sticker-wrapper");

        stickersWrappers.forEach((wrapper, i) => {
            const image = wrapper.querySelector("img");

            gsap.to(image, {
                x: 0,
                y: 0,
                rotateZ: 0,
                scrollTrigger: { trigger: wrapper, start: "top bottom", end: "+=1200", scrub: true, },
            });

        });

        gsap.timeline({ scrollTrigger: { trigger: ".mk-elements-scroll-animation", start: "top top", end: `+=${SPEED}`, pin: true, scrub: true } })
        .to(".mk-elements-scroll-animation-heading", {filter: titleBlur })
        .to(".mk-esa-stickers-wrapper", {y: "-30%", }, 0 );


    }
	
	var mkElementsScrollAnimation = function ($scope, $) {

        let mkElementsScrollAnimation = $scope.find('.mk-elements-scroll-animation');
        let uniqueId = '#' + $(mkElementsScrollAnimation).attr('data-uniqueID');
        let titleBlur = 'blur(' + $(mkElementsScrollAnimation).attr('data-titleBlur') + 'px)';

        // Wait until all images inside the section are loaded
        imagesLoaded(mkElementsScrollAnimation[0], { background: true }, function () {

            gsap.registerPlugin(ScrollTrigger, SplitText);
            ScrollTrigger.normalizeScroll();
            const SPEED = 800;

            const stickersWrappers = gsap.utils.toArray(".mk-esa-sticker-wrapper");

            stickersWrappers.forEach((wrapper, i) => {
                const image = wrapper.querySelector("img");

                gsap.to(image, {
                    x: 0,
                    y: 0,
                    rotateZ: 0,
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top bottom",
                        end: "+=1200",
                        scrub: true,
                    },
                });
            });

            gsap.timeline({
                scrollTrigger: {
                    trigger: ".mk-elements-scroll-animation",
                    start: "top top",
                    end: `+=${SPEED}`,
                    pin: true,
                    scrub: true
                }
            })
            .to(".mk-elements-scroll-animation-heading", {
                filter: titleBlur
            })
            .to(".mk-esa-stickers-wrapper", {
                y: "-30%",
            }, 0);
        });
    }

    mkAddons.widgetsList.mk_elements_scroll_animation = {};
    mkAddons.widgetsList.mk_elements_scroll_animation.mkElementsScrollAnimation = mkElementsScrollAnimation;

    // ----------------------------------------------------------

    var mkHorizontalProjects = function ($scope, $) {

        gsap.registerPlugin(ScrollTrigger, SplitText);

        // let horizontalProjects = $scope.find('.mk-horizontal-projects-holder');
        let horizontalProjects = $scope.find('.mk-horizontal-projects-container');

        const $section          = horizontalProjects;
        const $sectionInner     = $section.find(".mk-horizontal-projects-inner");
        const $slideSection     = $section.find(".mk-horizontal-projects-section");
        const $slides           = $section.find(".mk-horizontal-projects-slide");
        const $splitTextElement = $section.find(".mk-horizontal-projects-welcome-text span");

        document.fonts.ready.then(() => {

            // Split text
            let split = new SplitText($splitTextElement.get(0), { type: "words, chars" });

            // Set initial background visibility
            $slides.each((index) => {
                gsap.set(`.bg${index + 1}`, { opacity: index === 0 ? 1 : 0 });
            });

            const totalSlideWidth     = $slides.toArray().reduce((acc, slide) => acc + $(slide).outerWidth(true), 0);
            const windowCenterOffset  = $(window).width() * 0.5 - $slides.first().outerWidth() / 2;
            const scrollLength        = totalSlideWidth - windowCenterOffset;

            const mediaQuery          = window.matchMedia("(max-width: 589px)");
            const scrollEnd           = mediaQuery.matches ? scrollLength * 1.5 : scrollLength * 2;

            // Horizontal scroll animation timeline
            const tlHorProjects = gsap.timeline({
                scrollTrigger: {
                    trigger: horizontalProjects.get(0),
                    start: "top top",
                    end: `+=${scrollEnd}`,
                    scrub: true,
                    pin: true,
                    onUpdate: self => {
                        const progress = self.progress;
                        const currentX = -scrollLength * progress;

                        let activeIndex = 0;
                        let minDistance = Infinity;

                        $slides.each((index, slide) => {
                            const slideCenter   = slide.offsetLeft + $(slide).outerWidth() / 2;
                            const visibleCenter = -currentX + $(window).width() / 2;
                            const distance      = Math.abs(slideCenter - visibleCenter);

                            if (distance < minDistance) {
                                minDistance = distance;
                                activeIndex = index;
                            }

                        });

                        updateBackground(activeIndex);
                    }
                }
            });

            // Animate split characters
            tlHorProjects.to(split.chars, { delay: 0.01, duration: 0.03, rotationY: -90, x: -20, autoAlpha: 0, stagger: 0.0035, }, 0);

            // Slide horizontally
            tlHorProjects.to($slideSection, { x: -scrollLength, ease: "none" }, 0);

            // Background update function
            let currentBgIndex = -1;
            function updateBackground(index) {
                if (index === currentBgIndex) return;

                $slides.each((i) => {
                    gsap.to(`.bg${i + 1}`, {
                        opacity: i === index ? 1 : 0,
                        duration: 0.8,
                        overwrite: true,
                    });
                });

                currentBgIndex = index;
            }

        }); // fonts.

        // Cursor
        var $cursor = $scope.find(".mk-horizontal-projects-cursor");

        if ($cursor.length) {

            var cursorOffset = -35;

            var setX = gsap.quickTo($cursor[0], "x", { duration: 0.4, ease: "power3" });
            var setY = gsap.quickTo($cursor[0], "y", { duration: 0.4, ease: "power3" });

            // Mousemove event for cursor follower
            $(window).on("mousemove", function (e) {
                setX(e.clientX + cursorOffset);
                setY(e.clientY + cursorOffset);
            });

            var projectSlide = $scope.find(".mk-horizontal-projects-slide");

            // Hover effect on project slides
            projectSlide.each(function () {
                var $card = $(this);
                var tlCursor = gsap.timeline({ paused: true, repeat: -1 });

                $card.on("mouseenter", function () {
                    gsap.to($cursor[0], { opacity: 1 });
                    if (!tlCursor.isActive()) {
                        tlCursor.play();
                    }
                });

                $card.on("mouseleave", function () {
                    gsap.to($cursor[0], { opacity: 0 });
                    tlCursor.pause();
                });
            });

        } // cursor

    }

    mkAddons.widgetsList.mk_horizontal_projects = {};
    mkAddons.widgetsList.mk_horizontal_projects.mkHorizontalProjects = mkHorizontalProjects;

    // ----------------------------------------------------------

    var mkScrollTabsAnimation = function ($scope, $) {

        gsap.registerPlugin(ScrollTrigger, SplitText);

        gsap.matchMedia().add("(min-width: 1367px)", function() {

            var $holder = $scope.find('.mk-scroll-tab-animation');
            let uniqueId = '#' + $($holder).attr('data-uniqueID');
            let top_distance = $($holder).attr('data-distance') ? $($holder).attr('data-distance') : 80;

            let t = top_distance;
            let o = window.innerHeight - 70;

            // Adjust spacing if the screen is smaller than 1440px
            if (window.innerWidth < 1366) { t = 75; }

            const container = document.querySelector(uniqueId + " .mk-scroll-tab-animation__inner");
            if (!container) return;

            const cards = Array.from(container.querySelectorAll(uniqueId + " .mk-scroll-tab-animation-card"));

            // Animate the entire container (likely to trigger animations when in view)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    ease: "power4.inOut",
                    start: () => "top top",
                    end: () => `+=${6 * window.innerHeight}`,
                    scrub: true,
                    pin: true,
                    onEnter() {
                        gsap.to(cards, {
                            opacity: 1,
                            ease: "power2.inOut",
                            stagger: {
                                each: -0.1, // time between the start of each animation
                            },
                            duration: 0.6, // duration of each individual card animation
                        });
                    },
                },
            });

            tl.to({}, {duration: 0.4 });

            // // Animate the first card
            cards.forEach((card, i) => {
                tl.to(card, {y: `${-window.innerHeight + (4 - i) * t + 30}px`, });

                gsap.to(
                    card.querySelectorAll(uniqueId + " .mk-scroll-tab-animation-card-text," + uniqueId + " .mk-scroll-tab-animation-media"), {
                        opacity: 1,
                        y: 0,
                        ease: "power.out",
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: card,
                            start: `top+=${(i + 1) * window.innerHeight - 700 / (i + 1)} top`,
                            end: "+=500",
                        },
                    },
                );
            });

        }); // if 1367

    };

    mkAddons.widgetsList.mk_scroll_tabs_animation = {};
    mkAddons.widgetsList.mk_scroll_tabs_animation.mkScrollTabsAnimation = mkScrollTabsAnimation;

    // ----------------------------------------------------------

    var mkMovingButtonsHoverImage = function ($scope, $) {

        let movingButtonsHoverImage = $scope.find('.mk-moving-buttons-hover-image');
        let uniqueId = '#' + $(movingButtonsHoverImage).attr('data-uniqueID');

        gsap.registerPlugin(SplitText, ScrollTrigger, ScrollSmoother);

        document.fonts.ready.then(() => {

            const split = SplitText.create(".split", { type: "lines, words", linesClass: "mk-moving-button-hover-image-split-lines", });
            gsap.set(split.lines, { x: (i) => (i % 2 === 0 ? "-150%" : "150%"), });

            gsap.to(".mk-moving-button-hover-image-split-lines", {
                x: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: uniqueId  + ".mk-moving-buttons-hover-image",
                    start: "top bottom",
                    end: window.innerWidth > 1024 ? "top top" : "+=400",
                    scrub: 1,
                },
                duration: 2,
            });

            gsap.matchMedia().add("(min-width: 1024px)", function() {
                gsap.to(".mk-mbhi-pill-wrapper", {
                    y: 0,
                    scrollTrigger: {
                        trigger:  uniqueId  + ".mk-moving-buttons-hover-image",
                        start: "top top",
                        end: "+=1600",
                        scrub: 1,
                        pin: true,
                    },
                });
            });

            gsap.to(uniqueId  + " .mk-mbhi-pill.mk-mbhi-pill-wave-yes", {
                y: "-10",
                ease: "none",
                yoyo: true,
                repeat: -1,
                duration: 1,
            });

            gsap.utils.toArray(uniqueId  + " .mk-mbhi-pill-wrapper").forEach((pill) => {
                gsap.set(pill, {
                    zIndex: gsap.utils.mapRange(0, 9999, 9999, 0, gsap.getProperty(pill, "top"), ),
                });
            });

            gsap.matchMedia().add("(min-width: 1024px)", function() {
                gsap.utils.toArray(uniqueId  + " .mk-mbhi-pill-wrapper").forEach((pill) => {
                    const q = gsap.utils.selector(pill);
                    q(".mk-mbhi-pill")[0].addEventListener("mouseover", function() {
                        gsap.to(q(".mk-mbhi-pill-img-wrapper"), {
                            scale: 1,
                            opacity: 1,
                            duration: 0.6,
                            ease: "power3.out",
                        });
                    });
                    q(".mk-mbhi-pill")[0].addEventListener("mouseleave", function() {
                        gsap.to(q(uniqueId  + " .mk-mbhi-pill-img-wrapper"), {
                            scale: 0,
                            opacity: 0,
                            duration: 0.6,
                            ease: "power3.out",
                        });
                    });
                });
            });


        }); //fonts load
    };

    mkAddons.widgetsList.mk_moving_buttons_hover_image = {};
    mkAddons.widgetsList.mk_moving_buttons_hover_image.mkMovingButtonsHoverImage = mkMovingButtonsHoverImage;

    // ----------------------------------------------------------

    var mkPricingTable = function ($scope, $) {
        var btnClass = $scope.find('.mk-pricing-table-button');
        var buttonMoveX = btnClass.data( 'button-move-x' );
        var buttonMoveY = btnClass.data( 'button-move-y' );

        swmHoverMagnetEffect(btnClass,buttonMoveX,buttonMoveY);
    }

    mkAddons.widgetsList.mk_pricing_table = {};
    mkAddons.widgetsList.mk_pricing_table.mkPricingTable = mkPricingTable;


    // ----------------------------------------------------------

    var mkFlyingImages = function ($scope, $) {

        gsap.registerPlugin(ScrollTrigger, SplitText);

        document.fonts.ready.then(() => {
            let subTitle = SplitTextClub.create(".mk-flying-images-subtitle", { type: "words, lines", mask: "lines", linesClass: "mk-flying-images-subtitle-lines" });
            let mainTitle = SplitTextClub.create(".mk-flying-images-title", { type: "words, lines", mask: "lines", linesClass: "mk-flying-images-title-lines" });

            gsap.timeline({ scrollTrigger: { trigger: ".mk-flying-images-holder", start: "top center", }, }).set(".mk-flying-images-content", { opacity: 1, })
                .to( subTitle.lines, { delay: 0.45, y: 0, }, 0 )
                .to( mainTitle.lines, { delay: 0.45, ease: "cubic-bezier(0.25, 1, 0.5, 1)", y: 0, stagger: 0.25, }, 0 );
        });

        // gsap.timeline().set(".mk-flying-images-content", { opacity: 1, })


        if ( !$("body").hasClass("elementor-editor-active") ) {

            gsap.matchMedia().add("(min-width: 768px)", function() {
                gsap.timeline({scrollTrigger: { trigger: ".mk-flying-images-holder", start: "top top", end: "+=2000", scrub: 1, pin: true } })
                    .to(".mk-flying-images-visible-image", { z: window.innerWidth, opacity: 1, duration: 0.8, stagger: 0.1, ease: "o3", })
                    .to(".mk-flying-images-hidden-image", { z: window.innerWidth, opacity: 1, duration: 0.8, stagger: 0.3, ease: "o3", }, "-=20%" );
            });

        }

    }

    mkAddons.widgetsList.mk_flying_images = {};
    mkAddons.widgetsList.mk_flying_images.mkFlyingImages = mkFlyingImages;

    // ----------------------------------------------------------

    // work process
    var mkWorkProcess = function ($scope, $) {
        var $holder = $scope.find('.mk-work-process'),
        uniqueId = '#' + $($holder).attr('data-uniqueID');

        // Media query checks using jQuery
        const mediaQuery1 = window.matchMedia("(max-width: 1000px)").matches;
        const mediaQuery2 = window.matchMedia("(max-width: 590px)").matches;

        // jQuery DOM selections
        const $tilesSection = $(uniqueId + " .mk-work-process-grid-tiles");
        const $colorOne = $(uniqueId + ".mk-work-process").attr('data-colorOne');
        const $colorTwo = $(uniqueId + ".mk-work-process").attr('data-colorTwo');

        const $tilesTick    = $(uniqueId + " .mk-work-process-tile-tick");
        const $tilesTitle   = $(uniqueId + " .mk-work-process-tile-title");
        const $tilesContent = $(uniqueId + " .mk-work-process-tile-content");
        const $tilesIcon    = $(uniqueId + " .mk-work-process-tile-no");
        const $tilesIconNumber    = $(uniqueId + " .mk-work-process-tile-no span");

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: $tilesSection[0], // Use native DOM node from jQuery object
                start: mediaQuery2 ? "top 70%" : "top center",
                end: mediaQuery2 ? "bottom 70%" : "bottom 80%",
                scrub: 1,
            }
        });

        timeline.to($tilesTick.toArray(), { xPercent: 90, stagger: 0.3, }, 0 );
        timeline.to($tilesIcon.toArray(), { color: $colorOne, duration: 0.5, stagger: 0.3, }, 0 );
        timeline.to($tilesIconNumber.toArray(), { color: $colorTwo, duration: 0.5, stagger: 0.3, }, 0 );


        timeline.from($tilesTick.toArray(), { opacity: 0, duration: 0.5, stagger: 0.3, }, 0 );

        if (!mediaQuery1) {
            timeline.to($tilesTitle.toArray(), {xPercent: 12.5, yPercent: 12.5, scale: 1.25, stagger: 0.3, }, 0 );
        }

        timeline.to($tilesContent.toArray(), { height: mediaQuery2 ? "80%" : "60%", stagger: 0.3, }, 0 );

    }

    mkAddons.widgetsList.mk_work_process = {};
    mkAddons.widgetsList.mk_work_process.mkWorkProcess = mkWorkProcess;

    // ----------------------------------------------------------

    var Mk_Hover_Image_Animation = function ($scope, $) {

        var $holder = $scope.find( '.mk-hover-image-animation' ),
            uniqueId = '#' + $($holder).attr('data-uniqueID'),
            hoverAnimationItem = $(uniqueId + " .mk-hover-image-animation-item");

        gsap.registerPlugin(ScrollTrigger, SplitText);

        const splitMap = new Map();
        document.fonts.ready.then(() => {
            hoverAnimationItem.each(function() {
                const splitItemText = $(this).find(".mk-hover-image-animation-item-text span")[0];
                const split = SplitText.create(splitItemText, { type: "words, chars" });
                splitMap.set(this, split);
            });
        });

        const directionOffsets = {
            top: { x: "0%", y: "-100%" },
            right: { x: "100%", y: "0%" },
            bottom: { x: "0%", y: "100%" },
            left: { x: "-100%", y: "0%" },
        };

        const clipPathsTo = {
            top: { start: "M 0 1 V 1 Q .5 .5 1 1 V 0 H 0 z", end: "M 0 1 V 0 Q .5 0 1 0 V 0 H 0 z", },
            bottom: { start: "M 0 1 V 0 Q .5 .5 1 0 V 1 z", end: "M 0 1 V 1 Q .5 1 1 1 V 1 z", },
            left: { start: "M 0 0 H 1 Q .75 .5 1 1 H 0 V 0 z", end: "M 0 0 H 0 Q 0 .5 0 1 H 0 V 0 z", },
            right: { start: "M 1 0 H 0 Q .25 .5 0 1 H 1 V 0 z", end: "M 1 0 H 1 Q 1 .5 1 1 H 1 V 0 z", },
        };
        const clipPathsFrom = {
            top: { start: "M 0 1 V 0 Q .5 0 1 0 V 0 H 0 z", end: "M 0 1 V 1 Q .5 1.25 1 1 V 0 H 0 z", },
            bottom: { start: "M 0 1 V 1 Q .75 .50 1 1 V 1 z", end: "M 0 1 V 0 Q .5 0 1 0 V 1 z", },
            left: { start: "M 0 0 H 0 Q 0 .5 0 1 H 0 V 0 z", end: "M 0 0 H 1 Q 1.1 .5 1 1 H 0 V 0 z", },
            right: { start: "M 1 0 H 1 Q 1 .5 1 1 H 1 V 0 z", end: "M 1 0 H 0 Q -0.1 .5 0 1 H 1 V 0 z", },
        };

        function getDirection(e, el) {
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            const rect = el.getBoundingClientRect();
            const x = -1 * (e.clientX - rect.left - w / 2) * (w > h ? h / w : 1);
            const y = -1 * (e.clientY - rect.top - h / 2) * (h > w ? w / h : 1);
            const d = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90) % 4;
            return ["left", "top", "right", "bottom"][d];
        }

        hoverAnimationItem.on("mouseenter", function(e) {
            const direction = getDirection(e, this);
            const img = $(this).find("img");
            const path = $(this).find(".clip-path");
            const split = splitMap.get(this);

            // Kill any running animation on split characters
            gsap.killTweensOf(split.chars);

            gsap.fromTo(
                path, {
                    attr: { d: clipPathsTo[direction].start }
                }, {
                    attr: { d: clipPathsTo[direction].end },
                    duration: 0.5,
                    ease: "power3.out",
                }
            );
            gsap.to(split.chars, {
                yPercent: 100,
                stagger: -0.015,
                rotateZ: 2.5,
                duration: 0.5,
                ease: "power3.out",
            });
        });

        hoverAnimationItem.on("mouseleave", function(e) {
            const direction = getDirection(e, this);
            const img = $(this).find("img");
            const path = $(this).find(".clip-path");
            const split = splitMap.get(this);

            // Kill any running animation on split characters
            gsap.killTweensOf(split.chars);

            gsap.fromTo(
                path, {
                    attr: { d: clipPathsFrom[direction].start }
                }, {
                    attr: { d: clipPathsFrom[direction].end },
                    duration: 0.5,
                    ease: "power3.out",
                }
            );
            gsap.to(split.chars, {
                yPercent: 0,
                stagger: 0.015,
                rotateZ: 0,
                duration: 0.5,
                ease: "power3.out",
            });
        });

    }

    mkAddons.widgetsList.mk_hover_image_animation = {};
    mkAddons.widgetsList.mk_hover_image_animation.Mk_Hover_Image_Animation = Mk_Hover_Image_Animation;

    // ----------------------------------------------------------

    var mkTeam = function ($scope, $) {

        if (window.innerWidth > 1024) {
            const $items = $scope.find('.mk-team-simple-item');

            $items.on('mouseenter', function() {
                $items.removeClass('mk-team-simple-active-yes');
                $(this).addClass('mk-team-simple-active-yes');
            });
        }

    };

    mkAddons.widgetsList.mk_team = {};
    mkAddons.widgetsList.mk_team.mkTeam = mkTeam;

    // ----------------------------------------------------------

    var mkHorizontalShowcase = function ($scope, $) {

        gsap.registerPlugin(ScrollTrigger, SplitText);

        gsap.matchMedia().add("(min-width: 1024px)", function() {

            document.querySelectorAll(".mk-horizontal-showcase").forEach((showcase) => {
                const holder = showcase.querySelector(".mk-horizontal-showcase-holder");
                const items = showcase.querySelectorAll(".mk-horizontal-showcase-item");
                const itemCount = items.length;
                const totalScrollWidth = -1 * (holder.offsetWidth - window.innerWidth);

                const marqueeTimelines = [];

                // Main scroll timeline (scoped to this showcase)
                const mainTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: showcase,
                        start: "top top",
                        end: `+=${itemCount}00%`,
                        scrub: 1,
                        pin: true,
                    },
                }).to(holder, { x: totalScrollWidth });

                items.forEach((item, index) => {
                    const marquee = item.querySelector(".mk-horizontal-scroll-content");
                    const tl = initMarquee(marquee);
                    marqueeTimelines.push(tl);

                    item.addEventListener("mouseenter", () => {
                        tl.play();
                        gsap.fromTo(tl, { timeScale: 0 }, { timeScale: 1, ease: "power1.in" });
                    });

                    item.addEventListener("mouseleave", () => {
                        gsap.to(tl, {
                            timeScale: 0,
                            ease: "power1.out",
                            onComplete: () => tl.pause(),
                        });
                    });
                });

                function initMarquee(marquee) {
                    const duration = 16;
                    const marqueeContent = marquee.querySelector(".mk-horizontal-scroll-content-inner");
                    if (!marqueeContent) return;

                    // Clone content for loop effect
                    const clone1 = marqueeContent.cloneNode(true);
                    const clone2 = marqueeContent.cloneNode(true);
                    marquee.appendChild(clone1);
                    marquee.appendChild(clone2);

                    const marqueeTimeline = gsap.timeline({
                        paused: true,
                        repeat: -1,
                        defaults: { ease: "none" },
                    });

                    const width = parseInt(getComputedStyle(marqueeContent).getPropertyValue("width"), 10);

                    marqueeTimeline.fromTo(
                        marquee.querySelectorAll(".mk-horizontal-scroll-content-inner"),
                        { x: 0 },
                        { x: -width, duration }
                    );

                    return marqueeTimeline;
                }
            });


        });

    };

    mkAddons.widgetsList.mk_horizontal_showcase = {};
    mkAddons.widgetsList.mk_horizontal_showcase.mkHorizontalShowcase = mkHorizontalShowcase;

    // ----------------------------------------------------------

    var mkVideoHeading = function ($scope, $) {

        if ( $("body").hasClass("elementor-editor-active") ) { return; }

        gsap.registerPlugin(ScrollTrigger);

        gsap.matchMedia().add("(min-width: 1024px)", function () {
            gsap.set(".mk-video-heading-inner-1", {
                x: function () {
                    return (($(".mk-video-heading-outer").width() - ($(".mk-video-heading-text1").width() + $(".mk-video-heading-text2").width())) / 2 );
                },
            });
            gsap.set(".mk-video-heading-inner-2", {
                x: function () {
                    return (($(".mk-video-heading-outer").width() - $(".mk-video-heading-text3").width()) / 2 );
                },
            });
        });

        gsap.set(".mk-video-heading-text span", {rotationX: 90, perspective: 2000, opacity: 0, });
        gsap.set(".mk-video-heading-chip", {opacity: 0, y: 50, });

        let timeline = gsap.timeline();

        gsap.matchMedia().add("(max-width: 1024px)", function () {
            timeline
                .fromTo(".mk-video-heading-video-main", { clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)", }, { delay: 0.3, clipPath: "polygon(35% 30%, 65% 30%, 65% 70%, 35% 70%)", duration: 0.5, ease: "power2.out", } );

            timeline
                .to(".mk-video-heading-video-main", { delay: 0.01, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, ease: "power2.out", }, "start" )
                .from(".mk-video-heading-video-main video", {delay: 0.01, duration: 1, ease: "power2.out", scale: 1.5, }, "start" );
        });

        timeline
            .to(".mk-video-heading-inner-1 .mk-video-heading-text span", { delay: 0, rotationX: 0, perspective: 0, duration: 1, opacity: 1, ease: "power2.out", }, "start" )
            .to(".mk-video-heading-inner-2 .mk-video-heading-text span", { delay: 0.25, rotationX: 0, perspective: 0, duration: 1, opacity: 1, ease: "power2.out", }, "start" )
            .to(".mk-video-heading-chip", {delay: 1.1, opacity: 1, stagger: 0.4, y: 0, }, "start");

        gsap.matchMedia().add("(min-width: 1024px)", function () {
            timeline
                .from(".mk-video-heading-video-1, .mk-video-heading-video-2", { width: 0, marginLeft: 0, marginRight: 0, duration: 1, ease: "power2.out", } )
                .to(".mk-video-heading-inner-1, .mk-video-heading-inner-2", { x: 0, }, "<");
        });
    };

    mkAddons.widgetsList.mk_video_heading = {};
    mkAddons.widgetsList.mk_video_heading.mkVideoHeading = mkVideoHeading;

    // ----------------------------------------------------------

    var mkPinnedTitle = function ($scope, $) {
        let $holder = $scope.find('.mk-pinned-title');

        // Only run if element exists
        if (!$holder.length) return;

        gsap.registerPlugin(ScrollTrigger);
        gsap.config({ nullTargetWarn: false });
        gsap.defaults({ overwrite: "auto" });

        gsap.matchMedia().add("(min-width: 1024px)", function () {
            let animSettingsRaw = $holder.attr('data-settings'),
                animSettings = JSON.parse(animSettingsRaw),
                start_position = parseInt('-' + animSettings.start_position),
                title_maxwidth_end = animSettings.title_maxwidth_end,
                fontsize_end = animSettings.fontsize_end,
                lineheight_end = animSettings.lineheight_end;

            let container = $scope.find(".mk-pinned-title-holder")[0]; // get the raw DOM element
            let image = $scope.find(".mk-pinned-title-text")[0];

            if (container && image) {
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        scrub: true,
                        pin: false,
                        start: 'top 100%',
                        end: 'bottom center',
                    },
                    defaults: {
                        ease: "linear",
                        duration: 2
                    }
                });

                tl.from(image, {
                    yPercent: start_position,
                    ease: "none",
                }).to(image, {
                    yPercent: 10,
                    fontSize: fontsize_end,
                    lineHeight: lineheight_end + 'px',
                    maxWidth: title_maxwidth_end,
                    ease: "none",
                });
            }
        });
    };

    mkAddons.widgetsList.mk_pinned_title = {};
    mkAddons.widgetsList.mk_pinned_title.mkPinnedTitle = mkPinnedTitle;

    // ----------------------------------------------------------

    var mkFaq = function ($scope, $) {
        var elementSettings = getElementSettings($scope),
            $faq_items = $scope.find(".mk-faq-item"),
            $faq_type = elementSettings.faq_type,
            $faq_speed = elementSettings.toggle_speed;

        // Open default active tab
        $faq_items.each(function () {
            var $item = $(this);
            var $title = $item.find(".mk-faq-tab-title");

            if ($title.hasClass("mk-faq-tab-active-default")) {
                $title.addClass("mk-faq-tab-show mk-faq-tab-active");
                $item.find('.mk-faq-tab-content').slideDown($faq_speed);
                $item.addClass("mk-faq-item-active");
            }
        });

        // Unbind previous clicks
        $faq_items.off("click");

        // Click event on the full item
        $faq_items.on("click", function (e) {
            e.preventDefault();

            var $item = $(this),
                $title = $item.find(".mk-faq-tab-title"),
                $content = $item.find('.mk-faq-tab-content'),
                $all_items = $scope.find(".mk-faq-item"),
                $all_titles = $scope.find(".mk-faq-tab-title"),
                $all_contents = $scope.find(".mk-faq-tab-content");

            if ($faq_type === 'faq') {
                if ($title.hasClass("mk-faq-tab-show")) {
                    $title.removeClass("mk-faq-tab-show mk-faq-tab-active mk-faq-tab-active-default");
                    $content.slideUp($faq_speed);
                    $item.removeClass("mk-faq-item-active");
                } else {
                    $all_titles.removeClass("mk-faq-tab-show mk-faq-tab-active mk-faq-tab-active-default");
                    $all_contents.slideUp($faq_speed);
                    $all_items.removeClass("mk-faq-item-active");

                    $title.addClass("mk-faq-tab-show mk-faq-tab-active");
                    $content.slideDown($faq_speed);
                    $item.addClass("mk-faq-item-active");
                }
            } else {
                // Toggle mode
                if ($title.hasClass("mk-faq-tab-show")) {
                    $title.removeClass("mk-faq-tab-show mk-faq-tab-active");
                    $content.slideUp($faq_speed);
                    $item.removeClass("mk-faq-item-active");
                } else {
                    $title.addClass("mk-faq-tab-show mk-faq-tab-active");
                    $content.slideDown($faq_speed);
                    $item.addClass("mk-faq-item-active");
                }
            }
        });
    }

    mkAddons.widgetsList.mk_faq = {};
    mkAddons.widgetsList.mk_faq.mkFaq = mkFaq;


    // cursor with arrow icon
    var mkArrowCursor = {
        cursorApended: false,
        init : function () {
            const dragSelectors = '.mk--arrow-cursor';
            const $dragSelectors = $(dragSelectors);

            if ($dragSelectors.length) {

                $dragSelectors.each( function () {

                    if (false === mkArrowCursor.cursorApended) {
                        mkAddons.body.append( '<div class="mk-arrow-cursor"><div class="mk-arrow-cursor-inner"><span class="mk-arrow-cursor-bg"></span><span class="mk-arrow-cursor-icon"><svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 38.1" style="fill:none;stroke:currentColor"><path d="M0 18.5H35.5M35.5 18.5C29.3333 17.1667 17 11.6 17 0M35.5 18.5C29.3333 19.6667 17 25 17 37" stroke-width="3.5"></path></svg></span></div></div>' );
                        mkArrowCursor.cursorApended = true;
                    }

                    const $cursorHolder = $('.mk-arrow-cursor');

                    if ( $(this).hasClass('mk--drag-cursor-light-skin') ) {
                        $cursorHolder.addClass('mk-skin--light');
                    }

                    if (!mkAddons.html.hasClass('touchevents')) {

                        let $bg = $cursorHolder.find('.mk-arrow-cursor-bg'),
                            $arrow = $cursorHolder.find('.mk-arrow-cursor-icon'),
                            xMove = 0,
                            yMove = 0;

                        function handleMoveCursorOne( event ) {
                            xMove = (event.clientX - 60).toFixed(2);
                            yMove = (event.clientY - 60).toFixed(2);

                            gsap.to( $bg, {x: xMove, y: yMove, duration: .39, }, );
                            gsap.to( $arrow, {x: xMove, y: yMove, duration: .45, }, );

                            !$cursorHolder.hasClass( 'mk--show' ) && $cursorHolder.addClass( 'mk--show' );
                        }

                        $( document ).on('pointermove', dragSelectors, handleMoveCursorOne );

                        mkCursorSelectors($cursorHolder, dragSelectors);

                    }

                }); // for each

            } // end if
        },
    };

    mkAddons.body.mkArrowCursor = mkArrowCursor;


    // Initiate functions
    var mkGridItems = function () {
        var isEditMode = Boolean( elementorFrontend.isEditMode() );
        if (isEditMode) {
            mkAddons.scroll = $( window ).scrollTop();
            mkAddons.mkPagination.init();
            mkAddons.mkFilter.init();
            mkAddons.mkMasonryLayout.init();
            mkAddons.mkInfoFollow.init();
            mkAddons.mkGridItemLoad.init();
            mkAddons.mkGridParallaxEffect.init();
            mkAddons.body.mkEyeCursor.init();
            mkAddons.body.mkArrowCursor.init();
        }
    }

    mkAddons.widgetsList.mk_portfolio_modern = {};
    mkAddons.widgetsList.mk_portfolio_modern.mkGridItems = mkGridItems;

    mkAddons.widgetsList.mk_portfolio_tooltip = {};
    mkAddons.widgetsList.mk_portfolio_tooltip.mkGridItems = mkGridItems;

    // End Post Grid ---------------------------------------------

    // ------------------------------------------------------------
    // Filterable Gallery --------------------------------------------------
    // ------------------------------------------------------------

    var mkGallery = {
        init: function () {

            var $galleryDiv = $('.mk-filterable-gallery');

            if ( $galleryDiv.length ) {
                var $isoGrid    = $galleryDiv.children('.mk-filterable-gallery-grid'),
                    $btns       = $galleryDiv.children('.mk-filterable-gallery-btns'),
                    is_rtl      = $galleryDiv.data('rtl') ? false : true,
                    layout      = $galleryDiv.data('layout');

                    $galleryDiv.imagesLoaded( function(is_rtl) {
                        if ( 'masonry' == layout ) {

                            var holder = $galleryDiv.find('.mk-gal-masonry-on');
                            if ( holder.length ) {
                                holder.each( function () {
                                    mkGallery.createMasonry( $( holder ),$btns,is_rtl );
                                });
                            }

                        } else {
                            var $grid = $isoGrid.isotope({
                                itemSelector: '.mk-filterable-gallery-item',
                                layoutMode: 'fitRows',
                                originLeft: is_rtl
                            });
                            mkAddons.mkGallery.itemsFilter($grid,$btns,is_rtl);

                        }

                    });

                mkScrollLoad.init();
                mkItemParallaxEffect.init();

            }
        },
        reInit: function () {
            var $holder = $('.mk-gal-masonry-on');
            if ( $holder.length ) {
                $holder.each( function () {
                    var masonryDiv = $( $holder ).find( '.mk-gallery-grid-inner' );

                    if ( typeof masonryDiv.isotope === 'function' ) {
                        masonryDiv.isotope( 'layout' );
                    }
                });
            }
        },
        createMasonry: function ( holder,$btns,is_rtl ) {
            var masonryDiv   = holder.find( '.mk-gallery-grid-inner' ),
                $masonryItem = masonryDiv.find( '.mk-filterable-gallery-item' );

            mkAddons.mkWaitForImages.check( masonryDiv, function () {
            // mkGallery.mkWaitForImages( masonryDiv, function () {
                    if ( typeof masonryDiv.isotope === 'function' ) {
                        var $grid = masonryDiv.isotope({
                            layoutMode: 'packery',
                            itemSelector: '.mk-filterable-gallery-item',
                            percentPosition: true,
                            // originLeft: $is_rtl,
                            masonry: {
                                columnWidth: '.mk-gallery-grid-masonry-sizer',
                                gutter: '.mk-gallery-grid-masonry-gutter'
                            }
                        });

                        if ( holder.hasClass( 'mk-items--packery' ) ) {
                            var size = mkGallery.getPackeryImageSize( masonryDiv, $masonryItem );
                            mkGallery.setPackeryImageProportionSize( masonryDiv, $masonryItem, size );
                        }

                        masonryDiv.isotope( 'layout' );
                        mkAddons.mkGallery.itemsFilter($grid,$btns,is_rtl);
                    }

                    masonryDiv.addClass( 'mk-gal--masonry-init' );
            });
        },
        getPackeryImageSize: function ( $holder, $item ) {
            var $squareItem = $holder.find( '.mk-item--square' );
            if ( $squareItem.length ) {

                var $squareItemImage      = $squareItem.find( 'img' ),
                    squareItemImageWidth  = $squareItemImage.width(),
                    squareItemImageHeight = $squareItemImage.height();

                if ( squareItemImageWidth !== squareItemImageHeight ) {
                    return squareItemImageHeight;
                } else {
                    return squareItemImageWidth;
                }
            } else {
                var size    = $holder.find( '.mk-gallery-grid-masonry-sizer' ).width(),
                    padding = parseInt( $item.css( 'paddingLeft' ), 10 );

                return (size - 2 * padding); // remove item side padding to get real item size
            }
        },
        setPackeryImageProportionSize: function ( $holder, $item, size ) {
            var padding          = parseInt( $item.css( 'paddingLeft' ), 10 ),
                $squareItem      = $holder.find( '.mk-item--square' ),
                $horizontalItem  = $holder.find( '.mk-item--horizontal' ),
                $verticalItem    = $holder.find( '.mk-item--vertical' ),
                $largeSquareItem = $holder.find( '.mk-item--large-square' ),
                isMobileScreen   = mkAddons.windowWidth <= 680;

            $item.css( 'height', size );

            if ( $horizontalItem.length ) {
                $horizontalItem.css( 'height', Math.round( size / 2 ) );
            }

            if ( $verticalItem.length ) {
                $verticalItem.css( 'height', Math.round( 2 * (size + padding) ) );
            }

            if ( ! isMobileScreen ) {

                if ( $horizontalItem.length ) {
                    $horizontalItem.css( 'height', size );
                }

                if ( $largeSquareItem.length ) {
                    $largeSquareItem.css( 'height', Math.round( 2 * (size + padding) ) );
                }
            }
        },
        itemsFilter: function( $grid, $btns, $is_rtl ) {
            $btns.on('click', 'a', function () {
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue,
                    originLeft: $is_rtl
                });

                return false;
            });

            $btns.each(function (i, btns) {
                var btns = $(btns);

                btns.on('click', '.mk-filterable-gallery-btn', function () {
                    btns.find('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                });
            });
        }
    };

    mkAddons.mkGallery = mkGallery;

    $(window).on('resize', function () {
        if (!$("body").hasClass("elementor-editor-active")) {
            mkAddons.mkGallery.reInit();
        }
    });


    $( document ).ready( function () {
        mkGallery.init();
    });

    // Initiate functions
    var mkFilterableGallery = function () {
        var isEditMode = Boolean( elementorFrontend.isEditMode() );
        if (isEditMode) {
            mkAddons.scroll = $( window ).scrollTop();
            mkAddons.mkGallery.init();
        }
    }

    mkAddons.widgetsList.mk_filterable_gallery = {};
    mkAddons.widgetsList.mk_filterable_gallery.mkFilterableGallery = mkFilterableGallery;

    // ----------------------------------------------------------

    // Swiper Slider
    var mkSwiperSlider = function ($scope, $) {
        swmTheme.swmSwiper.init();
    }

    // Custom Cursor Elementor Editor display -------------------

    mkAddons.widgetsList.mk_basic_slider = {};

    var mkInitCustomCursor = function ($scope, $) {
            mkCustomCursor.init();
        }

    mkAddons.widgetsList.mk_basic_slider.mkInitCustomCursor = mkInitCustomCursor;

    // ----------------------------------------------------------

    // Call Elementor Function

    $(window).on('elementor/frontend/init', function () {

        // only display in elementor editor,
        // default frontend has swmSwiper.init() in theme's main.js
        var isEditMode = Boolean( elementorFrontend.isEditMode() );

        if (isEditMode) {

            mkAddons.widgetsList.mk_portfolio_slider = {};
            mkAddons.widgetsList.mk_portfolio_slider.mkSwiperSlider = mkSwiperSlider;

            mkAddons.widgetsList.mk_carousel_slider = {};
            mkAddons.widgetsList.mk_carousel_slider.mkCarouselSlider = mkSwiperSlider;

            mkAddons.widgetsList.mk_basic_slider.mkBasicSlider = mkSwiperSlider;

        }

        for ( var key in mkAddons.widgetsList ) {
            for ( var keyChild in mkAddons.widgetsList[key] ) {
                elementorFrontend.hooks.addAction('frontend/element_ready/' + key + '.default', mkAddons.widgetsList[key][keyChild]);
            }
        }

        // Link 'Edit layout'
        jQuery( '.mk_section_editor_link:not(.inited)' )
            .addClass('inited')
            .on( 'click', function(e) {
                e.stopImmediatePropagation();
                return true;
        });
    });


})( jQuery );