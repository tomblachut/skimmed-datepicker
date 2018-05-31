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
import { FormStyle, getLocaleDayNames, TranslationWidth, WeekDay } from '@angular/common';
import { addMonths, getDaysInMonth, setDate, startOfMonth } from '../util/date-utils';
import { range } from '../util/helpers';
import { DaysPane } from './days-pane';
import { zoom, ZoomDirection } from '../util/zoom.animation';

@Component({
  selector: 'skm-days-view',
  templateUrl: './days-view.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  animations: [zoom()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysViewComponent implements OnChanges {
  @Input() @HostBinding('@zoom') zoomDirection: ZoomDirection;

  @Input() selectedDate: Date;
  @Input() currentDate: Date;
  @Input() initialDate: Date;

  @Input() deselectEnabled: boolean;

  @Input() headingFormat: string;
  @Input() firstWeekDay: WeekDay;
  @Input() weekDayLabels: string[];
  @Input() dayLabels: string[];

  @Output() readonly dateChange = new EventEmitter<Date>();
  @Output() readonly headerClick = new EventEmitter<Date>();

  panes: Array<DaysPane>;

  selectedDay: number;
  selectedMonthTime: number;
  currentDay: number;
  currentMonthTime: number;
  private visiblePaneIndex: number;

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      if (this.selectedDate) {
        this.selectedDay = this.selectedDate.getDate();
        this.selectedMonthTime = startOfMonth(this.selectedDate).getTime();
      } else {
        this.selectedDay = undefined;
        this.selectedMonthTime = undefined;
      }
    }
    if ('currentDate' in changes) {
      this.currentDay = this.currentDate.getDate();
      this.currentMonthTime = startOfMonth(this.currentDate).getTime();
    }
    if ('initialDate' in changes) {
      this.initPanes(this.initialDate);
    }
    if ('dayLabels' in changes) {
      this.dayLabels = this.dayLabels ? this.dayLabels.slice(0, 31) : range(1, 31).map(String);
    }
    if ('weekDayLabels' in changes) {
      this.weekDayLabels = this.weekDayLabels
        ? this.weekDayLabels.slice(0, 7)
        : getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
    }
  }

  trackContent(index: number) {
    return index;
  }

  clickHeader(notPanning: boolean): void {
    if (notPanning) {
      this.headerClick.emit(this.panes[this.visiblePaneIndex].monthDate);
    }
  }

  selectItem(event: MouseEvent, monthDate: Date, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const day = +button.dataset.index + 1;
      if (this.deselectEnabled && monthDate.getTime() === this.selectedMonthTime && day === this.selectedDay) {
        this.dateChange.emit(undefined);
      } else {
        this.dateChange.emit(setDate(monthDate, day));
      }
    }
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = makePane(pane.monthDate, this.firstWeekDay, 3 * direction, pane.order);
  }

  private initPanes(date: Date): void {
    const monthDate = startOfMonth(date);
    this.panes = [-1, 0, 1].map(i => makePane(monthDate, this.firstWeekDay, i));
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
