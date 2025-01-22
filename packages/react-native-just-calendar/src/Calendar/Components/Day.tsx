import { Pressable, StyleSheet, Text, View } from 'react-native';
import { memo } from 'react';
import { FullMarkingDetails } from '../markings';
import { DateKey } from '../consts';
import { pipe } from 'fp-ts/function';
import { groupBy } from 'fp-ts/NonEmptyArray';

const androidRipple = {
  color: '#b4b4b4',
  borderless: true,
};

export interface DayProps {
  handlePress: () => void;
  isCurrentDay: boolean;
  markings: FullMarkingDetails[];
  day: number; // 0 indexed
  month: number; // 0 indexed
  year: number;
  dateKey: DateKey;
}

export const Day = memo(
  ({ handlePress, isCurrentDay, markings, day, dateKey }: DayProps) => {
    const { period: periods = [], dot: dots = [] } = pipe(
      markings,
      groupBy(({ variant }) => variant),
    );
    return (
      <Pressable
        android_ripple={androidRipple}
        hitSlop={5}
        onPress={handlePress}
        style={[styles.button, isCurrentDay ? styles.currentDay : null]}
      >
        <Text style={styles.dayNumber}>{day + 1}</Text>
        {periods.map((marking, index) => (
          <View
            key={`${index}-${marking.color}`}
            style={[styles.periodMark, { backgroundColor: marking.color }]}
          />
        ))}
        {dots.length > 0 && (
          <View style={styles.dotMarksContainer}>
            {dots.map((marking, index) => (
              <View
                key={`${index}-${marking.color}`}
                style={[styles.dotMark, { backgroundColor: marking.color }]}
              />
            ))}
          </View>
        )}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  currentDay: {
    backgroundColor: '#e6e6e6',
  },
  button: {
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  dayNumber: {
    fontWeight: '500',
  },
  periodMark: {
    position: 'absolute',
    height: 3,
    width: '95%',
    borderRadius: 5,
    top: 5,
  },
  dotMark: {
    height: 5,
    width: 5,
    borderRadius: 5,
  },
  dotMarksContainer: {
    position: 'absolute',
    bottom: 5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  hidden: {
    display: 'none',
  },
});
