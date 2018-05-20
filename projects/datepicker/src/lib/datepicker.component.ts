import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getDay, isValidDate, setDay, startOfDay, startOfMonth, weekdayDates } from './util/date-utils';
import { Weekday } from './util/weekdays';
import { Month } from './util/month';
import { noop, range } from './util/helpers';

export interface Pane {
  order: number;
  month: Month;
}

@Component({
  selector: 'skm-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss', './shared.scss'],
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
      this.updateSelectedDate(date);
    }
  }

  @Output() dateChange = new EventEmitter<Date>();

  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday: Weekday = Weekday.Monday;

  panes: Array<Pane>;
  weekdays: Array<Date>;
  days = range(1, 31);

  visiblePaneIndex: number;

  private selectedDate: Date;
  private selectedDay: number;
  private selectedMonthTime: number;

  private currentDay: number;
  private currentMonthTime: number;

  private onChange: (date: Date) => void = noop;
  private onTouched: () => void = noop;

  ngOnInit() {
    const currentDate = startOfDay(new Date());
    this.currentDay = getDay(currentDate);
    this.currentMonthTime = startOfMonth(currentDate).getTime();
    this.weekdays = weekdayDates(currentDate, this.firstWeekday);
    if (!this.panes) {
      this.initPanes(currentDate);
    }
  }

  selectDay(event: MouseEvent, month: Month, notPanning: boolean) {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.selectedDay = day;
      this.selectedMonthTime = month.date.getTime();
      this.selectedDate = setDay(month.date, day);
      this.onChange(this.selectedDate);
      this.dateChange.emit(this.selectedDate);
    }
  }

  isToday(day: number, month: Month) {
    return day === this.currentDay && month.date.getTime() === this.currentMonthTime;
  }

  isSelected(day: number, month: Month) {
    return day === this.selectedDay && month.date.getTime() === this.selectedMonthTime;
  }

  switchPanes(direction: number) {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    pane.month = Month.fromDate(pane.month.date, this.firstWeekday, 3 * direction);
    pane.order += 3 * direction;
  }

  private initPanes(date: Date) {
    const monthDate = startOfMonth(date);
    this.panes = [-1, 0, 1].map(i => ({
      order: i,
      month: Month.fromDate(monthDate, this.firstWeekday, i),
    }));
    this.visiblePaneIndex = 1;
  }

  private updateSelectedDate(date: any) {
    if (isValidDate(date)) {
      this.selectedDate = date;
      this.selectedDay = getDay(date);
      this.selectedMonthTime = startOfMonth(date).getTime();
      this.initPanes(date);
    } else {
      this.selectedDate = undefined;
      this.selectedDay = undefined;
      this.selectedMonthTime = undefined;
    }
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
