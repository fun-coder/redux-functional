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

interface FReducer<K> {
  (state: any, ...args: ActionParamType<K>): any
}

// (state: any, action: Action) => any

const toReducer = <S, T extends FAction<any>>(action: T, reducers: FReducer<T>): Reducer<S> => {
  const actionName = action.toString();
  return (state?: S, action: IAction<any>) => {

  }
};

interface TaskState {
  data: Record<string, Task>,
  list: number[]
}

toReducer(tasksActions.add, (state: Record<string, Task>, task: Task) => {});

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
