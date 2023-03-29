type ObjAny = { [x: string | number | symbol]: any };

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export const cleanObj = (obj: ObjAny): any => {
  for (const propName in obj) {
    // eslint-disable-next-line security/detect-object-injection
    if (obj[propName] === undefined) {
      // eslint-disable-next-line security/detect-object-injection
      delete obj[propName];
    }
  }

  return obj;
};
