import { Directive } from '@angular/core';
import { Pane } from '../pane';
import { startOfYear } from '../util/helpers';
import { ViewStrategy } from './view-strategy';
import { ViewMode } from '../datepicker/view-mode';
import { WeekDay } from '@angular/common';

@Directive({
  selector: '[skmMonthsStrategy]',
  providers: [
    {provide: ViewStrategy, useExisting: MonthsStrategyDirective},
  ],
})
export class MonthsStrategyDirective extends ViewStrategy {
  readonly viewMode = ViewMode.Months;
  readonly itemClass = 'skm-datepicker-month';

  normalizeTimestamp(timestamp: number): number {
    return new Date(timestamp).setDate(1);
  }

  makeInitPanesSeed(timestamp: number): number {
    return startOfYear(timestamp).valueOf();
  }

  makePane(timestamp: number, add: number, baseOrder: number, weekStart: WeekDay): Pane {
    const date = new Date(timestamp);
    date.setFullYear(add + date.getFullYear());

    const values = [];
    for (let i = 0; i < 12; i++) {
      values.push(date.setMonth(i));
    }

    return {
      order: baseOrder + add,
      values: values,
    };
  }

}
