import * as React from "react";
import { zeroOrMoreOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const matchBasicZeroOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrMoreOf(E1),
    ],
    true,
  ).matchChildren();
}

const matchFunctionZeroOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrMoreOf(c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const matchMultipleZeroOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrMoreOf(E1, E2, E3),
    ],
    true,
  ).matchChildren();
}

const matchManyZeroOrMoreOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrMoreOf(E1),
      zeroOrMoreOf(E2),
      zeroOrMoreOf(E3),
    ],
    true,
  ).matchChildren();
}

describe("zeroOrMoreOf", () => {
  it("passes when given 0 for a basic zeroOrMoreOf", () => {
    expect(
      matchBasicZeroOrMoreOf([]),
    ).toEqual(
      [[]],
    );
  });

  it("passes when given 1 for a basic zeroOrMoreOf", () => {
    expect(
      matchBasicZeroOrMoreOf([<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );
  });

  it("passes when given 2 for a basic zeroOrMoreOf", () => {
    expect(
      matchBasicZeroOrMoreOf([<E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />]],
    );
  });

  it("passes when given a bunch for a basic zeroOrMoreOf", () => {
    expect(
      matchBasicZeroOrMoreOf([<E1 />, <E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />, <E1 />]],
    );
  });

  it("errors when given wrong type for a basic zeroOrMoreOf", () => {
    expect(
      () => matchBasicZeroOrMoreOf([<E2 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 0 of 1.",
    );
  });

  it("passes when given 0 for a function zeroOrMoreOf", () => {
    expect(
      matchFunctionZeroOrMoreOf([]),
    ).toEqual(
      [[]],
    );
  });

  it("passes when given 1 for a function zeroOrMoreOf", () => {
    expect(
      matchFunctionZeroOrMoreOf([<E3 rand={123} />]),
    ).toEqual(
      [[<E3 rand={123} />]],
    );
  });

  it("passes when given a bunch for a function zeroOrMoreOf", () => {
    expect(
      matchFunctionZeroOrMoreOf([<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]),
    ).toEqual(
      [[<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]],
    );
  });

  it("errors when given non-matching type for a function zeroOrMoreOf", () => {
    expect(
      () => matchFunctionZeroOrMoreOf([<E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 0 of 1.",
    );
  });

  it("passes when given one of the various matching types for a zeroOrMoreOf", () => {
    expect(
      matchMultipleZeroOrMoreOf([]),
    ).toEqual(
      [[]],
    );

    expect(
      matchMultipleZeroOrMoreOf([<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );

    expect(
      matchMultipleZeroOrMoreOf([<E2 />]),
    ).toEqual(
      [[<E2 />]],
    );

    expect(
      matchMultipleZeroOrMoreOf([<E3 rand={123} />]),
    ).toEqual(
      [[<E3 rand={123} />]],
    );

    expect(
      matchMultipleZeroOrMoreOf([<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]],
    );
  });

  it("passes when looking for multiple zeroOrMoreOf", () => {
    expect(
      matchManyZeroOrMoreOf([<E1 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />], [<E2 />], [<E3 rand={555} />]],
    );
  });

  it("passes when looking for multiple groups of zeroOrMoreOf", () => {
    expect(
      matchManyZeroOrMoreOf([<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], [<E3 rand={555} />]],
    );
  });

  it("errors when given out of order zeroOrMoreOfs", () => {
    expect(
      () => matchManyZeroOrMoreOf([<E1 />, <E3 rand={555} />, <E2 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 2 of 3.",
    );

    expect(
      () => matchManyZeroOrMoreOf([<E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 2 of 3.",
    );

    expect(
      () => matchManyZeroOrMoreOf([<E3 rand={555} />, <E2 />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 1 of 3.",
    );
  });

  it("errors when passes too many for multiple zeroOrMoreOfs", () => {
    expect(
      () => matchManyZeroOrMoreOf([<E1 />, <E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );
  });
});
