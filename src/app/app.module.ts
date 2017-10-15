import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CalendarComponent} from './calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-US'},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
