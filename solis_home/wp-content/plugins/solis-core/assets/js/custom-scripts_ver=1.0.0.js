(function ($) {
    $(document).ready(function(){

    	'use strict';

        var $document = jQuery(document);

        function mk_section_after_show_menu(mega_menu) {

            // Init layouts
            if ( mega_menu.hasClass('mk-sections-megamenu') && ! mega_menu.hasClass('layouts_inited') ) {
                mk_sections_stretch_submenu(mega_menu);
                mega_menu.addClass('layouts_inited');
            }
        }

        // Stretch submenu with layouts
        function mk_sections_stretch_submenu(mega_menu) {

            var done = false;
            if ( mega_menu.length && ! mega_menu.hasClass('mk_no_fullwidth') && mega_menu.hasClass('mk-sections-megamenu') && $('#swm-header').hasClass('swm_header_custom_section') ) {

                var menu = mega_menu.parents("ul");
                if ( menu.length > 0 ) {

                    var $body = $('body'),
                        bodyWidth    = $body.innerWidth(),

                        customWidth  = mega_menu.data('custom-width'),
                        mm_width     = mega_menu.data('width'),

                        content_wrap        = ( mm_width == 'default_width' ? $('.swm_site_content_wrap') : $('.swm_header_custom_section') ),
                        contentLeftPadding  = parseInt(content_wrap.css('padding-left')),
                        contentRightPadding = parseInt(content_wrap.css('padding-right')),
                        contentWidth        = content_wrap.innerWidth() - (contentLeftPadding + contentRightPadding),
                        contentWidth_offset = content_wrap.offset().left,

                        li        = mega_menu.parents("li").eq(0),
                        li_offset = (li).offset().left,

                        finalWidth    = ( mm_width == 'fullwidth' ? bodyWidth : contentWidth ) + 'px',
                        finalMaxWidth = ( mm_width == 'default_width' ? contentWidth+'px' : 'none'),
                        finalLeft     = -li_offset + ( mm_width == 'fullwidth' ? 0 : contentWidth_offset ) + 'px';

                        if (mm_width != 'custom_width') {
                            mega_menu
                                .css( {
                                    'width'     : finalWidth,
                                    'max-width' : finalMaxWidth,
                                    'left'      : finalLeft,
                                    'margin-left': contentLeftPadding,
                                    'margin-right': contentRightPadding
                                } );
                        }

                        if ( mm_width == 'fullwidth' ) {
                            mega_menu
                                .data( 'reset-style', '.elementor-section-boxed > .elementor-container' )
                                .find( '.elementor-section-boxed > .elementor-container' ).css( {'max-width': 'none' } );
                        }

                        if ( mm_width == 'custom_width' ) {

                            var megamenuWidth       = ( customWidth != '' ) ? customWidth : mega_menu.width(),
                                megamenuParent      = mega_menu.parent('li'),
                                megamenuParentWidth = megamenuParent.width(),
                                mmleftMargin        = (megamenuWidth/2) - (megamenuParentWidth/2);

                                mega_menu.css({
                                    'margin-left': mega_menu.hasClass('mm-center') ? mmleftMargin * -1 : 0,
                                    'width': megamenuWidth
                                });

                                var megaMenuRelativeContent = $('ul.mm-site_content') ;

                                if ( megaMenuRelativeContent.length ) {
                                    megaMenuRelativeContent.parent('li').css('position','inherit');
                                }

                                mm-site_content
                        }

                    done = true;

                }
            }
            return done;
        }

        $( 'li.swm-megamenu-item' ).each( function() {
            mk_section_after_show_menu($(this).find('> ul.mk-sections-megamenu'));
        });

    });
})(jQuery);