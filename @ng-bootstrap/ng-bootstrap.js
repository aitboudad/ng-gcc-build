import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Injectable, Injector, Input, NgModule, NgZone, Optional, Output, ReflectiveInjector, Renderer2, TemplateRef, ViewContainerRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { letProto } from 'rxjs/operator/let';
import { _do } from 'rxjs/operator/do';
import { fromEvent } from 'rxjs/observable/fromEvent';

/**
 * @param {?} value
 * @return {?}
 */
function toInteger(value) {
    return parseInt(`${value}`, 10);
}
/**
 * @param {?} value
 * @return {?}
 */
function toString(value) {
    return (value !== undefined && value !== null) ? `${value}` : '';
}
/**
 * @param {?} value
 * @param {?} max
 * @param {?=} min
 * @return {?}
 */
function getValueInRange(value, max, min = 0) {
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
        return `0${value}`.slice(-2);
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
class NgbAccordionConfig {
    constructor() {
        this.closeOthers = false;
    }
}
NgbAccordionConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbAccordionConfig.ctorParameters = () => [];

let nextId = 0;
/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
class NgbPanelTitle {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelTitle.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbPanelTitle]' },] },
];
/**
 * @nocollapse
 */
NgbPanelTitle.ctorParameters = () => [
    { type: TemplateRef, },
];
/**
 * This directive must be used to wrap accordion panel content.
 */
class NgbPanelContent {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelContent.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbPanelContent]' },] },
];
/**
 * @nocollapse
 */
NgbPanelContent.ctorParameters = () => [
    { type: TemplateRef, },
];
/**
 * The NgbPanel directive represents an individual panel with the title and collapsible
 * content
 */
class NgbPanel {
    constructor() {
        /**
         *  A flag determining whether the panel is disabled or not.
         *  When disabled, the panel cannot be toggled.
         */
        this.disabled = false;
        /**
         *  An optional id for the panel. The id should be unique.
         *  If not provided, it will be auto-generated.
         */
        this.id = `ngb-panel-${nextId++}`;
    }
}
NgbPanel.decorators = [
    { type: Directive, args: [{ selector: 'ngb-panel' },] },
];
/**
 * @nocollapse
 */
NgbPanel.ctorParameters = () => [];
NgbPanel.propDecorators = {
    'disabled': [{ type: Input },],
    'id': [{ type: Input },],
    'title': [{ type: Input },],
    'type': [{ type: Input },],
    'contentTpl': [{ type: ContentChild, args: [NgbPanelContent,] },],
    'titleTpl': [{ type: ContentChild, args: [NgbPanelTitle,] },],
};
/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only one panel can be opened at a time.
 */
class NgbAccordion {
    /**
     * @param {?} config
     */
    constructor(config) {
        this._states = new Map();
        this._panelRefs = new Map();
        /**
         * An array or comma separated strings of panel identifiers that should be opened
         */
        this.activeIds = [];
        /**
         * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
         */
        this.panelChange = new EventEmitter();
        this.type = config.type;
        this.closeOtherPanels = config.closeOthers;
    }
    /**
     * Programmatically toggle a panel with a given id.
     * @param {?} panelId
     * @return {?}
     */
    toggle(panelId) {
        const /** @type {?} */ panel = this._panelRefs.get(panelId);
        if (panel && !panel.disabled) {
            const /** @type {?} */ nextState = !this._states.get(panelId);
            let /** @type {?} */ defaultPrevented = false;
            this.panelChange.emit({ panelId: panelId, nextState: nextState, preventDefault: () => { defaultPrevented = true; } });
            if (!defaultPrevented) {
                this._states.set(panelId, nextState);
                if (this.closeOtherPanels) {
                    this._closeOthers(panelId);
                }
                this._updateActiveIds();
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
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
    }
    /**
     * \@internal
     * @param {?} panelId
     * @return {?}
     */
    isOpen(panelId) { return this._states.get(panelId); }
    /**
     * @param {?} panelId
     * @return {?}
     */
    _closeOthers(panelId) {
        this._states.forEach((state, id) => {
            if (id !== panelId) {
                this._states.set(id, false);
            }
        });
    }
    /**
     * @return {?}
     */
    _updateActiveIds() {
        this.activeIds =
            this.panels.toArray().filter(panel => this.isOpen(panel.id) && !panel.disabled).map(panel => panel.id);
    }
    /**
     * @return {?}
     */
    _updateStates() {
        this._states.clear();
        this._panelRefs.clear();
        this.panels.toArray().forEach((panel) => {
            this._states.set(panel.id, this.activeIds.indexOf(panel.id) > -1 && !panel.disabled);
            this._panelRefs.set(panel.id, panel);
        });
    }
}
NgbAccordion.decorators = [
    { type: Component, args: [{
                selector: 'ngb-accordion',
                exportAs: 'ngbAccordion',
                host: { 'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels' },
                template: `
  <div class="card">
    <ng-template ngFor let-panel [ngForOf]="panels">
      <div role="tab" id="{{panel.id}}-header"
        [class]="'card-header ' + (panel.type ? 'card-'+panel.type: type ? 'card-'+type : '')" [class.active]="isOpen(panel.id)">
        <a href (click)="!!toggle(panel.id)" [class.text-muted]="panel.disabled" [attr.tabindex]="(panel.disabled ? '-1' : null)"
          [attr.aria-expanded]="isOpen(panel.id)" [attr.aria-controls]="(isOpen(panel.id) ? panel.id : null)"
          [attr.aria-disabled]="panel.disabled">
          {{panel.title}}<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
        </a>
      </div>
      <div id="{{panel.id}}" role="tabpanel" [attr.aria-labelledby]="panel.id + '-header'" class="card-block" *ngIf="isOpen(panel.id)">
        <ng-template [ngTemplateOutlet]="panel.contentTpl.templateRef"></ng-template>
      </div>
    </ng-template>
  </div>
`
            },] },
];
/**
 * @nocollapse
 */
NgbAccordion.ctorParameters = () => [
    { type: NgbAccordionConfig, },
];
NgbAccordion.propDecorators = {
    'panels': [{ type: ContentChildren, args: [NgbPanel,] },],
    'activeIds': [{ type: Input },],
    'closeOtherPanels': [{ type: Input, args: ['closeOthers',] },],
    'type': [{ type: Input },],
    'panelChange': [{ type: Output },],
};

const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent];
class NgbAccordionModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbAccordionModule, providers: [NgbAccordionConfig] }; }
}
NgbAccordionModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbAccordionModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbAlert component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the alerts used in the application.
 */
class NgbAlertConfig {
    constructor() {
        this.dismissible = true;
        this.type = 'warning';
    }
}
NgbAlertConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbAlertConfig.ctorParameters = () => [];

/**
 * Alerts can be used to provide feedback messages.
 */
