import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Pane } from '../pane';
import { SliderComponent } from '../slider/slider.component';
import { YearsViewComponent } from '../years-view/years-view.component';

@Component({
  selector: 'skm-years-content',
  templateUrl: './years-content.component.html',
  styleUrls: ['../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearsContentComponent {
  @Input() pane: Pane;
  @Input() years: number[];

  @Input() selectedValue: number;
  @Input() currentValue: number;
  @Input() minValue: number;
  @Input() maxValue: number;

  @Input() yearFormat: string;

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent, readonly yearsView: YearsViewComponent) {
  }

  makeItemClasses(index: number, pane: Pane): string {
    return [
      'skm-datepicker-year',
      'skm-datepicker-item',
      (pane.values[index] === this.selectedValue) ? 'skm-datepicker-selected' : '',
      (pane.values[index] === this.currentValue) ? 'skm-datepicker-current' : '',
    ].join(' ');
  }

  isDisabled(index: number, pane: Pane): boolean {
    return (pane.values[index] < this.minValue) || (pane.values[index] > this.maxValue);
  }

}
