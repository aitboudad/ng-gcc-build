(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('rxjs/operator/let'), require('rxjs/operator/do'), require('rxjs/observable/fromEvent')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/forms', 'rxjs/operator/let', 'rxjs/operator/do', 'rxjs/observable/fromEvent'], factory) :
	(factory((global['ng-bootstrap'] = global['ng-bootstrap'] || {}),global.ng.core,global.ng.common,global.ng.forms,global.rxjs.operator,global.rxjs.operator,global.rxjs.operator));
}(this, (function (exports,_angular_core,_angular_common,_angular_forms,rxjs_operator_let,rxjs_operator_do,rxjs_observable_fromEvent) { 'use strict';

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
 * @param {?} value
 * @return {?}
 */
function toInteger(value) {
    return parseInt("" + value, 10);
}
/**
 * @param {?} value
 * @return {?}
 */
function toString(value) {
    return (value !== undefined && value !== null) ? "" + value : '';
}
/**
 * @param {?} value
 * @param {?} max
 * @param {?=} min
 * @return {?}
 */
function getValueInRange(value, max, min) {
    if (min === void 0) { min = 0; }
    return Math.max(Math.min(value, max), min);
}
/**
 * @param {?} value
 * @return {?}
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * @param {?} value
 * @return {?}
 */
function isNumber(value) {
    return !isNaN(toInteger(value));
}
/**
 * @param {?} value
 * @return {?}
 */
function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
/**
 * @param {?} value
 * @return {?}
 */
function isDefined(value) {
    return value !== undefined && value !== null;
}
/**
 * @param {?} value
 * @return {?}
 */
function padNumber(value) {
    if (isNumber(value)) {
        return ("0" + value).slice(-2);
    }
    else {
        return '';
    }
}
/**
 * @param {?} text
 * @return {?}
 */
function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
/**
 * Configuration service for the NgbAccordion component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the accordions used in the application.
 */
var NgbAccordionConfig = (function () {
    function NgbAccordionConfig() {
        this.closeOthers = false;
    }
    return NgbAccordionConfig;
}());
NgbAccordionConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbAccordionConfig.ctorParameters = function () { return []; };
var nextId = 0;
/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
var NgbPanelTitle = (function () {
    /**
     * @param {?} templateRef
     */
    function NgbPanelTitle(templateRef) {
        this.templateRef = templateRef;
    }
    return NgbPanelTitle;
}());
NgbPanelTitle.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'ng-template[ngbPanelTitle]' },] },
];
/**
 * @nocollapse
 */
NgbPanelTitle.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
]; };
/**
 * This directive must be used to wrap accordion panel content.
 */
var NgbPanelContent = (function () {
    /**
     * @param {?} templateRef
     */
    function NgbPanelContent(templateRef) {
        this.templateRef = templateRef;
    }
    return NgbPanelContent;
}());
NgbPanelContent.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'ng-template[ngbPanelContent]' },] },
];
/**
 * @nocollapse
 */
NgbPanelContent.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
]; };
/**
 * The NgbPanel directive represents an individual panel with the title and collapsible
 * content
 */
var NgbPanel = (function () {
    function NgbPanel() {
        /**
         *  A flag determining whether the panel is disabled or not.
         *  When disabled, the panel cannot be toggled.
         */
        this.disabled = false;
        /**
         *  An optional id for the panel. The id should be unique.
         *  If not provided, it will be auto-generated.
         */
        this.id = "ngb-panel-" + nextId++;
    }
    return NgbPanel;
}());
NgbPanel.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'ngb-panel' },] },
];
/**
 * @nocollapse
 */
NgbPanel.ctorParameters = function () { return []; };
NgbPanel.propDecorators = {
    'disabled': [{ type: _angular_core.Input },],
    'id': [{ type: _angular_core.Input },],
    'title': [{ type: _angular_core.Input },],
    'type': [{ type: _angular_core.Input },],
    'contentTpl': [{ type: _angular_core.ContentChild, args: [NgbPanelContent,] },],
    'titleTpl': [{ type: _angular_core.ContentChild, args: [NgbPanelTitle,] },],
};
/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only one panel can be opened at a time.
 */
var NgbAccordion = (function () {
    /**
     * @param {?} config
     */
    function NgbAccordion(config) {
        this._states = new Map();
        this._panelRefs = new Map();
        /**
         * An array or comma separated strings of panel identifiers that should be opened
         */
        this.activeIds = [];
        /**
         * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
         */
        this.panelChange = new _angular_core.EventEmitter();
        this.type = config.type;
        this.closeOtherPanels = config.closeOthers;
    }
    /**
     * Programmatically toggle a panel with a given id.
     * @param {?} panelId
     * @return {?}
     */
    NgbAccordion.prototype.toggle = function (panelId) {
        var /** @type {?} */ panel = this._panelRefs.get(panelId);
        if (panel && !panel.disabled) {
            var /** @type {?} */ nextState = !this._states.get(panelId);
            var /** @type {?} */ defaultPrevented_1 = false;
            this.panelChange.emit({ panelId: panelId, nextState: nextState, preventDefault: function () { defaultPrevented_1 = true; } });
            if (!defaultPrevented_1) {
                this._states.set(panelId, nextState);
                if (this.closeOtherPanels) {
                    this._closeOthers(panelId);
                }
                this._updateActiveIds();
            }
        }
    };
    /**
     * @return {?}
     */
    NgbAccordion.prototype.ngAfterContentChecked = function () {
        // active id updates
        if (isString(this.activeIds)) {
            this.activeIds = this.activeIds.split(/\s*,\s*/);
        }
        this._updateStates();
        // closeOthers updates
        if (this.activeIds.length > 1 && this.closeOtherPanels) {
            this._closeOthers(this.activeIds[0]);
            this._updateActiveIds();
        }
    };
    /**
     * \@internal
     * @param {?} panelId
     * @return {?}
     */
    NgbAccordion.prototype.isOpen = function (panelId) { return this._states.get(panelId); };
    /**
     * @param {?} panelId
     * @return {?}
     */
    NgbAccordion.prototype._closeOthers = function (panelId) {
        var _this = this;
        this._states.forEach(function (state, id) {
            if (id !== panelId) {
                _this._states.set(id, false);
            }
        });
    };
    /**
     * @return {?}
     */
    NgbAccordion.prototype._updateActiveIds = function () {
        var _this = this;
        this.activeIds =
            this.panels.toArray().filter(function (panel) { return _this.isOpen(panel.id) && !panel.disabled; }).map(function (panel) { return panel.id; });
    };
    /**
     * @return {?}
     */
    NgbAccordion.prototype._updateStates = function () {
        var _this = this;
        this._states.clear();
        this._panelRefs.clear();
        this.panels.toArray().forEach(function (panel) {
            _this._states.set(panel.id, _this.activeIds.indexOf(panel.id) > -1 && !panel.disabled);
            _this._panelRefs.set(panel.id, panel);
        });
    };
    return NgbAccordion;
}());
NgbAccordion.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-accordion',
                exportAs: 'ngbAccordion',
                host: { 'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels' },
                template: "\n  <div class=\"card\">\n    <ng-template ngFor let-panel [ngForOf]=\"panels\">\n      <div role=\"tab\" id=\"{{panel.id}}-header\"\n        [class]=\"'card-header ' + (panel.type ? 'card-'+panel.type: type ? 'card-'+type : '')\" [class.active]=\"isOpen(panel.id)\">\n        <a href (click)=\"!!toggle(panel.id)\" [class.text-muted]=\"panel.disabled\" [attr.tabindex]=\"(panel.disabled ? '-1' : null)\"\n          [attr.aria-expanded]=\"isOpen(panel.id)\" [attr.aria-controls]=\"(isOpen(panel.id) ? panel.id : null)\"\n          [attr.aria-disabled]=\"panel.disabled\">\n          {{panel.title}}<ng-template [ngTemplateOutlet]=\"panel.titleTpl?.templateRef\"></ng-template>\n        </a>\n      </div>\n      <div id=\"{{panel.id}}\" role=\"tabpanel\" [attr.aria-labelledby]=\"panel.id + '-header'\" class=\"card-block\" *ngIf=\"isOpen(panel.id)\">\n        <ng-template [ngTemplateOutlet]=\"panel.contentTpl.templateRef\"></ng-template>\n      </div>\n    </ng-template>\n  </div>\n"
            },] },
];
/**
 * @nocollapse
 */
NgbAccordion.ctorParameters = function () { return [
    { type: NgbAccordionConfig, },
]; };
NgbAccordion.propDecorators = {
    'panels': [{ type: _angular_core.ContentChildren, args: [NgbPanel,] },],
    'activeIds': [{ type: _angular_core.Input },],
    'closeOtherPanels': [{ type: _angular_core.Input, args: ['closeOthers',] },],
    'type': [{ type: _angular_core.Input },],
    'panelChange': [{ type: _angular_core.Output },],
};
var NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent];
var NgbAccordionModule = (function () {
    function NgbAccordionModule() {
    }
    /**
     * @return {?}
     */
    NgbAccordionModule.forRoot = function () { return { ngModule: NgbAccordionModule, providers: [NgbAccordionConfig] }; };
    return NgbAccordionModule;
}());
NgbAccordionModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [_angular_common.CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbAccordionModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbAlert component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the alerts used in the application.
 */
var NgbAlertConfig = (function () {
    function NgbAlertConfig() {
        this.dismissible = true;
        this.type = 'warning';
    }
    return NgbAlertConfig;
}());
NgbAlertConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbAlertConfig.ctorParameters = function () { return []; };
/**
 * Alerts can be used to provide feedback messages.
 */
var NgbAlert = (function () {
    /**
     * @param {?} config
     */
    function NgbAlert(config) {
        /**
         * An event emitted when the close button is clicked. This event has no payload. Only relevant for dismissible alerts.
         */
        this.close = new _angular_core.EventEmitter();
        this.dismissible = config.dismissible;
        this.type = config.type;
    }
    /**
     * @return {?}
     */
    NgbAlert.prototype.closeHandler = function () { this.close.emit(null); };
    return NgbAlert;
}());
NgbAlert.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-alert',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                template: "\n    <div [class]=\"'alert alert-' + type + (dismissible ? ' alert-dismissible' : '')\" role=\"alert\">\n      <button *ngIf=\"dismissible\" type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"closeHandler()\">\n            <span aria-hidden=\"true\">&times;</span>\n      </button>\n      <ng-content></ng-content>\n    </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
NgbAlert.ctorParameters = function () { return [
    { type: NgbAlertConfig, },
]; };
NgbAlert.propDecorators = {
    'dismissible': [{ type: _angular_core.Input },],
    'type': [{ type: _angular_core.Input },],
    'close': [{ type: _angular_core.Output },],
};
var NgbAlertModule = (function () {
    function NgbAlertModule() {
    }
    /**
     * @return {?}
     */
    NgbAlertModule.forRoot = function () { return { ngModule: NgbAlertModule, providers: [NgbAlertConfig] }; };
    return NgbAlertModule;
}());
NgbAlertModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbAlert], exports: [NgbAlert], imports: [_angular_common.CommonModule], entryComponents: [NgbAlert] },] },
];
/**
 * @nocollapse
 */
NgbAlertModule.ctorParameters = function () { return []; };
var NGB_RADIO_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return NgbRadioGroup; }),
    multi: true
};
/**
 * Easily create Bootstrap-style radio buttons. A value of a selected button is bound to a variable
 * specified via ngModel.
 */
var NgbRadioGroup = (function () {
    function NgbRadioGroup() {
        this._radios = new Set();
        this._value = null;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    Object.defineProperty(NgbRadioGroup.prototype, "disabled", {
        /**
         * @return {?}
         */
        get: function () { return this._disabled; },
        /**
         * @param {?} isDisabled
         * @return {?}
         */
        set: function (isDisabled) { this.setDisabledState(isDisabled); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} radio
     * @return {?}
     */
    NgbRadioGroup.prototype.onRadioChange = function (radio) {
        this.writeValue(radio.value);
        this.onChange(radio.value);
    };
    /**
     * @return {?}
     */
    NgbRadioGroup.prototype.onRadioValueUpdate = function () { this._updateRadiosValue(); };
    /**
     * @param {?} radio
     * @return {?}
     */
    NgbRadioGroup.prototype.register = function (radio) { this._radios.add(radio); };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbRadioGroup.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbRadioGroup.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbRadioGroup.prototype.setDisabledState = function (isDisabled) {
        this._disabled = isDisabled;
        this._updateRadiosDisabled();
    };
    /**
     * @param {?} radio
     * @return {?}
     */
    NgbRadioGroup.prototype.unregister = function (radio) { this._radios.delete(radio); };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbRadioGroup.prototype.writeValue = function (value) {
        this._value = value;
        this._updateRadiosValue();
    };
    /**
     * @return {?}
     */
    NgbRadioGroup.prototype._updateRadiosValue = function () {
        var _this = this;
        this._radios.forEach(function (radio) { return radio.updateValue(_this._value); });
    };
    /**
     * @return {?}
     */
    NgbRadioGroup.prototype._updateRadiosDisabled = function () { this._radios.forEach(function (radio) { return radio.updateDisabled(); }); };
    return NgbRadioGroup;
}());
NgbRadioGroup.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[ngbRadioGroup]',
                host: { 'data-toggle': 'buttons', 'class': 'btn-group', 'role': 'group' },
                providers: [NGB_RADIO_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
NgbRadioGroup.ctorParameters = function () { return []; };
var NgbActiveLabel = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elRef
     */
    function NgbActiveLabel(_renderer, _elRef) {
        this._renderer = _renderer;
        this._elRef = _elRef;
    }
    Object.defineProperty(NgbActiveLabel.prototype, "active", {
        /**
         * @param {?} isActive
         * @return {?}
         */
        set: function (isActive) {
            if (isActive) {
                this._renderer.addClass(this._elRef.nativeElement, 'active');
            }
            else {
                this._renderer.removeClass(this._elRef.nativeElement, 'active');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgbActiveLabel.prototype, "disabled", {
        /**
         * @param {?} isDisabled
         * @return {?}
         */
        set: function (isDisabled) {
            if (isDisabled) {
                this._renderer.addClass(this._elRef.nativeElement, 'disabled');
            }
            else {
                this._renderer.removeClass(this._elRef.nativeElement, 'disabled');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgbActiveLabel.prototype, "focused", {
        /**
         * @param {?} isFocused
         * @return {?}
         */
        set: function (isFocused) {
            if (isFocused) {
                this._renderer.addClass(this._elRef.nativeElement, 'focus');
            }
            else {
                this._renderer.removeClass(this._elRef.nativeElement, 'focus');
            }
        },
        enumerable: true,
        configurable: true
    });
    return NgbActiveLabel;
}());
NgbActiveLabel.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'label.btn' },] },
];
/**
 * @nocollapse
 */
NgbActiveLabel.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
/**
 * Marks an input of type "radio" as part of the NgbRadioGroup.
 */
var NgbRadio = (function () {
    /**
     * @param {?} _group
     * @param {?} _label
     * @param {?} _renderer
     * @param {?} _element
     */
    function NgbRadio(_group, _label, _renderer, _element) {
        this._group = _group;
        this._label = _label;
        this._renderer = _renderer;
        this._element = _element;
        this._value = null;
        if (this._group) {
            this._group.register(this);
        }
    }
    Object.defineProperty(NgbRadio.prototype, "value", {
        /**
         * @return {?}
         */
        get: function () { return this._value; },
        /**
         * You can specify model value of a given radio by binding to the value property.
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._value = value;
            var /** @type {?} */ stringValue = value ? value.toString() : '';
            this._renderer.setProperty(this._element.nativeElement, 'value', stringValue);
            if (this._group) {
                this._group.onRadioValueUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgbRadio.prototype, "checked", {
        /**
         * @return {?}
         */
        get: function () { return this._checked; },
        /**
         * A flag indicating if a given radio button is checked.
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._checked = this._element.nativeElement.hasAttribute('checked') ? true : value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgbRadio.prototype, "disabled", {
        /**
         * @return {?}
         */
        get: function () { return (this._group && this._group.disabled) || this._disabled; },
        /**
         * A flag indicating if a given radio button is disabled.
         * @param {?} isDisabled
         * @return {?}
         */
        set: function (isDisabled) {
            this._disabled = isDisabled !== false;
            this.updateDisabled();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgbRadio.prototype, "focused", {
        /**
         * @param {?} isFocused
         * @return {?}
         */
        set: function (isFocused) {
            if (this._label) {
                this._label.focused = isFocused;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgbRadio.prototype.ngOnDestroy = function () {
        if (this._group) {
            this._group.unregister(this);
        }
    };
    /**
     * @return {?}
     */
    NgbRadio.prototype.onChange = function () {
        if (this._group) {
            this._group.onRadioChange(this);
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbRadio.prototype.updateValue = function (value) {
        this._checked = (this.value === value && value !== null);
        this._label.active = this._checked;
    };
    /**
     * @return {?}
     */
    NgbRadio.prototype.updateDisabled = function () {
        var /** @type {?} */ disabled = (this._group && this._group.disabled) || this._disabled;
        if (this._label) {
            this._label.disabled = disabled;
        }
    };
    return NgbRadio;
}());
NgbRadio.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'input[type=radio]',
                host: {
                    '[checked]': 'checked',
                    '[disabled]': 'disabled',
                    '(change)': 'onChange()',
                    '(focus)': 'focused = true',
                    '(blur)': 'focused = false'
                }
            },] },
];
/**
 * @nocollapse
 */
NgbRadio.ctorParameters = function () { return [
    { type: NgbRadioGroup, decorators: [{ type: _angular_core.Optional },] },
    { type: NgbActiveLabel, decorators: [{ type: _angular_core.Optional },] },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
NgbRadio.propDecorators = {
    'value': [{ type: _angular_core.Input, args: ['value',] },],
    'checked': [{ type: _angular_core.Input, args: ['checked',] },],
    'disabled': [{ type: _angular_core.Input, args: ['disabled',] },],
};
var NGB_RADIO_DIRECTIVES = [NgbRadio, NgbActiveLabel, NgbRadioGroup];
var NgbButtonsModule = (function () {
    function NgbButtonsModule() {
    }
    /**
     * @return {?}
     */
    NgbButtonsModule.forRoot = function () { return { ngModule: NgbButtonsModule, providers: [] }; };
    return NgbButtonsModule;
}());
NgbButtonsModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: NGB_RADIO_DIRECTIVES, exports: NGB_RADIO_DIRECTIVES },] },
];
/**
 * @nocollapse
 */
NgbButtonsModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbCarousel component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the carousels used in the application.
 */
var NgbCarouselConfig = (function () {
    function NgbCarouselConfig() {
        this.interval = 5000;
        this.wrap = true;
        this.keyboard = true;
    }
    return NgbCarouselConfig;
}());
NgbCarouselConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbCarouselConfig.ctorParameters = function () { return []; };
var nextId$1 = 0;
/**
 * Represents an individual slide to be used within a carousel.
 */
var NgbSlide = (function () {
    /**
     * @param {?} tplRef
     */
    function NgbSlide(tplRef) {
        this.tplRef = tplRef;
        /**
         * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
         * Will be auto-generated if not provided.
         */
        this.id = "ngb-slide-" + nextId$1++;
    }
    return NgbSlide;
}());
NgbSlide.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'ng-template[ngbSlide]' },] },
];
/**
 * @nocollapse
 */
NgbSlide.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
]; };
NgbSlide.propDecorators = {
    'id': [{ type: _angular_core.Input },],
};
/**
 * Directive to easily create carousels based on Bootstrap's markup.
 */
var NgbCarousel = (function () {
    /**
     * @param {?} config
     */
    function NgbCarousel(config) {
        /**
         * A carousel slide event fired when the slide transition is completed.
         * See NgbSlideEvent for payload details
         */
        this.slide = new _angular_core.EventEmitter();
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
    }
    /**
     * @return {?}
     */
    NgbCarousel.prototype.ngAfterContentChecked = function () {
        var /** @type {?} */ activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.ngOnInit = function () { this._startTimer(); };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.ngOnDestroy = function () { clearInterval(this._slideChangeInterval); };
    /**
     * Navigate to a slide with the specified identifier.
     * @param {?} slideId
     * @return {?}
     */
    NgbCarousel.prototype.select = function (slideId) {
        this.cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId));
        this._restartTimer();
    };
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    NgbCarousel.prototype.prev = function () {
        this.cycleToPrev();
        this._restartTimer();
    };
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    NgbCarousel.prototype.next = function () {
        this.cycleToNext();
        this._restartTimer();
    };
    /**
     * Stops the carousel from cycling through items.
     * @return {?}
     */
    NgbCarousel.prototype.pause = function () { this._stopTimer(); };
    /**
     * Restarts cycling through the carousel slides from left to right.
     * @return {?}
     */
    NgbCarousel.prototype.cycle = function () { this._startTimer(); };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.cycleToNext = function () { this.cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT); };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.cycleToPrev = function () { this.cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT); };
    /**
     * @param {?} slideIdx
     * @param {?} direction
     * @return {?}
     */
    NgbCarousel.prototype.cycleToSelected = function (slideIdx, direction) {
        var /** @type {?} */ selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide) {
            if (selectedSlide.id !== this.activeId) {
                this.slide.emit({ prev: this.activeId, current: selectedSlide.id, direction: direction });
            }
            this.activeId = selectedSlide.id;
        }
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.keyPrev = function () {
        if (this.keyboard) {
            this.prev();
        }
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype.keyNext = function () {
        if (this.keyboard) {
            this.next();
        }
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype._restartTimer = function () {
        this._stopTimer();
        this._startTimer();
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype._startTimer = function () {
        var _this = this;
        if (this.interval > 0) {
            this._slideChangeInterval = setInterval(function () { _this.cycleToNext(); }, this.interval);
        }
    };
    /**
     * @return {?}
     */
    NgbCarousel.prototype._stopTimer = function () { clearInterval(this._slideChangeInterval); };
    /**
     * @param {?} slideId
     * @return {?}
     */
    NgbCarousel.prototype._getSlideById = function (slideId) {
        var /** @type {?} */ slideWithId = this.slides.filter(function (slide) { return slide.id === slideId; });
        return slideWithId.length ? slideWithId[0] : null;
    };
    /**
     * @param {?} slideId
     * @return {?}
     */
    NgbCarousel.prototype._getSlideIdxById = function (slideId) {
        return this.slides.toArray().indexOf(this._getSlideById(slideId));
    };
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    NgbCarousel.prototype._getNextSlide = function (currentSlideId) {
        var /** @type {?} */ slideArr = this.slides.toArray();
        var /** @type {?} */ currentSlideIdx = this._getSlideIdxById(currentSlideId);
        var /** @type {?} */ isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
            slideArr[currentSlideIdx + 1].id;
    };
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    NgbCarousel.prototype._getPrevSlide = function (currentSlideId) {
        var /** @type {?} */ slideArr = this.slides.toArray();
        var /** @type {?} */ currentSlideIdx = this._getSlideIdxById(currentSlideId);
        var /** @type {?} */ isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
            slideArr[currentSlideIdx - 1].id;
    };
    /**
     * @param {?} currentActiveSlideId
     * @param {?} nextActiveSlideId
     * @return {?}
     */
    NgbCarousel.prototype._getSlideEventDirection = function (currentActiveSlideId, nextActiveSlideId) {
        var /** @type {?} */ currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        var /** @type {?} */ nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
    };
    return NgbCarousel;
}());
NgbCarousel.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-carousel',
                exportAs: 'ngbCarousel',
                host: {
                    'class': 'carousel slide',
                    '[style.display]': '"block"',
                    'tabIndex': '0',
                    '(mouseenter)': 'pause()',
                    '(mouseleave)': 'cycle()',
                    '(keydown.arrowLeft)': 'keyPrev()',
                    '(keydown.arrowRight)': 'keyNext()'
                },
                template: "\n    <ol class=\"carousel-indicators\">\n      <li *ngFor=\"let slide of slides\" [id]=\"slide.id\" [class.active]=\"slide.id === activeId\" \n          (click)=\"cycleToSelected(slide.id, _getSlideEventDirection(activeId, slide.id))\"></li>\n    </ol>\n    <div class=\"carousel-inner\">\n      <div *ngFor=\"let slide of slides\" class=\"carousel-item\" [class.active]=\"slide.id === activeId\">\n        <ng-template [ngTemplateOutlet]=\"slide.tplRef\"></ng-template>\n      </div>\n    </div>\n    <a class=\"left carousel-control-prev\" role=\"button\" (click)=\"cycleToPrev()\">\n      <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n      <span class=\"sr-only\">Previous</span>\n    </a>\n    <a class=\"right carousel-control-next\" role=\"button\" (click)=\"cycleToNext()\">\n      <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n      <span class=\"sr-only\">Next</span>\n    </a>\n    "
            },] },
];
/**
 * @nocollapse
 */
