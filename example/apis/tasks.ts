let id = 1;

export interface Task {
  id: number,
  name: string,
  done: boolean
}


export const create = (name: string): Promise<any> => new Promise((resolve) => resolve({ id: id++, name, done: false }));

export const toggle = (id: number, done: boolean): Promise<any> => new Promise((resolve) => resolve());