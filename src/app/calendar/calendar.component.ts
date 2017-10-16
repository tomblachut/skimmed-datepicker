import {Component, Input, OnInit} from '@angular/core';
import * as addDays from 'date-fns/add_days';
import * as addMonths from 'date-fns/add_months';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as eachDay from 'date-fns/each_day';
import * as lastDayOfMonth from 'date-fns/last_day_of_month';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfToday from 'date-fns/start_of_today';
import * as subDays from 'date-fns/sub_days';
import * as subMonths from 'date-fns/sub_months';
import * as __startOfWeek from 'date-fns/start_of_week';
import * as __lastDayOfWeek from 'date-fns/last_day_of_week';
import {Weekday} from './models/weekdays';
import {MonthGrid} from './models/month-grid';

@Component({
  selector: 'tb-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  @Input() date = startOfToday();

  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday = Weekday.Monday;

  weekdays: Array<Date>;
  renderedMonths: Array<MonthGrid>;

  private todayMilli: number;

  private shownIndex: number;
  private pivotIndex: number;

  private wrapperWidth: number;
  private panOffset: number;

  get earliestRenderedDate(): Date {
    return this.renderedMonths[0].origin;
  }

  get latestRenderedDate(): Date {
    return this.renderedMonths[this.renderedMonths.length - 1].origin;
  }

  get sliderStyles() {
    return {
      left: `${-this.pivotIndex * 100}%`,
      transform: `translateX(${(-this.shownIndex + this.panOffset) * 100}%)`,
    };
  }

  ngOnInit() {
    this.panOffset = 0;
    this.todayMilli = startOfToday().getTime();

    this.weekdays = eachDay(
      this.startOfWeek(this.date),
      this.lastDayOfWeek(this.date),
    );
    this.renderedMonths = Array.from(new Array(6), (x, i) => i - 3)
      .map(monthShift => addMonths(this.date, monthShift))
      .map(this.generateMonth);
    this.pivotIndex = 3;
    this.shownIndex = 0;
  }

  startPan(wrapperWidth: number) {
    this.wrapperWidth = wrapperWidth;
  }

  pan(event: any) {
    this.panOffset = event.deltaX / this.wrapperWidth;
  }

  endPan(event: any) {
    this.panOffset = event.deltaX / this.wrapperWidth;
    if (this.panOffset < -0.5) {
      this.showLater();
    } else if (this.panOffset > 0.5) {
      this.showEarlier();
    }
    this.panOffset = 0;
  }

  showEarlier() {
    if (this.shownIndex + this.pivotIndex === 0) {
      this.renderedMonths.unshift(this.generateMonth(subMonths(this.earliestRenderedDate, 1)));
      this.pivotIndex++;
    }
    this.shownIndex--;
  }

  showLater() {
    if (this.shownIndex + this.pivotIndex === this.renderedMonths.length - 1) {
      this.renderedMonths.push(this.generateMonth(addMonths(this.latestRenderedDate, 1)));
    }
    this.shownIndex++;
  }

  isEarlierInRange() {
    return true;
  }

  isLaterInRange() {
    return true;
  }

  isToday(date: Date) {
    return date.getTime() === this.todayMilli;
  }

  isSelected(date: Date) {
    return date.getTime() === this.date.getTime();
  }

  private generateMonth: (date: Date) => MonthGrid = (date) => {
    const res = {} as MonthGrid;

    res.origin = date;

    const monthStart = startOfMonth(date);
    const monthEnd = lastDayOfMonth(date);
    res.days = eachDay(
      monthStart,
      monthEnd,
    );

    let shift = differenceInDays(monthStart, this.startOfWeek(monthStart));
    if (shift === 0) {
      shift += 7;
    }
    res.earlierDays = eachDay(
      subDays(monthStart, shift),
      subDays(monthStart, 1),
    );
    res.laterDays = eachDay(
      addDays(monthEnd, 1),
      addDays(monthEnd, 7 * 6 - res.earlierDays.length - res.days.length),
    );

    return res;
  }

  private startOfWeek(date: Date) {
    return __startOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

  private lastDayOfWeek(date: Date) {
    return __lastDayOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

}
