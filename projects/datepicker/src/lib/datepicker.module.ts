import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { SliderComponent } from './slider/slider.component';
import { ViewComponent } from './view/view.component';
import { GridComponent } from './grid/grid.component';
import { DaysStrategyDirective } from './view-strategies/days-strategy.directive';
import { MonthsStrategyDirective } from './view-strategies/months-strategy.directive';
import { YearsStrategyDirective } from './view-strategies/years-strategy.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DatepickerComponent,
    ViewComponent,
    SliderComponent,
    GridComponent,
    DaysStrategyDirective,
    MonthsStrategyDirective,
    YearsStrategyDirective,
  ],
  exports: [
    DatepickerComponent,
  ],
})
export class DatepickerModule {
}
