//bind show reviews and write review buttons click
jQuery('div.reviewapp-reviews div.reviews-control-write a').unbind('click');
jQuery('div.reviewapp-reviews div.reviews-control-write a').click(function(){
    jQuery('div.reviewapp-reviews div.reviews-list').slideUp(300);
    jQuery('div.reviewapp-reviews div.add_reviews_form').slideToggle(300);
    return false;
});
jQuery('div.reviewapp-reviews div.reviews-control-show a').unbind('click');
jQuery('div.reviewapp-reviews div.reviews-control-show a').click(function(){
    jQuery('div.reviewapp-reviews div.add_reviews_form').slideUp(300);
    jQuery('div.reviewapp-reviews div.reviews-list').slideToggle(300);
    return false;
});

//bind rating stars mouse events
jQuery('div.reviewapp-reviews table.write-review a.review-rating-star').unbind('mouseover');
jQuery('div.reviewapp-reviews table.write-review a.review-rating-star').mouseover(function(){
	var ref = jQuery(this).attr('ref');
    for (var i = 1; i <= 5; i++) {
        if (i <= ref) {
            jQuery('div.reviewapp-reviews table.write-review a.review-rating-star[ref=' + i + ']').addClass('full');
        } else {
            jQuery('div.reviewapp-reviews table.write-review a.review-rating-star[ref=' + i + ']').removeClass('full').removeClass('half');
        }
    }
});
jQuery('div.reviewapp-reviews table.write-review a.review-rating-star').unbind('mousemove');
jQuery('div.reviewapp-reviews table.write-review a.review-rating-star').mousemove(function(a){
	if (a.offsetX < 8) {
		$(this).addClass('half').removeClass('full');
	} else {
		$(this).addClass('full').removeClass('half');
	}
});
jQuery('div.reviewapp-reviews table.write-review a.review-rating-star').unbind('click');
jQuery('div.reviewapp-reviews table.write-review a.review-rating-star').click(function(a){
	var ref = jQuery(this).attr('ref');
	if (a.offsetX < 8) {
		ref-= 0.5;
	}
    jQuery('#review-rating-hidden').val(ref);
});
jQuery('div.reviewapp-reviews table.write-review span#review-rating-stars').unbind('mouseout');
jQuery('div.reviewapp-reviews table.write-review span#review-rating-stars').mouseout(function(){
    var ref = jQuery('#review-rating-hidden').val();
    for (var i = 0.5; i <= 5; i+= 0.5) {
    	if (i > ref) {
    		jQuery('div.reviewapp-reviews table.write-review a.review-rating-star[ref=' + Math.ceil(i) + ']').removeClass(i % 1 == 0 ? 'full' : 'half');
        } else {
        	jQuery('div.reviewapp-reviews table.write-review a.review-rating-star[ref=' + Math.ceil(i) + ']').addClass(i % 1 == 0 ? 'full' : 'half');
        }
    }
}).mouseout();


jQuery('div.reviewapp-reviews div.reviews-control-write').fadeIn(300);


