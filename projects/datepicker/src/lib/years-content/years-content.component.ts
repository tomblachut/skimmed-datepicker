import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { YearsPane } from '../years-view/years-pane';
import { SliderComponent } from '../slider/slider.component';
import { YearsViewComponent } from '../years-view/years-view.component';

@Component({
  selector: 'skm-years-content',
  templateUrl: './years-content.component.html',
  styleUrls: ['./years-content.component.scss', '../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearsContentComponent {
  @Input() pane: YearsPane;
  @Input() years: number[];

  @Input() selectedYear: number;
  @Input() currentYear: number;
  @Input() minYear: number;
  @Input() maxYear: number;

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent, readonly yearsView: YearsViewComponent) {
  }

  makeItemClasses(offset: number, start: number): string {
    const year = offset + start;
    return [
      'skm-datepicker-item',
      'skm-datepicker-year',
      (year === this.currentYear) ? 'skm-datepicker-current' : '',
      (year === this.selectedYear) ? 'skm-datepicker-selected' : '',
    ].join(' ');
  }

  isDisabled(offset: number, start: number): boolean {
    const year = offset + start;
    return (year < this.minYear) || (year > this.maxYear);
  }

}
