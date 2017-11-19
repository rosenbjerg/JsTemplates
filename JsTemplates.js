"use strict";
(function (window) {
    const variableRegex = /{{ *(.+?)( *= *(.+?))? *}}/g;
    const regex = /[\][.]?(\w+)[\].]?/g;
    let jst = {};

    function createMap(html) {
        let maps = {
            defaults: {},
            index: [],
            html: []
        };
        let index = 0;
        let match;
        while((match = variableRegex.exec(html)) !== null) {
            let selectors = [];
            let sMatch;
            while ((sMatch = regex.exec(match[1])) !== null) {
                selectors.push(sMatch[1])
            }
            maps.defaults[match[1]] = !match[2] ? "" : match[3];
            maps.index.push(selectors);
            maps.html.push(html.substring(index, match.index));
            index = match.index + match[0].length;
        }
        maps.html.push(html.substring(index, html.index));
        return maps;
    }

    function getValue(obj, props) {
        for (let i in props) {
            if (obj[props[i]] === undefined)
                return false;
            obj = obj[props[i]];
        }
        return obj;
    }

    function JsTemplate(html) {
        this._maps = createMap(html);
        this._formatters = {};
    }

    JsTemplate.prototype.render = function render_template(parameterObj) {
        if (!parameterObj)
            parameterObj = {};
        return this._maps.index.reduce((output, props, i) => {
            let defSel = props.join('.');
            let value = getValue(parameterObj, props);
            if (!value)
                value = this._maps.defaults[defSel];
            if (this._formatters[defSel] !== undefined)
                value = this._formatters[defSel](value);
            return output + value + this._maps.html[i+1];
        }, this._maps.html[0]);
    };
    JsTemplate.prototype.getDefaults = function get_variables_and_default_values() {
        return Object.assign({}, this._maps.defaults);
    };
    JsTemplate.prototype.setFormatter = function set_formatter(variables, formatter) {
        if (typeof variables === 'string')
            variables = [variables];
        for (let i = 0; i < variables.length; i++) {
            this._formatters[variables[i]] = formatter;
        }
    };

    jst.load = function load_from_DOM_element (domElement) {
        if (!domElement)
            throw new Error("Argument cannot be null");
        if (typeof domElement.innerHTML === "undefined")
            throw new Error("Argument is not a DOM element (no innerHTML property)");
        return new JsTemplate(domElement.innerHTML);
    };
    jst.loadById = function load_from_DOM_element_by_id (id, removeAfterLoad) {
        if (!id)
            throw new Error("Id cannot be null");
        let template = document.getElementById(id);
        if (!template)
            throw new Error("DOM does not contain element with id '" + id + "'");
        let html = template.innerHTML;
        if (removeAfterLoad === true)
            template.parentNode.removeChild(template);
        return new JsTemplate(html);
    };
    jst.get = function get_template_from_url(url, callback) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
                let element = document.createElement("div");
                element.innerHTML = xmlHttp.responseText;
                let templates = element.getElementsByTagName("template");
                let templCollection = {};
                for (let i in templates) {
                    if (!templates.hasOwnProperty(i) || !templates[i].id)
                        continue;
                    templCollection[templates[i].id] = new JsTemplate(templates[i].innerHTML);
                }
                callback(templCollection);
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    };
    jst.create = function create_from_html (html) {
        return new JsTemplate(html);
    };


    if (typeof define === 'function' && define.amd) {
        define(function () {
            return jst;
        })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = jst;
    } else {
        window.JsT = jst;
    }
})(this);