class NgbAlert {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * An event emitted when the close button is clicked. This event has no payload. Only relevant for dismissible alerts.
         */
        this.close = new EventEmitter();
        this.dismissible = config.dismissible;
        this.type = config.type;
    }
    /**
     * @return {?}
     */
    closeHandler() { this.close.emit(null); }
}
NgbAlert.decorators = [
    { type: Component, args: [{
                selector: 'ngb-alert',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <div [class]="'alert alert-' + type + (dismissible ? ' alert-dismissible' : '')" role="alert">
      <button *ngIf="dismissible" type="button" class="close" aria-label="Close" (click)="closeHandler()">
            <span aria-hidden="true">&times;</span>
      </button>
      <ng-content></ng-content>
    </div>
    `
            },] },
];
/**
 * @nocollapse
 */
NgbAlert.ctorParameters = () => [
    { type: NgbAlertConfig, },
];
NgbAlert.propDecorators = {
    'dismissible': [{ type: Input },],
    'type': [{ type: Input },],
    'close': [{ type: Output },],
};

class NgbAlertModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbAlertModule, providers: [NgbAlertConfig] }; }
}
NgbAlertModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbAlert], exports: [NgbAlert], imports: [CommonModule], entryComponents: [NgbAlert] },] },
];
/**
 * @nocollapse
 */
NgbAlertModule.ctorParameters = () => [];

const NGB_RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbRadioGroup),
    multi: true
};
/**
 * Easily create Bootstrap-style radio buttons. A value of a selected button is bound to a variable
 * specified via ngModel.
 */
class NgbRadioGroup {
    constructor() {
        this._radios = new Set();
        this._value = null;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    set disabled(isDisabled) { this.setDisabledState(isDisabled); }
    /**
     * @param {?} radio
     * @return {?}
     */
    onRadioChange(radio) {
        this.writeValue(radio.value);
        this.onChange(radio.value);
    }
    /**
     * @return {?}
     */
    onRadioValueUpdate() { this._updateRadiosValue(); }
    /**
     * @param {?} radio
     * @return {?}
     */
    register(radio) { this._radios.add(radio); }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._disabled = isDisabled;
        this._updateRadiosDisabled();
    }
    /**
     * @param {?} radio
     * @return {?}
     */
    unregister(radio) { this._radios.delete(radio); }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this._value = value;
        this._updateRadiosValue();
    }
    /**
     * @return {?}
     */
    _updateRadiosValue() { this._radios.forEach((radio) => radio.updateValue(this._value)); }
    /**
     * @return {?}
     */
    _updateRadiosDisabled() { this._radios.forEach((radio) => radio.updateDisabled()); }
}
NgbRadioGroup.decorators = [
    { type: Directive, args: [{
                selector: '[ngbRadioGroup]',
                host: { 'data-toggle': 'buttons', 'class': 'btn-group', 'role': 'group' },
                providers: [NGB_RADIO_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
NgbRadioGroup.ctorParameters = () => [];
class NgbActiveLabel {
    /**
     * @param {?} _renderer
     * @param {?} _elRef
     */
    constructor(_renderer, _elRef) {
        this._renderer = _renderer;
        this._elRef = _elRef;
    }
    /**
     * @param {?} isActive
     * @return {?}
     */
    set active(isActive) {
        if (isActive) {
            this._renderer.addClass(this._elRef.nativeElement, 'active');
        }
        else {
            this._renderer.removeClass(this._elRef.nativeElement, 'active');
        }
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    set disabled(isDisabled) {
        if (isDisabled) {
            this._renderer.addClass(this._elRef.nativeElement, 'disabled');
        }
        else {
            this._renderer.removeClass(this._elRef.nativeElement, 'disabled');
        }
    }
    /**
     * @param {?} isFocused
     * @return {?}
     */
    set focused(isFocused) {
        if (isFocused) {
            this._renderer.addClass(this._elRef.nativeElement, 'focus');
        }
        else {
            this._renderer.removeClass(this._elRef.nativeElement, 'focus');
        }
    }
}
NgbActiveLabel.decorators = [
    { type: Directive, args: [{ selector: 'label.btn' },] },
];
/**
 * @nocollapse
 */
NgbActiveLabel.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
];
/**
 * Marks an input of type "radio" as part of the NgbRadioGroup.
 */
class NgbRadio {
    /**
     * @param {?} _group
     * @param {?} _label
     * @param {?} _renderer
     * @param {?} _element
     */
    constructor(_group, _label, _renderer, _element) {
        this._group = _group;
        this._label = _label;
        this._renderer = _renderer;
        this._element = _element;
        this._value = null;
        if (this._group) {
            this._group.register(this);
        }
    }
    /**
     * You can specify model value of a given radio by binding to the value property.
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        this._value = value;
        const /** @type {?} */ stringValue = value ? value.toString() : '';
        this._renderer.setProperty(this._element.nativeElement, 'value', stringValue);
        if (this._group) {
            this._group.onRadioValueUpdate();
        }
    }
    /**
     * A flag indicating if a given radio button is checked.
     * @param {?} value
     * @return {?}
     */
    set checked(value) {
        this._checked = this._element.nativeElement.hasAttribute('checked') ? true : value;
    }
    /**
     * A flag indicating if a given radio button is disabled.
     * @param {?} isDisabled
     * @return {?}
     */
    set disabled(isDisabled) {
        this._disabled = isDisabled !== false;
        this.updateDisabled();
    }
    /**
     * @param {?} isFocused
     * @return {?}
     */
    set focused(isFocused) {
        if (this._label) {
            this._label.focused = isFocused;
        }
    }
    /**
     * @return {?}
     */
    get value() { return this._value; }
    /**
     * @return {?}
     */
    get checked() { return this._checked; }
    /**
     * @return {?}
     */
    get disabled() { return (this._group && this._group.disabled) || this._disabled; }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._group) {
            this._group.unregister(this);
        }
    }
    /**
     * @return {?}
     */
    onChange() {
        if (this._group) {
            this._group.onRadioChange(this);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    updateValue(value) {
        this._checked = (this.value === value && value !== null);
        this._label.active = this._checked;
    }
    /**
     * @return {?}
     */
    updateDisabled() {
        let /** @type {?} */ disabled = (this._group && this._group.disabled) || this._disabled;
        if (this._label) {
            this._label.disabled = disabled;
        }
    }
}
NgbRadio.decorators = [
    { type: Directive, args: [{
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
NgbRadio.ctorParameters = () => [
    { type: NgbRadioGroup, decorators: [{ type: Optional },] },
    { type: NgbActiveLabel, decorators: [{ type: Optional },] },
    { type: Renderer2, },
    { type: ElementRef, },
];
NgbRadio.propDecorators = {
    'value': [{ type: Input, args: ['value',] },],
    'checked': [{ type: Input, args: ['checked',] },],
    'disabled': [{ type: Input, args: ['disabled',] },],
};

const NGB_RADIO_DIRECTIVES = [NgbRadio, NgbActiveLabel, NgbRadioGroup];
class NgbButtonsModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbButtonsModule, providers: [] }; }
}
NgbButtonsModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_RADIO_DIRECTIVES, exports: NGB_RADIO_DIRECTIVES },] },
];
/**
 * @nocollapse
 */
NgbButtonsModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbCarousel component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the carousels used in the application.
 */
class NgbCarouselConfig {
    constructor() {
        this.interval = 5000;
        this.wrap = true;
        this.keyboard = true;
    }
}
NgbCarouselConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbCarouselConfig.ctorParameters = () => [];

let nextId$1 = 0;
/**
 * Represents an individual slide to be used within a carousel.
 */
class NgbSlide {
    /**
     * @param {?} tplRef
     */
    constructor(tplRef) {
        this.tplRef = tplRef;
        /**
         * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
         * Will be auto-generated if not provided.
         */
        this.id = `ngb-slide-${nextId$1++}`;
    }
}
NgbSlide.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbSlide]' },] },
];
/**
 * @nocollapse
 */
NgbSlide.ctorParameters = () => [
    { type: TemplateRef, },
];
NgbSlide.propDecorators = {
    'id': [{ type: Input },],
};
/**
 * Directive to easily create carousels based on Bootstrap's markup.
 */
class NgbCarousel {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * A carousel slide event fired when the slide transition is completed.
         * See NgbSlideEvent for payload details
         */
        this.slide = new EventEmitter();
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        let /** @type {?} */ activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
    }
    /**
     * @return {?}
     */
    ngOnInit() { this._startTimer(); }
    /**
     * @return {?}
     */
    ngOnDestroy() { clearInterval(this._slideChangeInterval); }
    /**
     * Navigate to a slide with the specified identifier.
     * @param {?} slideId
     * @return {?}
     */
    select(slideId) {
        this.cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId));
        this._restartTimer();
    }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    prev() {
        this.cycleToPrev();
        this._restartTimer();
    }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    next() {
        this.cycleToNext();
        this._restartTimer();
    }
    /**
     * Stops the carousel from cycling through items.
     * @return {?}
     */
    pause() { this._stopTimer(); }
    /**
     * Restarts cycling through the carousel slides from left to right.
     * @return {?}
     */
    cycle() { this._startTimer(); }
    /**
     * @return {?}
     */
    cycleToNext() { this.cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT); }
    /**
     * @return {?}
     */
    cycleToPrev() { this.cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT); }
    /**
     * @param {?} slideIdx
     * @param {?} direction
     * @return {?}
     */
    cycleToSelected(slideIdx, direction) {
        let /** @type {?} */ selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide) {
            if (selectedSlide.id !== this.activeId) {
                this.slide.emit({ prev: this.activeId, current: selectedSlide.id, direction: direction });
            }
            this.activeId = selectedSlide.id;
        }
    }
    /**
     * @return {?}
     */
    keyPrev() {
        if (this.keyboard) {
            this.prev();
        }
    }
    /**
     * @return {?}
     */
    keyNext() {
        if (this.keyboard) {
            this.next();
        }
    }
    /**
     * @return {?}
     */
    _restartTimer() {
        this._stopTimer();
        this._startTimer();
    }
    /**
     * @return {?}
     */
    _startTimer() {
        if (this.interval > 0) {
            this._slideChangeInterval = setInterval(() => { this.cycleToNext(); }, this.interval);
        }
    }
    /**
     * @return {?}
     */
    _stopTimer() { clearInterval(this._slideChangeInterval); }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideById(slideId) {
        let /** @type {?} */ slideWithId = this.slides.filter(slide => slide.id === slideId);
        return slideWithId.length ? slideWithId[0] : null;
    }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideIdxById(slideId) {
        return this.slides.toArray().indexOf(this._getSlideById(slideId));
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getNextSlide(currentSlideId) {
        const /** @type {?} */ slideArr = this.slides.toArray();
        const /** @type {?} */ currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const /** @type {?} */ isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
            slideArr[currentSlideIdx + 1].id;
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getPrevSlide(currentSlideId) {
        const /** @type {?} */ slideArr = this.slides.toArray();
        const /** @type {?} */ currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const /** @type {?} */ isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
            slideArr[currentSlideIdx - 1].id;
    }
    /**
     * @param {?} currentActiveSlideId
     * @param {?} nextActiveSlideId
     * @return {?}
     */
    _getSlideEventDirection(currentActiveSlideId, nextActiveSlideId) {
        const /** @type {?} */ currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        const /** @type {?} */ nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
    }
}
NgbCarousel.decorators = [
    { type: Component, args: [{
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
                template: `
    <ol class="carousel-indicators">
      <li *ngFor="let slide of slides" [id]="slide.id" [class.active]="slide.id === activeId" 
          (click)="cycleToSelected(slide.id, _getSlideEventDirection(activeId, slide.id))"></li>
    </ol>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides" class="carousel-item" [class.active]="slide.id === activeId">
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <a class="left carousel-control-prev" role="button" (click)="cycleToPrev()">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control-next" role="button" (click)="cycleToNext()">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
    `
            },] },
];
/**
 * @nocollapse
 */
NgbCarousel.ctorParameters = () => [
    { type: NgbCarouselConfig, },
];
NgbCarousel.propDecorators = {
    'slides': [{ type: ContentChildren, args: [NgbSlide,] },],
    'interval': [{ type: Input },],
    'wrap': [{ type: Input },],
    'keyboard': [{ type: Input },],
    'activeId': [{ type: Input },],
    'slide': [{ type: Output },],
};
let NgbSlideEventDirection = {};
NgbSlideEventDirection.LEFT = ('left');
NgbSlideEventDirection.RIGHT = ('right');
NgbSlideEventDirection[NgbSlideEventDirection.LEFT] = "LEFT";
NgbSlideEventDirection[NgbSlideEventDirection.RIGHT] = "RIGHT";
const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];

class NgbCarouselModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbCarouselModule, providers: [NgbCarouselConfig] }; }
}
NgbCarouselModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_CAROUSEL_DIRECTIVES, exports: NGB_CAROUSEL_DIRECTIVES, imports: [CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbCarouselModule.ctorParameters = () => [];

/**
 * The NgbCollapse directive provides a simple way to hide and show an element with animations.
 */
class NgbCollapse {
    constructor() {
        /**
         * A flag indicating collapsed (true) or open (false) state.
         */
        this.collapsed = false;
    }
}
NgbCollapse.decorators = [
    { type: Directive, args: [{
                selector: '[ngbCollapse]',
                exportAs: 'ngbCollapse',
                host: { '[class.collapse]': 'true', '[class.show]': '!collapsed' }
            },] },
];
/**
 * @nocollapse
 */
NgbCollapse.ctorParameters = () => [];
NgbCollapse.propDecorators = {
    'collapsed': [{ type: Input, args: ['ngbCollapse',] },],
};

class NgbCollapseModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbCollapseModule, providers: [] }; }
}
NgbCollapseModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbCollapse], exports: [NgbCollapse] },] },
];
/**
 * @nocollapse
 */
NgbCollapseModule.ctorParameters = () => [];

class NgbDate {
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} day
     */
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    static from(date) {
        return date ? new NgbDate(date.year, date.month, date.day ? date.day : 1) : null;
    }
    /**
     * @param {?} other
     * @return {?}
     */
    equals(other) {
        return other && this.year === other.year && this.month === other.month && this.day === other.day;
    }
    /**
     * @param {?} other
     * @return {?}
     */
    before(other) {
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
    }
    /**
     * @param {?} other
     * @return {?}
     */
    after(other) {
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
    }
    /**
     * @return {?}
     */
    toStruct() { return { year: this.year, month: this.month, day: this.day }; }
    /**
     * @return {?}
     */
    toString() { return `${this.year}-${this.month}-${this.day}`; }
}

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
    const /** @type {?} */ jsDate = new Date(date.year, date.month - 1, date.day);
    // this is done avoid 30 -> 1930 conversion
    if (!isNaN(jsDate.getTime())) {
        jsDate.setFullYear(date.year);
    }
    return jsDate;
}
/**
 * @abstract
 */
class NgbCalendar {
    /**
     * @abstract
     * @return {?}
     */
    getDaysPerWeek() { }
    /**
     * @abstract
     * @return {?}
     */
    getMonths() { }
    /**
     * @abstract
     * @return {?}
     */
    getWeeksPerMonth() { }
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) { }
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period, number) { }
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period, number) { }
    /**
     * @abstract
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) { }
    /**
     * @abstract
     * @return {?}
     */
    getToday() { }
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    isValid(date) { }
}
NgbCalendar.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbCalendar.ctorParameters = () => [];
class NgbCalendarGregorian extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        let /** @type {?} */ jsDate = toJSDate(date);
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
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        let /** @type {?} */ jsDate = toJSDate(date);
        let /** @type {?} */ day = jsDate.getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        const /** @type {?} */ thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        let /** @type {?} */ date = week[thursdayIndex];
        const /** @type {?} */ jsDate = toJSDate(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        const /** @type {?} */ time = jsDate.getTime();
        jsDate.setMonth(0); // Compare with Jan 1
        jsDate.setDate(1);
        return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return fromJSDate(new Date()); }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
            return false;
        }
        const /** @type {?} */ jsDate = toJSDate(date);
        return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year && jsDate.getMonth() + 1 === date.month &&
            jsDate.getDate() === date.day;
    }
}
NgbCalendarGregorian.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbCalendarGregorian.ctorParameters = () => [];

class NgbDatepickerService {
    /**
     * @param {?} _calendar
     */
    constructor(_calendar) {
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
    generateMonthViewModel(date, minDate, maxDate, firstDayOfWeek, markDisabled) {
        const /** @type {?} */ month = { firstDate: null, number: date.month, year: date.year, weeks: [], weekdays: [] };
        date = this._getFirstViewDate(date, firstDayOfWeek);
        // month has weeks
        for (let /** @type {?} */ w = 0; w < this._calendar.getWeeksPerMonth(); w++) {
            const /** @type {?} */ days = [];
            // week has days
            for (let /** @type {?} */ d = 0; d < this._calendar.getDaysPerWeek(); d++) {
                if (w === 0) {
                    month.weekdays.push(this._calendar.getWeekday(date));
                }
                const /** @type {?} */ newDate = new NgbDate(date.year, date.month, date.day);
                let /** @type {?} */ disabled = (minDate && newDate.before(minDate)) || (maxDate && newDate.after(maxDate));
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
            month.weeks.push({ number: this._calendar.getWeekNumber(days.map(day => NgbDate.from(day.date)), firstDayOfWeek), days: days });
        }
        return month;
    }
    /**
     * @param {?} date
     * @param {?=} defaultValue
     * @return {?}
     */
    toValidDate(date, defaultValue) {
        const /** @type {?} */ ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    }
    /**
     * @param {?} date
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    _getFirstViewDate(date, firstDayOfWeek) {
        const /** @type {?} */ currentMonth = date.month;
        let /** @type {?} */ today = new NgbDate(date.year, date.month, date.day);
        let /** @type {?} */ yesterday = this._calendar.getPrev(today);
        const /** @type {?} */ firstDayOfCurrentMonthIsAlsoFirstDayOfWeek = () => { return today.month !== yesterday.month && firstDayOfWeek === this._calendar.getWeekday(today); };
        const /** @type {?} */ reachedTheFirstDayOfTheLastWeekOfPreviousMonth = () => { return today.month !== currentMonth && firstDayOfWeek === this._calendar.getWeekday(today); };
        // going back in time
        while (!reachedTheFirstDayOfTheLastWeekOfPreviousMonth() && !firstDayOfCurrentMonthIsAlsoFirstDayOfWeek()) {
            today = new NgbDate(yesterday.year, yesterday.month, yesterday.day);
            yesterday = this._calendar.getPrev(yesterday);
        }
        return today;
    }
}
NgbDatepickerService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerService.ctorParameters = () => [
    { type: NgbCalendar, },
];

let NavigationEvent = {};
NavigationEvent.PREV = 0;
NavigationEvent.NEXT = 1;
NavigationEvent[NavigationEvent.PREV] = "PREV";
NavigationEvent[NavigationEvent.NEXT] = "NEXT";

/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
class NgbDatepickerConfig {
    constructor() {
        this.displayMonths = 1;
        this.firstDayOfWeek = 1;
        this.navigation = 'select';
        this.outsideDays = 'visible';
        this.showWeekdays = true;
        this.showWeekNumbers = false;
    }
}
NgbDatepickerConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerConfig.ctorParameters = () => [];

const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
    'December'
];
/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 * @abstract
 */
class NgbDatepickerI18n {
    /**
     * Returns the short weekday name to display in the heading of the month view.
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
     * @abstract
     * @param {?} weekday
     * @return {?}
     */
    getWeekdayShortName(weekday) { }
    /**
     * Returns the short month name to display in the date picker navigation.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec
     * @abstract
     * @param {?} month
     * @return {?}
     */
    getMonthShortName(month) { }
    /**
     * Returns the full month name to display in the date picker navigation.
     * With default calendar we use ISO 8601: 'month' is 1=January ... 12=December
     * @abstract
     * @param {?} month
     * @return {?}
     */
    getMonthFullName(month) { }
}
NgbDatepickerI18n.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerI18n.ctorParameters = () => [];
class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
    /**
     * @param {?} weekday
     * @return {?}
     */
    getWeekdayShortName(weekday) { return WEEKDAYS_SHORT[weekday - 1]; }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthShortName(month) { return MONTHS_SHORT[month - 1]; }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthFullName(month) { return MONTHS_FULL[month - 1]; }
}
NgbDatepickerI18nDefault.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbDatepickerI18nDefault.ctorParameters = () => [];

const NGB_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbDatepicker),
    multi: true
};
/**
 * A lightweight and highly configurable datepicker directive
 */
class NgbDatepicker {
    /**
     * @param {?} _service
     * @param {?} _calendar
     * @param {?} i18n
     * @param {?} config
     */
    constructor(_service, _calendar, i18n, config) {
        this._service = _service;
        this._calendar = _calendar;
        this.i18n = i18n;
        this.months = [];
        /**
         * An event fired when navigation happens and currently displayed month changes.
         * See NgbDatepickerNavigateEvent for the payload info.
         */
        this.navigate = new EventEmitter();
        this.disabled = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
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
    getHeaderHeight() {
        const /** @type {?} */ h = this.showWeekdays ? 6.25 : 4.25;
        return this.displayMonths === 1 || this.navigation !== 'select' ? h - 2 : h;
    }
    /**
     * @return {?}
     */
    getHeaderMargin() {
        const /** @type {?} */ m = this.showWeekdays ? 2 : 0;
        return this.displayMonths !== 1 || this.navigation !== 'select' ? m + 2 : m;
    }
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    navigateTo(date) {
        this._setViewWithinLimits(this._service.toValidDate(date));
        this._updateData();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._setDates();
        this.navigateTo(this._date);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this._setDates();
        this._setViewWithinLimits(this._date);
        if (changes['displayMonths']) {
            this.displayMonths = toInteger(this.displayMonths);
        }
        // we have to force rebuild all months only if any of these inputs changes
        if (['startDate', 'minDate', 'maxDate', 'navigation', 'firstDayOfWeek', 'markDisabled', 'displayMonths'].some(input => !!changes[input])) {
            this._updateData(true);
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateSelect(date) {
        this._setViewWithinLimits(date);
        this.onTouched();
        this.writeValue(date);
        this.onChange({ year: date.year, month: date.month, day: date.day });
        // switch current month
        if (this._date.month !== this.months[0].number && this.displayMonths === 1) {
            this._updateData();
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onNavigateDateSelect(date) {
        this._setViewWithinLimits(date);
        this._updateData();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onNavigateEvent(event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._setViewWithinLimits(this._calendar.getPrev(this.months[0].firstDate, 'm'));
                break;
            case NavigationEvent.NEXT:
                this._setViewWithinLimits(this._calendar.getNext(this.months[0].firstDate, 'm'));
                break;
        }
        this._updateData();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) { this.model = this._service.toValidDate(value, null); }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @return {?}
     */
    _setDates() {
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
            throw new Error(`'maxDate' ${this._maxDate} should be greater than 'minDate' ${this._minDate}`);
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _setViewWithinLimits(date) {
        if (this._minDate && date.before(this._minDate)) {
            this._date = new NgbDate(this._minDate.year, this._minDate.month, 1);
        }
        else if (this._maxDate && date.after(this._maxDate)) {
            this._date = new NgbDate(this._maxDate.year, this._maxDate.month, 1);
        }
        else {
            this._date = new NgbDate(date.year, date.month, 1);
        }
    }
    /**
     * @param {?=} force
     * @return {?}
     */
    _updateData(force = false) {
        const /** @type {?} */ newMonths = [];
        for (let /** @type {?} */ i = 0; i < this.displayMonths; i++) {
            const /** @type {?} */ newDate = this._calendar.getNext(this._date, 'm', i);
            const /** @type {?} */ index = this.months.findIndex(month => month.firstDate.equals(newDate));
            if (force || index === -1) {
                newMonths.push(this._service.generateMonthViewModel(newDate, this._minDate, this._maxDate, toInteger(this.firstDayOfWeek), this.markDisabled));
            }
            else {
                newMonths.push(this.months[index]);
            }
        }
        const /** @type {?} */ newDate = newMonths[0].firstDate;
        const /** @type {?} */ oldDate = this.months[0] ? this.months[0].firstDate : null;
        this.months = newMonths;
        // emitting navigation event if the first month changes
        if (!newDate.equals(oldDate)) {
            this.navigate.emit({
                current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
                next: { year: newDate.year, month: newDate.month }
            });
        }
    }
}
NgbDatepicker.decorators = [
    { type: Component, args: [{
                exportAs: 'ngbDatepicker',
                selector: 'ngb-datepicker',
                host: { 'class': 'd-inline-block rounded' },
                styles: [`
    :host {
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    .ngb-dp-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    .ngb-dp-month {
      pointer-events: none;
    }
    ngb-datepicker-month-view {
      pointer-events: auto;
    }
    .ngb-dp-month:first-child {
      margin-left: 0 !important;
    }    
    .ngb-dp-month-name {
      font-size: larger;
      height: 2rem;
      line-height: 2rem;
    }    
  `],
                template: `
    <ng-template #dt let-date="date" let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled">
       <div ngbDatepickerDayView [date]="date" [currentMonth]="currentMonth" [selected]="selected" [disabled]="disabled"></div>
    </ng-template>
    
    <div class="ngb-dp-header bg-faded pt-1 rounded-top" [style.height.rem]="getHeaderHeight()" 
      [style.marginBottom.rem]="-getHeaderMargin()">
      <ngb-datepicker-navigation *ngIf="navigation !== 'none'"
        [date]="months[0]?.firstDate"
        [minDate]="_minDate"
        [maxDate]="_maxDate"
        [months]="months.length"
        [disabled]="disabled"
        [showWeekNumbers]="showWeekNumbers"
        [showSelect]="navigation === 'select'"
        (navigate)="onNavigateEvent($event)"
        (select)="onNavigateDateSelect($event)">
      </ngb-datepicker-navigation>
    </div>

    <div class="ngb-dp-months d-flex px-1 pb-1">
      <ng-template ngFor let-month [ngForOf]="months" let-i="index">
        <div class="ngb-dp-month d-block ml-3">            
          <div *ngIf="navigation !== 'select' || displayMonths > 1" class="ngb-dp-month-name text-center">
            {{ i18n.getMonthFullName(month.number) }} {{ month.year }}
          </div>
          <ngb-datepicker-month-view
            [month]="month"
            [selectedDate]="model"
            [dayTemplate]="dayTemplate || dt"
            [showWeekdays]="showWeekdays"
            [showWeekNumbers]="showWeekNumbers"
            [disabled]="disabled"
            [outsideDays]="displayMonths === 1 ? outsideDays : 'hidden'"
            (select)="onDateSelect($event)">
          </ngb-datepicker-month-view>
        </div>
      </ng-template>
    </div>
  `,
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NgbDatepickerService]
            },] },
];
/**
 * @nocollapse
 */
NgbDatepicker.ctorParameters = () => [
    { type: NgbDatepickerService, },
    { type: NgbCalendar, },
    { type: NgbDatepickerI18n, },
    { type: NgbDatepickerConfig, },
];
NgbDatepicker.propDecorators = {
    'dayTemplate': [{ type: Input },],
    'displayMonths': [{ type: Input },],
    'firstDayOfWeek': [{ type: Input },],
    'markDisabled': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'navigation': [{ type: Input },],
    'outsideDays': [{ type: Input },],
    'showWeekdays': [{ type: Input },],
    'showWeekNumbers': [{ type: Input },],
    'startDate': [{ type: Input },],
    'navigate': [{ type: Output },],
};

class NgbDatepickerMonthView {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.select = new EventEmitter();
    }
    /**
     * @param {?} day
     * @return {?}
     */
    doSelect(day) {
        if (!this.isDisabled(day) && !this.isHidden(day)) {
            this.select.emit(NgbDate.from(day.date));
        }
    }
    /**
     * @param {?} day
     * @param {?} month
     * @return {?}
     */
    _getDayContext(day, month) {
        return {
            date: { year: day.date.year, month: day.date.month, day: day.date.day },
            currentMonth: month.number,
            disabled: this.isDisabled(day),
            selected: this.isSelected(day.date)
        };
    }
    /**
     * @param {?} day
     * @return {?}
     */
    isDisabled(day) { return this.disabled || day.disabled; }
    /**
     * @param {?} date
     * @return {?}
     */
    isSelected(date) { return this.selectedDate && this.selectedDate.equals(date); }
    /**
     * @param {?} week
     * @return {?}
     */
    isCollapsed(week) {
        return this.outsideDays === 'collapsed' && week.days[0].date.month !== this.month.number &&
            week.days[week.days.length - 1].date.month !== this.month.number;
    }
    /**
     * @param {?} day
     * @return {?}
     */
    isHidden(day) {
        return (this.outsideDays === 'hidden' || this.outsideDays === 'collapsed') && this.month.number !== day.date.month;
    }
}
NgbDatepickerMonthView.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-month-view',
                host: { 'class': 'd-block' },
                styles: [`
    .ngb-dp-weekday, .ngb-dp-week-number {
      line-height: 2rem;
    }
    .ngb-dp-day, .ngb-dp-weekday, .ngb-dp-week-number {
      width: 2rem;
      height: 2rem;      
    }
    .ngb-dp-day {
      cursor: pointer;
    }
    .ngb-dp-day.disabled, .ngb-dp-day.hidden {
      cursor: default;
    }
  `],
                template: `
    <div *ngIf="showWeekdays" class="ngb-dp-week d-flex">
      <div *ngIf="showWeekNumbers" class="ngb-dp-weekday"></div>
      <div *ngFor="let w of month.weekdays" class="ngb-dp-weekday small text-center text-info font-italic">
        {{ i18n.getWeekdayShortName(w) }}
      </div>
    </div>
    <ng-template ngFor let-week [ngForOf]="month.weeks">
      <div *ngIf="!isCollapsed(week)" class="ngb-dp-week d-flex">
        <div *ngIf="showWeekNumbers" class="ngb-dp-week-number small text-center font-italic text-muted">{{ week.number }}</div>
        <div *ngFor="let day of week.days" (click)="doSelect(day)" class="ngb-dp-day" [class.disabled]="isDisabled(day)"
         [class.hidden]="isHidden(day)">
          <ng-template [ngIf]="!isHidden(day)">
            <ng-template [ngTemplateOutlet]="dayTemplate"
            [ngOutletContext]="_getDayContext(day, month)">
            </ng-template>
          </ng-template>
        </div>
      </div>
    </ng-template>
  `
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerMonthView.ctorParameters = () => [
    { type: NgbDatepickerI18n, },
];
NgbDatepickerMonthView.propDecorators = {
    'dayTemplate': [{ type: Input },],
    'disabled': [{ type: Input },],
    'month': [{ type: Input },],
    'outsideDays': [{ type: Input },],
    'selectedDate': [{ type: Input },],
    'showWeekdays': [{ type: Input },],
    'showWeekNumbers': [{ type: Input },],
    'select': [{ type: Output },],
};

class NgbDatepickerNavigation {
    /**
     * @param {?} i18n
     * @param {?} _calendar
     */
    constructor(i18n, _calendar) {
        this.i18n = i18n;
        this._calendar = _calendar;
        this.navigation = NavigationEvent;
        this.navigate = new EventEmitter();
        this.select = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    doNavigate(event) { this.navigate.emit(event); }
    /**
     * @return {?}
     */
    nextDisabled() {
        return this.disabled || (this.maxDate && this._calendar.getNext(this.date, 'm').after(this.maxDate));
    }
    /**
     * @return {?}
     */
    prevDisabled() {
        const /** @type {?} */ prevDate = this._calendar.getPrev(this.date, 'm');
        return this.disabled || (this.minDate && prevDate.year <= this.minDate.year && prevDate.month < this.minDate.month);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    selectDate(date) { this.select.emit(date); }
}
NgbDatepickerNavigation.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-navigation',
                host: { 'class': 'd-flex justify-content-between', '[class.collapsed]': '!showSelect' },
                styles: [`
    :host {
      height: 2rem;
      line-height: 1.85rem;
    }
    :host.collapsed {
      margin-bottom: -2rem;        
    }
    .ngb-dp-navigation-chevron::before {
      border-style: solid;
      border-width: 0.2em 0.2em 0 0;
      content: '';
      display: inline-block;
      height: 0.75em;
      transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);
      -ms-transform: rotate(-135deg);
      width: 0.75em;
      margin: 0 0 0 0.5rem;
    }    
    .ngb-dp-navigation-chevron.right:before {
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      margin: 0 0.5rem 0 0;
    }
    .btn-link {
      cursor: pointer;
      outline: 0;
    }
    .btn-link[disabled] {
      cursor: not-allowed;
      opacity: .65;
    }    
  `],
                template: `
    <button type="button" class="btn-link" (click)="!!doNavigate(navigation.PREV)" [disabled]="prevDisabled()">
      <span class="ngb-dp-navigation-chevron"></span>    
    </button>
    
    <ngb-datepicker-navigation-select *ngIf="showSelect" class="d-block" [style.width.rem]="months * 9"
      [date]="date"
      [minDate]="minDate"
      [maxDate]="maxDate"
      [disabled] = "disabled"
      (select)="selectDate($event)">
    </ngb-datepicker-navigation-select>
    
    <button type="button" class="btn-link" (click)="!!doNavigate(navigation.NEXT)" [disabled]="nextDisabled()">
      <span class="ngb-dp-navigation-chevron right"></span>
    </button>
  `
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerNavigation.ctorParameters = () => [
    { type: NgbDatepickerI18n, },
    { type: NgbCalendar, },
];
NgbDatepickerNavigation.propDecorators = {
    'date': [{ type: Input },],
    'disabled': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'minDate': [{ type: Input },],
    'months': [{ type: Input },],
    'showSelect': [{ type: Input },],
    'showWeekNumbers': [{ type: Input },],
    'navigate': [{ type: Output },],
    'select': [{ type: Output },],
};

/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 * @abstract
 */
class NgbDateParserFormatter {
    /**
     * Parses the given value to an NgbDateStruct. Implementations should try their best to provide a result, even
     * partial. They must return null if the value can't be parsed.
     * @abstract
     * @param {?} value the value to parse
     * @return {?}
     */
    parse(value) { }
    /**
     * Formats the given date to a string. Implementations should return an empty string if the given date is null,
     * and try their best to provide a partial result if the given date is incomplete or invalid.
     * @abstract
     * @param {?} date the date to format as a string
     * @return {?}
     */
    format(date) { }
}
class NgbDateISOParserFormatter extends NgbDateParserFormatter {
    /**
     * @param {?} value
     * @return {?}
     */
    parse(value) {
        if (value) {
            const /** @type {?} */ dateParts = value.trim().split('-');
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
    }
    /**
     * @param {?} date
     * @return {?}
     */
    format(date) {
        return date ?
            `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
            '';
    }
}

class Positioning {
    /**
     * @param {?} element
     * @param {?} prop
     * @return {?}
     */
    getStyle(element, prop) { return window.getComputedStyle(element)[prop]; }
    /**
     * @param {?} element
     * @return {?}
     */
    isStaticPositioned(element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    }
    /**
     * @param {?} element
     * @return {?}
     */
    offsetParent(element) {
        let /** @type {?} */ offsetParentEl = (element.offsetParent) || document.documentElement;
        while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = (offsetParentEl.offsetParent);
        }
        return offsetParentEl || document.documentElement;
    }
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    position(element, round = true) {
        let /** @type {?} */ elPosition;
        let /** @type {?} */ parentOffset = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 };
        if (this.getStyle(element, 'position') === 'fixed') {
            elPosition = element.getBoundingClientRect();
        }
        else {
            const /** @type {?} */ offsetParentEl = this.offsetParent(element);
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
    }
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    offset(element, round = true) {
        const /** @type {?} */ elBcr = element.getBoundingClientRect();
        const /** @type {?} */ viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };
        let /** @type {?} */ elOffset = {
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
    }
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @param {?} placement
     * @param {?=} appendToBody
     * @return {?}
     */
    positionElements(hostElement, targetElement, placement, appendToBody) {
        const /** @type {?} */ hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
        const /** @type {?} */ targetElBCR = targetElement.getBoundingClientRect();
        const /** @type {?} */ placementPrimary = placement.split('-')[0] || 'top';
        const /** @type {?} */ placementSecondary = placement.split('-')[1] || 'center';
        let /** @type {?} */ targetElPosition = {
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
    }
}
const positionService = new Positioning();
/**
 * @param {?} hostElement
 * @param {?} targetElement
 * @param {?} placement
 * @param {?=} appendToBody
 * @return {?}
 */
function positionElements(hostElement, targetElement, placement, appendToBody) {
    const /** @type {?} */ pos = positionService.positionElements(hostElement, targetElement, placement, appendToBody);
    targetElement.style.top = `${pos.top}px`;
    targetElement.style.left = `${pos.left}px`;
}

const NGB_DATEPICKER_VALUE_ACCESSOR$1 = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbInputDatepicker),
    multi: true
};
const NGB_DATEPICKER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NgbInputDatepicker),
    multi: true
};
/**
 * A directive that makes it possible to have datepickers on input fields.
 * Manages integration with the input field itself (data entry) and ngModel (validation etc.).
 */
