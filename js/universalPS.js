/*
 *
 *		Universal picture step 1.3
 *		2014-11-13
 *		Works with DACH_proxy.js
 *
 *		#steps li                                    @ anything placed in this block will be treated as 'step'
 *		#steps li.dontCount                          @ this type of step wont be taken into account when generating progress bar
 *		.goNext, .goPrev                             @ goes one step forward or backwards
 *		ul#progress                                  @ generates progress bar with possibility to jump from step to step depending on the #steps li amount
 *		ul#progress.numbers                          @ adds numbers to the progress <div> element
 *		ul#progress.disableClick                     @ disables the possibility of jumping to a specific step
 *		ul#progress.noAutoWidth                      @ removes automatically calculated width from each li
 *		#submit                                      @ final submit button
 *		#loading                                     @ loading animation while registration is being checked
 *		#covering									 @ layer that is included in the animation to cover registration form or whole content
 * 		#covering.coveringFade						 @ class applied to animate between slides
 *
 *
 *		1.3			slide effect fixed
 * 		1.2			this script is in relation with DACH_proxy as it now check fields if they are empty
 * 					if dach_proxy configuration is defined it may not allow to go to the next step with this code provided:
 *		 				RegisterProxy.enableDynamicOnTypeErrors = true;
 *						universalPS.animateWithInputErrors = false;
 *						universalPS.animateWithEmptyInputs = false;
 *
 *		1.11		transitionFade and coveringFade animation type added
 *					transitionFade fades out and fades in each step with defined durations
 *					coveringFade requires #covering so that all the contents are covered with this id during transition
 *		1.10		class='noAutoWidth' on #progress wont apply automatically calculated LI widths
 *		1.9			removed 'blocked tab' functionality
 *		1.8			improved body.currentStepXX class removal
 *		1.7			possibility to disable auto-calculated width of progress li elements with .noAutoWidth class
 *		1.6			activate TAB key for dach and toggle along the list of tabbed elements only in active step
 *		1.5			<body class='currentStepX'> added
 *		1.4			Small delay before slider goes to an error
 *		1.3 		"d" variable updated, shouldnt be affected by 3rd party scripts
 *					progress bar - not in html - is not affecting functionality
 *		1.2			fade effect added
 *		1.1			show/hide effect added
 *
 */

var stepsNo;                    // amount of steps
var currentStep = 1;            // first step no
var st = '#steps';
var pr = '#progress';
var covering = '#covering';		// selector for covering effect transition
var disabledElements = 0;       // count disabled li.dontCount steps
var stepsWidth;                 // holds the width of a single step
var animationType = "showHide"; // or "slide" or "fade" or "transitionFade" or "coveringFade"
var animationSpeed = 500;
var activeTab = false;          // or true if you want to use activeTabFields list of toggled elements

var universalPS = {
    animateWithInputErrors: true, 	// make the transition even if error is present
    animateWithEmptyInputs: true	// animate with empty inputs, don't force user to type in
};

// resizing window tricks for slide effect
var ResizeWindow = {
    rtime: null,
    timeout: false,
    delta: 400,

    windowResizeEnd: function () {
        if (new Date() - ResizeWindow.rtime < ResizeWindow.delta) {
            setTimeout(ResizeWindow.windowResizeEnd, ResizeWindow.delta);
        } else {
            ResizeWindow.timeout = false;
            updateWidth();
            slideToStepNo(currentStep);
        }
    }
};

