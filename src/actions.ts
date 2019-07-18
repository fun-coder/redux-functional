import { ActionCreatorsMapObject, Dispatch } from 'redux';
import { PAction, PActionCreators } from './type';

export const createActions = <T>(prefix: string, actions: (keyof T)[]): PActionCreators<T> => {
  return actions.reduce((map, action) => {
    const actionFn = createAction(prefix, action as string);
    return { ...map, [action]: actionFn };
  }, {}) as PActionCreators<T>;
};

export const createAction = <T extends any[]>(prefix: string, actionName: string): (...args: T) => PAction<T> => {
  const type = `@${ prefix }/${ actionName }`;
  const actionFn = (...args: T) => ({ type: type, payload: args });
  Object.defineProperty(actionFn, 'toString', { value: () => type });
  return actionFn;
};

export const mapActions =
  <T>(dispatch: Dispatch<PAction>, target: T): ActionCreatorsMapObject<PAction<T>> =>
    Object.keys(target)
      .reduce((map: Object, key) => ({
        ...map, [key]: (...args: any[]) => dispatch((target as any)[key](...args))
      }), {}) as ActionCreatorsMapObject<PAction<T>>;

