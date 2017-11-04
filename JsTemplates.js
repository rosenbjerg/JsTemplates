"use strict";
(function (window) {
    let variableRegex = /{{ *(.+?)( *= *(.+?))? *}}/g;
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
            maps.defaults[match[1]] = !match[2] ? "" : match[3];
            maps.index.push(match[1]);
            maps.html.push(html.substring(index, match.index));
            index = match.index + match[0].length;
        }
        maps.html.push(html.substring(index, html.index));
        return maps;
    }

    function JsTemplate(html) {
        let _maps = createMap(html);

        this.render = function render (parameterObj) {
            if (!parameterObj)
                parameterObj = {};
            return _maps.index.reduce(function (output, prop, i) {
                let value = typeof parameterObj[prop] !== "undefined"
                    ? parameterObj[prop]
                    :_maps.defaults[prop];
                return output + value + _maps.html[i+1];
            }, _maps.html[0]);
        };

        this.getDefaults = function get_variables_and_default_values() {
            return Object.assign({}, _maps.defaults);
        }
    }

    jst.load = function load_from_DOM_element (domElement) {
        if (!domElement)
            throw new Error("Argument cannot be null");
        if (typeof domElement.innerHTML === "undefined")
            throw new Error("Argument is not a DOM element (no innerHTML property)");
        return new JsTemplate(domElement.innerHTML);
    };

    jst.loadById = function load_from_DOM_element_by_id (id) {
        if (!id)
            throw new Error("Id cannot be null");
        let template = document.getElementById(id);
        if (!template)
            throw new Error("DOM does not contain element with id '" + id + "'");
        let html = template.innerHTML;
        return new JsTemplate(html);
    };

    jst.get = function get_template_from_url(url, callback) {
        let xmlHttp = new XMLHttpRequest();
        if (callback){
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                    callback(new JsTemplate(xmlHttp.responseText));
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        }
        else {
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
            return new JsTemplate(xmlHttp.responseText);
        }
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