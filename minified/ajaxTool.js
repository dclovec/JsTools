!!window&&function(e,t){"function"==typeof define&&define.amd?define(function(){return t()}):"object"==typeof exports?module.exports=t:e.ajaxTool=t()}(window,function(){function e(){c=c.onbeforeunload=t=n=o=r=a=s=u=null}var t,n,o,r,a,s,u,c=window;if(c.onbeforeunload=e,c.XMLHttpRequest)u=function(){return new c.XMLHttpRequest};else{if(!ActiveXObject)throw"Unsupport XmlHttpRequest.";u=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}return n=function(e){return t={isAsync:!0,method:"GET"},a={},(n=function(e){return e&&(void 0!==e.async&&(t.isAsync=e.async),!!e.method&&(t.method=e.method),t.headers=e.headers,t.responseType=e.responseType,t.overrideMime=e.overrideMime,t.succ=e.success,t.err=e.error,t.complete=e.complete,t.upload=e.upload,t.csc=e.csCredential,t.readyStateChange=e.readyStateChange),e=null,s})(e)},getReadyStateChangeEvt=function(){var e,n=this,o=t.succ,r=t.err;return o&&r?function(){!!(e=t.readyStateChange)&&e(n),4===n.readyState&&(n.status<400?o(n.response,n):r(n),!!(e=t.complete)&&e(n),n=o=r=e=null)}:o?function(){!!(e=t.readyStateChange)&&e(n),4===n.readyState&&(n.status<400&&o(n.response,n),!!(e=t.complete)&&e(n),n=o=r=e=null)}:r?function(){!!(e=t.readyStateChange)&&e(n),4===n.readyState&&(n.status>400&&r(n),!!(e=t.complete)&&e(n),n=o=r=e=null)}:(e=t.complete)?function(){!!(e=t.readyStateChange)&&e(n),4===n.readyState&&(e(n),n=o=r=e=null)}:(e=t.readyStateChange)?function(){e(n),n=o=r=e=null}:n=o=r=e=null},o=function(e,n){var o,r,a,c,i=u();if(i.open(t.method,e,o=t.isAsync),c=t.headers)for(r in c)c.hasOwnProperty(r)&&(a=c[r])&&i.setRequestHeader(r,c[r]);return o&&!!(a=t.responseType)&&(i.responseType=a),!!(a=t.responseMime)&&i.overrideMimeType(a),!!(a=t.upload)&&(i.upload=a),!!(a=t.csc)&&(i.withCredentials=a),i.onreadystatechange=getReadyStateChangeEvt.call(i),i.send(n||null),a=function(e){return function(){return e.abort(),e=null,s}}(i),i=r=c=o=null,a},s={setConfig:n,request:o,dispose:e}});