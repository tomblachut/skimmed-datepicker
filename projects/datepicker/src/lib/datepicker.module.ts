import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { SliderComponent } from './slider/slider.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DatepickerComponent,
    SliderComponent,
  ],
  exports: [
    DatepickerComponent,
  ],
})
export class DatepickerModule {
}
