# nexilis
A template language with first class support for nested components.

## Quickstart

```
npm install --save nexilis
```

```javascript
var nexilis = require("nexilis");

nexilis.addComponent({
    name: "hello-world",
    template: "<div>{{@greeting}}, {{@thing}}!</div>"
});

nexilis.render("hello-world", {
    greeting: "Hello",
    thing: "Nexilis"
});

// <div>Hello, Nexilis!</div>
```

## Template syntax
Nexilis expects templates to contain a subset of HTML that follows these rules:
- Self-closing tags should explicitly contain a `/>` at the end. For example `<img src="foobar.png">` will cause a compilation error. Instead you should use `<img src="foobar.png"/>`
- XML namespaces aren't really supported at the moment

There are six basic pieces of syntax:
- Text
- Scope Variables
- Elements
- Components
- Expressions
- Blocks

### Text
Text is the same as text content in HTML, except there can be Expressions interleaved in between bits of text.

```html
Hello World!
```

### Scope Variables
To differentiate between regular javascript variables in expressions and blocks and variables that are specific to the scope, Nexilis uses a special syntax using `@` signs in expressions.

For example, if your state contains a key called `foo`, you can reference it by using `@foo` in an expression. If you need to reference whatever is in the current scope directly, you can use `@` to get a reference to it directly. This is handy for iteration when the scope gets set to the item.

### Elements
Elements are the same as they would be in HTML, except you can have expressions in the attributes. For example you can have something like:

```html
<div class="something {{@someVariable}}"></div>
```

