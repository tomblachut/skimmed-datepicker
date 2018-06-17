<h1 align="center">Skimmed Datepicker</h1>
<p align="center"><img src="https://cdn.rawgit.com/tomblachut/skimmed-datepicker/master/src/assets/logo.svg"></p>
<p align="center">Compatible with <b>Angular 6</b> and up</p>

<p align="center">
  <a href="https://www.npmjs.com/package/skimmed-datepicker"><img alt="npm" src="https://img.shields.io/npm/v/skimmed-datepicker.svg"></a>
  <!-- <a href="https://travis-ci.org/tomblachut/neo-async"><img alt="Travis Status" src="https://img.shields.io/travis/tomblachut/skimmed-datepicker.svg"></a> -->
  <!-- <a href="https://codecov.io/gh/tomblachut/neo-async"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/tomblachut/skimmed-datepicker/master.svg"></a> -->
  <a href="https://www.npmjs.com/package/skimmed-datepicker"><img alt="downloads" src="https://img.shields.io/npm/dt/skimmed-datepicker.svg"></a>
</p>

<h3 align="center"><a href="https://tomblachut.github.io/skimmed-datepicker/">SEE THE DEMO</a></h3>

## Features
* 📅 Picks dates
* 🔥 Blazing fast
* 📱 Tap, pan & swipe enabled
* 🖱️ Mouse friendly
* 💧 Minimal required styles
* 🎨 Maximally themeable
* ⛔ Specify min & max dates
* 🏷️ Customizable labels & date formats
* 🔎 Transitions smoothly between daily, monthly & yearly views
* 🛣️ Doesn't block vertical page scrolling on touch devices

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
    ```
    TODO
    ```

4. *(Optional)* For gesture support install and import `hammerjs` globally.
    ```
    npm i hammerjs
    ```
    A popular place, recommended by [Angular Material](https://material.angular.io/guide/getting-started), is `src/main.ts`.
    ```typescript
    import 'hammerjs';
    ```

5. Use `skm-datepicker` in a template
    ```html
    <skm-datepicker [formControl]="dateControl"></skm-datepicker>
    <skm-datepicker [(ngModel)]="date"></skm-datepicker>
    <skm-datepicker [(date)]="date"></skm-datepicker>
    ```

## Configuration
`TODO: Freeze API & document everything`

```typescript
date: Date;
min: Date;
max: Date;

deselectEnabled: boolean;
yearFormat = 'y';
headingFormat = 'MMMM y';
firstWeekDay = WeekDay.Monday;
dayLabels: string[];
weekDayLabels: string[];
monthLabels: string[];

dateChange: EventEmitter<Date>;
```

## Roadmap
* Full compatibility with `ReactiveFormsModule`
* Extend configurability
* Popover mode
* Keyboard support
* Improve accessibility
* Date range mode
* Expose as Web Component

## Credits
* Created by Tomasz Błachut ([@tomblachut](https://github.com/tomblachut))
* Spatial easing function perfected by Michał Wiatrowski ([@michel4ngel0](https://github.com/michel4ngel0))
