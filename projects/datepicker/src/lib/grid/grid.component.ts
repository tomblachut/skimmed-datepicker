import { Attribute, ChangeDetectionStrategy, Component, HostBinding, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pane } from '../pane';
import { SliderComponent } from '../slider/slider.component';
import { DATEPICKER_VIEW, DatepickerView } from '../datepicker-view';

@Component({
  selector: 'skm-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnChanges {
  @Input() pane: Pane;

  @Input() selectedValue: number;
  @Input() currentValue: number;
  @Input() minValue: number;
  @Input() maxValue: number;

  @Input() itemFormat: string;
  @Input() itemLabels: string[] = [];

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent,
              @Inject(DATEPICKER_VIEW) readonly parentView: DatepickerView,
              @Attribute('itemClass') private itemClass: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('itemLabels' in changes) {
      this.itemLabels = this.itemLabels || [];
    }
  }

  makeItemClasses(index: number, pane: Pane): string {
    return [
      this.itemClass,
      'skm-datepicker-item',
      (pane.values[index] === this.selectedValue) ? 'skm-datepicker-selected' : '',
      (pane.values[index] === this.currentValue) ? 'skm-datepicker-current' : '',
    ].join(' ');
  }

  isDisabled(index: number, pane: Pane): boolean {
    return (pane.values[index] < this.minValue) || (pane.values[index] > this.maxValue);
  }

  trackIndex(index: number): number {
    return index;
  }

}