NgbCarousel.ctorParameters = function () { return [
    { type: NgbCarouselConfig, },
]; };
NgbCarousel.propDecorators = {
    'slides': [{ type: _angular_core.ContentChildren, args: [NgbSlide,] },],
    'interval': [{ type: _angular_core.Input },],
    'wrap': [{ type: _angular_core.Input },],
    'keyboard': [{ type: _angular_core.Input },],
    'activeId': [{ type: _angular_core.Input },],
    'slide': [{ type: _angular_core.Output },],
};
var NgbSlideEventDirection = {};
NgbSlideEventDirection.LEFT = ('left');
NgbSlideEventDirection.RIGHT = ('right');
NgbSlideEventDirection[NgbSlideEventDirection.LEFT] = "LEFT";
NgbSlideEventDirection[NgbSlideEventDirection.RIGHT] = "RIGHT";
var NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
var NgbCarouselModule = (function () {
    function NgbCarouselModule() {
    }
    /**
     * @return {?}
     */
    NgbCarouselModule.forRoot = function () { return { ngModule: NgbCarouselModule, providers: [NgbCarouselConfig] }; };
    return NgbCarouselModule;
}());
NgbCarouselModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: NGB_CAROUSEL_DIRECTIVES, exports: NGB_CAROUSEL_DIRECTIVES, imports: [_angular_common.CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbCarouselModule.ctorParameters = function () { return []; };
/**
 * The NgbCollapse directive provides a simple way to hide and show an element with animations.
 */
var NgbCollapse = (function () {
    function NgbCollapse() {
        /**
         * A flag indicating collapsed (true) or open (false) state.
         */
        this.collapsed = false;
    }
    return NgbCollapse;
}());
NgbCollapse.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[ngbCollapse]',
                exportAs: 'ngbCollapse',
                host: { '[class.collapse]': 'true', '[class.show]': '!collapsed' }
            },] },
];
/**
 * @nocollapse
 */
NgbCollapse.ctorParameters = function () { return []; };
NgbCollapse.propDecorators = {
    'collapsed': [{ type: _angular_core.Input, args: ['ngbCollapse',] },],
};
var NgbCollapseModule = (function () {
    function NgbCollapseModule() {
    }
    /**
     * @return {?}
     */
    NgbCollapseModule.forRoot = function () { return { ngModule: NgbCollapseModule, providers: [] }; };
    return NgbCollapseModule;
}());
NgbCollapseModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbCollapse], exports: [NgbCollapse] },] },
];
/**
 * @nocollapse
 */
NgbCollapseModule.ctorParameters = function () { return []; };
var NgbDate = (function () {
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} day
     */
    function NgbDate(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDate.from = function (date) {
        return date ? new NgbDate(date.year, date.month, date.day ? date.day : 1) : null;
    };
    /**
     * @param {?} other
     * @return {?}
     */
    NgbDate.prototype.equals = function (other) {
        return other && this.year === other.year && this.month === other.month && this.day === other.day;
    };
    /**
     * @param {?} other
     * @return {?}
     */
    NgbDate.prototype.before = function (other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            }
            else {
                return this.month < other.month;
            }
        }
        else {
            return this.year < other.year;
        }
    };
    /**
     * @param {?} other
     * @return {?}
     */
    NgbDate.prototype.after = function (other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            }
            else {
                return this.month > other.month;
            }
        }
        else {
            return this.year > other.year;
        }
    };
    /**
     * @return {?}
     */
    NgbDate.prototype.toStruct = function () { return { year: this.year, month: this.month, day: this.day }; };
    /**
     * @return {?}
     */
    NgbDate.prototype.toString = function () { return this.year + "-" + this.month + "-" + this.day; };
    return NgbDate;
}());
/**
 * @param {?} jsDate
 * @return {?}
 */
function fromJSDate(jsDate) {
    return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}
/**
 * @param {?} date
 * @return {?}
 */
function toJSDate(date) {
    var /** @type {?} */ jsDate = new Date(date.year, date.month - 1, date.day);
    // this is done avoid 30 -> 1930 conversion
    if (!isNaN(jsDate.getTime())) {
        jsDate.setFullYear(date.year);
    }
    return jsDate;
}
/**
 * @abstract
 */
var NgbCalendar = (function () {
    function NgbCalendar() {
    }
    /**
     * @abstract
     * @return {?}
     */
    NgbCalendar.prototype.getDaysPerWeek = function () { };
    /**
     * @abstract
     * @return {?}
     */
    NgbCalendar.prototype.getMonths = function () { };
    /**
     * @abstract
     * @return {?}
     */
    NgbCalendar.prototype.getWeeksPerMonth = function () { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    NgbCalendar.prototype.getWeekday = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendar.prototype.getNext = function (date, period, number) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendar.prototype.getPrev = function (date, period, number) { };
    /**
     * @abstract
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    NgbCalendar.prototype.getWeekNumber = function (week, firstDayOfWeek) { };
    /**
     * @abstract
     * @return {?}
     */
    NgbCalendar.prototype.getToday = function () { };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    NgbCalendar.prototype.isValid = function (date) { };
    return NgbCalendar;
}());
NgbCalendar.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbCalendar.ctorParameters = function () { return []; };
var NgbCalendarGregorian = (function (_super) {
    __extends(NgbCalendarGregorian, _super);
    function NgbCalendarGregorian() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getDaysPerWeek = function () { return 7; };
    /**
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getMonths = function () { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; };
    /**
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getWeeksPerMonth = function () { return 6; };
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getNext = function (date, period, number) {
        if (period === void 0) { period = 'd'; }
        if (number === void 0) { number = 1; }
        var /** @type {?} */ jsDate = toJSDate(date);
        switch (period) {
            case 'y':
                return new NgbDate(date.year + number, 1, 1);
            case 'm':
                jsDate = new Date(date.year, date.month + number - 1, 1);
                break;
            case 'd':
                jsDate.setDate(jsDate.getDate() + number);
                break;
            default:
                return date;
        }
        return fromJSDate(jsDate);
    };
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getPrev = function (date, period, number) {
        if (period === void 0) { period = 'd'; }
        if (number === void 0) { number = 1; }
        return this.getNext(date, period, -number);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getWeekday = function (date) {
        var /** @type {?} */ jsDate = toJSDate(date);
        var /** @type {?} */ day = jsDate.getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    };
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getWeekNumber = function (week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        var /** @type {?} */ thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        var /** @type {?} */ date = week[thursdayIndex];
        var /** @type {?} */ jsDate = toJSDate(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        var /** @type {?} */ time = jsDate.getTime();
        jsDate.setMonth(0); // Compare with Jan 1
        jsDate.setDate(1);
        return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
    };
    /**
     * @return {?}
     */
    NgbCalendarGregorian.prototype.getToday = function () { return fromJSDate(new Date()); };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbCalendarGregorian.prototype.isValid = function (date) {
        if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
            return false;
        }
        var /** @type {?} */ jsDate = toJSDate(date);
        return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year && jsDate.getMonth() + 1 === date.month &&
            jsDate.getDate() === date.day;
    };
    return NgbCalendarGregorian;
}(NgbCalendar));
NgbCalendarGregorian.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbCalendarGregorian.ctorParameters = function () { return []; };
var NgbDatepickerService = (function () {
    /**
     * @param {?} _calendar
     */
    function NgbDatepickerService(_calendar) {
        this._calendar = _calendar;
    }
    /**
     * @param {?} date
     * @param {?} minDate
     * @param {?} maxDate
     * @param {?} firstDayOfWeek
     * @param {?} markDisabled
     * @return {?}
     */
    NgbDatepickerService.prototype.generateMonthViewModel = function (date, minDate, maxDate, firstDayOfWeek, markDisabled) {
        var /** @type {?} */ month = { firstDate: null, number: date.month, year: date.year, weeks: [], weekdays: [] };
        date = this._getFirstViewDate(date, firstDayOfWeek);
        // month has weeks
        for (var /** @type {?} */ w = 0; w < this._calendar.getWeeksPerMonth(); w++) {
            var /** @type {?} */ days = [];
            // week has days
            for (var /** @type {?} */ d = 0; d < this._calendar.getDaysPerWeek(); d++) {
                if (w === 0) {
                    month.weekdays.push(this._calendar.getWeekday(date));
                }
                var /** @type {?} */ newDate = new NgbDate(date.year, date.month, date.day);
                var /** @type {?} */ disabled = (minDate && newDate.before(minDate)) || (maxDate && newDate.after(maxDate));
                if (!disabled && markDisabled) {
                    disabled = markDisabled(newDate, { month: month.number, year: month.year });
                }
                // saving first date of the month
                if (month.firstDate === null && date.month === month.number) {
                    month.firstDate = newDate;
                }
                days.push({ date: newDate, disabled: disabled });
                date = this._calendar.getNext(date);
            }
            month.weeks.push({ number: this._calendar.getWeekNumber(days.map(function (day) { return NgbDate.from(day.date); }), firstDayOfWeek), days: days });
        }
        return month;
    };
    /**
     * @param {?} date
     * @param {?=} defaultValue
     * @return {?}
     */
    NgbDatepickerService.prototype.toValidDate = function (date, defaultValue) {
        var /** @type {?} */ ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    };
    /**
     * @param {?} date
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    NgbDatepickerService.prototype._getFirstViewDate = function (date, firstDayOfWeek) {
        var _this = this;
        var /** @type {?} */ currentMonth = date.month;
        var /** @type {?} */ today = new NgbDate(date.year, date.month, date.day);
        var /** @type {?} */ yesterday = this._calendar.getPrev(today);
        var /** @type {?} */ firstDayOfCurrentMonthIsAlsoFirstDayOfWeek = function () { return today.month !== yesterday.month && firstDayOfWeek === _this._calendar.getWeekday(today); };
        var /** @type {?} */ reachedTheFirstDayOfTheLastWeekOfPreviousMonth = function () { return today.month !== currentMonth && firstDayOfWeek === _this._calendar.getWeekday(today); };
        // going back in time
        while (!reachedTheFirstDayOfTheLastWeekOfPreviousMonth() && !firstDayOfCurrentMonthIsAlsoFirstDayOfWeek()) {
            today = new NgbDate(yesterday.year, yesterday.month, yesterday.day);
            yesterday = this._calendar.getPrev(yesterday);
        }
        return today;
    };
    return NgbDatepickerService;
}());
NgbDatepickerService.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerService.ctorParameters = function () { return [
    { type: NgbCalendar, },
]; };
var NavigationEvent = {};
NavigationEvent.PREV = 0;
NavigationEvent.NEXT = 1;
NavigationEvent[NavigationEvent.PREV] = "PREV";
NavigationEvent[NavigationEvent.NEXT] = "NEXT";
/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
var NgbDatepickerConfig = (function () {
    function NgbDatepickerConfig() {
        this.displayMonths = 1;
        this.firstDayOfWeek = 1;
        this.navigation = 'select';
        this.outsideDays = 'visible';
        this.showWeekdays = true;
        this.showWeekNumbers = false;
    }
    return NgbDatepickerConfig;
}());
NgbDatepickerConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerConfig.ctorParameters = function () { return []; };
var WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
var MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var MONTHS_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
    'December'
];
/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 * @abstract
 */
