(function($){

    'use strict';

    window.swmTheme       = {};
    swmTheme.body         = $( 'body' );
    swmTheme.scroll       = 0;
    swmTheme.adminbar = $( '#wpadminbar' );
    swmTheme.wpAdminBarHeight =  swmTheme.adminbar.length === 0 || swmTheme.adminbar.css( 'display' ) == 'none' || swmTheme.adminbar.css( 'position' ) == 'absolute' ? 0 : swmTheme.adminbar.height();

    swmTheme.windowWidth  = $( window ).width();
    swmTheme.windowHeight = $( window ).height();

    function determineType(value) {
        return determineType = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(value) {
            return typeof value;
        } : function(value) {
            return value && "function" == typeof Symbol && value.constructor === Symbol && value !== Symbol.prototype ? "symbol" : typeof value;
        }, determineType(value);
    }

    var SwmThemeSettings = {

        init: function() {
            this._gsapSmoothScroll();
            this._swmBrowserDetection();
            $(".fitVids").fitVids();
            this._goTopScroll();
            this._smoothScroll();
            this._listWidgets();
            this._magnificPopup();
            this._main_Navigation();
            this._dropDownMenu();
            this._stickyHeader();
            this._readingProgressBar();
            this._ItemLoad();

            swmTheme.swmWaitForImages = this._swmWaitForImages;
        },

        _gsapSmoothScroll: function() {

            var smoothSpeed = 1.35,
                enableOnMobile = false;

            if (null !== swmJSOptions.smoothScrollOn && 'on' === swmJSOptions.smoothScrollOn ) {
                smoothSpeed = swmJSOptions.smoothNumber;
                enableOnMobile = "on" === swmJSOptions.smoothScrollMobileOn;

                if ("function" == typeof ScrollSmoother && "object" === ("undefined" == typeof gsap ? "undefined" : determineType(gsap))) {
                    var mediaMatcher = gsap.matchMedia();

                    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TweenMax);

                    gsap.config({
                        nullTargetWarn: true,
                    });

                    if (!$("body").hasClass("elementor-editor-active")) {

                        if (enableOnMobile) {
                            let swm_smoother = ScrollSmoother.create({
                                smooth: smoothSpeed,
                                effects: true,
                                smoothTouch: 0.1,
                                normalizeScroll: false,
                                ignoreMobileResize: true
                            });
                        } else {
                            mediaMatcher.add("(min-width: 768px)", function() {
                                let swm_smoother = ScrollSmoother.create({
                                    smooth: smoothSpeed,
                                    effects: true,
                                    smoothTouch: 0.1,
                                    normalizeScroll: false,
                                    ignoreMobileResize: true
                                });
                            });
                        }

                    }


                }


            }

        },

        _swmWaitForImages: function($element, callback) {
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

        _ItemLoad: function() {
                this.holder = $( '.swm-scroll-load:not(.swm--loaded)' );

                function swmRandomArbitrary( min, max ) { return Math.floor( Math.random() * (max - min) + min ); }

                if ( this.holder.length ) {
                    this.holder.each(
                        function () {
                            var holder      = $( this ),
                                randomNum   = swmRandomArbitrary(10, 400 ),
                                appearDelay = $( this ).attr( 'data-appear-delay' );

                            if ( ! appearDelay ) {
                                SwmThemeSettings._ItemViewPort( holder, function () {
                                    holder.addClass( 'swm--loaded' );
                                });
                            } else {
                                appearDelay = (appearDelay === 'random') ? randomNum : appearDelay;
                                SwmThemeSettings._ItemViewPort( holder, function () {
                                    setTimeout( function () { holder.addClass( 'swm--loaded' ); }, appearDelay );
                                });
                            }
                        });
                }
        },

        _swmBrowserDetection: function() {

            function swmCheckBrowser(name) {
                var isBrowser = false;

                switch (name) {
                    case 'chrome':
                        isBrowser = /Chrome/.test( navigator.userAgent ) && /Google Inc/.test( navigator.vendor );
                        break;
                    case 'safari':
                        isBrowser = /Safari/.test( navigator.userAgent ) && /Apple Computer/.test( navigator.vendor );
                        break;
                    case 'firefox':
                        isBrowser = navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1;
                        break;
                    case 'ie':
                        isBrowser = window.navigator.userAgent.indexOf( 'MSIE ' ) > 0 || ! ! navigator.userAgent.match( /Trident.*rv\:11\./ );
                        break;
                    case 'edge':
                        isBrowser = /Edge\/\d./i.test( navigator.userAgent );
                        break;
                }

                return isBrowser;
            }
            var browsers = ['chrome', 'safari', 'firefox', 'ie', 'edge'];

            $.each( browsers, function ( key, value ) {
                if ( swmCheckBrowser( value ) && typeof swmTheme.body !== 'undefined' ) {
                    if ( value === 'ie' ) {
                        value = 'ms-explorer';
                    }

                    swmTheme.body.addClass( 'swm-browser--' + value );
                }
            });

        },

        _ItemViewPort: function($element, callback, onlyOnce) {

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
        },

        _stickyHeaderDisplay: function(element, spacer) {

            if ( $(element).length > 0 )  {

                var themeHeader      = $('#swm-header'),
                    getHeaderHeight  = parseInt(themeHeader.innerHeight(), 10),
                    getHeaderElement = themeHeader.find('.elementor > .elementor-element'),
                    stickyHeader     = $(element),
                    windowTopScroll  = $(window).scrollTop(),
                    stickySpacer     = $(spacer),
                    getHeaderHeight  = ( getHeaderHeight === 0 ) ? parseInt(getHeaderElement.innerHeight(), 10) : getHeaderHeight;
                    // fix for header position absolute property

                if ( windowTopScroll > getHeaderHeight ){

                    if ( ! (stickyHeader.hasClass('sticky-on'))) {
                        stickyHeader
                            .addClass('sticky-on')
                            .css('top',(getHeaderHeight * -1))
                            .animate({'top': swmTheme.wpAdminBarHeight },300);
                        if ( stickySpacer ) { stickySpacer.css({'height':getHeaderHeight+'px' }); }
                    }

                } else {

                    if (stickyHeader.hasClass('sticky-on')) {
                        stickyHeader
                            .removeClass('sticky-on')
                            .css('top', 0);
                        if ( stickySpacer ) { stickySpacer.css({'height': 0 }); }
                    }

                }

            }
        },

        _stickyHeader: function() {
            if ( swmTheme.body.hasClass('swm-hide-sticky-header-mobile')) {
                if ( swmTheme.windowWidth <= 1024 ) {
                    return;
                }
            }
            SwmThemeSettings._stickyHeaderDisplay('.swm-sticky-scoll-down');
        },

        _goTopScroll: function() {

            if ($(".swm-btt-btn").length) {
                var offset = 50;
                var duration = 550;
                jQuery(window).on('scroll', function() {
                    if (jQuery(this).scrollTop() > offset) {
                        jQuery('.swm-btt-btn').addClass('active-progress');
                    } else {
                        jQuery('.swm-btt-btn').removeClass('active-progress');
                    }
                });
                jQuery('.swm-btt-btn').on('click', function(event) {
                    event.preventDefault();
                    jQuery('html, body').animate({
                        scrollTop: 0
                    }, duration);
                    return false;
                })
            }

        },

        _smoothScroll: function() {
            $('a.smooth-scroll').on('click',function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                    if (target.length) {
                        $('html, body').animate({
                        scrollTop: target.offset().top - 140
                    }, 1000);
                    return false;
                    }
                }

            });

            $('a[href^="#"]').on('click', function(event) {
                var target = this.getAttribute('href');

                // Skip empty or just # hash
                if (!target || target === '#') return;

                // Skip WooCommerce tab links or any element that has aria-controls (used in tabs/accordions)
                if ($(this).attr('aria-controls')) return;

                // Skip if parent has classes related to tabs or accordions
                if ($(this).closest('.wc-tabs-wrapper, .tabs, .accordion, .tab-content').length) return;

                var $targetElement = $(target);
                if ($targetElement.length) {
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: $targetElement.offset().top - 100
                    }, 400);
                }
            });


        },

        _listWidgets: function() {
            $(".sidebar,.sidebar .theiaStickySidebar,.footer .swm-f-widget").children(".widget_meta,.widget_categories,.widget_pages,.widget_archive,.widget_recent_comments,.widget_recent_entries,.widget_nav_menu,.widget_product_categories,.widget_layered_nav_filters,.archives-link,.widget_rss,.widget_rating_filter,.woocommerce-widget-layered-nav,.widget_mk_useful_links_wid").addClass("swm-list-widgets");
        },

        _magnificPopup: function() {

            $('.swm-popup-img').magnificPopup({
                type: 'image'
            });

            $('.swm-popup-gallery').magnificPopup({
                type: 'image',
                gallery:{
                    enabled:true,
                    tCounter:''
                },
                zoom: {
                    enabled: true,
                    duration: 300,
                    easing: 'ease-in-out'
                }
            });

            $('.popup-youtube, .popup-vimeo, .popup-gmaps,.swm-popup-video').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });

            $('.swm-popup-video-autoplay').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false,
                iframe: {
                        markup: '<div class="mfp-iframe-scaler">' +
                            '<div class="mfp-close"></div>' +
                            '<iframe class="mfp-iframe" frameborder="0" allow="autoplay"></iframe>' +
                            '</div>',
                        patterns: {
                            youtube: {
                                index: 'youtube.com/',
                                id: 'v=',
                                src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                            }
                        }
                    }
            });

            $('.swm-popup-gallery-alt').magnificPopup(
                {
                    delegate: 'a',
                    type: 'image',
                    tLoading: 'Loading image #%curr%...',
                    mainClass: 'mfp-img-mobile',
                    gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0,1]
                },
                image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                    titleSrc: function(item) {
                        return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                    }
                }
            });

        },

        _main_Navigation: function() {

            // if admin bar, give top margin
            var swm_wpAdminBar = $('#wpadminbar');

            // clone primary many to mobile menu
            if ( !$('#swm-mobi-nav > ul').length && $('ul.swm-primary-nav').length ) {
                $("ul.swm-primary-nav").eq(0).clone().appendTo("#swm-mobi-nav");
                $("#swm-mobi-nav ul.mk-sections-megamenu").remove();
                $('#swm-mobi-nav > ul').removeClass('mk-nav-menu swm-primary-nav');
            }

            SwmThemeSettings._mobileMenu();
        },
        /* mobile dropdown menu */

        _mobileMenu: function() {

            var mobileMenuBox = $('.swm-mobi-nav-wrap'),
                closeIcon = $('.swm-mobi-nav-close'),
                overlaySection = $('#swm-mobi-nav-overlay-bg');

            // close icon
            closeIcon.on('click', function(){
                $(mobileMenuBox).removeClass('open');
                overlaySection.removeClass('m_toggle');
            });

            // overlay
            overlaySection.on('click', function(){
                $(mobileMenuBox).removeClass('open');
                overlaySection.removeClass('m_toggle');
            });

            // add arrow icon
            mobileMenuBox.find('li ul').parent().addClass('swm-has-sub-menu');
            mobileMenuBox.find(".swm-has-sub-menu").prepend('<span class="swm-mini-menu-arrow"></span>');

            mobileMenuBox.find('.swm-mini-menu-arrow').on('click', function() {
                if ($(this).siblings('ul').hasClass('open')) {
                    $(this).siblings('ul').removeClass('open').slideUp();
                } else {
                    $(this).siblings('ul').addClass('open').slideDown();
                }

                if ($(this).hasClass('inactive')) {
                    $(this).removeClass('inactive');
                } else {
                    $(this).addClass('inactive');
                }
            });

            // click event to open dropdown menu

            $('.swm-mobi-nav-icon').on('click', function() {

                var dd_menu = $('.swm-mobi-nav-wrap'),
                    overlaySection = $('#swm-mobi-nav-overlay-bg');

                $('.swm-mobi-nav-close').addClass('btn-show');
                (dd_menu.hasClass('open')) ? dd_menu.removeClass('open') : dd_menu.addClass('open');
                (overlaySection.hasClass('m_toggle')) ? overlaySection.removeClass('m_toggle') : overlaySection.addClass('m_toggle');

            });

        },

        _dropDownMenu: function() {

            $('.swm-primary-nav > li').on('mouseenter', function() {
                var dropDownCssTransformValue = 0,
                    $dropDowns = $('ul', this);
                    $dropDowns.removeClass('invert');

                if ($('>ul', this).css('transform')) {
                    dropDownCssTransformValue = parseInt($('>ul', this).css('transform').split(',')[5]);
                }
                if (isNaN(dropDownCssTransformValue)) {
                    dropDownCssTransformValue = 0;
                }

                $dropDowns.each(function() {
                    var $dropDown = $(this),
                        itemOffset = $dropDown.offset();

                    if (itemOffset.left - $('#swm-page').offset().left + $dropDown.outerWidth() > $('#swm-page').width()) {
                        $dropDown.addClass('invert');
                    }
                });
            });

        },

        _readingProgressBar: function() {

            readingProgressBarFill();
            window.onscroll = function() {readingProgressBarFill()};

            function readingProgressBarFill() {
                if(document.querySelector('.swm-mybar')) {
                    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    var scrolled = (winScroll / height) * 100;
                    document.querySelector("#swm-mybar").style.width = scrolled + "%";
                }
            }

            if( $('#wpadminbar').length && $('.swm-reading-progress-bar-container').length ) {
                if ( 0 === $('.swm-reading-progress-bar-container').position().top ) {
                    $('.swm-reading-progress-bar-container').css('top', ' 32px');
                }
            }
        }

    };  // SwmThemeSettings

    var swmStickyHeaderScrollUp = {
        verticalScroll: 0,
        init: function () {

            if ( swmTheme.body.hasClass('swm-hide-sticky-header-mobile')) {
                if ( swmTheme.windowWidth <= 1024 ) {
                    return;
                }
            }

            var themeHeader = $('#swm-header'),
                getHeaderElement = themeHeader.find('.elementor > .elementor-element'),
                getHeaderHeight = parseInt(themeHeader.innerHeight(), 10);

                // fix for header position absolute property
                getHeaderHeight = ( getHeaderHeight === 0 ) ? parseInt(getHeaderElement.innerHeight(), 10) : getHeaderHeight;

            var displayAmount = getHeaderHeight + swmTheme.wpAdminBarHeight;
            swmStickyHeaderScrollUp.verticalScroll = $( document ).scrollTop();

            // Set sticky visibility
            swmStickyHeaderScrollUp.setVisibility( displayAmount );

            $(window).on('scroll', function () {
                swmStickyHeaderScrollUp.setVisibility(displayAmount);
            });

        },
        setVisibility: function ( displayAmount ) {
            var isStickyHidden = swmTheme.scroll < displayAmount;

            if ( $( '#swm-sticky-header' ).hasClass( 'swm-sticky-scoll-up' ) ) {
                var currentTopScroll = $( document ).scrollTop();

                isStickyHidden = (currentTopScroll > swmStickyHeaderScrollUp.verticalScroll && currentTopScroll > displayAmount) || (currentTopScroll < displayAmount);

                swmStickyHeaderScrollUp.verticalScroll = $( document ).scrollTop();
            }

            if ( isStickyHidden ) {
                swmTheme.body.removeClass( 'swmShowStickyHeader' );
            } else {
                swmTheme.body.addClass( 'swmShowStickyHeader' );
            }

        }
    }; // swmStickyHeaderScrollUp


    // Swiper Slider
    var swmSwiper = {
        init: function ( settings ) {
            this.holder = $( '.swm-swiper-container' );

            // Allow overriding the default config
            $.extend( this.holder, settings );

            if ( this.holder.length ) {
                this.holder.each( function () {
                    swmSwiper.initSlider( $( this ) );
                });
            }
        },
        initSlider: function ( $currentItem ) {
            var options = swmSwiper.getOptions( $currentItem ),
                events  = swmSwiper.getEvents( $currentItem, options );

            var $swiper = new Swiper(
                $currentItem[0],
                Object.assign(options, events)
            );
        },
        getOptions: function ( $holder ) {
            var sliderOptions       = typeof $holder.data( 'options' ) !== 'undefined' ? $holder.data( 'options' ) : {},
                direction           = sliderOptions.direction !== undefined && sliderOptions.direction !== '' ? sliderOptions.direction : 'horizontal',
                spaceBetween        = sliderOptions.spaceBetween !== undefined && sliderOptions.spaceBetween !== '' ? sliderOptions.spaceBetween : 0,
                spaceBetween1512    = sliderOptions.spaceBetween1512 !== undefined && sliderOptions.spaceBetween1512 !== '' ? sliderOptions.spaceBetween1512 : spaceBetween,
                slidesPerView       = sliderOptions.slidesPerView !== undefined && sliderOptions.slidesPerView !== '' ? sliderOptions.slidesPerView : 1,
                slidesPerViewTablet = sliderOptions.slidesPerViewTablet !== undefined && sliderOptions.slidesPerViewTablet !== '' ? sliderOptions.slidesPerViewTablet : 1,
                slidesPerViewMobile = sliderOptions.slidesPerViewMobile !== undefined && sliderOptions.slidesPerViewMobile !== '' ? sliderOptions.slidesPerViewMobile : 1,
                centeredSlides      = sliderOptions.centeredSlides !== undefined && sliderOptions.centeredSlides !== '' ? sliderOptions.centeredSlides : false,
                mouseWheel          = sliderOptions.mouseWheel !== undefined && sliderOptions.mouseWheel !== '' ? sliderOptions.mouseWheel : false,
                sliderScroll        = sliderOptions.sliderScroll !== undefined && sliderOptions.sliderScroll !== '' ? sliderOptions.sliderScroll : false,
                loop                = sliderOptions.loop !== undefined && sliderOptions.loop !== '' ? sliderOptions.loop : true,
                autoplay            = sliderOptions.autoplay !== undefined && sliderOptions.autoplay !== '' ? sliderOptions.autoplay : true,
                hoverPause          = sliderOptions.hoverPause !== undefined && sliderOptions.hoverPause !== '' ? sliderOptions.hoverPause : true,
                speed               = sliderOptions.speed !== undefined && sliderOptions.speed !== '' ? parseInt(sliderOptions.speed, 10 ) : 5000,
                speedAnimation      = sliderOptions.speedAnimation !== undefined && sliderOptions.speedAnimation !== '' ? parseInt(sliderOptions.speedAnimation, 10 ) : 800,
                slideAnimation      = sliderOptions.slideAnimation !== undefined && sliderOptions.slideAnimation !== '' ? sliderOptions.slideAnimation : '',
                customStages        = sliderOptions.customStages !== undefined && sliderOptions.customStages !== '' ? sliderOptions.customStages : false,
                customSpaces        = sliderOptions.customSpaces !== undefined && sliderOptions.customSpaces !== '' ? sliderOptions.customSpaces : false,
                outsideNavigation   = sliderOptions.outsideNavigation !== undefined && sliderOptions.outsideNavigation === 'yes',
                nextNavigation      = outsideNavigation ? '.swiper-button-next-' + sliderOptions.unique : ($holder.children( '.swiper-button-next' ).length ? $holder.children( '.swiper-button-next' )[0] : null),
                prevNavigation    = outsideNavigation ? '.swiper-button-prev-' + sliderOptions.unique : ($holder.children( '.swiper-button-prev' ).length ? $holder.children( '.swiper-button-prev' )[0] : null),
                outsidePagination   = sliderOptions.outsidePagination !== undefined && sliderOptions.outsidePagination === 'yes',
                pagination          = outsidePagination ? '.swiper-pagination-' + sliderOptions.unique : ($holder.find( '.swiper-pagination' ).length ? $holder.find( '.swiper-pagination' )[0] : null),
                loopedSlides      = sliderOptions.loopedSlides !== undefined && sliderOptions.loopedSlides !== '' ? parseInt( sliderOptions.loopedSlides ) : null,
                hiddenSlides      = sliderOptions.hiddenSlides !== undefined && sliderOptions.hiddenSlides !== '' ? sliderOptions.hiddenSlides : null,
                parallax          = $holder.hasClass( 'mk-col-num--1' ) ? true : false;

            if ( true === autoplay ) {
                autoplay = {
                    enabled: true,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: ( true === hoverPause ) ? true : false,
                };

                if ( 5000 !== speed ) {
                    autoplay.delay = speed;
                }
            }

            var slidesPerView1512 = 5,
                slidesPerView1368 = 4,
                slidesPerView1200 = 3,
                slidesPerView1024 = 2,
                slidesPerView880  = 1,
                slidesPerView767  = 1;

            if ( sliderOptions.slidesPerView1512 !== undefined && sliderOptions.slidesPerView1512 !== '' ) {
                slidesPerView1512 = 'auto' === sliderOptions.slidesPerView1512 ? 'auto' : sliderOptions.slidesPerView1512;
            }

            if ( sliderOptions.slidesPerView1368 !== undefined && sliderOptions.slidesPerView1368 !== '' ) {
                slidesPerView1368 = 'auto' === sliderOptions.slidesPerView1368 ? 'auto' : sliderOptions.slidesPerView1368;
            }

            if ( sliderOptions.slidesPerView1200 !== undefined && sliderOptions.slidesPerView1200 !== '' ) {
                slidesPerView1200 = 'auto' === sliderOptions.slidesPerView1200 ? 'auto' : sliderOptions.slidesPerView1200;
            }

            if ( sliderOptions.slidesPerView1024 !== undefined && sliderOptions.slidesPerView1024 !== '' ) {
                slidesPerView1024 = 'auto' === sliderOptions.slidesPerView1024 ? 'auto' : sliderOptions.slidesPerView1024;
            }

            if ( sliderOptions.slidesPerView880 !== undefined && sliderOptions.slidesPerView880 !== '' ) {
                slidesPerView880 = 'auto' === sliderOptions.slidesPerView880 ? 'auto' : sliderOptions.slidesPerView880;
            }

            if ( sliderOptions.slidesPerView767 !== undefined && sliderOptions.slidesPerView767 !== '' ) {
                slidesPerView767 = 'auto' === sliderOptions.slidesPerView767 ? 'auto' : sliderOptions.slidesPerView767;
            }

            if ( ! customStages ) {
                slidesPerView1512 = slidesPerView;
                slidesPerView1368 = slidesPerView;
                slidesPerView1200 = slidesPerView;
                slidesPerView1024 = slidesPerViewTablet;
                slidesPerView880  = slidesPerViewTablet;
                slidesPerView767  = slidesPerViewMobile;
            }

            var spaceBetween1512 = 30,
                spaceBetween1368 = 30,
                spaceBetween1200 = 20,
                spaceBetween1024 = 20,
                spaceBetween880  = 15,
                spaceBetween767  = 15;

            if ( sliderOptions.spaceBetween1512 !== undefined && sliderOptions.spaceBetween1512 !== '' ) {
                spaceBetween1512 = parseInt(sliderOptions.spaceBetween1512, 10 );
            }

            if ( sliderOptions.spaceBetween1368 !== undefined && sliderOptions.spaceBetween1368 !== '' ) {
                spaceBetween1368 = parseInt(sliderOptions.spaceBetween1368, 10 );
            }

            if ( sliderOptions.spaceBetween1200 !== undefined && sliderOptions.spaceBetween1200 !== '' ) {
                spaceBetween1200 = parseInt(sliderOptions.spaceBetween1200, 10 );
            }

            if ( sliderOptions.spaceBetween1024 !== undefined && sliderOptions.spaceBetween1024 !== '' ) {
                spaceBetween1024 = parseInt(sliderOptions.spaceBetween1024, 10 );
            }

            if ( sliderOptions.spaceBetween880 !== undefined && sliderOptions.spaceBetween880 !== '' ) {
                spaceBetween880 = parseInt(sliderOptions.spaceBetween880, 10 );
            }

            if ( sliderOptions.spaceBetween767 !== undefined && sliderOptions.spaceBetween767 !== '' ) {
                spaceBetween767 = parseInt(sliderOptions.spaceBetween767, 10 );
            }

            if ( ! customSpaces ) {
                spaceBetween1512 = spaceBetween;
                spaceBetween1368 = spaceBetween;
                spaceBetween1200 = spaceBetween;
                spaceBetween1024 = spaceBetween;
                spaceBetween880 = spaceBetween;
                spaceBetween767 = spaceBetween;
            }

            if ( 'vertical' === direction ) { slidesPerView = 1; }
            // match breakpoint and gutter value from our grid system

            var options = {
                direction: direction,
                slidesPerView: slidesPerView,
                centeredSlides: centeredSlides,
                sliderScroll: sliderScroll,
                autoplay: autoplay,
                loop: loop,
                loopedSlides: loopedSlides,
                speed: speedAnimation,
                navigation: { nextEl: nextNavigation, prevEl: prevNavigation },
                pagination: { el: pagination, clickable: true },
                parallax: parallax,
                mousewheel: mouseWheel,
                breakpoints: {
                    // when window width is < 767px
                    0: {
                        slidesPerView: slidesPerView767,
                        spaceBetween: spaceBetween767,
                    },
                    // when window width is >= 768px
                    767: {
                        slidesPerView: slidesPerView880,
                        spaceBetween: spaceBetween880,
                    },
                    // when window width is >= 881px
                    881: {
                        slidesPerView: slidesPerView1024,
                        spaceBetween: spaceBetween1024,
                    },
                    // when window width is >= 1025px
                    1025: {
                        slidesPerView: slidesPerView1200,
                        spaceBetween: spaceBetween1200,
                    },
                    // when window width is >= 1201px
                    1201: {
                        slidesPerView: slidesPerView1368,
                        spaceBetween: spaceBetween1368,
                    },
                    // when window width is >= 1369px
                    1369: {
                        slidesPerView: slidesPerView1512,
                        spaceBetween: spaceBetween1512,
                    }
                },
            };

            if ( slideAnimation.length ) {
                switch (slideAnimation) {
                    case 'fade':
                        options.effect     = 'fade';
                        options.fadeEffect = { crossFade: true };
                    break;
                }
            }

            if ( $holder.hasClass('mk-tabs-slider')) {

                var tabImage = typeof $holder.data( 'tabimage' ) !== 'undefined' ? $holder.data( 'tabimage' ) : {};

                options.pagination.renderBullet = function(index, className) {

                    var tabImageHTML = '',
                        thumbURL = tabImage[index + 1];
                    if (thumbURL) {
                        tabImageHTML = '<div class="mk-tabs-slider-thumb-image"><img src="' + tabImage[index + 1] + '" /><span></span></div>';
                    }

                    return '<div class="' + className + '">' + tabImageHTML + '</div>';
                }
            }

            return Object.assign( options, swmSwiper.getSliderData( $holder ) );
        },
        getSliderData: function ( $holder ) {
            var dataList    = $holder.data(),
                returnValue = {};

            for ( var property in dataList ) {
                if ( dataList.hasOwnProperty( property ) ) {
                    // It's required to be different from data options because da options are all options from shortcode element
                    if ( property !== 'options' && typeof dataList[property] !== 'undefined' && dataList[property] !== '' ) {
                        returnValue[property] = dataList[property];
                    }
                }
            }

            return returnValue;
        },
        getEvents: function ( $holder, options ) {
            return {
                on: {
                    beforeInit: function () {
                        if ( options.direction === 'vertical' ) {
                            var height        = 0;
                            var currentHeight = 0;
                            var $item         = $holder.find( '.mk-vertical-slide' );

                            if ( $item.length ) {
                                $item.each( function () {
                                        currentHeight = $( this ).outerHeight();

                                        if ( currentHeight > height ) {
                                            height = currentHeight;
                                        }
                                    }
                                );
                            }
                            $holder.css('height', height );
                            $item.css('height', height );
                        }
                    },
                    init: function () {
                        $holder.addClass( 'swm-swiper--initialized' );
                    }
                }
            };
        }
    };

    swmTheme.swmSwiper = swmSwiper;

    $(document).ready(function() {

        swmTheme.scroll = $( window ).scrollTop();

        SwmThemeSettings.init();
        swmStickyHeaderScrollUp.init();
        setTimeout(function() { swmScaleAnimation(); }, 500);

        swmSwiper.init();

    });


    $(window).on('scroll', function() {
        swmTheme.scroll = $(window).scrollTop();
        SwmThemeSettings._stickyHeader();
    });

    $(document).ready(function() {

        window.swmHoverMagnetEffect = function(selector, moveX = 0.3, moveY = 0.5) {
          $(selector).each(function() {
            const $el = $(this);

            $el.on("mousemove", function(e) {
              const rect = this.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;

              $el.children().eq(0).css({
                transform: `translate(${x * moveX}px, ${y * moveY}px)`,
                transition: "transform 0.1s ease-out"
              });
            });

            $el.on("mouseleave", function() {
              $el.children().eq(0).css({
                transform: "translate(0px, 0px)",
                transition: "transform 0.3s ease-out"
              });
            });
          });
        };


    });

    window.swmScaleAnimation = function() {
        $('.swm-scale-animation, .swm-scale-animation-s, .swm-scale-animation-m, .swm-scale-animation-l').each(function(){
            var section = $(this);
            if(section.hasClass('swm-loaded')) return false;
            section.addClass('swm-loaded');
            var top = section.offset().top;
            var height = section.outerHeight();
            var bottom = section.offset().top + height;
            var scale_val = 2;
            var offset = 600;
            var translate_val = height / 3;
            if(section.hasClass('swm-scale-animation-s')) {
                scale_val = 1.1;
                if(translate_val>300) translate_val = 300;
                offset = 200;
            }
            if(section.hasClass('swm-scale-animation-m')) {
                scale_val = 1.2;
                offset = 200;
            }
            if(section.hasClass('swm-scale-animation')) {
                scale_val = 1.6;
                offset = 400;
            }
            section.css({
                'z-index' : '99999999',
                'transform-style': 'preserve-3d',
            });
            let start = top - offset ;
            var range = 600;
            if(height<500) range = height;
            var rect = this.getBoundingClientRect();
            var that = this;
            var range_start = $(window).height();
            var range_end = $(window).height()/2;
            var range_total = range_start - range_end;

            if (rect.top <= range_start && rect.top >= range_end) {
                var per = (rect.top - range_end) / range_total;
                var scale = (scale_val - 1)  * per;
                scale++;
                var translate = translate_val  * per;

                section.css({'transform' : 'scale('+scale+') translateY('+translate+'px)'});
            } else if (rect.top > range_start) {
                // Before
                section.css({'transform' : 'scale('+scale_val+') translateY('+translate_val+'px)'});
            } else{
                // After
                section.css({'transform' : 'scale(1) translateY(0px)'});
            }
            document.addEventListener('scroll', (e) => {
                rect = that.getBoundingClientRect();
                if(rect.top <= range_start && rect.top >= range_end){
                    var per = (rect.top - range_end) / range_total;
                    var scale = (scale_val - 1)  * per;
                    scale++;
                    var translate = translate_val  * per;

                    section.css({'transform' : 'scale('+scale+') translateY('+translate+'px)'});
                }else if (rect.top > range_start) {
                    // Before
                    section.css({'transform' : 'scale('+scale_val+') translateY('+translate_val+'px)'});
                }else{
                    // After
                    section.css({'transform' : 'scale(1) translateY(0px)'});
                }
            }, {
                passive: true
            });
        });
    };

    /* Window load functions =================== */

    var $window = $(window);

    $(window).on('load',(function () {

        if ( $('.swm-loader-holder').length ){
            $(".swm-loader-holder").fadeOut();
        }

        $window.on('resize', function () {
            swmTheme.windowWidth  = $(window).width();
            swmTheme.windowHeight = $(window).height();
        });

        $('iframe').css('max-width','100%').css('width','100%');

    }));

})(jQuery);