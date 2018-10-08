import { Dispatch } from 'redux';
import { ContainerActions, FActions, PAction } from './type';

export const createActions = <T>(prefix: string, actions: (keyof T)[]): FActions<T> => {
  return actions.reduce((map, action) => {
    const actionFn = createAction(prefix, action as string);
    return { ...map, [action]: actionFn };
  }, {}) as FActions<T>
};

export const createAction = <T extends any[]>(prefix: string, actionName: string) => {
  const type = `@${prefix}/${actionName}`;
  const actionFn = (dispatch: Dispatch<PAction>) => (...args: T) => dispatch({ type: type, payload: args });
  Object.defineProperty(actionFn, 'toString', { value: () => type });
  return actionFn;
};

export const mapActions =
  <T>(dispatch: Dispatch<PAction>, target: T): ContainerActions<T> =>
    Object.keys(target)
      .reduce((map, key) => ({
        ...map, [key]: (target as any)[key](dispatch)
      }), {}) as ContainerActions<T>;

