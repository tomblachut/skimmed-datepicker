import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { WeekDay } from '@angular/common';
import { DaysPane } from '../days-view/days-pane';
import { SliderComponent } from '../slider/slider.component';
import { DaysViewComponent } from '../days-view/days-view.component';

@Component({
  selector: 'skm-days-content',
  templateUrl: './days-content.component.html',
  styleUrls: ['./days-content.component.scss', '../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysContentComponent {
  @Input() pane: DaysPane;

  @Input() selectedDay: number;
  @Input() selectedMonthTime: number;
  @Input() currentDay: number;
  @Input() currentMonthTime: number;

  @Input() firstWeekDay: WeekDay;
  @Input() weekDayLabels: string[];
  @Input() dayLabels: string[];

  @HostBinding('class') private hostClass = 'skm-datepicker-content';

  constructor(readonly slider: SliderComponent, readonly daysView: DaysViewComponent) {
  }

  makeItemClasses(index: number, monthDate: Date): string {
    const day = index + 1;
    return [
      'skm-datepicker-item',
      'skm-datepicker-day',
      (day === this.currentDay && monthDate.getTime() === this.currentMonthTime) ? 'skm-datepicker-current' : '',
      (day === this.selectedDay && monthDate.getTime() === this.selectedMonthTime) ? 'skm-datepicker-selected' : '',
    ].join(' ');
  }

}
