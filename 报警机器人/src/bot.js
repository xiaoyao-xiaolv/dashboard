!function (t, n) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (t = t || self).__SVGATOR_PLAYER__ = n()
  }(this, (function () {
    "use strict";
    
    function t(n) {
      return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
      })(n)
    }
    
    function n(t, n) {
      if (!(t instanceof n)) throw new TypeError("Cannot call a class as a function")
    }
    
    function r(t, n) {
      for (var r = 0; r < n.length; r++) {
        var e = n[r];
        e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(t, e.key, e)
      }
    }
    
    function e(t, n, e) {
      return n && r(t.prototype, n), e && r(t, e), t
    }
    
    var i = Math.abs;
    
    function u(t) {
      return t
    }
    
    function o(t, n, r) {
      var e = 1 - r;
      return 3 * r * e * (t * e + n * r) + r * r * r
    }
    
    function a() {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
        r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
        e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
      return t < 0 || t > 1 || r < 0 || r > 1 ? null : i(t - n) <= 1e-5 && i(r - e) <= 1e-5 ? u : function (u) {
        if (u <= 0) return t > 0 ? u * n / t : 0 === n && r > 0 ? u * e / r : 0;
        if (u >= 1) return r < 1 ? 1 + (u - 1) * (e - 1) / (r - 1) : 1 === r && t < 1 ? 1 + (u - 1) * (n - 1) / (t - 1) : 1;
        for (var a, l = 0, s = 1; l < s;) {
          var f = o(t, r, a = (l + s) / 2);
          if (i(u - f) < 1e-5) break;
          f < u ? l = a : s = a
        }
        return o(n, e, a)
      }
    }
    
    function l() {
      return 1
    }
    
    function s(t) {
      return 1 === t ? 1 : 0
    }
    
    function f() {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
        n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
      if (1 === t) {
        if (0 === n) return s;
        if (1 === n) return l
      }
      var r = 1 / t;
      return function (t) {
        return t >= 1 ? 1 : (t += n * r) - t % r
      }
    }
    
    function c(t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
      if (Number.isInteger(t)) return t;
      var r = Math.pow(10, n);
      return Math.round(t * r) / r
    }
    
    var h = Math.PI / 180;
    
    function v(t, n, r) {
      return t >= .5 ? r : n
    }
    
    function d(t, n, r) {
      return 0 === t || n === r ? n : t * (r - n) + n
    }
    
    function y(t, n, r) {
      var e = d(t, n, r);
      return e <= 0 ? 0 : e
    }
    
    function g(t, n, r) {
      return 0 === t ? n : 1 === t ? r : {x: d(t, n.x, r.x), y: d(t, n.y, r.y)}
    }
    
    function m(t, n, r) {
      return 0 === t ? n : 1 === t ? r : {x: y(t, n.x, r.x), y: y(t, n.y, r.y)}
    }
    
    function p(t, n, r) {
      var e = function (t, n, r) {
        return Math.round(d(t, n, r))
      }(t, n, r);
      return e <= 0 ? 0 : e >= 255 ? 255 : e
    }
    
    function b(t, n, r) {
      return 0 === t ? n : 1 === t ? r : {
        r: p(t, n.r, r.r),
        g: p(t, n.g, r.g),
        b: p(t, n.b, r.b),
        a: d(t, null == n.a ? 1 : n.a, null == r.a ? 1 : r.a)
      }
    }
    
    function w(t, n, r) {
      if (0 === t) return n;
      if (1 === t) return r;
      var e = n.length;
      if (e !== r.length) return v(t, n, r);
      for (var i = [], u = 0; u < e; u++) i.push(b(t, n[u], r[u]));
      return i
    }
    
    function x(t, n, r) {
      var e = n.length;
      if (e !== r.length) return v(t, n, r);
      for (var i = new Array(e), u = 0; u < e; u++) i[u] = d(t, n[u], r[u]);
      return i
    }
    
    function k(t, n) {
      for (var r = [], e = 0; e < t; e++) r.push(n);
      return r
    }
    
    function A(t, n) {
      if (--n <= 0) return t;
      var r = (t = Object.assign([], t)).length;
      do {
        for (var e = 0; e < r; e++) t.push(t[e])
      } while (--n > 0);
      return t
    }
    
    var _ = /\.0+$/g;
    
    function M(t) {
      return Number.isInteger(t) ? t + "" : t.toFixed(6).replace(_, "")
    }
    
    function S(t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : " ";
      return t && t.length ? t.map(M).join(n) : ""
    }
    
    function E(t) {
      return M(t.x) + "," + M(t.y)
    }
    
    function B(t) {
      return t ? null == t.a || t.a >= 1 ? "rgb(" + t.r + "," + t.g + "," + t.b + ")" : "rgba(" + t.r + "," + t.g + "," + t.b + "," + t.a + ")" : "transparent"
    }
    
    var I = {
        f: null, i: m, u: function (t, n) {
          return function (r) {
            var e = n(r);
            t.setAttribute("rx", M(e.x)), t.setAttribute("ry", M(e.y))
          }
        }
      }, F = {
        f: null, i: function (t, n, r) {
          return 0 === t ? n : 1 === t ? r : {width: y(t, n.width, r.width), height: y(t, n.height, r.height)}
        }, u: function (t, n) {
          return function (r) {
            var e = n(r);
            t.setAttribute("width", M(e.width)), t.setAttribute("height", M(e.height))
          }
        }
      }, O = Math.sin, T = Math.cos, q = Math.acos, C = Math.asin, P = Math.tan, j = Math.atan2, V = Math.PI / 180,
      N = 180 / Math.PI, z = Math.sqrt, R = function () {
        function t() {
          var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
            e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
            i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
            u = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
            o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
            a = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0;
          n(this, t), this.m = [r, e, i, u, o, a], this.i = null, this.w = null, this.s = null
        }
        
        return e(t, [{
          key: "point", value: function (t, n) {
            var r = this.m;
            return {x: r[0] * t + r[2] * n + r[4], y: r[1] * t + r[3] * n + r[5]}
          }
        }, {
          key: "translateSelf", value: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
              n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            if (!t && !n) return this;
            var r = this.m;
            return r[4] += r[0] * t + r[2] * n, r[5] += r[1] * t + r[3] * n, this.w = this.s = this.i = null, this
          }
        }, {
          key: "rotateSelf", value: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            if (t %= 360) {
              var n = O(t *= V), r = T(t), e = this.m, i = e[0], u = e[1];
              e[0] = i * r + e[2] * n, e[1] = u * r + e[3] * n, e[2] = e[2] * r - i * n, e[3] = e[3] * r - u * n, this.w = this.s = this.i = null
            }
            return this
          }
        }, {
          key: "scaleSelf", value: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
              n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
            if (1 !== t || 1 !== n) {
              var r = this.m;
              r[0] *= t, r[1] *= t, r[2] *= n, r[3] *= n, this.w = this.s = this.i = null
            }
            return this
          }
        }, {
          key: "skewSelf", value: function (t, n) {
            if (n %= 360, (t %= 360) || n) {
              var r = this.m, e = r[0], i = r[1], u = r[2], o = r[3];
              t && (t = P(t * V), r[2] += e * t, r[3] += i * t), n && (n = P(n * V), r[0] += u * n, r[1] += o * n), this.w = this.s = this.i = null
            }
            return this
          }
        }, {
          key: "resetSelf", value: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
              n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
              r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
              e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
              i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
              u = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0, o = this.m;
            return o[0] = t, o[1] = n, o[2] = r, o[3] = e, o[4] = i, o[5] = u, this.w = this.s = this.i = null, this
          }
        }, {
          key: "recomposeSelf", value: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
              n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
              r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
              e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
              i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null;
            return this.isIdentity || this.resetSelf(), t && (t.x || t.y) && this.translateSelf(t.x, t.y), n && this.rotateSelf(n), r && (r.x && this.skewSelf(r.x, 0), r.y && this.skewSelf(0, r.y)), !e || 1 === e.x && 1 === e.y || this.scaleSelf(e.x, e.y), i && (i.x || i.y) && this.translateSelf(i.x, i.y), this
          }
        }, {
          key: "decompose", value: function () {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
              n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r = this.m,
              e = r[0] * r[0] + r[1] * r[1], i = [[r[0], r[1]], [r[2], r[3]]], u = z(e);
            if (0 === u) return {
              origin: {x: r[4], y: r[5]},
              translate: {x: t, y: n},
              scale: {x: 0, y: 0},
              skew: {x: 0, y: 0},
              rotate: 0
            };
            i[0][0] /= u, i[0][1] /= u;
            var o = r[0] * r[3] - r[1] * r[2] < 0;
            o && (u = -u);
            var a = i[0][0] * i[1][0] + i[0][1] * i[1][1];
            i[1][0] -= i[0][0] * a, i[1][1] -= i[0][1] * a;
            var l = z(i[1][0] * i[1][0] + i[1][1] * i[1][1]);
            if (0 === l) return {
              origin: {x: r[4], y: r[5]},
              translate: {x: t, y: n},
              scale: {x: u, y: 0},
              skew: {x: 0, y: 0},
              rotate: 0
            };
            i[1][0] /= l, i[1][1] /= l, a /= l;
            var s = 0;
            return i[1][1] < 0 ? (s = q(i[1][1]) * N, i[0][1] < 0 && (s = 360 - s)) : s = C(i[0][1]) * N, o && (s = -s), a = j(a, z(i[0][0] * i[0][0] + i[0][1] * i[0][1])) * N, {
              origin: {
                x: r[4],
                y: r[5]
              }, translate: {x: t, y: n}, scale: {x: u, y: l}, skew: {x: a, y: 0}, rotate: s
            }
          }
        }, {
          key: "toString", value: function () {
            return null === this.s && (this.s = "matrix(" + this.m.map(D).join(" ") + ")"), this.s
          }
        }, {
          key: "determinant", get: function () {
            var t = this.m;
            return t[0] * t[3] - t[1] * t[2]
          }
        }, {
          key: "isIdentity", get: function () {
            if (null === this.i) {
              var t = this.m;
              this.i = 1 === t[0] && 0 === t[1] && 0 === t[2] && 1 === t[3] && 0 === t[4] && 0 === t[5]
            }
            return this.i
          }
        }]), t
      }(), L = /\.0+$/;
    
    function D(t) {
      return Number.isInteger(t) ? t : t.toFixed(14).replace(L, "")
    }
    
    Object.freeze({M: 2, L: 2, Z: 0, H: 1, V: 1, C: 6, Q: 4, T: 2, S: 4, A: 7});
    
    function U(t, n, r) {
      return t + (n - t) * r
    }
    
    function W(t, n, r) {
      var e = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], i = {x: U(t.x, n.x, r), y: U(t.y, n.y, r)};
      return e && (i.a = Y(t, n)), i
    }
    
    function Y(t, n) {
      return Math.atan2(n.y - t.y, n.x - t.x)
    }
    
    function G(t, n, r, e) {
      var i = 1 - e;
      return i * i * t + 2 * i * e * n + e * e * r
    }
    
    function H(t, n, r, e) {
      return 2 * (1 - e) * (n - t) + 2 * e * (r - n)
    }
    
    function X(t, n, r, e) {
      var i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
        u = {x: G(t.x, n.x, r.x, e), y: G(t.y, n.y, r.y, e)};
      return i && (u.a = $(t, n, r, e)), u
    }
    
    function $(t, n, r, e) {
      return Math.atan2(H(t.y, n.y, r.y, e), H(t.x, n.x, r.x, e))
    }
    
    function Q(t, n, r, e, i) {
      var u = i * i;
      return i * u * (e - t + 3 * (n - r)) + 3 * u * (t + r - 2 * n) + 3 * i * (n - t) + t
    }
    
    function Z(t, n, r, e, i) {
      var u = 1 - i;
      return 3 * (u * u * (n - t) + 2 * u * i * (r - n) + i * i * (e - r))
    }
    
    function J(t, n, r, e, i) {
      var u = arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
        o = {x: Q(t.x, n.x, r.x, e.x, i), y: Q(t.y, n.y, r.y, e.y, i)};
      return u && (o.a = K(t, n, r, e, i)), o
    }
    
    function K(t, n, r, e, i) {
      return Math.atan2(Z(t.y, n.y, r.y, e.y, i), Z(t.x, n.x, r.x, e.x, i))
    }
    
    function tt(t, n, r) {
      var e = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
      if (rt(n)) {
        if (et(r)) return X(n, r.start, r, t, e)
      } else if (rt(r)) {
        if (n.end) return X(n, n.end, r, t, e)
      } else {
        if (n.end) return r.start ? J(n, n.end, r.start, r, t, e) : X(n, n.end, r, t, e);
        if (r.start) return X(n, r.start, r, t, e)
      }
      return W(n, r, t, e)
    }
    
    function nt(t, n, r) {
      var e = tt(t, n, r, !0);
      return e.a = function (t) {
        var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return n ? t + Math.PI : t
      }(e.a) / h, e
    }
    
    function rt(t) {
      return !t.type || "corner" === t.type
    }
    
    function et(t) {
      return null != t.start && !rt(t)
    }
    
    var it = new R;
    var ut = {
      f: function (t) {
        return t ? t.join(" ") : ""
      }, i: function (n, r, e) {
        if (0 === n) return r;
        if (1 === n) return e;
        var i = r.length;
        if (i !== e.length) return v(n, r, e);
        for (var u, o = new Array(i), a = 0; a < i; a++) {
          if ((u = t(r[a])) !== t(e[a])) return v(n, r, e);
          if ("number" === u) o[a] = d(n, r[a], e[a]); else {
            if (r[a] !== e[a]) return v(n, r, e);
            o[a] = r[a]
          }
        }
        return o
      }
    }, ot = {
      f: null, i: x, u: function (t, n) {
        return function (r) {
          var e = n(r);
          t.setAttribute("x1", M(e[0])), t.setAttribute("y1", M(e[1])), t.setAttribute("x2", M(e[2])), t.setAttribute("y2", M(e[3]))
        }
      }
    }, at = {f: M, i: d}, lt = {
      f: M, i: function (t, n, r) {
        var e = d(t, n, r);
        return e <= 0 ? 0 : e >= 1 ? 1 : e
      }
    }, st = {
      f: S, i: function (t, n, r) {
        var e, i, u, o = n.length, a = r.length;
        if (o !== a) if (0 === o) n = k(o = a, 0); else if (0 === a) a = o, r = k(o, 0); else {
          var l = (u = (e = o) * (i = a) / function (t, n) {
            for (var r; n;) r = n, n = t % n, t = r;
            return t || 1
          }(e, i)) < 0 ? -u : u;
          n = A(n, Math.floor(l / o)), r = A(r, Math.floor(l / a)), o = a = l
        }
        for (var s = [], f = 0; f < o; f++) s.push(c(y(t, n[f], r[f]), 6));
        return s
      }
    };
    
    function ft(t, n, r, e, i, u, o, a) {
      return n = function (t, n, r) {
        for (var e, i, u, o = t.length - 1, a = {}, l = 0; l <= o; l++) (e = t[l]).e && (e.e = n(e.e)), e.v && "g" === (i = e.v).t && i.r && (u = r.getElementById(i.r)) && (a[i.r] = u.querySelectorAll("stop"));
        return a
      }(t, e, a), function (e) {
        var i, u = r(e, t, ct);
        return u ? "c" === u.t ? B(u.v) : "g" === u.t ? (n[u.r] && function (t, n) {
          for (var r = 0, e = t.length; r < e; r++) t[r].setAttribute("stop-color", B(n[r]))
        }(n[u.r], u.v), (i = u.r) ? "url(#" + i + ")" : "none") : "none" : "none"
      }
    }
    
    function ct(t, n, r) {
      if (0 === t) return n;
      if (1 === t) return r;
      if (n && r) {
        var e = n.t;
        if (e === r.t) switch (n.t) {
          case"c":
            return {t: e, v: b(t, n.v, r.v)};
          case"g":
            if (n.r === r.r) return {t: e, v: w(t, n.v, r.v), r: n.r}
        }
      }
      return v(t, n, r)
    }
    
    var ht = {
      blur: m, brightness: y, contrast: y, "drop-shadow": function (t, n, r) {
        return 0 === t ? n : 1 === t ? r : {
          blur: m(t, n.blur, r.blur),
          offset: g(t, n.offset, r.offset),
          color: b(t, n.color, r.color)
        }
      }, grayscale: y, "hue-rotate": d, invert: y, opacity: y, saturate: y, sepia: y
    };
    
    function vt(t, n, r) {
      if (0 === t) return n;
      if (1 === t) return r;
      var e = n.length;
      if (e !== r.length) return v(t, n, r);
      for (var i, u = [], o = 0; o < e; o++) {
        if (n[o].type !== r[o].type) return n;
        if (!(i = ht[n[o].type])) return v(t, n, r);
        u.push({type: n.type, value: i(t, n[o].value, r[o].value)})
      }
      return u
    }
    
    var dt = {
      blur: function (t) {
        return t ? function (n) {
          t.setAttribute("stdDeviation", E(n))
        } : null
      }, brightness: function (t, n, r) {
        return (t = gt(r, n)) ? function (n) {
          n = M(n), t.map((function (t) {
            return t.setAttribute("slope", n)
          }))
        } : null
      }, contrast: function (t, n, r) {
        return (t = gt(r, n)) ? function (n) {
          var r = M((1 - n) / 2);
          n = M(n), t.map((function (t) {
            t.setAttribute("slope", n), t.setAttribute("intercept", r)
          }))
        } : null
      }, "drop-shadow": function (t, n, r) {
        var e = r.getElementById(n + "-blur");
        if (!e) return null;
        var i = r.getElementById(n + "-offset");
        if (!i) return null;
        var u = r.getElementById(n + "-flood");
        return u ? function (t) {
          e.setAttribute("stdDeviation", E(t.blur)), i.setAttribute("dx", M(t.offset.x)), i.setAttribute("dy", M(t.offset.y)), u.setAttribute("flood-color", B(t.color))
        } : null
      }, grayscale: function (t) {
        return t ? function (n) {
          t.setAttribute("values", S(function (t) {
            return [.2126 + .7874 * (t = 1 - t), .7152 - .7152 * t, .0722 - .0722 * t, 0, 0, .2126 - .2126 * t, .7152 + .2848 * t, .0722 - .0722 * t, 0, 0, .2126 - .2126 * t, .7152 - .7152 * t, .0722 + .9278 * t, 0, 0, 0, 0, 0, 1, 0]
          }(n)))
        } : null
      }, "hue-rotate": function (t) {
        return t ? function (n) {
          return t.setAttribute("values", M(n))
        } : null
      }, invert: function (t, n, r) {
        return (t = gt(r, n)) ? function (n) {
          n = M(n) + " " + M(1 - n), t.map((function (t) {
            return t.setAttribute("tableValues", n)
          }))
        } : null
      }, opacity: function (t, n, r) {
        return (t = r.getElementById(n + "-A")) ? function (n) {
          return t.setAttribute("tableValues", "0 " + M(n))
        } : null
      }, saturate: function (t) {
        return t ? function (n) {
          return t.setAttribute("values", M(n))
        } : null
      }, sepia: function (t) {
        return t ? function (n) {
          return t.setAttribute("values", S(function (t) {
            return [.393 + .607 * (t = 1 - t), .769 - .769 * t, .189 - .189 * t, 0, 0, .349 - .349 * t, .686 + .314 * t, .168 - .168 * t, 0, 0, .272 - .272 * t, .534 - .534 * t, .131 + .869 * t, 0, 0, 0, 0, 0, 1, 0]
          }(n)))
        } : null
      }
    };
    var yt = ["R", "G", "B"];
    
    function gt(t, n) {
      var r = yt.map((function (r) {
        return t.getElementById(n + "-" + r) || null
      }));
      return -1 !== r.indexOf(null) ? null : r
    }
    
    var mt = {
      fill: ft,
      "fill-opacity": lt,
      stroke: ft,
      "stroke-opacity": lt,
      "stroke-width": at,
      "stroke-dashoffset": {f: M, i: d},
      "stroke-dasharray": st,
      opacity: lt,
      transform: function (n, r, e, i) {
        if (!(n = function (n, r) {
          if (!n || "object" !== t(n)) return null;
          var e = !1;
          for (var i in n) n.hasOwnProperty(i) && (n[i] && n[i].length ? (n[i].forEach((function (t) {
            t.e && (t.e = r(t.e))
          })), e = !0) : delete n[i]);
          return e ? n : null
        }(n, i))) return null;
        var u = function (t, i, u) {
          var o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
          return n[t] ? e(i, n[t], u) : r && r[t] ? r[t] : o
        };
        return r && r.a && n.o ? function (t) {
          var r = e(t, n.o, nt);
          return it.recomposeSelf(r, u("r", t, d, 0) + r.a, u("k", t, g), u("s", t, g), u("t", t, g)).toString()
        } : function (t) {
          return it.recomposeSelf(u("o", t, tt, null), u("r", t, d, 0), u("k", t, g), u("s", t, g), u("t", t, g)).toString()
        }
      },
      "#filter": function (t, n, r, e, i, u, o, a) {
        if (!n.items || !t || !t.length) return null;
        var l = function (t, n) {
          var r = (t = t.map((function (t) {
            return t && dt[t[0]] ? (n.getElementById(t[1]), dt[t[0]](n.getElementById(t[1]), t[1], n)) : null
          }))).length;
          return function (n) {
            for (var e = 0; e < r; e++) t[e] && t[e](n[e].value)
          }
        }(n.items, a);
        return l ? (t = function (t, n) {
          return t.map((function (t) {
            return t.e = n(t.e), t
          }))
        }(t, e), function (n) {
          l(r(n, t, vt))
        }) : null
      },
      "#line": ot,
      points: {f: S, i: x},
      d: ut,
      r: at,
      "#size": F,
      "#radius": I,
      _: function (t, n) {
        if (Array.isArray(t)) for (var r = 0; r < t.length; r++) this[t[r]] = n; else this[t] = n
      }
    }, pt = function () {
      function t(r) {
        n(this, t), this.list = r, this.length = r.length
      }
      
      return e(t, [{
        key: "setAttribute", value: function (t, n) {
          for (var r = this.list, e = 0; e < this.length; e++) r[e].setAttribute(t, n)
        }
      }, {
        key: "removeAttribute", value: function (t) {
          for (var n = this.list, r = 0; r < this.length; r++) n[r].removeAttribute(t)
        }
      }, {
        key: "style", value: function (t, n) {
          for (var r = this.list, e = 0; e < this.length; e++) r[e].style[t] = n
        }
      }]), t
    }(), bt = /-./g, wt = function (t, n) {
      return n.toUpperCase()
    };
    
    function xt(t) {
      return "function" == typeof t ? t : v
    }
    
    function kt(t) {
      return t ? "function" == typeof t ? t : Array.isArray(t) ? function (t) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u;
        if (!Array.isArray(t)) return n;
        switch (t.length) {
          case 1:
            return f(t[0]) || n;
          case 2:
            return f(t[0], t[1]) || n;
          case 4:
            return a(t[0], t[1], t[2], t[3]) || n
        }
        return n
      }(t, null) : function (t, n) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : u;
        switch (t) {
          case"linear":
            return u;
          case"steps":
            return f(n.steps || 1, n.jump || 0) || r;
          case"bezier":
          case"cubic-bezier":
            return a(n.x1 || 0, n.y1 || 0, n.x2 || 0, n.y2 || 0) || r
        }
        return r
      }(t.type, t.value, null) : null
    }
    
    function At(t, n, r) {
      var e = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], i = n.length - 1;
      if (t <= n[0].t) return e ? [0, 0, n[0].v] : n[0].v;
      if (t >= n[i].t) return e ? [i, 1, n[i].v] : n[i].v;
      var u, o = n[0], a = null;
      for (u = 1; u <= i; u++) {
        if (!(t > n[u].t)) {
          a = n[u];
          break
        }
        o = n[u]
      }
      return null == a ? e ? [i, 1, n[i].v] : n[i].v : o.t === a.t ? e ? [u, 1, a.v] : a.v : (t = (t - o.t) / (a.t - o.t), o.e && (t = o.e(t)), e ? [u, t, r(t, o.v, a.v)] : r(t, o.v, a.v))
    }
    
    function _t(t, n) {
      var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
      return t && t.length ? "function" != typeof n ? null : ("function" != typeof r && (r = null), function (e) {
        var i = At(e, t, n);
        return null != i && r && (i = r(i)), i
      }) : null
    }
    
    function Mt(t, n) {
      return t.t - n.t
    }
    
    function St(n, r, e, i, u) {
      var o, a = "@" === e[0], l = "#" === e[0], s = mt[e], f = v;
      switch (a ? (o = e.substr(1), e = o.replace(bt, wt)) : l && (e = e.substr(1)), t(s)) {
        case"function":
          if (f = s(i, u, At, kt, e, a, r, n), l) return f;
          break;
        case"string":
          f = _t(i, xt(s));
          break;
        case"object":
          if ((f = _t(i, xt(s.i), s.f)) && "function" == typeof s.u) return s.u(r, f, e, a, n)
      }
      return f ? function (t, n, r) {
        var e = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        if (e) return t instanceof pt ? function (e) {
          return t.style(n, r(e))
        } : function (e) {
          return t.style[n] = r(e)
        };
        if (Array.isArray(n)) {
          var i = n.length;
          return function (e) {
            var u = r(e);
            if (null == u) for (var o = 0; o < i; o++) t[o].removeAttribute(n); else for (var a = 0; a < i; a++) t[a].setAttribute(n, u)
          }
        }
        return function (e) {
          var i = r(e);
          null == i ? t.removeAttribute(n) : t.setAttribute(n, i)
        }
      }(r, e, f, a) : null
    }
    
    function Et(n, r, e, i) {
      if (!i || "object" !== t(i)) return null;
      var u = null, o = null;
      return Array.isArray(i) ? o = function (t) {
        if (!t || !t.length) return null;
        for (var n = 0; n < t.length; n++) t[n].e && (t[n].e = kt(t[n].e));
        return t.sort(Mt)
      }(i) : (o = i.keys, u = i.data || null), o ? St(n, r, e, o, u) : null
    }
    
    function Bt(t, n, r) {
      if (!r) return null;
      var e = [];
      for (var i in r) if (r.hasOwnProperty(i)) {
        var u = Et(t, n, i, r[i]);
        u && e.push(u)
      }
      return e.length ? e : null
    }
    
    function It(t, n) {
      if (!n.duration || n.duration < 0) return null;
      var r = function (t, n) {
        if (!n) return null;
        var r = [];
        if (Array.isArray(n)) for (var e = n.length, i = 0; i < e; i++) {
          var u = n[i];
          if (2 === u.length) {
            var o = null;
            if ("string" == typeof u[0]) o = t.getElementById(u[0]); else if (Array.isArray(u[0])) {
              o = [];
              for (var a = 0; a < u[0].length; a++) if ("string" == typeof u[0][a]) {
                var l = t.getElementById(u[0][a]);
                l && o.push(l)
              }
              o = o.length ? 1 === o.length ? o[0] : new pt(o) : null
            }
            if (o) {
              var s = Bt(t, o, u[1]);
              s && (r = r.concat(s))
            }
          }
        } else for (var f in n) if (n.hasOwnProperty(f)) {
          var c = t.getElementById(f);
          if (c) {
            var h = Bt(t, c, n[f]);
            h && (r = r.concat(h))
          }
        }
        return r.length ? r : null
      }(t, n.elements);
      return r ? function (t, n) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1 / 0,
          e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
          i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
          u = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 1, o = t.length, a = e > 0 ? n : 0;
        i && r % 2 == 0 && (a = n - a);
        var l = null;
        return function (s, f) {
          var c = s % n, h = 1 + (s - c) / n;
          f *= e, i && h % 2 == 0 && (f = -f);
          var v = !1;
          if (h > r) c = a, v = !0, -1 === u && (c = e > 0 ? 0 : n); else if (f < 0 && (c = n - c), c === l) return !1;
          l = c;
          for (var d = 0; d < o; d++) t[d](c);
          return v
        }
      }(r, n.duration, n.iterations || 1 / 0, n.direction || 1, !!n.alternate, n.fill || 1) : null
    }
    
    var Ft = function (t, n) {
      var r = !1, e = null;
      return function (i) {
        r && clearTimeout(r), r = setTimeout((function () {
          return function () {
            for (var i = 0, u = window.innerHeight, o = 0, a = window.innerWidth, l = t.parentNode; l instanceof Element;) {
              var s = window.getComputedStyle(l);
              if ("visible" !== s.overflowY || "visible" !== s.overflowX) {
                var f = l.getBoundingClientRect();
                "visible" !== s.overflowY && (i = Math.max(i, f.top), u = Math.min(u, f.bottom)), "visible" !== s.overflowX && (o = Math.max(o, f.left), a = Math.min(a, f.right))
              }
              if (l === l.parentNode) break;
              l = l.parentNode
            }
            r = !1;
            var c = t.getBoundingClientRect(), h = Math.min(c.height, Math.max(0, i - c.top)),
              v = Math.min(c.height, Math.max(0, c.bottom - u)), d = Math.min(c.width, Math.max(0, o - c.left)),
              y = Math.min(c.width, Math.max(0, c.right - a)), g = (c.height - h - v) / c.height,
              m = (c.width - d - y) / c.width, p = Math.round(g * m * 100);
            null !== e && e === p || (e = p, n(p))
          }()
        }), 100)
      }
    }, Ot = function () {
      function t(r, e, i) {
        n(this, t), e = Math.max(1, e || 1), e = Math.min(e, 100), this.el = r, this.onTresholdChange = i && i.call ? i : function () {
        }, this.tresholdPercent = e || 1, this.currentVisibility = null, this.visibilityCalculator = Ft(r, this.onVisibilityUpdate.bind(this)), this.bindScrollWatchers(), this.visibilityCalculator()
      }
      
      return e(t, [{
        key: "bindScrollWatchers", value: function () {
          for (var t = this.el.parentNode; t && (t.addEventListener("scroll", this.visibilityCalculator), t !== t.parentNode && t !== document);) t = t.parentNode
        }
      }, {
        key: "onVisibilityUpdate", value: function (t) {
          var n = this.currentVisibility >= this.tresholdPercent, r = t >= this.tresholdPercent;
          if (null === this.currentVisibility || n !== r) return this.currentVisibility = t, void this.onTresholdChange(r);
          this.currentVisibility = t
        }
      }]), t
    }(), Tt = function () {
      function t(r, e) {
        var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        n(this, t), this._id = 0, this._running = !1, this._rollingBack = !1, this._animations = r, this.duration = e.duration, this.alternate = e.alternate, this.fill = e.fill, this.iterations = e.iterations, this.direction = i.direction || 1, this.speed = i.speed || 1, this.fps = i.fps || 100, this.offset = i.offset || 0, this.rollbackStartOffset = 0
      }
      
      return e(t, [{
        key: "_rollback", value: function () {
          var t = this, n = 1 / 0, r = null;
          this.rollbackStartOffset = this.offset, this._rollingBack || (this._rollingBack = !0, this._running = !0);
          this._id = window.requestAnimationFrame((function e(i) {
            if (t._rollingBack) {
              null == r && (r = i);
              var u = i - r, o = t.rollbackStartOffset - u, a = Math.round(o * t.speed);
              if (a > t.duration && n != 1 / 0) {
                var l = !!t.alternate && a / t.duration % 2 > 1, s = a % t.duration;
                a = (s += l ? t.duration : 0) || t.duration
              }
              var f = t.fps ? 1e3 / t.fps : 0, c = Math.max(0, a);
              if (c < n - f) {
                t.offset = c, n = c;
                for (var h = t._animations, v = h.length, d = 0; d < v; d++) h[d](c, t.direction)
              }
              var y = !1;
              if (t.iterations > 0 && -1 === t.fill) {
                var g = t.iterations * t.duration, m = g == a;
                a = m ? 0 : a, t.offset = m ? 0 : t.offset, y = a > g
              }
              a > 0 && t.offset >= a && !y ? t._id = window.requestAnimationFrame(e) : t.stop()
            }
          }))
        }
      }, {
        key: "_start", value: function () {
          var t = this, n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, r = -1 / 0, e = null,
            i = {}, u = function u(o) {
              t._running = !0, null == e && (e = o);
              var a = Math.round((o - e + n) * t.speed), l = t.fps ? 1e3 / t.fps : 0;
              if (a > r + l && !t._rollingBack) {
                t.offset = a, r = a;
                for (var s = t._animations, f = s.length, c = 0, h = 0; h < f; h++) i[h] ? c++ : (i[h] = s[h](a, t.direction), i[h] && c++);
                if (c === f) return void t._stop()
              }
              t._id = window.requestAnimationFrame(u)
            };
          this._id = window.requestAnimationFrame(u)
        }
      }, {
        key: "_stop", value: function () {
          this._id && window.cancelAnimationFrame(this._id), this._running = !1, this._rollingBack = !1
        }
      }, {
        key: "play", value: function () {
          !this._rollingBack && this._running || (this._rollingBack = !1, this.rollbackStartOffset > this.duration && (this.offset = this.rollbackStartOffset - (this.rollbackStartOffset - this.offset) % this.duration, this.rollbackStartOffset = 0), this._start(this.offset))
        }
      }, {
        key: "stop", value: function () {
          this._stop(), this.offset = 0, this.rollbackStartOffset = 0;
          var t = this.direction, n = this._animations;
          window.requestAnimationFrame((function () {
            for (var r = 0; r < n.length; r++) n[r](0, t)
          }))
        }
      }, {
        key: "reachedToEnd", value: function () {
          return this.iterations > 0 && this.offset >= this.iterations * this.duration
        }
      }, {
        key: "restart", value: function () {
          this._stop(), this.offset = 0, this._start()
        }
      }, {
        key: "pause", value: function () {
          this._stop()
        }
      }, {
        key: "reverse", value: function () {
          this.direction = -this.direction
        }
      }], [{
        key: "build", value: function (n) {
          if (!(n = function (t) {
            if (!t || !t.root || !Array.isArray(t.animations)) return null;
            var n = window.document.getElementById(t.root);
            if (!n) return null;
            var r = t.animations.map((function (t) {
              return It(n, t)
            })).filter((function (t) {
              return !!t
            }));
            return r.length ? {
              element: n,
              animations: r,
              animationSettings: t.animationSettings,
              options: t.options || void 0
            } : null
          }(n))) return null;
          var r = n.element, e = n.options || {}, i = new t(n.animations, n.animationSettings, n.options);
          return function (t, n, r) {
            if ("click" === r.start) {
              return void n.addEventListener("click", (function () {
                switch (r.click) {
                  case"freeze":
                    return !t._running && t.reachedToEnd() && (t.offset = 0), t._running ? t.pause() : t.play();
                  case"restart":
                    return t.offset > 0 ? t.restart() : t.play();
                  case"reverse":
                    var n = !t._rollingBack && t._running, e = t.reachedToEnd();
                    return n || e && 1 === t.fill ? (t.pause(), e && (t.offset = t.duration - 1), t._rollback()) : e ? t.restart() : t.play();
                  case"none":
                  default:
                    return !t._running && t.offset ? t.restart() : t.play()
                }
              }))
            }
            if ("hover" === r.start) return n.addEventListener("mouseenter", (function () {
              return t.reachedToEnd() ? t.restart() : t.play()
            })), void n.addEventListener("mouseleave", (function () {
              switch (r.hover) {
                case"freeze":
                  return t.pause();
                case"reset":
                  return t.stop();
                case"reverse":
                  return t.pause(), t._rollback();
                case"none":
                default:
                  return
              }
            }));
            if ("scroll" === r.start) return void new Ot(n, r.scroll || 25, (function (n) {
              n ? t.reachedToEnd() ? t.restart() : t.play() : t.pause()
            }));
            t.play()
          }(i, r, e || {}), i
        }
      }]), t
    }();
    return function () {
      for (var t = 0, n = ["ms", "moz", "webkit", "o"], r = 0; r < n.length && !window.requestAnimationFrame; ++r) window.requestAnimationFrame = window[n[r] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[n[r] + "CancelAnimationFrame"] || window[n[r] + "CancelRequestAnimationFrame"];
      window.requestAnimationFrame || (window.requestAnimationFrame = function (n) {
        var r = Date.now(), e = Math.max(0, 16 - (r - t)), i = window.setTimeout((function () {
          n(r + e)
        }), e);
        return t = r + e, i
      }, window.cancelAnimationFrame = window.clearTimeout)
    }(), Tt
  }));
  