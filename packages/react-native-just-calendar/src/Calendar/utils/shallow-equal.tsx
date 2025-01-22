import { getAtPath, Paths } from './get-at-path';

export const shallowEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }
  if (typeof a !== 'object' || !a || typeof b !== 'object' || !b) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  return keysA.every((key) => a[key] === b[key]);
};

export const shallowEqualPaths = <T,>(a: T, b: T, paths: Paths<T>[]) => {
  return paths.every((path) =>
    shallowEqual(getAtPath(a, path), getAtPath(b, path)),
  );
};
