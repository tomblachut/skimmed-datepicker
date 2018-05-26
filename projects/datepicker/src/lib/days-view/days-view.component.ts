import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormStyle, getLocaleDayNames, TranslationWidth, WeekDay } from '@angular/common';
import { addMonths, getDay, getDaysInMonth, setDay, startOfMonth } from '../util/date-utils';
import { range } from '../util/helpers';
import { DaysPane } from './days-pane';
import { ChangeDetectionStrategy } from '../../../../../node_modules/@angular/core';

@Component({
  selector: 'skm-days-view',
  templateUrl: './days-view.component.html',
  styleUrls: ['./days-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysViewComponent implements OnChanges {
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
  weekdays: ReadonlyArray<string>;

  private visiblePaneIndex: number;
  private selectedDay: number;
  private selectedMonthTime: number;
  private currentDay: number;
  private currentMonthTime: number;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.weekdays = getLocaleDayNames(locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
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

  clickHeader(notPanning: boolean): void {
    if (notPanning) {
      this.headerClick.emit(this.panes[this.visiblePaneIndex].monthDate);
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
    const pane = this.panes[index];
    this.panes[index] = makePane(pane.monthDate, this.firstWeekday, 3 * direction, pane.order);
  }

  private initPanes(date: Date): void {
    const monthDate = startOfMonth(date);
    this.panes = [-1, 0, 1].map(i => makePane(monthDate, this.firstWeekday, i));
    this.visiblePaneIndex = 1;
  }

}

function makePane(date: Date, firstWeekDay: WeekDay, add: number, baseOrder = 0): DaysPane {
  const monthDate = addMonths(date, add);
  return {
    order: baseOrder + add,
    monthDate,
    weekShift: (monthDate.getDay() - firstWeekDay + 7) % 7 || 7, // Defaulting to full week makes for more a balanced day cells layout
    length: getDaysInMonth(monthDate),
  };
}
