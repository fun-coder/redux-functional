import { Reducer } from 'redux';

type ActionParamType<T> = T extends (...args: infer U) => any ? U : any;

export interface FReducer<S, K> {
  (state: S, ...args: ActionParamType<K>): S
}

export class ReducerMap<S> {
  private maps: Record<string, FReducer<S, any>> = {};

  constructor(private defaultValue: S) {
  }

  watch<T>(action: T, handler: FReducer<S, T>): ReducerMap<S> {
    const actionName = action.toString();
    this.maps[actionName] = handler;
    return this;
  }

  toReducer(): Reducer<S> {
    const defaultValue = this.defaultValue;
    const maps = this.maps;
    return (state: S = defaultValue, action: any): S => {
      const handle = maps[action.type];
      return handle ? handle(state, ...action.payload) : state;
    };
  }
}
