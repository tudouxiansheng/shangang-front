define([
  'exports',
  './Matrix2-f2da41d4',
  './RuntimeError-ffe03243',
  './OrientedBoundingBox-86debc5a',
], function (n, t, e, r) {
  'use strict';
  var a = {},
    i = new t.Cartesian3(),
    o = new t.Cartesian3(),
    u = new t.Cartesian3(),
    s = new t.Cartesian3(),
    C = new r.OrientedBoundingBox();
  function m(n, e, r, a, o) {
    var u = t.Cartesian3.subtract(n, e, i),
      s = t.Cartesian3.dot(r, u),
      C = t.Cartesian3.dot(a, u);
    return t.Cartesian2.fromElements(s, C, o);
  }
  (a.validOutline = function (n) {
    var e = r.OrientedBoundingBox.fromPoints(n, C).halfAxes,
      a = t.Matrix3.getColumn(e, 0, o),
      i = t.Matrix3.getColumn(e, 1, u),
      m = t.Matrix3.getColumn(e, 2, s),
      c = t.Cartesian3.magnitude(a),
      d = t.Cartesian3.magnitude(i),
      g = t.Cartesian3.magnitude(m);
    return !((0 === c && (0 === d || 0 === g)) || (0 === d && 0 === g));
  }),
    (a.computeProjectTo2DArguments = function (n, e, a, i) {
      var m,
        c,
        d = r.OrientedBoundingBox.fromPoints(n, C),
        g = d.halfAxes,
        f = t.Matrix3.getColumn(g, 0, o),
        l = t.Matrix3.getColumn(g, 1, u),
        x = t.Matrix3.getColumn(g, 2, s),
        B = t.Cartesian3.magnitude(f),
        M = t.Cartesian3.magnitude(l),
        P = t.Cartesian3.magnitude(x),
        v = Math.min(B, M, P);
      return (
        (0 !== B || (0 !== M && 0 !== P)) &&
        (0 !== M || 0 !== P) &&
        ((v !== M && v !== P) || (m = f),
        v === B ? (m = l) : v === P && (c = l),
        (v !== B && v !== M) || (c = x),
        t.Cartesian3.normalize(m, a),
        t.Cartesian3.normalize(c, i),
        t.Cartesian3.clone(d.center, e),
        !0)
      );
    }),
    (a.createProjectPointsTo2DFunction = function (n, t, e) {
      return function (r) {
        for (var a = new Array(r.length), i = 0; i < r.length; i++) a[i] = m(r[i], n, t, e);
        return a;
      };
    }),
    (a.createProjectPointTo2DFunction = function (n, t, e) {
      return function (r, a) {
        return m(r, n, t, e, a);
      };
    }),
    (n.CoplanarPolygonGeometryLibrary = a);
});
