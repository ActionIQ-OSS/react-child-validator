import * as React from "react";

export class E1 extends React.Component<any, any> {
  static displayName = "E1";

  render() {
    return <div>E1</div>;
  }
}

export class E2 extends React.Component<any, any> {
  static displayName = "E2";

  render() {
    return <div>E2</div>;
  }
}

export interface IPropsE3 {
  rand: number;
}

export class E3 extends React.Component<IPropsE3, any> {
  static displayName = "E3";

  render() {
    return <div>E3: {this.props.rand}</div>;
  }
}

export class E4 extends React.Component<any, any> {
  static displayName = "E4";

  render() {
    return <div>E4</div>;
  }
}

interface IPropsParent {
  value?: number;
}

export class ParentComponent extends React.Component<IPropsParent, any> {
  static displayName = "ParentComponent";

  render() {
    return <div>ParentComponent</div>;
  }
}