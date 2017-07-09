import { Component, EventEmitter, Injectable, Input, NgModule, Output, ViewChild, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';
import { CommonModule } from '@angular/common';

class DateFormatter {
    /**
     * @param {?} date
     * @param {?} format
     * @return {?}
     */
    format(date, format) {
        return moment(date.getTime()).format(format);
    }
}

/* tslint:disable:max-file-line-count */
class DatePickerInnerComponent {
    constructor() {
        this.selectionDone = new EventEmitter(undefined);
        this.update = new EventEmitter(false);
        this.activeDateChange = new EventEmitter(undefined);
        this.stepDay = {};
        this.stepMonth = {};
        this.stepYear = {};
        this.modes = ['day', 'month', 'year'];
        this.dateFormatter = new DateFormatter();
    }
    /**
     * @return {?}
     */
    get activeDate() {
        return this._activeDate;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        this._activeDate = value;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // todo: use date for unique value
        this.uniqueId = 'datepicker-' + '-' + Math.floor(Math.random() * 10000);
        if (this.initDate) {
            this.activeDate = this.initDate;
            this.selectedDate = new Date(/** @type {?} */ (this.activeDate.valueOf()));
            this.update.emit(this.activeDate);
        }
        else if (this.activeDate === undefined) {
            this.activeDate = new Date();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.refreshView();
    }
    /**
     * @param {?} handler
     * @param {?} type
     * @return {?}
     */
    setCompareHandler(handler, type) {
        if (type === 'day') {
            this.compareHandlerDay = handler;
        }
        if (type === 'month') {
            this.compareHandlerMonth = handler;
        }
        if (type === 'year') {
            this.compareHandlerYear = handler;
        }
    }
    /**
     * @param {?} date1
     * @param {?} date2
     * @return {?}
     */
    compare(date1, date2) {
        if (date1 === undefined || date2 === undefined) {
            return undefined;
        }
        if (this.datepickerMode === 'day' && this.compareHandlerDay) {
            return this.compareHandlerDay(date1, date2);
        }
        if (this.datepickerMode === 'month' && this.compareHandlerMonth) {
            return this.compareHandlerMonth(date1, date2);
        }
        if (this.datepickerMode === 'year' && this.compareHandlerYear) {
            return this.compareHandlerYear(date1, date2);
        }
        return void 0;
    }
    /**
     * @param {?} handler
     * @param {?} type
     * @return {?}
     */
    setRefreshViewHandler(handler, type) {
        if (type === 'day') {
            this.refreshViewHandlerDay = handler;
        }
        if (type === 'month') {
            this.refreshViewHandlerMonth = handler;
        }
        if (type === 'year') {
            this.refreshViewHandlerYear = handler;
        }
    }
    /**
     * @return {?}
     */
    refreshView() {
        if (this.datepickerMode === 'day' && this.refreshViewHandlerDay) {
            this.refreshViewHandlerDay();
        }
        if (this.datepickerMode === 'month' && this.refreshViewHandlerMonth) {
            this.refreshViewHandlerMonth();
        }
        if (this.datepickerMode === 'year' && this.refreshViewHandlerYear) {
            this.refreshViewHandlerYear();
        }
    }
    /**
     * @param {?} date
     * @param {?} format
     * @return {?}
     */
    dateFilter(date, format) {
        return this.dateFormatter.format(date, format);
    }
    /**
     * @param {?} dateObject
     * @return {?}
     */
    isActive(dateObject) {
        if (this.compare(dateObject.date, this.activeDate) === 0) {
            this.activeDateId = dateObject.uid;
            return true;
        }
        return false;
    }
    /**
     * @param {?} date
     * @param {?} format
     * @return {?}
     */
    createDateObject(date, format) {
        let /** @type {?} */ dateObject = {};
        dateObject.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        dateObject.label = this.dateFilter(date, format);
        dateObject.selected = this.compare(date, this.selectedDate) === 0;
        dateObject.disabled = this.isDisabled(date);
        dateObject.current = this.compare(date, new Date()) === 0;
        dateObject.customClass = this.getCustomClassForDate(dateObject.date);
        return dateObject;
    }
    /**
     * @param {?} arr
     * @param {?} size
     * @return {?}
     */
    split(arr, size) {
        let /** @type {?} */ arrays = [];
        while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
        }
        return arrays;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    fixTimeZone(date) {
        let /** @type {?} */ hours = date.getHours();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours === 23 ? hours + 2 : 0);
    }
    /**
     * @param {?} date
     * @param {?=} isManual
     * @return {?}
     */
    select(date, isManual = true) {
        if (this.datepickerMode === this.minMode) {
            if (!this.activeDate) {
                this.activeDate = new Date(0, 0, 0, 0, 0, 0, 0);
            }
            this.activeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (isManual) {
                this.selectionDone.emit(this.activeDate);
            }
        }
        else {
            this.activeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) - 1];
        }
        this.selectedDate = new Date(/** @type {?} */ (this.activeDate.valueOf()));
        this.update.emit(this.activeDate);
        this.refreshView();
    }
    /**
     * @param {?} direction
     * @return {?}
     */
    move(direction) {
        let /** @type {?} */ expectedStep;
        if (this.datepickerMode === 'day') {
            expectedStep = this.stepDay;
        }
        if (this.datepickerMode === 'month') {
            expectedStep = this.stepMonth;
        }
        if (this.datepickerMode === 'year') {
            expectedStep = this.stepYear;
        }
        if (expectedStep) {
            let /** @type {?} */ year = this.activeDate.getFullYear() + direction * (expectedStep.years || 0);
            let /** @type {?} */ month = this.activeDate.getMonth() + direction * (expectedStep.months || 0);
            this.activeDate = new Date(year, month, 1);
            this.refreshView();
            this.activeDateChange.emit(this.activeDate);
        }
    }
    /**
     * @param {?} direction
     * @return {?}
     */
    toggleMode(direction) {
        direction = direction || 1;
        if ((this.datepickerMode === this.maxMode && direction === 1) ||
            (this.datepickerMode === this.minMode && direction === -1)) {
            return;
        }
        this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) + direction];
        this.refreshView();
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getCustomClassForDate(date) {
        if (!this.customClass) {
            return '';
        }
        // todo: build a hash of custom classes, it will work faster
        const /** @type {?} */ customClassObject = this.customClass
            .find((customClass) => {
            return customClass.date.valueOf() === date.valueOf() &&
                customClass.mode === this.datepickerMode;
        }, this);
        return customClassObject === undefined ? '' : customClassObject.clazz;
    }
    /**
     * @param {?} date1Disabled
     * @param {?} date2
     * @return {?}
     */
    compareDateDisabled(date1Disabled, date2) {
        if (date1Disabled === undefined || date2 === undefined) {
            return undefined;
        }
        if (date1Disabled.mode === 'day' && this.compareHandlerDay) {
            return this.compareHandlerDay(date1Disabled.date, date2);
        }
        if (date1Disabled.mode === 'month' && this.compareHandlerMonth) {
            return this.compareHandlerMonth(date1Disabled.date, date2);
        }
        if (date1Disabled.mode === 'year' && this.compareHandlerYear) {
            return this.compareHandlerYear(date1Disabled.date, date2);
        }
        return undefined;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isDisabled(date) {
        let /** @type {?} */ isDateDisabled = false;
        if (this.dateDisabled) {
            this.dateDisabled.forEach((disabledDate) => {
                if (this.compareDateDisabled(disabledDate, date) === 0) {
                    isDateDisabled = true;
                }
            });
        }
        return (isDateDisabled || (this.minDate && this.compare(date, this.minDate) < 0) ||
            (this.maxDate && this.compare(date, this.maxDate) > 0));
    }
}
DatePickerInnerComponent.decorators = [
    { type: Component, args: [{
                selector: 'datepicker-inner',
                template: `
    <div *ngIf="datepickerMode" class="well well-sm bg-faded p-a card" role="application" ><!--&lt;!&ndash;ng-keydown="keydown($event)"&ndash;&gt;-->
      <ng-content></ng-content>
    </div>
  `
            },] },
];
/**
 * @nocollapse
 */
