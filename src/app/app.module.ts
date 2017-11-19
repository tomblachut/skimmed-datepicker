import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatepickerModule} from './datepicker/datepicker.module';
import {AppComponent} from './app.component';
import 'hammerjs';
import 'hammer-timejs';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DatepickerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
