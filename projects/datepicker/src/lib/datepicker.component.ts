import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isValidDate, startOfDay } from './util/date-utils';
import { Weekday } from './util/weekdays';
import { noop } from './util/helpers';
import { DatepickerView } from './util/datepicker-view';

@Component({
  selector: 'skm-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatepickerComponent,
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor, OnInit {
  @Input()
  set date(dirtyDate: Date) {
    const date = startOfDay(dirtyDate);
    if (!this.selectedDate || date.getTime() !== this.selectedDate.getTime()) {
      this.selectedDate = isValidDate(date) ? date : undefined;
    }
  }

  @Output() dateChange = new EventEmitter<Date>();

  @Input() yearFormat = 'y';
  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday = Weekday.Monday;

  selectedDate: Date;
  currentDate: Date;

  view = DatepickerView.Days;
  readonly DatepickerView = DatepickerView;

  private onChange: (date: Date) => void = noop;
  private onTouched: () => void = noop;

  ngOnInit() {
    this.currentDate = startOfDay(new Date());
  }

  selectDay(date: Date) {
    this.selectedDate = date;
    this.onChange(date);
    this.dateChange.emit(date);
  }

  selectMonth(date: Date) {
    console.log('month', date);
  }

  selectYear(date: Date) {
    console.log('year', date);
  }

  showMonths() {
    this.view = DatepickerView.Months;
  }

  showYears() {
    this.view = DatepickerView.Years;
  }

  // ControlValueAccessor implementation

  writeValue(obj: any): void {
    this.date = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    // TODO implement
  }

  setDisabledState(isDisabled: boolean): void {
    // TODO implement
  }

}
