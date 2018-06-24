import { Directive } from '@angular/core';
import { ViewStrategy } from './view-strategy';
import { ViewMode } from '../datepicker/view-mode';
import { Pane } from '../pane';
import { WeekDay } from '@angular/common';
import { startOfMonth } from '../util/helpers';

@Directive({
  selector: '[skmDaysStrategy]',
  providers: [
    {provide: ViewStrategy, useExisting: DaysStrategyDirective},
  ],
})
export class DaysStrategyDirective extends ViewStrategy {
  readonly viewMode = ViewMode.Days;
  readonly itemClass = 'skm-datepicker-day';

  normalizeTimestamp(timestamp: number): number {
    return timestamp;
  }

  makeInitPanesSeed(timestamp: number): number {
    return startOfMonth(timestamp).valueOf();
  }

  makePane(timestamp: number, add: number, baseOrder: number, weekStart: WeekDay): Pane {
    const date = new Date(timestamp);
    date.setMonth(add + date.getMonth());
    const firstDay = date.getDay();

    date.setMonth(1 + date.getMonth());
    date.setDate(0);
    const monthLength = date.getDate();

    const values = [];
    for (let i = 1; i <= monthLength; i++) {
      values.push(date.setDate(i));
    }

    return {
      order: baseOrder + add,
      values: values,
      indent: (firstDay - weekStart + 7) % 7 || 7, // Defaulting to full week makes for more a balanced cells layout
    };
  }

}
