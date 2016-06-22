!!window && (function(window, func) {
    if (typeof define === 'function' && define.amd) {
        define(func);
    } else if (typeof exports === 'object') {
        module.exports = func;
    } else {
        window.ajaxTool = func();
    }
})(window, function() {
	
});