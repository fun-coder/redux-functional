import { Action } from 'redux';

export type SelectionRunner = <T extends (state: any) => any>(selector: T) => ReturnType<T>

export interface PAction<T = any> extends Action<string> {
  payload: T
}
