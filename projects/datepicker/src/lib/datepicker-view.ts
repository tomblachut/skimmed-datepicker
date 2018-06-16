import { InjectionToken } from '@angular/core';
import { Pane } from './pane';

export interface DatepickerView {
  selectItem(event: MouseEvent, pane: Pane, notPanning: boolean): void;
}

export const DATEPICKER_VIEW = new InjectionToken('SkmDatepickerView');
