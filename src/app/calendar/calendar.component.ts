import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as addMonths from 'date-fns/add_months';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfToday from 'date-fns/start_of_today';
import * as subMonths from 'date-fns/sub_months';
import * as getDaysInMonth from 'date-fns/get_days_in_month';
import * as setDay from 'date-fns/set_date';
import * as getDay from 'date-fns/get_date';
import * as startOfDay from 'date-fns/start_of_day';
import {Weekday} from '../weekdays';
import {Month} from '../month';
import {createEaseOut, generateWeekdayDates, startOfWeek} from '../utils';

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
      this.selectedMonthTime = startOfMonth(date).getTime();
      this.selectedDay = getDay(date);

      if (this.generatedMonths
        && date.getTime() >= this.earliestGeneratedDate.getTime()
        && date.getTime() <= this.latestGeneratedDate.getTime()) {
        this.updateSelectedMonthRef();
      } else {
        this.generateMonths(date);
      }
    } else if (this.generatedMonths) {
      this.selectedDate = undefined;
      this.selectedMonthTime = undefined;
      this.selectedDay = undefined;
      this.updateSelectedMonthRef();
    }
  }

  @Output() dateChange = new EventEmitter<Date>();

  @Input() headingFormat = 'MMMM y';
  @Input() weekdayFormat = 'EEE';
  @Input() dayFormat = 'd';
  @Input() firstWeekday: Weekday = Weekday.Monday;

  weekdays: Array<Date>;
  dayRange = Array.from(new Array(31), (x, i) => i + 1);
  generatedMonths: Array<Month>;

  private selectedDate: Date;
  private selectedDay: number;
  private selectedMonth: Month;
  private selectedMonthTime: number;

  private currentDay: number;
  private currentMonth: Month;

  private shownIndex: number;
  private pivotIndex: number;

  isSwipeAllowed = true;
  private isClickFixed = true;
  private panOffset = 0;
  private wrapperWidth: number;
  private easeOut = createEaseOut(1.5);
  private transitionDuration = 150;
  private isMoving = false;

  panes = [
    {
      order: -1,
      month: undefined,
    }, {
      order: 0,
      month: undefined,
    }, {
      order: 1,
      month: undefined,
    },
  ];

  inclination = 0;
  visiblePaneI = 1;

  get prevPaneI() {
    return (3 + this.visiblePaneI - 1) % 3;
  }

  get nextPaneI() {
    return (this.visiblePaneI + 1) % 3;
  }

  get earliestGeneratedDate(): Date {
    return this.generatedMonths[0].startDate;
  }

  get latestGeneratedDate(): Date {
    return this.generatedMonths[this.generatedMonths.length - 1].startDate;
  }

  get sliderStyles() {
    return {
      transition: this.inclination ? `transform ${this.transitionDuration}ms` : '',
      transform: `translateX(${(-this.inclination + this.panOffset) * 100}%)`,
    };
  }

  ngOnInit() {
    const currentDate = startOfToday();
    this.currentDay = getDay(currentDate);
    this.weekdays = generateWeekdayDates(currentDate, this.firstWeekday);
    if (!this.generatedMonths) {
      this.generateMonths(currentDate);
    }
    this.panes[0].month = this.generatedMonths[0];
    this.panes[1].month = this.generatedMonths[1];
    this.panes[2].month = this.generatedMonths[2];
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
    if (this.panOffset < -0.5) {
      this.showNext();
      this.isSwipeAllowed = false;
    } else if (this.panOffset > 0.5) {
      this.showPrev();
      this.isSwipeAllowed = false;
    }
    this.panOffset = 0;
  }

  select(event: MouseEvent, month: Month) {
    if (this.isClickFixed) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.selectedMonth = month;
      this.selectedDay = day;
      this.selectedDate = setDay(month.startDate, day);
      this.dateChange.emit(this.selectedDate);
    }
  }

  showPrev() {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;
    this.shownIndex--;
    this.inclination = -1;
    setTimeout(() => {
      if (this.shownIndex + this.pivotIndex === 0) {
        this.generatedMonths.unshift(this.generateMonth(subMonths(this.earliestGeneratedDate, 1)));
        this.pivotIndex++;
      }
      this.visiblePaneI = (3 + this.visiblePaneI - 1) % 3;
      const pane = this.panes[this.prevPaneI];
      const i = this.generatedMonths.findIndex(month => month === pane.month);
      pane.month = this.generatedMonths[i - 3];
      pane.order -= 3;
      this.inclination = 0;
      this.isMoving = false;
    }, this.transitionDuration);
  }

  showNext() {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;
    this.shownIndex++;
    this.inclination = 1;
    setTimeout(() => {
      if (this.shownIndex + this.pivotIndex === this.generatedMonths.length - 1) {
        this.generatedMonths.push(this.generateMonth(addMonths(this.latestGeneratedDate, 1)));
      }
      this.visiblePaneI = (3 + this.visiblePaneI + 1) % 3;
      const pane = this.panes[this.nextPaneI];
      const i = this.generatedMonths.findIndex(month => month === pane.month);
      pane.month = this.generatedMonths[i + 3];
      pane.order += 3;
      this.inclination = 0;
      this.isMoving = false;
    }, this.transitionDuration);
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
      weekShift: differenceInDays(monthDate, startOfWeek(monthDate, this.firstWeekday)) || 7,
    };
  }

  private updateSelectedMonthRef() {
    const selectedMonthIndex = this.generatedMonths.findIndex(month => {
      return month.startDate.getTime() === this.selectedMonthTime;
    });
    if (selectedMonthIndex > -1) {
      this.selectedMonth = this.generatedMonths[selectedMonthIndex];
      this.shownIndex = selectedMonthIndex - this.pivotIndex;
    } else {
      this.selectedMonth = undefined;
    }
  }

  private updateCurrentMonthRef() {
    const currentMonthTime = startOfMonth(new Date()).getTime();

    this.currentMonth = this.generatedMonths.find(month => {
      return month.startDate.getTime() === currentMonthTime;
    });
  }

}
