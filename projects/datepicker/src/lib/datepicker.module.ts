import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { SliderComponent } from './slider/slider.component';
import { DaysViewComponent } from './days-view/days-view.component';
import { MonthsViewComponent } from './months-view/months-view.component';
import { YearsViewComponent } from './years-view/years-view.component';

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
  ],
  exports: [
    DatepickerComponent,
  ],
})
export class DatepickerModule {
}
