import * as React from "react";
import { IChildGroup, IChildMatch, ChildGroupMatchReturn, ReactClass, ReactElement } from "./child-validator-types";
import { ReactChildValidator } from "./child-validator";

interface IBaseClass {
  childGroups?: IChildGroup<any, any>[];
  propTypes?: {
    children: (props: {children: {}}) => Error,
  };
  displayName: string;
}

type ClassConstructor = IBaseClass & ReactClass;

export abstract class BaseClass<P = {}, S = {}, Self extends ClassConstructor = undefined> extends React.PureComponent<P, S> {
  static childValidatorProps = (componentClass: IBaseClass) => ({
    children: (props: {children: {}}): Error => {
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

  matchChild() {
    return this.matchChildren()[0];
  }

  matchChildren() {
    return new ReactChildValidator<Self["childGroups"]>(
      (this.constructor as Self),
      this.props,
      React.Children.toArray(this.props.children),
      (this.constructor as Self).childGroups,
      false,
      false,
    ).matchChildren();
  }
}

