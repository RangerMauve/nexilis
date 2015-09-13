# lignum
A template language with first class support for nested components.

**THIS HAS NOT YET BEEN RELEASED ON NPM**

## Quickstart

```
npm install --save lignum
```

```javascript
var lignum = require("lignum");

lignum.addComponent({
    name: "hello-world",
    template: "<div>{{@greeting}}, {{@thing}}!</div>"
});

lignum.render("hello-world", {
    greeting: "Hello",
    thing: "Lignum"
});

// <div>Hello, Lignum!</div>
```

## Template syntax
Lignum expects templates to contain a subset of HTML that follows these rules:
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

### Scope Variables
To differentiate between regular javascript variables in expressions and blocks and variables that are specific to the scope, Lignum uses a special syntax using `@` signs in expressions.

For example, if your state contains a key called `foo`, you can reference it by using `@foo` in an expression. If you need to reference whatever is in the current scope directly, you can use `@` to get a reference to it directly. This is handy for iteration when the scope gets set to the item.

### Elements
Elements are the same as they would be in HTML, except you can have expressions in the attributes. For example you can have something like:

```html
<div class="something {{@someVariable}}"></div>
```

### Components
Elements that contain a dash `-` in the name, will be treated as Components.

If a component hasn't been added with the given name, it will be treated as a regular element. This allows you to play nice with HTML custom elements.

Components can be defined by by using the `lignum.addComponent(component)` method and passing in a name and template.

A component will contain its own template whose scope will be isolated from the parent. If you want to pass data into the component, you do so by specifying attributes.

### Attributes
Attributes can exist in one of tree forms:

#### Name only
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

#### Text or text with expressions
If you specify attribute content with some text, or text interleaved with expressions, then the attribute will define a string.

In this example:

template.html

```html
<example-component attribute="text with {{@variable.toLowerCase()}}"/>
```

The attribute will make a variable that's defined by `attribute: "text with " + @variable.toLowerCase()`

#### Just an expression
Sometimes you want to pass in data structures that are more complex than just a string, for that use case, all you need to do is make sure that you specify just an expression and have that passed in directly.

For example, if you have a list that you want to pass into a component you might have something like this:

```javascript
lignum.render("main-component", {
    people: [{name: "Alice"}, {name: "Bob"}]
});
```

```html
<contact-list contacts="{{@people}}"/>
```

**Note:** Even though you're just specifying an expression, you must still use quotation marks around it.

### Expressions
Custom logic within templating languages is often abstracted away to a small set of features like iteration or conditionals. Lignum wants to provide you with all of JavaScript in order to have full flexibility in what you want to do. The only difference from standard JS is that there is special syntax for referencing scope variables (see above).

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

## Roadmap
- [x] Create overall structure for syntax, components and rendering
- [x] String renderer
- [ ] Create CLI utility for pre-compiling templates
- [ ] Define folder structure for components
- [ ] Add way to compile folders into component definitions to CLI
- [ ] Virtual-Dom renderer
- [ ] Incremental-Dom renderer
