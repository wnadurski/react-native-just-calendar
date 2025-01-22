import { memo, ReactNode, useMemo, useRef } from 'react';
import {
  DateKey,
  defaultI18n,
  I18n,
  monthNames,
  weekDaysNames,
} from './consts';
import { createContext, useContextSelector } from './context-selector';
import { formatDateKey } from './date-key';
import { CalendarComponents, defaultCalendarComponents } from './Components';
import { shallowEqualPaths } from './utils/shallow-equal';
import { Paths } from './utils/get-at-path';

export interface ContextType {
  onDayPress?: (dateKey: DateKey) => void;
  hideYear?: boolean;
  markCurrentDay?: boolean;
  currentDay: DateKey;
  components: CalendarComponents;
  i18n: I18n;
}

const noop = () => {};
const Context = createContext<ContextType>({
  onDayPress: noop,
  currentDay: formatDateKey(new Date()),
  components: defaultCalendarComponents,
  i18n: {
    firstWeekDay: 1,
    weekDaysNames,
    monthNames,
  },
});

export interface Props {
  children: ReactNode;
  onDayPress?: (dateKey: DateKey) => void;
  hideYear?: boolean;
  markCurrentDay?: boolean;
  components?: Partial<CalendarComponents>;
  i18n?: Partial<I18n>;
}

const toShallowEqual: Paths<ContextType>[] = [
  'onDayPress',
  'hideYear',
  'markCurrentDay',
  'currentDay',
  'components',
  'i18n.firstWeekDay',
  'i18n.monthNames',
  'i18n.weekDaysNames',
];
const compareValue = (a: ContextType, b: ContextType) => {
  return shallowEqualPaths(a, b, toShallowEqual);
};

const initialSymbol = Symbol('initial');
const useValue = (value: ContextType): ContextType => {
  const changeCounterRef = useRef(0);
  const prevRef = useRef<ContextType | typeof initialSymbol>(initialSymbol);

  if (
    prevRef.current !== initialSymbol &&
    !compareValue(prevRef.current, value)
  ) {
    changeCounterRef.current += 1;
  }
  prevRef.current = value;
  return useMemo(() => value, [changeCounterRef.current]);
};

export const ContextProvider = memo(
  ({
    children,
    onDayPress,
    hideYear,
    markCurrentDay,
    components = {},
    i18n = {},
  }: Props) => {
    const currentDay = formatDateKey(new Date());
    return (
      <Context.Provider
        value={useValue({
          onDayPress,
          hideYear,
          markCurrentDay: markCurrentDay ?? true,
          currentDay,
          components: {
            ...defaultCalendarComponents,
            ...components,
          },
          i18n: {
            ...defaultI18n,
            ...i18n,
          },
        })}
      >
        {children}
      </Context.Provider>
    );
  },
);

export const useCalendarContext = <T,>(selector: (c: ContextType) => T) =>
  useContextSelector(Context, selector);

export const useDayOnPress = () =>
  useCalendarContext(({ onDayPress }) => onDayPress);

export const useComponent = <K extends keyof CalendarComponents>(name: K) =>
  useContextSelector(Context, ({ components }) => components[name]);

export const useI18n = () => useContextSelector(Context, (c) => c.i18n);
