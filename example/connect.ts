import { ComponentType } from "react";
import { MapStateToProps, MapStateToPropsParam } from "react-redux";
import * as ReactRedux from 'react-redux';

type Exclude<T, S, U> = T extends S ? never : T extends U ? never: T;

type A = 'a' | 'b' | 'c' | 'd'
type B = 'b'
type C = 'c'

const x: Exclude<A, B, C> = 'a';

type AP = {
  a: string
  b: string
  c: string
  d: string
}
type BP = {
  b: string
}
type CP = {
  c: string
}

export type DiffMap<T, S, U> = {
  [P in Exclude<keyof T, keyof S, keyof U>]: T[P]
}

const yy: DiffMap<AP, BP, CP> = {
  a: '1',
  d: 't'
};
type ComponentProps<T> = T extends ComponentType<infer U> ? U : never;

type ReturnType<T> = T extends (...args: any[]) => infer U ? U : never;

export const connect =  <T extends MapStateToProps<any, any, any>, K, C extends ComponentType<any>>(mapStateToProps: T, mapDispatchToProps: K,) => (comp: C): ComponentType<DiffMap<ComponentProps<C>, ReturnType<T>, ReturnType<K>>> => {
  return ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps)(comp);
};
