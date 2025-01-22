import { StyleSheet, View } from 'react-native';
import { customGetDay, monthWidth } from './consts';
import { endOfMonth, getDaysInMonth } from 'date-fns';
import { pipe } from 'fp-ts/function';
import * as NEA from 'fp-ts/NonEmptyArray';
import { memo } from 'react';
import { SmartDay } from './SmartDay';
import { getDateKey } from './date-key';
import { useCalendarContext, useComponent, useI18n } from './Context';
import { MonthName } from './Components/MonthName';
import { WeekDays } from './Components/WeekDays';

interface Props {
  monthDate: Date;
}

export const Month = memo(({ monthDate }: Props) => {
  const i18n = useI18n();
  const Year = useComponent('Year');
  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();
  const hideYear = useCalendarContext(({ hideYear }) => hideYear);
  const beginningOfMonth = new Date(year, month);
  const numberOfDays = getDaysInMonth(beginningOfMonth);
  const firstWeekday = customGetDay(beginningOfMonth, i18n.firstWeekDay);
  const lastWeekday = customGetDay(
    endOfMonth(beginningOfMonth),
    i18n.firstWeekDay,
  );
  const days = pipe(
    NEA.range(0, numberOfDays + firstWeekday + (6 - lastWeekday) - 1),
    NEA.map((i) => {
      if (i < firstWeekday) {
        return { type: 'blank' } as const;
      }
      const dayNumber = i - firstWeekday + 1;
      if (dayNumber > numberOfDays) {
        return { type: 'blank' } as const;
      }
      return { type: 'day', value: dayNumber } as const;
    }),
    NEA.chunksOf(7),
  );
  return (
    <View style={styles.container}>
      {hideYear ? null : <Year year={monthDate.getFullYear()} />}
      <MonthName month={i18n.monthNames[month] ?? ''} />
      <WeekDays weekDaysNames={i18n.weekDaysNames} />

      {days.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((day, i) => (
            <View style={styles.cell} key={i}>
              {day.type === 'day' ? (
                <SmartDay
                  day={day.value - 1}
                  month={month}
                  year={year}
                  dateKey={getDateKey(day.value - 1, month, year)}
                />
              ) : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: monthWidth,
    gap: 5,
  },
  text: { fontWeight: '300' },
  monthHeader: {
    alignItems: 'center',
  },
  row: { display: 'flex', flexDirection: 'row' },
  button: {
    alignItems: 'center',
    width: '100%',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 100,
  },
});
