import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { WeekDay } from '@angular/common';
import { Pane } from '../pane';
import { zoom, ZoomDirection } from '../util/zoom.animation';
import { ViewMode } from '../datepicker/view-mode';
import { ViewStrategy } from '../view-strategies/view-strategy';

@Component({
  selector: 'skm-view',
  templateUrl: './view.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  animations: [zoom()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnChanges {
  @Input() @HostBinding('@zoom') zoomDirection: ZoomDirection;
  @Input() initialTimestamp: number;

  @Input() currentTimestamp: number;
  @Input() selectedTimestamp: number;
  @Input() minTimestamp: number;
  @Input() maxTimestamp: number;

  @Input() deselectEnabled: boolean;

  @Input() headingFormat: string;
  @Input() firstWeekDay: WeekDay;
  @Input() weekDayLabels: string[];
  @Input() itemFormat: string;
  @Input() itemLabels: string[];

  @Output() readonly itemChange = new EventEmitter<number>();
  @Output() readonly headerClick = new EventEmitter<number>();

  readonly ViewMode = ViewMode;

  panes: Array<Pane>;
  prevDisabled = false;
  nextDisabled = false;
  private visiblePaneIndex: number;
  private regularTimestampFields = ['currentTimestamp', 'selectedTimestamp', 'minTimestamp', 'maxTimestamp'];

  constructor(readonly viewStrategy: ViewStrategy) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewStrategy.viewMode !== ViewMode.Days) {
      this.regularTimestampFields.forEach(field => {
        if (field in changes) {
          this[field] = this[field] ? this.viewStrategy.normalizeTimestamp(this[field]) : undefined;
        }
      });
    }
    if ('initialTimestamp' in changes) {
      // Must be called after normalization of other timestamps for proper behavior of min-max range
      this.initPanes(this.initialTimestamp);
    }
  }

  trackIndex(index: number): number {
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
    this.panes[index] = this.viewStrategy.makePane(pane.values[0], 3 * direction, pane.order);
    this.updateDisabledStatus((3 + this.visiblePaneIndex - 1) % 3, (3 + this.visiblePaneIndex + 1) % 3);
  }

  private initPanes(timestamp: number): void {
    const seed = this.viewStrategy.makeInitPanesSeed(timestamp);
    this.panes = [-1, 0, 1].map(i => this.viewStrategy.makePane(seed, i, 0));
    this.visiblePaneIndex = 1;
    this.updateDisabledStatus(0, 2);
  }

  private updateDisabledStatus(prevIndex: number, nextIndex: number): void {
    this.prevDisabled = this.panes[prevIndex].values[this.panes[prevIndex].values.length - 1] < this.minTimestamp;
    this.nextDisabled = this.panes[nextIndex].values[0] > this.maxTimestamp;
  }

}
