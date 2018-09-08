import { Action, Dispatch, MiddlewareAPI } from 'redux';
import { mapActions } from './actions';
import { ContainerActions, FAction, PAction, ParamTypes, SelectionRunner } from "./type";

const map: Record<string, any> = {};

type ProcessCallType<T> = T extends (dependencies: any, state: any) => infer U ? U : never;

export const Process = {
  create<T, K, P extends (actions: ContainerActions<T>, state: SelectionRunner) => any>(dependencies: T, handler: P, name: string): FAction<ProcessCallType<P>> {
    map[name] = { dependencies, handler };
    console.log('set name', name, map);
    return (dispatch: Dispatch<any>) => async (...args: ParamTypes<ProcessCallType<P>>) => {
      console.log('dispatch', name, args);
      return dispatch({
        type: name,
        payload: args
      });
    };
  },
  register: <T extends Action>({ getState }: MiddlewareAPI<any>) => (next: Dispatch<PAction>) => {
    const dispatch = (action: PAction) => {
      const process = map[action.type];
      if (process) {
        if (!process.builtDependencies) {
          process.builtDependencies = mapActions(dispatch, process.dependencies);
        }
        return process.handler(
          process.builtDependencies,
          (selector: (state: any) => any) => selector(getState())
        )(...action.payload);
      }
      console.log('can not find', action.type, map);
      return next(action);
    };

    return dispatch;
  },
};