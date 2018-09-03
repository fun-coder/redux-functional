import { Dispatch } from "redux";

export type ParamTypes<T> = T extends (...args: infer U) => any ? U : never;

export type ContainerAction<T> = {
  (...args: ParamTypes<T>): Promise<any>
};

export type FAction<T> = {
  (dispatch: Dispatch): ContainerAction<T>,
  toString(): string
}

export type FActions<T> = {
  [K in keyof T]: FAction<T[K]>
}

export type OAction<T> = T extends FAction<infer U> ? U : never;

export type OActions<T> = {
  [K in keyof T]: OAction<T[K]>
}

export type ContainerActions<T> = {
  [K in keyof T]: ContainerAction<T[K]>
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


export const mapActions =
  <T, K extends keyof T, U>(dispatch: Dispatch, target: T): ContainerActions<OActions<T>> =>
    Object.keys(target)
      .reduce((map, key) => ({
        ...map, [key]: (target as any)[key](dispatch)
      }), {}) as ContainerActions<OActions<T>>;

