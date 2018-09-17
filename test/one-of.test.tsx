import * as React from "react";
import { oneOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const matchBasicOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOf(E1),
    ],
    true,
  ).matchChildren();
}

const matchDomOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOf("div"),
    ],
    true,
  ).matchChildren();
}

const matchFunctionOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOf(c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const matchMultipleOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOf(E1, E2, E3),
    ],
    true,
  ).matchChildren();
}

const matchManyOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOf(E1),
      oneOf(E2),
      oneOf(E3),
    ],
    true,
  ).matchChildren();
}

describe("oneOf", () => {
  it("errors when given 0 for a basic oneOf", () => {
    expect(
      () => matchBasicOneOf([]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0.",
    );
  });

  it("passes when given 1 for a basic oneOf", () => {
    expect(
      matchBasicOneOf([<E1 />]),
    ).toEqual(
      [<E1 />],
    );
  });

  it("errors when given wrong type for a basic oneOf", () => {
    expect(
      () => matchBasicOneOf([<E2 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when given more than one for a basic oneOf", () => {
    expect(
      () => matchBasicOneOf([<E1 />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 1 of 2.",
    );
  });

  it("passes when given 1 regular div for oneOf", () => {
    expect(
     matchDomOneOf([<div />])
    ).toEqual(
      [<div />]
    );
  });

  it("errors when not given a div", () => {
    expect(
      () => matchDomOneOf([<E1 />]),
    ).toThrowError(
      "Too few children of type div for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E1 />.",
    );
  });

  it("errors when given 0 for a function oneOf", () => {
    expect(
      () => matchFunctionOneOf([]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected 1, Received: 0.",
    );
  });

  it("passes when given 1 for a function oneOf", () => {
    expect(
      matchFunctionOneOf([<E3 rand={123} />]),
    ).toEqual(
      [<E3 rand={123} />],
    );
  });

  it("errors when given non-matching type for a function oneOf", () => {
    expect(
      () => matchFunctionOneOf([<E1 />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E1 />.",
    );
  });

  it("errors when given more than one matching type for a function oneOf", () => {
    expect(
      () => matchFunctionOneOf([<E3 rand={123} />, <E3 rand={456} />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 1 of 2.",
    );
  });

  it("passes when given one of the various matching types for a oneOf", () => {
    expect(
      matchMultipleOneOf([<E1 />]),
    ).toEqual(
      [<E1 />],
    );

    expect(
      matchMultipleOneOf([<E2 />]),
    ).toEqual(
      [<E2 />],
    );

    expect(
      matchMultipleOneOf([<E3 rand={123} />]),
    ).toEqual(
      [<E3 rand={123} />],
    );
  });

  it("passes when looking for multiple oneOf", () => {
    expect(
      matchManyOneOf([<E1 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [<E1 />, <E2 />, <E3 rand={555} />],
    );
  });

  it("errors when given out of order oneOfs", () => {
    expect(
      () => matchManyOneOf([<E1 />, <E3 rand={555} />, <E2 />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E3 rand={555} />.",
    );

    expect(
      () => matchManyOneOf([<E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when passes too many for multiple oneOfs", () => {
    expect(
      () => matchManyOneOf([<E1 />, <E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );
  });
});
