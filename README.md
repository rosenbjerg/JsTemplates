# JsTemplates

Simple templating engine in pure JavaScript

Loading the library creates a global variable named JsT, unless used with module loaders like RequireJs.
Templates can then be created using one of the four functions on the JsT object:

### Functions
`JsT.load(domElement)` creates a templates from the innerHTML of the passed DOM element

`JsT.loadFromId(id)` creates a template from the innerHTML of the element with the given id

`JsT.get(url [,callback])` creates a templates from the html fetched using a get request to the given url.
Passing a callback function as second parameter will make the request async, and the loaded template will be
passed as first parameter to the callback function.

`JsT.create(html)` creates a template from the html passed as parameter

### Syntax
Variables are wrapped in double curly braces: `{{variable}}`

They can have default values too: `{{variable = Default value..}}`


#### Example with template element with id:
Html:
```
<template id="testTemplate">
    <h4>Welcome {{username}}</h4>
    <input type="email" value="{{email}}">
    <p>You have: {{messages = no new messages}}</p>
</template>
```
JavaScript:
```
let template = JsT.loadById("testTemplate");
document.body.innerHTML += template.render({
    username: "JohnDoe",
    email: "john@localhost",
    messages: "2 new messages"
});
```
