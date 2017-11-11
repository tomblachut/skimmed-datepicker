import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CalendarComponent} from './calendar/calendar.component';
import {FormsModule} from '@angular/forms';
import 'hammerjs';
import 'hammer-timejs';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-US'},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
