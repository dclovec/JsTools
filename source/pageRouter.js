!!window && (function(window, func) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return func();
        });
    } else if (typeof exports === 'object') {
        module.exports = func;
    } else {
        window.pageRouter = func();
    }
})(window, function() {
    var routeTable,
        analyse,
        obj;

    function doGC(typ) {
        routeTable = analyse = obj = null;
        window.removeEventListener("unload", doGC);
        doGC = null;
    }

    window.addEventListener("unload", doGC);

    routeTable = {
        default: function(key) {
            var style = "color:#f00;text-align:center;font-size:20px;",
                firstMT = ~~(0.5 * window.innerHeight - 28);
            document.head.innerHTML += "<style>html,body{height:100%;overflow:hidden;}</style>"
            document.body.innerHTML = "<p style=\"" + style + "margin: " + firstMT + "px 0 10px 0;\">404 Error : Page Not Found.</p><p style=\"" + style + "margin: 0;\">404错误 : 页面未找到。</p><p style='font-size:18px;margin:20px 0;color:#999;text-align:center;'>(点击页面刷新)</p>";
            document.title = "Default Page";

            function reload() {
                document.body.removeEventListener("click", reload);
                reload = null;
                location.reload();
            }
            document.body.addEventListener("click", reload);
            throw new Error("No such router \"" + (key || "default") + "\".");
        }
    };

    obj = {
        register: function(key, func) {
            routeTable[key] = func;
            return this;
        },
        setAnalyseFunc: function(func) {
            analyse = func;
            return this;
        },
        beginRoute: function(ifDispose) {
            if (ifDispose) {
                delete window.pageRouter;
            }
            var data = analyse(location);

            (routeTable[data.key] || routeTable["default"])(data.key);
            ifDispose && doGC();

            return {
                params: data.params
            };
        }
    };

    return obj;
});