import { addMonths, differenceInDays, getDaysInMonth, startOfWeek } from './date-utils';
import { Weekday } from './weekdays';

export class Month {
  constructor(readonly date: Date,
              readonly weekShift: number,
              readonly length: number) {
  }

  static fromDate(monthDate: Date, firstWeekday: Weekday, add = 0): Month {
    monthDate = addMonths(monthDate, add);
    return new Month(
      monthDate,
      differenceInDays(monthDate, startOfWeek(monthDate, firstWeekday)) || 7,
      getDaysInMonth(monthDate),
    );
  }
}
