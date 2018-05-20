import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Weekday } from '../util/weekdays';
import { getDay, setDay, startOfMonth, weekdayDates } from '../util/date-utils';
import { Month } from '../util/month';
import { Pane } from '../datepicker.component';
import { range } from '../util/helpers';

@Component({
  selector: 'skm-days-view',
  templateUrl: './days-view.component.html',
  styleUrls: ['./days-view.component.scss', '../shared.scss'],
})
export class DaysViewComponent implements OnChanges, OnInit {
  @Input() selectedDate: Date;
  @Input() currentDate: Date;

  @Input() headingFormat: string;
  @Input() weekdayFormat: string;
  @Input() dayFormat: string;
  @Input() firstWeekday: Weekday;

  @Output() dayChange = new EventEmitter<Date>();

  panes: Array<Pane>;
  visiblePaneIndex: number;

  days = range(1, 31);
  weekdays: Array<Date>;

  private selectedDay: number;
  private selectedMonthTime: number;
  private currentDay: number;
  private currentMonthTime: number;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      if (this.selectedDate) {
        this.selectedDay = getDay(this.selectedDate);
        this.selectedMonthTime = startOfMonth(this.selectedDate).getTime();
        this.initPanes(this.selectedDate);
      } else {
        this.selectedDay = undefined;
        this.selectedMonthTime = undefined;
      }
    }
    if ('currentDate' in changes) {
      this.currentDay = getDay(this.currentDate);
      this.currentMonthTime = startOfMonth(this.currentDate).getTime();
    }
  }

  ngOnInit() {
    this.weekdays = weekdayDates(this.currentDate, this.firstWeekday);
    if (!this.panes) {
      this.initPanes(this.currentDate);
    }
  }

  selectDay(event: MouseEvent, month: Month, notPanning: boolean) {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.dayChange.emit(setDay(month.date, day));
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

}
