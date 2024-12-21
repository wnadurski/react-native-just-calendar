import React, {
  Context,
  createContext as createContextOrig,
  FC,
  ReactNode,
  useContext as useContextOrig,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import { shallowEqual } from './utils/shallow-equal';

interface Store<T> {
  value: T;
  subscribe: (listener: () => void) => () => void;
  notify: () => void;
}

type StoreType<T> = Store<T> | undefined;

interface ContextType<T> {
  Provider: FC<{ value: T; children: ReactNode }>;
  __originalContext: Context<StoreType<T>>;
}

export const createContext = <T,>(defaultValue: T): ContextType<T> => {
  const Context = createContextOrig<StoreType<T>>(undefined);

  function Provider({ value, children }: { value: T; children: ReactNode }) {
    const storeRef = useRef<StoreType<T> | undefined>(undefined);
    let store = storeRef.current;
    if (!store) {
      const listeners = new Set<() => void>();
      store = {
        value,
        subscribe: (l) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        notify: () => listeners.forEach((l) => l()),
      };
      storeRef.current = store;
    }
    useEffect(() => {
      if (store && !Object.is(store.value, value)) {
        store.value = value;
        store.notify();
      }
    });
    return <Context.Provider value={store}>{children}</Context.Provider>;
  }

  return {
    Provider,
    __originalContext: Context,
  };
};

const noop = () => () => {};

const initialSymbol = Symbol('initial');

export const useContextSelector = <T, U>(
  context: ContextType<T>,
  selector: (value: T) => U,
  { equalityFn = shallowEqual }: { equalityFn?: (a: U, b: U) => boolean } = {},
): U => {
  const store = useContextOrig(context.__originalContext);
  const previousRef = useRef<U | typeof initialSymbol>(initialSymbol);
  const getSnapshot = () => {
    const newValue = selector(store!?.value);
    if (
      previousRef.current !== initialSymbol &&
      equalityFn(previousRef.current, newValue)
    ) {
      return previousRef.current;
    }
    previousRef.current = newValue;
    return newValue;
  };
  return useSyncExternalStore(store?.subscribe ?? noop, getSnapshot);
};
