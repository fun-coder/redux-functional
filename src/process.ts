import { Action, Dispatch, MiddlewareAPI } from 'redux';
import { mapActions } from './actions';
import { ContainerActions, FAction, PAction, ParamTypes, SelectionRunner } from "./type";

let dependencyCached = true;
const map: Record<string, any> = {};

type ProcessCallType<T> = T extends (dependencies: any, state: any) => infer U ? U : never;

export const Process = {
  create<T, K, P extends (actions: ContainerActions<T>, state: SelectionRunner) => any>(dependencies: T, handler: P, name: string): FAction<ProcessCallType<P>> {
    map[name] = { dependencies, handler };
    return (dispatch: Dispatch<any>) => async (...args: ParamTypes<ProcessCallType<P>>) => dispatch({
      type: name,
      payload: args
    });
  },
  register: <T extends Action>({ getState }: MiddlewareAPI<any>) => (next: Dispatch<PAction>) => {
    const dispatch = (action: PAction) => {
      const process = map[action.type];
      if (process) {
        if (!dependencyCached || !process.builtDependencies) {
          process.builtDependencies = mapActions(dispatch, process.dependencies);
        }
        return process.handler(
          process.builtDependencies,
          (selector: (state: any) => any) => selector(getState())
        )(...action.payload);
      }
      return next(action);
    };

    return dispatch;
  },
  setCache(cached: boolean) {
    dependencyCached = cached;
  }
};