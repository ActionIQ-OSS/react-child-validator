import * as React from "react";
import { oneOf, zeroOrOneOf, countOf, oneOrMoreOf, withMapper, ReactChildValidator, children } from "../src/";
import { E1, E2, E3, IPropsE3, ParentComponent } from "./components";

describe("mapper", () => {
  it("maps the correct children", () => {
    const mapped = new ReactChildValidator(
      ParentComponent,
      { value: 5 },
      [
        <E3 rand={1} />, // oneOf
        <E3 rand={2} />, // zeroOrOneOf
        <E3 rand={3} />, // countOf(2)
        <E3 rand={4} />, // countOf(2)
        <E3 rand={5} />, // oneOrMoreOf
        <E3 rand={6} />, // oneOrMoreOf
      ],
      children(
        oneOf(E3),
        withMapper(
          zeroOrOneOf(E3),
          (c, _) => React.cloneElement(c, { rand: 100 }),
        ),
        withMapper(
          countOf(2, E3),
          (c, _) => React.cloneElement(c, { rand: c.props.rand * 5 }),
        ),
        withMapper(
          oneOrMoreOf(E3),
          (c, _) => React.cloneElement(c, { rand: c.props.rand === _.value ? 99 : 55 }),
        ),
      ),
      true,
    ).matchChildren()

    const [oneOfE, zeroOrOneOfE, countOfE, oneOrMoreOfE] = mapped;

    expect(oneOfE.props.rand).toEqual(1); // rand didn't change
    expect(zeroOrOneOfE.props.rand).toEqual(100); // changed to hardcoded 100
    expect(countOfE[0].props.rand).toEqual(15); // changed by x5 initial rand
    expect(countOfE[1].props.rand).toEqual(20); // changed by x5 initial rand
    expect(oneOrMoreOfE[0].props.rand).toEqual(99); // changed by matching parent value
    expect(oneOrMoreOfE[1].props.rand).toEqual(55); // changed by not matching parent value
  });
});
