import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as addMonths from 'date-fns/add_months';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as eachDay from 'date-fns/each_day';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfToday from 'date-fns/start_of_today';
import * as subMonths from 'date-fns/sub_months';
import * as __startOfWeek from 'date-fns/start_of_week';
import * as __lastDayOfWeek from 'date-fns/last_day_of_week';
import * as getDaysInMonth from 'date-fns/get_days_in_month'
import * as setDay from 'date-fns/set_date';
import * as getDay from 'date-fns/get_date';
import * as startOfDay from 'date-fns/start_of_day';
import {Weekday} from './models/weekdays';
import {Month} from './models/month';

const log = console.log;

@Component({
  selector: 'tb-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input()
  set date(date: Date) {
    log('input', date);
    date = startOfDay(date);
    this.selectedDate = date;
    this.selectedMonthTime = startOfMonth(date).getTime();
    this.selectedDay = getDay(date);
    if (this.generatedMonths
      && date.getTime() >= this.earliestGeneratedDate.getTime()
      && date.getTime() <= this.latestGeneratedDate.getTime()) {
      this.updateSelectedMonthRef();
    } else {
      this.generateMonths(date);
    }
  }

  @Output() dateChange = new EventEmitter<Date>();

  private selectedDate: Date;
  private selectedMonthTime: number;
  private selectedDay: number;

  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday = Weekday.Monday;

  weekdays: Array<Date>;
  dayRange = Array.from(new Array(31), (x, i) => i + 1)
  generatedMonths: Array<Month>;
  private selectedMonth: Month;
  private currentMonth: Month;

  private currentDate = startOfToday();
  private currentMonthDate = startOfMonth(this.currentDate);
  private currentDay = getDay(this.currentDate);
  private currentMonthTime = this.currentMonthDate.getTime();

  private shownIndex: number;
  private pivotIndex: number;

  private isClickStationary = true;
  private isPanning = false;
  private panOffset = 0;
  private wrapperWidth: number;

  private transitionDuration = 200;

  get earliestGeneratedDate(): Date {
    return this.generatedMonths[0].startDate;
  }

  get latestGeneratedDate(): Date {
    return this.generatedMonths[this.generatedMonths.length - 1].startDate;
  }

  get sliderStyles() {
    return {
      'left': `${-this.pivotIndex * 100}%`,
      'transform': `translateX(${(-this.shownIndex + this.panOffset) * 100}%)`,
      'transition-duration': this.isPanning ? '0ms' : this.transitionDuration + 'ms',
    };
  }

  ngOnInit() {
    this.weekdays = eachDay(
      this.startOfWeek(this.selectedDate),
      this.lastDayOfWeek(this.selectedDate),
    );
  }

  startPress() {
    this.isClickStationary = true;
  }

  startPan(wrapperWidth: number) {
    this.isClickStationary = false;
    this.isPanning = true;
    this.wrapperWidth = wrapperWidth;
  }

  pan(event: any) {
    this.panOffset = event.deltaX / this.wrapperWidth;
  }

  endPan(event: any) {
    this.isPanning = false;
    this.panOffset = event.deltaX / this.wrapperWidth;
    if (this.panOffset < -0.5) {
      this.showLater();
    } else if (this.panOffset > 0.5) {
      this.showEarlier();
    }
    this.panOffset = 0;
  }

  select(event: MouseEvent, month: Month) {
    if (this.isClickStationary) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.selectedMonth = month;
      this.selectedDay = day;
      this.selectedDate = setDay(month.startDate, day);
      this.dateChange.emit(this.selectedDate);
    }
  }

  showEarlier() {
    if (this.shownIndex + this.pivotIndex === 1) {
      this.generatedMonths.unshift(this.generateMonth(subMonths(this.earliestGeneratedDate, 1)));
      this.pivotIndex++;
    }
    this.shownIndex--;
  }

  showLater() {
    if (this.shownIndex + this.pivotIndex === this.generatedMonths.length - 2) {
      this.generatedMonths.push(this.generateMonth(addMonths(this.latestGeneratedDate, 1)));
    }
    this.shownIndex++;
  }

  isEarlierInRange() {
    return true;
  }

  isLaterInRange() {
    return true;
  }

  isToday(day: number, month: Month) {
    return month === this.currentMonth && day === this.currentDay;
  }

  isSelected(day: number, month: Month) {
    return month === this.selectedMonth && day === this.selectedDay;
  }

  private generateMonths(date: Date) {
    const monthDate = startOfMonth(date);
    this.generatedMonths = Array.from(new Array(3), (x, i) => i - 1)
      .map(monthShift => addMonths(monthDate, monthShift))
      .map(this.generateMonth);
    this.pivotIndex = 1;
    this.shownIndex = 0;
    this.updateCurrentMonthRef();
    this.updateSelectedMonthRef();
  }

  private generateMonth: (monthDate: Date) => Month = (monthDate) => {
    return {
      startDate: monthDate,
      length: getDaysInMonth(monthDate),
      weekShift: differenceInDays(monthDate, this.startOfWeek(monthDate)) || 7,
    };
  }

  private updateSelectedMonthRef() {
    const selectedMonthIndex = this.generatedMonths.findIndex(month => {
      return month.startDate.getTime() === this.selectedMonthTime
    });
    this.selectedMonth = this.generatedMonths[selectedMonthIndex];
    this.shownIndex = selectedMonthIndex - this.pivotIndex;
  }

  private updateCurrentMonthRef() {
    this.currentMonth = this.generatedMonths.find(month => {
      return month.startDate.getTime() === this.currentMonthTime
    });
  }

  private startOfWeek(date: Date) {
    return __startOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

  private lastDayOfWeek(date: Date) {
    return __lastDayOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

}
