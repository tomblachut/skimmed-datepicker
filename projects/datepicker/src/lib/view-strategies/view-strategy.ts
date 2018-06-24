import { ViewMode } from '../datepicker/view-mode';
import { Pane } from '../pane';

export abstract class ViewStrategy {
  abstract readonly viewMode: ViewMode;
  abstract readonly itemClass: string;

  abstract normalizeTimestamp(timestamp: number): number;

  abstract makeInitPanesSeed(timestamp: number): number;

  abstract makePane(timestamp: number, add: number, baseOrder: number): Pane;
}
