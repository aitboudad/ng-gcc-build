(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global['ngx-cookie'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,_angular_core,_angular_common) { 'use strict';

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @param {?} obj
 * @return {?}
 */
function isBlank(obj) {
    return obj === undefined || obj === null;
}
/**
 * @param {?} obj
 * @return {?}
 */
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
/**
 * @param {?} obj
 * @return {?}
 */
function isString(obj) {
    return typeof obj === 'string';
}
/**
 * @param {?} oldOptions
 * @param {?=} newOptions
 * @return {?}
 */
function mergeOptions(oldOptions, newOptions) {
    if (!newOptions) {
        return oldOptions;
    }
    return {
        path: isPresent(newOptions.path) ? newOptions.path : oldOptions.path,
        domain: isPresent(newOptions.domain) ? newOptions.domain : oldOptions.domain,
        expires: isPresent(newOptions.expires) ? newOptions.expires : oldOptions.expires,
        secure: isPresent(newOptions.secure) ? newOptions.secure : oldOptions.secure,
    };
}
/**
 * @param {?} str
 * @return {?}
 */
function safeDecodeURIComponent(str) {
    try {
        return decodeURIComponent(str);
    }
    catch (e) {
        return str;
    }
}
/**
 * @param {?} str
 * @return {?}
 */
function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return str;
    }
}
var COOKIE_OPTIONS = new _angular_core.OpaqueToken('COOKIE_OPTIONS');
var CookieOptionsProvider = (function () {
    /**
     * @param {?=} options
     * @param {?=} _injector
     */
    function CookieOptionsProvider(options, _injector) {
        if (options === void 0) { options = {}; }
        this._injector = _injector;
        this.defaultOptions = {
            path: this._injector.get(_angular_common.APP_BASE_HREF, '/'),
            domain: null,
            expires: null,
            secure: false
        };
        this._options = mergeOptions(this.defaultOptions, options);
    }
    Object.defineProperty(CookieOptionsProvider.prototype, "options", {
        /**
         * @return {?}
         */
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    return CookieOptionsProvider;
}());
CookieOptionsProvider.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
CookieOptionsProvider.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [COOKIE_OPTIONS,] },] },
    { type: _angular_core.Injector, },
]; };
var CookieService = (function () {
    /**
     * @param {?} _optionsProvider
     */
    function CookieService(_optionsProvider) {
        this._optionsProvider = _optionsProvider;
        this.options = this._optionsProvider.options;
    }
    Object.defineProperty(CookieService.prototype, "cookieString", {
        /**
         * @return {?}
         */
        get: function () {
            return document.cookie || '';
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            document.cookie = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * \@name CookieService#get
     *
     * \@description
     * Returns the value of given cookie key.
     *
     * @param {?} key
     * @return {?}
     */
    CookieService.prototype.get = function (key) {
        return ((this._cookieReader()))[key];
    };
    /**
     * \@name CookieService#getObject
     *
     * \@description
     * Returns the deserialized value of given cookie key.
     *
     * @param {?} key
     * @return {?}
     */
    CookieService.prototype.getObject = function (key) {
        var /** @type {?} */ value = this.get(key);
        return value ? safeJsonParse(value) : value;
    };
    /**
     * \@name CookieService#getAll
     *
     * \@description
     * Returns a key value object with all the cookies.
     *
     * @return {?}
     */
    CookieService.prototype.getAll = function () {
        return (this._cookieReader());
    };
    /**
     * \@name CookieService#put
     *
     * \@description
     * Sets a value for given cookie key.
     *
     * @param {?} key
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    CookieService.prototype.put = function (key, value, options) {
        this._cookieWriter()(key, value, options);
    };
    /**
     * \@name CookieService#putObject
     *
     * \@description
     * Serializes and sets a value for given cookie key.
     *
     * @param {?} key
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    CookieService.prototype.putObject = function (key, value, options) {
        this.put(key, JSON.stringify(value), options);
    };
    /**
     * \@name CookieService#remove
     *
     * \@description
     * Remove given cookie.
     *
     * @param {?} key
     * @param {?=} options
     * @return {?}
     */
    CookieService.prototype.remove = function (key, options) {
        this._cookieWriter()(key, undefined, options);
    };
    /**
     * \@name CookieService#removeAll
     *
     * \@description
     * Remove all cookies.
     * @return {?}
     */
    CookieService.prototype.removeAll = function () {
        var _this = this;
        var /** @type {?} */ cookies = this.getAll();
        Object.keys(cookies).forEach(function (key) {
            _this.remove(key);
        });
    };
    /**
     * @return {?}
     */
    CookieService.prototype._cookieReader = function () {
        var /** @type {?} */ lastCookies = {};
        var /** @type {?} */ lastCookieString = '';
        var /** @type {?} */ cookieArray, /** @type {?} */ cookie, /** @type {?} */ i, /** @type {?} */ index, /** @type {?} */ name;
        var /** @type {?} */ currentCookieString = this.cookieString;
        if (currentCookieString !== lastCookieString) {
            lastCookieString = currentCookieString;
            cookieArray = lastCookieString.split('; ');
            lastCookies = {};
            for (i = 0; i < cookieArray.length; i++) {
                cookie = cookieArray[i];
                index = cookie.indexOf('=');
                if (index > 0) {
                    name = safeDecodeURIComponent(cookie.substring(0, index));
                    // the first value that is seen for a cookie is the most
                    // specific one.  values for the same cookie name that
                    // follow are for less specific paths.
                    if (isBlank(((lastCookies))[name])) {
                        ((lastCookies))[name] = safeDecodeURIComponent(cookie.substring(index + 1));
                    }
                }
            }
        }
        return lastCookies;
    };
    /**
     * @return {?}
     */
    CookieService.prototype._cookieWriter = function () {
        var /** @type {?} */ that = this;
        return function (name, value, options) {
            that.cookieString = that._buildCookieString(name, value, options);
        };
    };
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    CookieService.prototype._buildCookieString = function (name, value, options) {
        var /** @type {?} */ opts = mergeOptions(this.options, options);
        var /** @type {?} */ expires = opts.expires;
        if (isBlank(value)) {
            expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
            value = '';
        }
        if (isString(expires)) {
            expires = new Date(expires);
        }
        var /** @type {?} */ str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        str += opts.path ? ';path=' + opts.path : '';
        str += opts.domain ? ';domain=' + opts.domain : '';
        str += expires ? ';expires=' + expires.toUTCString() : '';
        str += opts.secure ? ';secure' : '';
        // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
        // - 300 cookies
        // - 20 cookies per unique domain
        // - 4096 bytes per cookie
        var /** @type {?} */ cookieLength = str.length + 1;
        if (cookieLength > 4096) {
            console.log("Cookie '" + name + "' possibly not set or overflowed because it was too \n      large (" + cookieLength + " > 4096 bytes)!");
        }
        return str;
    };
    return CookieService;
}());
CookieService.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
CookieService.ctorParameters = function () { return [
    { type: CookieOptionsProvider, },
]; };
/**
 * @param {?} cookieOptionsProvider
 * @return {?}
 */
function cookieServiceFactory(cookieOptionsProvider) {
    return new CookieService(cookieOptionsProvider);
}
var CookieBackendService = (function (_super) {
    __extends(CookieBackendService, _super);
    function CookieBackendService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CookieBackendService.prototype, "cookieString", {
        /**
         * @return {?}
         */
        get: function () {
            return Zone.current.get('req').headers.cookie || '';
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            Zone.current.get('req').headers.cookie = val;
            Zone.current.get('res').headers.cookie = val;
        },
        enumerable: true,
        configurable: true
    });
    return CookieBackendService;
}(CookieService));
CookieBackendService.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
CookieBackendService.ctorParameters = function () { return []; };
var CookieModule = (function () {
    function CookieModule() {
    }
    /**
     * Use this method in your root module to provide the CookieService
     * @param {?=} options
     * @return {?}
     */
    CookieModule.forRoot = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: CookieModule,
            providers: [
                { provide: COOKIE_OPTIONS, useValue: options },
                { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
            ]
        };
    };
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     * @param {?=} options
     * @return {?}
     */
    CookieModule.forChild = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: CookieModule,
            providers: [
                { provide: COOKIE_OPTIONS, useValue: options },
                { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
            ]
        };
    };
    return CookieModule;
}());
CookieModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                providers: [CookieOptionsProvider]
            },] },
];
/**
 * @nocollapse
 */
CookieModule.ctorParameters = function () { return []; };

exports.CookieModule = CookieModule;
exports.CookieService = CookieService;
exports.CookieBackendService = CookieBackendService;
exports.COOKIE_OPTIONS = COOKIE_OPTIONS;
exports.CookieOptionsProvider = CookieOptionsProvider;
exports.cookieServiceFactory = cookieServiceFactory;
exports.isBlank = isBlank;
exports.isPresent = isPresent;
exports.isString = isString;
exports.mergeOptions = mergeOptions;
exports.safeDecodeURIComponent = safeDecodeURIComponent;
exports.safeJsonParse = safeJsonParse;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-cookie.umd.js.map