var NgbDatepickerI18n = (function () {
    function NgbDatepickerI18n() {
    }
    /**
     * Returns the short weekday name to display in the heading of the month view.
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
     * @abstract
     * @param {?} weekday
     * @return {?}
     */
    NgbDatepickerI18n.prototype.getWeekdayShortName = function (weekday) { };
    /**
     * Returns the short month name to display in the date picker navigation.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec
     * @abstract
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerI18n.prototype.getMonthShortName = function (month) { };
    /**
     * Returns the full month name to display in the date picker navigation.
     * With default calendar we use ISO 8601: 'month' is 1=January ... 12=December
     * @abstract
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerI18n.prototype.getMonthFullName = function (month) { };
    return NgbDatepickerI18n;
}());
NgbDatepickerI18n.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerI18n.ctorParameters = function () { return []; };
var NgbDatepickerI18nDefault = (function (_super) {
    __extends(NgbDatepickerI18nDefault, _super);
    function NgbDatepickerI18nDefault() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} weekday
     * @return {?}
     */
    NgbDatepickerI18nDefault.prototype.getWeekdayShortName = function (weekday) { return WEEKDAYS_SHORT[weekday - 1]; };
    /**
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerI18nDefault.prototype.getMonthShortName = function (month) { return MONTHS_SHORT[month - 1]; };
    /**
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerI18nDefault.prototype.getMonthFullName = function (month) { return MONTHS_FULL[month - 1]; };
    return NgbDatepickerI18nDefault;
}(NgbDatepickerI18n));
NgbDatepickerI18nDefault.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerI18nDefault.ctorParameters = function () { return []; };
var NGB_DATEPICKER_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return NgbDatepicker; }),
    multi: true
};
/**
 * A lightweight and highly configurable datepicker directive
 */
var NgbDatepicker = (function () {
    /**
     * @param {?} _service
     * @param {?} _calendar
     * @param {?} i18n
     * @param {?} config
     */
    function NgbDatepicker(_service, _calendar, i18n, config) {
        this._service = _service;
        this._calendar = _calendar;
        this.i18n = i18n;
        this.months = [];
        /**
         * An event fired when navigation happens and currently displayed month changes.
         * See NgbDatepickerNavigateEvent for the payload info.
         */
        this.navigate = new _angular_core.EventEmitter();
        this.disabled = false;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.dayTemplate = config.dayTemplate;
        this.displayMonths = config.displayMonths;
        this.firstDayOfWeek = config.firstDayOfWeek;
        this.markDisabled = config.markDisabled;
        this.minDate = config.minDate;
        this.maxDate = config.maxDate;
        this.navigation = config.navigation;
        this.outsideDays = config.outsideDays;
        this.showWeekdays = config.showWeekdays;
        this.showWeekNumbers = config.showWeekNumbers;
        this.startDate = config.startDate;
    }
    /**
     * @return {?}
     */
    NgbDatepicker.prototype.getHeaderHeight = function () {
        var /** @type {?} */ h = this.showWeekdays ? 6.25 : 4.25;
        return this.displayMonths === 1 || this.navigation !== 'select' ? h - 2 : h;
    };
    /**
     * @return {?}
     */
    NgbDatepicker.prototype.getHeaderMargin = function () {
        var /** @type {?} */ m = this.showWeekdays ? 2 : 0;
        return this.displayMonths !== 1 || this.navigation !== 'select' ? m + 2 : m;
    };
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    NgbDatepicker.prototype.navigateTo = function (date) {
        this._setViewWithinLimits(this._service.toValidDate(date));
        this._updateData();
    };
    /**
     * @return {?}
     */
    NgbDatepicker.prototype.ngOnInit = function () {
        this._setDates();
        this.navigateTo(this._date);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbDatepicker.prototype.ngOnChanges = function (changes) {
        this._setDates();
        this._setViewWithinLimits(this._date);
        if (changes['displayMonths']) {
            this.displayMonths = toInteger(this.displayMonths);
        }
        // we have to force rebuild all months only if any of these inputs changes
        if (['startDate', 'minDate', 'maxDate', 'navigation', 'firstDayOfWeek', 'markDisabled', 'displayMonths'].some(function (input) { return !!changes[input]; })) {
            this._updateData(true);
        }
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDatepicker.prototype.onDateSelect = function (date) {
        this._setViewWithinLimits(date);
        this.onTouched();
        this.writeValue(date);
        this.onChange({ year: date.year, month: date.month, day: date.day });
        // switch current month
        if (this._date.month !== this.months[0].number && this.displayMonths === 1) {
            this._updateData();
        }
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDatepicker.prototype.onNavigateDateSelect = function (date) {
        this._setViewWithinLimits(date);
        this._updateData();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgbDatepicker.prototype.onNavigateEvent = function (event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._setViewWithinLimits(this._calendar.getPrev(this.months[0].firstDate, 'm'));
                break;
            case NavigationEvent.NEXT:
                this._setViewWithinLimits(this._calendar.getNext(this.months[0].firstDate, 'm'));
                break;
        }
        this._updateData();
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbDatepicker.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbDatepicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbDatepicker.prototype.writeValue = function (value) { this.model = this._service.toValidDate(value, null); };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbDatepicker.prototype.setDisabledState = function (isDisabled) { this.disabled = isDisabled; };
    /**
     * @return {?}
     */
    NgbDatepicker.prototype._setDates = function () {
        this._maxDate = NgbDate.from(this.maxDate);
        this._minDate = NgbDate.from(this.minDate);
        this._date = this._service.toValidDate(this.startDate);
        if (!this._calendar.isValid(this._minDate)) {
            this._minDate = this._calendar.getPrev(this._date, 'y', 10);
            this.minDate = { year: this._minDate.year, month: this._minDate.month, day: this._minDate.day };
        }
        if (!this._calendar.isValid(this._maxDate)) {
            this._maxDate = this._calendar.getNext(this._date, 'y', 11);
            this._maxDate = this._calendar.getPrev(this._maxDate);
            this.maxDate = { year: this._maxDate.year, month: this._maxDate.month, day: this._maxDate.day };
        }
        if (this._minDate && this._maxDate && this._maxDate.before(this._minDate)) {
            throw new Error("'maxDate' " + this._maxDate + " should be greater than 'minDate' " + this._minDate);
        }
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDatepicker.prototype._setViewWithinLimits = function (date) {
        if (this._minDate && date.before(this._minDate)) {
            this._date = new NgbDate(this._minDate.year, this._minDate.month, 1);
        }
        else if (this._maxDate && date.after(this._maxDate)) {
            this._date = new NgbDate(this._maxDate.year, this._maxDate.month, 1);
        }
        else {
            this._date = new NgbDate(date.year, date.month, 1);
        }
    };
    /**
     * @param {?=} force
     * @return {?}
     */
    NgbDatepicker.prototype._updateData = function (force) {
        if (force === void 0) { force = false; }
        var /** @type {?} */ newMonths = [];
        var _loop_1 = function (i) {
            var /** @type {?} */ newDate_1 = this_1._calendar.getNext(this_1._date, 'm', i);
            var /** @type {?} */ index = this_1.months.findIndex(function (month) { return month.firstDate.equals(newDate_1); });
            if (force || index === -1) {
                newMonths.push(this_1._service.generateMonthViewModel(newDate_1, this_1._minDate, this_1._maxDate, toInteger(this_1.firstDayOfWeek), this_1.markDisabled));
            }
            else {
                newMonths.push(this_1.months[index]);
            }
        };
        var this_1 = this;
        for (var /** @type {?} */ i = 0; i < this.displayMonths; i++) {
            _loop_1(/** @type {?} */ i);
        }
        var /** @type {?} */ newDate = newMonths[0].firstDate;
        var /** @type {?} */ oldDate = this.months[0] ? this.months[0].firstDate : null;
        this.months = newMonths;
        // emitting navigation event if the first month changes
        if (!newDate.equals(oldDate)) {
            this.navigate.emit({
                current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
                next: { year: newDate.year, month: newDate.month }
            });
        }
    };
    return NgbDatepicker;
}());
NgbDatepicker.decorators = [
    { type: _angular_core.Component, args: [{
                exportAs: 'ngbDatepicker',
                selector: 'ngb-datepicker',
                host: { 'class': 'd-inline-block rounded' },
                styles: ["\n    :host {\n      border: 1px solid rgba(0, 0, 0, 0.125);\n    }\n    .ngb-dp-header {\n      border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n    }\n    .ngb-dp-month {\n      pointer-events: none;\n    }\n    ngb-datepicker-month-view {\n      pointer-events: auto;\n    }\n    .ngb-dp-month:first-child {\n      margin-left: 0 !important;\n    }    \n    .ngb-dp-month-name {\n      font-size: larger;\n      height: 2rem;\n      line-height: 2rem;\n    }    \n  "],
                template: "\n    <ng-template #dt let-date=\"date\" let-currentMonth=\"currentMonth\" let-selected=\"selected\" let-disabled=\"disabled\">\n       <div ngbDatepickerDayView [date]=\"date\" [currentMonth]=\"currentMonth\" [selected]=\"selected\" [disabled]=\"disabled\"></div>\n    </ng-template>\n    \n    <div class=\"ngb-dp-header bg-faded pt-1 rounded-top\" [style.height.rem]=\"getHeaderHeight()\" \n      [style.marginBottom.rem]=\"-getHeaderMargin()\">\n      <ngb-datepicker-navigation *ngIf=\"navigation !== 'none'\"\n        [date]=\"months[0]?.firstDate\"\n        [minDate]=\"_minDate\"\n        [maxDate]=\"_maxDate\"\n        [months]=\"months.length\"\n        [disabled]=\"disabled\"\n        [showWeekNumbers]=\"showWeekNumbers\"\n        [showSelect]=\"navigation === 'select'\"\n        (navigate)=\"onNavigateEvent($event)\"\n        (select)=\"onNavigateDateSelect($event)\">\n      </ngb-datepicker-navigation>\n    </div>\n\n    <div class=\"ngb-dp-months d-flex px-1 pb-1\">\n      <ng-template ngFor let-month [ngForOf]=\"months\" let-i=\"index\">\n        <div class=\"ngb-dp-month d-block ml-3\">            \n          <div *ngIf=\"navigation !== 'select' || displayMonths > 1\" class=\"ngb-dp-month-name text-center\">\n            {{ i18n.getMonthFullName(month.number) }} {{ month.year }}\n          </div>\n          <ngb-datepicker-month-view\n            [month]=\"month\"\n            [selectedDate]=\"model\"\n            [dayTemplate]=\"dayTemplate || dt\"\n            [showWeekdays]=\"showWeekdays\"\n            [showWeekNumbers]=\"showWeekNumbers\"\n            [disabled]=\"disabled\"\n            [outsideDays]=\"displayMonths === 1 ? outsideDays : 'hidden'\"\n            (select)=\"onDateSelect($event)\">\n          </ngb-datepicker-month-view>\n        </div>\n      </ng-template>\n    </div>\n  ",
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NgbDatepickerService]
            },] },
];
/**
 * @nocollapse
 */
NgbDatepicker.ctorParameters = function () { return [
    { type: NgbDatepickerService, },
    { type: NgbCalendar, },
    { type: NgbDatepickerI18n, },
    { type: NgbDatepickerConfig, },
]; };
NgbDatepicker.propDecorators = {
    'dayTemplate': [{ type: _angular_core.Input },],
    'displayMonths': [{ type: _angular_core.Input },],
    'firstDayOfWeek': [{ type: _angular_core.Input },],
    'markDisabled': [{ type: _angular_core.Input },],
    'minDate': [{ type: _angular_core.Input },],
    'maxDate': [{ type: _angular_core.Input },],
    'navigation': [{ type: _angular_core.Input },],
    'outsideDays': [{ type: _angular_core.Input },],
    'showWeekdays': [{ type: _angular_core.Input },],
    'showWeekNumbers': [{ type: _angular_core.Input },],
    'startDate': [{ type: _angular_core.Input },],
    'navigate': [{ type: _angular_core.Output },],
};
var NgbDatepickerMonthView = (function () {
    /**
     * @param {?} i18n
     */
    function NgbDatepickerMonthView(i18n) {
        this.i18n = i18n;
        this.select = new _angular_core.EventEmitter();
    }
    /**
     * @param {?} day
     * @return {?}
     */
    NgbDatepickerMonthView.prototype.doSelect = function (day) {
        if (!this.isDisabled(day) && !this.isHidden(day)) {
            this.select.emit(NgbDate.from(day.date));
        }
    };
    /**
     * @param {?} day
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerMonthView.prototype._getDayContext = function (day, month) {
        return {
            date: { year: day.date.year, month: day.date.month, day: day.date.day },
            currentMonth: month.number,
            disabled: this.isDisabled(day),
            selected: this.isSelected(day.date)
        };
    };
    /**
     * @param {?} day
     * @return {?}
     */
    NgbDatepickerMonthView.prototype.isDisabled = function (day) { return this.disabled || day.disabled; };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDatepickerMonthView.prototype.isSelected = function (date) { return this.selectedDate && this.selectedDate.equals(date); };
    /**
     * @param {?} week
     * @return {?}
     */
    NgbDatepickerMonthView.prototype.isCollapsed = function (week) {
        return this.outsideDays === 'collapsed' && week.days[0].date.month !== this.month.number &&
            week.days[week.days.length - 1].date.month !== this.month.number;
    };
    /**
     * @param {?} day
     * @return {?}
     */
    NgbDatepickerMonthView.prototype.isHidden = function (day) {
        return (this.outsideDays === 'hidden' || this.outsideDays === 'collapsed') && this.month.number !== day.date.month;
    };
    return NgbDatepickerMonthView;
}());
NgbDatepickerMonthView.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-datepicker-month-view',
                host: { 'class': 'd-block' },
                styles: ["\n    .ngb-dp-weekday, .ngb-dp-week-number {\n      line-height: 2rem;\n    }\n    .ngb-dp-day, .ngb-dp-weekday, .ngb-dp-week-number {\n      width: 2rem;\n      height: 2rem;      \n    }\n    .ngb-dp-day {\n      cursor: pointer;\n    }\n    .ngb-dp-day.disabled, .ngb-dp-day.hidden {\n      cursor: default;\n    }\n  "],
                template: "\n    <div *ngIf=\"showWeekdays\" class=\"ngb-dp-week d-flex\">\n      <div *ngIf=\"showWeekNumbers\" class=\"ngb-dp-weekday\"></div>\n      <div *ngFor=\"let w of month.weekdays\" class=\"ngb-dp-weekday small text-center text-info font-italic\">\n        {{ i18n.getWeekdayShortName(w) }}\n      </div>\n    </div>\n    <ng-template ngFor let-week [ngForOf]=\"month.weeks\">\n      <div *ngIf=\"!isCollapsed(week)\" class=\"ngb-dp-week d-flex\">\n        <div *ngIf=\"showWeekNumbers\" class=\"ngb-dp-week-number small text-center font-italic text-muted\">{{ week.number }}</div>\n        <div *ngFor=\"let day of week.days\" (click)=\"doSelect(day)\" class=\"ngb-dp-day\" [class.disabled]=\"isDisabled(day)\"\n         [class.hidden]=\"isHidden(day)\">\n          <ng-template [ngIf]=\"!isHidden(day)\">\n            <ng-template [ngTemplateOutlet]=\"dayTemplate\"\n            [ngOutletContext]=\"_getDayContext(day, month)\">\n            </ng-template>\n          </ng-template>\n        </div>\n      </div>\n    </ng-template>\n  "
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerMonthView.ctorParameters = function () { return [
    { type: NgbDatepickerI18n, },
]; };
NgbDatepickerMonthView.propDecorators = {
    'dayTemplate': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'month': [{ type: _angular_core.Input },],
    'outsideDays': [{ type: _angular_core.Input },],
    'selectedDate': [{ type: _angular_core.Input },],
    'showWeekdays': [{ type: _angular_core.Input },],
    'showWeekNumbers': [{ type: _angular_core.Input },],
    'select': [{ type: _angular_core.Output },],
};
var NgbDatepickerNavigation = (function () {
    /**
     * @param {?} i18n
     * @param {?} _calendar
     */
    function NgbDatepickerNavigation(i18n, _calendar) {
        this.i18n = i18n;
        this._calendar = _calendar;
        this.navigation = NavigationEvent;
        this.navigate = new _angular_core.EventEmitter();
        this.select = new _angular_core.EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    NgbDatepickerNavigation.prototype.doNavigate = function (event) { this.navigate.emit(event); };
    /**
     * @return {?}
     */
    NgbDatepickerNavigation.prototype.nextDisabled = function () {
        return this.disabled || (this.maxDate && this._calendar.getNext(this.date, 'm').after(this.maxDate));
    };
    /**
     * @return {?}
     */
    NgbDatepickerNavigation.prototype.prevDisabled = function () {
        var /** @type {?} */ prevDate = this._calendar.getPrev(this.date, 'm');
        return this.disabled || (this.minDate && prevDate.year <= this.minDate.year && prevDate.month < this.minDate.month);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDatepickerNavigation.prototype.selectDate = function (date) { this.select.emit(date); };
    return NgbDatepickerNavigation;
}());
NgbDatepickerNavigation.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-datepicker-navigation',
                host: { 'class': 'd-flex justify-content-between', '[class.collapsed]': '!showSelect' },
                styles: ["\n    :host {\n      height: 2rem;\n      line-height: 1.85rem;\n    }\n    :host.collapsed {\n      margin-bottom: -2rem;        \n    }\n    .ngb-dp-navigation-chevron::before {\n      border-style: solid;\n      border-width: 0.2em 0.2em 0 0;\n      content: '';\n      display: inline-block;\n      height: 0.75em;\n      transform: rotate(-135deg);\n      -webkit-transform: rotate(-135deg);\n      -ms-transform: rotate(-135deg);\n      width: 0.75em;\n      margin: 0 0 0 0.5rem;\n    }    \n    .ngb-dp-navigation-chevron.right:before {\n      -webkit-transform: rotate(45deg);\n      -ms-transform: rotate(45deg);\n      transform: rotate(45deg);\n      margin: 0 0.5rem 0 0;\n    }\n    .btn-link {\n      cursor: pointer;\n      outline: 0;\n    }\n    .btn-link[disabled] {\n      cursor: not-allowed;\n      opacity: .65;\n    }    \n  "],
                template: "\n    <button type=\"button\" class=\"btn-link\" (click)=\"!!doNavigate(navigation.PREV)\" [disabled]=\"prevDisabled()\">\n      <span class=\"ngb-dp-navigation-chevron\"></span>    \n    </button>\n    \n    <ngb-datepicker-navigation-select *ngIf=\"showSelect\" class=\"d-block\" [style.width.rem]=\"months * 9\"\n      [date]=\"date\"\n      [minDate]=\"minDate\"\n      [maxDate]=\"maxDate\"\n      [disabled] = \"disabled\"\n      (select)=\"selectDate($event)\">\n    </ngb-datepicker-navigation-select>\n    \n    <button type=\"button\" class=\"btn-link\" (click)=\"!!doNavigate(navigation.NEXT)\" [disabled]=\"nextDisabled()\">\n      <span class=\"ngb-dp-navigation-chevron right\"></span>\n    </button>\n  "
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerNavigation.ctorParameters = function () { return [
    { type: NgbDatepickerI18n, },
    { type: NgbCalendar, },
]; };
NgbDatepickerNavigation.propDecorators = {
    'date': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'maxDate': [{ type: _angular_core.Input },],
    'minDate': [{ type: _angular_core.Input },],
    'months': [{ type: _angular_core.Input },],
    'showSelect': [{ type: _angular_core.Input },],
    'showWeekNumbers': [{ type: _angular_core.Input },],
    'navigate': [{ type: _angular_core.Output },],
    'select': [{ type: _angular_core.Output },],
};
/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 * @abstract
 */
var NgbDateParserFormatter = (function () {
    function NgbDateParserFormatter() {
    }
    /**
     * Parses the given value to an NgbDateStruct. Implementations should try their best to provide a result, even
     * partial. They must return null if the value can't be parsed.
     * @abstract
     * @param {?} value the value to parse
     * @return {?}
     */
    NgbDateParserFormatter.prototype.parse = function (value) { };
    /**
     * Formats the given date to a string. Implementations should return an empty string if the given date is null,
     * and try their best to provide a partial result if the given date is incomplete or invalid.
     * @abstract
     * @param {?} date the date to format as a string
     * @return {?}
     */
    NgbDateParserFormatter.prototype.format = function (date) { };
    return NgbDateParserFormatter;
}());
var NgbDateISOParserFormatter = (function (_super) {
    __extends(NgbDateISOParserFormatter, _super);
    function NgbDateISOParserFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    NgbDateISOParserFormatter.prototype.parse = function (value) {
        if (value) {
            var /** @type {?} */ dateParts = value.trim().split('-');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
            }
        }
        return null;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbDateISOParserFormatter.prototype.format = function (date) {
        return date ?
            date.year + "-" + (isNumber(date.month) ? padNumber(date.month) : '') + "-" + (isNumber(date.day) ? padNumber(date.day) : '') :
            '';
    };
    return NgbDateISOParserFormatter;
}(NgbDateParserFormatter));
var Positioning = (function () {
    function Positioning() {
    }
    /**
     * @param {?} element
     * @param {?} prop
     * @return {?}
     */
    Positioning.prototype.getStyle = function (element, prop) { return window.getComputedStyle(element)[prop]; };
    /**
     * @param {?} element
     * @return {?}
     */
    Positioning.prototype.isStaticPositioned = function (element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    };
    /**
     * @param {?} element
     * @return {?}
     */
    Positioning.prototype.offsetParent = function (element) {
        var /** @type {?} */ offsetParentEl = (element.offsetParent) || document.documentElement;
        while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = (offsetParentEl.offsetParent);
        }
        return offsetParentEl || document.documentElement;
    };
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    Positioning.prototype.position = function (element, round) {
        if (round === void 0) { round = true; }
        var /** @type {?} */ elPosition;
        var /** @type {?} */ parentOffset = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 };
        if (this.getStyle(element, 'position') === 'fixed') {
            elPosition = element.getBoundingClientRect();
        }
        else {
            var /** @type {?} */ offsetParentEl = this.offsetParent(element);
            elPosition = this.offset(element, false);
            if (offsetParentEl !== document.documentElement) {
                parentOffset = this.offset(offsetParentEl, false);
            }
            parentOffset.top += offsetParentEl.clientTop;
            parentOffset.left += offsetParentEl.clientLeft;
        }
        elPosition.top -= parentOffset.top;
        elPosition.bottom -= parentOffset.top;
        elPosition.left -= parentOffset.left;
        elPosition.right -= parentOffset.left;
        if (round) {
            elPosition.top = Math.round(elPosition.top);
            elPosition.bottom = Math.round(elPosition.bottom);
            elPosition.left = Math.round(elPosition.left);
            elPosition.right = Math.round(elPosition.right);
        }
        return elPosition;
    };
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    Positioning.prototype.offset = function (element, round) {
        if (round === void 0) { round = true; }
        var /** @type {?} */ elBcr = element.getBoundingClientRect();
        var /** @type {?} */ viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };
        var /** @type {?} */ elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            top: elBcr.top + viewportOffset.top,
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };
        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }
        return elOffset;
    };
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @param {?} placement
     * @param {?=} appendToBody
     * @return {?}
     */
    Positioning.prototype.positionElements = function (hostElement, targetElement, placement, appendToBody) {
        var /** @type {?} */ hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
        var /** @type {?} */ targetElBCR = targetElement.getBoundingClientRect();
        var /** @type {?} */ placementPrimary = placement.split('-')[0] || 'top';
        var /** @type {?} */ placementSecondary = placement.split('-')[1] || 'center';
        var /** @type {?} */ targetElPosition = {
            'height': targetElBCR.height || targetElement.offsetHeight,
            'width': targetElBCR.width || targetElement.offsetWidth,
            'top': 0,
            'bottom': targetElBCR.height || targetElement.offsetHeight,
            'left': 0,
            'right': targetElBCR.width || targetElement.offsetWidth
        };
        switch (placementPrimary) {
            case 'top':
                targetElPosition.top = hostElPosition.top - targetElement.offsetHeight;
                break;
            case 'bottom':
                targetElPosition.top = hostElPosition.top + hostElPosition.height;
                break;
            case 'left':
                targetElPosition.left = hostElPosition.left - targetElement.offsetWidth;
                break;
            case 'right':
                targetElPosition.left = hostElPosition.left + hostElPosition.width;
                break;
        }
        switch (placementSecondary) {
            case 'top':
                targetElPosition.top = hostElPosition.top;
                break;
            case 'bottom':
                targetElPosition.top = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
                break;
            case 'left':
                targetElPosition.left = hostElPosition.left;
                break;
            case 'right':
                targetElPosition.left = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
                break;
            case 'center':
                if (placementPrimary === 'top' || placementPrimary === 'bottom') {
                    targetElPosition.left = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
                }
                else {
                    targetElPosition.top = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
                }
                break;
        }
        targetElPosition.top = Math.round(targetElPosition.top);
        targetElPosition.bottom = Math.round(targetElPosition.bottom);
        targetElPosition.left = Math.round(targetElPosition.left);
        targetElPosition.right = Math.round(targetElPosition.right);
        return targetElPosition;
    };
    return Positioning;
}());
var positionService = new Positioning();
/**
 * @param {?} hostElement
 * @param {?} targetElement
 * @param {?} placement
 * @param {?=} appendToBody
 * @return {?}
 */
function positionElements(hostElement, targetElement, placement, appendToBody) {
    var /** @type {?} */ pos = positionService.positionElements(hostElement, targetElement, placement, appendToBody);
    targetElement.style.top = pos.top + "px";
    targetElement.style.left = pos.left + "px";
}
var NGB_DATEPICKER_VALUE_ACCESSOR$1 = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return NgbInputDatepicker; }),
    multi: true
};
var NGB_DATEPICKER_VALIDATOR = {
    provide: _angular_forms.NG_VALIDATORS,
    useExisting: _angular_core.forwardRef(function () { return NgbInputDatepicker; }),
    multi: true
};
/**
 * A directive that makes it possible to have datepickers on input fields.
 * Manages integration with the input field itself (data entry) and ngModel (validation etc.).
 */
