!!window && (function(window, func) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return func();
		});
	} else if (typeof exports === 'object') {
		module.exports = function() {
			return func();
		};
	} else {
		window.getCityByIP = func;
	}
})(window, function( ip, callback) {
	/*callback :       回调函数，参数为城市信息对象（city、country、province三个字段），发生错误则参数为-1*/
	/*ip :                  可选，查询指定ip所在地。不填则查询当前城市*/
	var script = document.createElement("script"),
		url;
	url="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"+((typeof ip==="function")?((callback=ip)===-1||""):("&ip="+ip));
	script.async=true;
	script.onload = function() {
		!!callback && window.setTimeout((function(cb, w) {
			return function() {
				cb({
					city:w.city,
					country:w.country,
					province:w.province
				});
				cb = w = null;
			};
		})(callback, window.remote_ip_info), 0);
		document.body.removeChild(script);
		callback= window.remote_ip_info= script=null;
	};
	script.onerror = function() {
		!!callback && callback(-1);
		delete window.SWther;
		document.body.removeChild(script);
		callback= window.remote_ip_info= script=null;
	};
	script.src = url;
	document.body.appendChild(script);
	ip = url = null;
});