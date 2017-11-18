import {Weekday} from './weekdays';
import {eachDay, lastDayOfWeek as __lastDayOfWeek, startOfWeek as __startOfWeek} from 'date-fns';

export {
  addMonths,
  differenceInDays,
  getDaysInMonth,
  getDate as getDay,
  setDate as setDay,
  startOfDay,
  startOfMonth,
  startOfToday,
} from 'date-fns';

declare function addMonths(date: Date, amount: number): Date;

declare function differenceInDays(from: Date, to: Date): number;

declare function getDaysInMonth(date: Date): number;

declare function getDay(date: Date): number;

declare function setDay(date: Date, day: number): Date;

declare function startOfDay(date: Date): Date;

declare function startOfMonth(date: Date): Date;

declare function startOfToday(): Date;

export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

export function startOfWeek(date: Date, firstWeekday: Weekday): Date {
  return __startOfWeek(date, {weekStartsOn: firstWeekday});
}

export function lastDayOfWeek(date: Date, firstWeekday: Weekday): Date {
  return __lastDayOfWeek(date, {weekStartsOn: firstWeekday});
}

export function weekdayDates(date: Date, firstWeekday: Weekday): Array<Date> {
  return eachDay(
    startOfWeek(date, firstWeekday),
    lastDayOfWeek(date, firstWeekday),
  );
}
