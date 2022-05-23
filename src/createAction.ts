import {
  ActionCreator,
  EmptyActionCreator,
  EmptyProps,
  Props,
  TypeFromProps,
} from './models';

export function withoutProps(): EmptyProps {
  return { _as: 'empty' };
}

export function withProps<P>(): Props<P> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { _as: 'props', _p: undefined! };
}

export function createAction<Name extends string>(
  name: string
): EmptyActionCreator<Name>;
export function createAction<Name extends string, P extends EmptyProps>(
  name: string,
  props: P
): EmptyActionCreator<Name>;
export function createAction<Name extends string, P extends Props>(
  name: Name,
  props: P
): ActionCreator<Name, TypeFromProps<P>>;
export function createAction<
  Name extends string,
  P extends Props | EmptyProps | undefined
>(
  name: Name,
  propType?: P
): ActionCreator<Name, TypeFromProps<P>> | EmptyActionCreator<Name> {
  if (propType === undefined || propType._as === 'empty') {
    return class {
      static readonly type = name;
    } as EmptyActionCreator<Name>;
  } else {
    return class {
      static readonly type = name;
      constructor(payload: TypeFromProps<P>) {
        Object.entries(payload).forEach(([key, value]) => {
          // @ts-expect-error should fail because properties are not known
          this[key] = value;
        });
      }
    } as ActionCreator<Name, TypeFromProps<P>>;
  }
}
