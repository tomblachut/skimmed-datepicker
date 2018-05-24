import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { addYears, setMonth, startOfYear } from '../util/date-utils';
import { YearPane } from '../util/year-pane';

@Component({
  selector: 'skm-months-view',
  templateUrl: './months-view.component.html',
  styleUrls: ['./months-view.component.scss'],
})
export class MonthsViewComponent implements OnChanges {
  @Input() selectedDate: Date;
  @Input() currentDate: Date;

  @Input() yearFormat: string;

  @Output() monthChange = new EventEmitter<Date>();
  @Output() headerClick = new EventEmitter<MouseEvent>();

  panes: Array<YearPane>;
  visiblePaneIndex: number;

  months: string[];

  private selectedMonthNumber: number;
  private selectedYearTime: number;
  private currentMonthNumber: number;
  private currentYearTime: number;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.months = getLocaleMonthNames(locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      if (this.selectedDate) {
        this.selectedMonthNumber = this.selectedDate.getMonth();
        this.selectedYearTime = startOfYear(this.selectedDate).getTime();
        this.initPanes(this.selectedDate);
      } else {
        this.selectedYearTime = undefined;
      }
    }
    if ('currentDate' in changes) {
      this.currentMonthNumber = this.currentDate.getMonth();
      this.currentYearTime = startOfYear(this.currentDate).getTime();
    }
  }

  clickHeader(event: MouseEvent, notPanning: boolean) {
    if (notPanning) {
      this.headerClick.emit(event);
    }
  }

  selectItem(event: MouseEvent, year: Date, notPanning: boolean) {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const month = +button.dataset.index;
      this.monthChange.emit(setMonth(year, month));
    }
  }

  isCurrent(month: number, year: Date) {
    return month === this.currentMonthNumber && year.getTime() === this.currentYearTime;
  }

  isSelected(month: number, year: Date) {
    return month === this.selectedMonthNumber && year.getTime() === this.selectedYearTime;
  }

  switchPanes(direction: number) {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    pane.year = addYears(pane.year, 3 * direction);
    pane.order += 3 * direction;
  }

  private initPanes(date: Date) {
    const monthDate = startOfYear(date);
    this.panes = [-1, 0, 1].map(i => ({
      order: i,
      year: addYears(monthDate, i),
    }));
    this.visiblePaneIndex = 1;
  }

}
