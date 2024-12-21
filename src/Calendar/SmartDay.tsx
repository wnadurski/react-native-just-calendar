import { memo, useCallback } from 'react';
import { useCalendarContext, useComponent, useDayOnPress } from './Context';
import { DateKey } from './consts';
import { useDayMarkings } from './markings';

export interface Props {
  day: number; // 0 indexed
  month: number; // 0 indexed
  year: number;
  dateKey: DateKey;
}

export const SmartDay = memo(({ day, month, year, dateKey }: Props) => {
  const Day = useComponent('Day');
  const markings = useDayMarkings(dateKey);
  const { currentDay, markCurrentDay } = useCalendarContext(
    ({ currentDay, markCurrentDay }) => ({
      currentDay,
      markCurrentDay,
    }),
  );
  const onDayPress = useDayOnPress();
  const handlePress = useCallback(() => {
    onDayPress?.(dateKey);
  }, [onDayPress, dateKey]);

  const isCurrentDay = markCurrentDay && currentDay === dateKey;

  return (
    <Day
      handlePress={handlePress}
      isCurrentDay={!!isCurrentDay}
      markings={markings}
      day={day}
      month={month}
      year={year}
      dateKey={dateKey}
    />
  );
});
