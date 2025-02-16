var popWinHandler = function () {
    $('.popwin').css("cursor", "pointer");
    $('.popwin').on('click', function () {
        var $thedata = $(this);
        var thelink = $thedata.data("url"),
            thewidth = $thedata.data("width"),
            height = ($thedata.data("height") > 1 ? $thedata.data("height") : 600),
            windowName = ($thedata.data("windowname") &&  $thedata.data("windowname"). length > 1 ? $thedata.data("windowname") : 'AGBWindow'),
            winParams = 'width=500,height=750,resizable=1,scrollbars=1';
        if (thewidth != null)
            winParams = 'width=' + thewidth + ',height=' + height + ',resizable=1,scrollbars=1';

        var agbw = window.open(thelink, windowName, winParams);
        agbw.focus();
    });
};


/**
 * popWinParams jquery plugin
 */
(function ($) {
    /**
     * PopWinParams function lets you set parameters for the popwin function
     * usage: $(document).popWinParams(parameters);
     * parameters must be an array containing objects with the following structure:
     *
     * [
     *  {selector: '#link1', url : 'http://link1...', width: 400},
     *  {selector: '#link2', url : 'http://link2...', width: 300}
     * ]
     *
     * Additionally you can specify the windowName and the width by adding this to the config object
     *
     * @param [] collection
     * @returns {$.fn}
     */
    $.fn.popWinParams = function (collection) {
        $(collection).each(function (index, config) {
            var config = $.extend({width: 450, height: 600, windowName: 'AGBWindow'}, config);
            $(config.selector)
                .data("url", config.url)
                .data("width", config.width)
                .data("height", config.height)
                .data("windowname", config.windowName)
                .addClass("popwin")
                .removeClass("popup")
                .attr("href", "javascript:void(0);");
        });
        popWinHandler();
        return this;
    };
}(jQuery));

$(document).ready(popWinHandler);