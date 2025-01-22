import { getDay } from 'date-fns';

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
// 1 = Monday
export const customGetDay = (date: Date, firstWeekDay: number) =>
  mod(getDay(date) - firstWeekDay, 7);

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const weekDaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const monthWidth = 300;

export type DateKey = string;

export interface I18n {
  weekDaysNames: string[];
  monthNames: string[];
  firstWeekDay: number;
}
export const defaultI18n: I18n = {
  firstWeekDay: 1,
  weekDaysNames,
  monthNames,
};