DatePickerInnerComponent.ctorParameters = () => [];
DatePickerInnerComponent.propDecorators = {
    'datepickerMode': [{ type: Input },],
    'startingDay': [{ type: Input },],
    'yearRange': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'minMode': [{ type: Input },],
    'maxMode': [{ type: Input },],
    'showWeeks': [{ type: Input },],
    'formatDay': [{ type: Input },],
    'formatMonth': [{ type: Input },],
    'formatYear': [{ type: Input },],
    'formatDayHeader': [{ type: Input },],
    'formatDayTitle': [{ type: Input },],
    'formatMonthTitle': [{ type: Input },],
    'onlyCurrentMonth': [{ type: Input },],
    'shortcutPropagation': [{ type: Input },],
    'customClass': [{ type: Input },],
    'monthColLimit': [{ type: Input },],
    'yearColLimit': [{ type: Input },],
    'dateDisabled': [{ type: Input },],
    'initDate': [{ type: Input },],
    'selectionDone': [{ type: Output },],
    'update': [{ type: Output },],
    'activeDateChange': [{ type: Output },],
    'activeDate': [{ type: Input },],
};

class DatepickerConfig {
    constructor() {
        this.datepickerMode = 'day';
        this.startingDay = 0;
        this.yearRange = 20;
        this.minMode = 'day';
        this.maxMode = 'year';
        this.showWeeks = true;
        this.formatDay = 'DD';
        this.formatMonth = 'MMMM';
        this.formatYear = 'YYYY';
        this.formatDayHeader = 'dd';
        this.formatDayTitle = 'MMMM YYYY';
        this.formatMonthTitle = 'YYYY';
        this.onlyCurrentMonth = false;
        this.monthColLimit = 3;
        this.yearColLimit = 5;
        this.shortcutPropagation = false;
    }
}
DatepickerConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DatepickerConfig.ctorParameters = () => [];

