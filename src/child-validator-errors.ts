import { IChildGroup, FunctionType, HasDisplayName, SingleChildType, ReactClass, ReactElement } from "./child-validator-types";

/*
 * Given a SingleChildType[], build a human readable error message. If a component
 * print the displayName, if a function print the name, if fn doesn't have a name
 * toString it.
 */
const errorStringTypes = (types: SingleChildType[]) => {
  const generateString = (t: SingleChildType) => {
    return (t as ReactClass).displayName || (t as FunctionType).name || t.toString()
  }

  if (types.length === 1) {
    return generateString(types[0]);
  }
  return "[" + types.map(t => generateString(t)).join(", ") + "]";
}

/*
 * Given a ReactElement, build a (mostly) human readable version of it
 */
const errorStringChild = (child: ReactElement) => {
  const props = child.props;
  const keys  = Object.keys(props);
  const propString = keys.map(k => `${k}={${props[k].toString()}}`).join(" ")
 
  return `<${(child.type as ReactClass).displayName}${propString ? " " : ""}${propString} />`;
}

/*
 * Checks if there are extra children that weren't matched, throws an error if true
 */
export function checkUnmatchedChildren(
  componentClass: HasDisplayName,
  nextChildIndex: number,
  numChildren: number,
  throwError: boolean,
) {
  if (nextChildIndex >= numChildren || !throwError) {
    return;
  }

  throw new Error(
    `Too many children passed to <${componentClass.displayName} />. Matched ${nextChildIndex} of ${numChildren}.`,
  );
}

/*
 * Checks if too few children or two many children were given for a specific ChildGroup.
 * Throws the approriate error with as much details as possible.
 */
export function checkIncorrectChildrenCountError(
  componentClass: HasDisplayName,
  childGroup: IChildGroup,
  numMatched: number,
  currentChild: ReactElement | undefined,
  throwError: boolean,
) {
  if (!throwError) {
    return;
  }

  const { min, max, types } = childGroup.match;
  if (numMatched >= min && (max === undefined || numMatched <= max)) {
    return;
  }

  const isTooFew = numMatched < min;
  const fewOrMany = isTooFew ? "Too few" : "Too many";

  let atBlank = "";
  let atCount = "";
  if (max !== undefined && max !== min) {
    atBlank = "between ";
    atCount = `[${min}, ${max}]`;
  } else {
    if (isTooFew) {
      atBlank = "at least ";
      atCount = min + "";
    } else {
      atBlank = "at most ";
      atCount = max + "";
    }
  }
  if (max === min) {
    atBlank = "";
  }

  throw new Error(
    `${fewOrMany} children of type ${errorStringTypes(types)} for <${componentClass.displayName} />.`
    + ` Expected ${atBlank}${atCount}, Received: ${numMatched}.`
    + (currentChild ? ` Failed validation on ${errorStringChild(currentChild)}.` : ""),
  );
}
