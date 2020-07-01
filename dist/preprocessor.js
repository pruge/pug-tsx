"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessor = void 0;
const pug_uses_variables_1 = require("pug-uses-variables");
const XRegExp = require("xregexp");
const global_1 = require("./global");
const findComponents = (variables) => {
    return variables
        .filter((variable) => variable.value[0] === variable.value[0].toUpperCase())
        .map((variable) => variable.value);
};
const findPug = (content) => {
    let rst;
    try {
        rst = XRegExp.matchRecursive(content, 'pug`', '`', 'g');
        rst = rst.map((match) => match.replace(/\/\/.*$/gm, '').trimRight());
    }
    catch (error) {
        rst = [];
    }
    return rst;
};
const findAllComponents = (contents) => {
    let components = [];
    for (var i = 0; i < contents.length; i++) {
        let content = contents[i];
        const pugTemplates = findPug(content);
        if (/pug`([\w\s\S]*)`/.test(content)) {
            components = components.concat(findAllComponents(pugTemplates));
            content = content.replace(/pug`([\w\s\S]*)`/, '');
            content = content.replace(/\$\{\}/, 'test');
        }
        components = components.concat(findComponents(pug_uses_variables_1.findVariablesInTemplate(content)));
    }
    return [...new Set(components)];
};
// fs.readFile('TransitionAlerts.js', 'utf8', function (err, data) {
//   if (data) {
//     let pugTemplate = findPug(data);
//     let components = findAllComponents(pugTemplate);
//     // components = [...new Set(components)];
//     console.log(components);
//   }
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
    let { includes } = getOptions(this.query);
    let pugTemplate = findPug(content);
    let components = findAllComponents(pugTemplate);
    includes = includes.filter((item) => content.includes(item));
    components = [...components, ...includes];
    components = [...new Set(components)];
    return `${components.join(';\n')};\n${content}`;
}
exports.preprocessor = preprocessor;
function getOptions(query) {
    const options = Object.assign({}, global_1.DEFAULT_OPTIONS, query);
    return options;
}