class NgbInputDatepicker {
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
    constructor(_parserFormatter, _elRef, _vcRef, _renderer, _cfr, ngZone, _service, _calendar) {
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
        this.navigate = new EventEmitter();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._validatorChange = () => { };
        this._zoneSubscription = ngZone.onStable.subscribe(() => {
            if (this._cRef) {
                positionElements(this._elRef.nativeElement, this._cRef.location.nativeElement, this.placement);
            }
        });
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this._onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this._onTouched = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._validatorChange = fn; }
    ;
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elRef.nativeElement, 'disabled', isDisabled);
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(isDisabled);
        }
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        const /** @type {?} */ value = c.value;
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
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        const /** @type {?} */ ngbDate = value ? new NgbDate(value.year, value.month, value.day) : null;
        this._model = this._calendar.isValid(value) ? ngbDate : null;
        this._writeModelValue(this._model);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    manualDateChange(value) {
        this._model = this._service.toValidDate(this._parserFormatter.parse(value), null);
        this._onChange(this._model ? this._model.toStruct() : (value === '' ? null : value));
        this._writeModelValue(this._model);
    }
    /**
     * @return {?}
     */
    isOpen() { return !!this._cRef; }
    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     * @return {?}
     */
    open() {
        if (!this.isOpen()) {
            const /** @type {?} */ cf = this._cfr.resolveComponentFactory(NgbDatepicker);
            this._cRef = this._vcRef.createComponent(cf);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._cRef.instance.writeValue(this._model);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
                this.close();
            });
        }
    }
    /**
     * Closes the datepicker popup.
     * @return {?}
     */
    close() {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
        }
    }
    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     * @return {?}
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    navigateTo(date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }
    /**
     * @return {?}
     */
    onBlur() { this._onTouched(); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    _applyDatepickerInputs(datepickerInstance) {
        ['dayTemplate', 'displayMonths', 'firstDayOfWeek', 'markDisabled', 'minDate', 'maxDate', 'navigation',
            'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
            .forEach((optionName) => {
            if (this[optionName] !== undefined) {
                datepickerInstance[optionName] = this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    }
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    _applyPopupStyling(nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
    }
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    _subscribeForDatepickerOutputs(datepickerInstance) {
        datepickerInstance.navigate.subscribe(date => this.navigate.emit(date));
    }
    /**
     * @param {?} model
     * @return {?}
     */
    _writeModelValue(model) {
        this._renderer.setProperty(this._elRef.nativeElement, 'value', this._parserFormatter.format(model));
        if (this.isOpen()) {
            this._cRef.instance.writeValue(model);
            this._onTouched();
        }
    }
}
NgbInputDatepicker.decorators = [
    { type: Directive, args: [{
                selector: 'input[ngbDatepicker]',
                exportAs: 'ngbDatepicker',
                host: { '(change)': 'manualDateChange($event.target.value)', '(keyup.esc)': 'close()', '(blur)': 'onBlur()' },
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR$1, NGB_DATEPICKER_VALIDATOR, NgbDatepickerService]
            },] },
];
/**
 * @nocollapse
 */
NgbInputDatepicker.ctorParameters = () => [
    { type: NgbDateParserFormatter, },
    { type: ElementRef, },
    { type: ViewContainerRef, },
    { type: Renderer2, },
    { type: ComponentFactoryResolver, },
    { type: NgZone, },
    { type: NgbDatepickerService, },
    { type: NgbCalendar, },
];
NgbInputDatepicker.propDecorators = {
    'dayTemplate': [{ type: Input },],
    'displayMonths': [{ type: Input },],
    'firstDayOfWeek': [{ type: Input },],
    'markDisabled': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'navigation': [{ type: Input },],
    'outsideDays': [{ type: Input },],
    'placement': [{ type: Input },],
    'showWeekdays': [{ type: Input },],
    'showWeekNumbers': [{ type: Input },],
    'startDate': [{ type: Input },],
    'navigate': [{ type: Output },],
};

class NgbDatepickerDayView {
    /**
     * @return {?}
     */
    isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
NgbDatepickerDayView.decorators = [
    { type: Component, args: [{
                selector: '[ngbDatepickerDayView]',
                styles: [`
    :host {
      text-align: center;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;      
      border-radius: 0.25rem;
    }
    :host.outside {
      opacity: 0.5;
    }
  `],
                host: {
                    '[class.bg-primary]': 'selected',
                    '[class.text-white]': 'selected',
                    '[class.text-muted]': 'isMuted()',
                    '[class.outside]': 'isMuted()',
                    '[class.btn-secondary]': '!disabled'
                },
                template: `{{ date.day }}`
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerDayView.ctorParameters = () => [];
NgbDatepickerDayView.propDecorators = {
    'currentMonth': [{ type: Input },],
    'date': [{ type: Input },],
    'disabled': [{ type: Input },],
    'selected': [{ type: Input },],
};

class NgbDatepickerNavigationSelect {
    /**
     * @param {?} i18n
     * @param {?} calendar
     */
    constructor(i18n, calendar) {
        this.i18n = i18n;
        this.calendar = calendar;
        this.years = [];
        this.select = new EventEmitter();
        this.months = calendar.getMonths();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['maxDate'] || changes['minDate'] || changes['date']) {
            this._generateYears();
            this._generateMonths();
        }
    }
    /**
     * @param {?} month
     * @return {?}
     */
    changeMonth(month) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); }
    /**
     * @param {?} year
     * @return {?}
     */
    changeYear(year) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); }
    /**
     * @return {?}
     */
    _generateMonths() {
        this.months = this.calendar.getMonths();
        if (this.date && this.date.year === this.minDate.year) {
            const /** @type {?} */ index = this.months.findIndex(month => month === this.minDate.month);
            this.months = this.months.slice(index);
        }
        if (this.date && this.date.year === this.maxDate.year) {
            const /** @type {?} */ index = this.months.findIndex(month => month === this.maxDate.month);
            this.months = this.months.slice(0, index + 1);
        }
    }
    /**
     * @return {?}
     */
    _generateYears() {
        this.years = Array.from({ length: this.maxDate.year - this.minDate.year + 1 }, (e, i) => this.minDate.year + i);
    }
}
NgbDatepickerNavigationSelect.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-navigation-select',
                styles: [`
    select {
      /* to align with btn-sm */
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;      
      line-height: 1.25;
      /* to cancel the custom height set by custom-select */
      height: inherit;
      width: 50%;
    }
  `],
                template: `
    <select [disabled]="disabled" class="custom-select d-inline-block" [value]="date?.month" (change)="changeMonth($event.target.value)">
      <option *ngFor="let m of months" [value]="m">{{ i18n.getMonthShortName(m) }}</option>
    </select>` +
                    `<select [disabled]="disabled" class="custom-select d-inline-block" [value]="date?.year" (change)="changeYear($event.target.value)">
      <option *ngFor="let y of years" [value]="y">{{ y }}</option>
    </select> 
  ` // template needs to be formatted in a certain way so we don't add empty text nodes
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerNavigationSelect.ctorParameters = () => [
    { type: NgbDatepickerI18n, },
    { type: NgbCalendar, },
];
NgbDatepickerNavigationSelect.propDecorators = {
    'date': [{ type: Input },],
    'disabled': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'minDate': [{ type: Input },],
    'select': [{ type: Output },],
};

/**
 * @abstract
 */
class NgbCalendarHijri extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        return date && isNumber(date.year) && isNumber(date.month) && isNumber(date.day) &&
            !isNaN(this.toGregorian(date).getTime());
    }
    /**
     * @param {?} date
     * @param {?} day
     * @return {?}
     */
    setDay(date, day) {
        day = +day;
        let /** @type {?} */ mDays = this.getDaysInIslamicMonth(date.month, date.year);
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
    }
    /**
     * @param {?} date
     * @param {?} month
     * @return {?}
     */
    setMonth(date, month) {
        month = +month;
        date.year = date.year + Math.floor((month - 1) / 12);
        date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
        return date;
    }
    /**
     * @param {?} date
     * @param {?} yearValue
     * @return {?}
     */
    setYear(date, yearValue) {
        date.year = +yearValue;
        return date;
    }
    /**
     * @abstract
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) { }
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period, number) { }
    /**
     * @abstract
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period, number) { }
    /**
     * @abstract
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) { }
    /**
     * @abstract
     * @return {?}
     */
    getToday() { }
    /**
     * Returns the equivalent Hijri date value for a give input Gregorian date.
     * `gDate` is s JS Date to be converted to Hijri.
     * @abstract
     * @param {?} gDate
     * @return {?}
     */
    fromGregorian(gDate) { }
    /**
     * Converts the current Hijri date to Gregorian.
     * @abstract
     * @param {?} hijriDate
     * @return {?}
     */
    toGregorian(hijriDate) { }
    /**
     * Returns the number of days in a specific Hijri month.
     * `month` is 1 for Muharram, 2 for Safar, etc.
     * `year` is any Hijri year.
     * @abstract
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    getDaysInIslamicMonth(month, year) { }
    /**
     * @param {?} year
     * @return {?}
     */
    _isIslamicLeapYear(year) { return (14 + 11 * year) % 30 < 11; }
    /**
     * Returns the start of Hijri Month.
     * `month` is 0 for Muharram, 1 for Safar, etc.
     * `year` is any Hijri year.
     * @param {?} year
     * @param {?} month
     * @return {?}
     */
    _getMonthStart(year, month) {
        return Math.ceil(29.5 * month) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
    }
    /**
     * Returns the start of Hijri year.
     * `year` is any Hijri year.
     * @param {?} year
     * @return {?}
     */
    _getYearStart(year) { return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0); }
}
NgbCalendarHijri.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbCalendarHijri.ctorParameters = () => [];

