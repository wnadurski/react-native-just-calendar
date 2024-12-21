import { FlatList, StyleSheet } from 'react-native';
import { DateKey, I18n, monthWidth } from './consts';
import { Markings, MarkingsProvider } from './markings';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  createMonthPointer,
  extendLeftN,
  extendRightN,
  getAll,
  getCurrentMonthIndex,
  moveToFirst,
} from './MonthPointer';
import { pipe } from 'fp-ts/function';
import { Month } from './Month';
import { ContextProvider } from './Context';
import { CalendarComponents } from './Components';

export interface CalendarProps {
  onDayPress?: (dateKey: DateKey) => void;
  markings?: Markings;
  hideYear?: boolean;
  i18n?: Partial<I18n>;
  components?: Partial<CalendarComponents>;
}

export const Calendar = ({
  onDayPress,
  markings,
  hideYear,
  i18n,
  components,
}: CalendarProps) => {
  const viewRef = useRef<FlatList>(null);
  const initialMonths = 11;
  const extendNumber = Math.ceil(initialMonths / 2);

  const [data, setData] = useState(
    createMonthPointer(new Date(), initialMonths),
  );
  const [resetKey, setResetKey] = useState(0);
  const allMonths = useMemo(() => getAll(data), [data]);

  const onStartReached = useCallback(() => {
    setData((pointer) => pipe(pointer, moveToFirst, extendLeftN(extendNumber)));
    setResetKey((x) => x + 1);
  }, []);
  const onEndReached = useCallback(() => {
    setData(extendRightN(extendNumber));
  }, []);
  const renderItem = useCallback(
    ({ item }: { item: Date }) => <Month monthDate={item} />,
    [],
  );
  return (
    <MarkingsProvider markings={markings}>
      <ContextProvider
        onDayPress={onDayPress}
        hideYear={hideYear}
        i18n={i18n}
        components={components}
      >
        <FlatList
          data-test-id={'Calendar-FlatList'}
          key={resetKey}
          ref={viewRef}
          style={styles.list}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={getCurrentMonthIndex(data)}
          data={allMonths}
          onStartReached={onStartReached}
          onEndReached={onEndReached}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => ({
            length: monthWidth,
            offset: monthWidth * index,
            index,
          })}
        />
      </ContextProvider>
    </MarkingsProvider>
  );
};
const styles = StyleSheet.create({
  list: {
    width: monthWidth,
  },
});