const DATEPICKER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
};
class DatePickerComponent {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * sets datepicker mode, supports: `day`, `month`, `year`
         */
        this.datepickerMode = 'day';
        /**
         * if false week numbers will be hidden
         */
        this.showWeeks = true;
        this.selectionDone = new EventEmitter(undefined);
        /**
         * callback to invoke when the activeDate is changed.
         */
        this.activeDateChange = new EventEmitter(undefined);
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        this._now = new Date();
        this.config = config;
        this.configureOptions();
    }
    /**
     * currently active date
     * @return {?}
     */
    get activeDate() {
        return this._activeDate || this._now;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        this._activeDate = value;
    }
    /**
     * @return {?}
     */
    configureOptions() {
        Object.assign(this, this.config);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onUpdate(event) {
        this.activeDate = event;
        this.onChange(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onSelectionDone(event) {
        this.selectionDone.emit(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onActiveDateChange(event) {
        this.activeDateChange.emit(event);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (this._datePicker.compare(value, this._activeDate) === 0) {
            return;
        }
        if (value && value instanceof Date) {
            this.activeDate = value;
            this._datePicker.select(value, false);
            return;
        }
        this.activeDate = value ? new Date(value) : void 0;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}
DatePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'datepicker',
                template: `
    <datepicker-inner [activeDate]="activeDate"
                      (update)="onUpdate($event)"
                      [datepickerMode]="datepickerMode"
                      [initDate]="initDate"
                      [minDate]="minDate"
                      [maxDate]="maxDate"
                      [minMode]="minMode"
                      [maxMode]="maxMode"
                      [showWeeks]="showWeeks"
                      [formatDay]="formatDay"
                      [formatMonth]="formatMonth"
                      [formatYear]="formatYear"
                      [formatDayHeader]="formatDayHeader"
                      [formatDayTitle]="formatDayTitle"
                      [formatMonthTitle]="formatMonthTitle"
                      [startingDay]="startingDay"
                      [yearRange]="yearRange"
                      [customClass]="customClass"
                      [dateDisabled]="dateDisabled"
                      [onlyCurrentMonth]="onlyCurrentMonth"
                      [shortcutPropagation]="shortcutPropagation"
                      [monthColLimit]="monthColLimit"
                      [yearColLimit]="yearColLimit"
                      (selectionDone)="onSelectionDone($event)"
                      (activeDateChange)="onActiveDateChange($event)">
      <daypicker tabindex="0"></daypicker>
      <monthpicker tabindex="0"></monthpicker>
      <yearpicker tabindex="0"></yearpicker>
    </datepicker-inner>
    `,
                providers: [DATEPICKER_CONTROL_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
DatePickerComponent.ctorParameters = () => [
    { type: DatepickerConfig, },
];
DatePickerComponent.propDecorators = {
    'datepickerMode': [{ type: Input },],
    'initDate': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'minMode': [{ type: Input },],
    'maxMode': [{ type: Input },],
    'showWeeks': [{ type: Input },],
    'formatDay': [{ type: Input },],
    'formatMonth': [{ type: Input },],
    'formatYear': [{ type: Input },],
    'formatDayHeader': [{ type: Input },],
    'formatDayTitle': [{ type: Input },],
    'formatMonthTitle': [{ type: Input },],
    'startingDay': [{ type: Input },],
    'yearRange': [{ type: Input },],
    'onlyCurrentMonth': [{ type: Input },],
    'shortcutPropagation': [{ type: Input },],
    'monthColLimit': [{ type: Input },],
    'yearColLimit': [{ type: Input },],
    'customClass': [{ type: Input },],
    'dateDisabled': [{ type: Input },],
    'activeDate': [{ type: Input },],
    'selectionDone': [{ type: Output },],
    'activeDateChange': [{ type: Output },],
    '_datePicker': [{ type: ViewChild, args: [DatePickerInnerComponent,] },],
};

/**
 * JS version of browser APIs. This library can only run in the browser.
 */
var win = typeof window !== 'undefined' && window || {};

/**
 * @return {?}
 */
function isBs3() {
    return win.__theme !== 'bs4';
}

// write an interface for template options
const TEMPLATE_OPTIONS = {
    'bs4': {
        ARROW_LEFT: '&lt;',
        ARROW_RIGHT: '&gt;'
    },
    'bs3': {
        ARROW_LEFT: `
    <i class="glyphicon glyphicon-chevron-left"></i>
    `,
        ARROW_RIGHT: `
    <i class="glyphicon glyphicon-chevron-right"></i>
    `
    }
};
class DayPickerComponent {
    /**
     * @param {?} datePicker
     */
    constructor(datePicker) {
        this.labels = [];
        this.rows = [];
        this.weekNumbers = [];
        this.CURRENT_THEME_TEMPLATE = isBs3()
            ? TEMPLATE_OPTIONS.bs3
            : TEMPLATE_OPTIONS.bs4;
        this.datePicker = datePicker;
    }
    /**
     * @return {?}
     */
    get isBs4() {
        return !isBs3();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        let /** @type {?} */ self = this;
        this.datePicker.stepDay = { months: 1 };
        this.datePicker.setRefreshViewHandler(function () {
            let /** @type {?} */ year = this.activeDate.getFullYear();
            let /** @type {?} */ month = this.activeDate.getMonth();
            let /** @type {?} */ firstDayOfMonth = new Date(year, month, 1);
            let /** @type {?} */ difference = this.startingDay - firstDayOfMonth.getDay();
            let /** @type {?} */ numDisplayedFromPreviousMonth = (difference > 0)
                ? 7 - difference
                : -difference;
            let /** @type {?} */ firstDate = new Date(firstDayOfMonth.getTime());
            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }
            // 42 is the number of days on a six-week calendar
            let /** @type {?} */ _days = self.getDates(firstDate, 42);
            let /** @type {?} */ days = [];
            for (let /** @type {?} */ i = 0; i < 42; i++) {
                let /** @type {?} */ _dateObject = this.createDateObject(_days[i], this.formatDay);
                _dateObject.secondary = _days[i].getMonth() !== month;
                _dateObject.uid = this.uniqueId + '-' + i;
                days[i] = _dateObject;
            }
            self.labels = [];
            for (let /** @type {?} */ j = 0; j < 7; j++) {
                self.labels[j] = {};
                self.labels[j].abbr = this.dateFilter(days[j].date, this.formatDayHeader);
                self.labels[j].full = this.dateFilter(days[j].date, 'EEEE');
            }
            self.title = this.dateFilter(this.activeDate, this.formatDayTitle);
            self.rows = this.split(days, 7);
            if (this.showWeeks) {
                self.weekNumbers = [];
                let /** @type {?} */ thursdayIndex = (4 + 7 - this.startingDay) % 7;
                let /** @type {?} */ numWeeks = self.rows.length;
                for (let /** @type {?} */ curWeek = 0; curWeek < numWeeks; curWeek++) {
                    self.weekNumbers.push(self.getISO8601WeekNumber(self.rows[curWeek][thursdayIndex].date));
                }
            }
        }, 'day');
        this.datePicker.setCompareHandler(function (date1, date2) {
            let /** @type {?} */ d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
            let /** @type {?} */ d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
            return d1.getTime() - d2.getTime();
        }, 'day');
        this.datePicker.refreshView();
    }
    /**
     * @param {?} startDate
     * @param {?} n
     * @return {?}
     */
    getDates(startDate, n) {
        let /** @type {?} */ dates = new Array(n);
        let /** @type {?} */ current = new Date(startDate.getTime());
        let /** @type {?} */ i = 0;
        let /** @type {?} */ date;
        while (i < n) {
            date = new Date(current.getTime());
            date = this.datePicker.fixTimeZone(date);
            dates[i++] = date;
            current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
        }
        return dates;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getISO8601WeekNumber(date) {
        let /** @type {?} */ checkDate = new Date(date.getTime());
        // Thursday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        let /** @type {?} */ time = checkDate.getTime();
        // Compare with Jan 1
        checkDate.setMonth(0);
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
    }
}
// todo: key events implementation
DayPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'daypicker',
                template: `
<table *ngIf="datePicker.datepickerMode==='day'" role="grid" [attr.aria-labelledby]="datePicker.uniqueId+'-title'" aria-activedescendant="activeDateId">
  <thead>
    <tr>
      <th>
        <button type="button"
                class="btn btn-default btn-secondary btn-sm pull-left"
                (click)="datePicker.move(-1)"
                tabindex="-1"
                [innerHTML]="CURRENT_THEME_TEMPLATE.ARROW_LEFT">
        </button>
      </th>
      <th [attr.colspan]="5 + (datePicker.showWeeks ? 1 : 0)">
        <button [id]="datePicker.uniqueId + '-title'"
                type="button" class="btn btn-default btn-secondary btn-sm"
                (click)="datePicker.toggleMode()"
                [disabled]="datePicker.datepickerMode === datePicker.maxMode"
                [ngClass]="{disabled: datePicker.datepickerMode === datePicker.maxMode}" tabindex="-1" style="width:100%;">
          <strong>{{title}}</strong>
        </button>
      </th>
      <th>
        <button type="button"
                class="btn btn-default btn-secondary btn-sm pull-right"
                (click)="datePicker.move(1)"
                tabindex="-1"
                [innerHTML]="CURRENT_THEME_TEMPLATE.ARROW_RIGHT">
        </button>
      </th>
    </tr>
    <tr>
      <th *ngIf="datePicker.showWeeks"></th>
      <th *ngFor="let labelz of labels" class="text-center">
        <small aria-label="labelz.full"><b>{{labelz.abbr}}</b></small>
      </th>
    </tr>
  </thead>
  <tbody>
    <ng-template ngFor [ngForOf]="rows" let-rowz="$implicit" let-index="index">
      <tr *ngIf="!(datePicker.onlyCurrentMonth && rowz[0].secondary && rowz[6].secondary)">
        <td *ngIf="datePicker.showWeeks" class="h6" class="text-center">
          <em>{{ weekNumbers[index] }}</em>
        </td>
        <td *ngFor="let dtz of rowz" class="text-center" role="gridcell" [id]="dtz.uid">
          <button type="button" style="min-width:100%;" class="btn btn-sm {{dtz.customClass}}"
                  *ngIf="!(datePicker.onlyCurrentMonth && dtz.secondary)"
                  [ngClass]="{'btn-secondary': isBs4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected, disabled: dtz.disabled, active: !isBs4 && datePicker.isActive(dtz), 'btn-default': !isBs4}"
                  [disabled]="dtz.disabled"
                  (click)="datePicker.select(dtz.date)" tabindex="-1">
            <span [ngClass]="{'text-muted': dtz.secondary || dtz.current, 'text-info': !isBs4 && dtz.current}">{{dtz.label}}</span>
          </button>
        </td>
      </tr>
    </ng-template>
  </tbody>
</table>
  `
            },] },
];
/**
 * @nocollapse
 */
DayPickerComponent.ctorParameters = () => [
    { type: DatePickerInnerComponent, },
];

class MonthPickerComponent {
    /**
     * @param {?} datePicker
     */
    constructor(datePicker) {
        this.rows = [];
        this.datePicker = datePicker;
    }
    /**
     * @return {?}
     */
    get isBs4() {
        return !isBs3();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        let /** @type {?} */ self = this;
        this.datePicker.stepMonth = { years: 1 };
        this.datePicker.setRefreshViewHandler(function () {
            let /** @type {?} */ months = new Array(12);
            let /** @type {?} */ year = this.activeDate.getFullYear();
            let /** @type {?} */ date;
            for (let /** @type {?} */ i = 0; i < 12; i++) {
                date = new Date(year, i, 1);
                date = this.fixTimeZone(date);
                months[i] = this.createDateObject(date, this.formatMonth);
                months[i].uid = this.uniqueId + '-' + i;
            }
            self.title = this.dateFilter(this.activeDate, this.formatMonthTitle);
            self.rows = this.split(months, self.datePicker.monthColLimit);
        }, 'month');
        this.datePicker.setCompareHandler(function (date1, date2) {
            let /** @type {?} */ d1 = new Date(date1.getFullYear(), date1.getMonth());
            let /** @type {?} */ d2 = new Date(date2.getFullYear(), date2.getMonth());
            return d1.getTime() - d2.getTime();
        }, 'month');
        this.datePicker.refreshView();
    }
}
// todo: key events implementation
MonthPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'monthpicker',
                template: `
<table *ngIf="datePicker.datepickerMode==='month'" role="grid">
  <thead>
    <tr>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-left"
                (click)="datePicker.move(-1)" tabindex="-1">
          <i class="glyphicon glyphicon-chevron-left"></i>
        </button></th>
      <th [attr.colspan]="((datePicker.monthColLimit - 2) <= 0) ? 1 : datePicker.monthColLimit - 2">
        <button [id]="datePicker.uniqueId + '-title'"
                type="button" class="btn btn-default btn-sm"
                (click)="datePicker.toggleMode()"
                [disabled]="datePicker.datepickerMode === maxMode"
                [ngClass]="{disabled: datePicker.datepickerMode === maxMode}" tabindex="-1" style="width:100%;">
          <strong>{{title}}</strong>
        </button>
      </th>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-right"
                (click)="datePicker.move(1)" tabindex="-1">
          <i class="glyphicon glyphicon-chevron-right"></i>
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let rowz of rows">
      <td *ngFor="let dtz of rowz" class="text-center" role="gridcell" id="{{dtz.uid}}" [ngClass]="dtz.customClass">
        <button type="button" style="min-width:100%;" class="btn btn-default"
                [ngClass]="{'btn-link': isBs4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected || (isBs4 && !dtz.selected && datePicker.isActive(dtz)), disabled: dtz.disabled, active: !isBs4 && datePicker.isActive(dtz)}"
                [disabled]="dtz.disabled"
                (click)="datePicker.select(dtz.date)" tabindex="-1">
          <span [ngClass]="{'text-success': isBs4 && dtz.current, 'text-info': !isBs4 && dtz.current}">{{dtz.label}}</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>
  `
            },] },
];
/**
 * @nocollapse
 */