/**
 * @param {?} date
 * @return {?}
 */
function isGregorianLeapYear(date) {
    const /** @type {?} */ year = date.getFullYear();
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
const GREGORIAN_EPOCH = 1721425.5;
const ISLAMIC_EPOCH = 1948439.5;
class NgbCalendarIslamicCivil extends NgbCalendarHijri {
    /**
     * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
     * `gdate` is a JS Date to be converted to Hijri.
     * @param {?} gdate
     * @return {?}
     */
    fromGregorian(gdate) {
        const /** @type {?} */ date = new Date(gdate);
        const /** @type {?} */ gYear = date.getFullYear(), /** @type {?} */ gMonth = date.getMonth(), /** @type {?} */ gDay = date.getDate();
        let /** @type {?} */ julianDay = GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
            -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
            Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear(date) ? -1 : -2) + gDay);
        julianDay = Math.floor(julianDay) + 0.5;
        const /** @type {?} */ days = julianDay - ISLAMIC_EPOCH;
        const /** @type {?} */ hYear = Math.floor((30 * days + 10646) / 10631.0);
        let /** @type {?} */ hMonth = Math.ceil((days - 29 - this._getYearStart(hYear)) / 29.5);
        hMonth = Math.min(hMonth, 11);
        const /** @type {?} */ hDay = Math.ceil(days - this._getMonthStart(hYear, hMonth)) + 1;
        return new NgbDate(hYear, hMonth + 1, hDay);
    }
    /**
     * Returns the equivalent JS date value for a give input islamic(civil) date.
     * `hijriDate` is an islamic(civil) date to be converted to Gregorian.
     * @param {?} hijriDate
     * @return {?}
     */
    toGregorian(hijriDate) {
        const /** @type {?} */ hYear = hijriDate.year;
        const /** @type {?} */ hMonth = hijriDate.month - 1;
        const /** @type {?} */ hDate = hijriDate.day;
        const /** @type {?} */ julianDay = hDate + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) + ISLAMIC_EPOCH - 1;
        const /** @type {?} */ wjd = Math.floor(julianDay - 0.5) + 0.5, /** @type {?} */ depoch = wjd - GREGORIAN_EPOCH, /** @type {?} */ quadricent = Math.floor(depoch / 146097), /** @type {?} */ dqc = mod(depoch, 146097), /** @type {?} */ cent = Math.floor(dqc / 36524), /** @type {?} */ dcent = mod(dqc, 36524), /** @type {?} */ quad = Math.floor(dcent / 1461), /** @type {?} */ dquad = mod(dcent, 1461), /** @type {?} */ yindex = Math.floor(dquad / 365);
        let /** @type {?} */ year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
        if (!(cent === 4 || yindex === 4)) {
            year++;
        }
        const /** @type {?} */ gYearStart = GREGORIAN_EPOCH + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400);
        const /** @type {?} */ yearday = wjd - gYearStart;
        const /** @type {?} */ tjd = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) + Math.floor(739 / 12 + (isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);
        const /** @type {?} */ leapadj = wjd < tjd ? 0 : isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;
        const /** @type {?} */ month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
        const /** @type {?} */ tjd2 = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) +
            Math.floor((367 * month - 362) / 12 + (month <= 2 ? 0 : isGregorianLeapYear(new Date(year, month - 1, 1)) ? -1 : -2) +
                1);
        const /** @type {?} */ day = wjd - tjd2 + 1;
        return new Date(year, month - 1, day);
    }
    /**
     * Returns the number of days in a specific Hijri month.
     * `month` is 1 for Muharram, 2 for Safar, etc.
     * `year` is any Hijri year.
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    getDaysInIslamicMonth(month, year) {
        year = year + Math.floor(month / 13);
        month = ((month - 1) % 12) + 1;
        let /** @type {?} */ length = 29 + month % 2;
        if (month === 12 && this._isIslamicLeapYear(year)) {
            length++;
        }
        return length;
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
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
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        const /** @type {?} */ day = this.toGregorian(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        const /** @type {?} */ thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        const /** @type {?} */ date = week[thursdayIndex];
        const /** @type {?} */ jsDate = this.toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        const /** @type {?} */ time = jsDate.getTime();
        const /** @type {?} */ MuhDate = this.toGregorian(new NgbDate(date.year, 1, 1)); // Compare with Muharram 1
        return Math.floor(Math.round((time - MuhDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return this.fromGregorian(new Date()); }
}
NgbCalendarIslamicCivil.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbCalendarIslamicCivil.ctorParameters = () => [];

class NgbDatepickerModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: NgbDatepickerModule,
            providers: [
                { provide: NgbCalendar, useClass: NgbCalendarGregorian },
                { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault },
                { provide: NgbDateParserFormatter, useClass: NgbDateISOParserFormatter }, NgbDatepickerConfig
            ]
        };
    }
}
NgbDatepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView,
                    NgbInputDatepicker
                ],
                exports: [NgbDatepicker, NgbInputDatepicker],
                imports: [CommonModule, FormsModule],
                entryComponents: [NgbDatepicker]
            },] },
];
/**
 * @nocollapse
 */
NgbDatepickerModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbDropdown directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
class NgbDropdownConfig {
    constructor() {
        this.up = false;
        this.autoClose = true;
    }
}
NgbDropdownConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbDropdownConfig.ctorParameters = () => [];

/**
 * Transforms a node into a dropdown.
 */
class NgbDropdown {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         *  Defines whether or not the dropdown-menu is open initially.
         */
        this._open = false;
        /**
         *  An event fired when the dropdown is opened or closed.
         *  Event's payload equals whether dropdown is open.
         */
        this.openChange = new EventEmitter();
        this.up = config.up;
        this.autoClose = config.autoClose;
    }
    /**
     * Checks if the dropdown menu is open or not.
     * @return {?}
     */
    isOpen() { return this._open; }
    /**
     * Opens the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    open() {
        if (!this._open) {
            this._open = true;
            this.openChange.emit(true);
        }
    }
    /**
     * Closes the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    close() {
        if (this._open) {
            this._open = false;
            this.openChange.emit(false);
        }
    }
    /**
     * Toggles the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    closeFromOutsideClick($event) {
        if (this.autoClose && $event.button !== 2 && !this._isEventFromToggle($event)) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    closeFromOutsideEsc() {
        if (this.autoClose) {
            this.close();
        }
    }
    /**
     * \@internal
     * @param {?} toggleElement
     * @return {?}
     */
    set toggleElement(toggleElement) { this._toggleElement = toggleElement; }
    /**
     * @param {?} $event
     * @return {?}
     */
    _isEventFromToggle($event) { return !!this._toggleElement && this._toggleElement.contains($event.target); }
}
NgbDropdown.decorators = [
    { type: Directive, args: [{
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
NgbDropdown.ctorParameters = () => [
    { type: NgbDropdownConfig, },
];
NgbDropdown.propDecorators = {
    'up': [{ type: Input },],
    'autoClose': [{ type: Input },],
    '_open': [{ type: Input, args: ['open',] },],
    'openChange': [{ type: Output },],
};
/**
 * Allows the dropdown to be toggled via click. This directive is optional.
 */
class NgbDropdownToggle {
    /**
     * @param {?} dropdown
     * @param {?} elementRef
     */
    constructor(dropdown, elementRef) {
        this.dropdown = dropdown;
        dropdown.toggleElement = elementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    toggleOpen() { this.dropdown.toggle(); }
}
NgbDropdownToggle.decorators = [
    { type: Directive, args: [{
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
NgbDropdownToggle.ctorParameters = () => [
    { type: NgbDropdown, },
    { type: ElementRef, },
];

const NGB_DROPDOWN_DIRECTIVES = [NgbDropdownToggle, NgbDropdown];
class NgbDropdownModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbDropdownModule, providers: [NgbDropdownConfig] }; }
}
NgbDropdownModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES },] },
];
/**
 * @nocollapse
 */
NgbDropdownModule.ctorParameters = () => [];

class NgbModalBackdrop {
}
NgbModalBackdrop.decorators = [
    { type: Component, args: [{ selector: 'ngb-modal-backdrop', template: '', host: { 'class': 'modal-backdrop fade show' } },] },
];
/**
 * @nocollapse
 */
NgbModalBackdrop.ctorParameters = () => [];

let ModalDismissReasons = {};
ModalDismissReasons.BACKDROP_CLICK = 0;
ModalDismissReasons.ESC = 1;
ModalDismissReasons[ModalDismissReasons.BACKDROP_CLICK] = "BACKDROP_CLICK";
ModalDismissReasons[ModalDismissReasons.ESC] = "ESC";

class NgbModalWindow {
    /**
     * @param {?} _elRef
     * @param {?} _renderer
     */
    constructor(_elRef, _renderer) {
        this._elRef = _elRef;
        this._renderer = _renderer;
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new EventEmitter();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    backdropClick($event) {
        if (this.backdrop === true && this._elRef.nativeElement === $event.target) {
            this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    escKey($event) {
        if (this.keyboard && !$event.defaultPrevented) {
            this.dismiss(ModalDismissReasons.ESC);
        }
    }
    /**
     * @param {?} reason
     * @return {?}
     */
    dismiss(reason) { this.dismissEvent.emit(reason); }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._elWithFocus = document.activeElement;
        this._renderer.addClass(document.body, 'modal-open');
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (!this._elRef.nativeElement.contains(document.activeElement)) {
            this._elRef.nativeElement['focus'].apply(this._elRef.nativeElement, []);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._elWithFocus && document.body.contains(this._elWithFocus)) {
            this._elWithFocus['focus'].apply(this._elWithFocus, []);
        }
        else {
            document.body['focus'].apply(document.body, []);
        }
        this._elWithFocus = null;
        this._renderer.removeClass(document.body, 'modal-open');
    }
}
NgbModalWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-modal-window',
                host: {
                    '[class]': '"modal fade show" + (windowClass ? " " + windowClass : "")',
                    'role': 'dialog',
                    'tabindex': '-1',
                    'style': 'display: block;',
                    '(keyup.esc)': 'escKey($event)',
                    '(click)': 'backdropClick($event)'
                },
                template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `
            },] },
];
/**
 * @nocollapse
 */
NgbModalWindow.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
];
NgbModalWindow.propDecorators = {
    'backdrop': [{ type: Input },],
    'keyboard': [{ type: Input },],
    'size': [{ type: Input },],
    'windowClass': [{ type: Input },],
    'dismissEvent': [{ type: Output, args: ['dismiss',] },],
};

class ContentRef {
    /**
     * @param {?} nodes
     * @param {?=} viewRef
     * @param {?=} componentRef
     */
    constructor(nodes, viewRef, componentRef) {
        this.nodes = nodes;
        this.viewRef = viewRef;
        this.componentRef = componentRef;
    }
}
class PopupService {
    /**
     * @param {?} type
     * @param {?} _injector
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} componentFactoryResolver
     */
    constructor(type, _injector, _viewContainerRef, _renderer, componentFactoryResolver) {
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
    open(content, context) {
        if (!this._windowRef) {
            this._contentRef = this._getContentRef(content, context);
            this._windowRef =
                this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, this._contentRef.nodes);
        }
        return this._windowRef;
    }
    /**
     * @return {?}
     */
    close() {
        if (this._windowRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
            this._windowRef = null;
            if (this._contentRef.viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
                this._contentRef = null;
            }
        }
    }
    /**
     * @param {?} content
     * @param {?=} context
     * @return {?}
     */
    _getContentRef(content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            const /** @type {?} */ viewRef = this._viewContainerRef.createEmbeddedView(/** @type {?} */ (content), context);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else {
            return new ContentRef([[this._renderer.createText(`${content}`)]]);
        }
    }
}

/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
class NgbActiveModal {
    /**
     * Can be used to close a modal, passing an optional result.
     * @param {?=} result
     * @return {?}
     */
    close(result) { }
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     * @param {?=} reason
     * @return {?}
     */
    dismiss(reason) { }
}
NgbActiveModal.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbActiveModal.ctorParameters = () => [];
/**
 * A reference to a newly opened modal.
 */
class NgbModalRef {
    /**
     * @param {?} _windowCmptRef
     * @param {?} _contentRef
     * @param {?=} _backdropCmptRef
     */
    constructor(_windowCmptRef, _contentRef, _backdropCmptRef) {
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        _windowCmptRef.instance.dismissEvent.subscribe((reason) => { this.dismiss(reason); });
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    /**
     * The instance of component used as modal's content.
     * Undefined when a TemplateRef is used as modal's content.
     * @return {?}
     */
    get componentInstance() {
        if (this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * @param {?} instance
     * @return {?}
     */
    set componentInstance(instance) { }
    /**
     * Can be used to close a modal, passing an optional result.
     * @param {?=} result
     * @return {?}
     */
    close(result) {
        if (this._windowCmptRef) {
            this._resolve(result);
            this._removeModalElements();
        }
    }
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     * @param {?=} reason
     * @return {?}
     */
    dismiss(reason) {
        if (this._windowCmptRef) {
            this._reject(reason);
            this._removeModalElements();
        }
    }
    /**
     * @return {?}
     */
    _removeModalElements() {
        const /** @type {?} */ windowNativeEl = this._windowCmptRef.location.nativeElement;
        windowNativeEl.parentNode.removeChild(windowNativeEl);
        this._windowCmptRef.destroy();
        if (this._backdropCmptRef) {
            const /** @type {?} */ backdropNativeEl = this._backdropCmptRef.location.nativeElement;
            backdropNativeEl.parentNode.removeChild(backdropNativeEl);
            this._backdropCmptRef.destroy();
        }
        if (this._contentRef && this._contentRef.viewRef) {
            this._contentRef.viewRef.destroy();
        }
        this._windowCmptRef = null;
        this._backdropCmptRef = null;
        this._contentRef = null;
    }
}
NgbModalRef.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbModalRef.ctorParameters = () => [
    { type: ComponentRef, },
    { type: ContentRef, },
    { type: ComponentRef, },
];

class NgbModalStack {
    /**
     * @param {?} _applicationRef
     * @param {?} _injector
     * @param {?} _componentFactoryResolver
     */
    constructor(_applicationRef, _injector, _componentFactoryResolver) {
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
    open(moduleCFR, contentInjector, content, options) {
        const /** @type {?} */ containerSelector = options.container || 'body';
        const /** @type {?} */ containerEl = document.querySelector(containerSelector);
        if (!containerEl) {
            throw new Error(`The specified modal container "${containerSelector}" was not found in the DOM.`);
        }
        const /** @type {?} */ activeModal = new NgbActiveModal();
        const /** @type {?} */ contentRef = this._getContentRef(moduleCFR, contentInjector, content, activeModal);
        let /** @type {?} */ windowCmptRef;
        let /** @type {?} */ backdropCmptRef;
        let /** @type {?} */ ngbModalRef;
        if (options.backdrop !== false) {
            backdropCmptRef = this._backdropFactory.create(this._injector);
            this._applicationRef.attachView(backdropCmptRef.hostView);
            containerEl.appendChild(backdropCmptRef.location.nativeElement);
        }
        windowCmptRef = this._windowFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef);
        activeModal.close = (result) => { ngbModalRef.close(result); };
        activeModal.dismiss = (reason) => { ngbModalRef.dismiss(reason); };
        this._applyWindowOptions(windowCmptRef.instance, options);
        return ngbModalRef;
    }
    /**
     * @param {?} windowInstance
     * @param {?} options
     * @return {?}
     */
    _applyWindowOptions(windowInstance, options) {
        ['backdrop', 'keyboard', 'size', 'windowClass'].forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} context
     * @return {?}
     */
    _getContentRef(moduleCFR, contentInjector, content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            const /** @type {?} */ viewRef = content.createEmbeddedView(context);
            this._applicationRef.attachView(viewRef);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else if (isString(content)) {
            return new ContentRef([[document.createTextNode(`${content}`)]]);
        }
        else {
            const /** @type {?} */ contentCmptFactory = moduleCFR.resolveComponentFactory(content);
            const /** @type {?} */ modalContentInjector = ReflectiveInjector.resolveAndCreate([{ provide: NgbActiveModal, useValue: context }], contentInjector);
            const /** @type {?} */ componentRef = contentCmptFactory.create(modalContentInjector);
            this._applicationRef.attachView(componentRef.hostView);
            return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
        }
    }
}
NgbModalStack.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbModalStack.ctorParameters = () => [
    { type: ApplicationRef, },
    { type: Injector, },
    { type: ComponentFactoryResolver, },
];

/**
 * A service to open modal windows. Creating a modal is straightforward: create a template and pass it as an argument to
 * the "open" method!
 */
class NgbModal {
    /**
     * @param {?} _moduleCFR
     * @param {?} _injector
     * @param {?} _modalStack
     */
    constructor(_moduleCFR, _injector, _modalStack) {
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
    open(content, options = {}) {
        return this._modalStack.open(this._moduleCFR, this._injector, content, options);
    }
}
NgbModal.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbModal.ctorParameters = () => [
    { type: ComponentFactoryResolver, },
    { type: Injector, },
    { type: NgbModalStack, },
];

class NgbModalModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbModalModule, providers: [NgbModal, NgbModalStack] }; }
}
NgbModalModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbModalBackdrop, NgbModalWindow],
                entryComponents: [NgbModalBackdrop, NgbModalWindow],
                providers: [NgbModal]
            },] },
];
/**
 * @nocollapse
 */
NgbModalModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbPagination component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
class NgbPaginationConfig {
    constructor() {
        this.disabled = false;
        this.boundaryLinks = false;
        this.directionLinks = true;
        this.ellipses = true;
        this.maxSize = 0;
        this.pageSize = 10;
        this.rotate = false;
    }
}
NgbPaginationConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbPaginationConfig.ctorParameters = () => [];

/**
 * A directive that will take care of visualising a pagination bar and enable / disable buttons correctly!
 */
class NgbPagination {
    /**
     * @param {?} config
     */
    constructor(config) {
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
        this.pageChange = new EventEmitter(true);
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
    hasPrevious() { return this.page > 1; }
    /**
     * @return {?}
     */
    hasNext() { return this.page < this.pageCount; }
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    selectPage(pageNumber) { this._updatePages(pageNumber); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) { this._updatePages(this.page); }
    /**
     * \@internal
     * @param {?} pageNumber
     * @return {?}
     */
    isEllipsis(pageNumber) { return pageNumber === -1; }
    /**
     * Appends ellipses and first/last page number to the displayed pages
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    _applyEllipses(start, end) {
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
    }
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     * @return {?}
     */
    _applyRotation() {
        let /** @type {?} */ start = 0;
        let /** @type {?} */ end = this.pageCount;
        let /** @type {?} */ leftOffset = Math.floor(this.maxSize / 2);
        let /** @type {?} */ rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;
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
    }
    /**
     * Paginates page numbers based on maxSize items per page
     * @return {?}
     */
    _applyPagination() {
        let /** @type {?} */ page = Math.ceil(this.page / this.maxSize) - 1;
        let /** @type {?} */ start = page * this.maxSize;
        let /** @type {?} */ end = start + this.maxSize;
        return [start, end];
    }
    /**
     * @param {?} newPageNo
     * @return {?}
     */
    _setPageInRange(newPageNo) {
        const /** @type {?} */ prevPageNo = this.page;
        this.page = getValueInRange(newPageNo, this.pageCount, 1);
        if (this.page !== prevPageNo) {
            this.pageChange.emit(this.page);
        }
    }
    /**
     * @param {?} newPage
     * @return {?}
     */
    _updatePages(newPage) {
        this.pageCount = Math.ceil(this.collectionSize / this.pageSize);
        if (!isNumber(this.pageCount)) {
            this.pageCount = 0;
        }
        // fill-in model needed to render pages
        this.pages.length = 0;
        for (let /** @type {?} */ i = 1; i <= this.pageCount; i++) {
            this.pages.push(i);
        }
        // set page within 1..max range
        this._setPageInRange(newPage);
        // apply maxSize if necessary
        if (this.maxSize > 0 && this.pageCount > this.maxSize) {
            let /** @type {?} */ start = 0;
            let /** @type {?} */ end = this.pageCount;
            // either paginating or rotating page numbers
            if (this.rotate) {
                [start, end] = this._applyRotation();
            }
            else {
                [start, end] = this._applyPagination();
            }
            this.pages = this.pages.slice(start, end);
            // adding ellipses
            this._applyEllipses(start, end);
        }
    }
}
NgbPagination.decorators = [
    { type: Component, args: [{
                selector: 'ngb-pagination',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'role': 'navigation' },
                template: `
    <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
      <li *ngIf="boundaryLinks" class="page-item"
        [class.disabled]="!hasPrevious() || disabled">
        <a aria-label="First" class="page-link" href (click)="!!selectPage(1)" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <span aria-hidden="true">&laquo;&laquo;</span>
        </a>
      </li>

      <li *ngIf="directionLinks" class="page-item"
        [class.disabled]="!hasPrevious() || disabled">
        <a aria-label="Previous" class="page-link" href (click)="!!selectPage(page-1)" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled">
        <a *ngIf="isEllipsis(pageNumber)" class="page-link">...</a>
        <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="!!selectPage(pageNumber)">
          {{pageNumber}}
          <span *ngIf="pageNumber === page" class="sr-only">(current)</span>
        </a>
      </li>
      <li *ngIf="directionLinks" class="page-item" [class.disabled]="!hasNext() || disabled">
        <a aria-label="Next" class="page-link" href (click)="!!selectPage(page+1)" [attr.tabindex]="(hasNext() ? null : '-1')">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

      <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="!hasNext() || disabled">
        <a aria-label="Last" class="page-link" href (click)="!!selectPage(pageCount)" [attr.tabindex]="(hasNext() ? null : '-1')">
          <span aria-hidden="true">&raquo;&raquo;</span>
        </a>
      </li>
    </ul>
  `
            },] },
];
/**
 * @nocollapse
 */
NgbPagination.ctorParameters = () => [
    { type: NgbPaginationConfig, },
];
NgbPagination.propDecorators = {
    'disabled': [{ type: Input },],
    'boundaryLinks': [{ type: Input },],
    'directionLinks': [{ type: Input },],
    'ellipses': [{ type: Input },],
    'rotate': [{ type: Input },],
    'collectionSize': [{ type: Input },],
    'maxSize': [{ type: Input },],
    'page': [{ type: Input },],
    'pageSize': [{ type: Input },],
    'pageChange': [{ type: Output },],
    'size': [{ type: Input },],
};

class NgbPaginationModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbPaginationModule, providers: [NgbPaginationConfig] }; }
}
NgbPaginationModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbPagination], exports: [NgbPagination], imports: [CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbPaginationModule.ctorParameters = () => [];

class Trigger {
    /**
     * @param {?} open
     * @param {?=} close
     */
    constructor(open, close) {
        this.open = open;
        this.close = close;
        if (!close) {
            this.close = open;
        }
    }
    /**
     * @return {?}
     */
    isManual() { return this.open === 'manual' || this.close === 'manual'; }
}
const DEFAULT_ALIASES = {
    'hover': ['mouseenter', 'mouseleave']
};
/**
 * @param {?} triggers
 * @param {?=} aliases
 * @return {?}
 */
function parseTriggers(triggers, aliases = DEFAULT_ALIASES) {
    const /** @type {?} */ trimmedTriggers = (triggers || '').trim();
    if (trimmedTriggers.length === 0) {
        return [];
    }
    const /** @type {?} */ parsedTriggers = trimmedTriggers.split(/\s+/).map(trigger => trigger.split(':')).map((triggerPair) => {
        let /** @type {?} */ alias = aliases[triggerPair[0]] || triggerPair;
        return new Trigger(alias[0], alias[1]);
    });
    const /** @type {?} */ manualTriggers = parsedTriggers.filter(triggerPair => triggerPair.isManual());
    if (manualTriggers.length > 1) {
        throw 'Triggers parse error: only one manual trigger is allowed';
    }
    if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
        throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
    }
    return parsedTriggers;
}
const noopFn = () => { };
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
    const /** @type {?} */ parsedTriggers = parseTriggers(triggers);
    const /** @type {?} */ listeners = [];
    if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
        return noopFn;
    }
    parsedTriggers.forEach((trigger) => {
        if (trigger.open === trigger.close) {
            listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
        }
        else {
            listeners.push(renderer.listen(nativeElement, trigger.open, openFn), renderer.listen(nativeElement, trigger.close, closeFn));
        }
    });
    return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
}

/**
 * Configuration service for the NgbPopover directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
class NgbPopoverConfig {
    constructor() {
        this.placement = 'top';
        this.triggers = 'click';
    }
}
NgbPopoverConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbPopoverConfig.ctorParameters = () => [];

let nextId$2 = 0;
class NgbPopoverWindow {
    constructor() {
        this.placement = 'top';
    }
}
NgbPopoverWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-popover-window',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { '[class]': '"popover show popover-" + placement', 'role': 'tooltip', '[id]': 'id' },
                template: `
    <h3 class="popover-title">{{title}}</h3><div class="popover-content"><ng-content></ng-content></div>
    `
            },] },
];
/**
 * @nocollapse
 */
NgbPopoverWindow.ctorParameters = () => [];
NgbPopoverWindow.propDecorators = {
    'placement': [{ type: Input },],
    'title': [{ type: Input },],
    'id': [{ type: Input },],
};
/**
 * A lightweight, extensible directive for fancy popover creation.
 */
class NgbPopover {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} ngZone
     */
    constructor(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, ngZone) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /**
         * Emits an event when the popover is shown
         */
        this.shown = new EventEmitter();
        /**
         * Emits an event when the popover is hidden
         */
        this.hidden = new EventEmitter();
        this._ngbPopoverWindowId = `ngb-popover-${nextId$2++}`;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this._popupService = new PopupService(NgbPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(() => {
            if (this._windowRef) {
                positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body');
            }
        });
    }
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of the popover.
     * The context is an optional value to be injected into the popover template when it is created.
     * @param {?=} context
     * @return {?}
     */
    open(context) {
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
    }
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    close() {
        if (this._windowRef) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    }
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns whether or not the popover is currently being shown
     * @return {?}
     */
    isOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        this._unregisterListenersFn();
        this._zoneSubscription.unsubscribe();
    }
}
NgbPopover.decorators = [
    { type: Directive, args: [{ selector: '[ngbPopover]', exportAs: 'ngbPopover' },] },
];
/**
 * @nocollapse
 */
NgbPopover.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: Injector, },
    { type: ComponentFactoryResolver, },
    { type: ViewContainerRef, },
    { type: NgbPopoverConfig, },
    { type: NgZone, },
];
NgbPopover.propDecorators = {
    'ngbPopover': [{ type: Input },],
    'popoverTitle': [{ type: Input },],
    'placement': [{ type: Input },],
    'triggers': [{ type: Input },],
    'container': [{ type: Input },],
    'shown': [{ type: Output },],
    'hidden': [{ type: Output },],
};

class NgbPopoverModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbPopoverModule, providers: [NgbPopoverConfig] }; }
}
NgbPopoverModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbPopover, NgbPopoverWindow], exports: [NgbPopover], entryComponents: [NgbPopoverWindow] },] },
];
/**
 * @nocollapse
 */
NgbPopoverModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbProgressbar component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
class NgbProgressbarConfig {
    constructor() {
        this.max = 100;
        this.animated = false;
        this.striped = false;
        this.showValue = false;
    }
}
NgbProgressbarConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbProgressbarConfig.ctorParameters = () => [];

/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
class NgbProgressbar {
    /**
     * @param {?} config
     */
    constructor(config) {
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
    getValue() { return getValueInRange(this.value, this.max); }
    /**
     * @return {?}
     */
    getPercentValue() { return 100 * this.getValue() / this.max; }
}
NgbProgressbar.decorators = [
    { type: Component, args: [{
                selector: 'ngb-progressbar',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <div class="progress">
      <div class="progress-bar{{type ? ' bg-' + type : ''}}{{animated ? ' progress-bar-animated' : ''}}{{striped ?
    ' progress-bar-striped' : ''}}" role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
        <span *ngIf="showValue">{{getPercentValue()}}%</span><ng-content></ng-content>
      </div>
    </div>
  `
            },] },
];
/**
 * @nocollapse
 */
