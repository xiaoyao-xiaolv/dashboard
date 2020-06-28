
import PerfectScrollbar from 'perfect-scrollbar';

let { wynbi } = require('./utils.ts');


// import wynbi from './utils.ts'

(function () {
    console.log('test', wynbi)
    // #region utils
    let MS_PER_FRAME: number,
        FRAMES_PER_VALUE: any,
        FRAMERATE: number,
        DIGIT_SPEEDBOOST: any,
        VALUE_HTML: any,
        RIBBON_HTML: any,
        DIGIT_HTML: any,
        FORMAT_MARK_HTML: any,
        TRANSITION_END_EVENTS: any,
        TRANSITION_SUPPORT: any,
        transitionCheckStyles: any,
        __slice = [].slice;


    VALUE_HTML = '<span class="odometer-value"></span>';
    RIBBON_HTML = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + VALUE_HTML + '</span></span>';
    DIGIT_HTML = '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' + RIBBON_HTML + '</span></span>';
    FORMAT_MARK_HTML = '<span class="odometer-formatting-mark"></span>';

    TRANSITION_END_EVENTS = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
    transitionCheckStyles = document.createElement('div').style;
    TRANSITION_SUPPORT = (transitionCheckStyles.transition != null) || (transitionCheckStyles.webkitTransition != null) || (transitionCheckStyles.mozTransition != null) || (transitionCheckStyles.oTransition != null);

    FRAMERATE = 30;
    MS_PER_FRAME = 1000 / FRAMERATE;
    FRAMES_PER_VALUE = 2;
    DIGIT_SPEEDBOOST = .5;

    function round(val: any, precision: any) {
        if (precision == null) {
            precision = 0;
        }
        if (!precision) {
            return Math.round(val);
        }
        val *= Math.pow(10, precision);
        val += 0.5;
        val = Math.floor(val);
        return val /= Math.pow(10, precision);
    }
    function truncate(val: any) {
        if (val < 0) {
            return Math.ceil(val);
        } else {
            return Math.floor(val);
        }
    }
    function spliceString(str: any, startIndex: any, endIndex?: any) {
        return str.replace(str.substring(startIndex, endIndex), "");
    }
    function repeatString(str: any, times: any) {
        return Array(times + 1).join(str);
    }
    // #endregion

    function DigitsChart(dom: any) {
        this.el = dom;
        wynbi.utils.addClass(this.el, 'odometer');
        this.ps = new PerfectScrollbar('.digits-container', { suppressScrollY: true });

        this.value = '';
        this.thousandRepeating = ',ddd';
        this.format = {
            decimalSign: '.',
            thousandSign: ',',
            integerLength: 0,
            decimalLength: 0,
        }
        this.fontRenderSize = '';

        this.renderInside();
    }
    DigitsChart.prototype.render = function (newValue: any, options: any) {
        if (options.font.size === 'auto') {
            if (this.options == null) {
                this.resize(newValue, options);
                return;
            } else {
                var isOptionsChanged = !wynbi.utils.jsonEquals(this.options, options);
                if (isOptionsChanged || !this.fontRenderSize) {
                    this.resize(newValue, options);
                    return;
                }
            }
        }
        this.renderInternal(newValue, options);
    }
    DigitsChart.prototype.renderInternal = function (newValue: any, options: any, forceRender: any) {
        var isOptionsChanged = !wynbi.utils.jsonEquals(this.options, options);
        var isValueChanged = this.value !== newValue;
        if (!forceRender && !isValueChanged && !isOptionsChanged) {
            this.ps.update();
            return;
        }

        if (isOptionsChanged) {
            this.updateOptions(options);
        }
        this.initClassName();
        this.resetFormat();

        this.measureBlockSize();

        if (!TRANSITION_SUPPORT || this.options.animationDuration <= 0 || isNaN(this.value) || !isValueChanged) {
            this.updateWithoutAnimation(newValue);
        } else {
            this.updateWithAnimation(newValue);
        }

        this.ps.update();
    };
    DigitsChart.prototype.initClassName = function () {
        if (this.isSlide()) {
            wynbi.utils.removeClass(this.el, 'flip-auto-theme');
            wynbi.utils.addClass(this.el, 'odometer-auto-theme');
        } else if (this.isFlip()) {
            wynbi.utils.removeClass(this.el, 'odometer-auto-theme');
            wynbi.utils.addClass(this.el, 'flip-auto-theme');
        }
    }
    DigitsChart.prototype.updateWithoutAnimation = function (newValue: any) {
        if (this.isSlide()) {
            this.noAnimateSlide(newValue);
        } else if (this.isFlip()) {
            this.noAnimateFlip(newValue);
        }
    };
    DigitsChart.prototype.updateWithAnimation = function (newValue: any) {
        if (this.isSlide()) {
            this.updateAnimateSlide(newValue);
        } else if (this.isFlip()) {
            this.updateAnimateFlip(newValue);
        }

        return this.value = newValue;
    };
    DigitsChart.prototype.updateOptions = function (newOptions: any) {
        // if (this.options == null || this.options.animationMode !== newOptions.animationMode) {
        //     this.value = null;
        // }
        this.options = newOptions;

        this.el.style = '';
        wynbi.utils.renderElementFont(this.el, newOptions.font, this.fontRenderSize);
        var selector = '.digits-container.odometer.flip-auto-theme .odometer-digit .odometer-value:before, .digits-container.odometer.flip-auto-theme .odometer-digit .odometer-value:after';
        var checkSelector = '.digits-container.odometer.flip-auto-theme .odometer-digit .odometer-value::before, .digits-container.odometer.flip-auto-theme .odometer-digit .odometer-value::after';
        var cssStyleRule = null;
        for (let i = 0; i < document.styleSheets.length; i++) {
            let cssStyleSheet: any = document.styleSheets[i];
            if (cssStyleSheet.cssRules.length === 1 && cssStyleSheet.cssRules[0].selectorText === checkSelector) {
                cssStyleRule = cssStyleSheet.cssRules[0];
                if (this.isSlide()) {
                    cssStyleSheet.disabled = true;
                } else if (this.isFlip()) {
                    cssStyleSheet.disabled = false;
                }
                break;
            }
        }
        if (this.isFlip()) {
            var digitBackgroundColor = this.options.backgroundColor ? this.options.backgroundColor : '';
            var cssText = selector + ' { background: ' + digitBackgroundColor + ';}';
            if (cssStyleRule) {
                cssStyleRule.style.backgroundColor = digitBackgroundColor;
            } else {
                var styleElem = document.head.appendChild(document.createElement("style"));
                styleElem.innerHTML = cssText;
            }
        }

        this.MAX_VALUES = ((this.options.animationDuration * 1000 / MS_PER_FRAME) / FRAMES_PER_VALUE) | 0;
        this.thousandRepeating = newOptions.showThousandSign ? ',ddd' : '';

        this.format = {
            decimalSign: '.',
            thousandSign: ',',
            integerLength: Math.max(0, (newOptions.integerLength === 'auto' || isNaN(newOptions.integerLength)) ? -1 : parseInt(newOptions.integerLength, 10)),
            decimalLength: Math.max(0, isNaN(newOptions.decimalLength) ? 0 : parseInt(newOptions.decimalLength, 10))
        }
    }
    DigitsChart.prototype.measureBlockSize = function () {
        if (this.isFlip()) {
            var fontSize = wynbi.utils.getFontRenderSize(this.fontRenderSize, this.options.font);
            var testEl = wynbi.utils.createElementFromHTML('<div class="chart-container" style="visibility:hidden"><div class="digits-container odometer odometer-auto-theme animating-up animating" style="font-size:' + fontSize + '; font-weight: normal; font-style: normal;"><div class="odometer-inside"><span class="odometer-digit"><span class="odometer-digit-spacer">8</span></span></div></div></div>');
            document.body.appendChild(testEl);
            var measureEl = testEl.querySelector('.odometer-digit');
            this.digitSize = measureEl.getBoundingClientRect();
            document.body.removeChild(testEl);
        }
    }

    // #region from odometer
    DigitsChart.prototype.noAnimateSlide = function (newValue: any) {
        this.resetFormat();

        if (newValue == null) {
            newValue = this.value;
        }

        this.inside.innerHTML = '';
        wynbi.utils.removeClass(this.el, 'animating-up animating-down animating');
        this.ribbons = {};

        this.formatDigits(newValue);
    }
    DigitsChart.prototype.updateAnimateSlide = function (newValue: any) {
        this.resetFormat();

        var diff,
            _this = this;
        newValue = this.cleanValue(newValue);
        if (!(diff = newValue - this.value)) {
            return;
        }
        wynbi.utils.removeClass(this.el, 'animating-up animating-down animating');
        if (diff > 0) {
            wynbi.utils.addClass(this.el, 'animating-up');
        } else {
            wynbi.utils.addClass(this.el, 'animating-down');
        }
        this.animate(newValue);
        setTimeout(function () {
            return _this.startAnimateSlide(_this);
        }, 0);
    }
    DigitsChart.prototype.animate = function (newValue: any) {
        let boosted, cur, diff, digitCount, digits, dist, end: number, fractionalCount, frame, frames, i, incr, j, mark, numEl, oldValue, start: number, _base, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _results;

        oldValue = this.value;
        fractionalCount = this.getFractionalDigitCount(oldValue, newValue);
        if (fractionalCount) {
            newValue = Math.round(newValue * Math.pow(10, fractionalCount));
            oldValue = Math.round(oldValue * Math.pow(10, fractionalCount));
        }
        if (!(diff = newValue - oldValue)) {
            return;
        }
        if (this.isSlide()) {
            this.bindTransitionEnd();
        }
        digitCount = this.getDigitCount(oldValue, newValue);
        digits = [];
        boosted = 0;

        for (i = _i = 0; 0 <= digitCount ? _i < digitCount : _i > digitCount; i = 0 <= digitCount ? ++_i : --_i) {
            start = truncate(oldValue / Math.pow(10, digitCount - i - 1));
            end = truncate(newValue / Math.pow(10, digitCount - i - 1));
            frames = [];
            if (this.isFlip()) {
                var unitsStart = Math.abs(start) % 10;
                var unitsEnd = Math.abs(end) % 10;
                if (unitsStart === unitsEnd) {
                    frames = [unitsStart];
                } else {
                    frames = diff > 0 ? [unitsStart, unitsEnd] : [unitsEnd, unitsStart]
                }
            } else {
                // slide
                dist = end - start;
                if (Math.abs(dist) > this.MAX_VALUES) {
                    frames = [];
                    incr = dist / (this.MAX_VALUES + this.MAX_VALUES * boosted * DIGIT_SPEEDBOOST);
                    cur = start;
                    while ((dist > 0 && cur < end) || (dist < 0 && cur > end)) {
                        frames.push(Math.round(cur));
                        cur += incr;
                    }
                    if (frames[frames.length - 1] !== end) {
                        frames.push(end);
                    }
                    boosted++;
                } else {
                    frames = (function () {
                        _results = [];
                        for (let _j = start; start <= end ? _j <= end : _j >= end; start <= end ? _j++ : _j--) { _results.push(_j); }
                        return _results;
                    }).apply(this);
                }
                for (i = _k = 0, _len = frames.length; _k < _len; i = ++_k) {
                    frame = frames[i];
                    frames[i] = Math.abs(frame % 10);
                }
            }
            digits.push(frames);
        }

        this.resetDigits();

        _ref = digits.reverse();
        for (i = _l = 0, _len1 = _ref.length; _l < _len1; i = ++_l) {
            frames = _ref[i];
            if (!this.digits[i]) {
                this.addDigit(' ', i >= fractionalCount);
            }
            if ((_base = this.ribbons)[i] == null) {
                _base[i] = this.digits[i].querySelector('.odometer-ribbon-inner');
            }
            this.ribbons[i].innerHTML = '';
            if (diff < 0) {
                frames = frames.reverse();
            }
            for (j = _m = 0, _len2 = frames.length; _m < _len2; j = ++_m) {
                frame = frames[j];
                numEl = document.createElement('div');
                numEl.className = 'odometer-value';

                if (this.isFlip()) {
                    wynbi.utils.addClass(numEl, 'number' + frame);
                } else {
                    numEl.innerHTML = frame;
                }

                this.ribbons[i].appendChild(numEl);
                if (this.isSlide() || frames.length > 1) {
                    if (j === frames.length - 1) {
                        wynbi.utils.addClass(numEl, 'odometer-last-value');
                    }
                    if (j === 0) {
                        wynbi.utils.addClass(numEl, 'odometer-first-value');
                    }
                }
            }
        }
        if (start < 0) {
            this.addDigit('-');
        }
        mark = this.inside.querySelector('.odometer-radix-mark');
        if (mark != null) {
            mark.parent.removeChild(mark);
        }
        if (fractionalCount) {
            return this.addSpacer('.', this.digits[fractionalCount - 1], 'odometer-radix-mark');
        }
    }
    DigitsChart.prototype.startAnimateSlide = function (_this: any) {
        _this.el.offsetHeight;
        wynbi.utils.addClass(_this.el, 'animating')
        var children = _this.el.querySelectorAll('.odometer-ribbon-inner');
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var duration = _this.options.animationDuration + 's';
            if (child.style.transitionDuration != null) {
                child.style.transitionDuration = duration;
            }
            if (child.style.webkitTransitionDuration) {
                child.style.webkitTransitionDuration = duration;
            }
            if (child.style.mozTransitionDuration) {
                child.style.mozTransitionDuration = duration;
            }
            if (child.style.oTransitionDuration) {
                child.style.oTransitionDuration = duration;
            }
        }
    };
    DigitsChart.prototype.resetFormat = function () {
        this.thousandRepeating = ',ddd';
    }
    DigitsChart.prototype.formatDigits = function (value: any) {
        this.resetFormat();
        var digit, wholePart, _i, _j, _len, _len1, _ref, _ref1;
        this.digits = [];

        _ref = value.toString().split('.');

        var integerLength = this.format.integerLength;
        if (this.options.integerLength !== 'auto') {
            if (_ref[0].length > integerLength) {
                _ref[0] = _ref[0].slice(integerLength - 1);
            } else {
                _ref[0] = repeatString('0', integerLength - _ref[0].length) + _ref[0];
            }
        }

        var decimalLength = this.format.decimalLength;
        if (decimalLength <= 0) {
            _ref = _ref.slice(0, 1);
        } else {
            if (_ref.length > 1) {
                if (_ref[1].length > decimalLength) {
                    _ref[1] = spliceString(_ref[1], decimalLength);
                }
                else {
                    _ref[1] = _ref[1] + repeatString('0', decimalLength - _ref[1].length);
                }
            } else {
                _ref[1] = repeatString('0', decimalLength);
            }
        }


        _ref1 = _ref.join('.').split('').reverse();
        wholePart = _ref.length <= 1;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            digit = _ref1[_j];
            if (digit === '.') {
                wholePart = true;
            }
            this.addDigit(digit, wholePart);
        }
    };
    DigitsChart.prototype.cleanValue = function (val: any) {
        var precision = this.getFractionalDigitCount()
        return round(val, precision);
    };
    DigitsChart.prototype.renderInside = function () {
        this.inside = document.createElement('div');
        this.inside.className = 'odometer-inside';
        this.el.innerHTML = '';
        return this.el.appendChild(this.inside);
    };
    DigitsChart.prototype.getFractionalDigitCount = function () {
        return this.options.decimalLength || 0;
    }
    DigitsChart.prototype.bindTransitionEnd = function () {
        var event, renderEnqueued: boolean, _i, _len, _ref, _results,
            _this = this;
        if (this.transitionEndBound) {
            return;
        }
        this.transitionEndBound = true;
        renderEnqueued = false;
        _ref = TRANSITION_END_EVENTS.split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            event = _ref[_i];
            _results.push(this.el.addEventListener(event, function () {
                if (renderEnqueued) {
                    return true;
                }
                renderEnqueued = true;
                setTimeout(function () {
                    _this.endAnimate(_this);
                    renderEnqueued = false;
                }, 0);
                return true;
            }, false));
        }
        return _results;
    };
    DigitsChart.prototype.getDigitCount = function () {
        var i, max, value, values, _i, _len;
        values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
            value = values[i];
            values[i] = Math.abs(value);
        }
        max = Math.max.apply(Math, values);
        var realDigitCount = Math.ceil(Math.log(max + 1) / Math.log(10));

        return this.options.integerLength === 'auto' ? realDigitCount : this.format.integerLength + this.format.decimalLength;
    }
    DigitsChart.prototype.resetDigits = function () {
        this.digits = [];
        this.ribbons = [];
        this.inside.innerHTML = '';
    };
    DigitsChart.prototype.renderDigit = function () {
        var digitEl = wynbi.utils.createElementFromHTML(DIGIT_HTML);
        if (this.options.backgroundColor) {
            digitEl.style.cssText = 'background:' + this.options.backgroundColor;
        }

        if (this.isFlip()) {
            var innerEl = digitEl.querySelector('.odometer-ribbon-inner');
            innerEl.style.cssText = 'width:' + this.digitSize.width + 'px;height:' + this.digitSize.height + 'px;line-height:' + this.digitSize.height + 'px';
        }
        return digitEl;
    };
    DigitsChart.prototype.insertDigit = function (digit: any, before: any) {
        if (before != null) {
            return this.inside.insertBefore(digit, before);
        } else if (!this.inside.children.length) {
            return this.inside.appendChild(digit);
        } else {
            return this.inside.insertBefore(digit, this.inside.children[0]);
        }
    };
    DigitsChart.prototype.addSpacer = function (chr: any, before: any, extraClasses: any) {
        var spacer;
        spacer = wynbi.utils.createElementFromHTML(FORMAT_MARK_HTML);
        spacer.innerHTML = chr;
        if (extraClasses) {
            wynbi.utils.addClass(spacer, extraClasses);
        }
        return this.insertDigit(spacer, before);
    };
    DigitsChart.prototype.addDigit = function (value: any, repeating: any) {
        var chr, digit, resetted, _ref;
        if (repeating == null) {
            repeating = true;
        }
        if (value === '-') {
            return this.addSpacer(value, null, 'odometer-negation-mark');
        }
        if (value === '.') {
            return this.addSpacer((_ref = this.format.radix) != null ? _ref : '.', null, 'odometer-radix-mark');
        }
        if (repeating && this.options.showThousandSign) {
            resetted = false;
            while (true) {
                if (!this.thousandRepeating.length) {
                    if (resetted) {
                        throw new Error("Bad odometer format without digits");
                    }
                    this.thousandRepeating = ',ddd';
                    resetted = true;
                }
                chr = this.thousandRepeating[this.thousandRepeating.length - 1];
                this.thousandRepeating = this.thousandRepeating.substring(0, this.thousandRepeating.length - 1);
                if (chr === 'd') {
                    break;
                }
                this.addSpacer(chr);
            }
        }
        digit = this.renderDigit();
        var digitEl = digit.querySelector('.odometer-value');
        wynbi.utils.addClass(digitEl, 'number' + value);
        digitEl.innerHTML = value;
        this.digits.push(digit);
        return this.insertDigit(digit);
    };
    // #endregion

    // #region flip
    DigitsChart.prototype.noAnimateFlip = function (newValue: any) {
        this.resetFormat();

        if (newValue == null) {
            newValue = this.value;
        }

        this.inside.innerHTML = '';
        wynbi.utils.removeClass(this.el, 'animating-up animating-down animating');
        this.ribbons = {};

        this.formatDigits(newValue);
    }
    DigitsChart.prototype.updateAnimateFlip = function (newValue: any) {
        this.resetFormat();

        var diff,
            _this = this;
        newValue = this.cleanValue(newValue);
        if (!(diff = newValue - this.value)) {
            return;
        }
        wynbi.utils.removeClass(this.el, 'animating-up animating-down animating');
        if (diff > 0) {
            wynbi.utils.addClass(this.el, 'animating-up');
        } else {
            wynbi.utils.addClass(this.el, 'animating-down');
        }

        this.animate(newValue);
        setTimeout(function () {
            return _this.startAnimateFlip(_this);
        }, 0);
    }
    DigitsChart.prototype.startAnimateFlip = function (_this: any) {
        _this.el.offsetHeight;
        wynbi.utils.addClass(_this.el, 'animating');
        setTimeout(() => {
            _this.endAnimate(_this);
        }, 600); // 0.6s is the flip animation, defined in flip.css
    };
    DigitsChart.prototype.endAnimate = function (_this: any) {
        if (_this.isAutoFontSize()) {
            var tempOptions = wynbi.utils.clone(_this.options);
            tempOptions.animationDuration = 0;

            this.resize(_this.value, tempOptions);
        } else {
            _this.updateWithoutAnimation();
        }
    };
    // #endregion

    // #region resize
    DigitsChart.prototype.resize = function (newValue: any, options: any) {
        if (newValue == null) {
            newValue = this.value;
        }
        if (newValue == null) {
            newValue = '';
        }
        if (options == null) {
            options = this.options;
        }

        if (options != null && options.font.size !== 'auto') {
            this.ps.update();
            return;
        }

        var autoFontSize = this.getAutoFontSize(newValue, options);

        var newOptions = wynbi.utils.clone(options);
        this.fontRenderSize = autoFontSize + 'px';
        this.renderInternal(newValue, newOptions, true);
    }
    DigitsChart.prototype.getAutoFontSize = function (newValue: any, newOptions: any) {
        var measureEl = this.el;
        if (!measureEl) {
            return;
        }

        var tempOptions = wynbi.utils.clone(newOptions);
        tempOptions.animationDuration = 0;
        if (tempOptions.animationMode === 'flip') {
            // use slide to measure.
            tempOptions.animationMode = 'slide';
        }
        this.renderInternal(newValue, tempOptions, true);


        var clientHeight = this.el.parentElement.clientHeight;
        var clientWidth = Math.abs(this.el.parentElement.clientWidth - 20);
        var autoFontSize = 10000;
        while (autoFontSize > 10) {
            if (autoFontSize < 10) {
                break;
            }
            this.el.style.fontSize = autoFontSize + "px";
            var scrollWidth = measureEl.scrollWidth;
            var scrollHeight = measureEl.scrollHeight;


            if (scrollWidth > clientWidth || scrollHeight > clientHeight) {
                var radio = Math.max(scrollWidth / clientWidth, scrollHeight / clientHeight);
                autoFontSize = Math.floor(autoFontSize / radio);

                if (clientHeight < 20 || clientWidth < 20) {
                    break;
                }
            } else {
                break;
            }
        }

        return autoFontSize;
    };

    DigitsChart.prototype.isFlip = function () {
        return this.options.animationMode === 'flip';
    }
    DigitsChart.prototype.isSlide = function () {
        return this.options.animationMode === 'slide';
    }
    DigitsChart.prototype.isAutoFontSize = function () {
        return this.options.font.size === 'auto';
    }

    wynbi.DigitsChart = DigitsChart;
})();

export { wynbi } 