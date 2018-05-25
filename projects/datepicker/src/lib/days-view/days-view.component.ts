import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Weekday } from '../util/weekdays';
import { addMonths, differenceInDays, getDay, getDaysInMonth, setDay, startOfMonth, startOfWeek, weekdayDates } from '../util/date-utils';
import { range } from '../util/helpers';
import { DaysPane } from './days-pane';

@Component({
  selector: 'skm-days-view',
  templateUrl: './days-view.component.html',
  styleUrls: ['./days-view.component.scss'],
})
export class DaysViewComponent implements OnChanges, OnInit {
  @Input() selectedDate: Date;
  @Input() currentDate: Date;

  @Input() headingFormat: string;
  @Input() weekdayFormat: string;
  @Input() dayFormat: string;
  @Input() firstWeekday: Weekday;

  @Output() dateChange = new EventEmitter<Date>();
  @Output() headerClick = new EventEmitter<MouseEvent>();

  panes: Array<DaysPane>;
  readonly days = range(1, 31);
  weekdays: Array<Date>;

  private visiblePaneIndex: number;
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

  clickHeader(event: MouseEvent, notPanning: boolean) {
    if (notPanning) {
      this.headerClick.emit(event);
    }
  }

  selectItem(event: MouseEvent, start: Date, notPanning: boolean) {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.dateChange.emit(setDay(start, day));
    }
  }

  isCurrent(day: number, start: Date) {
    return day === this.currentDay && start.getTime() === this.currentMonthTime;
  }

  isSelected(day: number, start: Date) {
    return day === this.selectedDay && start.getTime() === this.selectedMonthTime;
  }

  switchPanes(direction: number) {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = makePane(pane.order + 3 * direction, pane.start, this.firstWeekday, 3 * direction);
  }

  private initPanes(date: Date) {
    const monthDate = startOfMonth(date);
    this.panes = [-1, 0, 1].map(i => makePane(i, monthDate, this.firstWeekday, i));
    this.visiblePaneIndex = 1;
  }

}

function makePane(order: number, start: Date, firstWeekday: Weekday, add = 0): DaysPane {
  start = addMonths(start, add);
  return {
    order,
    start,
    weekShift: differenceInDays(start, startOfWeek(start, firstWeekday)) || 7,
    length: getDaysInMonth(start),
  };
}
