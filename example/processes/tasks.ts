import { TaskModule } from "../modules/task";
import * as TaskApi from '../apis/tasks';
import { Process } from "../../index";

export const toggleTask = Process.create(
  { patchTask: TaskModule.actions.patch },
  ({ patchTask }, select) => async (id: number, done?: boolean) => {
    let taskDone: boolean = done || false;
    if (done === undefined) {
      const task = select(TaskModule.selector.getTask(id));
      taskDone = !task.done;
    }
    await TaskApi.toggle(id, taskDone);
    return patchTask(id, { done: taskDone });
  },
  "toggleTask"
);

export const createTask = Process.create(
  {
    addTask: TaskModule.actions.add,
    toggleTask: toggleTask,
  },
  ({ addTask, toggleTask }) => async (taskName: string) => {
    const task = await TaskApi.create(taskName);
    await addTask(task);
    return toggleTask(task.id, false);
  },
  "createTask"
);
