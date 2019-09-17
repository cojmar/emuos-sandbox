define(function(require) {
    var $ = require('jquery');
    return function(dom_id) {
        var selector = $('#' + dom_id);
        if (!selector.length > 0) {
            $('body').append('<div id="' + dom_id + '"></div>');
            selector = $('#' + dom_id);
        }
        if (!selector.length > 0) return false;
        return selector;
    };
});