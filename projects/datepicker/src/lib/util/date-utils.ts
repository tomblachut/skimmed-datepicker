import { WeekDay } from '@angular/common';
import { eachDayOfInterval, lastDayOfWeek as __lastDayOfWeek, startOfWeek as __startOfWeek } from 'date-fns/esm';

export {
  addMonths,
  addYears,
  differenceInDays,
  getDaysInMonth,
  getDate as getDay,
  setDate as setDay,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from 'date-fns/esm';

export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

export function startOfWeek(date: Date, firstWeekday: WeekDay): Date {
  return __startOfWeek(date, {weekStartsOn: firstWeekday as any});
}

export function lastDayOfWeek(date: Date, firstWeekday: WeekDay): Date {
  return __lastDayOfWeek(date, {weekStartsOn: firstWeekday as any});
}

export function weekdayDates(date: Date, firstWeekday: WeekDay): Array<Date> {
  return eachDayOfInterval({
    start: startOfWeek(date, firstWeekday),
    end: lastDayOfWeek(date, firstWeekday),
  });
}
