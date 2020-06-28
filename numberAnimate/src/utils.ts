let wynbi: any
wynbi = wynbi || (wynbi = {});

(function (wynbi) {
    function utils() {
    }

    utils.clone = function (json: any) {
        if (!json || typeof json !== 'object') {
            return;
        }

        return JSON.parse(JSON.stringify(json));
    };

    utils.removeClass = function (el: any, name: string) {
        return el.className = el.className.replace(new RegExp("(^| )" + (name.split(' ').join('|')) + "( |$)", 'gi'), ' ').trim();
    };

    utils.addClass = function (el: any, name: string) {
        utils.removeClass(el, name);
        return el.className += " " + name;
    };

    utils.jsonEquals = function (x: any, y: any): boolean {
        if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
        if (x === y || x.valueOf() === y.valueOf()) { return true; }

        // if one of them is date, they must had equal valueOf
        if (x instanceof Date) { return false; }
        if (y instanceof Date) { return false; }

        // if they are not function or strictly equal, they both need to be Objects
        if (!(x instanceof Object)) { return false; }
        if (!(y instanceof Object)) { return false; }

        var p = Object.keys(x);
        return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) ?
            p.every(function (i) { return utils.jsonEquals(x[i], y[i]); }) : false;
    };

    utils.mergeOptions = function (defaultOptions: any, options: any) {
        let opt = options || {};
        const obj: any = {};

        for (let att in defaultOptions) {
            if (opt[att] === void 0) {
                obj[att] = defaultOptions[att];
            } else {
                if (typeof defaultOptions[att] === "object") {
                    obj[att] = utils.mergeOptions(defaultOptions[att], opt[att]);
                } else {
                    obj[att] = opt[att];
                }
            }
        }
        return obj;
    };

    // prefix or suffix
    utils.showAffixes = function (affixes: any) {
        return affixes && affixes.text && affixes.text.length > 0;
    };
    utils.createElementFromHTML = function (html: any) {
        var el: any;
        el = document.createElement('div');
        el.innerHTML = html;
        return el.children[0];
    };
    utils.createElement = function (tagName: any, className: string) {
        var container = document.createElement('div');
        utils.addClass(container, className)
        return container;
    };
    utils.getFontRenderSize = function (defaultFontSize: any, font: any) {
        if (font.size === 'auto') {
            return defaultFontSize;
        }

        return font.size;
    }
    utils.renderElementFont = function (el: any, font: any, defaultFontSize?: any) {
        if (el == null || font == null) {
            return;
        }

        el.style.color = font.color;
        el.style.fontSize = utils.getFontRenderSize(defaultFontSize, font);
        el.style.fontFamily = font.family;
        el.style.fontWeight = font.bold ? 'bold' : 'normal';
        el.style.fontStyle = font.italic ? 'italic' : 'normal';
    };

    // affixesMode: 'prefix', 'suffix'
    utils.renderAffixesElement = function (affixesElement: any, defaultClassName: any, affixes: any) {
        affixesElement.removeAttribute("style");
        affixesElement.className = defaultClassName;

        var showAffixes = utils.showAffixes(affixes);
        if (!showAffixes) {
            utils.addClass(affixesElement, 'hidden');
        } else {
            utils.addClass(affixesElement, affixes.position);
            utils.renderElementFont(affixesElement, affixes.font);
            affixesElement.innerHTML = affixes.text;
        }
    };

    wynbi.utils = utils;
})(wynbi);

export { wynbi }