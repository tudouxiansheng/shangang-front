define([
  './AttributeCompression-0af3c035',
  './Matrix2-f2da41d4',
  './ComponentDatatype-17b06483',
  './createTaskProcessorWorker',
  './RuntimeError-ffe03243',
  './when-229515d6',
  './WebGLConstants-4e26b85a',
], function (a, e, r, t, n, i, o) {
  'use strict';
  var s = 32767,
    u = new e.Cartographic(),
    c = new e.Cartesian3(),
    p = new e.Rectangle(),
    f = new e.Ellipsoid(),
    l = { min: void 0, max: void 0 };
  return t(function (t, n) {
    var i = new Uint16Array(t.positions);
    !(function (a) {
      a = new Float64Array(a);
      var r = 0;
      (l.min = a[r++]),
        (l.max = a[r++]),
        e.Rectangle.unpack(a, r, p),
        (r += e.Rectangle.packedLength),
        e.Ellipsoid.unpack(a, r, f);
    })(t.packedBuffer);
    var o = p,
      m = f,
      h = l.min,
      d = l.max,
      C = i.length / 3,
      g = i.subarray(0, C),
      b = i.subarray(C, 2 * C),
      w = i.subarray(2 * C, 3 * C);
    a.AttributeCompression.zigZagDeltaDecode(g, b, w);
    for (var v = new Float64Array(i.length), k = 0; k < C; ++k) {
      var y = g[k],
        A = b[k],
        R = w[k],
        x = r.CesiumMath.lerp(o.west, o.east, y / s),
        M = r.CesiumMath.lerp(o.south, o.north, A / s),
        D = r.CesiumMath.lerp(h, d, R / s),
        E = e.Cartographic.fromRadians(x, M, D, u),
        F = m.cartographicToCartesian(E, c);
      e.Cartesian3.pack(F, v, 3 * k);
    }
    return n.push(v.buffer), { positions: v.buffer };
  });
});