MonthPickerComponent.ctorParameters = () => [
    { type: DatePickerInnerComponent, },
];

class YearPickerComponent {
    /**
     * @param {?} datePicker
     */
    constructor(datePicker) {
        this.rows = [];
        this.datePicker = datePicker;
    }
    /**
     * @return {?}
     */
    get isBs4() {
        return !isBs3();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        let /** @type {?} */ self = this;
        this.datePicker.stepYear = { years: this.datePicker.yearRange };
        this.datePicker.setRefreshViewHandler(function () {
            let /** @type {?} */ years = new Array(this.yearRange);
            let /** @type {?} */ date;
            let /** @type {?} */ start = self.getStartingYear(this.activeDate.getFullYear());
            for (let /** @type {?} */ i = 0; i < this.yearRange; i++) {
                date = new Date(start + i, 0, 1);
                date = this.fixTimeZone(date);
                years[i] = this.createDateObject(date, this.formatYear);
                years[i].uid = this.uniqueId + '-' + i;
            }
            self.title = [years[0].label,
                years[this.yearRange - 1].label].join(' - ');
            self.rows = this.split(years, self.datePicker.yearColLimit);
        }, 'year');
        this.datePicker.setCompareHandler(function (date1, date2) {
            return date1.getFullYear() - date2.getFullYear();
        }, 'year');
        this.datePicker.refreshView();
    }
    /**
     * @param {?} year
     * @return {?}
     */
    getStartingYear(year) {
        // todo: parseInt
        return ((year - 1) / this.datePicker.yearRange) * this.datePicker.yearRange + 1;
    }
}
YearPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'yearpicker',
                template: `
<table *ngIf="datePicker.datepickerMode==='year'" role="grid">
  <thead>
    <tr>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-left"
                (click)="datePicker.move(-1)" tabindex="-1">
          <i class="glyphicon glyphicon-chevron-left"></i>
        </button>
      </th>
      <th [attr.colspan]="((datePicker.yearColLimit - 2) <= 0) ? 1 : datePicker.yearColLimit - 2">
        <button [id]="datePicker.uniqueId + '-title'" role="heading"
                type="button" class="btn btn-default btn-sm"
                (click)="datePicker.toggleMode()"
                [disabled]="datePicker.datepickerMode === datePicker.maxMode"
                [ngClass]="{disabled: datePicker.datepickerMode === datePicker.maxMode}" tabindex="-1" style="width:100%;">
          <strong>{{title}}</strong>
        </button>
      </th>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-right"
                (click)="datePicker.move(1)" tabindex="-1">
          <i class="glyphicon glyphicon-chevron-right"></i>
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let rowz of rows">
      <td *ngFor="let dtz of rowz" class="text-center" role="gridcell">
        <button type="button" style="min-width:100%;" class="btn btn-default"
                [ngClass]="{'btn-link': isBs4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected || (isBs4 && !dtz.selected && datePicker.isActive(dtz)), disabled: dtz.disabled, active: !isBs4 && datePicker.isActive(dtz)}"
                [disabled]="dtz.disabled"
                (click)="datePicker.select(dtz.date)" tabindex="-1">
          <span [ngClass]="{'text-success': isBs4 && dtz.current, 'text-info': !isBs4 && dtz.current}">{{dtz.label}}</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>
  `
            },] },
];
/**
 * @nocollapse
 */
