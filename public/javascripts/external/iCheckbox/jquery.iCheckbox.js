/*
* iCheckbox - Inspired Checkbox v0.1
*
* Convert a checkbox or multiple checkboxes into iphone style switches.
*
* This is based on the jQuery iphoneSwitch plugin by Daniel LaBare.
*
* Features:
*    * Because checkboxes are used, this is compatable with having javascript off for form submission.
*    * Affects only checkboxes.
*    * Synchronizes the actual state of the checkbox for on or off status.
*    * Completely self-contained for each checkbox.
*    * Changes fire the onchange event of your checkbox.
*    * Relies purely on css for styling... no passing anything but your slider image.
*    * Because functionality is decoupled from CSS, you can assign custom CSS classes if you wish making it possible for multiple version per page.
*    * Completely inline like a normal checkbox. No sliding-door-float madness.
*
* iphoneSwitch Author: Daniel LaBare
*    iCheckbox Author: Bryn Mosher
*   iphoneSwitch Date: 2/4/2008
*      iCheckbox date: 2/26/2010-2/27/2010 (like most of you I'm a nite owl :P)
*/

// convert the matched element into an iCheckbox if it is a checkbox input
jQuery.fn.iCheckbox = function(options) {

    if ( jQuery(this ).attr('type') == 'checkbox' ) {
        // define default settings
        var settings = jQuery.extend( {
                // switch_container_src is the outer frame image of the slider
                // you assign the actual slider image via css
                switch_container_src: 'images/iphone_switch_container.gif',
                // The height of your slider
                switch_height: 27,
                // The width of your slider
                switch_width: 94,
                // switch_speed is the speed of the slider animation.
                // Warning: Your onchange() even won't be fired until the end of this!
                switch_speed: 150,
                // How far your actual slider image has to move to change to the "off" state.
                // This can be either positive or negative based on the layout of your image.
                // The "on" state expects this image to have backgroundPosition: 0px.
                switch_swing: -53,
                // CSS class of the container if you wish.
                class_container: 'iCheckbox_container',
                // CSS class of the switch.
                // This should have your actual "on"/"off" image set as its background-image.
                class_switch: 'iCheckbox_switch',
                // CSS class of the checkbox if you wish it shown.
                class_checkbox: 'iCheckbox_checkbox',
                checkbox_hide: true,
                // animate off function
                iCheckOff: function (elem , atime, animOnly) {
                        atime = typeof(atime) == 'number' ? atime : settings.switch_speed;
                        animOnly = animOnly== true ? true : false;
                        atime = parseInt(atime) > 0 ? atime : 1;
                        if ( animOnly == true ) {
                            jQuery(elem).animate({'backgroundPosition': settings.switch_swing}, atime, 'linear');
                        } else {
                            jQuery(elem).animate({'backgroundPosition': settings.switch_swing}, atime, 'linear', function() {
                                    var cB = jQuery(jQuery(this).parent()).find('input');
                                    jQuery(cB).removeAttr('checked');
                                    jQuery(cB).change();
                                });
                        }
                    },
                // animate on function
                iCheckOn: function (elem, atime, animOnly) {
                        atime = typeof(atime) == 'number' ? atime : settings.switch_speed;
                        atime = parseInt(atime) > 0 ? atime : 1;
                        if ( animOnly == true ) {
                            jQuery(elem).animate({'backgroundPosition': '0'}, atime, 'linear');
                        } else {
                            jQuery(elem).animate({'backgroundPosition': '0'}, atime, 'linear', function() {
                                    var cB = jQuery(jQuery(this).parent()).find('input');
                                    jQuery(cB).attr('checked', 'checked');
                                    jQuery(cB).change();
                                });
                        }
                    }
            }, options);

        // create the switch
        return this.each(function() {
        	// set initial state
        	var state = jQuery(this).attr('checked') ? 'on' : 'off';
            var container;
            var image;
            // make the container
            container = '<span class="'+settings.class_container+'"></span>';
            jQuery(this).wrap(container);
            // make the switch image based on starting state
            image = jQuery('<img class="'+settings.class_switch+'" src="'+settings.switch_container_src+'" />');
            jQuery(this).parent().append(image);
            // sync the checkbox to initial state
            if(state == 'on') {
                jQuery(this).attr('checked', 'checked');
                settings.iCheckOn( jQuery(this).parent().find('img'), 1 ); // must have a positive time for the initial event to fire
            } else {
                jQuery(this).removeAttr('checked');
                settings.iCheckOff( jQuery(this).parent().find('img'), 1 ); // must have a positive time for the initial event to fire
            }
            // bind clicking on the image
            jQuery(this).parent().find('.'+settings.class_switch).click(function (e) {
                var cBox = jQuery(jQuery(e.target).parent()).find('input');
                var state = cBox.is(':checked') ? 'on' : 'off';
                if(state == 'on') {
                    state = 'off';
                    settings.iCheckOff( jQuery(this), settings.switch_speed );
                } else {
                    state = 'on';
                    settings.iCheckOn( jQuery(this), settings.switch_speed );
                }
                return e;
            });
            // assign the class to it
            if ( jQuery(this).hasClass(settings.class_checkbox) == false ) {
                jQuery(this).addClass(settings.class_checkbox);
            }
            // finally hide the checkbox after everything else is declared - we do this for syntax checking
            if ( settings.checkbox_hide == true ) {
                jQuery(this).css({
                	display: 'none'
                });
            }
            // bind clicking on a visible checkbox
            jQuery(this).change(function (e) {
                var cBox = jQuery(jQuery(e.target).parent()).find('input');
                var img = jQuery(jQuery(e.target).parent()).find('img');
                var state = cBox.is(':checked') ? 'on' : 'off';
                if(state == 'on') {
                  //  alert('1');
                    // let the natural onchange() occur
                    settings.iCheckOn( jQuery(img), settings.switch_speed, true );
                } else {
                   // alert('0');
                    // let the natural onchange() occur
                    settings.iCheckOff( jQuery(img), settings.switch_speed, true );
                }
                return e;
            });
            return this;
        });
        return this;
    } else {
        return false;
    };
};