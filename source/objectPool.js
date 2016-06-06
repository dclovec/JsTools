(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return func();
        });
    } else if (typeof exports === 'object') {
        module.exports = func;
    } else {
        root.objectPool = func();
    }
})(this, function() {
    var pool,
        maxCount,
        usingCount,
        freeCount,
        usingIndex,
        freeIndex;

    function init() {
        var win,
            wbu,
            onbu;
        if (!!(win = window)) {
            wbu = win.onbeforeunload;
            win.onbeforeunload = (!!wbu) ? (function() {
                wbu();
                win.onbeforeunload = null;
                onbu = wbu = pool = maxCount = usingCount = freeCount = usingIndex = freeIndex = null;
            }) : (function() {
                win.onbeforeunload = null;
                onbu = wbu = pool = maxCount = usingCount = freeCount = usingIndex = freeIndex = null;
            });
        }
        pool = [];
        !maxCount && (maxCount = 50);
        usingCount = freeCount = 0;
        usingIndex = [];
        freeIndex = [];
    }

    return {
        new: function() {
            init();
            this.new = function() {
                var res,
                    index,
                    obj;
                if (freeCount > 0) {
                    index = freeIndex.shift();
                    freeCount--;
                    usingIndex.push(index);
                    usingCount++;
                    obj = pool[index];
                } else if (maxCount === freeCount + usingCount) {
                    console.error("对象池达到最大容量。");
                    return null;
                } else {
                    pool[index = pool.length] = obj = {};
                    usingIndex.push(index);
                    usingCount++;
                }

                res = {
                    get: function(key) {
                        return obj[key] || null;
                    },
                    set: function(key, val) {
                        !!key && (obj[key] = val);
                        return res;
                    },
                    collect: function() {
                        res = null;
                        for (var key in obj) {
                            delete obj[key];
                        }
                        freeIndex.push(index);
                        freeCount++;
                        usingIndex.splice(usingIndex.indexOf(index), 1);
                        usingCount--;
                    }
                };

                return res;
            };
            return this.new();
        },
        setCapacity:function (cap) {
        	if(typeof cap==="number" && cap>0){
        	    maxCount=~~cap;
        	}
        	return this;
        },
        getPool: function() {
            return pool;
        }
    };
});