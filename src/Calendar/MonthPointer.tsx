import { addMonths } from 'date-fns';
import { pipe } from 'fp-ts/function';
import * as NEA from 'fp-ts/NonEmptyArray';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import * as A from 'fp-ts/Array';

export interface MonthPointer {
  data: NonEmptyArray<Date>;
  currentIndex: number;
}

export const createMonthPointer = (
  monthDate: Date,
  months = 3,
): MonthPointer => {
  const currentMonth = new Date(monthDate.getFullYear(), monthDate.getMonth());
  const data = pipe(
    NEA.range(0, months - 1),
    NEA.map((x) => x - Math.floor((months - 1) / 2)),
    NEA.map((x) => addMonths(currentMonth, x)),
  );
  return {
    data: data,
    currentIndex: Math.floor((data.length - 1) / 2),
  };
};
export const getCurrentMonthIndex = (monthPointer: MonthPointer): number =>
  monthPointer.currentIndex;

export const getCurrentMonth = (monthPointer: MonthPointer): Date =>
  monthPointer.data[getCurrentMonthIndex(monthPointer)]!;

export const getPreviousMonth = (monthPointer: MonthPointer): Date =>
  monthPointer.data[getCurrentMonthIndex(monthPointer) - 1]!;

export const getNextMonth = (monthPointer: MonthPointer): Date =>
  monthPointer.data[getCurrentMonthIndex(monthPointer) + 1]!;

export const moveLeft = (monthPointer: MonthPointer): MonthPointer => ({
  currentIndex:
    monthPointer.currentIndex > 0 ? monthPointer.currentIndex - 1 : 0,
  data:
    monthPointer.currentIndex > 0
      ? monthPointer.data
      : A.prepend(pipe(NEA.head(monthPointer.data), (x) => addMonths(x, -1)))(
          monthPointer.data,
        ),
});

export const moveRight = (monthPointer: MonthPointer): MonthPointer => ({
  currentIndex: monthPointer.currentIndex + 1,
  data:
    monthPointer.currentIndex >= monthPointer.data.length - 1
      ? A.append(pipe(NEA.last(monthPointer.data), (x) => addMonths(x, 1)))(
          monthPointer.data,
        )
      : monthPointer.data,
});
export const moveToFirst = (monthPointer: MonthPointer): MonthPointer => ({
  ...monthPointer,
  currentIndex: 0,
});
export const extendLeft = (monthPointer: MonthPointer): MonthPointer => ({
  ...monthPointer,
  currentIndex: monthPointer.currentIndex + 1,
  data: pipe(
    monthPointer.data,
    pipe(monthPointer.data, NEA.head, (x) => addMonths(x, -1), A.prepend),
  ),
});

export const extendLeftN =
  (n: number) =>
  (pointer: MonthPointer): MonthPointer =>
    pipe(NEA.range(0, n), (x) => x.slice(0, -1), A.reduce(pointer, extendLeft));

export const extendRight = (monthPointer: MonthPointer): MonthPointer => ({
  ...monthPointer,
  data: pipe(
    monthPointer.data,
    pipe(monthPointer.data, NEA.last, (x) => addMonths(x, 1), A.append),
  ),
});

export const extendRightN =
  (n: number) =>
  (pointer: MonthPointer): MonthPointer =>
    pipe(
      NEA.range(0, n),
      (x) => x.slice(0, -1),
      A.reduce(pointer, extendRight),
    );

export const getAll = (monthPointer: MonthPointer): Date[] => monthPointer.data;
