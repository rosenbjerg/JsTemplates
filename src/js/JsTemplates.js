"use strict";

(function (window) {
    const ElementSelectorRegex = "template, script[type='text/template']";
    const variableRegex = /{{ *(.+?)( *= *(.+?))? *}}}?/g;
    const selectorRegex = /[\][.]?(\w+)[\].]?/g;
    const htmlEncoderRegex = /[^a-z0-9A-Z ]/g;
    let jst = {};

    function createMap(html) {
        let maps = {
            defaults: {},
            index: [],
            encode: [],
            html: []
        };
        let index = 0;
        let match;
        while((match = variableRegex.exec(html)) !== null) {
            let variableName = match[1];
            let htmlEncode = true;
            if (variableName.charAt(0) === '{') {
                variableName = variableName.substr(1).trim();
                htmlEncode = false;
            }
            let selectors = [];
            let sMatch;

            while ((sMatch = selectorRegex.exec(variableName)) !== null) {
                selectors.push(sMatch[1])
            }
            maps.defaults[variableName] = !match[2] ? "" : match[3];
            maps.index.push(selectors);
            maps.encode.push(htmlEncode);
            maps.html.push(html.substring(index, match.index));
            index = match.index + match[0].length;
        }
        maps.html.push(html.substring(index, html.index));
        return maps;
    }

    function encodeHtml(str) {
        if(!str)
            return "";
        return str.toString().replace(htmlEncoderRegex, c => "&#" + c.charCodeAt(0) + ";");
    }
    function getValue(obj, props) {
        for (let i in props) {
            if (obj[props[i]] === undefined)
                return false;
            obj = obj[props[i]];
        }
        return obj;
    }
    function getInnerHtmlContent(domElement) {
        if (domElement.matches(ElementSelectorRegex)) {
            return domElement.innerHTML;
        }
        throw new Error("DOM element must be a <template> or a <script type='text/template']>");
    }
    function JsTemplate(html) {
        if (html instanceof HTMLElement)
            html = getInnerHtmlContent(html);
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
            if (this._maps.encode[i])
                value = encodeHtml(value);
            return output + value + this._maps.html[i+1];
        }, this._maps.html[0]);
    };
    JsTemplate.prototype.setFormatter = function set_formatter(variables, formatter) {
        if (typeof variables === 'string')
            variables = [variables];
        for (let i = 0; i < variables.length; i++) {
            this._formatters[variables[i]] = formatter;
        }
    };

    function getInnerTemplates(domElement) {
        return Array.prototype.slice.call(domElement.querySelectorAll(ElementSelectorRegex))
            .filter(t => !!t.id);
    }

    jst.load = function load_from_DOM_element (domElement) {
        return new JsTemplate(domElement);
    };

    jst.loadById = function load_from_DOM_element_by_id (id, removeAfterLoad) {
        let domElement = document.getElementById(id);
        let teml = new JsTemplate(domElement);
        if (removeAfterLoad === true)
            domElement.remove();
        return teml;    
    };

    jst.get = function get_template_from_url(url, callback) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
                let element = document.createElement("div");
                element.innerHTML = xmlHttp.responseText;
                let templates = getInnerTemplates(element);
                let templCollection = {};
                for (let i in templates){
                    templCollection[templates[i].id] = new JsTemplate(getInnerHtmlContent(templates[i]));
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
        define(() => jst);
    }

    else if (typeof module === 'object' && module.exports) {
        module.exports = jst;
    }

    else {
        window.JsT = jst;
    }
})(this);