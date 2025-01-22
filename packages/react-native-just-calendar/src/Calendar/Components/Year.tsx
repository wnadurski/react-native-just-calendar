import { StyleSheet, Text, View } from 'react-native';
import { memo } from 'react';

export type YearProps = { year: number };
export const Year = memo(({ year }: YearProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>{year}</Text>
  </View>
));
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: { fontWeight: '300' },
});
