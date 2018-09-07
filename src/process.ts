import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { mapActions } from "./actions";
import { ContainerActions, FAction, ParamTypes, SelectionRunner } from "./type";

const map: Record<string, any> = {};

type ProcessCallType<T> = T extends (dependencies: any, state: any) => infer U ? U : never;

export const Process = {
  create<T, K, P extends (actions: ContainerActions<T>, state: SelectionRunner) => any>(dependencies: T, handler: P, name: string): FAction<ProcessCallType<P>> {
    map[name] = { dependencies, handler };
    return (dispatch: Dispatch) => (...args: ParamTypes<ProcessCallType<P>>) => dispatch({ type: name, payload: args });
  },
  register: ({ getState }: MiddlewareAPI<any, any>) => (next: Dispatch) => {
    const dispatch = (action: AnyAction) => {
      const process = map[action.type];
      if (process) {
        if (!process.builtDependencies) {
          process.builtDependencies = mapActions(dispatch, process.dependencies);
        }
        const state = getState();
        return process.handler(
          process.builtDependencies,
          (selector: (state: any) => any) => selector(state)
        )(...action.payload);
      }
      return next(action);
    };

    return dispatch;
  },
};