$(document).ready(function(){
    $('#loading').hide();
    stepsNo = $(st +' > li').length; // count steps
    generateStepIcons(); // generate progress bar
    updateActive(1);

    switch(animationType) {
        case "slide":
            $(window).resize(function() {
                ResizeWindow.rtime = new Date();
                if (ResizeWindow.timeout === false) {
                    ResizeWindow.timeout = true;
                    setTimeout(ResizeWindow.windowResizeEnd, ResizeWindow.delta);
                }
            });

            makeSlider();
            updateWidth();
            setTimeout(function(){
                repositionSlides(currentStep);
            }, animationSpeed/2);

            if($(pr).length>0 && $(pr +'.disableClick').length==0) // if progress bar exists and clicks may be performed
                $(document).on('click',pr +' li', function(){ slideToStepNo(getStepNumberFromClass(this)); });

            $(document).on('click','.goNext', function(){
                if(!canIanimateWithEmptyInputs()) return;
                slideToStepNo(Number(currentStep)+1);
            });
            $(document).on('click','.goPrev', function(){ slideToStepNo(Number(currentStep)-1); });
            break;
        case "fade":
            fadeToStepNo(currentStep);
            if($(pr).length>0 && $(pr +'.disableClick').length==0) // if progress bar exists and clicks may be performed
                $(document).on('click',pr +' li', function(){ fadeToStepNo(getStepNumberFromClass(this)); });

            $(document).on('click','.goNext', function(){
                if(!canIanimateWithEmptyInputs()) return;
                fadeToStepNo(Number(currentStep)+1);
            });
            $(document).on('click','.goPrev', function(){ fadeToStepNo(Number(currentStep)-1); });
            break;
        case "transitionFade":
            transitionFadeToStepNo(currentStep);
            if($(pr).length>0 && $(pr +'.disableClick').length==0) // if progress bar exists and clicks may be performed
                $(document).on('click',pr +' li', function(){ transitionFadeToStepNo(getStepNumberFromClass(this)); });

            $(document).on('click','.goNext', function(){
                if(!canIanimateWithEmptyInputs()) return;
                transitionFadeToStepNo(Number(currentStep)+1);
            });
            $(document).on('click','.goPrev', function(){ transitionFadeToStepNo(Number(currentStep)-1); });
            break;
        case "coveringFade":
            coveringFadeToStepNo(currentStep);
            if($(pr).length>0 && $(pr +'.disableClick').length==0) // if progress bar exists and clicks may be performed
                $(document).on('click',pr +' li', function(){ coveringFadeToStepNo(getStepNumberFromClass(this)); });

            $(document).on('click','.goNext', function(){
                if(!canIanimateWithEmptyInputs()) return;
                coveringFadeToStepNo(Number(currentStep)+1);
            }); //force to be it a number
            $(document).on('click','.goPrev', function(){ coveringFadeToStepNo(Number(currentStep)-1); });
            break;
        default:
            gotoStepNo(currentStep);
            if($(pr).length>0 && $(pr +'.disableClick').length==0) // if progress bar exists and clicks may be performed
                $(document).on('click', pr+' li', function(){ gotoStepNo(getStepNumberFromClass(this)); });

            // delegating
            $(document).on('click','.goNext', function(){
                if(!canIanimateWithEmptyInputs()) return;
                gotoStepNo(Number(currentStep)+1);
            });
            $(document).on('click','.goPrev', function(){ gotoStepNo(Number(currentStep)-1); });
    }

    $(document).on('submit', 'form#signupform', function(event){ // delegating
        console.log('PS submit?');
        $('#loading').fadeIn(300);

        if (typeof(RegisterProxy) != 'undefined') {
            // dont show the loading animation if its enabled and captcha wasnt verified - returns false
            if (RegisterProxy.enableGoogleCaptcha && RegisterProxy.checkGoogleCaptcha() == false) {
                $('#loading').hide();
                console.log('captcha incomplete!');
            }
        }

        setTimeout(function () {
            var checkForErrors = setInterval(function () {
                if ($('.lbl_signup_error').length > 0) {
                    switch (animationType) {
                        case "slide":
                            slideToStepNo(getStepNumberFromClass($('.lbl_signup_error').closest('li')));
                            break;
                        case "fade":
                            fadeToStepNo(getStepNumberFromClass($('.lbl_signup_error').closest('li')));
                            break;
                        case "transitionFade":
                            transitionFadeToStepNo(getStepNumberFromClass($('.lbl_signup_error').closest('li')));
                            break;
                        case "coveringFade":
                            coveringFadeToStepNo(getStepNumberFromClass($('.lbl_signup_error').closest('li')));
                            break;
                        default:
                            gotoStepNo(getStepNumberFromClass($('.lbl_signup_error').closest('li')));
                    }
                    clearInterval(checkForErrors);
                    setTimeout(function () {
                        $('#loading').fadeOut(300);
                        //clearTimeout(hideLoading);
                    }, 500); // small delay preffered
                    //console.log('refresh');

                    // IE9 FIX
                    /*@cc_on
                     @if(@_jscript_version == 11) {
                     $('#loading').delay(2000).fadeOut(300);
                     }
                     @end
                     @*/
                }
            }, 500);
        }, 1000); // moving to an error happens to quick - delay preferred
    });
});



// can i animate with or without errors?
function canIanimate(n) {
    // can i animate in general
    if (!$(st).is(':animated') && n > 0 && n <= stepsNo && currentStep >= 1 && currentStep <= stepsNo)
        return true;
    return false;
}

function canIanimateWithErrors(){
    // animate with errors and empty inputs
    if(universalPS.animateWithInputErrors == true) {
        return true;
    }else{
        if($('.is-active .lbl_signup_error').length>0 ) {
            // if error appears in different step than DO animate !!
            if ( currentStep != Number(getStepNumberFromClass($('.lbl_signup_error').closest('li[class^="step"]')) ) )
                return true;
            else
                return false;
        }
    }
    return true;
}

// check if input in your step is empty
function canIanimateWithEmptyInputs() {
    // stop animation
    if(universalPS.animateWithEmptyInputs == false) {
        if (typeof(RegisterProxy) != 'undefined') {
            // any of those fields have less than 2 chars
            var emptyFields = RegisterProxy.inputFieldsToCheck();
            for(var ef in emptyFields) {
                if ($('body.currentStep' + currentStep + ' ' + emptyFields[ef]).is(':visible')) {
                    RegisterProxy.verifyField[ef](emptyFields[ef]);
                    return false;
                }
            }
        }
    }
    return true;
}


