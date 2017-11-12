import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getDay, setDay, startOfDay, startOfMonth, startOfToday} from 'date-fns';
import {Weekday} from '../weekdays';
import {Month} from '../month';
import {createEaseOut, generateWeekdayDates, isValidDate, range} from '../utils';

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
    if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
      return;
    }
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

  private easeOut = createEaseOut(1.3);
  private transitionDuration = 150;
  private wrapperWidth = 1;

  private isSwipeAllowed = true;
  private isClickFixed = true;
  private panOffset = 0;
  private isMoving = false;
  private isSpringingBack = false;

  get sliderStyles() {
    return {
      transition: this.tilt || this.isSpringingBack ? `transform ${this.transitionDuration}ms` : '',
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

  startPress() {
    this.isClickFixed = true;
  }

  startPan(wrapperWidth: number) {
    this.isClickFixed = false;
    this.isSwipeAllowed = true;
    this.isSpringingBack = false;
    this.wrapperWidth = wrapperWidth;
  }

  pan(event: any) {
    const absOffset = Math.abs(event.deltaX / this.wrapperWidth);
    this.panOffset = Math.sign(event.deltaX) * this.easeOut(absOffset);
  }

  endPan() {
    if (Math.abs(this.panOffset) > 0.5) {
      this.scrollPanes(-Math.sign(this.panOffset));
      this.isSwipeAllowed = false;
    } else {
      this.isSpringingBack = true;
      setTimeout(() => this.isSpringingBack = false, this.transitionDuration);
    }
    this.panOffset = 0;
  }

  swipe(direction: number) {
    if (this.isSwipeAllowed) {
      this.scrollPanes(direction);
    }
  }

  scrollPanes(direction: number) {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;
    this.tilt = direction;

    setTimeout(() => {
      this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
      const index = (3 + this.visiblePaneIndex + direction) % 3;
      const pane = this.panes[index];
      pane.month = Month.fromDate(pane.month.date, this.firstWeekday, 3 * direction);
      pane.order += 3 * direction;
      this.tilt = 0;
      this.isMoving = false;
    }, this.transitionDuration);
  }

  selectDay(event: MouseEvent, month: Month) {
    if (this.isClickFixed) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.selectedDay = day;
      this.selectedMonthTime = month.date.getTime();
      this.selectedDate = setDay(month.date, day);
      this.dateChange.emit(this.selectedDate);
    }
  }

  isToday(day: number, month: Month) {
    return day === this.currentDay && month.date.getTime() === this.currentMonthTime;
  }

  isSelected(day: number, month: Month) {
    return day === this.selectedDay && month.date.getTime() === this.selectedMonthTime;
  }

  private initPanes(date: Date) {
    const monthDate = startOfMonth(date);
    this.panes = [-1, 0, 1].map(i => ({
      order: i,
      month: Month.fromDate(monthDate, this.firstWeekday, i),
    }));
    this.visiblePaneIndex = 1;
  }
}
