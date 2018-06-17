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
import { Pane } from '../pane';
import { zoom, ZoomDirection } from '../util/zoom.animation';
import { DATEPICKER_VIEW, DatepickerView } from '../datepicker-view';
import { startOfMonth } from '../util/helpers';

@Component({
  selector: 'skm-days-view',
  templateUrl: './days-view.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  animations: [zoom()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: DATEPICKER_VIEW, useExisting: DaysViewComponent},
  ],
})
export class DaysViewComponent implements DatepickerView, OnChanges {
  @Input() @HostBinding('@zoom') zoomDirection: ZoomDirection;

  @Input() set initialTimestamp(timestamp: number) {
    this.initPanes(timestamp);
  }

  @Input() currentDate: number;
  @Input() selectedDate: number;
  @Input() minDate: number;
  @Input() maxDate: number;

  @Input() deselectEnabled: boolean;

  @Input() headingFormat: string;
  @Input() firstWeekDay: WeekDay;
  @Input() weekDayLabels: string[];
  @Input() dayFormat: string;
  @Input() dayLabels: string[];

  @Output() readonly itemChange = new EventEmitter<number>();
  @Output() readonly headerClick = new EventEmitter<number>();

  selectedTimestamp: number;
  currentTimestamp: number;
  minTimestamp: number;
  maxTimestamp: number;

  panes: Array<Pane>;
  prevDisabled = false;
  nextDisabled = false;
  private visiblePaneIndex: number;

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('currentDate' in changes) {
      this.currentTimestamp = this.currentDate.valueOf();
    }
    if ('selectedDate' in changes) {
      this.selectedTimestamp = this.selectedDate ? this.selectedDate.valueOf() : undefined;
    }
    if ('minDate' in changes) {
      this.minTimestamp = this.minDate ? this.minDate.valueOf() : undefined;
    }
    if ('maxDate' in changes) {
      this.maxTimestamp = this.maxDate ? this.maxDate.valueOf() : undefined;
    }
    if ('weekDayLabels' in changes) {
      this.weekDayLabels = this.weekDayLabels || getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
    }
  }

  trackContent(index: number) {
    return index;
  }

  clickHeader(notPanning: boolean): void {
    if (notPanning) {
      this.headerClick.emit(this.panes[this.visiblePaneIndex].values[0]);
    }
  }

  selectItem(event: MouseEvent, pane: Pane, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const index = button.dataset.index;
      if (this.deselectEnabled && pane.values[index] === this.selectedTimestamp) {
        this.itemChange.emit(undefined);
      } else {
        this.itemChange.emit(pane.values[index]);
      }
    }
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = this.makePane(pane.values[0], 3 * direction, pane.order);
    this.updateDisabledStatus((3 + this.visiblePaneIndex - 1) % 3, (3 + this.visiblePaneIndex + 1) % 3);
  }

  private initPanes(timestamp: number): void {
    const monthValue = startOfMonth(timestamp).valueOf();
    this.panes = [-1, 0, 1].map(i => this.makePane(monthValue, i));
    this.visiblePaneIndex = 1;
    this.updateDisabledStatus(0, 2);
  }

  private updateDisabledStatus(prevIndex: number, nextIndex: number): void {
    this.prevDisabled = this.panes[prevIndex].values[this.panes[prevIndex].values.length - 1] < this.minTimestamp;
    this.nextDisabled = this.panes[nextIndex].values[0] > this.maxTimestamp;
  }

  private makePane(timestamp: number, add: number, baseOrder = 0): Pane {
    const date = new Date(timestamp);
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
      indent: (firstDay - this.firstWeekDay + 7) % 7 || 7, // Defaulting to full week makes for more a balanced cells layout
    };
  }

}
