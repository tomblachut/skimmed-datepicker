import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeekDay } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isValidDate, startOfDay } from '../util/date-utils';
import { noop } from '../util/helpers';
import { DatepickerView } from './datepicker-view';

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
      if (this.selectedDate) {
        this.initialDate = this.selectedDate;
        this.view = DatepickerView.Days;
      }
    }
  }

  @Output() dateChange = new EventEmitter<Date>();

  @Input() yearFormat = 'y';
  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday = WeekDay.Monday;

  selectedDate: Date;
  currentDate: Date;
  initialDate: Date;

  view = DatepickerView.Days;
  readonly DatepickerView = DatepickerView;

  private onChange: (date: Date) => void = noop;
  private onTouched: () => void = noop;

  ngOnInit(): void {
    this.currentDate = startOfDay(new Date());
    this.initialDate = this.selectedDate || this.currentDate;
  }

  selectDay(date: Date): void {
    this.selectedDate = date;
    this.onChange(date);
    this.dateChange.emit(date);
  }

  switchView(date: Date, view: DatepickerView) {
    this.view = view;
    this.initialDate = date;
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
