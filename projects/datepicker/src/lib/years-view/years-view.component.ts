import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { startOfYear } from '../util/helpers';
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

  @Input() set initialTimestamp(timestamp: number) {
    this.initPanes(timestamp);
  }

  @Input() selectedDate: number;
  @Input() currentDate: number;
  @Input() minDate: number;
  @Input() maxDate: number;

  @Input() yearFormat: string;

  @Output() readonly itemChange = new EventEmitter<number>();

  currentTimestamp: number;
  selectedTimestamp: number;
  minTimestamp: number;
  maxTimestamp: number;

  panes: Array<Pane>;
  prevDisabled = false;
  nextDisabled = false;
  private visiblePaneIndex: number;

  ngOnChanges(changes: SimpleChanges): void {
    if ('currentDate' in changes) {
      this.currentTimestamp = new Date(this.currentDate).setMonth(0, 1);
    }
    if ('selectedDate' in changes) {
      this.selectedTimestamp = this.selectedDate ? new Date(this.selectedDate).setMonth(0, 1) : undefined;
    }
    if ('minDate' in changes) {
      this.minTimestamp = this.minDate ? new Date(this.minDate).setMonth(0, 1) : undefined;
    }
    if ('maxDate' in changes) {
      this.maxTimestamp = this.maxDate ? new Date(this.maxDate).setMonth(0, 1) : undefined;
    }
  }

  trackContent(index: number) {
    return index;
  }

  selectItem(event: MouseEvent, pane: Pane, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const index = button.dataset.index;
      this.itemChange.emit(pane.values[index]);
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
    const date = new Date(timestamp);
    const origin = date.getFullYear();
    const adjusted = origin - (origin % 20);
    const yearValue = startOfYear(date).setFullYear(adjusted);

    this.panes = [-1, 0, 1].map(i => this.makePane(yearValue, i));
    this.visiblePaneIndex = 1;
    this.updateDisabledStatus(0, 2);
  }

  private updateDisabledStatus(prevIndex: number, nextIndex: number): void {
    this.prevDisabled = this.panes[prevIndex].values[19] < this.minTimestamp;
    this.nextDisabled = this.panes[nextIndex].values[0] > this.maxTimestamp;
  }

  private makePane(timestamp: number, add: number, baseOrder = 0): Pane {
    const date = new Date(timestamp);
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

}
