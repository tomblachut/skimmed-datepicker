import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  format = 'yyyy-MM-dd';

  customDayLabels = range(1, 31).map(romanize);
  customWeekDayLabels = ['😆', '🙁', '😒', '😐', '😉', '😊', '😁'];
  customMonthLabels = ['☃️', '🌨️', '☂️', '🌳', '🌷', '☀️', '🌻', '🌊', '🍄', '🌰', '🍂', '🎄'];

  date = new Date();

  min = new Date();
  max = new Date();

  constructor() {
    this.date.setFullYear(1995, 0, 17);
    this.min.setFullYear(1994, 11, 25);
    this.max.setFullYear(1996, 2, 10);
  }

  tryUpdate(text: string, field: keyof AppComponent): void {
    text = text && text.trim() || '';
    if (text && text.length === this.format.length) {
      const date = new Date(text);
      if (!isNaN(date.getTime()) && (this[field] as Date).getTime() !== date.getTime()) {
        this[field] = date;
      }
    }
  }

}

function range(from: number, to: number): Array<number> {
  return Array.from(new Array(1 + to - from), (x, i) => i + from);
}

// https://stackoverflow.com/a/9083076/1879175
function romanize(num) {
  const digits = String(+num).split('');
  const key = [
    '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
    '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
  ];
  let roman = '';
  let i = 3;
  while (i--) {
    roman = (key[+digits.pop() + (i * 10)] || '') + roman;
  }
  return Array(+digits.join('') + 1).join('M') + roman;
}
