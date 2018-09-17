import * as React from "react";
import { countOrLessOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const matchBasicCountOrLessOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrLessOf(count, E1),
    ],
    true,
  ).matchChildren();
}

const matchFunctionCountOrLessOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrLessOf(count, c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const matchMultipleCountOrLessOf = (count: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrLessOf(count, E1, E2, E3),
    ],
    true,
  ).matchChildren();
}

const matchManyCountOrLessOf = (count1: number, count2: number, count3: number, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrLessOf(count1, E1),
      countOrLessOf(count2, E2),
      countOrLessOf(count3, E3),
    ],
    true,
  ).matchChildren();
}

describe("countOrLessOf", () => {
  it("passes when given 0 for a basic countOrLessOf", () => {
    expect(
      matchBasicCountOrLessOf(2, []),
    ).toEqual(
      [[]],
    );
  });

  it("passes when given 1 for a 1 basic countOrLessOf", () => {
    expect(
      matchBasicCountOrLessOf(1, [<E1 />]),
    ).toEqual(
      [<E1 />],
    );
  });

  it("passes when given 1 for a 2 basic countOrLessOf", () => {
    expect(
      matchBasicCountOrLessOf(2, [<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );
  });

  it("errors when given 3 for a 2 basic countOrLessOf", () => {
    expect(
      () => matchBasicCountOrLessOf(2, [<E1 />, <E1 />, <E1 />]),
    ).toThrow(
      "Too many children passed to <ParentComponent />. Matched 2 of 3.",
    );
  });

  it("passes when given 0 for a function countOrLessOf", () => {
    expect(
      matchFunctionCountOrLessOf(2, []),
    ).toEqual(
      [[]],
    );
  });

  it("passes when given one of the various matching types for a countOrLessOf", () => {
    expect(
      matchMultipleCountOrLessOf(1, [<E1 />]),
    ).toEqual(
      [<E1 />],
    );

    expect(
      matchMultipleCountOrLessOf(1, [<E2 />]),
    ).toEqual(
      [<E2 />],
    );

    expect(
      matchMultipleCountOrLessOf(1, [<E3 rand={123} />]),
    ).toEqual(
      [<E3 rand={123} />],
    );

    expect(
      matchMultipleCountOrLessOf(2, [<E1 />]),
    ).toEqual(
      [[<E1 />]],
    );

    expect(
      matchMultipleCountOrLessOf(3, [<E1 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E3 rand={123} />]],
    );

    expect(
      matchMultipleCountOrLessOf(4, [<E1 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E3 rand={123} />]],
    );
  });

  it("passes when looking for multiple countOrLessOf", () => {
    expect(
      matchManyCountOrLessOf(1, 1, 1, [<E1 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [<E1 />, <E2 />, <E3 rand={555} />],
    );
  });

  it("passes when looking for multiple groups of countOrLessOf", () => {
    expect(
      matchManyCountOrLessOf(2, 3, 1, [<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], <E3 rand={555} />],
    );

    expect(
      matchManyCountOrLessOf(5, 5, 5, [<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], [<E3 rand={555} />]],
    );

    expect(
      matchManyCountOrLessOf(22, 22, 22, [<E1 />, <E1 />, <E2 />, <E2 />, <E2 />, <E3 rand={555} />]),
    ).toEqual(
      [[<E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], [<E3 rand={555} />]],
    );
  });

  it("errors when given out of order countOrLessOfs", () => {
    expect(
      () => matchManyCountOrLessOf(2, 2, 2, [<E1 />, <E1 />, <E3 rand={555} />, <E2 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );

    expect(
      () => matchManyCountOrLessOf(2, 2, 2, [<E2 />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 2 of 3.",
    );
  });

  it("errors when passes too many for multiple countOrLessOfs", () => {
    expect(
      () => matchManyCountOrLessOf(
        3, 3, 3,
        [<E1 />, <E1 />, <E2 />, <E2 />, <E3 rand={555} />, <E3 rand={555} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 6 of 7",
    );
  });
});