var NgbInputDatepicker = (function () {
    /**
     * @param {?} _parserFormatter
     * @param {?} _elRef
     * @param {?} _vcRef
     * @param {?} _renderer
     * @param {?} _cfr
     * @param {?} ngZone
     * @param {?} _service
     * @param {?} _calendar
     */
    function NgbInputDatepicker(_parserFormatter, _elRef, _vcRef, _renderer, _cfr, ngZone, _service, _calendar) {
        var _this = this;
        this._parserFormatter = _parserFormatter;
        this._elRef = _elRef;
        this._vcRef = _vcRef;
        this._renderer = _renderer;
        this._cfr = _cfr;
        this._service = _service;
        this._calendar = _calendar;
        this._cRef = null;
        /**
         * Placement of a datepicker popup. Accepts: "top", "bottom", "left", "right", "bottom-left",
         * "bottom-right" etc.
         */
        this.placement = 'bottom-left';
        /**
         * An event fired when navigation happens and currently displayed month changes.
         * See NgbDatepickerNavigateEvent for the payload info.
         */
        this.navigate = new _angular_core.EventEmitter();
        this._onChange = function (_) { };
        this._onTouched = function () { };
        this._validatorChange = function () { };
        this._zoneSubscription = ngZone.onStable.subscribe(function () {
            if (_this._cRef) {
                positionElements(_this._elRef.nativeElement, _this._cRef.location.nativeElement, _this.placement);
            }
        });
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnTouched = function (fn) { this._onTouched = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnValidatorChange = function (fn) { this._validatorChange = fn; };
    
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbInputDatepicker.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setProperty(this._elRef.nativeElement, 'disabled', isDisabled);
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(isDisabled);
        }
    };
    /**
     * @param {?} c
     * @return {?}
     */
    NgbInputDatepicker.prototype.validate = function (c) {
        var /** @type {?} */ value = c.value;
        if (value === null || value === undefined) {
            return null;
        }
        if (!this._calendar.isValid(value)) {
            return { 'ngbDate': { invalid: c.value } };
        }
        if (this.minDate && NgbDate.from(value).before(NgbDate.from(this.minDate))) {
            return { 'ngbDate': { requiredBefore: this.minDate } };
        }
        if (this.maxDate && NgbDate.from(value).after(NgbDate.from(this.maxDate))) {
            return { 'ngbDate': { requiredAfter: this.maxDate } };
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbInputDatepicker.prototype.writeValue = function (value) {
        var /** @type {?} */ ngbDate = value ? new NgbDate(value.year, value.month, value.day) : null;
        this._model = this._calendar.isValid(value) ? ngbDate : null;
        this._writeModelValue(this._model);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbInputDatepicker.prototype.manualDateChange = function (value) {
        this._model = this._service.toValidDate(this._parserFormatter.parse(value), null);
        this._onChange(this._model ? this._model.toStruct() : (value === '' ? null : value));
        this._writeModelValue(this._model);
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.isOpen = function () { return !!this._cRef; };
    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     * @return {?}
     */
    NgbInputDatepicker.prototype.open = function () {
        var _this = this;
        if (!this.isOpen()) {
            var /** @type {?} */ cf = this._cfr.resolveComponentFactory(NgbDatepicker);
            this._cRef = this._vcRef.createComponent(cf);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._cRef.instance.writeValue(this._model);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            // date selection event handling
            this._cRef.instance.registerOnChange(function (selectedDate) {
                _this.writeValue(selectedDate);
                _this._onChange(selectedDate);
                _this.close();
            });
        }
    };
    /**
     * Closes the datepicker popup.
     * @return {?}
     */
    NgbInputDatepicker.prototype.close = function () {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
        }
    };
    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     * @return {?}
     */
    NgbInputDatepicker.prototype.toggle = function () {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    NgbInputDatepicker.prototype.navigateTo = function (date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.onBlur = function () { this._onTouched(); };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbInputDatepicker.prototype.ngOnChanges = function (changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.ngOnDestroy = function () {
        this.close();
        this._zoneSubscription.unsubscribe();
    };
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    NgbInputDatepicker.prototype._applyDatepickerInputs = function (datepickerInstance) {
        var _this = this;
        ['dayTemplate', 'displayMonths', 'firstDayOfWeek', 'markDisabled', 'minDate', 'maxDate', 'navigation',
            'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
            .forEach(function (optionName) {
            if (_this[optionName] !== undefined) {
                datepickerInstance[optionName] = _this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    };
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    NgbInputDatepicker.prototype._applyPopupStyling = function (nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
    };
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    NgbInputDatepicker.prototype._subscribeForDatepickerOutputs = function (datepickerInstance) {
        var _this = this;
        datepickerInstance.navigate.subscribe(function (date) { return _this.navigate.emit(date); });
    };
    /**
     * @param {?} model
     * @return {?}
     */
    NgbInputDatepicker.prototype._writeModelValue = function (model) {
        this._renderer.setProperty(this._elRef.nativeElement, 'value', this._parserFormatter.format(model));
        if (this.isOpen()) {
            this._cRef.instance.writeValue(model);
            this._onTouched();
        }
    };
    return NgbInputDatepicker;
}());
NgbInputDatepicker.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'input[ngbDatepicker]',
                exportAs: 'ngbDatepicker',
                host: { '(change)': 'manualDateChange($event.target.value)', '(keyup.esc)': 'close()', '(blur)': 'onBlur()' },
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR$1, NGB_DATEPICKER_VALIDATOR, NgbDatepickerService]
            },] },
];
/**
 * @nocollapse
 */
NgbInputDatepicker.ctorParameters = function () { return [
    { type: NgbDateParserFormatter, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.ViewContainerRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ComponentFactoryResolver, },
    { type: _angular_core.NgZone, },
    { type: NgbDatepickerService, },
    { type: NgbCalendar, },
]; };
NgbInputDatepicker.propDecorators = {
    'dayTemplate': [{ type: _angular_core.Input },],
    'displayMonths': [{ type: _angular_core.Input },],
    'firstDayOfWeek': [{ type: _angular_core.Input },],
    'markDisabled': [{ type: _angular_core.Input },],
    'minDate': [{ type: _angular_core.Input },],
    'maxDate': [{ type: _angular_core.Input },],
    'navigation': [{ type: _angular_core.Input },],
    'outsideDays': [{ type: _angular_core.Input },],
    'placement': [{ type: _angular_core.Input },],
    'showWeekdays': [{ type: _angular_core.Input },],
    'showWeekNumbers': [{ type: _angular_core.Input },],
    'startDate': [{ type: _angular_core.Input },],
    'navigate': [{ type: _angular_core.Output },],
};
var NgbDatepickerDayView = (function () {
    function NgbDatepickerDayView() {
    }
    /**
     * @return {?}
     */
    NgbDatepickerDayView.prototype.isMuted = function () { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); };
    return NgbDatepickerDayView;
}());
NgbDatepickerDayView.decorators = [
    { type: _angular_core.Component, args: [{
                selector: '[ngbDatepickerDayView]',
                styles: ["\n    :host {\n      text-align: center;\n      width: 2rem;\n      height: 2rem;\n      line-height: 2rem;      \n      border-radius: 0.25rem;\n    }\n    :host.outside {\n      opacity: 0.5;\n    }\n  "],
                host: {
                    '[class.bg-primary]': 'selected',
                    '[class.text-white]': 'selected',
                    '[class.text-muted]': 'isMuted()',
                    '[class.outside]': 'isMuted()',
                    '[class.btn-secondary]': '!disabled'
                },
                template: "{{ date.day }}"
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerDayView.ctorParameters = function () { return []; };
NgbDatepickerDayView.propDecorators = {
    'currentMonth': [{ type: _angular_core.Input },],
    'date': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'selected': [{ type: _angular_core.Input },],
};
var NgbDatepickerNavigationSelect = (function () {
    /**
     * @param {?} i18n
     * @param {?} calendar
     */
    function NgbDatepickerNavigationSelect(i18n, calendar) {
        this.i18n = i18n;
        this.calendar = calendar;
        this.years = [];
        this.select = new _angular_core.EventEmitter();
        this.months = calendar.getMonths();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbDatepickerNavigationSelect.prototype.ngOnChanges = function (changes) {
        if (changes['maxDate'] || changes['minDate'] || changes['date']) {
            this._generateYears();
            this._generateMonths();
        }
    };
    /**
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerNavigationSelect.prototype.changeMonth = function (month) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); };
    /**
     * @param {?} year
     * @return {?}
     */
    NgbDatepickerNavigationSelect.prototype.changeYear = function (year) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); };
    /**
     * @return {?}
     */
    NgbDatepickerNavigationSelect.prototype._generateMonths = function () {
        var _this = this;
        this.months = this.calendar.getMonths();
        if (this.date && this.date.year === this.minDate.year) {
            var /** @type {?} */ index = this.months.findIndex(function (month) { return month === _this.minDate.month; });
            this.months = this.months.slice(index);
        }
        if (this.date && this.date.year === this.maxDate.year) {
            var /** @type {?} */ index = this.months.findIndex(function (month) { return month === _this.maxDate.month; });
            this.months = this.months.slice(0, index + 1);
        }
    };
    /**
     * @return {?}
     */
    NgbDatepickerNavigationSelect.prototype._generateYears = function () {
        var _this = this;
        this.years = Array.from({ length: this.maxDate.year - this.minDate.year + 1 }, function (e, i) { return _this.minDate.year + i; });
    };
    return NgbDatepickerNavigationSelect;
}());
NgbDatepickerNavigationSelect.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-datepicker-navigation-select',
                styles: ["\n    select {\n      /* to align with btn-sm */\n      padding: 0.25rem 0.5rem;\n      font-size: 0.875rem;      \n      line-height: 1.25;\n      /* to cancel the custom height set by custom-select */\n      height: inherit;\n      width: 50%;\n    }\n  "],
                template: "\n    <select [disabled]=\"disabled\" class=\"custom-select d-inline-block\" [value]=\"date?.month\" (change)=\"changeMonth($event.target.value)\">\n      <option *ngFor=\"let m of months\" [value]=\"m\">{{ i18n.getMonthShortName(m) }}</option>\n    </select>" +
                    "<select [disabled]=\"disabled\" class=\"custom-select d-inline-block\" [value]=\"date?.year\" (change)=\"changeYear($event.target.value)\">\n      <option *ngFor=\"let y of years\" [value]=\"y\">{{ y }}</option>\n    </select> \n  " // template needs to be formatted in a certain way so we don't add empty text nodes
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerNavigationSelect.ctorParameters = function () { return [
    { type: NgbDatepickerI18n, },
    { type: NgbCalendar, },
]; };
NgbDatepickerNavigationSelect.propDecorators = {
    'date': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'maxDate': [{ type: _angular_core.Input },],
    'minDate': [{ type: _angular_core.Input },],
    'select': [{ type: _angular_core.Output },],
};
/**
 * @abstract
 */
var NgbCalendarHijri = (function (_super) {
    __extends(NgbCalendarHijri, _super);
    function NgbCalendarHijri() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    NgbCalendarHijri.prototype.getDaysPerWeek = function () { return 7; };
    /**
     * @return {?}
     */
    NgbCalendarHijri.prototype.getMonths = function () { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; };
    /**
     * @return {?}
     */
    NgbCalendarHijri.prototype.getWeeksPerMonth = function () { return 6; };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbCalendarHijri.prototype.isValid = function (date) {
        return date && isNumber(date.year) && isNumber(date.month) && isNumber(date.day) &&
            !isNaN(this.toGregorian(date).getTime());
    };
    /**
     * @param {?} date
     * @param {?} day
     * @return {?}
     */
    NgbCalendarHijri.prototype.setDay = function (date, day) {
        day = +day;
        var /** @type {?} */ mDays = this.getDaysInIslamicMonth(date.month, date.year);
        if (day <= 0) {
            while (day <= 0) {
                date = this.setMonth(date, date.month - 1);
                mDays = this.getDaysInIslamicMonth(date.month, date.year);
                day += mDays;
            }
        }
        else if (day > mDays) {
            while (day > mDays) {
                day -= mDays;
                date = this.setMonth(date, date.month + 1);
                mDays = this.getDaysInIslamicMonth(date.month, date.year);
            }
        }
        date.day = day;
        return date;
    };
    /**
     * @param {?} date
     * @param {?} month
     * @return {?}
     */
    NgbCalendarHijri.prototype.setMonth = function (date, month) {
        month = +month;
        date.year = date.year + Math.floor((month - 1) / 12);
        date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
        return date;
    };
    /**
     * @param {?} date
     * @param {?} yearValue
     * @return {?}
     */
    NgbCalendarHijri.prototype.setYear = function (date, yearValue) {
        date.year = +yearValue;
        return date;
    };
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    NgbCalendarHijri.prototype.getWeekday = function (date) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendarHijri.prototype.getNext = function (date, period, number) { };
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendarHijri.prototype.getPrev = function (date, period, number) { };
    /**
     * @abstract
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    NgbCalendarHijri.prototype.getWeekNumber = function (week, firstDayOfWeek) { };
    /**
     * @abstract
     * @return {?}
     */
    NgbCalendarHijri.prototype.getToday = function () { };
    /**
     * Returns the equivalent Hijri date value for a give input Gregorian date.
     * `gDate` is s JS Date to be converted to Hijri.
     * @abstract
     * @param {?} gDate
     * @return {?}
     */
    NgbCalendarHijri.prototype.fromGregorian = function (gDate) { };
    /**
     * Converts the current Hijri date to Gregorian.
     * @abstract
     * @param {?} hijriDate
     * @return {?}
     */
    NgbCalendarHijri.prototype.toGregorian = function (hijriDate) { };
    /**
     * Returns the number of days in a specific Hijri month.
     * `month` is 1 for Muharram, 2 for Safar, etc.
     * `year` is any Hijri year.
     * @abstract
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    NgbCalendarHijri.prototype.getDaysInIslamicMonth = function (month, year) { };
    /**
     * @param {?} year
     * @return {?}
     */
    NgbCalendarHijri.prototype._isIslamicLeapYear = function (year) { return (14 + 11 * year) % 30 < 11; };
    /**
     * Returns the start of Hijri Month.
     * `month` is 0 for Muharram, 1 for Safar, etc.
     * `year` is any Hijri year.
     * @param {?} year
     * @param {?} month
     * @return {?}
     */
    NgbCalendarHijri.prototype._getMonthStart = function (year, month) {
        return Math.ceil(29.5 * month) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
    };
    /**
     * Returns the start of Hijri year.
     * `year` is any Hijri year.
     * @param {?} year
     * @return {?}
     */
    NgbCalendarHijri.prototype._getYearStart = function (year) { return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0); };
    return NgbCalendarHijri;
}(NgbCalendar));
NgbCalendarHijri.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbCalendarHijri.ctorParameters = function () { return []; };
/**
 * @param {?} date
 * @return {?}
 */
function isGregorianLeapYear(date) {
    var /** @type {?} */ year = date.getFullYear();
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function mod(a, b) {
    return a - b * Math.floor(a / b);
}
/**
 * The civil calendar is one type of Hijri calendars used in islamic countries.
 * Uses a fixed cycle of alternating 29- and 30-day months,
 * with a leap day added to the last month of 11 out of every 30 years.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 * All the calculations here are based on the equations from "Calendrical Calculations" By Edward M. Reingold, Nachum
 * Dershowitz.
 */
var GREGORIAN_EPOCH = 1721425.5;
var ISLAMIC_EPOCH = 1948439.5;
var NgbCalendarIslamicCivil = (function (_super) {
    __extends(NgbCalendarIslamicCivil, _super);
    function NgbCalendarIslamicCivil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
     * `gdate` is a JS Date to be converted to Hijri.
     * @param {?} gdate
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.fromGregorian = function (gdate) {
        var /** @type {?} */ date = new Date(gdate);
        var /** @type {?} */ gYear = date.getFullYear(), /** @type {?} */ gMonth = date.getMonth(), /** @type {?} */ gDay = date.getDate();
        var /** @type {?} */ julianDay = GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
            -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
            Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear(date) ? -1 : -2) + gDay);
        julianDay = Math.floor(julianDay) + 0.5;
        var /** @type {?} */ days = julianDay - ISLAMIC_EPOCH;
        var /** @type {?} */ hYear = Math.floor((30 * days + 10646) / 10631.0);
        var /** @type {?} */ hMonth = Math.ceil((days - 29 - this._getYearStart(hYear)) / 29.5);
        hMonth = Math.min(hMonth, 11);
        var /** @type {?} */ hDay = Math.ceil(days - this._getMonthStart(hYear, hMonth)) + 1;
        return new NgbDate(hYear, hMonth + 1, hDay);
    };
    /**
     * Returns the equivalent JS date value for a give input islamic(civil) date.
     * `hijriDate` is an islamic(civil) date to be converted to Gregorian.
     * @param {?} hijriDate
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.toGregorian = function (hijriDate) {
        var /** @type {?} */ hYear = hijriDate.year;
        var /** @type {?} */ hMonth = hijriDate.month - 1;
        var /** @type {?} */ hDate = hijriDate.day;
        var /** @type {?} */ julianDay = hDate + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) + ISLAMIC_EPOCH - 1;
        var /** @type {?} */ wjd = Math.floor(julianDay - 0.5) + 0.5, /** @type {?} */ depoch = wjd - GREGORIAN_EPOCH, /** @type {?} */ quadricent = Math.floor(depoch / 146097), /** @type {?} */ dqc = mod(depoch, 146097), /** @type {?} */ cent = Math.floor(dqc / 36524), /** @type {?} */ dcent = mod(dqc, 36524), /** @type {?} */ quad = Math.floor(dcent / 1461), /** @type {?} */ dquad = mod(dcent, 1461), /** @type {?} */ yindex = Math.floor(dquad / 365);
        var /** @type {?} */ year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
        if (!(cent === 4 || yindex === 4)) {
            year++;
        }
        var /** @type {?} */ gYearStart = GREGORIAN_EPOCH + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400);
        var /** @type {?} */ yearday = wjd - gYearStart;
        var /** @type {?} */ tjd = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) + Math.floor(739 / 12 + (isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);
        var /** @type {?} */ leapadj = wjd < tjd ? 0 : isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;
        var /** @type {?} */ month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
        var /** @type {?} */ tjd2 = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) +
            Math.floor((367 * month - 362) / 12 + (month <= 2 ? 0 : isGregorianLeapYear(new Date(year, month - 1, 1)) ? -1 : -2) +
                1);
        var /** @type {?} */ day = wjd - tjd2 + 1;
        return new Date(year, month - 1, day);
    };
    /**
     * Returns the number of days in a specific Hijri month.
     * `month` is 1 for Muharram, 2 for Safar, etc.
     * `year` is any Hijri year.
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.getDaysInIslamicMonth = function (month, year) {
        year = year + Math.floor(month / 13);
        month = ((month - 1) % 12) + 1;
        var /** @type {?} */ length = 29 + month % 2;
        if (month === 12 && this._isIslamicLeapYear(year)) {
            length++;
        }
        return length;
    };
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.getNext = function (date, period, number) {
        if (period === void 0) { period = 'd'; }
        if (number === void 0) { number = 1; }
        date = NgbDate.from(date);
        switch (period) {
            case 'y':
                date = this.setYear(date, date.year + number);
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = this.setMonth(date, date.month + number);
                date.day = 1;
                return date;
            case 'd':
                return this.setDay(date, date.day + number);
            default:
                return date;
        }
    };
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.getPrev = function (date, period, number) {
        if (period === void 0) { period = 'd'; }
        if (number === void 0) { number = 1; }
        return this.getNext(date, period, -number);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.getWeekday = function (date) {
        var /** @type {?} */ day = this.toGregorian(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    };
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.getWeekNumber = function (week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        var /** @type {?} */ thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        var /** @type {?} */ date = week[thursdayIndex];
        var /** @type {?} */ jsDate = this.toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        var /** @type {?} */ time = jsDate.getTime();
        var /** @type {?} */ MuhDate = this.toGregorian(new NgbDate(date.year, 1, 1)); // Compare with Muharram 1
        return Math.floor(Math.round((time - MuhDate.getTime()) / 86400000) / 7) + 1;
    };
    /**
     * @return {?}
     */
    NgbCalendarIslamicCivil.prototype.getToday = function () { return this.fromGregorian(new Date()); };
    return NgbCalendarIslamicCivil;
}(NgbCalendarHijri));
NgbCalendarIslamicCivil.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbCalendarIslamicCivil.ctorParameters = function () { return []; };
var NgbDatepickerModule = (function () {
    function NgbDatepickerModule() {
    }
    /**
     * @return {?}
     */
    NgbDatepickerModule.forRoot = function () {
        return {
            ngModule: NgbDatepickerModule,
            providers: [
                { provide: NgbCalendar, useClass: NgbCalendarGregorian },
                { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault },
                { provide: NgbDateParserFormatter, useClass: NgbDateISOParserFormatter }, NgbDatepickerConfig
            ]
        };
    };
    return NgbDatepickerModule;
}());
NgbDatepickerModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                declarations: [
                    NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView,
                    NgbInputDatepicker
                ],
                exports: [NgbDatepicker, NgbInputDatepicker],
                imports: [_angular_common.CommonModule, _angular_forms.FormsModule],
                entryComponents: [NgbDatepicker]
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbDropdown directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
var NgbDropdownConfig = (function () {
    function NgbDropdownConfig() {
        this.up = false;
        this.autoClose = true;
    }
    return NgbDropdownConfig;
}());
NgbDropdownConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbDropdownConfig.ctorParameters = function () { return []; };
/**
 * Transforms a node into a dropdown.
 */
var NgbDropdown = (function () {
    /**
     * @param {?} config
     */
    function NgbDropdown(config) {
        /**
         *  Defines whether or not the dropdown-menu is open initially.
         */
        this._open = false;
        /**
         *  An event fired when the dropdown is opened or closed.
         *  Event's payload equals whether dropdown is open.
         */
        this.openChange = new _angular_core.EventEmitter();
        this.up = config.up;
        this.autoClose = config.autoClose;
    }
    /**
     * Checks if the dropdown menu is open or not.
     * @return {?}
     */
    NgbDropdown.prototype.isOpen = function () { return this._open; };
    /**
     * Opens the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    NgbDropdown.prototype.open = function () {
        if (!this._open) {
            this._open = true;
            this.openChange.emit(true);
        }
    };
    /**
     * Closes the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    NgbDropdown.prototype.close = function () {
        if (this._open) {
            this._open = false;
            this.openChange.emit(false);
        }
    };
    /**
     * Toggles the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    NgbDropdown.prototype.toggle = function () {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    NgbDropdown.prototype.closeFromOutsideClick = function ($event) {
        if (this.autoClose && $event.button !== 2 && !this._isEventFromToggle($event)) {
            this.close();
        }
    };
    /**
     * @return {?}
     */
    NgbDropdown.prototype.closeFromOutsideEsc = function () {
        if (this.autoClose) {
            this.close();
        }
    };
    Object.defineProperty(NgbDropdown.prototype, "toggleElement", {
        /**
         * \@internal
         * @param {?} toggleElement
         * @return {?}
         */
        set: function (toggleElement) { this._toggleElement = toggleElement; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} $event
     * @return {?}
     */
    NgbDropdown.prototype._isEventFromToggle = function ($event) { return !!this._toggleElement && this._toggleElement.contains($event.target); };
    return NgbDropdown;
}());
NgbDropdown.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[ngbDropdown]',
                exportAs: 'ngbDropdown',
                host: {
                    '[class.dropdown]': '!up',
                    '[class.dropup]': 'up',
                    '[class.show]': 'isOpen()',
                    '(keyup.esc)': 'closeFromOutsideEsc()',
                    '(document:click)': 'closeFromOutsideClick($event)'
                }
            },] },
];
/**
 * @nocollapse
 */
