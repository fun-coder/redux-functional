import { Dispatch } from "redux";

export type ParamTypes<T> = T extends (...args: infer U) => any ? U : never;

export type FAction<T> = {
  (dispatch: Dispatch): (...args: ParamTypes<T>) => Promise<any>,
}

export type FActions<T> = {
  [K in keyof T]: FAction<T[K]>
}

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