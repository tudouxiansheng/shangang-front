define([
  './when-229515d6',
  './Matrix2-f2da41d4',
  './Transforms-7cd3197b',
  './ComponentDatatype-17b06483',
  './RuntimeError-ffe03243',
  './GeometryAttribute-80036e07',
  './GeometryAttributes-b253752a',
  './IndexDatatype-b10faa0b',
  './WallGeometryLibrary-fb5b94e4',
  './combine-8ce3f24b',
  './WebGLConstants-4e26b85a',
  './arrayRemoveDuplicates-bb548aa3',
  './PolylinePipeline-a3ba6f24',
  './EllipsoidGeodesic-43ba18de',
  './EllipsoidRhumbLine-afd6cd20',
  './IntersectionTests-1b8a3cb9',
  './Plane-0421a8be',
], function (e, i, t, a, n, r, o, s, l, m, d, u, p, f, h, c, g) {
  'use strict';
  var y = new i.Cartesian3(),
    v = new i.Cartesian3();
  function b(t) {
    var n = (t = e.defaultValue(t, e.defaultValue.EMPTY_OBJECT)).positions,
      r = t.maximumHeights,
      o = t.minimumHeights,
      s = e.defaultValue(t.granularity, a.CesiumMath.RADIANS_PER_DEGREE),
      l = e.defaultValue(t.ellipsoid, i.Ellipsoid.WGS84);
    (this._positions = n),
      (this._minimumHeights = o),
      (this._maximumHeights = r),
      (this._granularity = s),
      (this._ellipsoid = i.Ellipsoid.clone(l)),
      (this._workerName = 'createWallOutlineGeometry');
    var m = 1 + n.length * i.Cartesian3.packedLength + 2;
    e.defined(o) && (m += o.length),
      e.defined(r) && (m += r.length),
      (this.packedLength = m + i.Ellipsoid.packedLength + 1);
  }
  b.pack = function (t, a, n) {
    var r;
    n = e.defaultValue(n, 0);
    var o = t._positions,
      s = o.length;
    for (a[n++] = s, r = 0; r < s; ++r, n += i.Cartesian3.packedLength)
      i.Cartesian3.pack(o[r], a, n);
    var l = t._minimumHeights;
    if (((s = e.defined(l) ? l.length : 0), (a[n++] = s), e.defined(l)))
      for (r = 0; r < s; ++r) a[n++] = l[r];
    var m = t._maximumHeights;
    if (((s = e.defined(m) ? m.length : 0), (a[n++] = s), e.defined(m)))
      for (r = 0; r < s; ++r) a[n++] = m[r];
    return (
      i.Ellipsoid.pack(t._ellipsoid, a, n), (a[(n += i.Ellipsoid.packedLength)] = t._granularity), a
    );
  };
  var _ = i.Ellipsoid.clone(i.Ellipsoid.UNIT_SPHERE),
    E = {
      positions: void 0,
      minimumHeights: void 0,
      maximumHeights: void 0,
      ellipsoid: _,
      granularity: void 0,
    };
  return (
    (b.unpack = function (t, a, n) {
      var r;
      a = e.defaultValue(a, 0);
      var o,
        s,
        l = t[a++],
        m = new Array(l);
      for (r = 0; r < l; ++r, a += i.Cartesian3.packedLength) m[r] = i.Cartesian3.unpack(t, a);
      if ((l = t[a++]) > 0) for (o = new Array(l), r = 0; r < l; ++r) o[r] = t[a++];
      if ((l = t[a++]) > 0) for (s = new Array(l), r = 0; r < l; ++r) s[r] = t[a++];
      var d = i.Ellipsoid.unpack(t, a, _),
        u = t[(a += i.Ellipsoid.packedLength)];
      return e.defined(n)
        ? ((n._positions = m),
          (n._minimumHeights = o),
          (n._maximumHeights = s),
          (n._ellipsoid = i.Ellipsoid.clone(d, n._ellipsoid)),
          (n._granularity = u),
          n)
        : ((E.positions = m),
          (E.minimumHeights = o),
          (E.maximumHeights = s),
          (E.granularity = u),
          new b(E));
    }),
    (b.fromConstantHeights = function (i) {
      var t,
        a,
        n = (i = e.defaultValue(i, e.defaultValue.EMPTY_OBJECT)).positions,
        r = i.minimumHeight,
        o = i.maximumHeight,
        s = e.defined(r),
        l = e.defined(o);
      if (s || l) {
        var m = n.length;
        (t = s ? new Array(m) : void 0), (a = l ? new Array(m) : void 0);
        for (var d = 0; d < m; ++d) s && (t[d] = r), l && (a[d] = o);
      }
      return new b({ positions: n, maximumHeights: a, minimumHeights: t, ellipsoid: i.ellipsoid });
    }),
    (b.createGeometry = function (n) {
      var m = n._positions,
        d = n._minimumHeights,
        u = n._maximumHeights,
        p = n._granularity,
        f = n._ellipsoid,
        h = l.WallGeometryLibrary.computePositions(f, m, u, d, p, !1);
      if (e.defined(h)) {
        var c,
          g = h.bottomPositions,
          b = h.topPositions,
          _ = b.length,
          E = 2 * _,
          C = new Float64Array(E),
          H = 0;
        for (_ /= 3, c = 0; c < _; ++c) {
          var A = 3 * c,
            w = i.Cartesian3.fromArray(b, A, y),
            k = i.Cartesian3.fromArray(g, A, v);
          (C[H++] = k.x),
            (C[H++] = k.y),
            (C[H++] = k.z),
            (C[H++] = w.x),
            (C[H++] = w.y),
            (C[H++] = w.z);
        }
        var x = new o.GeometryAttributes({
            position: new r.GeometryAttribute({
              componentDatatype: a.ComponentDatatype.DOUBLE,
              componentsPerAttribute: 3,
              values: C,
            }),
          }),
          G = E / 3;
        E = 2 * G - 4 + G;
        var L = s.IndexDatatype.createTypedArray(G, E),
          P = 0;
        for (c = 0; c < G - 2; c += 2) {
          var T = c,
            D = c + 2,
            V = i.Cartesian3.fromArray(C, 3 * T, y),
            I = i.Cartesian3.fromArray(C, 3 * D, v);
          if (!i.Cartesian3.equalsEpsilon(V, I, a.CesiumMath.EPSILON10)) {
            var R = c + 1,
              S = c + 3;
            (L[P++] = R), (L[P++] = T), (L[P++] = R), (L[P++] = S), (L[P++] = T), (L[P++] = D);
          }
        }
        return (
          (L[P++] = G - 2),
          (L[P++] = G - 1),
          new r.Geometry({
            attributes: x,
            indices: L,
            primitiveType: r.PrimitiveType.LINES,
            boundingSphere: new t.BoundingSphere.fromVertices(C),
          })
        );
      }
    }),
    function (t, a) {
      return (
        e.defined(a) && (t = b.unpack(t, a)),
        (t._ellipsoid = i.Ellipsoid.clone(t._ellipsoid)),
        b.createGeometry(t)
      );
    }
  );
});