NgbDropdown.ctorParameters = function () { return [
    { type: NgbDropdownConfig, },
]; };
NgbDropdown.propDecorators = {
    'up': [{ type: _angular_core.Input },],
    'autoClose': [{ type: _angular_core.Input },],
    '_open': [{ type: _angular_core.Input, args: ['open',] },],
    'openChange': [{ type: _angular_core.Output },],
};
/**
 * Allows the dropdown to be toggled via click. This directive is optional.
 */
var NgbDropdownToggle = (function () {
    /**
     * @param {?} dropdown
     * @param {?} elementRef
     */
    function NgbDropdownToggle(dropdown, elementRef) {
        this.dropdown = dropdown;
        dropdown.toggleElement = elementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    NgbDropdownToggle.prototype.toggleOpen = function () { this.dropdown.toggle(); };
    return NgbDropdownToggle;
}());
NgbDropdownToggle.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[ngbDropdownToggle]',
                host: {
                    'class': 'dropdown-toggle',
                    'aria-haspopup': 'true',
                    '[attr.aria-expanded]': 'dropdown.isOpen()',
                    '(click)': 'toggleOpen()'
                }
            },] },
];
/**
 * @nocollapse
 */
NgbDropdownToggle.ctorParameters = function () { return [
    { type: NgbDropdown, },
    { type: _angular_core.ElementRef, },
]; };
var NGB_DROPDOWN_DIRECTIVES = [NgbDropdownToggle, NgbDropdown];
var NgbDropdownModule = (function () {
    function NgbDropdownModule() {
    }
    /**
     * @return {?}
     */
    NgbDropdownModule.forRoot = function () { return { ngModule: NgbDropdownModule, providers: [NgbDropdownConfig] }; };
    return NgbDropdownModule;
}());
NgbDropdownModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES },] },
];
/**
 * @nocollapse
 */
NgbDropdownModule.ctorParameters = function () { return []; };
var NgbModalBackdrop = (function () {
    function NgbModalBackdrop() {
    }
    return NgbModalBackdrop;
}());
NgbModalBackdrop.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'ngb-modal-backdrop', template: '', host: { 'class': 'modal-backdrop fade show' } },] },
];
/**
 * @nocollapse
 */
NgbModalBackdrop.ctorParameters = function () { return []; };
var ModalDismissReasons = {};
ModalDismissReasons.BACKDROP_CLICK = 0;
ModalDismissReasons.ESC = 1;
ModalDismissReasons[ModalDismissReasons.BACKDROP_CLICK] = "BACKDROP_CLICK";
ModalDismissReasons[ModalDismissReasons.ESC] = "ESC";
var NgbModalWindow = (function () {
    /**
     * @param {?} _elRef
     * @param {?} _renderer
     */
    function NgbModalWindow(_elRef, _renderer) {
        this._elRef = _elRef;
        this._renderer = _renderer;
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new _angular_core.EventEmitter();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    NgbModalWindow.prototype.backdropClick = function ($event) {
        if (this.backdrop === true && this._elRef.nativeElement === $event.target) {
            this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    NgbModalWindow.prototype.escKey = function ($event) {
        if (this.keyboard && !$event.defaultPrevented) {
            this.dismiss(ModalDismissReasons.ESC);
        }
    };
    /**
     * @param {?} reason
     * @return {?}
     */
    NgbModalWindow.prototype.dismiss = function (reason) { this.dismissEvent.emit(reason); };
    /**
     * @return {?}
     */
    NgbModalWindow.prototype.ngOnInit = function () {
        this._elWithFocus = document.activeElement;
        this._renderer.addClass(document.body, 'modal-open');
    };
    /**
     * @return {?}
     */
    NgbModalWindow.prototype.ngAfterViewInit = function () {
        if (!this._elRef.nativeElement.contains(document.activeElement)) {
            this._elRef.nativeElement['focus'].apply(this._elRef.nativeElement, []);
        }
    };
    /**
     * @return {?}
     */
    NgbModalWindow.prototype.ngOnDestroy = function () {
        if (this._elWithFocus && document.body.contains(this._elWithFocus)) {
            this._elWithFocus['focus'].apply(this._elWithFocus, []);
        }
        else {
            document.body['focus'].apply(document.body, []);
        }
        this._elWithFocus = null;
        this._renderer.removeClass(document.body, 'modal-open');
    };
    return NgbModalWindow;
}());
NgbModalWindow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-modal-window',
                host: {
                    '[class]': '"modal fade show" + (windowClass ? " " + windowClass : "")',
                    'role': 'dialog',
                    'tabindex': '-1',
                    'style': 'display: block;',
                    '(keyup.esc)': 'escKey($event)',
                    '(click)': 'backdropClick($event)'
                },
                template: "\n    <div [class]=\"'modal-dialog' + (size ? ' modal-' + size : '')\" role=\"document\">\n        <div class=\"modal-content\"><ng-content></ng-content></div>\n    </div>\n    "
            },] },
];
/**
 * @nocollapse
 */
NgbModalWindow.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
NgbModalWindow.propDecorators = {
    'backdrop': [{ type: _angular_core.Input },],
    'keyboard': [{ type: _angular_core.Input },],
    'size': [{ type: _angular_core.Input },],
    'windowClass': [{ type: _angular_core.Input },],
    'dismissEvent': [{ type: _angular_core.Output, args: ['dismiss',] },],
};
var ContentRef = (function () {
    /**
     * @param {?} nodes
     * @param {?=} viewRef
     * @param {?=} componentRef
     */
    function ContentRef(nodes, viewRef, componentRef) {
        this.nodes = nodes;
        this.viewRef = viewRef;
        this.componentRef = componentRef;
    }
    return ContentRef;
}());
var PopupService = (function () {
    /**
     * @param {?} type
     * @param {?} _injector
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} componentFactoryResolver
     */
    function PopupService(type, _injector, _viewContainerRef, _renderer, componentFactoryResolver) {
        this._injector = _injector;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._windowFactory = componentFactoryResolver.resolveComponentFactory(type);
    }
    /**
     * @param {?=} content
     * @param {?=} context
     * @return {?}
     */
    PopupService.prototype.open = function (content, context) {
        if (!this._windowRef) {
            this._contentRef = this._getContentRef(content, context);
            this._windowRef =
                this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, this._contentRef.nodes);
        }
        return this._windowRef;
    };
    /**
     * @return {?}
     */
    PopupService.prototype.close = function () {
        if (this._windowRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
            this._windowRef = null;
            if (this._contentRef.viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
                this._contentRef = null;
            }
        }
    };
    /**
     * @param {?} content
     * @param {?=} context
     * @return {?}
     */
    PopupService.prototype._getContentRef = function (content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof _angular_core.TemplateRef) {
            var /** @type {?} */ viewRef = this._viewContainerRef.createEmbeddedView(/** @type {?} */ (content), context);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else {
            return new ContentRef([[this._renderer.createText("" + content)]]);
        }
    };
    return PopupService;
}());
/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
var NgbActiveModal = (function () {
    function NgbActiveModal() {
    }
    /**
     * Can be used to close a modal, passing an optional result.
     * @param {?=} result
     * @return {?}
     */
    NgbActiveModal.prototype.close = function (result) { };
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     * @param {?=} reason
     * @return {?}
     */
    NgbActiveModal.prototype.dismiss = function (reason) { };
    return NgbActiveModal;
}());
NgbActiveModal.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbActiveModal.ctorParameters = function () { return []; };
/**
 * A reference to a newly opened modal.
 */
var NgbModalRef = (function () {
    /**
     * @param {?} _windowCmptRef
     * @param {?} _contentRef
     * @param {?=} _backdropCmptRef
     */
    function NgbModalRef(_windowCmptRef, _contentRef, _backdropCmptRef) {
        var _this = this;
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        _windowCmptRef.instance.dismissEvent.subscribe(function (reason) { _this.dismiss(reason); });
        this.result = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this.result.then(null, function () { });
    }
    Object.defineProperty(NgbModalRef.prototype, "componentInstance", {
        /**
         * The instance of component used as modal's content.
         * Undefined when a TemplateRef is used as modal's content.
         * @return {?}
         */
        get: function () {
            if (this._contentRef.componentRef) {
                return this._contentRef.componentRef.instance;
            }
        },
        /**
         * @param {?} instance
         * @return {?}
         */
        set: function (instance) { },
        enumerable: true,
        configurable: true
    });
    /**
     * Can be used to close a modal, passing an optional result.
     * @param {?=} result
     * @return {?}
     */
    NgbModalRef.prototype.close = function (result) {
        if (this._windowCmptRef) {
            this._resolve(result);
            this._removeModalElements();
        }
    };
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     * @param {?=} reason
     * @return {?}
     */
    NgbModalRef.prototype.dismiss = function (reason) {
        if (this._windowCmptRef) {
            this._reject(reason);
            this._removeModalElements();
        }
    };
    /**
     * @return {?}
     */
    NgbModalRef.prototype._removeModalElements = function () {
        var /** @type {?} */ windowNativeEl = this._windowCmptRef.location.nativeElement;
        windowNativeEl.parentNode.removeChild(windowNativeEl);
        this._windowCmptRef.destroy();
        if (this._backdropCmptRef) {
            var /** @type {?} */ backdropNativeEl = this._backdropCmptRef.location.nativeElement;
            backdropNativeEl.parentNode.removeChild(backdropNativeEl);
            this._backdropCmptRef.destroy();
        }
        if (this._contentRef && this._contentRef.viewRef) {
            this._contentRef.viewRef.destroy();
        }
        this._windowCmptRef = null;
        this._backdropCmptRef = null;
        this._contentRef = null;
    };
    return NgbModalRef;
}());
NgbModalRef.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbModalRef.ctorParameters = function () { return [
    { type: _angular_core.ComponentRef, },
    { type: ContentRef, },
    { type: _angular_core.ComponentRef, },
]; };
var NgbModalStack = (function () {
    /**
     * @param {?} _applicationRef
     * @param {?} _injector
     * @param {?} _componentFactoryResolver
     */
    function NgbModalStack(_applicationRef, _injector, _componentFactoryResolver) {
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._backdropFactory = _componentFactoryResolver.resolveComponentFactory(NgbModalBackdrop);
        this._windowFactory = _componentFactoryResolver.resolveComponentFactory(NgbModalWindow);
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} options
     * @return {?}
     */
    NgbModalStack.prototype.open = function (moduleCFR, contentInjector, content, options) {
        var /** @type {?} */ containerSelector = options.container || 'body';
        var /** @type {?} */ containerEl = document.querySelector(containerSelector);
        if (!containerEl) {
            throw new Error("The specified modal container \"" + containerSelector + "\" was not found in the DOM.");
        }
        var /** @type {?} */ activeModal = new NgbActiveModal();
        var /** @type {?} */ contentRef = this._getContentRef(moduleCFR, contentInjector, content, activeModal);
        var /** @type {?} */ windowCmptRef;
        var /** @type {?} */ backdropCmptRef;
        var /** @type {?} */ ngbModalRef;
        if (options.backdrop !== false) {
            backdropCmptRef = this._backdropFactory.create(this._injector);
            this._applicationRef.attachView(backdropCmptRef.hostView);
            containerEl.appendChild(backdropCmptRef.location.nativeElement);
        }
        windowCmptRef = this._windowFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef);
        activeModal.close = function (result) { ngbModalRef.close(result); };
        activeModal.dismiss = function (reason) { ngbModalRef.dismiss(reason); };
        this._applyWindowOptions(windowCmptRef.instance, options);
        return ngbModalRef;
    };
    /**
     * @param {?} windowInstance
     * @param {?} options
     * @return {?}
     */
    NgbModalStack.prototype._applyWindowOptions = function (windowInstance, options) {
        ['backdrop', 'keyboard', 'size', 'windowClass'].forEach(function (optionName) {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    };
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} context
     * @return {?}
     */
    NgbModalStack.prototype._getContentRef = function (moduleCFR, contentInjector, content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof _angular_core.TemplateRef) {
            var /** @type {?} */ viewRef = content.createEmbeddedView(context);
            this._applicationRef.attachView(viewRef);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else if (isString(content)) {
            return new ContentRef([[document.createTextNode("" + content)]]);
        }
        else {
            var /** @type {?} */ contentCmptFactory = moduleCFR.resolveComponentFactory(content);
            var /** @type {?} */ modalContentInjector = _angular_core.ReflectiveInjector.resolveAndCreate([{ provide: NgbActiveModal, useValue: context }], contentInjector);
            var /** @type {?} */ componentRef = contentCmptFactory.create(modalContentInjector);
            this._applicationRef.attachView(componentRef.hostView);
            return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
        }
    };
    return NgbModalStack;
}());
NgbModalStack.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbModalStack.ctorParameters = function () { return [
    { type: _angular_core.ApplicationRef, },
    { type: _angular_core.Injector, },
    { type: _angular_core.ComponentFactoryResolver, },
]; };
/**
 * A service to open modal windows. Creating a modal is straightforward: create a template and pass it as an argument to
 * the "open" method!
 */
var NgbModal = (function () {
    /**
     * @param {?} _moduleCFR
     * @param {?} _injector
     * @param {?} _modalStack
     */
    function NgbModal(_moduleCFR, _injector, _modalStack) {
        this._moduleCFR = _moduleCFR;
        this._injector = _injector;
        this._modalStack = _modalStack;
    }
    /**
     * Opens a new modal window with the specified content and using supplied options. Content can be provided
     * as a TemplateRef or a component type. If you pass a component type as content than instances of those
     * components can be injected with an instance of the NgbActiveModal class. You can use methods on the
     * NgbActiveModal class to close / dismiss modals from "inside" of a component.
     * @param {?} content
     * @param {?=} options
     * @return {?}
     */
    NgbModal.prototype.open = function (content, options) {
        if (options === void 0) { options = {}; }
        return this._modalStack.open(this._moduleCFR, this._injector, content, options);
    };
    return NgbModal;
}());
NgbModal.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbModal.ctorParameters = function () { return [
    { type: _angular_core.ComponentFactoryResolver, },
    { type: _angular_core.Injector, },
    { type: NgbModalStack, },
]; };
var NgbModalModule = (function () {
    function NgbModalModule() {
    }
    /**
     * @return {?}
     */
    NgbModalModule.forRoot = function () { return { ngModule: NgbModalModule, providers: [NgbModal, NgbModalStack] }; };
    return NgbModalModule;
}());
NgbModalModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                declarations: [NgbModalBackdrop, NgbModalWindow],
                entryComponents: [NgbModalBackdrop, NgbModalWindow],
                providers: [NgbModal]
            },] },
];
/**
 * @nocollapse
 */
NgbModalModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbPagination component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
var NgbPaginationConfig = (function () {
    function NgbPaginationConfig() {
        this.disabled = false;
        this.boundaryLinks = false;
        this.directionLinks = true;
        this.ellipses = true;
        this.maxSize = 0;
        this.pageSize = 10;
        this.rotate = false;
    }
    return NgbPaginationConfig;
}());
NgbPaginationConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbPaginationConfig.ctorParameters = function () { return []; };
/**
 * A directive that will take care of visualising a pagination bar and enable / disable buttons correctly!
 */
var NgbPagination = (function () {
    /**
     * @param {?} config
     */
    function NgbPagination(config) {
        this.pageCount = 0;
        this.pages = [];
        /**
         *  Current page.
         */
        this.page = 0;
        /**
         *  An event fired when the page is changed.
         *  Event's payload equals to the newly selected page.
         */
        this.pageChange = new _angular_core.EventEmitter(true);
        this.disabled = config.disabled;
        this.boundaryLinks = config.boundaryLinks;
        this.directionLinks = config.directionLinks;
        this.ellipses = config.ellipses;
        this.maxSize = config.maxSize;
        this.pageSize = config.pageSize;
        this.rotate = config.rotate;
        this.size = config.size;
    }
    /**
     * @return {?}
     */
    NgbPagination.prototype.hasPrevious = function () { return this.page > 1; };
    /**
     * @return {?}
     */
    NgbPagination.prototype.hasNext = function () { return this.page < this.pageCount; };
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    NgbPagination.prototype.selectPage = function (pageNumber) { this._updatePages(pageNumber); };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbPagination.prototype.ngOnChanges = function (changes) { this._updatePages(this.page); };
    /**
     * \@internal
     * @param {?} pageNumber
     * @return {?}
     */
    NgbPagination.prototype.isEllipsis = function (pageNumber) { return pageNumber === -1; };
    /**
     * Appends ellipses and first/last page number to the displayed pages
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    NgbPagination.prototype._applyEllipses = function (start, end) {
        if (this.ellipses) {
            if (start > 0) {
                if (start > 1) {
                    this.pages.unshift(-1);
                }
                this.pages.unshift(1);
            }
            if (end < this.pageCount) {
                if (end < (this.pageCount - 1)) {
                    this.pages.push(-1);
                }
                this.pages.push(this.pageCount);
            }
        }
    };
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     * @return {?}
     */
    NgbPagination.prototype._applyRotation = function () {
        var /** @type {?} */ start = 0;
        var /** @type {?} */ end = this.pageCount;
        var /** @type {?} */ leftOffset = Math.floor(this.maxSize / 2);
        var /** @type {?} */ rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;
        if (this.page <= leftOffset) {
            // very beginning, no rotation -> [0..maxSize]
            end = this.maxSize;
        }
        else if (this.pageCount - this.page < leftOffset) {
            // very end, no rotation -> [len-maxSize..len]
            start = this.pageCount - this.maxSize;
        }
        else {
            // rotate
            start = this.page - leftOffset - 1;
            end = this.page + rightOffset;
        }
        return [start, end];
    };
    /**
     * Paginates page numbers based on maxSize items per page
     * @return {?}
     */
    NgbPagination.prototype._applyPagination = function () {
        var /** @type {?} */ page = Math.ceil(this.page / this.maxSize) - 1;
        var /** @type {?} */ start = page * this.maxSize;
        var /** @type {?} */ end = start + this.maxSize;
        return [start, end];
    };
    /**
     * @param {?} newPageNo
     * @return {?}
     */
    NgbPagination.prototype._setPageInRange = function (newPageNo) {
        var /** @type {?} */ prevPageNo = this.page;
        this.page = getValueInRange(newPageNo, this.pageCount, 1);
        if (this.page !== prevPageNo) {
            this.pageChange.emit(this.page);
        }
    };
    /**
     * @param {?} newPage
     * @return {?}
     */
    NgbPagination.prototype._updatePages = function (newPage) {
        this.pageCount = Math.ceil(this.collectionSize / this.pageSize);
        if (!isNumber(this.pageCount)) {
            this.pageCount = 0;
        }
        // fill-in model needed to render pages
        this.pages.length = 0;
        for (var /** @type {?} */ i = 1; i <= this.pageCount; i++) {
            this.pages.push(i);
        }
        // set page within 1..max range
        this._setPageInRange(newPage);
        // apply maxSize if necessary
        if (this.maxSize > 0 && this.pageCount > this.maxSize) {
            var /** @type {?} */ start = 0;
            var /** @type {?} */ end = this.pageCount;
            // either paginating or rotating page numbers
            if (this.rotate) {
                _a = this._applyRotation(), start = _a[0], end = _a[1];
            }
            else {
                _b = this._applyPagination(), start = _b[0], end = _b[1];
            }
            this.pages = this.pages.slice(start, end);
            // adding ellipses
            this._applyEllipses(start, end);
        }
        var _a, _b;
    };
    return NgbPagination;
}());
NgbPagination.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-pagination',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: { 'role': 'navigation' },
                template: "\n    <ul [class]=\"'pagination' + (size ? ' pagination-' + size : '')\">\n      <li *ngIf=\"boundaryLinks\" class=\"page-item\"\n        [class.disabled]=\"!hasPrevious() || disabled\">\n        <a aria-label=\"First\" class=\"page-link\" href (click)=\"!!selectPage(1)\" [attr.tabindex]=\"(hasPrevious() ? null : '-1')\">\n          <span aria-hidden=\"true\">&laquo;&laquo;</span>\n        </a>\n      </li>\n\n      <li *ngIf=\"directionLinks\" class=\"page-item\"\n        [class.disabled]=\"!hasPrevious() || disabled\">\n        <a aria-label=\"Previous\" class=\"page-link\" href (click)=\"!!selectPage(page-1)\" [attr.tabindex]=\"(hasPrevious() ? null : '-1')\">\n          <span aria-hidden=\"true\">&laquo;</span>\n        </a>\n      </li>\n      <li *ngFor=\"let pageNumber of pages\" class=\"page-item\" [class.active]=\"pageNumber === page\"\n        [class.disabled]=\"isEllipsis(pageNumber) || disabled\">\n        <a *ngIf=\"isEllipsis(pageNumber)\" class=\"page-link\">...</a>\n        <a *ngIf=\"!isEllipsis(pageNumber)\" class=\"page-link\" href (click)=\"!!selectPage(pageNumber)\">\n          {{pageNumber}}\n          <span *ngIf=\"pageNumber === page\" class=\"sr-only\">(current)</span>\n        </a>\n      </li>\n      <li *ngIf=\"directionLinks\" class=\"page-item\" [class.disabled]=\"!hasNext() || disabled\">\n        <a aria-label=\"Next\" class=\"page-link\" href (click)=\"!!selectPage(page+1)\" [attr.tabindex]=\"(hasNext() ? null : '-1')\">\n          <span aria-hidden=\"true\">&raquo;</span>\n        </a>\n      </li>\n\n      <li *ngIf=\"boundaryLinks\" class=\"page-item\" [class.disabled]=\"!hasNext() || disabled\">\n        <a aria-label=\"Last\" class=\"page-link\" href (click)=\"!!selectPage(pageCount)\" [attr.tabindex]=\"(hasNext() ? null : '-1')\">\n          <span aria-hidden=\"true\">&raquo;&raquo;</span>\n        </a>\n      </li>\n    </ul>\n  "
            },] },
];
/**
 * @nocollapse
 */
