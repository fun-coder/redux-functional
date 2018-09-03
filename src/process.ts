import { AnyAction, Dispatch } from "redux";
import { ContainerActions, FActions, mapActions } from "./actions";

const map: Record<string, any> = {};

export interface ProcessAction<K extends any[]> {
  (dispatch: Dispatch): (...args: K) => any;
}


interface ProcessHandler<T extends any[]> {
  (...dependencies: any[]): (...args: T) => Promise<any>
}

type ProcessCallType<T> = T extends (...dependencies: any[]) => (...args: infer U) => Promise<any> ? U : never;

export type ProcessType<T> = T extends ProcessAction<infer U> ? (...args: U) => any : never

export const Process = {
  create<T extends any[], K extends any[], P>(dependencies: any[], handler: P, name: string): ProcessAction<ProcessCallType<P>> {
    map[name] = { dependencies, handler };
    return (dispatch: Dispatch) => (...args: ProcessCallType<P>) => dispatch({ type: name, payload: args });
  },
  register: (store: any) => (next: Dispatch) => {
    const dispatch = (action: AnyAction) => {
      const process = map[action.type];
      if (process) {
        if (!process.builtDependencies) {
          process.builtDependencies = process.dependencies.map((actions: FActions<any>) => mapActions(dispatch, actions));
        }
        return process.handler(...process.builtDependencies, store.getState())(...action.payload);
      }
      return next(action);
    };

    return dispatch;
  },
};