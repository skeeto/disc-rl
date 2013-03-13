var Save = Save || {};

Save.isArray = function(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
};

Save.isString = function(object) {
    return Object.prototype.toString.call(object) === '[object String]';
};

Save.isBoolean = function(object) {
    return Object.prototype.toString.call(object) === '[object Boolean]';
};

Save.isNumber = function(object) {
    return Object.prototype.toString.call(object) === '[object Number]';
};

Save.isFunction = function(object) {
    return Object.prototype.toString.call(object) === "[object Function]";
};

Save.isObject = function(object) {
    return object !== null && object !== undefined &&
        !this.isArray(object) && !this.isBoolean(object) &&
        !this.isString(object) && !this.isNumber(object) &&
        !this.isFunction(object);
};

Save.decorate = function(object) {
    if (object === null) {
        return null;
    } else if (object === undefined) {
        return undefined;
    } else if (this.isString(object)) {
        return String(object);
    } else if (this.isNumber(object)) {
        return Number(object);
    } else if (this.isBoolean(object)) {
        return Boolean(object);
    } else if (this.isArray(object)) {
        for (var i = 0; i < object.length; i++) {
            object[i] = this.decorate(object[i]);
        }
        return object;
    } else if (this.isFunction(object)) {
        throw new Error("Can't serialize functions.");
    } else {
        if (!('#' in object)) {
            var constructor = object.constructor.name;
            if (constructor === '') {
                throw new Error("Can't serialize with anonymous constructors.");
            } else if (constructor !== 'Object') {
                if (window[constructor].prototype !== object.__proto__) {
                    throw new Error('Constructor mismatch!');
                } else {
                    object['#'] = constructor;
                }
            }
        }
        for (var k in object) {
            if (object.hasOwnProperty(k)) {
                object[k] = this.decorate(object[k]);
            }
        }
        return object;
    }
};

Save.fixPrototype = function(object) {
    var isObject = Save.isObject(object);
    if (isObject && object['#']) {
        var constructor = window[object['#']];
        if (constructor) {
            object.__proto__ = constructor.prototype;
        } else {
            throw new Error('Unknown constructor ' + object['#']);
        }
    }
    if (isObject || Save.isArray(object)) {
        for (var k in object) {
            if (object.hasOwnProperty(k)) {
                this.fixPrototype(object[k]);
            }
        }
    }
    return object;
};

Save.stringify = function(object) {
    object = this.decorate(object);
    return JSON.stringify(object);
};

Save.parse = function(string) {
    return this.fixPrototype(JSON.parse(string));
};

/* Main API */

Save.save = function(variable, value) {
    if (arguments.length === 1) value = window[variable];
    localStorage[variable] = this.stringify(value);
    return variable;
};

Save.load = function(variable) {
    window[variable] = this.parse(localStorage[variable]);
    return window[variable];
};

Save.exists = function(variable) {
    return variable in localStorage;
};

Save.clear = function(variable) {
    if (variable) {
        localStorage.removeItem(variable);
    } else {
        localStorage.clear();
    }
};
