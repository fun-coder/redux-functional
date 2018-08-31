import { Action, combineReducers, createStore, Dispatch, Reducer } from "redux";
import { createAction } from "../../src";
import { FAction } from "../../src/actions";
import { IAction } from "../../src/Types";

interface Task {
  id: number,
  name: string,
  done: boolean
}

interface TaskActions {
  add: (task: Task) => any
  patch: (id: number, task: Task) => any
}

const tasksActions = createAction<TaskActions>(['add']);


type ActionParamType<T> = T extends FAction<(...args: infer U) => any> ? U : never;

interface FReducer<S, K> {
  (state?: S, ...args: ActionParamType<K>): S
}


// (state: any, action: Action) => any

type PReducer<S> = (state: S, action: IAction<any>) => S

const toReducers = <S, T extends FAction<any>>(...paires: [T, FReducer<S, T>][]): PReducer<S> => {
  const actionHandles = paires.reduce((map: Record<string, PReducer<S>>, [faction, reducer]) => {
    return ({ ...map, [faction.toString()]: reducer });
  }, {});
  return (state: S, action: IAction<any>): S => {
    actionHandles
    return action.type === actionName ? reducer(state, ...action.payload) : state;
  };
}

const toReducer = <S, T extends FAction<any>>(fAction: T, reducer: FReducer<S, T>): (state: S, action: IAction<any>) => S => {
  const actionName = fAction.toString();
  return (state: S, action: IAction<any>): S => {
    return action.type === actionName ? reducer(state, ...action.payload) : state;
  };
};

interface TaskState {
  data: Record<string, Task>,
  list: number[]
}

toReducer(tasksActions.add, (state: Record<string, Task>, task: Task) => {
});

const taskReducers: Reducer = combineReducers({
  data: <T extends Action>(state: any, action: T) => 1
});

export const TaskModule = {
  actions: tasksActions,
  reducers: taskReducers
};

const store = createStore(() => 1);

TaskModule.actions.add(store.dispatch)(1)
TaskModule.actions.patch(store.dispatch)(1)
