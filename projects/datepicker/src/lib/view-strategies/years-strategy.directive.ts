import { Directive } from '@angular/core';
import { Pane } from '../pane';
import { startOfYear } from '../util/helpers';
import { ViewStrategy } from './view-strategy';
import { ViewMode } from '../datepicker/view-mode';
import { WeekDay } from '@angular/common';

@Directive({
  selector: '[skmYearsStrategy]',
  providers: [
    {provide: ViewStrategy, useExisting: YearsStrategyDirective},
  ],
})
export class YearsStrategyDirective extends ViewStrategy {
  readonly viewMode = ViewMode.Years;
  readonly itemClass = 'skm-datepicker-year';

  normalizeTimestamp(timestamp: number): number {
    return new Date(timestamp).setMonth(0, 1);
  }

  makeInitPanesSeed(timestamp: number): number {
    const date = new Date(timestamp);
    const origin = date.getFullYear();
    const adjusted = origin - (origin % 20);
    return startOfYear(date).setFullYear(adjusted);
  }

  makePane(timestamp: number, add: number, baseOrder: number, weekStart: WeekDay): Pane {
    const date = new Date(timestamp);
    const origin = add * 20 + date.getFullYear();

    const values = [];
    for (let i = 0; i < 20; i++) {
      values.push(date.setFullYear(origin + i));
    }

    return {
      order: baseOrder + add,
      values: values,
    };
  }

}