YearPickerComponent.ctorParameters = () => [
    { type: DatePickerInnerComponent, },
];

class DatepickerModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return { ngModule: DatepickerModule, providers: [DatepickerConfig] };
    }
}
DatepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                declarations: [DatePickerComponent, DatePickerInnerComponent, DayPickerComponent,
                    MonthPickerComponent, YearPickerComponent],
                exports: [DatePickerComponent, DatePickerInnerComponent, DayPickerComponent,
                    MonthPickerComponent, YearPickerComponent],
                entryComponents: [DatePickerComponent]
            },] },
];
/**
 * @nocollapse
 */
DatepickerModule.ctorParameters = () => [];

/**
 * Provides default configuration values for timepicker
 */
class TimepickerConfig {
    constructor() {
        /**
         * hours change step
         */
        this.hourStep = 1;
        /**
         * hours change step
         */
        this.minuteStep = 5;
        /**
         * if true works in 12H mode and displays AM/PM. If false works in 24H mode and hides AM/PM
         */
        this.showMeridian = true;
        /**
         * meridian labels based on locale
         */
        this.meridians = ['AM', 'PM'];
        /**
         * if true hours and minutes fields will be readonly
         */
        this.readonlyInput = false;
        /**
         * if true scroll inside hours and minutes inputs will change time
         */
        this.mousewheel = true;
        /**
         * if true up/down arrowkeys inside hours and minutes inputs will change time
         */
        this.arrowkeys = true;
        /**
         * if true spinner arrows above and below the inputs will be shown
         */
        this.showSpinners = true;
        /**
         * minimum time user can select
         */
        this.min = void 0;
        /**
         * maximum time user can select
         */
        this.max = void 0;
    }
}
TimepickerConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
TimepickerConfig.ctorParameters = () => [];

