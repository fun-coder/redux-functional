import { Dispatch } from "redux";
import { ContainerActions, FActions } from "./type";

export const createAction = <T>(prefix: string, actions: (keyof T)[]): FActions<T> => {
  return actions.reduce((map, action) => {
    const type = `@${prefix}/${action}`;
    const actionFn = (dispatch: Dispatch) => (...args: any[]) => dispatch({ type: type, payload: args });
    Object.defineProperty(actionFn, 'toString', { value: () => type });
    return {
      ...map,
      [action]: actionFn
    };
  }, {}) as FActions<T>
};

export const mapActions =
  <T>(dispatch: Dispatch, target: T): ContainerActions<T> =>
    Object.keys(target)
      .reduce((map, key) => ({
        ...map, [key]: (target as any)[key](dispatch)
      }), {}) as ContainerActions<T>;