function gotoStepNo(n) {
    //"switch class" with transition would work for a better animation effect with slide etc...
    if(canIanimate(n) && canIanimateWithErrors()){
        $(st +' > li').hide();
        $(st +' > li:nth-child('+ n +')').show(); //append active step
        updateActive(n);
        currentStep = n; // update current step
    }
}

function fadeToStepNo(n) {
    //"switch class" with transition would work for a better animation effect with slide etc...
    if(canIanimate(n) && canIanimateWithErrors()){
        $(st +' > li').hide();
        $(st +' > li:nth-child('+ n +')').fadeIn(animationSpeed); //append active step
        updateActive(n);
        currentStep = n; // update current step
    }
}

function transitionFadeToStepNo(n) {
    if(canIanimate(n) && canIanimateWithErrors()){
        if(n == 1) {
            $(st +' > li').hide();
            $(st +' > li:nth-child('+ n +')').fadeIn(animationSpeed);
        } else
            $(st +' > li').fadeOut(animationSpeed);
        $(st +' > li:nth-child('+ n +')').delay(animationSpeed).fadeIn(animationSpeed);
        updateActive(n);
        currentStep = n; // update current step
    }
}

function coveringFadeToStepNo(n) {
    if(canIanimate(n) && canIanimateWithErrors()){
        $(covering).addClass('coveringFade');
        setTimeout(function(){
            gotoStepNo(n); // updating is covered here
        }, animationSpeed/2 - 150); // small adjustment as the content blinks when its very precise math
        setTimeout(function(){
            $(covering).removeClass('coveringFade')
        }, animationSpeed);
    }
}

function slideToStepNo(n){
    if(canIanimate(n) && canIanimateWithErrors()){
        $(st +' > li').show(); // elements need to be visible
        $(st).animate({
            right: stepsWidth*(n-1) +"px"
        }, animationSpeed, function(){
            updateActive(n);
            currentStep = n;
        });
    }
}

function repositionSlides(n){
    $(st +' > li').show(); // elements need to be visible
    $(st).animate({
        right: stepsWidth*(n-1) +"px"
    }, 0, function(){
        updateActive(n);
        currentStep = n;
    });
}

// progress step icons are generated automatically depending on steps count
function generateStepIcons() {
    var tmp = "";
    for(var i=1; i<=stepsNo; i++) {
        $(st +' > li:nth-child('+ i +')').addClass('step'+ i); // add class stepX to each element #step li element
        if($(st +' > li:nth-child('+ i +').dontCount').length==0) { // dont take this step into account
            tmp += "<li class='step"+ i +"'><div></div></li>"; // prepare to update progress bar
        } else disabledElements++; // count unwanted elements
    }
    if($(pr).length>0) {
        $('#progress').html(tmp); // generate progress bar

        if(! $(pr).hasClass('noAutoWidth')) {
            var stepsWidth = 100/(stepsNo - disabledElements); // count width
            $('#progress li').css({ width:  stepsWidth +"%" });
        }
    }
    if($(pr).hasClass('numbers')) { // add numbers
        $(pr +' li div').each(function(index){
            $(this).text(index+1);
        });
    }
}

function getStepNumberFromClass(element) { // retrieve step number from any object
    if($(element).length > 0) {
        var errStep = $(element).attr('class').match(/step(\d+)/)[1];
        if (errStep > 0 && errStep <= stepsNo) return errStep;
        return 1; // go to first step on error
    } return -1;
}

// slide effects
function makeSlider() {
    stepsWidth = $(st).width();
    $(st).hide();
    if($('#theSlider').length==0) {
        $(st).wrapAll( '<div id="theSlider"></div>' );
        $('#theSlider').css({"overflow":"hidden"});
        $(st).css({"position":"relative"});
        $(st +' > li').css({"float":"left"});
    }
    $(st +' > li').width(stepsWidth);
    $(st).width(stepsWidth * stepsNo);
    $(st).show();
    console.log( $(st +' > li').width() +' <-single | total-> '+ $(st).width() );
}

function updateWidth() {
    stepsWidth = $('#theSlider').width();
    $('#theSlider').hide();
    $(st +' > li').width(stepsWidth);
    $(st).width(stepsWidth * stepsNo);
    $('#theSlider').show();
}

function updateActive(n) { // hilights current step
    $('body').removeClass(function (index, css) { // remove all body classes starting with "currentStep"
        return (css.match (/(^|\s)currentStep\S+/g) || []).join(' ');
    });
    $('body').addClass('currentStep'+ n);

    $(st +' > li').removeClass('is-active');
    $(st +' > li:nth-child('+ n +')').addClass('is-active');
    $(st +' > li.is-active input').first().focus(); //focus on first existing input
    if($(pr).length>0) {
        $(pr +' li').removeClass('is-active'); // remove active progress element
        $(pr +' li.step'+ n).addClass('is-active'); //add active step element
        $(pr +' li.is-active').prevAll().addClass('visited'); // set visited steps
    }
}

