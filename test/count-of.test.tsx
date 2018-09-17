import * as React from "react";
import { countOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const matchBasicCountOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOf(count, E1),
    ],
    true,
  ).matchChildren();
}

const matchFunctionCountOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOf(count, c => c.props.rand !== undefined),
    ],
    true
  ).matchChildren();
}

const matchMultipleCountOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOf(count, E1, E2, E3),
    ],
    true,
  ).matchChildren();
}

const matchManyCountOf = (count1: number, count2: number, count3: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOf(count1, E1),
      countOf(count2, E2),
      countOf(count3, E3),
    ],
    true,
  ).matchChildren();
}

describe("countOf", () => {
  it("errors when given 0 for a basic countOf", () => {
    expect(
      () => matchBasicCountOf(3, []),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 3, Received: 0.",
    );
  });

  it("passes when given 1 for a basic countOf", () => {
    expect(
      matchBasicCountOf(1, [<E1 />]),
    ).toEqual(
      [<E1 />],
    );
  });

  it("passes when given 3 for a basic countOf", () => {
    expect(
      matchBasicCountOf(3, [<E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />]],
    );
  });

  it("errors when given wrong type for a basic countOf", () => {
    expect(
      () => matchBasicCountOf(1, [<E2 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when given wrong count for a basic countOf", () => {
    expect(
      () => matchBasicCountOf(3, [<E1 />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 3, Received: 2.",
    );

    expect(
      () => matchBasicCountOf(3, [<E1 />, <E1 />, <E1 />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );
  });

  it("errors when given 0 for a function countOf", () => {
    expect(
      () => matchFunctionCountOf(3, []),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected 3, Received: 0.",
    );
  });

  it("passes when given 1 for a function countOf", () => {
    expect(
      matchFunctionCountOf(1, [<E3 rand={123} />]),
    ).toEqual(
      [<E3 rand={123} />],
    );
  });

  it("passes when given 3 for a function countOf", () => {
    expect(
      matchFunctionCountOf(3, [<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]),
    ).toEqual(
      [[<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]],
    );
  });

  it("errors when given non-matching type for a function countOf", () => {
    expect(
      () => matchFunctionCountOf(1, [<E1 />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E1 />.",
    );
  });

  it("passes when given one of the various matching types for a countOf", () => {
    expect(
      matchMultipleCountOf(1, [<E1 />]),
    ).toEqual(
      [<E1 />],
    );

    expect(
      matchMultipleCountOf(1, [<E2 />]),
    ).toEqual(
      [<E2 />],
    );

    expect(
      matchMultipleCountOf(1, [<E3 rand={123} />]),
    ).toEqual(
      [<E3 rand={123} />],
    );
  });

  it("passes when given many of the various matching types for a countOf", () => {
    expect(
      matchMultipleCountOf(3, [<E1 />, <E2 />, <E2 />]),
    ).toEqual(
      [[<E1 />, <E2 />, <E2 />]],
    );

    expect(
      matchMultipleCountOf(3, [<E2 />, <E1 />, <E2 />]),
    ).toEqual(
      [[<E2 />, <E1 />, <E2 />]],
    );

    expect(
      matchMultipleCountOf(2, [<E3 rand={123} />, <E1 />]),
    ).toEqual(
      [[<E3 rand={123} />, <E1 />]],
    );
  });

  it("passes when looking for multiple countOf", () => {
    expect(
      matchManyCountOf(1, 1, 1, [<E1 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [<E1 />, <E2 />, <E3 rand={555} />],
    );

    expect(
      matchManyCountOf(
        1, 2, 3,
        [<E1 />, <E2 />, <E2 />, <E3 rand={555} />, <E3 rand={555} />, <E3 rand={555} />]),
    ).toEqual(
      [<E1 />, [<E2 />, <E2 />], [<E3 rand={555} />, <E3 rand={555} />, <E3 rand={555} />]],
    );
  });

  it("errors when given out of order countOfs", () => {
    expect(
      () => matchManyCountOf(1, 1, 1, [<E1 />, <E3 rand={555} />, <E2 />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E3 rand={555} />.",
    );

    expect(
      () => matchManyCountOf(1, 1, 1, [<E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when passes too many for multiple countOfs", () => {
    expect(
      () => matchManyCountOf(1, 1, 1, [<E1 />, <E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );
  });

  it("errors when passes not enough for multiple countOfs", () => {
    expect(
      () => matchManyCountOf(2, 3, 2, [<E1 />, <E1 />, <E2 />, <E3 rand={555} />, <E3 rand={555} />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected 3, Received: 1. Failed validation on <E3 rand={555} />.",
    );
  });
});
