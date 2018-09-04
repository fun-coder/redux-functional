import { Dispatch } from "redux";

export type ParamTypes<T> = T extends (...args: infer U) => any ? U : never;

export type FAction<T> = {
  (dispatch: Dispatch): (...args: ParamTypes<T>) => any,
  toString(): string
}

export type FActions<T> = {
  [K in keyof T]: FAction<T[K]>
}

export type ContainerActions<T> = {
  [K in keyof T]: ContainerAction<T[K]>
};

export type ContainerAction<T> = T extends FAction<infer U>
  ?  (...args: ParamTypes<U>) => Promise<any>
  : T extends (...args: infer U) => any ? (...args: U) => Promise<any> : any;

export type SelectionRunner = <T extends (state: any) => any>(selector: T) => ReturnType<T>