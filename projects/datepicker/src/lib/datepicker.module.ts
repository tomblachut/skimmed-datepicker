import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { SliderComponent } from './slider/slider.component';
import { DaysViewComponent } from './days-view/days-view.component';
import { MonthsViewComponent } from './months-view/months-view.component';
import { YearsViewComponent } from './years-view/years-view.component';
import { DaysContentComponent } from './days-content/days-content.component';
import { MonthsContentComponent } from './months-content/months-content.component';
import { YearsContentComponent } from './years-content/years-content.component';

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
    DaysContentComponent,
    MonthsContentComponent,
    YearsContentComponent,
  ],
  exports: [
    DatepickerComponent,
  ],
})
export class DatepickerModule {
}
