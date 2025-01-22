import { ComponentType } from 'react';

export type Paths<T> =
  T extends ComponentType<any>
    ? never
    : T extends any[]
      ? {
          [k in keyof T]: k extends string
            ? `${k}${'' | `.${Paths<T[k]>}`}`
            : k;
        }[number]
      : T extends object
        ? {
            [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`;
          }[keyof T]
        : never;

export type ValueAtPath<
  T,
  K extends Paths<T>,
> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Paths<T[Key]>
      ? ValueAtPath<T[Key], Rest>
      : never
    : never
  : K extends keyof T
    ? T[K]
    : never;

export const getAtPath = <T, K extends Paths<T>>(
  obj: T,
  path: K,
): ValueAtPath<T, K> => {
  const keys = typeof path === 'string' ? path.split('.') : [path];
  let result: any = obj;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};
