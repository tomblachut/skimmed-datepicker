import {Component, Input, OnInit} from '@angular/core';
import {
  addDays,
  addMonths,
  differenceInDays,
  eachDay,
  format,
  lastDayOfMonth,
  lastDayOfWeek as __lastDayOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek as __startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import {Weekday} from './models/weekdays';
import {MonthData} from './models/month-data';

@Component({
  selector: 'tb-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  @Input() date = startOfToday();

  firstWeekday = Weekday.Monday;

  weekdayNames: Array<string>;

  months: Array<MonthData> = [];
  currentMonth = 6;

  ngOnInit() {
    this.weekdayNames = eachDay(
      this.startOfWeek(this.date),
      this.lastDayOfWeek(this.date),
    ).map(date => format(date, 'dd'));

    this.months = Array.from(new Array(12), (x, i) => i - 6).map(days => addMonths(this.date, days)).map(this.generateMonth);
  }

  prev() {
    if (this.currentMonth === 0) {
      this.months.unshift(this.generateMonth(subMonths(this.months[0].days[0], 1)));
    } else {
      this.currentMonth--;
    }
  }

  next() {
    if  (this.currentMonth === this.months.length - 1) {
      this.months.push(this.generateMonth(addMonths(this.months[this.months.length - 1].days[0], 1)));
    }
    this.currentMonth++;
  }

  canPrev() {
    return true;
    // return this.currentMonth > 0;
  }

  canNext() {
    return true;
    // return this.currentMonth < this.months.length - 1;
  }

  getStyles() {
    const x = -this.currentMonth / this.months.length;
    return {
      width: `${this.months.length * 100}%`,
      transform: `translateX(${x * 100}%)`,
    };
  }

  generateMonth: (date: Date) => MonthData = (date) => {
    const res = {} as MonthData;

    const monthStart = startOfMonth(date);
    const monthEnd = lastDayOfMonth(date);
    res.heading = format(monthStart, 'MMMM YYYY');
    res.days = eachDay(
      monthStart,
      monthEnd,
    );

    let shift = differenceInDays(monthStart, this.startOfWeek(monthStart));
    if (shift === 0) {
      shift += 7;
    }
    res.prevDays = eachDay(
      subDays(monthStart, shift),
      subDays(monthStart, 1),
    );
    res.nextDays = eachDay(
      addDays(monthEnd, 1),
      addDays(monthEnd, 7 * 6 - res.prevDays.length - res.days.length),
    );
    return res;
  }

  startOfWeek(date: Date) {
    return __startOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

  lastDayOfWeek(date: Date) {
    return __lastDayOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

}
