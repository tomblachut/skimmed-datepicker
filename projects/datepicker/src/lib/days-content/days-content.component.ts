import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { WeekDay } from '@angular/common';
import { Pane } from '../pane';
import { SliderComponent } from '../slider/slider.component';
import { DaysViewComponent } from '../days-view/days-view.component';

@Component({
  selector: 'skm-days-content',
  templateUrl: './days-content.component.html',
  styleUrls: ['./days-content.component.scss', '../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysContentComponent {
  @Input() pane: Pane;

  @Input() selectedValue: number;
  @Input() currentValue: number;
  @Input() minValue: number;
  @Input() maxValue: number;

  @Input() firstWeekDay: WeekDay;
  @Input() weekDayLabels: string[];
  @Input() dayLabels: string[];

  @HostBinding('class') readonly _hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent, readonly daysView: DaysViewComponent) {
  }

  makeItemClasses(index: number, pane: Pane): string {
    return [
      'skm-datepicker-day',
      'skm-datepicker-item',
      (pane.values[index] === this.selectedValue) ? 'skm-datepicker-selected' : '',
      (pane.values[index] === this.currentValue) ? 'skm-datepicker-current' : '',
    ].join(' ');
  }

  isDisabled(index: number, pane: Pane): boolean {
    return (pane.values[index] < this.minValue) || (pane.values[index] > this.maxValue);
  }

}
