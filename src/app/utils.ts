import {Weekday} from './weekdays';
import * as __startOfWeek from 'date-fns/start_of_week';
import * as __lastDayOfWeek from 'date-fns/last_day_of_week';
import {eachDay} from 'date-fns';

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
