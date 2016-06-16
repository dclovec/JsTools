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
		window.getWeatherByCityName = func;
	}
})(window, function(config) {
	/*以下为config对象的属性说明*/
	/*city :                         必须, 中文城市名称，如 '北京' */
	/*callback :                 获取后的回调函数，参数为天气信息数组(数组包含对象，对象包含的day、night字段表示白天及夜晚，day及night字段含有temperature(气温，摄氏度)、weather(天气如阴、晴、阵雨)、windDirection(风向)、windPower(风力)四个字段)，发生错误则参数为-1*/
	/*days :                       可选, 默认为0, 要获取的天气的天数，范围为0~3，表示从今天开始的天数，0代表今天，1代表今天和明天，2代表今天到后天，3代表今天到明后天 */
	/*charset :                  可选，默认为gb2312, 返回的字符串的字符编码*/
	var script = document.createElement("script"),
		city=config.city,
		cb = config.callback,
		url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?day=" + (config.days || 0) + "&city=" + encodeURIComponent(city);
	script.charset = config.charset || "gb2312";
	script.async=true;
	script.onload = function() {
		!!cb && window.setTimeout((function(cb,city, w) {
			return function() {
				var i,
					len,
					item,
					result;
				if(!!(w=w.w[city])){
					result=[];
					for(i=0,len=w.length;i<len;i++){
						item=w[i];
						result[i]={
							day:{
								temperature:item.t1,
								weather:item.s1,
								windDirection:item.d1,
								windPower:item.p1
							},
							night:{
								temperature:item.t2,
								weather:item.s2,
								windDirection:item.d2,
								windPower:item.p2
							}
						};
					}
					cb(result);
					i=len=item=result=null;
				}else{
					cb(null);
				}
				cb = city=w = null;
			};
		})(cb,city, window.SWther), 0);
		delete window.SWther;
		document.body.removeChild(script);
		cb =city= script=null;
	};
	script.onerror = function() {
		!!cb && cb(-1);
		delete window.SWther;
		document.body.removeChild(script);
		cb =script= null;
	};
	script.src = url;
	document.body.appendChild(script);
	config = url = null;
});