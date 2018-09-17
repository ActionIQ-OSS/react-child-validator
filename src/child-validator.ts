import * as React from "react";

import { checkUnmatchedChildren, checkIncorrectChildrenCountError } from "./child-validator-errors";
import {
  ChildGroupMatchReturn,
  IChildGroup,
  HasDisplayName,
  Mapper,
  ReactChild,
  ReactElement,
} from "./child-validator-types";
import { validateChild } from "./child-validator-utils";

export class ReactChildValidator {
  /* children to validate */
  private children: ReactElement[];
  /* groups to validate against */
  private groups: IChildGroup[];
  /* parent component's class */
  private componentClass: HasDisplayName;
  /* props of the parent component */
  private props: Object;
  /* if should throw errors if they occur */
  private throwError: boolean;
  /* if should skip mapping children, usually true when validating, false when using return */
  private skipMapper: boolean;
  /* internal counter of which child we are about to validate */
  private nextChildIndex = 0;

  constructor(
    componentClass: HasDisplayName,
    props: Object = { },
    children: ReactChild[],
    groups: IChildGroup[],
    throwError = false,
    skipMapper = false,
  ) {
    // Instead of React.ReactChild[], assume that child validation is only used with components
    // that have other components as children instead of functions (or other types).
    // TODO support validation of function as children and more
    this.children = children as ReactElement[];

    this.componentClass = componentClass
    this.props = props;
    this.groups = groups;
    this.throwError = throwError;
    this.skipMapper = skipMapper;
  }

  /*
   * Loops through all the expected child groups, validates, and returns the mapped result
   */
  matchChildren(): ChildGroupMatchReturn[] {
    const mapped = this.groups.map(childGroup => {
      const matched = this.match({
        ...childGroup,
        mapper: childGroup.mapper || (x => x),
      });

      if (childGroup.match.max <= 1) {
        // if looking for at most 1
        // return single element instead of array
        return matched[0];
      }

      // otherwise return array
      return matched;
    });

    /*
     * Once we've finished matching all groups
     * check if there are any children leftover
     */
    checkUnmatchedChildren(
      this.componentClass,
      this.nextChildIndex,
      this.children.length,
      this.throwError,
    );

    return mapped;
  }

  /*
   * Given a `childGroup`, keep matching children until one doesn't match or the
   * `max` is reached based on the provided range. When a child is matched apply
   * the mapper on the child
   */
  private match(childGroup: IChildGroup): ReactElement[] {
    const childrenMatched: ReactElement[] = [];

    while (
      this.nextChildIndex < this.children.length
      && (childGroup.match.max === undefined || childrenMatched.length < childGroup.match.max)
    ) {
      const child = this.children[this.nextChildIndex];

      if (validateChild(childGroup.match.types, child)) {
        const mappedChild = this.skipMapper
          ? child
          : childGroup.mapper(child, this.props);
        childrenMatched.push(mappedChild);
        this.nextChildIndex++;
      } else {
        // break out of the loop if doesn't match
        break;
      }
    }

    checkIncorrectChildrenCountError(
      this.componentClass,
      childGroup,
      childrenMatched.length,
      this.children[this.nextChildIndex],
      this.throwError,
    );

    return childrenMatched;
  }
}
