import { format, parse } from 'date-fns';
import { DateKey } from './consts';

export const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

export const parseDateKey = (dateKey: DateKey) =>
  parse(dateKey, 'yyyy-MM-dd', new Date());

export const getDateKey = (
  day: number, // 0 indexed
  month: number, // 0 indexed
  year: number,
) => formatDateKey(new Date(year, month, day + 1));
