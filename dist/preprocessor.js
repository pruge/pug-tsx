"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessor = void 0;
var pug_uses_variables_1 = require("pug-uses-variables");
var XRegExp = require("xregexp");
var global_1 = require("./global");
var pattern = { start: '', end: '`' };
var findImportVariables = function (content) {
    var rst;
    rst = content.match(/import(.*)from/gm) || [];
    rst = rst.map(function (item) {
        var variable = item
            .match(/import(.*)from/)[1]
            .replace(/{|}/g, '')
            .split(',');
        return variable;
    });
    rst = rst.flat(Infinity).map(function (item) { return item.trim(); });
    return rst;
};
var findComponents = function (variables) {
    return variables.map(function (variable) { return variable.value; });
};
var findPug = function (content) {
    var rst;
    try {
        // console.log(content);
        rst = XRegExp.matchRecursive(content, pattern.start, pattern.end, 'gi');
        // rst = XRegExp.matchRecursive(content, 'pug`|css`| `[^;]', '`', 'gi');
        // console.log(rst);
        // console.log('--------');
        rst = rst
            .map(function (match) { return match.replace(/\/\/.*$/gm, '').trim(); })
            .filter(function (item) { return !/\\n/.test(item); });
    }
    catch (error) {
        rst = [];
        // console.log(error);
    }
    return rst;
};
var findAllComponents = function (contents) {
    var components = [];
    var _loop_1 = function () {
        var content = contents[i];
        var pugTemplates = findPug(content);
        var exclude = [];
        try {
            if (/pug`([\w\s\S]*)`/.test(content)) {
                components = components.concat(findAllComponents(pugTemplates));
                content = content.replace(/pug`([\w\s\S]*)`/, '');
                exclude = XRegExp.matchRecursive(content, '\\$\\{|\\{', '\\}', 'gi');
                exclude.forEach(function (item) {
                    content = content.replace(item, '');
                });
                content = content.replace(/\$\{\}/, 'test');
            }
            // console.log('--------');
            // console.log(content);
            // console.log('--------');
            components = components.concat(findComponents(pug_uses_variables_1.findVariablesInTemplate(content)));
        }
        catch (error) {
            // console.error(error);
        }
    };
    for (var i = 0; i < contents.length; i++) {
        _loop_1();
    }
    return __spread(new Set(components));
};
// const files = [
//   // 'TransitionAlerts.js',
//   // 'ButtonGroup.stories.tsx',
//   'Dialog.tsx',
// ];
// files.forEach((file) => {
//   readFile(file, 'utf8', function (err: any, data: string) {
//     if (data) {
//       const components = findAllComponents(findPug(data));
//       console.log(file, components);
//       const importVarialbles = findImportVariables(data);
//       console.log('import', importVarialbles);
//       const intersection = components.filter((item) =>
//         importVarialbles.includes(item),
//       );
//       console.log('intersection', intersection);
//       // let cssTemplate = findExclude(data);
//       // console.log(cssTemplate);
//     }
//   });
// });
/**
 * The preprocessor
 *
 * @export
 * @param {IWebpackLoaderContext} this webpack loader context
 * @param {string} content raw text file
 * @returns {string}
 */
function preprocessor(content) {
    var _a = getOptions(this.query), includes = _a.includes, replace = _a.replace;
    var components = findAllComponents(findPug(content));
    var importVarialbles = findImportVariables(content);
    var intersection = components.filter(function (item) {
        return importVarialbles.includes(item);
    });
    // 문서에 포함된 것 만.
    includes = includes.filter(function (item) { return content.includes(item); });
    intersection = __spread(intersection, includes);
    intersection = __spread(new Set(intersection));
    intersection = intersection.map(function (item) {
        if (replace[item]) {
            return replace[item];
        }
        else {
            return item;
        }
    });
    if (intersection.length !== 0) {
        return intersection.join(';\n') + ";\n" + content;
    }
    else {
        return content;
    }
}
exports.preprocessor = preprocessor;
function getOptions(query) {
    var options = global_1.DEFAULT_OPTIONS;
    options.includes = mergeDedupe([options.includes, query.includes || []]);
    options.start = mergeDedupe([options.start, query.start || []]);
    // options.end = mergeDedupe([options.end, query.end || []]);
    options.replace = Object.assign({}, options.replace, query.replace || {});
    // console.log('options', options);
    pattern.start = options.start.join('|');
    return options;
}
function mergeDedupe(arr) {
    return __spread(new Set([].concat.apply([], __spread(arr))));
}
