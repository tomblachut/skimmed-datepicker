import * as addMonths from 'date-fns/add_months';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as getDaysInMonth from 'date-fns/get_days_in_month';
import {startOfWeek} from './utils';
import {Weekday} from './weekdays';

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
