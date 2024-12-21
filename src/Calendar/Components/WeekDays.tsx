import { StyleSheet, Text, View } from 'react-native';
import { memo } from 'react';

export interface WeekDaysProps {
  weekDaysNames: string[];
}

export const WeekDays = memo(({ weekDaysNames }: WeekDaysProps) => {
  return (
    <View style={styles.container}>
      {weekDaysNames.map((name) => (
        <View key={name} style={styles.day}>
          <Text style={styles.text}>{name}</Text>
        </View>
      ))}
    </View>
  );
});
const styles = StyleSheet.create({
  container: { display: 'flex', flexDirection: 'row' },
  day: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 100,
  },
  text: { fontWeight: '300' },
});
