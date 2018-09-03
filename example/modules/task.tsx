import { combineReducers, createStore, Reducer } from "redux";
import { createSelector } from "reselect";
import { createAction } from "../../src";
import { FActions } from "../../src/actions";
import { ReducerMap } from "../../src/ReducerMap";
import { moduleSelect } from "../../src/selectors";
import { Task } from "../apis/tasks";

const moduleName = 'TaskModule';

// Define Actions
export interface TaskActions {
  add: (task: Task) => Promise<any>
  patch: (id: number, task: Partial<Task>) => Promise<any>
}

const actions: FActions<TaskActions> = createAction<TaskActions>(moduleName, ['add', 'patch']);

// Define Reducers
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
  list: listReducer,
});

// Define Selectors
export interface TaskState {
  data: Record<string, Task>,
  list: number[]
}

const getTaskIds = moduleSelect(moduleName, (s: TaskState) => s.list);
const getTasks = moduleSelect(moduleName, (s: TaskState) => s.data);
const getTask = (id: number) => moduleSelect(moduleName, (s: TaskState) => s.data[id]);

const getAllTasks = createSelector(
  [getTaskIds, getTasks],
  (ids: number[], data: Record<number, Task>) => ids.map(id => data[id])
);


export const TaskModule = {
  name: moduleName,
  actions,
  reducers,
  selector: {
    getAllTasks,
    getTask
  }
};
