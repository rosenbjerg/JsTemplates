# JsTemplates

Simple templating engine in pure JavaScript

Loading the library creates a global variable named JsT, unless used with module loaders like RequireJs.
Templates can then be created using one of the four functions on the JsT object:


### Syntax
Variables are wrapped in double curly braces: `{{variable}}`

They can have default values too: `{{variable=Default value..}}`
White-space is ignored, so `{{  variable  =Default value.. }}` will also be accepted.


### Functions
* `JsT.load(domElement)` creates a templates from the innerHTML of the passed DOM element

* `JsT.loadFromId(id)` creates a template from the innerHTML of the element with the given id

* `JsT.get(url [,callback])` creates a templates from the html fetched using a get request to the given url.
Passing a callback function as second parameter will make the request async, and the loaded template will be
passed as first parameter to the callback function

* `JsT.create(html)` creates a template from the html passed as parameter

All of these functions return a JsTemplate object which has two functions:

* `render(renderParameterObj)` renders the template using the passed parameter object

* `getDefaults()` returns the variables and their default values found in the template. Only really useful for debugging

* `setFormatter(targetVariables, formatter)` sets the formatter function for one or more variable names. 
The `variables` parameter can be a string with the name of the variable it targets, or an array of strings


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
