import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { WeekDay } from '@angular/common';
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
  @Input() initialDate: Date;

  @Input() headingFormat: string;
  @Input() weekdayFormat: string;
  @Input() dayFormat: string;
  @Input() firstWeekday: WeekDay;

  @Output() dateChange = new EventEmitter<Date>();
  @Output() headerClick = new EventEmitter<Date>();

  panes: Array<DaysPane>;
  readonly days = range(1, 31);
  weekdays: Array<Date>;

  get visiblePane(): DaysPane {
    return this.panes[this.visiblePaneIndex];
  }

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
      } else {
        this.selectedDay = undefined;
        this.selectedMonthTime = undefined;
      }
    }
    if ('currentDate' in changes) {
      this.currentDay = getDay(this.currentDate);
      this.currentMonthTime = startOfMonth(this.currentDate).getTime();
    }
    if ('initialDate' in changes) {
      this.initPanes(this.initialDate);
    }
  }

  ngOnInit(): void {
    this.weekdays = weekdayDates(this.currentDate, this.firstWeekday);
  }

  clickHeader(notPanning: boolean): void {
    if (notPanning) {
      this.headerClick.emit(this.visiblePane.monthDate);
    }
  }

  selectItem(event: MouseEvent, monthDate: Date, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const day = +button.textContent;
      this.dateChange.emit(setDay(monthDate, day));
    }
  }

  isCurrent(day: number, monthDate: Date): boolean {
    return day === this.currentDay && monthDate.getTime() === this.currentMonthTime;
  }

  isSelected(day: number, monthDate: Date): boolean {
    return day === this.selectedDay && monthDate.getTime() === this.selectedMonthTime;
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    this.panes[index] = makePane(this.visiblePane.order, this.visiblePane.monthDate, this.firstWeekday, 3 * direction);
  }

  private initPanes(date: Date): void {
    const monthDate = startOfMonth(date);
    this.panes = [-1, 0, 1].map(i => makePane(i, monthDate, this.firstWeekday, i));
    this.visiblePaneIndex = 1;
  }

}

function makePane(baseOrder: number, monthDate: Date, firstWeekday: WeekDay, add: number): DaysPane {
  monthDate = addMonths(monthDate, add);
  return {
    order: baseOrder + add,
    monthDate,
    weekShift: differenceInDays(monthDate, startOfWeek(monthDate, firstWeekday)) || 7,
    length: getDaysInMonth(monthDate),
  };
}
