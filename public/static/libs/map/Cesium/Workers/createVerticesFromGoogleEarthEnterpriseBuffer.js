define([
  './AxisAlignedBoundingBox-1feb0c48',
  './Transforms-7cd3197b',
  './Matrix2-f2da41d4',
  './when-229515d6',
  './TerrainEncoding-6355a4fe',
  './ComponentDatatype-17b06483',
  './OrientedBoundingBox-86debc5a',
  './RuntimeError-ffe03243',
  './WebMercatorProjection-d69cec15',
  './createTaskProcessorWorker',
  './combine-8ce3f24b',
  './AttributeCompression-0af3c035',
  './WebGLConstants-4e26b85a',
  './EllipsoidTangentPlane-b27cd2f7',
  './IntersectionTests-1b8a3cb9',
  './Plane-0421a8be',
], function (e, t, i, n, r, a, o, s, u, h, c, d, g, l, m, p) {
  'use strict';
  var v = Uint16Array.BYTES_PER_ELEMENT,
    I = Int32Array.BYTES_PER_ELEMENT,
    f = Uint32Array.BYTES_PER_ELEMENT,
    E = Float32Array.BYTES_PER_ELEMENT,
    T = Float64Array.BYTES_PER_ELEMENT;
  function C(e, t, i) {
    i = n.defaultValue(i, a.CesiumMath);
    for (var r = e.length, o = 0; o < r; ++o)
      if (i.equalsEpsilon(e[o], t, a.CesiumMath.EPSILON12)) return o;
    return -1;
  }
  var M = new i.Cartographic(),
    x = new i.Cartesian3(),
    N = new i.Cartesian3(),
    b = new i.Cartesian3(),
    S = new i.Matrix4();
  function w(e, t, r, o, s, u, h, c, d, g, l) {
    for (var m = c.length, p = 0; p < m; ++p) {
      var v = c[p],
        I = v.cartographic,
        f = v.index,
        E = e.length,
        T = I.longitude,
        C = I.latitude;
      C = a.CesiumMath.clamp(C, -a.CesiumMath.PI_OVER_TWO, a.CesiumMath.PI_OVER_TWO);
      var N = I.height - h.skirtHeight;
      (h.hMin = Math.min(h.hMin, N)),
        i.Cartographic.fromRadians(T, C, N, M),
        g && (M.longitude += d),
        g ? (p === m - 1 ? (M.latitude += l) : 0 === p && (M.latitude -= l)) : (M.latitude += d);
      var b = h.ellipsoid.cartographicToCartesian(M);
      e.push(b),
        t.push(N),
        r.push(i.Cartesian2.clone(r[f])),
        o.length > 0 && o.push(o[f]),
        s.length > 0 && s.push(s[f]),
        i.Matrix4.multiplyByPoint(h.toENU, b, x);
      var S = h.minimum,
        w = h.maximum;
      i.Cartesian3.minimumByComponent(x, S, S), i.Cartesian3.maximumByComponent(x, w, w);
      var B = h.lastBorderPoint;
      if (n.defined(B)) {
        var P = B.index;
        u.push(P, E - 1, E, E, f, P);
      }
      h.lastBorderPoint = v;
    }
  }
  return h(function (h, c) {
    (h.ellipsoid = i.Ellipsoid.clone(h.ellipsoid)), (h.rectangle = i.Rectangle.clone(h.rectangle));
    var d = (function (h, c, d, g, l, m, p, B, P, A, y) {
        var R, _, W, F, O, Y;
        n.defined(g)
          ? ((R = g.west),
            (_ = g.south),
            (W = g.east),
            (F = g.north),
            (O = g.width),
            (Y = g.height))
          : ((R = a.CesiumMath.toRadians(l.west)),
            (_ = a.CesiumMath.toRadians(l.south)),
            (W = a.CesiumMath.toRadians(l.east)),
            (F = a.CesiumMath.toRadians(l.north)),
            (O = a.CesiumMath.toRadians(g.width)),
            (Y = a.CesiumMath.toRadians(g.height)));
        var U,
          V,
          k = [_, F],
          H = [R, W],
          L = t.Transforms.eastNorthUpToFixedFrame(c, d),
          D = i.Matrix4.inverseTransformation(L, S);
        P &&
          ((U = u.WebMercatorProjection.geodeticLatitudeToMercatorAngle(_)),
          (V = 1 / (u.WebMercatorProjection.geodeticLatitudeToMercatorAngle(F) - U)));
        var G = 1 !== m,
          j = new DataView(h),
          z = Number.POSITIVE_INFINITY,
          q = Number.NEGATIVE_INFINITY,
          J = N;
        (J.x = Number.POSITIVE_INFINITY),
          (J.y = Number.POSITIVE_INFINITY),
          (J.z = Number.POSITIVE_INFINITY);
        var K = b;
        (K.x = Number.NEGATIVE_INFINITY),
          (K.y = Number.NEGATIVE_INFINITY),
          (K.z = Number.NEGATIVE_INFINITY);
        var Q,
          X,
          Z = 0,
          $ = 0,
          ee = 0;
        for (X = 0; X < 4; ++X) {
          var te = Z;
          (Q = j.getUint32(te, !0)), (te += f);
          var ie = a.CesiumMath.toRadians(180 * j.getFloat64(te, !0));
          (te += T), -1 === C(H, ie) && H.push(ie);
          var ne = a.CesiumMath.toRadians(180 * j.getFloat64(te, !0));
          (te += T), -1 === C(k, ne) && k.push(ne), (te += 2 * T);
          var re = j.getInt32(te, !0);
          (te += I), ($ += re), (ee += 3 * (re = j.getInt32(te, !0))), (Z += Q + f);
        }
        var ae = [],
          oe = [],
          se = new Array($),
          ue = new Array($),
          he = new Array($),
          ce = P ? new Array($) : [],
          de = G ? new Array($) : [],
          ge = new Array(ee),
          le = [],
          me = [],
          pe = [],
          ve = [],
          Ie = 0,
          fe = 0;
        for (Z = 0, X = 0; X < 4; ++X) {
          Q = j.getUint32(Z, !0);
          var Ee = (Z += f),
            Te = a.CesiumMath.toRadians(180 * j.getFloat64(Z, !0));
          Z += T;
          var Ce = a.CesiumMath.toRadians(180 * j.getFloat64(Z, !0));
          Z += T;
          var Me = a.CesiumMath.toRadians(180 * j.getFloat64(Z, !0)),
            xe = 0.5 * Me;
          Z += T;
          var Ne = a.CesiumMath.toRadians(180 * j.getFloat64(Z, !0)),
            be = 0.5 * Ne;
          Z += T;
          var Se = j.getInt32(Z, !0);
          Z += I;
          var we = j.getInt32(Z, !0);
          (Z += I), (Z += I);
          for (var Be = new Array(Se), Pe = 0; Pe < Se; ++Pe) {
            var Ae = Te + j.getUint8(Z++) * Me;
            M.longitude = Ae;
            var ye = Ce + j.getUint8(Z++) * Ne;
            M.latitude = ye;
            var Re = j.getFloat32(Z, !0);
            if (
              ((Z += E),
              0 !== Re && Re < y && (Re *= -Math.pow(2, A)),
              (Re *= 6371010),
              (M.height = Re),
              -1 !== C(H, Ae) || -1 !== C(k, ye))
            ) {
              var _e = C(ae, M, i.Cartographic);
              if (-1 !== _e) {
                Be[Pe] = oe[_e];
                continue;
              }
              ae.push(i.Cartographic.clone(M)), oe.push(Ie);
            }
            (Be[Pe] = Ie),
              Math.abs(Ae - R) < xe
                ? le.push({ index: Ie, cartographic: i.Cartographic.clone(M) })
                : Math.abs(Ae - W) < xe
                ? pe.push({ index: Ie, cartographic: i.Cartographic.clone(M) })
                : Math.abs(ye - _) < be
                ? me.push({ index: Ie, cartographic: i.Cartographic.clone(M) })
                : Math.abs(ye - F) < be &&
                  ve.push({ index: Ie, cartographic: i.Cartographic.clone(M) }),
              (z = Math.min(Re, z)),
              (q = Math.max(Re, q)),
              (he[Ie] = Re);
            var We = d.cartographicToCartesian(M);
            if (
              ((se[Ie] = We),
              P && (ce[Ie] = (u.WebMercatorProjection.geodeticLatitudeToMercatorAngle(ye) - U) * V),
              G)
            ) {
              var Fe = d.geodeticSurfaceNormal(We);
              de[Ie] = Fe;
            }
            i.Matrix4.multiplyByPoint(D, We, x),
              i.Cartesian3.minimumByComponent(x, J, J),
              i.Cartesian3.maximumByComponent(x, K, K);
            var Oe = (Ae - R) / (W - R);
            Oe = a.CesiumMath.clamp(Oe, 0, 1);
            var Ye = (ye - _) / (F - _);
            (Ye = a.CesiumMath.clamp(Ye, 0, 1)), (ue[Ie] = new i.Cartesian2(Oe, Ye)), ++Ie;
          }
          for (var Ue = 3 * we, Ve = 0; Ve < Ue; ++Ve, ++fe)
            (ge[fe] = Be[j.getUint16(Z, !0)]), (Z += v);
          if (Q !== Z - Ee) throw new s.RuntimeError('Invalid terrain tile.');
        }
        (se.length = Ie), (ue.length = Ie), (he.length = Ie), P && (ce.length = Ie);
        G && (de.length = Ie);
        var ke = Ie,
          He = fe,
          Le = {
            hMin: z,
            lastBorderPoint: void 0,
            skirtHeight: B,
            toENU: D,
            ellipsoid: d,
            minimum: J,
            maximum: K,
          };
        le.sort(function (e, t) {
          return t.cartographic.latitude - e.cartographic.latitude;
        }),
          me.sort(function (e, t) {
            return e.cartographic.longitude - t.cartographic.longitude;
          }),
          pe.sort(function (e, t) {
            return e.cartographic.latitude - t.cartographic.latitude;
          }),
          ve.sort(function (e, t) {
            return t.cartographic.longitude - e.cartographic.longitude;
          });
        var De = 1e-5;
        if (
          (w(se, he, ue, ce, de, ge, Le, le, -De * O, !0, -De * Y),
          w(se, he, ue, ce, de, ge, Le, me, -De * Y, !1),
          w(se, he, ue, ce, de, ge, Le, pe, De * O, !0, De * Y),
          w(se, he, ue, ce, de, ge, Le, ve, De * Y, !1),
          le.length > 0 && ve.length > 0)
        ) {
          var Ge = le[0].index,
            je = ke,
            ze = ve[ve.length - 1].index,
            qe = se.length - 1;
          ge.push(ze, qe, je, je, Ge, ze);
        }
        $ = se.length;
        var Je,
          Ke = t.BoundingSphere.fromPoints(se);
        n.defined(g) && (Je = o.OrientedBoundingBox.fromRectangle(g, z, q, d));
        for (
          var Qe = new r.EllipsoidalOccluder(d).computeHorizonCullingPointPossiblyUnderEllipsoid(
              c,
              se,
              z
            ),
            Xe = new e.AxisAlignedBoundingBox(J, K, c),
            Ze = new r.TerrainEncoding(c, Xe, Le.hMin, q, L, !1, P, G, m, p),
            $e = new Float32Array($ * Ze.stride),
            et = 0,
            tt = 0;
          tt < $;
          ++tt
        )
          et = Ze.encode($e, et, se[tt], ue[tt], he[tt], void 0, ce[tt], de[tt]);
        var it = le
            .map(function (e) {
              return e.index;
            })
            .reverse(),
          nt = me
            .map(function (e) {
              return e.index;
            })
            .reverse(),
          rt = pe
            .map(function (e) {
              return e.index;
            })
            .reverse(),
          at = ve
            .map(function (e) {
              return e.index;
            })
            .reverse();
        return (
          nt.unshift(rt[rt.length - 1]),
          nt.push(it[0]),
          at.unshift(it[it.length - 1]),
          at.push(rt[0]),
          {
            vertices: $e,
            indices: new Uint16Array(ge),
            maximumHeight: q,
            minimumHeight: z,
            encoding: Ze,
            boundingSphere3D: Ke,
            orientedBoundingBox: Je,
            occludeePointInScaledSpace: Qe,
            vertexCountWithoutSkirts: ke,
            indexCountWithoutSkirts: He,
            westIndicesSouthToNorth: it,
            southIndicesEastToWest: nt,
            eastIndicesNorthToSouth: rt,
            northIndicesWestToEast: at,
          }
        );
      })(
        h.buffer,
        h.relativeToCenter,
        h.ellipsoid,
        h.rectangle,
        h.nativeRectangle,
        h.exaggeration,
        h.exaggerationRelativeHeight,
        h.skirtHeight,
        h.includeWebMercatorT,
        h.negativeAltitudeExponentBias,
        h.negativeElevationThreshold
      ),
      g = d.vertices;
    c.push(g.buffer);
    var l = d.indices;
    return (
      c.push(l.buffer),
      {
        vertices: g.buffer,
        indices: l.buffer,
        numberOfAttributes: d.encoding.stride,
        minimumHeight: d.minimumHeight,
        maximumHeight: d.maximumHeight,
        boundingSphere3D: d.boundingSphere3D,
        orientedBoundingBox: d.orientedBoundingBox,
        occludeePointInScaledSpace: d.occludeePointInScaledSpace,
        encoding: d.encoding,
        vertexCountWithoutSkirts: d.vertexCountWithoutSkirts,
        indexCountWithoutSkirts: d.indexCountWithoutSkirts,
        westIndicesSouthToNorth: d.westIndicesSouthToNorth,
        southIndicesEastToWest: d.southIndicesEastToWest,
        eastIndicesNorthToSouth: d.eastIndicesNorthToSouth,
        northIndicesWestToEast: d.northIndicesWestToEast,
      }
    );
  });
});
