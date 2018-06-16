import { Attribute, ChangeDetectionStrategy, Component, HostBinding, Inject, Input } from '@angular/core';
import { Pane } from '../pane';
import { SliderComponent } from '../slider/slider.component';
import { DATEPICKER_VIEW, DatepickerView } from '../datepicker-view';

@Component({
  selector: 'skm-months-content',
  templateUrl: './months-content.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthsContentComponent {
  @Input() pane: Pane;

  @Input() selectedValue: number;
  @Input() currentValue: number;
  @Input() minValue: number;
  @Input() maxValue: number;

  @Input() labels: string[];

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent,
              @Inject(DATEPICKER_VIEW) readonly parentView: DatepickerView,
              @Attribute('itemClass') private itemClass: string) {
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

}
