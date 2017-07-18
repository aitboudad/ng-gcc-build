import { Inject, Injectable, Injector, NgModule, OpaqueToken } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

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

const COOKIE_OPTIONS = new OpaqueToken('COOKIE_OPTIONS');
class CookieOptionsProvider {
    /**
     * @param {?=} options
     * @param {?=} _injector
     */
    constructor(options = {}, _injector) {
        this._injector = _injector;
        this.defaultOptions = {
            path: this._injector.get(APP_BASE_HREF, '/'),
            domain: null,
            expires: null,
            secure: false
        };
        this._options = mergeOptions(this.defaultOptions, options);
    }
    /**
     * @return {?}
     */
    get options() {
        return this._options;
    }
}
CookieOptionsProvider.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CookieOptionsProvider.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [COOKIE_OPTIONS,] },] },
    { type: Injector, },
];

class CookieService {
    /**
     * @param {?} _optionsProvider
     */
    constructor(_optionsProvider) {
        this._optionsProvider = _optionsProvider;
        this.options = this._optionsProvider.options;
    }
    /**
     * @return {?}
     */
    get cookieString() {
        return document.cookie || '';
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set cookieString(val) {
        document.cookie = val;
    }
    /**
     * \@name CookieService#get
     *
     * \@description
     * Returns the value of given cookie key.
     *
     * @param {?} key
     * @return {?}
     */
    get(key) {
        return ((this._cookieReader()))[key];
    }
    /**
     * \@name CookieService#getObject
     *
     * \@description
     * Returns the deserialized value of given cookie key.
     *
     * @param {?} key
     * @return {?}
     */
    getObject(key) {
        let /** @type {?} */ value = this.get(key);
        return value ? safeJsonParse(value) : value;
    }
    /**
     * \@name CookieService#getAll
     *
     * \@description
     * Returns a key value object with all the cookies.
     *
     * @return {?}
     */
    getAll() {
        return (this._cookieReader());
    }
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
    put(key, value, options) {
        this._cookieWriter()(key, value, options);
    }
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
    putObject(key, value, options) {
        this.put(key, JSON.stringify(value), options);
    }
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
    remove(key, options) {
        this._cookieWriter()(key, undefined, options);
    }
    /**
     * \@name CookieService#removeAll
     *
     * \@description
     * Remove all cookies.
     * @return {?}
     */
    removeAll() {
        let /** @type {?} */ cookies = this.getAll();
        Object.keys(cookies).forEach(key => {
            this.remove(key);
        });
    }
    /**
     * @return {?}
     */
    _cookieReader() {
        let /** @type {?} */ lastCookies = {};
        let /** @type {?} */ lastCookieString = '';
        let /** @type {?} */ cookieArray, /** @type {?} */ cookie, /** @type {?} */ i, /** @type {?} */ index, /** @type {?} */ name;
        let /** @type {?} */ currentCookieString = this.cookieString;
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
    }
    /**
     * @return {?}
     */
    _cookieWriter() {
        let /** @type {?} */ that = this;
        return function (name, value, options) {
            that.cookieString = that._buildCookieString(name, value, options);
        };
    }
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    _buildCookieString(name, value, options) {
        let /** @type {?} */ opts = mergeOptions(this.options, options);
        let /** @type {?} */ expires = opts.expires;
        if (isBlank(value)) {
            expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
            value = '';
        }
        if (isString(expires)) {
            expires = new Date(expires);
        }
        let /** @type {?} */ str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        str += opts.path ? ';path=' + opts.path : '';
        str += opts.domain ? ';domain=' + opts.domain : '';
        str += expires ? ';expires=' + expires.toUTCString() : '';
        str += opts.secure ? ';secure' : '';
        // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
        // - 300 cookies
        // - 20 cookies per unique domain
        // - 4096 bytes per cookie
        let /** @type {?} */ cookieLength = str.length + 1;
        if (cookieLength > 4096) {
            console.log(`Cookie \'${name}\' possibly not set or overflowed because it was too 
      large (${cookieLength} > 4096 bytes)!`);
        }
        return str;
    }
}
CookieService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CookieService.ctorParameters = () => [
    { type: CookieOptionsProvider, },
];

/**
 * @param {?} cookieOptionsProvider
 * @return {?}
 */
function cookieServiceFactory(cookieOptionsProvider) {
    return new CookieService(cookieOptionsProvider);
}

class CookieBackendService extends CookieService {
    /**
     * @return {?}
     */
    get cookieString() {
        return Zone.current.get('req').headers.cookie || '';
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set cookieString(val) {
        Zone.current.get('req').headers.cookie = val;
        Zone.current.get('res').headers.cookie = val;
    }
}
CookieBackendService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CookieBackendService.ctorParameters = () => [];

class CookieModule {
    /**
     * Use this method in your root module to provide the CookieService
     * @param {?=} options
     * @return {?}
     */
    static forRoot(options = {}) {
        return {
            ngModule: CookieModule,
            providers: [
                { provide: COOKIE_OPTIONS, useValue: options },
                { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
            ]
        };
    }
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     * @param {?=} options
     * @return {?}
     */
    static forChild(options = {}) {
        return {
            ngModule: CookieModule,
            providers: [
                { provide: COOKIE_OPTIONS, useValue: options },
                { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
            ]
        };
    }
}
CookieModule.decorators = [
    { type: NgModule, args: [{
                providers: [CookieOptionsProvider]
            },] },
];
/**
 * @nocollapse
 */
CookieModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { CookieModule, CookieService, CookieBackendService, COOKIE_OPTIONS, CookieOptionsProvider, cookieServiceFactory, isBlank, isPresent, isString, mergeOptions, safeDecodeURIComponent, safeJsonParse };
//# sourceMappingURL=ngx-cookie.js.map
