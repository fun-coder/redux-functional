import { Action } from 'redux';

export type SelectionRunner = <T extends (state: any) => any>(selector: T) => ReturnType<T>

export interface PAction<T = any> extends Action<string> {
  payload: T
}

export type Args<T> = T extends ((...args: infer U) => any) ? U : never
export type Return<T> = T extends ((...args: any[]) => infer U) ? U : never

export type PActionCreators<T> = {
  [P in keyof T]: (...args: Args<T[P]>) => PAction<any>
};

// export type CreatorMap<T> = {
//   [P in keyof T]:
// }