### Components
Elements that contain a dash `-` in the name, will be treated as Components. This is based off of the way the new [Custom Elements](http://webcomponents.org/articles/introduction-to-custom-elements/) spec works.

If a component hasn't been added with the given name, it will be treated as a regular element. This allows you to play nice with HTML custom elements.

Components can be defined by by using the `nexilis.addComponent(component)` method and passing in a name and template.

A component will contain its own template whose scope will be isolated from the parent. If you want to pass data into the component, you do so by specifying attributes.

You can also specify default data for a component's scope by specifying a `state` function upon definition.

#### State function
When defining a component you can specify a function called `state` which should return an object containing the default data to put into the scope. Attributes in the object will be accessible via `@attribute` calls in expressions, and attributes passed into the component by its parent will override the default values.

As you can see in the following example, we specify initial values for `something` and `someone` within `child-component`.  The `parent-component` component then renders the `child-component` component and overrides one of the default values within the child's scope.

```javascript
nexilis.addComponent({
  name: "child-component",
  state: function(){
    return {
      something : "Cool",
      someone: "Friend"
    }
  },
  template: "<div>Hey, that's {{@something}}, {{@someone}}</div>"
});

nexilis.addComponent({
  name: "parent-component"
  template: '<child-component something="Totally Laaaame"/>'
});

nexilis.render("parent-component");
```

```html
  <div>Hey, that's Totally Laaaame, Friend</div>
```

#### Attributes
Attributes can exist in one of three forms:

##### Name only
If you just specify the name for an attribute and don't have any content, then it'll be the same as specifying `name: true`. So if you say, have a custom button, and you want to apply a class to it dynamically, you might have something that looks like:

custom-button-template.html

```html
<button class="{{@isSpecial ? 'special-button' : ''}}">
    <content/>
</button>
```

main-template.html

```html
<custom-button isSpecial>
    Woot, I'm special!
</custom-button>
```

##### Text or text with expressions
If you specify attribute content with some text, or text interleaved with expressions, then the attribute will define a string.

In this example:

template.html

```html
<example-component attribute="text with {{@variable.toLowerCase()}}"/>
```

The attribute will make a variable that's defined by `attribute: "text with " + @variable.toLowerCase()`

##### Just an expression
Sometimes you want to pass in data structures that are more complex than just a string, for that use case, all you need to do is make sure that you specify just an expression and have that passed in directly.

For example, if you have a list that you want to pass into a component you might have something like this:

```javascript
nexilis.render("main-component", {
    people: [{name: "Alice"}, {name: "Bob"}]
});
```

```html
<contact-list contacts="{{@people}}"/>
```

**Note:** Even though you're just specifying an expression, you must still use quotation marks around it.

### Expressions
Custom logic within templating languages is often abstracted away to a small set of features like iteration or conditionals. Nexilis wants to provide you with all of JavaScript in order to have full flexibility in what you want to do. The only difference from standard JS is that there is special syntax for referencing scope variables (see above).

Expressions are bits of JavaScript within `{{ }}` curly braces. You can have any JavaScript you want within the expression, but note that things like `if` blocks or `for` loops won't work since an expression that looks like `{{ if(@foo) "bar"}}` will get rendered into a function that might look like `echo( if(scope.get(foo)) "bar" )` which isn't valid JavaScript and will cause an error during compilation. For those two use cases, it is recommended that you use blocks for these situations which are described below.

### Blocks
Blocks are used for applying special logic for chunks for the template. All blocks have a start that looks like `{{#name expression}}`, and a matching end that looks like `{{/name}}`.

There are three types of blocks:

#### if
If blocks let you conditionally render or skip a chunk of the template. Their syntax is pretty simple: Specify an expression which will get evaluated. If the expression is truthy, then the content of the block will get rendered. If it's falsy then it'll be skipped.

```html
{{#if (1 + 1) === "window"}}
    Nothing is real anymore
{{/if}}
```

#### each
Each blocks are used to iterate through arrays, or array-like objects. The expression in the opening tag should evaluate to a list which will then get iterate through. The content of the block will then be evaluated for each item in the list with the item being pushed to the scope.

```html
<dl>
{{#each Object.keys(@someobject)}}
    <dt>{{@}}</dt>
    <dd>{{@someobject[@]}}</dd>
{{/each}}
</dl>
```

#### with
With blocks are used for situations where you want a shortcut for referencing properties. The expression should evaluate to some sort of object which will then be pushed onto the scope while the content gets rendered.

```javascript
data = {
    name: "Profile"
    person: {
        name: "Francine",
        image: "cats.png"
    }
}
```

```html
{{@name}}
{{#with @person}}
    Username: {{@name}}
    Image: {{@image}}
{{/with}}
```

### Fancy patterns
Nexilis tries to give you a minimal feature set, but make it powerful enough to allow you to do fancy things on top of it.

#### Helper Functions
Other frameworks often provide features called `helpers` or `filters` which exist to augment data within your scope by passing it through some sort of transformation. Rather than having these functions be a part of the syntax of Nexilis, it is instead advised to take advantage of the `state` function that you can pass into components. Say you want to format a given data using [moment](http://momentjs.com/). All you'd need to do to integrate it into your workflow is define it as part of the initial state.

For example:

timeState.js

```javascript
module.exports = function state(){
  return {
    moment: require("moment"),
    timestamp: null
  }
};
```

timeTemplate.html

```html
<span>The time is: {{@moment(@timestamp || Date()).format("HH : mm : ss")}}</span>
```

main.js

```javascript
nexilis.addComponent({
  name: "time-component",
  state: require("./timeState"),
  template: fs.readFileSync("timeTemplate.html")
});

nexilis.render("time-component");

// <span>The time is: 12 : 00 : 00</span>

nexilis.render("time-component", {
  timestamp: "Thu Sep 17 2015 19:05:42 GMT-0400 (Eastern Daylight Time)"
});

// <span>The time is: 19 : 05 : 42</span>
```

As you can see, since we have all of JavaScript at our fingertips, we were able to just put momentjs in as variable in the component's internal scope. In the template we then called momentJS and either used the `timestamp` passed into the component, or whatever the current time was at the time of rendering.

Using this pattern can allow you to share common functions for formatting between different components and easily support rich rendering abilities like localization or formatting.

## API
### `Nexilis(builder)`
This creates a new instance of Nexilis using a custom builder function which will be used to build the renderer.

To get a reference to this class use the following code:

```javascript
var Nexilis = require("nexilis").Nexilis;

// or

var Nexilis = require("nexilis/lib/nexilis");
```

The difference between the two is that the first one also requires in the default string builder function so requiring the Nexilis class directly can save you some bytes in your package.

Details on how the builder should work will be in the wiki

### `nexilis.addComponent(component)`
This defines a new component in the given Nexilis instance. `component` should be an object that contains the following fields:
- `name` [Required]: This is the name for the component. The name should contain text with at least one `-` in it. No other validation is done right out of the box, so keep in mind that you can assign names that won't be parse-able from a template. Un-parseable components will still be available in the `render` function.
- `template` [Required if `render` is missing]: This is the template string that should be parsed out into the render function for this component. If you have syntax errors in your template, an error will be thrown upon compilation.
- `render` [Required if `template` is missing]: This is the pre-compiled render function that should be used with this component. This allows you to build up a workflow where you pre-compile your templates before they get sent to the client-side, or just pre-compile them to speed up your server startup.
- `state` [Optional]: This is a function which should return an object to use as the default data for the scope of the template. Keep in mind that this will be called every time a render is made, so try not to put any heavy computation in it, and define as much as you can outside the function.

### `nexilis.render(name, data)`
This is what you call whenever you want to render what will be the top level component in your view. Since Nexilis is all about components, there isn't a way to render just a raw template, and everything is required to be defined as a component for it to be used.
- `name` [Required]: This is the name of the component that should be rendered. Make sure that you've defined the component before rendering.
- `data` [Optional]: This is an object which is the data that should be passed into the scope of the component when it gets rendered. Any keys defined in here will be useable within expressions in the component and will override any defaults defined in the component's `state` function.

## Roadmap
- [x] Create overall structure for syntax, components and rendering
- [x] String renderer
- [ ] Create CLI utility for pre-compiling templates
- [ ] Define folder structure for components
- [ ] Add way to compile folders into component definitions to CLI
- [ ] Virtual-Dom renderer
- [ ] Incremental-Dom renderer
