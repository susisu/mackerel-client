export type Options<T> = { readonly [K in keyof T]?: T[K] | undefined };

export type Extends<T, U> = [T] extends [U] ? true : false;

export function assertType<T extends true>(_: T): void {}
