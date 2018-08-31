import { Action, AnyAction } from "redux";

export interface IAction<T> extends AnyAction {
  payload: T
}