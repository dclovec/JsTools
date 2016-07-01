!!window && (function(window, func) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return func();
		});
	} else if (typeof exports === 'object') {
		module.exports = func;
	} else {
		window.ajaxTool = func();
	}
})(window, function() {
	var win = window,
		conf,
		setConf,
		req,
		setCallback,
		abort,
		obj,
		getXHRObj;

	function doGC() {
		win = win.onbeforeunload = conf = setConf = req = setCallback = abort = obj = getXHRObj = null;
	}

	win.onbeforeunload = doGC;

	if (!!win.XMLHttpRequest) {
		getXHRObj = function() {
			return new win.XMLHttpRequest();
		};
	} else if (!!ActiveXObject) {
		getXHRObj = function() {
			return new ActiveXObject("Microsoft.XMLHTTP");
		};
	} else {
		throw "Unsupport XmlHttpRequest.";
	}

	setConf = function(config) {
		conf = {
			isAsync: true,
			method: "GET"
		};
		abort = {};
		setConf = function(config) {
			if (!!config) {
				(config.async !== undefined) && (conf.isAsync = !!config.async);
				!!config.method && (conf.method = config.method);
				conf.headers = config.headers;
				conf.responseType = config.responseType;
				conf.overrideMime = config.overrideMime;
				conf.succ = config.success;
				conf.err = config.error;
				conf.complete = config.complete;
				conf.upload = config.upload;
				conf.csc = config.csCredential;
				conf.readyStateChange = config.readyStateChange;
			}
			config = null;
			return obj;
		};
		return setConf(config);
	};

	getReadyStateChangeEvt = function() {
		var xhr = this,
			k = conf.succ,
			h = conf.err,
			v;
		if (!!k && !!h) {
			return function() {
				!!(v = conf.readyStateChange) && v(xhr);
				if (xhr.readyState === 4) {
					if (xhr.status < 400) {
						k(xhr.response, xhr);
					} else {
						h(xhr);
					}!!(v = conf.complete) && v(xhr);
					xhr = k = h = v = null;
				}
			};
		} else if (!!k) {
			return function() {
				!!(v = conf.readyStateChange) && v(xhr);
				if (xhr.readyState === 4) {
					if (xhr.status < 400) {
						k(xhr.response, xhr);
					}!!(v = conf.complete) && v(xhr);
					xhr = k = h = v = null;
				}
			};
		} else if (!!h) {
			return function() {
				!!(v = conf.readyStateChange) && v(xhr);
				if (xhr.readyState === 4) {
					if (xhr.status > 400) {
						h(xhr);
					}!!(v = conf.complete) && v(xhr);
					xhr = k = h = v = null;
				}
			};
		} else if (!!(v = conf.complete)) {
			return function() {
				!!(v = conf.readyStateChange) && v(xhr);
				if (xhr.readyState === 4) {
					v(xhr);
					xhr = k = h = v = null;
				}
			};
		} else if (!!(v = conf.readyStateChange)) {
			return function() {
				v(xhr);
				xhr = k = h = v = null;
			};
		}
		return xhr = k = h = v = null;
	};

	req = function(url, data) {
		var xhr = getXHRObj(),
			async,
			k,
			v,
			h;
		xhr.open(conf.method, url, (async = conf.isAsync));
		if (!!(h = conf.headers)) {
			for (k in h) {
				if (h.hasOwnProperty(k) && !!(v = h[k])) {
					xhr.setRequestHeader(k, h[k]);
				}
			}
		}
		(async && !!(v = conf.responseType)) && (xhr.responseType = v);
		!!(v = conf.responseMime) && xhr.overrideMimeType(v);
		!!(v = conf.upload) && (xhr.upload = v);
		!!(v = conf.csc) && (xhr.withCredentials = v);
		xhr.onreadystatechange = getReadyStateChangeEvt.call(xhr);
		xhr.send(data || null);

		v = (function(xhr) {
			return function() {
				xhr.abort();
				xhr = null;
				return obj;
			};
		})(xhr);

		xhr = k = h = async = null;

		return v;
	};

	return obj = {
		setConfig: setConf,
		request: req,
		dispose: doGC
	};
});