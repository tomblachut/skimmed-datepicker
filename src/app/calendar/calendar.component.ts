import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as addMonths from 'date-fns/add_months';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfToday from 'date-fns/start_of_today';
import * as getDaysInMonth from 'date-fns/get_days_in_month';
import * as setDay from 'date-fns/set_date';
import * as getDay from 'date-fns/get_date';
import * as startOfDay from 'date-fns/start_of_day';
import {Weekday} from '../weekdays';
import {Month} from '../month';
import {createEaseOut, generateWeekdayDates, range, startOfWeek} from '../utils';

interface Pane {
  order: number;
  month: Month;
}

@Component({
  selector: 'skm-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input()
  set date(dirtyDate: Date) {
    const date = startOfDay(dirtyDate);
    if (date && this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
      return;
    }
    if (!isNaN(date.getTime())) {
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

  @Output() dateChange = new EventEmitter<Date>();

  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday: Weekday = Weekday.Monday;

  panes: Array<Pane>;
  weekdays: Array<Date>;
  days = range(1, 31);

  private visiblePaneIndex: number;
  private tilt = 0;

  private selectedDate: Date;
  private selectedDay: number;
  private selectedMonthTime: number;

  private currentDay: number;
  private currentMonthTime: number;

  private isSwipeAllowed = true;
  private isClickFixed = true;
  private panOffset = 0;
  private wrapperWidth: number;
  private easeOut = createEaseOut(1.5);
  private transitionDuration = 150;
  private isMoving = false;

  get sliderStyles() {
    return {
      transition: this.tilt ? `transform ${this.transitionDuration}ms` : '',
      transform: `translateX(${(-this.tilt + this.panOffset) * 100}%)`,
    };
  }

  ngOnInit() {
    const currentDate = startOfToday();
    this.currentDay = getDay(currentDate);
    this.currentMonthTime = startOfMonth(currentDate).getTime();
    this.weekdays = generateWeekdayDates(currentDate, this.firstWeekday);
    if (!this.panes) {
      this.initPanes(currentDate);
    }
  }

  initPanes(date: Date) {
    const monthDate = startOfMonth(date);
    this.panes = [-1, 0, 1].map(i => ({
      order: i,
      month: this.generateMonth(addMonths(monthDate, i)),
    }));
    this.visiblePaneIndex = 1;
  }

  startPress() {
    this.isClickFixed = true;
  }

  startPan(wrapperWidth: number) {
    this.isClickFixed = false;
    this.isSwipeAllowed = true;
    this.wrapperWidth = wrapperWidth;
  }

  pan(event: any) {
    const absOffset = Math.abs(event.deltaX / this.wrapperWidth);
    this.panOffset = Math.sign(event.deltaX) * this.easeOut(absOffset);
  }

  endPan() {
    if (Math.abs(this.panOffset) > 0.5) {
      this.scroll(-Math.sign(this.panOffset));
      this.isSwipeAllowed = false;
    }
    this.panOffset = 0;
  }

  select(event: MouseEvent, month: Month) {
    if (this.isClickFixed) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.selectedDay = day;
      this.selectedMonthTime = month.startDate.getTime();
      this.selectedDate = setDay(month.startDate, day);
      this.dateChange.emit(this.selectedDate);
    }
  }

  swipe(direction: number) {
    if (this.isSwipeAllowed) {
      this.scroll(direction);
    }
  }

  scroll(direction: number) {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;
    this.tilt = direction;

    setTimeout(() => {
      this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
      const index = (3 + this.visiblePaneIndex + direction) % 3;
      const pane = this.panes[index];
      pane.month = this.generateMonth(addMonths(pane.month.startDate, 3 * direction));
      pane.order += 3 * direction;
      this.tilt = 0;
      this.isMoving = false;
    }, this.transitionDuration);
  }

  isToday(day: number, month: Month) {
    return day === this.currentDay && month.startDate.getTime() === this.currentMonthTime;
  }

  isSelected(day: number, month: Month) {
    return day === this.selectedDay && month.startDate.getTime() === this.selectedMonthTime;
  }

  private generateMonth: (monthDate: Date) => Month = (monthDate) => {
    return {
      startDate: monthDate,
      length: getDaysInMonth(monthDate),
      weekShift: differenceInDays(monthDate, startOfWeek(monthDate, this.firstWeekday)) || 7,
    };
  }
}
