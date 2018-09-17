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

export const zeroOrOneOf = (...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min: 0,
    max: 1,
  },
});

export const zeroOrMoreOf = (...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min: 0,
    max: undefined,
  },
});

export const oneOf = (...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min: 1,
    max: 1,
  },
});

export const oneOrMoreOf = (...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min: 1,
    max: undefined,
  },
});

export const countOf = (count: number, ...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min: count,
    max: count,
  },
});

export const countOrMoreOf = (count: number, ...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min: count,
    max: undefined,
  },
});

export const countOrLessOf = (count: number, ...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min: 0,
    max: count,
  },
});

export const countBetweenOf = (min: number, max: number, ...args: SingleChildType[]): IChildGroup => ({
  match: {
    types: args,
    min,
    max,
  },
});

export const withMapper = (childGroup: IChildGroup, mapper: Mapper): IChildGroup => ({
  ...childGroup,
  mapper,
})