NgbPagination.ctorParameters = function () { return [
    { type: NgbPaginationConfig, },
]; };
NgbPagination.propDecorators = {
    'disabled': [{ type: _angular_core.Input },],
    'boundaryLinks': [{ type: _angular_core.Input },],
    'directionLinks': [{ type: _angular_core.Input },],
    'ellipses': [{ type: _angular_core.Input },],
    'rotate': [{ type: _angular_core.Input },],
    'collectionSize': [{ type: _angular_core.Input },],
    'maxSize': [{ type: _angular_core.Input },],
    'page': [{ type: _angular_core.Input },],
    'pageSize': [{ type: _angular_core.Input },],
    'pageChange': [{ type: _angular_core.Output },],
    'size': [{ type: _angular_core.Input },],
};
var NgbPaginationModule = (function () {
    function NgbPaginationModule() {
    }
    /**
     * @return {?}
     */
    NgbPaginationModule.forRoot = function () { return { ngModule: NgbPaginationModule, providers: [NgbPaginationConfig] }; };
    return NgbPaginationModule;
}());
NgbPaginationModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbPagination], exports: [NgbPagination], imports: [_angular_common.CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbPaginationModule.ctorParameters = function () { return []; };
var Trigger = (function () {
    /**
     * @param {?} open
     * @param {?=} close
     */
    function Trigger(open, close) {
        this.open = open;
        this.close = close;
        if (!close) {
            this.close = open;
        }
    }
    /**
     * @return {?}
     */
    Trigger.prototype.isManual = function () { return this.open === 'manual' || this.close === 'manual'; };
    return Trigger;
}());
var DEFAULT_ALIASES = {
    'hover': ['mouseenter', 'mouseleave']
};
/**
 * @param {?} triggers
 * @param {?=} aliases
 * @return {?}
 */
function parseTriggers(triggers, aliases) {
    if (aliases === void 0) { aliases = DEFAULT_ALIASES; }
    var /** @type {?} */ trimmedTriggers = (triggers || '').trim();
    if (trimmedTriggers.length === 0) {
        return [];
    }
    var /** @type {?} */ parsedTriggers = trimmedTriggers.split(/\s+/).map(function (trigger) { return trigger.split(':'); }).map(function (triggerPair) {
        var /** @type {?} */ alias = aliases[triggerPair[0]] || triggerPair;
        return new Trigger(alias[0], alias[1]);
    });
    var /** @type {?} */ manualTriggers = parsedTriggers.filter(function (triggerPair) { return triggerPair.isManual(); });
    if (manualTriggers.length > 1) {
        throw 'Triggers parse error: only one manual trigger is allowed';
    }
    if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
        throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
    }
    return parsedTriggers;
}
var noopFn = function () { };
/**
 * @param {?} renderer
 * @param {?} nativeElement
 * @param {?} triggers
 * @param {?} openFn
 * @param {?} closeFn
 * @param {?} toggleFn
 * @return {?}
 */
function listenToTriggers(renderer, nativeElement, triggers, openFn, closeFn, toggleFn) {
    var /** @type {?} */ parsedTriggers = parseTriggers(triggers);
    var /** @type {?} */ listeners = [];
    if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
        return noopFn;
    }
    parsedTriggers.forEach(function (trigger) {
        if (trigger.open === trigger.close) {
            listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
        }
        else {
            listeners.push(renderer.listen(nativeElement, trigger.open, openFn), renderer.listen(nativeElement, trigger.close, closeFn));
        }
    });
    return function () { listeners.forEach(function (unsubscribeFn) { return unsubscribeFn(); }); };
}
/**
 * Configuration service for the NgbPopover directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
var NgbPopoverConfig = (function () {
    function NgbPopoverConfig() {
        this.placement = 'top';
        this.triggers = 'click';
    }
    return NgbPopoverConfig;
}());
NgbPopoverConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbPopoverConfig.ctorParameters = function () { return []; };
var nextId$2 = 0;
var NgbPopoverWindow = (function () {
    function NgbPopoverWindow() {
        this.placement = 'top';
    }
    return NgbPopoverWindow;
}());
NgbPopoverWindow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-popover-window',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: { '[class]': '"popover show popover-" + placement', 'role': 'tooltip', '[id]': 'id' },
                template: "\n    <h3 class=\"popover-title\">{{title}}</h3><div class=\"popover-content\"><ng-content></ng-content></div>\n    "
            },] },
];
/**
 * @nocollapse
 */
NgbPopoverWindow.ctorParameters = function () { return []; };
NgbPopoverWindow.propDecorators = {
    'placement': [{ type: _angular_core.Input },],
    'title': [{ type: _angular_core.Input },],
    'id': [{ type: _angular_core.Input },],
};
/**
 * A lightweight, extensible directive for fancy popover creation.
 */
var NgbPopover = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} ngZone
     */
    function NgbPopover(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, ngZone) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /**
         * Emits an event when the popover is shown
         */
        this.shown = new _angular_core.EventEmitter();
        /**
         * Emits an event when the popover is hidden
         */
        this.hidden = new _angular_core.EventEmitter();
        this._ngbPopoverWindowId = "ngb-popover-" + nextId$2++;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this._popupService = new PopupService(NgbPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(function () {
            if (_this._windowRef) {
                positionElements(_this._elementRef.nativeElement, _this._windowRef.location.nativeElement, _this.placement, _this.container === 'body');
            }
        });
    }
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of the popover.
     * The context is an optional value to be injected into the popover template when it is created.
     * @param {?=} context
     * @return {?}
     */
    NgbPopover.prototype.open = function (context) {
        if (!this._windowRef) {
            this._windowRef = this._popupService.open(this.ngbPopover, context);
            this._windowRef.instance.placement = this.placement;
            this._windowRef.instance.title = this.popoverTitle;
            this._windowRef.instance.id = this._ngbPopoverWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbPopoverWindowId);
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // position popover along the element
            positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body');
            // we need to manually invoke change detection since events registered via
            // Renderer::listen() are not picked up by change detection with the OnPush strategy
            this._windowRef.changeDetectorRef.markForCheck();
            this.shown.emit();
        }
    };
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    NgbPopover.prototype.close = function () {
        if (this._windowRef) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    };
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    NgbPopover.prototype.toggle = function () {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * Returns whether or not the popover is currently being shown
     * @return {?}
     */
    NgbPopover.prototype.isOpen = function () { return this._windowRef != null; };
    /**
     * @return {?}
     */
    NgbPopover.prototype.ngOnInit = function () {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    };
    /**
     * @return {?}
     */
    NgbPopover.prototype.ngOnDestroy = function () {
        this.close();
        this._unregisterListenersFn();
        this._zoneSubscription.unsubscribe();
    };
    return NgbPopover;
}());
NgbPopover.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[ngbPopover]', exportAs: 'ngbPopover' },] },
];
/**
 * @nocollapse
 */
NgbPopover.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.Injector, },
    { type: _angular_core.ComponentFactoryResolver, },
    { type: _angular_core.ViewContainerRef, },
    { type: NgbPopoverConfig, },
    { type: _angular_core.NgZone, },
]; };
NgbPopover.propDecorators = {
    'ngbPopover': [{ type: _angular_core.Input },],
    'popoverTitle': [{ type: _angular_core.Input },],
    'placement': [{ type: _angular_core.Input },],
    'triggers': [{ type: _angular_core.Input },],
    'container': [{ type: _angular_core.Input },],
    'shown': [{ type: _angular_core.Output },],
    'hidden': [{ type: _angular_core.Output },],
};
var NgbPopoverModule = (function () {
    function NgbPopoverModule() {
    }
    /**
     * @return {?}
     */
    NgbPopoverModule.forRoot = function () { return { ngModule: NgbPopoverModule, providers: [NgbPopoverConfig] }; };
    return NgbPopoverModule;
}());
NgbPopoverModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbPopover, NgbPopoverWindow], exports: [NgbPopover], entryComponents: [NgbPopoverWindow] },] },
];
/**
 * @nocollapse
 */
NgbPopoverModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbProgressbar component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
var NgbProgressbarConfig = (function () {
    function NgbProgressbarConfig() {
        this.max = 100;
        this.animated = false;
        this.striped = false;
        this.showValue = false;
    }
    return NgbProgressbarConfig;
}());
NgbProgressbarConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbProgressbarConfig.ctorParameters = function () { return []; };
/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
var NgbProgressbar = (function () {
    /**
     * @param {?} config
     */
    function NgbProgressbar(config) {
        /**
         * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
         */
        this.value = 0;
        this.max = config.max;
        this.animated = config.animated;
        this.striped = config.striped;
        this.type = config.type;
        this.showValue = config.showValue;
    }
    /**
     * @return {?}
     */
    NgbProgressbar.prototype.getValue = function () { return getValueInRange(this.value, this.max); };
    /**
     * @return {?}
     */
    NgbProgressbar.prototype.getPercentValue = function () { return 100 * this.getValue() / this.max; };
    return NgbProgressbar;
}());
NgbProgressbar.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-progressbar',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                template: "\n    <div class=\"progress\">\n      <div class=\"progress-bar{{type ? ' bg-' + type : ''}}{{animated ? ' progress-bar-animated' : ''}}{{striped ?\n    ' progress-bar-striped' : ''}}\" role=\"progressbar\" [style.width.%]=\"getPercentValue()\"\n    [attr.aria-valuenow]=\"getValue()\" aria-valuemin=\"0\" [attr.aria-valuemax]=\"max\">\n        <span *ngIf=\"showValue\">{{getPercentValue()}}%</span><ng-content></ng-content>\n      </div>\n    </div>\n  "
            },] },
];
/**
 * @nocollapse
 */
NgbProgressbar.ctorParameters = function () { return [
    { type: NgbProgressbarConfig, },
]; };
NgbProgressbar.propDecorators = {
    'max': [{ type: _angular_core.Input },],
    'animated': [{ type: _angular_core.Input },],
    'striped': [{ type: _angular_core.Input },],
    'showValue': [{ type: _angular_core.Input },],
    'type': [{ type: _angular_core.Input },],
    'value': [{ type: _angular_core.Input },],
};
var NgbProgressbarModule = (function () {
    function NgbProgressbarModule() {
    }
    /**
     * @return {?}
     */
    NgbProgressbarModule.forRoot = function () { return { ngModule: NgbProgressbarModule, providers: [NgbProgressbarConfig] }; };
    return NgbProgressbarModule;
}());
NgbProgressbarModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbProgressbar], exports: [NgbProgressbar], imports: [_angular_common.CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbProgressbarModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbRating component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the ratings used in the application.
 */
var NgbRatingConfig = (function () {
    function NgbRatingConfig() {
        this.max = 10;
        this.readonly = false;
        this.resettable = false;
    }
    return NgbRatingConfig;
}());
NgbRatingConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbRatingConfig.ctorParameters = function () { return []; };
var Key = {};
Key.End = 35;
Key.Home = 36;
Key.ArrowLeft = 37;
Key.ArrowUp = 38;
Key.ArrowRight = 39;
Key.ArrowDown = 40;
Key[Key.End] = "End";
Key[Key.Home] = "Home";
Key[Key.ArrowLeft] = "ArrowLeft";
Key[Key.ArrowUp] = "ArrowUp";
Key[Key.ArrowRight] = "ArrowRight";
Key[Key.ArrowDown] = "ArrowDown";
var NGB_RATING_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return NgbRating; }),
    multi: true
};
/**
 * Rating directive that will take care of visualising a star rating bar.
 */
var NgbRating = (function () {
    /**
     * @param {?} config
     * @param {?} _changeDetectorRef
     */
    function NgbRating(config, _changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.contexts = [];
        this.disabled = false;
        /**
         * An event fired when a user is hovering over a given rating.
         * Event's payload equals to the rating being hovered over.
         */
        this.hover = new _angular_core.EventEmitter();
        /**
         * An event fired when a user stops hovering over a given rating.
         * Event's payload equals to the rating of the last item being hovered over.
         */
        this.leave = new _angular_core.EventEmitter();
        /**
         * An event fired when a user selects a new rating.
         * Event's payload equals to the newly selected rating.
         */
        this.rateChange = new _angular_core.EventEmitter(true);
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.max = config.max;
        this.readonly = config.readonly;
    }
    /**
     * @return {?}
     */
    NgbRating.prototype.ariaValueText = function () { return this.nextRate + " out of " + this.max; };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbRating.prototype.enter = function (value) {
        if (!this.readonly && !this.disabled) {
            this._updateState(value);
        }
        this.hover.emit(value);
    };
    /**
     * @return {?}
     */
    NgbRating.prototype.handleBlur = function () { this.onTouched(); };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbRating.prototype.handleClick = function (value) { this.update(this.resettable && this.rate === value ? 0 : value); };
    /**
     * @param {?} event
     * @return {?}
     */
    NgbRating.prototype.handleKeyDown = function (event) {
        if (Key[toString(event.which)]) {
            event.preventDefault();
            switch (event.which) {
                case Key.ArrowDown:
                case Key.ArrowLeft:
                    this.update(this.rate - 1);
                    break;
                case Key.ArrowUp:
                case Key.ArrowRight:
                    this.update(this.rate + 1);
                    break;
                case Key.Home:
                    this.update(0);
                    break;
                case Key.End:
                    this.update(this.max);
                    break;
            }
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbRating.prototype.ngOnChanges = function (changes) {
        if (changes['rate']) {
            this.update(this.rate);
        }
    };
    /**
     * @return {?}
     */
    NgbRating.prototype.ngOnInit = function () {
        this.contexts = Array.from({ length: this.max }, function () { return ({ fill: 0 }); });
        this._updateState(this.rate);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbRating.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbRating.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @return {?}
     */
    NgbRating.prototype.reset = function () {
        this.leave.emit(this.nextRate);
        this._updateState(this.rate);
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbRating.prototype.setDisabledState = function (isDisabled) { this.disabled = isDisabled; };
    /**
     * @param {?} value
     * @param {?=} internalChange
     * @return {?}
     */
    NgbRating.prototype.update = function (value, internalChange) {
        if (internalChange === void 0) { internalChange = true; }
        var /** @type {?} */ newRate = getValueInRange(value, this.max, 0);
        if (!this.readonly && !this.disabled && this.rate !== newRate) {
            this.rate = newRate;
            this.rateChange.emit(this.rate);
        }
        if (internalChange) {
            this.onChange(this.rate);
            this.onTouched();
        }
        this._updateState(this.rate);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbRating.prototype.writeValue = function (value) {
        this.update(value, false);
        this._changeDetectorRef.markForCheck();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    NgbRating.prototype._getFillValue = function (index) {
        var /** @type {?} */ diff = this.nextRate - index;
        if (diff >= 1) {
            return 100;
        }
        if (diff < 1 && diff > 0) {
            return Number.parseInt((diff * 100).toFixed(2));
        }
        return 0;
    };
    /**
     * @param {?} nextValue
     * @return {?}
     */
    NgbRating.prototype._updateState = function (nextValue) {
        var _this = this;
        this.nextRate = nextValue;
        this.contexts.forEach(function (context, index) { return context.fill = _this._getFillValue(index); });
    };
    return NgbRating;
}());
NgbRating.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-rating',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'd-inline-flex',
                    'tabindex': '0',
                    'role': 'slider',
                    'aria-valuemin': '0',
                    '[attr.aria-valuemax]': 'max',
                    '[attr.aria-valuenow]': 'nextRate',
                    '[attr.aria-valuetext]': 'ariaValueText()',
                    '[attr.aria-disabled]': 'readonly ? true : null',
                    '(blur)': 'handleBlur()',
                    '(keydown)': 'handleKeyDown($event)',
                    '(mouseleave)': 'reset()'
                },
                template: "\n    <ng-template #t let-fill=\"fill\">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>\n    <ng-template ngFor [ngForOf]=\"contexts\" let-index=\"index\">\n      <span class=\"sr-only\">({{ index < nextRate ? '*' : ' ' }})</span>\n      <span (mouseenter)=\"enter(index + 1)\" (click)=\"handleClick(index + 1)\" [style.cursor]=\"readonly || disabled ? 'default' : 'pointer'\">\n        <ng-template [ngTemplateOutlet]=\"starTemplate || t\" [ngOutletContext]=\"contexts[index]\"></ng-template>\n      </span>\n    </ng-template>\n  ",
                providers: [NGB_RATING_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
NgbRating.ctorParameters = function () { return [
    { type: NgbRatingConfig, },
    { type: _angular_core.ChangeDetectorRef, },
]; };
NgbRating.propDecorators = {
    'max': [{ type: _angular_core.Input },],
    'rate': [{ type: _angular_core.Input },],
    'readonly': [{ type: _angular_core.Input },],
    'resettable': [{ type: _angular_core.Input },],
    'starTemplate': [{ type: _angular_core.Input }, { type: _angular_core.ContentChild, args: [_angular_core.TemplateRef,] },],
    'hover': [{ type: _angular_core.Output },],
    'leave': [{ type: _angular_core.Output },],
    'rateChange': [{ type: _angular_core.Output },],
};
var NgbRatingModule = (function () {
    function NgbRatingModule() {
    }
    /**
     * @return {?}
     */
    NgbRatingModule.forRoot = function () { return { ngModule: NgbRatingModule, providers: [NgbRatingConfig] }; };
    return NgbRatingModule;
}());
NgbRatingModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbRating], exports: [NgbRating], imports: [_angular_common.CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbRatingModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbTabset component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tabsets used in the application.
 */
var NgbTabsetConfig = (function () {
    function NgbTabsetConfig() {
        this.justify = 'start';
        this.type = 'tabs';
    }
    return NgbTabsetConfig;
}());
NgbTabsetConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbTabsetConfig.ctorParameters = function () { return []; };
var nextId$3 = 0;
/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
var NgbTabTitle = (function () {
    /**
     * @param {?} templateRef
     */
    function NgbTabTitle(templateRef) {
        this.templateRef = templateRef;
    }
    return NgbTabTitle;
}());
NgbTabTitle.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'ng-template[ngbTabTitle]' },] },
];
/**
 * @nocollapse
 */
NgbTabTitle.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
]; };
/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
var NgbTabContent = (function () {
    /**
     * @param {?} templateRef
     */
    function NgbTabContent(templateRef) {
        this.templateRef = templateRef;
    }
    return NgbTabContent;
}());
NgbTabContent.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'ng-template[ngbTabContent]' },] },
];
/**
 * @nocollapse
 */
NgbTabContent.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
]; };
/**
 * A directive representing an individual tab.
 */