// tslint:disable max-file-line-count
const TIMEPICKER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimepickerComponent),
    multi: true
};
/**
 * @param {?} value
 * @return {?}
 */
function isDefined(value) {
    return typeof value !== 'undefined';
}
/**
 * @param {?} date
 * @param {?} minutes
 * @return {?}
 */
function addMinutes(date, minutes) {
    let /** @type {?} */ dt = new Date(date.getTime() + minutes * 60000);
    let /** @type {?} */ newDate = new Date(date);
    newDate.setHours(dt.getHours(), dt.getMinutes());
    return newDate;
}
class TimepickerComponent {
    /**
     * @param {?} _config
     */
    constructor(_config) {
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        // result value
        this._selected = new Date();
        this.config = _config;
        Object.assign(this, _config);
    }
    /**
     * if true works in 12H mode and displays AM/PM. If false works in 24H mode and hides AM/PM
     * @return {?}
     */
    get showMeridian() {
        return this._showMeridian;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set showMeridian(value) {
        this._showMeridian = value;
        // || !this.$error.time
        // if (true) {
        this.updateTemplate();
        return;
        // }
        // Evaluate from template
        /*let hours = this.getHoursFromTemplate();
         let minutes = this.getMinutesFromTemplate();
         if (isDefined(hours) && isDefined(minutes)) {
         this.selected.setHours(hours);
         this.refresh();
         }*/
    }
    /**
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set selected(v) {
        if (v) {
            this._selected = v;
            this.updateTemplate();
            this.onChange(this.selected);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // todo: take in account $locale.DATETIME_FORMATS.AMPMS;
        if (this.mousewheel) {
            // this.setupMousewheelEvents();
        }
        if (this.arrowkeys) {
            // this.setupArrowkeyEvents();
        }
        // this.setupInputEvents();
    }
    /**
     * @param {?} v
     * @return {?}
     */
    writeValue(v) {
        if (v === this.selected) {
            return;
        }
        if (v && v instanceof Date) {
            this.selected = v;
            return;
        }
        this.selected = v ? new Date(v) : void 0;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.readonlyInput = isDisabled;
    }
    /**
     * @return {?}
     */
    updateHours() {
        if (this.readonlyInput) {
            return;
        }
        let /** @type {?} */ hours = this.getHoursFromTemplate();
        let /** @type {?} */ minutes = this.getMinutesFromTemplate();
        this.invalidHours = !isDefined(hours);
        this.invalidMinutes = !isDefined(minutes);
        if (this.invalidHours || this.invalidMinutes) {
            // TODO: needed a validation functionality.
            return;
            // todo: validation?
            // invalidate(true);
        }
        this.selected.setHours(hours);
        this.invalidHours = (this.selected < this.min || this.selected > this.max);
        if (this.invalidHours) {
            // todo: validation?
            // invalidate(true);
            return;
        }
        else {
            this.refresh();
        }
    }
    /**
     * @return {?}
     */
    hoursOnBlur() {
        if (this.readonlyInput) {
            return;
        }
        // todo: binded with validation
        if (!this.invalidHours && parseInt(this.hours, 10) < 10) {
            this.hours = this.pad(this.hours);
        }
    }
    /**
     * @return {?}
     */
    updateMinutes() {
        if (this.readonlyInput) {
            return;
        }
        let /** @type {?} */ minutes = this.getMinutesFromTemplate();
        let /** @type {?} */ hours = this.getHoursFromTemplate();
        this.invalidMinutes = !isDefined(minutes);
        this.invalidHours = !isDefined(hours);
        if (this.invalidMinutes || this.invalidHours) {
            // TODO: needed a validation functionality.
            return;
            // todo: validation
            // invalidate(undefined, true);
        }
        this.selected.setMinutes(minutes);
        this.invalidMinutes = (this.selected < this.min || this.selected > this.max);
        if (this.invalidMinutes) {
            // todo: validation
            // invalidate(undefined, true);
            return;
        }
        else {
            this.refresh();
        }
    }
    /**
     * @return {?}
     */
    minutesOnBlur() {
        if (this.readonlyInput) {
            return;
        }
        if (!this.invalidMinutes && parseInt(this.minutes, 10) < 10) {
            this.minutes = this.pad(this.minutes);
        }
    }
    /**
     * @return {?}
     */
    incrementHours() {
        if (!this.noIncrementHours()) {
            this.addMinutesToSelected(this.hourStep * 60);
        }
    }
    /**
     * @return {?}
     */
    decrementHours() {
        if (!this.noDecrementHours()) {
            this.addMinutesToSelected(-this.hourStep * 60);
        }
    }
    /**
     * @return {?}
     */
    incrementMinutes() {
        if (!this.noIncrementMinutes()) {
            this.addMinutesToSelected(this.minuteStep);
        }
    }
    /**
     * @return {?}
     */
    decrementMinutes() {
        if (!this.noDecrementMinutes()) {
            this.addMinutesToSelected(-this.minuteStep);
        }
    }
    /**
     * @return {?}
     */
    noIncrementHours() {
        let /** @type {?} */ incrementedSelected = addMinutes(this.selected, this.hourStep * 60);
        return incrementedSelected > this.max ||
            (incrementedSelected < this.selected && incrementedSelected < this.min);
    }
    /**
     * @return {?}
     */
    noDecrementHours() {
        let /** @type {?} */ decrementedSelected = addMinutes(this.selected, -this.hourStep * 60);
        return decrementedSelected < this.min ||
            (decrementedSelected > this.selected && decrementedSelected > this.max);
    }
    /**
     * @return {?}
     */
    noIncrementMinutes() {
        let /** @type {?} */ incrementedSelected = addMinutes(this.selected, this.minuteStep);
        return incrementedSelected > this.max ||
            (incrementedSelected < this.selected && incrementedSelected < this.min);
    }
    /**
     * @return {?}
     */
    noDecrementMinutes() {
        let /** @type {?} */ decrementedSelected = addMinutes(this.selected, -this.minuteStep);
        return decrementedSelected < this.min ||
            (decrementedSelected > this.selected && decrementedSelected > this.max);
    }
    /**
     * @return {?}
     */
    toggleMeridian() {
        if (!this.noToggleMeridian()) {
            let /** @type {?} */ sign = this.selected.getHours() < 12 ? 1 : -1;
            this.addMinutesToSelected(12 * 60 * sign);
        }
    }
    /**
     * @return {?}
     */
    noToggleMeridian() {
        if (this.readonlyInput) {
            return true;
        }
        if (this.selected.getHours() < 13) {
            return addMinutes(this.selected, 12 * 60) > this.max;
        }
        else {
            return addMinutes(this.selected, -12 * 60) < this.min;
        }
    }
    /**
     * @return {?}
     */
    refresh() {
        // this.makeValid();
        this.updateTemplate();
        this.onChange(this.selected);
    }
    /**
     * @return {?}
     */
    updateTemplate() {
        let /** @type {?} */ hours = this.selected.getHours();
        let /** @type {?} */ minutes = this.selected.getMinutes();
        if (this.showMeridian) {
            // Convert 24 to 12 hour system
            hours = (hours === 0 || hours === 12) ? 12 : hours % 12;
        }
        // this.hours = keyboardChange === 'h' ? hours : this.pad(hours);
        // if (keyboardChange !== 'm') {
        //  this.minutes = this.pad(minutes);
        // }
        this.hours = this.pad(hours);
        this.minutes = this.pad(minutes);
        if (!this.meridians) {
            this.meridians = this.config.meridians;
        }
        this.meridian = this.selected.getHours() < 12
            ? this.meridians[0]
            : this.meridians[1];
    }
    /**
     * @return {?}
     */
    getHoursFromTemplate() {
        let /** @type {?} */ hours = parseInt(this.hours, 10);
        let /** @type {?} */ valid = this.showMeridian
            ? (hours > 0 && hours < 13)
            : (hours >= 0 && hours < 24);
        if (!valid) {
            return void 0;
        }
        if (this.showMeridian) {
            if (hours === 12) {
                hours = 0;
            }
            if (this.meridian === this.meridians[1]) {
                hours = hours + 12;
            }
        }
        return hours;
    }
    /**
     * @return {?}
     */
    getMinutesFromTemplate() {
        let /** @type {?} */ minutes = parseInt(this.minutes, 10);
        return (minutes >= 0 && minutes < 60) ? minutes : undefined;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    pad(value) {
        return (isDefined(value) && value.toString().length < 2)
            ? '0' + value
            : value.toString();
    }
    /**
     * @param {?} minutes
     * @return {?}
     */
    addMinutesToSelected(minutes) {
        this.selected = addMinutes(this.selected, minutes);
        this.refresh();
    }
}
TimepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'timepicker',
                template: `
    <table>
      <tbody>
        <tr class="text-center" [ngClass]="{hidden: !showSpinners || readonlyInput}">
          <td><a (click)="incrementHours()" [ngClass]="{disabled: noIncrementHours()}" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>
          <td>&nbsp;</td>
          <td><a (click)="incrementMinutes()" [ngClass]="{disabled: noIncrementMinutes()}" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>
          <td [ngClass]="{hidden: !showMeridian}" *ngIf="showMeridian"></td>
        </tr>
        <tr>
          <td class="form-group" [ngClass]="{'has-error': invalidHours}">
            <input style="width:50px;" type="text" [(ngModel)]="hours" (change)="updateHours()" class="form-control text-center" [readonly]="readonlyInput" (blur)="hoursOnBlur()" maxlength="2">
          </td>
          <td>:</td>
          <td class="form-group" [ngClass]="{'has-error': invalidMinutes}">
            <input style="width:50px;" type="text" [(ngModel)]="minutes" (change)="updateMinutes()" class="form-control text-center" [readonly]="readonlyInput" (blur)="minutesOnBlur()" maxlength="2">
          </td>
          <td [ngClass]="{hidden: !showMeridian}" *ngIf="showMeridian"><button type="button" [ngClass]="{disabled: noToggleMeridian() || readonlyInput}" class="btn btn-default text-center" (click)="toggleMeridian()">{{meridian}}</button></td>
        </tr>
        <tr class="text-center" [ngClass]="{hidden: !showSpinners || readonlyInput}">
          <td><a (click)="decrementHours()" [ngClass]="{disabled: noDecrementHours()}" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>
          <td>&nbsp;</td>
          <td><a (click)="decrementMinutes()" [ngClass]="{disabled: noDecrementMinutes()}" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>
          <td [ngClass]="{hidden: !showMeridian}" *ngIf="showMeridian"></td>
        </tr>
      </tbody>
    </table>
  `,
                providers: [TIMEPICKER_CONTROL_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
TimepickerComponent.ctorParameters = () => [
    { type: TimepickerConfig, },
];
TimepickerComponent.propDecorators = {
    'hourStep': [{ type: Input },],
    'minuteStep': [{ type: Input },],
    'readonlyInput': [{ type: Input },],
    'mousewheel': [{ type: Input },],
    'arrowkeys': [{ type: Input },],
    'showSpinners': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'meridians': [{ type: Input },],
    'showMeridian': [{ type: Input },],
};

class TimepickerModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: TimepickerModule,
            providers: [TimepickerConfig]
        };
    }
}
TimepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                declarations: [TimepickerComponent],
                exports: [TimepickerComponent, FormsModule]
            },] },
];
/**
 * @nocollapse
 */
TimepickerModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { DatePickerComponent, DatepickerModule, DayPickerComponent, MonthPickerComponent, YearPickerComponent, DateFormatter, DatepickerConfig, TimepickerConfig, TimepickerComponent, TimepickerModule, DatePickerInnerComponent as ɵc, DATEPICKER_CONTROL_VALUE_ACCESSOR as ɵa, TIMEPICKER_CONTROL_VALUE_ACCESSOR as ɵb };
//# sourceMappingURL=core.js.map
