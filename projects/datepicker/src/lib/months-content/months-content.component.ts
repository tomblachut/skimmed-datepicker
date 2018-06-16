import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MonthsPane } from '../months-view/months-pane';
import { SliderComponent } from '../slider/slider.component';
import { MonthsViewComponent } from '../months-view/months-view.component';

@Component({
  selector: 'skm-months-content',
  templateUrl: './months-content.component.html',
  styleUrls: ['./months-content.component.scss', '../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthsContentComponent {
  @Input() pane: MonthsPane;

  @Input() selectedValue: number;
  @Input() currentValue: number;
  @Input() minValue: number;
  @Input() maxValue: number;

  @Input() monthLabels: string[];

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent, readonly monthsView: MonthsViewComponent) {
  }

  makeItemClasses(index: number, pane: MonthsPane): string {
    return [
      'skm-datepicker-month',
      'skm-datepicker-item',
      (pane.values[index] === this.selectedValue) ? 'skm-datepicker-selected' : '',
      (pane.values[index] === this.currentValue) ? 'skm-datepicker-current' : '',
    ].join(' ');
  }

  isDisabled(index: number, pane: MonthsPane): boolean {
    return (pane.values[index] < this.minValue) || (pane.values[index] > this.maxValue);
  }

}
