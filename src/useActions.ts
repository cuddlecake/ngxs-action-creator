import type { ActionOptions, StateContext } from '@ngxs/store';
import { Action } from '@ngxs/store';
import { ActionCreator } from './models';

export function useActions<StateModel>(stateClass: any) {
  return function <AC extends ActionCreator<any, any>>(
    actionCreator: AC | AC[],
    handler: OnActionHandler<StateModel, AC>,
    options?: ActionOptions
  ) {
    const methodKey = Symbol();
    Reflect.defineProperty(stateClass, methodKey, {
      writable: false,
      value: handler,
    });
    Action(actionCreator, options)(stateClass, methodKey, {});
  };
}

export type OnActionHandler<StateModel, AC extends ActionCreator<any, any>> = (
  ctx: StateContext<StateModel>,
  props: InstanceType<AC>
) => void;
