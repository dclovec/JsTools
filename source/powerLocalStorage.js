
; (function (win) {
    var undef = (void 0),
        storage = win.localStorage,
        ALL_TYPES = [
            'string',
            'number',
            'boolean',
            'function',
            'object',
            'undefined',
        ],
        ALL_TYPES_TRANSFORMER = [
            function (data) {
                return data;
            },
            function (data, serilize) {
                return !serilize ? (+data) : data.toString();
            },
            function (data, serilize) {
                return !serilize ? ('0' === data ? false : true) : (!data ? '0' : '1');
            },
            function (data, serilize) {
                if (!serilize) {
                    return new Function(data);
                } else {
                    var serilized = data.toString();
                    return serilized.slice(1 + serilized.indexOf('{'), serilized.lastIndexOf('}')).trim();
                }
            },
            function (data, serilize) {
                return !serilize ? ('null' !== data ? JSON.parse(data) : null) : ('null' !== data ? JSON.stringify(data) : 'null');
            },
            function (data, serilize) {
                return !serilize ? undef : 'undefined';
            },
        ],
        TYPE_MAPPER = ALL_TYPES.reduce(function (result, item) { result[item] = (result.count++).toString(); return result; }, { count: 0 });

    var outObj = {
        registerHandler: function (typeName, transformer) {
            var dataArray;
            if ('string' === (typeof typeName) && 'function' === (typeof transformer)) {
                dataArray = [
                    {
                        name: typeName,
                        transform: transformer
                    }
                ];
            } else if ((typeName instanceof Array) && 0 === typeName.filter(function (item) { return !item || 'string' !== (typeof item.name) || 'function' === (typeof item.transform); })) {
                dataArray = typeName;
            } else {
                console.error('powerLocalStorage: param is invalid( registerHandler function)!');
                return this;
            }
            dataArray.forEach(function (item) {
                var name = item.name,
                    transform = item.transform,
                    index = ALL_TYPES.indexOf(name);
                if (-1 === index) {
                    TYPE_MAPPER[typeName] = ALL_TYPES.length.toString();
                    TYPE_MAPPER.count++;
                    ALL_TYPES_TRANSFORMER.push(transformer);
                    ALL_TYPES.push(typeName);
                } else {
                    // TYPE_MAPPER[typeName] = ALL_TYPES.length.toString();
                    // TYPE_MAPPER.count++;
                    ALL_TYPES_TRANSFORMER.splice(index, 1, transformer);
                    // ALL_TYPES.splice(index, 1, typeName);
                }
            });
            return this;
        },
        set: function (key, value) {
            var dataType = (typeof value);
            var index = ALL_TYPES.indexOf(dataType);
            if (-1 < index) {
                storage.setItem(key, TYPE_MAPPER[dataType] + (ALL_TYPES_TRANSFORMER[index])(value, true));
            } else {
                console.warn('powerLocalStorage: Unkown data type, please register custom handler!(type is ' + (typeof value) + ')');
            }
            return this;
        },
        get: function (key, returnValidation) {
            var data = storage.getItem(key);
            var result;
            if (!!data) {
                var dataType = data.slice(0, 1),
                    typeIdx = +dataType;
                if (!isNaN(dataType) && -1 < typeIdx && typeIdx < TYPE_MAPPER.count) {
                    var result = (ALL_TYPES_TRANSFORMER[typeIdx])(data.slice(1));
                    return !returnValidation ? result : { value: result };
                } else {
                    console.warn('powerLocalStorage: The data saved by powerLocalStorage has been modified, the data is invalid.');
                    return !returnValidation ? undef : { error: true };
                }
            }
        },
        getAsync: function (key, callback) {
            var data = this.get(key, true);
            if ('function' === (typeof callback)) {
                callback(data.value, !!data.error);
                return this;
            } else if ('undefined' !== (typeof Promise)) {
                return new Promise(function (resolve, reject) {
                    !data.error ? resolve(data.value) : reject();
                });
            } else {
                console.error('powerLocalStorage: Need Promise context. The browser you used does not support it!');
                return this;
            }
        },
        delete: function (key) {
            storage.removeItem(key);
            return this;
        },
    };

    if ('function' === (typeof define) && define.amd) {
        define(function () {
            return outObj;
        });
    } else if ('object' === (typeof exports)) {
        module.exports = outObj;
    } else {
        win.powerLocalStorage = outObj;
    }
})(window);