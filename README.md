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

* `JsT.loadFromId(id [,removeAfterLoad])` creates a template from the innerHTML of the element with the given id. 
Removes the HTMLElement from its parent if `true` is passed as second parameter

* `JsT.get(url, callback)` loads the content of the given url and parses it as html.
All template elements, that has an id, are then selected and a JsTemplate are created from each. 
The collection of JsTemplates are then returned as an object with a property based on the id of each of the template elements. (See example)

* `JsT.create(html)` creates a template from the html passed as parameter

All of these functions return a JsTemplate object which has two functions:

* `render(renderParameterObj)` renders the template using the passed parameter object

* `getDefaults()` returns the variables and their default values found in the template. Only really useful for debugging

* `setFormatter(targetVariables, formatter)` sets the formatter function for one or more variable names. 
The `variables` parameter can be a string with the name of the variable it targets, or an array of strings

##### HTML Encoding
Everything is html encoded by default, if this is unwanted use triple curly braces. 
Only the lefthand curly braces needs to be triple: `{{{ name }}`, 
but you can put three at both sides since it looks better: `{{{ name }}}`.

#### Example with template element with id:
index.html:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JsTemplates test</title>
    <script src="JsTemplates.js"></script>
</head>
<body>
    <template id="testTemplate">
        <h3>{{title}}</h3>
        <h5>Welcome {{user.name}}</h5>
        <input type="email" value="{{user.email}}">
        <p>You have {{user.messages.length = no}}</p>
        <p>Newest message: {{ user.messages[0] }}</p>
    </template>
   
    <script src="main.js"></script>
</body>
</html>
```
main.js:
```
let template = JsT.loadById("testTemplate");
template.setFormatter("user.messages.length", function (val) {
    return val + " new messages";
});
document.body.innerHTML += template.render({
    user: {
        name: "JohnDoe",
        email: "john@localhost",
        messages: ["Hi", "Welcome", "Goddag"]
    }
});
```


#### Example with file containing templates
templates.html:
```
<template id="templ1">
    <h4>Template 1</h4>
    <div>
        Hello
    </div>
</template>

<template id="templ2">
    <h3>Template 2</h3>
    <div>
        Welcome
    </div>
</template>
```
main.js:
```
JsT.get("templates.html", function (templates) {
    document.body.innerHTML += templates.templ1.render();
    document.body.innerHTML += templates.templ2.render();
});
```