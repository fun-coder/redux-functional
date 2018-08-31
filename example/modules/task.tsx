import { combineReducers, createStore, Reducer } from "redux";
import { createAction } from "../../src";
import { ReducerMap } from "../../src/ReducerMap";

interface Task {
  id: number,
  name: string,
  done: boolean
}

interface TaskActions {
  add: (task: Task) => any
  patch: (id: number, task: Partial<Task>) => any
}

const moduleName = 'TaskModule';

const actions = createAction<TaskActions>(moduleName, ['add', 'patch']);

const dataReducer = new ReducerMap<Record<number, Task>>({})
  .watch(actions.add, (state, task: Task) => ({ ...state, [task.id]: task }))
  .watch(actions.patch, (state, id: number, task: Partial<Task>) => {
    const originTask = state[id] || {};
    return { ...state, [id]: { ...originTask, ...task } };
  })
  .toReducer();

const listReducer = new ReducerMap<number[]>([])
  .watch(actions.add, (state, task: Task) => [...state, task.id])
  .toReducer();

const reducers = combineReducers({
  data: dataReducer,
  list: listReducer
});

// interface TaskState {
//   data: Record<string, Task>,
//   list: number[]
// }

export const TaskModule = {
  name: moduleName,
  actions,
  reducers
};

const store = createStore(() => 1);

TaskModule.actions.add(store.dispatch)({ id: 1, name: '', done: false });
TaskModule.actions.patch(store.dispatch)(1, { name: 'a' });
