import * as React from "react";
import { oneOrMoreOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, E4, ParentComponent } from "./components";

const matchBasicOneOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOrMoreOf(E1),
    ],
    true,
  ).matchChildren();
}

const matchFunctionOneOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOrMoreOf(c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const matchMultipleOneOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOrMoreOf(E1, E2, E3),
    ],
    true,
  ).matchChildren();
}

const matchManyOneOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      oneOrMoreOf(E1),
      oneOrMoreOf(E2),
      oneOrMoreOf(E3),
    ],
    true,
  ).matchChildren();
}

describe("oneOrMoreOf", () => {
  it("errors when given 0 for a basic oneOrMoreOf", () => {
    expect(
      () => matchBasicOneOrMoreOf([]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 1, Received: 0.",
    );
  });

  it("passes when given 1 for a basic oneOrMoreOf", () => {
    expect(
      matchBasicOneOrMoreOf([<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );
  });

  it("passes when given 2 for a basic oneOrMoreOf", () => {
    expect(
      matchBasicOneOrMoreOf([<E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />]],
    );
  });

  it("passes when given a bunch for a basic oneOrMoreOf", () => {
    expect(
      matchBasicOneOrMoreOf([<E1 />, <E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />, <E1 />]],
    );
  });

  it("errors when given wrong type for a basic oneOrMoreOf", () => {
    expect(
      () => matchBasicOneOrMoreOf([<E2 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 1, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when given 0 for a function oneOrMoreOf", () => {
    expect(
      () => matchFunctionOneOrMoreOf([]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected at least 1, Received: 0.",
    );
  });

  it("passes when given 1 for a function oneOrMoreOf", () => {
    expect(
      matchFunctionOneOrMoreOf([<E3 rand={123} />]),
    ).toEqual(
      [[<E3 rand={123} />]],
    );
  });

  it("passes when given a bunch for a function oneOrMoreOf", () => {
    expect(
      matchFunctionOneOrMoreOf([<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]),
    ).toEqual(
      [[<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]],
    );
  });

  it("errors when given non-matching type for a function oneOrMoreOf", () => {
    expect(
      () => matchFunctionOneOrMoreOf([<E1 />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected at least 1, Received: 0. Failed validation on <E1 />.",
    );
  });

  it("passes when given one of the various matching types for a oneOrMoreOf", () => {
    expect(
      matchMultipleOneOrMoreOf([<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );

    expect(
      matchMultipleOneOrMoreOf([<E2 />]),
    ).toEqual(
      [[<E2 />]],
    );

    expect(
      matchMultipleOneOrMoreOf([<E3 rand={123} />]),
    ).toEqual(
      [[<E3 rand={123} />]],
    );

    expect(
      matchMultipleOneOrMoreOf([<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]],
    );
  });

  it("errors when given none of the various matching types for a oneOrMoreOf", () => {
    expect(
      () => matchMultipleOneOrMoreOf([<E4 />]),
    ).toThrowError(
      "Too few children of type [E1, E2, E3] for <ParentComponent />. Expected at least 1, Received: 0. Failed validation on <E4 />.",
    );
  });

  it("passes when looking for multiple oneOrMoreOf", () => {
    expect(
      matchManyOneOrMoreOf([<E1 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />], [<E2 />], [<E3 rand={555} />]],
    );
  });

  it("passes when looking for multiple groups of oneOrMoreOf", () => {
    expect(
      matchManyOneOrMoreOf([<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], [<E3 rand={555} />]],
    );
  });

  it("errors when given out of order oneOrMoreOfs", () => {
    expect(
      () => matchManyOneOrMoreOf([<E1 />, <E3 rand={555} />, <E2 />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected at least 1, Received: 0. Failed validation on <E3 rand={555} />.",
    );

    expect(
      () => matchManyOneOrMoreOf([<E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 1, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when passes too many for multiple oneOrMoreOfs", () => {
    expect(
      () => matchManyOneOrMoreOf([<E1 />, <E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );
  });
});
