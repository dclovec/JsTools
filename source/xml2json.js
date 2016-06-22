(function(root, func) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return func(root);
		});
	} else if (typeof exports === 'object') {
		module.exports = function() {
			return func(root);
		};
	} else {
		root.xml2json = func(root);
	}
})(this, function(root) {
	var result,
		cb,
		parseValue,
		item;

	function parseBody(str) {
		var start = str.indexOf("<"),
			end = str.indexOf(">"),
			isNoTextAndChild = str.slice(end - 1, 1) === "/";
		str = str.slice();
	}

	parseValue = (function(number, i, len) {
		return function(str) {
			if (str.length === 0) {
				return str;
			}
			for (i = 0, len = str.length; i < len; i++) {
				if (number.indexOf(str.slice(i, i + 1)) === -1) {
					return str;
				}
			}
			return +str;
		};
	})("0123456789");

	function parseAttributes(str) {
		var len = str.length,
			start = 0,
			attr = {},
			i,
			nullVAttrCounts,
			end,
			strQuot,
			tmp,
			key,
			co = 0;
		end = str.indexOf("=", start + 1);
		console.log("header string: ",str);
		while (end !== -1 && co++ < len) {
			/*get attribute key*/
			key = str.slice(start, end);
			/*test like "readonly" in "name="fat" readonly ng="bad"*/
			if (key.indexOf(" ") === -1) {
				/*get qout of  attribute value*/
				start = end + 1;
				end = start + 1;
				strQuot = str.slice(start, end);
				/*get attribute value*/
				if (strQuot === "\"" || strQuot === "'") {
					if (str.slice(end, end + 1) === "\"") {
						value = "";
					} else {
						start = end;
						while ((end = str.indexOf(strQuot, end + 1)) > -1 && str.slice(end - 1, end) === "\\") {}
						if (end === -1) {
							console.error("xml header is bad!(<?xml " + str + " ?>)");
							return;
						}
						value = str.slice(start, end);
					}
					attr[key] = value;
					start = end + 2;
				} else {
					end = str.indexOf(" ", start);
					value = end !== -1 ? str.slice(start, end) : str.slice(start);
					attr[key] = parseValue(value);
					start = end + 1;
				}
			} else {
				key = key.split(" ");
				for (i = 0, nullVAttrCounts = key.length - 1; i < nullVAttrCounts; i++) {
					attr[key[i]] = null;
				}
				start = str.indexOf(key[nullVAttrCounts], start);
			}
			end = str.indexOf("=", start + 1);
		}
		console.log("header object: ",attr);
		for(key in attr){
			if(attr.hasOwnProperty(key)){
				return attr;
			}
		}
	}

	function parseHeader(str) {
		!!(str = parseAttributes(str)) && (result.header = str);
	}
	function parseB () {
					result.body=parseBody(xmlString);
					!!cb && cb(result);
					result=cb=null;
	}
	function doWork(xmlString, callback) {
		var str,
			end;
		!!callback && (cb = callback);
		xmlString = xmlString.replace(/\s+/g, " ").replace(/<\s+/g, "<").replace(/\s+>/g,">");
		result = {
			header: null,
			body: null
		};
		if(xmlString.length>0){
			if((end=xmlString.indexOf("?>"))>-1){
				str=xmlString.slice(0,end);
				parseHeader(str.slice(str.toLowerCase().indexOf("<?xml")+6));
				xmlString=xmlString.slice(end+2);
				window ?root.setTimeout(parseB,17):parseB();
			}
			
		}
	}

//	parseAttributes('VER="0.9" URL="davidwalsh.name/" HOME="0" AID="=" index=5 age=2f7');

	return doWork;
});