//bind send button click
jQuery('#reviewapp_form_submit').unbind('click');
jQuery('#reviewapp_form_submit').click(function(){
    jQuery('div.reviewapp-reviews .reviews-error').html('');
    jQuery('#reviewapp_form_submit').hide();
    jQuery('#reviewapp_form_submit').after('<div class="reviews-loading">Sending review...</div>');
    
    //validation
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (
        !jQuery('#reviewapp_form input[name="review[name]"]').val() ||
        !emailReg.test(jQuery('#reviewapp_form input[name="review[email]"]').val()) ||
        !jQuery('#reviewapp_form input[name="review[rating]"]').val() ||
        !jQuery('#reviewapp_form input[name="review[location]"]').val() ||
        //!jQuery('#reviewapp_form input[name="review[title]"]').val() ||
        !jQuery('#reviewapp_form textarea[name="review[text]"]').val()
    ) {
        jQuery('div.reviewapp-reviews .reviews-loading').remove();
        jQuery('#reviewapp_form_submit').show();
        jQuery('div.reviewapp-reviews .reviews-error').html('Please fill out all fields and rate the product. Email must be valid.');
        return;
    }
    var data = jQuery('#reviewapp_form').serialize();
    data+= '&shop_id=2422999';
    //if (jQuery.browser.msie === true) {
    if ('XDomainRequest' in window && window.XDomainRequest !== null) {
    	//use XDomainRequest for IE8+
	    var xdr = new XDomainRequest();
	    xdr.open('post', 'https://super-reviews.appscorner.net/client/addreview');
	    xdr.onload = function () {
	        var data = jQuery.parseJSON(xdr.responseText);
	        if (data.success) {
                jQuery('div.reviewapp-reviews .reviews-loading').remove();
                jQuery('div.reviewapp-reviews div.add_reviews_form').slideUp(300, function(){
                    jQuery('div.reviewapp-reviews div.add_reviews_form').html('<div class="reviews-success">Your review was sent successfully.</div>');
                    jQuery('div.reviewapp-reviews div.add_reviews_form').slideDown(300);
                });
            } else {
                jQuery('div.reviewapp-reviews .reviews-loading').remove();
                jQuery('#reviewapp_form_submit').show();
                jQuery('div.reviewapp-reviews .reviews-error').html(data.msg);
            }
	    };
	    xdr.onerror = function() {
			jQuery('div.reviewapp-reviews .reviews-loading').remove();
            jQuery('#reviewapp_form_submit').show();
            jQuery('div.reviewapp-reviews .reviews-error').html('An error has occurred during sending your review.');
	    };
	    xdr.onprogress = function() { };
	    xdr.ontimeout = function() { };
	    xdr.timeout = 5000;
	    xdr.send(escape(data));
    } else {
	    jQuery.ajax({
	        url: 'https://super-reviews.appscorner.net/client/addreview',
	        dataType: 'json',
	        type: 'POST',
	        data: data,
	        success: function(data) {
	            if (data.success) {
	                jQuery('div.reviewapp-reviews .reviews-loading').remove();
	                jQuery('div.reviewapp-reviews div.add_reviews_form').slideUp(300, function(){
	                    jQuery('div.reviewapp-reviews div.add_reviews_form').html('<div class="reviews-success">Your review was sent successfully.</div>');
	                    jQuery('div.reviewapp-reviews div.add_reviews_form').slideDown(300);
	                });
	            } else {
	                jQuery('div.reviewapp-reviews .reviews-loading').remove();
	                jQuery('#reviewapp_form_submit').show();
	                jQuery('div.reviewapp-reviews .reviews-error').html(data.msg);
	            }
	        },
	        error: function(XMLHttpRequest,status,error) {
	            jQuery('div.reviewapp-reviews .reviews-loading').remove();
	            jQuery('#reviewapp_form_submit').show();
	            jQuery('div.reviewapp-reviews .reviews-error').html('An error occurred while sending Your message.<br/>Try again, please.');
	        }
	    });
	}
    });

//bind report buttons
jQuery('.review-item-report a').unbind('click');
jQuery('.review-item-report a').click(function(){
    var reviewId = jQuery(this).attr('id');
    if (confirm('Are you certain you want to report this review?')) {
        jQuery.ajax({
            url: 'https://super-reviews.appscorner.net/client/reportreview',
            type: 'POST',
            dataType: 'json',
            data: {
                review_id : reviewId
            },
            success: function(data, textStatus, jqXHR) {
                if (data.success) {
                    jQuery('div.reviewapp-reviews #reportDiv_' + reviewId).html('Report was sent succcessfully.');
                } else {
                    jQuery('div.reviewapp-reviews #reportDiv_' + reviewId + ' .review-report-error').html(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                jQuery('div.reviewapp-reviews #reportDiv_' + reviewId + ' .review-report-error').html('Could not send report.');
            }
        });
    }
    
    return false;
});

/* If placeholder attribute not supported */
test = document.createElement('input');
if (!('placeholder' in test)) {
	function initPlaceholder() {
		$('input[placeholder]').focus(focusPlaceholder);
		$('input[placeholder]').focusout(focusoutPlaceholder);
		$('input[placeholder]').each(function(){
			if ($(this).val() == '') {
				$(this).val($(this).attr('placeholder'));
				$(this).css('color','#ddd');
			}
		});
	}
	function focusPlaceholder() {
		if ($(this).val() == $(this).attr('placeholder')) {
			$(this).val('');
			$(this).css('color','');
		}
	}
	function focusoutPlaceholder() {
		if ($(this).val() == '') {
			$(this).val($(this).attr('placeholder'));
			$(this).css('color','#ccc');
		}
	}
	$(document).ready(initPlaceholder);
}