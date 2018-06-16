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
import { startOfMonth } from '../util/date-utils';
import { range } from '../util/helpers';
import { Pane } from '../pane';
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
  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Input() deselectEnabled: boolean;

  @Input() headingFormat: string;
  @Input() firstWeekDay: WeekDay;
  @Input() weekDayLabels: string[];
  @Input() dayLabels: string[];

  @Output() readonly dateChange = new EventEmitter<Date>();
  @Output() readonly headerClick = new EventEmitter<Date>();

  selectedValue: number;
  currentValue: number;
  minValue: number;
  maxValue: number;
  initialValue: number; // TODO reconsider

  panes: Array<Pane>;
  prevDisabled = false;
  nextDisabled = false;
  private visiblePaneIndex: number;

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      this.selectedValue = this.selectedDate ? this.selectedDate.valueOf() : undefined;
    }
    if ('currentDate' in changes) {
      this.currentValue = this.currentDate.valueOf();
    }
    if ('minDate' in changes) {
      this.minValue = this.minDate ? this.minDate.valueOf() : undefined;
    }
    if ('maxDate' in changes) {
      this.maxValue = this.maxDate ? this.maxDate.valueOf() : undefined;
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
      this.headerClick.emit(new Date(this.panes[this.visiblePaneIndex].values[0]));
    }
  }

  selectItem(event: MouseEvent, pane: Pane, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const index = button.dataset.index;
      if (this.deselectEnabled && pane.values[index] === this.selectedValue) {
        this.dateChange.emit(undefined);
      } else {
        this.dateChange.emit(new Date(pane.values[index]));
      }
    }
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = makePane(pane.values[0], this.firstWeekDay, 3 * direction, pane.order);
    this.updateDisabledStatus((3 + this.visiblePaneIndex - 1) % 3, (3 + this.visiblePaneIndex + 1) % 3);
  }

  private initPanes(date: Date): void {
    const monthValue = startOfMonth(date).valueOf();
    this.panes = [-1, 0, 1].map(i => makePane(monthValue, this.firstWeekDay, i));
    this.visiblePaneIndex = 1;
    this.updateDisabledStatus(0, 2);
  }

  private updateDisabledStatus(prevIndex: number, nextIndex: number): void {
    this.prevDisabled = this.panes[prevIndex].values[this.panes[prevIndex].values.length - 1] < this.minValue;
    this.nextDisabled = this.panes[nextIndex].values[0] > this.maxValue;
  }

}

function makePane(value: number, firstWeekDay: WeekDay, add: number, baseOrder = 0): Pane {
  const date = new Date(value);
  date.setMonth(add + date.getMonth());
  const firstDay = date.getDay();

  date.setMonth(1 + date.getMonth());
  date.setDate(0);
  const monthLength = date.getDate();

  const values = [];
  for (let i = 1; i <= monthLength; i++) {
    values.push(date.setDate(i));
  }

  return {
    order: baseOrder + add,
    values: values,
    indent: (firstDay - firstWeekDay + 7) % 7 || 7, // Defaulting to full week makes for more a balanced cells layout
  };
}
