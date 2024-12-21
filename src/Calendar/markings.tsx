import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import { createStore, KeyStore } from './keyStore';
import { DateKey } from './consts';

export type ColorString = string | 'primary' | 'secondary';

export const colors = {
  primary: '#d84b53',
  secondary: '#A597CC',
};

const colorStringToString = (color: ColorString): string =>
  color === 'primary' || color === 'secondary' ? colors[color] : color;

export type MarkingDetails = {
  color: ColorString;
  variant?: 'period' | 'dot';
};
export type SingleMarking = MarkingDetails | ColorString;
export type Marking = SingleMarking | SingleMarking[];
export type Markings = Record<DateKey, Marking>;

export type FullMarkingDetails = Required<MarkingDetails> & {
  color: string;
};

export const markingToList = (marking?: Marking): FullMarkingDetails[] => {
  const defaultVariant = 'dot';
  if (typeof marking === 'string') {
    return [
      {
        color: colorStringToString(marking),
        variant: defaultVariant,
      },
    ];
  }
  if (Array.isArray(marking)) {
    return marking.flatMap(markingToList);
  }
  if (marking) {
    return [
      {
        color: colorStringToString(marking.color),
        variant: marking.variant ?? defaultVariant,
      },
    ];
  }
  return [];
};

const noop = () => {};

const Context = createContext<KeyStore<Marking, DateKey>>({
  subscribe: () => noop,
  update: noop,
  getValue: () => ({}),
});

export const MarkingsProvider = ({
  markings = {},
  children,
}: {
  markings?: Markings;
  children: ReactNode;
}) => {
  const storeRef = useRef<KeyStore<Marking, DateKey> | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = createStore(markings);
  }

  useEffect(() => {
    const oldValue = storeRef.current?.getValue();
    if (storeRef.current && !Object.is(markings, oldValue)) {
      storeRef.current.update(markings);
    }
  });

  return (
    <Context.Provider value={storeRef.current!}>{children}</Context.Provider>
  );
};

export const useDayMarkings = (dateKey: DateKey) => {
  const store = useContext(Context);
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(dateKey, onStoreChange),
    [dateKey],
  );
  return markingToList(
    useSyncExternalStore(subscribe, () => store.getValue()[dateKey]),
  );
};
