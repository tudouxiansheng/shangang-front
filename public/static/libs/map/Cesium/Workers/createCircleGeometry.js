define([
  './Matrix2-f2da41d4',
  './RuntimeError-ffe03243',
  './when-229515d6',
  './EllipseGeometry-0fca35c1',
  './VertexFormat-565d6a6c',
  './ComponentDatatype-17b06483',
  './WebGLConstants-4e26b85a',
  './GeometryOffsetAttribute-ff1e192c',
  './Transforms-7cd3197b',
  './combine-8ce3f24b',
  './EllipseGeometryLibrary-69f5ff56',
  './GeometryAttribute-80036e07',
  './GeometryAttributes-b253752a',
  './GeometryInstance-16601d2a',
  './GeometryPipeline-5b3fba53',
  './AttributeCompression-0af3c035',
  './EncodedCartesian3-d4f305ce',
  './IndexDatatype-b10faa0b',
  './IntersectionTests-1b8a3cb9',
  './Plane-0421a8be',
], function (e, t, i, r, o, a, n, l, s, m, d, c, u, p, y, _, G, x, f, h) {
  'use strict';
  function g(e) {
    var t = (e = i.defaultValue(e, i.defaultValue.EMPTY_OBJECT)).radius,
      o = {
        center: e.center,
        semiMajorAxis: t,
        semiMinorAxis: t,
        ellipsoid: e.ellipsoid,
        height: e.height,
        extrudedHeight: e.extrudedHeight,
        granularity: e.granularity,
        vertexFormat: e.vertexFormat,
        stRotation: e.stRotation,
        shadowVolume: e.shadowVolume,
      };
    (this._ellipseGeometry = new r.EllipseGeometry(o)), (this._workerName = 'createCircleGeometry');
  }
  (g.packedLength = r.EllipseGeometry.packedLength),
    (g.pack = function (e, t, i) {
      return r.EllipseGeometry.pack(e._ellipseGeometry, t, i);
    });
  var b = new r.EllipseGeometry({ center: new e.Cartesian3(), semiMajorAxis: 1, semiMinorAxis: 1 }),
    v = {
      center: new e.Cartesian3(),
      radius: void 0,
      ellipsoid: e.Ellipsoid.clone(e.Ellipsoid.UNIT_SPHERE),
      height: void 0,
      extrudedHeight: void 0,
      granularity: void 0,
      vertexFormat: new o.VertexFormat(),
      stRotation: void 0,
      semiMajorAxis: void 0,
      semiMinorAxis: void 0,
      shadowVolume: void 0,
    };
  return (
    (g.unpack = function (t, a, n) {
      var l = r.EllipseGeometry.unpack(t, a, b);
      return (
        (v.center = e.Cartesian3.clone(l._center, v.center)),
        (v.ellipsoid = e.Ellipsoid.clone(l._ellipsoid, v.ellipsoid)),
        (v.height = l._height),
        (v.extrudedHeight = l._extrudedHeight),
        (v.granularity = l._granularity),
        (v.vertexFormat = o.VertexFormat.clone(l._vertexFormat, v.vertexFormat)),
        (v.stRotation = l._stRotation),
        (v.shadowVolume = l._shadowVolume),
        i.defined(n)
          ? ((v.semiMajorAxis = l._semiMajorAxis),
            (v.semiMinorAxis = l._semiMinorAxis),
            (n._ellipseGeometry = new r.EllipseGeometry(v)),
            n)
          : ((v.radius = l._semiMajorAxis), new g(v))
      );
    }),
    (g.createGeometry = function (e) {
      return r.EllipseGeometry.createGeometry(e._ellipseGeometry);
    }),
    (g.createShadowVolume = function (e, t, i) {
      var r = e._ellipseGeometry._granularity,
        a = e._ellipseGeometry._ellipsoid,
        n = t(r, a),
        l = i(r, a);
      return new g({
        center: e._ellipseGeometry._center,
        radius: e._ellipseGeometry._semiMajorAxis,
        ellipsoid: a,
        stRotation: e._ellipseGeometry._stRotation,
        granularity: r,
        extrudedHeight: n,
        height: l,
        vertexFormat: o.VertexFormat.POSITION_ONLY,
        shadowVolume: !0,
      });
    }),
    Object.defineProperties(g.prototype, {
      rectangle: {
        get: function () {
          return this._ellipseGeometry.rectangle;
        },
      },
      textureCoordinateRotationPoints: {
        get: function () {
          return this._ellipseGeometry.textureCoordinateRotationPoints;
        },
      },
    }),
    function (t, r) {
      return (
        i.defined(r) && (t = g.unpack(t, r)),
        (t._ellipseGeometry._center = e.Cartesian3.clone(t._ellipseGeometry._center)),
        (t._ellipseGeometry._ellipsoid = e.Ellipsoid.clone(t._ellipseGeometry._ellipsoid)),
        g.createGeometry(t)
      );
    }
  );
});
