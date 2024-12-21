import { Month } from "./Month";
import { FlatList, StyleSheet } from "react-native";
import { addMonths } from "date-fns";
import {
  ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  createMonthPointer,
  extendLeftN,
  extendRightN,
  getAll,
  getCurrentMonthIndex,
  moveToFirst,
} from "./MonthPointer";
import { DateKey, I18n, monthWidth } from "./consts";
import { pipe } from "fp-ts/function";
import { ContextProvider } from "@/components/Calendar/Context";
import {
  Markings,
  MarkingsProvider,
} from "@/components/Calendar/markings";
import { Components } from "@/components/Calendar/Components";

export interface CalendarProps {
  onDayPress?: (dateKey: DateKey) => void;
  markings?: Markings;
  hideYear?: boolean;
  i18n?: Partial<I18n>;
  components?: Partial<Components>;
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
    console.log("Calendar onStartReached");
    setData((pointer) =>
      pipe(pointer, moveToFirst, extendLeftN(extendNumber)),
    );
    setResetKey((x) => x + 1);
  }, []);
  const onEndReached = useCallback(() => {
    console.log("Calendar onEndReached");
    setData(extendRightN(extendNumber));
  }, []);
  const renderItem = useCallback(
    ({ item }: { item: Date }) => (
      <Month monthDate={item} />
    ),
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
