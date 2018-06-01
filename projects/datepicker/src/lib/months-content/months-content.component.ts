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

  @Input() selectedMonthNumber: number;
  @Input() selectedYearTime: number;
  @Input() currentMonthNumber: number;
  @Input() currentYearTime: number;

  @Input() monthLabels: string[];

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent, readonly monthsView: MonthsViewComponent) {
  }

  makeItemClasses(month: number, yearDate: Date): string {
    return [
      'skm-datepicker-item',
      'skm-datepicker-month',
      (month === this.currentMonthNumber && yearDate.getTime() === this.currentYearTime) ? 'skm-datepicker-current' : '',
      (month === this.selectedMonthNumber && yearDate.getTime() === this.selectedYearTime) ? 'skm-datepicker-selected' : '',
    ].join(' ');
  }

}
