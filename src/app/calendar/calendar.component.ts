import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as addMonths from 'date-fns/add_months';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfToday from 'date-fns/start_of_today';
import * as subMonths from 'date-fns/sub_months';
import * as getDaysInMonth from 'date-fns/get_days_in_month'
import * as setDay from 'date-fns/set_date';
import * as getDay from 'date-fns/get_date';
import * as startOfDay from 'date-fns/start_of_day';
import {Weekday} from '../weekdays';
import {Month} from '../month';
import {generateWeekdayDates, startOfWeek} from '../utils';

@Component({
  selector: 'tb-calendar',
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
  dayRange = Array.from(new Array(31), (x, i) => i + 1)
  generatedMonths: Array<Month>;

  private selectedDate: Date;
  private selectedDay: number;
  private selectedMonth: Month;
  private selectedMonthTime: number;

  private currentDay: number;
  private currentMonth: Month;

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
    const currentDate = startOfToday();
    this.currentDay = getDay(currentDate);
    this.weekdays = generateWeekdayDates(currentDate, this.firstWeekday);
    if (!this.generatedMonths) {
      this.generateMonths(currentDate);
    }
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
