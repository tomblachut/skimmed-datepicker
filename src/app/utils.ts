import {Weekday} from './weekdays';
import {eachDay, lastDayOfWeek as __lastDayOfWeek, startOfWeek as __startOfWeek} from 'date-fns';

export function range(from: number, to: number): Array<number> {
  return Array.from(new Array(1 + to - from), (x, i) => i + from);
}

export function startOfWeek(date: Date, firstWeekday: Weekday): Date {
  return __startOfWeek(date, {weekStartsOn: firstWeekday});
}

export function lastDayOfWeek(date: Date, firstWeekday: Weekday): Date {
  return __lastDayOfWeek(date, {weekStartsOn: firstWeekday});
}

export function generateWeekdayDates(date: Date, firstWeekday: Weekday): Array<Date> {
  return eachDay(
    startOfWeek(date, firstWeekday),
    lastDayOfWeek(date, firstWeekday),
  );
}

// kudos to @michel4ngel0
export function createEaseOut(panRatio: number): (x: number) => number {
  const a = (panRatio - 2) / panRatio ** 3;
  const b = (3 - 2 * panRatio) / panRatio ** 2;

  return function easeOut(x: number) {
    return (x >= panRatio) ? 1 : ((a * x + b) * x + 1) * x;
  };
}
