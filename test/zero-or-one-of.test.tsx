import * as React from "react";
import { zeroOrOneOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const matchBasicZeroOrOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrOneOf(E1),
    ],
    true,
  ).matchChildren();
}

const matchFunctionZeroOrOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrOneOf(c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const matchMultipleZeroOrOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrOneOf(E1, E2, E3),
    ],
    true,
  ).matchChildren();
}

const matchManyZeroOrOneOf = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrOneOf(E1),
      zeroOrOneOf(E2),
      zeroOrOneOf(E3),
    ],
    true,
  ).matchChildren();
}

describe("zeroOrOneOf", () => {
  it("passes when given 0 for a basic zeroOrOneOf", () => {
    expect(
      matchBasicZeroOrOneOf([]),
    ).toEqual(
      [undefined],
    );
  });

  it("passes when given 1 for a basic zeroOrOneOf", () => {
    expect(
      matchBasicZeroOrOneOf([<E1 />]),
    ).toEqual(
      [<E1 />],
    );
  });

  it("errors when given wrong type for a basic zeroOrOneOf", () => {
    expect(
      () => matchBasicZeroOrOneOf([<E2 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 0 of 1.",
    );
  });

  it("errors when given more than one for a basic zeroOrOneOf", () => {
    expect(
      () => matchBasicZeroOrOneOf([<E1 />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 1 of 2.",
    );
  });

  it("passes when given 0 for a function zeroOrOneOf", () => {
    expect(
      matchFunctionZeroOrOneOf([]),
    ).toEqual(
      [undefined],
    );
  });

  it("passes when given 1 for a function zeroOrOneOf", () => {
    expect(
      matchFunctionZeroOrOneOf([<E3 rand={123} />]),
    ).toEqual(
      [<E3 rand={123} />],
    );
  });

  it("errors when given non-matching type for a function zeroOrOneOf", () => {
    expect(
      () => matchFunctionZeroOrOneOf([<E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 0 of 1.",
    );
  });

  it("errors when given more than one matching type for a function zeroOrOneOf", () => {
    expect(
      () => matchFunctionZeroOrOneOf([<E3 rand={123} />, <E3 rand={456} />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 1 of 2.",
    );
  });

  it("passes when given one of the various matching types for a zeroOrOneOf", () => {
    expect(
      matchMultipleZeroOrOneOf([]),
    ).toEqual(
      [undefined],
    );

    expect(
      matchMultipleZeroOrOneOf([<E1 />]),
    ).toEqual(
      [<E1 />],
    );

    expect(
      matchMultipleZeroOrOneOf([<E2 />]),
    ).toEqual(
      [<E2 />],
    );

    expect(
      matchMultipleZeroOrOneOf([<E3 rand={123} />]),
    ).toEqual(
      [<E3 rand={123} />],
    );
  });

  it("passes when looking for multiple zeroOrOneOf", () => {
    expect(
      matchManyZeroOrOneOf([<E1 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [<E1 />, <E2 />, <E3 rand={555} />],
    );

    expect(
      matchManyZeroOrOneOf([<E2 />, <E3 rand={555} />]),
    ).toEqual(
      [undefined, <E2 />, <E3 rand={555} />],
    );

    expect(
      matchManyZeroOrOneOf([<E1 />, <E3 rand={555} />]),
    ).toEqual(
      [<E1 />, undefined, <E3 rand={555} />],
    );

    expect(
      matchManyZeroOrOneOf([<E1 />, <E2 />]),
    ).toEqual(
      [<E1 />, <E2 />, undefined],
    );
  });

  it("errors when given out of order zeroOrOneOfs", () => {
    expect(
      () => matchManyZeroOrOneOf([<E1 />, <E3 rand={555} />, <E2 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 2 of 3.",
    );

    expect(
      () => matchManyZeroOrOneOf([<E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 2 of 3.",
    );
  });

  it("errors when passes too many for multiple zeroOrOneOfs", () => {
    expect(
      () => matchManyZeroOrOneOf([<E1 />, <E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );
  });
});
