import { Action, ActionCreator, ActionCreatorsMapObject, Dispatch, MiddlewareAPI } from 'redux';
import { mapActions } from './actions';
import { PAction, SelectionRunner } from "./type";

let dependencyCached = true;
const map: Record<string, any> = {};

export const Process = {
  create<T, K, P extends (actions: ActionCreatorsMapObject<PAction>, state: SelectionRunner) => any>(dependencies: T, handler: P, name: string): ActionCreator<Promise<PAction>> {
    map[name] = { dependencies, handler };
    return async (...args) => ({
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