NgbProgressbar.ctorParameters = () => [
    { type: NgbProgressbarConfig, },
];
NgbProgressbar.propDecorators = {
    'max': [{ type: Input },],
    'animated': [{ type: Input },],
    'striped': [{ type: Input },],
    'showValue': [{ type: Input },],
    'type': [{ type: Input },],
    'value': [{ type: Input },],
};

class NgbProgressbarModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbProgressbarModule, providers: [NgbProgressbarConfig] }; }
}
NgbProgressbarModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbProgressbar], exports: [NgbProgressbar], imports: [CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbProgressbarModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbRating component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the ratings used in the application.
 */
class NgbRatingConfig {
    constructor() {
        this.max = 10;
        this.readonly = false;
        this.resettable = false;
    }
}
NgbRatingConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbRatingConfig.ctorParameters = () => [];

let Key = {};
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
const NGB_RATING_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbRating),
    multi: true
};
/**
 * Rating directive that will take care of visualising a star rating bar.
 */
class NgbRating {
    /**
     * @param {?} config
     * @param {?} _changeDetectorRef
     */
    constructor(config, _changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.contexts = [];
        this.disabled = false;
        /**
         * An event fired when a user is hovering over a given rating.
         * Event's payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event fired when a user stops hovering over a given rating.
         * Event's payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event fired when a user selects a new rating.
         * Event's payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter(true);
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.max = config.max;
        this.readonly = config.readonly;
    }
    /**
     * @return {?}
     */
    ariaValueText() { return `${this.nextRate} out of ${this.max}`; }
    /**
     * @param {?} value
     * @return {?}
     */
    enter(value) {
        if (!this.readonly && !this.disabled) {
            this._updateState(value);
        }
        this.hover.emit(value);
    }
    /**
     * @return {?}
     */
    handleBlur() { this.onTouched(); }
    /**
     * @param {?} value
     * @return {?}
     */
    handleClick(value) { this.update(this.resettable && this.rate === value ? 0 : value); }
    /**
     * @param {?} event
     * @return {?}
     */
    handleKeyDown(event) {
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
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['rate']) {
            this.update(this.rate);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.contexts = Array.from({ length: this.max }, () => ({ fill: 0 }));
        this._updateState(this.rate);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @return {?}
     */
    reset() {
        this.leave.emit(this.nextRate);
        this._updateState(this.rate);
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} value
     * @param {?=} internalChange
     * @return {?}
     */
    update(value, internalChange = true) {
        const /** @type {?} */ newRate = getValueInRange(value, this.max, 0);
        if (!this.readonly && !this.disabled && this.rate !== newRate) {
            this.rate = newRate;
            this.rateChange.emit(this.rate);
        }
        if (internalChange) {
            this.onChange(this.rate);
            this.onTouched();
        }
        this._updateState(this.rate);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.update(value, false);
        this._changeDetectorRef.markForCheck();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    _getFillValue(index) {
        const /** @type {?} */ diff = this.nextRate - index;
        if (diff >= 1) {
            return 100;
        }
        if (diff < 1 && diff > 0) {
            return Number.parseInt((diff * 100).toFixed(2));
        }
        return 0;
    }
    /**
     * @param {?} nextValue
     * @return {?}
     */
    _updateState(nextValue) {
        this.nextRate = nextValue;
        this.contexts.forEach((context, index) => context.fill = this._getFillValue(index));
    }
}
NgbRating.decorators = [
    { type: Component, args: [{
                selector: 'ngb-rating',
                changeDetection: ChangeDetectionStrategy.OnPush,
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
                template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="sr-only">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="readonly || disabled ? 'default' : 'pointer'">
        <ng-template [ngTemplateOutlet]="starTemplate || t" [ngOutletContext]="contexts[index]"></ng-template>
      </span>
    </ng-template>
  `,
                providers: [NGB_RATING_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
NgbRating.ctorParameters = () => [
    { type: NgbRatingConfig, },
    { type: ChangeDetectorRef, },
];
NgbRating.propDecorators = {
    'max': [{ type: Input },],
    'rate': [{ type: Input },],
    'readonly': [{ type: Input },],
    'resettable': [{ type: Input },],
    'starTemplate': [{ type: Input }, { type: ContentChild, args: [TemplateRef,] },],
    'hover': [{ type: Output },],
    'leave': [{ type: Output },],
    'rateChange': [{ type: Output },],
};

class NgbRatingModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbRatingModule, providers: [NgbRatingConfig] }; }
}
NgbRatingModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbRating], exports: [NgbRating], imports: [CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbRatingModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbTabset component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tabsets used in the application.
 */
class NgbTabsetConfig {
    constructor() {
        this.justify = 'start';
        this.type = 'tabs';
    }
}
NgbTabsetConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbTabsetConfig.ctorParameters = () => [];

let nextId$3 = 0;
/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
class NgbTabTitle {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbTabTitle.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbTabTitle]' },] },
];
/**
 * @nocollapse
 */
NgbTabTitle.ctorParameters = () => [
    { type: TemplateRef, },
];
/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
class NgbTabContent {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbTabContent.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbTabContent]' },] },
];
/**
 * @nocollapse
 */
NgbTabContent.ctorParameters = () => [
    { type: TemplateRef, },
];
/**
 * A directive representing an individual tab.
 */
class NgbTab {
    constructor() {
        /**
         * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
         */
        this.id = `ngb-tab-${nextId$3++}`;
        /**
         * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
         */
        this.disabled = false;
    }
}
NgbTab.decorators = [
    { type: Directive, args: [{ selector: 'ngb-tab' },] },
];
/**
 * @nocollapse
 */
NgbTab.ctorParameters = () => [];
NgbTab.propDecorators = {
    'id': [{ type: Input },],
    'title': [{ type: Input },],
    'disabled': [{ type: Input },],
    'contentTpl': [{ type: ContentChild, args: [NgbTabContent,] },],
    'titleTpl': [{ type: ContentChild, args: [NgbTabTitle,] },],
};
/**
 * A component that makes it easy to create tabbed interface.
 */
class NgbTabset {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * Whether the closed tabs should be hidden without destroying them
         */
        this.destroyOnHide = true;
        /**
         * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
         */
        this.tabChange = new EventEmitter();
        this.type = config.type;
        this.justify = config.justify;
    }
    /**
     * Selects the tab with the given id and shows its associated pane.
     * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
     * @param {?} tabId
     * @return {?}
     */
    select(tabId) {
        let /** @type {?} */ selectedTab = this._getTabById(tabId);
        if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
            let /** @type {?} */ defaultPrevented = false;
            this.tabChange.emit({ activeId: this.activeId, nextId: selectedTab.id, preventDefault: () => { defaultPrevented = true; } });
            if (!defaultPrevented) {
                this.activeId = selectedTab.id;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // auto-correct activeId that might have been set incorrectly as input
        let /** @type {?} */ activeTab = this._getTabById(this.activeId);
        this.activeId = activeTab ? activeTab.id : (this.tabs.length ? this.tabs.first.id : null);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    _getTabById(id) {
        let /** @type {?} */ tabsWithId = this.tabs.filter(tab => tab.id === id);
        return tabsWithId.length ? tabsWithId[0] : null;
    }
}
NgbTabset.decorators = [
    { type: Component, args: [{
                selector: 'ngb-tabset',
                exportAs: 'ngbTabset',
                template: `
    <ul [class]="'nav nav-' + type + ' justify-content-' + justify" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs">
        <a [id]="tab.id" class="nav-link" [class.active]="tab.id === activeId" [class.disabled]="tab.disabled"
          href (click)="!!select(tab.id)" role="tab" [attr.tabindex]="(tab.disabled ? '-1': undefined)"
          [attr.aria-controls]="(!destroyOnHide || tab.id === activeId ? tab.id + '-panel' : null)"
          [attr.aria-expanded]="tab.id === activeId" [attr.aria-disabled]="tab.disabled">
          {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div
          class="tab-pane {{tab.id === activeId ? 'active' : null}}"
          *ngIf="!destroyOnHide || tab.id === activeId"
          role="tabpanel"
          [attr.aria-labelledby]="tab.id" id="{{tab.id}}-panel"
          [attr.aria-expanded]="tab.id === activeId">
          <ng-template [ngTemplateOutlet]="tab.contentTpl.templateRef"></ng-template>
        </div>
      </ng-template>
    </div>
  `
            },] },
];
/**
 * @nocollapse
 */
NgbTabset.ctorParameters = () => [
    { type: NgbTabsetConfig, },
];
NgbTabset.propDecorators = {
    'tabs': [{ type: ContentChildren, args: [NgbTab,] },],
    'activeId': [{ type: Input },],
    'destroyOnHide': [{ type: Input },],
    'justify': [{ type: Input },],
    'type': [{ type: Input },],
    'tabChange': [{ type: Output },],
};

const NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];
class NgbTabsetModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTabsetModule, providers: [NgbTabsetConfig] }; }
}
NgbTabsetModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbTabsetModule.ctorParameters = () => [];

class NgbTime {
    /**
     * @param {?=} hour
     * @param {?=} minute
     * @param {?=} second
     */
    constructor(hour, minute, second) {
        this.hour = toInteger(hour);
        this.minute = toInteger(minute);
        this.second = toInteger(second);
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeHour(step = 1) { this.updateHour((isNaN(this.hour) ? 0 : this.hour) + step); }
    /**
     * @param {?} hour
     * @return {?}
     */
    updateHour(hour) {
        if (isNumber(hour)) {
            this.hour = (hour < 0 ? 24 + hour : hour) % 24;
        }
        else {
            this.hour = NaN;
        }
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeMinute(step = 1) { this.updateMinute((isNaN(this.minute) ? 0 : this.minute) + step); }
    /**
     * @param {?} minute
     * @return {?}
     */
    updateMinute(minute) {
        if (isNumber(minute)) {
            this.minute = minute % 60 < 0 ? 60 + minute % 60 : minute % 60;
            this.changeHour(Math.floor(minute / 60));
        }
        else {
            this.minute = NaN;
        }
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeSecond(step = 1) { this.updateSecond((isNaN(this.second) ? 0 : this.second) + step); }
    /**
     * @param {?} second
     * @return {?}
     */
    updateSecond(second) {
        if (isNumber(second)) {
            this.second = second < 0 ? 60 + second % 60 : second % 60;
            this.changeMinute(Math.floor(second / 60));
        }
        else {
            this.second = NaN;
        }
    }
    /**
     * @param {?=} checkSecs
     * @return {?}
     */
    isValid(checkSecs = true) {
        return isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true);
    }
    /**
     * @return {?}
     */
    toString() { return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`; }
}

/**
 * Configuration service for the NgbTimepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
class NgbTimepickerConfig {
    constructor() {
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
}
NgbTimepickerConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbTimepickerConfig.ctorParameters = () => [];

const NGB_TIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTimepicker),
    multi: true
};
/**
 * A lightweight & configurable timepicker directive.
 */
class NgbTimepicker {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.onChange = (_) => { };
        this.onTouched = () => { };
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
    writeValue(value) {
        this.model = value ? new NgbTime(value.hour, value.minute, value.second) : new NgbTime();
        if (!this.seconds && (!value || !isNumber(value.second))) {
            this.model.second = 0;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} step
     * @return {?}
     */
    changeHour(step) {
        this.model.changeHour(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeMinute(step) {
        this.model.changeMinute(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeSecond(step) {
        this.model.changeSecond(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateHour(newVal) {
        this.model.updateHour(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateMinute(newVal) {
        this.model.updateMinute(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateSecond(newVal) {
        this.model.updateSecond(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @return {?}
     */
    toggleMeridian() {
        if (this.meridian) {
            this.changeHour(12);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatHour(value) {
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
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatMinSec(value) { return padNumber(value); }
    /**
     * @return {?}
     */
    setFormControlSize() { return { 'form-control-sm': this.size === 'small', 'form-control-lg': this.size === 'large' }; }
    /**
     * @return {?}
     */
    setButtonSize() { return { 'btn-sm': this.size === 'small', 'btn-lg': this.size === 'large' }; }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
            this.model.second = 0;
            this.propagateModelChange(false);
        }
    }
    /**
     * @param {?=} touched
     * @return {?}
     */
    propagateModelChange(touched = true) {
        if (touched) {
            this.onTouched();
        }
        if (this.model.isValid(this.seconds)) {
            this.onChange({ hour: this.model.hour, minute: this.model.minute, second: this.model.second });
        }
        else {
            this.onChange(null);
        }
    }
}
NgbTimepicker.decorators = [
    { type: Component, args: [{
                selector: 'ngb-timepicker',
                styles: [`
    .ngb-tp {
      display: flex;
      align-items: center;
    }

    .ngb-tp-hour, .ngb-tp-minute, .ngb-tp-second, .ngb-tp-meridian {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }

    .ngb-tp-spacer {
      width: 1em;
      text-align: center;
    }

    .chevron::before {
      border-style: solid;
      border-width: 0.29em 0.29em 0 0;
      content: '';
      display: inline-block;
      height: 0.69em;
      left: 0.05em;
      position: relative;
      top: 0.15em;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      vertical-align: middle;
      width: 0.71em;
    }

    .chevron.bottom:before {
      top: -.3em;
      -webkit-transform: rotate(135deg);
      -ms-transform: rotate(135deg);
      transform: rotate(135deg);
    }

    .btn-link {
      outline: 0;
    }

    .btn-link.disabled {
      cursor: not-allowed;
      opacity: .65;
    }

    input {
      text-align: center;
      display: inline-block;
      width: auto;
    }
  `],
                template: `
    <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <div class="ngb-tp">
        <div class="ngb-tp-hour">
          <button *ngIf="spinners" type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeHour(hourStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only">Increment hours</span>
          </button>
          <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2" size="2" placeholder="HH"
            [value]="formatHour(model?.hour)" (change)="updateHour($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Hours">
          <button *ngIf="spinners" type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeHour(-hourStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only">Decrement hours</span>
          </button>
        </div>
        <div class="ngb-tp-spacer">:</div>
        <div class="ngb-tp-minute">
          <button *ngIf="spinners" type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeMinute(minuteStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only">Increment minutes</span>
          </button>
          <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2" size="2" placeholder="MM"
            [value]="formatMinSec(model?.minute)" (change)="updateMinute($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Minutes">
          <button *ngIf="spinners" type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeMinute(-minuteStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only">Decrement minutes</span>
          </button>
        </div>
        <div *ngIf="seconds" class="ngb-tp-spacer">:</div>
        <div *ngIf="seconds" class="ngb-tp-second">
          <button *ngIf="spinners" type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeSecond(secondStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only">Increment seconds</span>
          </button>
          <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2" size="2" placeholder="SS"
            [value]="formatMinSec(model?.second)" (change)="updateSecond($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Seconds">
          <button *ngIf="spinners" type="button" class="btn-link" [ngClass]="setButtonSize()" (click)="changeSecond(-secondStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only">Decrement seconds</span>
          </button>
        </div>
        <div *ngIf="meridian" class="ngb-tp-spacer"></div>
        <div *ngIf="meridian" class="ngb-tp-meridian">
          <button type="button" class="btn btn-outline-primary" [ngClass]="setButtonSize()"
            [disabled]="disabled" [class.disabled]="disabled"
            (click)="toggleMeridian()">{{model.hour >= 12 ? 'PM' : 'AM'}}</button>
        </div>
      </div>
    </fieldset>
  `,
                providers: [NGB_TIMEPICKER_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
NgbTimepicker.ctorParameters = () => [
    { type: NgbTimepickerConfig, },
];
NgbTimepicker.propDecorators = {
    'meridian': [{ type: Input },],
    'spinners': [{ type: Input },],
    'seconds': [{ type: Input },],
    'hourStep': [{ type: Input },],
    'minuteStep': [{ type: Input },],
    'secondStep': [{ type: Input },],
    'readonlyInputs': [{ type: Input },],
    'size': [{ type: Input },],
};

class NgbTimepickerModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTimepickerModule, providers: [NgbTimepickerConfig] }; }
}
NgbTimepickerModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [CommonModule] },] },
];
/**
 * @nocollapse
 */
NgbTimepickerModule.ctorParameters = () => [];

/**
 * Configuration service for the NgbTooltip directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
class NgbTooltipConfig {
    constructor() {
        this.placement = 'top';
        this.triggers = 'hover';
    }
}
NgbTooltipConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbTooltipConfig.ctorParameters = () => [];

let nextId$4 = 0;
class NgbTooltipWindow {
    constructor() {
        this.placement = 'top';
    }
}
NgbTooltipWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-tooltip-window',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { '[class]': '"tooltip show tooltip-" + placement', 'role': 'tooltip', '[id]': 'id' },
                template: `
    <div class="tooltip-inner"><ng-content></ng-content></div>
    `
            },] },
];
/**
 * @nocollapse
 */
NgbTooltipWindow.ctorParameters = () => [];
NgbTooltipWindow.propDecorators = {
    'placement': [{ type: Input },],
    'id': [{ type: Input },],
};
/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
class NgbTooltip {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} ngZone
     */
    constructor(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, ngZone) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /**
         * Emits an event when the tooltip is shown
         */
        this.shown = new EventEmitter();
        /**
         * Emits an event when the tooltip is hidden
         */
        this.hidden = new EventEmitter();
        this._ngbTooltipWindowId = `ngb-tooltip-${nextId$4++}`;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(() => {
            if (this._windowRef) {
                positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body');
            }
        });
    }
    /**
     * Content to be displayed as tooltip. If falsy, the tooltip won't open.
     * @param {?} value
     * @return {?}
     */
    set ngbTooltip(value) {
        this._ngbTooltip = value;
        if (!value && this._windowRef) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    get ngbTooltip() { return this._ngbTooltip; }
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * The context is an optional value to be injected into the tooltip template when it is created.
     * @param {?=} context
     * @return {?}
     */
    open(context) {
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
    }
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    close() {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    }
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns whether or not the tooltip is currently being shown
     * @return {?}
     */
    isOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        this._unregisterListenersFn();
        this._zoneSubscription.unsubscribe();
    }
}
NgbTooltip.decorators = [
    { type: Directive, args: [{ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' },] },
];
/**
 * @nocollapse
 */
NgbTooltip.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: Injector, },
    { type: ComponentFactoryResolver, },
    { type: ViewContainerRef, },
    { type: NgbTooltipConfig, },
    { type: NgZone, },
];
NgbTooltip.propDecorators = {
    'placement': [{ type: Input },],
    'triggers': [{ type: Input },],
    'container': [{ type: Input },],
    'shown': [{ type: Output },],
    'hidden': [{ type: Output },],
    'ngbTooltip': [{ type: Input },],
};

class NgbTooltipModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTooltipModule, providers: [NgbTooltipConfig] }; }
}
NgbTooltipModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip], entryComponents: [NgbTooltipWindow] },] },
];
/**
 * @nocollapse
 */
NgbTooltipModule.ctorParameters = () => [];

class NgbHighlight {
    constructor() {
        this.highlightClass = 'ngb-highlight';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const /** @type {?} */ resultStr = toString(this.result);
        const /** @type {?} */ resultLC = resultStr.toLowerCase();
        const /** @type {?} */ termLC = toString(this.term).toLowerCase();
        let /** @type {?} */ currentIdx = 0;
        if (termLC.length > 0) {
            this.parts = resultLC.split(new RegExp(`(${regExpEscape(termLC)})`)).map((part) => {
                const /** @type {?} */ originalPart = resultStr.substr(currentIdx, part.length);
                currentIdx += part.length;
                return originalPart;
            });
        }
        else {
            this.parts = [resultStr];
        }
    }
}
NgbHighlight.decorators = [
    { type: Component, args: [{
                selector: 'ngb-highlight',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
                    `<span *ngIf="isOdd" class="{{highlightClass}}">{{part}}</span><ng-template [ngIf]="!isOdd">{{part}}</ng-template>` +
                    `</ng-template>`,
                styles: [`
    .ngb-highlight {
      font-weight: bold;
    }
  `]
            },] },
];
/**
 * @nocollapse
 */
NgbHighlight.ctorParameters = () => [];
NgbHighlight.propDecorators = {
    'highlightClass': [{ type: Input },],
    'result': [{ type: Input },],
    'term': [{ type: Input },],
};

class NgbTypeaheadWindow {
    constructor() {
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
        this.selectEvent = new EventEmitter();
        this.activeChangeEvent = new EventEmitter();
    }
    /**
     * @param {?} result
     * @return {?}
     */
    _getResultContext(result) { return { result: result, term: this.term, formatter: this.formatter }; }
    /**
     * @return {?}
     */
    getActive() { return this.results[this.activeIdx]; }
    /**
     * @param {?} activeIdx
     * @return {?}
     */
    markActive(activeIdx) {
        this.activeIdx = activeIdx;
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    next() {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        }
        else {
            this.activeIdx++;
        }
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    prev() {
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
    }
    /**
     * @param {?} item
     * @return {?}
     */
    select(item) { this.selectEvent.emit(item); }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.activeIdx = this.focusFirst ? 0 : -1;
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    _activeChanged() {
        this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
    }
}
NgbTypeaheadWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-typeahead-window',
                exportAs: 'ngbTypeaheadWindow',
                host: { 'class': 'dropdown-menu', 'style': 'display: block', 'role': 'listbox', '[id]': 'id' },
                template: `
    <ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </ng-template>
    <ng-template ngFor [ngForOf]="results" let-result let-idx="index">
      <button type="button" class="dropdown-item" role="option"
        [id]="id + '-' + idx"
        [class.active]="idx === activeIdx"
        (mouseenter)="markActive(idx)"
        (click)="select(result)">
          <ng-template [ngTemplateOutlet]="resultTemplate || rt"
          [ngOutletContext]="_getResultContext(result)"></ng-template>
      </button>
    </ng-template>
  `
            },] },
];
/**
 * @nocollapse
 */
NgbTypeaheadWindow.ctorParameters = () => [];
NgbTypeaheadWindow.propDecorators = {
    'id': [{ type: Input },],
    'focusFirst': [{ type: Input },],
    'results': [{ type: Input },],
    'term': [{ type: Input },],
    'formatter': [{ type: Input },],
    'resultTemplate': [{ type: Input },],
    'selectEvent': [{ type: Output, args: ['select',] },],
    'activeChangeEvent': [{ type: Output, args: ['activeChange',] },],
};

/**
 * Configuration service for the NgbTypeahead component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the typeaheads used in the application.
 */
class NgbTypeaheadConfig {
    constructor() {
        this.editable = true;
        this.focusFirst = true;
        this.showHint = false;
    }
}
NgbTypeaheadConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgbTypeaheadConfig.ctorParameters = () => [];

let Key$1 = {};
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
const NGB_TYPEAHEAD_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTypeahead),
    multi: true
};
let nextWindowId = 0;
/**
 * NgbTypeahead directive provides a simple way of creating powerful typeaheads from any text input
 */
class NgbTypeahead {
    /**
     * @param {?} _elementRef
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} _injector
     * @param {?} componentFactoryResolver
     * @param {?} config
     * @param {?} ngZone
     */
    constructor(_elementRef, _viewContainerRef, _renderer, _injector, componentFactoryResolver, config, ngZone) {
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._injector = _injector;
        /**
         * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
         */
        this.selectItem = new EventEmitter();
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._onTouched = () => { };
        this._onChange = (_) => { };
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this._valueChanges = fromEvent(_elementRef.nativeElement, 'input', ($event) => $event.target.value);
        this._popupService = new PopupService(NgbTypeaheadWindow, _injector, _viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(() => {
            if (this.isPopupOpen()) {
                positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, 'bottom-left');
            }
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ inputValues$ = _do.call(this._valueChanges, value => {
            this._userInput = value;
            if (this.editable) {
                this._onChange(value);
            }
        });
        const /** @type {?} */ results$ = letProto.call(inputValues$, this.ngbTypeahead);
        const /** @type {?} */ userInput$ = _do.call(results$, () => {
            if (!this.editable) {
                this._onChange(undefined);
            }
        });
        this._subscription = this._subscribeToUserInput(userInput$);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._unsubscribeFromUserInput();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this._onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this._onTouched = fn; }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) { this._writeInputValue(this._formatItemForInput(value)); }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * @return {?}
     */
    dismissPopup() {
        if (this.isPopupOpen()) {
            this._closePopup();
            this._writeInputValue(this._userInput);
        }
    }
    /**
     * @return {?}
     */
    isPopupOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    handleBlur() { this._onTouched(); }
    /**
     * @param {?} event
     * @return {?}
     */
    handleKeyDown(event) {
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
                    const /** @type {?} */ result = this._windowRef.instance.getActive();
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
    }
    /**
     * @return {?}
     */
    _openPopup() {
        if (!this.isPopupOpen()) {
            this._windowRef = this._popupService.open();
            this._windowRef.instance.id = this.popupId;
            this._windowRef.instance.selectEvent.subscribe((result) => this._selectResultClosePopup(result));
            this._windowRef.instance.activeChangeEvent.subscribe((activeId) => this.activeDescendant = activeId);
        }
    }
    /**
     * @return {?}
     */
    _closePopup() {
        this._popupService.close();
        this._windowRef = null;
        this.activeDescendant = undefined;
    }
    /**
     * @param {?} result
     * @return {?}
     */
    _selectResult(result) {
        let /** @type {?} */ defaultPrevented = false;
        this.selectItem.emit({ item: result, preventDefault: () => { defaultPrevented = true; } });
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    }
    /**
     * @param {?} result
     * @return {?}
     */
    _selectResultClosePopup(result) {
        this._selectResult(result);
        this._closePopup();
    }
    /**
     * @return {?}
     */
    _showHint() {
        if (this.showHint) {
            const /** @type {?} */ userInputLowerCase = this._userInput.toLowerCase();
            const /** @type {?} */ formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substr(0, this._userInput.length).toLowerCase()) {
                this._writeInputValue(this._userInput + formattedVal.substr(this._userInput.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [this._userInput.length, formattedVal.length]);
            }
            else {
                this.writeValue(this._windowRef.instance.getActive());
            }
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    _formatItemForInput(item) {
        return item && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _writeInputValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
    }
    /**
     * @param {?} userInput$
     * @return {?}
     */
    _subscribeToUserInput(userInput$) {
        return userInput$.subscribe((results) => {
            if (!results || results.length === 0) {
                this._closePopup();
            }
            else {
                this._openPopup();
                this._windowRef.instance.focusFirst = this.focusFirst;
                this._windowRef.instance.results = results;
                this._windowRef.instance.term = this._elementRef.nativeElement.value;
                if (this.resultFormatter) {
                    this._windowRef.instance.formatter = this.resultFormatter;
                }
                if (this.resultTemplate) {
                    this._windowRef.instance.resultTemplate = this.resultTemplate;
                }
                this._showHint();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                this._windowRef.changeDetectorRef.detectChanges();
            }
        });
    }
    /**
     * @return {?}
     */
    _unsubscribeFromUserInput() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    }
}
NgbTypeahead.decorators = [
    { type: Directive, args: [{
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
NgbTypeahead.ctorParameters = () => [
    { type: ElementRef, },
    { type: ViewContainerRef, },
    { type: Renderer2, },
    { type: Injector, },
    { type: ComponentFactoryResolver, },
    { type: NgbTypeaheadConfig, },
    { type: NgZone, },
];
NgbTypeahead.propDecorators = {
    'editable': [{ type: Input },],
    'focusFirst': [{ type: Input },],
    'inputFormatter': [{ type: Input },],
    'ngbTypeahead': [{ type: Input },],
    'resultFormatter': [{ type: Input },],
    'resultTemplate': [{ type: Input },],
    'showHint': [{ type: Input },],
    'selectItem': [{ type: Output },],
};

class NgbTypeaheadModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTypeaheadModule, providers: [NgbTypeaheadConfig] }; }
}
NgbTypeaheadModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
                exports: [NgbTypeahead, NgbHighlight],
                imports: [CommonModule],
                entryComponents: [NgbTypeaheadWindow]
            },] },
];
/**
 * @nocollapse
 */
NgbTypeaheadModule.ctorParameters = () => [];

const NGB_MODULES = [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
    NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule,
    NgbTabsetModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
];
class NgbRootModule {
}
NgbRootModule.decorators = [
    { type: NgModule, args: [{
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
NgbRootModule.ctorParameters = () => [];
class NgbModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbRootModule }; }
}
NgbModule.decorators = [
    { type: NgModule, args: [{ imports: NGB_MODULES, exports: NGB_MODULES },] },
];
/**
 * @nocollapse
 */
NgbModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { NgbAccordionModule, NgbAccordionConfig, NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbAlertModule, NgbAlertConfig, NgbAlert, NgbButtonsModule, NgbRadioGroup, NgbCarouselModule, NgbCarouselConfig, NgbCarousel, NgbSlide, NgbCollapseModule, NgbCollapse, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerModule, NgbDatepickerI18n, NgbDatepickerConfig, NgbDateParserFormatter, NgbDatepicker, NgbInputDatepicker, NgbDropdownModule, NgbDropdownConfig, NgbDropdown, NgbModalModule, NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons, NgbModalStack, ContentRef, NgbModalBackdrop, isDefined, isString, NgbPaginationModule, NgbPaginationConfig, NgbPagination, NgbPopoverModule, NgbPopoverConfig, NgbPopover, NgbProgressbarModule, NgbProgressbarConfig, NgbProgressbar, NgbRatingModule, NgbRatingConfig, NgbRating, NgbTabsetModule, NgbTabsetConfig, NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTimepickerModule, NgbTimepickerConfig, NgbTimepicker, NgbTooltipModule, NgbTooltipConfig, NgbTooltip, NgbHighlight, NgbTypeaheadModule, NgbTypeaheadConfig, NgbTypeahead, NgbRootModule, NgbModule, NgbActiveLabel as ɵa, NgbRadio as ɵb, NGB_CAROUSEL_DIRECTIVES as ɵc, NgbDatepickerDayView as ɵf, NgbDatepickerI18nDefault as ɵi, NgbDatepickerMonthView as ɵe, NgbDatepickerNavigation as ɵg, NgbDatepickerNavigationSelect as ɵh, NgbDatepickerService as ɵo, NgbCalendarHijri as ɵq, NgbCalendarGregorian as ɵd, NgbDateISOParserFormatter as ɵj, NgbDropdownToggle as ɵk, NgbModalWindow as ɵp, NgbPopoverWindow as ɵl, NgbTooltipWindow as ɵm, NgbTypeaheadWindow as ɵn };
//# sourceMappingURL=ng-bootstrap.js.map
