export const moduleSelect = <T extends (x: any) => any>(key: string, mapFn: T): (state: any) => ReturnType<T> => {
  return (state: any) => mapFn(state[key]);
};

export const moduleSelectWith = () => <T extends (x: any) => any>(key: string, mapFn: T): (state: any) => ReturnType<T> => {
  return (state: any) => mapFn(state[key]);
};
