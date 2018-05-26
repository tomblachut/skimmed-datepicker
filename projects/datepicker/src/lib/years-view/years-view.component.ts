import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { range } from '../util/helpers';
import { startOfYear } from '../util/date-utils';
import { YearsPane } from './years-pane';

@Component({
  selector: 'skm-years-view',
  templateUrl: './years-view.component.html',
  styleUrls: ['./years-view.component.scss'],
})
export class YearsViewComponent implements OnChanges {
  @Input() selectedDate: Date;
  @Input() currentDate: Date;
  @Input() initialDate: Date;

  @Input() yearFormat: string;

  @Output() dateChange = new EventEmitter<Date>();

  panes: Array<YearsPane>;
  readonly years = range(0, 19);

  private visiblePaneIndex: number;
  private selectedYear: number;
  private currentYear: number;

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedDate' in changes) {
      if (this.selectedDate) {
        this.selectedYear = this.selectedDate.getFullYear();
      } else {
        this.selectedYear = undefined;
      }
    }
    if ('currentDate' in changes) {
      this.currentYear = this.currentDate.getFullYear();
    }
    if ('initialDate' in changes) {
      this.initPanes(this.initialDate);
    }
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

  isCurrent(offset: number, start: number): boolean {
    return offset + start === this.currentYear;
  }

  isSelected(offset: number, start: number): boolean {
    return offset + start === this.selectedYear;
  }

  switchPanes(direction: number): void {
    this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
    const index = (3 + this.visiblePaneIndex + direction) % 3;
    const pane = this.panes[index];
    this.panes[index] = {
      order: pane.order + 3 * direction,
      start: pane.start + 3 * direction * this.years.length,
    };
  }

  private initPanes(date: Date): void {
    const origin = date.getFullYear();
    const adjusted = origin - (origin % this.years.length);
    this.panes = [-1, 0, 1].map(i => ({
      order: i,
      start: adjusted + i * this.years.length,
    }));
    this.visiblePaneIndex = 1;
  }

}
