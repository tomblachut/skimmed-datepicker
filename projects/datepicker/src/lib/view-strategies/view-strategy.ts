import { ViewMode } from '../datepicker/view-mode';
import { Pane } from '../pane';
import { WeekDay } from '@angular/common';

export abstract class ViewStrategy {
  abstract readonly viewMode: ViewMode;
  abstract readonly itemClass: string;

  abstract normalizeTimestamp(timestamp: number): number;

  abstract makeInitPanesSeed(timestamp: number): number;

  abstract makePane(timestamp: number, add: number, baseOrder: number, weekStart: WeekDay): Pane;
}
