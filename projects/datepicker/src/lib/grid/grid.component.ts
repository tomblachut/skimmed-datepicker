import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pane } from '../pane';
import { SliderComponent } from '../slider/slider.component';
import { ViewStrategy } from '../view-strategies/view-strategy';
import { ViewComponent } from '../view/view.component';

@Component({
  selector: 'skm-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnChanges {
  @Input() pane: Pane;

  @Input() currentTimestamp: number;
  @Input() selectedTimestamp: number;
  @Input() minTimestamp: number;
  @Input() maxTimestamp: number;

  @Input() itemFormat: string;
  @Input() itemLabels: string[] = [];

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent,
              readonly parentView: ViewComponent,
              private readonly viewStrategy: ViewStrategy) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('itemLabels' in changes) {
      this.itemLabels = this.itemLabels || [];
    }
  }

  makeItemClasses(index: number, pane: Pane): string {
    return [
      this.viewStrategy.itemClass,
      'skm-datepicker-item',
      (pane.values[index] === this.currentTimestamp) ? 'skm-datepicker-current' : '',
      (pane.values[index] === this.selectedTimestamp) ? 'skm-datepicker-selected' : '',
    ].join(' ');
  }

  isDisabled(index: number, pane: Pane): boolean {
    return (pane.values[index] < this.minTimestamp) || (pane.values[index] > this.maxTimestamp);
  }

  trackIndex(index: number): number {
    return index;
  }

}
