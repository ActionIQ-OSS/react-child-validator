import * as React from "react";
import { countBetweenOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const matchBasicCountBetweenOf = (min: number, max: number | undefined, children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countBetweenOf(min, max, E1)
    ],
    true,
  ).matchChildren();
}

describe("countBetweenOf", () => {
  it("passes when given 0 for a basic countBetweenOf", () => {
    expect(
      matchBasicCountBetweenOf(0, 1, []),
    ).toEqual(
      [undefined],
    );
  });

  it("passes when given 2, 3, 4, 5 for a 2 to 5 basic countBetweenOf", () => {
    expect(
      matchBasicCountBetweenOf(2, 5, [<E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />]],
    );

    expect(
      matchBasicCountBetweenOf(2, 5, [<E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />]],
    );

    expect(
      matchBasicCountBetweenOf(2, 5, [<E1 />, <E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />, <E1 />]],
    );

    expect(
      matchBasicCountBetweenOf(2, 5, [<E1 />, <E1 />, <E1 />, <E1 />, <E1 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />, <E1 />, <E1 />]],
    );
  });

  it("errors when given 1 for a 2 to 5 basic countBetweenOf", () => {
    expect(
      () => matchBasicCountBetweenOf(2, 5, [<E1 />]),
    ).toThrow(
      "Too few children of type E1 for <ParentComponent />. Expected between [2, 5], Received: 1.",
    );
  });

  it("errors when given 6 for a 2 to 5 basic countBetweenOf", () => {
    expect(
      () => matchBasicCountBetweenOf(2, 5, [<E1 />, <E1 />, <E1 />, <E1 />, <E1 />, <E1 />]),
    ).toThrow(
      "Too many children passed to <ParentComponent />. Matched 5 of 6",
    );
  });
});
