import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { SliderComponent } from './slider/slider.component';
import { DaysViewComponent } from './days-view/days-view.component';
import { MonthsViewComponent } from './months-view/months-view.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DatepickerComponent,
    SliderComponent,
    DaysViewComponent,
    MonthsViewComponent,
  ],
  exports: [
    DatepickerComponent,
  ],
})
export class DatepickerModule {
}
