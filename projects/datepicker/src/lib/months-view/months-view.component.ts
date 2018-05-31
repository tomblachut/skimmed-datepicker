import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { addYears, setMonth, startOfYear } from '../util/date-utils';
import { MonthsPane } from './months-pane';
import { zoom, ZoomDirection } from '../util/zoom.animation';

@Component({
  selector: 'skm-months-view',
  templateUrl: './months-view.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  animations: [zoom()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthsViewComponent implements OnChanges {
  @Input() @HostBinding('@zoom') zoomDirection: ZoomDirection;

  @Input() selectedDate: Date;
  @Input() currentDate: Date;
  @Input() initialDate: Date;

  @Input() yearFormat: string;
  @Input() monthLabels: string[];

  @Output() readonly dateChange = new EventEmitter<Date>();
  @Output() readonly headerClick = new EventEmitter<Date>();

  panes: Array<MonthsPane>;

  selectedMonthNumber: number;
  selectedYearTime: number;
  currentMonthNumber: number;
  currentYearTime: number;
  private visiblePaneIndex: number;

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      if (this.selectedDate) {
        this.selectedMonthNumber = this.selectedDate.getMonth();
        this.selectedYearTime = startOfYear(this.selectedDate).getTime();
      } else {
        this.selectedMonthNumber = undefined;
        this.selectedYearTime = undefined;
      }
    }
    if ('currentDate' in changes) {
      this.currentMonthNumber = this.currentDate.getMonth();
      this.currentYearTime = startOfYear(this.currentDate).getTime();
    }
    if ('initialDate' in changes) {
      this.initPanes(this.initialDate);
    }
    if ('monthLabels' in changes) {
      this.monthLabels = this.monthLabels
        ? this.monthLabels.slice(0, 12)
        : getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
    }
  }

  trackContent(index: number) {
    return index;
  }

  clickHeader(notPanning: boolean): void {
    if (notPanning) {
      this.headerClick.emit(this.panes[this.visiblePaneIndex].yearDate);
    }
  }

  selectItem(event: MouseEvent, yearDate: Date, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const month = +button.dataset.index;
      this.dateChange.emit(setMonth(yearDate, month));
    }
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = {
      order: pane.order + 3 * direction,
      yearDate: addYears(pane.yearDate, 3 * direction),
    };
  }

  private initPanes(date: Date): void {
    const monthDate = startOfYear(date);
    this.panes = [-1, 0, 1].map(i => ({
      order: i,
      yearDate: addYears(monthDate, i),
    }));
    this.visiblePaneIndex = 1;
  }

}
