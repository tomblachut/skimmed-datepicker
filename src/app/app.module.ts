import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DatepickerModule } from 'skimmed-datepicker';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DatepickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
