export default class Hsl {
    public h: number;
    public s: number;
    public l: number;
    public value: string;

    constructor(value: string, input: string | Hsl) {
        this.value = value
        if (typeof input === 'object') {
            this.h = (input.h + (50 / 360)) % 1;
            this.s = input.s;
            this.l = input.l
            return this;
        }

        if (typeof input === 'string') {
            this.hex2hsl(input);
            return this;
        }
    }

    private hex2hsl(hexValue: string) {
        const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b);
        const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let r = parseInt(rgb[1], 16);
        let g = parseInt(rgb[2], 16);
        let b = parseInt(rgb[3], 16);
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        this.l = (max + min) / 2;

        if (max == min) {
            this.h = this.s = 0; // achromatic
        } else {
            var d = max - min;
            this.s = this.l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: this.h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: this.h = (b - r) / d + 2; break;
                case b: this.h = (r - g) / d + 4; break;
            }
            this.h /= 6;
        }
    }

    public ToRgba(a: number): string {
        let r, g, b;
        if (this.s == 0) {
            r = g = b = this.l;
        } else {
            const q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s;
            const p = 2 * this.l - q;
            r = this.hue2rgb(p, q, this.h + 1 / 3);
            g = this.hue2rgb(p, q, this.h);
            b = this.hue2rgb(p, q, this.h - 1 / 3);
        }
        return `rgba(${r * 255},${g * 255},${b * 255},${a})`;
    }

    private hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
}
