export type Options<T> = { readonly [K in keyof T]?: T[K] | undefined };
