import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { SliderComponent } from './slider/slider.component';
import { DaysViewComponent } from './days-view/days-view.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DatepickerComponent,
    SliderComponent,
    DaysViewComponent,
  ],
  exports: [
    DatepickerComponent,
  ],
})
export class DatepickerModule {
}
