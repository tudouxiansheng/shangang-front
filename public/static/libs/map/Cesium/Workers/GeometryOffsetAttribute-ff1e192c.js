define(['exports', './RuntimeError-ffe03243', './when-229515d6'], function (e, t, r) {
  'use strict';
  var f = Object.freeze({ NONE: 0, TOP: 1, ALL: 2 });
  (e.GeometryOffsetAttribute = f),
    (e.arrayFill = function (e, t, f, a) {
      if ('function' == typeof e.fill) return e.fill(t, f, a);
      for (
        var n = e.length >>> 0,
          i = r.defaultValue(f, 0),
          u = i < 0 ? Math.max(n + i, 0) : Math.min(i, n),
          l = r.defaultValue(a, n),
          o = l < 0 ? Math.max(n + l, 0) : Math.min(l, n);
        u < o;

      )
        (e[u] = t), u++;
      return e;
    });
});