var NgbTab = (function () {
    function NgbTab() {
        /**
         * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
         */
        this.id = "ngb-tab-" + nextId$3++;
        /**
         * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
         */
        this.disabled = false;
    }
    return NgbTab;
}());
NgbTab.decorators = [
    { type: _angular_core.Directive, args: [{ selector: 'ngb-tab' },] },
];
/**
 * @nocollapse
 */
NgbTab.ctorParameters = function () { return []; };
NgbTab.propDecorators = {
    'id': [{ type: _angular_core.Input },],
    'title': [{ type: _angular_core.Input },],
    'disabled': [{ type: _angular_core.Input },],
    'contentTpl': [{ type: _angular_core.ContentChild, args: [NgbTabContent,] },],
    'titleTpl': [{ type: _angular_core.ContentChild, args: [NgbTabTitle,] },],
};
/**
 * A component that makes it easy to create tabbed interface.
 */
var NgbTabset = (function () {
    /**
     * @param {?} config
     */
    function NgbTabset(config) {
        /**
         * Whether the closed tabs should be hidden without destroying them
         */
        this.destroyOnHide = true;
        /**
         * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
         */
        this.tabChange = new _angular_core.EventEmitter();
        this.type = config.type;
        this.justify = config.justify;
    }
    /**
     * Selects the tab with the given id and shows its associated pane.
     * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
     * @param {?} tabId
     * @return {?}
     */
    NgbTabset.prototype.select = function (tabId) {
        var /** @type {?} */ selectedTab = this._getTabById(tabId);
        if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
            var /** @type {?} */ defaultPrevented_2 = false;
            this.tabChange.emit({ activeId: this.activeId, nextId: selectedTab.id, preventDefault: function () { defaultPrevented_2 = true; } });
            if (!defaultPrevented_2) {
                this.activeId = selectedTab.id;
            }
        }
    };
    /**
     * @return {?}
     */
    NgbTabset.prototype.ngAfterContentChecked = function () {
        // auto-correct activeId that might have been set incorrectly as input
        var /** @type {?} */ activeTab = this._getTabById(this.activeId);
        this.activeId = activeTab ? activeTab.id : (this.tabs.length ? this.tabs.first.id : null);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    NgbTabset.prototype._getTabById = function (id) {
        var /** @type {?} */ tabsWithId = this.tabs.filter(function (tab) { return tab.id === id; });
        return tabsWithId.length ? tabsWithId[0] : null;
    };
    return NgbTabset;
}());
NgbTabset.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-tabset',
                exportAs: 'ngbTabset',
                template: "\n    <ul [class]=\"'nav nav-' + type + ' justify-content-' + justify\" role=\"tablist\">\n      <li class=\"nav-item\" *ngFor=\"let tab of tabs\">\n        <a [id]=\"tab.id\" class=\"nav-link\" [class.active]=\"tab.id === activeId\" [class.disabled]=\"tab.disabled\"\n          href (click)=\"!!select(tab.id)\" role=\"tab\" [attr.tabindex]=\"(tab.disabled ? '-1': undefined)\"\n          [attr.aria-controls]=\"(!destroyOnHide || tab.id === activeId ? tab.id + '-panel' : null)\"\n          [attr.aria-expanded]=\"tab.id === activeId\" [attr.aria-disabled]=\"tab.disabled\">\n          {{tab.title}}<ng-template [ngTemplateOutlet]=\"tab.titleTpl?.templateRef\"></ng-template>\n        </a>\n      </li>\n    </ul>\n    <div class=\"tab-content\">\n      <ng-template ngFor let-tab [ngForOf]=\"tabs\">\n        <div\n          class=\"tab-pane {{tab.id === activeId ? 'active' : null}}\"\n          *ngIf=\"!destroyOnHide || tab.id === activeId\"\n          role=\"tabpanel\"\n          [attr.aria-labelledby]=\"tab.id\" id=\"{{tab.id}}-panel\"\n          [attr.aria-expanded]=\"tab.id === activeId\">\n          <ng-template [ngTemplateOutlet]=\"tab.contentTpl.templateRef\"></ng-template>\n        </div>\n      </ng-template>\n    </div>\n  "
            },] },
];
/**
 * @nocollapse
 */
NgbTabset.ctorParameters = function () { return [
    { type: NgbTabsetConfig, },
]; };
NgbTabset.propDecorators = {
    'tabs': [{ type: _angular_core.ContentChildren, args: [NgbTab,] },],
    'activeId': [{ type: _angular_core.Input },],
    'destroyOnHide': [{ type: _angular_core.Input },],
    'justify': [{ type: _angular_core.Input },],
    'type': [{ type: _angular_core.Input },],
    'tabChange': [{ type: _angular_core.Output },],
};
var NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];
var NgbTabsetModule = (function () {
    function NgbTabsetModule() {
    }
    /**
     * @return {?}
     */
    NgbTabsetModule.forRoot = function () { return { ngModule: NgbTabsetModule, providers: [NgbTabsetConfig] }; };
    return NgbTabsetModule;
}());
NgbTabsetModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [_angular_common.CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbTabsetModule.ctorParameters = function () { return []; };
var NgbTime = (function () {
    /**
     * @param {?=} hour
     * @param {?=} minute
     * @param {?=} second
     */
    function NgbTime(hour, minute, second) {
        this.hour = toInteger(hour);
        this.minute = toInteger(minute);
        this.second = toInteger(second);
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    NgbTime.prototype.changeHour = function (step) {
        if (step === void 0) { step = 1; }
        this.updateHour((isNaN(this.hour) ? 0 : this.hour) + step);
    };
    /**
     * @param {?} hour
     * @return {?}
     */
    NgbTime.prototype.updateHour = function (hour) {
        if (isNumber(hour)) {
            this.hour = (hour < 0 ? 24 + hour : hour) % 24;
        }
        else {
            this.hour = NaN;
        }
    };
    /**
     * @param {?=} step
     * @return {?}
     */
    NgbTime.prototype.changeMinute = function (step) {
        if (step === void 0) { step = 1; }
        this.updateMinute((isNaN(this.minute) ? 0 : this.minute) + step);
    };
    /**
     * @param {?} minute
     * @return {?}
     */
    NgbTime.prototype.updateMinute = function (minute) {
        if (isNumber(minute)) {
            this.minute = minute % 60 < 0 ? 60 + minute % 60 : minute % 60;
            this.changeHour(Math.floor(minute / 60));
        }
        else {
            this.minute = NaN;
        }
    };
    /**
     * @param {?=} step
     * @return {?}
     */
    NgbTime.prototype.changeSecond = function (step) {
        if (step === void 0) { step = 1; }
        this.updateSecond((isNaN(this.second) ? 0 : this.second) + step);
    };
    /**
     * @param {?} second
     * @return {?}
     */
    NgbTime.prototype.updateSecond = function (second) {
        if (isNumber(second)) {
            this.second = second < 0 ? 60 + second % 60 : second % 60;
            this.changeMinute(Math.floor(second / 60));
        }
        else {
            this.second = NaN;
        }
    };
    /**
     * @param {?=} checkSecs
     * @return {?}
     */
    NgbTime.prototype.isValid = function (checkSecs) {
        if (checkSecs === void 0) { checkSecs = true; }
        return isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true);
    };
    /**
     * @return {?}
     */
    NgbTime.prototype.toString = function () { return (this.hour || 0) + ":" + (this.minute || 0) + ":" + (this.second || 0); };
    return NgbTime;
}());
/**
 * Configuration service for the NgbTimepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
var NgbTimepickerConfig = (function () {
    function NgbTimepickerConfig() {
        this.meridian = false;
        this.spinners = true;
        this.seconds = false;
        this.hourStep = 1;
        this.minuteStep = 1;
        this.secondStep = 1;
        this.disabled = false;
        this.readonlyInputs = false;
        this.size = 'medium';
    }
    return NgbTimepickerConfig;
}());
NgbTimepickerConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbTimepickerConfig.ctorParameters = function () { return []; };
var NGB_TIMEPICKER_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return NgbTimepicker; }),
    multi: true
};
/**
 * A lightweight & configurable timepicker directive.
 */
var NgbTimepicker = (function () {
    /**
     * @param {?} config
     */
    function NgbTimepicker(config) {
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.meridian = config.meridian;
        this.spinners = config.spinners;
        this.seconds = config.seconds;
        this.hourStep = config.hourStep;
        this.minuteStep = config.minuteStep;
        this.secondStep = config.secondStep;
        this.disabled = config.disabled;
        this.readonlyInputs = config.readonlyInputs;
        this.size = config.size;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    NgbTimepicker.prototype.writeValue = function (value) {
        this.model = value ? new NgbTime(value.hour, value.minute, value.second) : new NgbTime();
        if (!this.seconds && (!value || !isNumber(value.second))) {
            this.model.second = 0;
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbTimepicker.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbTimepicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbTimepicker.prototype.setDisabledState = function (isDisabled) { this.disabled = isDisabled; };
    /**
     * @param {?} step
     * @return {?}
     */
    NgbTimepicker.prototype.changeHour = function (step) {
        this.model.changeHour(step);
        this.propagateModelChange();
    };
    /**
     * @param {?} step
     * @return {?}
     */
    NgbTimepicker.prototype.changeMinute = function (step) {
        this.model.changeMinute(step);
        this.propagateModelChange();
    };
    /**
     * @param {?} step
     * @return {?}
     */
    NgbTimepicker.prototype.changeSecond = function (step) {
        this.model.changeSecond(step);
        this.propagateModelChange();
    };
    /**
     * @param {?} newVal
     * @return {?}
     */
    NgbTimepicker.prototype.updateHour = function (newVal) {
        this.model.updateHour(toInteger(newVal));
        this.propagateModelChange();
    };
    /**
     * @param {?} newVal
     * @return {?}
     */
    NgbTimepicker.prototype.updateMinute = function (newVal) {
        this.model.updateMinute(toInteger(newVal));
        this.propagateModelChange();
    };
    /**
     * @param {?} newVal
     * @return {?}
     */
    NgbTimepicker.prototype.updateSecond = function (newVal) {
        this.model.updateSecond(toInteger(newVal));
        this.propagateModelChange();
    };
    /**
     * @return {?}
     */
    NgbTimepicker.prototype.toggleMeridian = function () {
        if (this.meridian) {
            this.changeHour(12);
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbTimepicker.prototype.formatHour = function (value) {
        if (isNumber(value)) {
            if (this.meridian) {
                return padNumber(value % 12 === 0 ? 12 : value % 12);
            }
            else {
                return padNumber(value % 24);
            }
        }
        else {
            return padNumber(NaN);
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbTimepicker.prototype.formatMinSec = function (value) { return padNumber(value); };
    /**
     * @return {?}
     */
    NgbTimepicker.prototype.setFormControlSize = function () { return { 'form-control-sm': this.size === 'small', 'form-control-lg': this.size === 'large' }; };
    /**
     * @return {?}
     */
    NgbTimepicker.prototype.setButtonSize = function () { return { 'btn-sm': this.size === 'small', 'btn-lg': this.size === 'large' }; };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbTimepicker.prototype.ngOnChanges = function (changes) {
        if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
            this.model.second = 0;
            this.propagateModelChange(false);
        }
    };
    /**
     * @param {?=} touched
     * @return {?}
     */
    NgbTimepicker.prototype.propagateModelChange = function (touched) {
        if (touched === void 0) { touched = true; }
        if (touched) {
            this.onTouched();
        }
        if (this.model.isValid(this.seconds)) {
            this.onChange({ hour: this.model.hour, minute: this.model.minute, second: this.model.second });
        }
        else {
            this.onChange(null);
        }
    };
    return NgbTimepicker;
}());
NgbTimepicker.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-timepicker',
                styles: ["\n    .ngb-tp {\n      display: flex;\n      align-items: center;\n    }\n\n    .ngb-tp-hour, .ngb-tp-minute, .ngb-tp-second, .ngb-tp-meridian {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: space-around;\n    }\n\n    .ngb-tp-spacer {\n      width: 1em;\n      text-align: center;\n    }\n\n    .chevron::before {\n      border-style: solid;\n      border-width: 0.29em 0.29em 0 0;\n      content: '';\n      display: inline-block;\n      height: 0.69em;\n      left: 0.05em;\n      position: relative;\n      top: 0.15em;\n      transform: rotate(-45deg);\n      -webkit-transform: rotate(-45deg);\n      -ms-transform: rotate(-45deg);\n      vertical-align: middle;\n      width: 0.71em;\n    }\n\n    .chevron.bottom:before {\n      top: -.3em;\n      -webkit-transform: rotate(135deg);\n      -ms-transform: rotate(135deg);\n      transform: rotate(135deg);\n    }\n\n    .btn-link {\n      outline: 0;\n    }\n\n    .btn-link.disabled {\n      cursor: not-allowed;\n      opacity: .65;\n    }\n\n    input {\n      text-align: center;\n      display: inline-block;\n      width: auto;\n    }\n  "],
                template: "\n    <fieldset [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n      <div class=\"ngb-tp\">\n        <div class=\"ngb-tp-hour\">\n          <button *ngIf=\"spinners\" type=\"button\" class=\"btn-link\" [ngClass]=\"setButtonSize()\" (click)=\"changeHour(hourStep)\"\n            [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n            <span class=\"chevron\"></span>\n            <span class=\"sr-only\">Increment hours</span>\n          </button>\n          <input type=\"text\" class=\"form-control\" [ngClass]=\"setFormControlSize()\" maxlength=\"2\" size=\"2\" placeholder=\"HH\"\n            [value]=\"formatHour(model?.hour)\" (change)=\"updateHour($event.target.value)\"\n            [readonly]=\"readonlyInputs\" [disabled]=\"disabled\" aria-label=\"Hours\">\n          <button *ngIf=\"spinners\" type=\"button\" class=\"btn-link\" [ngClass]=\"setButtonSize()\" (click)=\"changeHour(-hourStep)\"\n            [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n            <span class=\"chevron bottom\"></span>\n            <span class=\"sr-only\">Decrement hours</span>\n          </button>\n        </div>\n        <div class=\"ngb-tp-spacer\">:</div>\n        <div class=\"ngb-tp-minute\">\n          <button *ngIf=\"spinners\" type=\"button\" class=\"btn-link\" [ngClass]=\"setButtonSize()\" (click)=\"changeMinute(minuteStep)\"\n            [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n            <span class=\"chevron\"></span>\n            <span class=\"sr-only\">Increment minutes</span>\n          </button>\n          <input type=\"text\" class=\"form-control\" [ngClass]=\"setFormControlSize()\" maxlength=\"2\" size=\"2\" placeholder=\"MM\"\n            [value]=\"formatMinSec(model?.minute)\" (change)=\"updateMinute($event.target.value)\"\n            [readonly]=\"readonlyInputs\" [disabled]=\"disabled\" aria-label=\"Minutes\">\n          <button *ngIf=\"spinners\" type=\"button\" class=\"btn-link\" [ngClass]=\"setButtonSize()\" (click)=\"changeMinute(-minuteStep)\"\n            [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n            <span class=\"chevron bottom\"></span>\n            <span class=\"sr-only\">Decrement minutes</span>\n          </button>\n        </div>\n        <div *ngIf=\"seconds\" class=\"ngb-tp-spacer\">:</div>\n        <div *ngIf=\"seconds\" class=\"ngb-tp-second\">\n          <button *ngIf=\"spinners\" type=\"button\" class=\"btn-link\" [ngClass]=\"setButtonSize()\" (click)=\"changeSecond(secondStep)\"\n            [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n            <span class=\"chevron\"></span>\n            <span class=\"sr-only\">Increment seconds</span>\n          </button>\n          <input type=\"text\" class=\"form-control\" [ngClass]=\"setFormControlSize()\" maxlength=\"2\" size=\"2\" placeholder=\"SS\"\n            [value]=\"formatMinSec(model?.second)\" (change)=\"updateSecond($event.target.value)\"\n            [readonly]=\"readonlyInputs\" [disabled]=\"disabled\" aria-label=\"Seconds\">\n          <button *ngIf=\"spinners\" type=\"button\" class=\"btn-link\" [ngClass]=\"setButtonSize()\" (click)=\"changeSecond(-secondStep)\"\n            [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n            <span class=\"chevron bottom\"></span>\n            <span class=\"sr-only\">Decrement seconds</span>\n          </button>\n        </div>\n        <div *ngIf=\"meridian\" class=\"ngb-tp-spacer\"></div>\n        <div *ngIf=\"meridian\" class=\"ngb-tp-meridian\">\n          <button type=\"button\" class=\"btn btn-outline-primary\" [ngClass]=\"setButtonSize()\"\n            [disabled]=\"disabled\" [class.disabled]=\"disabled\"\n            (click)=\"toggleMeridian()\">{{model.hour >= 12 ? 'PM' : 'AM'}}</button>\n        </div>\n      </div>\n    </fieldset>\n  ",
                providers: [NGB_TIMEPICKER_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
NgbTimepicker.ctorParameters = function () { return [
    { type: NgbTimepickerConfig, },
]; };
NgbTimepicker.propDecorators = {
    'meridian': [{ type: _angular_core.Input },],
    'spinners': [{ type: _angular_core.Input },],
    'seconds': [{ type: _angular_core.Input },],
    'hourStep': [{ type: _angular_core.Input },],
    'minuteStep': [{ type: _angular_core.Input },],
    'secondStep': [{ type: _angular_core.Input },],
    'readonlyInputs': [{ type: _angular_core.Input },],
    'size': [{ type: _angular_core.Input },],
};
var NgbTimepickerModule = (function () {
    function NgbTimepickerModule() {
    }
    /**
     * @return {?}
     */
    NgbTimepickerModule.forRoot = function () { return { ngModule: NgbTimepickerModule, providers: [NgbTimepickerConfig] }; };
    return NgbTimepickerModule;
}());
NgbTimepickerModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [_angular_common.CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbTimepickerModule.ctorParameters = function () { return []; };
/**
 * Configuration service for the NgbTooltip directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
var NgbTooltipConfig = (function () {
    function NgbTooltipConfig() {
        this.placement = 'top';
        this.triggers = 'hover';
    }
    return NgbTooltipConfig;
}());
NgbTooltipConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbTooltipConfig.ctorParameters = function () { return []; };
var nextId$4 = 0;
var NgbTooltipWindow = (function () {
    function NgbTooltipWindow() {
        this.placement = 'top';
    }
    return NgbTooltipWindow;
}());
NgbTooltipWindow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-tooltip-window',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                host: { '[class]': '"tooltip show tooltip-" + placement', 'role': 'tooltip', '[id]': 'id' },
                template: "\n    <div class=\"tooltip-inner\"><ng-content></ng-content></div>\n    "
            },] },
];
/**
 * @nocollapse
 */
NgbTooltipWindow.ctorParameters = function () { return []; };
NgbTooltipWindow.propDecorators = {
    'placement': [{ type: _angular_core.Input },],
    'id': [{ type: _angular_core.Input },],
};
/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
var NgbTooltip = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} ngZone
     */
    function NgbTooltip(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, ngZone) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /**
         * Emits an event when the tooltip is shown
         */
        this.shown = new _angular_core.EventEmitter();
        /**
         * Emits an event when the tooltip is hidden
         */
        this.hidden = new _angular_core.EventEmitter();
        this._ngbTooltipWindowId = "ngb-tooltip-" + nextId$4++;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(function () {
            if (_this._windowRef) {
                positionElements(_this._elementRef.nativeElement, _this._windowRef.location.nativeElement, _this.placement, _this.container === 'body');
            }
        });
    }
    Object.defineProperty(NgbTooltip.prototype, "ngbTooltip", {
        /**
         * @return {?}
         */
        get: function () { return this._ngbTooltip; },
        /**
         * Content to be displayed as tooltip. If falsy, the tooltip won't open.
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._ngbTooltip = value;
            if (!value && this._windowRef) {
                this.close();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * The context is an optional value to be injected into the tooltip template when it is created.
     * @param {?=} context
     * @return {?}
     */
    NgbTooltip.prototype.open = function (context) {
        if (!this._windowRef && this._ngbTooltip) {
            this._windowRef = this._popupService.open(this._ngbTooltip, context);
            this._windowRef.instance.placement = this.placement;
            this._windowRef.instance.id = this._ngbTooltipWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // position tooltip along the element
            positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body');
            // we need to manually invoke change detection since events registered via
            // Renderer::listen() - to be determined if this is a bug in the Angular itself
            this._windowRef.changeDetectorRef.markForCheck();
            this.shown.emit();
        }
    };
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    NgbTooltip.prototype.close = function () {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    };
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    NgbTooltip.prototype.toggle = function () {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * Returns whether or not the tooltip is currently being shown
     * @return {?}
     */
    NgbTooltip.prototype.isOpen = function () { return this._windowRef != null; };
    /**
     * @return {?}
     */
    NgbTooltip.prototype.ngOnInit = function () {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    };
    /**
     * @return {?}
     */
    NgbTooltip.prototype.ngOnDestroy = function () {
        this.close();
        this._unregisterListenersFn();
        this._zoneSubscription.unsubscribe();
    };
    return NgbTooltip;
}());
NgbTooltip.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' },] },
];
/**
 * @nocollapse
 */
NgbTooltip.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.Injector, },
    { type: _angular_core.ComponentFactoryResolver, },
    { type: _angular_core.ViewContainerRef, },
    { type: NgbTooltipConfig, },
    { type: _angular_core.NgZone, },
]; };
NgbTooltip.propDecorators = {
    'placement': [{ type: _angular_core.Input },],
    'triggers': [{ type: _angular_core.Input },],
    'container': [{ type: _angular_core.Input },],
    'shown': [{ type: _angular_core.Output },],
    'hidden': [{ type: _angular_core.Output },],
    'ngbTooltip': [{ type: _angular_core.Input },],
};
var NgbTooltipModule = (function () {
    function NgbTooltipModule() {
    }
    /**
     * @return {?}
     */
    NgbTooltipModule.forRoot = function () { return { ngModule: NgbTooltipModule, providers: [NgbTooltipConfig] }; };
    return NgbTooltipModule;
}());
NgbTooltipModule.decorators = [
    { type: _angular_core.NgModule, args: [{ declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip], entryComponents: [NgbTooltipWindow] },] },
];
/**
 * @nocollapse
 */
NgbTooltipModule.ctorParameters = function () { return []; };
var NgbHighlight = (function () {
    function NgbHighlight() {
        this.highlightClass = 'ngb-highlight';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbHighlight.prototype.ngOnChanges = function (changes) {
        var /** @type {?} */ resultStr = toString(this.result);
        var /** @type {?} */ resultLC = resultStr.toLowerCase();
        var /** @type {?} */ termLC = toString(this.term).toLowerCase();
        var /** @type {?} */ currentIdx = 0;
        if (termLC.length > 0) {
            this.parts = resultLC.split(new RegExp("(" + regExpEscape(termLC) + ")")).map(function (part) {
                var /** @type {?} */ originalPart = resultStr.substr(currentIdx, part.length);
                currentIdx += part.length;
                return originalPart;
            });
        }
        else {
            this.parts = [resultStr];
        }
    };
    return NgbHighlight;
}());
NgbHighlight.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-highlight',
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                template: "<ng-template ngFor [ngForOf]=\"parts\" let-part let-isOdd=\"odd\">" +
                    "<span *ngIf=\"isOdd\" class=\"{{highlightClass}}\">{{part}}</span><ng-template [ngIf]=\"!isOdd\">{{part}}</ng-template>" +
                    "</ng-template>",
                styles: ["\n    .ngb-highlight {\n      font-weight: bold;\n    }\n  "]
            },] },
];
/**
 * @nocollapse
 */
