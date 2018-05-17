import { Weekday } from './weekdays';
import { eachDayOfInterval, lastDayOfWeek as __lastDayOfWeek, startOfWeek as __startOfWeek } from 'date-fns/esm';

export {
  addMonths,
  differenceInDays,
  getDaysInMonth,
  getDate as getDay,
  setDate as setDay,
  startOfDay,
  startOfMonth,
} from 'date-fns/esm';

declare function addMonths(date: Date, amount: number): Date;

declare function differenceInDays(from: Date, to: Date): number;

declare function getDaysInMonth(date: Date): number;

declare function getDay(date: Date): number;

declare function setDay(date: Date, day: number): Date;

declare function startOfDay(date: Date): Date;

declare function startOfMonth(date: Date): Date;

export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

export function startOfWeek(date: Date, firstWeekday: Weekday): Date {
  return __startOfWeek(date, {weekStartsOn: firstWeekday as any});
}

export function lastDayOfWeek(date: Date, firstWeekday: Weekday): Date {
  return __lastDayOfWeek(date, {weekStartsOn: firstWeekday as any});
}

export function weekdayDates(date: Date, firstWeekday: Weekday): Array<Date> {
  return eachDayOfInterval({
    start: startOfWeek(date, firstWeekday),
    end: lastDayOfWeek(date, firstWeekday),
  });
}
