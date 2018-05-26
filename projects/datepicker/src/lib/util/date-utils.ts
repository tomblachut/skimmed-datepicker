export {
  addMonths,
  addYears,
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
