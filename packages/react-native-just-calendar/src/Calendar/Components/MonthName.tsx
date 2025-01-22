import { StyleSheet, Text, View } from 'react-native';

export type MonthProps = {
  month: string;
};
export const MonthName = ({ month }: MonthProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>{month}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: { fontWeight: '300', color: 'red' },
});
