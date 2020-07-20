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
exports.getOptions = exports.preprocessor = exports.getIntersectedVars = exports.findVarsInPug = exports.findAllBacktickTemplate = exports.findVarsInImport = void 0;
var pug_uses_variables_1 = require("pug-uses-variables");
var XRegExp = require("xregexp");
var global_1 = require("./global");
var debug_1 = require("debug");
var logPug = debug_1.default('vars:inPug');
/**
 * import한 liabrary의 변수를 추출한다.
 */
exports.findVarsInImport = function (content) {
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
/**
 * value 값 배열로 변환
 */
var stripVars = function (variables) {
    return variables.map(function (variable) { return variable.value; });
};
var stripPattern = function (content) {
    try {
        // const exclude = XRegExp.matchRecursive(content, '\\$\\{|\\{', '\\}', 'gi');
        var exclude = XRegExp.matchRecursive(content, '\\$\\{|\\{|#\\{', 
        // '\\$\\{|#\\{',
        '\\}', 'gi');
        exclude.forEach(function (item) {
            logPug('---- item ----');
            logPug(item);
            content = content.replace(item, '');
        });
    }
    catch (error) {
        console.error(error);
    }
    return content.replace(/\$\{\}|#\{\}/gm, 'test');
};
/**
 * backtick이 포함된 문자열 추출
 */
exports.findAllBacktickTemplate = function (content, pattern) {
    var rst;
    try {
        rst = XRegExp.matchRecursive(content, pattern.start, pattern.end, 'gi');
        rst = rst
            .map(function (match) { return match.replace(/\/\/.*$/gm, '').trim(); })
            .filter(function (item) { return !/\\n/.test(item); });
    }
    catch (error) {
        console.error('[pug-tsx] options.start에 backtick 시작 문자열을 등록하세요.');
        throw error;
    }
    logPug(rst);
    return rst;
};
/**
 * pug` `에서 사용된 변수 추출
 */
exports.findVarsInPug = function (contents, pattern) {
    var usedVars = [];
    var _loop_1 = function () {
        var content = contents[i];
        var pugTemplates = exports.findAllBacktickTemplate(content, pattern);
        var variables = void 0;
        logPug(pugTemplates);
        try {
            // 내부에 pug`가 또 있다면,
            if (/pug`([\w\s\S]*)`/.test(content)) {
                usedVars = usedVars.concat(exports.findVarsInPug(pugTemplates, pattern));
                // 내부 ${pub``} 제거
                pugTemplates.forEach(function (pug) {
                    content = content.replace(pug, '');
                });
                content = content.replace(/\$\{pug``\}/g, 'test');
                logPug('---- before ----');
                logPug(content);
                // content = stripPattern(content);
                // logPug('---- after ----');
                // logPug(content);
            }
            try {
                logPug('---- content ----');
                logPug(content);
                variables = pug_uses_variables_1.findVariablesInTemplate(content);
                usedVars = usedVars.concat(stripVars(variables));
            }
            catch (error) {
                // 내부에 ${!content || $vars} 함수를 쓴것이 문제가 된다.
                content = stripPattern(content);
                variables = pug_uses_variables_1.findVariablesInTemplate(content);
                usedVars = usedVars.concat(stripVars(variables));
            }
        }
        catch (error) {
            // console.error(error);
            logPug(error);
        }
    };
    for (var i = 0; i < contents.length; i++) {
        _loop_1();
    }
    return __spread(new Set(usedVars));
};
/**
 * pug에서 사용된 변수들: usedVars
 * import 된 변수들: importedVars
 * options.includes : includes
 *
 * 교차된 변수 추출
 */
exports.getIntersectedVars = function (usedVars, importedVars, includes) {
    var intersection = usedVars.filter(function (item) { return importedVars.includes(item); });
    includes = includes.filter(function (item) { return importedVars.includes(item); });
    intersection = __spread(intersection, includes);
    intersection = __spread(new Set(intersection));
    return intersection;
};
/**
 * The preprocessor
 *
 * @export
 * @param {IWebpackLoaderContext} this webpack loader context
 * @param {string} content raw text file
 * @returns {string}
 */
function preprocessor(content) {
    var _a = getOptions(this.query), includes = _a.includes, replace = _a.replace, pattern = _a.pattern;
    var usedVars = exports.findVarsInPug(exports.findAllBacktickTemplate(content, pattern), pattern);
    var importedVars = exports.findVarsInImport(content);
    var intersectedVars = exports.getIntersectedVars(usedVars, importedVars, includes);
    var replacedVars = intersectedVars.map(function (item) {
        if (replace[item]) {
            return replace[item];
        }
        else {
            return item;
        }
    });
    if (replacedVars.length !== 0) {
        return replacedVars.join(';\n') + ";\n" + content;
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
    options.replace = Object.assign({}, options.replace, query.replace || {});
    options.pattern = {
        start: options.start.join('|'),
        end: options.end,
    };
    return options;
}
exports.getOptions = getOptions;
function mergeDedupe(arr) {
    return __spread(new Set([].concat.apply([], __spread(arr))));
}
