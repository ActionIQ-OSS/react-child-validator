import * as React from "react";
import { zeroOrOneOf, zeroOrMoreOf, oneOf, oneOrMoreOf, countOf, countOrMoreOf, ReactChildValidator, ReactChild } from "../src/";
import { E1, E2, E3, ParentComponent } from "./components";

const mixedOne = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrOneOf(E1),
      oneOf(E2),
      countOrMoreOf(2, c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const mixedTwo = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOrMoreOf(3, E1),
      oneOrMoreOf(E2),
      zeroOrMoreOf(c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const mixedThree = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      countOf(3, E1),
      oneOf(E2),
      countOf(2, c => c.props.rand !== undefined),
    ],
    true,
  ).matchChildren();
}

const mixedInvalid = (children: ReactChild[]) => {
  return new ReactChildValidator(
    ParentComponent,
    { },
    children,
    [
      zeroOrMoreOf(E1),
      oneOf(E1),
    ],
    true,
  ).matchChildren();
}

describe("mixed count validation", () => {
  it("mix one errors", () => {
    expect(
      () => mixedOne([]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected 1, Received: 0.",
    );

    expect(
      () => mixedOne([<E2 />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected at least 2, Received: 0.",
    );

    expect(
      () => mixedOne([<E1 />, <E2 />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected at least 2, Received: 0.",
    );

    expect(
      () => mixedOne([<E3 rand={123} />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E3 rand={123} />.",
    );

    expect(
      () => mixedOne([<E1 />, <E2 />, <E3 rand={123} />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected at least 2, Received: 1.",
    );

    expect(
      () => mixedOne([<E1 />, <E2 />, <E3 rand={123} />, <E3 rand={456} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 4 of 5.",
    );

    expect(
      () => mixedOne([<E2 />, <E3 rand={123} />, <E3 rand={456} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 3 of 4.",
    );
  });

  it("mix one passes", () => {
    expect(
      mixedOne([<E1 />, <E2 />, <E3 rand={123} />, <E3 rand={456} />]),
    ).toEqual(
      [<E1 />, <E2 />, [<E3 rand={123} />, <E3 rand={456} />]],
    );

    expect(
      mixedOne([<E2 />, <E3 rand={123} />, <E3 rand={456} />]),
    ).toEqual(
      [undefined, <E2 />, [<E3 rand={123} />, <E3 rand={456} />]],
    );

    expect(
      mixedOne([<E1 />, <E2 />, <E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]),
    ).toEqual(
      [<E1 />, <E2 />, [<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]],
    );

    expect(
      mixedOne([<E2 />, <E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]),
    ).toEqual(
      [undefined, <E2 />, [<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />]],
    );

    expect(
      mixedOne([<E1 />, <E2 />, <E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />, <E3 rand={252} />]),
    ).toEqual(
      [<E1 />, <E2 />, [<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />, <E3 rand={252} />]],
    );

    expect(
      mixedOne([<E2 />, <E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />, <E3 rand={252} />]),
    ).toEqual(
      [undefined, <E2 />, [<E3 rand={123} />, <E3 rand={456} />, <E3 rand={789} />, <E3 rand={252} />]],
    );
  });

  it("mix two errors", () => {
    expect(
      () => mixedTwo([]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 3, Received: 0.",
    );

    expect(
      () => mixedTwo([<E1 />, <E2 />, <E3 rand={123} />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected at least 3, Received: 1. Failed validation on <E2 />.",
    );

    expect(
      () => mixedTwo([<E1 />, <E1 />, <E1 />, <E3 rand={123} />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected at least 1, Received: 0. Failed validation on <E3 rand={123} />.",
    );
  });

  it("mix two passes", () => {
    expect(
      mixedTwo([<E1 />, <E1 />, <E1 />, <E2 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />], [<E2 />], []],
    );

    expect(
      mixedTwo([<E1 />, <E1 />, <E1 />, <E1 />, <E2 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />, <E1 />], [<E2 />], []],
    );

    expect(
      mixedTwo([<E1 />, <E1 />, <E1 />, <E2 />, <E2 />, <E2 />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />], [<E2 />, <E2 />, <E2 />], []],
    );

    expect(
      mixedTwo([<E1 />, <E1 />, <E1 />, <E2 />, <E3 rand={123} />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />], [<E2 />], [<E3 rand={123} />]],
    );

    expect(
      mixedTwo([<E1 />, <E1 />, <E1 />, <E2 />, <E3 rand={123} />, <E3 rand={456} />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />], [<E2 />], [<E3 rand={123} />, <E3 rand={456} />]],
    );
  });

  it("mix three errors", () => {
    expect(
      () => mixedThree([]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 3, Received: 0.",
    );

    expect(
      () => mixedThree([<E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 3, Received: 1.",
    );

    expect(
      () => mixedThree([<E2 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 3, Received: 0. Failed validation on <E2 />.",
    );

    expect(
      () => mixedThree([<E1 />, <E2 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 3, Received: 1. Failed validation on <E2 />.",
    );

    expect(
      () => mixedThree([<E1 />, <E1 />, <E1 />, <E2 />, <E2 />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected 2, Received: 0. Failed validation on <E2 />.",
    );

    expect(
      () => mixedThree([<E1 />, <E1 />, <E1 />, <E3 rand={123} />]),
    ).toThrowError(
      "Too few children of type E2 for <ParentComponent />. Expected 1, Received: 0. Failed validation on <E3 rand={123} />.",
    );

    expect(
      () => mixedThree([<E1 />, <E1 />, <E1 />, <E2 />, <E3 rand={456} />]),
    ).toThrowError(
      "Too few children of type c => c.props.rand !== undefined for <ParentComponent />. Expected 2, Received: 1.",
    );

    expect(
      () => mixedThree([<E1 />, <E1 />, <E1 />, <E2 />, <E3 rand={123} />, <E3 rand={456} />, <E1 />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 6 of 7",
    );

    expect(
      () => mixedThree([<E1 />, <E1 />, <E1 />, <E2 />, <E3 rand={1} />, <E3 rand={2} />, <E3 rand={3} />]),
    ).toThrowError(
      "Too many children passed to <ParentComponent />. Matched 6 of 7",
    );
  });

  it("mix three passes", () => {
    expect(
      mixedThree([<E1 />, <E1 />, <E1 />, <E2 />, <E3 rand={123} />, <E3 rand={456} />]),
    ).toEqual(
      [[<E1 />, <E1 />, <E1 />], <E2 />, [<E3 rand={123} />, <E3 rand={456} />]],
    );
  });

  it("invalid mix errors", () => {
    // first match always greedily takes all the E1s
    expect(
      () => mixedInvalid([<E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0.",
    );

    expect(
      () => mixedInvalid([<E1 />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0.",
    );
    
    expect(
      () => mixedInvalid([<E1 />, <E1 />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0.",
    );
    
    expect(
      () => mixedInvalid([<E1 />, <E1 />, <E1 />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0.",
    );
    
    expect(
      () => mixedInvalid([<E1 />, <E1 />, <E1 />, <E1 />, <E1 />]),
    ).toThrowError(
      "Too few children of type E1 for <ParentComponent />. Expected 1, Received: 0.",
    );
  });
});
