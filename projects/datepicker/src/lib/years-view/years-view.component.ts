import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { range } from '../util/helpers';
import { startOfYear } from '../util/date-utils';
import { YearsPane } from './years-pane';
import { zoom, ZoomDirection } from '../util/zoom.animation';

@Component({
  selector: 'skm-years-view',
  templateUrl: './years-view.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  animations: [zoom()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearsViewComponent implements OnChanges {
  @Input() @HostBinding('@zoom') zoomDirection: ZoomDirection;

  @Input() selectedDate: Date;
  @Input() currentDate: Date;
  @Input() initialDate: Date;
  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Output() readonly dateChange = new EventEmitter<Date>();

  selectedYear: number;
  currentYear: number;
  minYear: number;
  maxYear: number;

  readonly years = range(0, 19);
  panes: Array<YearsPane>;
  prevDisabled = false;
  nextDisabled = false;
  private visiblePaneIndex: number;

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      this.selectedYear = this.selectedDate ? this.selectedDate.getFullYear() : undefined;
    }
    if ('minDate' in changes) {
      this.minYear = this.minDate ? this.minDate.getFullYear() : undefined;
    }
    if ('maxDate' in changes) {
      this.maxYear = this.maxDate ? this.maxDate.getFullYear() : undefined;
    }
    if ('currentDate' in changes) {
      this.currentYear = this.currentDate.getFullYear();
    }
    if ('initialDate' in changes) {
      this.initPanes(this.initialDate);
    }
  }

  trackContent(index: number) {
    return index;
  }

  selectItem(event: MouseEvent, start: number, notPanning: boolean): void {
    if (notPanning) {
      const button = event.target as HTMLButtonElement;
      const offset = +button.dataset.index;
      const date = startOfYear(new Date());
      date.setFullYear(offset + start);
      this.dateChange.emit(date);
    }
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = {
      order: pane.order + 3 * direction,
      start: pane.start + 3 * direction * this.years.length,
    };
    this.updateDisabledStatus((3 + this.visiblePaneIndex - 1) % 3, (3 + this.visiblePaneIndex + 1) % 3);
  }

  private initPanes(date: Date): void {
    const origin = date.getFullYear();
    const adjusted = origin - (origin % this.years.length);
    this.panes = [-1, 0, 1].map(i => ({
      order: i,
      start: adjusted + i * this.years.length,
    }));
    this.visiblePaneIndex = 1;
    this.updateDisabledStatus(0, 2);
  }

  private updateDisabledStatus(prevIndex: number, nextIndex: number): void {
    this.prevDisabled = this.panes[prevIndex].start < this.minYear;
    this.nextDisabled = this.panes[nextIndex].start > this.maxYear;
  }

}
