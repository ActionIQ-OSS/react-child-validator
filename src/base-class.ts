import * as React from "react";
import { IChildGroup, ChildGroupMatchReturn, ReactClass, ReactElement } from "./child-validator-types";
import { ReactChildValidator } from "./child-validator";

interface IBaseClass {
  childGroups?: IChildGroup[];
  propTypes?: {
    children: (props: {children: {}}, propName: string, componentName: string) => Error,
  };
  displayName: string;
}

type ClassConstructor = IBaseClass & ReactClass;

export abstract class BaseClass<P = {}, S = {}> extends React.PureComponent<P, S> {
  static childValidatorProps = (componentClass: IBaseClass) => ({
    children: (props: {children: {}}, _: string, componentName: string): Error => {
      try {
        new ReactChildValidator(
          componentClass,
          { },
          React.Children.toArray(props.children),
          componentClass.childGroups,
          true,
          true,
        ).matchChildren();
        return null;
      } catch (e) {
        return e;
      }
    },
  });

  matchChild(): ChildGroupMatchReturn {
    return this.matchChildren()[0];
  }

  matchChildren(): ChildGroupMatchReturn[] {
    return new ReactChildValidator(
      (this.constructor as ClassConstructor),
      this.props,
      React.Children.toArray(this.props.children),
      (this.constructor as ClassConstructor).childGroups,
      false,
      false,
    ).matchChildren();
  }
}

