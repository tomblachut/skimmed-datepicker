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
import { startOfYear } from '../util/date-utils';
import { Pane } from '../pane';
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
  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Input() yearFormat: string;
  @Input() monthLabels: string[];

  @Output() readonly dateChange = new EventEmitter<Date>();
  @Output() readonly headerClick = new EventEmitter<Date>();

  selectedValue: number;
  currentValue: number;
  minValue: number;
  maxValue: number;

  panes: Array<Pane>;
  prevDisabled = false;
  nextDisabled = false;
  private visiblePaneIndex: number;

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      this.selectedValue = this.selectedDate ? new Date(this.selectedDate).setDate(1) : undefined;
    }
    if ('currentDate' in changes) {
      this.currentValue = new Date(this.currentDate).setDate(1);
    }
    if ('minDate' in changes) {
      this.minValue = this.minDate ? new Date(this.minDate).setDate(1) : undefined;
    }
    if ('maxDate' in changes) {
      this.maxValue = this.maxDate ? new Date(this.maxDate).setDate(1) : undefined;
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
      this.headerClick.emit(new Date(this.panes[this.visiblePaneIndex].values[0]));
    }
  }

  selectItem(event: MouseEvent, pane: Pane, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const index = button.dataset.index;
      this.dateChange.emit(new Date(pane.values[index]));
    }
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = makePane(pane.values[0], 3 * direction, pane.order);
    this.updateDisabledStatus((3 + this.visiblePaneIndex - 1) % 3, (3 + this.visiblePaneIndex + 1) % 3);
  }

  private initPanes(date: Date): void {
    const yearValue = startOfYear(date).valueOf();
    this.panes = [-1, 0, 1].map(i => makePane(yearValue, i));
    this.visiblePaneIndex = 1;
    this.updateDisabledStatus(0, 2);
  }

  private updateDisabledStatus(prevIndex: number, nextIndex: number): void {
    this.prevDisabled = this.panes[prevIndex].values[11] < this.minValue;
    this.nextDisabled = this.panes[nextIndex].values[0] > this.maxValue;
  }

}

function makePane(value: number, add: number, baseOrder = 0): Pane {
  const date = new Date(value);
  date.setFullYear(add + date.getFullYear());

  const values = [];
  for (let i = 0; i < 12; i++) {
    values.push(date.setMonth(i));
  }

  return {
    order: baseOrder + add,
    values: values,
  };
}
