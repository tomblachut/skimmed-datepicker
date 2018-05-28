<h1 align="center">Skimmed Datepicker</h1>
<p align="center">Datepicker without bloat. Work in progress, but already pretty fancy & usable.</p>
<p align="center">Compatible with <b>Angular 6</b> and up</p>

<h3 align="center"><a href="https://tomblachut.github.io/skimmed-datepicker/">SEE THE DEMO</a></h3>

## Features
* 📅 Picks dates
* 🔥 Blazing fast
* 📱 Tap, pan & swipe enabled
* 🖱️ Mouse friendly
* 💧 Minimal required styles
* 🎨 Maximally themeable
* 🏷️ Customizable labels & date formats
* 🔎 Transitions smoothly between daily, monthly & yearly views

## Quick start
1. Skimmed Datepicker is available as a [package on npm](https://www.npmjs.com/package/skimmed-datepicker). Simply use ubiquitous command and you are good to go!
  ```
  npm i skimmed-datepicker
  ```
  Alternatively when [using Yarn](https://yarnpkg.com/en/package/skimmed-datepicker):
  ```
  yarn add skimmed-datepicker
  ```

2. Import `BrowserAnimationsModule` into root module & and `DatepickerModule` wherever you want to use it
  ```typescript
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { DatepickerModule } from 'skimmed-datepicker';
  
  @NgModule({
    imports: [
      BrowserAnimationsModule,
      DatepickerModule,
    ],
  })
  export class AppModule {
  }
  ```
  Ensure that `@angular/animations` package is installed.

3. Include stylesheet

4. *(Optional)* For gesture support install and import `hammerjs` globally.
  ```
  npm i hammerjs
  ```
  A popular place, also recommended by [Angular Material](https://material.angular.io/guide/getting-started) is `src/main.ts`.
  ```typescript
  import 'hammerjs';
  ```

5. Use `mat-datepicker` in a template
  ```html
  <skm-datepicker [formControl]="dateControl"></skm-datepicker>
  <skm-datepicker [(ngModel)]="date"></skm-datepicker>
  <skm-datepicker [(date)]="date"></skm-datepicker>
  ```

## Configuration
TODO: Freeze API & document everything
```typescript
@Input() date: Date;
@Output() dateChange: EventEmitter<Date>;

@Input() deselectEnabled: boolean;
@Input() yearFormat = 'y';
@Input() headingFormat = 'MMMM y';
@Input() firstWeekday = WeekDay.Monday;
@Input() dayLabels: string[];
@Input() weekDayLabels: string[];
@Input() monthLabels: string[];
```

## Roadmap
* Full compatibility with `ReactiveFormsModule`
* Limit min & max date
* Extend configurability
* Popover mode
* Keyboard support
* Improve accessibility
* Expose as Web Component
