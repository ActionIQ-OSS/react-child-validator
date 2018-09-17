import {
  IChildGroup,
  IChildMatch,
  FunctionType,
  Mapper,
  SingleChildType,
  ReactElement,
} from "./child-validator-types";

/*
 * Check if the received child type matches one of the expected types
 */
export function validateChild(
  expectedTypes: SingleChildType[],
  receivedChild: ReactElement,
): boolean {
  const receivedType = receivedChild.type;
  const found = expectedTypes.find(t => {
    const isDomElement = typeof t === "string";
    const isComponent = !!((t as any)["displayName"]);
    const isFunction = typeof t === "function" && !(t as any)["displayName"];

    return (
      (isDomElement && t === receivedType)
      || (isFunction && (t as FunctionType)(receivedChild))
      || (isComponent && (t as any) === receivedType)
    );
  })
  return found !== undefined;
}

export function children<T extends any[]>(...args: T) {
  return args;
}

export const zeroOrOneOf = <T extends SingleChildType[]>(...args: T): IChildGroup<T, "optional"> => ({
  match: {
    types: args,
    min: 0,
    max: 1,
  },
});

export const zeroOrMoreOf = <T extends SingleChildType[]>(...args: T): IChildGroup<T, "array"> => ({
  match: {
    types: args,
    min: 0,
    max: undefined,
  },
});

export const oneOf = <T extends SingleChildType[]>(...args: T): IChildGroup<T, "one"> => ({
  match: {
    types: args,
    min: 1,
    max: 1,
  },
});

export const oneOrMoreOf = <T extends SingleChildType[]>(...args: T): IChildGroup<T, "array"> => ({
  match: {
    types: args,
    min: 1,
    max: undefined,
  },
});

export const countOf = <T extends SingleChildType[]>(count: number, ...args: T): IChildGroup<T, "array"> => ({
  match: {
    types: args,
    min: count,
    max: count,
  },
});

export const countOrMoreOf = <T extends SingleChildType[]>(count: number, ...args: T): IChildGroup<T, "array"> => ({
  match: {
    types: args,
    min: count,
    max: undefined,
  },
});

export const countOrLessOf = <T extends SingleChildType[]>(count: number, ...args: T): IChildGroup<T, "array"> => ({
  match: {
    types: args,
    min: 0,
    max: count,
  },
});

export const countBetweenOf = <T extends SingleChildType[]>(min: number, max: number, ...args: T): IChildGroup<T, "array"> => ({
  match: {
    types: args,
    min,
    max,
  },
});

export const withMapper = <Types extends SingleChildType[], Type extends "one" | "optional" | "array" | "optionalArray">(childGroup: IChildGroup<Types, Type>, mapper: Mapper): typeof childGroup => ({
  ...childGroup,
  mapper,
})