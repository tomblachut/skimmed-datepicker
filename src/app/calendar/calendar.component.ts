import {Component, Input, OnInit} from '@angular/core';
import {
  format,
  startOfToday,
  startOfWeek as __startOfWeek,
  lastDayOfWeek as __lastDayOfWeek,
  eachDay,
  startOfMonth,
  lastDayOfMonth,
  differenceInDays,
  subDays,
  addDays,
} from 'date-fns';
import {Weekday} from './models/weekdays';

@Component({
  selector: 'tb-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  @Input() date = startOfToday();

  firstWeekday = Weekday.Monday;

  weekdayNames: Array<string>;

  heading: string;
  days: Array<Date>;
  prevDays: Array<Date>;
  nextDays: Array<Date>;


  ngOnInit() {
    this.weekdayNames = eachDay(
      this.startOfWeek(this.date),
      this.lastDayOfWeek(this.date),
    ).map(date => format(date, 'dd'));

    console.log(this.weekdayNames);

    const monthStart = startOfMonth(this.date);
    const monthEnd = lastDayOfMonth(this.date);
    this.heading = format(monthStart, 'MMMM YYYY');
    this.days = eachDay(
      monthStart,
      monthEnd,
    );

    let shift = differenceInDays(monthStart, this.startOfWeek(monthStart));
    if (shift === 0) {
      shift += 7;
    }
    this.prevDays = eachDay(
      subDays(monthStart, shift),
      subDays(monthStart, 1),
    );
    this.nextDays = eachDay(
      addDays(monthEnd, 1),
      this.lastDayOfWeek(monthEnd),
    );

    console.log('shift', shift);
  }

  startOfWeek(date: Date) {
    return __startOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

  lastDayOfWeek(date: Date) {
    return __lastDayOfWeek(date, {weekStartsOn: this.firstWeekday});
  }

}
