import { ContainerAction, ContainerActions, FActions } from "../../src/actions";
import { Process } from "../../src/process";
import { TaskActions, TaskModule } from "../modules/task";
import * as TaskApi from '../apis/tasks';
import { RootState } from "../state";


export const createTask = Process.create(
  [TaskModule.actions],
  (tasksActions: ContainerActions<TaskActions>) => async (taskName: string) => {
    const task = await TaskApi.create(taskName);
    return tasksActions.add(task);
  },
  "createTask"
);

export const toggleTask = Process.create(
  [TaskModule.actions],
  (tasksActions: ContainerActions<TaskActions>, state: RootState) => async (id: number, done?: boolean) => {
    let taskDone: boolean = done || false;
    if (done === undefined) {
      const task = TaskModule.selector.getTask(id)(state);
      taskDone = !task.done;
    }
    await TaskApi.toggle(id, taskDone);
    return tasksActions.patch(id, { done: taskDone });
  },
  "toggleTask"
);