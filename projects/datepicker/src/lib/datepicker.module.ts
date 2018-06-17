import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { SliderComponent } from './slider/slider.component';
import { DaysViewComponent } from './days-view/days-view.component';
import { MonthsViewComponent } from './months-view/months-view.component';
import { YearsViewComponent } from './years-view/years-view.component';
import { GridComponent } from './grid/grid.component';
import { DaysStrategyDirective } from './view-strategies/days-strategy.directive';
import { MonthsStrategyDirective } from './view-strategies/months-strategy.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DatepickerComponent,
    SliderComponent,
    DaysViewComponent,
    MonthsViewComponent,
    YearsViewComponent,
    GridComponent,
    DaysStrategyDirective,
    MonthsStrategyDirective,
  ],
  exports: [
    DatepickerComponent,
  ],
})
export class DatepickerModule {
}
