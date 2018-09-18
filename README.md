## react-child-validator
Validates and matches a React component's children at runtime against a specified configuration.

### Why?
Read more about why we build this here: https://medium.com/actioniq-tech/who-are-my-children-8b6b27da57ce

### Install
```
$ npm install --save react-child-validator
```


### Usage
#### Extending the BaseClass
Internally at AIQ we the BaseClass for all of our components. This allows us to easily add in child validation when needed. Using the base class has two options for validation:
##### 1. at prop checking time by using
```
static propTypes = BaseClass.childValidatorProps(ComponentClass);
```
This will issue a warning to your console if the children do not match. We recommend using this when you do not want to use `matchChildren` within your render function.

##### 2. at render time using `this.matchChildren()`. This is similar to the `Adhoc` method below but abstracts away some of the code.
```
class Example extends BaseClass<undefined, undefined> {
  static displayName = "Example";

  static propTypes = BaseClass.childValidatorProps(Example);

  static childGroups = [
    oneOf(SomeComponent),
    oneOf("div"),
    withMapper(
      zeroOrMoreOf(AnotherComponent),
      c => React.cloneElement(c, { customProp: true }),
    ),
  ];

  render() {
    const [someComponent, aDiv, anotherComponents] = this.matchChildren();

    return (
      <div>
        {someComponent}
        {aDiv}
        <div>
          {anotherComponents.map((anotherComponent, i) => (
            <span key={i}>
              {anotherComponent}
            </span>
          ))}
        </div>
      </div>
    );
  }
}
```

#### Adhoc
You can also use this adhoc within your render method similarly to how our tests are run:
```
const [header, body, footer] = new MatchChildren(
    TheComponent,
    this.props,
    React.Child.toArray(this.props.children),
    [
      withMapper(
        oneOf(Header),
        mapper: (c, props) => ...
      ),
      ....
    ],
    true, // should throw error
    false, // do not skip mapping
  ).matchChildren()
```

#### Defining child types
The `MatchChildren` class requires an array of `IChildGroup` to be passed and used for validating. You can use one of many of the utility functions to create an `IChildGroup` with a properly defined min and max.
```
[
  zeroOrOneOf(Header),
  oneOf(Body),
  zeroOrOneOf(Footer),
]
```
The above would match again children within a component and look for an optional Header, a required Body, and an optional Footer. Calling `matchChildren` would return an array typed as:
```
[Header | undefined, Body, Footer | undefined]
```
and if that could not be matched will throw an error.

You may also match via a matcher function instead of an explicit component
```
[
  oneOrMoreOf(c => c.props.color !== undefined)
]
```
This will match on any component that has a `color` property that is not undefined. 

Once matched, you can provide a mapper function to be applied to each match child. For instance:
```
[
  withMapper(
    oneOrMoreOf(Tab),
    (c, p) => React.cloneElement(c, {
      isSelected: c.props.value === p.selectedValue
    }),
  )
]
```
When you execute `matchChildren` with the above matcher you'll be returned all the `Tab`s with their `isSelected` property updated based on the logic above.

### API
#### `MatchChildren`
Wrapper class for all validation. Exposes a `matchChildren` method to verify all children again the configuration. Requires:
```
componentClass: HasDisplayName, # the component itself
props: Object, # the props of the parent component
children: React.ReactChild[], # children of the component
groups: IChildGroup[], # group definitions for matching
throwError: boolean = false, # if errors should be thrown or skipped
skipMapper: boolean = false # if mapping should happen or be skipped
```

#### `IChildGroup`
Defines a group of children to validate against. Contains a list of `SingleChildType` (components and/or functions) to match against as well as a `min` (number) and `max` (number | undefined) of children to expect. An undefined max means infinitely many.

#### `zeroOrOneOf(...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=0` and `max=1`

#### `zeroOrMoreOf(...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=0` and `max=undefined`

#### `oneOf(...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=1` and `max=1`

#### `oneOrMoreOf(...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=1` and `max=undefined`

#### `countOf(count, ...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=count` and `max=count`

#### `countOrMoreOf(count, ...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=count` and `max=undefined`

#### `countOrLessOf(count, ...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=0` and `max=count`

#### `countBetweenOf(min, max, ...args: SingleChildType[])`
Utility to generate an `IChildGroup` with `min=min` and `max=max`

#### `withMapper(group: IChildGroup, mapper: Mapper)`
Utility to apply a `mapper` to an `IChildGroup`
