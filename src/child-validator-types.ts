import * as React from "react";

export type FunctionType = { (el: ReactElement): boolean, name: string };
export type ReactChild = React.ReactChild;
export type ReactClass = React.ComponentClass;
export type ReactElement = React.ReactElement<any>;
export type ChildGroupMatchReturn = ReactElement | ReactElement[];

export type Mapper = (_: ReactElement, _2: any) => ReactElement;
export type SingleChildType = ReactElement | ReactClass | FunctionType | string;
export type HasDisplayName = { displayName: string }

export interface IChildMatch {
  types: SingleChildType[];
  min: number;
  max: number | undefined;
}

export interface IChildGroup {
  match: IChildMatch;
  mapper?: Mapper;
}
