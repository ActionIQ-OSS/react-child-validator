import * as React from "react";
import { countOrMoreOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const matchBasicCountOrMoreOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrMoreOf(count, E1),
    ],
    true,
  ).matchChildren();
}

const matchFunctionCountOrMoreOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrMoreOf(count, c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const matchMultipleCountOrMoreOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrMoreOf(count, E1, E2, E3),
    ],
    true,
  ).matchChildren();
}

const matchManyCountOrMoreOf = (count1: number, count2: number, count3: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrMoreOf(count1, E1),
      countOrMoreOf(count2, E2),
      countOrMoreOf(count3, E3),
    ],
    true,
  ).matchChildren();
}

describe("countOrMoreOf", () => {
  it("errors when given 0 for a basic countOrMoreOf", () => {
    expect(
      () => matchBasicCountOrMoreOf(2, []),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 2, Received: 0.",
    );
  });

  it("passes when given 1 for a 1 basic countOrMoreOf", () => {
    expect(
      matchBasicCountOrMoreOf(1, [<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );
  });

  it("passes when given 2 for a 2 basic countOrMoreOf", () => {
    expect(
      matchBasicCountOrMoreOf(2, [<E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />]],
    );
  });

  it("passes when given 3 for a 2 basic countOrMoreOf", () => {
    expect(
      matchBasicCountOrMoreOf(2, [<E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />]],
    );
  });

  it("passes when given a bunch for a basic countOrMoreOf", () => {
    expect(
      matchBasicCountOrMoreOf(2, [<E1 />, <E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />, <E1 />]],
    );
  });

  it("errors when given wrong type for a basic countOrMoreOf", () => {
    expect(
      () => matchBasicCountOrMoreOf(2, [<E2 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 2, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when given 0 for a function countOrMoreOf", () => {
    expect(
      () => matchFunctionCountOrMoreOf(2, []),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected at least 2, Received: 0.",
    );
  });

  it("passes when given 1 for a function countOrMoreOf", () => {
    expect(
      matchFunctionCountOrMoreOf(1, [<E3 rand={123} />]),
    ).toEqual(
      [[<E3 rand={123} />]],
    );
  });

  it("passes when given a bunch for a function countOrMoreOf", () => {
    expect(
      matchFunctionCountOrMoreOf(2, [<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]),
    ).toEqual(
      [[<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]],
    );
  });

  it("errors when given non-matching type for a function countOrMoreOf", () => {
    expect(
      () => matchFunctionCountOrMoreOf(3, [<E1 />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected at least 3, Received: 0. Failed validation on <E1 />.",
    );
  });

  it("passes when given one of the various matching types for a countOrMoreOf", () => {
    expect(
      matchMultipleCountOrMoreOf(1, [<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );

    expect(
      matchMultipleCountOrMoreOf(1, [<E2 />]),
    ).toEqual(
      [[<E2 />]],
    );

    expect(
      matchMultipleCountOrMoreOf(1, [<E3 rand={123} />]),
    ).toEqual(
      [[<E3 rand={123} />]],
    );

    expect(
      matchMultipleCountOrMoreOf(2, [<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]],
    );

    expect(
      matchMultipleCountOrMoreOf(3, [<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]],
    );

    expect(
      matchMultipleCountOrMoreOf(4, [<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E2 />, <E2 />, <E1 />, <E3 rand={123} />]],
    );
  });

  it("passes when looking for multiple countOrMoreOf", () => {
    expect(
      matchManyCountOrMoreOf(1, 1, 1, [<E1 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />], [<E2 />], [<E3 rand={555} />]],
    );
  });

  it("passes when looking for multiple groups of countOrMoreOf", () => {
    expect(
      matchManyCountOrMoreOf(1, 2, 1, [<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], [<E3 rand={555} />]],
    );

    expect(
      matchManyCountOrMoreOf(1, 1, 1, [<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], [<E3 rand={555} />]],
    );

    expect(
      matchManyCountOrMoreOf(2, 3, 1, [<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], [<E3 rand={555} />]],
    );
  });

  it("errors when given out of order countOrMoreOfs", () => {
    expect(
      () => matchManyCountOrMoreOf(2, 2, 2, [<E1 />, <E1 />, <E3 rand={555} />, <E2 />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected at least 2, Received: 0. Failed validation on <E3 rand={555} />.",
    );

    expect(
      () => matchManyCountOrMoreOf(2, 2, 2, [<E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 2, Received: 0. Failed validation on <E2 />.",
    );
  });

  it("errors when passes too many for multiple countOrMoreOfs", () => {
    expect(
      () => matchManyCountOrMoreOf(
        2, 2, 2,
        [<E1 />, <E1 />, <E2 />, <E2 />, <E3 rand={555} />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 6 of 7",
    );
  });
});
