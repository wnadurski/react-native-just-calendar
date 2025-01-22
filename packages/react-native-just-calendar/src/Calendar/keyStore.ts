type Listener<T> = (value: T) => any;

export interface KeyStore<T, Keys extends string> {
  subscribe: (key: Keys, listener: Listener<T>) => () => void;
  update: (newValue: Record<Keys, T>) => void;
  getValue: () => Record<Keys, T>;
}

export const createStore = <T, Keys extends string>(
  initialValue: Record<Keys, T>,
): KeyStore<T, Keys> => {
  let value = initialValue;
  let listeners: Record<Keys, Set<Listener<T>>> = {} as Record<
    Keys,
    Set<Listener<T>>
  >;
  return {
    subscribe: (key: Keys, l: (newValue: T) => void) => {
      if (!listeners[key]) {
        listeners[key] = new Set();
      }
      listeners[key].add(l);
      return () => {
        listeners[key].delete(l);
        if (listeners[key].size === 0) {
          delete listeners[key];
        }
      };
    },
    update: (newValue: Record<Keys, T>) => {
      const oldValue = value;
      value = newValue;
      const keysToNotify = new Set([
        ...Object.keys(newValue),
        ...Object.keys(oldValue),
      ] as Keys[]);
      keysToNotify.forEach((key) => {
        listeners[key]?.forEach((l) => l(newValue[key]));
      });
    },
    getValue: () => value,
  };
};
