export {
  addMonths,
  addYears,
  getDaysInMonth,
  setDate,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from 'date-fns/esm';

export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}
