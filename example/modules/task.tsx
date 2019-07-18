import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { createAction, createActions, moduleSelect, ReducerMap } from "../../index";
import { Task } from "../apis/tasks";

const moduleName = 'TaskModule';

export interface TaskState {
  data: Record<string, Task>,
  list: number[]
}

// Define Actions
export interface TaskActions {
  add: (task: Task) => void
  patch: (id: number, task: Partial<Task>) => void,
  delete: (id: number) => void
}


const actions = createActions<TaskActions>(moduleName, ['add', 'patch', 'delete']);

// Define Reducers
const dataReducer = new ReducerMap<Record<number, Task>>({})
  .watch(actions.add, (state, task: Task) => ({ ...state, [task.id]: task }))
  .watch(actions.patch, (state, id: number, task: Partial<Task>) => {
    const originTask = state[id] || {};
    return { ...state, [id]: { ...originTask, ...task } };
  })
  .watch(actions.delete, (state, id) => {
    const newState = { ...state };
    delete newState[id];
    return newState;
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

const getTaskIds = moduleSelect(moduleName, (s: TaskState) => s.list);
const getTasks = moduleSelect(moduleName, (s: TaskState) => s.data);
const getTask = (id: number) => moduleSelect(moduleName, (s: TaskState) => s.data[id]);

const getAllTasks = createSelector(
  [getTaskIds, getTasks],
  (ids: number[], data: Record<number, Task>) => ids.map(id => data[id]).filter(task => task)
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
