!!window && (function(window, func) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return func;
		});
	} else if (typeof exports === 'object') {
		module.exports = function() {
			return func;
		};
	} else {
		window.xml2json = func;
	}
})(window, function(xmlString) {
	var node;
	if(!(node=window.parseNodeBox)){
		node=document.createElement("p");
		node.id="parseNodeBox";
		node.style.cssText="display: none;z-index: -999;";
	}
	node.innerHTML=xmlString;
	return node.children;
});