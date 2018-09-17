import * as React from "react";
const { mount, render } = require("enzyme");
import { oneOf, zeroOrMoreOf, BaseClass, children } from "../src/";

class Element1 extends BaseClass<any, any> {
  static displayName = "Element1";

  render() {
    return <div>Test1</div>;
  }
}

class Element2 extends BaseClass<any, any> {
  static displayName = "Element2";

  render() {
    return <div>Test2</div>;
  }
}

class Element3 extends BaseClass<any, any> {
  static displayName = "Element3";

  render() {
    return <div>Test3</div>;
  }
}

class Wrapper1 extends BaseClass<any, any, typeof Wrapper1> {
  static displayName = "Wrapper1";

  static propTypes = BaseClass.childValidatorProps(Wrapper1);

  static childGroups = children(
    oneOf(Element1),
    oneOf(Element2),
    zeroOrMoreOf(Element3, Element2),
  );

  render() {
    const [el1, el2, el3] = this.matchChildren();

    return (
      <div>
        {el1}
        {el2}
        <div>
          {el3.map((el, i: number) => (
            <span key={i}>
              {el}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

describe("BaseClass", () => {
  it("checks that a component's children are rendered properly", () => {
    expect(
      mount(
        <Wrapper1>
          <Element1 />
          <Element2 />
          <Element3 />
        </Wrapper1>,
      )
    ).toMatchSnapshot();

    expect(
      mount(
        <Wrapper1>
          <Element1 />
          <Element2 />
          <Element3 />
          <Element3 />
          <Element3 />
        </Wrapper1>,
      )
    ).toMatchSnapshot();

    expect(
      mount(
        <Wrapper1>
          <Element1 />
          <Element2 />
          <Element3 />
          <Element2 />
        </Wrapper1>,
      )
    ).toMatchSnapshot();
  });

  it("check that proptypes throw when children do not match", () => {
    Object.assign(global.console, { error: jest.fn() });

    mount(
      <Wrapper1>
        <Element1 />
      </Wrapper1>,
    );

    expect(console.error).toHaveBeenLastCalledWith(
      "Warning: Failed prop type: Too few children of type Element2 for <Wrapper1 />. Expected 1, Received: 0."
      + "\n    in Wrapper1",
    );
  });
})