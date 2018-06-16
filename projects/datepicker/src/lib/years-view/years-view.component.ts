import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { range, startOfYear } from '../util/helpers';
import { Pane } from '../pane';
import { zoom, ZoomDirection } from '../util/zoom.animation';
import { DATEPICKER_VIEW, DatepickerView } from '../datepicker-view';

@Component({
  selector: 'skm-years-view',
  templateUrl: './years-view.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  animations: [zoom()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: DATEPICKER_VIEW, useExisting: YearsViewComponent},
  ],
})
export class YearsViewComponent implements DatepickerView, OnChanges {
  @Input() @HostBinding('@zoom') zoomDirection: ZoomDirection;

  @Input() selectedDate: Date;
  @Input() currentDate: Date;
  @Input() initialDate: Date;
  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Input() yearFormat: string;

  @Output() readonly dateChange = new EventEmitter<Date>();

  selectedValue: number;
  currentValue: number;
  minValue: number;
  maxValue: number;

  readonly years = range(0, 19);
  panes: Array<Pane>;
  prevDisabled = false;
  nextDisabled = false;
  private visiblePaneIndex: number;

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      this.selectedValue = this.selectedDate ? new Date(this.selectedDate).setMonth(0, 1) : undefined;
    }
    if ('minDate' in changes) {
      this.minValue = this.minDate ? new Date(this.minDate).setMonth(0, 1) : undefined;
    }
    if ('maxDate' in changes) {
      this.maxValue = this.maxDate ? new Date(this.maxDate).setMonth(0, 1) : undefined;
    }
    if ('currentDate' in changes) {
      this.currentValue = new Date(this.currentDate).setMonth(0, 1);
    }
    if ('initialDate' in changes) {
      this.initPanes(this.initialDate);
    }
  }

  trackContent(index: number) {
    return index;
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
    const origin = date.getFullYear();
    const adjusted = origin - (origin % this.years.length);
    const yearValue = startOfYear(date).setFullYear(adjusted);

    this.panes = [-1, 0, 1].map(i => makePane(yearValue, i));
    this.visiblePaneIndex = 1;
    this.updateDisabledStatus(0, 2);
  }

  private updateDisabledStatus(prevIndex: number, nextIndex: number): void {
    this.prevDisabled = this.panes[prevIndex].values[19] < this.minValue;
    this.nextDisabled = this.panes[nextIndex].values[0] > this.maxValue;
  }

}

function makePane(value: number, add: number, baseOrder = 0): Pane {
  const date = new Date(value);
  const origin = add * 20 + date.getFullYear();

  const values = [];
  for (let i = 0; i < 20; i++) {
    values.push(date.setFullYear(origin + i));
  }

  return {
    order: baseOrder + add,
    values: values,
  };
}