NgbHighlight.ctorParameters = function () { return []; };
NgbHighlight.propDecorators = {
    'highlightClass': [{ type: _angular_core.Input },],
    'result': [{ type: _angular_core.Input },],
    'term': [{ type: _angular_core.Input },],
};
var NgbTypeaheadWindow = (function () {
    function NgbTypeaheadWindow() {
        this.activeIdx = 0;
        /**
         * Flag indicating if the first row should be active initially
         */
        this.focusFirst = true;
        /**
         * A function used to format a given result before display. This function should return a formatted string without any
         * HTML markup
         */
        this.formatter = toString;
        /**
         * Event raised when user selects a particular result row
         */
        this.selectEvent = new _angular_core.EventEmitter();
        this.activeChangeEvent = new _angular_core.EventEmitter();
    }
    /**
     * @param {?} result
     * @return {?}
     */
    NgbTypeaheadWindow.prototype._getResultContext = function (result) { return { result: result, term: this.term, formatter: this.formatter }; };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.getActive = function () { return this.results[this.activeIdx]; };
    /**
     * @param {?} activeIdx
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.markActive = function (activeIdx) {
        this.activeIdx = activeIdx;
        this._activeChanged();
    };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.next = function () {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        }
        else {
            this.activeIdx++;
        }
        this._activeChanged();
    };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.prev = function () {
        if (this.activeIdx < 0) {
            this.activeIdx = this.results.length - 1;
        }
        else if (this.activeIdx === 0) {
            this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
        }
        else {
            this.activeIdx--;
        }
        this._activeChanged();
    };
    /**
     * @param {?} item
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.select = function (item) { this.selectEvent.emit(item); };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype.ngOnInit = function () {
        this.activeIdx = this.focusFirst ? 0 : -1;
        this._activeChanged();
    };
    /**
     * @return {?}
     */
    NgbTypeaheadWindow.prototype._activeChanged = function () {
        this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
    };
    return NgbTypeaheadWindow;
}());
NgbTypeaheadWindow.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngb-typeahead-window',
                exportAs: 'ngbTypeaheadWindow',
                host: { 'class': 'dropdown-menu', 'style': 'display: block', 'role': 'listbox', '[id]': 'id' },
                template: "\n    <ng-template #rt let-result=\"result\" let-term=\"term\" let-formatter=\"formatter\">\n      <ngb-highlight [result]=\"formatter(result)\" [term]=\"term\"></ngb-highlight>\n    </ng-template>\n    <ng-template ngFor [ngForOf]=\"results\" let-result let-idx=\"index\">\n      <button type=\"button\" class=\"dropdown-item\" role=\"option\"\n        [id]=\"id + '-' + idx\"\n        [class.active]=\"idx === activeIdx\"\n        (mouseenter)=\"markActive(idx)\"\n        (click)=\"select(result)\">\n          <ng-template [ngTemplateOutlet]=\"resultTemplate || rt\"\n          [ngOutletContext]=\"_getResultContext(result)\"></ng-template>\n      </button>\n    </ng-template>\n  "
            },] },
];
/**
 * @nocollapse
 */
NgbTypeaheadWindow.ctorParameters = function () { return []; };
NgbTypeaheadWindow.propDecorators = {
    'id': [{ type: _angular_core.Input },],
    'focusFirst': [{ type: _angular_core.Input },],
    'results': [{ type: _angular_core.Input },],
    'term': [{ type: _angular_core.Input },],
    'formatter': [{ type: _angular_core.Input },],
    'resultTemplate': [{ type: _angular_core.Input },],
    'selectEvent': [{ type: _angular_core.Output, args: ['select',] },],
    'activeChangeEvent': [{ type: _angular_core.Output, args: ['activeChange',] },],
};
/**
 * Configuration service for the NgbTypeahead component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the typeaheads used in the application.
 */
var NgbTypeaheadConfig = (function () {
    function NgbTypeaheadConfig() {
        this.editable = true;
        this.focusFirst = true;
        this.showHint = false;
    }
    return NgbTypeaheadConfig;
}());
NgbTypeaheadConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
NgbTypeaheadConfig.ctorParameters = function () { return []; };
var Key$1 = {};
Key$1.Tab = 9;
Key$1.Enter = 13;
Key$1.Escape = 27;
Key$1.ArrowUp = 38;
Key$1.ArrowDown = 40;
Key$1[Key$1.Tab] = "Tab";
Key$1[Key$1.Enter] = "Enter";
Key$1[Key$1.Escape] = "Escape";
Key$1[Key$1.ArrowUp] = "ArrowUp";
Key$1[Key$1.ArrowDown] = "ArrowDown";
var NGB_TYPEAHEAD_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return NgbTypeahead; }),
    multi: true
};
var nextWindowId = 0;
/**
 * NgbTypeahead directive provides a simple way of creating powerful typeaheads from any text input
 */
var NgbTypeahead = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} _injector
     * @param {?} componentFactoryResolver
     * @param {?} config
     * @param {?} ngZone
     */
    function NgbTypeahead(_elementRef, _viewContainerRef, _renderer, _injector, componentFactoryResolver, config, ngZone) {
        var _this = this;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._injector = _injector;
        /**
         * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
         */
        this.selectItem = new _angular_core.EventEmitter();
        this.popupId = "ngb-typeahead-" + nextWindowId++;
        this._onTouched = function () { };
        this._onChange = function (_) { };
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this._valueChanges = rxjs_observable_fromEvent.fromEvent(_elementRef.nativeElement, 'input', function ($event) { return $event.target.value; });
        this._popupService = new PopupService(NgbTypeaheadWindow, _injector, _viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(function () {
            if (_this.isPopupOpen()) {
                positionElements(_this._elementRef.nativeElement, _this._windowRef.location.nativeElement, 'bottom-left');
            }
        });
    }
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.ngOnInit = function () {
        var _this = this;
        var /** @type {?} */ inputValues$ = rxjs_operator_do._do.call(this._valueChanges, function (value) {
            _this._userInput = value;
            if (_this.editable) {
                _this._onChange(value);
            }
        });
        var /** @type {?} */ results$ = rxjs_operator_let.letProto.call(inputValues$, this.ngbTypeahead);
        var /** @type {?} */ userInput$ = rxjs_operator_do._do.call(results$, function () {
            if (!_this.editable) {
                _this._onChange(undefined);
            }
        });
        this._subscription = this._subscribeToUserInput(userInput$);
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.ngOnDestroy = function () {
        this._unsubscribeFromUserInput();
        this._zoneSubscription.unsubscribe();
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbTypeahead.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbTypeahead.prototype.registerOnTouched = function (fn) { this._onTouched = fn; };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbTypeahead.prototype.writeValue = function (value) { this._writeInputValue(this._formatItemForInput(value)); };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbTypeahead.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.dismissPopup = function () {
        if (this.isPopupOpen()) {
            this._closePopup();
            this._writeInputValue(this._userInput);
        }
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.isPopupOpen = function () { return this._windowRef != null; };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype.handleBlur = function () { this._onTouched(); };
    /**
     * @param {?} event
     * @return {?}
     */
    NgbTypeahead.prototype.handleKeyDown = function (event) {
        if (!this.isPopupOpen()) {
            return;
        }
        if (Key$1[toString(event.which)]) {
            switch (event.which) {
                case Key$1.ArrowDown:
                    event.preventDefault();
                    this._windowRef.instance.next();
                    this._showHint();
                    break;
                case Key$1.ArrowUp:
                    event.preventDefault();
                    this._windowRef.instance.prev();
                    this._showHint();
                    break;
                case Key$1.Enter:
                case Key$1.Tab:
                    var /** @type {?} */ result = this._windowRef.instance.getActive();
                    if (isDefined(result)) {
                        event.preventDefault();
                        event.stopPropagation();
                        this._selectResult(result);
                    }
                    this._closePopup();
                    break;
                case Key$1.Escape:
                    event.preventDefault();
                    this.dismissPopup();
                    break;
            }
        }
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._openPopup = function () {
        var _this = this;
        if (!this.isPopupOpen()) {
            this._windowRef = this._popupService.open();
            this._windowRef.instance.id = this.popupId;
            this._windowRef.instance.selectEvent.subscribe(function (result) { return _this._selectResultClosePopup(result); });
            this._windowRef.instance.activeChangeEvent.subscribe(function (activeId) { return _this.activeDescendant = activeId; });
        }
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._closePopup = function () {
        this._popupService.close();
        this._windowRef = null;
        this.activeDescendant = undefined;
    };
    /**
     * @param {?} result
     * @return {?}
     */
    NgbTypeahead.prototype._selectResult = function (result) {
        var /** @type {?} */ defaultPrevented = false;
        this.selectItem.emit({ item: result, preventDefault: function () { defaultPrevented = true; } });
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    };
    /**
     * @param {?} result
     * @return {?}
     */
    NgbTypeahead.prototype._selectResultClosePopup = function (result) {
        this._selectResult(result);
        this._closePopup();
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._showHint = function () {
        if (this.showHint) {
            var /** @type {?} */ userInputLowerCase = this._userInput.toLowerCase();
            var /** @type {?} */ formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substr(0, this._userInput.length).toLowerCase()) {
                this._writeInputValue(this._userInput + formattedVal.substr(this._userInput.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [this._userInput.length, formattedVal.length]);
            }
            else {
                this.writeValue(this._windowRef.instance.getActive());
            }
        }
    };
    /**
     * @param {?} item
     * @return {?}
     */
    NgbTypeahead.prototype._formatItemForInput = function (item) {
        return item && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbTypeahead.prototype._writeInputValue = function (value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
    };
    /**
     * @param {?} userInput$
     * @return {?}
     */
    NgbTypeahead.prototype._subscribeToUserInput = function (userInput$) {
        var _this = this;
        return userInput$.subscribe(function (results) {
            if (!results || results.length === 0) {
                _this._closePopup();
            }
            else {
                _this._openPopup();
                _this._windowRef.instance.focusFirst = _this.focusFirst;
                _this._windowRef.instance.results = results;
                _this._windowRef.instance.term = _this._elementRef.nativeElement.value;
                if (_this.resultFormatter) {
                    _this._windowRef.instance.formatter = _this.resultFormatter;
                }
                if (_this.resultTemplate) {
                    _this._windowRef.instance.resultTemplate = _this.resultTemplate;
                }
                _this._showHint();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                _this._windowRef.changeDetectorRef.detectChanges();
            }
        });
    };
    /**
     * @return {?}
     */
    NgbTypeahead.prototype._unsubscribeFromUserInput = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    };
    return NgbTypeahead;
}());
NgbTypeahead.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'input[ngbTypeahead]',
                host: {
                    '(blur)': 'handleBlur()',
                    '[class.open]': 'isPopupOpen()',
                    '(document:click)': 'dismissPopup()',
                    '(keydown)': 'handleKeyDown($event)',
                    'autocomplete': 'off',
                    'autocapitalize': 'off',
                    'autocorrect': 'off',
                    'role': 'combobox',
                    'aria-multiline': 'false',
                    '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                    '[attr.aria-activedescendant]': 'activeDescendant',
                    '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                    '[attr.aria-expanded]': 'isPopupOpen()'
                },
                providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
NgbTypeahead.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.ViewContainerRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.Injector, },
    { type: _angular_core.ComponentFactoryResolver, },
    { type: NgbTypeaheadConfig, },
    { type: _angular_core.NgZone, },
]; };
NgbTypeahead.propDecorators = {
    'editable': [{ type: _angular_core.Input },],
    'focusFirst': [{ type: _angular_core.Input },],
    'inputFormatter': [{ type: _angular_core.Input },],
    'ngbTypeahead': [{ type: _angular_core.Input },],
    'resultFormatter': [{ type: _angular_core.Input },],
    'resultTemplate': [{ type: _angular_core.Input },],
    'showHint': [{ type: _angular_core.Input },],
    'selectItem': [{ type: _angular_core.Output },],
};
var NgbTypeaheadModule = (function () {
    function NgbTypeaheadModule() {
    }
    /**
     * @return {?}
     */
    NgbTypeaheadModule.forRoot = function () { return { ngModule: NgbTypeaheadModule, providers: [NgbTypeaheadConfig] }; };
    return NgbTypeaheadModule;
}());
NgbTypeaheadModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
                exports: [NgbTypeahead, NgbHighlight],
                imports: [_angular_common.CommonModule],
                entryComponents: [NgbTypeaheadWindow]
            },] },
];
/**
 * @nocollapse
 */
NgbTypeaheadModule.ctorParameters = function () { return []; };
var NGB_MODULES = [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
    NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule,
    NgbTabsetModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
];
var NgbRootModule = (function () {
    function NgbRootModule() {
    }
    return NgbRootModule;
}());
NgbRootModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    NgbAlertModule.forRoot(), NgbButtonsModule.forRoot(), NgbCollapseModule.forRoot(), NgbProgressbarModule.forRoot(),
                    NgbTooltipModule.forRoot(), NgbTypeaheadModule.forRoot(), NgbAccordionModule.forRoot(), NgbCarouselModule.forRoot(),
                    NgbDatepickerModule.forRoot(), NgbDropdownModule.forRoot(), NgbModalModule.forRoot(), NgbPaginationModule.forRoot(),
                    NgbPopoverModule.forRoot(), NgbProgressbarModule.forRoot(), NgbRatingModule.forRoot(), NgbTabsetModule.forRoot(),
                    NgbTimepickerModule.forRoot(), NgbTooltipModule.forRoot()
                ],
                exports: NGB_MODULES
            },] },
];
/**
 * @nocollapse
 */
NgbRootModule.ctorParameters = function () { return []; };
var NgbModule = (function () {
    function NgbModule() {
    }
    /**
     * @return {?}
     */
    NgbModule.forRoot = function () { return { ngModule: NgbRootModule }; };
    return NgbModule;
}());
NgbModule.decorators = [
    { type: _angular_core.NgModule, args: [{ imports: NGB_MODULES, exports: NGB_MODULES },] },
];
/**
 * @nocollapse
 */
NgbModule.ctorParameters = function () { return []; };

exports.NgbAccordionModule = NgbAccordionModule;
exports.NgbAccordionConfig = NgbAccordionConfig;
exports.NgbAccordion = NgbAccordion;
exports.NgbPanel = NgbPanel;
exports.NgbPanelTitle = NgbPanelTitle;
exports.NgbPanelContent = NgbPanelContent;
exports.NgbAlertModule = NgbAlertModule;
exports.NgbAlertConfig = NgbAlertConfig;
exports.NgbAlert = NgbAlert;
exports.NgbButtonsModule = NgbButtonsModule;
exports.NgbRadioGroup = NgbRadioGroup;
exports.NgbCarouselModule = NgbCarouselModule;
exports.NgbCarouselConfig = NgbCarouselConfig;
exports.NgbCarousel = NgbCarousel;
exports.NgbSlide = NgbSlide;
exports.NgbCollapseModule = NgbCollapseModule;
exports.NgbCollapse = NgbCollapse;
exports.NgbCalendar = NgbCalendar;
exports.NgbCalendarIslamicCivil = NgbCalendarIslamicCivil;
exports.NgbDatepickerModule = NgbDatepickerModule;
exports.NgbDatepickerI18n = NgbDatepickerI18n;
exports.NgbDatepickerConfig = NgbDatepickerConfig;
exports.NgbDateParserFormatter = NgbDateParserFormatter;
exports.NgbDatepicker = NgbDatepicker;
exports.NgbInputDatepicker = NgbInputDatepicker;
exports.NgbDropdownModule = NgbDropdownModule;
exports.NgbDropdownConfig = NgbDropdownConfig;
exports.NgbDropdown = NgbDropdown;
exports.NgbModalModule = NgbModalModule;
exports.NgbModal = NgbModal;
exports.NgbActiveModal = NgbActiveModal;
exports.NgbModalRef = NgbModalRef;
exports.ModalDismissReasons = ModalDismissReasons;
exports.NgbModalStack = NgbModalStack;
exports.ContentRef = ContentRef;
exports.NgbModalBackdrop = NgbModalBackdrop;
exports.isDefined = isDefined;
exports.isString = isString;
exports.NgbPaginationModule = NgbPaginationModule;
exports.NgbPaginationConfig = NgbPaginationConfig;
exports.NgbPagination = NgbPagination;
exports.NgbPopoverModule = NgbPopoverModule;
exports.NgbPopoverConfig = NgbPopoverConfig;
exports.NgbPopover = NgbPopover;
exports.NgbProgressbarModule = NgbProgressbarModule;
exports.NgbProgressbarConfig = NgbProgressbarConfig;
exports.NgbProgressbar = NgbProgressbar;
exports.NgbRatingModule = NgbRatingModule;
exports.NgbRatingConfig = NgbRatingConfig;
exports.NgbRating = NgbRating;
exports.NgbTabsetModule = NgbTabsetModule;
exports.NgbTabsetConfig = NgbTabsetConfig;
exports.NgbTabset = NgbTabset;
exports.NgbTab = NgbTab;
exports.NgbTabContent = NgbTabContent;
exports.NgbTabTitle = NgbTabTitle;
exports.NgbTimepickerModule = NgbTimepickerModule;
exports.NgbTimepickerConfig = NgbTimepickerConfig;
exports.NgbTimepicker = NgbTimepicker;
exports.NgbTooltipModule = NgbTooltipModule;
exports.NgbTooltipConfig = NgbTooltipConfig;
exports.NgbTooltip = NgbTooltip;
exports.NgbHighlight = NgbHighlight;
exports.NgbTypeaheadModule = NgbTypeaheadModule;
exports.NgbTypeaheadConfig = NgbTypeaheadConfig;
exports.NgbTypeahead = NgbTypeahead;
exports.NgbRootModule = NgbRootModule;
exports.NgbModule = NgbModule;
exports.ɵa = NgbActiveLabel;
exports.ɵb = NgbRadio;
exports.ɵc = NGB_CAROUSEL_DIRECTIVES;
exports.ɵf = NgbDatepickerDayView;
exports.ɵi = NgbDatepickerI18nDefault;
exports.ɵe = NgbDatepickerMonthView;
exports.ɵg = NgbDatepickerNavigation;
exports.ɵh = NgbDatepickerNavigationSelect;
exports.ɵo = NgbDatepickerService;
exports.ɵq = NgbCalendarHijri;
exports.ɵd = NgbCalendarGregorian;
exports.ɵj = NgbDateISOParserFormatter;
exports.ɵk = NgbDropdownToggle;
exports.ɵp = NgbModalWindow;
exports.ɵl = NgbPopoverWindow;
exports.ɵm = NgbTooltipWindow;
exports.ɵn = NgbTypeaheadWindow;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-bootstrap.umd.js.map
