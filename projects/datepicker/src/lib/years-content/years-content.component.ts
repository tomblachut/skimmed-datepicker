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

  @HostBinding('class') private hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent, readonly yearsView: YearsViewComponent) {
  }

  makeItemClasses(offset: number, start: number): string {
    return [
      'skm-datepicker-item',
      'skm-datepicker-year',
      (offset + start === this.currentYear) ? 'skm-datepicker-current' : '',
      (offset + start === this.selectedYear) ? 'skm-datepicker-selected' : '',
    ].join(' ');
  }

}
