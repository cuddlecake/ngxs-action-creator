export type ActionCreator<Name extends string, T> = {
  readonly type: Name;
  new (payload: T): { [key in keyof T]: T[key] };
};

export type EmptyActionCreator<Name extends string> = {
  readonly type: Name;
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (): {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props<P = any> = {
  _as: 'props';
  _p: P;
};

export type EmptyProps = {
  _as: 'empty';
};

export type TypeFromProps<P> = P extends Props<infer T> ? T : never;

export type SourceActionName<
  Source extends string,
  Name extends string
> = `[${Source}] ${Name}`;
