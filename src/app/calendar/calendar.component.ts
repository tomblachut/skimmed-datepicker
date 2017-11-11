import {Component, Input, OnInit} from '@angular/core';
import * as addMonths from 'date-fns/add_months';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as eachDay from 'date-fns/each_day';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfToday from 'date-fns/start_of_today';
import * as subMonths from 'date-fns/sub_months';
import * as __startOfWeek from 'date-fns/start_of_week';
import * as __lastDayOfWeek from 'date-fns/last_day_of_week';
import * as getDaysInMonth from 'date-fns/get_days_in_month'
import * as setDay from 'date-fns/set_date'
import * as getDay from 'date-fns/get_date'
import {Weekday} from './models/weekdays';
import {Month} from './models/month';

@Component({
  selector: 'tb-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input()
  set date(date: Date) {
    this.selectedDate = date;
    this.selectedMonthTime = startOfMonth(date).getTime();
    this.selectedDay = getDay(date);
  }

  get date(): Date {
    return this.selectedDate;
  }

  private selectedDate: Date;
  private selectedMonthTime: number;
  private selectedDay: number;

  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday = Weekday.Monday;

  weekdays: Array<Date>;
  generatedMonths: Array<Month>;
  private selectedMonth: Month;
  private currentMonth: Month;

  dayRange = Array.from(new Array(31), (x, i) => i + 1)

  private currentDate = startOfToday();
  private currentMonthDate = startOfMonth(this.currentDate);
  private currentDay = getDay(this.currentDate);
  private currentDateTime = this.currentDate.getTime();
  private currentMonthTime = this.currentMonthDate.getTime();

  private shownIndex: number;
  private pivotIndex: number;

  private isClickStationary =  true;
  private isPanning = false;
  private panOffset = 0;
  private wrapperWidth: number;

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
      'transition-duration': this.isPanning ? '0ms' : '200ms',
    };
  }

  ngOnInit() {
    this.date = startOfToday();
    this.weekdays = eachDay(
      this.startOfWeek(this.selectedDate),
      this.lastDayOfWeek(this.selectedDate),
    );
    this.generatedMonths = Array.from(new Array(6), (x, i) => i - 3)
      .map(monthShift => addMonths(this.selectedDate, monthShift))
      .map(this.generateMonth);
    this.pivotIndex = 3;
    this.shownIndex = 0;
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
    }
  }

  showEarlier() {
    if (this.shownIndex + this.pivotIndex === 0) {
      this.generatedMonths.unshift(this.generateMonth(subMonths(this.earliestGeneratedDate, 1)));
      this.pivotIndex++;
    }
    this.shownIndex--;
  }

  showLater() {
    if (this.shownIndex + this.pivotIndex === this.generatedMonths.length - 1) {
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

  private generateMonth: (date: Date) => Month = (date) => {
    const monthDate = startOfMonth(date);
    let shift = differenceInDays(monthDate, this.startOfWeek(monthDate)) || 7;

    const month = {
      startDate: monthDate,
      length: getDaysInMonth(monthDate),
      weekShift: shift,
    };

    const monthTime = monthDate.getTime();
    if (monthTime === this.currentMonthTime) {
      this.currentMonth = month;
    }
    if (monthTime === this.selectedMonthTime) {
      this.selectedMonth = month;
    }
    return month;
  }

  private startOfWeek(date: Date) {
    return __startOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

  private lastDayOfWeek(date: Date) {
    return __lastDayOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

}
