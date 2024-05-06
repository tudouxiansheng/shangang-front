Cesium.defineProperties = Object.defineProperties;
defineProperties = Object.defineProperties;
! function (e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("cesium/Cesium"), require("mapv"), require("echarts"), require("jquery"), require("@turf/turf")) : "function" == typeof define && define.amd ? define(["cesium/Cesium", "mapv", "echarts", "jquery", "@turf/turf"], t) : "object" == typeof exports ? exports.wutu3d = t(require("cesium/Cesium"), require("mapv"), require("echarts"), require("jquery"), require("@turf/turf")) : e.wutu3d = t(e.Cesium, e.mapv, e.echarts, e.jQuery, e.turf)
}("undefined" != typeof self ? self : this, function (__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_166__, __WEBPACK_EXTERNAL_MODULE_163__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_12__) {
    return function (e) {
        function t(r) {
            if (i[r]) return i[r].exports;
            var n = i[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(n.exports, n, n.exports, t), n.l = !0, n.exports
        }
        var i = {};
        return t.m = e, t.c = i, t.d = function (e, i, r) {
            t.o(e, i) || Object.defineProperty(e, i, {
                configurable: !1,
                enumerable: !0,
                get: r
            })
        }, t.n = function (e) {
            var i = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return t.d(i, "a", i), i
        }, t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = "", t(t.s = 60)
    }([function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_0__
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            return Number(e.toFixed(t || 0))
        }

        function o(e) {
            var t = x.Cartographic.fromCartesian(e),
                i = {};
            return i.y = n(x.Math.toDegrees(t.latitude), 6), i.x = n(x.Math.toDegrees(t.longitude), 6), i.z = n(t.height, 2), i
        }

        function a(e) {
            var t = n(x.Math.toDegrees(e.west), 6),
                i = n(x.Math.toDegrees(e.east), 6),
                r = n(x.Math.toDegrees(e.north), 6);
            return {
                xmin: t,
                xmax: i,
                ymin: n(x.Math.toDegrees(e.south), 6),
                ymax: r
            }
        }

        function s(e, t) {
            null == t && (t = 0);
            var i = t;
            if (null == e || 0 == e.length) return i;
            for (var r = 0; r < e.length; r++) {
                var o = x.Cartographic.fromCartesian(e[r]);
                o.height > i && (i = o.height)
            }
            return n(i, 2)
        }

        function l(e, t) {
            for (var i = [], r = 0, n = e.length; r < n - 1; ++r) {
                var o = x.Cartesian3.midpoint(e[r], e[r + 1], new x.Cartesian3);
                i.push(e[r]), i.push(o)
            }
            return i.push(e[e.length - 1]), t > 1 ? (t--, l(i, t)) : i
        }

        function u(e, t) {
            for (var i = [], r = 0; r < e.length; r++) i.push(e[r].clone());
            for (var n, o, a, s, l, u, c, h = 0, d = 9999, f = Math.PI / Math.pow(2, 11) / 64, p = new x.PolygonGeometry.fromPositions({
                    positions: i,
                    vertexFormat: x.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
                    granularity: f
                }), m = new x.PolygonGeometry.createGeometry(p), r = 0; r < m.indices.length; r += 3) n = m.indices[r], o = m.indices[r + 1], a = m.indices[r + 2], c = new x.Cartesian3(m.attributes.position.values[3 * n], m.attributes.position.values[3 * n + 1], m.attributes.position.values[3 * n + 2]), s = t.globe.getHeight(x.Cartographic.fromCartesian(c)), d > s && (d = s), h < s && (h = s), c = new x.Cartesian3(m.attributes.position.values[3 * o], m.attributes.position.values[3 * o + 1], m.attributes.position.values[3 * o + 2]), l = t.globe.getHeight(x.Cartographic.fromCartesian(c)), d > l && (d = l), h < l && (h = l), c = new x.Cartesian3(m.attributes.position.values[3 * a], m.attributes.position.values[3 * a + 1], m.attributes.position.values[3 * a + 2]), u = t.globe.getHeight(x.Cartographic.fromCartesian(c)), d > u && (d = u), h < u && (h = u);
            return {
                maxHeight: h,
                minHeight: d
            }
        }

        function c(e, t) {
            if (t = Number(t) || 0, isNaN(t) || 0 == t) return e;
            if (e instanceof Array) {
                for (var i = [], r = 0, n = e.length; r < n; r++) {
                    var o = x.Cartographic.fromCartesian(e[r]),
                        a = x.Cartesian3.fromRadians(o.longitude, o.latitude, o.height + t);
                    i.push(a)
                }
                return i
            }
            var o = x.Cartographic.fromCartesian(e);
            return x.Cartesian3.fromRadians(o.longitude, o.latitude, o.height + t)
        }

        function h(e, t) {
            if (t = Number(t) || 0, e instanceof Array) {
                for (var i = [], r = 0, n = e.length; r < n; r++) {
                    var o = x.Cartographic.fromCartesian(e[r]),
                        a = x.Cartesian3.fromRadians(o.longitude, o.latitude, t);
                    i.push(a)
                }
                return i
            }
            var o = x.Cartographic.fromCartesian(e);
            return x.Cartesian3.fromRadians(o.longitude, o.latitude, t)
        }

        function d(e, t, i) {
            var r = x.Cartographic.fromCartesian(t);
            if (x.defined((0, R.pick3DTileset)(e, t))) {
                var n = e.scene.sampleHeight(r);
                if (x.defined(n) && n > -1e3) {
                    i && (n += r.height);
                    var o = x.Cartesian3.fromRadians(r.longitude, r.latitude, n);
                    return o
                }
            }
            var a = e.scene.globe.getHeight(r);
            if (x.defined(a) && a > -1e3) {
                i && (a += r.height);
                var o = x.Cartesian3.fromRadians(r.longitude, r.latitude, a);
                return o
            }
            return t
        }

        function f(e) {
            L.start(e)
        }

        function p(e, t) {
            if (x.defined(e.id)) {
                var i = e.id;
                if (i._noMousePosition) return !1;
                if (t && i == t) return !1
            }
            if (x.defined(e.primitive)) {
                var r = e.primitive;
                if (r._noMousePosition) return !1;
                if (t && r == t) return !1
            }
            return !0
        }

        function m(e, t, i) {
            var r, n;
            try {
                n = e.pick(t, 5, 5)
            } catch (e) {}
            if (e.pickPositionSupported && x.defined(n) && p(n, i)) {
                var r = e.pickPosition(t);
                if (x.defined(r)) {
                    var o = x.Cartographic.fromCartesian(r);
                    if (o.height >= 0) return r;
                    if (!x.defined(n.id) && o.height >= -500) return r
                }
            }
            if (x.defined(x.S3MTilesLayer)) {
                var r = e.pickPosition(t);
                if (x.defined(r)) return r
            }
            if (e.mode === x.SceneMode.SCENE3D) {
                var a = e.camera.getPickRay(t);
                r = e.globe.pick(a, e)
            } else r = e.camera.pickEllipsoid(t, e.globe.ellipsoid);
            if (x.defined(r) && e.camera.positionCartographic.height < 1e4) {
                var o = x.Cartographic.fromCartesian(r);
                if (o.height < -5e3) return null
            }
            return r
        }

        function g(e, t) {
            var i = v(e.scene);
            x.defined(i) || (i = d(e, e.scene.camera.positionWC));
            var r = o(i);
            return t && (r = e.wutu.point2wgs(r)), r
        }

        function v(e) {
            var t = e.canvas,
                i = new x.Cartesian2(t.clientWidth / 2, t.clientHeight / 2),
                r = e.camera.getPickRay(i),
                n = e.globe.pick(r, e);
            return n || (n = e.camera.pickEllipsoid(i)), n
        }

        function y(e, t) {
            t = t || {};
            var i = {
                xmin: 0,
                xmax: 0,
                ymin: 0,
                ymax: 0
            };
            if (e instanceof x.Viewer) {
                i = {
                    xmin: 70,
                    xmax: 140,
                    ymin: 0,
                    ymax: 55
                };
                var r = e,
                    n = r.scene,
                    o = n.globe.ellipsoid,
                    a = n.canvas,
                    s = r.camera.pickEllipsoid(new x.Cartesian2(0, 0), o);
                if (s) {
                    var l = o.cartesianToCartographic(s);
                    i.xmin = x.Math.toDegrees(l.longitude), i.ymax = x.Math.toDegrees(l.latitude)
                } else {
                    for (var u, c = a.width / 2, h = a.height / 2, d = 0; d <= h; d += 10) {
                        var f = d <= c ? d : c;
                        if (u = r.camera.pickEllipsoid(new x.Cartesian2(f, d), o)) break
                    }
                    if (u) {
                        var l = o.cartesianToCartographic(u);
                        i.xmin = x.Math.toDegrees(l.longitude), i.ymax = x.Math.toDegrees(l.latitude)
                    }
                }
                var p = r.camera.pickEllipsoid(new x.Cartesian2(a.width, a.height), o);
                if (p) {
                    var m = o.cartesianToCartographic(p);
                    i.xmax = x.Math.toDegrees(m.longitude), i.ymin = x.Math.toDegrees(m.latitude)
                } else {
                    for (var g, c = a.width / 2, h = a.height / 2, d = a.height; d >= h; d -= 10) {
                        var f = d >= c ? d : c;
                        if (g = r.camera.pickEllipsoid(new x.Cartesian2(f, d), o)) break
                    }
                    if (g) {
                        var m = o.cartesianToCartographic(g);
                        i.xmax = x.Math.toDegrees(m.longitude), i.ymin = x.Math.toDegrees(m.latitude)
                    }
                }
                if (t.isToWgs) {
                    var v = r.wutu.point2wgs({
                        x: i.xmin,
                        y: i.ymin
                    });
                    i.xmin = v.x, i.ymin = v.y;
                    var y = r.wutu.point2wgs({
                        x: i.xmax,
                        y: i.ymax
                    });
                    i.xmax = y.x, i.ymax = y.y
                }
            } else if (e instanceof x.Entity) {
                var _ = O.toGeoJSON(e),
                    w = E.bbox(_);
                i = {
                    xmin: w[0],
                    ymin: w[1],
                    xmax: w[2],
                    ymax: w[3]
                }
            } else {
                var w = E.bbox(e);
                i = {
                    xmin: w[0],
                    ymin: w[1],
                    xmax: w[2],
                    ymax: w[3]
                }
            }
            if (i.xmax < i.xmin) {
                var b = i.xmax;
                i.xmax = i.xmin, i.xmin = b
            }
            if (i.ymax < i.ymin) {
                var b = i.ymax;
                i.ymax = i.ymin, i.ymin = b
            }
            if (t.scale) {
                var C = (i.xmax - i.xmin) * t.scale;
                i.xmin -= C, i.xmax += C;
                var P = (i.ymax - i.ymin) * t.scale;
                i.ymin -= P, i.ymax += P
            }
            return i
        }

        function _(e, t) {
            var i = e.camera,
                r = i.positionCartographic,
                o = {};
            return o.y = n(x.Math.toDegrees(r.latitude), 6), o.x = n(x.Math.toDegrees(r.longitude), 6), o.z = n(r.height, 2), o.heading = n(x.Math.toDegrees(i.heading || -90), 1), o.pitch = n(x.Math.toDegrees(i.pitch || 0), 1), o.roll = n(x.Math.toDegrees(i.roll || 0), 1), t && (o = e.wutu.point2wgs(o)), o
        }

        function w(e, t) {
            try {
                null == t && (t = s(e));
                var i = T.cartesians2lonlats(e);
                i.push(i[0]);
                var r = E.centerOfMass(E.polygon([i]));
                return x.Cartesian3.fromDegrees(r.geometry.coordinates[0], r.geometry.coordinates[1], t)
            } catch (t) {
                return e[Math.floor(e.length / 2)]
            }
        }

        function b(e, t) {
            if (!t || !e) return !1;
            if (t.rectangle) {
                var i = t.rectangle.coordinates.getValue();
                return x.Rectangle.contains(i, x.Cartographic.fromCartesian(e))
            }
            if (t.ellipse) {
                var r = t.position.getValue();
                r = h(r, 0);
                var n = t.ellipse.semiMajorAxis.getValue();
                return x.Cartesian3.distance(r, e) <= n
            }
            if (t.polygon) {
                var a = o(e),
                    s = E.point([a.x, a.y, a.z]),
                    l = k.toGeoJSON(t);
                return E.booleanPointInPolygon(s, l)
            }
            return !1
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.aroundPoint = t.windingPoint = void 0, t.formatNum = n, t.formatPosition = o, t.formatRectangle = a, t.getMaxHeight = s, t.splitPositions = l, t.computePolygonHeightRange = u, t.addPositionsHeight = c, t.setPositionsHeight = h, t.updateHeightForClampToGround = d, t.terrainPolyline = f, t.getCurrentMousePosition = m, t.getCenter = g, t.pickCenterPoint = v, t.getExtent = y, t.getCameraView = _, t.centerOfMass = w, t.isInPoly = b;
        var C = i(0),
            x = r(C),
            P = i(12),
            E = r(P),
            M = i(3),
            T = r(M),
            S = i(20),
            O = r(S),
            D = i(11),
            k = r(D),
            A = i(18),
            R = i(26),
            L = {
                start: function (e) {
                    this.params = e, this.viewer = e.viewer;
                    var t = e.positions;
                    if (null == t || 0 == t.length) return void this.end(t);
                    var i = x.defaultValue(e.has3dtiles, x.defined((0, R.pick3DTileset)(this.viewer, t))),
                        r = (0, A.hasTerrain)(this.viewer);
                    if (!r && !i) return void this.end(t);
                    i && (e.splitNum = x.defaultValue(e.splitNum, 5)), t = l(t, e.splitNum), this._has3dtiles = i, r ? this.clampToTerrain(t) : this.clampTo3DTileset(t)
                },
                clampToTerrain: function (e) {
                    var t, i = this.viewer.scene.globe.ellipsoid;
                    if (x.defaultValue(this.params.generateArc, !0)) {
                        var r = x.PolylinePipeline.generateArc({
                            positions: e,
                            granularity: this.params.granularity || 1e-5
                        });
                        t = [];
                        for (var n = 0; n < r.length; n += 3) {
                            var o = x.Cartesian3.unpack(r, n);
                            t.push(i.cartesianToCartographic(o))
                        }
                    } else t = i.cartesianArrayToCartographicArray(e);
                    var a = x.Cartographic.fromCartesian(e[0]).height,
                        s = this;
                    x.when(x.sampleTerrainMostDetailed(this.viewer.terrainProvider, t), function (e) {
                        for (var t = !1, r = s.params.offset || 2, n = 0; n < e.length; ++n) null == e[n].height ? (t = !0, e[n].height = a) : e[n].height = r + e[n].height * s.viewer.scene._terrainExaggeration;
                        var o = i.cartographicArrayToCartesianArray(e);
                        s._has3dtiles ? s.clampTo3DTileset(o) : s.end(o, t)
                    })
                },
                clampTo3DTileset: function (e) {
                    var t = this;
                    this.viewer.scene.clampToHeightMostDetailed(e).then(function (e) {
                        t.end(e)
                    })
                },
                end: function (e, t) {
                    this.params.calback ? this.params.calback(e, t) : this.positions && this.positions.setValue && this.positions.setValue(e)
                }
            };
        t.windingPoint = {
            isStart: !1,
            viewer: null,
            start: function (e, t) {
                this.viewer = e, t && t instanceof x.Cartesian3 ? this.position = t : (t || (t = g(e)), this.position = x.Cartesian3.fromDegrees(t.x, t.y, t.z)), this.distance = t.distance || x.Cartesian3.distance(this.position, e.camera.positionWC), this.angle = 360 / (t.time || 60), this.time = e.clock.currentTime.clone(), this.heading = e.camera.heading, this.pitch = e.camera.pitch, this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this), this.isStart = !0
            },
            clock_onTickHandler: function (e) {
                var t = x.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time),
                    i = x.Math.toRadians(t * this.angle) + this.heading;
                this.viewer.scene.camera.setView({
                    destination: this.position,
                    orientation: {
                        heading: i,
                        pitch: this.pitch
                    }
                }), this.viewer.scene.camera.moveBackward(this.distance)
            },
            stop: function () {
                this.isStart && (this.viewer && this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this), this.isStart = !1)
            }
        }, t.aroundPoint = {
            isStart: !1,
            viewer: null,
            start: function (e, t) {
                this.viewer = e, t && t instanceof x.Cartesian3 ? this.position = t : (t || (t = g(e)), this.position = x.Cartesian3.fromDegrees(t.x, t.y, t.z)), this.angle = 360 / (t.time || 60), this.time = e.clock.currentTime.clone(), this.heading = e.camera.heading, this.pitch = e.camera.pitch, this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this), this.isStart = !0
            },
            clock_onTickHandler: function (e) {
                var t = x.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time),
                    i = x.Math.toRadians(t * this.angle) + this.heading;
                this.viewer.scene.camera.setView({
                    orientation: {
                        heading: i,
                        pitch: this.pitch
                    }
                })
            },
            stop: function () {
                this.isStart && (this.viewer && this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this), this.isStart = !1)
            }
        }
    }, function (module, exports, __webpack_require__) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function isNumber(e) {
            return "number" == typeof e && e.constructor == Number
        }

        function isString(e) {
            return "string" == typeof e && e.constructor == String
        }

        function getLength(e) {
            if (!Cesium.defined(e) || e.length < 2) return 0;
            for (var t = 0, i = 1, r = e.length; i < r; i++) t += Cesium.Cartesian3.distance(e[i - 1], e[i]);
            return t
        }

        function formatLength(e, t) {
            if (null == e) return "";
            null != t && "auto" != t || (t = e < 1e3 ? "m" : "km");
            var i = "";
            switch (t) {
                default:
                case "m":
                    i = e.toFixed(2) + "米";
                    break;
                case "km":
                    i = (.001 * e).toFixed(2) + "公里";
                    break;
                case "mile":
                    i = (54e-5 * e).toFixed(2) + "海里";
                    break;
                case "zhang":
                    i = (.3 * e).toFixed(2) + "丈"
            }
            return i
        }

        function getArea(e, t) {
            var i = Util.cartesians2lonlats(e);
            return !t && i.length > 0 && i.push(i[0]), turf.area({
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [i]
                }
            })
        }

        function formatArea(e, t) {
            if (null == e) return "";
            null != t && "auto" != t || (t = e < 1e6 ? "m" : "km");
            var i = "";
            switch (t) {
                default:
                case "m":
                    i = e.toFixed(2) + "平方米";
                    break;
                case "km":
                    i = (e / 1e6).toFixed(2) + "平方公里";
                    break;
                case "mu":
                    i = (.0015 * e).toFixed(2) + "亩";
                    break;
                case "ha":
                    i = (1e-4 * e).toFixed(2) + "公顷"
            }
            return i
        }

        function getAngle(e, t) {
            var i = Cesium.Cartographic.fromCartesian(e),
                r = Cesium.Cartographic.fromCartesian(t),
                n = turf.point([Cesium.Math.toDegrees(i.longitude), Cesium.Math.toDegrees(i.latitude), i.height]),
                o = turf.point([Cesium.Math.toDegrees(r.longitude), Cesium.Math.toDegrees(r.latitude), r.height]);
            return Math.round(turf.rhumbBearing(n, o))
        }

        function alert(e, t) {
            window.haoutil && window.haoutil.alert ? window.haoutil.alert(e, t) : window.layer ? layer.alert(e, {
                title: t || "提示",
                skin: "layui-layer-lan layer-wutu-dialog",
                closeBtn: 0,
                anim: 0
            }) : window.alert(e)
        }

        function msg(e) {
            window.haoutil && window.haoutil.msg ? window.haoutil.msg(e) : window.toastr ? toastr.info(e) : window.layer ? layer.msg(e) : window.alert(e)
        }

        function getRequest() {
            var e = location.search,
                t = new Object;
            if (-1 != e.indexOf("?"))
                for (var i = e.substr(1), r = i.split("&"), n = 0; n < r.length; n++) t[r[n].split("=")[0]] = decodeURI(r[n].split("=")[1]);
            return t
        }

        function getRequestByName(e) {
            var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)", "i"),
                i = window.location.search.substr(1).match(t);
            return null != i ? decodeURI(i[2]) : null
        }

        function clone(e, t) {
            if (null == t && (t = 5), null == e || "object" != (void 0 === e ? "undefined" : _typeof(e))) return e;
            if (e instanceof Date) {
                var i = new Date;
                return i.setTime(e.getTime()), i
            }
            if (isArray(e) && t >= 0) {
                for (var i = [], r = 0, n = e.length; r < n; ++r) i[r] = clone(e[r], t - 1);
                return i
            }
            if ("object" === (void 0 === e ? "undefined" : _typeof(e)) && t >= 0) {
                var i = {};
                for (var o in e) "function" != typeof o && "_layer" != o && "_layers" != o && "_parent" != o && e.hasOwnProperty(o) && (i[o] = clone(e[o], t - 1));
                return i
            }
            return e
        }

        function downloadBase64Image(e, t) {
            download(e + ".png", base64Img2Blob(t))
        }

        function downloadFile(e, t) {
            download(e, new Blob([t]))
        }

        function download(e, t) {
            var i = document.createElement("a");
            i.download = e, i.href = URL.createObjectURL(t), document.body.appendChild(i), i.click(), document.body.removeChild(i)
        }

        function base64Img2Blob(e) {
            for (var t = e.split(";base64,"), i = t[0].split(":")[1], r = window.atob(t[1]), n = r.length, o = new Uint8Array(n), a = 0; a < n; ++a) o[a] = r.charCodeAt(a);
            return new Blob([o], {
                type: i
            })
        }

        function currentTime() {
            return window.viewer ? window.viewer.clock.currentTime : Cesium.JulianDate.fromDate(new Date)
        }

        function template(e, t) {
            if (null == e) return e;
            for (var i in t) {
                var r = t[i];
                null != r && "Null" != r && "Unknown" != r || (r = ""), "_" == i.substr(0, 1) && (i = i.substring(1)), r.getValue && "function" == typeof r.getValue && (r = r.getValue(currentTime())), e = e.replace(new RegExp("{" + i + "}", "gm"), r)
            }
            return e
        }

        function getAttrVal(e) {
            if (!e) return e;
            try {
                e.getValue && (e = e.getValue(currentTime()));
                var t = {};
                if (e._propertyNames && e._propertyNames.length > 0) {
                    var i = !0,
                        r = !1,
                        n = void 0;
                    try {
                        for (var o, a = e._propertyNames[Symbol.iterator](); !(i = (o = a.next()).done); i = !0) {
                            var s = o.value,
                                l = e[s];
                            if (null != l && "" != l && "Null" != l && "Unknown" != l)
                                if (l.getValue && "function" == typeof l.getValue) t[s] = l.getValue(currentTime());
                                else {
                                    if ("function" == typeof l) continue;
                                    t[s] = l
                                }
                        }
                    } catch (e) {
                        r = !0, n = e
                    } finally {
                        try {
                            !i && a.return && a.return()
                        } finally {
                            if (r) throw n
                        }
                    }
                } else
                    for (var u in e) {
                        var l = e[u];
                        if (null != l && "" != l && "Null" != l && "Unknown" != l)
                            if (l.getValue && "function" == typeof l.getValue) t[u] = l.getValue(currentTime());
                            else {
                                if ("function" == typeof l) continue;
                                t[u] = l
                            }
                    }
                return t
            } catch (e) {
                console.log("getAttrVal 出错"), console.log(e)
            }
            return e
        }

        function getPopupForConfig(e, t) {
            var i = e.popupNameField ? t[e.popupNameField] : e.name;
            return e.popupNoTitle && (i = null), e.popup ? getPopup(e.popup, t, i) : !!e.columns && getPopup(e.columns, t, i)
        }

        function getTooltipForConfig(e, t) {
            var i = e.tooltipNameField ? t[e.tooltipNameField] : e.name;
            return !!e.tooltip && getPopup(e.tooltip, t, i)
        }

        function getPopup(cfg, attr, title) {
            if (!attr) return !1;
            if (attr = getAttrVal(attr), isArray(cfg)) {
                var countsok = 0,
                    inhtml = title ? '<div class="wutu-popup-titile">' + title + "</div>" : '<div style="height: 10px;"></div>';
                inhtml += '<div class="wutu-popup-content" >';
                for (var i = 0; i < cfg.length; i++) {
                    var thisfield = cfg[i],
                        col = thisfield.field;
                    if ("details" != thisfield.type)
                        if ("html" != thisfield.type) {
                            if (null != col && null != attr[col] && "function" != typeof attr[col]) {
                                var showval = _jquery2.default.trim(attr[col]);
                                if (null != showval && "" != showval && "Null" != showval && "Unknown" != showval && "0" != showval && 0 != showval.length) {
                                    if (thisfield.format) try {
                                        showval = eval(thisfield.format + "(" + showval + ")")
                                    } catch (e) {
                                        console.log("getPopupByConfig error:" + thisfield.format)
                                    }
                                    thisfield.unit && (showval += thisfield.unit), inhtml += "<div><label>" + thisfield.name + "</label>" + showval + "</div>", countsok++
                                }
                            }
                        } else inhtml += "<div>" + thisfield.html + "</div>";
                    else {
                        var showval = _jquery2.default.trim(attr[col || "OBJECTID"]);
                        if (null == showval) continue;
                        inhtml += '<div style="text-align: center;padding: 10px 0;"><button type="button" onclick="' + thisfield.calback + "('" + showval + '\');" " class="btn btn-info  btn-sm">' + (thisfield.name || "查看详情") + "</button></div>"
                    }
                }
                return inhtml += "</div>", 0 != countsok && inhtml
            }
            if ("object" !== (void 0 === cfg ? "undefined" : _typeof(cfg))) {
                if ("function" == typeof cfg) return cfg(attr);
                if ("all" == cfg) {
                    var countsok = 0,
                        inhtml = title ? '<div class="wutu-popup-titile">' + title + "</div>" : "";
                    inhtml += '<div class="wutu-popup-content" >';
                    for (var col in attr) try {
                        if (null == col || null == attr[col]) continue;
                        if ("Shape" == col || "FID" == col || "OBJECTID" == col || "_definitionChanged" == col || "_propertyNames" == col) continue;
                        if ("_" == col.substr(0, 1) && (col = col.substring(1)), "object" === _typeof(attr[col]) && attr[col].hasOwnProperty && attr[col].hasOwnProperty("getValue") && (attr[col] = attr[col].getValue(currentTime())), "function" == typeof attr[col]) continue;
                        var showval = _jquery2.default.trim(attr[col]);
                        if (null == showval || "" == showval || "Null" == showval || "Unknown" == showval || "0" == showval || 0 == showval.length) continue;
                        inhtml += "<div><label>" + col + "</label>" + showval + "</div>", countsok++
                    } catch (e) {
                        console.log(e)
                    }
                    return inhtml += "</div>", 0 != countsok && inhtml
                }
                return template(cfg, attr)
            }
            switch (cfg.type) {
                case "iframe":
                    var _url = template(cfg.url, attr),
                        inhtml = '<iframe id="ifarm" src="' + _url + '"  style="width:' + (cfg.width || "300") + "px;height:" + (cfg.height || "300") + 'px;overflow:hidden;margin:0;" scrolling="no" frameborder="0" ></iframe>';
                    return inhtml;
                case "javascript":
                    return eval(cfg.calback + "(" + JSON.stringify(attr) + ")")
            }
            return !1
        }

        function isPCBroswer() {
            var e = navigator.userAgent.toLowerCase(),
                t = "ipad" == e.match(/ipad/i),
                i = "iphone" == e.match(/iphone/i),
                r = "midp" == e.match(/midp/i),
                n = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i),
                o = "ucweb" == e.match(/ucweb/i),
                a = "android" == e.match(/android/i),
                s = "windows ce" == e.match(/windows ce/i),
                l = "windows mobile" == e.match(/windows mobile/i);
            return !(t || i || r || n || o || a || s || l)
        }

        function getExplorerInfo() {
            var e = window.navigator.userAgent.toLowerCase();
            if (e.indexOf("msie") >= 0) {
                var t = Number(e.match(/msie ([\d]+)/)[1]);
                return {
                    type: "IE",
                    version: t
                }
            }
            if (e.indexOf("firefox") >= 0) {
                var t = Number(e.match(/firefox\/([\d]+)/)[1]);
                return {
                    type: "Firefox",
                    version: t
                }
            }
            if (e.indexOf("chrome") >= 0) {
                var t = Number(e.match(/chrome\/([\d]+)/)[1]);
                return {
                    type: "Chrome",
                    version: t
                }
            }
            if (e.indexOf("opera") >= 0) {
                var t = Number(e.match(/opera.([\d]+)/)[1]);
                return {
                    type: "Opera",
                    version: t
                }
            }
            if (e.indexOf("Safari") >= 0) {
                var t = Number(e.match(/version\/([\d]+)/)[1]);
                return {
                    type: "Safari",
                    version: t
                }
            }
            return {
                type: e,
                version: -1
            }
        }

        function webglreport() {
            var e = getExplorerInfo();
            if ("IE" == e.type && e.version < 11) return !1;
            try {
                var t, i = document.createElement("canvas");
                if ("undefined" != typeof WebGL2RenderingContext && (t = i.getContext("webgl2") || i.getContext("experimental-webgl2") || void 0), null == t && (t = i.getContext("webgl") || i.getContext("experimental-webgl") || void 0), null == t) return !1
            } catch (e) {
                return !1
            }
            return !0
        }

        function getProxyUrl(e) {
            if (!e.proxy || !e.url) return e;
            if (e.url instanceof Cesium.Resource) return e;
            var t = {};
            for (var i in e) t[i] = e[i];
            return t.url = new Cesium.Resource({
                url: t.url,
                proxy: new Cesium.DefaultProxy(t.proxy)
            }), t
        }

        function formatDegree(e) {
            e = Math.abs(e);
            var t = Math.floor(e);
            return t + "° " + Math.floor(60 * (e - t)) + "'  " + Math.round(3600 * (e - t) % 60) + '"'
        }

        function getLinkedPointList(e, t, i, r) {
            var n = [],
                o = Cesium.Cartographic.fromCartesian(e),
                a = Cesium.Cartographic.fromCartesian(t),
                s = 180 * o.longitude / Math.PI,
                l = 180 * o.latitude / Math.PI,
                u = 180 * a.longitude / Math.PI,
                c = 180 * a.latitude / Math.PI,
                h = Math.sqrt((s - u) * (s - u) + (l - c) * (l - c)),
                d = h * i,
                f = Cesium.Cartesian3.clone(e),
                p = Cesium.Cartesian3.clone(t),
                m = Cesium.Cartesian3.distance(f, Cesium.Cartesian3.ZERO),
                g = Cesium.Cartesian3.distance(p, Cesium.Cartesian3.ZERO);
            if (Cesium.Cartesian3.normalize(f, f), Cesium.Cartesian3.normalize(p, p), 0 == Cesium.Cartesian3.distance(f, p)) return n;
            var v = Cesium.Cartesian3.angleBetween(f, p);
            n.push(e);
            for (var y = 1; y < r - 1; y++) {
                var _ = 1 * y / (r - 1),
                    w = 1 - _,
                    b = Math.sin(w * v) / Math.sin(v),
                    C = Math.sin(_ * v) / Math.sin(v),
                    x = Cesium.Cartesian3.multiplyByScalar(f, b, new Cesium.Cartesian3),
                    P = Cesium.Cartesian3.multiplyByScalar(p, C, new Cesium.Cartesian3),
                    E = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3),
                    M = _ * Math.PI,
                    T = m * w + g * _ + Math.sin(M) * d;
                E = Cesium.Cartesian3.multiplyByScalar(E, T, E), n.push(E)
            }
            return n.push(t), n
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.isArray = void 0;
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
            return typeof e
        } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        exports.isNumber = isNumber, exports.isString = isString, exports.getLength = getLength, exports.formatLength = formatLength, exports.getArea = getArea, exports.formatArea = formatArea, exports.getAngle = getAngle, exports.alert = alert, exports.msg = msg, exports.getRequest = getRequest, exports.getRequestByName = getRequestByName, exports.clone = clone, exports.downloadBase64Image = downloadBase64Image, exports.downloadFile = downloadFile, exports.currentTime = currentTime, exports.template = template, exports.getAttrVal = getAttrVal, exports.getPopupForConfig = getPopupForConfig, exports.getTooltipForConfig = getTooltipForConfig, exports.getPopup = getPopup, exports.isPCBroswer = isPCBroswer, exports.getExplorerInfo = getExplorerInfo, exports.webglreport = webglreport, exports.getProxyUrl = getProxyUrl, exports.formatDegree = formatDegree, exports.getLinkedPointList = getLinkedPointList;
        var _cesium = __webpack_require__(0),
            Cesium = _interopRequireWildcard(_cesium),
            _jquery = __webpack_require__(5),
            _jquery2 = _interopRequireDefault(_jquery),
            _turf = __webpack_require__(12),
            turf = _interopRequireWildcard(_turf),
            _Util = __webpack_require__(3),
            Util = _interopRequireWildcard(_Util),
            isArray = exports.isArray = Array.isArray || function (e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            }
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e) {
            var t, i, r, n;
            for (i = 1, r = arguments.length; i < r; i++) {
                n = arguments[i];
                for (t in n) e[t] = n[t]
            }
            return e
        }

        function o(e, t) {
            var i = Array.prototype.slice;
            if (e.bind) return e.bind.apply(e, i.call(arguments, 1));
            var r = i.call(arguments, 2);
            return function () {
                return e.apply(t, r.length ? r.concat(i.call(arguments)) : arguments)
            }
        }

        function a(e) {
            return e._leaflet_id = e._leaflet_id || (t.lastId = G += 1), e._leaflet_id
        }

        function s(e, t, i) {
            var r, n, o, a;
            return a = function () {
                r = !1, n && (o.apply(i, n), n = !1)
            }, o = function () {
                r ? n = arguments : (e.apply(i, arguments), setTimeout(a, t), r = !0)
            }
        }

        function l(e, t, i) {
            var r = t[1],
                n = t[0],
                o = r - n;
            return e === r && i ? e : ((e - n) % o + o) % o + n
        }

        function u() {
            return !1
        }

        function c(e, t) {
            return Number(e.toFixed(t || 0))
        }

        function h(e) {
            return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
        }

        function d(e) {
            return h(e).split(/\s+/)
        }

        function f(e, t) {
            e.hasOwnProperty("options") || (e.options = e.options ? B(e.options) : {});
            for (var i in t) e.options[i] = t[i];
            return e.options
        }

        function p(e, t, i) {
            var r = [];
            for (var n in e) r.push(encodeURIComponent(i ? n.toUpperCase() : n) + "=" + encodeURIComponent(e[n]));
            return (t && -1 !== t.indexOf("?") ? "&" : "?") + r.join("&")
        }

        function m(e, t) {
            return e.replace(j, function (e, i) {
                var r = t[i];
                if (void 0 === r) throw new Error("No value provided for variable " + e);
                return "function" == typeof r && (r = r(t)), r
            })
        }

        function g(e, t) {
            for (var i = 0; i < e.length; i++)
                if (e[i] === t) return i;
            return -1
        }

        function v(e) {
            return window["webkit" + e] || window["moz" + e] || window["ms" + e]
        }

        function y(e) {
            var t = +new Date,
                i = Math.max(0, 16 - (t - W));
            return W = t + i, window.setTimeout(e, i)
        }

        function _(e, t, i) {
            if (!i || U !== y) return U.call(window, o(e, t));
            e.call(t)
        }

        function w(e) {
            e && Y.call(window, e)
        }

        function b(e) {
            if (!e.properties || !e.properties.type) return e;
            var t = e.properties.edittype || e.properties.type,
                i = q[t];
            if (!i) return e;
            var r = H.clone(e);
            if (e.properties.style) {
                var n = {};
                for (var o in e.properties.style) {
                    var a = e.properties.style[o];
                    if (I.defined(a)) {
                        i[o] !== a && (n[o] = a)
                    }
                }
                r.properties.style = n
            }
            return r
        }

        function C(e) {
            var t = q[e.edittype || e.type];
            if (t) {
                e.style = e.style || {};
                for (var i in t) {
                    var r = e.style[i];
                    I.defined(r) || (e.style[i] = t[i])
                }
            }
            return e
        }

        function x(e, t) {
            t = t || {};
            var i = q[e];
            if (i)
                for (var r in i) {
                    var n = t[r];
                    null == n && (t[r] = i[r])
                }
            return H.clone(t)
        }

        function P(e) {
            var t = I.Cartographic.fromCartesian(e);
            return null == t ? null : [c(I.Math.toDegrees(t.longitude), 6), c(I.Math.toDegrees(t.latitude), 6), c(t.height, 2)]
        }

        function E(e) {
            for (var t = [], i = 0, r = e.length; i < r; i++) {
                var n = P(e[i]);
                n && t.push(n)
            }
            return t
        }

        function M(e, t) {
            return !e || e.length < 2 ? null : I.Cartesian3.fromDegrees(e[0], e[1], e[2] || t || 0)
        }

        function T(e, t) {
            for (var i = [], r = 0, n = e.length; r < n; r++) {
                var o = e[r];
                if (H.isArray(o[0])) {
                    var a = T(o, t);
                    a && a.length > 0 && i.push(a)
                } else {
                    var s = M(o, t);
                    s && i.push(s)
                }
            }
            return i
        }

        function S(e) {
            if (!e) return null;
            var t = J.project(I.Cartographic.fromCartesian(e));
            return [t.x, t.y, t.z]
        }

        function O(e) {
            for (var t = [], i = 0, r = e.length; i < r; i++) {
                var n = S(e[i]);
                n && t.push(n)
            }
            return t
        }

        function D(e) {
            return S(M(e))
        }

        function k(e) {
            for (var t = [], i = 0, r = e.length; i < r; i++) {
                var n = D(e[i]);
                t.push(n)
            }
            return t
        }

        function A(e) {
            if (isNaN(e[0]) || isNaN(e[1])) return null;
            var t = J.unproject(new I.Cartesian3(e[0], e[1], e[2] || 0));
            return I.Cartesian3.fromRadians(t.longitude, t.latitude, t.height)
        }

        function R(e) {
            for (var t = [], i = 0, r = e.length; i < r; i++) {
                var n = A(e[i]);
                n && t.push(n)
            }
            return t
        }

        function L(e) {
            return P(A(e))
        }

        function F(e) {
            for (var t = [], i = 0, r = e.length; i < r; i++) {
                var n = L(e[i]);
                t.push(n)
            }
            return t
        }

        function N(e, t) {
            var i = "Feature" === e.type ? e.geometry : e,
                r = i ? i.coordinates : null;
            if (!r && !i) return null;
            switch (i.type) {
                case "Point":
                    return M(r, t);
                case "MultiPoint":
                case "LineString":
                    return T(r, t);
                case "MultiLineString":
                case "Polygon":
                    return T(r[0], t);
                case "MultiPolygon":
                    return T(r[0][0], t);
                default:
                    throw new Error("Invalid GeoJSON object.")
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.cancelFn = t.requestFn = t.emptyImageUrl = t.lastId = t.create = t.freeze = void 0, t.extend = n, t.bind = o, t.stamp = a, t.throttle = s, t.wrapNum = l, t.falseFn = u, t.formatNum = c, t.trim = h, t.splitWords = d, t.setOptions = f, t.getParamString = p, t.template = m, t.indexOf = g, t.requestAnimFrame = _, t.cancelAnimFrame = w, t.removeGeoJsonDefVal = b, t.addGeoJsonDefVal = C, t.getDefStyle = x, t.cartesian2lonlat = P, t.cartesians2lonlats = E, t.lonlat2cartesian = M, t.lonlats2cartesians = T, t.cartesian2mercator = S, t.cartesians2mercators = O, t.lonlat2mercator = D, t.lonlats2mercators = k, t.mercator2cartesian = A, t.mercators2cartesians = R, t.mercator2lonlat = L, t.mercators2lonlats = F, t.getPositionByGeoJSON = N;
        var V = i(0),
            I = r(V),
            z = i(2),
            H = r(z);
        t.freeze = Object.freeze;
        Object.freeze = function (e) {
            return e
        };
        var B = t.create = Object.create || function () {
                function e() {}
                return function (t) {
                    return e.prototype = t, new e
                }
            }(),
            G = t.lastId = 0,
            j = /\{ *([\w_-]+) *\}/g,
            W = (t.emptyImageUrl = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=", 0),
            U = t.requestFn = window.requestAnimationFrame || v("RequestAnimationFrame") || y,
            Y = t.cancelFn = window.cancelAnimationFrame || v("CancelAnimationFrame") || v("CancelRequestAnimationFrame") || function (e) {
                window.clearTimeout(e)
            },
            q = {
                label: {
                    text: "文字",
                    color: "#ffffff",
                    opacity: 1,
                    font_family: "楷体",
                    font_size: 30,
                    border: !0,
                    border_color: "#000000",
                    border_width: 3,
                    background: !1,
                    background_color: "#000000",
                    background_opacity: .5,
                    font_weight: "normal",
                    font_style: "normal",
                    scaleByDistance: !1,
                    scaleByDistance_far: 1e6,
                    scaleByDistance_farValue: .1,
                    scaleByDistance_near: 1e3,
                    scaleByDistance_nearValue: 1,
                    distanceDisplayCondition: !1,
                    distanceDisplayCondition_far: 1e4,
                    distanceDisplayCondition_near: 0,
                    clampToGround: !1,
                    visibleDepth: !0
                },
                point: {
                    pixelSize: 10,
                    color: "#3388ff",
                    opacity: 1,
                    outline: !0,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    outlineWidth: 2,
                    scaleByDistance: !1,
                    scaleByDistance_far: 1e6,
                    scaleByDistance_farValue: .1,
                    scaleByDistance_near: 1e3,
                    scaleByDistance_nearValue: 1,
                    distanceDisplayCondition: !1,
                    distanceDisplayCondition_far: 1e4,
                    distanceDisplayCondition_near: 0,
                    clampToGround: !1,
                    visibleDepth: !0
                },
                imagepoint: {
                    image: "",
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    horizontalOrigin: "CENTER",
                    verticalOrigin: "BOTTOM",
                    scaleByDistance: !1,
                    scaleByDistance_far: 1e6,
                    scaleByDistance_farValue: .1,
                    scaleByDistance_near: 1e3,
                    scaleByDistance_nearValue: 1,
                    distanceDisplayCondition: !1,
                    distanceDisplayCondition_far: 1e4,
                    distanceDisplayCondition_near: 0,
                    clampToGround: !1,
                    visibleDepth: !0
                },
                "font-point": {
                    iconClass: "fa fa-automobile",
                    iconSize: 50,
                    color: "#00ffff",
                    opacity: 1,
                    horizontalOrigin: "CENTER",
                    verticalOrigin: "CENTER",
                    rotation: 0,
                    scaleByDistance: !1,
                    scaleByDistance_far: 1e6,
                    scaleByDistance_farValue: .1,
                    scaleByDistance_near: 1e3,
                    scaleByDistance_nearValue: 1,
                    distanceDisplayCondition: !1,
                    distanceDisplayCondition_far: 1e4,
                    distanceDisplayCondition_near: 0,
                    clampToGround: !1,
                    visibleDepth: !0
                },
                model: {
                    modelUrl: "",
                    scale: 1,
                    heading: 0,
                    pitch: 0,
                    roll: 0,
                    fill: !1,
                    color: "#3388ff",
                    opacity: 1,
                    silhouette: !1,
                    silhouetteColor: "#ffffff",
                    silhouetteSize: 2,
                    silhouetteAlpha: .8,
                    clampToGround: !1
                },
                polyline: {
                    lineType: "solid",
                    animationDuration: 2e3,
                    animationImage: "img/textures/lineClr.png",
                    color: "#3388ff",
                    width: 4,
                    clampToGround: !1,
                    outline: !1,
                    outlineColor: "#ffffff",
                    outlineWidth: 2,
                    opacity: 1
                },
                polylineVolume: {
                    color: "#00FF00",
                    radius: 10,
                    shape: "pipeline",
                    outline: !1,
                    outlineColor: "#ffffff",
                    opacity: 1
                },
                corridor: {
                    height: 0,
                    width: 500,
                    cornerType: "ROUNDED",
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    color: "#3388ff",
                    opacity: .6,
                    clampToGround: !1
                },
                extrudedCorridor: {
                    height: 0,
                    extrudedHeight: 40,
                    width: 500,
                    cornerType: "ROUNDED",
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    color: "#00FF00",
                    opacity: .6,
                    clampToGround: !1
                },
                polygon: {
                    fill: !0,
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#3388ff",
                    opacity: .6,
                    stRotation: 0,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    clampToGround: !1
                },
                polygon_clampToGround: {
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#ffff00",
                    opacity: .6,
                    stRotation: 0,
                    clampToGround: !0
                },
                extrudedPolygon: {
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#00FF00",
                    opacity: .6,
                    stRotation: 0,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    extrudedHeight: 100,
                    perPositionHeight: !0
                },
                rectangle: {
                    height: 0,
                    fill: !0,
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#3388ff",
                    opacity: .6,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    rotation: 0,
                    stRotation: 0,
                    clampToGround: !1
                },
                rectangleImg: {
                    image: "",
                    opacity: 1,
                    rotation: 0,
                    clampToGround: !0
                },
                extrudedRectangle: {
                    extrudedHeight: 40,
                    height: 0,
                    fill: !0,
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#00FF00",
                    opacity: .6,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    rotation: 0,
                    stRotation: 0
                },
                circle: {
                    radius: 200,
                    height: 0,
                    fill: !0,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationCount: 1,
                    animationGradient: .1,
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#3388ff",
                    opacity: .6,
                    stRotation: 0,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    rotation: 0,
                    clampToGround: !1
                },
                circle_clampToGround: {
                    radius: 200,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationCount: 1,
                    animationGradient: .1,
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#ffff00",
                    opacity: .6,
                    stRotation: 0,
                    rotation: 0,
                    clampToGround: !0
                },
                extrudedCircle: {
                    radius: 200,
                    extrudedHeight: 200,
                    height: 0,
                    fill: !0,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationCount: 1,
                    animationGradient: .1,
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#00FF00",
                    opacity: .6,
                    stRotation: 0,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    rotation: 0
                },
                ellipse: {
                    semiMinorAxis: 200,
                    semiMajorAxis: 200,
                    height: 0,
                    fill: !0,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationCount: 1,
                    animationGradient: .1,
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#3388ff",
                    opacity: .6,
                    stRotation: 0,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    rotation: 0,
                    clampToGround: !1
                },
                ellipse_clampToGround: {
                    semiMinorAxis: 200,
                    semiMajorAxis: 200,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationCount: 1,
                    animationGradient: .1,
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#ffff00",
                    opacity: .6,
                    stRotation: 0,
                    rotation: 0,
                    clampToGround: !0
                },
                extrudedEllipse: {
                    semiMinorAxis: 200,
                    semiMajorAxis: 200,
                    extrudedHeight: 200,
                    height: 0,
                    fill: !0,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationCount: 1,
                    animationGradient: .1,
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#00FF00",
                    opacity: .6,
                    stRotation: 0,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6,
                    rotation: 0
                },
                cylinder: {
                    topRadius: 0,
                    bottomRadius: 200,
                    length: 500,
                    fill: !0,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationCount: 1,
                    animationGradient: .1,
                    color: "#00FF00",
                    opacity: .6,
                    outline: !1,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6
                },
                ellipsoid: {
                    extentRadii: 200,
                    widthRadii: 200,
                    heightRadii: 200,
                    fill: !0,
                    fillType: "color",
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#00FF00",
                    opacity: .6,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6
                },
                wall: {
                    extrudedHeight: 40,
                    fill: !0,
                    fillType: "color",
                    animationDuration: 2e3,
                    animationImage: "img/textures/fence.png",
                    animationRepeatX: 1,
                    animationAxisY: !1,
                    grid_lineCount: 8,
                    grid_lineThickness: 2,
                    grid_cellAlpha: .1,
                    stripe_oddcolor: "#ffffff",
                    stripe_repeat: 6,
                    checkerboard_oddcolor: "#ffffff",
                    checkerboard_repeat: 4,
                    color: "#00FF00",
                    opacity: .6,
                    outline: !0,
                    outlineWidth: 1,
                    outlineColor: "#ffffff",
                    outlineOpacity: .6
                }
            };
        q.billboard = q.imagepoint, q.ellipse = q.circle;
        var J = new I.WebMercatorProjection
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            var t = document.createElement("DIV");
            t.className = "draw-tooltip right";
            var i = document.createElement("DIV");
            i.className = "draw-tooltip-arrow", t.appendChild(i);
            var r = document.createElement("DIV");
            r.className = "draw-tooltip-inner", t.appendChild(r), this._div = t, this._title = r, e.appendChild(t), (0, o.default)(".draw-tooltip").mouseover(function () {
                (0, o.default)(this).hide()
            })
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.message = void 0, t.Tooltip = r;
        var n = i(5),
            o = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(n);
        t.message = {
            draw: {
                point: {
                    start: "单击 完成绘制"
                },
                polyline: {
                    start: "单击 开始绘制",
                    cont: "单击增加点，右击删除点",
                    end: "单击增加点，右击删除点<br/>双击完成绘制",
                    end2: "单击完成绘制"
                }
            },
            edit: {
                start: "单击后 激活编辑<br/>右击 单击菜单删除",
                end: "释放后 完成修改"
            },
            dragger: {
                def: "拖动 修改位置",
                addMidPoint: "拖动 增加点",
                moveHeight: "拖动 修改高度",
                editRadius: "拖动 修改半径",
                editHeading: "拖动 修改方向",
                editScale: "拖动 修改缩放比例"
            },
            del: {
                def: "<br/>右击 删除该点",
                min: "无法删除，点数量不能少于"
            }
        };
        r.prototype.setVisible = function (e) {
            this._div.style.display = e ? "block" : "none"
        }, r.prototype.showAt = function (e, t) {
            e && t ? (this.setVisible(!0), this._title.innerHTML = t, this._div.style.top = e.y - this._div.clientHeight / 2 + "px", this._div.style.left = e.x + 30 + "px") : this.setVisible(!1)
        }
    }, function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_5__
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            switch (e) {
                case u.AddMidPoint:
                    t.color = c.AddMidPoint, t.outlineColor = new a.Color.fromCssColorString("#ffffff").withAlpha(.4);
                    break;
                case u.MoveHeight:
                    t.color = c.MoveHeight;
                    break;
                case u.EditAttr:
                    t.color = c.EditAttr;
                    break;
                case u.Control:
                default:
                    t.color = c.Control
            }
            return t
        }

        function n(e, t) {
            var i;
            if (t.dragger) i = t.dragger;
            else {
                var n = {
                    scale: 1,
                    pixelSize: l,
                    outlineColor: new a.Color.fromCssColorString("#ffffff").withAlpha(.5),
                    outlineWidth: 2,
                    scaleByDistance: new a.NearFarScalar(1e3, 1, 1e6, .5),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                };
                n = r(t.type, n), i = e.entities.add({
                    position: a.defaultValue(t.position, a.Cartesian3.ZERO),
                    point: n,
                    draw_tooltip: t.tooltip || s.message.dragger.def
                }), i.contextmenuItems = !1
            }
            return i._isDragger = !0, i._noMousePosition = !0, i._pointType = t.type || u.Control, i.onDragStart = a.defaultValue(t.onDragStart, null), i.onDrag = a.defaultValue(t.onDrag, null), i.onDragEnd = a.defaultValue(t.onDragEnd, null), i
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.PointColor = t.PointType = t.PixelSize = void 0, t.createDragger = n;
        var o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(4),
            l = t.PixelSize = 12,
            u = t.PointType = {
                Control: 1,
                AddMidPoint: 2,
                MoveHeight: 3,
                EditAttr: 4,
                EditRotation: 5
            },
            c = t.PointColor = {
                Control: new a.Color.fromCssColorString("#1c197d"),
                MoveHeight: new a.Color.fromCssColorString("#9500eb"),
                EditAttr: new a.Color.fromCssColorString("#f73163"),
                AddMidPoint: new a.Color.fromCssColorString("#04c2c9").withAlpha(.3)
            }
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        t.DrawStart = "draw-start", t.DrawAddPoint = "draw-add-point", t.DrawRemovePoint = "draw-remove-lastpoint", t.DrawMouseMove = "draw-mouse-move", t.DrawCreated = "draw-created", t.EditStart = "edit-start", t.EditMovePoint = "edit-move-point", t.EditRemovePoint = "edit-remove-point", t.EditStop = "edit-stop", t.Delete = "delete"
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {
                scale: 1,
                horizontalOrigin: u.HorizontalOrigin.CENTER,
                verticalOrigin: u.VerticalOrigin.BOTTOM
            });
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "font_style":
                    case "font_weight":
                    case "font_size":
                    case "font_family":
                    case "scaleByDistance_near":
                    case "scaleByDistance_nearValue":
                    case "scaleByDistance_far":
                    case "scaleByDistance_farValue":
                    case "distanceDisplayCondition_far":
                    case "distanceDisplayCondition_near":
                    case "background_opacity":
                    case "pixelOffsetY":
                        break;
                    case "text":
                        t.text = r.replace(new RegExp("<br />", "gm"), "\n");
                        break;
                    case "color":
                        t.fillColor = new u.Color.fromCssColorString(r || "#ffffff").withAlpha(Number(e.opacity || 1));
                        break;
                    case "border":
                        t.style = r ? u.LabelStyle.FILL_AND_OUTLINE : u.LabelStyle.FILL;
                        break;
                    case "border_color":
                        t.outlineColor = new u.Color.fromCssColorString(r || "#000000").withAlpha(Number(e.opacity || 1));
                        break;
                    case "border_width":
                        t.outlineWidth = r;
                        break;
                    case "background":
                        t.showBackground = r;
                        break;
                    case "background_color":
                        t.backgroundColor = new u.Color.fromCssColorString(r || "#000000").withAlpha(Number(e.background_opacity || e.opacity || .5));
                        break;
                    case "pixelOffset":
                        t.pixelOffset = new u.Cartesian2(e.pixelOffset[0], e.pixelOffset[1]);
                        break;
                    case "hasPixelOffset":
                        r || (t.pixelOffset = new u.Cartesian2(0, 0));
                        break;
                    case "pixelOffsetX":
                        t.pixelOffset = new u.Cartesian2(r, e.pixelOffsetY);
                        break;
                    case "scaleByDistance":
                        t.scaleByDistance = r ? new u.NearFarScalar(Number(e.scaleByDistance_near || 1e3), Number(e.scaleByDistance_nearValue || 1), Number(e.scaleByDistance_far || 1e6), Number(e.scaleByDistance_farValue || .1)) : null;
                        break;
                    case "distanceDisplayCondition":
                        t.distanceDisplayCondition = r ? new u.DistanceDisplayCondition(Number(e.distanceDisplayCondition_near || 0), Number(e.distanceDisplayCondition_far || 1e5)) : null;
                        break;
                    case "clampToGround":
                        t.heightReference = r ? u.HeightReference.CLAMP_TO_GROUND : u.HeightReference.NONE;
                        break;
                    case "heightReference":
                        switch (r) {
                            case "NONE":
                                t.heightReference = u.HeightReference.NONE;
                                break;
                            case "CLAMP_TO_GROUND":
                                t.heightReference = u.HeightReference.CLAMP_TO_GROUND;
                                break;
                            case "RELATIVE_TO_GROUND":
                                t.heightReference = u.HeightReference.RELATIVE_TO_GROUND;
                                break;
                            default:
                                t.heightReference = r
                        }
                        break;
                    case "visibleDepth":
                        t.disableDepthTestDistance = r ? 0 : Number.POSITIVE_INFINITY
                }
            }
            var n = (e.font_style || "normal") + " small-caps " + (e.font_weight || "normal") + " " + (e.font_size || "25") + "px " + (e.font_family || "楷体");
            return t.font = n, t
        }

        function o(e) {
            return [e.position.getValue((0, d.currentTime)())]
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Point",
                    coordinates: t[0]
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2)
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.BaseLayer = void 0;
        var r = i(15),
            n = i(2),
            o = r.Class.extend({
                config: {},
                viewer: null,
                initialize: function (e, t) {
                    this.viewer = t, this.config = e, this.name = e.name, this.config.hasOwnProperty("alpha") ? this._opacity = Number(this.config.alpha) : this.config.hasOwnProperty("opacity") && (this._opacity = Number(this.config.opacity)), this.config.hasOwnProperty("hasOpacity") && (this.hasOpacity = this.config.hasOpacity), this.create(), e.visible ? this.setVisible(!0) : this._visible = !1, e.visible && e.flyTo && this.centerAt(0)
                },
                create: function () {},
                showError: function (e, t) {
                    t || (t = "未知错误"), this.viewer && this.viewer.cesiumWidget.showErrorPanel(e, void 0, t), console.log("layer错误:" + e + t)
                },
                _visible: null,
                getVisible: function () {
                    return this._visible
                },
                setVisible: function (e) {
                    null != this._visible && this._visible == e || (this._visible = e, e ? (this.config.msg && (0, n.msg)(this.config.msg), this.add()) : this.remove())
                },
                add: function () {
                    this._visible = !0, this.config.onAdd && this.config.onAdd()
                },
                remove: function () {
                    this._visible = !1, this.config.onRemove && this.config.onRemove()
                },
                centerAt: function (e) {
                    this.config.extent || this.config.center ? this.viewer.wutu.centerAt(this.config.extent || this.config.center, {
                        duration: e,
                        isWgs84: !0
                    }) : this.config.onCenterAt && this.config.onCenterAt(e)
                },
                hasOpacity: !1,
                _opacity: 1,
                setOpacity: function (e) {
                    this.config.onSetOpacity && this.config.onSetOpacity(e)
                },
                hasZIndex: !1,
                setZIndex: function (e) {
                    this.config.onSetZIndex && this.config.onSetZIndex(e)
                },
                destroy: function () {
                    this.setVisible(!1)
                }
            });
        t.BaseLayer = o
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawPolyline = void 0;
        var n = i(0),
            o = r(n),
            a = i(23),
            s = i(1),
            l = i(7),
            u = r(l),
            c = i(4),
            h = i(17),
            d = r(h),
            f = i(14);
        t.DrawPolyline = a.DrawBase.extend({
            type: "polyline",
            _minPointNum: 2,
            _maxPointNum: 9999,
            editClass: f.EditPolyline,
            attrClass: d,
            createFeature: function (e) {
                this._positions_draw = [], this._minPointNum_def || (this._minPointNum_def = this._minPointNum), this._maxPointNum_def || (this._maxPointNum_def = this._maxPointNum), e.config ? (this._minPointNum = e.config.minPointNum || this._minPointNum_def, this._maxPointNum = e.config.maxPointNum || this._maxPointNum_def) : (this._minPointNum = this._minPointNum_def, this._maxPointNum = this._maxPointNum_def);
                var t = this,
                    i = {
                        polyline: d.style2Entity(e.style),
                        attribute: e
                    };
                return i.polyline.positions = new o.CallbackProperty(function (e) {
                    return t.getDrawPosition()
                }, !1), this.entity = this.dataSource.entities.add(i), this.entity._positions_draw = this._positions_draw, this.entity
            },
            style2Entity: function (e, t) {
                return d.style2Entity(e, t.polyline)
            },
            bindEvent: function () {
                var e = this,
                    t = !1;
                this.getHandler().setInputAction(function (i) {
                    var r = (0, s.getCurrentMousePosition)(e.viewer.scene, i.position, e.entity);
                    r && (t && e._positions_draw.pop(), t = !1, e.entity.attribute && e.entity.attribute.config && e.entity.attribute.config.addHeight && (r = (0, s.addPositionsHeight)(r, e.entity.attribute.config.addHeight)), e._positions_draw.push(r), e.updateAttrForDrawing(), e.fire(u.DrawAddPoint, {
                        drawtype: e.type,
                        entity: e.entity,
                        position: r,
                        positions: e._positions_draw
                    }), e._positions_draw.length >= e._maxPointNum && e.disable())
                }, o.ScreenSpaceEventType.LEFT_CLICK), this.getHandler().setInputAction(function (i) {
                    e._positions_draw.pop();
                    var r = (0, s.getCurrentMousePosition)(e.viewer.scene, i.position, e.entity);
                    r && (t && e._positions_draw.pop(), t = !0, e.fire(u.DrawRemovePoint, {
                        drawtype: e.type,
                        entity: e.entity,
                        position: r,
                        positions: e._positions_draw
                    }), e._positions_draw.push(r), e.updateAttrForDrawing())
                }, o.ScreenSpaceEventType.RIGHT_CLICK), this.getHandler().setInputAction(function (i) {
                    e._positions_draw.length <= 1 ? e.tooltip.showAt(i.endPosition, c.message.draw.polyline.start) : e._positions_draw.length < e._minPointNum ? e.tooltip.showAt(i.endPosition, c.message.draw.polyline.cont) : e._positions_draw.length >= e._maxPointNum ? e.tooltip.showAt(i.endPosition, c.message.draw.polyline.end2) : e.tooltip.showAt(i.endPosition, c.message.draw.polyline.end);
                    var r = (0, s.getCurrentMousePosition)(e.viewer.scene, i.endPosition, e.entity);
                    r && (t && e._positions_draw.pop(), t = !0, e._positions_draw.push(r), e.updateAttrForDrawing(), e.fire(u.DrawMouseMove, {
                        drawtype: e.type,
                        entity: e.entity,
                        position: r,
                        positions: e._positions_draw
                    }))
                }, o.ScreenSpaceEventType.MOUSE_MOVE), this.getHandler().setInputAction(function (t) {
                    e._positions_draw.pop(), e.endDraw()
                }, o.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
            },
            endDraw: function () {
                if (!this._enabled) return this;
                this._positions_draw.length < this._minPointNum || (this.updateAttrForDrawing(), this.disable())
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this.getDrawPosition(), e.polyline.positions = new o.CallbackProperty(function (t) {
                    return e._positions_draw
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {});
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "color":
                    case "opacity":
                    case "outlineOpacity":
                    case "grid_lineCount":
                    case "grid_lineThickness":
                    case "grid_cellAlpha":
                    case "checkerboard_repeat":
                    case "checkerboard_oddcolor":
                    case "stripe_oddcolor":
                    case "stripe_repeat":
                    case "animationDuration":
                    case "animationImage":
                    case "animationRepeatX":
                    case "animationRepeatY":
                    case "animationAxisY":
                    case "animationGradient":
                    case "animationCount":
                    case "randomColor":
                        break;
                    case "outlineColor":
                        t.outlineColor = new u.Color.fromCssColorString(r || e.color || "#FFFF00").withAlpha(u.defaultValue(e.outlineOpacity, u.defaultValue(e.opacity, 1)));
                        break;
                    case "extrudedHeight":
                        var n = 0;
                        if (t.hierarchy) {
                            var a = o({
                                polygon: t
                            });
                            n = (0, d.getMaxHeight)(a)
                        }
                        t.extrudedHeight = Number(r) + n;
                        break;
                    case "clampToGround":
                        t.perPositionHeight = !r;
                        break;
                    case "stRotation":
                        t.stRotation = u.Math.toRadians(r)
                }
            }
            return m.setFillMaterial(t, e), t
        }

        function o(e, t) {
            if (!t && e._positions_draw && e._positions_draw.length > 0) return e._positions_draw;
            var i = e.polygon.hierarchy.getValue((0, f.currentTime)());
            return i && i instanceof u.PolygonHierarchy ? i.positions : i
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e, t) {
            var i = a(e);
            return !t && i.length > 0 && i.push(i[0]), {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Polygon",
                    coordinates: [i]
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(1),
            f = i(2),
            p = i(13),
            m = r(p)
    }, function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_12__
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (t.material) return e.material = t.material, e;
            if (t.color || t.fillType) {
                var i = new o.Color.fromCssColorString(o.defaultValue(t.color, "#FFFF00")).withAlpha(Number(o.defaultValue(t.opacity, 1)));
                switch (t.fillType) {
                    default:
                    case "color":
                        e.material = i;
                        break;
                    case "image":
                        e.material = new o.ImageMaterialProperty({
                            image: t.image,
                            color: new o.Color.fromCssColorString("#FFFFFF").withAlpha(Number(o.defaultValue(t.opacity, 1)))
                        });
                        break;
                    case "grid":
                        var r = o.defaultValue(t.grid_lineCount, 8),
                            n = o.defaultValue(t.grid_lineThickness, 2);
                        e.material = new o.GridMaterialProperty({
                            color: i,
                            cellAlpha: o.defaultValue(t.grid_cellAlpha, .1),
                            lineCount: new o.Cartesian2(r, r),
                            lineThickness: new o.Cartesian2(n, n)
                        });
                        break;
                    case "checkerboard":
                        var l = o.defaultValue(t.checkerboard_repeat, 4);
                        e.material = new o.CheckerboardMaterialProperty({
                            evenColor: i,
                            oddColor: new o.Color.fromCssColorString(t.checkerboard_oddcolor || "#ffffff").withAlpha(Number(o.defaultValue(t.opacity, 1))),
                            repeat: new o.Cartesian2(l, l)
                        });
                        break;
                    case "stripe":
                        e.material = new o.StripeMaterialProperty({
                            evenColor: i,
                            oddColor: new o.Color.fromCssColorString(t.stripe_oddcolor || "#ffffff").withAlpha(Number(o.defaultValue(t.opacity, 1))),
                            repeat: o.defaultValue(t.stripe_repeat, 6)
                        });
                        break;
                    case "animationLine":
                        e.material = new a.LineFlowMaterial({
                            color: i,
                            duration: o.defaultValue(t.animationDuration, 2e3),
                            url: t.animationImage,
                            repeat: new o.Cartesian2(t.animationRepeatX || 1, t.animationRepeatY || 1),
                            axisY: t.animationAxisY,
                            bgUrl: t.bgUrl,
                            bgColor: t.bgColor ? new o.Color.fromCssColorString(t.bgColor) : null
                        });
                        break;
                    case "animationCircle":
                        e.material = new s.CircleWaveMaterial({
                            duration: o.defaultValue(t.animationDuration, 2e3),
                            color: new o.Color.fromCssColorString(t.color || "#FFFF00").withAlpha(Number(o.defaultValue(t.opacity, 1))),
                            gradient: o.defaultValue(t.animationGradient, 0),
                            count: o.defaultValue(t.animationCount, 1)
                        })
                }
            }
            return (null == e.material || t.randomColor) && (e.material = o.Color.fromRandom({
                minimumRed: o.defaultValue(t.minimumRed, 0),
                maximumRed: o.defaultValue(t.maximumRed, .75),
                minimumGreen: o.defaultValue(t.minimumGreen, 0),
                maximumGreen: o.defaultValue(t.maximumGreen, .75),
                minimumBlue: o.defaultValue(t.minimumBlue, 0),
                maximumBlue: o.defaultValue(t.maximumBlue, .75),
                alpha: o.defaultValue(t.opacity, 1)
            })), e
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.setFillMaterial = r;
        var n = i(0),
            o = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(n),
            a = i(30),
            s = i(40)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditPolyline = void 0;
        var n = i(0),
            o = r(n),
            a = i(6),
            s = r(a),
            l = i(4),
            u = i(22),
            c = i(3),
            h = (r(c), i(1));
        t.EditPolyline = u.EditBase.extend({
            getGraphic: function () {
                return this.entity.polyline
            },
            _positions_draw: [],
            getPosition: function () {
                return this._positions_draw
            },
            setPositions: function (e) {
                this._positions_draw = e, this.updateAttrForEditing(), this.finish()
            },
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw || this.getGraphic().positions.getValue(this.viewer.clock.currentTime)
            },
            finish: function () {
                this.entity._positions_draw = this.getPosition()
            },
            isClampToGround: function () {
                return this.entity.attribute.style.clampToGround
            },
            _hasMidPoint: !0,
            hasMidPoint: function () {
                return this._hasMidPoint && this.getPosition().length < this._maxPointNum
            },
            hasClosure: !1,
            updatePositionsHeightByAttr: function (e) {
                return e
            },
            bindDraggers: function () {
                for (var e = this, t = this.getPosition(), i = this.isClampToGround(), r = this.hasMidPoint(), n = 0, a = t.length; n < a; n++) {
                    var u = t[n];
                    u = this.updatePositionsHeightByAttr(u), i && (u = (0, h.updateHeightForClampToGround)(this.viewer, u), t[n] = u);
                    var c = s.createDragger(this.dataSource, {
                        position: u,
                        onDrag: function (n, s) {
                            if (s = e.updatePositionsHeightByAttr(s), n.position = s, t[n.index] = s, e.heightDraggers && e.heightDraggers.length > 0) {
                                var l = e.getGraphic().extrudedHeight.getValue(e.viewer.clock.currentTime);
                                e.heightDraggers[n.index].position = (0, h.setPositionsHeight)(s, l)
                            }
                            if (r) {
                                var u, c;
                                if (e.hasClosure || !e.hasClosure && 0 != n.index) {
                                    0 == n.index ? (u = 2 * a - 1, c = a - 1) : (u = 2 * n.index - 1, c = n.index - 1);
                                    var d = t[c],
                                        f = o.Cartesian3.midpoint(s, d, new o.Cartesian3);
                                    f = e.updatePositionsHeightByAttr(f), i && (f = (0, h.updateHeightForClampToGround)(e.viewer, f)), e.draggers[u].position = f
                                }
                                if (e.hasClosure || !e.hasClosure && n.index != a - 1) {
                                    n.index == a - 1 ? (u = 2 * n.index + 1, c = 0) : (u = 2 * n.index + 1, c = n.index + 1);
                                    var f = o.Cartesian3.midpoint(s, t[c], new o.Cartesian3);
                                    f = e.updatePositionsHeightByAttr(f), i && (f = (0, h.updateHeightForClampToGround)(e.viewer, f)), e.draggers[u].position = f
                                }
                            }
                        }
                    });
                    if (c.index = n, this.draggers.push(c), r && (this.hasClosure || !this.hasClosure && n < a - 1)) {
                        var d = (n + 1) % a,
                            f = o.Cartesian3.midpoint(u, t[d], new o.Cartesian3);
                        f = e.updatePositionsHeightByAttr(f), i && (f = (0, h.updateHeightForClampToGround)(this.viewer, f));
                        var p = s.createDragger(this.dataSource, {
                            position: f,
                            type: s.PointType.AddMidPoint,
                            tooltip: l.message.dragger.addMidPoint,
                            onDragStart: function (e, i) {
                                t.splice(e.index, 0, i)
                            },
                            onDrag: function (e, i) {
                                t[e.index] = i
                            },
                            onDragEnd: function (t, i) {
                                e.updateDraggers()
                            }
                        });
                        p.index = d, this.draggers.push(p)
                    }
                }
                this.getGraphic().extrudedHeight && this.bindHeightDraggers()
            },
            heightDraggers: null,
            bindHeightDraggers: function (e) {
                var t = this;
                this.heightDraggers = [], e = e || this.getPosition();
                for (var i = t.getGraphic().extrudedHeight.getValue(this.viewer.clock.currentTime), r = 0, n = e.length; r < n; r++) {
                    var a = e[r];
                    a = (0, h.setPositionsHeight)(a, i);
                    var u = s.createDragger(this.dataSource, {
                        position: a,
                        type: s.PointType.MoveHeight,
                        tooltip: l.message.dragger.moveHeight,
                        onDrag: function (e, i) {
                            var r = o.Cartographic.fromCartesian(i).height;
                            t.getGraphic().extrudedHeight = r;
                            var n = (0, h.getMaxHeight)(t.getPosition());
                            t.entity.attribute.style.extrudedHeight = t.formatNum(r - n, 2), t.updateHeightDraggers(r)
                        }
                    });
                    this.draggers.push(u), this.heightDraggers.push(u)
                }
            },
            updateHeightDraggers: function (e) {
                for (var t = 0; t < this.heightDraggers.length; t++) {
                    var i = this.heightDraggers[t],
                        r = (0, h.setPositionsHeight)(i.position.getValue(this.viewer.clock.currentTime), e);
                    i.position.setValue(r)
                }
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r() {}
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Class = r;
        var n = i(3),
            o = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(n);
        r.extend = function (e) {
            var t = function () {
                    this.initialize && this.initialize.apply(this, arguments), this.callInitHooks()
                },
                i = t.__super__ = this.prototype,
                r = o.create(i);
            r.constructor = t, t.prototype = r;
            for (var n in this) this.hasOwnProperty(n) && "prototype" !== n && "__super__" !== n && (t[n] = this[n]);
            return e.statics && (o.extend(t, e.statics), delete e.statics), e.includes && (o.extend.apply(null, [r].concat(e.includes)), delete e.includes), r.options && (e.options = o.extend(o.create(r.options), e.options)), o.extend(r, e), r._initHooks = [], r.callInitHooks = function () {
                if (!this._initHooksCalled) {
                    i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
                    for (var e = 0, t = r._initHooks.length; e < t; e++) r._initHooks[e].call(this)
                }
            }, t
        }, r.include = function (e) {
            return o.extend(this.prototype, e), this
        }, r.mergeOptions = function (e) {
            return o.extend(this.prototype.options, e), this
        }, r.addInitHook = function (e) {
            var t = Array.prototype.slice.call(arguments, 1),
                i = "function" == typeof e ? e : function () {
                    this[e].apply(this, t)
                };
            return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this
        }
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            L[e] = t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Draw = void 0, t.register = n;
        var o = i(0),
            a = r(o),
            s = i(12),
            l = r(s),
            u = i(67),
            c = i(4),
            h = i(2),
            d = r(h),
            f = i(3),
            p = r(f),
            m = i(7),
            g = r(m),
            v = i(23),
            y = i(27),
            _ = i(84),
            w = i(85),
            b = i(86),
            C = i(10),
            x = i(87),
            P = i(88),
            E = i(89),
            M = i(50),
            T = i(90),
            S = i(91),
            O = i(92),
            D = i(94),
            k = i(95),
            A = i(96),
            R = i(97),
            L = {},
            F = t.Draw = u.Evented.extend({
                dataSource: null,
                primitives: null,
                drawCtrl: null,
                initialize: function (e, t) {
                    this.viewer = e, this.options = t || {}, this.dataSource = new a.CustomDataSource, this.viewer.dataSources.add(this.dataSource), this.primitives = new a.PrimitiveCollection, this.viewer.scene.primitives.add(this.primitives), a.defaultValue(this.options.removeScreenSpaceEvent, !0) && (this.viewer.screenSpaceEventHandler.removeInputAction(a.ScreenSpaceEventType.LEFT_DOUBLE_CLICK), this.viewer.screenSpaceEventHandler.removeInputAction(a.ScreenSpaceEventType.LEFT_CLICK)), this.tooltip = new c.Tooltip(this.viewer.container), this.hasEdit(a.defaultValue(this.options.hasEdit, !0));
                    var i = {
                        viewer: this.viewer,
                        dataSource: this.dataSource,
                        primitives: this.primitives,
                        tooltip: this.tooltip
                    };
                    this.drawCtrl = {}, this.drawCtrl.point = new y.DrawPoint(i), this.drawCtrl.billboard = new _.DrawBillboard(i), this.drawCtrl.label = new w.DrawLabel(i), this.drawCtrl.model = new b.DrawModel(i), this.drawCtrl.polyline = new C.DrawPolyline(i), this.drawCtrl.curve = new x.DrawCurve(i), this.drawCtrl.polylineVolume = new P.DrawPolylineVolume(i), this.drawCtrl.corridor = new E.DrawCorridor(i), this.drawCtrl.polygon = new M.DrawPolygon(i), this.drawCtrl.rectangle = new T.DrawRectangle(i), this.drawCtrl.ellipse = new S.DrawCircle(i), this.drawCtrl.circle = this.drawCtrl.ellipse, this.drawCtrl.cylinder = new O.DrawCylinder(i), this.drawCtrl.ellipsoid = new D.DrawEllipsoid(i), this.drawCtrl.wall = new k.DrawWall(i), this.drawCtrl["model-p"] = new A.DrawPModel(i);
                    for (var r in L) this.drawCtrl[r] = new L[r](i);
                    var n = this;
                    for (var o in this.drawCtrl) this.drawCtrl[o]._fire = function (e, t, i) {
                        n.fire(e, t, i)
                    };
                    this.on(g.DrawCreated, function (e) {
                        this.startEditing(e.entity)
                    }, this)
                },
                startDraw: function (e) {
                    if ("string" == typeof e) e = {
                        type: e
                    };
                    else if (null == e || null == e.type) return void console.error("需要传入指定绘制的type类型！");
                    var t = e.type;
                    if (null == this.drawCtrl[t]) return void console.error("不能进行type为【" + t + "】的绘制，无该类型！");
                    var i;
                    e.success && (i = e.success, delete e.success), e = p.addGeoJsonDefVal(e), this.stopDraw();
                    var r = this.drawCtrl[t].activate(e, i);
                    return this.bindDeleteContextmenu(r), r
                },
                endDraw: function () {
                    for (var e in this.drawCtrl) this.drawCtrl[e].endDraw && this.drawCtrl[e].endDraw();
                    return this
                },
                stopDraw: function () {
                    this.stopEditing();
                    for (var e in this.drawCtrl) this.drawCtrl[e].disable(!0);
                    return this
                },
                clearDraw: function () {
                    return this.stopDraw(), this.dataSource.entities.removeAll(), this.primitives.removeAll(), this
                },
                currEditFeature: null,
                getCurrentEntity: function () {
                    return this.currEditFeature
                },
                _hasEdit: null,
                hasEdit: function (e) {
                    null !== this._hasEdit && this._hasEdit === e || (this._hasEdit = e, e ? this.bindSelectEvent() : (this.stopEditing(), this.destroySelectEvent()))
                },
                bindSelectEvent: function () {
                    var e = this,
                        t = new a.ScreenSpaceEventHandler(this.viewer.scene.canvas);
                    t.setInputAction(function (t) {
                        var i = e.viewer.scene.pick(t.position, 5, 5);
                        if (a.defined(i)) {
                            var r = i.id || i.primitive.id || i.primitive;
                            if (r && e.isMyEntity(r)) {
                                if (e.currEditFeature && e.currEditFeature === r) return;
                                if (!a.defaultValue(r.inProgress, !1)) return void e.startEditing(r)
                            }
                        }
                        e.stopEditing()
                    }, a.ScreenSpaceEventType.LEFT_CLICK), t.setInputAction(function (t) {
                        if (e._hasEdit) {
                            e.tooltip.setVisible(!1);
                            var i = e.viewer.scene.pick(t.endPosition, 5, 5);
                            if (a.defined(i)) {
                                var r = i.id || i.primitive.id || i.primitive;
                                if (r && r.editing && !a.defaultValue(r.inProgress, !1) && e.isMyEntity(r)) {
                                    var n = e.tooltip;
                                    setTimeout(function () {
                                        n.showAt(t.endPosition, c.message.edit.start)
                                    }, 100)
                                }
                            }
                        }
                    }, a.ScreenSpaceEventType.MOUSE_MOVE), this.selectHandler = t
                },
                destroySelectEvent: function () {
                    this.selectHandler && this.selectHandler.destroy(), this.selectHandler = void 0
                },
                startEditing: function (e) {
                    this.stopEditing(), null != e && this._hasEdit && (e.editing && e.editing.activate && e.editing.activate(), this.currEditFeature = e)
                },
                stopEditing: function () {
                    this.tooltip.setVisible(!1), this.currEditFeature && this.currEditFeature.editing && this.currEditFeature.editing.disable && this.currEditFeature.editing.disable(), this.currEditFeature = null
                },
                updateAttribute: function (e, t) {
                    if (null == t && (t = this.currEditFeature), null != t && null != e) {
                        e.style = e.style || {}, e.attr = e.attr || {};
                        var i = t.attribute.type;
                        if (this.drawCtrl[i].style2Entity(e.style, t), t.attribute = e, t.editing && (t.editing.updateAttrForEditing && t.editing.updateAttrForEditing(), t.editing.updateDraggers && t.editing.updateDraggers()), this.options.nameTooltip) {
                            var r = this;
                            t.attribute.attr && t.attribute.attr.name ? t.tooltip = {
                                html: t.attribute.attr.name,
                                check: function () {
                                    return !r._hasEdit
                                }
                            } : t.tooltip = null
                        }
                        return t
                    }
                },
                setPositions: function (e, t) {
                    if (null == t && (t = this.currEditFeature), null != t && null != e) return t.editing && (t.editing.setPositions(e), t.editing.updateDraggers()), t
                },
                bindDeleteContextmenu: function (e) {
                    var t = this;
                    e.contextmenuItems = e.contextmenuItems || [], e.contextmenuItems.push({
                        text: "删除对象",
                        iconCls: "fa fa-trash-o",
                        visible: function () {
                            return t._hasEdit
                        },
                        calback: function (e) {
                            var i = e.target;
                            i.editing && i.editing.disable && i.editing.disable(), t.deleteEntity(i)
                        }
                    })
                },
                deleteEntity: function (e) {
                    null == e && (e = this.currEditFeature), null != e && (e.editing && e.editing.disable(), this.dataSource.entities.contains(e) && this.dataSource.entities.remove(e), this.primitives.contains(e) && this.primitives.remove(e), this.fire(g.Delete, {
                        entity: e
                    }))
                },
                isMyEntity: function (e) {
                    return !!this.dataSource.entities.contains(e) || !!this.primitives.contains(e)
                },
                deleteAll: function () {
                    this.clearDraw()
                },
                toGeoJSON: function (e) {
                    if (this.stopDraw(), null == e) {
                        var t = this.getEntitys();
                        if (0 == t.length) return null;
                        for (var i = [], r = 0, n = t.length; r < n; r++) {
                            var e = t[r];
                            if (null != e.attribute && null != e.attribute.type) {
                                var o = e.attribute.type,
                                    a = this.drawCtrl[o].toGeoJSON(e);
                                null != a && (a = p.removeGeoJsonDefVal(a), i.push(a))
                            }
                        }
                        return i.length > 0 ? {
                            type: "FeatureCollection",
                            features: i
                        } : null
                    }
                    var o = e.attribute.type,
                        a = this.drawCtrl[o].toGeoJSON(e);
                    return a = p.removeGeoJsonDefVal(a)
                },
                jsonToEntity: function (e, t, i) {
                    return this.loadJson(e, {
                        clear: t,
                        flyTo: i
                    })
                },
                loadJson: function (e, t) {
                    t = t || {};
                    var i = e;
                    try {
                        d.isString(e) && (i = JSON.parse(e))
                    } catch (e) {
                        return void d.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!")
                    }
                    t.clear && this.clearDraw();
                    for (var r = [], n = i.features ? i.features : [i], o = 0, a = n.length; o < a; o++) {
                        var s = n[o];
                        if (!s.properties || !s.properties.type) switch (s.properties = s.properties || {}, s.geometry.type) {
                            case "MultiPolygon":
                            case "Polygon":
                                s.properties.type = "polygon";
                                break;
                            case "MultiLineString":
                            case "LineString":
                                s.properties.type = "polyline";
                                break;
                            case "MultiPoint":
                            case "Point":
                                s.properties.type = "point"
                        }
                        s.properties.style = t.style || s.properties.style || {}, t.onEachFeature && t.onEachFeature(s, s.properties.type, o);
                        var u = s.properties.type;
                        if (null != this.drawCtrl[u]) {
                            var c = this.addFeature(u, s);
                            t.onEachEntity && t.onEachEntity(s, c, o), r.push(c)
                        } else console.log("数据无法识别或者数据的[" + u + "]类型参数有误")
                    }
                    if (t.flyTo)
                        if (r.length > 1) {
                            var h = l.bbox(i),
                                f = {
                                    xmin: h[0],
                                    ymin: h[1],
                                    xmax: h[2],
                                    ymax: h[3]
                                },
                                p = f.xmax - f.xmin || .3;
                            f.xmin -= p, f.xmax += p;
                            var m = f.ymax - f.ymin || .3;
                            f.ymin -= m, f.ymax += m, this.viewer.wutu.centerAt(f)
                        } else this.viewer.wutu.flyTo(r);
                    return r
                },
                addFeature: function (e, t) {
                    t.properties.style = t.properties.style || {}, t.properties = p.addGeoJsonDefVal(t.properties);
                    var i = this.drawCtrl[e].jsonToEntity(t);
                    if (this.bindDeleteContextmenu(i), this.options.nameTooltip)
                        if (i.attribute.attr && i.attribute.attr.name) {
                            var r = this;
                            i.tooltip = {
                                html: i.attribute.attr.name,
                                check: function () {
                                    return !r._hasEdit
                                }
                            }
                        } else i.tooltip = null;
                    return i
                },
                addPoint: function (e, t) {
                    var i = {
                        type: "Feature",
                        properties: {
                            style: t
                        },
                        geometry: {
                            type: "Point",
                            coordinates: e
                        }
                    };
                    return this.addFeature("billboard", i)
                },
                addPolyline: function (e, t) {
                    var i = {
                        type: "Feature",
                        properties: {
                            style: t
                        },
                        geometry: {
                            type: "LineString",
                            coordinates: e
                        }
                    };
                    return this.addFeature("polyline", i)
                },
                addPolygon: function (e, t) {
                    var i = {
                        type: "Feature",
                        properties: {
                            style: t
                        },
                        geometry: {
                            type: "Polygon",
                            coordinates: [e]
                        }
                    };
                    return this.addFeature("polygon", i)
                },
                attributeToEntity: function (e, t) {
                    return this.drawCtrl[e.type].attributeToEntity(e, t)
                },
                bindExtraEntity: function (e, t) {
                    var e = this.drawCtrl[t.type].attributeToEntity(e, t);
                    this.dataSource.entities.add(e)
                },
                _visible: !0,
                setVisible: function (e) {
                    this._visible = e, e || this.stopDraw(), this.dataSource.show = e, this.primitives.show = e
                },
                hasDraw: function () {
                    return this.getEntitys().length > 0
                },
                getEntitys: function () {
                    this.stopDraw();
                    var e = this.dataSource.entities.values;
                    return e = e.concat(this.primitives._primitives)
                },
                getDataSource: function () {
                    return this.dataSource
                },
                getEntityById: function (e) {
                    for (var t = this.getEntitys(), i = 0, r = t.length; i < r; i++) {
                        var n = t[i];
                        if (e == n.attribute.attr.id) return n
                    }
                    return null
                },
                getCoordinates: function (e) {
                    var t = e.attribute.type;
                    return this.drawCtrl[t].getCoordinates(e)
                },
                getPositions: function (e) {
                    var t = e.attribute.type;
                    return this.drawCtrl[t].getPositions(e)
                },
                flyTo: function (e, t) {
                    this.viewer.wutu.flyTo(e, t)
                },
                destroy: function () {
                    this.stopDraw(), this.hasEdit(!1), this.clearDraw(), this.viewer.dataSources.contains(this.dataSource) && this.viewer.dataSources.remove(this.dataSource, !0), this.viewer.scene.primitives.contains(this.dataSource) && this.viewer.scene.primitives.remove(this.primitives)
                }
            });
        F.Base = v.DrawBase, F.Billboard = _.DrawBillboard, F.Circle = S.DrawCircle, F.Cylinder = O.DrawCylinder, F.Corridor = E.DrawCorridor, F.Curve = x.DrawCurve, F.Ellipsoid = D.DrawEllipsoid, F.Label = w.DrawLabel, F.Model = b.DrawModel, F.Point = y.DrawPoint, F.Polygon = M.DrawPolygon, F.Polyline = C.DrawPolyline, F.PolylineVolume = P.DrawPolylineVolume, F.Rectangle = T.DrawRectangle, F.Wall = k.DrawWall, F.PModel = A.DrawPModel, F.PolygonEx = R.DrawPolygonEx
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {}), e.clampToGround && (t.arcType = c.ArcType.GEODESIC);
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "lineType":
                    case "color":
                    case "opacity":
                    case "outline":
                    case "outlineWidth":
                    case "outlineColor":
                    case "outlineOpacity":
                    case "flowDuration":
                    case "flowImage":
                    case "dashLength":
                    case "glowPower":
                    case "grid_lineCount":
                    case "grid_lineThickness":
                    case "grid_cellAlpha":
                    case "checkerboard_repeat":
                    case "checkerboard_oddcolor":
                    case "stripe_oddcolor":
                    case "stripe_repeat":
                    case "animationDuration":
                    case "animationImage":
                    case "animationRepeatX":
                    case "animationRepeatY":
                    case "animationAxisY":
                    case "animationGradient":
                    case "animationCount":
                    case "randomColor":
                }
            }
            if (e.color || e.lineType) {
                var n = new c.Color.fromCssColorString(e.color || "#FFFF00").withAlpha(Number(c.defaultValue(e.opacity, 1)));
                switch (e.lineType) {
                    default:
                    case "solid":
                        e.outline ? t.material = new c.PolylineOutlineMaterialProperty({
                            color: n,
                            outlineWidth: Number(e.outlineWidth || 1),
                            outlineColor: new c.Color.fromCssColorString(e.outlineColor || "#FFFF00").withAlpha(Number(e.outlineOpacity || e.opacity || 1))
                        }) : t.material = n;
                        break;
                    case "dash":
                        e.outline ? t.material = new c.PolylineDashMaterialProperty({
                            dashLength: e.dashLength || e.outlineWidth || 16,
                            color: n,
                            gapColor: new c.Color.fromCssColorString(e.outlineColor || "#FFFF00").withAlpha(Number(e.outlineOpacity || e.opacity || 1))
                        }) : t.material = new c.PolylineDashMaterialProperty({
                            dashLength: e.dashLength || 16,
                            color: n
                        });
                        break;
                    case "glow":
                        t.material = new c.PolylineGlowMaterialProperty({
                            glowPower: e.glowPower || .1,
                            color: n
                        });
                        break;
                    case "arrow":
                        t.material = new c.PolylineArrowMaterialProperty(n);
                        break;
                    case "animation":
                        t.material = new g.LineFlowMaterial({
                            color: n,
                            duration: e.animationDuration || 2e3,
                            url: e.animationImage
                        })
                }
            }
            return e.material && (t.material = e.material), t
        }

        function o(e, t) {
            return !t && e._positions_draw && e._positions_draw.length > 0 ? e._positions_draw : e.polyline.positions.getValue((0, m.currentTime)())
        }

        function a(e) {
            var t = o(e);
            return p.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "LineString",
                    coordinates: t
                }
            }
        }

        function l(e, t) {
            if (!d) return e;
            var i = e.map(function (e) {
                return p.cartesian2lonlat(e)
            });
            t && i.push(i[0]);
            var r = i[i.length - 1][2],
                n = d.lineString(i),
                o = d.bezierSpline(n);
            return p.lonlats2cartesians(o.geometry.coordinates, r)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s, t.line2curve = l;
        var u = i(0),
            c = r(u),
            h = i(12),
            d = r(h),
            f = i(3),
            p = r(f),
            m = i(2),
            g = i(30)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return e[Math.floor(Math.random() * e.length + 1) - 1]
        }

        function n(e) {
            return !(e.terrainProvider == T || e.terrainProvider instanceof l.EllipsoidTerrainProvider)
        }

        function o() {
            return T
        }

        function a(e) {
            e = e || {
                type: "ion"
            }, e.requestWaterMask = l.defaultValue(e.requestWaterMask, !0), e.requestVertexNormals = l.defaultValue(e.requestVertexNormals, !0);
            var t;
            switch (e.type) {
                default:
                    t = new l.CesiumTerrainProvider((0, u.getProxyUrl)(e));
                    break;
                case "ion":
                case "cesium":
                    t = new l.CesiumTerrainProvider({
                        url: l.IonResource.fromAssetId(1),
                        requestWaterMask: e.requestWaterMask,
                        requestVertexNormals: e.requestVertexNormals
                    });
                    break;
                case "gee":
                case "google":
                    t = new l.GoogleEarthEnterpriseTerrainProvider({
                        metadata: new l.GoogleEarthEnterpriseMetadata((0, u.getProxyUrl)(e))
                    });
                    break;
                case "arcgis":
                    t = new l.ArcGISTiledElevationTerrainProvider((0, u.getProxyUrl)(e));
                    break;
                case "ellipsoid":
                    t = T
            }
            return t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.hasTerrain = n, t.getEllipsoidTerrain = o, t.getTerrainProvider = a;
        var s = i(0),
            l = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(s),
            u = i(2),
            c = i(9),
            h = i(71),
            d = i(45),
            f = i(72),
            p = i(32),
            m = i(74),
            g = i(75),
            v = i(33),
            y = i(76),
            _ = i(77),
            w = i(78),
            b = i(79),
            C = i(80),
            x = i(81),
            P = i(82),
            E = i(83);
        t.BaseLayer = c.BaseLayer, t.GroupLayer = h.GroupLayer, t.TileLayer = d.TileLayer, t.GraticuleLayer = f.GraticuleLayer, t.CustomFeatureGridLayer = p.CustomFeatureGridLayer, t.POILayer = m.POILayer, t.WFSLayer = g.WFSLayer, t.GeoJsonLayer = v.GeoJsonLayer, t.GltfLayer = y.GltfLayer, t.Tiles3dLayer = _.Tiles3dLayer, t.KmlLayer = w.KmlLayer, t.CzmlLayer = b.CzmlLayer, t.TerrainLayer = C.TerrainLayer, t.DrawLayer = x.DrawLayer, t.BaiduImageryProvider = P.BaiduImageryProvider, t.FeatureGridImageryProvider = E.FeatureGridImageryProvider;
        var M = {};
        t.regLayerForConfig = function (e, t) {
            M[e] = t
        }, t.createLayer = function e(t, i, r) {
            var n;
            switch (t.url && (r && (t.url = t.url.replace("$serverURL$", r)), t.url = t.url.replace("$hostname$", location.hostname).replace("$host$", location.host)), t.type) {
                case "group":
                    if (t.layers && t.layers.length > 0) {
                        for (var o = [], a = 0; a < t.layers.length; a++) {
                            var s = e(t.layers[a], i, r);
                            null != s && o.push(s)
                        }
                        var l = {};
                        for (var u in t) l[u] = t[u];
                        l._layers = o, n = new h.GroupLayer(l, i)
                    }
                    break;
                case "base":
                    n = new c.BaseLayer(t, i);
                    break;
                case "www_bing":
                case "www_osm":
                case "www_google":
                case "www_gaode":
                case "www_baidu":
                case "www_tdt":
                case "mapbox":
                case "www_mapbox":
                case "arcgis_cache":
                case "arcgis":
                case "arcgis_tile":
                case "arcgis_dynamic":
                case "sm_img":
                case "supermap_img":
                case "wmts":
                case "tms":
                case "wms":
                case "xyz":
                case "tile":
                case "single":
                case "image":
                case "gee":
                case "custom_tilecoord":
                case "custom_grid":
                    n = new d.TileLayer(t, i), n.isTile = !0;
                    break;
                case "www_poi":
                    n = new m.POILayer(t, i);
                    break;
                case "custom_featuregrid":
                    n = new p.CustomFeatureGridLayer(t, i);
                    break;
                case "custom_graticule":
                    n = new f.GraticuleLayer(t, i);
                    break;
                case "3dtiles":
                    n = new _.Tiles3dLayer(t, i);
                    break;
                case "gltf":
                    n = new y.GltfLayer(t, i);
                    break;
                case "geojson":
                    n = new v.GeoJsonLayer(t, i);
                    break;
                case "geojson-draw":
                    n = new x.DrawLayer(t, i);
                    break;
                case "kml":
                    n = new w.KmlLayer(t, i);
                    break;
                case "czml":
                    n = new b.CzmlLayer(t, i);
                    break;
                case "wfs":
                    n = new g.WFSLayer(t, i);
                    break;
                case "terrain":
                    n = new C.TerrainLayer(t, i);
                    break;
                default:
                    if (M[t.type] && (n = new M[t.type](t, i)), null == n) try {
                        console.log("配置中的图层未处理：" + JSON.stringify(t))
                    } catch (e) {}
            }
            return null !== n && (t._layer = n), n
        }, t.createImageryProvider = function (e, t) {
            e.url && (t && (e.url = e.url.replace("$serverURL$", t)), e.url = e.url.replace("$hostname$", location.hostname).replace("$host$", location.host));
            var i = {};
            for (var n in e) {
                var o = e[n];
                if (null != o) switch (n) {
                    default:
                        i[n] = o;
                        break;
                    case "crs":
                        "4326" == o || "EPSG4326" == o.toUpperCase() || "EPSG:4326" == o.toUpperCase() ? i.tilingScheme = new l.GeographicTilingScheme({
                            numberOfLevelZeroTilesX: e.numberOfLevelZeroTilesX || 2,
                            numberOfLevelZeroTilesY: e.numberOfLevelZeroTilesY || 1
                        }) : i.tilingScheme = new l.WebMercatorTilingScheme({
                            numberOfLevelZeroTilesX: e.numberOfLevelZeroTilesX || 1,
                            numberOfLevelZeroTilesY: e.numberOfLevelZeroTilesY || 1
                        });
                        break;
                    case "rectangle":
                        i.rectangle = l.Rectangle.fromDegrees(o.xmin, o.ymin, o.xmax, o.ymax)
                }
            }
            i.url && i.proxy && (i = (0, u.getProxyUrl)(i));
            var a;
            switch (i.type_new || i.type) {
                case "single":
                case "image":
                    a = new l.SingleTileImageryProvider(i);
                    break;
                case "xyz":
                case "tile":
                    i.customTags = i.customTags || {}, i.customTags["z&1"] = function (e, t, i, r) {
                        return r + 1
                    }, a = new l.UrlTemplateImageryProvider(i);
                    break;
                case "wms":
                    a = new l.WebMapServiceImageryProvider(i);
                    break;
                case "tms":
                    i.url || (i.url = l.buildModuleUrl("Assets/Textures/NaturalEarthII")), a = new l.TileMapServiceImageryProvider(i);
                    break;
                case "wmts":
                    a = new l.WebMapTileServiceImageryProvider(i);
                    break;
                case "gee":
                    a = new l.GoogleEarthEnterpriseImageryProvider({
                        metadata: new l.GoogleEarthEnterpriseMetadata(i)
                    });
                    break;
                case "mapbox":
                case "www_mapbox":
                    a = new l.MapboxImageryProvider(i);
                    break;
                case "arcgis":
                case "arcgis_tile":
                case "arcgis_dynamic":
                    a = new l.ArcGisMapServerImageryProvider(i);
                    break;
                case "sm_img":
                case "supermap_img":
                    a = new l.SuperMapImageryProvider(i);
                    break;
                case "arcgis_cache":
                    l.UrlTemplateImageryProvider.prototype.padLeft0 || (l.UrlTemplateImageryProvider.prototype.padLeft0 = function (e, t) {
                        e = String(e);
                        for (var i = e.length; i < t;) e = "0" + e, i++;
                        return e
                    }), i.customTags = {
                        arc_x: function (e, t, i, r) {
                            return e.padLeft0(t.toString(16), 8)
                        },
                        arc_y: function (e, t, i, r) {
                            return e.padLeft0(i.toString(16), 8)
                        },
                        arc_z: function (e, t, i, r) {
                            return e.padLeft0(r.toString(), 2)
                        },
                        arc_X: function (e, t, i, r) {
                            return e.padLeft0(t.toString(16), 8).toUpperCase()
                        },
                        arc_Y: function (e, t, i, r) {
                            return e.padLeft0(i.toString(16), 8).toUpperCase()
                        },
                        arc_Z: function (e, t, i, r) {
                            return e.padLeft0(r.toString(), 2).toUpperCase()
                        }
                    }, a = new l.UrlTemplateImageryProvider(i);
                    break;
                case "www_tdt":
                    var s, c = 18;
                    switch (i.layer) {
                        default:
                        case "vec_d":
                            s = "vec";
                            break;
                        case "vec_z":
                            s = "cva";
                            break;
                        case "img_d":
                            s = "img";
                            break;
                        case "img_z":
                            s = "cia";
                            break;
                        case "ter_d":
                            s = "ter", c = 14;
                            break;
                        case "ter_z":
                            s = "cta", c = 14
                    }
                    var h;
                    if (h = null == i.key || 0 == i.key.length ? "87949882c75775b5069a0076357b7530" : r(i.key), "4326" == e.crs) {
                        for (var d = new Array(c), f = 0; f <= c; f++) d[f] = (f + 1).toString();
                        var p = "//t{s}.tianditu.gov.cn/" + s + "_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" + s + "&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" + h;
                        i.proxy && (p = (0, u.getProxyUrl)({
                            url: p.replace("{s}", "0"),
                            proxy: i.proxy
                        }).url), a = new l.WebMapTileServiceImageryProvider({
                            url: p,
                            layer: s,
                            style: "default",
                            format: "tiles",
                            tileMatrixSetID: "c",
                            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                            tileMatrixLabels: d,
                            tilingScheme: new l.GeographicTilingScheme,
                            maximumLevel: c
                        })
                    } else {
                        for (var d = new Array(c), f = 0; f <= c; f++) d[f] = f.toString();
                        var p = "//t{s}.tianditu.gov.cn/" + s + "_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" + s + "&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" + h;
                        i.proxy && (p = (0, u.getProxyUrl)({
                            url: p.replace("{s}", "0"),
                            proxy: i.proxy
                        }).url), a = new l.WebMapTileServiceImageryProvider({
                            url: p,
                            layer: s,
                            style: "default",
                            format: "tiles",
                            tileMatrixSetID: "w",
                            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                            tileMatrixLabels: d,
                            tilingScheme: new l.WebMercatorTilingScheme,
                            maximumLevel: c
                        })
                    }
                    break;
                case "www_gaode":
                    var p;
                    switch (i.layer) {
                        case "vec":
                        default:
                            p = "//" + (i.bigfont ? "wprd" : "webrd") + "0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}";
                            break;
                        case "img_d":
                            p = "//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
                            break;
                        case "img_z":
                            p = "//webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8";
                            break;
                        case "time":
                            p = "//tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=" + (new Date).getTime()
                    }
                    i.proxy && (p = (0, u.getProxyUrl)({
                        url: p.replace("{s}", "1"),
                        proxy: i.proxy
                    }).url), a = new l.UrlTemplateImageryProvider({
                        url: p,
                        subdomains: ["1", "2", "3", "4"],
                        maximumLevel: 18
                    });
                    break;
                case "www_baidu":
                    a = new P.BaiduImageryProvider(i);
                    break;
                case "www_google":
                    var p;
                    if ("4326" == e.crs || "wgs84" == e.crs) switch (i.layer) {
                        default:
                        case "img_d":
                            p = "//www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}"
                    } else switch (i.layer) {
                        case "vec":
                        default:
                            p = "//mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile";
                            break;
                        case "img_d":
                            p = "//mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali";
                            break;
                        case "img_z":
                            p = "//mt{s}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil";
                            break;
                        case "ter":
                            p = "//mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile"
                    }
                    i.proxy && (p = (0, u.getProxyUrl)({
                        url: p.replace("{s}", "1"),
                        proxy: i.proxy
                    }).url), a = new l.UrlTemplateImageryProvider({
                        url: p,
                        subdomains: ["1", "2", "3"],
                        maximumLevel: 20
                    });
                    break;
                case "www_osm":
                    var p = "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
                    i.proxy && (p = (0, u.getProxyUrl)({
                        url: p.replace("{s}", "a"),
                        proxy: i.proxy
                    }).url), a = new l.UrlTemplateImageryProvider({
                        url: p,
                        subdomains: "abc",
                        maximumLevel: 18
                    });
                    break;
                case "www_bing":
                    var p = "https://dev.virtualearth.net";
                    i.proxy && (p = (0, u.getProxyUrl)({
                        url: p,
                        proxy: i.proxy
                    }).url);
                    var m = i.layer || l.BingMapsStyle.Aerial;
                    a = new l.BingMapsImageryProvider({
                        url: p,
                        key: i.key || "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc",
                        mapStyle: m
                    });
                    break;
                case "custom_grid":
                    i.cells = i.cells || 2, i.color = l.Color.fromCssColorString(i.color || "rgba(255,255,255,0.5)"), i.glowWidth = i.glowWidth || 3, i.glowColor = l.Color.fromCssColorString(i.glowColor || "rgba(255,255,255,0.1)"), i.backgroundColor = l.Color.fromCssColorString(i.backgroundColor || "rgba(0,0,0,0)"), a = new l.GridImageryProvider(i);
                    break;
                case "custom_tilecoord":
                    a = new l.TileCoordinatesImageryProvider(i);
                    break;
                case "custom_featuregrid":
                    a = new E.FeatureGridImageryProvider(i);
                    break;
                default:
                    console.log("config配置图层未处理:" + e)
            }
            return a.config = i, a
        };
        var T = new l.EllipsoidTerrainProvider({
            ellipsoid: l.Ellipsoid.WGS84
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditPolygon = void 0;
        var n = i(0),
            o = (r(n), i(6)),
            a = (r(o), i(4), i(11)),
            s = r(a),
            l = i(14);
        t.EditPolygon = l.EditPolyline.extend({
            getGraphic: function () {
                return this.entity.polygon
            },
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw || s.getPositions(this.entity)
            },
            hasClosure: !0,
            isClampToGround: function () {
                return this.entity.attribute.style.hasOwnProperty("clampToGround") ? this.entity.attribute.style.clampToGround : !this.entity.attribute.style.perPositionHeight
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e) {
            return null
        }

        function o(e) {
            return e.billboard ? p : e.point ? y : e.label ? g : e.model ? w : e.polyline ? C : e.polylineVolume ? P : e.corridor ? S : e.wall ? M : e.ellipse ? A : e.cylinder ? L : e.polygon ? D : e.rectangle ? N : e.ellipsoid ? I : {
                getCoordinates: n,
                getPositions: n,
                toGeoJSON: n,
                style2Entity: n
            }
        }

        function a(e) {
            return o(e).getCoordinates(e)
        }

        function s(e) {
            return o(e).getPositions(e)
        }

        function l(e) {
            var t = s(e);
            if (!t || 0 == t.length) return null;
            if (1 == t.length) return t[0];
            return e.polygon ? (0, d.centerOfMass)(t) : t[Math.floor(t.length / 2)]
        }

        function u(e) {
            return o(e).toGeoJSON(e)
        }

        function c(e, t) {
            return o(t).style2Entity(e, t)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.corridor = t.ellipsoid = t.rectangle = t.cylinder = t.ellipse = t.circle = t.polygon = t.wall = t.polylineVolume = t.polyline = t.model = t.point = t.label = t.billboard = void 0, t.getCoordinates = a, t.getPositions = s, t.getCenterPosition = l, t.toGeoJSON = u, t.style2Entity = c;
        var h = i(0),
            d = (r(h), i(1)),
            f = i(21),
            p = r(f),
            m = i(8),
            g = r(m),
            v = i(29),
            y = r(v),
            _ = i(24),
            w = r(_),
            b = i(17),
            C = r(b),
            x = i(38),
            P = r(x),
            E = i(39),
            M = r(E),
            T = i(41),
            S = r(T),
            O = i(11),
            D = r(O),
            k = i(31),
            A = r(k),
            R = i(42),
            L = r(R),
            F = i(43),
            N = r(F),
            V = i(44),
            I = r(V),
            z = A;
        t.billboard = p, t.label = g, t.point = y, t.model = w, t.polyline = C, t.polylineVolume = P, t.wall = M, t.polygon = D, t.circle = A, t.ellipse = z, t.cylinder = L, t.rectangle = N, t.ellipsoid = I, t.corridor = S
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {
                scale: 1,
                horizontalOrigin: u.HorizontalOrigin.CENTER,
                verticalOrigin: u.VerticalOrigin.BOTTOM
            });
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "scaleByDistance_near":
                    case "scaleByDistance_nearValue":
                    case "scaleByDistance_far":
                    case "scaleByDistance_farValue":
                    case "distanceDisplayCondition_far":
                    case "distanceDisplayCondition_near":
                        break;
                    case "opacity":
                        t.color = new u.Color.fromCssColorString("#FFFFFF").withAlpha(u.defaultValue(r, 1));
                        break;
                    case "rotation":
                        t.rotation = u.Math.toRadians(r);
                        break;
                    case "scaleByDistance":
                        t.scaleByDistance = r ? new u.NearFarScalar(Number(u.defaultValue(e.scaleByDistance_near, 1e3)), Number(u.defaultValue(e.scaleByDistance_nearValue, 1)), Number(u.defaultValue(e.scaleByDistance_far, 1e6)), Number(u.defaultValue(e.scaleByDistance_farValue, .1))) : null;
                        break;
                    case "distanceDisplayCondition":
                        t.distanceDisplayCondition = r ? new u.DistanceDisplayCondition(Number(u.defaultValue(e.distanceDisplayCondition_near, 0)), Number(u.defaultValue(e.distanceDisplayCondition_far, 1e5))) : null;
                        break;
                    case "clampToGround":
                        t.heightReference = r ? u.HeightReference.CLAMP_TO_GROUND : u.HeightReference.NONE;
                        break;
                    case "heightReference":
                        switch (r) {
                            case "NONE":
                                t.heightReference = u.HeightReference.NONE;
                                break;
                            case "CLAMP_TO_GROUND":
                                t.heightReference = u.HeightReference.CLAMP_TO_GROUND;
                                break;
                            case "RELATIVE_TO_GROUND":
                                t.heightReference = u.HeightReference.RELATIVE_TO_GROUND;
                                break;
                            default:
                                t.heightReference = r
                        }
                        break;
                    case "horizontalOrigin":
                        switch (r) {
                            case "CENTER":
                                t.horizontalOrigin = u.HorizontalOrigin.CENTER;
                                break;
                            case "LEFT":
                                t.horizontalOrigin = u.HorizontalOrigin.LEFT;
                                break;
                            case "RIGHT":
                                t.horizontalOrigin = u.HorizontalOrigin.RIGHT;
                                break;
                            default:
                                t.horizontalOrigin = r
                        }
                        break;
                    case "verticalOrigin":
                        switch (r) {
                            case "CENTER":
                                t.verticalOrigin = u.VerticalOrigin.CENTER;
                                break;
                            case "TOP":
                                t.verticalOrigin = u.VerticalOrigin.TOP;
                                break;
                            case "BOTTOM":
                                t.verticalOrigin = u.VerticalOrigin.BOTTOM;
                                break;
                            default:
                                t.verticalOrigin = r
                        }
                        break;
                    case "visibleDepth":
                        t.disableDepthTestDistance = r ? 0 : Number.POSITIVE_INFINITY
                }
            }
            return t
        }

        function o(e) {
            return [e.position.getValue((0, d.currentTime)())]
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Point",
                    coordinates: t[0]
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditBase = void 0;
        var n = i(0),
            o = r(n),
            a = i(15),
            s = i(7),
            l = r(s),
            u = i(6),
            c = r(u),
            h = i(4),
            d = i(3),
            f = r(d),
            p = i(1);
        t.EditBase = a.Class.extend({
            _dataSource: null,
            _minPointNum: 1,
            _maxPointNum: 9999,
            initialize: function (e, t, i) {
                this.entity = e, this.viewer = t, this.dataSource = i, this.draggers = []
            },
            fire: function (e, t, i) {
                this._fire && this._fire(e, t, i)
            },
            formatNum: function (e, t) {
                return f.formatNum(e, t)
            },
            setCursor: function (e) {
                this.viewer._container.style.cursor = e ? "crosshair" : ""
            },
            activate: function () {
                return this._enabled ? this : (this._enabled = !0, this.entity.inProgress = !0, this.changePositionsToCallback(), this.bindDraggers(), this.bindEvent(), this.fire(l.EditStart, {
                    edittype: this.entity.attribute.type,
                    entity: this.entity
                }), this)
            },
            disable: function () {
                return this._enabled ? (this._enabled = !1, this.destroyEvent(), this.destroyDraggers(), this.finish(), this.entity.inProgress = !1, this.fire(l.EditStop, {
                    edittype: this.entity.attribute.type,
                    entity: this.entity
                }), this.tooltip.setVisible(!1), this) : this
            },
            changePositionsToCallback: function () {},
            finish: function () {},
            bindEvent: function () {
                var e = this,
                    t = new o.BoundingSphere,
                    i = new o.Cartesian3,
                    r = new o.ScreenSpaceEventHandler(this.viewer.canvas);
                r.dragger = null, r.setInputAction(function (t) {
                    var i = e.viewer.scene.pick(t.position);
                    if (o.defined(i)) {
                        var n = i.id || i.primitive.id || i.primitive;
                        if (n && o.defaultValue(n._isDragger, !1) && (e.viewer.scene.screenSpaceCameraController.enableRotate = !1, e.viewer.scene.screenSpaceCameraController.enableTilt = !1, e.viewer.scene.screenSpaceCameraController.enableTranslate = !1, e.viewer.scene.screenSpaceCameraController.enableInputs = !1, e.viewer.wutu && e.viewer.wutu.popup.close(n), r.dragger = n, r.dragger.point && (r.dragger.show = !1), e.setCursor(!0), r.dragger.onDragStart)) {
                            var a = r.dragger.position;
                            a && a.getValue && (a = a.getValue(e.viewer.clock.currentTime)), r.dragger.onDragStart(r.dragger, a)
                        }
                    }
                }, o.ScreenSpaceEventType.LEFT_DOWN), r.setInputAction(function (n) {
                    var a = r.dragger;
                    if (a) switch (a._pointType) {
                        case c.PointType.MoveHeight:
                            var s = n.endPosition.y - n.startPosition.y,
                                l = a.position;
                            l && l.getValue && (l = l.getValue(e.viewer.clock.currentTime));
                            var u = new o.EllipsoidTangentPlane(l);
                            t.center = l, t.radius = 1;
                            var d = 1.5 * e.viewer.scene.frameState.camera.getPixelSize(t, e.viewer.scene.frameState.context.drawingBufferWidth, e.viewer.scene.frameState.context.drawingBufferHeight);
                            o.Cartesian3.multiplyByScalar(u.zAxis, -s * d, i);
                            var f = o.Cartesian3.clone(l);
                            o.Cartesian3.add(l, i, f), a.position = f, a.onDrag && a.onDrag(a, f, l), e.updateAttrForEditing();
                            break;
                        default:
                            e.tooltip.showAt(n.endPosition, h.message.edit.end);
                            var m = (0, p.getCurrentMousePosition)(e.viewer.scene, n.endPosition, e.entity);
                            m && (a.position = m, a.onDrag && a.onDrag(a, m), e.updateAttrForEditing())
                    } else {
                        e.tooltip.setVisible(!1);
                        var g = e.viewer.scene.pick(n.endPosition);
                        if (o.defined(g)) {
                            var v = g.id;
                            if (v && o.defaultValue(v._isDragger, !1) && v.draw_tooltip) {
                                var y = v.draw_tooltip;
                                c.PointType.Control == v._pointType && e._positions_draw && e._positions_draw.length && e._positions_draw.length > e._minPointNum && (y += h.message.del.def), e.tooltip.showAt(n.endPosition, y)
                            }
                        }
                    }
                }, o.ScreenSpaceEventType.MOUSE_MOVE), r.setInputAction(function (t) {
                    var i = r.dragger;
                    if (i) {
                        e.setCursor(!1), i.show = !0;
                        var n = i.position;
                        n && n.getValue && (n = n.getValue(e.viewer.clock.currentTime)), i.onDragEnd && i.onDragEnd(i, n), e.fire(l.EditMovePoint, {
                            edittype: e.entity.attribute.type,
                            entity: e.entity,
                            position: n
                        }), r.dragger = null, e.viewer.scene.screenSpaceCameraController.enableRotate = !0, e.viewer.scene.screenSpaceCameraController.enableTilt = !0, e.viewer.scene.screenSpaceCameraController.enableTranslate = !0, e.viewer.scene.screenSpaceCameraController.enableInputs = !0
                    }
                }, o.ScreenSpaceEventType.LEFT_UP), r.setInputAction(function (t) {
                    var i = e.viewer.scene.pick(t.position);
                    if (o.defined(i)) {
                        var r = i.id;
                        if (r && o.defaultValue(r._isDragger, !1) && c.PointType.Control == r._pointType) {
                            e.deletePointForDragger(r, t.position) && e.fire(l.EditRemovePoint, {
                                edittype: e.entity.attribute.type,
                                entity: e.entity
                            })
                        }
                    }
                }, o.ScreenSpaceEventType.RIGHT_CLICK), this.draggerHandler = r
            },
            destroyEvent: function () {
                this.viewer.scene.screenSpaceCameraController.enableRotate = !0, this.viewer.scene.screenSpaceCameraController.enableTilt = !0, this.viewer.scene.screenSpaceCameraController.enableTranslate = !0, this.viewer.scene.screenSpaceCameraController.enableInputs = !0, this.setCursor(!1), this.draggerHandler && (this.draggerHandler.dragger && (this.draggerHandler.dragger.show = !0), this.draggerHandler.destroy(), this.draggerHandler = null)
            },
            bindDraggers: function () {},
            updateDraggers: function () {
                if (!this._enabled) return this;
                this.destroyDraggers(), this.bindDraggers()
            },
            destroyDraggers: function () {
                for (var e = 0, t = this.draggers.length; e < t; e++) this.dataSource.entities.remove(this.draggers[e]);
                this.draggers = []
            },
            deletePointForDragger: function (e, t) {
                if (this._positions_draw) {
                    if (this._positions_draw.length - 1 < this._minPointNum) return this.tooltip.showAt(t, h.message.del.min + this._minPointNum), !1;
                    var i = e.index;
                    return i >= 0 && i < this._positions_draw.length && (this._positions_draw.splice(i, 1), this.updateDraggers(), this.updateAttrForEditing(), !0)
                }
            },
            updateAttrForEditing: function () {}
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawBase = void 0;
        var n = i(0),
            o = r(n),
            a = (i(1), i(15)),
            s = i(3),
            l = r(s),
            u = i(7),
            c = r(u);
        t.DrawBase = a.Class.extend({
            type: null,
            dataSource: null,
            initialize: function (e) {
                this.viewer = e.viewer, this.dataSource = e.dataSource, this.primitives = e.primitives, this.dataSource || (this.dataSource = new o.CustomDataSource, this.viewer.dataSources.add(this.dataSource)), this.tooltip = e.tooltip || new Tooltip(this.viewer.container)
            },
            fire: function (e, t, i) {
                this._fire && this._fire(e, t, i)
            },
            formatNum: function (e, t) {
                return l.formatNum(e, t)
            },
            activate: function (e, t) {
                return this._enabled ? this : (this._enabled = !0, this.drawOkCalback = t, this.createFeature(e), this.entity.inProgress = !0, this.setCursor(!0), this.bindEvent(), this.fire(c.DrawStart, {
                    drawtype: this.type,
                    entity: this.entity
                }), this.entity)
            },
            disable: function (e) {
                return this._enabled ? (this._enabled = !1, this.setCursor(!1), e && this.entity.inProgress ? (this.dataSource && this.dataSource.entities.contains(this.entity) && this.dataSource.entities.remove(this.entity), this.primitives && this.primitives.contains(this.entity) && this.primitives.remove(this.entity)) : (this.entity.inProgress = !1, this.finish(), this.drawOkCalback && (this.drawOkCalback(this.entity), delete this.drawOkCalback), this.fire(c.DrawCreated, {
                    drawtype: this.type,
                    entity: this.entity
                })), this.destroyHandler(), this._positions_draw = null, this.entity = null, this.tooltip.setVisible(!1), this) : this
            },
            createFeature: function (e) {},
            getHandler: function () {
                return this.handler && !this.handler.isDestroyed() || (this.handler = new o.ScreenSpaceEventHandler(this.viewer.scene.canvas)), this.handler
            },
            destroyHandler: function () {
                this.handler && this.handler.destroy(), this.handler = void 0
            },
            setCursor: function (e) {
                this.viewer._container.style.cursor = e ? "crosshair" : ""
            },
            bindEvent: function () {},
            _positions_draw: null,
            getDrawPosition: function () {
                return this._positions_draw
            },
            editClass: null,
            getEditClass: function (e) {
                if (null == this.editClass) return null;
                var t = new this.editClass(e, this.viewer, this.dataSource);
                return null != this._minPointNum && (t._minPointNum = this._minPointNum), null != this._maxPointNum && (t._maxPointNum = this._maxPointNum), t._fire = this._fire, t.tooltip = this.tooltip, t
            },
            updateAttrForDrawing: function (e) {},
            finish: function () {},
            attrClass: null,
            getCoordinates: function (e) {
                return this.attrClass.getCoordinates(e)
            },
            getPositions: function (e) {
                return this.attrClass.getPositions(e)
            },
            toGeoJSON: function (e) {
                return this.attrClass.toGeoJSON(e)
            },
            attributeToEntity: function (e, t) {
                var i = this.createFeature(e);
                return this._positions_draw = t, this.updateAttrForDrawing(!0), this.finish(), i
            },
            jsonToEntity: function (e) {
                var t = e.properties,
                    i = l.getPositionByGeoJSON(e);
                return this.attributeToEntity(t, i)
            },
            bindExtraEntity: function (e, t) {
                return t && t.style && this.style2Entity(t.style, e), this._positions_draw = this.getPositions(e), this.updateAttrForDrawing(!0), this.finish(), e
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {});
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "silhouette":
                    case "silhouetteColor":
                    case "silhouetteAlpha":
                    case "silhouetteSize":
                    case "fill":
                    case "color":
                    case "opacity":
                        break;
                    case "modelUrl":
                        t.uri = r;
                        break;
                    case "clampToGround":
                        t.heightReference = r ? u.HeightReference.CLAMP_TO_GROUND : u.HeightReference.NONE;
                        break;
                    case "heightReference":
                        switch (r) {
                            case "NONE":
                                t.heightReference = u.HeightReference.NONE;
                                break;
                            case "CLAMP_TO_GROUND":
                                t.heightReference = u.HeightReference.CLAMP_TO_GROUND;
                                break;
                            case "RELATIVE_TO_GROUND":
                                t.heightReference = u.HeightReference.RELATIVE_TO_GROUND;
                                break;
                            default:
                                t.heightReference = r
                        }
                }
            }
            e.silhouette ? (t.silhouetteColor = new u.Color.fromCssColorString(e.silhouetteColor || "#FFFFFF").withAlpha(Number(e.silhouetteAlpha || 1)), t.silhouetteSize = Number(e.silhouetteSize || 1)) : t.silhouetteSize = 0;
            var n = e.hasOwnProperty("opacity") ? Number(e.opacity) : 1;
            return e.fill ? t.color = new u.Color.fromCssColorString(e.color || "#FFFFFF").withAlpha(n) : t.color = new u.Color.fromCssColorString("#FFFFFF").withAlpha(n), t
        }

        function o(e) {
            var t = e.position;
            return t && t.getValue && (t = t.getValue((0, d.currentTime)())), [t]
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Point",
                    coordinates: t[0]
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2)
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            var i = 2 * e - 100 + 3 * t + .2 * t * t + .1 * e * t + .2 * Math.sqrt(Math.abs(e));
            return i += 2 * (20 * Math.sin(6 * e * m) + 20 * Math.sin(2 * e * m)) / 3, i += 2 * (20 * Math.sin(t * m) + 40 * Math.sin(t / 3 * m)) / 3, i += 2 * (160 * Math.sin(t / 12 * m) + 320 * Math.sin(t * m / 30)) / 3
        }

        function n(e, t) {
            var i = 300 + e + 2 * t + .1 * e * e + .1 * e * t + .1 * Math.sqrt(Math.abs(e));
            return i += 2 * (20 * Math.sin(6 * e * m) + 20 * Math.sin(2 * e * m)) / 3, i += 2 * (20 * Math.sin(e * m) + 40 * Math.sin(e / 3 * m)) / 3, i += 2 * (150 * Math.sin(e / 12 * m) + 300 * Math.sin(e / 30 * m)) / 3
        }

        function o(e, t) {
            return e < 72.004 || e > 137.8347 || t < .8293 || t > 55.8271 || !1
        }

        function a(e) {
            var t = Number(e[0]),
                i = Number(e[1]),
                r = 52.35987755982988,
                n = t - .0065,
                o = i - .006,
                a = Math.sqrt(n * n + o * o) - 2e-5 * Math.sin(o * r),
                s = Math.atan2(o, n) - 3e-6 * Math.cos(n * r),
                l = a * Math.cos(s),
                u = a * Math.sin(s);
            return l = Number(l.toFixed(6)), u = Number(u.toFixed(6)), [l, u]
        }

        function s(e) {
            var t = Number(e[0]),
                i = Number(e[1]),
                r = Math.sqrt(t * t + i * i) + 2e-5 * Math.sin(i * p),
                n = Math.atan2(i, t) + 3e-6 * Math.cos(t * p),
                o = r * Math.cos(n) + .0065,
                a = r * Math.sin(n) + .006;
            return o = Number(o.toFixed(6)), a = Number(a.toFixed(6)), [o, a]
        }

        function l(e) {
            var t = Number(e[0]),
                i = Number(e[1]);
            if (o(t, i)) return [t, i];
            var a = r(t - 105, i - 35),
                s = n(t - 105, i - 35),
                l = i / 180 * m,
                u = Math.sin(l);
            u = 1 - v * u * u;
            var c = Math.sqrt(u);
            a = 180 * a / (g * (1 - v) / (u * c) * m), s = 180 * s / (g / c * Math.cos(l) * m);
            var h = i + a,
                d = t + s;
            return d = Number(d.toFixed(6)), h = Number(h.toFixed(6)), [d, h]
        }

        function u(e) {
            var t = Number(e[0]),
                i = Number(e[1]);
            if (o(t, i)) return [t, i];
            var a = r(t - 105, i - 35),
                s = n(t - 105, i - 35),
                l = i / 180 * m,
                u = Math.sin(l);
            u = 1 - v * u * u;
            var c = Math.sqrt(u);
            a = 180 * a / (g * (1 - v) / (u * c) * m), s = 180 * s / (g / c * Math.cos(l) * m);
            var h = i + a,
                d = t + s,
                f = 2 * t - d,
                p = 2 * i - h;
            return f = Number(f.toFixed(6)), p = Number(p.toFixed(6)), [f, p]
        }

        function c(e) {
            return u(a(e))
        }

        function h(e) {
            return s(l(e))
        }

        function d(e) {
            var t = Number(e[0]),
                i = Number(e[1]),
                r = 20037508.34 * t / 180,
                n = Math.log(Math.tan((90 + i) * m / 360)) / (m / 180);
            return n = 20037508.34 * n / 180, r = Number(r.toFixed(2)), n = Number(n.toFixed(2)), [r, n]
        }

        function f(e) {
            var t = Number(e[0]),
                i = Number(e[1]),
                r = t / 20037508.34 * 180,
                n = i / 20037508.34 * 180;
            return n = 180 / m * (2 * Math.atan(Math.exp(n * m / 180)) - m / 2), r = Number(r.toFixed(6)), n = Number(n.toFixed(6)), [r, n]
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.bd2gcj = a, t.gcj2bd = s, t.wgs2gcj = l, t.gcj2wgs = u, t.bd2wgs = c, t.wgs2bd = h, t.jwd2mct = d, t.mct2jwd = f;
        var p = 52.35987755982988,
            m = 3.141592653589793,
            g = 6378245,
            v = .006693421622965943
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            var i = {},
                r = e.boundingSphere,
                n = r.center,
                o = l.Cartographic.fromCartesian(n),
                a = Number(o.height.toFixed(2));
            if (i = {
                    x: Number(l.Math.toDegrees(o.longitude).toFixed(6)),
                    y: Number(l.Math.toDegrees(o.latitude).toFixed(6)),
                    z: a
                }, t) {
                var s = l.Matrix4.fromArray(e._root.transform),
                    u = l.Matrix4.getTranslation(s, new l.Cartesian3),
                    c = l.Cartographic.fromCartesian(u);
                if (l.defined(c)) {
                    i.x = Number(l.Math.toDegrees(c.longitude).toFixed(6)), i.y = Number(l.Math.toDegrees(c.latitude).toFixed(6)), i.z = Number(c.height.toFixed(2));
                    var h = l.Matrix4.getMatrix3(s, new l.Matrix3),
                        d = l.Matrix4.getMatrix3(l.Transforms.eastNorthUpToFixedFrame(u), new l.Matrix3),
                        f = l.Matrix3.getColumn(d, 0, new l.Cartesian3),
                        p = l.Matrix3.getColumn(d, 1, new l.Cartesian3),
                        m = l.Matrix3.getColumn(d, 2, new l.Cartesian3),
                        g = l.Matrix3.getColumn(h, 0, new l.Cartesian3);
                    g = l.Cartesian3.cross(g, m, g), g = l.Cartesian3.cross(m, g, g), g = l.Cartesian3.normalize(g, g);
                    var v = l.Cartesian3.angleBetween(f, g);
                    l.Cartesian3.angleBetween(p, g) > .5 * Math.PI && (v = 2 * Math.PI - v), i.heading = Number(l.Math.toDegrees(v).toFixed(1)), console.log("模型内部世界矩阵:" + JSON.stringify(i))
                }
            }
            return i
        }

        function n(e, t) {
            if (null == t) return e;
            var i;
            switch (t.toUpperCase()) {
                case "Y_UP_TO_Z_UP":
                    i = l.Axis.Y_UP_TO_Z_UP;
                    break;
                case "Z_UP_TO_Y_UP":
                    i = l.Axis.Z_UP_TO_Y_UP;
                    break;
                case "X_UP_TO_Z_UP":
                    i = l.Axis.X_UP_TO_Z_UP;
                    break;
                case "Z_UP_TO_X_UP":
                    i = l.Axis.Z_UP_TO_X_UP;
                    break;
                case "X_UP_TO_Y_UP":
                    i = l.Axis.X_UP_TO_Y_UP;
                    break;
                case "Y_UP_TO_X_UP":
                    i = l.Axis.Y_UP_TO_X_UP
            }
            return null == i ? e : l.Matrix4.multiplyTransformation(e, i, e)
        }

        function o(e, t) {
            var i;
            if (l.defined(e._root) && l.defined(e._root.transform) && t.transform) {
                var r = l.Cartesian3.fromDegrees(t.x, t.y, t.z);
                i = l.Transforms.eastNorthUpToFixedFrame(r);
                var o = l.Matrix4.fromRotationTranslation(l.Matrix3.fromRotationZ(l.Math.toRadians(t.heading || 0)));
                l.Matrix4.multiply(i, o, i), t.scale > 0 && 1 != t.scale && l.Matrix4.multiplyByUniformScale(i, t.scale, i), t.axis && (i = n(i, t.axis)), e._root.transform = i
            } else {
                var a = e.boundingSphere,
                    s = l.Cartographic.fromCartesian(a.center),
                    u = l.Cartesian3.fromRadians(s.longitude, s.latitude, 0),
                    c = l.Cartesian3.fromDegrees(t.x, t.y, t.z),
                    h = l.Cartesian3.subtract(c, u, new l.Cartesian3);
                i = l.Matrix4.fromTranslation(h), e.modelMatrix = i
            }
            return i
        }

        function a(e, t) {
            if (!t) return null;
            t instanceof l.Cartesian3 && (t = [t]);
            for (var i = 0, r = t.length; i < r; ++i) {
                var n = t[i],
                    o = l.SceneTransforms.wgs84ToWindowCoordinates(e.scene, n);
                if (l.defined(o)) {
                    var a = e.scene.pick(o, 10, 10);
                    if (l.defined(a) && l.defined(a.primitive) && a.primitive instanceof l.Cesium3DTileset) return a.primitive
                }
            }
            return null
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.getCenter = r, t.updateMatrix = o, t.pick3DTileset = a;
        var s = i(0),
            l = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(s)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawPoint = void 0;
        var n = i(0),
            o = r(n),
            a = i(23),
            s = i(1),
            l = i(29),
            u = r(l),
            c = i(4),
            h = i(7),
            d = r(h),
            f = i(46),
            p = i(8);
        t.DrawPoint = a.DrawBase.extend({
            type: "point",
            editClass: f.EditPoint,
            attrClass: u,
            createFeature: function (e) {
                this._positions_draw = null;
                var t = this,
                    i = {
                        show: !1,
                        position: new o.CallbackProperty(function (e) {
                            return t.getDrawPosition()
                        }, !1),
                        point: u.style2Entity(e.style),
                        attribute: e
                    };
                return e.style && e.style.label && (i.label = (0, p.style2Entity)(e.style.label)), this.entity = this.dataSource.entities.add(i), this.entity
            },
            style2Entity: function (e, t) {
                return e && e.label && (0, p.style2Entity)(e.label, t.label), u.style2Entity(e, t.point)
            },
            bindEvent: function () {
                var e = this;
                this.getHandler().setInputAction(function (t) {
                    var i = (0, s.getCurrentMousePosition)(e.viewer.scene, t.endPosition, e.entity);
                    i && (e._positions_draw = i), e.tooltip.showAt(t.endPosition, c.message.draw.point.start), e.fire(d.DrawMouseMove, {
                        drawtype: e.type,
                        entity: e.entity,
                        position: i
                    })
                }, o.ScreenSpaceEventType.MOUSE_MOVE), this.getHandler().setInputAction(function (t) {
                    var i = (0, s.getCurrentMousePosition)(e.viewer.scene, t.position, e.entity);
                    i && (e._positions_draw = i, e.disable())
                }, o.ScreenSpaceEventType.LEFT_CLICK)
            },
            finish: function () {
                this.entity.show = !0, this.entity.editing = this.getEditClass(this.entity), this.entity.position = this.getDrawPosition()
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e, t, i, r) {
            return d.defined(t) && d.defined(e) ? n(d.Matrix4.fromRotationTranslation(d.Matrix3.fromQuaternion(t, f), e, p), i, r) : new d.HeadingPitchRoll
        }

        function n(e, t, i, r) {
            return d.Transforms.fixedFrameToHeadingPitchRoll(e, t, i, r)
        }

        function o(e, t, i, r) {
            r = r || d.Transforms.eastNorthUpToFixedFrame;
            var n = r(e, i, new d.Matrix4),
                o = d.Matrix4.multiply(d.Matrix4.inverse(n, new d.Matrix4), t, new d.Matrix4),
                a = d.Matrix4.getMatrix3(o, new d.Matrix3),
                s = d.Quaternion.fromRotationMatrix(a);
            return d.HeadingPitchRoll.fromQuaternion(s)
        }

        function a(e, t, i, r) {
            i = i || d.Ellipsoid.WGS84;
            var o = d.Cartesian3.normalize(d.Cartesian3.subtract(t, e, m), m);
            d.Transforms.rotationMatrixFromPositionVelocity(e, o, i, g);
            var a = d.Matrix4.fromRotationTranslation(g, e, p);
            return d.Matrix4.multiplyTransformation(a, d.Axis.Z_UP_TO_X_UP, a), n(a, i, r)
        }

        function s(e, t, i) {
            var r = d.Cartographic.fromCartesian(e);
            r.height = 0;
            var n = d.Cartographic.toCartesian(r),
                o = d.Cartesian3.normalize(d.Cartesian3.subtract(n, e, new d.Cartesian3), new d.Cartesian3),
                a = d.Quaternion.fromAxisAngle(o, d.Math.toRadians(i)),
                s = d.Matrix3.fromQuaternion(a),
                l = d.Matrix4.fromRotationTranslation(s),
                u = d.Cartesian3.subtract(t, e, new d.Cartesian3),
                c = d.Matrix4.multiplyByPoint(l, u, new d.Cartesian3);
            return d.Cartesian3.add(c, e, new d.Cartesian3)
        }

        function l(e, t, i, r, n) {
            i = i || 0, r = r || "z", n = n || d.Transforms.eastNorthUpToFixedFrame;
            var o = d.Math.toRadians(-i);
            r = "UNIT_" + r.toUpperCase();
            var a = d.Quaternion.fromAxisAngle(d.Cartesian3[r], o),
                s = d.Matrix3.fromQuaternion(a),
                l = new d.Cartesian3(t.x, t.y, t.z),
                u = d.Matrix4.fromRotationTranslation(s, d.Cartesian3.ZERO);
            d.Matrix4.multiplyByTranslation(u, l, u);
            var c = d.Ellipsoid.WGS84.cartographicToCartesian(d.Cartographic.fromCartesian(e)),
                h = n(c);
            d.Matrix4.multiplyTransformation(h, u, u);
            var f = new d.Cartesian3;
            return d.Matrix4.getTranslation(u, f), f
        }

        function u(e, t) {
            for (var i = [], r = 1; r < e.length; r++) {
                var n = e[r - 1],
                    o = e[r],
                    a = d.Cartesian3.subtract(n, o, new d.Cartesian3),
                    s = d.Cartesian3.cross(n, a, new d.Cartesian3),
                    l = c(n, s, 1e3 * t),
                    u = c(o, s, 1e3 * t);
                1 == r && i.push(l), i.push(u)
            }
            return i
        }

        function c(e, t, i) {
            var r = new d.Ray(e, t);
            return d.Ray.getPoint(r, i, new d.Cartesian3)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.getHeadingPitchRollByOrientation = r, t.getHeadingPitchRollByMatrix = n, t.getHeadingPitchRollByMatrixOld = o, t.getHeadingPitchRollForLine = a, t.getRotateCenterPoint = s, t.getPositionTranslation = l, t.getOffsetLine = u;
        var h = i(0),
            d = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(h),
            f = new d.Matrix3,
            p = new d.Matrix4,
            m = new d.Cartesian3,
            p = new d.Matrix4,
            g = new d.Matrix3
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {});
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                    case "scaleByDistance_near":
                    case "scaleByDistance_nearValue":
                    case "scaleByDistance_far":
                    case "scaleByDistance_farValue":
                    case "distanceDisplayCondition_far":
                    case "distanceDisplayCondition_near":
                        break;
                    case "outlineColor":
                        t.outlineColor = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(e.outlineOpacity || e.opacity || 1);
                        break;
                    case "color":
                        t.color = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(Number(e.opacity || 1));
                        break;
                    case "scaleByDistance":
                        t.scaleByDistance = r ? new u.NearFarScalar(Number(e.scaleByDistance_near || 1e3), Number(e.scaleByDistance_nearValue || 1), Number(e.scaleByDistance_far || 1e6), Number(e.scaleByDistance_farValue || .1)) : null;
                        break;
                    case "distanceDisplayCondition":
                        t.distanceDisplayCondition = r ? new u.DistanceDisplayCondition(Number(e.distanceDisplayCondition_near || 0), Number(e.distanceDisplayCondition_far || 1e5)) : null;
                        break;
                    case "clampToGround":
                        t.heightReference = r ? u.HeightReference.CLAMP_TO_GROUND : u.HeightReference.NONE;
                        break;
                    case "heightReference":
                        switch (r) {
                            case "NONE":
                                t.heightReference = u.HeightReference.NONE;
                                break;
                            case "CLAMP_TO_GROUND":
                                t.heightReference = u.HeightReference.CLAMP_TO_GROUND;
                                break;
                            case "RELATIVE_TO_GROUND":
                                t.heightReference = u.HeightReference.RELATIVE_TO_GROUND;
                                break;
                            default:
                                t.heightReference = r
                        }
                        break;
                    case "visibleDepth":
                        t.disableDepthTestDistance = r ? 0 : Number.POSITIVE_INFINITY
                }
            }
            return e.outline || (t.outlineWidth = 0), t
        }

        function o(e) {
            return [e.position.getValue((0, d.currentTime)())]
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Point",
                    coordinates: t[0]
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function o(e, t, i, r, n) {
            g++;
            var o = v + g + "Type",
                a = v + g + "Image";
            return l.Material[o] = o, l.Material[a] = e, t ? l.Material._materialCache.addMaterial(l.Material[o], {
                fabric: {
                    type: l.Material.PolylineArrowLinkType,
                    uniforms: {
                        color: new l.Color(1, 0, 0, 1),
                        image: l.Material[a],
                        time: 0,
                        repeat: i || new l.Cartesian2(1, 1),
                        axisY: r,
                        image2: t,
                        bgColor: n
                    },
                    source: d.default
                },
                translucent: function () {
                    return !0
                }
            }) : l.Material._materialCache.addMaterial(l.Material[o], {
                fabric: {
                    type: o,
                    uniforms: {
                        color: new l.Color(1, 0, 0, 1),
                        image: l.Material[a],
                        time: 0,
                        repeat: i || new l.Cartesian2(1, 1),
                        axisY: r
                    },
                    source: c.default
                },
                translucent: function () {
                    return !0
                }
            }), {
                type: l.Material[o],
                image: l.Material[a]
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.LineFlowMaterial = void 0;
        var a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = i(0),
            l = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(s),
            u = i(68),
            c = r(u),
            h = i(69),
            d = r(h),
            f = new l.Color(0, 0, 0, 0),
            p = new l.Color(1, 1, 1),
            m = t.LineFlowMaterial = function () {
                function e(t) {
                    if (n(this, e), t = l.defaultValue(t, l.defaultValue.EMPTY_OBJECT), this._definitionChanged = new l.Event, this._color = void 0, this._colorSubscription = void 0, this.color = l.defaultValue(t.color, f), this.url = l.defaultValue(t.url, void 0), this.url) {
                        this.axisY = Boolean(t.axisY), this.bgUrl = l.defaultValue(t.bgUrl, void 0), this.bgColor = l.defaultValue(t.bgColor, p), this._duration = t.duration || 1e3;
                        var i = o(this.url, this.bgUrl, t.repeat, Boolean(t.axisY), this.bgColor);
                        this._materialType = i.type, this._materialImage = i.image, this._time = void 0
                    }
                }
                return a(e, [{
                    key: "getType",
                    value: function (e) {
                        return this._materialType
                    }
                }, {
                    key: "getValue",
                    value: function (e, t) {
                        return l.defined(t) || (t = {}), t.color = l.Property.getValueOrClonedDefault(this._color, e, f, t.color), t.image = this._materialImage, void 0 === this._time && (this._time = (new Date).getTime()), t.time = ((new Date).getTime() - this._time) / this._duration, t
                    }
                }, {
                    key: "equals",
                    value: function (t) {
                        return this === t || t instanceof e && l.Property.equals(this._color, t._color)
                    }
                }, {
                    key: "isConstant",
                    get: function () {
                        return !1
                    }
                }, {
                    key: "definitionChanged",
                    get: function () {
                        return this._definitionChanged
                    }
                }]), e
            }();
        l.defineProperties(m.prototype, {
            color: l.createPropertyDescriptor("color")
        });
        var g = 0,
            v = "AnimationLine"
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {
                fill: !0
            }), e.clampToGround && (e.hasOwnProperty("height") && delete e.height, e.hasOwnProperty("extrudedHeight") && delete e.extrudedHeight);
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                    case "color":
                    case "animation":
                        break;
                    case "outlineColor":
                        t.outlineColor = new h.Color.fromCssColorString(r || "#FFFF00").withAlpha(h.defaultValue(e.outlineOpacity, h.defaultValue(e.opacity, 1)));
                        break;
                    case "rotation":
                        t.rotation = h.Math.toRadians(r), e.stRotation || (t.stRotation = h.Math.toRadians(r));
                        break;
                    case "stRotation":
                        t.stRotation = h.Math.toRadians(r);
                        break;
                    case "height":
                        t.height = Number(r), e.extrudedHeight && (t.extrudedHeight = Number(e.extrudedHeight) + Number(r));
                        break;
                    case "extrudedHeight":
                        t.extrudedHeight = Number(t.height || e.height || 0) + Number(r);
                        break;
                    case "radius":
                        t.semiMinorAxis = Number(r), t.semiMajorAxis = Number(r)
                }
            }
            return g.setFillMaterial(t, e), t
        }

        function o(e) {
            return [e.position.getValue((0, p.currentTime)())]
        }

        function a(e) {
            var t = o(e);
            return f.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Point",
                    coordinates: t[0]
                }
            }
        }

        function l(e) {
            var t = u(e),
                i = e.ellipse.height.getValue((0, p.currentTime)());
            return f.lonlats2cartesians(t, i)
        }

        function u(e) {
            var t = e.ellipse.semiMajorAxis.getValue(),
                i = y.buffer(s(e), t, {
                    units: "meters"
                });
            return i && i.geometry.coordinates && i.geometry.coordinates[0]
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s, t.getOutlinePositions = l, t.getOutlineCoordinates = u;
        var c = i(0),
            h = r(c),
            d = i(3),
            f = r(d),
            p = i(2),
            m = i(13),
            g = r(m),
            v = i(12),
            y = r(v)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            u || (l = new h.Color.fromCssColorString(h.defaultValue(t.color, "#ffff00")).withAlpha(h.defaultValue(t.opacity, .3)), u = e.entities.add({
                name: "单体化高亮面",
                noMouseMove: !0,
                polygon: {
                    perPositionHeight: !1,
                    classificationType: h.ClassificationType.BOTH,
                    material: l,
                    hierarchy: new h.CallbackProperty(function (e) {
                        return s
                    }, !1)
                }
            }))
        }

        function o(e) {
            s = e.polygon.hierarchy.getValue(), u.polygon.show = !0, u.properties = e.properties, u.tooltip = e.tooltip ? e.tooltip : null, u.popup = e.popup ? e.popup : null
        }

        function a(e) {
            h.defined(u) && (u.polygon.show = !1)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.CustomFeatureGridLayer = void 0;
        var s, l, u, c = i(0),
            h = r(c),
            d = i(5),
            f = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(d),
            p = i(12),
            m = r(p),
            g = i(2),
            v = i(1),
            y = i(73),
            _ = i(21),
            w = i(8),
            b = i(17),
            C = i(11),
            x = y.FeatureGridLayer.extend({
                _cacheGrid: {},
                _cacheFeature: {},
                _addImageryCache: function (e) {
                    this._cacheGrid[e.key] = {
                        opts: e,
                        isLoading: !0
                    };
                    var t = this;
                    this.getDataForGrid(e, function (i) {
                        t._visible && t._showData(e, i)
                    })
                },
                getDataForGrid: function (e, t) {
                    this.config.getDataForGrid && this.config.getDataForGrid(e, t)
                },
                checkHasBreak: function (e) {
                    return !this._visible || !this._cacheGrid[e]
                },
                _showData: function (e, t) {
                    var i = e.key;
                    if (!this.checkHasBreak[i]) {
                        for (var r = this, n = [], o = 0, a = t.length; o < a; o++) {
                            var s = t[o],
                                l = s[this.config.IdName || "id"],
                                u = this._cacheFeature[l];
                            if (u) u.grid.push(i), this.updateEntity(u.entity, s);
                            else {
                                var c = this.createEntity(e, s, function (e) {
                                    r.config.debuggerTileInfo && (e._temp_id = l, e.popup = function (e) {
                                        return JSON.stringify(r._cacheFeature[e._temp_id].grid)
                                    }), r._cacheFeature[l] = {
                                        grid: [i],
                                        entity: e
                                    }
                                });
                                null != c && (r.config.debuggerTileInfo && (c._temp_id = l, c.popup = function (e) {
                                    return JSON.stringify(r._cacheFeature[e._temp_id].grid)
                                }), r._cacheFeature[l] = {
                                    grid: [i],
                                    entity: c
                                })
                            }
                            n.push(l)
                        }
                        this._cacheGrid[i] = this._cacheGrid[i] || {}, this._cacheGrid[i].ids = n, this._cacheGrid[i].isLoading = !1
                    }
                },
                createEntity: function (e, t, i) {
                    return this.config.createEntity ? this.config.createEntity(e, t, i) : null
                },
                updateEntity: function (e, t) {
                    this.config.updateEntity && this.config.updateEntity(e, t)
                },
                removeEntity: function (e) {
                    this.config.removeEntity ? this.config.removeEntity(e) : this.dataSource.entities.remove(e)
                },
                _removeImageryCache: function (e) {
                    var t = e.key,
                        i = this._cacheGrid[t];
                    if (i) {
                        if (i.ids)
                            for (var r = 0; r < i.ids.length; r++) {
                                var n = i.ids[r],
                                    o = this._cacheFeature[n];
                                o && (o.grid.remove(t), 0 == o.grid.length && (delete this._cacheFeature[n], this.removeEntity(o.entity)))
                            }
                        delete this._cacheGrid[t]
                    }
                },
                _removeAllImageryCache: function () {
                    this.config.removeAllEntity ? this.config.removeAllEntity() : (this.dataSource.entities.removeAll(), this.primitives.removeAll()), this._cacheFeature = {}, this._cacheGrid = {}
                },
                removeEx: function () {
                    this.config.removeAllEntity ? this.config.removeAllEntity() : (this.dataSource.entities.removeAll(), this.primitives.removeAll()), this._cacheFeature = {}, this._cacheGrid = {}, this.viewer.dataSources.remove(this.dataSource), this.viewer.scene.primitives.remove(this.primitives)
                },
                reload: function () {
                    var e = this;
                    for (var t in this._cacheGrid) {
                        var i = this._cacheGrid[t];
                        if (null != i && null != i.opts && !i.isLoading) {
                            var r = i.opts;
                            this.getDataForGrid(r, function (t) {
                                e._showData(r, t)
                            })
                        }
                    }
                },
                hasOpacity: !0,
                _opacity: 1,
                setOpacity: function (e) {
                    this._opacity = e;
                    for (var t in this._cacheFeature) {
                        var i = this._cacheFeature[t].entity;
                        if (i.polygon && i.polygon.material && i.polygon.material.color && (this._updatEntityAlpha(i.polygon.material.color, this._opacity), i.polygon.outlineColor && this._updatEntityAlpha(i.polygon.outlineColor, this._opacity)), i.polyline && i.polyline.material && i.polyline.material.color && this._updatEntityAlpha(i.polyline.material.color, this._opacity), i.billboard && (i.billboard.color = new h.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity)), i.model && (i.model.color = new h.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity)), i.label) {
                            var r = this._opacity;
                            i.attribute && i.attribute.label && i.attribute.label.opacity && (r = i.attribute.label.opacity), i.label.fillColor && this._updatEntityAlpha(i.label.fillColor, r), i.label.outlineColor && this._updatEntityAlpha(i.label.outlineColor, r), i.label.backgroundColor && this._updatEntityAlpha(i.label.backgroundColor, r)
                        }
                    }
                },
                _updatEntityAlpha: function (e, t) {
                    if (e) {
                        var i = e.getValue(this.viewer.clock.currentTime);
                        if (!i || !i.withAlpha) return e;
                        i = i.withAlpha(t), e.setValue(i)
                    }
                },
                bindMourseEvnet: function (e) {
                    var t = this;
                    (this.config.columns || this.config.popup) && (e.popup = {
                        html: function (e) {
                            var i = t.getEntityAttr(e);
                            return (0, g.isString)(i) ? i : (0, g.getPopupForConfig)(t.config, i)
                        },
                        anchor: this.config.popupAnchor || [0, -15]
                    }), this.config.tooltip && (e.tooltip = {
                        html: function (e) {
                            var i = t.getEntityAttr(e);
                            return (0, g.isString)(i) ? i : (0, g.getPopupForConfig)({
                                popup: t.config.tooltip
                            }, i)
                        },
                        anchor: this.config.tooltipAnchor || [0, -15]
                    }), this.config.click && (e.click = this.config.click), this.config.mouseover && (e.mouseover = this.config.mouseover), this.config.mouseout && (e.mouseout = this.config.mouseout)
                },
                getEntityAttr: function (e) {
                    return (0, g.getAttrVal)(e.properties)
                },
                colorHash: {},
                setDefSymbol: function (e) {
                    var t = this.getEntityAttr(e) || {};
                    if (e.polygon) {
                        var i = t.id || t.OBJECTID || 0,
                            r = this.colorHash[i];
                        r || (r = h.Color.fromRandom({
                            minimumGreen: .75,
                            maximumBlue: .75,
                            alpha: this._opacity
                        }), this.colorHash[i] = r), e.polygon.material = r, e.polygon.outline = !0, e.polygon.outlineColor = h.Color.WHITE
                    } else if (e.polyline) {
                        var i = t.id || t.OBJECTID || 0,
                            r = this.colorHash[i];
                        r || (r = h.Color.fromRandom({
                            minimumGreen: .75,
                            maximumBlue: .75,
                            alpha: this._opacity
                        }), this.colorHash[i] = r), e.polyline.material = r, e.polyline.width = 2
                    } else e.billboard && (e.billboard.scale = .5, e.billboard.horizontalOrigin = h.HorizontalOrigin.CENTER, e.billboard.verticalOrigin = h.VerticalOrigin.BOTTOM)
                },
                setConfigSymbol: function (e, t) {
                    var i = this.getEntityAttr(e) || {},
                        r = t.styleOptions;
                    if (t.styleField) {
                        var s = i[t.styleField],
                            l = t.styleFieldOptions[s];
                        null != l && (r = (0, g.clone)(r), r = f.default.extend(r, l))
                    }
                    if ("function" == typeof t.calback) {
                        var l = t.calback(i, e, t);
                        if (!l) return;
                        r = (0, g.clone)(r), r = f.default.extend(r, l)
                    }
                    if (r = r || {}, e.polyline && ((0, b.style2Entity)(r, e.polyline), r.label && r.label.field)) {
                        r.label.heightReference = h.defaultValue(r.label.heightReference, h.HeightReference.CLAMP_TO_GROUND);
                        var u = (0, w.style2Entity)(r.label);
                        u.text = i[r.label.field] || u.text || "";
                        var c = getPolylinePositions(e),
                            d = c[Math.floor(c.length / 2)];
                        r.label.position && ("center" == r.label.position ? d = (0, v.centerOfMass)(c) : (0, g.isNumber)(r.label.position) && (d = c[r.label.position]));
                        var p = this.dataSource.entities.add({
                            position: d,
                            label: u,
                            properties: i
                        });
                        this.bindMourseEvnet(p)
                    }
                    if (e.polygon) {
                        if ((0, C.style2Entity)(r, e.polygon), r.outlineWidth && r.outlineWidth > 1) {
                            e.polygon.outline = !1;
                            var m = {
                                    color: r.outlineColor,
                                    width: r.outlineWidth,
                                    opacity: r.outlineOpacity,
                                    lineType: "solid",
                                    clampToGround: !0,
                                    outline: !1
                                },
                                y = (0, b.style2Entity)(m);
                            y.positions = (0, C.getPositions)(e);
                            var x = this.dataSource.entities.add({
                                polyline: y,
                                properties: i
                            });
                            this.bindMourseEvnet(x)
                        }
                        if (r.label && r.label.field) {
                            r.label.heightReference = h.defaultValue(r.label.heightReference, h.HeightReference.CLAMP_TO_GROUND);
                            var u = (0, w.style2Entity)(r.label);
                            u.text = i[r.label.field] || u.text || "";
                            var p = this.dataSource.entities.add({
                                position: (0, v.centerOfMass)((0, C.getPositions)(e)),
                                label: u,
                                properties: i
                            });
                            this.bindMourseEvnet(p)
                        }
                        if (this.config.buildings) {
                            var E = Number(i[this.config.buildings.cloumn] || 1),
                                M = 3.5,
                                T = this.config.buildings.height;
                            (0, g.isNumber)(T) ? M = T: (0, g.isString)(T) && (M = i[T] || M), e.polygon.extrudedHeight = E * M
                        }
                        this.config.dth && (e.polygon.classificationType = h.ClassificationType.BOTH, h.defined(r.color) || (e.polygon.material = P), e.polygon.perPositionHeight = !1, n(this.viewer, this.config.dth), this.config.mouseover = o, this.config.mouseout = a)
                    }
                    if (e.label && (r.label = r.label || r || {}, r.label.heightReference = h.defaultValue(r.label.heightReference, h.HeightReference.CLAMP_TO_GROUND), (0, w.style2Entity)(r.label, e.label), r.label.field && (e.label.text = i[r.label.field] || e.label.text || "")), e.billboard) {
                        if (r.heightReference = h.defaultValue(r.heightReference, h.HeightReference.CLAMP_TO_GROUND), (0, _.style2Entity)(r, e.billboard), r.label && r.label.field && !e.label) {
                            r.label.heightReference = h.defaultValue(r.label.heightReference, h.HeightReference.CLAMP_TO_GROUND);
                            var u = (0, w.style2Entity)(r.label);
                            u.text = i[r.label.field] || u.text || "";
                            var p = this.dataSource.entities.add({
                                position: e.position,
                                label: u,
                                properties: i
                            });
                            this.bindMourseEvnet(p)
                        }
                        if (r.model) {
                            r.model.heightReference = h.defaultValue(r.model.heightReference, h.HeightReference.CLAMP_TO_GROUND);
                            var S = modelStyle2Entity(r.model),
                                p = this.dataSource.entities.add({
                                    position: e.position,
                                    model: S,
                                    properties: i
                                });
                            this.bindMourseEvnet(p)
                        }
                    }
                    e.attribute = r
                },
                updateDthBuffer: function (e) {
                    try {
                        var t = h.defaultValue(this.config.dth.buffer, 1);
                        e = m.buffer(e, t, {
                            units: "meters"
                        })
                    } catch (e) {}
                    return e
                }
            }),
            P = new h.Color(0, 0, 0, .01);
        t.CustomFeatureGridLayer = x
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.GeoJsonLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(5),
            a = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(o),
            s = i(2),
            l = i(1),
            u = i(9),
            c = i(21),
            h = i(8),
            d = i(24),
            f = i(17),
            p = i(11),
            m = u.BaseLayer.extend({
                dataSource: null,
                add: function () {
                    !this.config.reload && this.dataSource ? this.viewer.dataSources.add(this.dataSource) : this.queryData()
                },
                remove: function () {
                    this.viewer.dataSources.remove(this.dataSource)
                },
                centerAt: function (e) {
                    if (this.config.extent || this.config.center) this.viewer.wutu.centerAt(this.config.extent || this.config.center, {
                        duration: e,
                        isWgs84: !0
                    });
                    else {
                        if (null == this.dataSource) return;
                        this.viewer.flyTo(this.dataSource.entities.values, {
                            duration: e
                        })
                    }
                },
                queryData: function () {
                    var e = this,
                        t = (0, s.getProxyUrl)(this.config);
                    if (t.symbol && t.symbol.styleOptions) {
                        var i = t.symbol.styleOptions;
                        if (n.defined(i.clampToGround) && (t.clampToGround = i.clampToGround), n.defined(i.color)) {
                            var r = new n.Color.fromCssColorString(n.defaultValue(i.color, "#FFFF00")).withAlpha(Number(n.defaultValue(i.opacity, .5)));
                            t.fill = r
                        }
                        if (n.defined(i.outlineColor)) {
                            var o = new n.Color.fromCssColorString(i.outlineColor || "#FFFFFF").withAlpha(n.defaultValue(i.outlineOpacity, n.defaultValue(i.opacity, 1)));
                            t.stroke = o
                        }
                        n.defined(i.outlineWidth) && (t.strokeWidth = i.outlineWidth)
                    }
                    n.GeoJsonDataSource.load(t.url, t).then(function (t) {
                        e.showResult(t)
                    }).otherwise(function (t) {
                        e.showError("服务出错", t)
                    })
                },
                showResult: function (e) {
                    this.dataSource && this.viewer.dataSources.remove(this.dataSource), this.dataSource = e, this.viewer.dataSources.add(e), this.config.flyTo && this.centerAt();
                    for (var t = e.entities.values, i = 0, r = t.length; i < r; i++) {
                        var n = t[i];
                        this.config.symbol && ("default" == this.config.symbol ? this.setDefSymbol(n) : this.setConfigSymbol(n, this.config.symbol)), this.bindMourseEvnet(n)
                    }
                    1 != this._opacity && this.setOpacity(this._opacity)
                },
                hasOpacity: !0,
                _opacity: 1,
                setOpacity: function (e) {
                    if (this._opacity = e, null != this.dataSource)
                        for (var t = this.dataSource.entities.values, i = 0, r = t.length; i < r; i++) {
                            var o = t[i];
                            if (o.polygon && o.polygon.material && o.polygon.material.color && (this._updatEntityAlpha(o.polygon.material.color, this._opacity), o.polygon.outlineColor && this._updatEntityAlpha(o.polygon.outlineColor, this._opacity)), o.polyline && o.polyline.material && o.polyline.material.color && this._updatEntityAlpha(o.polyline.material.color, this._opacity), o.billboard && (o.billboard.color = new n.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity)), o.model && (o.model.color = new n.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity)), o.label) {
                                var a = this._opacity;
                                o.attribute && o.attribute.label && o.attribute.label.opacity && (a = o.attribute.label.opacity), o.label.fillColor && this._updatEntityAlpha(o.label.fillColor, a), o.label.outlineColor && this._updatEntityAlpha(o.label.outlineColor, a), o.label.backgroundColor && this._updatEntityAlpha(o.label.backgroundColor, a)
                            }
                        }
                },
                _updatEntityAlpha: function (e, t) {
                    if (e) {
                        var i = e.getValue(this.viewer.clock.currentTime);
                        if (!i || !i.withAlpha) return e;
                        i = i.withAlpha(t), e.setValue(i)
                    }
                },
                bindMourseEvnet: function (e) {
                    var t = this;
                    (this.config.columns || this.config.popup) && (e.popup = {
                        html: function (e) {
                            var i = t.getEntityAttr(e);
                            return (0, s.isString)(i) ? i : (0, s.getPopupForConfig)(t.config, i)
                        },
                        anchor: this.config.popupAnchor || [0, -15]
                    }), this.config.tooltip && (e.tooltip = {
                        html: function (e) {
                            var i = t.getEntityAttr(e);
                            return (0, s.isString)(i) ? i : (0, s.getPopupForConfig)({
                                popup: t.config.tooltip
                            }, i)
                        },
                        anchor: this.config.tooltipAnchor || [0, -15]
                    }), this.config.click && (e.click = this.config.click), this.config.mouseover && (e.mouseover = this.config.mouseover), this.config.mouseout && (e.mouseout = this.config.mouseout)
                },
                getEntityAttr: function (e) {
                    return (0, s.getAttrVal)(e.properties)
                },
                colorHash: {},
                setDefSymbol: function (e) {
                    var t = this.getEntityAttr(e) || {};
                    if (e.polygon) {
                        var i = t.id || t.OBJECTID || 0,
                            r = this.colorHash[i];
                        r || (r = n.Color.fromRandom({
                            minimumGreen: .75,
                            maximumBlue: .75,
                            alpha: this._opacity
                        }), this.colorHash[i] = r), e.polygon.material = r, e.polygon.outline = !0, e.polygon.outlineColor = n.Color.WHITE
                    } else if (e.polyline) {
                        var i = t.id || t.OBJECTID || 0,
                            r = this.colorHash[i];
                        r || (r = n.Color.fromRandom({
                            minimumGreen: .75,
                            maximumBlue: .75,
                            alpha: this._opacity
                        }), this.colorHash[i] = r), e.polyline.material = r, e.polyline.width = 2
                    } else e.billboard && (e.billboard.scale = .5, e.billboard.horizontalOrigin = n.HorizontalOrigin.CENTER, e.billboard.verticalOrigin = n.VerticalOrigin.BOTTOM)
                },
                setConfigSymbol: function (e, t) {
                    var i = this.getEntityAttr(e) || {},
                        r = t.styleOptions;
                    if (t.styleField) {
                        var o = i[t.styleField],
                            u = t.styleFieldOptions[o];
                        null != u && (r = (0, s.clone)(r), r = a.default.extend(r, u))
                    }
                    if ("function" == typeof t.calback) {
                        var u = t.calback(i, e, t);
                        if (!u) return;
                        r = (0, s.clone)(r), r = a.default.extend(r, u)
                    }
                    if (r = r || {}, e.polyline && ((0, f.style2Entity)(r, e.polyline), r.label && r.label.field)) {
                        r.label.heightReference = n.defaultValue(r.label.heightReference, n.HeightReference.CLAMP_TO_GROUND);
                        var m = (0, h.style2Entity)(r.label);
                        m.text = i[r.label.field] || m.text || "";
                        var g = (0, f.getPositions)(e),
                            v = g[Math.floor(g.length / 2)];
                        r.label.position && ("center" == r.label.position ? v = (0, l.centerOfMass)(g) : (0, s.isNumber)(r.label.position) && (v = g[r.label.position]));
                        var y = this.dataSource.entities.add({
                            position: v,
                            label: m,
                            properties: i
                        });
                        this.bindMourseEvnet(y)
                    }
                    if (e.polygon) {
                        if ((0, p.style2Entity)(r, e.polygon), r.outlineWidth && r.outlineWidth > 1) {
                            e.polygon.outline = !1;
                            var _ = {
                                    color: r.outlineColor,
                                    width: r.outlineWidth,
                                    opacity: r.outlineOpacity,
                                    lineType: "solid",
                                    clampToGround: !0,
                                    outline: !1
                                },
                                w = (0, f.style2Entity)(_);
                            w.positions = (0, p.getPositions)(e);
                            var b = this.dataSource.entities.add({
                                polyline: w,
                                properties: i
                            });
                            this.bindMourseEvnet(b)
                        }
                        if (r.label && r.label.field) {
                            r.label.heightReference = n.defaultValue(r.label.heightReference, n.HeightReference.CLAMP_TO_GROUND);
                            var m = (0, h.style2Entity)(r.label);
                            m.text = i[r.label.field] || m.text || "";
                            var y = this.dataSource.entities.add({
                                position: (0, l.centerOfMass)((0, p.getPositions)(e)),
                                label: m,
                                properties: i
                            });
                            this.bindMourseEvnet(y)
                        }
                        if (this.config.buildings) {
                            var C = Number(i[this.config.buildings.cloumn] || 1),
                                x = 3.5,
                                P = this.config.buildings.height;
                            (0, s.isNumber)(P) ? x = P: (0, s.isString)(P) && (x = i[P] || x), e.polygon.extrudedHeight = C * x
                        }
                    }
                    if (e.label && (r.label = r.label || r || {}, r.label.heightReference = n.defaultValue(r.label.heightReference, n.HeightReference.CLAMP_TO_GROUND), (0, h.style2Entity)(r.label, e.label), r.label.field && (e.label.text = i[r.label.field] || e.label.text || "")), e.billboard) {
                        if (r.heightReference = n.defaultValue(r.heightReference, n.HeightReference.CLAMP_TO_GROUND), (0, c.style2Entity)(r, e.billboard), r.label && r.label.field && !e.label) {
                            r.label.heightReference = n.defaultValue(r.label.heightReference, n.HeightReference.CLAMP_TO_GROUND);
                            var m = (0, h.style2Entity)(r.label);
                            m.text = i[r.label.field] || m.text || "";
                            var y = this.dataSource.entities.add({
                                position: e.position,
                                label: m,
                                properties: i
                            });
                            this.bindMourseEvnet(y)
                        }
                        if (r.model) {
                            r.model.heightReference = n.defaultValue(r.model.heightReference, n.HeightReference.CLAMP_TO_GROUND);
                            var E = (0, d.style2Entity)(r.model),
                                y = this.dataSource.entities.add({
                                    position: e.position,
                                    model: E,
                                    properties: i
                                });
                            this.bindMourseEvnet(y)
                        }
                    }
                    e.attribute = r
                }
            });
        t.GeoJsonLayer = m
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TilesBase = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(a),
            l = i(126),
            u = r(l),
            c = i(127),
            h = r(c);
        t.TilesBase = function () {
            function e(t) {
                n(this, e), t = t || {}, this.viewer = t.viewer, this.tileset = t.tileset, this.positions = t.positions, this._b3dmOffset = t.b3dmOffset || new s.Cartesian2, this.tileset && this.tileset._config.editOffset && (this.b3dmOffset = new s.Cartesian2(this.tileset._config.editOffset.x, this.tileset._config.editOffset.y)), this.positions && this._preparePos(this.positions), this.localPosArr && !0 !== t.floodAll && this._prepareWorks()
            }
            return o(e, [{
                key: "setPositions",
                value: function (e) {
                    e && 0 != e.length && (this.positions = e, this._preparePos(this.positions), this.localPosArr && (this._prepareWorks(), this.activeEdit()))
                }
            }, {
                key: "setUpAxis",
                value: function (e) {
                    return "X" == e ? void(this.base_height = this.flatRect[0]) : "Y" == e ? void(this.base_height = this.flatRect[1]) : void(this.base_height = this.flatRect[2])
                }
            }, {
                key: "_prepareWorks",
                value: function () {
                    this._createTexture(), this._createCommand()
                }
            }, {
                key: "_createTexture",
                value: function () {
                    var e = this.viewer.scene.context,
                        t = new s.Texture({
                            context: e,
                            width: 4096,
                            height: 4096,
                            pixelFormat: s.PixelFormat.RGBA,
                            pixelDatatype: s.PixelDatatype.FLOAT,
                            sampler: new s.Sampler({
                                wrapS: s.TextureWrap.CLAMP_TO_EDGE,
                                wrapT: s.TextureWrap.CLAMP_TO_EDGE,
                                minificationFilter: s.TextureMinificationFilter.NEAREST,
                                magnificationFilter: s.TextureMagnificationFilter.NEAREST
                            })
                        }),
                        i = new s.Texture({
                            context: e,
                            width: 4096,
                            height: 4096,
                            pixelFormat: s.PixelFormat.DEPTH_STENCIL,
                            pixelDatatype: s.PixelDatatype.UNSIGNED_INT_24_8
                        });
                    this.fbo = new s.Framebuffer({
                        context: e,
                        colorTextures: [t],
                        depthStencilTexture: i,
                        destroyAttachments: !1
                    }), this._fboClearCommand = new s.ClearCommand({
                        color: new s.Color(0, 0, 0, 0),
                        framebuffer: this.fbo
                    })
                }
            }, {
                key: "_createCamera",
                value: function () {
                    return {
                        viewMatrix: s.Matrix4.IDENTITY,
                        inverseViewMatrix: s.Matrix4.IDENTITY,
                        frustum: new s.OrthographicOffCenterFrustum,
                        positionCartographic: new s.Cartographic,
                        positionWC: new s.Cartesian3,
                        directionWC: s.Cartesian3.UNIT_Z,
                        upWC: s.Cartesian3.UNIT_Y,
                        rightWC: s.Cartesian3.UNIT_X,
                        viewProjectionMatrix: s.Matrix4.IDENTITY
                    }
                }
            }, {
                key: "_createPolygonGeometry",
                value: function () {
                    var e = new s.PolygonGeometry({
                        polygonHierarchy: new s.PolygonHierarchy(this.localPosArr),
                        perPositionHeight: !0
                    });
                    return s.PolygonGeometry.createGeometry(e)
                }
            }, {
                key: "_createCommand",
                value: function () {
                    var e = this.viewer.scene.context,
                        t = this._createPolygonGeometry(),
                        i = this._createCamera(),
                        r = s.ShaderProgram.fromCache({
                            context: e,
                            vertexShaderSource: u.default,
                            fragmentShaderSource: h.default,
                            attributeLocations: {
                                position: 0
                            }
                        }),
                        n = s.VertexArray.fromGeometry({
                            context: e,
                            geometry: t,
                            attributeLocations: r._attributeLocations,
                            bufferUsage: s.BufferUsage.STATIC_DRAW,
                            interleave: !0
                        }),
                        o = new s.RenderState;
                    o.depthTest.enabled = !1, o.depthRange.near = -1e6, o.depthRange.far = 1e6;
                    var a = s.BoundingRectangle.fromPoints(this.localPosArr, new s.BoundingRectangle);
                    i.frustum.left = a.x, i.frustum.top = a.y + a.height, i.frustum.right = a.x + a.width, i.frustum.bottom = a.y, this._camera = i;
                    var l = s.Matrix4.computeOrthographicOffCenter(i.frustum.left, i.frustum.right, i.frustum.bottom, i.frustum.top, i.frustum.near, i.frustum.far, new s.Matrix4);
                    this.polygonBounds = new s.Cartesian4(i.frustum.left, i.frustum.bottom, i.frustum.right, i.frustum.top), this.drawCommand = new s.DrawCommand({
                        boundingVolume: t.boundingVolume,
                        primitiveType: s.PrimitiveType.TRIANGLES,
                        vertexArray: n,
                        shaderProgram: r,
                        renderState: o,
                        pass: s.Pass.CESIUM_3D_TILE,
                        uniformMap: {
                            myPorjection: function () {
                                return l
                            }
                        }
                    })
                }
            }, {
                key: "clear",
                value: function () {
                    s.ExpandByMars.resetTilesEditor()
                }
            }, {
                key: "deActiveEdit",
                value: function () {
                    s.ExpandByMars.tilesEditor.IsYaPing[0] = !1
                }
            }, {
                key: "update",
                value: function (e) {
                    if (!this.drawed) {
                        this.drawed = !0;
                        var t = e.context;
                        this._passState || (this._passState = new s.PassState(t)), this._passState.framebuffer = this.fbo, this._passState.viewport = new s.BoundingRectangle(0, 0, 4096, 4096);
                        var i = t.uniformState;
                        i.updateCamera(this._camera), i.updatePass(this.drawCommand.pass), this.drawCommand.framebuffer = this.fbo, this.drawCommand.execute(t, this._passState)
                    }
                }
            }, {
                key: "_preparePos",
                value: function (e) {
                    if (e && 0 != e.length) {
                        for (var t, i = [], r = 99999, n = 0; n < e.length; n++) {
                            var o = s.Cartographic.fromCartesian(e[n]),
                                a = o.height,
                                l = s.Matrix4.multiplyByPoint(this.tileInverTransform, e[n], new s.Cartesian3);
                            this.tileset._config.offset.z && (l.z -= this.tileset._config.offset.z), this.tileset._config.editOffset && this.tileset._config.editOffset.z && (l.z += this.tileset._config.editOffset.z), i.push(l), a < r && (r = a, t = l)
                        }
                        this.minHeight = r, this.minLocalPos = t, this.localPosArr = i
                    }
                }
            }, {
                key: "destroy",
                value: function () {
                    s.ExpandByMars.resetTilesEditor(), delete this._tileset, delete this.tileInverTransform, delete this.drawCommand, delete this._passState, delete this.polygonBounds, delete this._fboClearCommand, delete this.fbo, delete this.localPosArr, delete this.minHeight, delete this.minLocalPos, delete this.positions, delete this._b3dmOffset, delete this._camera, delete this._external, delete this._passState, delete this.drawed
                }
            }, {
                key: "tileset",
                get: function () {
                    return this._tileset
                },
                set: function (e) {
                    this._tileset = e;
                    var t = new s.Matrix4;
                    s.Matrix4.fromArray(e._root.transform, 0, t), s.Matrix4.inverse(t, t), this.tileInverTransform = t, this.tileset._config.editOffset && (this._b3dmOffset = new s.Cartesian2(this.tileset._config.editOffset.x, this.tileset._config.editOffset.y))
                }
            }, {
                key: "b3dmOffset",
                get: function () {
                    return this._b3dmOffset
                },
                set: function (e) {
                    e && (this._b3dmOffset.x = e.x || 0, this._b3dmOffset.y = e.y || 0, s.ExpandByMars.tilesEditor.b3dmOffset = this.b3dmOffset)
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            T = e, t = t || {}, R = i || "", L = [], P = t.defaultOptions || {
                windowOptions: {
                    position: "rt",
                    maxmin: !1,
                    resize: !0
                },
                autoDisable: !0,
                disableOther: !0
            }, "time" == (E = t.version) && (E = (new Date).getTime());
            var r = t.widgetsAtStart;
            if (r && r.length > 0)
                for (var n = 0; n < r.length; n++) {
                    var o = r[n];
                    o.hasOwnProperty("uri") && "" != o.uri ? o.hasOwnProperty("visible") && !o.visible || (o.autoDisable = !1, o.openAtStart = !0, o._nodebug = !0, s(o), L.push(o)) : console.log("widget未配置uri：" + JSON.stringify(o))
                }
            if (M = t.debugger) {
                var u = '<div id="widget-testbar" class="widgetbar animation-slide-bottom no-print-view" >      <div style="height: 30px; line-height:30px;"><b style="color: #4db3ff;">widget测试栏</b>&nbsp;&nbsp;<button  id="widget-testbar-remove"  type="button" class="btn btn-link btn-xs">关闭</button> </div>     <button id="widget-testbar-disableAll" type="button" class="btn btn-info" ><i class="fa fa-globe"></i>漫游</button></div>';
                (0, k.default)("body").append(u), (0, k.default)("#widget-testbar-remove").click(function (e) {
                    w()
                }), (0, k.default)("#widget-testbar-disableAll").click(function (e) {
                    f()
                })
            }
            if ((r = t.widgets) && r.length > 0) {
                for (var n = 0; n < r.length; n++) {
                    var o = r[n];
                    if ("group" == o.type) {
                        for (var u = ' <div class="btn-group dropup">  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-align-justify"></i>' + o.name + ' <span class="caret"></span></button> <ul class="dropdown-menu">', c = 0; c < o.children.length; c++) {
                            var p = o.children[c];
                            p.hasOwnProperty("uri") && "" != p.uri ? (u += ' <li data-widget="' + p.uri + '" class="widget-btn" ><a href="#"><i class="fa fa-star"></i>' + p.name + "</a></li>", s(p), L.push(p)) : console.log("widget未配置uri：" + JSON.stringify(p))
                        }
                        u += "</ul></div>", M && !o._nodebug && (0, k.default)("#widget-testbar").append(u)
                    } else {
                        if (!o.hasOwnProperty("uri") || "" == o.uri) {
                            console.log("widget未配置uri：" + JSON.stringify(o));
                            continue
                        }
                        if (M && !o._nodebug) {
                            var u = '<button type="button" class="btn btn-primary widget-btn" data-widget="' + o.uri + '"  > <i class="fa fa-globe"></i>' + o.name + " </button>";
                            (0, k.default)("#widget-testbar").append(u)
                        }
                        s(o), L.push(o)
                    }
                }
                M && (0, k.default)("#widget-testbar .widget-btn").each(function () {
                    (0, k.default)(this).click(function (e) {
                        var t = (0, k.default)(this).attr("data-widget");
                        null != t && "" != t && (h(t) ? d(t) : l(t))
                    })
                })
            }
            for (var n = 0; n < L.length; n++) {
                var o = L[n];
                (o.openAtStart || o.createAtStart) && F.push(o)
            }
            if ((0, k.default)(window).resize(function () {
                    for (var e = 0; e < L.length; e++) {
                        var t = L[e];
                        t._class && t._class.indexResize()
                    }
                }), M) {
                var m = a();
                m && l(m)
            }
            g()
        }

        function n() {
            return o(P.windowOptions)
        }

        function o(e, t) {
            if (null == e || "object" != (void 0 === e ? "undefined" : x(e))) return e;
            if (e.constructor != Object && e.constructor != Array) return e;
            if (e.constructor == Date || e.constructor == RegExp || e.constructor == Function || e.constructor == String || e.constructor == Number || e.constructor == Boolean) return new e.constructor(e);
            t = t || new e.constructor;
            for (var i in e) t[i] = void 0 === t[i] ? o(e[i], null) : t[i];
            return t
        }

        function a() {
            var e = window.location.toString();
            return -1 === e.indexOf("#") ? "" : (e = e.split("#"), e && e.length > 0 ? e[1] : void 0)
        }

        function s(e) {
            if (P)
                for (var t in P) "windowOptions" == t || e.hasOwnProperty(t) || (e[t] = P[t]);
            e.path = _(R + e.uri), e.name = e.name || e.label
        }

        function l(e, t) {
            null == T && e.viewer && r(e.viewer), "string" == typeof e ? (e = {
                uri: e
            }, null != t && (e.disableOther = !t)) : null == e.uri && console.error("activate激活widget时需要uri参数！");
            for (var i, n = 0; n < L.length; n++) {
                var o = L[n];
                if (e.uri == o.uri || o.id && e.uri == o.id) {
                    if (i = o, i.isloading) return i;
                    for (var a in e) "uri" != a && (i[a] = e[a]);
                    break
                }
            }
            if (null == i && (s(e), i = e, L.push(e)), M && (console.log("开始激活widget：" + i.uri), window.location.hash = "#" + i.uri), i.hasOwnProperty("disableOhter") && !i.hasOwnProperty("disableOther") && (i.disableOther = i.disableOhter), i.disableOther ? f(i.uri, i.group) : p(i.group, i.uri), i._class)
                if (i._class.isActivate)
                    if (i._class.update) i._class.update();
                    else {
                        i._class.disableBase();
                        var l = setInterval(function () {
                            i._class.isActivate || (i._class.activateBase(), clearInterval(l))
                        }, 200)
                    }
            else i._class.activateBase();
            else {
                for (var n = 0; n < F.length; n++)
                    if (F[n].uri == i.uri) return F[n];
                F.push(i), 1 == F.length && g()
            }
            return i
        }

        function u(e) {
            for (var t = 0; t < L.length; t++) {
                var i = L[t];
                if (e == i.uri || e == i.id) return i
            }
        }

        function c(e) {
            var t = u(e);
            return t ? t._class : null
        }

        function h(e) {
            var t = c(e);
            return null != t && t.isActivate
        }

        function d(e) {
            if (null != e)
                for (var t = 0; t < L.length; t++) {
                    var i = L[t];
                    if (i._class && (e == i.uri || e == i.id)) {
                        i._class.disableBase();
                        break
                    }
                }
        }

        function f(e, t) {
            for (var i = 0; i < L.length; i++) {
                var r = L[i];
                if (t && r.group == t);
                else if (!r.autoDisable) continue;
                (!e || e != r.uri && e != r.id) && (r._class && r._class.disableBase())
            }
        }

        function p(e, t) {
            if (null != e)
                for (var i = 0; i < L.length; i++) {
                    var r = L[i];
                    if (r.group == e) {
                        if (t && (t == r.uri || t == r.id)) continue;
                        r._class && r._class.disableBase()
                    }
                }
        }

        function m(e) {
            for (var t = 0; t < L.length; t++) {
                e(L[t])
            }
        }

        function g() {
            if (0 != F.length) {
                if (O) return void setTimeout(g, 500);
                O = !0, S = F[0], S.isloading = !0;
                var e = S.uri;
                E && (-1 == e.indexOf("?") ? e += "?time=" + E : e += "&time=" + E), window.NProgress && NProgress.start(), M && console.log("开始加载js：" + R + e), A.Loader.async([R + e], function () {
                    O = !1, S.isloading = !1, M && console.log("完成js加载：" + R + e), window.NProgress && NProgress.done(!0), F.shift(), g()
                })
            }
        }

        function v(e) {
            if (null != S) return S.isloading = !1, S._class = new e(S, T), S._class.activateBase(), S._class;
            for (var t = y(), i = 0; i < L.length; i++) {
                var r = L[i];
                if (t.endsWith(r.uri)) return r.isloading = !1, r._class = new e(r, T), r._class.activateBase(), r._class
            }
        }

        function y() {
            for (var e, t = document.scripts, i = t.length - 1; i >= 0; i--)
                if (null != (e = t[i].src) && "" != e && -1 != e.indexOf("widgets")) return e;
            return ""
        }

        function _(e) {
            var t = e.lastIndexOf("/");
            return e.substring(0, t + 1)
        }

        function w() {
            (0, k.default)("#widget-testbar").remove()
        }

        function b() {
            return E
        }

        function C() {
            return R
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var x = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
            return typeof e
        } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        t.init = r, t.getDefWindowOptions = n, t.activate = l, t.getWidget = u, t.getClass = c, t.isActivate = h, t.disable = d, t.disableAll = f, t.disableGroup = p, t.eachWidget = m, t.bindClass = v, t.removeDebugeBar = w, t.getCacheVersion = b, t.getBasePath = C;
        var P, E, M, T, S, O, D = i(5),
            k = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(D),
            A = i(36),
            R = "",
            L = [],
            F = []
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return "complete" === e.readyState || "loaded" === e.readyState
        }

        function n(e, t, i) {
            var r = document.createElement("link");
            r.rel = "stylesheet", s(r, i, "css"), r.async = !0, r.href = e, d.appendChild(r)
        }

        function o(e, t, i) {
            var r = document.createElement("script");
            r.charset = "utf-8", s(r, i, "js"), r.async = !t.sync, r.src = e, d.appendChild(r)
        }

        function a(e, t) {
            var i;
            e.sheet && (i = !0), setTimeout(function () {
                i ? t() : a(e, t)
            }, 20)
        }

        function s(e, t, i) {
            function n() {
                e.onload = e.onreadystatechange = null, e = null, t()
            }
            var o = "onload" in e;
            if ("css" === i && (f || !o)) return void setTimeout(function () {
                a(e, t)
            }, 1);
            o ? (e.onload = n, e.onerror = function () {
                e.onerror = null, "css" == i ? console.error("该css文件不存在：" + e.href) : console.error("该js文件不存在：" + e.src), n()
            }) : e.onreadystatechange = function () {
                r(e) && n()
            }
        }

        function l(e, t, i, r) {
            function a() {
                var i = t.indexOf(e);
                i > -1 && t.splice(i, 1), 0 === t.length && r()
            }
            if (!e) return void setTimeout(function () {
                a()
            });
            h.test(e) ? n(e, i, a) : o(e, i, a)
        }

        function u(e, t, i) {
            var r = function () {
                i && i()
            };
            if (e = Array.prototype.slice.call(e || []), 0 === e.length) return void r();
            for (var n = 0, o = e.length; n < o; n++) l(e[n], e, t, r)
        }

        function c(e, t) {
            if (r(e)) t();
            else {
                var i = !1;
                window.addEventListener("load", function () {
                    i || (t(), i = !0)
                }), setTimeout(function () {
                    i || (t(), i = !0)
                }, 1500)
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var h = new RegExp("\\.css"),
            d = document.head || document.getElementsByTagName("head")[0],
            f = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536,
            p = {
                async: function (e, t) {
                    c(document, function () {
                        u(e, {}, t)
                    })
                },
                sync: function (e, t) {
                    c(document, function () {
                        u(e, {
                            sync: !0
                        }, t)
                    })
                }
            };
        t.Loader = p
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.ViewerEx = void 0;
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = i(0),
            l = r(s),
            u = i(12),
            c = (r(u), i(5)),
            h = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(c),
            d = i(16),
            f = i(20),
            p = r(f),
            m = i(9),
            g = i(98),
            v = i(99),
            y = i(100),
            _ = i(101),
            w = i(102),
            b = i(103),
            C = i(2),
            x = r(C),
            P = i(1),
            E = r(P),
            M = i(25),
            T = r(M),
            S = i(18),
            O = r(S);
        l.Camera.DEFAULT_VIEW_RECTANGLE = l.Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2), l.BingMapsApi && (l.BingMapsApi.defaultKey = "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc");
        t.ViewerEx = function () {
            function e(t, i) {
                n(this, e), this.viewer = t, this.config = l.defaultValue(i, {}), this.viewer.wutu = this, this._isFlyAnimation = !1, this.crs = l.defaultValue(this.config.crs, "3857"), this._optimization(), this._initForOpts(), this._addControls(), this._initLayers()
            }
            return a(e, [{
                key: "_optimization",
                value: function () {
                    var e = this.viewer;
                    if (this.viewer.sceneModePicker && (this.viewer.sceneModePicker.viewModel.duration = 0), l.VERSION < 1.63 && (this.viewer._cesiumWidget._supportsImageRenderingPixelated = l.FeatureDetection.supportsImageRenderingPixelated(), this.viewer._cesiumWidget._forceResize = !0, l.FeatureDetection.supportsImageRenderingPixelated())) {
                        for (var t = window.devicePixelRatio; t >= 2;) t /= 2;
                        this.viewer.resolutionScale = t
                    }
                    l.VERSION < 1.65 && this.viewer.camera.changed.addEventListener(function () {
                        if (e.camera._suspendTerrainAdjustment && e.scene.mode === l.SceneMode.SCENE3D && (e.camera._suspendTerrainAdjustment = !1, e.camera._adjustHeightForTerrain()), e.scene.camera.positionCartographic.height < -100) {
                            var t = E.setPositionsHeight(e.camera.positionWC, 0);
                            e.scene.camera.setView({
                                destination: t,
                                orientation: {
                                    heading: e.camera.heading,
                                    pitch: e.camera.pitch
                                }
                            })
                        }
                    })
                }
            }, {
                key: "_initForOpts",
                value: function () {
                    var e = this;
                    this.viewer.cesiumWidget.creditContainer.style.display = "none", this.viewer.homeButton && this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (t) {
                        e.centerAt(), t.cancel = !0
                    }), this.centerAt(null, {
                        duration: 0
                    });
                    var t = this.viewer.scene;
                    t.globe.baseColor = new l.Color.fromCssColorString(this.config.baseColor || "#546a53"), this.config.backgroundColor && (t.backgroundColor = new l.Color.fromCssColorString(this.config.backgroundColor)), this.config.style && (t.globe.depthTestAgainstTerrain = this.config.style.testTerrain, t.globe.enableLighting = this.config.style.lighting, t.skyAtmosphere.show = this.config.style.atmosphere, t.globe.showGroundAtmosphere = this.config.style.atmosphere, t.fog.enabled = this.config.style.fog, t.globe.show = l.defaultValue(this.config.style.globe, !0), t.moon.show = l.defaultValue(this.config.style.moon, t.globe.show), t.sun.show = l.defaultValue(this.config.style.sun, t.globe.show), t.skyBox.show = l.defaultValue(this.config.style.skyBox, t.globe.show)), t.screenSpaceCameraController.maximumZoomDistance = l.defaultValue(this.config.maxzoom, 2e7), t.screenSpaceCameraController.minimumZoomDistance = l.defaultValue(this.config.minzoom, 1), t.screenSpaceCameraController._zoomFactor = 2, t.screenSpaceCameraController.minimumCollisionTerrainHeight = 15e6
                }
            }, {
                key: "_addControls",
                value: function () {
                    var e = this;
                    this._popup = new v.Popup(this.viewer, {
                        popupEventType: this.config.popupEventType
                    }), this._tooltip = new y.Tooltip(this.viewer, {
                        onMouseMove: function (t) {
                            e._location && e._location.updateData(t)
                        }
                    }), this._keyboardRoam = new g.KeyboardRoam(this.viewer), this.config.contextmenu && (this._contextmenu = new _.ContextMenu(this.viewer), this.contextmenuItems = this.defaultContextmenuItems, this._contextmenu.resetDefault = function () {
                        e.contextmenuItems = e.defaultContextmenuItems
                    }), this.config.navigation && this._addNavigationWidget(this.config.navigation), this.config.location && (this.config.location.bindEvent = !1, this._location = new w.Location(this.viewer, this.config.location)), this.config.mouseZoom && x.isPCBroswer() && (this._mouseZoomStyle = new b.MouseZoomStyle(this.viewer, this.config.mouseZoom))
                }
            }, {
                key: "getNextId",
                value: function () {
                    for (; - 1 != this.arrIdx.indexOf(this._tempIdx);) this._tempIdx++;
                    return this.arrIdx.push(this._tempIdx), this._tempIdx
                }
            }, {
                key: "addOperationalLayer",
                value: function (e) {
                    var t;
                    if (e instanceof m.BaseLayer) t = e, e = t.config;
                    else {
                        var i = e.visible;
                        delete e.visible, t = new m.BaseLayer(e, viewer), t._visible = i
                    }
                    return e.name || (e.name = "未命名"), e.id || (e.id = this.getNextId()), e.pid || (e.pid = -1), e.hasLayer = !0, this.config.operationallayers.push(e), this.arrOperationallayers.push(t), this.layers[e.id] = t, t
                }
            }, {
                key: "removeOperationalLayer",
                value: function (e) {
                    for (var t = 0; t < this.config.operationallayers.length; t++) {
                        var i = this.config.operationallayers[t];
                        if (i.id == e) {
                            this.config.operationallayers.splice(t, 1);
                            break
                        }
                    }
                    for (var t = 0; t < this.arrOperationallayers.length; t++) {
                        var i = this.arrOperationallayers[t];
                        if (i.id == e) {
                            this.arrOperationallayers.splice(t, 1);
                            break
                        }
                    }
                    return delete this.layers[i.id], layer
                }
            }, {
                key: "_initLayers",
                value: function () {
                    this.config.basemaps = this.config.basemaps || [], this.config.operationallayers = this.config.operationallayers || [];
                    var e = this.config.basemaps,
                        t = this.config.operationallayers,
                        i = [];
                    this._tempIdx = 1, this.arrIdx = [];
                    for (var r = 0; r < e.length; r++) {
                        var n = e[r];
                        n.id && this.arrIdx.push(n.id)
                    }
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.id && this.arrIdx.push(n.id)
                    }
                    var o = {},
                        a = [],
                        s = [];
                    if (!this.config.baseLayerPicker && e && e.length > 0)
                        for (var r = 0; r < e.length; r++) {
                            var n = e[r];
                            n.name || (n.name = "未命名"), n.id || (n.id = this.getNextId()), n.pid || (n.pid = -1), n.visible && n.crs && (this.crs = n.crs);
                            var l = O.createLayer(n, this.viewer, this.config.serverURL);
                            if (l && (n.hasLayer = !0, o[n.id] = l, a.push(l)), i.push(n), "group" == n.type && n.layers)
                                for (var u = 0; u < n.layers.length; u++) {
                                    var c = n.layers[u];
                                    c.pid = n.id, c.id = this.getNextId(), i.push(c)
                                }
                        }
                    if (this.arrBasemaps = a, t && t.length > 0)
                        for (var r = 0; r < t.length; r++) {
                            var n = t[r];
                            n.name || (n.name = "未命名"), n.id || (n.id = this.getNextId()), n.pid || (n.pid = -1);
                            var l = O.createLayer(n, this.viewer, this.config.serverURL);
                            if (l && (n.hasLayer = !0, s.push(l), o[n.id] = l), i.push(n), "group" == n.type && n.layers)
                                for (var u = 0; u < n.layers.length; u++) {
                                    var c = n.layers[u];
                                    c.pid = n.id, c.id = this.getNextId(), i.push(c)
                                }
                        }
                    this.arrOperationallayers = s, this.layers = o;
                    for (var r = 0; r < i.length; r++) {
                        var n = i[r],
                            h = Number(n.order);
                        isNaN(h) && (h = r), n.order = h, null != o[n.id] && o[n.id].setZIndex(h)
                    }
                }
            }, {
                key: "getConfig",
                value: function () {
                    return x.clone(this.config, 5)
                }
            }, {
                key: "getCenter",
                value: function (e) {
                    return E.getCenter(this.viewer, e)
                }
            }, {
                key: "getExtent",
                value: function (e) {
                    return E.getExtent(this.viewer, e)
                }
            }, {
                key: "getCameraView",
                value: function (e) {
                    return E.getCameraView(this.viewer, e)
                }
            }, {
                key: "getHeight",
                value: function (e, t) {
                    return E.updateHeightForClampToGround(this.viewer, e, t)
                }
            }, {
                key: "toGeoJSON",
                value: function (e) {
                    return p.toGeoJSON(e)
                }
            }, {
                key: "getCenterPosition",
                value: function (e) {
                    return p.getCenterPosition(e)
                }
            }, {
                key: "getPositions",
                value: function (e) {
                    return p.getPositions(e)
                }
            }, {
                key: "getCoordinates",
                value: function (e) {
                    return p.getCoordinates(e)
                }
            }, {
                key: "flyTo",
                value: function (e, t) {
                    if (e)
                        if (t = t || {}, t.scale = l.defaultValue(t.scale, .5), x.isArray(e)) {
                            if (0 == e.length) return;
                            if (1 == e.length) this.flyTo(e[0], t);
                            else {
                                for (var i = [], r = 0, n = e.length; r < n; r++) {
                                    var o = this.toGeoJSON(e[r]);
                                    o && i.push(o)
                                }
                                if (0 == i.length) return;
                                var a = E.getExtent({
                                    type: "FeatureCollection",
                                    features: i
                                }, t);
                                a.xmin == a.xmax || a.ymin == a.ymax ? this.flyTo(e[0], t) : this.centerAt(a, t)
                            }
                        } else if (e.billboard || e.point || e.label || e.model) {
                        var s = e.position.getValue(x.currentTime());
                        this.centerPoint(s, t)
                    } else if (e.ellipse) {
                        var u = e.ellipse.semiMajorAxis.getValue(x.currentTime()),
                            c = e.ellipse.semiMinorAxis.getValue(x.currentTime());
                        t.radius = Math.max(u, c) * (1 + t.scale);
                        var s = e.position.getValue(x.currentTime());
                        this.centerPoint(s, t)
                    } else {
                        var a = E.getExtent(e, t);
                        if (a.xmin == a.xmax || a.ymin == a.ymax) {
                            var s = {
                                x: a.xmin,
                                y: a.ymin
                            };
                            this.centerPoint(s, t)
                        } else this.centerAt(a, t)
                    }
                }
            }, {
                key: "keyboard",
                value: function (e, t) {
                    e ? this._keyboardRoam.bind(t) : this._keyboardRoam.unbind()
                }
            }, {
                key: "keyboardAuto",
                value: function () {
                    return this._keyboardRoam.enable = !this._keyboardRoam.enable
                }
            }, {
                key: "getLayer",
                value: function (e, t) {
                    if ("object" === (void 0 === e ? "undefined" : o(e))) {
                        if (l.defined(e.id)) return this.layers[e.id]
                    } else {
                        null == t && (t = x.isNumber(e) ? "id" : "name");
                        var i = this.arrBasemaps;
                        if (i && i.length > 0)
                            for (var r = 0; r < i.length; r++) {
                                var n = i[r];
                                if (null != n && n.config[t] == e) return n
                            }
                        if ((i = this.arrOperationallayers) && i.length > 0)
                            for (var r = 0; r < i.length; r++) {
                                var n = i[r];
                                if (null != n && n.config[t] == e) return n
                            }
                    }
                    return null
                }
            }, {
                key: "changeBasemap",
                value: function (e) {
                    var t = this.arrBasemaps;
                    if (0 == t.length) return void console.log("baseLayerPicker为true时，无法changeBasemap外部切换底图，请关闭baseLayerPicker。");
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        "group" == r.config.type && null == r.config.layers || (e == r.config.name || e == r.config.id ? (r.setVisible(!0), this.crs = r.config.crs) : r.setVisible(!1))
                    }
                }
            }, {
                key: "hasTerrain",
                value: function () {
                    return null != this.terrainProvider && O.hasTerrain(this.viewer)
                }
            }, {
                key: "updateTerrainProvider",
                value: function (e) {
                    if (e) {
                        if (null == this.terrainProvider) {
                            var t = this.config.terrain;
                            t && t.url && (this.config.serverURL && (t.url = t.url.replace("$serverURL$", this.config.serverURL)), t.url = t.url.replace("$hostname$", location.hostname).replace("$host$", location.host)), this.terrainProvider = O.getTerrainProvider(t)
                        }
                        this.viewer.terrainProvider = this.terrainProvider
                    } else this.viewer.terrainProvider = O.getEllipsoidTerrain()
                }
            }, {
                key: "getCrs",
                value: function () {
                    return this.crs
                }
            }, {
                key: "point2map",
                value: function (e) {
                    switch (this.crs) {
                        case "gcj":
                            var t = x.clone(e),
                                i = T.wgs2gcj([t.x, t.y]);
                            return t.x = i[0], t.y = i[1], t;
                        case "bd":
                        case "baidu":
                            var t = x.clone(e),
                                i = T.wgs2bd([t.x, t.y]);
                            return t.x = i[0], t.y = i[1], t;
                        default:
                            return e
                    }
                }
            }, {
                key: "point2wgs",
                value: function (e) {
                    switch (this.crs) {
                        case "gcj":
                            var t = x.clone(e),
                                i = T.gcj2wgs([t.x, t.y]);
                            return t.x = i[0], t.y = i[1], t;
                        case "bd":
                        case "baidu":
                            var t = x.clone(e),
                                i = T.bd2wgs([t.x, t.y]);
                            return t.x = i[0], t.y = i[1], t;
                        default:
                            return e
                    }
                }
            }, {
                key: "centerAtArr",
                value: function (e, t) {
                    this.cancelCenterAt(), this.arrCenterTemp = e, this._isCenterAtArr = !0, this._centerAtArrItem(0, t)
                }
            }, {
                key: "_centerAtArrItem",
                value: function (e, t) {
                    var i = this;
                    if (!this._isCenterAtArr || e < 0 || e >= this.arrCenterTemp.length) return this._isCenterAtArr = !1, void(t && t());
                    var r = this.arrCenterTemp[e];
                    r.onStart && r.onStart(), this.centerAt(r, {
                        duration: r.duration,
                        complete: function () {
                            r.onEnd && r.onEnd();
                            var n = l.defaultValue(r.stop, 1);
                            setTimeout(function () {
                                i._centerAtArrItem(++e, t)
                            }, 1e3 * n)
                        },
                        cancle: function () {
                            this._isCenterAtArr = !1, t && t()
                        }
                    })
                }
            }, {
                key: "cancelCenterAt",
                value: function () {
                    this._isCenterAtArr = !1, this.viewer.camera.cancelFlight()
                }
            }, {
                key: "centerAt",
                value: function (e, t) {
                    null == t ? t = {} : x.isNumber(t) && (t = {
                        duration: t
                    }), null == e && (t.isWgs84 = !0, e = this.config.extent || this.config.center || {
                        y: 17.196575,
                        x: 114.184276,
                        z: 9377198,
                        heading: 0,
                        pitch: -80,
                        roll: 0
                    });
                    var i = {};
                    for (var r in t) i[r] = t[r];
                    if (e.xmin && e.xmax && e.ymin && e.ymax) {
                        var n = e.xmin,
                            o = e.xmax,
                            a = e.ymin,
                            s = e.ymax;
                        if (i.isWgs84) {
                            var u = this.point2map({
                                x: n,
                                y: a
                            });
                            n = u.x, a = u.y;
                            var c = this.point2map({
                                x: o,
                                y: s
                            });
                            o = c.x, s = c.y
                        }
                        i.destination = l.Rectangle.fromDegrees(n, a, o, s), this.viewer.camera.flyTo(i)
                    } else {
                        i.isWgs84 && (e = this.point2map(e));
                        var h = l.defaultValue(i.minz, 2500);
                        this.viewer.camera.positionCartographic.height < h && (h = this.viewer.camera.positionCartographic.height), null != e.z && 0 != e.z && (h = e.z), i.destination = l.Cartesian3.fromDegrees(e.x, e.y, h), i.orientation = {
                            heading: l.Math.toRadians(l.defaultValue(e.heading, 0)),
                            pitch: l.Math.toRadians(l.defaultValue(e.pitch, -90)),
                            roll: l.Math.toRadians(l.defaultValue(e.roll, 0))
                        }, this.viewer.camera.flyTo(i)
                    }
                }
            }, {
                key: "centerPoint",
                value: function (e, t) {
                    null == t && (t = {});
                    var i = {};
                    for (var r in t) i[r] = t[r];
                    i.isWgs84 && (e = this.point2map(e));
                    var n;
                    n = e instanceof l.Cartesian3 ? e : l.Cartesian3.fromDegrees(e.x, e.y, l.defaultValue(e.z, 0));
                    var o = l.defaultValue(t.radius, 1e3);
                    i.offset = {
                        heading: l.Math.toRadians(l.defaultValue(t.heading, 0)),
                        pitch: l.Math.toRadians(l.defaultValue(t.pitch, -90)),
                        range: o
                    }, this.viewer.camera.flyToBoundingSphere(new l.BoundingSphere(n, 0), i)
                }
            }, {
                key: "isFlyAnimation",
                value: function () {
                    return this._isFlyAnimation
                }
            }, {
                key: "openFlyAnimation",
                value: function (e, t) {
                    var i = this,
                        r = this.viewer,
                        n = t || E.getCameraView(r);
                    this._isFlyAnimation = !0, r.camera.setView({
                        destination: l.Cartesian3.fromDegrees(-85.16, 13.71, 23e6)
                    }), r.camera.flyTo({
                        destination: l.Cartesian3.fromDegrees(n.x, n.y, 23e6),
                        duration: 2,
                        easingFunction: l.EasingFunction.LINEAR_NONE,
                        complete: function () {
                            var t = l.defaultValue(n.z, 9e4);
                            t < 2e5 && -90 != n.pitch ? (t = 1.2 * t + 8e3, r.camera.flyTo({
                                destination: l.Cartesian3.fromDegrees(n.x, n.y, t),
                                complete: function () {
                                    i.centerAt(n, {
                                        duration: 2,
                                        complete: function () {
                                            i._isFlyAnimation = !1, e && e()
                                        }
                                    })
                                }
                            })) : i.centerAt(n, {
                                complete: function () {
                                    i._isFlyAnimation = !1, e && e()
                                }
                            })
                        }
                    })
                }
            }, {
                key: "rotateAnimation",
                value: function (e, t) {
                    var i = this.viewer,
                        r = E.getCameraView(i),
                        n = t / 3;
                    i.camera.flyTo({
                        destination: l.Cartesian3.fromDegrees(r.x + 120, r.y, r.z),
                        orientation: {
                            heading: l.Math.toRadians(r.heading),
                            pitch: l.Math.toRadians(r.pitch),
                            roll: l.Math.toRadians(r.roll)
                        },
                        duration: n,
                        easingFunction: l.EasingFunction.LINEAR_NONE,
                        complete: function () {
                            i.camera.flyTo({
                                destination: l.Cartesian3.fromDegrees(r.x + 240, r.y, r.z),
                                orientation: {
                                    heading: l.Math.toRadians(r.heading),
                                    pitch: l.Math.toRadians(r.pitch),
                                    roll: l.Math.toRadians(r.roll)
                                },
                                duration: n,
                                easingFunction: l.EasingFunction.LINEAR_NONE,
                                complete: function () {
                                    i.camera.flyTo({
                                        destination: l.Cartesian3.fromDegrees(r.x, r.y, r.z),
                                        orientation: {
                                            heading: l.Math.toRadians(r.heading),
                                            pitch: l.Math.toRadians(r.pitch),
                                            roll: l.Math.toRadians(r.roll)
                                        },
                                        duration: n,
                                        easingFunction: l.EasingFunction.LINEAR_NONE,
                                        complete: function () {
                                            e && e()
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }, {
                key: "_addNavigationWidget",
                value: function (e) {
                    if (l.viewerCesiumNavigationMixin) {
                        if (this.viewer.extend(l.viewerCesiumNavigationMixin, {
                                defaultResetView: l.Rectangle.fromDegrees(110, 20, 120, 30),
                                enableZoomControls: !0
                            }), (0, h.default)(".distance-legend").css({
                                left: "-10px",
                                bottom: "-1px",
                                border: "none",
                                background: "rgba(0, 0, 0, 0)"
                            }), e.legend) {
                            var t = e.legend;
                            l.defined(t.top) && "auto" != t.top && (t.bottom = "auto"), l.defined(t.left) && "auto" != t.left && (t.right = "auto"), (0, h.default)(".distance-legend").css(t)
                        } else(0, h.default)(".distance-legend").remove();
                        if (e.compass) {
                            var t = e.compass;
                            l.defined(t.bottom) && "auto" != t.bottom && (t.top = "auto"), l.defined(t.left) && "auto" != t.left && (t.right = "auto"), (0, h.default)(".compass").css(t)
                        } else(0, h.default)(".compass").remove();
                        (0, h.default)(".navigation-controls").remove()
                    }
                }
            }, {
                key: "expImage",
                value: function (e) {
                    e = e || {}, e.download = l.defaultValue(e.download, !0), e.type = l.defaultValue(e.type, "image/jpeg");
                    var t, i, r = this.viewer;
                    r.render();
                    var n = r.canvas.toDataURL(e.type, e.encoderOptions);
                    if (l.defined(e.width) || l.defined(e.height)) {
                        var o = new Image;
                        o.onload = function () {
                            l.defined(e.width) ? (t = e.width, i = e.height || Math.round(t * r.canvas.height / r.canvas.width)) : (i = e.height, t = Math.round(i * r.canvas.width / r.canvas.height));
                            var n, a;
                            n = document.createElement("canvas"), n.width = t, n.height = i, a = n.getContext("2d"), a.drawImage(o, 0, 0, t, i);
                            var s = n.toDataURL(e.type, e.encoderOptions);
                            e.filename || (e.filename = "场景出图_" + t + "x" + i), e.download && x.downloadBase64Image(e.filename, s), e.calback && e.calback(s, {
                                width: t,
                                height: i
                            })
                        }, o.src = n
                    } else i = r.canvas.height, t = r.canvas.width, e.filename || (e.filename = "场景出图_" + t + "x" + i), e.download && x.downloadBase64Image(e.filename, n), e.calback && e.calback(n, {
                        width: t,
                        height: i
                    })
                }
            }, {
                key: "destroy",
                value: function () {
                    this._tooltip.destroy(), this._popup.destroy(), this._keyboardRoam && (this._keyboardRoam.destroy(), this._keyboardRoam = null), this._contextmenu && (this._contextmenu.destroy(), this._contextmenu = null), this._location && (this._location.destroy(), this._location = null), this._mouseZoomStyle && (this._mouseZoomStyle.destroy(), this._mouseZoomStyle = null)
                }
            }, {
                key: "popup",
                get: function () {
                    return this._popup
                }
            }, {
                key: "tooltip",
                get: function () {
                    return this._tooltip
                }
            }, {
                key: "contextmenu",
                get: function () {
                    return this._contextmenu
                }
            }, {
                key: "keyboardRoam",
                get: function () {
                    return this._keyboardRoam
                }
            }, {
                key: "contextmenuItems",
                get: function () {
                    return this._contextmenuItems
                },
                set: function (e) {
                    this._contextmenuItems = e
                }
            }, {
                key: "defaultContextmenuItems",
                get: function () {
                    return this.config.contextmenuItems || (0, _.getDefaultContextMenu)(this.viewer)
                }
            }, {
                key: "draw",
                get: function () {
                    return null == this._drawControl && (this._drawControl = new d.Draw(this.viewer, {
                        hasEdit: !1
                    })), this._drawControl
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {});
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                    case "radius":
                    case "shape":
                    case "grid_lineCount":
                    case "grid_lineThickness":
                    case "grid_cellAlpha":
                    case "checkerboard_repeat":
                    case "checkerboard_oddcolor":
                    case "stripe_oddcolor":
                    case "stripe_repeat":
                    case "animationDuration":
                    case "animationImage":
                    case "animationRepeatX":
                    case "animationRepeatY":
                    case "animationAxisY":
                    case "animationGradient":
                    case "animationCount":
                    case "randomColor":
                        break;
                    case "outlineColor":
                        t.outlineColor = new d.Color.fromCssColorString(r || "#FFFF00").withAlpha(e.outlineOpacity || e.opacity || 1);
                        break;
                    case "color":
                        t.material = new d.Color.fromCssColorString(r || "#FFFF00").withAlpha(Number(e.opacity || 1))
                }
            }
            switch (e.material && (t.material = e.material), e.radius = e.radius || 10, e.shape) {
                default:
                case "pipeline":
                    t.shape = o(e.radius);
                    break;
                case "circle":
                    t.shape = a(e.radius);
                    break;
                case "star":
                    t.shape = s(e.radius)
            }
            return t
        }

        function o(e) {
            for (var t = e / 3, i = [], r = 0; r <= 360; r++) {
                var n = d.Math.toRadians(r);
                i.push(new d.Cartesian2(e * Math.cos(n), e * Math.sin(n)))
            }
            for (var r = 360; r >= 0; r--) {
                var n = d.Math.toRadians(r);
                i.push(new d.Cartesian2((e - t) * Math.cos(n), (e - t) * Math.sin(n)))
            }
            return i
        }

        function a(e) {
            for (var t = [], i = 0; i <= 360; i++) {
                var r = d.Math.toRadians(i);
                t.push(new d.Cartesian2(e * Math.cos(r), e * Math.sin(r)))
            }
            return t
        }

        function s(e, t) {
            for (var t = t || 6, i = Math.PI / t, r = 2 * t, n = new Array(r), o = 0; o < r; o++) {
                var a = o % 2 == 0 ? e : e / 3;
                n[o] = new d.Cartesian2(Math.cos(o * i) * a, Math.sin(o * i) * a)
            }
            return n
        }

        function l(e) {
            return e._positions_draw && e._positions_draw.length > 0 ? e._positions_draw : e.polylineVolume.positions.getValue((0, m.currentTime)())
        }

        function u(e) {
            var t = l(e);
            return p.cartesians2lonlats(t)
        }

        function c(e) {
            var t = u(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "LineString",
                    coordinates: t
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = l, t.getCoordinates = u, t.toGeoJSON = c;
        var h = i(0),
            d = r(h),
            f = i(3),
            p = r(f),
            m = i(2)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, t || (t = {
                fill: !0
            });
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                    case "color":
                    case "materialType":
                    case "grid_lineCount":
                    case "grid_lineThickness":
                    case "grid_cellAlpha":
                    case "checkerboard_repeat":
                    case "checkerboard_oddcolor":
                    case "stripe_oddcolor":
                    case "stripe_repeat":
                    case "animationDuration":
                    case "animationImage":
                    case "animationRepeatX":
                    case "animationRepeatY":
                    case "animationAxisY":
                    case "animationGradient":
                    case "animationCount":
                    case "randomColor":
                        break;
                    case "outlineColor":
                        t.outlineColor = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(e.outlineOpacity || e.opacity || 1)
                }
            }
            return p.setFillMaterial(t, e), t
        }

        function o(e) {
            return e.wall.positions.getValue((0, d.currentTime)())
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "LineString",
                    coordinates: t
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2),
            f = i(13),
            p = r(f)
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.CircleWaveMaterial = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(70),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s),
            u = new a.Color(0, 0, 0, 0),
            c = 2,
            h = .1,
            d = t.CircleWaveMaterial = function () {
                function e(t) {
                    r(this, e), t = a.defaultValue(t, a.defaultValue.EMPTY_OBJECT), this._definitionChanged = new a.Event, this._color = void 0, this._colorSubscription = void 0, this.color = a.defaultValue(t.color, u), this._duration = a.defaultValue(t.duration, 1e3), this._count = a.defaultValue(t.count, c), this._count <= 0 && (this._count = 1), this._gradient = a.defaultValue(t.gradient, h), this._gradient < 0 && (this._gradient = 0), this._gradient > 1 && (this._gradient = 1), this._time = void 0
                }
                return n(e, [{
                    key: "getType",
                    value: function (e) {
                        return a.Material.CircleWaveMaterialType
                    }
                }, {
                    key: "getValue",
                    value: function (e, t) {
                        return a.defined(t) || (t = {}), t.color = a.Property.getValueOrClonedDefault(this._color, e, u, t.color), void 0 === this._time && (this._time = (new Date).getTime()), t.time = ((new Date).getTime() - this._time) / this._duration, t.count = this._count, t.gradient = 1 + 10 * (1 - this._gradient), t
                    }
                }, {
                    key: "equals",
                    value: function (t) {
                        return this === t || t instanceof e && a.Property.equals(this._color, t._color)
                    }
                }, {
                    key: "isConstant",
                    get: function () {
                        return !1
                    }
                }, {
                    key: "definitionChanged",
                    get: function () {
                        return this._definitionChanged
                    }
                }]), e
            }();
        a.defineProperties(d.prototype, {
            color: a.createPropertyDescriptor("color")
        }), a.Material.CircleWaveMaterialType = "CircleWaveMaterial", a.Material._materialCache.addMaterial(a.Material.CircleWaveMaterialType, {
            fabric: {
                type: a.Material.CircleWaveMaterialType,
                uniforms: {
                    color: new a.Color(1, 0, 0, 1),
                    time: 1,
                    count: c,
                    gradient: h
                },
                source: l.default
            },
            translucent: function () {
                return !0
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {
                fill: !0
            }), e.clampToGround && (e.hasOwnProperty("height") && delete e.height, e.hasOwnProperty("extrudedHeight") && delete e.extrudedHeight);
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                        break;
                    case "outlineColor":
                        t.outlineColor = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(e.outlineOpacity || e.opacity || 1);
                        break;
                    case "color":
                        t.material = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(Number(e.opacity || 1));
                        break;
                    case "cornerType":
                        switch (r) {
                            case "BEVELED":
                                t.cornerType = u.CornerType.BEVELED;
                                break;
                            case "MITERED":
                                t.cornerType = u.CornerType.MITERED;
                                break;
                            case "ROUNDED":
                                t.cornerType = u.CornerType.ROUNDED;
                                break;
                            default:
                                t.cornerType = r
                        }
                }
            }
            return p.setFillMaterial(t, e), t
        }

        function o(e) {
            return e.corridor.positions.getValue((0, d.currentTime)())
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "LineString",
                    coordinates: t
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2),
            f = i(13),
            p = r(f)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {
                fill: !0
            });
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                    case "color":
                    case "animation":
                        break;
                    case "outlineColor":
                        t.outlineColor = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(e.outlineOpacity || e.opacity || 1);
                        break;
                    case "radius":
                        t.topRadius = Number(r), t.bottomRadius = Number(r)
                }
            }
            return p.setFillMaterial(t, e), t
        }

        function o(e) {
            var t = e.position.getValue((0, d.currentTime)());
            return e._positions_draw && e._positions_draw.length > 0 && (t = e._positions_draw[0]), [t]
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Point",
                    coordinates: t[0]
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2),
            f = (i(1), i(13)),
            p = r(f)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {}), e.clampToGround && (e.hasOwnProperty("height") && delete e.height, e.hasOwnProperty("extrudedHeight") && delete e.extrudedHeight);
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                    case "grid_lineCount":
                    case "grid_lineThickness":
                    case "grid_cellAlpha":
                    case "checkerboard_repeat":
                    case "checkerboard_oddcolor":
                    case "stripe_oddcolor":
                    case "stripe_repeat":
                    case "animationDuration":
                    case "animationImage":
                    case "animationRepeatX":
                    case "animationRepeatY":
                    case "animationAxisY":
                    case "animationGradient":
                    case "animationCount":
                    case "randomColor":
                        break;
                    case "outlineColor":
                        t.outlineColor = new h.Color.fromCssColorString(r || "#FFFF00").withAlpha(e.outlineOpacity || e.opacity || 1);
                        break;
                    case "height":
                        t.height = Number(r), e.extrudedHeight && (t.extrudedHeight = Number(e.extrudedHeight) + Number(r));
                        break;
                    case "extrudedHeight":
                        t.extrudedHeight = Number(t.height || e.height || 0) + Number(r);
                        break;
                    case "color":
                        t.material = new h.Color.fromCssColorString(r || "#FFFF00").withAlpha(Number(e.opacity || 1));
                        break;
                    case "image":
                        t.material = new h.ImageMaterialProperty({
                            image: e.image,
                            color: new h.Color.fromCssColorString("#FFFFFF").withAlpha(Number(e.opacity || 1))
                        });
                        break;
                    case "rotation":
                        t.rotation = h.Math.toRadians(r), e.stRotation || (t.stRotation = h.Math.toRadians(r));
                        break;
                    case "stRotation":
                        t.stRotation = h.Math.toRadians(r)
                }
            }
            return g.setFillMaterial(t, e), t
        }

        function o(e) {
            if (e._positions_draw && e._positions_draw.length > 0) return e._positions_draw;
            var t = (0, p.currentTime)(),
                i = e.rectangle.coordinates.getValue(t),
                r = e.rectangle.height ? e.rectangle.height.getValue(t) : 0;
            return [h.Cartesian3.fromRadians(i.west, i.south, r), h.Cartesian3.fromRadians(i.east, i.north, r)]
        }

        function a(e) {
            var t = o(e);
            return f.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "MultiPoint",
                    coordinates: t
                }
            }
        }

        function l(e, t) {
            var i = (0, p.currentTime)(),
                r = e.rectangle.coordinates.getValue(i),
                n = e.rectangle.height ? e.rectangle.height.getValue(i) : 0,
                o = h.Cartesian3.fromRadians(r.west, r.south, n),
                a = h.Cartesian3.fromRadians(r.east, r.south, n),
                s = h.Cartesian3.fromRadians(r.east, r.north, n),
                l = h.Cartesian3.fromRadians(r.west, r.north, n),
                u = [o, a, s, l];
            return t || u.push(o), u
        }

        function u(e, t) {
            var i = l(e, t);
            return f.cartesians2lonlats(i)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s, t.getOutlinePositions = l, t.getOutlineCoordinates = u;
        var c = i(0),
            h = r(c),
            d = i(3),
            f = r(d),
            p = i(2),
            m = i(13),
            g = r(m)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            e = e || {}, null == t && (t = {
                fill: !0
            });
            for (var i in e) {
                var r = e[i];
                switch (i) {
                    default:
                        t[i] = r;
                        break;
                    case "opacity":
                    case "outlineOpacity":
                    case "widthRadii":
                    case "heightRadii":
                        break;
                    case "outlineColor":
                        t.outlineColor = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(e.outlineOpacity || e.opacity || 1);
                        break;
                    case "color":
                        t.material = new u.Color.fromCssColorString(r || "#FFFF00").withAlpha(Number(e.opacity || 1));
                        break;
                    case "extentRadii":
                        var n = e.extentRadii || 100,
                            o = e.widthRadii || 100,
                            a = e.heightRadii || 100;
                        t.radii = new u.Cartesian3(n, o, a)
                }
            }
            return p.setFillMaterial(t, e), t
        }

        function o(e) {
            return [e.position.getValue((0, d.currentTime)())]
        }

        function a(e) {
            var t = o(e);
            return h.cartesians2lonlats(t)
        }

        function s(e) {
            var t = a(e);
            return {
                type: "Feature",
                properties: e.attribute || {},
                geometry: {
                    type: "Point",
                    coordinates: t[0]
                }
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.style2Entity = n, t.getPositions = o, t.getCoordinates = a, t.toGeoJSON = s;
        var l = i(0),
            u = r(l),
            c = i(3),
            h = r(c),
            d = i(2),
            f = i(13),
            p = r(f)
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TileLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(9),
            a = i(18),
            s = o.BaseLayer.extend({
                layer: null,
                add: function () {
                    null != this.layer && this.remove(), this.addEx();
                    var e = this.createImageryProvider(this.config);
                    if (n.defined(e)) {
                        var t = this.config,
                            i = {
                                show: !0,
                                alpha: this._opacity
                            };
                        if (n.defined(t.rectangle) && n.defined(t.rectangle.xmin) && n.defined(t.rectangle.xmax) && n.defined(t.rectangle.ymin) && n.defined(t.rectangle.ymax)) {
                            var r = t.rectangle.xmin,
                                o = t.rectangle.xmax,
                                a = t.rectangle.ymin,
                                s = t.rectangle.ymax,
                                l = n.Rectangle.fromDegrees(r, a, o, s);
                            this.rectangle = l, i.rectangle = l
                        }
                        n.defined(t.brightness) && (i.brightness = t.brightness), n.defined(t.contrast) && (i.contrast = t.contrast), n.defined(t.hue) && (i.hue = t.hue), n.defined(t.saturation) && (i.saturation = t.saturation), n.defined(t.gamma) && (i.gamma = t.gamma), n.defined(t.maximumAnisotropy) && (i.maximumAnisotropy = t.maximumAnisotropy), n.defined(t.minimumTerrainLevel) && (i.minimumTerrainLevel = t.minimumTerrainLevel), n.defined(t.maximumTerrainLevel) && (i.maximumTerrainLevel = t.maximumTerrainLevel), this.layer = new n.ImageryLayer(e, i), this.layer.config = this.config, this.viewer.imageryLayers.add(this.layer), this.setZIndex(this.config.order)
                    }
                },
                createImageryProvider: function (e) {
                    return (0, a.createImageryProvider)(e)
                },
                addEx: function () {},
                remove: function () {
                    null != this.layer && (this.removeEx(), this.viewer.imageryLayers.remove(this.layer, !0), this.layer = null)
                },
                removeEx: function () {},
                centerAt: function (e) {
                    if (null != this.layer)
                        if (this.config.extent || this.config.center) this.viewer.wutu.centerAt(this.config.extent || this.config.center, {
                            duration: e,
                            isWgs84: !0
                        });
                        else if (n.defined(this.rectangle)) this.viewer.camera.flyTo({
                        destination: this.rectangle,
                        duration: e
                    });
                    else {
                        var t = this.layer.imageryProvider.rectangle;
                        n.defined(t) && t != n.Rectangle.MAX_VALUE && t.west > 0 && t.south > 0 && t.east > 0 && t.north > 0 && this.viewer.camera.flyTo({
                            destination: t,
                            duration: e
                        })
                    }
                },
                hasOpacity: !0,
                _opacity: 1,
                setOpacity: function (e) {
                    this._opacity = e, null != this.layer && (this.layer.alpha = e)
                },
                hasZIndex: !0,
                setZIndex: function (e) {
                    if (null != this.layer && null != e) {
                        this.viewer.imageryLayers.raiseToTop(this.layer);
                        for (var t = this.viewer.imageryLayers._layers, i = t.length - 1; i >= 0; i--)
                            if (t[i] != this.layer) {
                                var r = t[i].config;
                                r && r.order && e < r.order && this.viewer.imageryLayers.lower(this.layer)
                            }
                    }
                }
            });
        t.TileLayer = s
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditPoint = void 0;
        var n = i(0),
            o = (r(n), i(6)),
            a = r(o),
            s = i(4),
            l = i(22),
            u = i(2),
            c = r(u);
        t.EditPoint = l.EditBase.extend({
            setPositions: function (e) {
                c.isArray(e) && 1 == e.length && (e = e[0]), this.entity.position.setValue(e)
            },
            bindDraggers: function () {
                var e = this;
                this.entity.draw_tooltip = s.message.dragger.def;
                a.createDragger(this.dataSource, {
                    dragger: this.entity,
                    onDrag: function (t, i) {
                        e.entity.position.setValue(i)
                    }
                })
            },
            finish: function () {
                this.entity.draw_tooltip = null
            }
        })
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditCurve = void 0;
        var r = i(0),
            n = (function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                t.default = e
            }(r), i(14)),
            o = i(17);
        t.EditCurve = n.EditPolyline.extend({
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw, this._positions_show = this.entity._positions_show || this.getGraphic().positions.getValue(this.viewer.clock.currentTime)
            },
            updateAttrForEditing: function () {
                if (null == this._positions_draw || this._positions_draw.length < 3) return void(this._positions_show = this._positions_draw);
                this._positions_show = (0, o.line2curve)(this._positions_draw, this.entity.attribute.style.closure), this.entity._positions_show = this._positions_show
            },
            finish: function () {
                this.entity._positions_show = this._positions_show, this.entity._positions_draw = this._positions_draw
            }
        })
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditPolylineVolume = void 0;
        var r = i(0),
            n = (function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                t.default = e
            }(r), i(14));
        t.EditPolylineVolume = n.EditPolyline.extend({
            getGraphic: function () {
                return this.entity.polylineVolume
            },
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditCorridor = void 0;
        var n = i(0),
            o = (r(n), i(6)),
            a = (r(o), i(4), i(14)),
            s = i(1);
        t.EditCorridor = a.EditPolyline.extend({
            getGraphic: function () {
                return this.entity.corridor
            },
            updatePositionsHeightByAttr: function (e) {
                if (void 0 != this.getGraphic().height) {
                    var t = this.getGraphic().height.getValue(this.viewer.clock.currentTime);
                    e = (0, s.setPositionsHeight)(e, t)
                }
                return e
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawPolygon = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = i(1),
            l = i(11),
            u = r(l),
            c = i(19),
            h = i(3);
        r(h), t.DrawPolygon = a.DrawPolyline.extend({
            type: "polygon",
            _minPointNum: 3,
            _maxPointNum: 9999,
            editClass: c.EditPolygon,
            attrClass: u,
            createFeature: function (e) {
                this._positions_draw = [], this._minPointNum_def || (this._minPointNum_def = this._minPointNum), this._maxPointNum_def || (this._maxPointNum_def = this._maxPointNum), e.config ? (this._minPointNum = e.config.minPointNum || this._minPointNum_def, this._maxPointNum = e.config.maxPointNum || this._maxPointNum_def) : (this._minPointNum = this._minPointNum_def, this._maxPointNum = this._maxPointNum_def);
                var t = this,
                    i = {
                        polygon: u.style2Entity(e.style),
                        attribute: e
                    };
                return i.polygon.hierarchy = new o.CallbackProperty(function (e) {
                    var i = t.getDrawPosition();
                    return new o.PolygonHierarchy(i)
                }, !1), i.polyline = {
                    clampToGround: e.style.clampToGround,
                    show: !1
                }, this.entity = this.dataSource.entities.add(i), this.bindOutline(this.entity), this.entity
            },
            style2Entity: function (e, t) {
                return u.style2Entity(e, t.polygon)
            },
            bindOutline: function (e) {
                e.polyline.show = new o.CallbackProperty(function (t) {
                    var i = u.getPositions(e, !0);
                    return !!(i && i.length < 3) || e.polygon.outline && e.polygon.outline.getValue(t) && e.polygon.outlineWidth && e.polygon.outlineWidth.getValue(t) > 1
                }, !1), e.polyline.positions = new o.CallbackProperty(function (t) {
                    if (!e.polyline.show.getValue(t)) return null;
                    var i = u.getPositions(e, !0);
                    return i && i.length < 3 ? i : i.concat([i[0]])
                }, !1), e.polyline.width = new o.CallbackProperty(function (t) {
                    var i = u.getPositions(e, !0);
                    return i && i.length < 3 ? 2 : e.polygon.outlineWidth
                }, !1), e.polyline.material = new o.ColorMaterialProperty(new o.CallbackProperty(function (t) {
                    var i = u.getPositions(e, !0);
                    return i && i.length < 3 ? e.polygon.material.color ? e.polygon.material.color.getValue(t) : o.Color.YELLOW : e.polygon.outlineColor.getValue(t)
                }, !1))
            },
            updateAttrForDrawing: function () {
                var e = this.entity.attribute.style;
                if (e.extrudedHeight) {
                    var t = (0, s.getMaxHeight)(this.getDrawPosition());
                    this.entity.polygon.extrudedHeight = t + Number(e.extrudedHeight)
                }
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this.getDrawPosition(), e.polygon.hierarchy = new o.CallbackProperty(function (t) {
                    var i = e._positions_draw;
                    return new o.PolygonHierarchy(i)
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditRectangle = void 0;
        var n = i(0),
            o = (r(n), i(6)),
            a = r(o),
            s = (i(4), i(19)),
            l = i(1);
        t.EditRectangle = s.EditPolygon.extend({
            getGraphic: function () {
                return this.entity.rectangle
            },
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw
            },
            finish: function () {
                this.entity._positions_draw = this._positions_draw
            },
            isClampToGround: function () {
                return this.entity.attribute.style.clampToGround
            },
            bindDraggers: function () {
                for (var e = this, t = this.isClampToGround(), i = this.getPosition(), r = 0, n = i.length; r < n; r++) {
                    var o = i[r];
                    if (void 0 != this.getGraphic().height) {
                        var s = this.getGraphic().height.getValue(this.viewer.clock.currentTime);
                        o = (0, l.setPositionsHeight)(o, s)
                    }
                    t && (o = (0, l.updateHeightForClampToGround)(this.viewer, o));
                    var u = a.createDragger(this.dataSource, {
                        position: o,
                        onDrag: function (t, r) {
                            if (void 0 != e.getGraphic().height) {
                                var n = e.getGraphic().height.getValue(e.viewer.clock.currentTime);
                                r = (0, l.setPositionsHeight)(r, n), t.position = r
                            }
                            if (i[t.index] = r, e.heightDraggers && e.heightDraggers.length > 0) {
                                var o = e.getGraphic().extrudedHeight.getValue(e.viewer.clock.currentTime);
                                e.heightDraggers[t.index].position = (0, l.setPositionsHeight)(r, o)
                            }
                        }
                    });
                    u.index = r, this.draggers.push(u)
                }
                this.getGraphic().extrudedHeight && this.bindHeightDraggers()
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditCircle = void 0;
        var n = i(0),
            o = r(n),
            a = i(6),
            s = r(a),
            l = i(4),
            u = i(19),
            c = i(1);
        t.EditCircle = u.EditPolygon.extend({
            getGraphic: function () {
                return this.entity.ellipse
            },
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw, this.finish()
            },
            finish: function () {
                this.entity._positions_draw = this._positions_draw
            },
            isClampToGround: function () {
                return this.entity.attribute.style.clampToGround
            },
            getPosition: function () {
                if (void 0 != this.getGraphic().height)
                    for (var e = this.getGraphic().height.getValue(this.viewer.clock.currentTime), t = 0, i = this._positions_draw.length; t < i; t++) this._positions_draw[t] = (0, c.setPositionsHeight)(this._positions_draw[t], e);
                return this._positions_draw
            },
            bindDraggers: function () {
                var e = this,
                    t = this.isClampToGround(),
                    i = this.getPosition(),
                    r = new o.Cartesian3,
                    n = new o.Cartesian3,
                    a = this.entity.attribute.style,
                    u = i[0];
                t && (u = (0, c.updateHeightForClampToGround)(this.viewer, u), i[0] = u);
                var h = s.createDragger(this.dataSource, {
                    position: u,
                    onDrag: function (t, s) {
                        if (o.Cartesian3.subtract(s, i[t.index], r), i[t.index] = s, !a.clampToGround) {
                            var l = e.formatNum(o.Cartographic.fromCartesian(s).height, 2);
                            e.getGraphic().height = l, a.height = l
                        }
                        var u = e.viewer.clock.currentTime;
                        o.Cartesian3.add(t.majorDragger.position.getValue(u), r, n), t.majorDragger.position = n, t.minorDragger && (o.Cartesian3.add(t.minorDragger.position.getValue(u), r, n), t.minorDragger.position = n), void 0 != e.entity.attribute.style.extrudedHeight && e.updateDraggers()
                    }
                });
                h.index = 0, this.draggers.push(h);
                var d = this.viewer.clock.currentTime,
                    f = o.EllipseGeometryLibrary.computeEllipsePositions({
                        center: u,
                        semiMajorAxis: this.getGraphic().semiMajorAxis.getValue(d),
                        semiMinorAxis: this.getGraphic().semiMinorAxis.getValue(d),
                        rotation: o.Math.toRadians(Number(a.rotation || 0)),
                        granularity: 2
                    }, !0, !1),
                    p = new o.Cartesian3(f.positions[0], f.positions[1], f.positions[2]);
                t && (p = (0, c.updateHeightForClampToGround)(this.viewer, p)), i[1] = p;
                var m = s.createDragger(this.dataSource, {
                    position: p,
                    type: s.PointType.EditAttr,
                    tooltip: l.message.dragger.editRadius,
                    onDrag: function (t, r) {
                        if (void 0 != e.getGraphic().height) {
                            var n = e.getGraphic().height.getValue(d);
                            r = (0, c.setPositionsHeight)(r, n), t.position = r
                        }
                        i[t.index] = r;
                        var s = e.formatNum(o.Cartesian3.distance(i[0], r), 2);
                        e.getGraphic().semiMajorAxis = s, a.radius ? (e.getGraphic().semiMinorAxis = s, a.radius = s) : a.semiMajorAxis = s, void 0 != e.entity.attribute.style.extrudedHeight && e.updateDraggers()
                    }
                });
                if (m.index = 1, h.majorDragger = m, this.draggers.push(m), 3 == this._maxPointNum) {
                    var g = new o.Cartesian3(f.positions[3], f.positions[4], f.positions[5]);
                    t && (g = (0, c.updateHeightForClampToGround)(this.viewer, g)), i[2] = g;
                    var v = s.createDragger(this.dataSource, {
                        position: g,
                        type: s.PointType.EditAttr,
                        tooltip: l.message.dragger.editRadius,
                        onDrag: function (t, r) {
                            if (void 0 != e.getGraphic().height) {
                                var n = e.getGraphic().height.getValue(d);
                                r = (0, c.setPositionsHeight)(r, n), t.position = r
                            }
                            i[t.index] = r;
                            var s = e.formatNum(o.Cartesian3.distance(i[0], r), 2);
                            e.getGraphic().semiMinorAxis = s, a.radius ? (e.getGraphic().semiMajorAxis = s, a.radius = s) : a.semiMinorAxis = s, void 0 != e.entity.attribute.style.extrudedHeight && e.updateDraggers()
                        }
                    });
                    v.index = 2, h.minorDragger = v, this.draggers.push(v)
                }
                if (this.getGraphic().extrudedHeight) {
                    var y = this.getGraphic().extrudedHeight.getValue(d),
                        u = (0, c.setPositionsHeight)(i[0], y),
                        _ = s.createDragger(this.dataSource, {
                            position: u,
                            onDrag: function (t, r) {
                                r = (0, c.setPositionsHeight)(r, e.getGraphic().height), i[0] = r, e.updateDraggers()
                            }
                        });
                    this.draggers.push(_);
                    var w = 3 == this._maxPointNum ? [i[1], i[2]] : [i[1]];
                    this.bindHeightDraggers(w), this.heightDraggers.push(_)
                }
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditEllipsoid = void 0;
        var n = i(0),
            o = r(n),
            a = i(6),
            s = r(a),
            l = i(4),
            u = i(22),
            c = i(1);
        t.EditEllipsoid = u.EditBase.extend({
            _positions_draw: null,
            changePositionsToCallback: function () {
                this._positions_draw = this.entity.position.getValue(this.viewer.clock.currentTime)
            },
            finish: function () {
                this._positions_draw = null
            },
            updateRadii: function (e) {
                var t = new o.Cartesian3(Number(e.extentRadii), Number(e.widthRadii), Number(e.heightRadii));
                this.entity.ellipsoid.radii.setValue(t)
            },
            bindDraggers: function () {
                var e = this,
                    t = this.entity.attribute.style,
                    i = this.entity.position.getValue(this.viewer.clock.currentTime),
                    r = s.createDragger(this.dataSource, {
                        position: (0, c.addPositionsHeight)(i, t.heightRadii),
                        onDrag: function (t, i) {
                            this._positions_draw = i, e.entity.position.setValue(i), e.updateDraggers()
                        }
                    });
                this.draggers.push(r);
                var n = o.EllipseGeometryLibrary.computeEllipsePositions({
                        center: i,
                        semiMajorAxis: Number(t.extentRadii),
                        semiMinorAxis: Number(t.widthRadii),
                        rotation: o.Math.toRadians(Number(t.rotation || 0)),
                        granularity: 2
                    }, !0, !1),
                    a = new o.Cartesian3(n.positions[0], n.positions[1], n.positions[2]),
                    u = s.createDragger(this.dataSource, {
                        position: a,
                        type: s.PointType.EditAttr,
                        tooltip: l.message.dragger.editRadius,
                        onDrag: function (i, r) {
                            var n = o.Cartographic.fromCartesian(e._positions_draw).height;
                            r = (0, c.setPositionsHeight)(r, n), i.position = r;
                            var a = e.formatNum(o.Cartesian3.distance(e._positions_draw, r), 2);
                            t.extentRadii = a, e.updateRadii(t), e.updateDraggers()
                        }
                    });
                r.majorDragger = u, this.draggers.push(u);
                var h = new o.Cartesian3(n.positions[3], n.positions[4], n.positions[5]),
                    d = s.createDragger(this.dataSource, {
                        position: h,
                        type: s.PointType.EditAttr,
                        tooltip: l.message.dragger.editRadius,
                        onDrag: function (i, r) {
                            var n = o.Cartographic.fromCartesian(e._positions_draw).height;
                            r = (0, c.setPositionsHeight)(r, n), i.position = r;
                            var a = e.formatNum(o.Cartesian3.distance(e._positions_draw, r), 2);
                            t.widthRadii = a, e.updateRadii(t), e.updateDraggers()
                        }
                    });
                r.minorDragger = d, this.draggers.push(d)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditWall = void 0;
        var n = i(0),
            o = r(n),
            a = i(6),
            s = r(a),
            l = i(4),
            u = i(14),
            c = i(1);
        t.EditWall = u.EditPolyline.extend({
            getGraphic: function () {
                return this.entity.wall
            },
            changePositionsToCallback: function () {
                var e = this.viewer.clock.currentTime;
                this._positions_draw = this.entity._positions_draw || this.getGraphic().positions.getValue(e), this._minimumHeights = this.entity._minimumHeights || this.getGraphic().minimumHeights.getValue(e), this._maximumHeights = this.entity._maximumHeights || this.getGraphic().maximumHeights.getValue(e)
            },
            _maximumHeights: null,
            _minimumHeights: null,
            updateAttrForEditing: function () {
                var e = this.entity.attribute.style,
                    t = this.getPosition(),
                    i = t.length;
                this._maximumHeights = new Array(i), this._minimumHeights = new Array(i);
                for (var r = 0; r < i; r++) {
                    var n = o.Cartographic.fromCartesian(t[r]).height;
                    this._minimumHeights[r] = n, this._maximumHeights[r] = n + Number(e.extrudedHeight)
                }
                this.entity._maximumHeights = this._maximumHeights, this.entity._minimumHeights = this._minimumHeights
            },
            finish: function () {
                this.entity._positions_draw = this._positions_draw, this.entity._maximumHeights = this._maximumHeights, this.entity._minimumHeights = this._minimumHeights
            },
            bindDraggers: function () {
                for (var e = this, t = this.isClampToGround(), i = this.getPosition(), r = this.entity.attribute.style, n = i.length < this._maxPointNum, a = 0, u = i.length; a < u; a++) {
                    var h = i[a],
                        d = s.createDragger(this.dataSource, {
                            position: h,
                            clampToGround: t,
                            onDrag: function (t, a) {
                                i[t.index] = a, e.heightDraggers && e.heightDraggers.length > 0 && (e.heightDraggers[t.index].position = (0, c.addPositionsHeight)(a, r.extrudedHeight)), n && (t.index > 0 && (e.draggers[2 * t.index - 1].position = o.Cartesian3.midpoint(a, i[t.index - 1], new o.Cartesian3)), t.index < i.length - 1 && (e.draggers[2 * t.index + 1].position = o.Cartesian3.midpoint(a, i[t.index + 1], new o.Cartesian3)))
                            }
                        });
                    if (d.index = a, this.draggers.push(d), n) {
                        var f = a + 1;
                        if (f < u) {
                            var p = o.Cartesian3.midpoint(h, i[f], new o.Cartesian3),
                                m = s.createDragger(this.dataSource, {
                                    position: p,
                                    type: s.PointType.AddMidPoint,
                                    tooltip: l.message.dragger.addMidPoint,
                                    clampToGround: t,
                                    onDragStart: function (t, r) {
                                        i.splice(t.index, 0, r), e.updateAttrForEditing()
                                    },
                                    onDrag: function (e, t) {
                                        i[e.index] = t
                                    },
                                    onDragEnd: function (t, i) {
                                        e.updateDraggers()
                                    }
                                });
                            m.index = f, this.draggers.push(m)
                        }
                    }
                }
                this.bindHeightDraggers()
            },
            heightDraggers: null,
            bindHeightDraggers: function () {
                var e = this;
                this.heightDraggers = [];
                for (var t = this.getPosition(), i = this.entity.attribute.style, r = Number(i.extrudedHeight), n = 0, a = t.length; n < a; n++) {
                    var u = (0, c.addPositionsHeight)(t[n], r),
                        h = s.createDragger(this.dataSource, {
                            position: u,
                            type: s.PointType.MoveHeight,
                            tooltip: l.message.dragger.moveHeight,
                            onDrag: function (r, n) {
                                var a = o.Cartographic.fromCartesian(n).height;
                                i.extrudedHeight = e.formatNum(a - e._minimumHeights[r.index], 2);
                                for (var s = 0; s < t.length; s++) s != r.index && (e.heightDraggers[s].position = (0, c.addPositionsHeight)(t[s], i.extrudedHeight));
                                e.updateAttrForEditing()
                            }
                        });
                    h.index = n, this.draggers.push(h), this.heightDraggers.push(h)
                }
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditPModel = void 0;
        var n = i(0),
            o = r(n),
            a = i(6),
            s = r(a),
            l = i(4),
            u = i(22),
            c = i(31),
            h = r(c),
            d = i(1),
            f = i(2),
            p = r(f);
        t.EditPModel = u.EditBase.extend({
            setPositions: function (e) {
                p.isArray(e) && 1 == e.length && (e = e[0]), this.entity.position = e, this.entity.modelMatrix = this.getModelMatrix()
            },
            getModelMatrix: function (e) {
                var t = this.entity.attribute.style,
                    i = new o.HeadingPitchRoll(o.Math.toRadians(t.heading || 0), o.Math.toRadians(t.pitch || 0), o.Math.toRadians(t.roll || 0)),
                    r = o.Transforms.eastNorthUpToFixedFrame;
                return o.Transforms.headingPitchRollToFixedFrame(e || this.entity.position, i, this.viewer.scene.globe.ellipsoid, r)
            },
            bindDraggers: function () {
                if (!this.entity.ready) {
                    var e = this;
                    return void this.entity.readyPromise.then(function (t) {
                        e.bindDraggers()
                    })
                }
                var e = this;
                this.entity.draw_tooltip = l.message.dragger.def;
                var t = s.createDragger(this.dataSource, {
                        dragger: this.entity,
                        onDrag: function (t, i) {
                            e.entity.position = i, e.entity.modelMatrix = e.getModelMatrix(i), e.updateDraggers()
                        }
                    }),
                    i = this.entity.attribute.style,
                    r = this.entity.position,
                    n = o.Cartographic.fromCartesian(r).height,
                    a = this.entity.boundingSphere.radius;
                this.entityAngle = this.dataSource.entities.add({
                    name: "角度调整底部圆",
                    position: new o.CallbackProperty(function (t) {
                        return e.entity.position
                    }, !1),
                    ellipse: h.style2Entity({
                        fill: !1,
                        outline: !0,
                        outlineColor: "#ffff00",
                        outlineOpacity: .8,
                        radius: a,
                        height: n
                    })
                });
                var u = this.getHeadingPosition(),
                    c = s.createDragger(this.dataSource, {
                        position: u,
                        type: s.PointType.EditAttr,
                        tooltip: l.message.dragger.editHeading,
                        onDrag: function (t, r) {
                            var n = e.getHeading(e.entity.position, r);
                            i.heading = e.formatNum(n, 1), e.entity.modelMatrix = e.getModelMatrix(), t.position = e.getHeadingPosition()
                        }
                    });
                this.draggers.push(c);
                var f = (0, d.addPositionsHeight)(r, a),
                    t = s.createDragger(this.dataSource, {
                        position: f,
                        type: s.PointType.MoveHeight,
                        tooltip: l.message.dragger.editScale,
                        onDrag: function (t, n) {
                            var a = o.Cartesian3.distance(n, r),
                                s = t.radius / i.scale,
                                l = a / s;
                            t.radius = a, i.scale = e.formatNum(l, 2), e.entity.scale = i.scale, e.updateDraggers()
                        }
                    });
                t.radius = a, this.draggers.push(t)
            },
            destroyDraggers: function () {
                u.EditBase.prototype.destroyDraggers.call(this), this.entityAngle && (this.dataSource.entities.remove(this.entityAngle), delete this.entityAngle), this.entityBox && (this.dataSource.entities.remove(this.entityBox), delete this.entityBox)
            },
            finish: function () {
                this.entity.draw_tooltip = null
            },
            getHeadingPosition: function () {
                var e = this.entity.position,
                    t = this.entity.boundingSphere.radius,
                    i = -Number(this.entity.attribute.style.heading || 0),
                    r = new o.Cartesian3(t, 0, 0),
                    n = o.Transforms.eastNorthUpToFixedFrame(e),
                    a = o.Matrix4.fromRotationTranslation(o.Matrix3.fromRotationZ(o.Math.toRadians(i)));
                return o.Matrix4.multiply(n, a, n), n = o.Matrix4.getMatrix3(n, new o.Matrix3), r = o.Matrix3.multiplyByVector(n, r, r), r = o.Cartesian3.add(e, r, r)
            },
            getHeading: function (e, t) {
                var i = o.Transforms.eastNorthUpToFixedFrame(e);
                i = o.Matrix4.getMatrix3(i, new o.Matrix3);
                var r = o.Matrix3.getColumn(i, 0, new o.Cartesian3),
                    n = o.Matrix3.getColumn(i, 1, new o.Cartesian3),
                    a = o.Matrix3.getColumn(i, 2, new o.Cartesian3),
                    s = o.Cartesian3.subtract(t, e, new o.Cartesian3);
                s = o.Cartesian3.cross(s, a, s), s = o.Cartesian3.cross(a, s, s), s = o.Cartesian3.normalize(s, s);
                var l = o.Cartesian3.angleBetween(r, s);
                return o.Cartesian3.angleBetween(n, s) > .5 * Math.PI && (l = 2 * Math.PI - l), -o.Math.toDegrees(l)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.CustomPlaneGeometry = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        t.CustomPlaneGeometry = function () {
            function e(t) {
                r(this, e), t = a.defaultValue(t, a.defaultValue.EMPTY_OBJECT);
                var i = new a.VertexFormat({
                    st: !0,
                    position: !0,
                    bitangent: !1,
                    normal: !1,
                    color: !1,
                    tangent: !1
                });
                this._pos_arr = a.clone(t.pos_arr), this._vertexFormat = i;
                var n = new a.BoundingRectangle;
                this._SERectangle = a.BoundingRectangle.fromPoints(this._pos_arr, n), this._workerName = "createCustomPlaneGeometry"
            }
            return n(e, [{
                key: "createGeometry",
                value: function (e) {
                    var t, i, r = e._vertexFormat,
                        n = e._SERectangle,
                        o = e._pos_arr,
                        s = new a.GeometryAttributes,
                        l = o.length;
                    if (a.defined(r.position)) {
                        i = new Float64Array(3 * l);
                        for (var u = 0; u < l; u++) i[u % l * 3 + 0] = o[u].x, i[u % l * 3 + 1] = o[u].y, i[u % l * 3 + 2] = o[u].z;
                        if (s.position = new a.GeometryAttribute({
                                componentDatatype: a.ComponentDatatype.DOUBLE,
                                componentsPerAttribute: 3,
                                values: i
                            }), a.defined(r.st)) {
                            for (var c = new Float32Array(2 * l), h = n.x - n.width, d = n.y - n.height, h = n.x, d = n.y, u = 0; u < l; u++) c[2 * u + 0] = Math.abs((i[3 * u + 0] - h) / n.width), c[2 * u + 1] = Math.abs((i[3 * u + 1] - d) / n.height);
                            s.st = new a.GeometryAttribute({
                                componentDatatype: a.ComponentDatatype.FLOAT,
                                componentsPerAttribute: 2,
                                values: c
                            })
                        }
                        t = new Uint16Array(3 * (l - 2));
                        for (var u = 1; u < l - 1; u++) t[3 * (u - 1) + 0] = 0, t[3 * (u - 1) + 1] = u, t[3 * (u - 1) + 2] = u + 1
                    }
                    return new a.Geometry({
                        attributes: s,
                        indices: t,
                        primitiveType: a.PrimitiveType.TRIANGLE_FAN,
                        boundingSphere: new a.BoundingSphere(a.Cartesian3.ZERO, Math.sqrt(2))
                    })
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.WellNoBottom = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = new a.Cartesian3;
        t.WellNoBottom = function () {
            function e(t) {
                r(this, e), t = a.defaultValue(t, a.defaultValue.EMPTY_OBJECT);
                var i = t.minimumArr,
                    n = t.maximumArr;
                a.Check.defined("dingmian", n), a.Check.defined("dimianmian", i), a.Check.typeOf.number.greaterThanOrEquals("dingmian.length", n.length, 3), a.Check.typeOf.number.greaterThanOrEquals("dimian.length", i.length, 3);
                var o = new a.VertexFormat({
                    st: !0,
                    position: !0,
                    bitangent: !1,
                    normal: !1,
                    color: !1,
                    tangent: !1
                });
                this._minimumArr = a.clone(i), this._maximumArr = a.clone(n), this._vertexFormat = o, this._workerName = "createWellNoBottom"
            }
            return n(e, [{
                key: "createGeometry",
                value: function (e, t) {
                    var i, r, n = e._minimumArr,
                        o = e._maximumArr,
                        l = e._vertexFormat,
                        u = new a.GeometryAttributes;
                    if (a.defined(l.position) && a.defined(l.st)) {
                        if (a.defined(l.position)) {
                            r = new Float64Array(4 * o.length * 3);
                            for (var c = 0; c < o.length; c++) c == o.length - 1 ? (r[12 * c + 0] = o[c].x, r[12 * c + 1] = o[c].y, r[12 * c + 2] = o[c].z, r[12 * c + 3] = n[c].x, r[12 * c + 4] = n[c].y, r[12 * c + 5] = n[c].z, r[12 * c + 9] = n[0].x, r[12 * c + 10] = n[0].y, r[12 * c + 11] = n[0].z, r[12 * c + 6] = o[0].x, r[12 * c + 7] = o[0].y, r[12 * c + 8] = o[0].z) : (r[12 * c + 0] = o[c].x, r[12 * c + 1] = o[c].y, r[12 * c + 2] = o[c].z, r[12 * c + 3] = n[c].x, r[12 * c + 4] = n[c].y, r[12 * c + 5] = n[c].z, r[12 * c + 9] = n[c + 1].x, r[12 * c + 10] = n[c + 1].y, r[12 * c + 11] = n[c + 1].z, r[12 * c + 6] = o[c + 1].x, r[12 * c + 7] = o[c + 1].y, r[12 * c + 8] = o[c + 1].z);
                            u.position = new a.GeometryAttribute({
                                componentDatatype: a.ComponentDatatype.DOUBLE,
                                componentsPerAttribute: 3,
                                values: r
                            })
                        }
                        var h = t.top_heights,
                            d = t.maxHeight || 0;
                        t.splitNum;
                        if (a.defined(l.st)) {
                            for (var f = new Float32Array(4 * o.length * 2), p = o.length, c = 0; c < o.length; c++) {
                                var m = c / p,
                                    g = h && h[c] || 0,
                                    v = (g - t.targetHeight) / (d - t.targetHeight),
                                    y = c + 1,
                                    _ = h && h[y] || 0,
                                    w = y / p,
                                    b = (_ - t.targetHeight) / (d - t.targetHeight);
                                f[8 * c + 0] = m, f[8 * c + 1] = v - 0, f[8 * c + 2] = m, f[8 * c + 3] = v - v, f[8 * c + 4] = w, f[8 * c + 5] = b - 0, f[8 * c + 6] = w, f[8 * c + 7] = b - b
                            }
                            u.st = new a.GeometryAttribute({
                                componentDatatype: a.ComponentDatatype.FLOAT,
                                componentsPerAttribute: 2,
                                values: f
                            })
                        }
                        i = new Uint16Array(2 * o.length * 3);
                        for (var C = new a.Cartesian3(9999999999999, 9999999999999, 9999999999999), x = new a.Cartesian3(-9999999999999, -9999999999999, -9999999999999), c = 0; c < o.length; c++) i[6 * c + 0] = 4 * c + 0, i[6 * c + 1] = 4 * c + 1, i[6 * c + 2] = 4 * c + 2, i[6 * c + 3] = 4 * c + 1, i[6 * c + 4] = 4 * c + 2, i[6 * c + 5] = 4 * c + 3, o[c].x >= x.x && o[c].y >= x.y && o[c].z >= x.z && (x = o[c]), n[c].x <= C.x && n[c].y <= C.y && n[c].z <= C.z && (C = n[c])
                    }
                    var P = a.Cartesian3.subtract(x, C, s),
                        E = .5 * a.Cartesian3.magnitude(P);
                    return new a.Geometry({
                        attributes: u,
                        indices: i,
                        primitiveType: a.PrimitiveType.TRIANGLES,
                        boundingSphere: new a.BoundingSphere(a.Cartesian3.ZERO, E)
                    })
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            this._show = void 0, this._radius = void 0, this._xHalfAngle = void 0, this._yHalfAngle = void 0, this._lineColor = void 0, this._showSectorLines = void 0, this._showSectorSegmentLines = void 0, this._showLateralSurfaces = void 0, this._material = void 0, this._showDomeSurfaces = void 0, this._showDomeLines = void 0, this._showIntersection = void 0, this._intersectionColor = void 0, this._intersectionWidth = void 0, this._showThroughEllipsoid = void 0, this._gaze = void 0, this._showScanPlane = void 0, this._scanPlaneColor = void 0, this._scanPlaneMode = void 0, this._scanPlaneRate = void 0, this._definitionChanged = new o.Event, this.merge(o.defaultValue(e, o.defaultValue.EMPTY_OBJECT))
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.RectangularSensorGraphics = void 0;
        var n = i(0),
            o = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(n);
        o.defineProperties(r.prototype, {
            definitionChanged: {
                get: function () {
                    return this._definitionChanged
                }
            },
            show: o.createPropertyDescriptor("show"),
            radius: o.createPropertyDescriptor("radius"),
            xHalfAngle: o.createPropertyDescriptor("xHalfAngle"),
            yHalfAngle: o.createPropertyDescriptor("yHalfAngle"),
            lineColor: o.createPropertyDescriptor("lineColor"),
            showSectorLines: o.createPropertyDescriptor("showSectorLines"),
            showSectorSegmentLines: o.createPropertyDescriptor("showSectorSegmentLines"),
            showLateralSurfaces: o.createPropertyDescriptor("showLateralSurfaces"),
            material: o.createMaterialPropertyDescriptor("material"),
            showDomeSurfaces: o.createPropertyDescriptor("showDomeSurfaces"),
            showDomeLines: o.createPropertyDescriptor("showDomeLines "),
            showIntersection: o.createPropertyDescriptor("showIntersection"),
            intersectionColor: o.createPropertyDescriptor("intersectionColor"),
            intersectionWidth: o.createPropertyDescriptor("intersectionWidth"),
            showThroughEllipsoid: o.createPropertyDescriptor("showThroughEllipsoid"),
            gaze: o.createPropertyDescriptor("gaze"),
            showScanPlane: o.createPropertyDescriptor("showScanPlane"),
            scanPlaneColor: o.createPropertyDescriptor("scanPlaneColor"),
            scanPlaneMode: o.createPropertyDescriptor("scanPlaneMode"),
            scanPlaneRate: o.createPropertyDescriptor("scanPlaneRate")
        }), r.prototype.clone = function (e) {
            return o.defined(e) || (e = new r), e.show = this.show, e.radius = this.radius, e.xHalfAngle = this.xHalfAngle, e.yHalfAngle = this.yHalfAngle, e.lineColor = this.lineColor, e.showSectorLines = this.showSectorLines, e.showSectorSegmentLines = this.showSectorSegmentLines, e.showLateralSurfaces = this.showLateralSurfaces, e.material = this.material, e.showDomeSurfaces = this.showDomeSurfaces, e.showDomeLines = this.showDomeLines, e.showIntersection = this.showIntersection, e.intersectionColor = this.intersectionColor, e.intersectionWidth = this.intersectionWidth, e.showThroughEllipsoid = this.showThroughEllipsoid, e.gaze = this.gaze, e.showScanPlane = this.showScanPlane, e.scanPlaneColor = this.scanPlaneColor, e.scanPlaneMode = this.scanPlaneMode, e.scanPlaneRate = this.scanPlaneRate, e
        }, r.prototype.merge = function (e) {
            if (!o.defined(e)) throw new o.DeveloperError("source is required.");
            this.slice = o.defaultValue(this.slice, e.slice), this.show = o.defaultValue(this.show, e.show), this.radius = o.defaultValue(this.radius, e.radius), this.xHalfAngle = o.defaultValue(this.xHalfAngle, e.xHalfAngle), this.yHalfAngle = o.defaultValue(this.yHalfAngle, e.yHalfAngle), this.lineColor = o.defaultValue(this.lineColor, e.lineColor), this.showSectorLines = o.defaultValue(this.showSectorLines, e.showSectorLines), this.showSectorSegmentLines = o.defaultValue(this.showSectorSegmentLines, e.showSectorSegmentLines), this.showLateralSurfaces = o.defaultValue(this.showLateralSurfaces, e.showLateralSurfaces), this.material = o.defaultValue(this.material, e.material), this.showDomeSurfaces = o.defaultValue(this.showDomeSurfaces, e.showDomeSurfaces), this.showDomeLines = o.defaultValue(this.showDomeLines, e.showDomeLines), this.showIntersection = o.defaultValue(this.showIntersection, e.showIntersection), this.intersectionColor = o.defaultValue(this.intersectionColor, e.intersectionColor), this.intersectionWidth = o.defaultValue(this.intersectionWidth, e.intersectionWidth), this.showThroughEllipsoid = o.defaultValue(this.showThroughEllipsoid, e.showThroughEllipsoid), this.gaze = o.defaultValue(this.gaze, e.gaze), this.showScanPlane = o.defaultValue(this.showScanPlane, e.showScanPlane), this.scanPlaneColor = o.defaultValue(this.scanPlaneColor, e.scanPlaneColor), this.scanPlaneMode = o.defaultValue(this.scanPlaneMode, e.scanPlaneMode), this.scanPlaneRate = o.defaultValue(this.scanPlaneRate, e.scanPlaneRate)
        }, t.RectangularSensorGraphics = r
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function n(e) {
            var t = this;
            e = F(e, F.EMPTY_OBJECT), this.show = F(e.show, !0), this.slice = F(e.slice, 32), this.modelMatrix = I.clone(e.modelMatrix, new I), this._modelMatrix = new I, this._computedModelMatrix = new I, this._computedScanPlaneModelMatrix = new I, this.radius = F(e.radius, Number.POSITIVE_INFINITY), this._radius = void 0, this.xHalfAngle = F(e.xHalfAngle, 0), this._xHalfAngle = void 0, this.yHalfAngle = F(e.yHalfAngle, 0), this._yHalfAngle = void 0, this.lineColor = F(e.lineColor, A.WHITE), this.showSectorLines = F(e.showSectorLines, !0), this.showSectorSegmentLines = F(e.showSectorSegmentLines, !0), this.showLateralSurfaces = F(e.showLateralSurfaces, !0), this.material = N(e.material) ? e.material : X.fromType(X.ColorType), this._material = void 0, this._translucent = void 0, this.lateralSurfaceMaterial = N(e.lateralSurfaceMaterial) ? e.lateralSurfaceMaterial : X.fromType(X.ColorType), this._lateralSurfaceMaterial = void 0, this._lateralSurfaceTranslucent = void 0, this.showDomeSurfaces = F(e.showDomeSurfaces, !0), this.domeSurfaceMaterial = N(e.domeSurfaceMaterial) ? e.domeSurfaceMaterial : X.fromType(X.ColorType), this._domeSurfaceMaterial = void 0, this.showDomeLines = F(e.showDomeLines, !0), this.showIntersection = F(e.showIntersection, !0), this.intersectionColor = F(e.intersectionColor, A.WHITE), this.intersectionWidth = F(e.intersectionWidth, 5), this.showThroughEllipsoid = F(e.showThroughEllipsoid, !1), this._showThroughEllipsoid = void 0, this.showScanPlane = F(e.showScanPlane, !0), this.scanPlaneColor = F(e.scanPlaneColor, A.WHITE), this.scanPlaneMode = F(e.scanPlaneMode, "horizontal"), this.scanPlaneRate = F(e.scanPlaneRate, 10), this._scanePlaneXHalfAngle = 0, this._scanePlaneYHalfAngle = 0, this._time = te.now(), this._boundingSphere = new D, this._boundingSphereWC = new D, this._sectorFrontCommand = new G({
                owner: this,
                primitiveType: z.TRIANGLES,
                boundingVolume: this._boundingSphereWC
            }), this._sectorBackCommand = new G({
                owner: this,
                primitiveType: z.TRIANGLES,
                boundingVolume: this._boundingSphereWC
            }), this._sectorVA = void 0, this._sectorLineCommand = new G({
                owner: this,
                primitiveType: z.LINES,
                boundingVolume: this._boundingSphereWC
            }), this._sectorLineVA = void 0, this._sectorSegmentLineCommand = new G({
                owner: this,
                primitiveType: z.LINES,
                boundingVolume: this._boundingSphereWC
            }), this._sectorSegmentLineVA = void 0, this._domeFrontCommand = new G({
                owner: this,
                primitiveType: z.TRIANGLES,
                boundingVolume: this._boundingSphereWC
            }), this._domeBackCommand = new G({
                owner: this,
                primitiveType: z.TRIANGLES,
                boundingVolume: this._boundingSphereWC
            }), this._domeVA = void 0, this._domeLineCommand = new G({
                owner: this,
                primitiveType: z.LINES,
                boundingVolume: this._boundingSphereWC
            }), this._domeLineVA = void 0, this._scanPlaneFrontCommand = new G({
                owner: this,
                primitiveType: z.TRIANGLES,
                boundingVolume: this._boundingSphereWC
            }), this._scanPlaneBackCommand = new G({
                owner: this,
                primitiveType: z.TRIANGLES,
                boundingVolume: this._boundingSphereWC
            }), this._scanRadialCommand = void 0, this._colorCommands = [], this._frontFaceRS = void 0, this._backFaceRS = void 0, this._sp = void 0, this._uniforms = {
                u_type: function () {
                    return 0
                },
                u_xHalfAngle: function () {
                    return t.xHalfAngle
                },
                u_yHalfAngle: function () {
                    return t.yHalfAngle
                },
                u_radius: function () {
                    return t.radius
                },
                u_showThroughEllipsoid: function () {
                    return t.showThroughEllipsoid
                },
                u_showIntersection: function () {
                    return t.showIntersection
                },
                u_intersectionColor: function () {
                    return t.intersectionColor
                },
                u_intersectionWidth: function () {
                    return t.intersectionWidth
                },
                u_normalDirection: function () {
                    return 1
                },
                u_lineColor: function () {
                    return t.lineColor
                }
            }, this._scanUniforms = {
                u_xHalfAngle: function () {
                    return t._scanePlaneXHalfAngle
                },
                u_yHalfAngle: function () {
                    return t._scanePlaneYHalfAngle
                },
                u_radius: function () {
                    return t.radius
                },
                u_color: function () {
                    return t.scanPlaneColor
                },
                u_showThroughEllipsoid: function () {
                    return t.showThroughEllipsoid
                },
                u_showIntersection: function () {
                    return t.showIntersection
                },
                u_intersectionColor: function () {
                    return t.intersectionColor
                },
                u_intersectionWidth: function () {
                    return t.intersectionWidth
                },
                u_normalDirection: function () {
                    return 1
                },
                u_lineColor: function () {
                    return t.lineColor
                }
            }
        }

        function o(e, t, i) {
            for (var r = e.slice, n = re(i), o = ne(i), a = re(t), s = ne(t), l = oe(a * o), u = oe(n * s), c = [], h = 0; h < r; h++) {
                var d = 2 * l * h / (r - 1) - l;
                c.push(new k(0, ie(d), re(d)))
            }
            for (var f = [], h = 0; h < r; h++) {
                var d = 2 * u * h / (r - 1) - u;
                f.push(new k(ie(d), 0, re(d)))
            }
            return {
                zoy: c,
                zox: f
            }
        }

        function a(e, t) {
            var i = e.xHalfAngle,
                r = e.yHalfAngle,
                n = t.zoy,
                o = t.zox,
                a = [],
                s = ee.fromRotationY(i, se);
            a.push(n.map(function (e) {
                return ee.multiplyByVector(s, e, new b.Cartesian3)
            }));
            var s = ee.fromRotationX(-r, se);
            a.push(o.map(function (e) {
                return ee.multiplyByVector(s, e, new b.Cartesian3)
            }).reverse());
            var s = ee.fromRotationY(-i, se);
            a.push(n.map(function (e) {
                return ee.multiplyByVector(s, e, new b.Cartesian3)
            }).reverse());
            var s = ee.fromRotationX(r, se);
            return a.push(o.map(function (e) {
                return ee.multiplyByVector(s, e, new b.Cartesian3)
            })), a
        }

        function s(e, t) {
            for (var i = Array.prototype.concat.apply([], t).length - t.length, r = new Float32Array(18 * i), n = 0, o = 0, a = t.length; o < a; o++)
                for (var s = t[o], l = k.normalize(k.cross(s[0], s[s.length - 1], le), le), u = 0, i = s.length - 1; u < i; u++) r[n++] = 0, r[n++] = 0, r[n++] = 0, r[n++] = -l.x, r[n++] = -l.y, r[n++] = -l.z, r[n++] = s[u].x, r[n++] = s[u].y, r[n++] = s[u].z, r[n++] = -l.x, r[n++] = -l.y, r[n++] = -l.z, r[n++] = s[u + 1].x, r[n++] = s[u + 1].y, r[n++] = s[u + 1].z, r[n++] = -l.x, r[n++] = -l.y, r[n++] = -l.z;
            var c = H.createVertexBuffer({
                    context: e,
                    typedArray: r,
                    usage: B.STATIC_DRAW
                }),
                h = 6 * Float32Array.BYTES_PER_ELEMENT,
                d = [{
                    index: ae.position,
                    vertexBuffer: c,
                    componentsPerAttribute: 3,
                    componentDatatype: L.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: h
                }, {
                    index: ae.normal,
                    vertexBuffer: c,
                    componentsPerAttribute: 3,
                    componentDatatype: L.FLOAT,
                    offsetInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
                    strideInBytes: h
                }];
            return new q({
                context: e,
                attributes: d
            })
        }

        function l(e, t) {
            for (var i = t.length, r = new Float32Array(9 * i), n = 0, o = 0, a = t.length; o < a; o++) {
                var s = t[o];
                r[n++] = 0, r[n++] = 0, r[n++] = 0, r[n++] = s[0].x, r[n++] = s[0].y, r[n++] = s[0].z
            }
            var l = H.createVertexBuffer({
                    context: e,
                    typedArray: r,
                    usage: B.STATIC_DRAW
                }),
                u = 3 * Float32Array.BYTES_PER_ELEMENT,
                c = [{
                    index: ae.position,
                    vertexBuffer: l,
                    componentsPerAttribute: 3,
                    componentDatatype: L.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: u
                }];
            return new q({
                context: e,
                attributes: c
            })
        }

        function u(e, t) {
            for (var i = Array.prototype.concat.apply([], t).length - t.length, r = new Float32Array(9 * i), n = 0, o = 0, a = t.length; o < a; o++)
                for (var s = t[o], l = 0, i = s.length - 1; l < i; l++) r[n++] = s[l].x, r[n++] = s[l].y, r[n++] = s[l].z, r[n++] = s[l + 1].x, r[n++] = s[l + 1].y, r[n++] = s[l + 1].z;
            var u = H.createVertexBuffer({
                    context: e,
                    typedArray: r,
                    usage: B.STATIC_DRAW
                }),
                c = 3 * Float32Array.BYTES_PER_ELEMENT,
                h = [{
                    index: ae.position,
                    vertexBuffer: u,
                    componentsPerAttribute: 3,
                    componentDatatype: L.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: c
                }];
            return new q({
                context: e,
                attributes: h
            })
        }

        function c(e) {
            var t = b.EllipsoidGeometry.createGeometry(new b.EllipsoidGeometry({
                vertexFormat: Q.POSITION_ONLY,
                stackPartitions: 32,
                slicePartitions: 32
            }));
            return q.fromGeometry({
                context: e,
                geometry: t,
                attributeLocations: ae,
                bufferUsage: B.STATIC_DRAW,
                interleave: !1
            })
        }

        function h(e) {
            var t = b.EllipsoidOutlineGeometry.createGeometry(new b.EllipsoidOutlineGeometry({
                vertexFormat: Q.POSITION_ONLY,
                stackPartitions: 32,
                slicePartitions: 32
            }));
            return q.fromGeometry({
                context: e,
                geometry: t,
                attributeLocations: ae,
                bufferUsage: B.STATIC_DRAW,
                interleave: !1
            })
        }

        function d(e, t) {
            for (var i = t.length - 1, r = new Float32Array(9 * i), n = 0, o = 0; o < i; o++) r[n++] = 0, r[n++] = 0, r[n++] = 0, r[n++] = t[o].x, r[n++] = t[o].y, r[n++] = t[o].z, r[n++] = t[o + 1].x, r[n++] = t[o + 1].y, r[n++] = t[o + 1].z;
            var a = H.createVertexBuffer({
                    context: e,
                    typedArray: r,
                    usage: B.STATIC_DRAW
                }),
                s = 3 * Float32Array.BYTES_PER_ELEMENT,
                l = [{
                    index: ae.position,
                    vertexBuffer: a,
                    componentsPerAttribute: 3,
                    componentDatatype: L.FLOAT,
                    offsetInBytes: 0,
                    strideInBytes: s
                }];
            return new q({
                context: e,
                attributes: l
            })
        }

        function f(e, t) {
            var i = t.context,
                r = o(e, e.xHalfAngle, e.yHalfAngle),
                n = a(e, r);
            if (e.showLateralSurfaces && (e._sectorVA = s(i, n)), e.showSectorLines && (e._sectorLineVA = l(i, n)), e.showSectorSegmentLines && (e._sectorSegmentLineVA = u(i, n)), e.showDomeSurfaces && (e._domeVA = c(i)), e.showDomeLines && (e._domeLineVA = h(i)), e.showScanPlane)
                if ("horizontal" == e.scanPlaneMode) {
                    var f = o(e, $.PI_OVER_TWO, 0);
                    e._scanPlaneVA = d(i, f.zox)
                } else {
                    var f = o(e, 0, $.PI_OVER_TWO);
                    e._scanPlaneVA = d(i, f.zoy)
                }
        }

        function p(e, t, i) {
            var r = t.context,
                n = x.default,
                o = new Y({
                    sources: [T.default, i.shaderSource, E.default]
                });
            e._sp = U.replaceCache({
                context: r,
                shaderProgram: e._sp,
                vertexShaderSource: n,
                fragmentShaderSource: o,
                attributeLocations: ae
            });
            var a = new Y({
                sources: [T.default, i.shaderSource, E.default],
                pickColorQualifier: "uniform"
            });
            e._pickSP = U.replaceCache({
                context: r,
                shaderProgram: e._pickSP,
                vertexShaderSource: n,
                fragmentShaderSource: a,
                attributeLocations: ae
            })
        }

        function m(e, t, i) {
            var r = t.context,
                n = x.default,
                o = new Y({
                    sources: [T.default, i.shaderSource, O.default]
                });
            e._scanePlaneSP = U.replaceCache({
                context: r,
                shaderProgram: e._scanePlaneSP,
                vertexShaderSource: n,
                fragmentShaderSource: o,
                attributeLocations: ae
            })
        }

        function g(e, t, i) {
            p(e, t, i), e.showScanPlane && m(e, t, i)
        }

        function v(e, t, i) {
            i ? (e._frontFaceRS = W.fromCache({
                depthTest: {
                    enabled: !t
                },
                depthMask: !1,
                blending: J.ALPHA_BLEND,
                cull: {
                    enabled: !0,
                    face: Z.BACK
                }
            }), e._backFaceRS = W.fromCache({
                depthTest: {
                    enabled: !t
                },
                depthMask: !1,
                blending: J.ALPHA_BLEND,
                cull: {
                    enabled: !0,
                    face: Z.FRONT
                }
            }), e._pickRS = W.fromCache({
                depthTest: {
                    enabled: !t
                },
                depthMask: !1,
                blending: J.ALPHA_BLEND
            })) : (e._frontFaceRS = W.fromCache({
                depthTest: {
                    enabled: !t
                },
                depthMask: !0
            }), e._pickRS = W.fromCache({
                depthTest: {
                    enabled: !0
                },
                depthMask: !0
            }))
        }

        function y(e, t, i, r, n, o, a, s, l, u, c, h) {
            u && i && (i.vertexArray = a, i.renderState = n, i.shaderProgram = o, i.uniformMap = R(s, e._material._uniforms), i.uniformMap.u_normalDirection = function () {
                return -1
            }, i.pass = c, i.modelMatrix = l, e._colorCommands.push(i)), t.vertexArray = a, t.renderState = r, t.shaderProgram = o, t.uniformMap = R(s, e._material._uniforms), h && (t.uniformMap.u_type = function () {
                return 1
            }), t.pass = c, t.modelMatrix = l, e._colorCommands.push(t)
        }

        function _(e, t) {
            e._colorCommands.length = 0;
            var i = t ? j.TRANSLUCENT : j.OPAQUE;
            e.showLateralSurfaces && y(e, e._sectorFrontCommand, e._sectorBackCommand, e._frontFaceRS, e._backFaceRS, e._sp, e._sectorVA, e._uniforms, e._computedModelMatrix, t, i), e.showSectorLines && y(e, e._sectorLineCommand, void 0, e._frontFaceRS, e._backFaceRS, e._sp, e._sectorLineVA, e._uniforms, e._computedModelMatrix, t, i, !0), e.showSectorSegmentLines && y(e, e._sectorSegmentLineCommand, void 0, e._frontFaceRS, e._backFaceRS, e._sp, e._sectorSegmentLineVA, e._uniforms, e._computedModelMatrix, t, i, !0), e.showDomeSurfaces && y(e, e._domeFrontCommand, e._domeBackCommand, e._frontFaceRS, e._backFaceRS, e._sp, e._domeVA, e._uniforms, e._computedModelMatrix, t, i), e.showDomeLines && y(e, e._domeLineCommand, void 0, e._frontFaceRS, e._backFaceRS, e._sp, e._domeLineVA, e._uniforms, e._computedModelMatrix, t, i, !0), e.showScanPlane && y(e, e._scanPlaneFrontCommand, e._scanPlaneBackCommand, e._frontFaceRS, e._backFaceRS, e._scanePlaneSP, e._scanPlaneVA, e._scanUniforms, e._computedScanPlaneModelMatrix, t, i)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.RectangularSensorPrimitive = void 0;
        var w = i(0),
            b = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(w),
            C = i(140),
            x = r(C),
            P = i(141),
            E = r(P),
            M = i(142),
            T = r(M),
            S = i(143),
            O = r(S),
            D = b.BoundingSphere,
            k = b.Cartesian3,
            A = b.Color,
            R = b.combine,
            L = b.ComponentDatatype,
            F = b.defaultValue,
            N = b.defined,
            V = b.DeveloperError,
            I = b.Matrix4,
            z = b.PrimitiveType,
            H = b.Buffer,
            B = b.BufferUsage,
            G = b.DrawCommand,
            j = b.Pass,
            W = b.RenderState,
            U = b.ShaderProgram,
            Y = b.ShaderSource,
            q = b.VertexArray,
            J = b.BlendingState,
            Z = b.CullFace,
            X = b.Material,
            K = b.SceneMode,
            Q = b.VertexFormat,
            $ = b.Math,
            ee = b.Matrix3,
            I = b.Matrix4,
            te = b.JulianDate,
            ie = Math.sin,
            re = Math.cos,
            ne = Math.tan,
            oe = Math.atan,
            ae = (Math.asin, {
                position: 0,
                normal: 1
            });
        n.prototype.update = function (e) {
            var t = e.mode;
            if (this.show && t === K.SCENE3D) {
                var i = !1,
                    r = !1,
                    n = !1,
                    o = this.xHalfAngle,
                    a = this.yHalfAngle;
                if (o < 0 || a < 0) throw new V("halfAngle must be greater than or equal to zero.");
                if (0 != o && 0 != a) {
                    this._xHalfAngle === o && this._yHalfAngle === a || (this._xHalfAngle = o, this._yHalfAngle = a, i = !0);
                    var s = this.radius;
                    if (s < 0) throw new V("this.radius must be greater than or equal to zero.");
                    var l = !1;
                    this._radius !== s && (l = !0, this._radius = s, this._boundingSphere = new D(k.ZERO, this.radius));
                    (!I.equals(this.modelMatrix, this._modelMatrix) || l) && (I.clone(this.modelMatrix, this._modelMatrix), I.multiplyByUniformScale(this.modelMatrix, this.radius, this._computedModelMatrix), D.transform(this._boundingSphere, this.modelMatrix, this._boundingSphereWC));
                    var u = this.showThroughEllipsoid;
                    this._showThroughEllipsoid !== this.showThroughEllipsoid && (this._showThroughEllipsoid = u, r = !0);
                    var c = this.material;
                    this._material !== c && (this._material = c, r = !0, n = !0);
                    var h = c.isTranslucent();
                    if (this._translucent !== h && (this._translucent = h, r = !0), this.showScanPlane) {
                        var d = e.time,
                            p = te.secondsDifference(d, this._time);
                        p < 0 && (this._time = te.clone(d, this._time));
                        var m, y = Math.max(p % this.scanPlaneRate / this.scanPlaneRate, 0);
                        if ("horizontal" == this.scanPlaneMode) {
                            m = 2 * a * y - a;
                            var w = re(m),
                                C = ne(o),
                                x = oe(w * C);
                            this._scanePlaneXHalfAngle = x, this._scanePlaneYHalfAngle = m, b.Matrix3.fromRotationX(this._scanePlaneYHalfAngle, se)
                        } else {
                            m = 2 * o * y - o;
                            var P = ne(a),
                                E = re(m),
                                M = oe(E * P);
                            this._scanePlaneXHalfAngle = m, this._scanePlaneYHalfAngle = M, b.Matrix3.fromRotationY(this._scanePlaneXHalfAngle, se)
                        }
                        b.Matrix4.multiplyByMatrix3(this.modelMatrix, se, this._computedScanPlaneModelMatrix), I.multiplyByUniformScale(this._computedScanPlaneModelMatrix, this.radius, this._computedScanPlaneModelMatrix)
                    }
                    i && f(this, e), r && v(this, u, h), n && g(this, e, c), (r || n) && _(this, h);
                    var T = e.commandList,
                        S = e.passes,
                        O = this._colorCommands;
                    if (S.render)
                        for (var A = 0, R = O.length; A < R; A++) {
                            var L = O[A];
                            T.push(L)
                        }
                }
            }
        };
        var se = new ee,
            le = new k;
        t.RectangularSensorPrimitive = n
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function n(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        i(61), i(62);
        var o = i(0),
            a = n(o),
            s = i(63),
            l = n(s),
            u = i(15),
            c = i(35),
            h = n(c),
            d = i(64),
            f = i(65),
            p = i(66),
            m = i(37),
            g = i(18),
            v = n(g),
            y = i(105),
            _ = n(y),
            w = i(109),
            b = i(110),
            C = i(111),
            x = i(112),
            P = i(113),
            E = i(115),
            M = i(116),
            T = i(117),
            S = i(118),
            O = i(120),
            D = i(121),
            k = i(122),
            A = i(123),
            R = i(124),
            L = i(125),
            F = i(128),
            N = i(129),
            V = i(130),
            I = i(16),
            z = i(20),
            H = n(z),
            B = i(7),
            G = n(B),
            j = i(4),
            W = i(3),
            U = n(W),
            Y = i(6),
            q = n(Y),
            J = i(22),
            Z = i(52),
            X = i(49),
            K = i(47),
            Q = i(53),
            $ = i(46),
            ee = i(19),
            te = i(131),
            ie = i(14),
            re = i(48),
            ne = i(51),
            oe = i(54),
            ae = i(55),
            se = i(132),
            le = i(40),
            ue = i(134),
            ce = i(136),
            he = i(30),
            de = i(138),
            fe = i(59),
            pe = i(58),
            me = i(144),
            ge = i(146),
            ve = i(147),
            ye = i(149),
            _e = n(ye),
            we = i(150),
            be = r(we),
            Ce = i(151),
            xe = r(Ce),
            Pe = i(152),
            Ee = i(153),
            Me = i(155),
            Te = i(157),
            Se = i(28),
            Oe = n(Se),
            De = i(158),
            ke = n(De),
            Ae = i(1),
            Re = n(Ae),
            Le = i(25),
            Fe = n(Le),
            Ne = i(2),
            Ve = n(Ne),
            Ie = i(26),
            ze = n(Ie),
            He = i(159),
            Be = i(161),
            Ge = i(162),
            je = i(164),
            We = i(167);
        t.name = "", t.website = "", t.author = "", t.version = l.version, t.update = l.update, t.Class = u.Class, t.widget = h, t.widget.BaseWidget = d.BaseWidget, a.defined(a.ExpandByMars) || (a.ExpandByMars = f.ExpandByMars), t.createMap = p.createMap, t.ViewerEx = m.ViewerEx, t.layer = v, t.analysi = {}, t.analysi.GlobeDefine = _, t.analysi.FloodByEntity = w.FloodByEntity, t.analysi.FloodByTerrain = b.FloodByTerrain, t.analysi.Measure = C.Measure, t.analysi.MeasureVolume = x.MeasureVolume, t.analysi.Skyline = P.Skyline, t.analysi.TerrainClip = E.TerrainClip, t.analysi.TerrainClipPlan = M.TerrainClipPlan, t.analysi.Underground = T.Underground, t.analysi.ViewShed3D = S.ViewShed3D, t.analysi.Sightline = O.Sightline, t.analysi.HeightCounterByTerrain = D.HeightCounterByTerrain, t.tiles = {}, t.tiles.MixedOcclusion = k.MixedOcclusion, t.tiles.TilesEditor = A.TilesEditor, t.tiles.TilesClipPlan = R.TilesClipPlan, t.tiles.TilesClip = L.TilesClip, t.tiles.TilesFlat = F.TilesFlat, t.tiles.TilesFlood = N.TilesFlood, t.FlyLine = V.FlyLine, t.Draw = I.Draw, t.draw = {}, t.draw.register = I.register, t.draw.attr = H, t.draw.event = G, t.draw.tooltip = j.message, t.draw.util = U, t.draw.dragger = q, t.DrawEdit = {}, t.DrawEdit.Base = J.EditBase, t.DrawEdit.Circle = Z.EditCircle, t.DrawEdit.Corridor = X.EditCorridor, t.DrawEdit.Curve = K.EditCurve, t.DrawEdit.Ellipsoid = Q.EditEllipsoid, t.DrawEdit.Point = $.EditPoint, t.DrawEdit.Polygon = ee.EditPolygon, t.DrawEdit.PolygonEx = te.EditPolygonEx, t.DrawEdit.Polyline = ie.EditPolyline, t.DrawEdit.PolylineVolume = re.EditPolylineVolume, t.DrawEdit.Rectangle = ne.EditRectangle, t.DrawEdit.Wall = oe.EditWall, t.DrawEdit.PModel = ae.EditPModel, t.CircleFadeMaterial = se.CircleFadeMaterial, t.CircleWaveMaterial = le.CircleWaveMaterial, t.CircleScanMaterial = ue.CircleScanMaterial, t.GroundLineFlowMaterial = ce.GroundLineFlowMaterial, t.LineFlowMaterial = he.LineFlowMaterial, t.TextMaterial = de.TextMaterial, t.RectangularSensorPrimitive = fe.RectangularSensorPrimitive, t.RectangularSensorGraphics = pe.RectangularSensorGraphics, t.RectangularSensorVisualizer = me.RectangularSensorVisualizer;
        var Ue = a.DataSourceDisplay.defaultVisualizersCallback;
        a.DataSourceDisplay.defaultVisualizersCallback = function (e, t, i) {
            var r = i.entities;
            return Ue(e, t, i).concat([new me.RectangularSensorVisualizer(e, r)])
        }, t.DivPoint = ge.DivPoint, t.DynamicRiver = ve.DynamicRiver, t.water = _e, t.scene = {}, t.scene.RainFS = be.default, t.scene.SnowFS = xe.default, t.scene.FogEffect = Pe.FogEffect, t.scene.InvertedScene = Ee.InvertedScene, t.scene.SnowCover = Me.SnowCover, t.scene.WaterSpout = Te.WaterSpout, t.matrix = Oe, t.model = ke, t.point = Re, t.pointconvert = Fe, t.util = Ve, t.tileset = ze, t.video = {}, t.video.Video3D = He.Video3D, t.video.Video2D = Be.Video2D, t.FlowEcharts = Ge.FlowEcharts, t.MapVLayer = je.MapVLayer, t.ZoomNavigation = We.ZoomNavigation, t.latlng = Re, t.TilesEditor = A.TilesEditor, t.Measure = C.Measure, t.util.createModel = ke.createModel, t.util.tileset = ze, t.AnimationLineMaterialProperty = he.LineFlowMaterial, t.ElliposidFadeMaterialProperty = se.CircleFadeMaterial, t.GroundPolylineFlowMaterial = ce.GroundLineFlowMaterial, t.analysi.TerrainExcavate = E.TerrainClip, t.analysi.TerrainFlood = b.FloodByTerrain, t.analysi.VideoShed3D = He.Video3D, t.VideoShed3D = He.Video3D, t.util.terrainPolyline = Re.terrainPolyline, t.point.formatPositon = Re.formatPosition, t.util.hasTerrain = v.hasTerrain, t.util.getEllipsoidTerrain = v.getEllipsoidTerrain, t.util.getTerrainProvider = v.getTerrainProvider
    }, function (e, t) {}, function (e, t) {}, function (e, t, i) {
        "use strict";
        t.version = "1.9.5 end", t.update = "2020-2-5 22:00"
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.BaseWidget = void 0;
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            n = i(5),
            o = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(n),
            a = i(15),
            s = i(3),
            l = (function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                t.default = e
            }(s), i(36)),
            u = i(35),
            c = i(2),
            h = [];
        t.BaseWidget = a.Class.extend({
            viewer: null,
            options: {},
            config: {},
            path: "",
            isActivate: !1,
            isCreate: !1,
            initialize: function (e, t) {
                this.viewer = t, this.config = e, this.path = e.path || "", this.init()
            },
            addCacheVersion: function (e) {
                if (null == e) return e;
                var t = (0, u.getCacheVersion)();
                return t && (-1 == e.indexOf("?") ? e += "?time=" + t : -1 == e.indexOf("time=" + t) && (e += "&time=" + t)), e
            },
            activateBase: function () {
                var e = this;
                if (this.isActivate) return void this.changeWidgetView(function (e) {
                    e._dom && ((0, o.default)(".layui-layer").each(function () {
                        (0, o.default)(this).css("z-index", 19891e3)
                    }), (0, o.default)(e._dom).css("z-index", 19891014))
                });
                if (this.beforeActivate(), this.isActivate = !0, !this.isCreate) {
                    if (this.options.resources && this.options.resources.length > 0) {
                        for (var t = [], i = 0; i < this.options.resources.length; i++) {
                            var r = this.options.resources[i];
                            r = this._getUrl(r), -1 == h.indexOf(r) && t.push(r)
                        }
                        return h = h.concat(t), void l.Loader.async(t, function () {
                            if (!e.create(function () {
                                    e._createWidgetView(), e.isCreate = !0
                                })) {
                                if (e.config.createAtStart) return e.config.createAtStart = !1, e.isActivate = !1, void(e.isCreate = !0);
                                e._createWidgetView(), e.isCreate = !0
                            }
                        })
                    }
                    if (this.create(function () {
                            e._createWidgetView(), this.isCreate = !0
                        })) return;
                    if (e.config.createAtStart) return e.config.createAtStart = !1, e.isActivate = !1, void(e.isCreate = !0);
                    this.isCreate = !0
                }
                return this._createWidgetView(), this
            },
            _createWidgetView: function () {
                var e = this.options.view;
                if (void 0 === e || null === e) this._startActivate();
                else if ((0, c.isArray)(e)) {
                    this._viewcreate_allcount = e.length, this._viewcreate_okcount = 0;
                    for (var t = 0; t < e.length; t++) this.createItemView(e[t])
                } else this._viewcreate_allcount = 1, this._viewcreate_okcount = 0, this.createItemView(e)
            },
            changeWidgetView: function (e) {
                var t = this.options.view;
                if (void 0 === t || null === t) return !1;
                if ((0, c.isArray)(t)) {
                    for (var i = !1, r = 0; r < t.length; r++) i = i || e(t[r]);
                    return i
                }
                return e(t)
            },
            createItemView: function (e) {
                switch (e.type) {
                    default:
                    case "window":
                        this._openWindow(e);
                        break;
                    case "divwindow":
                        this._openDivWindow(e);
                        break;
                    case "append":
                        var t = this._getUrl(e.url),
                            i = this;
                        i.getHtml(t, function (t) {
                            i._appendView(e, t)
                        });
                        break;
                    case "custom":
                        var t = this._getUrl(e.url),
                            i = this;
                        e.open(t, function (t) {
                            i.winCreateOK(e, t), ++i._viewcreate_okcount >= i._viewcreate_allcount && i._startActivate(t)
                        }, this)
                }
            },
            _viewcreate_allcount: 0,
            _viewcreate_okcount: 0,
            _openWindow: function (e) {
                var t = this,
                    i = this._getUrl(e.url),
                    r = {
                        type: 2,
                        content: [i, "no"],
                        success: function (r) {
                            e._layerOpening = !1, e._dom = r;
                            var n = window[r.find("iframe")[0].name];
                            t.config.hasOwnProperty("visible") && !t.config.visible && (0, o.default)(r).hide(), layer.setTop(r), t.winCreateOK(e, n), t._viewcreate_okcount++, t._viewcreate_okcount >= t._viewcreate_allcount && t._startActivate(r), n && n.initWidgetView ? n.initWidgetView(t) : console.error(i + "页面没有定义function initWidgetView(widget)方法，无法初始化widget页面!")
                        }
                    };
                e._layerIdx, e._layerOpening = !0, e._layerIdx = layer.open(this._getWinOpt(e, r))
            },
            _openDivWindow: function (e) {
                var t = this._getUrl(e.url),
                    i = this;
                this.getHtml(t, function (t) {
                    var r = {
                        type: 1,
                        content: t,
                        success: function (t) {
                            e._layerOpening = !1, e._dom = t, i.config.hasOwnProperty("visible") && !i.config.visible && (0, o.default)(t).hide(), layer.setTop(t), i.winCreateOK(e, t), ++i._viewcreate_okcount >= i._viewcreate_allcount && i._startActivate(t)
                        }
                    };
                    e._layerOpening = !0, e._layerIdx = layer.open(i._getWinOpt(e, r))
                })
            },
            _getUrl: function (e) {
                return e = this.addCacheVersion(e), e.startsWith("/") || e.startsWith(".") || e.startsWith("http") ? e : this.path + e
            },
            _getWinOpt: function (e, t) {
                var i = (0, u.getDefWindowOptions)(),
                    r = o.default.extend(i, e.windowOptions);
                r = o.default.extend(r, this.config.windowOptions), e.windowOptions = r;
                var n = this,
                    a = this._getWinSize(r),
                    s = !1;
                r.noTitle || (s = this.config.name || " ", this.config.icon && (s = '<i class="' + this.config.icon + '" ></i>&nbsp;' + s));
                var l = {
                        title: s,
                        area: a.area,
                        offset: a.offset,
                        shade: 0,
                        maxmin: !1,
                        zIndex: layer.zIndex,
                        beforeEnd: function () {
                            n.beforeDisable()
                        },
                        end: function () {
                            e._layerIdx = -1, e._dom = null, n.disableBase(!0)
                        },
                        full: function (e) {
                            n.winFull(e)
                        },
                        min: function (e) {
                            n.winMin(e)
                        },
                        restore: function (e) {
                            n.winRestore(e)
                        }
                    },
                    c = o.default.extend(l, r);
                return o.default.extend(c, t || {})
            },
            _getWinSize: function (e) {
                var t = this.bfb2Number(e.width, document.documentElement.clientWidth, e),
                    i = this.bfb2Number(e.height, document.documentElement.clientHeight, e),
                    n = "",
                    o = e.position;
                if (o)
                    if ("string" == typeof o) n = o;
                    else if ("object" == (void 0 === o ? "undefined" : r(o))) {
                    var a, s;
                    if (o.hasOwnProperty("top") && null != o.top && (a = this.bfb2Number(o.top, document.documentElement.clientHeight, e)), o.hasOwnProperty("bottom") && null != o.bottom) {
                        e._hasresize = !0;
                        var l = this.bfb2Number(o.bottom, document.documentElement.clientHeight, e);
                        null != a ? i = document.documentElement.clientHeight - a - l : a = document.documentElement.clientHeight - i - l
                    }
                    if (o.hasOwnProperty("left") && null != o.left && (s = this.bfb2Number(o.left, document.documentElement.clientWidth, e)), o.hasOwnProperty("right") && null != o.right) {
                        e._hasresize = !0;
                        var u = this.bfb2Number(o.right, document.documentElement.clientWidth, e);
                        null != s ? t = document.documentElement.clientWidth - s - u : s = document.documentElement.clientWidth - t - u
                    }
                    null == a && (a = (document.documentElement.clientHeight - i) / 2), null == s && (s = (document.documentElement.clientWidth - t) / 2), n = [a + "px", s + "px"]
                }
                e.hasOwnProperty("minHeight") && i < e.minHeight && (e._hasresize = !0, i = e.minHeight), e.hasOwnProperty("maxHeight") && i > e.maxHeight && (e._hasresize = !0, i = e.maxHeight), e.hasOwnProperty("minHeight") && t < e.minWidth && (e._hasresize = !0, t = e.minWidth), e.hasOwnProperty("maxWidth") && t > e.maxWidth && (e._hasresize = !0, t = e.maxWidth);
                var c;
                return c = t && i ? [t + "px", i + "px"] : t + "px", {
                    area: c,
                    offset: n
                }
            },
            bfb2Number: function (e, t, i) {
                return "string" == typeof e && -1 != e.indexOf("%") ? (i._hasresize = !0, t * Number(e.replace("%", "")) / 100) : e
            },
            _appendView: function (e, t) {
                e._dom = (0, o.default)(t).appendTo(e.parent || "body"), this.winCreateOK(e, t), ++this._viewcreate_okcount >= this._viewcreate_allcount && this._startActivate(t)
            },
            disableBase: function (e) {
                if (this.isActivate) {
                    e || this.beforeDisable();
                    this.changeWidgetView(function (e) {
                        return null != e._layerIdx && -1 != e._layerIdx ? (e._layerOpening, layer.close(e._layerIdx), !0) : ("append" == e.type && e._dom && (e._dom.remove(), e._dom = null), "custom" == e.type && e.close && e.close(), !1)
                    }) || (this.disable(), this.isActivate = !1)
                }
            },
            setViewVisible: function (e) {
                this.changeWidgetView(function (t) {
                    null != t._layerIdx && -1 != t._layerIdx ? e ? (0, o.default)("#layui-layer" + t._layerIdx).show() : (0, o.default)("#layui-layer" + t._layerIdx).hide() : "append" == t.type && t._dom && (e ? (0, o.default)(t._dom).show() : (0, o.default)(t._dom).hide())
                })
            },
            setViewCss: function (e) {
                this.changeWidgetView(function (t) {
                    null != t._layerIdx && -1 != t._layerIdx ? (0, o.default)("#layui-layer" + t._layerIdx).css(e) : "append" == t.type && t._dom && (0, o.default)(t._dom).css(e)
                })
            },
            indexResize: function () {
                if (this.isActivate) {
                    var e = this;
                    this.changeWidgetView(function (t) {
                        if (null != t._layerIdx && -1 != t._layerIdx && null != t.windowOptions && t.windowOptions._hasresize) {
                            var i = e._getWinSize(t.windowOptions),
                                r = {};
                            (0, c.isArray)(i.area) && (i.area[0] && (r.width = i.area[0]), i.area[1] && (r.height = i.area[1])), (0, c.isArray)(i.offset) && (i.offset[1] && (r.top = i.offset[0]), i.offset[1] && (r.left = i.offset[1])), (0, o.default)(t._dom).attr("myTopLeft", !0), layer.style(t._layerIdx, r), "divwindow" == t.type && layer.iframeAuto(t._layerIdx)
                        }
                    })
                }
            },
            _startActivate: function (e) {
                this.activate(e), this.config.success && this.config.success(this), this.isActivate || this.disableBase()
            },
            init: function () {},
            create: function (e) {},
            beforeActivate: function () {},
            activate: function (e) {},
            beforeDisable: function () {},
            disable: function () {},
            winCreateOK: function (e, t) {},
            winFull: function () {},
            winMin: function () {},
            winRestore: function () {},
            getHtml: function (e, t) {
                o.default.ajax({
                    url: e,
                    type: "GET",
                    dataType: "html",
                    timeout: 0,
                    success: function (e) {
                        t(e)
                    }
                })
            }
        })
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.ExpandByMars = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = n.clone,
            a = n.Matrix4;
        t.ExpandByMars = {
            pbrMaterialsPow: 2.2,
            trustGenerator: ["fanfan", "cesiumlab"],
            _defaultFloodAnalysis: {
                floodVar: [0, 0, 0, 500],
                ym_pos_x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ym_pos_y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ym_pos_z: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                rect_flood: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                floodSpeed: 1,
                ym_max_index: 0,
                globe: !0,
                showElseArea: !0
            },
            floodAnalysis: {
                floodVar: [0, 0, 0, 500],
                ym_pos_x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ym_pos_y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ym_pos_z: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                rect_flood: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                floodSpeed: 1,
                ym_max_index: 0,
                globe: !0,
                showElseArea: !0
            },
            resetFloodAnalysis: function () {
                this.floodAnalysis = o(this._defaultFloodAnalysis)
            },
            _defaultExcavateAnalysis: {
                splitNum: 30,
                showSelfOnly: !1,
                dig_pos_x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                dig_pos_y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                dig_pos_z: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                rect_dig: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                dig_max_index: 0,
                excavateHeight: 0,
                excavateMinHeight: 9999,
                excavatePerPoint: !1
            },
            excavateAnalysis: {
                splitNum: 30,
                showSelfOnly: !1,
                dig_pos_x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                dig_pos_y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                dig_pos_z: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                rect_dig: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                dig_max_index: 0,
                excavateHeight: 0,
                excavateMinHeight: 9999,
                excavatePerPoint: !1
            },
            resetExcavateAnalysis: function () {
                this.excavateAnalysis = o(this._defaultExcavateAnalysis)
            },
            _defaultTilesEditor: {
                floodVar: [0, 0, 0, 0],
                IsYaPing: [!1, !1, !1, !1],
                modelLight: 2.2,
                b3dmOffset: void 0,
                editVar: [!1, !1, !1, !1],
                floodColor: [0, 0, 0, .5],
                heightVar: [0, 0]
            },
            tilesEditor: {
                floodVar: [0, 0, 0, 0],
                IsYaPing: [!1, !1, !1, !1],
                modelLight: 2.2,
                b3dmOffset: void 0,
                editVar: [!1, !1, !1, !1],
                floodColor: [0, 0, 0, .5],
                heightVar: [0, 0],
                enable: !0
            },
            resetTilesEditor: function () {
                var e = o(this.tilesEditor.enable);
                this.tilesEditor = o(this._defaultTilesEditor), this.tilesEditor.enable = e
            },
            underEarth: {
                cullFace: void 0,
                enable: void 0,
                enableDepth: 100,
                enableSkirt: !1
            },
            occlusionOpen: !0,
            ableTilesFbo: !1,
            mirror: {
                MirrorEnable: !1,
                MirrorProjectionMatrix: new a,
                MirrorViewMatrix: new a
            }
        }
    }, function (module, exports, __webpack_require__) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function createMap(e) {
            if (e.url) return _jquery2.default.ajax({
                type: "get",
                dataType: "json",
                url: e.url,
                timeout: 0,
                success: function (t) {
                    t.serverURL && (e.serverURL = t.serverURL);
                    var i = initMap(t.map3d, e);
                    e.success && e.success(i, t, t)
                },
                error: function (t, i, r) {
                    console.log(e.url + "文件加载失败！"), _util.alert(e.url + "文件加载失败！")
                }
            }), null;
            var t = initMap(e.data, e);
            return e.success && e.success(t, e.data), t
        }

        function initMap(e, t) {
            var i = t.id,
                r = {
                    animation: !1,
                    timeline: !1,
                    fullscreenButton: !0,
                    vrButton: !1,
                    geocoder: !1,
                    sceneModePicker: !1,
                    homeButton: !0,
                    navigationHelpButton: !0,
                    navigationInstructionsInitiallyVisible: !1,
                    infoBox: !0,
                    selectionIndicator: !1,
                    shouldAnimate: !0,
                    showRenderLoopErrors: !0,
                    baseLayerPicker: !1,
                    contextmenu: !0
                };
            for (var n in e) r[n] = e[n];
            if (r)
                for (var n in t) "id" !== n && "success" !== n && (r[n] = t[n]);
            Cesium.Ion && (Cesium.Ion.defaultAccessToken = r.ionToken || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjM5MjMxOS1lMWVkLTQyNDQtYTM4Yi0wZjA4ZDMxYTlmNDMiLCJpZCI6MTQ4MiwiaWF0IjoxNTI4Njc3NDQyfQ.vVoSexHMqQhKK5loNCv6gCA5d5_z3wE2M0l_rWnIP_w"), Cesium.AnimationViewModel.defaultTicks = r.animationTicks || [.1, .25, .5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600], !0 === r.geocoder && (r.geocoder = new _GaodePOIGeocoder.GaodePOIGeocoder(r.geocoderConfig));
            var o;
            o = r.terrain && r.terrain.visible ? getTerrainProvider(r.terrain, r.serverURL) : _layer.getEllipsoidTerrain(), r.terrainProvider = o;
            var a = !1;
            if (r.baseLayerPicker) {
                if (!r.imageryProviderViewModels && r.basemaps && r.basemaps.length > 0) {
                    var s = getImageryProviderArr(r.basemaps);
                    r.imageryProviderViewModels = s.imageryProviderViewModels, r.selectedImageryProviderViewModel = s.imageryProviderViewModels[s.index]
                }
                r.terrainProviderViewModels || (r.terrainProviderViewModels = getTerrainProviderViewModelsArr(r.terrain, r.serverURL), r.selectedTerrainProviderViewModel = r.terrainProviderViewModels[1])
            } else null == r.imageryProvider && (a = !0, r.imageryProvider = new Cesium.TileMapServiceImageryProvider({
                url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
            }));
            var l = new Cesium.Viewer(i, r);
            if (a)
                for (var u = l.imageryLayers, c = u.length, h = 0; h < c; h++) {
                    var d = u.get(0);
                    u.remove(d, !0)
                }
            return r.geocoder && (r.geocoder.viewer = l), delete r.geocoder, delete r.imageryProviderViewModels, delete r.selectedImageryProviderViewModel, delete r.terrainProviderViewModels, delete r.selectedTerrainProviderViewModel, delete r.terrainProvider, delete r.imageryProvider, l.wutu = new _ViewerEx.ViewerEx(l, r), l.wutu.terrainProvider = o, l.gisdata = {
                config: l.wutu.config
            }, l
        }

        function getTerrainProvider(e, t) {
            return e && e.url && (t && (e.url = e.url.replace("$serverURL$", t)), e.url = e.url.replace("$hostname$", location.hostname).replace("$host$", location.host)), _layer.getTerrainProvider(e)
        }

        function getImageryProviderArr(layersCfg) {
            var providerViewModels = [],
                selectedIndex = 0;
            window._temp_createImageryProvider = _layer.createImageryProvider;
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if ("group" != item.type || null != item.layers) {
                    item.visible && (selectedIndex = providerViewModels.length);
                    var funstr = "window._temp_mars_basemaps" + i + " = function () {                        var item = " + JSON.stringify(item) + ';                        if (item.type == "group") {                            var arrVec = [];                            for (var index = 0; index < item.layers.length; index++) {                                var temp = window._temp_createImageryProvider(item.layers[index]);                                if (temp == null) continue;                                arrVec.push(temp);                            }                            return arrVec;                        }                        else {                            return window._temp_createImageryProvider(item);                        }                     }';
                    eval(funstr);
                    var imgModel = new Cesium.ProviderViewModel({
                        name: item.name || "未命名",
                        tooltip: item.name || "未命名",
                        iconUrl: item.icon || "",
                        creationFunction: eval("window._temp_mars_basemaps" + i)
                    });
                    providerViewModels.push(imgModel)
                }
            }
            return {
                imageryProviderViewModels: providerViewModels,
                index: selectedIndex
            }
        }

        function getTerrainProviderViewModelsArr(e, t) {
            return [new Cesium.ProviderViewModel({
                name: "无地形",
                iconUrl: Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/Ellipsoid.png"),
                tooltip: "WGS84标准椭球，即 EPSG:4326",
                category: "",
                creationFunction: function () {
                    return _layer.getEllipsoidTerrain()
                }
            }), new Cesium.ProviderViewModel({
                name: "MarsGIS 中国地形",
                iconUrl: Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"),
                tooltip: "MarsGIS提供的高分辨率中国地形",
                category: "",
                creationFunction: function () {
                    return getTerrainProvider(e, t)
                }
            }), new Cesium.ProviderViewModel({
                name: "Cesium Ion 全球地形",
                iconUrl: Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"),
                tooltip: "Cesium官方Ion提供的高分辨率全球地形",
                category: "",
                creationFunction: function () {
                    return _layer.getTerrainProvider({
                        type: "ion"
                    })
                }
            }), new Cesium.ProviderViewModel({
                name: "ArcGIS 全球地形",
                iconUrl: Cesium.buildModuleUrl("Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"),
                tooltip: "arcgis官方提供的高分辨率全球地形",
                category: "",
                creationFunction: function () {
                    return _layer.getTerrainProvider({
                        type: "arcgis",
                        url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
                    })
                }
            })]
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.createMap = createMap;
        var _cesium = __webpack_require__(0),
            Cesium = _interopRequireWildcard(_cesium),
            _jquery = __webpack_require__(5),
            _jquery2 = _interopRequireDefault(_jquery),
            _util2 = __webpack_require__(2),
            _util = _interopRequireWildcard(_util2),
            _ViewerEx = __webpack_require__(37),
            _GaodePOIGeocoder = __webpack_require__(104),
            _layer2 = __webpack_require__(18),
            _layer = _interopRequireWildcard(_layer2)
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Evented = t.Events = void 0;
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            n = i(15),
            o = i(3),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = t.Events = {
                on: function (e, t, i) {
                    if ("object" === (void 0 === e ? "undefined" : r(e)))
                        for (var n in e) this._on(n, e[n], t);
                    else {
                        e = a.splitWords(e);
                        for (var o = 0, s = e.length; o < s; o++) this._on(e[o], t, i)
                    }
                    return this
                },
                off: function (e, t, i) {
                    if (e)
                        if ("object" === (void 0 === e ? "undefined" : r(e)))
                            for (var n in e) this._off(n, e[n], t);
                        else {
                            e = a.splitWords(e);
                            for (var o = 0, s = e.length; o < s; o++) this._off(e[o], t, i)
                        }
                    else delete this._events;
                    return this
                },
                _on: function (e, t, i) {
                    this._events = this._events || {};
                    var r = this._events[e];
                    r || (r = [], this._events[e] = r), i === this && (i = void 0);
                    for (var n = {
                            fn: t,
                            ctx: i
                        }, o = r, a = 0, s = o.length; a < s; a++)
                        if (o[a].fn === t && o[a].ctx === i) return;
                    o.push(n)
                },
                _off: function (e, t, i) {
                    var r, n, o;
                    if (this._events && (r = this._events[e])) {
                        if (!t) {
                            for (n = 0, o = r.length; n < o; n++) r[n].fn = a.falseFn;
                            return void delete this._events[e]
                        }
                        if (i === this && (i = void 0), r)
                            for (n = 0, o = r.length; n < o; n++) {
                                var s = r[n];
                                if (s.ctx === i && s.fn === t) return s.fn = a.falseFn, this._firingCount && (this._events[e] = r = r.slice()), void r.splice(n, 1)
                            }
                    }
                },
                fire: function (e, t, i) {
                    if (!this.listens(e, i)) return this;
                    var r = a.extend({}, t, {
                        type: e,
                        target: this,
                        sourceTarget: t && t.sourceTarget || this
                    });
                    if (this._events) {
                        var n = this._events[e];
                        if (n) {
                            this._firingCount = this._firingCount + 1 || 1;
                            for (var o = 0, s = n.length; o < s; o++) {
                                var l = n[o];
                                l.fn.call(l.ctx || this, r)
                            }
                            this._firingCount--
                        }
                    }
                    return i && this._propagateEvent(r), this
                },
                listens: function (e, t) {
                    var i = this._events && this._events[e];
                    if (i && i.length) return !0;
                    if (t)
                        for (var r in this._eventParents)
                            if (this._eventParents[r].listens(e, t)) return !0;
                    return !1
                },
                once: function (e, t, i) {
                    if ("object" === (void 0 === e ? "undefined" : r(e))) {
                        for (var n in e) this.once(n, e[n], t);
                        return this
                    }
                    var o = a.bind(function () {
                        this.off(e, t, i).off(e, o, i)
                    }, this);
                    return this.on(e, t, i).on(e, o, i)
                },
                addEventParent: function (e) {
                    return this._eventParents = this._eventParents || {}, this._eventParents[a.stamp(e)] = e, this
                },
                removeEventParent: function (e) {
                    return this._eventParents && delete this._eventParents[a.stamp(e)], this
                },
                _propagateEvent: function (e) {
                    for (var t in this._eventParents) this._eventParents[t].fire(e.type, a.extend({
                        layer: e.target,
                        propagatedFrom: e.target
                    }, e), !0)
                }
            };
        s.addEventListener = s.on, s.removeEventListener = s.clearAllEventListeners = s.off, s.addOneTimeEventListener = s.once, s.fireEvent = s.fire, s.hasEventListeners = s.listens;
        t.Evented = n.Class.extend(s)
    }, function (e, t) {
        e.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    vec2 st = repeat * materialInput.st;\r\n    vec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - time), st.t));\r\n    if(color.a == 0.0)\r\n    {\r\n        material.alpha = colorImage.a;\r\n        material.diffuse = colorImage.rgb; \r\n    }\r\n    else\r\n    {\r\n        material.alpha = colorImage.a * color.a;\r\n        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \r\n    }\r\n    return material;\r\n}"
    }, function (e, t) {
        e.exports = "//2个图片的叠加融合\r\nczm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\nczm_material material = czm_getDefaultMaterial(materialInput);\r\nvec2 st = repeat * materialInput.st;\r\nvec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - time), st.t));\r\nif(color.a == 0.0)\r\n{\r\n    material.alpha = colorImage.a;\r\n    material.diffuse = colorImage.rgb; \r\n}\r\nelse\r\n{\r\n    material.alpha = colorImage.a * color.a;\r\n    material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \r\n}\r\nvec4 colorBG = texture2D(image2,materialInput.st);\r\nif(colorBG.a>0.5){\r\n    material.diffuse = bgColor.rgb;\r\n}\r\nreturn material;\r\n}"
    }, function (e, t) {
        e.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    material.diffuse = 1.5 * color.rgb;\r\n    vec2 st = materialInput.st;\r\n    vec3 str = materialInput.str;\r\n    float dis = distance(st, vec2(0.5, 0.5));\r\n    float per = fract(time);\r\n    if(abs(str.z)>0.001){\r\n        discard;\r\n    }\r\n    if(dis >0.5){\r\n        discard;\r\n    }else {\r\n        float perDis = 0.5/count;\r\n        float disNum;\r\n        float bl = .0;\r\n        for(int i=0;i<=999;i++){\r\n            if(float(i)<=count){\r\n                disNum = perDis*float(i) - dis + per/count;\r\n                if(disNum>0.0){\r\n                    if(disNum<perDis){\r\n                        bl = 1.0-disNum/perDis;\r\n                    }\r\n                    else if(disNum-perDis<perDis){\r\n                        bl = 1.0 - abs(1.0-disNum/perDis);\r\n                    }\r\n                    material.alpha = pow(bl,gradient);\r\n                }\r\n            }\r\n        }\r\n    }\r\n    return material;\r\n}"
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.GroupLayer = void 0;
        var r = i(9),
            n = r.BaseLayer.extend({
                create: function () {
                    this._layers = this.config._layers;
                    for (var e = this._layers, t = 0, i = e.length; t < i; t++) this.hasOpacity = e[t].hasOpacity, this.hasZIndex = e[t].hasZIndex
                },
                setVisible: function (e) {
                    this._visible = e;
                    for (var t = this._layers, i = 0, r = t.length; i < r; i++) t[i].setVisible(e)
                },
                add: function () {
                    this._visible = !0;
                    for (var e = this._layers, t = 0, i = e.length; t < i; t++) e[t].setVisible(!0)
                },
                remove: function () {
                    this._visible = !1;
                    for (var e = this._layers, t = 0, i = e.length; t < i; t++) e[t].setVisible(!1)
                },
                centerAt: function (e) {
                    for (var t = this._layers, i = 0, r = t.length; i < r; i++) t[i].centerAt(e)
                },
                setOpacity: function (e) {
                    for (var t = this._layers, i = 0, r = t.length; i < r; i++) t[i].hasOpacity && t[i].setOpacity(e)
                }
            });
        t.GroupLayer = n
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.GraticuleLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(9),
            a = o.BaseLayer.extend({
                model: null,
                add: function () {
                    null == this.model && this.initData(), this.model.setVisible(!0)
                },
                remove: function () {
                    null != this.model && this.model.setVisible(!1)
                },
                initData: function () {
                    function e(e, t) {
                        e = e || {}, this._tilingScheme = e.tilingScheme || new n.GeographicTilingScheme, this._color = e.color || new n.Color(1, 1, 1, .4), this._tileWidth = e.tileWidth || 256, this._tileHeight = e.tileHeight || 256, this._ready = !0, this._sexagesimal = e.sexagesimal || !1, this._numLines = e.numLines || 50, this._scene = t, this._labels = new n.LabelCollection, t.primitives.add(this._labels), this._polylines = new n.PolylineCollection, t.primitives.add(this._polylines), this._ellipsoid = t.globe.ellipsoid;
                        var i = document.createElement("canvas");
                        i.width = 256, i.height = 256, this._canvas = i;
                        var r = this;
                        t.camera.moveEnd.addEventListener(function () {
                            r._show && (r._polylines.removeAll(), r._labels.removeAll(), r._currentExtent = null, r._drawGrid(r._getExtentView()))
                        }), t.imageryLayers.addImageryProvider(this)
                    }

                    function t(e) {
                        return e < .01 ? 2 : e < .1 ? 1 : 0
                    }
                    var i = function () {
                            try {
                                return "x" in Object.defineProperty({}, "x", {})
                            } catch (e) {
                                return !1
                            }
                        }(),
                        r = Object.defineProperties;
                    i && r || (r = function (e) {
                        return e
                    }), r(e.prototype, {
                        url: {
                            get: function () {}
                        },
                        proxy: {
                            get: function () {}
                        },
                        tileWidth: {
                            get: function () {
                                return this._tileWidth
                            }
                        },
                        tileHeight: {
                            get: function () {
                                return this._tileHeight
                            }
                        },
                        maximumLevel: {
                            get: function () {
                                return 18
                            }
                        },
                        minimumLevel: {
                            get: function () {
                                return 0
                            }
                        },
                        tilingScheme: {
                            get: function () {
                                return this._tilingScheme
                            }
                        },
                        rectangle: {
                            get: function () {
                                return this._tilingScheme.rectangle
                            }
                        },
                        tileDiscardPolicy: {
                            get: function () {}
                        },
                        errorEvent: {
                            get: function () {
                                return this._errorEvent
                            }
                        },
                        ready: {
                            get: function () {
                                return this._ready
                            }
                        },
                        credit: {
                            get: function () {
                                return this._credit
                            }
                        },
                        hasAlphaChannel: {
                            get: function () {
                                return !0
                            }
                        }
                    }), e.prototype.makeLabel = function (e, t, i, r, o) {
                        this._labels.add({
                            position: this._ellipsoid.cartographicToCartesian(new n.Cartographic(e, t, 10)),
                            text: i,
                            font: "normal small-caps normal 16px 楷体",
                            style: n.LabelStyle.FILL_AND_OUTLINE,
                            fillColor: n.Color.AZURE,
                            outlineColor: n.Color.BLACK,
                            outlineWidth: 2,
                            pixelOffset: new n.Cartesian2(5, r ? 5 : -5),
                            eyeOffset: n.Cartesian3.ZERO,
                            horizontalOrigin: n.HorizontalOrigin.LEFT,
                            verticalOrigin: r ? n.VerticalOrigin.BOTTOM : n.VerticalOrigin.TOP,
                            scale: 1
                        })
                    }, e.prototype._drawGrid = function (e) {
                        if (!this._currentExtent || !this._currentExtent.equals(e)) {
                            this._currentExtent = e, this._polylines.removeAll(), this._labels.removeAll();
                            var i, r = (this._canvasSize, 0),
                                a = 0;
                            for (i = 0; i < o.length && r < (e.north - e.south) / 10; i++) r = o[i];
                            for (i = 0; i < o.length && a < (e.east - e.west) / 10; i++) a = o[i];
                            var s = (e.west < 0 ? Math.ceil(e.west / a) : Math.floor(e.west / a)) * a,
                                l = (e.south < 0 ? Math.ceil(e.south / r) : Math.floor(e.south / r)) * r,
                                u = (e.east < 0 ? Math.ceil(e.east / r) : Math.floor(e.east / r)) * r,
                                c = (e.north < 0 ? Math.ceil(e.north / a) : Math.floor(e.north / a)) * a;
                            s = Math.max(s - 2 * a, -Math.PI), u = Math.min(u + 2 * a, Math.PI), l = Math.max(l - 2 * r, -Math.PI / 2), c = Math.min(c + 2 * a, Math.PI / 2);
                            var h, d, f = this._ellipsoid,
                                p = n.Math.toRadians(1),
                                m = l + Math.floor((c - l) / r / 2) * r;
                            for (d = s; d < u; d += a) {
                                var g = [];
                                for (h = l; h < c; h += p) g.push(new n.Cartographic(d, h));
                                g.push(new n.Cartographic(d, c)), this._polylines.add({
                                    positions: f.cartographicArrayToCartesianArray(g),
                                    width: 1
                                });
                                var v = n.Math.toDegrees(d);
                                this.makeLabel(d, m, this._sexagesimal ? this._decToSex(v) : v.toFixed(t(a)), !1)
                            }
                            var y = s + Math.floor((u - s) / a / 2) * a;
                            for (h = l; h < c; h += r) {
                                var g = [];
                                for (d = s; d < u; d += p) g.push(new n.Cartographic(d, h));
                                g.push(new n.Cartographic(u, h)), this._polylines.add({
                                    positions: f.cartographicArrayToCartesianArray(g),
                                    width: 1
                                });
                                var _ = n.Math.toDegrees(h);
                                this.makeLabel(y, h, this._sexagesimal ? this._decToSex(_) : _.toFixed(t(r)), !0)
                            }
                        }
                    }, e.prototype.requestImage = function (e, t, i) {
                        return this._show && this._drawGrid(this._getExtentView()), this._canvas
                    }, e.prototype.setVisible = function (e) {
                        this._show = e, e ? (this._currentExtent = null, this._drawGrid(this._getExtentView())) : (this._polylines.removeAll(), this._labels.removeAll())
                    }, e.prototype.isVisible = function () {
                        return this._show
                    }, e.prototype._decToSex = function (e) {
                        var t = Math.floor(e),
                            i = (60 * (Math.abs(e) - t)).toFixed(2);
                        return "60.00" == i && (t += 1, i = "0.00"), [t, ":", i].join("")
                    }, e.prototype._getExtentView = function () {
                        for (var e = this._scene.camera, t = this._scene.canvas, i = [e.pickEllipsoid(new n.Cartesian2(0, 0), this._ellipsoid), e.pickEllipsoid(new n.Cartesian2(t.width, 0), this._ellipsoid), e.pickEllipsoid(new n.Cartesian2(0, t.height), this._ellipsoid), e.pickEllipsoid(new n.Cartesian2(t.width, t.height), this._ellipsoid)], r = 0; r < 4; r++)
                            if (void 0 === i[r]) return n.Rectangle.MAX_VALUE;
                        return n.Rectangle.fromCartographicArray(this._ellipsoid.cartesianArrayToCartographicArray(i))
                    };
                    var o = [n.Math.toRadians(.05), n.Math.toRadians(.1), n.Math.toRadians(.2), n.Math.toRadians(.5), n.Math.toRadians(1), n.Math.toRadians(2), n.Math.toRadians(5), n.Math.toRadians(10)];
                    this.model = new e({
                        numLines: 10
                    }, this.viewer.scene)
                }
            });
        t.GraticuleLayer = a
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.FeatureGridLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(45),
            a = o.TileLayer.extend({
                dataSource: null,
                hasOpacity: !1,
                create: function () {
                    this.dataSource = new n.CustomDataSource, this.primitives = new n.PrimitiveCollection;
                    var e = this;
                    this.config.type_new = "custom_featuregrid", this.config.addImageryCache = function (t) {
                        return e._addImageryCache(t)
                    }, this.config.removeImageryCache = function (t) {
                        return e._removeImageryCache(t)
                    }, this.config.removeAllImageryCache = function (t) {
                        return e._removeAllImageryCache(t)
                    }
                },
                getLength: function () {
                    return this.primitives.length + this.dataSource.entities.values.length
                },
                addEx: function () {
                    this.viewer.dataSources.add(this.dataSource), this.viewer.scene.primitives.add(this.primitives)
                },
                removeEx: function () {
                    this.viewer.dataSources.remove(this.dataSource), this.viewer.scene.primitives.remove(this.primitives)
                },
                _addImageryCache: function (e) {},
                _removeImageryCache: function (e) {},
                _removeAllImageryCache: function () {}
            });
        t.FeatureGridLayer = a
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.POILayer = void 0;
        var n = i(0),
            o = r(n),
            a = i(5),
            s = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(a),
            l = i(25),
            u = r(l),
            c = i(32),
            h = i(29),
            d = i(21),
            f = i(8),
            p = c.CustomFeatureGridLayer.extend({
                _keys: null,
                _key_index: 0,
                getKey: function () {
                    this._keys || (this._keys = this.config.key || ["c95467d0ed2a3755836e37dc27369f97", "4320dda936d909d73ab438b4e29cf2a2", "e64a96ed7e361cbdc0ebaeaf3818c564", "df3247b7df64434adecb876da94755d7", "d4375ec477cb0a473c448fb1f83be781", "13fdd7b2b90a9d326ae96867ebcc34ce", "c34502450ae556f42b21760faf6695a0", "57f8ebe12797a73fc5b87f5d4ef859b1"]);
                    var e = this._key_index++ % this._keys.length;
                    return this._keys[e]
                },
                getDataForGrid: function (e, t) {
                    var i = u.wgs2gcj([e.rectangle.xmin, e.rectangle.ymax]),
                        r = u.wgs2gcj([e.rectangle.xmax, e.rectangle.ymin]),
                        n = i[0] + "," + i[1] + "|" + r[0] + "," + r[1],
                        o = this.config.filter || {};
                    o.output = "json", o.key = this.getKey(), o.polygon = n, o.offset || (o.offset = 25), o.types || (o.types = "120000|130000|190000");
                    s.default.ajax({
                        url: "http://restapi.amap.com/v3/place/polygon",
                        type: "get",
                        dataType: "json",
                        timeout: "5000",
                        data: o,
                        success: function (e) {
                            if ("10000" !== e.infocode) return void console.log("POI 请求失败(" + e.infocode + ")：" + e.info);
                            var i = e.pois;
                            t(i)
                        },
                        error: function (e) {
                            console.log("POI 请求出错(" + e.status + ")：" + e.statusText)
                        }
                    })
                },
                createEntity: function (e, t) {
                    var i = "<div>名称：" + t.name + "</div><div>地址：" + t.address + "</div><div>区域：" + t.pname + t.cityname + t.adname + "</div><div>类别：" + t.type + "</div>",
                        r = t.location.split(",");
                    r = u.gcj2wgs(r);
                    var n = this.viewer.wutu.point2map({
                            x: r[0],
                            y: r[1]
                        }),
                        a = {
                            name: t.name,
                            position: o.Cartesian3.fromDegrees(n.x, n.y, this.config.height || 3),
                            popup: {
                                html: i,
                                anchor: [0, -15]
                            },
                            properties: t
                        },
                        l = this.config.symbol;
                    if (l) {
                        var c = l.styleOptions;
                        if (l.styleField) {
                            var p = attr[l.styleField],
                                m = l.styleFieldOptions[p];
                            null != m && (c = s.default.extend({}, c), c = s.default.extend(c, m))
                        }
                        c = c || {}, c.image ? (a.billboard = (0, d.style2Entity)(c), a.billboard.heightReference = o.HeightReference.RELATIVE_TO_GROUND) : a.point = (0, h.style2Entity)(c), c.label && (a.label = (0, f.style2Entity)(c.label), a.label.heightReference = o.HeightReference.RELATIVE_TO_GROUND, a.label.text = t.name)
                    } else a.point = {
                        color: new o.Color.fromCssColorString("#3388ff"),
                        pixelSize: 10,
                        outlineColor: new o.Color.fromCssColorString("#ffffff"),
                        outlineWidth: 2,
                        heightReference: o.HeightReference.RELATIVE_TO_GROUND,
                        scaleByDistance: new o.NearFarScalar(1e3, 1, 2e4, .5)
                    }, a.label = {
                        text: t.name,
                        font: "normal small-caps normal 16px 楷体",
                        style: o.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: o.Color.AZURE,
                        outlineColor: o.Color.BLACK,
                        outlineWidth: 2,
                        horizontalOrigin: o.HorizontalOrigin.CENTER,
                        verticalOrigin: o.VerticalOrigin.BOTTOM,
                        pixelOffset: new o.Cartesian2(0, -15),
                        heightReference: o.HeightReference.RELATIVE_TO_GROUND,
                        scaleByDistance: new o.NearFarScalar(1e3, 1, 5e3, .8),
                        distanceDisplayCondition: new o.DistanceDisplayCondition(0, 5e3)
                    };
                    return this.dataSource.entities.add(a)
                }
            });
        t.POILayer = p
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.WFSLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(5),
            a = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(o),
            s = i(32),
            l = s.CustomFeatureGridLayer.extend({
                getDataForGrid: function (e, t) {
                    var i = this,
                        r = {
                            service: "WFS",
                            request: "GetFeature",
                            typeName: this.config.layer || this.config.typeName,
                            version: "1.0.0",
                            outputFormat: "application/json",
                            bbox: e.rectangle.xmin + "," + e.rectangle.ymin + "," + e.rectangle.xmax + "," + e.rectangle.ymax
                        };
                    if (n.defined(this.config.parameters))
                        for (var o in this.config.parameters) r[o] = this.config.parameters[o];
                    a.default.ajax({
                        url: this.config.url,
                        type: "get",
                        data: r,
                        success: function (r) {
                            i._visible && i._cacheGrid[e.key] && void 0 != r && null != r && ("Feature" == r.type && (r = {
                                type: "FeatureCollection",
                                features: [r]
                            }), t(r.features))
                        },
                        error: function (e) {
                            console.log("请求出错(" + e.status + ")：" + e.statusText)
                        }
                    })
                },
                createEntity: function (e, t, i) {
                    var r = this;
                    return n.GeoJsonDataSource.load(t, {
                        clampToGround: !0
                    }).then(function (t) {
                        if (!r.checkHasBreak[e.key]) {
                            if (0 == t.entities.values.length) return null;
                            var n = t.entities.values[0];
                            n._id = r.config.id + "_" + e.key + "_" + n.id, r._addEntity(n, i)
                        }
                    }).otherwise(function (e) {
                        r.showError("服务出错", e)
                    }), null
                },
                _addEntity: function (e, t) {
                    var i = this.config.symbol;
                    i && ("function" == typeof i ? i(e, e.properties) : "default" == i ? this.setDefSymbol(e) : this.setConfigSymbol(e, i)), this.bindMourseEvnet(e), this.dataSource.entities.contains(e) || this.dataSource.entities.add(e), t(e)
                }
            });
        t.WFSLayer = l
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.GltfLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(9),
            a = o.BaseLayer.extend({
                model: null,
                add: function () {
                    this.model ? this.viewer.entities.add(this.model) : this.initData()
                },
                remove: function () {
                    this.viewer.entities.remove(this.model)
                },
                centerAt: function (e) {
                    if (null != this.model)
                        if (this.config.extent || this.config.center) this.viewer.wutu.centerAt(this.config.extent || this.config.center, {
                            duration: e,
                            isWgs84: !0
                        });
                        else {
                            var t = this.config.position;
                            this.viewer.wutu.centerAt(t, {
                                duration: e,
                                isWgs84: !0
                            })
                        }
                },
                initData: function () {
                    var e = this.config.position;
                    e = this.viewer.wutu.point2map(e);
                    var t = n.Cartesian3.fromDegrees(e.x, e.y, e.z || 0),
                        i = n.Math.toRadians(e.heading || 0),
                        r = n.Math.toRadians(e.pitch || 0),
                        o = n.Math.toRadians(e.roll || 0),
                        a = new n.HeadingPitchRoll(i, r, o),
                        s = n.Transforms.headingPitchRollQuaternion(t, a),
                        l = {
                            uri: this.config.url
                        };
                    for (var u in this.config) "url" != u && "name" != u && "position" != u && "center" != u && "tooltip" != u && "popup" != u && (l[u] = this.config[u]);
                    this.model = this.viewer.entities.add({
                        name: this.config.name,
                        position: t,
                        orientation: s,
                        model: l,
                        _config: this.config,
                        tooltip: this.config.tooltip,
                        popup: this.config.popup
                    })
                },
                hasOpacity: !0,
                setOpacity: function (e) {
                    null != this.model && (this.model.model.color = new n.Color.fromCssColorString("#FFFFFF").withAlpha(e))
                }
            });
        t.GltfLayer = a
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Tiles3dLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(9),
            a = i(2),
            s = i(26),
            l = i(1),
            u = o.BaseLayer.extend({
                model: null,
                originalCenter: null,
                positionCenter: null,
                boundingSphere: null,
                add: function () {
                    this.model ? this.viewer.scene.primitives.contains(this.model) || this.viewer.scene.primitives.add(this.model) : this.initData()
                },
                remove: function () {
                    n.defined(this.config.visibleDistanceMax) && this.viewer.scene.camera.changed.removeEventListener(this.updateVisibleDistance, this), this.viewer.scene.primitives.contains(this.model) && this.viewer.scene.primitives.remove(this.model), delete this.model, delete this.boundingSphere
                },
                centerAt: function (e) {
                    this.config.extent || this.config.center ? this.viewer.wutu.centerAt(this.config.extent || this.config.center, {
                        duration: e,
                        isWgs84: !0
                    }) : this.boundingSphere && this.viewer.camera.flyToBoundingSphere(this.boundingSphere, {
                        offset: new n.HeadingPitchRange(0, -.5, 2 * this.boundingSphere.radius),
                        duration: e
                    })
                },
                initData: function () {
                    this.config.maximumScreenSpaceError = this.config.maximumScreenSpaceError || 2, this.config.maximumMemoryUsage = this.config.maximumMemoryUsage || 2048, this.model = this.viewer.scene.primitives.add(new n.Cesium3DTileset((0, a.getProxyUrl)(this.config))), this.model._config = this.config;
                    for (var e in this.config)
                        if ("url" != e && "type" != e && "style" != e && "classificationType" != e) try {
                            this.model[e] = this.config[e]
                        } catch (e) {}
                    this.config.style && (this.model.style = new n.Cesium3DTileStyle(this.config.style));
                    var t = this;
                    this.model.readyPromise.then(function (e) {
                        t.readyPromise && t.readyPromise(e), t.hasOpacity && 1 != t._opacity && t.setOpacity(t._opacity);
                        var i = e.boundingSphere;
                        t.boundingSphere = i, e._root && e._root.transform && (t.orginMatrixInverse = n.Matrix4.inverse(n.Matrix4.fromArray(e._root.transform), new n.Matrix4), t.config.scale > 0 && 1 != t.config.scale && (e._root.transform = n.Matrix4.multiplyByUniformScale(e._root.transform, t.config.scale, e._root.transform)));
                        var r = i.center;
                        t.positionCenter = r;
                        var o = n.Cartographic.fromCartesian(r),
                            a = Number(o.height.toFixed(2)),
                            s = Number(n.Math.toDegrees(o.longitude).toFixed(6)),
                            l = Number(n.Math.toDegrees(o.latitude).toFixed(6));
                        t.originalCenter = {
                            x: s,
                            y: l,
                            z: a
                        }, console.log((t.config.name || "") + " 模型原始位置:" + JSON.stringify(t.originalCenter));
                        var u = t.viewer.wutu.point2map(t.originalCenter);
                        if (u.x != t.originalCenter.x || u.y != t.originalCenter.y || null != t.config.offset) {
                            t.config.offset = t.config.offset || {}, t.config.offset.x && t.config.offset.y && (t.config.offset = t.viewer.wutu.point2map(t.config.offset));
                            var c = {
                                x: t.config.offset.x || u.x,
                                y: t.config.offset.y || u.y,
                                z: t.config.offset.z || 0,
                                heading: t.config.offset.heading,
                                axis: t.config.axis,
                                scale: t.config.scale,
                                transform: t.config.offset.hasOwnProperty("transform") ? t.config.offset.transform : null != t.config.offset.heading
                            };
                            "-height" == t.config.offset.z ? (c.z = 5 - a, t.updateMatrix(c)) : "auto" == t.config.offset.z ? t.autoHeight(r, c) : t.updateMatrix(c)
                        }!t.viewer.wutu.isFlyAnimation() && t.config.flyTo && t.centerAt(0), t.config.calback && t.config.calback(e), n.defined(t.config.visibleDistanceMax) && t.bindVisibleDistance()
                    })
                },
                autoHeight: function (e, t) {
                    var i = this;
                    (0, l.terrainPolyline)({
                        viewer: this.viewer,
                        positions: [e, e],
                        calback: function (e, r) {
                            if (null != e && 0 != e.length && !r) {
                                var n = (0, l.formatPosition)(e[0]),
                                    o = n.z - i.originalCenter.z + 1;
                                t.z = o, i.updateMatrix(t)
                            }
                        }
                    })
                },
                updateMatrix: function (e) {
                    null != this.model && (console.log((this.config.name || "") + " 模型修改后位置:" + JSON.stringify(e)), this.positionCenter = n.Cartesian3.fromDegrees(e.x, e.y, e.z), (0, s.updateMatrix)(this.model, e))
                },
                hasOpacity: !0,
                setOpacity: function (e) {
                    this._opacity = e, this.config.onSetOpacity ? this.config.onSetOpacity(e) : this.model && (this.model.style = new n.Cesium3DTileStyle({
                        color: "color() *vec4(1,1,1," + e + ")"
                    }))
                },
                showClickFeature: function (e) {
                    this.model ? this.model._config.showClickFeature = e : this.config.showClickFeature = e
                },
                bindVisibleDistance: function () {
                    this.viewer.scene.camera.changed.addEventListener(this.updateVisibleDistance, this)
                },
                updateVisibleDistance: function () {
                    if (this._visible && this.viewer.scene.mode === n.SceneMode.SCENE3D && this.model && this.boundingSphere && this.positionCenter) {
                        var e = n.Cartesian3.distance(this.positionCenter, this.viewer.camera.position);
                        if (e > this.config.visibleDistanceMax + 1e5) this.model.show = !1;
                        else {
                            var t = (0, l.pickCenterPoint)(this.viewer.scene);
                            if (n.defined(t)) {
                                var e = n.Cartesian3.distance(t, this.viewer.camera.position);
                                this.model.show = e < this.config.visibleDistanceMax
                            } else this.model.show = !0
                        }
                    }
                }
            });
        t.Tiles3dLayer = u
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.KmlLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(33),
            a = i(2),
            s = o.GeoJsonLayer.extend({
                queryData: function () {
                    var e = this,
                        t = (0, a.getProxyUrl)(this.config);
                    if (t.symbol && t.symbol.styleOptions) {
                        var i = t.symbol.styleOptions;
                        n.defined(i.clampToGround) && (t.clampToGround = i.clampToGround)
                    }
                    n.KmlDataSource.load(t.url, {
                        camera: this.viewer.scene.camera,
                        canvas: this.viewer.scene.canvas,
                        clampToGround: t.clampToGround
                    }).then(function (t) {
                        e.showResult(t)
                    }).otherwise(function (t) {
                        e.showError("服务出错", t)
                    })
                },
                getEntityAttr: function (e) {
                    var t = {
                            name: e.name,
                            description: e.description
                        },
                        i = e._kml.extendedData;
                    for (var r in i) t[r] = i[r].value;
                    return t = (0, a.getAttrVal)(t), t.description && (t.description = t.description.replace(/<div[^>]+>/g, "")), t
                }
            });
        t.KmlLayer = s
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.CzmlLayer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(33),
            a = i(2),
            s = o.GeoJsonLayer.extend({
                queryData: function () {
                    var e = this,
                        t = (0, a.getProxyUrl)(this.config);
                    n.CzmlDataSource.load(t.url, t).then(function (t) {
                        e.showResult(t)
                    }).otherwise(function (t) {
                        e.showError("服务出错", t)
                    })
                },
                getEntityAttr: function (e) {
                    if (e.description && e.description.getValue) return e.description.getValue(this.viewer.clock.currentTime)
                }
            });
        t.CzmlLayer = s
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TerrainLayer = void 0;
        var r = i(0),
            n = (function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                t.default = e
            }(r), i(9)),
            o = i(18),
            a = n.BaseLayer.extend({
                terrain: null,
                add: function () {
                    this.terrain || (this.terrain = (0, o.getTerrainProvider)(this.config)), this.viewer.terrainProvider = this.terrain
                },
                remove: function () {
                    this.viewer.terrainProvider = (0, o.getEllipsoidTerrain)()
                }
            });
        t.TerrainLayer = a
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawLayer = void 0;
        var r = i(0),
            n = (function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                t.default = e
            }(r), i(5)),
            o = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(n),
            a = i(9),
            s = i(16),
            l = i(2),
            u = a.BaseLayer.extend({
                create: function () {
                    this.drawControl = new s.Draw(this.viewer, {
                        hasEdit: !1,
                        nameTooltip: !1,
                        removeScreenSpaceEvent: !1
                    })
                },
                add: function () {
                    this._isload ? this.drawControl.setVisible(!0) : this._loadData()
                },
                remove: function () {
                    this.drawControl.setVisible(!1)
                },
                centerAt: function (e) {
                    var t = this.drawControl.getEntitys();
                    this.viewer.flyTo(t, {
                        duration: e
                    })
                },
                hasOpacity: !1,
                setOpacity: function (e) {},
                _loadData: function () {
                    var e = this;
                    o.default.ajax({
                        type: "get",
                        dataType: "json",
                        url: this.config.url,
                        timeout: 1e4,
                        success: function (t) {
                            e._isload = !0;
                            var i = e.drawControl.jsonToEntity(t, !0, e.config.flyTo);
                            e._bindEntityConfig(i)
                        },
                        error: function (t, i, r) {
                            console.log("Json文件" + e.config.url + "加载失败！")
                        }
                    })
                },
                _bindEntityConfig: function (e) {
                    for (var t = this, i = 0, r = e.length; i < r; i++) {
                        var n = e[i];
                        (this.config.columns || this.config.popup) && (n.popup = {
                            html: function (e) {
                                var i = e.attribute.attr;
                                return i.layer_name = t.config.name, i.draw_type = e.attribute.type, i.draw_typename = e.attribute.name, (0, l.getPopupForConfig)(t.config, i)
                            },
                            anchor: this.config.popupAnchor || [0, -15]
                        }), this.config.tooltip && (n.tooltip = {
                            html: function (e) {
                                var i = e.attribute.attr;
                                return i.layer_name = t.config.name, i.draw_type = e.attribute.type, i.draw_typename = e.attribute.name, (0, l.getPopupForConfig)({
                                    popup: t.config.tooltip
                                }, i)
                            },
                            anchor: this.config.tooltipAnchor || [0, -15]
                        }), this.config.click && (n.click = this.config.click), this.config.mouseover && (n.mouseover = this.config.mouseover), this.config.mouseout && (n.mouseout = this.config.mouseout)
                    }
                }
            });
        t.DrawLayer = u
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            var t = e.url;
            if (o.defined(e.layer)) switch (e.layer) {
                case "vec":
                    t = "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=" + (e.bigfont ? "ph" : "pl") + "&scaler=1&p=1";
                    break;
                case "img_d":
                    t = "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46";
                    break;
                case "img_z":
                    t = "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=" + (e.bigfont ? "sh" : "sl") + "&v=020";
                    break;
                case "custom":
                    e.customid = e.customid || "midnight", t = "http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=" + e.customid;
                    break;
                case "time":
                    t = "http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=" + (new Date).getTime() + "&label=web2D&v=017"
            }
            this._url = t, this._tileWidth = 256, this._tileHeight = 256, this._maximumLevel = 18;
            var i = new o.Cartesian2(-s, -a),
                r = new o.Cartesian2(s, a);
            this._tilingScheme = new o.WebMercatorTilingScheme({
                rectangleSouthwestInMeters: i,
                rectangleNortheastInMeters: r
            }), this._credit = void 0, this._rectangle = this._tilingScheme.rectangle, this._ready = !0
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.BaiduImageryProvider = void 0;
        var n = i(0),
            o = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(n),
            a = 33746824,
            s = 33554054;
        o.defineProperties(r.prototype, {
            url: {
                get: function () {
                    return this._url
                }
            },
            token: {
                get: function () {
                    return this._token
                }
            },
            proxy: {
                get: function () {
                    return this._proxy
                }
            },
            tileWidth: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tileWidth must not be called before the imagery provider is ready.");
                    return this._tileWidth
                }
            },
            tileHeight: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tileHeight must not be called before the imagery provider is ready.");
                    return this._tileHeight
                }
            },
            maximumLevel: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("maximumLevel must not be called before the imagery provider is ready.");
                    return this._maximumLevel
                }
            },
            minimumLevel: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("minimumLevel must not be called before the imagery provider is ready.");
                    return 0
                }
            },
            tilingScheme: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tilingScheme must not be called before the imagery provider is ready.");
                    return this._tilingScheme
                }
            },
            rectangle: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("rectangle must not be called before the imagery provider is ready.");
                    return this._rectangle
                }
            },
            tileDiscardPolicy: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tileDiscardPolicy must not be called before the imagery provider is ready.");
                    return this._tileDiscardPolicy
                }
            },
            errorEvent: {
                get: function () {
                    return this._errorEvent
                }
            },
            ready: {
                get: function () {
                    return this._ready
                }
            },
            readyPromise: {
                get: function () {
                    return this._readyPromise.promise
                }
            },
            credit: {
                get: function () {
                    return this._credit
                }
            },
            usingPrecachedTiles: {
                get: function () {
                    return this._useTiles
                }
            },
            hasAlphaChannel: {
                get: function () {
                    return !0
                }
            },
            layers: {
                get: function () {
                    return this._layers
                }
            }
        }), r.prototype.getTileCredits = function (e, t, i) {}, r.prototype.requestImage = function (e, t, i) {
            if (!this._ready) throw new DeveloperError("requestImage must not be called before the imagery provider is ready.");
            var r = this._tilingScheme.getNumberOfXTilesAtLevel(i),
                n = this._tilingScheme.getNumberOfYTilesAtLevel(i),
                a = this._url.replace("{x}", e - r / 2).replace("{y}", n / 2 - t - 1).replace("{z}", i).replace("{s}", Math.floor(10 * Math.random()));
            return o.ImageryProvider.loadImage(this, a)
        }, t.BaiduImageryProvider = r
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e = o.defaultValue(e, o.defaultValue.EMPTY_OBJECT), this.options = e, this._tileWidth = o.defaultValue(e.tileWidth, 256), this._tileHeight = o.defaultValue(e.tileHeight, 256), this._minimumLevel = o.defaultValue(e.minimumLevel, 0), this._maximumLevel = e.maximumLevel, e.rectangle && e.rectangle.xmin && e.rectangle.xmax && e.rectangle.ymin && e.rectangle.ymax) {
                var t = e.rectangle.xmin,
                    i = e.rectangle.xmax,
                    r = e.rectangle.ymin,
                    n = e.rectangle.ymax;
                e.rectangle = o.Rectangle.fromDegrees(t, r, i, n)
            }
            this._tilingScheme = o.defaultValue(e.tilingScheme, new o.GeographicTilingScheme({
                ellipsoid: e.ellipsoid
            })), this._rectangle = o.defaultValue(e.rectangle, this._tilingScheme.rectangle), this._rectangle = o.Rectangle.intersection(this._rectangle, this._tilingScheme.rectangle), this._hasAlphaChannel = o.defaultValue(e.hasAlphaChannel, !0), this._errorEvent = new o.Event, this._readyPromise = o.when.resolve(!0), this._credit = void 0, this._ready = !0
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.FeatureGridImageryProvider = void 0;
        var n = i(0),
            o = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(n);
        o.defineProperties(r.prototype, {
            url: {
                get: function () {
                    return this._url
                }
            },
            token: {
                get: function () {
                    return this._token
                }
            },
            proxy: {
                get: function () {
                    return this._proxy
                }
            },
            tileWidth: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tileWidth must not be called before the imagery provider is ready.");
                    return this._tileWidth
                }
            },
            tileHeight: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tileHeight must not be called before the imagery provider is ready.");
                    return this._tileHeight
                }
            },
            maximumLevel: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("maximumLevel must not be called before the imagery provider is ready.");
                    return this._maximumLevel
                }
            },
            minimumLevel: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("minimumLevel must not be called before the imagery provider is ready.");
                    return 0
                }
            },
            tilingScheme: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tilingScheme must not be called before the imagery provider is ready.");
                    return this._tilingScheme
                }
            },
            rectangle: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("rectangle must not be called before the imagery provider is ready.");
                    return this._rectangle
                }
            },
            tileDiscardPolicy: {
                get: function () {
                    if (!this._ready) throw new DeveloperError("tileDiscardPolicy must not be called before the imagery provider is ready.");
                    return this._tileDiscardPolicy
                }
            },
            errorEvent: {
                get: function () {
                    return this._errorEvent
                }
            },
            ready: {
                get: function () {
                    return this._ready
                }
            },
            readyPromise: {
                get: function () {
                    return this._readyPromise.promise
                }
            },
            credit: {
                get: function () {
                    return this._credit
                }
            },
            usingPrecachedTiles: {
                get: function () {
                    return this._useTiles
                }
            },
            hasAlphaChannel: {
                get: function () {
                    return !0
                }
            },
            layers: {
                get: function () {
                    return this._layers
                }
            }
        }), r.prototype.getTileCredits = function (e, t, i) {}, r.prototype.requestImage = function (e, t, i) {
            var r = document.createElement("canvas");
            if (r.width = 256, r.height = 256, i < this._minimumLevel) return r;
            if (this.options.debuggerTileInfo) {
                var n = r.getContext("2d");
                n.strokeStyle = "#ffff00", n.lineWidth = 2, n.strokeRect(1, 1, 255, 255);
                var o = "L" + i + "X" + e + "Y" + t;
                n.font = "bold 25px Arial", n.textAlign = "center", n.fillStyle = "black", n.fillText(o, 127, 127), n.fillStyle = "#ffff00", n.fillText(o, 124, 124)
            }
            return r
        }, r.prototype._getGridKey = function (e) {
            return e.level + "_x" + e.x + "_y" + e.y
        }, r.prototype.addImageryCache = function (e) {
            e.level < this._minimumLevel || e.level < e.maxLevel - 1 || this.options.addImageryCache && (e.key = this._getGridKey(e), this.options.addImageryCache(e))
        }, r.prototype.removeImageryCache = function (e) {
            e.maxLevel < this._minimumLevel && this.options.removeAllImageryCache && this.options.removeAllImageryCache(), e.level < this._minimumLevel || this.options.removeImageryCache && (e.key = this._getGridKey(e), this.options.removeImageryCache(e))
        }, t.FeatureGridImageryProvider = r
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawBillboard = void 0;
        var n = i(0),
            o = r(n),
            a = i(27),
            s = i(21),
            l = r(s),
            u = i(8);
        t.DrawBillboard = a.DrawPoint.extend({
            type: "billboard",
            attrClass: l,
            createFeature: function (e) {
                this._positions_draw = null;
                var t = this,
                    i = {
                        show: !1,
                        position: new o.CallbackProperty(function (e) {
                            return t.getDrawPosition()
                        }, !1),
                        billboard: l.style2Entity(e.style),
                        attribute: e
                    };
                return e.style && e.style.label && (i.label = (0, u.style2Entity)(e.style.label)), this.entity = this.dataSource.entities.add(i), this.updateAttrForDrawing(), this.entity
            },
            style2Entity: function (e, t) {
                return this.updateImg(e, t), e && e.label && (0, u.style2Entity)(e.label, t.label), l.style2Entity(e, t.billboard)
            },
            updateAttrForDrawing: function () {
                this.updateImg(this.entity.attribute.style, this.entity)
            },
            updateImg: function (e, t) {}
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawLabel = void 0;
        var n = i(0),
            o = r(n),
            a = i(27),
            s = i(8),
            l = r(s);
        t.DrawLabel = a.DrawPoint.extend({
            type: "label",
            attrClass: l,
            createFeature: function (e) {
                this._positions_draw = null;
                var t = this,
                    i = {
                        show: !1,
                        position: new o.CallbackProperty(function (e) {
                            return t.getDrawPosition()
                        }, !1),
                        label: l.style2Entity(e.style),
                        attribute: e
                    };
                return this.entity = this.dataSource.entities.add(i), this.entity
            },
            style2Entity: function (e, t) {
                return l.style2Entity(e, t.label)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawModel = void 0;
        var n = i(0),
            o = r(n),
            a = i(27),
            s = i(24),
            l = r(s),
            u = i(8);
        t.DrawModel = a.DrawPoint.extend({
            type: "model",
            attrClass: l,
            createFeature: function (e) {
                this._positions_draw = null;
                var t = this,
                    i = {
                        position: new o.CallbackProperty(function (e) {
                            return t.getDrawPosition()
                        }, !1),
                        model: l.style2Entity(e.style),
                        attribute: e
                    };
                return e.style && e.style.label && (i.label = (0, u.style2Entity)(e.style.label)), this.entity = this.dataSource.entities.add(i), this.entity
            },
            style2Entity: function (e, t) {
                return this.updateOrientation(e, t), e && e.label && (0, u.style2Entity)(e.label, t.label), l.style2Entity(e, t.model)
            },
            updateAttrForDrawing: function () {
                this.updateOrientation(this.entity.attribute.style, this.entity)
            },
            updateOrientation: function (e, t) {
                var i = t.position.getValue(this.viewer.clock.currentTime);
                if (null != i) {
                    var r = o.Math.toRadians(Number(e.heading || 0)),
                        n = o.Math.toRadians(Number(e.pitch || 0)),
                        a = o.Math.toRadians(Number(e.roll || 0)),
                        s = new o.HeadingPitchRoll(r, n, a);
                    t.orientation = o.Transforms.headingPitchRollQuaternion(i, s)
                }
            }
        })
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawCurve = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(10),
            a = i(17),
            s = i(47);
        t.DrawCurve = o.DrawPolyline.extend({
            type: "curve",
            editClass: s.EditCurve,
            _positions_show: null,
            getDrawPosition: function () {
                return this._positions_show
            },
            updateAttrForDrawing: function () {
                if (null == this._positions_draw || this._positions_draw.length < 3) return void(this._positions_show = this._positions_draw);
                this._positions_show = (0, a.line2curve)(this._positions_draw, this.entity.attribute.style.closure)
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), this.entity._positions_draw = this._positions_draw, this.entity._positions_show = this._positions_show, e.polyline.positions = new n.CallbackProperty(function (t) {
                    return e._positions_show
                }, !1), this._positions_show = null
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawPolylineVolume = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = (i(1), i(38)),
            l = r(s),
            u = i(48),
            c = i(3);
        r(c), t.DrawPolylineVolume = a.DrawPolyline.extend({
            type: "polylineVolume",
            _minPointNum: 2,
            _maxPointNum: 9999,
            editClass: u.EditPolylineVolume,
            attrClass: l,
            createFeature: function (e) {
                this._positions_draw = [], this._minPointNum_def || (this._minPointNum_def = this._minPointNum), this._maxPointNum_def || (this._maxPointNum_def = this._maxPointNum), e.config ? (this._minPointNum = e.config.minPointNum || this._minPointNum_def, this._maxPointNum = e.config.maxPointNum || this._maxPointNum_def) : (this._minPointNum = this._minPointNum_def, this._maxPointNum = this._maxPointNum_def);
                var t = this,
                    i = {
                        polylineVolume: l.style2Entity(e.style),
                        attribute: e
                    };
                return i.polylineVolume.positions = new o.CallbackProperty(function (e) {
                    return t.getDrawPosition()
                }, !1), this.entity = this.dataSource.entities.add(i), this.entity._positions_draw = this._positions_draw, this.entity
            },
            style2Entity: function (e, t) {
                return l.style2Entity(e, t.polylineVolume)
            },
            updateAttrForDrawing: function () {},
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this.getDrawPosition(), e.polylineVolume.positions = new o.CallbackProperty(function (t) {
                    return e._positions_draw
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawCorridor = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = i(1),
            l = i(41),
            u = r(l),
            c = i(49),
            h = i(3);
        r(h), t.DrawCorridor = a.DrawPolyline.extend({
            type: "corridor",
            _minPointNum: 2,
            _maxPointNum: 9999,
            editClass: c.EditCorridor,
            attrClass: u,
            createFeature: function (e) {
                this._positions_draw = [], this._minPointNum_def || (this._minPointNum_def = this._minPointNum), this._maxPointNum_def || (this._maxPointNum_def = this._maxPointNum), e.config ? (this._minPointNum = e.config.minPointNum || this._minPointNum_def, this._maxPointNum = e.config.maxPointNum || this._maxPointNum_def) : (this._minPointNum = this._minPointNum_def, this._maxPointNum = this._maxPointNum_def);
                var t = this,
                    i = {
                        corridor: u.style2Entity(e.style),
                        attribute: e
                    };
                return i.corridor.positions = new o.CallbackProperty(function (e) {
                    return t.getDrawPosition()
                }, !1), this.entity = this.dataSource.entities.add(i), this.entity._positions_draw = this._positions_draw, this.entity
            },
            style2Entity: function (e, t) {
                return u.style2Entity(e, t.corridor)
            },
            updateAttrForDrawing: function () {
                var e = this.entity.attribute.style;
                if (!e.clampToGround) {
                    var t = (0, s.getMaxHeight)(this.getDrawPosition());
                    0 != t && (this.entity.corridor.height = t, e.height = t, e.extrudedHeight && (this.entity.corridor.extrudedHeight = t + Number(e.extrudedHeight)))
                }
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this.getDrawPosition(), e.corridor.positions = new o.CallbackProperty(function (t) {
                    return e._positions_draw
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawRectangle = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = i(1),
            l = i(43),
            u = r(l),
            c = i(51),
            h = i(3);
        r(h), t.DrawRectangle = a.DrawPolyline.extend({
            type: "rectangle",
            _minPointNum: 2,
            _maxPointNum: 2,
            editClass: c.EditRectangle,
            attrClass: u,
            getRectangle: function () {
                var e = this.getDrawPosition();
                return e.length < 2 ? null : o.Rectangle.fromCartesianArray(e)
            },
            createFeature: function (e) {
                this._positions_draw = [];
                var t = this,
                    i = {
                        rectangle: u.style2Entity(e.style),
                        attribute: e
                    };
                return i.rectangle.coordinates = new o.CallbackProperty(function (e) {
                    return t.getRectangle()
                }, !1), i.polyline = {
                    clampToGround: e.style.clampToGround,
                    arcType: o.ArcType.RHUMB,
                    show: !1
                }, this.entity = this.dataSource.entities.add(i), this.entity._draw_positions = this._positions_draw, this.bindOutline(this.entity), this.entity
            },
            style2Entity: function (e, t) {
                return u.style2Entity(e, t.rectangle)
            },
            bindOutline: function (e) {
                e.polyline.show = new o.CallbackProperty(function (t) {
                    return e.rectangle.outline && e.rectangle.outline.getValue(t) && e.rectangle.outlineWidth && e.rectangle.outlineWidth.getValue(t) > 1
                }, !1), e.polyline.positions = new o.CallbackProperty(function (t) {
                    return e.polyline.show.getValue(t) && e._draw_positions ? u.getOutlinePositions(e) : null
                }, !1), e.polyline.width = new o.CallbackProperty(function (t) {
                    return e.rectangle.outlineWidth
                }, !1), e.polyline.material = new o.ColorMaterialProperty(new o.CallbackProperty(function (t) {
                    return e.rectangle.outlineColor.getValue(t)
                }, !1))
            },
            updateAttrForDrawing: function () {
                var e = this.entity.attribute.style;
                if (!e.clampToGround) {
                    var t = (0, s.getMaxHeight)(this.getDrawPosition());
                    0 != t && (this.entity.rectangle.height = t, e.height = t, e.extrudedHeight && (this.entity.rectangle.extrudedHeight = t + Number(e.extrudedHeight)))
                }
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this._positions_draw, e.rectangle.coordinates = new o.CallbackProperty(function (t) {
                    return e._positions_draw.length < 2 ? null : o.Rectangle.fromCartesianArray(e._positions_draw)
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawCircle = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = (i(1), i(7)),
            l = (r(s), i(4), i(31)),
            u = r(l),
            c = i(52);
        t.DrawCircle = a.DrawPolyline.extend({
            type: "ellipse",
            _minPointNum: 2,
            _maxPointNum: 2,
            editClass: c.EditCircle,
            attrClass: u,
            getShowPosition: function (e) {
                return this._positions_draw && this._positions_draw.length > 1 ? this._positions_draw[0] : null
            },
            createFeature: function (e) {
                this._positions_draw = [], "ellipse" == e.type ? this._maxPointNum = 3 : this._maxPointNum = 2;
                var t = this,
                    i = {
                        position: new o.CallbackProperty(function (e) {
                            return t.getShowPosition(e)
                        }, !1),
                        ellipse: u.style2Entity(e.style),
                        attribute: e
                    };
                return this.entity = this.dataSource.entities.add(i), this.entity
            },
            style2Entity: function (e, t) {
                return u.style2Entity(e, t.ellipse)
            },
            updateAttrForDrawing: function (e) {
                if (this._positions_draw) {
                    if (e) return void this.addPositionsForRadius(this._positions_draw);
                    if (!(this._positions_draw.length < 2)) {
                        var t = this.entity.attribute.style;
                        if (!t.clampToGround) {
                            var i = this.formatNum(o.Cartographic.fromCartesian(this._positions_draw[0]).height, 2);
                            if (this.entity.ellipse.height = i, t.height = i, t.extrudedHeight) {
                                var r = i + Number(t.extrudedHeight);
                                this.entity.ellipse.extrudedHeight = r
                            }
                        }
                        var n = this.formatNum(o.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
                        if (this.entity.ellipse.semiMinorAxis = n, 3 == this._maxPointNum) {
                            var a;
                            a = 3 == this._positions_draw.length ? this.formatNum(o.Cartesian3.distance(this._positions_draw[0], this._positions_draw[2]), 2) : n, this.entity.ellipse.semiMajorAxis = a, t.semiMinorAxis = n, t.semiMajorAxis = a
                        } else this.entity.ellipse.semiMajorAxis = n, t.radius = n
                    }
                }
            },
            addPositionsForRadius: function (e) {
                this._positions_draw = [e];
                var t = this.entity.attribute.style,
                    i = o.EllipseGeometryLibrary.computeEllipsePositions({
                        center: e,
                        semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(this.viewer.clock.currentTime),
                        semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(this.viewer.clock.currentTime),
                        rotation: o.Math.toRadians(Number(t.rotation || 0)),
                        granularity: 2
                    }, !0, !1),
                    r = new o.Cartesian3(i.positions[0], i.positions[1], i.positions[2]);
                if (this._positions_draw.push(r), 3 == this._maxPointNum) {
                    var n = new o.Cartesian3(i.positions[3], i.positions[4], i.positions[5]);
                    this._positions_draw.push(n)
                }
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this._positions_draw, e.position = new o.CallbackProperty(function (t) {
                    return e._positions_draw && e._positions_draw.length > 0 ? e._positions_draw[0] : null
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawCylinder = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = i(1),
            l = i(7),
            u = (r(l), i(4), i(42)),
            c = r(u),
            h = i(93);
        t.DrawCylinder = a.DrawPolyline.extend({
            type: "cylinder",
            _minPointNum: 2,
            _maxPointNum: 2,
            editClass: h.EditCylinder,
            attrClass: c,
            getShowPosition: function (e) {
                return this._positions_draw && this._positions_draw.length > 1 ? (0, s.addPositionsHeight)(this._positions_draw[0], this.entity.cylinder.length.getValue(e) / 2) : null
            },
            createFeature: function (e) {
                this._positions_draw = [];
                var t = this,
                    i = {
                        position: new o.CallbackProperty(function (e) {
                            return t.getShowPosition(e)
                        }, !1),
                        cylinder: c.style2Entity(e.style),
                        attribute: e
                    };
                return this.entity = this.dataSource.entities.add(i), this.entity
            },
            style2Entity: function (e, t) {
                return c.style2Entity(e, t.cylinder)
            },
            updateAttrForDrawing: function (e) {
                if (this._positions_draw) {
                    if (e) return void this.addPositionsForRadius(this._positions_draw);
                    if (!(this._positions_draw.length < 2)) {
                        var t = (this.entity.attribute.style, this.formatNum(o.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2));
                        this.entity.cylinder.bottomRadius = t
                    }
                }
            },
            addPositionsForRadius: function (e) {
                this._positions_draw = [e];
                var t = this.entity.cylinder.bottomRadius.getValue(this.viewer.clock.currentTime),
                    i = o.EllipseGeometryLibrary.computeEllipsePositions({
                        center: e,
                        semiMajorAxis: t,
                        semiMinorAxis: t,
                        rotation: 0,
                        granularity: 2
                    }, !0, !1),
                    r = new o.Cartesian3(i.positions[0], i.positions[1], i.positions[2]);
                this._positions_draw.push(r)
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this._positions_draw, e.position = new o.CallbackProperty(function (t) {
                    return e._positions_draw && e._positions_draw.length > 0 ? (0, s.addPositionsHeight)(e._positions_draw[0], e.cylinder.length.getValue(t) / 2) : null
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditCylinder = void 0;
        var n = i(0),
            o = r(n),
            a = i(6),
            s = r(a),
            l = i(4),
            u = i(19),
            c = i(1);
        t.EditCylinder = u.EditPolygon.extend({
            getGraphic: function () {
                return this.entity.cylinder
            },
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw;
                var e = this.viewer.clock.currentTime,
                    t = this;
                this.attr_bottomRadius = this.getGraphic().bottomRadius.getValue(e), this.getGraphic().bottomRadius = new o.CallbackProperty(function (e) {
                    return t.attr_bottomRadius
                }, !1), this.attr_length = this.getGraphic().length.getValue(e), this.getGraphic().length = new o.CallbackProperty(function (e) {
                    return t.attr_length
                }, !1)
            },
            finish: function () {
                this.entity._positions_draw = this._positions_draw, this.getGraphic().bottomRadius = this.attr_bottomRadius, this.getGraphic().length = this.attr_length
            },
            bindDraggers: function () {
                var e = this,
                    t = this.getPosition(),
                    i = new o.Cartesian3,
                    r = (new o.Cartesian3, this.entity.attribute.style),
                    n = t[0],
                    a = s.createDragger(this.dataSource, {
                        position: n,
                        onDrag: function (r, n) {
                            o.Cartesian3.subtract(n, t[r.index], i), t[r.index] = n, e.updateDraggers()
                        }
                    });
                a.index = 0, this.draggers.push(a);
                var u = (this.viewer.clock.currentTime, o.EllipseGeometryLibrary.computeEllipsePositions({
                        center: n,
                        semiMajorAxis: this.attr_bottomRadius,
                        semiMinorAxis: this.attr_bottomRadius,
                        rotation: o.Math.toRadians(Number(r.rotation || 0)),
                        granularity: 2
                    }, !0, !1)),
                    h = new o.Cartesian3(u.positions[0], u.positions[1], u.positions[2]);
                t[1] = h;
                var d = s.createDragger(this.dataSource, {
                    position: h,
                    type: s.PointType.EditAttr,
                    tooltip: l.message.dragger.editRadius,
                    onDrag: function (i, n) {
                        t[i.index] = n;
                        var a = e.formatNum(o.Cartesian3.distance(t[0], n), 2);
                        e.attr_bottomRadius = a, r.bottomRadius = a, e.updateDraggers()
                    }
                });
                this.draggers.push(d);
                var n = (0, c.addPositionsHeight)(t[0], this.attr_length),
                    f = s.createDragger(this.dataSource, {
                        position: n,
                        type: s.PointType.MoveHeight,
                        tooltip: l.message.dragger.moveHeight,
                        onDrag: function (i, n) {
                            var a = e.formatNum(o.Cartesian3.distance(t[0], n), 2);
                            e.attr_length = a, r.length = a, e.updateDraggers()
                        }
                    });
                this.draggers.push(f)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawEllipsoid = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = (i(1), i(7)),
            l = (r(s), i(4), i(44)),
            u = r(l),
            c = i(53);
        t.DrawEllipsoid = a.DrawPolyline.extend({
            type: "ellipsoid",
            _minPointNum: 2,
            _maxPointNum: 3,
            editClass: c.EditEllipsoid,
            attrClass: u,
            getShowPosition: function (e) {
                return this._positions_draw && this._positions_draw.length > 0 ? this._positions_draw[0] : null
            },
            createFeature: function (e) {
                this._positions_draw = [];
                var t = this,
                    i = {
                        position: new o.CallbackProperty(function (e) {
                            return t.getShowPosition(e)
                        }, !1),
                        ellipsoid: u.style2Entity(e.style),
                        attribute: e
                    };
                return this.entity = this.dataSource.entities.add(i), this.entity
            },
            style2Entity: function (e, t) {
                return u.style2Entity(e, t.ellipsoid)
            },
            updateAttrForDrawing: function (e) {
                if (this._positions_draw) {
                    if (e) return void this.addPositionsForRadius(this._positions_draw);
                    if (!(this._positions_draw.length < 2)) {
                        var t = this.entity.attribute.style,
                            i = this.formatNum(o.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
                        t.extentRadii = i, t.heightRadii = i;
                        var r;
                        r = 3 == this._positions_draw.length ? this.formatNum(o.Cartesian3.distance(this._positions_draw[0], this._positions_draw[2]), 2) : i, t.widthRadii = r, this.updateRadii(t)
                    }
                }
            },
            updateRadii: function (e) {
                this.entity.ellipsoid.radii.setValue(new o.Cartesian3(e.extentRadii, e.widthRadii, e.heightRadii))
            },
            addPositionsForRadius: function (e) {
                this._positions_draw = [e];
                var t = this.entity.attribute.style,
                    i = o.EllipseGeometryLibrary.computeEllipsePositions({
                        center: e,
                        semiMajorAxis: Number(t.extentRadii),
                        semiMinorAxis: Number(t.widthRadii),
                        rotation: o.Math.toRadians(Number(t.rotation || 0)),
                        granularity: 2
                    }, !0, !1),
                    r = new o.Cartesian3(i.positions[0], i.positions[1], i.positions[2]);
                this._positions_draw.push(r);
                var n = new o.Cartesian3(i.positions[3], i.positions[4], i.positions[5]);
                this._positions_draw.push(n)
            },
            finish: function () {
                this.entity.editing = this.getEditClass(this.entity), this.entity._positions_draw = this._positions_draw, this.entity.position = this.getShowPosition()
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawWall = void 0;
        var n = i(0),
            o = r(n),
            a = i(10),
            s = (i(1), i(39)),
            l = r(s),
            u = i(54),
            c = i(3);
        r(c), t.DrawWall = a.DrawPolyline.extend({
            type: "wall",
            _minPointNum: 2,
            _maxPointNum: 9999,
            editClass: u.EditWall,
            attrClass: l,
            createFeature: function (e) {
                this._positions_draw = [], this._minPointNum_def || (this._minPointNum_def = this._minPointNum), this._maxPointNum_def || (this._maxPointNum_def = this._maxPointNum), e.config ? (this._minPointNum = e.config.minPointNum || this._minPointNum_def, this._maxPointNum = e.config.maxPointNum || this._maxPointNum_def) : (this._minPointNum = this._minPointNum_def, this._maxPointNum = this._maxPointNum_def), this.maximumHeights = [], this.minimumHeights = [];
                var t = this,
                    i = {
                        wall: l.style2Entity(e.style),
                        attribute: e
                    };
                return i.wall.positions = new o.CallbackProperty(function (e) {
                    return t.getDrawPosition()
                }, !1), i.wall.minimumHeights = new o.CallbackProperty(function (e) {
                    return t.getMinimumHeights()
                }, !1), i.wall.maximumHeights = new o.CallbackProperty(function (e) {
                    return t.getMaximumHeights()
                }, !1), this.entity = this.dataSource.entities.add(i), this.entity
            },
            style2Entity: function (e, t) {
                return l.style2Entity(e, t.wall)
            },
            maximumHeights: null,
            getMaximumHeights: function (e) {
                return this.maximumHeights
            },
            minimumHeights: null,
            getMinimumHeights: function (e) {
                return this.minimumHeights
            },
            updateAttrForDrawing: function () {
                var e = this.entity.attribute.style,
                    t = this.getDrawPosition(),
                    i = t.length;
                this.maximumHeights = new Array(i), this.minimumHeights = new Array(i);
                for (var r = 0; r < i; r++) {
                    var n = o.Cartographic.fromCartesian(t[r]).height;
                    this.minimumHeights[r] = n, this.maximumHeights[r] = n + Number(e.extrudedHeight)
                }
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), e._positions_draw = this.getDrawPosition(), e.wall.positions = new o.CallbackProperty(function (t) {
                    return e._positions_draw
                }, !1), e._minimumHeights = this.getMinimumHeights(), e.wall.minimumHeights = new o.CallbackProperty(function (t) {
                    return e._minimumHeights
                }, !1), e._maximumHeights = this.getMaximumHeights(), e.wall.maximumHeights = new o.CallbackProperty(function (t) {
                    return e._maximumHeights
                }, !1)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawPModel = void 0;
        var n = i(0),
            o = r(n),
            a = i(23),
            s = i(1),
            l = i(24),
            u = r(l),
            c = i(4),
            h = i(55);
        t.DrawPModel = a.DrawBase.extend({
            type: "point",
            editClass: h.EditPModel,
            attrClass: u,
            createFeature: function (e) {
                var t = this;
                this._positions_draw = o.Cartesian3.ZERO;
                var i = e.style,
                    r = this.primitives.add(o.Model.fromGltf({
                        url: i.modelUrl,
                        modelMatrix: this.getModelMatrix(i),
                        minimumPixelSize: o.defaultValue(i.minimumPixelSize, 0),
                        scale: o.defaultValue(i.scale, 1)
                    }));
                return r.readyPromise.then(function (e) {
                    t.style2Entity(i, t.entity)
                }), r.attribute = e, this.entity = r, this.entity
            },
            getModelMatrix: function (e, t) {
                var i = new o.HeadingPitchRoll(o.Math.toRadians(e.heading || 0), o.Math.toRadians(e.pitch || 0), o.Math.toRadians(e.roll || 0)),
                    r = o.Transforms.eastNorthUpToFixedFrame;
                return o.Transforms.headingPitchRollToFixedFrame(t || this._positions_draw, i, this.viewer.scene.globe.ellipsoid, r)
            },
            style2Entity: function (e, t) {
                return t.modelMatrix = this.getModelMatrix(e, t.position), u.style2Entity(e, t)
            },
            bindEvent: function () {
                var e = this;
                this.getHandler().setInputAction(function (t) {
                    var i = (0, s.getCurrentMousePosition)(e.viewer.scene, t.endPosition, e.entity);
                    i && (e._positions_draw = i, e.entity.modelMatrix = e.getModelMatrix(e.entity.attribute.style)), e.tooltip.showAt(t.endPosition, c.message.draw.point.start)
                }, o.ScreenSpaceEventType.MOUSE_MOVE), this.getHandler().setInputAction(function (t) {
                    var i = (0, s.getCurrentMousePosition)(e.viewer.scene, t.position, e.entity);
                    i && (e._positions_draw = i, e.disable())
                }, o.ScreenSpaceEventType.LEFT_CLICK)
            },
            finish: function () {
                this.entity.modelMatrix = this.getModelMatrix(this.entity.attribute.style), this.entity.editing = this.getEditClass(this.entity), this.entity.position = this.getDrawPosition()
            }
        })
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DrawPolygonEx = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(50);
        t.DrawPolygonEx = o.DrawPolygon.extend({
            _positions_show: null,
            getDrawPosition: function () {
                return this._positions_show
            },
            updateAttrForDrawing: function () {
                if (null == this._positions_draw || this._positions_draw.length < this._minPointNum) return void(this._positions_show = this._positions_draw);
                this._positions_show = this.getShowPositions(this._positions_draw, this.entity.attribute)
            },
            getShowPositions: function (e, t) {
                return e
            },
            finish: function () {
                var e = this.entity;
                e.editing = this.getEditClass(e), this._positions_draw.length > this._maxPointNum && this._positions_draw.splice(this._maxPointNum, this._positions_draw.length - this._maxPointNum), this.entity._positions_draw = this._positions_draw, this.entity._positions_show = this._positions_show, e.polygon.hierarchy = new n.CallbackProperty(function (t) {
                    var i = e._positions_show;
                    return new n.PolygonHierarchy(i)
                }, !1), this._positions_draw = null, this._positions_show = null
            },
            toGeoJSON: function (e) {
                return this.attrClass.toGeoJSON(e, !0)
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.KeyboardRoam = t.KeyboardType = t.maxPitch = t.minPitch = t.rotateStep = t.dirStep = t.speedRatio = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(1),
            l = t.speedRatio = 150,
            u = t.dirStep = 25,
            c = t.rotateStep = 1,
            h = t.minPitch = .1,
            d = t.maxPitch = .95,
            f = t.KeyboardType = {
                ENLARGE: 0,
                NARROW: 1,
                LEFT_ROTATE: 2,
                RIGHT_ROTATE: 3,
                TOP_ROTATE: 4,
                BOTTOM_ROTATE: 5
            };
        t.KeyboardRoam = function () {
            function e(i, n) {
                r(this, e), this.viewer = i, this.flags = {
                    moveForward: !1,
                    moveBackward: !1,
                    moveUp: !1,
                    moveDown: !1,
                    moveLeft: !1,
                    moveRight: !1
                };
                var o = i.scene.canvas;
                o.setAttribute("tabindex", "0"), o.onclick = function () {
                    o.focus()
                };
                var s = this;
                document.addEventListener("keydown", function (e) {
                    if (s._enable) {
                        var t = s.getFlagForKeyCode(e.keyCode);
                        void 0 !== t && (s.flags[t] = !0)
                    }
                }, !1), document.addEventListener("keyup", function (e) {
                    if (s._enable) {
                        var t = s.getFlagForKeyCode(e.keyCode);
                        void 0 !== t && (s.flags[t] = !1)
                    }
                }, !1), this.handler = new a.ScreenSpaceEventHandler(i.scene.canvas), this.handler.setInputAction(function (e) {
                    s._enable && (e > 0 ? (t.speedRatio = l *= .9, t.rotateStep = c *= 1.1, t.dirStep = u *= .9) : (t.speedRatio = l *= 1.1, t.rotateStep = c *= .9, t.dirStep = u *= 1.1))
                }, a.ScreenSpaceEventType.WHEEL), this._enable = !1
            }
            return n(e, [{
                key: "bind",
                value: function (e) {
                    this._enable || (this._enable = !0, a.defined(e) && (t.speedRatio = l = e.speedRatio || l, t.dirStep = u = e.dirStep || u, t.rotateStep = c = e.rotateStep || c, t.minPitch = h = e.minPitch || h, t.maxPitch = d = e.maxPitch || d), this.viewer.clock.onTick.addEventListener(this.cameraFunc, this))
                }
            }, {
                key: "unbind",
                value: function () {
                    this._enable && (this._enable = !1, this.viewer.clock.onTick.removeEventListener(this.cameraFunc, this))
                }
            }, {
                key: "destroy",
                value: function () {
                    this.unbind(), this.handler.destroy()
                }
            }, {
                key: "getFlagForKeyCode",
                value: function (e) {
                    switch (e) {
                        case "W".charCodeAt(0):
                            return "moveForward";
                        case "S".charCodeAt(0):
                            return "moveBackward";
                        case "D".charCodeAt(0):
                            return "moveRight";
                        case "A".charCodeAt(0):
                            return "moveLeft";
                        case "Q".charCodeAt(0):
                            return "moveUp";
                        case "E".charCodeAt(0):
                            return "moveDown";
                        case 38:
                            this.rotateCamera(f.TOP_ROTATE);
                            break;
                        case 37:
                            this.rotateCamera(f.LEFT_ROTATE);
                            break;
                        case 39:
                            this.rotateCamera(f.RIGHT_ROTATE);
                            break;
                        case 40:
                            this.rotateCamera(f.BOTTOM_ROTATE);
                            break;
                        case "I".charCodeAt(0):
                        case 104:
                            this.moveCamera(f.ENLARGE);
                            break;
                        case "K".charCodeAt(0):
                        case 101:
                            this.moveCamera(f.NARROW);
                            break;
                        case "J".charCodeAt(0):
                        case 100:
                            this.moveCamera(f.LEFT_ROTATE);
                            break;
                        case "L".charCodeAt(0):
                        case 102:
                            this.moveCamera(f.RIGHT_ROTATE);
                            break;
                        case "U".charCodeAt(0):
                        case 103:
                            this.moveCamera(f.TOP_ROTATE);
                            break;
                        case "O".charCodeAt(0):
                        case 105:
                            this.moveCamera(f.BOTTOM_ROTATE)
                    }
                }
            }, {
                key: "startMoveForward",
                value: function () {
                    this.flags.moveForward = !0
                }
            }, {
                key: "stopMoveForward",
                value: function () {
                    this.flags.moveForward = !1
                }
            }, {
                key: "startMoveBackward",
                value: function () {
                    this.flags.moveBackward = !0
                }
            }, {
                key: "stopMoveBackward",
                value: function () {
                    this.flags.moveBackward = !1
                }
            }, {
                key: "startMoveRight",
                value: function () {
                    this.flags.moveRight = !0
                }
            }, {
                key: "stopMoveRight",
                value: function () {
                    this.flags.moveRight = !1
                }
            }, {
                key: "startMoveLeft",
                value: function () {
                    this.flags.moveLeft = !0
                }
            }, {
                key: "stopMoveLeft",
                value: function () {
                    this.flags.moveLeft = !1
                }
            }, {
                key: "moveForward",
                value: function (e) {
                    var t = this.viewer.camera,
                        i = t.direction,
                        r = a.Cartesian3.normalize(t.position, new a.Cartesian3),
                        n = a.Cartesian3.cross(i, r, new a.Cartesian3);
                    i = a.Cartesian3.cross(r, n, new a.Cartesian3), i = a.Cartesian3.normalize(i, i), i = a.Cartesian3.multiplyByScalar(i, e, i), t.position = a.Cartesian3.add(t.position, i, t.position)
                }
            }, {
                key: "cameraFunc",
                value: function (e) {
                    var t = this.viewer.camera,
                        i = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(t.position).height,
                        r = i / l;
                    this.flags.moveForward && this.moveForward(r), this.flags.moveBackward && this.moveForward(-r), this.flags.moveUp && t.moveUp(r), this.flags.moveDown && t.moveDown(r), this.flags.moveLeft && t.moveLeft(r), this.flags.moveRight && t.moveRight(r)
                }
            }, {
                key: "resetCameraPos",
                value: function (e) {
                    e && (this.viewer.scene.camera.position = e.position, this.viewer.scene.camera.direction = e.direction, this.viewer.scene.camera.right = e.right, this.viewer.scene.camera.up = e.up)
                }
            }, {
                key: "limitAngle",
                value: function (e, t, i) {
                    var r = a.Cartesian3.dot(e, a.Cartesian3.normalize(t, new a.Cartesian3));
                    return !("up" == i && r < h) && !("down" == i && r > d)
                }
            }, {
                key: "computedNewPos",
                value: function (e, t, i) {
                    var r = e.position,
                        n = (0, s.getCenter)(this.viewer);
                    if (n) {
                        var o = a.Cartesian3.fromDegrees(n.x, n.y, n.z);
                        if (o) {
                            var l = a.Cartesian3.distance(o, r),
                                u = l / 100;
                            u = i ? u * c : u;
                            var h = {},
                                d = new a.Ray(r, t);
                            if (h.position = a.Ray.getPoint(d, u), h.direction = e.direction, h.right = e.right, h.up = e.up, i) {
                                var f = a.Cartesian3.normalize(a.Cartesian3.subtract(h.position, o, new a.Cartesian3), new a.Cartesian3);
                                d = new a.Ray(o, f), h.position = a.Ray.getPoint(d, l), h.direction = a.Cartesian3.negate(f, new a.Cartesian3), h.up = a.Cartesian3.normalize(h.position, new a.Cartesian3), h.right = a.Cartesian3.cross(h.direction, h.up, new a.Cartesian3)
                            }
                            return h
                        }
                    }
                }
            }, {
                key: "moveCamera",
                value: function (e) {
                    var t, i = this.viewer.scene.camera;
                    switch (e) {
                        case f.ENLARGE:
                            t = this.computedNewPos(i, i.direction);
                            break;
                        case f.NARROW:
                            t = this.computedNewPos(i, a.Cartesian3.negate(i.direction, new a.Cartesian3));
                            break;
                        case f.LEFT_ROTATE:
                            t = this.computedNewPos(i, a.Cartesian3.negate(i.right, new a.Cartesian3), !0);
                            break;
                        case f.RIGHT_ROTATE:
                            t = this.computedNewPos(i, i.right, !0);
                            break;
                        case f.TOP_ROTATE:
                            var r = this.limitAngle(a.clone(i.up), a.clone(i.position), "up");
                            if (!r) return;
                            t = this.computedNewPos(i, a.clone(i.up), !0);
                            break;
                        case f.BOTTOM_ROTATE:
                            var r = this.limitAngle(a.clone(i.up), a.clone(i.position), "down");
                            if (!r) return;
                            t = this.computedNewPos(i, a.Cartesian3.negate(i.up, new a.Cartesian3), !0)
                    }
                    t && this.resetCameraPos(t)
                }
            }, {
                key: "rotateCamera",
                value: function (e) {
                    var t = [0, 0],
                        i = this.viewer.scene.canvas.clientWidth,
                        r = this.viewer.scene.canvas.clientHeight,
                        n = (i + r) / u;
                    switch (e) {
                        case f.LEFT_ROTATE:
                            t = [-n * i / r, 0];
                            break;
                        case f.RIGHT_ROTATE:
                            t = [n * i / r, 0];
                            break;
                        case f.TOP_ROTATE:
                            t = [0, n];
                            break;
                        case f.BOTTOM_ROTATE:
                            t = [0, -n];
                            break;
                        default:
                            return
                    }
                    var o = t[0] / i,
                        s = t[1] / r,
                        l = this.viewer.camera;
                    l.lookRight(.05 * o), l.lookUp(.05 * s);
                    var c = l.direction,
                        h = a.Cartesian3.normalize(l.position, new a.Cartesian3),
                        d = a.Cartesian3.cross(c, h, new a.Cartesian3);
                    h = a.Cartesian3.cross(d, c, new a.Cartesian3), l.up = h, l.right = d
                }
            }, {
                key: "enable",
                get: function () {
                    return this._enable
                },
                set: function (e) {
                    e ? this.bind() : this.unbind()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Popup = void 0;
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = i(0),
            l = r(s),
            u = i(5),
            c = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(u),
            h = i(1),
            d = i(2),
            f = i(20),
            p = r(f);
        t.Popup = function () {
            function e(t, i) {
                var r = this;
                n(this, e), this.viewer = t, this.options = i || {}, this._isOnly = !0, this._enable = !0, this._depthTest = !0, this.viewerid = t._container.id, this.objPopup = {}, this.highlighted = {
                    feature: void 0,
                    originalColor: new l.Color
                }, this.defaultHighlightedClr = new l.Color.fromCssColorString("#95e40c"), this.getPopupForConfig = d.getPopupForConfig, this.getPopup = d.getPopup;
                var o = '<div id="' + this.viewerid + 'pupup-all-view" ></div>';
                (0, c.default)("#" + this.viewerid).append(o), this.handler = new l.ScreenSpaceEventHandler(this.viewer.scene.canvas), this.handler.setInputAction(function (e) {
                    r.options.onLeftClick && r.options.onLeftClick(e), r.mousePickingClick(e)
                }, l.defaultValue(this.options.popupEventType, l.ScreenSpaceEventType.LEFT_CLICK)), this.viewer.scene.postRender.addEventListener(this.bind2scene, this)
            }
            return a(e, [{
                key: "mousePickingClick",
                value: function (e) {
                    if (this.removeFeatureForImageryLayer(), this.removeFeatureFor3dtiles(), this._isOnly && this.close(), this._enable) {
                        var t, i = e.position;
                        try {
                            t = this.viewer.scene.pick(i)
                        } catch (e) {}
                        var r = !1;
                        if (l.defined(t) && l.defined(t.id) && t.id instanceof l.Entity) {
                            var n = t.id;
                            if (l.defined(n.popup)) {
                                var o;
                                o = n.billboard || n.label || n.point || n.model ? n.position : (0, h.getCurrentMousePosition)(this.viewer.scene, i), this.show(n, o, i), r = !0
                            }
                            n.click && "function" == typeof n.click && n.click(n, i)
                        } else if (l.defined(t) && l.defined(t.tileset) && l.defined(t.getProperty)) {
                            for (var a = {}, s = t.getPropertyNames(), u = 0; u < s.length; u++) {
                                var c = s[u];
                                if (t.hasProperty(c)) {
                                    var f = t.getProperty(c);
                                    null != f && (a[c] = f)
                                }
                            }
                            var p = t.tileset._config;
                            if (p) {
                                if (l.defined(p.popup)) {
                                    var o = (0, h.getCurrentMousePosition)(this.viewer.scene, i),
                                        m = {
                                            id: t._batchId,
                                            popup: {
                                                html: (0, d.getPopupForConfig)(p, a),
                                                anchor: p.popupAnchor || [0, -15]
                                            }
                                        };
                                    this.show(m, o, i), r = !0
                                }
                                p.showClickFeature && this.showFeatureFor3dtiles(t, p.clickFeatureColor), p.click && "function" == typeof p.click && p.click({
                                    attr: a,
                                    feature: t
                                }, i)
                            }
                        } else if (t && l.defined(t.primitive)) {
                            var g = t.primitive;
                            if (l.defined(g.popup)) {
                                var o = (0, h.getCurrentMousePosition)(this.viewer.scene, i);
                                this.show(g, o, i), r = !0
                            }
                            g.click && "function" == typeof g.click && g.click(g, i)
                        }
                        r || this.pickImageryLayerFeatures(i)
                    }
                }
            }, {
                key: "pickImageryLayerFeatures",
                value: function (e) {
                    var t = this.viewer.scene,
                        i = t.camera.getPickRay(e),
                        r = t.imageryLayers.pickImageryLayerFeatures(i, t);
                    if (l.defined(r)) {
                        var n = this;
                        l.when(r, function (i) {
                            if (l.defined(i) && 0 !== i.length) {
                                var r = i[0];
                                if (null != r.imageryLayer && null != r.imageryLayer.config) {
                                    var o = r.imageryLayer.config;
                                    o.showClickFeature && r.data && n.showFeatureForImageryLayer(r.data, o.pickFeatureStyle);
                                    var a = (0, d.getPopupForConfig)(r.imageryLayer.config, r.properties);
                                    if (a) {
                                        var s = (0, h.getCurrentMousePosition)(t, e);
                                        n.show({
                                            id: "imageryLayerFeaturePromise",
                                            popup: {
                                                html: a,
                                                anchor: r.imageryLayer.config.popupAnchor || [0, -12]
                                            }
                                        }, s, e)
                                    }
                                    o.click && "function" == typeof o.click && o.click(r.properties, e)
                                }
                            }
                        }, function () {})
                    }
                }
            }, {
                key: "show",
                value: function (e, t, i) {
                    if (null != e && null != e.popup) {
                        t || (t = p.getCenterPosition(e));
                        var r = e.billboard || e.label || e.point || e.model;
                        r && r.heightReference && (t = this.getPositionValue(t), r.heightReference._value == l.HeightReference.CLAMP_TO_GROUND ? t = (0, h.updateHeightForClampToGround)(this.viewer, t) : r.heightReference._value == l.HeightReference.RELATIVE_TO_GROUND && (t = (0, h.updateHeightForClampToGround)(this.viewer, t, !0)));
                        var n = this.getPopupId(e);
                        this.close(n), this.objPopup[n] = {
                            id: e.id,
                            popup: e.popup,
                            entity: e,
                            cartesian: t,
                            viewPoint: i
                        };
                        var a;
                        if ("object" === o(e.popup) ? (a = e.popup.html, this.objPopup[n].onAdd = e.popup.onAdd, this.objPopup[n].onRemove = e.popup.onRemove) : a = e.popup, a) {
                            var s = this;
                            "function" == typeof a && (a = a(e, t, function (r) {
                                s._showHtml(r, n, e, t, i)
                            })), a && this._showHtml(a, n, e, t, i)
                        }
                    }
                }
            }, {
                key: "getItem",
                value: function (e) {
                    return this.objPopup[e]
                }
            }, {
                key: "_showHtml",
                value: function (e, t, i, r, n) {
                    (0, c.default)("#" + this.viewerid + "pupup-all-view").append('<div id="' + t + '" class="cesium-popup">            <a id="' + t + '-popup-close" data-id="' + t + '" class="cesium-popup-close-button cesium-popup-color" >×</a>            <div class="cesium-popup-content-wrapper cesium-popup-background">                <div class="cesium-popup-content cesium-popup-color">' + e + '</div>            </div>            <div class="cesium-popup-tip-container"><div class="cesium-popup-tip cesium-popup-background"></div></div>        </div>');
                    var o = this;
                    if ((0, c.default)("#" + t + "-popup-close").click(function () {
                            var e = (0, c.default)(this).attr("data-id");
                            o.close(e, !0)
                        }), !this.updateViewPoint(t, r, i.popup, n) && this._depthTest) return void this.close(t);
                    this.objPopup[t] && this.objPopup[t].onAdd && this.objPopup[t].onAdd(t)
                }
            }, {
                key: "getPositionValue",
                value: function (e) {
                    if (!e) return e;
                    var t;
                    return e instanceof l.Cartesian3 ? t = e : "function" == typeof e.getValue ? t = e.getValue(this.viewer.clock.currentTime) : e._value && e._value instanceof l.Cartesian3 && (t = e._value), t
                }
            }, {
                key: "updateViewPoint",
                value: function (e, t, i, r) {
                    var n = this.getPositionValue(t);
                    if (!l.defined(n)) return !1;
                    var a = l.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, n);
                    if (l.defined(a) && (r = a, this.objPopup[e] && (this.objPopup[e].viewPoint = a)), !l.defined(r)) return console.log("wgs84ToWindowCoordinates无法转换为屏幕坐标"), !1;
                    var s = this.viewer.scene;
                    if (this._depthTest && s.mode === l.SceneMode.SCENE3D) {
                        var u = s.camera.getPickRay(r),
                            h = s.globe.pick(u, s);
                        if (h) {
                            if (l.Cartesian3.distance(n, h) > 1e6) return !1
                        }
                    }
                    if ("object" === (void 0 === i ? "undefined" : o(i)) && i.timeRender && i.html && "function" == typeof i.html) {
                        var d = i.html(this.objPopup[e] && this.objPopup[e].entity, n);
                        (0, c.default)("#" + e + " .cesium-popup-content").html(d)
                    }
                    var f = (0, c.default)("#" + e),
                        p = r.x - f.width() / 2,
                        m = r.y - f.height();
                    return i && "object" === (void 0 === i ? "undefined" : o(i)) && i.anchor && (p += i.anchor[0], m += i.anchor[1]), f.css("transform", "translate3d(" + p + "px," + m + "px, 0)"), !0
                }
            }, {
                key: "bind2scene",
                value: function () {
                    for (var e in this.objPopup) {
                        var t = this.objPopup[e];
                        !this.updateViewPoint(e, t.cartesian, t.popup, t.viewPoint) && this._depthTest && this.close(e)
                    }
                }
            }, {
                key: "getPopupId",
                value: function (e) {
                    return this.viewerid + "popup_" + ((e.id || "") + "").replace(new RegExp("[^0-9a-zA-Z_]", "gm"), "_")
                }
            }, {
                key: "close",
                value: function (e, t) {
                    if (!this._isOnly && e) {
                        "object" === (void 0 === e ? "undefined" : o(e)) && (e = this.getPopupId(e));
                        for (var i in this.objPopup)
                            if (e == this.objPopup[i].id || e == i) {
                                this.objPopup[i] && this.objPopup[i].onRemove && this.objPopup[i].onRemove(i), (0, c.default)("#" + i).remove(), delete this.objPopup[i];
                                break
                            }
                    } else {
                        for (var i in this.objPopup) this.objPopup[i] && this.objPopup[i].onRemove && this.objPopup[i].onRemove(i);
                        (0, c.default)("#" + this.viewerid + "pupup-all-view").empty(), this.objPopup = {}
                    }
                    t && (this.removeFeatureForImageryLayer(), this.removeFeatureFor3dtiles())
                }
            }, {
                key: "destroy",
                value: function () {
                    this.close(), this.viewer.scene.postRender.removeEventListener(this.bind2scene, this), this.handler.destroy(), delete this.handler, (0, c.default)("#" + this.viewerid + "pupup-all-view").remove()
                }
            }, {
                key: "removeFeatureForImageryLayer",
                value: function () {
                    null != this.lastShowFeature && (this.viewer.dataSources.remove(this.lastShowFeature), this.lastShowFeature = null)
                }
            }, {
                key: "showFeatureForImageryLayer",
                value: function (e, t) {
                    var i = this;
                    this.removeFeatureForImageryLayer();
                    var r = e;
                    if (e.geometryType && -1 != e.geometryType.indexOf("esri")) {
                        if (JSON.stringify(e.geometry).length < 1e4) {
                            var n = window.wutu3d.L || window.L;
                            if (!n.esri) return void console.log("需要引入 wutu-esri 插件解析arcgis标准的json数据！");
                            r = n.esri.Util.arcgisToGeoJSON(e.geometry)
                        }
                    } else if (e.geometry && e.geometry.type) {
                        var n = window.wutu3d.L || window.L;
                        if (n) {
                            var o = n.geoJSON(e.geometry, {
                                coordsToLatLng: function (e) {
                                    return e[0] > 180 || e[0] < -180 ? n.CRS.EPSG3857.unproject(n.point(e[0], e[1])) : new n.LatLng(e[1], e[0], e[2])
                                }
                            });
                            r = o.toGeoJSON()
                        }
                    }
                    if (null != r) {
                        t = t || {};
                        l.GeoJsonDataSource.load(r, {
                            clampToGround: !0,
                            stroke: new l.Color.fromCssColorString(t.stroke || "#ffff00"),
                            strokeWidth: t.strokeWidth || 3,
                            fill: new l.Color.fromCssColorString(t.fill || "#ffff00").withAlpha(t.fillAlpha || .7)
                        }).then(function (e) {
                            i.viewer.dataSources.add(e), i.lastShowFeature = e, l.defined(t.showTime) && setTimeout(function () {
                                i.removeFeatureForImageryLayer()
                            }, t.showTime)
                        }).otherwise(function (e) {
                            console.log(e)
                        })
                    }
                }
            }, {
                key: "removeFeatureFor3dtiles",
                value: function () {
                    if (l.defined(this.highlighted.feature)) {
                        try {
                            this.highlighted.feature.color = this.highlighted.originalColor
                        } catch (e) {}
                        this.highlighted.feature = void 0
                    }
                }
            }, {
                key: "showFeatureFor3dtiles",
                value: function (e, t) {
                    this.removeFeatureFor3dtiles(), this.highlighted.feature = e, l.Color.clone(e.color, this.highlighted.originalColor), t && "string" == typeof t && (t = new l.Color.fromCssColorString(t)), e.color = t || this.defaultHighlightedClr
                }
            }, {
                key: "isOnly",
                get: function () {
                    return this._isOnly
                },
                set: function (e) {
                    this._isOnly = e
                }
            }, {
                key: "enable",
                get: function () {
                    return this._enable
                },
                set: function (e) {
                    this._enable = e, e || this.close()
                }
            }, {
                key: "depthTest",
                get: function () {
                    return this._depthTest
                },
                set: function (e) {
                    this._depthTest = e
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Tooltip = void 0;
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(a),
            l = i(5),
            u = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(l),
            c = i(1),
            h = i(2);
        t.Tooltip = function () {
            function e(t, i) {
                var n = this;
                r(this, e), this.viewer = t, this.options = i || {}, this._enable = !0, this.viewerid = t._container.id, this.tooltipcontentid = this.viewerid + "tooltip-content", this.highlighted = {
                    feature: void 0,
                    originalColor: new s.Color
                }, this.defaultHighlightedClr = new s.Color.fromCssColorString("#95e40c"), this.getTooltipForConfig = h.getTooltipForConfig;
                var o = '<div id="' + this.viewerid + 'tooltip-view" class="cesium-popup" style="display:none;">     <div class="cesium-popup-content-wrapper  cesium-popup-background">         <div id="' + this.tooltipcontentid + '" class="cesium-popup-content cesium-popup-color"></div>     </div>     <div class="cesium-popup-tip-container"><div class="cesium-popup-tip  cesium-popup-background"></div></div></div> ';
                (0, u.default)("#" + this.viewerid).append(o), this._tooltipDOM = (0, u.default)("#" + this.viewerid + "tooltip-view"), this._tooltipContentDOM = (0, u.default)("#" + this.tooltipcontentid), this.handler = new s.ScreenSpaceEventHandler(t.scene.canvas), this.handler.setInputAction(function (e) {
                    n.options.onMouseMove && n.options.onMouseMove(e), n.mouseMovingPicking(e)
                }, s.ScreenSpaceEventType.MOUSE_MOVE)
            }
            return o(e, [{
                key: "mouseMovingPicking",
                value: function (e) {
                    var t = this;
                    if (this._enable) {
                        if ((0, u.default)(".cesium-viewer").css("cursor", ""), !1 === this.viewer.scene.screenSpaceCameraController.enableRotate || !1 === this.viewer.scene.screenSpaceCameraController.enableTilt || !1 === this.viewer.scene.screenSpaceCameraController.enableTranslate) return void this.close();
                        var i, r, n = e.endPosition;
                        try {
                            r = this.viewer.scene.pick(n, 5, 5)
                        } catch (e) {}
                        if (s.defined(r) && s.defined(r.id) && r.id instanceof s.Entity) i = r.id;
                        else if (s.defined(r) && s.defined(r.tileset) && s.defined(r.getProperty)) {
                            var o = r.tileset._config;
                            if (o) {
                                for (var a = {}, l = r.getPropertyNames(), d = 0; d < l.length; d++) {
                                    var f = l[d];
                                    if (r.hasProperty(f)) {
                                        var p = r.getProperty(f);
                                        null != p && (a[f] = p)
                                    }
                                }
                                i = {
                                    id: r._batchId,
                                    tooltip: {
                                        html: (0, h.getTooltipForConfig)(o, a),
                                        anchor: o.popupAnchor || [0, -15]
                                    },
                                    attr: a,
                                    feature: r
                                }, o.noMouseMove || (o.mouseover && (i.mouseover = o.mouseover), o.mouseover && (i.mouseover = o.mouseover)), o.showMoveFeature && this.showFeatureFor3dtiles(r, o.moveFeatureColor)
                            }
                        } else r && s.defined(r.primitive) && (i = r.primitive);
                        if (i)
                            if ((i.popup || i.click || i.cursorCSS) && (0, u.default)(".cesium-viewer").css("cursor", i.cursorCSS || "pointer"), i.noMouseMove || (clearTimeout(this.lastTime), this.lastTime = setTimeout(function (e) {
                                    t.activateMouseOver(i, n)
                                }, 20)), i.tooltip) {
                                var m = (0, c.getCurrentMousePosition)(this.viewer.scene, n);
                                this.show(i, m, n)
                            } else this.close();
                        else this.close(), clearTimeout(this.lastTime), this.lastTime = setTimeout(function (e) {
                            t.activateMouseOut()
                        }, 20)
                    }
                }
            }, {
                key: "show",
                value: function (e, t, i) {
                    if (null != e && null != e.tooltip) {
                        if (null == i && (i = s.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, t)), null == i) return void this.close();
                        if (this._lastTooltipEntity !== e) {
                            var r, o;
                            if ("object" === n(e.tooltip)) {
                                if (r = e.tooltip.html, o = e.tooltip.onAdd, this.onRemove = e.tooltip.onRemove, e.tooltip.check && !e.tooltip.check()) return void this.close()
                            } else r = e.tooltip;
                            if ("function" == typeof r && (r = r(e, t)), !r) return;
                            this._tooltipContentDOM.html(r), this._tooltipDOM.show(), o && o(this.tooltipcontentid)
                        }
                        this._lastTooltipEntity = e;
                        var a = i.x - this._tooltipDOM.width() / 2,
                            l = i.y - this._tooltipDOM.height(),
                            u = e.tooltip;
                        u && "object" === (void 0 === u ? "undefined" : n(u)) && u.anchor ? (a += u.anchor[0], l += u.anchor[1]) : l -= 15, this._tooltipDOM.css("transform", "translate3d(" + a + "px," + l + "px, 0)")
                    }
                }
            }, {
                key: "close",
                value: function () {
                    this.onRemove && (this.onRemove(this.tooltipcontentid), delete this.onRemove), this._tooltipContentDOM.empty(), this._tooltipDOM.hide(), this.removeFeatureFor3dtiles(), delete this._lastTooltipEntity
                }
            }, {
                key: "activateMouseOver",
                value: function (e, t) {
                    this._lastMouseEntity !== e && (this.activateMouseOut(), e.mouseover && "function" == typeof e.mouseover && e.mouseover(e, t), this._lastMouseEntity = e)
                }
            }, {
                key: "activateMouseOut",
                value: function () {
                    null != this._lastMouseEntity && (this._lastMouseEntity.mouseout && "function" == typeof this._lastMouseEntity.mouseout && this._lastMouseEntity.mouseout(this._lastMouseEntity), this._lastMouseEntity = null)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.close(), this.handler.destroy(), delete this.handler, this._tooltipDOM.remove(), delete this._tooltipDOM, delete this._tooltipContentDOM, this._lastMouseEntity && (this._lastMouseEntity = null), this._lastTooltipEntity && (this._lastTooltipEntity = null)
                }
            }, {
                key: "removeFeatureFor3dtiles",
                value: function () {
                    if (s.defined(this.highlighted.feature)) {
                        try {
                            this.highlighted.feature.color = this.highlighted.originalColor
                        } catch (e) {}
                        this.highlighted.feature = void 0
                    }
                }
            }, {
                key: "showFeatureFor3dtiles",
                value: function (e, t) {
                    this.removeFeatureFor3dtiles(), this.highlighted.feature = e, s.Color.clone(e.color, this.highlighted.originalColor), t && "string" == typeof t && (t = new s.Color.fromCssColorString(t)), e.color = t || this.defaultHighlightedClr
                }
            }, {
                key: "enable",
                get: function () {
                    return this._enable
                },
                set: function (e) {
                    this._enable = e, e || this.close()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function o(e) {
            return [{
                text: "查看此处坐标",
                iconCls: "fa fa-info-circle",
                calback: function (e) {
                    var t = d.formatNum(e.position.x, 1),
                        i = d.formatNum(e.position.y, 1),
                        r = d.formatNum(e.position.z, 1),
                        n = d.formatPosition(e.position),
                        o = "经度：" + n.x + ", 纬度：" + n.y + ", 高程：" + n.z + "\n                    <br/>笛卡尔(xyz)：" + t + "," + i + "," + r + " ";
                    g.alert(o, "位置信息")
                }
            }, {
                text: "查看当前视角",
                iconCls: "fa fa-camera-retro",
                calback: function (t) {
                    var i = d.getCameraView(e);
                    g.alert(JSON.stringify(i), "当前视角信息")
                }
            }, {
                text: "视角切换",
                iconCls: "fa fa-street-view",
                children: [{
                    text: "绕此处环绕飞行",
                    iconCls: "fa fa-retweet",
                    visible: function (e) {
                        return !d.windingPoint.isStart
                    },
                    calback: function (t) {
                        d.windingPoint.start(e, t.position)
                    }
                }, {
                    text: "关闭环绕飞行",
                    iconCls: "fa fa-remove",
                    visible: function (e) {
                        return d.windingPoint.isStart
                    },
                    calback: function (e) {
                        d.windingPoint.stop()
                    }
                }, {
                    text: "移动到此处",
                    iconCls: "fa fa-send-o",
                    calback: function (t) {
                        var i = e.scene.camera.positionCartographic.height;
                        i > 5e3 && (i = 5e3), e.camera.lookAt(t.position, new l.HeadingPitchRange(e.camera.heading, e.camera.pitch, i)), e.camera.lookAtTransform(l.Matrix4.IDENTITY)
                    }
                }, {
                    text: "第一视角站到此处",
                    iconCls: "fa fa-male",
                    calback: function (t) {
                        e.camera.flyTo({
                            destination: d.addPositionsHeight(t.position, 10),
                            orientation: {
                                heading: l.Math.toRadians(0),
                                pitch: l.Math.toRadians(10),
                                roll: l.Math.toRadians(0)
                            }
                        })
                    }
                }, {
                    text: "开启键盘漫游",
                    iconCls: "fa fa-keyboard-o",
                    visible: function (t) {
                        return !e.wutu.keyboardRoam.enable
                    },
                    calback: function (t) {
                        e.wutu.keyboardRoam.enable = !0
                    }
                }, {
                    text: "关闭键盘漫游",
                    iconCls: "fa fa-keyboard-o",
                    visible: function (t) {
                        return e.wutu.keyboardRoam.enable
                    },
                    calback: function (t) {
                        e.wutu.keyboardRoam.enable = !1
                    }
                }]
            }, {
                text: "三维模型",
                iconCls: "fa fa-building-o",
                visible: function (t) {
                    var i = p.pick3DTileset(e, t.position);
                    return l.defined(i)
                },
                children: [{
                    text: "显示三角网",
                    iconCls: "fa fa-connectdevelop",
                    visible: function (t) {
                        return !p.pick3DTileset(e, t.position).debugWireframe
                    },
                    calback: function (t) {
                        p.pick3DTileset(e, t.position).debugWireframe = !0
                    }
                }, {
                    text: "关闭三角网",
                    iconCls: "fa fa-connectdevelop",
                    visible: function (t) {
                        return p.pick3DTileset(e, t.position).debugWireframe
                    },
                    calback: function (t) {
                        p.pick3DTileset(e, t.position).debugWireframe = !1
                    }
                }, {
                    text: "显示包围盒",
                    iconCls: "fa fa-codepen",
                    visible: function (t) {
                        return !p.pick3DTileset(e, t.position).debugShowBoundingVolume
                    },
                    calback: function (t) {
                        p.pick3DTileset(e, t.position).debugShowBoundingVolume = !0
                    }
                }, {
                    text: "关闭包围盒",
                    iconCls: "fa fa-codepen",
                    visible: function (t) {
                        return p.pick3DTileset(e, t.position).debugShowBoundingVolume
                    },
                    calback: function (t) {
                        p.pick3DTileset(e, t.position).debugShowBoundingVolume = !1
                    }
                }]
            }, {
                text: "地形服务",
                iconCls: "fa fa-globe",
                visible: function (e) {
                    return !l.defined(e.target)
                },
                children: [{
                    text: "开启地形",
                    iconCls: "fa fa-rss",
                    visible: function (t) {
                        return !e.wutu.hasTerrain()
                    },
                    calback: function (t) {
                        e.wutu.updateTerrainProvider(!0)
                    }
                }, {
                    text: "关闭地形",
                    iconCls: "fa fa-rss",
                    visible: function (t) {
                        return e.wutu.hasTerrain()
                    },
                    calback: function (t) {
                        e.wutu.updateTerrainProvider(!1)
                    }
                }, {
                    text: "显示三角网",
                    iconCls: "fa fa-connectdevelop",
                    visible: function (t) {
                        return !e.scene.globe._surface.tileProvider._debug.wireframe
                    },
                    calback: function (t) {
                        e.scene.globe._surface.tileProvider._debug.wireframe = !0
                    }
                }, {
                    text: "关闭三角网",
                    iconCls: "fa fa-connectdevelop",
                    visible: function (t) {
                        return e.scene.globe._surface.tileProvider._debug.wireframe
                    },
                    calback: function (t) {
                        e.scene.globe._surface.tileProvider._debug.wireframe = !1
                    }
                }]
            }, {
                text: "场景设置",
                iconCls: "fa fa-gear",
                children: [{
                    text: "开启深度监测",
                    iconCls: "fa fa-eye-slash",
                    visible: function (t) {
                        return !e.scene.globe.depthTestAgainstTerrain
                    },
                    calback: function (t) {
                        e.scene.globe.depthTestAgainstTerrain = !0
                    }
                }, {
                    text: "关闭深度监测",
                    iconCls: "fa fa-eye",
                    visible: function (t) {
                        return e.scene.globe.depthTestAgainstTerrain
                    },
                    calback: function (t) {
                        e.scene.globe.depthTestAgainstTerrain = !1
                    }
                }, {
                    text: "开启光照效果",
                    iconCls: "fa fa-bullseye",
                    visible: function (t) {
                        return !e.shadows
                    },
                    calback: function (t) {
                        e.shadows = !0, e.terrainShadows = l.ShadowMode.ENABLED, e.scene.globe.enableLighting = !0
                    }
                }, {
                    text: "关闭光照效果",
                    iconCls: "fa fa-sun-o",
                    visible: function (t) {
                        return e.shadows
                    },
                    calback: function (t) {
                        e.shadows = !1, e.terrainShadows = l.ShadowMode.RECEIVE_ONLY, e.scene.globe.enableLighting = !1
                    }
                }, {
                    text: "开启大气渲染",
                    iconCls: "fa fa-cloud",
                    visible: function (t) {
                        return !e.scene.skyAtmosphere.show
                    },
                    calback: function (t) {
                        e.scene.skyAtmosphere.show = !0, e.scene.globe.showGroundAtmosphere = !0
                    }
                }, {
                    text: "关闭大气渲染",
                    iconCls: "fa fa-cloud",
                    visible: function (t) {
                        return e.scene.skyAtmosphere.show
                    },
                    calback: function (t) {
                        e.scene.skyAtmosphere.show = !1, e.scene.globe.showGroundAtmosphere = !1
                    }
                }, {
                    text: "场景截图",
                    iconCls: "fa fa-download",
                    calback: function (t) {
                        e.wutu.expImage()
                    }
                }]
            }]
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.ContextMenu = void 0;
        var a = function () {
            function e(e, t) {
                for (var i = 0; i < t.length; i++) {
                    var r = t[i];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function (t, i, r) {
                return i && e(t.prototype, i), r && e(t, r), t
            }
        }();
        t.getDefaultContextMenu = o;
        var s = i(0),
            l = r(s),
            u = i(5),
            c = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(u),
            h = i(1),
            d = r(h),
            f = i(26),
            p = r(f),
            m = i(2),
            g = r(m);
        t.ContextMenu = function () {
            function e(t, i) {
                var r = this;
                n(this, e), this.viewer = t, this.viewerid = t._container.id, this._enable = !0, this.menuIndex = 0, this.objMenu = {};
                var o = '<div id="' + this.viewerid + 'wutu-contextmenu" class="wutu-contextmenu open" style="display:none;">\n                            <ul id="' + this.viewerid + 'wutu-contextmenu-ul" class="wutu-contextmenu-ul"> \n                            </ul>\n                        </div>';
                (0, c.default)("#" + t._container.id).append(o), this._contextmenuDOM = (0, c.default)("#" + this.viewerid + "wutu-contextmenu"), this._contextmenuULDOM = (0, c.default)("#" + this.viewerid + "wutu-contextmenu-ul");
                var a = new l.ScreenSpaceEventHandler(t.scene.canvas);
                a.setInputAction(function (e) {
                    r.close()
                }, l.ScreenSpaceEventType.LEFT_DOWN), a.setInputAction(function (e) {
                    r.close()
                }, l.ScreenSpaceEventType.MIDDLE_DOWN), a.setInputAction(function (e) {
                    r.close()
                }, l.ScreenSpaceEventType.RIGHT_DOWN), a.setInputAction(function (e) {
                    r.close()
                }, l.ScreenSpaceEventType.PINCH_START), a.setInputAction(function (e) {
                    r.close()
                }, l.ScreenSpaceEventType.WHEEL), a.setInputAction(function (e) {
                    if (r.close(), r._enable) {
                        var i, n = e.position,
                            o = t.scene.pick(n, 5, 5),
                            a = t.wutu.contextmenuItems;
                        l.defined(o) && l.defined(o.id) && o.id instanceof l.Entity ? (i = o.id, l.defined(i.contextmenuItems) && (a = i.contextmenuItems)) : l.defined(o) && l.defined(o.primitive) && (i = o.primitive, l.defined(i.contextmenuItems) && (a = i.contextmenuItems)), r.show(a, n, i)
                    }
                }, l.ScreenSpaceEventType.RIGHT_CLICK), this.handler = a
            }
            return a(e, [{
                key: "show",
                value: function (e, t, i) {
                    if (!e || 0 == e.length) return void this.close();
                    for (var r = d.getCurrentMousePosition(this.viewer.scene, t), n = "", o = 0, a = e.length; o < a; o++) {
                        var s = e[o],
                            l = this.getItemHtml(s, {
                                positionMouse: t,
                                position: r,
                                target: i
                            });
                        l && (n += l)
                    }
                    if ("" == n) return void this.close();
                    var u = this;
                    this._contextmenuULDOM.html(n), (0, c.default)("#" + this.viewerid + "wutu-contextmenu-ul .contextmenu-item").click(function (e) {
                        var n = Number((0, c.default)(this).attr("data-index")),
                            o = u.objMenu[n];
                        o && o.calback && o.calback({
                            positionMouse: t,
                            position: r,
                            data: o,
                            target: i
                        }), u.close()
                    }), (0, c.default)("#" + this.viewerid + "wutu-contextmenu-ul .contextmenu-item").mouseover(function (e) {
                        (0, c.default)(".sub-menu").hide();
                        var t = this.querySelector(".sub-menu");
                        t && (t.style.display = "block"), (0, c.default)("#" + u.viewerid + "wutu-contextmenu-ul .active").removeClass("active"), (0, c.default)(this).addClass("active")
                    });
                    var h = t.y,
                        f = t.x,
                        p = this._contextmenuDOM.height(),
                        m = this._contextmenuDOM.width();
                    (0, c.default)("#" + this.viewerid + "wutu-contextmenu-ul .sub-menu").css({
                        left: m + 3 + "px"
                    }), h + p > this.viewer.scene.canvas.clientHeight ? (h -= p - 10) <= 0 && (h = 0) : h += 10, f + m > this.viewer.scene.canvas.clientWidth ? (f -= m - 10) <= 0 && (f = 0) : f += 10, this._contextmenuDOM.css({
                        top: h,
                        left: f
                    }).show()
                }
            }, {
                key: "getItemHtml",
                value: function (e, t) {
                    if (e.hasOwnProperty("visible")) {
                        var i = e.visible;
                        try {
                            "function" == typeof i && (t.data = e, i = e.visible(t))
                        } catch (e) {
                            console.log(e)
                        }
                        if (!i) return null
                    }
                    var r;
                    if (e.text) {
                        var n = "",
                            o = "";
                        if (e.children) {
                            n = '<ul class="wutu-contextmenu-ul sub-menu">';
                            for (var a = 0, s = e.children.length; a < s; a++) {
                                var l = e.children[a];
                                t.data = l;
                                var u = this.getItemHtml(l, t);
                                u && (n += u)
                            }
                            n += "</ul>", o = '&nbsp;&nbsp;<i class="fa fa-caret-right"></i>'
                        }
                        this.menuIndex++, this.objMenu[this.menuIndex] = e, r = '<li class="contextmenu-item" data-index="' + this.menuIndex + '">\n                        <a href="javascript:void(0)"><i class="' + e.iconCls + '"></i>' + e.text + o + "</a>\n                        " + n + "\n                    </li>"
                    } else r = '<li class="line"></li>';
                    return r
                }
            }, {
                key: "close",
                value: function () {
                    (0, c.default)("#" + this.viewerid + "wutu-contextmenu").hide()
                }
            }, {
                key: "destroy",
                value: function () {
                    this.close(), this.handler.destroy(), delete this.handler, (0, c.default)("#" + this.viewerid + "wutu-contextmenu").remove(), delete this._contextmenuDOM, delete this._contextmenuULDOM
                }
            }, {
                key: "enable",
                get: function () {
                    return this._enable
                },
                set: function (e) {
                    this._enable = e, e || this.close()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Location = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = r(a),
            l = i(5),
            u = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(l),
            c = i(1),
            h = r(c),
            d = i(2),
            f = r(d);
        t.Location = function () {
            function e(t, i) {
                var r = this;
                n(this, e), this.viewer = t, this.options = i, this.containerid = t._container.id + "_location_mars_jwd", this.locationFormat = i.format || "<div>经度:{x}</div> <div>纬度:{y}</div> <div>海拔：{z}米</div> <div>方向：{heading}度</div> <div>俯仰角：{pitch}度</div>  <div>视高：{height}米</div>";
                var o = '<div id="' + this.containerid + '"  class="location-bar animation-slide-bottom no-print" ></div>';
                if ((0, u.default)("#" + t._container.id).prepend(o), i.style ? (0, u.default)("#" + this.containerid).css(i.style) : (0, u.default)("#" + this.containerid).css({
                        left: t.animation ? "170px" : "0",
                        right: "0",
                        bottom: t.timeline ? "25px" : "0"
                    }), this.locationData = {}, this.locationData.height = h.formatNum(t.camera.positionCartographic.height, 1), this.locationData.heading = h.formatNum(s.Math.toDegrees(t.camera.heading), 0), this.locationData.pitch = h.formatNum(s.Math.toDegrees(t.camera.pitch), 0), s.defaultValue(this.options.bindEvent, !0)) {
                    var a = new s.ScreenSpaceEventHandler(t.scene.canvas);
                    a.setInputAction(function (e) {
                        r.updateData(e)
                    }, s.ScreenSpaceEventType.MOUSE_MOVE), this.handler = a
                }
                t.scene.camera.changed.addEventListener(this.updaeCamera, this)
            }
            return o(e, [{
                key: "updateData",
                value: function (e) {
                    var t = h.getCurrentMousePosition(this.viewer.scene, e.endPosition);
                    if (t) {
                        var i = s.Cartographic.fromCartesian(t);
                        this.locationData.z = h.formatNum(i.height / this.viewer.scene.terrainExaggeration, 1);
                        var r = s.Math.toDegrees(i.longitude),
                            n = s.Math.toDegrees(i.latitude);
                        switch (this.options.crs) {
                            default:
                                var o = this.options.hasOwnProperty("toFixed") ? this.options.toFixed : 6;
                                this.locationData.x = h.formatNum(r, o), this.locationData.y = h.formatNum(n, o);
                                break;
                            case "degree":
                                this.locationData.x = f.formatDegree(r), this.locationData.y = f.formatDegree(n);
                                break;
                            case "project":
                                var o = this.options.hasOwnProperty("toFixed") ? this.options.toFixed : 0;
                                this.locationData.x = h.formatNum(t.x, o), this.locationData.y = h.formatNum(t.y, o);
                                break;
                            case "wgs":
                                var o = this.options.hasOwnProperty("toFixed") ? this.options.toFixed : 6,
                                    a = point2wgs({
                                        x: r,
                                        y: n
                                    });
                                this.locationData.x = h.formatNum(a.x, o), this.locationData.y = h.formatNum(a.y, o);
                                break;
                            case "wgs-degree":
                                var a = point2wgs({
                                    x: r,
                                    y: n
                                });
                                this.locationData.x = f.formatDegree(a.x), this.locationData.y = f.formatDegree(a.y)
                        }
                        var l;
                        l = "function" == typeof this.locationFormat ? this.locationFormat(this.locationData) : f.template(this.locationFormat, this.locationData), (0, u.default)("#" + this.containerid).html('<div class="location-bar-content">' + l + "</div>")
                    }
                }
            }, {
                key: "updaeCamera",
                value: function () {
                    if (this.locationData.height = h.formatNum(this.viewer.camera.positionCartographic.height, 1), this.locationData.heading = h.formatNum(s.Math.toDegrees(this.viewer.camera.heading), 0), this.locationData.pitch = h.formatNum(s.Math.toDegrees(this.viewer.camera.pitch), 0), null != this.locationData.x) {
                        var e;
                        e = "function" == typeof this.locationFormat ? this.locationFormat(this.locationData) : f.template(this.locationFormat, this.locationData), (0, u.default)("#" + this.containerid).html('<div class="location-bar-content">' + e + "</div>")
                    }
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.camera.changed.removeEventListener(this.updaeCamera, this), this.handler && (this.handler.destroy(), delete this.handler), (0, u.default)("#" + this.containerid).remove()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.MouseZoomStyle = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = r(a),
            l = i(5),
            u = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(l),
            c = i(1),
            h = r(c),
            d = i(2);
        r(d), t.MouseZoomStyle = function () {
            function e(t, i) {
                n(this, e), this.viewer = t, this.options = i;
                var r = t._container.id + "-mousezoom";
                this.containerid = r, (0, u.default)("#" + t._container.id).append('<div id="' + this.containerid + '" class="cesium-mousezoom"><div class="zoomimg"/></div>');
                var o = -1,
                    a = new s.ScreenSpaceEventHandler(this.viewer.scene.canvas);
                a.setInputAction(function (e) {
                    (0, u.default)("#" + r).addClass("cesium-mousezoom-visible"), clearTimeout(o), o = setTimeout(function () {
                        (0, u.default)("#" + r).removeClass("cesium-mousezoom-visible")
                    }, 200)
                }, s.ScreenSpaceEventType.WHEEL), a.setInputAction(function (e) {
                    h.getCurrentMousePosition(t.scene, e.position) && (t.camera.positionCartographic.height > t.scene.screenSpaceCameraController.minimumCollisionTerrainHeight || (a.removeInputAction(s.ScreenSpaceEventType.MOUSE_MOVE), clearTimeout(o), (0, u.default)("#" + r).css({
                        top: e.position.y + "px",
                        left: e.position.x + "px"
                    }), (0, u.default)("#" + r).addClass("cesium-mousezoom-visible")))
                }, s.ScreenSpaceEventType.MIDDLE_DOWN), a.setInputAction(function (e) {
                    (0, u.default)("#" + r).removeClass("cesium-mousezoom-visible"), a.setInputAction(function (e) {
                        (0, u.default)("#" + r).css({
                            top: e.endPosition.y + "px",
                            left: e.endPosition.x + "px"
                        })
                    }, s.ScreenSpaceEventType.MOUSE_MOVE)
                }, s.ScreenSpaceEventType.MIDDLE_UP), this.handler = a
            }
            return o(e, [{
                key: "destroy",
                value: function () {
                    this.handler && (this.handler.destroy(), delete this.handler), (0, u.default)("#" + this.containerid).remove()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.GaodePOIGeocoder = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = r(a),
            l = i(25),
            u = r(l),
            c = i(2);
        t.GaodePOIGeocoder = function () {
            function e(t) {
                n(this, e), t = t || {}, this.citycode = t.citycode || "", this.gaodekey = t.key || ["f2fedb9b08ae13d22f1692cd472d345e", "81825d9f2bafbb14f235d2779be90c0f", "b185732970a4487de104fa71ef575f29", "2e6ca4aeb6867fb637a5bee8333e5d3a", "027187040fa924e56048468aaa77b62c"]
            }
            return o(e, [{
                key: "getOneKey",
                value: function () {
                    var e = this.gaodekey;
                    return e[Math.floor(Math.random() * e.length + 1) - 1]
                }
            }, {
                key: "geocode",
                value: function (e, t) {
                    var i = this,
                        r = this.getOneKey();
                    return new s.Resource({
                        url: "http://restapi.amap.com/v3/place/text",
                        queryParameters: {
                            key: r,
                            city: this.citycode,
                            keywords: e
                        }
                    }).fetchJson().then(function (t) {
                        if (0 == t.status) return void(0, c.msg)("请求失败(" + t.infocode + ")：" + t.info);
                        if (0 === t.pois.length) return void(0, c.msg)("未查询到“" + e + "”相关数据！");
                        var r = 3e3;
                        return i.viewer.camera.positionCartographic.height < r && (r = i.viewer.camera.positionCartographic.height), t.pois.map(function (e) {
                            var t = e.location.split(",");
                            t = u.gcj2wgs(t);
                            var n = i.viewer.wutu.point2map({
                                x: t[0],
                                y: t[1]
                            });
                            return {
                                displayName: e.name,
                                destination: s.Cartesian3.fromDegrees(n.x, n.y, r)
                            }
                        })
                    })
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function n(e, t) {
            var i = e.scene.globe,
                r = [],
                n = a.defined(i._material) && (i._material.shaderSource.match(/slope/) || i._material.shaderSource.match("normalEC")),
                o = [l.default];
            !a.defined(i._material) || n && !i._terrainProvider.requestVertexNormals ? i._surface._tileProvider.uniformMap = void 0 : (o.push(i._material.shaderSource), i._surface._tileProvider.uniformMap = i._material._uniforms), r.push(t), o.push(d.default), i._surfaceShaderSet.baseVertexShaderSource = new a.ShaderSource({
                sources: [l.default, c.default],
                defines: r
            }), i._surfaceShaderSet.baseFragmentShaderSource = new a.ShaderSource({
                sources: o,
                defines: r
            }), i._surfaceShaderSet.material = i._material
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.addDefine = n;
        var o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(106),
            l = r(s),
            u = i(107),
            c = r(u),
            h = i(108),
            d = r(h)
    }, function (e, t) {
        e.exports = "/*!\r\n * Atmosphere code:\r\n *\r\n * Copyright (c) 2000-2005, Sean O'Neil (s_p_oneil@hotmail.com)\r\n * All rights reserved.\r\n *\r\n * Redistribution and use in source and binary forms, with or without\r\n * modification, are permitted provided that the following conditions\r\n * are met:\r\n *\r\n * * Redistributions of source code must retain the above copyright notice,\r\n *   this list of conditions and the following disclaimer.\r\n * * Redistributions in binary form must reproduce the above copyright notice,\r\n *   this list of conditions and the following disclaimer in the documentation\r\n *   and/or other materials provided with the distribution.\r\n * * Neither the name of the project nor the names of its contributors may be\r\n *   used to endorse or promote products derived from this software without\r\n *   specific prior written permission.\r\n *\r\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\r\n * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\r\n * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\r\n * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE\r\n * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\r\n * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\r\n * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\r\n * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\r\n * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\r\n * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\r\n *\r\n * Modifications made by Analytical Graphics, Inc.\r\n */\r\n\r\n // Atmosphere:\r\n //   Code:  http://sponeil.net/\r\n //   GPU Gems 2 Article:  http://http.developer.nvidia.com/GPUGems2/gpugems2_chapter16.html\r\n\r\nconst float fInnerRadius = 6378137.0;\r\nconst float fOuterRadius = 6378137.0 * 1.025;\r\nconst float fOuterRadius2 = fOuterRadius * fOuterRadius;\r\n\r\nconst float Kr = 0.0025;\r\nconst float Km = 0.0015;\r\nconst float ESun = 15.0;\r\n\r\nconst float fKrESun = Kr * ESun;\r\nconst float fKmESun = Km * ESun;\r\nconst float fKr4PI = Kr * 4.0 * czm_pi;\r\nconst float fKm4PI = Km * 4.0 * czm_pi;\r\n\r\nconst float fScale = 1.0 / (fOuterRadius - fInnerRadius);\r\nconst float fScaleDepth = 0.25;\r\nconst float fScaleOverScaleDepth = fScale / fScaleDepth;\r\n\r\nstruct AtmosphereColor\r\n{\r\n    vec3 mie;\r\n    vec3 rayleigh;\r\n};\r\n\r\nconst int nSamples = 2;\r\nconst float fSamples = 2.0;\r\n\r\nfloat scale(float fCos)\r\n{\r\n    float x = 1.0 - fCos;\r\n    return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\r\n}\r\n\r\nAtmosphereColor computeGroundAtmosphereFromSpace(vec3 v3Pos, bool useSunLighting)\r\n{\r\n\tvec3 v3InvWavelength = vec3(1.0 / pow(0.650, 4.0), 1.0 / pow(0.570, 4.0), 1.0 / pow(0.475, 4.0));\r\n\r\n    // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\r\n    vec3 v3Ray = v3Pos - czm_viewerPositionWC;\r\n    float fFar = length(v3Ray);\r\n    v3Ray /= fFar;\r\n\r\n    float fCameraHeight = length(czm_viewerPositionWC);\r\n    float fCameraHeight2 = fCameraHeight * fCameraHeight;\r\n\r\n    // This next line is an ANGLE workaround. It is equivalent to B = 2.0 * dot(czm_viewerPositionWC, v3Ray),\r\n    // which is what it should be, but there are problems at the poles.\r\n    float B = 2.0 * length(czm_viewerPositionWC) * dot(normalize(czm_viewerPositionWC), v3Ray);\r\n    float C = fCameraHeight2 - fOuterRadius2;\r\n    float fDet = max(0.0, B*B - 4.0 * C);\r\n    float fNear = 0.5 * (-B - sqrt(fDet));\r\n\r\n    // Calculate the ray's starting position, then calculate its scattering offset\r\n    vec3 v3Start = czm_viewerPositionWC + v3Ray * fNear;\r\n    fFar -= fNear;\r\n    float fDepth = exp((fInnerRadius - fOuterRadius) / fScaleDepth);\r\n\r\n    // The light angle based on the sun position would be:\r\n    //    dot(czm_sunDirectionWC, v3Pos) / length(v3Pos);\r\n    // When we want the atmosphere to be uniform over the globe so it is set to 1.0.\r\n\r\n    float fLightAngle = czm_branchFreeTernary(useSunLighting, dot(czm_sunDirectionWC, v3Pos) / length(v3Pos), 1.0);\r\n    float fCameraAngle = dot(-v3Ray, v3Pos) / length(v3Pos);\r\n    float fCameraScale = scale(fCameraAngle);\r\n    float fLightScale = scale(fLightAngle);\r\n    float fCameraOffset = fDepth*fCameraScale;\r\n    float fTemp = (fLightScale + fCameraScale);\r\n\r\n    // Initialize the scattering loop variables\r\n    float fSampleLength = fFar / fSamples;\r\n    float fScaledLength = fSampleLength * fScale;\r\n    vec3 v3SampleRay = v3Ray * fSampleLength;\r\n    vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\r\n\r\n    // Now loop through the sample rays\r\n    vec3 v3FrontColor = vec3(0.0);\r\n    vec3 v3Attenuate = vec3(0.0);\r\n    for(int i=0; i<nSamples; i++)\r\n    {\r\n        float fHeight = length(v3SamplePoint);\r\n        float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\r\n        float fScatter = fDepth*fTemp - fCameraOffset;\r\n        v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\r\n        v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\r\n        v3SamplePoint += v3SampleRay;\r\n    }\r\n\r\n    AtmosphereColor color;\r\n    color.mie = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);\r\n    color.rayleigh = v3Attenuate; // Calculate the attenuation factor for the ground\r\n\r\n    return color;\r\n}\r\n\r\n"
    }, function (e, t) {
        e.exports = "#ifdef QUANTIZATION_BITS12\r\nattribute vec4 compressed0;\r\nattribute float compressed1;\r\n#else\r\nattribute vec4 position3DAndHeight;\r\nattribute vec4 textureCoordAndEncodedNormals;\r\n#endif\r\n\r\nuniform vec3 u_center3D;\r\nuniform mat4 u_modifiedModelView;\r\nuniform mat4 u_modifiedModelViewProjection;\r\nuniform vec4 u_tileRectangle;\r\n\r\n// Uniforms for 2D Mercator projection\r\nuniform vec2 u_southAndNorthLatitude;\r\nuniform vec2 u_southMercatorYAndOneOverHeight;\r\n\r\nvarying vec3 v_positionMC;\r\nvarying vec3 v_positionEC;\r\n\r\nvarying vec3 v_textureCoordinates;\r\nvarying vec3 v_normalMC;\r\nvarying vec3 v_normalEC;\r\n\r\n#ifdef APPLY_MATERIAL\r\nvarying float v_slope;\r\nvarying float v_aspect;\r\nvarying float v_height;\r\n#endif\r\n\r\n#if defined(FOG) || defined(GROUND_ATMOSPHERE)\r\nvarying float v_distance;\r\nvarying vec3 v_fogMieColor;\r\nvarying vec3 v_fogRayleighColor;\r\n#endif\r\n\r\n// These functions are generated at runtime.\r\nvec4 getPosition(vec3 position, float height, vec2 textureCoordinates);\r\nfloat get2DYPositionFraction(vec2 textureCoordinates);\r\n\r\nvec4 getPosition3DMode(vec3 position, float height, vec2 textureCoordinates)\r\n{\r\n    return u_modifiedModelViewProjection * vec4(position, 1.0);\r\n}\r\n\r\nfloat get2DMercatorYPositionFraction(vec2 textureCoordinates)\r\n{\r\n    // The width of a tile at level 11, in radians and assuming a single root tile, is\r\n    //   2.0 * czm_pi / pow(2.0, 11.0)\r\n    // We want to just linearly interpolate the 2D position from the texture coordinates\r\n    // when we're at this level or higher.  The constant below is the expression\r\n    // above evaluated and then rounded up at the 4th significant digit.\r\n    const float maxTileWidth = 0.003068;\r\n    float positionFraction = textureCoordinates.y;\r\n    float southLatitude = u_southAndNorthLatitude.x;\r\n    float northLatitude = u_southAndNorthLatitude.y;\r\n    if (northLatitude - southLatitude > maxTileWidth)\r\n    {\r\n        float southMercatorY = u_southMercatorYAndOneOverHeight.x;\r\n        float oneOverMercatorHeight = u_southMercatorYAndOneOverHeight.y;\r\n\r\n        float currentLatitude = mix(southLatitude, northLatitude, textureCoordinates.y);\r\n        currentLatitude = clamp(currentLatitude, -czm_webMercatorMaxLatitude, czm_webMercatorMaxLatitude);\r\n        positionFraction = czm_latitudeToWebMercatorFraction(currentLatitude, southMercatorY, oneOverMercatorHeight);\r\n    }\r\n    return positionFraction;\r\n}\r\n\r\nfloat get2DGeographicYPositionFraction(vec2 textureCoordinates)\r\n{\r\n    return textureCoordinates.y;\r\n}\r\n\r\nvec4 getPositionPlanarEarth(vec3 position, float height, vec2 textureCoordinates)\r\n{\r\n    float yPositionFraction = get2DYPositionFraction(textureCoordinates);\r\n    vec4 rtcPosition2D = vec4(height, mix(u_tileRectangle.st, u_tileRectangle.pq, vec2(textureCoordinates.x, yPositionFraction)), 1.0);\r\n    return u_modifiedModelViewProjection * rtcPosition2D;\r\n}\r\n\r\nvec4 getPosition2DMode(vec3 position, float height, vec2 textureCoordinates)\r\n{\r\n    return getPositionPlanarEarth(position, 0.0, textureCoordinates);\r\n}\r\n\r\nvec4 getPositionColumbusViewMode(vec3 position, float height, vec2 textureCoordinates)\r\n{\r\n    return getPositionPlanarEarth(position, height, textureCoordinates);\r\n}\r\n\r\nvec4 getPositionMorphingMode(vec3 position, float height, vec2 textureCoordinates)\r\n{\r\n    // We do not do RTC while morphing, so there is potential for jitter.\r\n    // This is unlikely to be noticeable, though.\r\n    vec3 position3DWC = position + u_center3D;\r\n    float yPositionFraction = get2DYPositionFraction(textureCoordinates);\r\n    vec4 position2DWC = vec4(height, mix(u_tileRectangle.st, u_tileRectangle.pq, vec2(textureCoordinates.x, yPositionFraction)), 1.0);\r\n    vec4 morphPosition = czm_columbusViewMorph(position2DWC, vec4(position3DWC, 1.0), czm_morphTime);\r\n    return czm_modelViewProjection * morphPosition;\r\n}\r\n\r\n#ifdef QUANTIZATION_BITS12\r\nuniform vec2 u_minMaxHeight;\r\nuniform mat4 u_scaleAndBias;\r\n#endif\r\n\r\nvoid main()\r\n{\r\n#ifdef QUANTIZATION_BITS12\r\n    vec2 xy = czm_decompressTextureCoordinates(compressed0.x);\r\n    vec2 zh = czm_decompressTextureCoordinates(compressed0.y);\r\n    vec3 position = vec3(xy, zh.x);\r\n    float height = zh.y;\r\n    vec2 textureCoordinates = czm_decompressTextureCoordinates(compressed0.z);\r\n\r\n    height = height * (u_minMaxHeight.y - u_minMaxHeight.x) + u_minMaxHeight.x;\r\n    position = (u_scaleAndBias * vec4(position, 1.0)).xyz;\r\n\r\n#if (defined(ENABLE_VERTEX_LIGHTING) || defined(GENERATE_POSITION_AND_NORMAL)) && defined(INCLUDE_WEB_MERCATOR_Y)\r\n    float webMercatorT = czm_decompressTextureCoordinates(compressed0.w).x;\r\n    float encodedNormal = compressed1;\r\n#elif defined(INCLUDE_WEB_MERCATOR_Y)\r\n    float webMercatorT = czm_decompressTextureCoordinates(compressed0.w).x;\r\n    float encodedNormal = 0.0;\r\n#elif defined(ENABLE_VERTEX_LIGHTING) || defined(GENERATE_POSITION_AND_NORMAL)\r\n    float webMercatorT = textureCoordinates.y;\r\n    float encodedNormal = compressed0.w;\r\n#else\r\n    float webMercatorT = textureCoordinates.y;\r\n    float encodedNormal = 0.0;\r\n#endif\r\n\r\n#else\r\n    // A single float per element\r\n    vec3 position = position3DAndHeight.xyz;\r\n    float height = position3DAndHeight.w;\r\n    vec2 textureCoordinates = textureCoordAndEncodedNormals.xy;\r\n\r\n#if (defined(ENABLE_VERTEX_LIGHTING) || defined(GENERATE_POSITION_AND_NORMAL) || defined(APPLY_MATERIAL)) && defined(INCLUDE_WEB_MERCATOR_Y)\r\n    float webMercatorT = textureCoordAndEncodedNormals.z;\r\n    float encodedNormal = textureCoordAndEncodedNormals.w;\r\n#elif defined(ENABLE_VERTEX_LIGHTING) || defined(GENERATE_POSITION_AND_NORMAL) || defined(APPLY_MATERIAL)\r\n    float webMercatorT = textureCoordinates.y;\r\n    float encodedNormal = textureCoordAndEncodedNormals.z;\r\n#elif defined(INCLUDE_WEB_MERCATOR_Y)\r\n    float webMercatorT = textureCoordAndEncodedNormals.z;\r\n    float encodedNormal = 0.0;\r\n#else\r\n    float webMercatorT = textureCoordinates.y;\r\n    float encodedNormal = 0.0;\r\n#endif\r\n\r\n#endif\r\n\r\n    vec3 position3DWC = position + u_center3D;\r\n    gl_Position = getPosition(position, height, textureCoordinates);\r\n\r\n    v_textureCoordinates = vec3(textureCoordinates, webMercatorT);\r\n\r\n#if defined(ENABLE_VERTEX_LIGHTING) || defined(GENERATE_POSITION_AND_NORMAL) || defined(APPLY_MATERIAL)\r\n    v_positionEC = (u_modifiedModelView * vec4(position, 1.0)).xyz;\r\n    v_positionMC = position3DWC;  // position in model coordinates\r\n    vec3 normalMC = czm_octDecode(encodedNormal);\r\n    v_normalMC = normalMC;\r\n    v_normalEC = czm_normal3D * v_normalMC;\r\n#elif defined(SHOW_REFLECTIVE_OCEAN) || defined(ENABLE_DAYNIGHT_SHADING) || defined(GENERATE_POSITION) || defined(HDR)\r\n    v_positionEC = (u_modifiedModelView * vec4(position, 1.0)).xyz;\r\n    v_positionMC = position3DWC;  // position in model coordinates\r\n#endif\r\n\r\n#if defined(FOG) || defined(GROUND_ATMOSPHERE)\r\n    AtmosphereColor atmosFogColor = computeGroundAtmosphereFromSpace(position3DWC, false);\r\n    v_fogMieColor = atmosFogColor.mie;\r\n    v_fogRayleighColor = atmosFogColor.rayleigh;\r\n    v_distance = length((czm_modelView3D * vec4(position3DWC, 1.0)).xyz);\r\n#endif\r\n\r\n#ifdef APPLY_MATERIAL\r\n    float northPoleZ = czm_getWgs84EllipsoidEC().radii.z;\r\n    vec3 northPolePositionMC = vec3(0.0, 0.0, northPoleZ);\r\n    vec3 ellipsoidNormal = normalize(v_positionMC); // For a sphere this is correct, but not generally for an ellipsoid.\r\n    vec3 vectorEastMC = normalize(cross(northPolePositionMC - v_positionMC, ellipsoidNormal));\r\n    float dotProd = abs(dot(ellipsoidNormal, v_normalMC));\r\n    v_slope = acos(dotProd);\r\n    vec3 normalRejected = ellipsoidNormal * dotProd;\r\n    vec3 normalProjected = v_normalMC - normalRejected;\r\n    vec3 aspectVector = normalize(normalProjected);\r\n    v_aspect = acos(dot(aspectVector, vectorEastMC));\r\n    float determ = dot(cross(vectorEastMC, aspectVector), ellipsoidNormal);\r\n    v_aspect = czm_branchFreeTernary(determ < 0.0, 2.0 * czm_pi - v_aspect, v_aspect);\r\n    v_height = height;\r\n#endif\r\n}\r\n"
    }, function (e, t) {
        e.exports = "uniform vec4 u_initialColor;\r\n\r\n#ifdef WAJUE\r\n//淹没与挖掘分析  史廷春\r\nuniform bool excavateDig;\r\nuniform mat4 dig_pos_x;\r\nuniform mat4 dig_pos_y;\r\nuniform mat4 dig_pos_z;\r\nuniform int dig_max_index;\r\nuniform bool showSelfOnly;\r\n#endif\r\n\r\n#if TEXTURE_UNITS > 0\r\nuniform sampler2D u_dayTextures[TEXTURE_UNITS];\r\nuniform vec4 u_dayTextureTranslationAndScale[TEXTURE_UNITS];\r\nuniform bool u_dayTextureUseWebMercatorT[TEXTURE_UNITS];\r\n\r\n#ifdef APPLY_ALPHA\r\nuniform float u_dayTextureAlpha[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_SPLIT\r\nuniform float u_dayTextureSplit[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_BRIGHTNESS\r\nuniform float u_dayTextureBrightness[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_CONTRAST\r\nuniform float u_dayTextureContrast[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_HUE\r\nuniform float u_dayTextureHue[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_SATURATION\r\nuniform float u_dayTextureSaturation[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_GAMMA\r\nuniform float u_dayTextureOneOverGamma[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_IMAGERY_CUTOUT\r\nuniform vec4 u_dayTextureCutoutRectangles[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef APPLY_COLOR_TO_ALPHA\r\nuniform vec4 u_colorsToAlpha[TEXTURE_UNITS];\r\n#endif\r\n\r\nuniform vec4 u_dayTextureTexCoordsRectangle[TEXTURE_UNITS];\r\n#endif\r\n\r\n#ifdef SHOW_REFLECTIVE_OCEAN\r\nuniform sampler2D u_waterMask;\r\nuniform vec4 u_waterMaskTranslationAndScale;\r\nuniform float u_zoomedOutOceanSpecularIntensity;\r\n#endif\r\n\r\n#ifdef SHOW_OCEAN_WAVES\r\nuniform sampler2D u_oceanNormalMap;\r\n#endif\r\n\r\n#if defined(ENABLE_DAYNIGHT_SHADING) || defined(GROUND_ATMOSPHERE)\r\nuniform vec2 u_lightingFadeDistance;\r\n#endif\r\n\r\n#ifdef TILE_LIMIT_RECTANGLE\r\nuniform vec4 u_cartographicLimitRectangle;\r\n#endif\r\n\r\n#ifdef GROUND_ATMOSPHERE\r\nuniform vec2 u_nightFadeDistance;\r\n#endif\r\n\r\n#ifdef ENABLE_CLIPPING_PLANES\r\nuniform sampler2D u_clippingPlanes;\r\nuniform mat4 u_clippingPlanesMatrix;\r\nuniform vec4 u_clippingPlanesEdgeStyle;\r\n#endif\r\n\r\n#if defined(FOG) && (defined(ENABLE_VERTEX_LIGHTING) || defined(ENABLE_DAYNIGHT_SHADING)) || defined(GROUND_ATMOSPHERE)\r\nuniform float u_minimumBrightness;\r\n#endif\r\n\r\n#ifdef COLOR_CORRECT\r\nuniform vec3 u_hsbShift; // Hue, saturation, brightness\r\n#endif\r\n\r\n#ifdef HIGHLIGHT_FILL_TILE\r\nuniform vec4 u_fillHighlightColor;\r\n#endif\r\n\r\nvarying vec3 v_positionMC;\r\nvarying vec3 v_positionEC;\r\nvarying vec3 v_textureCoordinates;\r\nvarying vec3 v_normalMC;\r\nvarying vec3 v_normalEC;\r\n\r\n\r\n\r\n\r\n#ifdef APPLY_MATERIAL\r\n//淹没与挖掘分析  史廷春\r\nuniform mat4 ym_pos_x;\r\nuniform mat4 ym_pos_y;\r\nuniform mat4 ym_pos_z;\r\nuniform int ym_max_index;\r\nuniform bool globe;\r\nuniform bool showElseArea;\r\n\r\n\r\nvarying float v_height;\r\nvarying float v_slope;\r\nvarying float v_aspect;\r\n#endif\r\n\r\n#if defined(FOG) || defined(GROUND_ATMOSPHERE)\r\nvarying float v_distance;\r\nvarying vec3 v_fogRayleighColor;\r\nvarying vec3 v_fogMieColor;\r\n#endif\r\n\r\n#ifdef GROUND_ATMOSPHERE\r\nvarying vec3 v_rayleighColor;\r\nvarying vec3 v_mieColor;\r\n#endif\r\n\r\nvec4 sampleAndBlend(\r\n    vec4 previousColor,\r\n    sampler2D textureToSample,\r\n    vec2 tileTextureCoordinates,\r\n    vec4 textureCoordinateRectangle,\r\n    vec4 textureCoordinateTranslationAndScale,\r\n    float textureAlpha,\r\n    float textureBrightness,\r\n    float textureContrast,\r\n    float textureHue,\r\n    float textureSaturation,\r\n    float textureOneOverGamma,\r\n    float split,\r\n    vec4 colorToAlpha)\r\n{\r\n    // This crazy step stuff sets the alpha to 0.0 if this following condition is true:\r\n    //    tileTextureCoordinates.s < textureCoordinateRectangle.s ||\r\n    //    tileTextureCoordinates.s > textureCoordinateRectangle.p ||\r\n    //    tileTextureCoordinates.t < textureCoordinateRectangle.t ||\r\n    //    tileTextureCoordinates.t > textureCoordinateRectangle.q\r\n    // In other words, the alpha is zero if the fragment is outside the rectangle\r\n    // covered by this texture.  Would an actual 'if' yield better performance?\r\n    vec2 alphaMultiplier = step(textureCoordinateRectangle.st, tileTextureCoordinates);\r\n    textureAlpha = textureAlpha * alphaMultiplier.x * alphaMultiplier.y;\r\n\r\n    alphaMultiplier = step(vec2(0.0), textureCoordinateRectangle.pq - tileTextureCoordinates);\r\n    textureAlpha = textureAlpha * alphaMultiplier.x * alphaMultiplier.y;\r\n\r\n    vec2 translation = textureCoordinateTranslationAndScale.xy;\r\n    vec2 scale = textureCoordinateTranslationAndScale.zw;\r\n    vec2 textureCoordinates = tileTextureCoordinates * scale + translation;\r\n    vec4 value = texture2D(textureToSample, textureCoordinates);\r\n    vec3 color = value.rgb;\r\n    float alpha = value.a;\r\n\r\n#ifdef APPLY_COLOR_TO_ALPHA\r\n    vec3 colorDiff = abs(color.rgb - colorToAlpha.rgb);\r\n    colorDiff.r = max(max(colorDiff.r, colorDiff.g), colorDiff.b);\r\n    alpha = czm_branchFreeTernary(colorDiff.r < colorToAlpha.a, 0.0, alpha);\r\n#endif\r\n\r\n#if !defined(APPLY_GAMMA)\r\n    vec4 tempColor = czm_gammaCorrect(vec4(color, alpha));\r\n    color = tempColor.rgb;\r\n    alpha = tempColor.a;\r\n#else\r\n    color = pow(color, vec3(textureOneOverGamma));\r\n#endif\r\n\r\n#ifdef APPLY_SPLIT\r\n    float splitPosition = czm_imagerySplitPosition;\r\n    // Split to the left\r\n    if (split < 0.0 && gl_FragCoord.x > splitPosition) {\r\n       alpha = 0.0;\r\n    }\r\n    // Split to the right\r\n    else if (split > 0.0 && gl_FragCoord.x < splitPosition) {\r\n       alpha = 0.0;\r\n    }\r\n#endif\r\n\r\n#ifdef APPLY_BRIGHTNESS\r\n    color = mix(vec3(0.0), color, textureBrightness);\r\n#endif\r\n\r\n#ifdef APPLY_CONTRAST\r\n    color = mix(vec3(0.5), color, textureContrast);\r\n#endif\r\n\r\n#ifdef APPLY_HUE\r\n    color = czm_hue(color, textureHue);\r\n#endif\r\n\r\n#ifdef APPLY_SATURATION\r\n    color = czm_saturation(color, textureSaturation);\r\n#endif\r\n\r\n    float sourceAlpha = alpha * textureAlpha;\r\n    float outAlpha = mix(previousColor.a, 1.0, sourceAlpha);\r\n    outAlpha += sign(outAlpha) - 1.0;\r\n\r\n    vec3 outColor = mix(previousColor.rgb * previousColor.a, color, sourceAlpha) / outAlpha;\r\n\r\n    // When rendering imagery for a tile in multiple passes,\r\n    // some GPU/WebGL implementation combinations will not blend fragments in\r\n    // additional passes correctly if their computation includes an unmasked\r\n    // divide-by-zero operation,\r\n    // even if it's not in the output or if the output has alpha zero.\r\n    //\r\n    // For example, without sanitization for outAlpha,\r\n    // this renders without artifacts:\r\n    //   if (outAlpha == 0.0) { outColor = vec3(0.0); }\r\n    //\r\n    // but using czm_branchFreeTernary will cause portions of the tile that are\r\n    // alpha-zero in the additional pass to render as black instead of blending\r\n    // with the previous pass:\r\n    //   outColor = czm_branchFreeTernary(outAlpha == 0.0, vec3(0.0), outColor);\r\n    //\r\n    // So instead, sanitize against divide-by-zero,\r\n    // store this state on the sign of outAlpha, and correct on return.\r\n\r\n    return vec4(outColor, max(outAlpha, 0.0));\r\n}\r\n\r\nvec3 colorCorrect(vec3 rgb) {\r\n#ifdef COLOR_CORRECT\r\n    // Convert rgb color to hsb\r\n    vec3 hsb = czm_RGBToHSB(rgb);\r\n    // Perform hsb shift\r\n    hsb.x += u_hsbShift.x; // hue\r\n    hsb.y = clamp(hsb.y + u_hsbShift.y, 0.0, 1.0); // saturation\r\n    hsb.z = hsb.z > czm_epsilon7 ? hsb.z + u_hsbShift.z : 0.0; // brightness\r\n    // Convert shifted hsb back to rgb\r\n    rgb = czm_HSBToRGB(hsb);\r\n#endif\r\n    return rgb;\r\n}\r\n\r\nvec4 computeDayColor(vec4 initialColor, vec3 textureCoordinates);\r\nvec4 computeWaterColor(vec3 positionEyeCoordinates, vec2 textureCoordinates, mat3 enuToEye, vec4 imageryColor, float specularMapValue, float fade);\r\n\r\nvoid main()\r\n{\r\n#ifdef TILE_LIMIT_RECTANGLE\r\n    if (v_textureCoordinates.x < u_cartographicLimitRectangle.x || u_cartographicLimitRectangle.z < v_textureCoordinates.x ||\r\n        v_textureCoordinates.y < u_cartographicLimitRectangle.y || u_cartographicLimitRectangle.w < v_textureCoordinates.y)\r\n        {\r\n            discard;\r\n        }\r\n#endif\r\n\r\n#ifdef ENABLE_CLIPPING_PLANES\r\n    float clipDistance = clip(gl_FragCoord, u_clippingPlanes, u_clippingPlanesMatrix);\r\n#endif\r\n\r\n    // The clamp below works around an apparent bug in Chrome Canary v23.0.1241.0\r\n    // where the fragment shader sees textures coordinates < 0.0 and > 1.0 for the\r\n    // fragments on the edges of tiles even though the vertex shader is outputting\r\n    // coordinates strictly in the 0-1 range.\r\n    vec4 color = computeDayColor(u_initialColor, clamp(v_textureCoordinates, 0.0, 1.0));\r\n\r\n#ifdef SHOW_TILE_BOUNDARIES\r\n    if (v_textureCoordinates.x < (1.0/256.0) || v_textureCoordinates.x > (255.0/256.0) ||\r\n        v_textureCoordinates.y < (1.0/256.0) || v_textureCoordinates.y > (255.0/256.0))\r\n    {\r\n        color = vec4(1.0, 0.0, 0.0, 1.0);\r\n    }\r\n#endif\r\n\r\n#if defined(SHOW_REFLECTIVE_OCEAN) || defined(ENABLE_DAYNIGHT_SHADING) || defined(HDR)\r\n    vec3 normalMC = czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0));   // normalized surface normal in model coordinates\r\n    vec3 normalEC = czm_normal3D * normalMC;                                         // normalized surface normal in eye coordiantes\r\n#endif\r\n\r\n#if defined(ENABLE_DAYNIGHT_SHADING) || defined(GROUND_ATMOSPHERE)\r\n    float cameraDist;\r\n    if (czm_sceneMode == czm_sceneMode2D)\r\n    {\r\n        cameraDist = max(czm_frustumPlanes.x - czm_frustumPlanes.y, czm_frustumPlanes.w - czm_frustumPlanes.z) * 0.5;\r\n    }\r\n    else if (czm_sceneMode == czm_sceneModeColumbusView)\r\n    {\r\n        cameraDist = -czm_view[3].z;\r\n    }\r\n    else\r\n    {\r\n        cameraDist = length(czm_view[3]);\r\n    }\r\n    float fadeOutDist = u_lightingFadeDistance.x;\r\n    float fadeInDist = u_lightingFadeDistance.y;\r\n    if (czm_sceneMode != czm_sceneMode3D) {\r\n        vec3 radii = czm_getWgs84EllipsoidEC().radii;\r\n        float maxRadii = max(radii.x, max(radii.y, radii.z));\r\n        fadeOutDist -= maxRadii;\r\n        fadeInDist -= maxRadii;\r\n    }\r\n    float fade = clamp((cameraDist - fadeOutDist) / (fadeInDist - fadeOutDist), 0.0, 1.0);\r\n#else\r\n    float fade = 0.0;\r\n#endif\r\n\r\n#ifdef SHOW_REFLECTIVE_OCEAN\r\n    vec2 waterMaskTranslation = u_waterMaskTranslationAndScale.xy;\r\n    vec2 waterMaskScale = u_waterMaskTranslationAndScale.zw;\r\n    vec2 waterMaskTextureCoordinates = v_textureCoordinates.xy * waterMaskScale + waterMaskTranslation;\r\n    waterMaskTextureCoordinates.y = 1.0 - waterMaskTextureCoordinates.y;\r\n\r\n    float mask = texture2D(u_waterMask, waterMaskTextureCoordinates).r;\r\n\r\n    if (mask > 0.0)\r\n    {\r\n        mat3 enuToEye = czm_eastNorthUpToEyeCoordinates(v_positionMC, normalEC);\r\n\r\n        vec2 ellipsoidTextureCoordinates = czm_ellipsoidWgs84TextureCoordinates(normalMC);\r\n        vec2 ellipsoidFlippedTextureCoordinates = czm_ellipsoidWgs84TextureCoordinates(normalMC.zyx);\r\n\r\n        vec2 textureCoordinates = mix(ellipsoidTextureCoordinates, ellipsoidFlippedTextureCoordinates, czm_morphTime * smoothstep(0.9, 0.95, normalMC.z));\r\n\r\n        color = computeWaterColor(v_positionEC, textureCoordinates, enuToEye, color, mask, fade);\r\n    }\r\n#endif\r\n\r\n#ifdef APPLY_MATERIAL\r\n    czm_materialInput materialInput;\r\n    materialInput.st = v_textureCoordinates.st;\r\n    materialInput.normalEC = normalize(v_normalEC);\r\n    materialInput.slope = v_slope;\r\n    materialInput.height = v_height;\r\n    materialInput.aspect = v_aspect;\r\n    czm_material material = czm_getMaterial(materialInput);\r\n    // color.xyz = mix(color.xyz, material.diffuse, material.alpha);\r\n    if(ym_pos_x[0][0]!=0.0){\r\n        int ym_max_index = ym_max_index;\r\n        mat3 rect = czm_HXgetFloodRect(ym_pos_x,ym_pos_y,ym_pos_z,999999999999999.0,999999999999999.0,999999999999999.0,-999999999999999.0,-999999999999999.0,-999999999999999.0,ym_max_index);\r\n        bool stc_isIn = czm_HXisInEllipsoid (v_positionMC,ym_pos_x,ym_pos_y,ym_pos_z,rect,ym_max_index);\r\n        if(globe){\r\n            color.xyz = mix(color.xyz, material.diffuse, material.alpha);\r\n        }else{\r\n            if(stc_isIn){\r\n                color.xyz = mix(color.xyz, material.diffuse, material.alpha);\r\n            }else{\r\n                if(!showElseArea){\r\n                    color.xyz = vec3(209.0/255.0,209.0/255.0,209.0/255.0);\r\n                }\r\n            }\r\n        }\r\n    }\r\n#endif\r\n\r\n#ifdef ENABLE_VERTEX_LIGHTING\r\n    float diffuseIntensity = clamp(czm_getLambertDiffuse(czm_sunDirectionEC, normalize(v_normalEC)) * 0.9 + 0.3, 0.0, 1.0);\r\n    vec4 finalColor = vec4(color.rgb * diffuseIntensity, color.a);\r\n#elif defined(ENABLE_DAYNIGHT_SHADING)\r\n    float diffuseIntensity = clamp(czm_getLambertDiffuse(czm_sunDirectionEC, normalEC) * 5.0 + 0.3, 0.0, 1.0);\r\n    diffuseIntensity = mix(1.0, diffuseIntensity, fade);\r\n    vec4 finalColor = vec4(color.rgb * diffuseIntensity, color.a);\r\n#else\r\n    vec4 finalColor = color;\r\n#endif\r\n\r\n#ifdef ENABLE_CLIPPING_PLANES\r\n    vec4 clippingPlanesEdgeColor = vec4(1.0);\r\n    clippingPlanesEdgeColor.rgb = u_clippingPlanesEdgeStyle.rgb;\r\n    float clippingPlanesEdgeWidth = u_clippingPlanesEdgeStyle.a;\r\n\r\n    if (clipDistance < clippingPlanesEdgeWidth)\r\n    {\r\n        finalColor = clippingPlanesEdgeColor;\r\n    }\r\n#endif\r\n\r\n#ifdef HIGHLIGHT_FILL_TILE\r\n    finalColor = vec4(mix(finalColor.rgb, u_fillHighlightColor.rgb, u_fillHighlightColor.a), finalColor.a);\r\n#endif\r\n\r\n#if defined(FOG) || defined(GROUND_ATMOSPHERE)\r\n    vec3 fogColor = colorCorrect(v_fogMieColor) + finalColor.rgb * colorCorrect(v_fogRayleighColor);\r\n#ifndef HDR\r\n    const float fExposure = 2.0;\r\n    fogColor = vec3(1.0) - exp(-fExposure * fogColor);\r\n#endif\r\n#endif\r\n\r\n#ifdef FOG\r\n#if defined(ENABLE_VERTEX_LIGHTING) || defined(ENABLE_DAYNIGHT_SHADING)\r\n    float darken = clamp(dot(normalize(czm_viewerPositionWC), normalize(czm_sunPositionWC)), u_minimumBrightness, 1.0);\r\n    fogColor *= darken;\r\n#endif\r\n\r\n#ifdef HDR\r\n    const float modifier = 0.15;\r\n    finalColor = vec4(czm_fog(v_distance, finalColor.rgb, fogColor, modifier), finalColor.a);\r\n#else\r\n    finalColor = vec4(czm_fog(v_distance, finalColor.rgb, fogColor), finalColor.a);\r\n#endif\r\n#endif\r\n\r\n#ifdef GROUND_ATMOSPHERE\r\n    if (czm_sceneMode != czm_sceneMode3D)\r\n    {\r\n        gl_FragColor = finalColor;\r\n        return;\r\n    }\r\n\r\n#if defined(PER_FRAGMENT_GROUND_ATMOSPHERE) && (defined(ENABLE_DAYNIGHT_SHADING) || defined(ENABLE_VERTEX_LIGHTING))\r\n    czm_ellipsoid ellipsoid = czm_getWgs84EllipsoidEC();\r\n\r\n    float mpp = czm_metersPerPixel(vec4(0.0, 0.0, -czm_currentFrustum.x, 1.0));\r\n    vec2 xy = gl_FragCoord.xy / czm_viewport.zw * 2.0 - vec2(1.0);\r\n    xy *= czm_viewport.zw * mpp * 0.5;\r\n\r\n    vec3 direction = normalize(vec3(xy, -czm_currentFrustum.x));\r\n    czm_ray ray = czm_ray(vec3(0.0), direction);\r\n\r\n    czm_raySegment intersection = czm_rayEllipsoidIntersectionInterval(ray, ellipsoid);\r\n\r\n    vec3 ellipsoidPosition = czm_pointAlongRay(ray, intersection.start);\r\n    ellipsoidPosition = (czm_inverseView * vec4(ellipsoidPosition, 1.0)).xyz;\r\n    AtmosphereColor atmosColor = computeGroundAtmosphereFromSpace(ellipsoidPosition, true);\r\n\r\n    vec3 groundAtmosphereColor = colorCorrect(atmosColor.mie) + finalColor.rgb * colorCorrect(atmosColor.rayleigh);\r\n#ifndef HDR\r\n    groundAtmosphereColor = vec3(1.0) - exp(-fExposure * groundAtmosphereColor);\r\n#endif\r\n\r\n    fadeInDist = u_nightFadeDistance.x;\r\n    fadeOutDist = u_nightFadeDistance.y;\r\n\r\n    float sunlitAtmosphereIntensity = clamp((cameraDist - fadeOutDist) / (fadeInDist - fadeOutDist), 0.0, 1.0);\r\n\r\n#ifdef HDR\r\n    // Some tweaking to make HDR look better\r\n    sunlitAtmosphereIntensity = max(sunlitAtmosphereIntensity * sunlitAtmosphereIntensity, 0.03);\r\n#endif\r\n\r\n    groundAtmosphereColor = mix(groundAtmosphereColor, fogColor, sunlitAtmosphereIntensity);\r\n#else\r\n    vec3 groundAtmosphereColor = fogColor;\r\n#endif\r\n\r\n#ifdef HDR\r\n    // Some tweaking to make HDR look better\r\n    groundAtmosphereColor = czm_saturation(groundAtmosphereColor, 1.6);\r\n#endif\r\n\r\n    finalColor = vec4(mix(finalColor.rgb, groundAtmosphereColor, fade), finalColor.a);\r\n#endif\r\n\r\n\r\n    //地形挖掘  史廷春\r\n#ifdef WAJUE\r\n    mat3 rect_dig = czm_HXgetFloodRect(dig_pos_x,dig_pos_y,dig_pos_z,999999999999999.0,999999999999999.0,999999999999999.0,-999999999999999.0,-999999999999999.0,-999999999999999.0,dig_max_index);\r\n    bool dig_isIn = czm_HXisInEllipsoid (v_positionMC,dig_pos_x,dig_pos_y,dig_pos_z,rect_dig,dig_max_index);\r\n    if(dig_isIn){\r\n        if(!showSelfOnly){\r\n            discard;\r\n        }\r\n    }else{\r\n        if(showSelfOnly){\r\n            // finalColor = vec4(209.0/255.0,209.0/255.0,209.0/255.0,1.0);\r\n            discard;\r\n        }\r\n    }\r\n#endif \r\n\r\n\r\n    gl_FragColor = vec4(finalColor.xyz,0.5);\r\n}\r\n\r\n#ifdef SHOW_REFLECTIVE_OCEAN\r\n\r\nfloat waveFade(float edge0, float edge1, float x)\r\n{\r\n    float y = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);\r\n    return pow(1.0 - y, 5.0);\r\n}\r\n\r\nfloat linearFade(float edge0, float edge1, float x)\r\n{\r\n    return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);\r\n}\r\n\r\n// Based on water rendering by Jonas Wagner:\r\n// http://29a.ch/2012/7/19/webgl-terrain-rendering-water-fog\r\n\r\n// low altitude wave settings\r\nconst float oceanFrequencyLowAltitude = 825000.0;\r\nconst float oceanAnimationSpeedLowAltitude = 0.004;\r\nconst float oceanOneOverAmplitudeLowAltitude = 1.0 / 2.0;\r\nconst float oceanSpecularIntensity = 0.5;\r\n\r\n// high altitude wave settings\r\nconst float oceanFrequencyHighAltitude = 125000.0;\r\nconst float oceanAnimationSpeedHighAltitude = 0.008;\r\nconst float oceanOneOverAmplitudeHighAltitude = 1.0 / 2.0;\r\n\r\nvec4 computeWaterColor(vec3 positionEyeCoordinates, vec2 textureCoordinates, mat3 enuToEye, vec4 imageryColor, float maskValue, float fade)\r\n{\r\n    vec3 positionToEyeEC = -positionEyeCoordinates;\r\n    float positionToEyeECLength = length(positionToEyeEC);\r\n\r\n    // The double normalize below works around a bug in Firefox on Android devices.\r\n    vec3 normalizedpositionToEyeEC = normalize(normalize(positionToEyeEC));\r\n\r\n    // Fade out the waves as the camera moves far from the surface.\r\n    float waveIntensity = waveFade(70000.0, 1000000.0, positionToEyeECLength);\r\n\r\n#ifdef SHOW_OCEAN_WAVES\r\n    // high altitude waves\r\n    float time = czm_frameNumber * oceanAnimationSpeedHighAltitude;\r\n    vec4 noise = czm_getWaterNoise(u_oceanNormalMap, textureCoordinates * oceanFrequencyHighAltitude, time, 0.0);\r\n    vec3 normalTangentSpaceHighAltitude = vec3(noise.xy, noise.z * oceanOneOverAmplitudeHighAltitude);\r\n\r\n    // low altitude waves\r\n    time = czm_frameNumber * oceanAnimationSpeedLowAltitude;\r\n    noise = czm_getWaterNoise(u_oceanNormalMap, textureCoordinates * oceanFrequencyLowAltitude, time, 0.0);\r\n    vec3 normalTangentSpaceLowAltitude = vec3(noise.xy, noise.z * oceanOneOverAmplitudeLowAltitude);\r\n\r\n    // blend the 2 wave layers based on distance to surface\r\n    float highAltitudeFade = linearFade(0.0, 60000.0, positionToEyeECLength);\r\n    float lowAltitudeFade = 1.0 - linearFade(20000.0, 60000.0, positionToEyeECLength);\r\n    vec3 normalTangentSpace =\r\n        (highAltitudeFade * normalTangentSpaceHighAltitude) +\r\n        (lowAltitudeFade * normalTangentSpaceLowAltitude);\r\n    normalTangentSpace = normalize(normalTangentSpace);\r\n\r\n    // fade out the normal perturbation as we move farther from the water surface\r\n    normalTangentSpace.xy *= waveIntensity;\r\n    normalTangentSpace = normalize(normalTangentSpace);\r\n#else\r\n    vec3 normalTangentSpace = vec3(0.0, 0.0, 1.0);\r\n#endif\r\n\r\n    vec3 normalEC = enuToEye * normalTangentSpace;\r\n\r\n    const vec3 waveHighlightColor = vec3(0.3, 0.45, 0.6);\r\n\r\n    // Use diffuse light to highlight the waves\r\n    float diffuseIntensity = czm_getLambertDiffuse(czm_sunDirectionEC, normalEC) * maskValue;\r\n    vec3 diffuseHighlight = waveHighlightColor * diffuseIntensity * (1.0 - fade);\r\n\r\n#ifdef SHOW_OCEAN_WAVES\r\n    // Where diffuse light is low or non-existent, use wave highlights based solely on\r\n    // the wave bumpiness and no particular light direction.\r\n    float tsPerturbationRatio = normalTangentSpace.z;\r\n    vec3 nonDiffuseHighlight = mix(waveHighlightColor * 5.0 * (1.0 - tsPerturbationRatio), vec3(0.0), diffuseIntensity);\r\n#else\r\n    vec3 nonDiffuseHighlight = vec3(0.0);\r\n#endif\r\n\r\n    // Add specular highlights in 3D, and in all modes when zoomed in.\r\n    float specularIntensity = czm_getSpecular(czm_sunDirectionEC, normalizedpositionToEyeEC, normalEC, 10.0) + 0.25 * czm_getSpecular(czm_moonDirectionEC, normalizedpositionToEyeEC, normalEC, 10.0);\r\n    float surfaceReflectance = mix(0.0, mix(u_zoomedOutOceanSpecularIntensity, oceanSpecularIntensity, waveIntensity), maskValue);\r\n    float specular = specularIntensity * surfaceReflectance;\r\n\r\n#ifdef HDR\r\n    specular *= 1.4;\r\n\r\n    float e = 0.2;\r\n    float d = 3.3;\r\n    float c = 1.7;\r\n\r\n    vec3 color = imageryColor.rgb + (c * (vec3(e) + imageryColor.rgb * d) * (diffuseHighlight + nonDiffuseHighlight + specular));\r\n#else\r\n    vec3 color = imageryColor.rgb + diffuseHighlight + nonDiffuseHighlight + specular;\r\n#endif\r\n\r\n    return vec4(color, imageryColor.a);\r\n}\r\n\r\n#endif // #ifdef SHOW_REFLECTIVE_OCEAN\r\n"
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.FloodByEntity = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = r(a),
            l = i(1),
            u = i(11),
            c = r(u);
        t.FloodByEntity = function () {
            function e(t) {
                n(this, e), this.viewer = t
            }
            return o(e, [{
                key: "start",
                value: function (e, t) {
                    this.stop(), this.entity = e, this.options = t;
                    var i = this;
                    this._last_depthTestAgainstTerrain = this.viewer.scene.globe.depthTestAgainstTerrain, this.viewer.scene.globe.depthTestAgainstTerrain = !0, this.extrudedHeight = t.height, this.entity.polygon.extrudedHeight = new s.CallbackProperty(function (e) {
                        return i.extrudedHeight
                    }, !1);
                    var r = c.getPositions(this.entity);
                    r = (0, l.setPositionsHeight)(r, t.height), this.entity.polygon.hierarchy = new s.PolygonHierarchy(r), this.timeIdx = setInterval(function () {
                        if (i.extrudedHeight > i.options.maxHeight) return t.onStop && t.onStop(), void i.stop();
                        i.extrudedHeight += i.options.speed, t.onChange && t.onChange(i.extrudedHeight)
                    }, 100)
                }
            }, {
                key: "stop",
                value: function () {
                    clearInterval(this.timeIdx)
                }
            }, {
                key: "clear",
                value: function () {
                    this.stop(), null !== this._last_depthTestAgainstTerrain && (this.viewer.scene.globe.depthTestAgainstTerrain = this._last_depthTestAgainstTerrain), this.entity = null
                }
            }, {
                key: "updateHeight",
                value: function (e) {
                    this.extrudedHeight = e
                }
            }, {
                key: "height",
                get: function () {
                    return this.extrudedHeight
                },
                set: function (e) {
                    this.extrudedHeight = e
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.FloodByTerrain = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        t.FloodByTerrain = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, i = i || {};
                var n = a.clone(a.ExpandByMars._defaultFloodAnalysis);
                this.minHeight = a.defaultValue(i.minHeight, a.clone(n.minHeight)), this.maxHeight = a.defaultValue(i.maxHeight, a.clone(n.maxHeight)), this._positions = a.defaultValue(i.positions, a.clone(n.positions)), this._checkArgs() && (this.floodVar = a.defaultValue(i.floodVar, a.clone(n.floodVar)), this.ym_pos_x = a.defaultValue(i.ym_pos_x, a.clone(n.ym_pos_x)), this.ym_pos_y = a.defaultValue(i.ym_pos_y, a.clone(n.ym_pos_y)), this.ym_pos_z = a.defaultValue(i.ym_pos_z, a.clone(n.ym_pos_z)), this.rect_flood = a.defaultValue(i.rect_flood, a.clone(n.rect_flood)), this.ym_max_index = a.defaultValue(i.ym_max_index, a.clone(n.ym_max_index)), this._globe = a.defaultValue(i.globe, a.clone(n.globe)), this._speed = a.defaultValue(i.speed, a.clone(n.floodSpeed)), this._visibleOutArea = a.defaultValue(i.visibleOutArea, a.clone(n.showElseArea)), this._boundingSwell = a.defaultValue(i.boundingSwell, 20), this.defaultShow = a.defaultValue(i.show, !0), this.onStop = a.defaultValue(i.onStop, null), this.height = a.defaultValue(i.height, null), this._init())
            }
            return n(e, [{
                key: "_checkArgs",
                value: function () {
                    if (void 0 == this.minHeight || void 0 == this.maxHeight) return console.log("请确认高度值为数值！"), !1;
                    if (this.minHeight > this.maxHeight) {
                        var e = this.minHeight;
                        this.minHeight = this.maxHeight, this.maxHeight = e
                    }
                    return !0
                }
            }, {
                key: "_init",
                value: function () {
                    this._positions && 0 != this._positions.length && (this._prepareFlood(this._positions), this._setFloodVar(), this._startFlood(), this._activeFloodSpeed())
                }
            }, {
                key: "setPositions",
                value: function (e) {
                    e && 0 != e.length && (this._prepareFlood(e), this._setFloodVar(), this._startFlood(), this._activeFloodSpeed())
                }
            }, {
                key: "_activeFloodSpeed",
                value: function () {
                    var e = this;
                    this.activeFlooding || (this.activeFlooding = function () {
                        e.height ? e.floodVar[1] = e.height() : e.floodVar[1] += e.speed / 50, e.floodVar[1] > e.floodVar[2] && (e.floodVar[1] = e.floodVar[2], e.cancelFloodSpeed(), e.onStop && e.onStop()), e.floodVar[1] < e.floodVar[0] && (e.floodVar[1] = e.floodVar[0], e.cancelFloodSpeed(), e.onStop && e.onStop()), a.ExpandByMars.floodAnalysis.floodVar[1] = e.floodVar[1]
                    }, this.viewer.clock.onTick.addEventListener(this.activeFlooding))
                }
            }, {
                key: "cancelFloodSpeed",
                value: function () {
                    this.viewer.clock.onTick.removeEventListener(this.activeFlooding), this.activeFlooding = null
                }
            }, {
                key: "reFlood",
                value: function () {
                    this.floodVar[1] = this.floodVar[0], this._activeFloodSpeed()
                }
            }, {
                key: "_switchShow",
                value: function () {
                    this.show ? this.viewer.scene.globe.material = a.Material.fromType("YanMo") : this.viewer.scene.globe.material = null
                }
            }, {
                key: "_prepareFlood",
                value: function (e) {
                    this.ym_pos_arr = e;
                    var t = e.length;
                    if (0 != t) {
                        this.ym_max_index = t;
                        for (var i = 99999999, r = 99999999, n = 99999999, o = -99999999, a = -99999999, s = -99999999, l = 0; l < t; l++) e[l] ? (this.ym_pos_x[l] = e[l].x, this.ym_pos_y[l] = e[l].y, this.ym_pos_z[l] = e[l].z, e[l].x > o && (o = e[l].x), e[l].x < i && (i = e[l].x), e[l].y > a && (a = e[l].y), e[l].y < r && (r = e[l].y), e[l].z > s && (s = e[l].z), e[l].z < n && (n = e[l].z)) : (this.ym_pos_x[l] = 0, this.ym_pos_y[l] = 0, this.ym_pos_z[l] = 0);
                        var u = this.boundingSwell;
                        this._base_rect = this.rect_flood = [i - u, r - u, n - u, o + u, a + u, s + u, 0, 0, 0]
                    }
                }
            }, {
                key: "_setFloodVar",
                value: function () {
                    this.floodVar = [this.minHeight, this.minHeight, this.maxHeight, this.maxHeight - this.minHeight]
                }
            }, {
                key: "_startFlood",
                value: function () {
                    a.ExpandByMars.floodAnalysis.floodVar[0] = this.floodVar[0], a.ExpandByMars.floodAnalysis.floodVar[1] = this.floodVar[1], a.ExpandByMars.floodAnalysis.ym_pos_x = this.ym_pos_x, a.ExpandByMars.floodAnalysis.ym_pos_y = this.ym_pos_y, a.ExpandByMars.floodAnalysis.ym_pos_z = this.ym_pos_z, a.ExpandByMars.floodAnalysis.rect_flood = this.rect_flood, a.ExpandByMars.floodAnalysis.ym_pos_arr = this.ym_pos_arr, a.ExpandByMars.floodAnalysis.floodSpeed = this.speed, a.ExpandByMars.floodAnalysis.ym_max_index = this.ym_max_index, a.ExpandByMars.floodAnalysis.globe = this.globe = !1, a.ExpandByMars.floodAnalysis.showElseArea = this.visibleOutArea, this.viewer.scene.globe.material = a.Material.fromType("YanMo")
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer && (this.viewer.scene.globe.material = null, this.cancelFloodSpeed()), a.ExpandByMars.resetFloodAnalysis(), delete this.activeFlooding, delete this.viewer, delete this.ym_max_height, delete this.ym_pos_x, delete this.ym_pos_y, delete this.ym_pos_z, delete this.ym_pos_arr, delete this.speed, delete this.ym_max_index, delete this.globe, delete this.maxDepthOfWater, delete this.rect_flood
                }
            }, {
                key: "visibleOutArea",
                get: function () {
                    return this._visibleOutArea
                },
                set: function (e) {
                    this._visibleOutArea = e, a.ExpandByMars.floodAnalysis.showElseArea = e
                }
            }, {
                key: "globe",
                get: function () {
                    return this._globe
                },
                set: function (e) {
                    this._globe = e, a.ExpandByMars.floodAnalysis.globe = e
                }
            }, {
                key: "speed",
                get: function () {
                    return this._speed
                },
                set: function (e) {
                    this._speed = Number(e)
                }
            }, {
                key: "boundingSwell",
                get: function () {
                    return this._boundingSwell
                },
                set: function (e) {
                    var t = this._base_rect;
                    this._boundingSwell = Number(e), this.rect_flood = [t[0] - this.boundingSwell, t[1] - this.boundingSwell, t[2] - this.boundingSwell, t[3] - this.boundingSwell, t[4] - this.boundingSwell, t[5] - this.boundingSwell, 0, 0, 0], a.ExpandByMars.floodAnalysis.rect_flood = this.rect_flood
                }
            }, {
                key: "show",
                get: function () {
                    return this.defaultShow
                },
                set: function (e) {
                    this.defaultShow = Boolean(e), this._switchShow()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Measure = void 0;
        var n = i(0),
            o = r(n),
            a = i(16),
            s = i(7),
            l = r(s),
            u = i(3),
            c = i(8),
            h = i(2),
            d = r(h),
            f = i(1),
            p = i(28),
            m = function (e) {
                function t(e) {
                    m(), x = "length", e = e || {}, e.type = x, e.hasOwnProperty("terrain") || (e.terrain = !0), M.start(e)
                }

                function i(e) {
                    m(), x = "section", e = e || {}, e.type = x, e.terrain = !0, e.splitNum = o.defaultValue(e.splitNum, 6), M.start(e)
                }

                function r(e) {
                    m(), x = "area", e = e || {}, e.type = x, T.start(e)
                }

                function n(e) {
                    m(), e = e || {}, e.hasOwnProperty("isSuper") && !e.isSuper ? (x = "height", e.type = x, S.start(e)) : (x = "super_height", e.type = x, O.start(e))
                }

                function s(e) {
                    m(), x = "angle", e = e || {}, e.type = x, D.start(e)
                }

                function h(e) {
                    m(), x = "point", e = e || {}, e.type = x, k.start(e)
                }

                function m() {
                    M.clearLastNoEnd(), T.clearLastNoEnd(), S.clearLastNoEnd(), O.clearLastNoEnd(), D.clearLastNoEnd(), k.clearLastNoEnd(), P.stopDraw()
                }

                function g() {
                    if (null != C) {
                        switch (x) {
                            case "length":
                            case "section":
                                M.showMoveDrawing(C);
                                break;
                            case "area":
                                T.showMoveDrawing(C);
                                break;
                            case "height":
                                S.showMoveDrawing(C);
                                break;
                            case "super_height":
                                O.showMoveDrawing(C);
                                break;
                            case "angle":
                                D.showMoveDrawing(C)
                        }
                        P.endDraw(), C = null
                    }
                }

                function v() {
                    x = "", m(), P.deleteAll()
                }

                function y(e, t) {
                    var i = E.entities.values;
                    for (var r in i) {
                        var n = i[r];
                        if (n.label && n.isMarsMeasureLabel && n.attribute && n.attribute.value) {
                            if (n.attribute.type != e) continue;
                            "area" == e ? n.label.text._value = (n.attribute.textEx || "") + d.formatArea(n.attribute.value, t) : n._label.text._value = (n.attribute.textEx || "") + d.formatLength(n.attribute.value, t)
                        }
                    }
                }
                var _ = e.viewer,
                    w = (0, u.getDefStyle)("label", {
                        color: "#ffffff",
                        font_size: 20,
                        border: !0,
                        border_color: "#000000",
                        border_width: 3,
                        background: !0,
                        background_color: "#000000",
                        background_opacity: .5,
                        scaleByDistance: !0,
                        scaleByDistance_far: 8e5,
                        scaleByDistance_farValue: .5,
                        scaleByDistance_near: 1e3,
                        scaleByDistance_nearValue: 1,
                        pixelOffset: [0, -15],
                        visibleDepth: !1
                    });
                if (o.defined(e.label))
                    for (var b in e.label) w[b] = e.label[b];
                var C, x = "",
                    P = new a.Draw(_, {
                        hasEdit: !1,
                        removeScreenSpaceEvent: e.removeScreenSpaceEvent
                    });
                P.on(l.DrawAddPoint, function (e) {
                    switch (C = e.entity, x) {
                        case "length":
                        case "section":
                            M.showAddPointLength(C);
                            break;
                        case "area":
                            T.showAddPointLength(C);
                            break;
                        case "height":
                            S.showAddPointLength(C);
                            break;
                        case "super_height":
                            O.showAddPointLength(C);
                            break;
                        case "angle":
                            D.showAddPointLength(C)
                    }
                }), P.on(l.DrawRemovePoint, function (e) {
                    switch (x) {
                        case "length":
                        case "section":
                            M.showRemoveLastPointLength(e);
                            break;
                        case "area":
                            T.showRemoveLastPointLength(e);
                            break;
                        case "height":
                            S.showRemoveLastPointLength(e);
                            break;
                        case "super_height":
                            O.showRemoveLastPointLength(e);
                            break;
                        case "angle":
                            D.showRemoveLastPointLength(e)
                    }
                }), P.on(l.DrawMouseMove, function (e) {
                    switch (C = e.entity, x) {
                        case "length":
                        case "section":
                            M.showMoveDrawing(C);
                            break;
                        case "area":
                            T.showMoveDrawing(C);
                            break;
                        case "height":
                            S.showMoveDrawing(C);
                            break;
                        case "super_height":
                            O.showMoveDrawing(C);
                            break;
                        case "angle":
                            D.showMoveDrawing(C)
                    }
                }), P.on(l.DrawCreated, function (e) {
                    switch (C = e.entity, x) {
                        case "length":
                        case "section":
                            M.showDrawEnd(C);
                            break;
                        case "area":
                            T.showDrawEnd(C);
                            break;
                        case "height":
                            S.showDrawEnd(C);
                            break;
                        case "super_height":
                            O.showDrawEnd(C);
                            break;
                        case "angle":
                            D.showDrawEnd(C);
                            break;
                        case "point":
                            k.showDrawEnd(C)
                    }
                    C = null
                });
                var E = P.getDataSource(),
                    M = {
                        options: null,
                        arrLables: [],
                        totalLable: null,
                        disTerrainScale: 1.2,
                        clearLastNoEnd: function () {
                            if (o.defined(this.totalLable) && E.entities.remove(this.totalLable), o.defined(this.arrLables) && this.arrLables.length > 0) {
                                var e = this.arrLables;
                                if (e && e.length > 0)
                                    for (var t in e) E.entities.remove(e[t])
                            }
                            this.totalLable = null, this.arrLables = []
                        },
                        start: function (e) {
                            this.options = e;
                            var t = (0, c.style2Entity)(w, {
                                horizontalOrigin: o.HorizontalOrigin.LEFT,
                                verticalOrigin: o.VerticalOrigin.BOTTOM,
                                show: !1
                            });
                            this.totalLable = E.entities.add({
                                label: t,
                                isMarsMeasureLabel: !0,
                                _noMousePosition: !0,
                                attribute: {
                                    unit: this.options.unit,
                                    type: this.options.type
                                }
                            }), this.arrLables = [], P.startDraw({
                                type: "polyline",
                                config: {
                                    addHeight: e.addHeight
                                },
                                style: e.style || {
                                    lineType: "glow",
                                    color: "#ebe12c",
                                    width: 9,
                                    glowPower: .1,
                                    clampToGround: "section" == this.options.type || this.options.terrain,
                                    depthFailMaterial: new o.Color.fromCssColorString("#ebe12c").withAlpha(.4)
                                }
                            })
                        },
                        showAddPointLength: function (e) {
                            var t = P.getPositions(e),
                                i = (0, c.style2Entity)(w, {
                                    horizontalOrigin: o.HorizontalOrigin.LEFT,
                                    verticalOrigin: o.VerticalOrigin.BOTTOM,
                                    show: !0
                                }),
                                r = E.entities.add({
                                    position: t[t.length - 1],
                                    label: i,
                                    isMarsMeasureLabel: !0,
                                    _noMousePosition: !0,
                                    attribute: {
                                        unit: this.options.unit,
                                        type: this.options.type
                                    }
                                });
                            if (1 == t.length) r.label.text = "起点";
                            else {
                                var n = d.getLength(t),
                                    a = d.formatLength(n, this.options.unit);
                                r.label.text = a, r.attribute.value = n, d.getLength([t[t.length - 2], t[t.length - 1]]) < 5 && (r.show = !1)
                            }
                            this.arrLables.push(r)
                        },
                        showRemoveLastPointLength: function (e) {
                            var t = this.arrLables.pop();
                            E.entities.remove(t), this.showMoveDrawing(e.entity), this.totalLable.position = e.position
                        },
                        showMoveDrawing: function (e) {
                            var t = P.getPositions(e);
                            if (t.length < 2) return void(this.totalLable.label.show = !1);
                            var i = d.getLength(t),
                                r = d.formatLength(i, this.options.unit);
                            this.totalLable.position = t[t.length - 1], this.totalLable.label.text = "总长:" + r, this.totalLable.label.show = !0, this.totalLable.attribute.value = i, this.totalLable.attribute.textEx = "总长:", this.options.calback && this.options.calback(r, i)
                        },
                        showDrawEnd: function (e) {
                            var t = P.getPositions(e),
                                i = this.arrLables.length - t.length;
                            if (i >= 0) {
                                for (var r = this.arrLables.length - 1; r >= t.length - 1; r--) E.entities.remove(this.arrLables[r]);
                                this.arrLables.splice(t.length - 1, i + 1)
                            }
                            e._totalLable = this.totalLable, e._arrLables = this.arrLables, this.totalLable = null, this.arrLables = [], null != e.polyline && ("section" == this.options.type ? this.updateSectionForTerrain(e) : this.options.terrain && this.updateLengthForTerrain(e))
                        },
                        updateLengthForTerrain: function (e) {
                            function t() {
                                if (++s >= r.length && o) {
                                    var e = d.formatLength(l, a);
                                    return o.label.text = "总长:" + e, o.attribute.value = l, i.options.calback && i.options.calback(e, l), void(i.options.onStop && i.options.onStop())
                                }
                                var u = [r[s - 1], r[s]];
                                (0, f.terrainPolyline)({
                                    viewer: _,
                                    positions: u,
                                    splitNum: i.options.splitNum,
                                    calback: function (e, r) {
                                        var o = d.getLength(e);
                                        r && (o *= i.disTerrainScale);
                                        var u = n[s];
                                        if (u) {
                                            var c = d.formatLength(o, a);
                                            u.label.text = c, u.attribute.value = o
                                        }
                                        l += o, t()
                                    }
                                })
                            }
                            var i = this,
                                r = e.polyline.positions.getValue(_.clock.currentTime),
                                n = e._arrLables,
                                o = e._totalLable,
                                a = o && o.unit;
                            this.options.onStart && this.options.onStart();
                            var s = 0,
                                l = 0;
                            t()
                        },
                        updateSectionForTerrain: function (e) {
                            function t() {
                                s++;
                                var e = [i[s - 1], i[s]];
                                (0, f.terrainPolyline)({
                                    viewer: _,
                                    positions: e,
                                    splitNum: g.options.splitNum,
                                    calback: function (v, y) {
                                        l = y ? 1 == s ? l.concat(e) : l.concat([i[s]]) : l.concat(v);
                                        for (var _ = o.Cartographic.fromCartesian(i[s - 1]).height, w = o.Cartographic.fromCartesian(i[s]).height, b = (w - _) / v.length, C = 0; C < v.length; C++) {
                                            0 != C && (u += o.Cartesian3.distance(v[C], v[C - 1])), c.push(Number(u.toFixed(1)));
                                            var x = (0, f.formatPosition)(v[C]);
                                            h.push(x.z), m.push(x);
                                            var P = Number((_ + b * C).toFixed(1));
                                            p.push(P)
                                        }
                                        if (s >= i.length - 1) {
                                            if (n) {
                                                var E = d.getLength(l),
                                                    M = d.formatLength(E, a);
                                                n.label.text = "总长:" + M, n.attribute.value = E
                                            }
                                            g.options.calback && g.options.calback({
                                                distancestr: M,
                                                distance: E,
                                                arrLen: c,
                                                arrLX: p,
                                                arrHB: h,
                                                arrPoint: m
                                            }), g.options.onStop && g.options.onStop()
                                        } else {
                                            var E = d.getLength(v),
                                                M = d.formatLength(E, a),
                                                T = r[s];
                                            T.label.text = M, T.attribute.value = E, t()
                                        }
                                    }
                                })
                            }
                            var i = e.polyline.positions.getValue(_.clock.currentTime);
                            if (!(i.length < 2)) {
                                var r = e._arrLables,
                                    n = e._totalLable,
                                    a = n && n.unit,
                                    s = 0,
                                    l = [],
                                    u = 0,
                                    c = [],
                                    h = [],
                                    p = [],
                                    m = [];
                                this.options.onStart && this.options.onStart();
                                var g = this;
                                t()
                            }
                        }
                    },
                    T = {
                        options: null,
                        totalLable: null,
                        clearLastNoEnd: function () {
                            null != this.totalLable && E.entities.remove(this.totalLable), this.totalLable = null
                        },
                        start: function (e) {
                            this.options = e;
                            var t = (0, c.style2Entity)(w, {
                                horizontalOrigin: o.HorizontalOrigin.CENTER,
                                verticalOrigin: o.VerticalOrigin.BOTTOM,
                                show: !1
                            });
                            this.totalLable = E.entities.add({
                                label: t,
                                isMarsMeasureLabel: !0,
                                _noMousePosition: !0,
                                attribute: {
                                    unit: this.options.unit,
                                    type: this.options.type
                                }
                            }), P.startDraw({
                                type: "polygon",
                                style: e.style || {
                                    color: "#00fff2",
                                    outline: !0,
                                    outlineColor: "#fafa5a",
                                    outlineWidth: 1,
                                    opacity: .4,
                                    clampToGround: !0
                                }
                            })
                        },
                        showAddPointLength: function (e) {
                            this.showMoveDrawing(e)
                        },
                        showRemoveLastPointLength: function (e) {
                            P.getPositions(e.entity).length < 3 && (this.totalLable.label.show = !1)
                        },
                        showMoveDrawing: function (e) {
                            var t = P.getPositions(e);
                            if (t.length < 3) return void(this.totalLable.label.show = !1);
                            var i = d.getArea(t),
                                r = d.formatArea(i, this.options.unit),
                                n = (0, f.centerOfMass)(t);
                            this.totalLable.position = n, this.totalLable.label.text = "面积:" + r, this.totalLable.label.show = !0, this.totalLable.attribute.value = i, this.totalLable.attribute.textEx = "面积:", this.options.calback && this.options.calback(r, i)
                        },
                        showDrawEnd: function (e) {
                            null != e.polygon && (e._totalLable = this.totalLable, this.totalLable = null)
                        }
                    },
                    S = {
                        options: null,
                        totalLable: null,
                        clearLastNoEnd: function () {
                            null != this.totalLable && E.entities.remove(this.totalLable), this.totalLable = null
                        },
                        start: function (e) {
                            this.options = e;
                            var t = (0, c.style2Entity)(w, {
                                horizontalOrigin: o.HorizontalOrigin.RIGHT,
                                verticalOrigin: o.VerticalOrigin.BOTTOM,
                                show: !1
                            });
                            this.totalLable = E.entities.add({
                                label: t,
                                isMarsMeasureLabel: !0,
                                _noMousePosition: !0,
                                attribute: {
                                    unit: this.options.unit,
                                    type: this.options.type
                                }
                            }), P.startDraw({
                                type: "polyline",
                                config: {
                                    maxPointNum: 2
                                },
                                style: e.style || {
                                    lineType: "glow",
                                    color: "#ebe12c",
                                    width: 9,
                                    glowPower: .1,
                                    depthFailMaterial: new o.Color.fromCssColorString("#ebe12c").withAlpha(.4)
                                }
                            })
                        },
                        showAddPointLength: function (e) {
                            this.showMoveDrawing(e)
                        },
                        showRemoveLastPointLength: function (e) {
                            this.totalLable && (this.totalLable.label.show = !1)
                        },
                        showMoveDrawing: function (e) {
                            var t = P.getPositions(e);
                            if (t.length < 2) return void(this.totalLable.label.show = !1);
                            var i = o.Cartographic.fromCartesian(t[0]),
                                r = o.Cartographic.fromCartesian(t[1]),
                                n = Math.abs(r.height - i.height),
                                a = d.formatLength(n, this.options.unit);
                            this.totalLable.position = o.Cartesian3.midpoint(t[0], t[1], new o.Cartesian3), this.totalLable.label.text = "高度差:" + a, this.totalLable.label.show = !0, this.totalLable.attribute.value = n, this.totalLable.attribute.textEx = "高度差:", this.options.calback && this.options.calback(a, n)
                        },
                        showDrawEnd: function (e) {
                            e._totalLable = this.totalLable, this.totalLable = null
                        }
                    },
                    O = {
                        options: null,
                        totalLable: null,
                        xLable: null,
                        hLable: null,
                        clearLastNoEnd: function () {
                            null != this.totalLable && E.entities.remove(this.totalLable), null != this.xLable && E.entities.remove(this.xLable), null != this.hLable && E.entities.remove(this.hLable), this.totalLable = null, this.xLable = null, this.hLable = null
                        },
                        start: function (e) {
                            this.options = e;
                            var t = (0, c.style2Entity)(w, {
                                horizontalOrigin: o.HorizontalOrigin.RIGHT,
                                verticalOrigin: o.VerticalOrigin.CENTER,
                                show: !1
                            });
                            this.totalLable = E.entities.add({
                                label: t,
                                isMarsMeasureLabel: !0,
                                _noMousePosition: !0,
                                attribute: {
                                    unit: this.options.unit,
                                    type: this.options.type
                                }
                            });
                            var i = (0, c.style2Entity)(w, {
                                horizontalOrigin: o.HorizontalOrigin.CENTER,
                                verticalOrigin: o.VerticalOrigin.BOTTOM,
                                show: !1
                            });
                            i.pixelOffset = new o.Cartesian2(0, 0), this.xLable = E.entities.add({
                                label: i,
                                isMarsMeasureLabel: !0,
                                _noMousePosition: !0,
                                attribute: {
                                    unit: this.options.unit,
                                    type: this.options.type
                                }
                            }), this.hLable = E.entities.add({
                                label: i,
                                isMarsMeasureLabel: !0,
                                _noMousePosition: !0,
                                attribute: {
                                    unit: this.options.unit,
                                    type: this.options.type
                                }
                            }), P.startDraw({
                                type: "polyline",
                                config: {
                                    maxPointNum: 2
                                },
                                style: e.style || {
                                    lineType: "glow",
                                    color: "#ebe12c",
                                    width: 9,
                                    glowPower: .1,
                                    depthFailMaterial: new o.Color.fromCssColorString("#ebe12c").withAlpha(.4)
                                }
                            })
                        },
                        showAddPointLength: function (e) {
                            var t = P.getPositions(e);
                            if (4 == t.length) {
                                var i = t[3].clone();
                                t.pop(), t.pop(), t.pop(), t.push(i)
                            }
                            if (2 == t.length) {
                                var r = this.getZHeightPosition(t[0], t[1]);
                                this.getHDistance(t[0], t[1]) > 3 && (t.push(r), t.push(t[0]))
                            }
                            this.showSuperHeight(t)
                        },
                        showRemoveLastPointLength: function (e) {
                            var t = P.getPositions(e.entity);
                            2 == t.length && (t.pop(), t.pop(), this.totalLable.label.show = !1, this.hLable.label.show = !1, this.xLable.label.show = !1)
                        },
                        showMoveDrawing: function (e) {
                            var t = P.getPositions(e);
                            if (4 == t.length) {
                                var i = t[3].clone();
                                t.pop(), t.pop(), t.pop(), t.push(i)
                            }
                            if (2 == t.length) {
                                var r = this.getZHeightPosition(t[0], t[1]);
                                this.getHDistance(t[0], t[1]) > 3 && (t.push(r), t.push(t[0]))
                            }
                            this.showSuperHeight(t)
                        },
                        showDrawEnd: function (e) {
                            e._arrLables = [this.totalLable, this.hLable, this.xLable], this.totalLable = null, this.hLable = null, this.xLable = null
                        },
                        showSuperHeight: function (e) {
                            var t, i, r, n;
                            if (4 == e.length) {
                                var a, s, l = o.Cartesian3.midpoint(e[0], e[1], new o.Cartesian3),
                                    u = o.Cartographic.fromCartesian(e[0]),
                                    c = o.Cartographic.fromCartesian(e[1]),
                                    h = o.Cartographic.fromCartesian(e[2]),
                                    f = c.height - h.height;
                                n = c.height - u.height, r = o.Cartesian3.distance(e[0], e[1]), n > -1 && n < 1 ? (s = e[1], this.updateSuperHeightLabel(this.totalLable, s, "高度差:", n), this.updateSuperHeightLabel(this.hLable, l, "", r)) : (f > -.1 && f < .1 ? (a = o.Cartesian3.midpoint(e[2], e[1], new o.Cartesian3), s = o.Cartesian3.midpoint(e[2], e[3], new o.Cartesian3), i = o.Cartesian3.distance(e[1], e[2]), t = o.Cartesian3.distance(e[3], e[2])) : (s = o.Cartesian3.midpoint(e[2], e[1], new o.Cartesian3), a = o.Cartesian3.midpoint(e[2], e[3], new o.Cartesian3), i = o.Cartesian3.distance(e[3], e[2]), t = o.Cartesian3.distance(e[1], e[2])), this.updateSuperHeightLabel(this.totalLable, s, "高度差:", t), this.updateSuperHeightLabel(this.xLable, a, "", i), this.updateSuperHeightLabel(this.hLable, l, "", r))
                            } else if (2 == e.length) {
                                t = o.Cartesian3.distance(e[1], e[0]);
                                var s = o.Cartesian3.midpoint(e[0], e[1], new o.Cartesian3);
                                this.xLable.label.show && (this.xLable.label.show = !1, this.hLable.label.show = !1), this.updateSuperHeightLabel(this.totalLable, s, "高度差:", t)
                            }
                            var p = d.formatLength(t, this.options.unit);
                            this.options.calback && this.options.calback(p, t)
                        },
                        updateSuperHeightLabel: function (e, t, i, r) {
                            null != e && (e.position = t, e.label.text = i + d.formatLength(r, this.options.unit), e.label.show = !0, e.attribute.value = r, e.attribute.textEx = i)
                        },
                        getZHeightPosition: function (e, t) {
                            var i = o.Cartographic.fromCartesian(e),
                                r = Number(o.Math.toDegrees(i.longitude)),
                                n = Number(o.Math.toDegrees(i.latitude)),
                                a = Number(i.height.toFixed(2)),
                                s = o.Cartographic.fromCartesian(t),
                                l = Number(o.Math.toDegrees(s.longitude)),
                                u = Number(o.Math.toDegrees(s.latitude)),
                                c = Number(s.height.toFixed(2));
                            return a > c ? o.Cartesian3.fromDegrees(l, u, a) : o.Cartesian3.fromDegrees(r, n, c)
                        },
                        getHDistance: function (e, t) {
                            var i = this.getZHeightPosition(e, t),
                                r = o.Cartographic.fromCartesian(t),
                                n = o.Cartographic.fromCartesian(i),
                                a = o.Cartesian3.distance(e, i);
                            return Math.abs(Number(n.height) - Number(r.height)) < .01 && (a = o.Cartesian3.distance(t, i)), a
                        }
                    },
                    D = {
                        options: null,
                        totalLable: null,
                        exLine: null,
                        clearLastNoEnd: function () {
                            null != this.totalLable && E.entities.remove(this.totalLable), this.totalLable = null, null != this.exLine && E.entities.remove(this.exLine), this.exLine = null
                        },
                        start: function (e) {
                            this.options = e;
                            var t = (0, c.style2Entity)(w, {
                                horizontalOrigin: o.HorizontalOrigin.LEFT,
                                verticalOrigin: o.VerticalOrigin.BOTTOM,
                                show: !1
                            });
                            this.totalLable = E.entities.add({
                                label: t,
                                isMarsMeasureLabel: !0,
                                _noMousePosition: !0,
                                attribute: {
                                    unit: this.options.unit,
                                    type: this.options.type
                                }
                            }), P.startDraw({
                                type: "polyline",
                                config: {
                                    maxPointNum: 2
                                },
                                style: e.style || {
                                    lineType: "arrow",
                                    color: "#ebe967",
                                    width: 9,
                                    clampToGround: !0,
                                    depthFailMaterial: new o.Color.fromCssColorString("#ebe12c").withAlpha(.4)
                                }
                            })
                        },
                        showAddPointLength: function (e) {
                            this.showMoveDrawing(e)
                        },
                        showRemoveLastPointLength: function (e) {
                            this.exLine && (this.exLine.polyline.show = !1), this.totalLable && (this.totalLable.label.show = !1)
                        },
                        showMoveDrawing: function (e) {
                            var t = P.getPositions(e);
                            if (t.length < 2) return void(this.totalLable.label.show = !1);
                            var i = o.Cartesian3.distance(t[0], t[1]),
                                r = d.getAngle(t[0], t[1]),
                                n = (0, p.getRotateCenterPoint)(t[0], t[1], -r);
                            this.updateExLine([t[0], n]), this.totalLable.position = t[1], this.totalLable.label.text = "角度:" + r + "°\n距离:" + d.formatLength(i), this.totalLable.label.show = !0, this.totalLable.attribute.value = r, this.totalLable.attribute.textEx = "角度:", this.options.calback && this.options.calback(r + "°", r)
                        },
                        updateExLine: function (e) {
                            this.exLine ? (this.exLine.polyline.show = !0, this.exLine.polyline.positions.setValue(e)) : this.exLine = E.entities.add({
                                polyline: {
                                    positions: e,
                                    width: 3,
                                    clampToGround: !0,
                                    material: new o.PolylineDashMaterialProperty({
                                        color: o.Color.RED
                                    })
                                }
                            })
                        },
                        showDrawEnd: function (e) {
                            e._totalLable = this.totalLable, this.totalLable = null, this.exLine = null
                        }
                    },
                    k = {
                        options: null,
                        totalLable: null,
                        clearLastNoEnd: function () {
                            _.wutu.popup.close()
                        },
                        start: function (e) {
                            this.options = e, P.startDraw({
                                type: "point",
                                style: e.style || {
                                    visibleDepth: !1
                                }
                            })
                        },
                        showDrawEnd: function (e) {
                            var t = P.getPositions(e)[0],
                                i = (0, f.formatPosition)(t),
                                r = d.formatDegree(i.x),
                                n = d.formatDegree(i.y),
                                o = '<div class="wutu-popup-titile">坐标测量</div>\n                        <div class="wutu-popup-content">\n                            <div><label>经度</label>' + i.x + "&nbsp;&nbsp;" + r + "</div>\n                            <div><label>纬度</label>" + i.y + "&nbsp;&nbsp;&nbsp;&nbsp;" + n + "</div>\n                            <div><label>海拔</label>" + i.z + "米</div>\n                        </div>";
                            e.popup = {
                                html: o,
                                anchor: [0, -15]
                            }, _.wutu.popup.show(e)
                        }
                    };
                return {
                    measuerLength: t,
                    measureHeight: n,
                    measureArea: r,
                    measureAngle: s,
                    measureSection: i,
                    measurePoint: h,
                    updateUnit: y,
                    clearMeasure: v,
                    formatArea: d.formatArea,
                    formatLength: d.formatLength,
                    draw: function () {
                        return P
                    },
                    stopDraw: m,
                    endDraw: g
                }
            };
        t.Measure = m
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.MeasureVolume = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(1),
            l = i(8),
            u = i(11),
            c = i(16),
            h = i(3);
        t.MeasureVolume = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, i = a.defaultValue(i, {}), this._last_depthTestAgainstTerrain = this.viewer.scene.globe.depthTestAgainstTerrain, this.viewer.scene.globe.depthTestAgainstTerrain = !0, this.onStart = i.onStart, this.onStop = i.onStop, this._heightLabel = a.defaultValue(i.heightLabel, !0), this._offsetLabel = a.defaultValue(i.offsetLabel, !1);
                var n = {
                    color: "#ffffff",
                    font_family: "楷体",
                    font_size: 20,
                    border: !0,
                    border_color: "#000000",
                    border_width: 3,
                    background: !0,
                    background_color: "#000000",
                    background_opacity: .3,
                    scaleByDistance: !0,
                    scaleByDistance_far: 8e5,
                    scaleByDistance_farValue: .5,
                    scaleByDistance_near: 1e3,
                    scaleByDistance_nearValue: 1,
                    pixelOffset: [0, -15],
                    visibleDepth: !1
                };
                if (a.defined(i.label))
                    for (var o in i.label) n[o] = i.label[o];
                this._labelAttr = n;
                var s = {
                    color: "#ffffff",
                    font_family: "楷体",
                    font_size: 15,
                    border: !0,
                    border_color: "#000000",
                    border_width: 3,
                    background: !1,
                    scaleByDistance: !0,
                    scaleByDistance_far: 8e5,
                    scaleByDistance_farValue: .5,
                    scaleByDistance_near: 1e3,
                    scaleByDistance_nearValue: 1,
                    pixelOffset: [0, -15],
                    visibleDepth: !1
                };
                if (a.defined(i.labelEx))
                    for (var o in i.labelEx) s[o] = i.labelEx[o];
                this._labelHeightAttr = s;
                var l = (0, h.getDefStyle)("polygon", {
                    color: "#00fff2",
                    opacity: .4
                });
                if (a.defined(i.polygon))
                    for (var o in i.polygon) l[o] = i.polygon[o];
                this._polygonStyle = l;
                var u = (0, h.getDefStyle)("polygon", {
                    color: "#00ff00",
                    opacity: .3
                });
                if (a.defined(i.polygonJzm))
                    for (var o in i.polygonJzm) u[o] = i.polygonJzm[o];
                this._polygonJzmStyle = u, this.drawControl = new c.Draw(this.viewer, {
                    hasEdit: !1,
                    removeScreenSpaceEvent: !0
                })
            }
            return n(e, [{
                key: "startDraw",
                value: function () {
                    this.clear(), this._polygonStyle.clampToGround = !0;
                    var e = this;
                    this.drawControl.startDraw({
                        type: "polygon",
                        style: this._polygonStyle,
                        success: function (t) {
                            if (null != t.polygon) {
                                var i = e.drawControl.getPositions(t);
                                e.onStart && e.onStart(i), setTimeout(function () {
                                    e.start(i), e.drawControl.deleteEntity(t)
                                }, 500)
                            }
                        }
                    })
                }
            }, {
                key: "start",
                value: function (e) {
                    this.positions = e;
                    var t = this.computeCutVolume(e);
                    this.squareResult = t;
                    var i = t.maxHeight;
                    this.ptcenter = (0, s.centerOfMass)(e, i + 10), this._maxHeight = i, this._minHeight = t.minHeight, this.jzmHeight = t.minHeight, this.resetLabels();
                    var r = this.drawControl.dataSource,
                        n = this;
                    if (!this.entityPQM) {
                        var o = (0, u.style2Entity)(this._polygonJzmStyle, {
                            hierarchy: new a.PolygonHierarchy(e),
                            height: new a.CallbackProperty(function (e, t) {
                                return n.jzmHeight
                            }, !1)
                        });
                        delete o.perPositionHeight, this.entityPQM = r.entities.add({
                            polygon: o
                        })
                    }
                    delete this._polygonStyle.clampToGround;
                    var o = (0, u.style2Entity)(this._polygonStyle, {
                        hierarchy: new a.PolygonHierarchy(e),
                        extrudedHeight: new a.CallbackProperty(function (e, t) {
                            return n.maxHeight
                        }, !1),
                        closeTop: !1,
                        closeBottom: !1
                    });
                    this.entityWell = r.entities.add({
                        polygon: o
                    }), this.measureFill(t.minHeight)
                }
            }, {
                key: "resetLabels",
                value: function () {
                    if (this.tdLabels && this.tdLabels.length)
                        for (var e = 0; e < this.tdLabels.length; e++) this.drawControl.deleteEntity(this.tdLabels[e]);
                    if (this.heightLabel || this.offsetLabel) {
                        for (var t = [], e = 0, i = this.squareResult.tdHeights.length; e < i; e++) {
                            var r = this.squareResult.tdHeights[e],
                                n = "";
                            if (this.heightLabel && (n += "海拔：" + r.toFixed(2) + "米"), this.offsetLabel) {
                                var o = (this.height || 0) - r;
                                this.heightLabel && (n += "\n"), n += "离地：" + o.toFixed(2) + "米"
                            }
                            var s = (0, l.style2Entity)(this._labelHeightAttr, {
                                    text: n,
                                    horizontalOrigin: a.HorizontalOrigin.CENTER,
                                    verticalOrigin: a.VerticalOrigin.BOTTOM
                                }),
                                u = this.drawControl.dataSource.entities.add({
                                    position: this.squareResult.tdposs[e],
                                    label: s
                                });
                            t.push(u)
                        }
                        this.tdLabels = t
                    }
                }
            }, {
                key: "computeCutVolume",
                value: function (e) {
                    for (var t = [], i = 0; i < e.length; i++) t.push(e[i].clone());
                    for (var r = 15e3, n = [], o = [], i = 0; i < t.length; i++) {
                        var s = a.Cartographic.fromCartesian(t[i]),
                            l = this.viewer.scene.globe.getHeight(s);
                        n.push(l), o.push(a.Cartesian3.fromRadians(s.longitude, s.latitude, l)), r > l && (r = l)
                    }
                    var u = Math.PI / Math.pow(2, 11);
                    u /= 64;
                    for (var c, h, d, f, p, m, g, v, y, _, s, w, b = new a.PolygonGeometry.fromPositions({
                            positions: t,
                            vertexFormat: a.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
                            granularity: u
                        }), C = new a.PolygonGeometry.createGeometry(b), x = 0, P = 0, E = 0, M = [], T = [], i = 0; i < C.indices.length; i += 3) {
                        c = C.indices[i], h = C.indices[i + 1], d = C.indices[i + 2], _ = new a.Cartesian3(C.attributes.position.values[3 * c], C.attributes.position.values[3 * c + 1], C.attributes.position.values[3 * c + 2]), s = a.Cartographic.fromCartesian(_), f = this.viewer.scene.globe.getHeight(s), g = a.Cartesian3.fromRadians(s.longitude, s.latitude, 0), P < f && (P = f), r > f && (r = f), _ = new a.Cartesian3(C.attributes.position.values[3 * h], C.attributes.position.values[3 * h + 1], C.attributes.position.values[3 * h + 2]), s = a.Cartographic.fromCartesian(_), p = this.viewer.scene.globe.getHeight(s);
                        var v = a.Cartesian3.fromRadians(s.longitude, s.latitude, 0);
                        P < p && (P = p), r > p && (r = p), _ = new a.Cartesian3(C.attributes.position.values[3 * d], C.attributes.position.values[3 * d + 1], C.attributes.position.values[3 * d + 2]), s = a.Cartographic.fromCartesian(_), m = this.viewer.scene.globe.getHeight(s), y = a.Cartesian3.fromRadians(s.longitude, s.latitude, 0), P < m && (P = m), r > m && (r = m)
                    }
                    for (var i = 0; i < C.indices.length; i += 3) {
                        c = C.indices[i], h = C.indices[i + 1], d = C.indices[i + 2], _ = new a.Cartesian3(C.attributes.position.values[3 * c], C.attributes.position.values[3 * c + 1], C.attributes.position.values[3 * c + 2]), s = a.Cartographic.fromCartesian(_), f = this.viewer.scene.globe.getHeight(s), g = a.Cartesian3.fromRadians(s.longitude, s.latitude, 0), P < f && (P = f), r > f && (r = f), _ = new a.Cartesian3(C.attributes.position.values[3 * h], C.attributes.position.values[3 * h + 1], C.attributes.position.values[3 * h + 2]), s = a.Cartographic.fromCartesian(_), p = this.viewer.scene.globe.getHeight(s);
                        var v = a.Cartesian3.fromRadians(s.longitude, s.latitude, 0);
                        P < p && (P = p), r > p && (r = p), _ = new a.Cartesian3(C.attributes.position.values[3 * d], C.attributes.position.values[3 * d + 1], C.attributes.position.values[3 * d + 2]), s = a.Cartographic.fromCartesian(_), m = this.viewer.scene.globe.getHeight(s), y = a.Cartesian3.fromRadians(s.longitude, s.latitude, 0), P < m && (P = m), r > m && (r = m), w = this.computeAreaOfTriangle(g, v, y), M.push(w), E += w, x += w * (f - r + p - r + m - r) / 3, T.push([f, p, m])
                    }
                    return {
                        positions: t,
                        minHeight: r,
                        maxHeight: P,
                        totalCutVolume: x,
                        sjareas: M,
                        heightArr: T,
                        tdHeights: n,
                        tdposs: o,
                        totalBottomArea: E
                    }
                }
            }, {
                key: "computeAreaOfTriangle",
                value: function (e, t, i) {
                    var r = a.Cartesian3.distance(e, t),
                        n = a.Cartesian3.distance(t, i),
                        o = a.Cartesian3.distance(i, e),
                        s = (r + n + o) / 2;
                    return Math.sqrt(s * (s - r) * (s - n) * (s - o))
                }
            }, {
                key: "formatNum",
                value: function (e) {
                    return e > 1e4 ? (e / 1e4).toFixed(2) + "万" : e.toFixed(2)
                }
            }, {
                key: "measureFill",
                value: function (e) {
                    var t = this.fillVolume(e);
                    if (t && this.ptcenter) {
                        var i = this.drawControl.dataSource;
                        this.entitieLbl && i.entities.remove(this.entitieLbl);
                        var r = "";
                        t.fill > 0 && (r += "填方体积：" + this.formatNum(t.fill) + "立方米"), t.dig > 0 && (t.fill > 0 && (r += "\n"), r += "挖方体积：" + this.formatNum(t.dig) + "立方米");
                        var n = (0, l.style2Entity)(this._labelAttr, {
                            text: r,
                            horizontalOrigin: a.HorizontalOrigin.CENTER,
                            verticalOrigin: a.VerticalOrigin.BOTTOM
                        });
                        this.entitieLbl = i.entities.add({
                            position: this.ptcenter,
                            label: n
                        }), this.onStop && this.onStop()
                    }
                }
            }, {
                key: "fillVolume",
                value: function (e) {
                    if (this.squareResult) {
                        for (var t = 0, i = 0, r = this.squareResult.sjareas, n = this.squareResult.heightArr, o = r.length, a = this.squareResult.minHeight, s = 0; s < o; s++) {
                            var l = n[s][0],
                                u = n[s][1],
                                c = n[s][2];
                            l > e && (l = e), u > e && (u = e), c > e && (c = e), !l && 0 != l || !u && 0 != u || !c && 0 != c || (t += r[s] * (l - a + u - a + c - a) / 3, i += r[s] * (e - a))
                        }
                        if (e < a) var h = 0;
                        else var h = i - t;
                        return {
                            fill: h,
                            dig: this.squareResult.totalCutVolume - t
                        }
                    }
                }
            }, {
                key: "clear",
                value: function () {
                    this.drawControl.clearDraw(), this.entitieLbl && this.drawControl.dataSource.entities.remove(this.entitieLbl), this.entityPQM && this.drawControl.dataSource.entities.remove(this.entityPQM), this.entityWell && this.drawControl.dataSource.entities.remove(this.entityWell), delete this.entitieLbl, delete this.entityPQM, delete this.entityWell
                }
            }, {
                key: "resetFillV",
                value: function () {
                    var e = this.fillVolume(this.jzmHeight),
                        t = this.drawControl.dataSource;
                    this.entitieLbl && t.entities.remove(this.entitieLbl);
                    var i = "";
                    e.fill > 0 && (i += "填方体积：" + this.formatNum(e.fill) + "立方米\n"), e.dig > 0 && (i += "挖方体积：" + this.formatNum(e.dig) + "立方米");
                    var r = (0, l.style2Entity)(this._labelAttr, {
                        text: i,
                        horizontalOrigin: a.HorizontalOrigin.CENTER,
                        verticalOrigin: a.VerticalOrigin.BOTTOM
                    });
                    this.entitieLbl = t.entities.add({
                        position: this.ptcenter,
                        label: r
                    })
                }
            }, {
                key: "selecteHeight",
                value: function () {
                    if (this.entityPQM && this.entityWell) {
                        var e = this;
                        this.drawControl.startDraw({
                            type: "point",
                            style: {
                                color: "#00fff2"
                            },
                            success: function (t) {
                                if (t.point) {
                                    var i = t._position._value,
                                        r = a.Cartographic.fromCartesian(i).height;
                                    e.height = r, e.drawControl.dataSource.entities.remove(t)
                                }
                            }
                        })
                    }
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.globe.depthTestAgainstTerrain = this._last_depthTestAgainstTerrain, this.clear(), this.drawControl.destroy(), delete this.viewer, delete this.jzmHeight, delete this.drawControl, delete this.squareResult, delete this.ptcenter, delete this.positions, delete this.onStop, delete this._last_depthTestAgainstTerrain
                }
            }, {
                key: "height",
                get: function () {
                    return this.jzmHeight
                },
                set: function (e) {
                    this.jzmHeight = e, e > this.maxHeight && (this.maxHeight = e), this.entityPQM && this.entityWell && (this.resetFillV(), this.measureFill(e), this.resetLabels())
                }
            }, {
                key: "minHeight",
                get: function () {
                    return this._minHeight
                },
                set: function (e) {
                    this._minHeight = e, this.squareResult && (this.squareResult.minHeight = e)
                }
            }, {
                key: "maxHeight",
                get: function () {
                    return this._maxHeight
                },
                set: function (e) {
                    this._maxHeight = e, this.squareResult && (this.squareResult.maxHeight = e)
                }
            }, {
                key: "heightLabel",
                get: function () {
                    return this._heightLabel
                },
                set: function (e) {
                    this._heightLabel = e, this.resetLabels()
                }
            }, {
                key: "offsetLabel",
                get: function () {
                    return this._offsetLabel
                },
                set: function (e) {
                    this._offsetLabel = e, this.resetLabels()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Skyline = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(114),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s);
        t.Skyline = function () {
            function e(t, i) {
                r(this, e), i || (i = {});
                var n = {
                    tjxWidth: 2,
                    strokeType: new a.Cartesian3(!0, !1, !1),
                    tjxColor: new a.Color(1, 0, 0),
                    bjColor: new a.Color(0, 0, 1),
                    mbDis: 500
                };
                this.viewer = t, this.tjxWidth = a.defaultValue(i.tjxWidth, n.tjxWidth), this.strokeType = a.defaultValue(i.strokeType, n.strokeType), this.tjxColor = a.defaultValue(i.tjxColor, n.tjxColor), this.bjColor = a.defaultValue(i.bjColor, n.bjColor), this.mbDis = a.defaultValue(i.mbDis, n.mbDis), this.init()
            }
            return n(e, [{
                key: "init",
                value: function () {
                    this.addPostStage()
                }
            }, {
                key: "addPostStage",
                value: function () {
                    var e = this;
                    this.postProcess = new a.PostProcessStage({
                        fragmentShader: l.default,
                        uniforms: {
                            height: function () {
                                return a.Cartographic.fromCartesian(e.viewer.scene.camera.position).height
                            },
                            lineWidth: function () {
                                return e.tjxWidth
                            },
                            strokeType: function () {
                                return e.strokeType
                            },
                            tjxColor: function () {
                                return e.tjxColor
                            },
                            bjColor: function () {
                                return e.bjColor
                            },
                            cameraPos: function () {
                                return e.viewer.scene.camera.position
                            },
                            mbDis: function () {
                                return e.mbDis
                            }
                        }
                    }), this.viewer.scene.postProcessStages.add(this.postProcess)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postProcess), delete this.viewer, delete this.tjxWidth, delete this.strokeType, delete this.tjxColor, delete this.bjColor, delete this.mbDis, delete this.postProcess
                }
            }]), e
        }()
    }, function (e, t) {
        e.exports = "#extension GL_OES_standard_derivatives : enable\r\nuniform sampler2D colorTexture;\r\nuniform sampler2D depthTexture;\r\nuniform float lineWidth;\r\nuniform float height;\r\nuniform bvec3 strokeType;\r\nuniform vec3 tjxColor;\r\nuniform vec3 bjColor;\r\nuniform vec3 cameraPos;\r\nuniform float mbDis;\r\nvarying vec2 v_textureCoordinates;\r\nvec4 toEye(in vec2 uv, in float depth){\r\n    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\r\n    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\r\n    posInCamera =posInCamera / posInCamera.w;\r\n    return posInCamera;\r\n}\r\nfloat getDepth(in vec4 depth){\r\n    float z_window = czm_unpackDepth(depth);\r\n    z_window = czm_reverseLogDepth(z_window);\r\n    float n_range = czm_depthRange.near;\r\n    float f_range = czm_depthRange.far;\r\n    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\r\n}\r\nbool isTJX(vec2 uv,float lw){\r\n    vec2 pixelSize = lw / czm_viewport.zw;\r\n    float dx0 = -pixelSize.x;\r\n    float dy0 = -pixelSize.y;\r\n    float dx1 = pixelSize.x;\r\n    float dy1 = pixelSize.y;\r\n\r\n    vec2 currUV = uv + vec2(dx0, dy0);\r\n    vec4 currDepth = texture2D(depthTexture, currUV);\r\n    float depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(0.0, dy0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx1, dy0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx0, 0.0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx1, 0.0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx0, dy1);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(0.0, dy1);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx1, dy1);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    return false;\r\n}\r\nvoid main(){\r\n\r\n\r\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\r\n    if(height>14102.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    vec4 currD = texture2D(depthTexture, v_textureCoordinates);\r\n    if(currD.r>=1.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    float depth = getDepth(currD);\r\n    vec4 positionEC = toEye(v_textureCoordinates, depth);\r\n    vec3 dx = dFdx(positionEC.xyz);\r\n    vec3 dy = dFdy(positionEC.xyz);\r\n    vec3 normal = normalize(cross(dx,dy));\r\n\r\n    if(strokeType.y||strokeType.z){\r\n        vec4 wp = czm_inverseView * positionEC;\r\n        if(distance(wp.xyz,cameraPos)>mbDis){\r\n            gl_FragColor = color;\r\n        }else{\r\n            float dotNum = abs(dot(normal,normalize(positionEC.xyz)));\r\n            if(dotNum<0.05){\r\n                gl_FragColor = vec4(bjColor,1.0);\r\n                return;\r\n            }\r\n        }\r\n    }\r\n    if(strokeType.x||strokeType.z){\r\n        bool tjx = isTJX(v_textureCoordinates,lineWidth);\r\n        if(tjx){\r\n            gl_FragColor = vec4(tjxColor,1.0);\r\n            return;\r\n        }\r\n    }\r\n    gl_FragColor = color;\r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TerrainClip = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(56),
            l = i(57);
        t.TerrainClip = function () {
            function e(t, i) {
                if (r(this, e), t) {
                    this.viewer = t, i = i || {}, this.viewer.scene.highDynamicRange || (this.viewer.scene.highDynamicRange = !0, this._hasChangeHighDynamicRange = !0);
                    var n = a.clone(a.ExpandByMars._defaultExcavateAnalysis);
                    this._positions = a.defaultValue(i.positions, a.clone(n.positions)), this.bottomImg = a.defaultValue(i.bottomImg, a.clone(n.bottomImg)), this.wallImg = a.defaultValue(i.wallImg, a.clone(n.wallImg)), this.splitNum = a.defaultValue(i.splitNum, a.clone(n.splitNum)), this.excavateDig = a.defaultValue(i.excavateDig, a.clone(n.excavateDig)), this.dig_pos_x = a.defaultValue(i.dig_pos_x, a.clone(n.dig_pos_x)), this.dig_pos_y = a.defaultValue(i.dig_pos_y, a.clone(n.dig_pos_y)), this.dig_pos_z = a.defaultValue(i.dig_pos_z, a.clone(n.dig_pos_z)), this.rect_dig = a.defaultValue(i.rect_dig, a.clone(n.rect_dig)), this.excavateMinHeight = a.defaultValue(i.excavateMinHeight, a.clone(n.excavateMinHeight)), this.excavatePerPoint = a.defaultValue(i.excavatePerPoint, a.clone(n.excavatePerPoint)), this.dig_max_index = a.defaultValue(i.dig_max_index, a.clone(n.dig_max_index)), this.defaultShowSelfOnly = a.defaultValue(i.showSelfOnly, a.clone(n.showSelfOnly)), this._height = a.defaultValue(i.height, a.clone(n.excavateHeight)), this.defaultShow = a.defaultValue(i.show, !0), this.defaultBoundingSwell = a.defaultValue(i.boundingSwell, 20), this._showWall = a.defaultValue(i.wall, !0), this._init()
                }
            }
            return n(e, [{
                key: "_init",
                value: function () {
                    this._positions && 0 != this._positions.length && (this._startExcavate(this._positions), this.viewer.scene.globe.material = a.Material.fromType("WaJue"), this.viewer.scene.globe.depthTestAgainstTerrain = !0, this._effectExcavate())
                }
            }, {
                key: "setPositions",
                value: function (e) {
                    e && 0 != e.length && (this._startExcavate(e), this.viewer.scene.globe.material = a.Material.fromType("WaJue"), this.viewer.scene.globe.depthTestAgainstTerrain = !0, this._effectExcavate())
                }
            }, {
                key: "_prepareWell",
                value: function (e) {
                    var t = this.splitNum,
                        i = e.length;
                    if (0 != i) {
                        var r = this.excavateMinHeight - this.height;
                        this.targetHeight = r;
                        for (var n = [], o = [], s = [], l = 0; l < i; l++)
                            for (var u = l == i - 1 ? 0 : l + 1, c = a.Cartographic.fromCartesian(e[l]), h = a.Cartographic.fromCartesian(e[u]), d = [c.longitude, c.latitude], f = [h.longitude, h.latitude], p = 0; p < t; p++) {
                                var m = a.Math.lerp(d[0], f[0], p / t),
                                    g = a.Math.lerp(d[1], f[1], p / t);
                                s.push(new a.Cartographic(m, g)), o.push(a.Cartesian3.fromRadians(m, g, r)), n.push(a.Cartesian3.fromRadians(m, g, 0))
                            }
                        this.wellData = {
                            lerp_pos: s,
                            bottom_pos: o,
                            no_height_top: n
                        }
                    }
                }
            }, {
                key: "_createWell",
                value: function (e) {
                    if (Boolean(this.viewer.terrainProvider._layers)) {
                        var t = this;
                        this._createBottomSurface(e.bottom_pos);
                        var i = a.sampleTerrainMostDetailed(this.viewer.terrainProvider, e.lerp_pos),
                            r = -9999;
                        a.when(i, function (i) {
                            for (var n = i.length, o = [], s = [], l = 0; l < n; l++) {
                                s.push(i[l].height), i[l].height > r && (r = i[l].height);
                                var u = a.Cartesian3.fromRadians(i[l].longitude, i[l].latitude, i[l].height);
                                o.push(u)
                            }
                            t.maxHeight = r, t.top_heights = s, t._createWellWall(e.bottom_pos, o), t.viewer.scene.primitives.add(t.wellWall)
                        })
                    } else this._createBottomSurface(e.bottom_pos), this._createWellWall(e.bottom_pos, e.no_height_top), this.viewer.scene.primitives.add(this.wellWall)
                }
            }, {
                key: "_createWellWall",
                value: function (e, t) {
                    var i = new l.WellNoBottom({
                        minimumArr: e,
                        maximumArr: t
                    });
                    i = i.createGeometry(i, this);
                    var r = new a.Material({
                            fabric: {
                                type: "Image",
                                uniforms: {
                                    image: this.wallImg
                                }
                            }
                        }),
                        n = new a.MaterialAppearance({
                            translucent: !1,
                            flat: !0,
                            material: r
                        });
                    this.wellWall = new a.Primitive({
                        geometryInstances: new a.GeometryInstance({
                            geometry: i,
                            attributes: {
                                color: a.ColorGeometryInstanceAttribute.fromColor(a.Color.GREY)
                            },
                            id: "PitWall"
                        }),
                        appearance: n,
                        asynchronous: !1
                    })
                }
            }, {
                key: "_createBottomSurface",
                value: function (e) {
                    if (e.length) {
                        var t = new s.CustomPlaneGeometry({
                            pos_arr: e
                        });
                        t = t.createGeometry(t);
                        var i = new a.Material({
                                fabric: {
                                    type: "Image",
                                    uniforms: {
                                        image: this.bottomImg
                                    }
                                }
                            }),
                            r = new a.MaterialAppearance({
                                translucent: !1,
                                flat: !0,
                                material: i
                            });
                        this.bottomSurface = new a.Primitive({
                            geometryInstances: new a.GeometryInstance({
                                geometry: t
                            }),
                            appearance: r,
                            asynchronous: !1
                        })
                    }
                }
            }, {
                key: "_prepareExcavate",
                value: function (e) {
                    var t = e.length;
                    if (0 != t) {
                        this.dig_max_index = t;
                        for (var i = 99999999, r = 99999999, n = 99999999, o = -99999999, s = -99999999, l = -99999999, u = 0; u < t; u++)
                            if (e[u]) {
                                this.dig_pos_x[u] = e[u].x, this.dig_pos_y[u] = e[u].y, this.dig_pos_z[u] = e[u].z;
                                var c = a.Cartographic.fromCartesian(e[u]);
                                this.excavateMinHeight = this.excavateMinHeight > c.height ? c.height : this.excavateMinHeight, e[u].x > o && (o = e[u].x), e[u].x < i && (i = e[u].x), e[u].y > s && (s = e[u].y), e[u].y < r && (r = e[u].y), e[u].z > l && (l = e[u].z), e[u].z < n && (n = e[u].z)
                            } else this.dig_pos_x[u] = 0, this.dig_pos_y[u] = 0, this.dig_pos_z[u] = 0;
                        var h = this.boundingSwell;
                        this._base_rect = this.rect_dig = [i - h, r - h, n - h, o + h, s + h, l + h, 0, 0, 0]
                    }
                }
            }, {
                key: "_startExcavate",
                value: function (e) {
                    if (this.viewer.scene.globe.material = a.Material.fromType("WaJue"), this._prepareExcavate(e), this._showWall) {
                        if (this._prepareWell(e), !this.wellData) return;
                        this._createWell(this.wellData)
                    }
                }
            }, {
                key: "_updateExcavateDepth",
                value: function (e) {
                    if (void 0 != e && null != e) {
                        this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);
                        for (var t = this.wellData.lerp_pos, i = [], r = t.length, n = 0; n < r; n++) i.push(a.Cartesian3.fromRadians(t[n].longitude, t[n].latitude, this.excavateMinHeight - e));
                        this.wellData.bottom_pos = i, this._createWell(this.wellData), this.bottomSurface && this.viewer.scene.primitives.add(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.add(this.wellWall)
                    }
                }
            }, {
                key: "_effectExcavate",
                value: function () {
                    a.ExpandByMars.excavateAnalysis.dig_pos_x = this.dig_pos_x, a.ExpandByMars.excavateAnalysis.dig_pos_y = this.dig_pos_y, a.ExpandByMars.excavateAnalysis.dig_pos_z = this.dig_pos_z, a.ExpandByMars.excavateAnalysis.excavateDig = this.excavateDig, a.ExpandByMars.excavateAnalysis.dig_max_index = this.dig_max_index, a.ExpandByMars.excavateAnalysis.showSelfOnly = this.showSelfOnly, a.ExpandByMars.excavateAnalysis.rect_dig = this.rect_dig, this.bottomSurface && this.viewer.scene.primitives.add(this.bottomSurface)
                }
            }, {
                key: "_switchShow",
                value: function (e) {
                    e ? (this.viewer.scene.globe.material = a.Material.fromType("WaJue"), this._showWall && (this.wellWall.show = !0, this.bottomSurface.show = !0)) : (this.viewer.scene.globe.material = null, this._showWall && (this.wellWall.show = !1, this.bottomSurface.show = !1))
                }
            }, {
                key: "destroy",
                value: function () {
                    this._hasChangeHighDynamicRange && (this.viewer.scene.highDynamicRange = !1, this._hasChangeHighDynamicRange = !1), this.viewer.scene.globe.material = null, a.ExpandByMars.resetExcavateAnalysis(), this.bottomSurface && (this.viewer.scene.primitives.remove(this.bottomSurface), delete this.bottomSurface), this.wellWall && (this.wellWall && this.viewer.scene.primitives.remove(this.wellWall), delete this.wellWall), delete this.viewer, delete this._positions, delete this.bottomImg, delete this.wallImg, delete this.dig_pos_x, delete this.dig_pos_y, delete this.dig_pos_z, delete this.dig_max_index, delete this.excavatePerPoint, delete this.splitNum, delete this.excavateDig, delete this.rect_dig, delete this._height, delete this.defaultShow, delete this.defaultShowSelfOnly, delete this.excavateMinHeight, delete this.wellData, delete this._base_rect
                }
            }, {
                key: "showSelfOnly",
                get: function () {
                    return this.defaultShowSelfOnly
                },
                set: function (e) {
                    this.defaultShowSelfOnly = e, a.ExpandByMars.excavateAnalysis.showSelfOnly = e
                }
            }, {
                key: "height",
                get: function () {
                    return this._height
                },
                set: function (e) {
                    this._height = e, this._showWall && this._updateExcavateDepth(e)
                }
            }, {
                key: "show",
                get: function () {
                    return this.defaultShow
                },
                set: function (e) {
                    this.defaultShow = Boolean(e), this._switchShow(Boolean(e))
                }
            }, {
                key: "boundingSwell",
                get: function () {
                    return this.defaultBoundingSwell
                },
                set: function (e) {
                    var t = this._base_rect;
                    this.defaultBoundingSwell = Number(e), this.rect_dig = [t[0] - this.boundingSwell, t[1] - this.boundingSwell, t[2] - this.boundingSwell, t[3] + this.boundingSwell, t[4] + this.boundingSwell, t[5] + this.boundingSwell, 0, 0, 0], a.ExpandByMars.excavateAnalysis.rect_dig = this.rect_dig
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TerrainClipPlan = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(56),
            l = i(57),
            u = i(2);
        t.TerrainClipPlan = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, this.options = i || {}, this._positions = i.positions, this._height = this.options.height || 0, this._showWall = a.defaultValue(i.wall, !0), this.bottomImg = i.bottomImg, this.wallImg = i.wallImg, this.splitNum = a.defaultValue(i.splitNum, 50), this._positions && this._positions.length > 0 && this.updateData(this._positions)
            }
            return n(e, [{
                key: "updateData",
                value: function (e) {
                    if (this.clear(), !e || e.length < 3) return void console.log("挖地坐标数据存在问题！");
                    var t = [],
                        i = e.length,
                        r = (0, u.getAngle)(e[0], e[1]),
                        n = (0, u.getAngle)(e[0], e[2]),
                        o = r < n;
                    this.excavateMinHeight = 9999;
                    for (var s = 0; s < i; ++s) {
                        var l = (s + 1) % i,
                            c = a.Cartesian3.midpoint(e[s], e[l], new a.Cartesian3),
                            h = a.Cartographic.fromCartesian(e[s]),
                            d = this.viewer.scene.globe.getHeight(h) || h.height;
                        d < this.excavateMinHeight && (this.excavateMinHeight = d);
                        var f, p = a.Cartesian3.normalize(c, new a.Cartesian3);
                        f = o ? a.Cartesian3.subtract(e[s], c, new a.Cartesian3) : a.Cartesian3.subtract(e[l], c, new a.Cartesian3), f = a.Cartesian3.normalize(f, f);
                        var m = a.Cartesian3.cross(f, p, new a.Cartesian3);
                        m = a.Cartesian3.normalize(m, m);
                        var g = new a.Plane(m, 0),
                            v = a.Plane.getPointDistance(g, c);
                        t.push(new a.ClippingPlane(m, v))
                    }
                    this.viewer.scene.globe.clippingPlanes = new a.ClippingPlaneCollection({
                        planes: t,
                        edgeWidth: 1,
                        edgeColor: a.Color.WHITE,
                        enabled: !0
                    }), this._showWall && (this._prepareWell(e), this._createWell(this.wellData))
                }
            }, {
                key: "clear",
                value: function () {
                    this.viewer.scene.globe.clippingPlanes && (this.viewer.scene.globe.clippingPlanes.enabled = !1, this.viewer.scene.globe.clippingPlanes.removeAll(), this.viewer.scene.globe.clippingPlanes.isDestroyed() || this.viewer.scene.globe.clippingPlanes.destroy()), this.viewer.scene.globe.clippingPlanes = void 0, this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.remove(this.wellWall), delete this.bottomSurface, delete this.wellWall, delete this.wellData, this.viewer.scene.render()
                }
            }, {
                key: "destroy",
                value: function () {
                    this.clear()
                }
            }, {
                key: "_prepareWell",
                value: function (e) {
                    var t = this.splitNum,
                        i = e.length;
                    if (0 != i) {
                        var r = this.excavateMinHeight - this.height;
                        this.targetHeight = r;
                        for (var n = [], o = [], s = [], l = 0; l < i; l++)
                            for (var u = l == i - 1 ? 0 : l + 1, c = a.Cartographic.fromCartesian(e[l]), h = a.Cartographic.fromCartesian(e[u]), d = [c.longitude, c.latitude], f = [h.longitude, h.latitude], p = 0; p < t; p++) {
                                var m = a.Math.lerp(d[0], f[0], p / t),
                                    g = a.Math.lerp(d[1], f[1], p / t);
                                s.push(new a.Cartographic(m, g)), o.push(a.Cartesian3.fromRadians(m, g, r)), n.push(a.Cartesian3.fromRadians(m, g, 0))
                            }
                        this.wellData = {
                            lerp_pos: s,
                            bottom_pos: o,
                            no_height_top: n
                        }
                    }
                }
            }, {
                key: "_createWell",
                value: function (e) {
                    if (Boolean(this.viewer.terrainProvider._layers)) {
                        var t = this;
                        this._createBottomSurface(e.bottom_pos);
                        var i = a.sampleTerrainMostDetailed(this.viewer.terrainProvider, e.lerp_pos),
                            r = -9999;
                        a.when(i, function (i) {
                            for (var n = i.length, o = [], s = [], l = 0; l < n; l++) {
                                s.push(i[l].height), i[l].height > r && (r = i[l].height);
                                var u = a.Cartesian3.fromRadians(i[l].longitude, i[l].latitude, i[l].height);
                                o.push(u)
                            }
                            t.maxHeight = r, t.top_heights = s, t._createWellWall(e.bottom_pos, o), t.viewer.scene.primitives.add(t.wellWall)
                        })
                    } else this._createBottomSurface(e.bottom_pos), this._createWellWall(e.bottom_pos, e.no_height_top), this.viewer.scene.primitives.add(this.wellWall)
                }
            }, {
                key: "_createWellWall",
                value: function (e, t) {
                    var i = new l.WellNoBottom({
                        minimumArr: e,
                        maximumArr: t
                    });
                    i = i.createGeometry(i, this);
                    var r = new a.Material({
                            fabric: {
                                type: "Image",
                                uniforms: {
                                    image: this.wallImg
                                }
                            }
                        }),
                        n = new a.MaterialAppearance({
                            translucent: !1,
                            flat: !0,
                            material: r
                        });
                    this.wellWall = new a.Primitive({
                        geometryInstances: new a.GeometryInstance({
                            geometry: i,
                            attributes: {
                                color: a.ColorGeometryInstanceAttribute.fromColor(a.Color.GREY)
                            },
                            id: "PitWall"
                        }),
                        appearance: n,
                        asynchronous: !1
                    }), this.viewer.scene.primitives.add(this.wellWall)
                }
            }, {
                key: "_createBottomSurface",
                value: function (e) {
                    if (e.length) {
                        var t = new s.CustomPlaneGeometry({
                            pos_arr: e
                        });
                        t = t.createGeometry(t);
                        var i = new a.Material({
                                fabric: {
                                    type: "Image",
                                    uniforms: {
                                        image: this.bottomImg
                                    }
                                }
                            }),
                            r = new a.MaterialAppearance({
                                translucent: !1,
                                flat: !0,
                                material: i
                            });
                        this.bottomSurface = new a.Primitive({
                            geometryInstances: new a.GeometryInstance({
                                geometry: t
                            }),
                            appearance: r,
                            asynchronous: !1
                        }), this.viewer.scene.primitives.add(this.bottomSurface)
                    }
                }
            }, {
                key: "_switchExcavate",
                value: function (e) {
                    e ? (this.wellWall && (this.wellWall.show = !0), this.bottomSurface && (this.bottomSurface.show = !0)) : (this.wellWall && (this.wellWall.show = !1), this.bottomSurface && (this.bottomSurface.show = !1))
                }
            }, {
                key: "_updateExcavateDepth",
                value: function (e) {
                    if (this.wellData) {
                        this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);
                        for (var t = this.wellData.lerp_pos, i = [], r = t.length, n = 0; n < r; n++) i.push(a.Cartesian3.fromRadians(t[n].longitude, t[n].latitude, this.excavateMinHeight - e));
                        this.wellData.bottom_pos = i, this._createWell(this.wellData), this.viewer.scene.primitives.add(this.bottomSurface), this.viewer.scene.primitives.add(this.wellWall)
                    }
                }
            }, {
                key: "show",
                get: function () {
                    return this._show
                },
                set: function (e) {
                    this._show = e, this.viewer.scene.globe.clippingPlanes && (this.viewer.scene.globe.clippingPlanes.enabled = e), this._showWall && this._switchExcavate(e)
                }
            }, {
                key: "height",
                get: function () {
                    return this._height
                },
                set: function (e) {
                    this._height = e, this._showWall && this._updateExcavateDepth(e)
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Underground = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        t.Underground = function () {
            function e(t, i) {
                r(this, e), this.viewer = t;
                var n = a.defaultValue(i, {});
                this._depth = a.defaultValue(n.depth, 500), this._alpha = a.defaultValue(n.alpha, .5), this.enable = a.defaultValue(n.enable, !1)
            }
            return n(e, [{
                key: "_updateImageryLayersAlpha",
                value: function (e) {
                    for (var t = this.viewer.imageryLayers._layers, i = 0, r = t.length; i < r; i++) t[i].alpha = e
                }
            }, {
                key: "_historyOpts",
                value: function () {
                    var e = {};
                    e.alpha = a.clone(this.viewer.imageryLayers._layers[0] && this.viewer.imageryLayers._layers[0].alpha), e.highDynamicRange = a.clone(this.viewer.scene.highDynamicRange), e.skyShow = a.clone(this.viewer.scene.skyAtmosphere.show), e.skyBoxShow = a.clone(this.viewer.scene.skyBox.show), e.depthTest = a.clone(this.viewer.scene.globe.depthTestAgainstTerrain), this.viewer.scene.globe._surface && this.viewer.scene.globe._surface._tileProvider && this.viewer.scene.globe._surface._tileProvider._renderState && (e.blending = a.clone(this.viewer.scene.globe._surface._tileProvider._renderState.blending)), this._oldViewOpts = e
                }
            }, {
                key: "activate",
                value: function () {
                    if (!this._enable) {
                        this._enable = !0, this._historyOpts(), this._updateImageryLayersAlpha(this._alpha);
                        var e = this.viewer;
                        a.ExpandByMars.underEarth.cullFace = !1, a.ExpandByMars.underEarth.enable = !0, a.ExpandByMars.underEarth.enableDepth = this._depth, a.ExpandByMars.underEarth.enableSkirt = !0, e.scene.globe.depthTestAgainstTerrain = !0, e.scene.highDynamicRange = !1, e.scene.skyAtmosphere.show = !1, e.scene.skyBox.show = !1, e.scene.globe._surface._tileProvider && e.scene.globe._surface._tileProvider._renderState && e.scene.globe._surface._tileProvider._renderState.blending && (e.scene.globe._surface._tileProvider._renderState.blending.enabled = !0, e.scene.globe._surface._tileProvider._renderState.blending.equationRgb = a.BlendEquation.ADD, e.scene.globe._surface._tileProvider._renderState.blending.equationAlpha = a.BlendEquation.ADD, e.scene.globe._surface._tileProvider._renderState.blending.functionSourceAlpha = a.BlendFunction.ONE, e.scene.globe._surface._tileProvider._renderState.blending.functionSourceRgb = a.BlendFunction.ONE, e.scene.globe._surface._tileProvider._renderState.blending.functionDestinationAlpha = a.BlendFunction.ZERO, e.scene.globe._surface._tileProvider._renderState.blending.functionDestinationRgb = a.BlendFunction.ZERO)
                    }
                }
            }, {
                key: "disable",
                value: function () {
                    if (this._enable) {
                        this._enable = !1, this._updateImageryLayersAlpha(this._oldViewOpts.alpha);
                        var e = this.viewer;
                        a.ExpandByMars.underEarth.cullFace = void 0, a.ExpandByMars.underEarth.enable = !1, a.ExpandByMars.underEarth.enableDepth = 0, a.ExpandByMars.underEarth.enableSkirt = !1, e.scene.globe.depthTestAgainstTerrain = this._oldViewOpts.depthTest, e.scene.skyBox.show = this._oldViewOpts.skyBoxShow, e.scene.highDynamicRange = this._oldViewOpts.highDynamicRange, e.scene.skyAtmosphere.show = this._oldViewOpts.skyShow, void 0 != this._oldViewOpts.blending && (e.scene.globe._surface._tileProvider._renderState.blending = this._oldViewOpts.blending)
                    }
                }
            }, {
                key: "destroy",
                value: function () {
                    this.disable(), delete this.viewer, delete this._alpha, delete this._depth, delete this._enable, delete this._oldViewOpts
                }
            }, {
                key: "alpha",
                get: function () {
                    return this._alpha
                },
                set: function (e) {
                    this._alpha = Number(e), this._enable && this._updateImageryLayersAlpha(this._alpha)
                }
            }, {
                key: "depth",
                get: function () {
                    return this._depth
                },
                set: function (e) {
                    this._depth = Number(e), this._enable && (a.ExpandByMars.underEarth.enableDepth = this._depth)
                }
            }, {
                key: "enable",
                get: function () {
                    return this._enable
                },
                set: function (e) {
                    e ? this.activate() : this.disable()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.ViewShed3D = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(119),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s),
            u = i(58),
            c = i(1),
            h = {
                cameraPosition: null,
                viewPosition: null,
                horizontalAngle: 120,
                verticalAngle: 90,
                visibleAreaColor: new a.Color(0, 1, 0),
                hiddenAreaColor: new a.Color(1, 0, 0),
                alpha: .5,
                distance: 100,
                frustum: !0,
                show: !0
            };
        t.ViewShed3D = function () {
            function e(t, i) {
                r(this, e), t && (i || (i = {}), this.viewer = t, this.cameraPosition = a.defaultValue(i.cameraPosition, h.cameraPosition), this.viewPosition = a.defaultValue(i.viewPosition, h.viewPosition), this._horizontalAngle = a.defaultValue(i.horizontalAngle, h.horizontalAngle), this._verticalAngle = a.defaultValue(i.verticalAngle, h.verticalAngle), this._visibleAreaColor = a.defaultValue(i.visibleAreaColor, h.visibleAreaColor), this._hiddenAreaColor = a.defaultValue(i.hiddenAreaColor, h.hiddenAreaColor), this._alpha = a.defaultValue(i.alpha, h.alpha), this._distance = a.defaultValue(i.distance, h.distance), this._frustum = a.defaultValue(i.frustum, h.frustum), this.calback = i.calback, this.defaultShow = a.defaultValue(i.show, !0), this.viewer.terrainShadows = a.ShadowMode.ENABLED, this._defaultColorTexture = new a.Texture({
                    context: this.viewer.scene.context,
                    source: {
                        width: 1,
                        height: 1,
                        arrayBufferView: new Uint8Array([0, 0, 0, 0])
                    },
                    flipY: !1
                }), this.cameraPosition && this.viewPosition ? (this._addToScene(), this.calback && this.calback(this._distance, this)) : this._bindMourseEvent())
            }
            return n(e, [{
                key: "_bindMourseEvent",
                value: function () {
                    var e = this,
                        t = this.viewer,
                        i = new a.ScreenSpaceEventHandler(this.viewer.scene.canvas);
                    i.setInputAction(function (i) {
                        var r = (0, c.getCurrentMousePosition)(t.scene, i.position);
                        r && (e.cameraPosition ? e.cameraPosition && !e.viewPosition && (e.viewPosition = r, e._addToScene(), e._unbindMourseEvent(), e.calback && e.calback(e._distance, e)) : e.cameraPosition = r)
                    }, a.ScreenSpaceEventType.LEFT_CLICK), i.setInputAction(function (i) {
                        var r = (0, c.getCurrentMousePosition)(t.scene, i.endPosition);
                        if (r) {
                            var n = e.cameraPosition;
                            n && (e.frustumQuaternion = e.getFrustumQuaternion(n, r), e.distance = Number(a.Cartesian3.distance(n, r).toFixed(1)))
                        }
                    }, a.ScreenSpaceEventType.MOUSE_MOVE), this._handler = i
                }
            }, {
                key: "_unbindMourseEvent",
                value: function () {
                    null != this._handler && (this._handler.destroy(), delete this._handler)
                }
            }, {
                key: "_addToScene",
                value: function () {
                    this.frustumQuaternion = this.getFrustumQuaternion(this.cameraPosition, this.viewPosition), this._createShadowMap(this.cameraPosition, this.viewPosition), this._addPostProcess(), !this.radar && this.addRadar(this.cameraPosition, this.frustumQuaternion), this.viewer.scene.primitives.add(this)
                }
            }, {
                key: "_createShadowMap",
                value: function (e, t, i) {
                    var r = e,
                        n = t,
                        o = this.viewer.scene,
                        s = new a.Camera(o);
                    s.position = r, s.direction = a.Cartesian3.subtract(n, r, new a.Cartesian3(0, 0, 0)), s.up = a.Cartesian3.normalize(r, new a.Cartesian3(0, 0, 0));
                    var l = Number(a.Cartesian3.distance(n, r).toFixed(1));
                    this.distance = l, s.frustum = new a.PerspectiveFrustum({
                        fov: a.Math.toRadians(120),
                        aspectRatio: o.canvas.clientWidth / o.canvas.clientHeight,
                        near: .1,
                        far: 5e3
                    });
                    this.viewShadowMap = new a.ShadowMap({
                        lightCamera: s,
                        enable: !1,
                        isPointLight: !1,
                        isSpotLight: !0,
                        cascadesEnabled: !1,
                        context: o.context,
                        pointLightRadius: l
                    })
                }
            }, {
                key: "getFrustumQuaternion",
                value: function (e, t) {
                    var i = a.Cartesian3.normalize(a.Cartesian3.subtract(t, e, new a.Cartesian3), new a.Cartesian3),
                        r = a.Cartesian3.normalize(e, new a.Cartesian3),
                        n = new a.Camera(this.viewer.scene);
                    n.position = e, n.direction = i, n.up = r, i = n.directionWC, r = n.upWC;
                    var o = n.rightWC,
                        s = new a.Cartesian3,
                        l = new a.Matrix3,
                        u = new a.Quaternion;
                    o = a.Cartesian3.negate(o, s);
                    var c = l;
                    return a.Matrix3.setColumn(c, 0, o, c), a.Matrix3.setColumn(c, 1, r, c), a.Matrix3.setColumn(c, 2, i, c), a.Quaternion.fromRotationMatrix(c, u)
                }
            }, {
                key: "_addPostProcess",
                value: function () {
                    var e = this,
                        t = l.default,
                        i = this,
                        r = i.viewShadowMap._isPointLight ? i.viewShadowMap._pointBias : i.viewShadowMap._primitiveBias;
                    this.postProcess = new a.PostProcessStage({
                        fragmentShader: t,
                        uniforms: {
                            czzj: function () {
                                return e.verticalAngle
                            },
                            dis: function () {
                                return e.distance
                            },
                            spzj: function () {
                                return e.horizontalAngle
                            },
                            visibleColor: function () {
                                return e.visibleAreaColor
                            },
                            disVisibleColor: function () {
                                return e.hiddenAreaColor
                            },
                            mixNum: function () {
                                return e.alpha
                            },
                            stcshadow: function () {
                                return i.viewShadowMap._shadowMapTexture || e._defaultColorTexture
                            },
                            _shadowMap_matrix: function () {
                                return i.viewShadowMap._shadowMapMatrix
                            },
                            shadowMap_lightPositionEC: function () {
                                return i.viewShadowMap._lightPositionEC
                            },
                            shadowMap_lightPositionWC: function () {
                                return i.viewShadowMap._lightCamera.position
                            },
                            shadowMap_lightDirectionEC: function () {
                                return i.viewShadowMap._lightDirectionEC
                            },
                            shadowMap_lightUp: function () {
                                return i.viewShadowMap._lightCamera.up
                            },
                            shadowMap_lightDir: function () {
                                return i.viewShadowMap._lightCamera.direction
                            },
                            shadowMap_lightRight: function () {
                                return i.viewShadowMap._lightCamera.right
                            },
                            shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: function () {
                                var e = new a.Cartesian2;
                                return e.x = 1 / i.viewShadowMap._textureSize.x, e.y = 1 / i.viewShadowMap._textureSize.y, a.Cartesian4.fromElements(e.x, e.y, r.depthBias, r.normalShadingSmooth, this.combinedUniforms1)
                            },
                            shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: function () {
                                return a.Cartesian4.fromElements(r.normalOffsetScale, i.viewShadowMap._distance, i.viewShadowMap.maximumDistance, i.viewShadowMap._darkness, this.combinedUniforms2)
                            },
                            depthTexture1: function () {
                                return e.getSceneDepthTexture(e.viewer)
                            }
                        }
                    }), this.show && this.viewer.scene.postProcessStages.add(this.postProcess)
                }
            }, {
                key: "getSceneDepthTexture",
                value: function (e) {
                    var t = e.scene,
                        i = t._environmentState,
                        r = t._view,
                        n = i.useGlobeDepthFramebuffer,
                        o = n ? r.globeDepth.framebuffer : void 0,
                        s = r.sceneFramebuffer.getFramebuffer();
                    return a.defaultValue(o, s).depthStencilTexture
                }
            }, {
                key: "removeRadar",
                value: function () {
                    this.viewer.entities.remove(this.radar)
                }
            }, {
                key: "resetRadar",
                value: function () {
                    this.removeRadar(), this.addRadar(this.cameraPosition, this.frustumQuaternion)
                }
            }, {
                key: "addRadar",
                value: function (e, t) {
                    var i = e,
                        r = this;
                    this.radar = this.viewer.entities.add({
                        position: i,
                        orientation: t,
                        show: this.show,
                        rectangularSensor: new u.RectangularSensorGraphics({
                            radius: r.distance,
                            xHalfAngle: a.Math.toRadians(r.horizontalAngle / 2),
                            yHalfAngle: a.Math.toRadians(r.verticalAngle / 2),
                            material: new a.Color(0, 1, 1, .4),
                            lineColor: new a.Color(1, 1, 1, 1),
                            slice: 8,
                            showScanPlane: !1,
                            scanPlaneColor: new a.Color(0, 1, 1, 1),
                            scanPlaneMode: "vertical",
                            scanPlaneRate: 3,
                            showThroughEllipsoid: !1,
                            showLateralSurfaces: !1,
                            showDomeSurfaces: !1
                        })
                    })
                }
            }, {
                key: "update",
                value: function (e) {
                    this.viewShadowMap && e.shadowMaps.push(this.viewShadowMap)
                }
            }, {
                key: "_switchShow",
                value: function () {
                    this.show ? !this.postProcess && this._addPostProcess() : (this.viewer.scene.postProcessStages.remove(this.postProcess), delete this.postProcess, this.postProcess = null), this.radar.show = this.show
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.terrainShadows = a.ShadowMode.DISABLED, this._unbindMourseEvent(), this.viewer.scene.postProcessStages.remove(this.postProcess), this.viewer.entities.remove(this.radar), delete this.radar, delete this.postProcess, delete this.viewShadowMap, delete this.verticalAngle, delete this.viewer, delete this.horizontalAngle, delete this.visibleAreaColor, delete this.hiddenAreaColor, delete this.distance, delete this.frustumQuaternion, delete this.cameraPosition, delete this.viewPosition, delete this.alpha
                }
            }, {
                key: "horizontalAngle",
                get: function () {
                    return this._horizontalAngle
                },
                set: function (e) {
                    this._horizontalAngle = e, this.resetRadar()
                }
            }, {
                key: "verticalAngle",
                get: function () {
                    return this._verticalAngle
                },
                set: function (e) {
                    this._verticalAngle = e, this.resetRadar()
                }
            }, {
                key: "distance",
                get: function () {
                    return this._distance
                },
                set: function (e) {
                    this._distance = e, this.resetRadar()
                }
            }, {
                key: "visibleAreaColor",
                get: function () {
                    return this._visibleAreaColor
                },
                set: function (e) {
                    this._visibleAreaColor = e
                }
            }, {
                key: "hiddenAreaColor",
                get: function () {
                    return this._hiddenAreaColor
                },
                set: function (e) {
                    this._hiddenAreaColor = e
                }
            }, {
                key: "alpha",
                get: function () {
                    return this._alpha
                },
                set: function (e) {
                    this._alpha = e
                }
            }, {
                key: "show",
                get: function () {
                    return this.defaultShow
                },
                set: function (e) {
                    this.defaultShow = Boolean(e), this._switchShow()
                }
            }]), e
        }()
    }, function (e, t) {
        e.exports = "uniform float czzj;\r\nuniform float dis;\r\nuniform float spzj;\r\nuniform vec3 visibleColor;\r\nuniform vec3 disVisibleColor;\r\nuniform float mixNum;\r\nuniform sampler2D colorTexture;\r\nuniform sampler2D stcshadow; \r\nuniform sampler2D depthTexture;\r\nuniform mat4 _shadowMap_matrix; \r\nuniform vec4 shadowMap_lightPositionEC; \r\nuniform vec3 shadowMap_lightPositionWC;\r\nuniform vec4 shadowMap_lightDirectionEC;\r\nuniform vec3 shadowMap_lightUp;\r\nuniform vec3 shadowMap_lightDir;\r\nuniform vec3 shadowMap_lightRight;\r\nuniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness; \r\nuniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth; \r\nvarying vec2 v_textureCoordinates;\r\nvec4 toEye(in vec2 uv, in float depth){\r\n    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\r\n    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\r\n    posInCamera =posInCamera / posInCamera.w;\r\n    return posInCamera;\r\n}\r\nfloat getDepth(in vec4 depth){\r\n    float z_window = czm_unpackDepth(depth);\r\n    z_window = czm_reverseLogDepth(z_window);\r\n    float n_range = czm_depthRange.near;\r\n    float f_range = czm_depthRange.far;\r\n    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\r\n}\r\nfloat _czm_sampleShadowMap(sampler2D shadowMap, vec2 uv){\r\n    return texture2D(shadowMap, uv).r;\r\n}\r\nfloat _czm_shadowDepthCompare(sampler2D shadowMap, vec2 uv, float depth){\r\n    return step(depth, _czm_sampleShadowMap(shadowMap, uv));\r\n}\r\nfloat _czm_shadowVisibility(sampler2D shadowMap, czm_shadowParameters shadowParameters){\r\n    float depthBias = shadowParameters.depthBias;\r\n    float depth = shadowParameters.depth;\r\n    float nDotL = shadowParameters.nDotL;\r\n    float normalShadingSmooth = shadowParameters.normalShadingSmooth;\r\n    float darkness = shadowParameters.darkness;\r\n    vec2 uv = shadowParameters.texCoords;\r\n    depth -= depthBias;\r\n    vec2 texelStepSize = shadowParameters.texelStepSize;\r\n    float radius = 1.0;\r\n    float dx0 = -texelStepSize.x * radius;\r\n    float dy0 = -texelStepSize.y * radius;\r\n    float dx1 = texelStepSize.x * radius;\r\n    float dy1 = texelStepSize.y * radius;\r\n    float visibility = \r\n    (\r\n    _czm_shadowDepthCompare(shadowMap, uv, depth)\r\n    +_czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, 0.0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, 0.0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy1), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy1), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy1), depth)\r\n    ) * (1.0 / 9.0)\r\n    ;\r\n    return visibility;\r\n}\r\nvec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\r\n    vec3 v01 = point -planeOrigin;\r\n    float d = dot(planeNormal, v01) ;\r\n    return (point - planeNormal * d);\r\n}\r\nfloat ptm(vec3 pt){\r\n    return sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z);\r\n}\r\nvoid main() \r\n{ \r\n    const float PI = 3.141592653589793;\r\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\r\n    vec4 currD = texture2D(depthTexture, v_textureCoordinates);\r\n\r\n    // vec4 stcc = texture2D(stcshadow, v_textureCoordinates);\r\n    // gl_FragColor = currD;\r\n    // return;\r\n    if(currD.r>=1.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    \r\n    float depth = getDepth(currD);\r\n    // gl_FragColor = vec4(depth,0.0,0.0,1.0);\r\n    // return;\r\n    // float depth = czm_unpackDepth(texture2D(depthTexture, v_textureCoordinates));\r\n    vec4 positionEC = toEye(v_textureCoordinates, depth);\r\n    vec3 normalEC = vec3(1.0);\r\n    czm_shadowParameters shadowParameters; \r\n    shadowParameters.texelStepSize = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy; \r\n    shadowParameters.depthBias = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z; \r\n    shadowParameters.normalShadingSmooth = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w; \r\n    shadowParameters.darkness = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w; \r\n    shadowParameters.depthBias *= max(depth * 0.01, 1.0); \r\n    vec3 directionEC = normalize(positionEC.xyz - shadowMap_lightPositionEC.xyz); \r\n    float nDotL = clamp(dot(normalEC, -directionEC), 0.0, 1.0); \r\n    vec4 shadowPosition = _shadowMap_matrix * positionEC; \r\n    shadowPosition /= shadowPosition.w; \r\n    if (any(lessThan(shadowPosition.xyz, vec3(0.0))) || any(greaterThan(shadowPosition.xyz, vec3(1.0)))) \r\n    { \r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n    //坐标与视点位置距离，大于最大距离则舍弃阴影效果\r\n    vec4 lw = vec4(shadowMap_lightPositionWC,1.0);\r\n    vec4 vw = czm_inverseView* vec4(positionEC.xyz, 1.0);\r\n    if(distance(lw.xyz,vw.xyz)>dis){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n\r\n    //水平夹角限制\r\n    vec3 ptOnSP = pointProjectOnPlane(shadowMap_lightUp,lw.xyz,vw.xyz);\r\n    directionEC = ptOnSP - lw.xyz;\r\n    float directionECMO = ptm(directionEC.xyz);\r\n    float shadowMap_lightDirMO = ptm(shadowMap_lightDir.xyz);\r\n    float cosJJ = dot(directionEC,shadowMap_lightDir)/(directionECMO*shadowMap_lightDirMO);\r\n    float degJJ = acos(cosJJ)*(180.0 / PI);\r\n    degJJ = abs(degJJ);\r\n    if(degJJ>spzj/2.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n    //垂直夹角限制\r\n    vec3 ptOnCZ = pointProjectOnPlane(shadowMap_lightRight,lw.xyz,vw.xyz);\r\n    vec3 dirOnCZ = ptOnCZ - lw.xyz;\r\n    float dirOnCZMO = ptm(dirOnCZ);\r\n    float cosJJCZ = dot(dirOnCZ,shadowMap_lightDir)/(dirOnCZMO*shadowMap_lightDirMO);\r\n    float degJJCZ = acos(cosJJCZ)*(180.0 / PI);\r\n    degJJCZ = abs(degJJCZ);\r\n    if(degJJCZ>czzj/2.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n    shadowParameters.texCoords = shadowPosition.xy; \r\n    shadowParameters.depth = shadowPosition.z; \r\n    shadowParameters.nDotL = nDotL; \r\n    float visibility = _czm_shadowVisibility(stcshadow, shadowParameters); \r\n    if(visibility==1.0){\r\n        gl_FragColor = mix(color,vec4(visibleColor,1.0),mixNum);\r\n    }else{\r\n        // if(abs(shadowPosition.z-0.0)<0.01){\r\n        //     return;\r\n        // }\r\n        gl_FragColor = mix(color,vec4(disVisibleColor,1.0),mixNum);\r\n    }\r\n} "
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Sightline = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(1);
        t.Sightline = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, i || (i = {}), this.lines = [], this._visibleColor = new a.Color(0, 1, 0, 1), this._hiddenColor = new a.Color(1, 0, 0, 1), this._depthFailMaterial = this._hiddenColor, i.originPoint && i.targetPoint && this.analysis(i.originPoint, i.targetPoint)
            }
            return n(e, [{
                key: "add",
                value: function (e, t) {
                    var i = (0, s.addPositionsHeight)(e, 1.5),
                        r = a.Cartesian3.normalize(a.Cartesian3.subtract(t, i, new a.Cartesian3), new a.Cartesian3),
                        n = new a.Ray(i, r),
                        o = this.viewer.scene.drillPickFromRay(n, 2, this.lines);
                    if (a.defined(o) && o.length > 0 && a.defined(o[0]) && a.defined(o[0].position)) {
                        var l = o[0].position,
                            u = this.viewer.entities.add({
                                polyline: {
                                    positions: [e, l],
                                    width: 2,
                                    material: this._visibleColor
                                }
                            });
                        this.lines.push(u);
                        var c = this.viewer.entities.add({
                            polyline: {
                                positions: [l, t],
                                width: 2,
                                material: this._hiddenColor
                            }
                        });
                        return this.lines.push(c), [u, c]
                    }
                    var u = this.viewer.entities.add({
                        polyline: {
                            positions: [e, t],
                            width: 2,
                            material: this._visibleColor,
                            depthFailMaterial: this._depthFailMaterial
                        }
                    });
                    return this.lines.push(u), [u]
                }
            }, {
                key: "clear",
                value: function () {
                    for (var e = 0, t = this.lines.length; e < t; e++) this.viewer.entities.remove(this.lines[e]);
                    this.lines = []
                }
            }, {
                key: "destroy",
                value: function () {
                    this.clear(), delete this.viewer, delete this._visibleColor, delete this._hiddenColor
                }
            }, {
                key: "visibleColor",
                get: function () {
                    return this._visibleColor
                },
                set: function (e) {
                    this._visibleColor = e
                }
            }, {
                key: "hiddenColor",
                get: function () {
                    return this._hiddenColor
                },
                set: function (e) {
                    this._hiddenColor = e
                }
            }, {
                key: "depthFailMaterial",
                get: function () {
                    return this._depthFailMaterial
                },
                set: function (e) {
                    this._depthFailMaterial = e
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.HeightCounterByTerrain = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        t.HeightCounterByTerrain = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, i = i || {};
                var n = a.clone(a.ExpandByMars._defaultFloodAnalysis);
                this._positions = a.defaultValue(i.positions, a.clone(n.positions)), this.floodVar = a.defaultValue(i.floodVar, a.clone(n.floodVar)), this.ym_pos_x = a.defaultValue(i.ym_pos_x, a.clone(n.ym_pos_x)), this.ym_pos_y = a.defaultValue(i.ym_pos_y, a.clone(n.ym_pos_y)), this.ym_pos_z = a.defaultValue(i.ym_pos_z, a.clone(n.ym_pos_z)), this.rect_flood = a.defaultValue(i.rect_flood, a.clone(n.rect_flood)), this.ym_max_index = a.defaultValue(i.ym_max_index, a.clone(n.ym_max_index)), this._globe = a.defaultValue(i.globe, a.clone(n.globe)), this._visibleOutArea = a.defaultValue(i.visibleOutArea, a.clone(n.showElseArea)), this._boundingSwell = a.defaultValue(i.boundingSwell, 20), this.defaultShow = a.defaultValue(i.show, !0), this.onStop = a.defaultValue(i.onStop, null), this.height = a.defaultValue(i.height, null), this._init()
            }
            return n(e, [{
                key: "_checkArgs",
                value: function () {
                    if (void 0 == this.minHeight || void 0 == this.maxHeight) return console.log("请确认高度值为数值！"), !1;
                    if (this.minHeight > this.maxHeight) {
                        var e = this.minHeight;
                        this.minHeight = this.maxHeight, this.maxHeight = e
                    }
                    return !0
                }
            }, {
                key: "_init",
                value: function () {
                    this._positions && 0 != this._positions.length && (this._prepareFlood(this._positions), this._setFloodVar(), this._startFlood())
                }
            }, {
                key: "setPositions",
                value: function (e) {
                    e && 0 != e.length && (this._prepareFlood(e), this._setFloodVar(), this._startFlood())
                }
            }, {
                key: "reFlood",
                value: function () {
                    this.floodVar[1] = this.floodVar[0]
                }
            }, {
                key: "_switchShow",
                value: function () {
                    this.show ? this.viewer.scene.globe.material = a.Material.fromType("YanMo") : this.viewer.scene.globe.material = null
                }
            }, {
                key: "_prepareFlood",
                value: function (e) {
                    this.ym_pos_arr = e;
                    var t = e.length;
                    if (0 != t) {
                        this.ym_max_index = t;
                        for (var i = 99999999, r = 99999999, n = 99999999, o = -99999999, a = -99999999, s = -99999999, l = 0; l < t; l++) e[l] ? (this.ym_pos_x[l] = e[l].x, this.ym_pos_y[l] = e[l].y, this.ym_pos_z[l] = e[l].z, e[l].x > o && (o = e[l].x), e[l].x < i && (i = e[l].x), e[l].y > a && (a = e[l].y), e[l].y < r && (r = e[l].y), e[l].z > s && (s = e[l].z), e[l].z < n && (n = e[l].z)) : (this.ym_pos_x[l] = 0, this.ym_pos_y[l] = 0, this.ym_pos_z[l] = 0);
                        var u = this.boundingSwell;
                        this._base_rect = this.rect_flood = [i - u, r - u, n - u, o + u, a + u, s + u, 0, 0, 0]
                    }
                }
            }, {
                key: "_setFloodVar",
                value: function () {
                    this.floodVar = [this.minHeight, this.minHeight, this.maxHeight, this.maxHeight - this.minHeight]
                }
            }, {
                key: "_startFlood",
                value: function () {
                    a.ExpandByMars.floodAnalysis.floodVar[0] = this.floodVar[0], a.ExpandByMars.floodAnalysis.floodVar[1] = this.floodVar[1], a.ExpandByMars.floodAnalysis.ym_pos_x = this.ym_pos_x, a.ExpandByMars.floodAnalysis.ym_pos_y = this.ym_pos_y, a.ExpandByMars.floodAnalysis.ym_pos_z = this.ym_pos_z, a.ExpandByMars.floodAnalysis.rect_flood = this.rect_flood, a.ExpandByMars.floodAnalysis.ym_pos_arr = this.ym_pos_arr, a.ExpandByMars.floodAnalysis.ym_max_index = this.ym_max_index, a.ExpandByMars.floodAnalysis.globe = this.globe = !1, a.ExpandByMars.floodAnalysis.showElseArea = this.visibleOutArea, this.viewer.scene.globe.material = a.Material.fromType("ElevationContour")
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer && (this.viewer.scene.globe.material = null), a.ExpandByMars.resetFloodAnalysis(), delete this.activeFlooding, delete this.viewer, delete this.ym_max_height, delete this.ym_pos_x, delete this.ym_pos_y, delete this.ym_pos_z, delete this.ym_pos_arr, delete this.ym_max_index, delete this.globe, delete this.maxDepthOfWater, delete this.rect_flood
                }
            }, {
                key: "visibleOutArea",
                get: function () {
                    return this._visibleOutArea
                },
                set: function (e) {
                    this._visibleOutArea = e, a.ExpandByMars.floodAnalysis.showElseArea = e
                }
            }, {
                key: "globe",
                get: function () {
                    return this._globe
                },
                set: function (e) {
                    this._globe = e, a.ExpandByMars.floodAnalysis.globe = e
                }
            }, {
                key: "boundingSwell",
                get: function () {
                    return this._boundingSwell
                },
                set: function (e) {
                    var t = this._base_rect;
                    this._boundingSwell = Number(e), this.rect_flood = [t[0] - this.boundingSwell, t[1] - this.boundingSwell, t[2] - this.boundingSwell, t[3] - this.boundingSwell, t[4] - this.boundingSwell, t[5] - this.boundingSwell, 0, 0, 0], a.ExpandByMars.floodAnalysis.rect_flood = this.rect_flood
                }
            }, {
                key: "show",
                get: function () {
                    return this.defaultShow
                },
                set: function (e) {
                    this.defaultShow = Boolean(e), this._switchShow()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.MixedOcclusion = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        t.MixedOcclusion = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, i = i || {}, this._enabled = a.defaultValue(i.enabled, !0), this._alpha = a.defaultValue(i.alpha, .5), this.init()
            }
            return n(e, [{
                key: "init",
                value: function () {
                    var e = this.viewer.scene.context,
                        t = this.viewer.scene.drawingBufferWidth,
                        i = this.viewer.scene.drawingBufferHeight;
                    this.width = t, this.height = i, this.tt = new a.Texture({
                        context: e,
                        width: t,
                        height: i,
                        pixelFormat: a.PixelFormat.RGBA,
                        pixelDatatype: a.PixelDatatype.FLOAT,
                        sampler: new a.Sampler({
                            wrapS: a.TextureWrap.CLAMP_TO_EDGE,
                            wrapT: a.TextureWrap.CLAMP_TO_EDGE,
                            minificationFilter: a.TextureMinificationFilter.NEAREST,
                            magnificationFilter: a.TextureMagnificationFilter.NEAREST
                        })
                    }), this.depthStencilTexture = new a.Texture({
                        context: e,
                        width: t,
                        height: i,
                        pixelFormat: a.PixelFormat.DEPTH_STENCIL,
                        pixelDatatype: a.PixelDatatype.UNSIGNED_INT_24_8
                    }), a.ExpandByMars.mixedOcclusion.tilesFbo = new a.Framebuffer({
                        context: e,
                        colorTextures: [this.tt],
                        depthStencilTexture: this.depthStencilTexture,
                        destroyAttachments: !1
                    }), a.ExpandByMars.mixedOcclusion.tilesFboClear = new a.ClearCommand({
                        color: new a.Color(0, 0, 0, 0),
                        framebuffer: a.ExpandByMars.mixedOcclusion.tilesFbo,
                        depth: 2,
                        stencil: 2
                    }), this.viewer.scene._preUpdate.addEventListener(this._preUpdateHandler, this), this.setEnabled(this._enabled)
                }
            }, {
                key: "_preUpdateHandler",
                value: function (e) {
                    a.ExpandByMars.mixedOcclusion.newFrame = !0;
                    var t = this.viewer.scene.drawingBufferWidth,
                        i = this.viewer.scene.drawingBufferHeight;
                    if (t != this.width || i != this.height) {
                        var r = this.viewer.scene.context,
                            n = t,
                            o = i;
                        this.width = n, this.height = o, this.DepthTexture && this.DepthTexture.destroy(), this.depthStencilTexture && this.depthStencilTexture.destroy(), this.tt && this.tt.destroy(), a.ExpandByMars.mixedOcclusion.tilesFbo && a.ExpandByMars.mixedOcclusion.tilesFbo.destroy(), this.tt = new a.Texture({
                            context: r,
                            width: n,
                            height: o,
                            pixelFormat: a.PixelFormat.RGBA,
                            pixelDatatype: a.PixelDatatype.FLOAT,
                            sampler: new a.Sampler({
                                wrapS: a.TextureWrap.CLAMP_TO_EDGE,
                                wrapT: a.TextureWrap.CLAMP_TO_EDGE,
                                minificationFilter: a.TextureMinificationFilter.NEAREST,
                                magnificationFilter: a.TextureMagnificationFilter.NEAREST
                            })
                        }), this.depthStencilTexture = new a.Texture({
                            context: r,
                            width: n,
                            height: o,
                            pixelFormat: a.PixelFormat.DEPTH_STENCIL,
                            pixelDatatype: a.PixelDatatype.UNSIGNED_INT_24_8
                        }), this.DepthTexture = new a.Texture({
                            context: r,
                            width: n,
                            height: o,
                            pixelFormat: a.PixelFormat.RGBA,
                            pixelDatatype: a.PixelDatatype.UNSIGNED_BYTE,
                            sampler: new a.Sampler({
                                wrapS: a.TextureWrap.CLAMP_TO_EDGE,
                                wrapT: a.TextureWrap.CLAMP_TO_EDGE,
                                minificationFilter: a.TextureMinificationFilter.NEAREST,
                                magnificationFilter: a.TextureMagnificationFilter.NEAREST
                            })
                        }), a.ExpandByMars.mixedOcclusion.tilesFbo = new a.Framebuffer({
                            context: r,
                            colorTextures: [this.tt],
                            depthStencilTexture: this.depthStencilTexture,
                            destroyAttachments: !1
                        }), a.ExpandByMars.mixedOcclusion.tilesFboClear = new a.ClearCommand({
                            color: new a.Color(0, 0, 0, 0),
                            framebuffer: a.ExpandByMars.mixedOcclusion.tilesFbo,
                            depth: 2,
                            stencil: 2
                        })
                    }
                }
            }, {
                key: "setEnabled",
                value: function (e) {
                    var t = this;
                    a.ExpandByMars.mixedOcclusion.enable = e, e ? (this.postProcess = new a.PostProcessStage({
                        fragmentShader: "\n    uniform sampler2D colorTexture;\n    uniform sampler2D mergeTexture; \n    uniform float alpha;\n    varying vec2 v_textureCoordinates;\n    void main(){\n        vec4 color = texture2D(colorTexture, v_textureCoordinates);\n        vec4 mergeColor =  texture2D(mergeTexture, v_textureCoordinates);\n        if(length(mergeColor.rgb)>0.01){\n            gl_FragColor = mix(color,mergeColor,alpha);\n        }else{\n            gl_FragColor = color;\n        }\n    } ",
                        uniforms: {
                            mergeTexture: function () {
                                return a.ExpandByMars.mixedOcclusion.tilesFbo._colorTextures[0]
                            },
                            alpha: function () {
                                return t._alpha
                            }
                        }
                    }), this.viewer.scene.postProcessStages.add(this.postProcess)) : (a.ExpandByMars.mixedOcclusion.tilesFboClear.execute(this.viewer.scene.context), this.postProcess && this.viewer.scene.postProcessStages.remove(this.postProcess))
                }
            }, {
                key: "destroy",
                value: function () {
                    this.setEnabled(!1), this.viewer.scene._preUpdate.removeEventListener(this._preUpdateHandler, this), delete this.postProcess, this.DepthTexture && (this.DepthTexture.destroy(), delete this.DepthTexture), this.depthStencilTexture && (this.depthStencilTexture.destroy(), delete this.depthStencilTexture), this.tt && (this.tt.destroy(), delete this.tt)
                }
            }, {
                key: "alpha",
                get: function () {
                    return this._alpha
                },
                set: function (e) {
                    this._alpha = e
                }
            }, {
                key: "enabled",
                get: function () {
                    return this._enabled
                },
                set: function (e) {
                    this._enabled = e, this.setEnabled(e)
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TilesEditor = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        t.TilesEditor = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, this.scene = this.viewer.scene, this.options = i, this.position = i.position, this.heading = i.heading || 0, this.range = i.range || 100, this.dragging = !1, this.rotating = !1, this.enable = !1, this.billboards = this.viewer.scene.primitives.add(new a.BillboardCollection), this.handler = new a.ScreenSpaceEventHandler(this.viewer.canvas), this.movep = this.billboards.add({
                    position: this.position,
                    color: new a.Color.fromCssColorString("#FFFF00"),
                    image: i.moveImg,
                    show: !1,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }), this.rotatep = this.billboards.add({
                    position: this.position ? this.rotationPos() : null,
                    color: new a.Color.fromCssColorString("#FFFF00"),
                    image: i.rotateImg,
                    show: !1,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                })
            }
            return n(e, [{
                key: "update",
                value: function (e) {
                    for (var t in e) this[t] = e[t];
                    this.movep.position = this.position, this.rotatep.position = this.rotationPos()
                }
            }, {
                key: "modelMatrix",
                value: function () {
                    var e = a.Transforms.eastNorthUpToFixedFrame(this.position),
                        t = a.Matrix4.fromRotationTranslation(a.Matrix3.fromRotationZ(this.heading));
                    if (a.Matrix4.multiply(e, t, e), this.scale > 0 && 1 != this.scale && a.Matrix4.multiplyByUniformScale(e, this.scale, e), this.axis && "" != this.axis) {
                        var i;
                        switch (this.axis.toUpperCase()) {
                            case "Y_UP_TO_Z_UP":
                                i = a.Axis.Y_UP_TO_Z_UP;
                                break;
                            case "Z_UP_TO_Y_UP":
                                i = a.Axis.Z_UP_TO_Y_UP;
                                break;
                            case "X_UP_TO_Z_UP":
                                i = a.Axis.X_UP_TO_Z_UP;
                                break;
                            case "Z_UP_TO_X_UP":
                                i = a.Axis.Z_UP_TO_X_UP;
                                break;
                            case "X_UP_TO_Y_UP":
                                i = a.Axis.X_UP_TO_Y_UP;
                                break;
                            case "Y_UP_TO_X_UP":
                                i = a.Axis.Y_UP_TO_X_UP
                        }
                        i && (e = a.Matrix4.multiplyTransformation(e, i, e))
                    }
                    return e
                }
            }, {
                key: "rotationPos",
                value: function () {
                    var e = new a.Cartesian3(this.range, 0, 0),
                        t = a.Matrix4.getMatrix3(this.modelMatrix(), new a.Matrix3);
                    return e = a.Matrix3.multiplyByVector(t, e, e), e = a.Cartesian3.add(this.position, e, e)
                }
            }, {
                key: "pickTerrain",
                value: function (e) {
                    var t = this.viewer.camera.getPickRay(e);
                    return this.viewer.scene.globe.pick(t, this.viewer.scene)
                }
            }, {
                key: "setEnable",
                value: function (e) {
                    if (e) {
                        var t = this;
                        this.handler.setInputAction(function (e) {
                            t.handler_onLeafDown(e)
                        }, a.ScreenSpaceEventType.LEFT_DOWN), this.handler.setInputAction(function (e) {
                            t.handler_onMouseMove(e)
                        }, a.ScreenSpaceEventType.MOUSE_MOVE), this.handler.setInputAction(function (e) {
                            t.handler_onLeftUp(e)
                        }, a.ScreenSpaceEventType.LEFT_UP), this.rotatep.show = !0, this.movep.show = !0
                    } else this.handler.removeInputAction(a.ScreenSpaceEventType.LEFT_DOWN), this.handler.removeInputAction(a.ScreenSpaceEventType.MOUSE_MOVE), this.handler.removeInputAction(a.ScreenSpaceEventType.LEFT_UP), this.rotatep.show = !1, this.movep.show = !1;
                    this._enable = !1
                }
            }, {
                key: "handler_onLeafDown",
                value: function (e) {
                    for (var t = this.scene.drillPick(e.position, 2), i = 0; i < t.length; i++) {
                        var r = t[i];
                        if (a.defined(r) && r.primitive === this.movep) {
                            this.dragging = !0, this.scene.screenSpaceCameraController.enableRotate = !1;
                            break
                        }
                        if (a.defined(r) && r.primitive === this.rotatep) {
                            this.rotating = !0, this.scene.screenSpaceCameraController.enableRotate = !1;
                            break
                        }
                    }
                }
            }, {
                key: "handler_onMouseMove",
                value: function (e) {
                    var t = this.pickTerrain(e.endPosition);
                    if (t)
                        if (this.dragging) this.position = t, this.movep.position = this.position, this.rotatep.position = this.rotationPos(), this.options.onPosition && this.options.onPosition(this.position);
                        else if (this.rotating) {
                        this.rotatep.position = t, this.range = a.Cartesian3.distance(this.position, t);
                        var i = a.Transforms.eastNorthUpToFixedFrame(this.position);
                        i = a.Matrix4.getMatrix3(i, new a.Matrix3);
                        var r = a.Matrix3.getColumn(i, 0, new a.Cartesian3),
                            n = a.Matrix3.getColumn(i, 1, new a.Cartesian3),
                            o = a.Matrix3.getColumn(i, 2, new a.Cartesian3),
                            s = a.Cartesian3.subtract(t, this.position, new a.Cartesian3);
                        s = a.Cartesian3.cross(s, o, s), s = a.Cartesian3.cross(o, s, s), s = a.Cartesian3.normalize(s, s), this.heading = a.Cartesian3.angleBetween(r, s);
                        var l = a.Cartesian3.angleBetween(n, s);
                        l > .5 * Math.PI && (this.heading = 2 * Math.PI - this.heading), this.options.onHeading && this.options.onHeading(this.heading)
                    }
                }
            }, {
                key: "handler_onLeftUp",
                value: function (e) {
                    (this.dragging || this.rotating) && (this.rotating = this.dragging = !1, this.scene.screenSpaceCameraController.enableRotate = !0, this.billboards._createVertexArray = !0)
                }
            }, {
                key: "remove",
                value: function () {
                    this.billboards && (this.scene.primitives.remove(this.billboards), this.billboards = void 0), this.enable = !1
                }
            }, {
                key: "destroy",
                value: function () {
                    this.remove(), this.handler.destroy(), this.handler = null, this.viewer = null
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TilesClipPlan = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        (t.TilesClipPlan = function () {
            function e(t, i) {
                r(this, e), this.tileset = t, this.options = i || {}, this.options.type && (this.type = this.options.type), this.options.distance && (this.distance = this.options.distance)
            }
            return n(e, [{
                key: "createPlane",
                value: function (t) {
                    this.clear();
                    var i;
                    switch (t) {
                        case e.Type.Z:
                            i = [new a.ClippingPlane(new a.Cartesian3(0, 0, 1), 1)];
                            break;
                        default:
                        case e.Type.ZR:
                            i = [new a.ClippingPlane(new a.Cartesian3(0, 0, -1), 1)];
                            break;
                        case e.Type.X:
                            i = [new a.ClippingPlane(new a.Cartesian3(1, 0, 0), 1)];
                            break;
                        case e.Type.XR:
                            i = [new a.ClippingPlane(new a.Cartesian3(-1, 0, 0), 1)];
                            break;
                        case e.Type.Y:
                            i = [new a.ClippingPlane(new a.Cartesian3(0, 1, 0), 1)];
                            break;
                        case e.Type.YR:
                            i = [new a.ClippingPlane(new a.Cartesian3(0, -1, 0), 1)]
                    }
                    var r = new a.ClippingPlaneCollection({
                        planes: i,
                        edgeWidth: this.options.edgeWidth || 0
                    });
                    this.clippingPlanes = r, this.tileset.clippingPlanes = r
                }
            }, {
                key: "updateDistance",
                value: function (e) {
                    if (null != this.clippingPlanes)
                        for (var t = 0; t < this.clippingPlanes.length; t++) {
                            var i = this.clippingPlanes.get(t);
                            i.distance = e
                        }
                }
            }, {
                key: "clear",
                value: function () {
                    this.tileset.clippingPlanes && (this.tileset.clippingPlanes.enabled = !1), this.clippingPlanes && (this.clippingPlanes.destroy(), delete this.clippingPlanes)
                }
            }, {
                key: "planes",
                get: function () {
                    return this.clippingPlanes
                }
            }, {
                key: "type",
                get: function () {
                    return this._type
                },
                set: function (e) {
                    this._type = e, this.createPlane(e)
                }
            }, {
                key: "distance",
                get: function () {
                    return this._distance || 0
                },
                set: function (e) {
                    this._distance = e, this.updateDistance(e)
                }
            }]), e
        }()).Type = {
            Z: 1,
            ZR: 2,
            X: 3,
            XR: 4,
            Y: 5,
            YR: 6
        }
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function n(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TilesClip = void 0;
        var a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = function e(t, i, r) {
                null === t && (t = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(t, i);
                if (void 0 === n) {
                    var o = Object.getPrototypeOf(t);
                    return null === o ? void 0 : e(o, i, r)
                }
                if ("value" in n) return n.value;
                var a = n.get;
                if (void 0 !== a) return a.call(r)
            },
            l = i(0),
            u = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(l),
            c = i(34);
        t.TilesClip = function (e) {
            function t(e) {
                r(this, t);
                var i = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return i.viewer ? (i._clipOutSide = e.clipOutSide || !1, i.drawCommand && i.activeEdit(), i) : n(i)
            }
            return o(t, e), a(t, [{
                key: "activeEdit",
                value: function () {
                    u.ExpandByMars.tilesEditor.fbo = this.fbo, u.ExpandByMars.tilesEditor.polygonBounds = this.polygonBounds, u.ExpandByMars.tilesEditor.IsYaPing[0] = !0, u.ExpandByMars.tilesEditor.IsYaPing[2] = !0, u.ExpandByMars.tilesEditor.editVar[0] = this.clipOutSide, this.viewer.scene.primitives.add(this)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.primitives.remove(this), s(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this), delete this.clipOutSide, delete this.viewer
                }
            }, {
                key: "clipOutSide",
                get: function () {
                    return this._clipOutSide
                },
                set: function (e) {
                    this._clipOutSide = Boolean(e), u.ExpandByMars.tilesEditor.editVar[0] = this.clipOutSide
                }
            }]), t
        }(c.TilesBase)
    }, function (e, t) {
        e.exports = "uniform mat4 myPorjection;\r\nattribute vec3 position;\r\nvarying vec2 depth;\r\nvoid main()\r\n{\r\nvec4 pos = vec4(position.xyz,1.0);\r\ndepth = pos.zw;\r\npos.z = 0.0;\r\ngl_Position = czm_projection*pos;\r\n}"
    }, function (e, t) {
        e.exports = "#ifdef GL_FRAGMENT_PRECISION_HIGH\r\n    precision highp float;\r\n#else\r\n    precision mediump float;\r\n#endif\r\n\r\n#define OES_texture_float_linear\r\n\r\nvarying vec2 depth;\r\n\r\nvec4 packDepth(float depth)\r\n{\r\n    vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * depth;\r\n    enc = fract(enc);\r\n    enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);\r\n    return enc;\r\n}\r\n\r\nvoid main()\r\n{\r\n    float fDepth = (depth.x / 5000.0)/2.0 + 0.5;\r\n    gl_FragColor = packDepth(fDepth);\r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function n(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TilesFlat = void 0;
        var a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = function e(t, i, r) {
                null === t && (t = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(t, i);
                if (void 0 === n) {
                    var o = Object.getPrototypeOf(t);
                    return null === o ? void 0 : e(o, i, r)
                }
                if ("value" in n) return n.value;
                var a = n.get;
                if (void 0 !== a) return a.call(r)
            },
            l = i(0),
            u = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(l),
            c = i(34);
        t.TilesFlat = function (e) {
            function t(e) {
                r(this, t);
                var i = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return i.viewer ? (i._b3dmOffset = e.b3dmOffset || new u.Cartesian2, i._flatHeight = e.flatHeight || 0, i.drawCommand && i.activeEdit(), i) : n(i)
            }
            return o(t, e), a(t, [{
                key: "activeEdit",
                value: function () {
                    u.ExpandByMars.tilesEditor.fbo = this.fbo, u.ExpandByMars.tilesEditor.polygonBounds = this.polygonBounds, u.ExpandByMars.tilesEditor.IsYaPing[0] = !0, u.ExpandByMars.tilesEditor.IsYaPing[1] = !0, u.ExpandByMars.tilesEditor.heightVar[0] = this.minLocalPos.z, u.ExpandByMars.tilesEditor.heightVar[1] = this.flatHeight, this.viewer.scene.primitives.add(this)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.primitives.remove(this), s(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this), delete this.viewer, delete this.flatHeight, delete this._flatHeight
                }
            }, {
                key: "flatHeight",
                get: function () {
                    return this._flatHeight
                },
                set: function (e) {
                    this._flatHeight = Number(e), u.ExpandByMars.tilesEditor.heightVar[1] = this._flatHeight
                }
            }]), t
        }(c.TilesBase)
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function n(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TilesFlood = void 0;
        var a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = function e(t, i, r) {
                null === t && (t = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(t, i);
                if (void 0 === n) {
                    var o = Object.getPrototypeOf(t);
                    return null === o ? void 0 : e(o, i, r)
                }
                if ("value" in n) return n.value;
                var a = n.get;
                if (void 0 !== a) return a.call(r)
            },
            l = i(0),
            u = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(l),
            c = i(34);
        t.TilesFlood = function (e) {
            function t(e) {
                r(this, t);
                var i = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return i.floodColor = e.floodColor || [.15, .7, .95, .5], i.floodSpeed = e.floodSpeed || 5.5, i._floodAll = e.floodAll, i.maxFloodDepth = e.floodSpeed || 200, i.ableFlood = !0, (i.drawCommand || i._floodAll) && i.activeEdit(), i
            }
            return o(t, e), a(t, [{
                key: "bindSpeed",
                value: function () {
                    var e = this;
                    this.speedFun = function () {
                        e.ableFlood && (u.ExpandByMars.tilesEditor.floodVar[1] += e.floodSpeed / 55, u.ExpandByMars.tilesEditor.floodVar[1] >= u.ExpandByMars.tilesEditor.floodVar[2] && (u.ExpandByMars.tilesEditor.floodVar[1] = u.ExpandByMars.tilesEditor.floodVar[2]))
                    }, this.viewer.clock.onTick.addEventListener(this.speedFun)
                }
            }, {
                key: "resetFlood",
                value: function () {
                    u.ExpandByMars.tilesEditor.floodVar[1] = u.ExpandByMars.tilesEditor.floodVar[0]
                }
            }, {
                key: "activeEdit",
                value: function () {
                    this.bindSpeed(), u.ExpandByMars.tilesEditor.fbo = this.fbo, u.ExpandByMars.tilesEditor.polygonBounds = this.polygonBounds, u.ExpandByMars.tilesEditor.IsYaPing[0] = !0, u.ExpandByMars.tilesEditor.IsYaPing[3] = !0, u.ExpandByMars.tilesEditor.floodVar = [this.minLocalPos.z, this.minLocalPos.z, this.minLocalPos.z + this.maxFloodDepth, 200], u.ExpandByMars.tilesEditor.floodColor = this.floodColor, u.ExpandByMars.tilesEditor.editVar[1] = this.floodAll || !1, !this.floodAll && this.viewer.scene.primitives.add(this)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.clock.onTick.removeEventListener(this.speedFun), this.viewer.scene.primitives.remove(this), s(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this), delete this.viewer, delete this.floodColor, delete this.floodSpeed, delete this.ableFlood, delete this.speedFun, delete this.floodAll, delete this.maxFloodDepth
                }
            }, {
                key: "floodAll",
                get: function () {
                    return this._floodAll
                },
                set: function (e) {
                    this._floodAll = Boolean(e), u.ExpandByMars.tilesEditor.editVar[1] = this.floodAll
                }
            }]), t
        }(c.TilesBase)
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t.default = e, t
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.FlyLine = void 0;
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = i(0),
            l = r(s),
            u = i(2),
            c = i(1),
            h = i(28),
            d = i(20),
            f = r(d),
            p = new l.Matrix4,
            m = new l.Matrix3,
            g = new l.Cartesian3,
            v = new l.Quaternion,
            y = {
                model: {
                    show: !1,
                    scale: 1,
                    minimumPixelSize: 50
                },
                label: {
                    show: !1,
                    color: "#ffffff",
                    opacity: 1,
                    font_family: "楷体",
                    font_size: 20,
                    border: !0,
                    border_color: "#000000",
                    border_width: 3,
                    background: !1,
                    hasPixelOffset: !0,
                    pixelOffsetX: 30,
                    pixelOffsetY: -30,
                    scaleByDistance: !0,
                    scaleByDistance_far: 1e7,
                    scaleByDistance_farValue: .4,
                    scaleByDistance_near: 1e5,
                    scaleByDistance_nearValue: 1
                },
                path: {
                    show: !1,
                    lineType: "solid",
                    color: "#3388ff",
                    opacity: .5,
                    width: 1,
                    outline: !1,
                    outlineColor: "#ffffff",
                    outlineWidth: 2
                },
                shadow: {
                    show: !1,
                    color: "#00ff00",
                    outline: !1,
                    opacity: .3
                },
                camera: {
                    type: "gs",
                    followedX: 50,
                    followedZ: 10
                },
                showGroundHeight: !1
            };
        t.FlyLine = function () {
            function e(t, i) {
                n(this, e), this.viewer = t, this.id = i.id || 0, this.name = i.name || "", this.points = i.points, this.speeds = i.speed;
                for (var r in y) {
                    var a = y[r];
                    if (i.hasOwnProperty(r) && "object" === o(i[r]))
                        for (var s in a) i[r].hasOwnProperty(s) || (i[r][s] = a[s]);
                    else i[r] = a
                }
                this.options = i, this._isStart = !1, this._createLine()
            }
            return a(e, [{
                key: "_createLine",
                value: function () {
                    var e, t = new l.SampledPositionProperty,
                        i = this.viewer.clock.currentTime,
                        r = this.points;
                    if (r.length < 2) return void console.log("路线无坐标数据，无法漫游！");
                    var n = this.speeds,
                        o = !(0, u.isNumber)(n);
                    if (2 == r.length) {
                        var a = [(r[0][0] + r[1][0]) / 2, (r[0][1] + r[1][1]) / 2, r[0][2]];
                        r.splice(1, 0, a), n && o && n.splice(1, 0, n[0])
                    }
                    for (var s, c = [], h = 0, d = 0, f = {}, p = [], m = 0, g = r.length; m < g; m++) {
                        var v = r[m],
                            y = l.Cartesian3.fromDegrees(v[0], v[1], v[2] || 0);
                        if (y.lonlat = v, 0 == m) {
                            var _ = l.JulianDate.addSeconds(i, h, new l.JulianDate);
                            y.time = _, y.second = h, t.addSample(_, y)
                        } else {
                            var w = o ? n ? n[m - 1] : 100 : n || 100;
                            c.push(w);
                            var b = l.Cartesian3.distance(y, s),
                                C = Math.round(b / w * 3.6);
                            C < .5 && (C = .5), h += C, d += b;
                            var _ = l.JulianDate.addSeconds(i, h, new l.JulianDate);
                            y.time = _, y.second = h, t.addSample(_, y)
                        }
                        s = y, p.push(y), f[m] = d
                    }
                    this.speeds = c, this.arrLinePoint = p, e = l.JulianDate.addSeconds(i, h, new l.JulianDate), this.alltimes = h, this.alllen = d, this.stepLen = f, this.startTime = i, this.stopTime = e, this.property = t, this.options.interpolation && this.property.setInterpolationOptions({
                        interpolationDegree: this.options.interpolationDegree || 2,
                        interpolationAlgorithm: l.LagrangePolynomialApproximation
                    })
                }
            }, {
                key: "_createEntity",
                value: function () {
                    this.options.label.text = this.name;
                    var e = f.model.style2Entity(this.options.model),
                        t = f.label.style2Entity(this.options.label),
                        i = f.polyline.style2Entity(this.options.path, {});
                    i.isAll || (i.leadTime = 0, i.trailTime = 10 * this.alltimes);
                    var r = new l.VelocityOrientationProperty(this.property);
                    this.velocityOrientation = r, this.entity && (this.viewer.entities.remove(this.entity), delete this.entity), this.entity = this.viewer.entities.add({
                        availability: new l.TimeIntervalCollection([new l.TimeInterval({
                            start: this.startTime,
                            stop: this.stopTime
                        })]),
                        position: this.property,
                        orientation: r,
                        model: e,
                        label: t,
                        path: i,
                        point: {
                            show: !e.show,
                            color: new l.Color.fromCssColorString("#ffffff").withAlpha(.01),
                            pixelSize: 1
                        },
                        popup: this._popup
                    })
                }
            }, {
                key: "clampToGround",
                value: function (e, t) {
                    function i() {
                        s++;
                        var d = l.Cartesian3.fromDegrees(n[s - 1][0], n[s - 1][1], n[s - 1][2] || 0),
                            f = l.Cartesian3.fromDegrees(n[s][0], n[s][1], n[s][2] || 0),
                            p = o[s - 1],
                            m = [d, f];
                        (0, c.terrainPolyline)({
                            viewer: a,
                            positions: m,
                            has3dtiles: t.has3dtiles,
                            splitNum: t.splitNum,
                            offset: t.offset,
                            calback: function (t, o) {
                                if (o) 1 == s && u.push(n[0]), u.push(n[s]), h.push(p);
                                else
                                    for (var a = 0; a < t.length; a++) {
                                        var c = t[a],
                                            d = l.Cartographic.fromCartesian(c);
                                        u.push([l.Math.toDegrees(d.longitude), l.Math.toDegrees(d.latitude), d.height]), h.push(p)
                                    }
                                s >= n.length - 1 ? (r.points = u, r.speeds = h, r._createLine(), e && e({
                                    lonlats: u,
                                    speeds: h
                                })) : i()
                            }
                        })
                    }
                    t = t || {};
                    var r = this,
                        n = this.points,
                        o = this.speeds,
                        a = this.viewer,
                        s = 0,
                        u = [],
                        h = [];
                    i()
                }
            }, {
                key: "updateStyle",
                value: function (e) {
                    for (var t in e)
                        if ("object" === o(e[t]) && this.options[t])
                            for (var i in e[t]) this.options[t][i] = e[t][i];
                        else this.options[t] = e[t]
                }
            }, {
                key: "updateAngle",
                value: function (e, t) {
                    if (e) this.entity.orientation = this.velocityOrientation;
                    else {
                        t = t || {};
                        var i = this.position,
                            r = this.orientation,
                            n = (0, h.getHeadingPitchRollByOrientation)(i, r),
                            o = n.heading,
                            a = l.Math.toRadians(Number(t.pitch || 0)),
                            s = l.Math.toRadians(Number(t.roll || 0));
                        this.entity.orientation = l.Transforms.headingPitchRollQuaternion(i, new l.HeadingPitchRoll(o, a, s))
                    }
                }
            }, {
                key: "start",
                value: function (e) {
                    if (!l.defined(this.arrLinePoint) || 0 == this.arrLinePoint.length) return void console.log("没有坐标数据，飞行路线启动失败");
                    this.endfun = e, this._isStart && this.stop(), this._isStart = !0, this._createEntity(), this._bak_multiplier = this.viewer.clock.multiplier, this.viewer.clock.multiplier = this.options.multiplier || 1, this.viewer.clock.shouldAnimate = !0, this.viewer.clock.currentTime = this.startTime.clone(), this.options.clockLoop && (this._bak_clockRange = this.viewer.clock.clockRange, this._bak_startTime = this.viewer.clock.startTime, this._bak_stopTime = this.viewer.clock.stopTime, this.viewer.clock.clockRange = l.ClockRange.LOOP_STOP, this.viewer.clock.startTime = this.startTime.clone(), this.viewer.clock.stopTime = this.stopTime.clone(), this.viewer.timeline && this.viewer.timeline.zoomTo(this.startTime, this.stopTime)), this.options.shadow.show && ("wall" == this.options.shadow.type ? this.addWallShading() : "cylinder" == this.options.shadow.type && this.addCylinderShading()), this._flyok_point_index = 0, this.viewer.scene.preRender.addEventListener(this.preRender_eventHandler, this)
                }
            }, {
                key: "preRender_eventHandler",
                value: function (e) {
                    if (this._isStart && null != this.entity) {
                        l.JulianDate.greaterThanOrEquals(this.viewer.clock.currentTime, this.stopTime) && (this._flyok_point_index = this.arrLinePoint.length - 1, this.endfun && this.endfun(), this.endfun = null);
                        var t = this.position;
                        if (l.defined(t)) {
                            switch (this.options.camera.type) {
                                default:
                                    void 0 != this.viewer.trackedEntity && (this.viewer.trackedEntity = void 0);
                                    break;
                                case "gs":
                                    this.viewer.trackedEntity != this.entity && (this.viewer.trackedEntity = this.entity);
                                    break;
                                case "dy":
                                    this.viewer.trackedEntity != this.entity && (this.viewer.trackedEntity = this.entity);
                                    var i = this.getModelMatrix(),
                                        r = this.options.camera.followedX,
                                        n = this.options.camera.followedZ;
                                    this.viewer.scene.camera.lookAtTransform(i, new l.Cartesian3(-r, 0, n));
                                    break;
                                case "sd":
                                    this.viewer.trackedEntity != this.entity && (this.viewer.trackedEntity = this.entity);
                                    var i = this.getModelMatrix(),
                                        n = this.options.camera.followedZ;
                                    this.viewer.scene.camera.lookAtTransform(i, new l.Cartesian3(-1, 0, n))
                            }
                            this.realTime(t)
                        }
                    }
                }
            }, {
                key: "getCurrIndex",
                value: function () {
                    var e = this.arrLinePoint.length;
                    l.JulianDate.compare(this.viewer.clock.currentTime, this.arrLinePoint[0].time) <= 0 && (this._flyok_point_index = 0), (this._flyok_point_index < 0 || this._flyok_point_index >= e) && (this._flyok_point_index = 0);
                    for (var t = this._flyok_point_index; t < e; t++) {
                        var i = this.arrLinePoint[t];
                        if (l.JulianDate.compare(this.viewer.clock.currentTime, i.time) <= 0) return t - 1
                    }
                    for (var t = 0; t < e; t++) {
                        var i = this.arrLinePoint[t];
                        if (l.JulianDate.compare(this.viewer.clock.currentTime, i.time) <= 0) return t - 1
                    }
                    return e - 1
                }
            }, {
                key: "realTime",
                value: function (e) {
                    var t = l.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.startTime),
                        i = (0, c.formatPosition)(e);
                    this._flyok_point_index = this.getCurrIndex();
                    var r = this.arrLinePoint.length;
                    (this._flyok_point_index < 0 || this._flyok_point_index >= r) && (this._flyok_point_index = 0);
                    var n = this.stepLen[this._flyok_point_index],
                        o = this.arrLinePoint[this._flyok_point_index];
                    if (l.defined(o) && (n += l.Cartesian3.distance(e, o)), n >= this.alllen && (this._flyok_point_index = r - 1, n = this.alllen), this.timeinfo = {
                            time: t,
                            len: n,
                            x: i.x,
                            y: i.y,
                            z: i.z
                        }, this.options.shadow.show && "wall" == this.options.shadow.type) {
                        var a = this.arrLinePoint.slice(0, this._flyok_point_index + 1);
                        a.push(e), this.updateWallShading(a)
                    }
                    var s = l.Cartographic.fromCartesian(e),
                        h = this.viewer.scene.globe.getHeight(s);
                    if (null != h && h > 0 && (this.timeinfo.hbgd = h, this.timeinfo.ldgd = i.z - h), this.options.showGroundHeight) {
                        var d = this;
                        (0, c.terrainPolyline)({
                            viewer: d.viewer,
                            positions: [e, e],
                            calback: function (e, t) {
                                if (null != e && 0 != e.length && !t) {
                                    var r = (0, c.formatPosition)(e[0]).z,
                                        n = i.z - r;
                                    if (this.timeinfo.hbgd = r, this.timeinfo.ldgd = n, this.entity.label) {
                                        var o = (0, u.formatLength)(this.timeinfo.z),
                                            a = (0, u.formatLength)(this.timeinfo.ldgd);
                                        this.entity.label.text = this.name + "\n漫游高程：" + o + "\n离地距离：" + a
                                    }
                                }
                            }
                        })
                    }
                }
            }, {
                key: "getModelMatrix",
                value: function () {
                    var e = this.entity,
                        t = this.viewer.clock.currentTime,
                        i = l.Property.getValueOrUndefined(e.position, t, g);
                    if (l.defined(i)) {
                        var r = l.Property.getValueOrUndefined(e.orientation, t, v);
                        return l.defined(r) ? l.Matrix4.fromRotationTranslation(l.Matrix3.fromQuaternion(r, m), i, p) : l.Transforms.eastNorthUpToFixedFrame(i, void 0, p)
                    }
                }
            }, {
                key: "addWallShading",
                value: function () {
                    this._wall_positions = [], this._wall_minimumHeights = [], this._wall_maximumHeights = [];
                    var e = this,
                        t = f.wall.style2Entity(this.options.shadow);
                    t.minimumHeights = new l.CallbackProperty(function (t) {
                        return e._wall_minimumHeights
                    }, !1), t.maximumHeights = new l.CallbackProperty(function (t) {
                        return e._wall_maximumHeights
                    }, !1), t.positions = new l.CallbackProperty(function (t) {
                        return e._wall_positions
                    }, !1), this.wallEntity = this.viewer.entities.add({
                        wall: t
                    })
                }
            }, {
                key: "updateWallShading",
                value: function (e) {
                    for (var t = [], i = [], r = [], n = 0; n < e.length; n++) {
                        var o = e[n].clone();
                        if (o) {
                            t.push(o);
                            var a = l.Cartographic.fromCartesian(o);
                            i.push(0), r.push(a.height)
                        }
                    }
                    this._wall_positions = t, this._wall_minimumHeights = i, this._wall_maximumHeights = r
                }
            }, {
                key: "addCylinderShading",
                value: function () {
                    var e = 100,
                        t = 100,
                        i = this.property,
                        r = f.wall.style2Entity(this.options.shadow);
                    r.length = new l.CallbackProperty(function (e) {
                        return t
                    }, !1), r.topRadius = 0, r.bottomRadius = new l.CallbackProperty(function (t) {
                        return e
                    }, !1), r.numberOfVerticalLines = 0, this.cylinderEntity = this.viewer.entities.add({
                        position: new l.CallbackProperty(function (r) {
                            var n = l.Property.getValueOrUndefined(i, r, new l.Cartesian3),
                                o = l.Cartographic.fromCartesian(n),
                                a = l.Cartesian3.fromRadians(o.longitude, o.latitude, o.height / 2);
                            return t = o.height, e = .3 * t, a
                        }, !1),
                        cylinder: r
                    })
                }
            }, {
                key: "getTerrainHeight",
                value: function (e) {
                    function t() {
                        h++;
                        var d = [r[h - 1], r[h]];
                        (0, c.terrainPolyline)({
                            viewer: i.viewer,
                            positions: d,
                            calback: function (i, d) {
                                for (var f = r[h - 1].lonlat[2], p = r[h].lonlat[2], m = (p - f) / i.length, g = 0; g < i.length; g++) {
                                    0 != g && (n += l.Cartesian3.distance(i[g], i[g - 1])), o.push(Number(n.toFixed(1)));
                                    var v = (0, c.formatPosition)(i[g]);
                                    u.push(v);
                                    var y = d ? 0 : v.z;
                                    a.push(y);
                                    var _ = Number((f + m * g).toFixed(1));
                                    s.push(_)
                                }
                                h >= r.length - 1 ? e({
                                    arrLength: o,
                                    arrFxgd: s,
                                    arrHbgd: a,
                                    arrPoint: u
                                }) : t()
                            }
                        })
                    }
                    var i = this,
                        r = this.arrLinePoint,
                        n = 0,
                        o = [],
                        a = [],
                        s = [],
                        u = [],
                        h = 0;
                    t()
                }
            }, {
                key: "toGeoJSON",
                value: function () {
                    return this.options
                }
            }, {
                key: "toCZML",
                value: function () {
                    for (var e = (this.options, this.startTime.toString()), t = this.stopTime.toString(), i = [], r = this.arrLinePoint, n = 0, o = r.length; n < o; n++) {
                        var a = r[n];
                        i.push(a.second), i = i.concat(a.lonlat)
                    }
                    var s = {
                        id: this.name,
                        description: this.options.remark,
                        availability: e + "/" + t,
                        orientation: {
                            velocityReference: "#position"
                        },
                        position: {
                            epoch: e,
                            cartographicDegrees: i,
                            interpolationAlgorithm: "LAGRANGE",
                            interpolationDegree: 2
                        }
                    };
                    return this.options.label.show && (s.label = {
                        show: !0,
                        outlineWidth: 2,
                        text: this.name,
                        font: "12pt 微软雅黑 Console",
                        outlineColor: {
                            rgba: [0, 0, 0, 255]
                        },
                        horizontalOrigin: "LEFT",
                        fillColor: {
                            rgba: [213, 255, 0, 255]
                        }
                    }), this.options.path.show && (s.path = {
                        show: !0,
                        material: {
                            solidColor: {
                                color: {
                                    rgba: [255, 0, 0, 255]
                                }
                            }
                        },
                        width: 5,
                        resolution: 1,
                        leadTime: 0,
                        trailTime: this.alltimes
                    }), this.options.model.show && (s.model = this.options.model), [{
                        version: "1.0",
                        id: "document",
                        clock: {
                            interval: e + "/" + t,
                            currentTime: e,
                            multiplier: 1
                        }
                    }, s]
                }
            }, {
                key: "stop",
                value: function () {
                    this.viewer.trackedEntity = void 0, this.viewer.scene.preRender.removeEventListener(this.preRender_eventHandler, this), this.entity && (this.viewer.entities.remove(this.entity), delete this.entity), this._bak_startTime && (this.viewer.clock.startTime = this._bak_startTime, delete this._bak_startTime), this._bak_stopTime && (this.viewer.clock.stopTime = this._bak_stopTime, delete this._bak_stopTime), this._bak_multiplier && (this.viewer.clock.multiplier = this._bak_multiplier, delete this._bak_multiplier), this._bak_clockRange && (this.viewer.clock.clockRange = this._bak_clockRange, delete this._bak_clockRange), this._flyok_point_index = 0, this._isStart = !1
                }
            }, {
                key: "destroy",
                value: function () {
                    this.stop(), this.entity && (this.viewer.entities.remove(this.entity), delete this.entity), this.wallEntity && (this.viewer.entities.remove(this.wallEntity), delete this.wallEntity), this.cylinderEntity && (this.viewer.entities.remove(this.cylinderEntity), delete this.cylinderEntity)
                }
            }, {
                key: "popup",
                get: function () {
                    return this._popup
                },
                set: function (e) {
                    this._popup = e, this.entity && (this.entity.popup = e)
                }
            }, {
                key: "info",
                get: function () {
                    return this.timeinfo
                }
            }, {
                key: "indexForFlyOK",
                get: function () {
                    return this._flyok_point_index
                }
            }, {
                key: "position",
                get: function () {
                    return l.Property.getValueOrUndefined(this.property, this.viewer.clock.currentTime, g)
                }
            }, {
                key: "orientation",
                get: function () {
                    return l.Property.getValueOrUndefined(this.velocityOrientation, this.viewer.clock.currentTime, v)
                }
            }, {
                key: "hdr",
                get: function () {
                    var e = this.position,
                        t = this.orientation;
                    return (0, h.getHeadingPitchRollByOrientation)(e, t)
                }
            }, {
                key: "matrix",
                get: function () {
                    return this.getModelMatrix()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.EditPolygonEx = void 0;
        var r = i(0),
            n = (function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                t.default = e
            }(r), i(19));
        t.EditPolygonEx = n.EditPolygon.extend({
            _hasMidPoint: !1,
            changePositionsToCallback: function () {
                this._positions_draw = this.entity._positions_draw, this._positions_show = this.entity._positions_show
            },
            updateAttrForEditing: function () {
                if (null == this._positions_draw || this._positions_draw.length < this._minPointNum) return void(this._positions_show = this._positions_draw);
                this._positions_show = this.getShowPositions(this._positions_draw, this.entity.attribute), this.entity._positions_show = this._positions_show
            },
            getShowPositions: function (e, t) {
                return e
            },
            finish: function () {
                this.entity._positions_show = this._positions_show, this.entity._positions_draw = this._positions_draw
            }
        })
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.CircleFadeMaterial = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(133),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s),
            u = new a.Color(0, 0, 0, 0),
            c = t.CircleFadeMaterial = function () {
                function e(t) {
                    r(this, e), t = a.defaultValue(t, a.defaultValue.EMPTY_OBJECT), this._definitionChanged = new a.Event, this._color = void 0, this._colorSubscription = void 0, this.color = a.defaultValue(t.color, u), this._duration = t.duration || 1e3, this._time = void 0
                }
                return n(e, [{
                    key: "getType",
                    value: function (e) {
                        return a.Material.CircleFadeMaterialType
                    }
                }, {
                    key: "getValue",
                    value: function (e, t) {
                        return a.defined(t) || (t = {}), t.color = a.Property.getValueOrClonedDefault(this._color, e, u, t.color), void 0 === this._time && (this._time = (new Date).getTime()), t.time = ((new Date).getTime() - this._time) / this._duration, t
                    }
                }, {
                    key: "equals",
                    value: function (t) {
                        return this === t || t instanceof e && a.Property.equals(this._color, t._color)
                    }
                }, {
                    key: "isConstant",
                    get: function () {
                        return !1
                    }
                }, {
                    key: "definitionChanged",
                    get: function () {
                        return this._definitionChanged
                    }
                }]), e
            }();
        a.defineProperties(c.prototype, {
            color: a.createPropertyDescriptor("color")
        }), a.Material.CircleFadeMaterialType = "CircleFadeMaterial", a.Material._materialCache.addMaterial(a.Material.CircleFadeMaterialType, {
            fabric: {
                type: a.Material.CircleFadeMaterialType,
                uniforms: {
                    color: new a.Color(1, 0, 0, 1),
                    time: 1
                },
                source: l.default
            },
            translucent: function () {
                return !0
            }
        })
    }, function (e, t) {
        e.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    material.diffuse = 1.5 * color.rgb;\r\n    vec2 st = materialInput.st;\r\n    float dis = distance(st, vec2(0.5, 0.5));\r\n    float per = fract(time);\r\n    if(dis > per * 0.5){\r\n        //material.alpha = 0.0;\r\n        discard;\r\n    }else {\r\n            material.alpha = color.a  * dis / per / 2.0;\r\n    }\r\n    return material;\r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.CircleScanMaterial = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(135),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s),
            u = t.CircleScanMaterial = function () {
                function e(t) {
                    r(this, e), t = a.defaultValue(t, a.defaultValue.EMPTY_OBJECT), this._definitionChanged = new a.Event, this._colorSubscription = void 0, this._color = a.defaultValue(t.color, new a.Color(1, 0, 0, 1)), this._scanImg = a.defaultValue(t.url)
                }
                return n(e, [{
                    key: "getType",
                    value: function (e) {
                        return a.Material.EntityScanMaterialType
                    }
                }, {
                    key: "getValue",
                    value: function (e, t) {
                        return a.defined(t) || (t = {}), t.color = this._color, t.scanImg = this._scanImg, t
                    }
                }, {
                    key: "equals",
                    value: function (t) {
                        return this === t || t instanceof e && a.Property.equals(this._color, t._color)
                    }
                }, {
                    key: "isConstant",
                    get: function () {
                        return !1
                    }
                }, {
                    key: "definitionChanged",
                    get: function () {
                        return this._definitionChanged
                    }
                }]), e
            }();
        a.defineProperties(u.prototype, {
            color: a.createPropertyDescriptor("color"),
            scanImg: a.createPropertyDescriptor("scanImg")
        }), a.Material.EntityScanMaterialType = "CircleScanMaterial", a.Material._materialCache.addMaterial(a.Material.EntityScanMaterialType, {
            fabric: {
                type: a.Material.EntityScanMaterialType,
                uniforms: {
                    color: new a.Color(1, 0, 0, 1),
                    scanImg: ""
                },
                source: l.default
            },
            translucent: function () {
                return !0
            }
        })
    }, function (e, t) {
        e.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    vec2 st = materialInput.st;\r\n    vec4 imgC = texture2D(scanImg,st);\r\n    if(imgC.a>.0){\r\n        material.diffuse = color.rgb;\r\n    }\r\n    material.alpha = imgC.a;\r\n    return material;\r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.GroundLineFlowMaterial = void 0;
        var n = i(0),
            o = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(n),
            a = i(137),
            s = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(a);
        t.GroundLineFlowMaterial = function e(t) {
            r(this, e), t = o.defaultValue(t, o.defaultValue.EMPTY_OBJECT);
            var i = o.defaultValue(t.color, new o.Color(1, 0, 0, 1)),
                n = t.url || t.image,
                a = o.defaultValue(t.repeat, {
                    x: 10,
                    y: 1
                }),
                l = o.defaultValue(t.axisY, !1),
                u = o.defaultValue(t.speed, 1);
            return new o.Material({
                fabric: {
                    uniforms: {
                        color: i,
                        image: n,
                        repeat: a,
                        axisY: l,
                        speed: u
                    },
                    source: s.default
                }
            })
        }
    }, function (e, t) {
        e.exports = "czm_material czm_getMaterial(czm_materialInput materialInput) \r\n{ \r\n    czm_material material = czm_getDefaultMaterial(materialInput); \r\n    vec2 st = repeat * materialInput.st;\r\n    // vec4 color = texture2D(image, materialInput.st/repeat); \r\n    vec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - czm_frameNumber*speed/100.0), st.t));\r\n    if(color.a == 0.0)\r\n    {\r\n        material.alpha = colorImage.a;\r\n        material.diffuse = colorImage.rgb; \r\n    }\r\n    else\r\n    {\r\n        material.alpha = colorImage.a * color.a;\r\n        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \r\n    }\r\n    return material; \r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function n(e, t) {
            d++;
            var i = f + d + "Type",
                r = f + d + "Image";
            return s.Material[i] = i, s.Material[r] = e, s.Material._materialCache.addMaterial(s.Material[i], {
                fabric: {
                    type: i,
                    uniforms: {
                        color: new s.Color(1, 0, 0, 1),
                        image: s.Material[r],
                        time: 0,
                        repeat: t || new s.Cartesian2(1, 1)
                    },
                    source: u.default
                },
                translucent: function () {
                    return !0
                }
            }), {
                type: s.Material[i],
                image: s.Material[r]
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TextMaterial = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(a),
            l = i(139),
            u = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(l),
            c = new s.Color(0, 0, 0, 0),
            h = t.TextMaterial = function () {
                function e(t) {
                    if (r(this, e), t = s.defaultValue(t, s.defaultValue.EMPTY_OBJECT), t.text) {
                        this._text = t.text, this._textStyles = s.defaultValue(t.textStyles, {
                            font: "50px 楷体",
                            fill: !0,
                            fillColor: new s.Color(1, 1, 0, 1),
                            stroke: !0,
                            strokeWidth: 2,
                            strokeColor: new s.Color(1, 1, 1, .8),
                            backgroundColor: new s.Color(1, 1, 1, .1),
                            textBaseline: "top",
                            padding: 40
                        }), this._definitionChanged = new s.Event, this._color = void 0, this._colorSubscription = void 0, this.color = s.defaultValue(t.color, c), this.repeat = s.defaultValue(t.repeat, new s.Cartesian2(1, 1)), this._img = this._text2Img(this._text, this._textStyles);
                        var i = n(this._img.src, this.repeat);
                        this._materialType = s.clone(i.type), this._materialImage = s.clone(i.image)
                    }
                }
                return o(e, [{
                    key: "getType",
                    value: function (e) {
                        return this._materialType
                    }
                }, {
                    key: "getValue",
                    value: function (e, t) {
                        return s.defined(t) || (t = {}), t.color = s.Property.getValueOrClonedDefault(this._color, e, c, t.color), t.image = this._materialImage, t.repeat = this.repeat, t
                    }
                }, {
                    key: "equals",
                    value: function (t) {
                        return this === t || t instanceof e && s.Property.equals(this._color, t._color)
                    }
                }, {
                    key: "_text2Img",
                    value: function (e, t) {
                        var i = s.writeTextToCanvas(e, t);
                        if (i) {
                            this.canvas = i;
                            var r = new Image;
                            return r.src = i.toDataURL("image/png"), r
                        }
                    }
                }, {
                    key: "isConstant",
                    get: function () {
                        return !1
                    }
                }, {
                    key: "definitionChanged",
                    get: function () {
                        return this._definitionChanged
                    }
                }, {
                    key: "text",
                    get: function () {
                        return this._text
                    },
                    set: function (e) {
                        if (e) {
                            this._text = e, delete this._img, this._img = this._text2Img(this._text, this._textStyles);
                            var t = n(this._img.src, this.repeat);
                            this._materialType = s.clone(t.type), this._materialImage = s.clone(t.image)
                        }
                    }
                }, {
                    key: "textStyles",
                    get: function () {
                        return this._textStyles
                    },
                    set: function (e) {
                        if (e) {
                            delete this._img, this._textStyles = e, this._img = this._text2Img(this._text, this._textStyles);
                            var t = n(this._img.src, this.repeat);
                            this._materialType = s.clone(t.type), this._materialImage = s.clone(t.image)
                        }
                    }
                }]), e
            }();
        s.defineProperties(h.prototype, {
            color: s.createPropertyDescriptor("color")
        });
        var d = 0,
            f = "Text"
    }, function (e, t) {
        e.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    vec2 mst = fract(materialInput.st + vec2(.0,.0));\r\n    mst = vec2(mst.x,mst.y);\r\n    vec2 st = fract(repeat * mst);\r\n    vec4 colorImage = texture2D(image, st);\r\n    if(color.a == 0.0)\r\n    {\r\n        material.alpha = colorImage.a;\r\n        material.diffuse = colorImage.rgb; \r\n    }\r\n    else\r\n    {\r\n        material.alpha = colorImage.a * color.a;\r\n        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \r\n    }\r\n    return material;\r\n}"
    }, function (e, t) {
        e.exports = "attribute vec4 position;\r\nattribute vec3 normal;\r\n\r\nvarying vec3 v_position;\r\nvarying vec3 v_positionWC;\r\nvarying vec3 v_positionEC;\r\nvarying vec3 v_normalEC;\r\n\r\nvoid main()\r\n{\r\n    gl_Position = czm_modelViewProjection * position;\r\n    v_position = vec3(position);\r\n    v_positionWC = (czm_model * position).xyz;\r\n    v_positionEC = (czm_modelView * position).xyz;\r\n    v_normalEC = czm_normal * normal;\r\n}"
    }, function (e, t) {
        e.exports = '#ifdef GL_OES_standard_derivatives\r\n    #extension GL_OES_standard_derivatives : enable\r\n#endif\r\n\r\nuniform bool u_showIntersection;\r\nuniform bool u_showThroughEllipsoid;\r\n\r\nuniform float u_radius;\r\nuniform float u_xHalfAngle;\r\nuniform float u_yHalfAngle;\r\nuniform float u_normalDirection;\r\nuniform float u_type;\r\n\r\nvarying vec3 v_position;\r\nvarying vec3 v_positionWC;\r\nvarying vec3 v_positionEC;\r\nvarying vec3 v_normalEC;\r\n\r\nvec4 getColor(float sensorRadius, vec3 pointEC)\r\n{\r\n    czm_materialInput materialInput;\r\n\r\n    vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;\r\n    materialInput.st = sensor2dTextureCoordinates(sensorRadius, pointMC);\r\n    materialInput.str = pointMC / sensorRadius;\r\n\r\n    vec3 positionToEyeEC = -v_positionEC;\r\n    materialInput.positionToEyeEC = positionToEyeEC;\r\n\r\n    vec3 normalEC = normalize(v_normalEC);\r\n    materialInput.normalEC = u_normalDirection * normalEC;\r\n\r\n    czm_material material = czm_getMaterial(materialInput);\r\n\r\n    return mix(czm_phong(normalize(positionToEyeEC), material), vec4(material.diffuse, material.alpha), 0.4);\r\n\r\n}\r\n\r\nbool isOnBoundary(float value, float epsilon)\r\n{\r\n    float width = getIntersectionWidth();\r\n    float tolerance = width * epsilon;\r\n\r\n#ifdef GL_OES_standard_derivatives\r\n    float delta = max(abs(dFdx(value)), abs(dFdy(value)));\r\n    float pixels = width * delta;\r\n    float temp = abs(value);\r\n    // There are a couple things going on here.\r\n    // First we test the value at the current fragment to see if it is within the tolerance.\r\n    // We also want to check if the value of an adjacent pixel is within the tolerance,\r\n    // but we don\'t want to admit points that are obviously not on the surface.\r\n    // For example, if we are looking for "value" to be close to 0, but value is 1 and the adjacent value is 2,\r\n    // then the delta would be 1 and "temp - delta" would be "1 - 1" which is zero even though neither of\r\n    // the points is close to zero.\r\n    return temp < tolerance && temp < pixels || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);\r\n#else\r\n    return abs(value) < tolerance;\r\n#endif\r\n}\r\n\r\nvec4 shade(bool isOnBoundary)\r\n{\r\n    if (u_showIntersection && isOnBoundary)\r\n    {\r\n        return getIntersectionColor();\r\n    }\r\n    if(u_type == 1.0){\r\n        return getLineColor();\r\n    }\r\n    return getColor(u_radius, v_positionEC);\r\n}\r\n\r\nfloat ellipsoidSurfaceFunction(czm_ellipsoid ellipsoid, vec3 point)\r\n{\r\n    vec3 scaled = ellipsoid.inverseRadii * point;\r\n    return dot(scaled, scaled) - 1.0;\r\n}\r\n\r\nvoid main()\r\n{\r\n    vec3 sensorVertexWC = czm_model[3].xyz;      // (0.0, 0.0, 0.0) in model coordinates\r\n    vec3 sensorVertexEC = czm_modelView[3].xyz;  // (0.0, 0.0, 0.0) in model coordinates\r\n\r\n    //vec3 pixDir = normalize(v_position);\r\n    float positionX = v_position.x;\r\n    float positionY = v_position.y;\r\n    float positionZ = v_position.z;\r\n\r\n    vec3 zDir = vec3(0.0, 0.0, 1.0);\r\n    vec3 lineX = vec3(positionX, 0 ,positionZ);\r\n    vec3 lineY = vec3(0, positionY, positionZ);\r\n    float resX = dot(normalize(lineX), zDir);\r\n    if(resX < cos(u_xHalfAngle)-0.00001){\r\n        discard;\r\n    }\r\n    float resY = dot(normalize(lineY), zDir);\r\n    if(resY < cos(u_yHalfAngle)-0.00001){\r\n        discard;\r\n    }\r\n\r\n\r\n    czm_ellipsoid ellipsoid = czm_getWgs84EllipsoidEC();\r\n    float ellipsoidValue = ellipsoidSurfaceFunction(ellipsoid, v_positionWC);\r\n\r\n    // Occluded by the ellipsoid?\r\n\tif (!u_showThroughEllipsoid)\r\n\t{\r\n\t    // Discard if in the ellipsoid\r\n\t    // PERFORMANCE_IDEA: A coarse check for ellipsoid intersection could be done on the CPU first.\r\n\t    if (ellipsoidValue < 0.0)\r\n\t    {\r\n            discard;\r\n\t    }\r\n\r\n\t    // Discard if in the sensor\'s shadow\r\n\t    if (inSensorShadow(sensorVertexWC, ellipsoid, v_positionWC))\r\n\t    {\r\n\t        discard;\r\n\t    }\r\n    }\r\n\r\n    // Notes: Each surface functions should have an associated tolerance based on the floating point error.\r\n    bool isOnEllipsoid = isOnBoundary(ellipsoidValue, czm_epsilon3);\r\n    //isOnEllipsoid = false;\r\n    //if((resX >= 0.8 && resX <= 0.81)||(resY >= 0.8 && resY <= 0.81)){\r\n    /*if(false){\r\n        gl_FragColor = vec4(1.0,0.0,0.0,1.0);\r\n    }else{\r\n        gl_FragColor = shade(isOnEllipsoid);\r\n    }\r\n*/\r\n    gl_FragColor = shade(isOnEllipsoid);\r\n\r\n}'
    }, function (e, t) {
        e.exports = "uniform vec4 u_intersectionColor;\nuniform float u_intersectionWidth;\nuniform vec4 u_lineColor;\n\nbool inSensorShadow(vec3 coneVertexWC, czm_ellipsoid ellipsoidEC, vec3 pointWC)\n{\n    // Diagonal matrix from the unscaled ellipsoid space to the scaled space.    \n    vec3 D = ellipsoidEC.inverseRadii;\n\n    // Sensor vertex in the scaled ellipsoid space\n    vec3 q = D * coneVertexWC;\n    float qMagnitudeSquared = dot(q, q);\n    float test = qMagnitudeSquared - 1.0;\n    \n    // Sensor vertex to fragment vector in the ellipsoid's scaled space\n    vec3 temp = D * pointWC - q;\n    float d = dot(temp, q);\n    \n    // Behind silhouette plane and inside silhouette cone\n    return (d < -test) && (d / length(temp) < -sqrt(test));\n}\n\n///////////////////////////////////////////////////////////////////////////////\n\nvec4 getLineColor()\n{\n    return u_lineColor;\n}\n\nvec4 getIntersectionColor()\n{\n    return u_intersectionColor;\n}\n\nfloat getIntersectionWidth()\n{\n    return u_intersectionWidth;\n}\n\nvec2 sensor2dTextureCoordinates(float sensorRadius, vec3 pointMC)\n{\n    // (s, t) both in the range [0, 1]\n    float t = pointMC.z / sensorRadius;\n    float s = 1.0 + (atan(pointMC.y, pointMC.x) / czm_twoPi);\n    s = s - floor(s);\n    \n    return vec2(s, t);\n}\n"
    }, function (e, t) {
        e.exports = '#ifdef GL_OES_standard_derivatives\r\n    #extension GL_OES_standard_derivatives : enable\r\n#endif\r\n\r\nuniform bool u_showIntersection;\r\nuniform bool u_showThroughEllipsoid;\r\n\r\nuniform float u_radius;\r\nuniform float u_xHalfAngle;\r\nuniform float u_yHalfAngle;\r\nuniform float u_normalDirection;\r\nuniform vec4 u_color;\r\n\r\nvarying vec3 v_position;\r\nvarying vec3 v_positionWC;\r\nvarying vec3 v_positionEC;\r\nvarying vec3 v_normalEC;\r\n\r\nvec4 getColor(float sensorRadius, vec3 pointEC)\r\n{\r\n    czm_materialInput materialInput;\r\n\r\n    vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;\r\n    materialInput.st = sensor2dTextureCoordinates(sensorRadius, pointMC);\r\n    materialInput.str = pointMC / sensorRadius;\r\n\r\n    vec3 positionToEyeEC = -v_positionEC;\r\n    materialInput.positionToEyeEC = positionToEyeEC;\r\n\r\n    vec3 normalEC = normalize(v_normalEC);\r\n    materialInput.normalEC = u_normalDirection * normalEC;\r\n\r\n    czm_material material = czm_getMaterial(materialInput);\r\n\r\n    material.diffuse = u_color.rgb;\r\n    material.alpha = u_color.a;\r\n\r\n    return mix(czm_phong(normalize(positionToEyeEC), material), vec4(material.diffuse, material.alpha), 0.4);\r\n\r\n}\r\n\r\nbool isOnBoundary(float value, float epsilon)\r\n{\r\n    float width = getIntersectionWidth();\r\n    float tolerance = width * epsilon;\r\n\r\n#ifdef GL_OES_standard_derivatives\r\n    float delta = max(abs(dFdx(value)), abs(dFdy(value)));\r\n    float pixels = width * delta;\r\n    float temp = abs(value);\r\n    // There are a couple things going on here.\r\n    // First we test the value at the current fragment to see if it is within the tolerance.\r\n    // We also want to check if the value of an adjacent pixel is within the tolerance,\r\n    // but we don\'t want to admit points that are obviously not on the surface.\r\n    // For example, if we are looking for "value" to be close to 0, but value is 1 and the adjacent value is 2,\r\n    // then the delta would be 1 and "temp - delta" would be "1 - 1" which is zero even though neither of\r\n    // the points is close to zero.\r\n    return temp < tolerance && temp < pixels || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);\r\n#else\r\n    return abs(value) < tolerance;\r\n#endif\r\n}\r\n\r\nvec4 shade(bool isOnBoundary)\r\n{\r\n    if (u_showIntersection && isOnBoundary)\r\n    {\r\n        return getIntersectionColor();\r\n    }\r\n    return getColor(u_radius, v_positionEC);\r\n}\r\n\r\nfloat ellipsoidSurfaceFunction(czm_ellipsoid ellipsoid, vec3 point)\r\n{\r\n    vec3 scaled = ellipsoid.inverseRadii * point;\r\n    return dot(scaled, scaled) - 1.0;\r\n}\r\n\r\nvoid main()\r\n{\r\n    vec3 sensorVertexWC = czm_model[3].xyz;      // (0.0, 0.0, 0.0) in model coordinates\r\n    vec3 sensorVertexEC = czm_modelView[3].xyz;  // (0.0, 0.0, 0.0) in model coordinates\r\n\r\n    //vec3 pixDir = normalize(v_position);\r\n    float positionX = v_position.x;\r\n    float positionY = v_position.y;\r\n    float positionZ = v_position.z;\r\n\r\n    vec3 zDir = vec3(0.0, 0.0, 1.0);\r\n    vec3 lineX = vec3(positionX, 0 ,positionZ);\r\n    vec3 lineY = vec3(0, positionY, positionZ);\r\n    float resX = dot(normalize(lineX), zDir);\r\n    if(resX < cos(u_xHalfAngle) - 0.0001){\r\n        discard;\r\n    }\r\n    float resY = dot(normalize(lineY), zDir);\r\n    if(resY < cos(u_yHalfAngle)- 0.0001){\r\n        discard;\r\n    }\r\n\r\n\r\n    czm_ellipsoid ellipsoid = czm_getWgs84EllipsoidEC();\r\n    float ellipsoidValue = ellipsoidSurfaceFunction(ellipsoid, v_positionWC);\r\n\r\n    // Occluded by the ellipsoid?\r\n\tif (!u_showThroughEllipsoid)\r\n\t{\r\n\t    // Discard if in the ellipsoid\r\n\t    // PERFORMANCE_IDEA: A coarse check for ellipsoid intersection could be done on the CPU first.\r\n\t    if (ellipsoidValue < 0.0)\r\n\t    {\r\n            discard;\r\n\t    }\r\n\r\n\t    // Discard if in the sensor\'s shadow\r\n\t    if (inSensorShadow(sensorVertexWC, ellipsoid, v_positionWC))\r\n\t    {\r\n\t        discard;\r\n\t    }\r\n    }\r\n\r\n    // Notes: Each surface functions should have an associated tolerance based on the floating point error.\r\n    bool isOnEllipsoid = isOnBoundary(ellipsoidValue, czm_epsilon3);\r\n    gl_FragColor = shade(isOnEllipsoid);\r\n\r\n}'
    }, function (e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.RectangularSensorVisualizer = void 0;
        var r = i(0),
            n = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(r),
            o = i(59),
            a = i(145),
            s = n.AssociativeArray,
            l = n.Cartesian3,
            u = n.Color,
            c = n.defined,
            h = n.destroyObject,
            d = n.DeveloperError,
            f = n.Matrix3,
            p = n.Matrix4,
            m = n.Quaternion,
            g = n.MaterialProperty,
            v = n.Property,
            y = new f,
            _ = new l,
            w = new l,
            b = new m,
            C = new l,
            x = new m,
            P = function e(t, i) {
                if (!c(t)) throw new d("scene is required.");
                if (!c(i)) throw new d("entityCollection is required.");
                i.collectionChanged.addEventListener(e.prototype._onCollectionChanged, this), this._scene = t, this._primitives = t.primitives, this._entityCollection = i, this._hash = {}, this._entitiesToVisualize = new s, this._onCollectionChanged(i, i.values, [], [])
            };
        P.prototype.update = function (e) {
            if (!c(e)) throw new d("time is required.");
            for (var t = this._entitiesToVisualize.values, i = this._hash, r = this._primitives, a = 0, s = t.length; a < s; a++) {
                var h, P, E, M, T, S = t[a],
                    O = S._rectangularSensor,
                    D = i[S.id],
                    k = S.isShowing && S.isAvailable(e) && v.getValueOrDefault(O._show, e, !0);
                if (k && (h = v.getValueOrUndefined(S._position, e, _), P = v.getValueOrUndefined(S._orientation, e, b), E = v.getValueOrUndefined(O._radius, e), M = v.getValueOrUndefined(O._xHalfAngle, e), T = v.getValueOrUndefined(O._yHalfAngle, e), k = c(h) && c(M) && c(T)), k) {
                    var A = c(D) ? D.primitive : void 0;
                    c(A) || (A = new o.RectangularSensorPrimitive, A.id = S, r.add(A), D = {
                        primitive: A,
                        position: void 0,
                        orientation: void 0
                    }, i[S.id] = D);
                    var R = v.getValueOrUndefined(O._gaze, e);
                    if (c(R)) {
                        var L = v.getValueOrUndefined(R._position, e, w);
                        if (!c(h) || !c(L)) continue;
                        var F = l.subtract(h, L, C),
                            N = l.angleBetween(n.Cartesian3.UNIT_Z, F),
                            V = l.cross(n.Cartesian3.UNIT_Z, F, C),
                            P = m.fromAxisAngle(V, N - Math.PI, x);
                        E = l.distance(h, L), A.modelMatrix = p.fromRotationTranslation(f.fromQuaternion(P, y), h, A.modelMatrix)
                    } else l.equals(h, D.position) && m.equals(P, D.orientation) || (c(P) ? (A.modelMatrix = p.fromRotationTranslation(f.fromQuaternion(P, y), h, A.modelMatrix), D.position = l.clone(h, D.position), D.orientation = m.clone(P, D.orientation)) : (A.modelMatrix = n.Transforms.eastNorthUpToFixedFrame(h), D.position = l.clone(h, D.position)));
                    A.show = !0, A.gaze = R, A.radius = E, A.xHalfAngle = M, A.yHalfAngle = T, A.lineColor = v.getValueOrDefault(O._lineColor, e, u.WHITE), A.showSectorLines = v.getValueOrDefault(O._showSectorLines, e, !0), A.showSectorSegmentLines = v.getValueOrDefault(O._showSectorSegmentLines, e, !0), A.showLateralSurfaces = v.getValueOrDefault(O._showLateralSurfaces, e, !0), A.material = g.getValue(e, O._material, A.material), A.showDomeSurfaces = v.getValueOrDefault(O._showDomeSurfaces, e, !0), A.showDomeLines = v.getValueOrDefault(O._showDomeLines, e, !0), A.showIntersection = v.getValueOrDefault(O._showIntersection, e, !0), A.intersectionColor = v.getValueOrDefault(O._intersectionColor, e, u.WHITE), A.intersectionWidth = v.getValueOrDefault(O._intersectionWidth, e, 1), A.showThroughEllipsoid = v.getValueOrDefault(O._showThroughEllipsoid, e, !0), A.scanPlaneMode = v.getValueOrDefault(O._scanPlaneMode, e), A.scanPlaneColor = v.getValueOrDefault(O._scanPlaneColor, e, u.WHITE), A.showScanPlane = v.getValueOrDefault(O._showScanPlane, e, !0), A.scanPlaneRate = v.getValueOrDefault(O._scanPlaneRate, e, 1)
                } else c(D) && (D.primitive.show = !1)
            }
            return !0
        }, P.prototype.isDestroyed = function () {
            return !1
        }, P.prototype.destroy = function () {
            for (var e = this._entitiesToVisualize.values, t = this._hash, i = this._primitives, r = e.length - 1; r > -1; r--)(0, a.removePrimitive)(e[r], t, i);
            return h(this)
        }, P.prototype._onCollectionChanged = function (e, t, i, r) {
            var n, o, s = this._entitiesToVisualize,
                l = this._hash,
                u = this._primitives;
            for (n = t.length - 1; n > -1; n--) o = t[n], c(o._rectangularSensor) && c(o._position) && s.set(o.id, o);
            for (n = r.length - 1; n > -1; n--) o = r[n], c(o._rectangularSensor) && c(o._position) ? s.set(o.id, o) : ((0, a.removePrimitive)(o, l, u), s.remove(o.id));
            for (n = i.length - 1; n > -1; n--) o = i[n], (0, a.removePrimitive)(o, l, u), s.remove(o.id)
        }, t.RectangularSensorVisualizer = P
    }, function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            var r = t[e.id];
            if (o.defined(r)) {
                var n = r.primitive;
                try {
                    i.remove(n)
                } catch (e) {}
                n.isDestroyed && !n.isDestroyed() && n.destroy(), delete t[e.id]
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.removePrimitive = r;
        var n = i(0),
            o = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(n)
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DivPoint = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(5),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s),
            u = i(1);
        t.DivPoint = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, this.position = i.position, this.position_original = i.position, this.anchor = i.anchor, (i.visibleDistanceMin || i.visibleDistanceMax) && (i.distanceDisplayCondition = new a.DistanceDisplayCondition(i.visibleDistanceMin || 0, i.visibleDistanceMax || 1e5)), this._distanceDisplayCondition = i.distanceDisplayCondition, this._heightReference = a.defaultValue(i.heightReference, a.HeightReference.NONE), this.opts = i, this._depthTest = !0, this.$view = (0, l.default)(i.html), this.$view.css({
                    position: "absolute",
                    left: "0",
                    top: "0"
                }), this.$view.appendTo("#" + t._container.id), this.visible = a.defaultValue(i.visible, !0);
                var n = this;
                (i.click || i.popup) && this.$view.click(function (e) {
                    i.popup && t.wutu.popup.show(i, n.position), i.click && i.click(i, n, e)
                }), i.tooltip && this.$view.hover(function () {
                    t.wutu.tooltip.show(i, n.position)
                }, function () {
                    t.wutu.tooltip.close()
                }), this.$view.on("mousewheel", function (e) {}), t.scene.postRender.addEventListener(this.updateViewPoint, this)
            }
            return n(e, [{
                key: "updateViewPoint",
                value: function () {
                    if (this._visible) {
                        this._heightReference == a.HeightReference.CLAMP_TO_GROUND ? this.position = (0, u.updateHeightForClampToGround)(this.viewer, this.position_original) : this._heightReference == a.HeightReference.RELATIVE_TO_GROUND && (this.position = (0, u.updateHeightForClampToGround)(this.viewer, this.position_original, !0));
                        var e, t = this.viewer.scene,
                            i = a.SceneTransforms.wgs84ToWindowCoordinates(t, this.position);
                        if (e = t.mode === a.SceneMode.SCENE3D ? a.Cartesian3.distance(this.position, this.viewer.camera.position) : this.viewer.camera.positionCartographic.height, null == i || this._distanceDisplayCondition && (this._distanceDisplayCondition.near > e || this._distanceDisplayCondition.far < e)) return void(this.$view.is(":visible") && this.$view.hide());
                        if (this._depthTest && t.mode === a.SceneMode.SCENE3D) {
                            var r = t.camera.getPickRay(i),
                                n = t.globe.pick(r, t);
                            if (n) {
                                if (a.Cartesian3.distance(this.position, n) > 1e6) return void(this.$view.is(":visible") && this.$view.hide())
                            }
                        }
                        var o = this.$view.height(),
                            s = this.$view.width(),
                            l = i.x,
                            c = i.y - o;
                        this.anchor ? ("center" == this.anchor[0] ? l -= s / 2 : l += this.anchor[0], c += this.anchor[1]) : l -= s / 2, this.$view.is(":visible") || this.$view.show();
                        var h = 1;
                        if (this.opts.scaleByDistance) {
                            var d = this.opts.scaleByDistance;
                            h = e <= d.near ? d.nearValue : e > d.near && e < d.far ? d.nearValue + (d.farValue - d.nearValue) * (e - d.near) / (d.far - d.near) : d.farValue
                        }
                        var f = "matrix(" + h + ",0,0," + h + "," + l + "," + c + ")";
                        this.$view.css({
                            transform: f,
                            "transform-origin": "left bottom 0",
                            "-ms-transform": f,
                            "-ms-transform-origin": "left bottom 0",
                            "-webkit-transform": f,
                            "-webkit-transform-origin": "left bottom 0",
                            "-moz-transform": f,
                            "-moz-transform-origin": "left bottom 0",
                            "-o-transform": f,
                            "-o-transform-origin": "left bottom 0"
                        }), this.opts.postRender && this.opts.postRender({
                            x: l,
                            y: c,
                            height: o,
                            width: s,
                            distance: e
                        })
                    }
                }
            }, {
                key: "setVisible",
                value: function (e) {
                    this._visible = e, e ? this.$view.show() : this.$view.hide()
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.postRender.removeEventListener(this.updateViewPoint, this), this.$view.remove(), this.$view = null, this.position = null, this.anchor = null, this.viewer = null
                }
            }, {
                key: "dom",
                get: function () {
                    return this.$view
                }
            }, {
                key: "visible",
                get: function () {
                    return this._visible
                },
                set: function (e) {
                    this._visible = e, this.setVisible(e)
                }
            }, {
                key: "depthTest",
                get: function () {
                    return this._depthTest
                },
                set: function (e) {
                    this._depthTest = e
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DynamicRiver = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(2),
            l = i(148),
            u = i(16);
        t.DynamicRiver = function () {
            function e(t, i) {
                r(this, e), t && (this.viewer = t, i = i || {}, this.positions = a.defaultValue(i.positions, null), this._image = a.defaultValue(i.image, null), this._flipY = a.defaultValue(i.flipY, !1), this._width = a.defaultValue(i.width, 10), this._height = a.defaultValue(i.height, 0), this._alpha = a.defaultValue(i.alpha, .5), this._speed = a.defaultValue(i.speed, 1), this._move = a.defaultValue(i.move, !0), this._moveDir = a.defaultValue(i.moveDir, !0), this._moveVar = a.defaultValue(i.moveVar, new a.Cartesian3(50, 1, 100)), this.callBack = i.callBack, this.init())
            }
            return n(e, [{
                key: "init",
                value: function () {
                    this.prepareVertex(), this.sideRes && (this.material = this.prepareMaterial(), this.riverPrimitive && this.viewer.scene.primitives.remove(this.riverPrimitive), this.riverPrimitive = this.createPrimitive(), this.viewer.scene.primitives.add(this.riverPrimitive), this.callBack && this.callBack())
                }
            }, {
                key: "prepareVertex",
                value: function () {
                    (0, s.isArray)(this.positions) && this.positions.length && (this.sideRes = (0, l.Lines2Plane)(this.positions, this.width, this.height))
                }
            }, {
                key: "setPositions",
                value: function (e) {
                    this.positions = e, this.init()
                }
            }, {
                key: "resetPos",
                value: function () {
                    this.sideRes = (0, l.Lines2Plane)(this.positions, this.width, this.height), this.sideRes && (this.material = this.prepareMaterial(), this.riverPrimitive && this.viewer.scene.primitives.remove(this.riverPrimitive), this.riverPrimitive = this.createPrimitive(), this.viewer.scene.primitives.add(this.riverPrimitive))
                }
            }, {
                key: "drawLines",
                value: function (e) {
                    this.drawControl || (this.drawControl = new u.Draw(viewer, {
                        hasEdit: !1,
                        removeScreenSpaceEvent: !0
                    }));
                    var t = this.drawControl,
                        i = this;
                    t.startDraw({
                        type: "polyline",
                        style: e || {
                            color: "#55ff33",
                            width: 3,
                            clampToGround: !0
                        },
                        success: function (e) {
                            var t = i.drawControl.getPositions(e);
                            i.positions = t, i.setPositions(t), i.drawControl.deleteAll()
                        }
                    })
                }
            }, {
                key: "prepareMaterial",
                value: function () {
                    if (this.image) {
                        var e = new a.Material({
                            fabric: {
                                uniforms: {
                                    image: this.image,
                                    alpha: this.alpha,
                                    moveVar: this.moveVar,
                                    reflux: this.moveDir ? -1 : 1,
                                    speed: this.speed,
                                    move: this.move,
                                    flipY: this.flipY
                                },
                                source: "czm_material czm_getMaterial(czm_materialInput materialInput) { \n                        czm_material material = czm_getDefaultMaterial(materialInput); \n                        vec2 st = materialInput.st;\n                        if(move){\n                            float r = sqrt((st.x-0.8)*(st.x-0.8) + (st.y-0.8)*(st.y-0.8));\n                            float r2 = sqrt((st.x-0.2)*(st.x-0.2) + (st.y-0.2)*(st.y-0.2));\n                            float z = cos(moveVar.x*r + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n                            float z2 = cos(moveVar.x*r2 + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n                            st += sqrt(z*z+z2*z2);\n                            st.s += reflux * czm_frameNumber/1000.0 * speed;\n                            st.s = mod(st.s,1.0);\n                        }\n                        if(flipY){\n                            st = vec2(st.t,st.s);\n                        }\n                        vec4 colorImage = texture2D(image, st);\n                        material.alpha = alpha;\n                        material.diffuse = colorImage.rgb; \n                        return material; \n                    }"
                            }
                        });
                        return e
                    }
                    var e = a.Material.fromType("Color");
                    return e.uniforms.color = new a.Color(0, 1, 0, this.alpha), e
                }
            }, {
                key: "createPrimitive",
                value: function () {
                    var e = this.sideRes,
                        t = new Float64Array(e.vertexs),
                        i = new a.GeometryAttributes;
                    i.position = new a.GeometryAttribute({
                        componentDatatype: a.ComponentDatatype.DOUBLE,
                        componentsPerAttribute: 3,
                        values: t
                    }), i.st = new a.GeometryAttribute({
                        componentDatatype: a.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 2,
                        values: e.uvs
                    });
                    var r = new a.Geometry({
                            attributes: i,
                            indices: e.indexs,
                            primitiveType: a.PrimitiveType.TRIANGLES,
                            boundingSphere: a.BoundingSphere.fromVertices(t)
                        }),
                        n = new a.GeometryInstance({
                            geometry: r
                        }),
                        o = new a.RenderState;
                    return o.depthTest.enabled = !0, new a.Primitive({
                        geometryInstances: n,
                        appearance: new a.Appearance({
                            material: this.material,
                            renderState: o,
                            vertexShaderSource: "attribute vec3 position3DHigh;\n                attribute vec3 position3DLow;\n                attribute vec2 st;\n                attribute float batchId;\n                \n                varying vec3 v_positionMC;\n                varying vec3 v_positionEC;\n                varying vec2 v_st;\n                \n                void main()\n                {\n                    vec4 p = czm_computePosition();\n                \n                    v_positionMC = position3DHigh + position3DLow;           // position in model coordinates\n                    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates\n                    v_st = st;\n                \n                    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n                }\n                ",
                            fragmentShaderSource: "varying vec3 v_positionMC;\n                varying vec3 v_positionEC;\n                varying vec2 v_st;\n                \n                void main()\n                {\n                    czm_materialInput materialInput;\n                \n                    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n                #ifdef FACE_FORWARD\n                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n                #endif\n                \n                    materialInput.s = v_st.s;\n                    materialInput.st = v_st;\n                    materialInput.str = vec3(v_st, 0.0);\n                \n                    // Convert tangent space material normal to eye space\n                    materialInput.normalEC = normalEC;\n                    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n                \n                    // Convert view vector to world space\n                    vec3 positionToEyeEC = -v_positionEC;\n                    materialInput.positionToEyeEC = positionToEyeEC;\n                \n                    czm_material material = czm_getMaterial(materialInput);\n                \n                #ifdef FLAT\n                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n                #else\n                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n                #endif\n                }\n                "
                        })
                    })
                }
            }, {
                key: "offsetHeight",
                value: function (e, t) {
                    this.startDH(e, t)
                }
            }, {
                key: "startDH",
                value: function (e, t) {
                    if (e && t && this.riverPrimitive) {
                        for (var i = this, r = 0, n = e / (20 * t), o = this.sideRes.self, s = new a.Cartesian3, l = 0, u = o.length; l < u; l++) {
                            var c = a.Cartesian3.normalize(o[l], new a.Cartesian3);
                            a.Cartesian3.add(s, c, s)
                        }
                        a.Cartesian3.normalize(s, s);
                        var h = a.clone(this.riverPrimitive.modelMatrix);
                        this.dhEvent = function () {
                            if (Math.abs(r) <= Math.abs(e)) {
                                var t = a.Cartesian3.multiplyByScalar(s, r, new a.Cartesian3);
                                i.riverPrimitive.modelMatrix = a.Matrix4.multiplyByTranslation(h, t, new a.Matrix4)
                            } else i.viewer.clock.onTick.removeEventListener(i.dhEvent);
                            r += n
                        }, this.viewer.clock.onTick.addEventListener(this.dhEvent)
                    }
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.primitives.remove(this.riverPrimitive), this.drawControl && (this.drawControl.destroy(), delete this.drawControl), this.material.destroy(), delete this.material, delete this.image, delete this.position, delete this.width, delete this.height, delete this.alpha, delete this.speed, delete this._width, delete this._height, delete this._alpha, delete this._moveDir, delete this._speed, delete this.oldDepthTest, delete this.sideRes
                }
            }, {
                key: "width",
                get: function () {
                    return this._width
                },
                set: function (e) {
                    this._width = Number(e) || 1, this.resetPos()
                }
            }, {
                key: "height",
                get: function () {
                    return this._height
                },
                set: function (e) {
                    this._height = Number(e), this.resetPos()
                }
            }, {
                key: "alpha",
                get: function () {
                    return this._alpha
                },
                set: function (e) {
                    this._alpha = Number(e), this.material.uniforms.alpha = this._alpha
                }
            }, {
                key: "moveDir",
                get: function () {
                    return this._moveDir
                },
                set: function (e) {
                    this._moveDir = Boolean(e), this.material.uniforms.reflux = this._moveDir ? -1 : 1
                }
            }, {
                key: "speed",
                get: function () {
                    return this._speed
                },
                set: function (e) {
                    this._speed = Number(e) || 1, this.material.uniforms.speed = this._speed
                }
            }, {
                key: "image",
                get: function () {
                    return this._image
                },
                set: function (e) {
                    this._image = e, this.material.uniforms.image = this._image
                }
            }, {
                key: "move",
                get: function () {
                    return this._move
                },
                set: function (e) {
                    this._move = Boolean(e), this.material.uniforms.move = this._move
                }
            }, {
                key: "flipY",
                get: function () {
                    return this._flipY
                },
                set: function (e) {
                    this._flipY = Boolean(e), this.material.uniforms.flipY = this._flipY
                }
            }, {
                key: "moveVar",
                get: function () {
                    return this._moveVar
                },
                set: function (e) {
                    this._moveVar = e, this.material.uniforms.moveVar = this._moveVar
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t, i) {
            if (!e || e.length <= 1 || !t || 0 == t) return void console.log("请确认参数符合规则：数组长度大于1，宽高不能为0！");
            for (var r = e.length, a = [], l = [], u = t / 2, c = 0; c < r; c++) {
                var h = void 0,
                    d = void 0,
                    f = void 0,
                    p = void 0,
                    m = void 0;
                if (0 == c ? (h = e[c], d = e[c], f = e[c + 1]) : c == r - 1 ? (h = e[c - 1], d = e[c], f = e[c - 1]) : (h = e[c - 1], d = e[c], f = e[c + 1]), 0 != i && (h = n(h, i), d = n(d, i), f = n(f, i)), h && d && f) {
                    var g = o(d, f, u);
                    if (p = g.left, m = g.right, 0 == c) {
                        a.push(p), l.push(m), a.push(p), l.push(m);
                        continue
                    }
                    if (!(c < r - 1)) {
                        a.push(m), l.push(p), a.push(m), l.push(p);
                        continue
                    }
                    a.push(p), l.push(m), g = o(d, h, u), p = g.left, m = g.right, a.push(m), l.push(p)
                }
            }
            var v = [],
                y = [];
            if (a.length != 2 * r) return void console.log("计算左右侧点出问题！");
            for (var _ = 0; _ < r; _++) {
                var w = e[_],
                    b = a[2 * _ + 0],
                    C = a[2 * _ + 1],
                    x = s.Cartesian3.subtract(b, w, new s.Cartesian3),
                    P = s.Cartesian3.subtract(C, w, new s.Cartesian3),
                    E = s.Cartesian3.add(x, P, new s.Cartesian3),
                    M = s.Cartesian3.add(w, E, new s.Cartesian3);
                v.push(s.clone(M));
                var T = l[2 * _ + 0],
                    S = l[2 * _ + 1];
                x = s.Cartesian3.subtract(T, w, new s.Cartesian3), P = s.Cartesian3.subtract(S, w, new s.Cartesian3), E = s.Cartesian3.add(x, P, new s.Cartesian3), M = s.Cartesian3.add(w, E, new s.Cartesian3), y.push(s.clone(M))
            }
            for (var O = [], D = [], k = [], A = [], R = [], L = 0; L < r; L++) {
                var F = s.EncodedCartesian3.fromCartesian(y[L]);
                D.push(y[L].x), D.push(y[L].y), D.push(y[L].z), k.push(F.high.x), k.push(F.high.y), k.push(F.high.z), A.push(F.low.x), A.push(F.low.y), A.push(F.low.z), O.push(1, 1), L < r - 1 && (R.push(L + 2 * r), R.push(L + 1), R.push(L + 1 + r), R.push(L + 2 * r), R.push(L + 1 + r), R.push(r + L + 2 * r))
            }
            for (var N = 0; N < r; N++) {
                var V = s.EncodedCartesian3.fromCartesian(v[N]);
                D.push(v[N].x), D.push(v[N].y), D.push(v[N].z), k.push(V.high.x), k.push(V.high.y), k.push(V.high.z), A.push(V.low.x), A.push(V.low.y), A.push(V.low.z), O.push(1, 0)
            }
            for (var I = 0; I < r; I++) {
                var z = s.EncodedCartesian3.fromCartesian(y[I]);
                D.push(y[I].x), D.push(y[I].y), D.push(y[I].z), k.push(z.high.x), k.push(z.high.y), k.push(z.high.z), A.push(z.low.x), A.push(z.low.y), A.push(z.low.z), O.push(0, 1)
            }
            for (var H = 0; H < r; H++) {
                var B = s.EncodedCartesian3.fromCartesian(v[H]);
                D.push(v[H].x), D.push(v[H].y), D.push(v[H].z), k.push(B.high.x), k.push(B.high.y), k.push(B.high.z), A.push(B.low.x), A.push(B.low.y), A.push(B.low.z), O.push(0, 0)
            }
            return {
                left: v,
                right: y,
                self: e,
                vertexs: new Float32Array(D),
                vertexsH: new Float32Array(k),
                vertexsL: new Float32Array(A),
                indexs: new Uint16Array(R),
                uvs: new Float32Array(O)
            }
        }

        function n(e, t) {
            if (!(e instanceof s.Cartesian3)) return void console.log("请确认点是Cartesian3类型！");
            if (!t || 0 == t) return void console.log("请确认高度是非零数值！");
            var i = s.Cartesian3.normalize(e, new s.Cartesian3),
                r = new s.Ray(e, i);
            return s.Ray.getPoint(r, t)
        }

        function o(e, t, i) {
            var r = s.Cartesian3.normalize(s.Cartesian3.subtract(t, e, new s.Cartesian3), new s.Cartesian3),
                n = s.Cartesian3.normalize(e, new s.Cartesian3),
                o = s.Cartesian3.cross(n, r, new s.Cartesian3),
                a = s.Cartesian3.cross(r, n, new s.Cartesian3),
                l = new s.Ray(e, o),
                u = new s.Ray(e, a);
            return {
                left: s.Ray.getPoint(l, i),
                right: s.Ray.getPoint(u, i)
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Lines2Plane = r;
        var a = i(0),
            s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(a)
    }, function (e, t, i) {
        "use strict";

        function r() {
            return "varying vec3 v_positionMC;\n            varying vec3 v_positionEC;\n            varying vec2 v_st;\n            \n            void main()\n            {\n                czm_materialInput materialInput;\n                vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n            #ifdef FACE_FORWARD\n                normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n            #endif\n                materialInput.s = v_st.s;\n                materialInput.st = v_st;\n                materialInput.str = vec3(v_st, 0.0);\n                materialInput.normalEC = normalEC;\n                materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n                vec3 positionToEyeEC = -v_positionEC;\n                materialInput.positionToEyeEC = positionToEyeEC;\n                czm_material material = czm_getMaterial(materialInput);\n            #ifdef FLAT\n                gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n            #else\n                gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n                gl_FragColor.a = 0.5;\n            #endif\n            }"
        }

        function n(e, t) {
            return new a.Primitive({
                geometryInstances: new a.GeometryInstance({
                    geometry: e,
                    id: t.id || "water"
                }),
                appearance: new a.EllipsoidSurfaceAppearance({
                    aboveGround: !1,
                    material: new a.Material({
                        fabric: {
                            type: "Water",
                            uniforms: {
                                normalMap: t.normalMap,
                                frequency: t.frequency || 8e3,
                                animationSpeed: t.animationSpeed || .03,
                                amplitude: t.amplitude || 5,
                                specularIntensity: t.specularIntensity || .8,
                                baseWaterColor: new a.Color.fromCssColorString(t.baseWaterColor || "#123e59"),
                                blendColor: new a.Color.fromCssColorString(t.blendColor || "#123e59")
                            }
                        }
                    }),
                    fragmentShaderSource: r()
                }),
                show: !0
            })
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.createWaterPrimitive = n;
        var o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o)
    }, function (e, t) {
        e.exports = "uniform sampler2D colorTexture;\r\nvarying vec2 v_textureCoordinates;\r\n\r\nfloat hash(float x){\r\n    return fract(sin(x*133.3)*13.13);\r\n}\r\n\r\nvoid main(void){ \r\n    float time = czm_frameNumber / 240.0;\r\n    vec2 resolution = czm_viewport.zw;\r\n\r\n    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\r\n    vec3 c=vec3(.6,.7,.8);\r\n\r\n    float a=-.4;\r\n    float si=sin(a),co=cos(a);\r\n    uv*=mat2(co,-si,si,co);\r\n    uv*=length(uv+vec2(0,4.9))*.3+1.;\r\n\r\n    float v=1.-sin(hash(floor(uv.x*100.))*2.);\r\n    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\r\n    c*=v*b; \r\n\r\n    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \r\n}\r\n                        "
    }, function (e, t) {
        e.exports = "uniform sampler2D colorTexture;\r\nvarying vec2 v_textureCoordinates;\r\n\r\nfloat snow(vec2 uv,float scale){\r\n    float time = czm_frameNumber / 60.0;\r\n    float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\r\n    uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\r\n    uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\r\n    p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\r\n    k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\r\n    return k*w;\r\n}\r\n\r\nvoid main(void){\r\n    vec2 resolution = czm_viewport.zw;\r\n    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\r\n    vec3 finalColor=vec3(0);\r\n    float c = 0.0;\r\n    // c+=snow(uv,30.)*.0;\r\n    // c+=snow(uv,20.)*.0;\r\n    // c+=snow(uv,15.)*.0;\r\n    c+=snow(uv,10.);\r\n    c+=snow(uv,8.);\r\n    c+=snow(uv,6.);\r\n    c+=snow(uv,5.);\r\n    finalColor=(vec3(c)); \r\n    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \r\n\r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.FogEffect = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o);
        t.FogEffect = function () {
            function e(t, i) {
                r(this, e), i = i || {}, this.trength = a.defaultValue(i.trength, .1), this.color = a.defaultValue(i.color, new a.Color(.8, .8, .8, .5)), this._show = a.defaultValue(i.show, !0), this.viewer = t, this.init()
            }
            return n(e, [{
                key: "init",
                value: function () {
                    var e = this;
                    this.FogStage = new a.PostProcessStage({
                        name: "MarsFog",
                        fragmentShader: "  uniform sampler2D colorTexture;\n  uniform sampler2D depthTexture;\n  uniform float trength;\n  uniform vec4 fogcolor;\n  varying vec2 v_textureCoordinates;\n  void main(void)\n  {\n      vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);\n\n      float depth = czm_readDepth(depthTexture, v_textureCoordinates);\n      vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);\n\n      float f=trength*(depthcolor.r-0.3)/0.2;\n      if(f<0.0) f=0.0;\n      else if(f>1.0) f=1.0;\n      gl_FragColor = mix(origcolor,fogcolor,f);\n   }",
                        uniforms: {
                            trength: function () {
                                return e.trength
                            },
                            fogcolor: function () {
                                return e.color
                            }
                        }
                    }), this.FogStage.enabled = this._show, this.viewer.scene.postProcessStages.add(this.FogStage)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.FogStage), delete this.trength, delete this.color, delete this.viewer
                }
            }, {
                key: "show",
                get: function () {
                    return this._show
                },
                set: function (e) {
                    this._show = Boolean(e), this.FogStage.enabled = this._show
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.InvertedScene = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(154),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s);
        t.InvertedScene = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, i = i || {}, this._show = a.defaultValue(i.show, !0), this.init()
            }
            return n(e, [{
                key: "init",
                value: function () {
                    this.postStage = new a.PostProcessStage({
                        name: "InvertedScene",
                        fragmentShader: l.default
                    }), this.postStage.enabled = this._show, this.viewer.scene.postProcessStages.add(this.postStage)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postStage)
                }
            }, {
                key: "show",
                get: function () {
                    return this._show
                },
                set: function (e) {
                    this._show = Boolean(e), this.postStage.enabled = this._show
                }
            }]), e
        }()
    }, function (e, t) {
        e.exports = "#extension GL_OES_standard_derivatives : enable\r\nuniform sampler2D colorTexture;\r\nuniform sampler2D depthTexture;\r\nvarying vec2 v_textureCoordinates;\r\nvec4 toEye(in vec2 uv, in float depth){\r\n    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\r\n    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\r\n    posInCamera =posInCamera / posInCamera.w;\r\n    return posInCamera;\r\n}\r\nfloat getDepth(in vec4 depth){\r\n    float z_window = czm_unpackDepth(depth);\r\n    z_window = czm_reverseLogDepth(z_window);\r\n    float n_range = czm_depthRange.near;\r\n    float f_range = czm_depthRange.far;\r\n    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\r\n}\r\nvec3 guussColor(vec2 uv){\r\n    vec2 pixelSize = 1.0 / czm_viewport.zw;\r\n    float dx0 = -pixelSize.x;\r\n    float dy0 = -pixelSize.y;\r\n    float dx1 = pixelSize.x;\r\n    float dy1 = pixelSize.y;\r\n    vec4 gc = (\r\n        texture2D(colorTexture, uv)+\r\n        texture2D(colorTexture, uv + vec2(dx0, dy0)) +\r\n        texture2D(colorTexture, uv + vec2(0.0, dy0)) +\r\n        texture2D(colorTexture, uv + vec2(dx1, dy0)) +\r\n        texture2D(colorTexture, uv + vec2(dx0, 0.0)) +\r\n        texture2D(colorTexture, uv + vec2(dx1, 0.0)) +\r\n        texture2D(colorTexture, uv + vec2(dx0, dy1)) +\r\n        texture2D(colorTexture, uv + vec2(0.0, dy1)) +\r\n        texture2D(colorTexture, uv + vec2(dx1, dy1))\r\n    ) * (1.0 / 9.0);\r\n    return gc.rgb;\r\n}\r\nvoid main(){\r\n    // mat4 dither = mat4(\r\n    //     0,       0.5,    0.125,  0.625,\r\n    //     0.75,    0.25,   0.875,  0.375,\r\n    //     0.1875,  0.6875, 0.0625, 0.5625,\r\n    //     0.9375,  0.4375, 0.8125, 0.3125\r\n    // );\r\n    // int sampleCoordX = int(mod((gl_FragCoord.x * v_textureCoordinates.x),4.0));\r\n    // int sampleCoordY = int(mod((gl_FragCoord.y * v_textureCoordinates.y),4.0));\r\n    float offset = 0.0;\r\n\r\n\r\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\r\n    vec4 currD = texture2D(depthTexture, v_textureCoordinates);\r\n    // gl_FragColor = currD;\r\n    // return;\r\n    if(currD.r>=1.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    float depth = getDepth(currD);\r\n    // gl_FragColor = vec4(depth,0.0,0.0,1.0);\r\n    // return;\r\n\r\n    \r\n    vec4 positionEC = toEye(v_textureCoordinates, depth);\r\n    vec3 dx = dFdx(positionEC.xyz);\r\n    vec3 dy = dFdy(positionEC.xyz);\r\n    vec3 normal = normalize(cross(dx,dy));\r\n\r\n    vec4 positionWC = normalize(czm_inverseView * positionEC);\r\n    vec3 normalWC = normalize(czm_inverseViewRotation * normal);\r\n    float fotNumWC = dot(positionWC.xyz,normalWC);\r\n    if(fotNumWC<=0.5){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    \r\n\r\n\r\n\r\n\r\n    // float dotNum = dot(normal,vec3(0.0,1.0,0.0));\r\n    // gl_FragColor = mix(color,vec4(1.0),dotNum*0.8);\r\n    // return;\r\n\r\n    vec3 viewDir = normalize(positionEC.xyz);\r\n    vec3 reflectDir = reflect(viewDir, normal);\r\n    // vec3 viewReflectDir = czm_viewRotation * reflectDir;\r\n    vec3 viewReflectDir = reflectDir;\r\n\r\n    \r\n    float step = 0.05;\r\n    int stepNum = int(20.0 / step);\r\n    vec3 pos;\r\n    vec3 albedo;\r\n    bool jd = false;\r\n    for(int i = 1;i <= 400;i++)\r\n    {\r\n        float delta = step * float(i) + offset;\r\n        pos = positionEC.xyz + viewReflectDir * delta;\r\n        float d = -pos.z;\r\n\r\n        vec4 tmp = czm_projection * vec4(pos,1.0);\r\n        vec3 screenPos = tmp.xyz / tmp.w;\r\n        vec2 uv = vec2(screenPos.x, screenPos.y) * 0.5 + vec2(0.5, 0.5);\r\n        \r\n        if(uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0){\r\n            float dd = getDepth(texture2D(depthTexture, uv));\r\n            vec4 jzc = toEye(uv, dd);\r\n            dd = -jzc.z;\r\n            if(d>dd){\r\n                if(abs(abs(d) - abs(dd)) <=step){\r\n                    jd = true;\r\n                    // albedo = texture2D(colorTexture, uv).rgb;\r\n                    albedo = guussColor(uv);\r\n                }\r\n                break;\r\n            }\r\n        }\r\n    }\r\n    if(jd){\r\n        gl_FragColor = vec4(mix(color.xyz,albedo,0.5),1.0);\r\n    }else{\r\n        gl_FragColor = color;\r\n    }\r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.SnowCover = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(156),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s);
        t.SnowCover = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, i = i || {}, this.alpha = a.defaultValue(i.alpha, 1), this._show = a.defaultValue(i.show, !0), this.init()
            }
            return n(e, [{
                key: "init",
                value: function () {
                    var e = this;
                    this.postStage = new a.PostProcessStage({
                        name: "SnowCover",
                        fragmentShader: l.default,
                        uniforms: {
                            alpha: function () {
                                return e.alpha
                            }
                        }
                    }), this.postStage.enabled = this._show, this.viewer.scene.postProcessStages.add(this.postStage)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postStage)
                }
            }, {
                key: "show",
                get: function () {
                    return this._show
                },
                set: function (e) {
                    this._show = Boolean(e), this.postStage.enabled = this._show
                }
            }]), e
        }()
    }, function (e, t) {
        e.exports = "#extension GL_OES_standard_derivatives : enable\r\nuniform sampler2D colorTexture;\r\nuniform sampler2D depthTexture;\r\nuniform float alpha;\r\nvarying vec2 v_textureCoordinates;\r\nvec4 toEye(in vec2 uv, in float depth){\r\n    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\r\n    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\r\n    posInCamera =posInCamera / posInCamera.w;\r\n    return posInCamera;\r\n}\r\nfloat getDepth(in vec4 depth){\r\n    float z_window = czm_unpackDepth(depth);\r\n    z_window = czm_reverseLogDepth(z_window);\r\n    float n_range = czm_depthRange.near;\r\n    float f_range = czm_depthRange.far;\r\n    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\r\n}\r\nvoid main(){\r\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\r\n    vec4 currD = texture2D(depthTexture, v_textureCoordinates);\r\n    if(currD.r>=1.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    float depth = getDepth(currD);\r\n    vec4 positionEC = toEye(v_textureCoordinates, depth);\r\n    vec3 dx = dFdx(positionEC.xyz);\r\n    vec3 dy = dFdy(positionEC.xyz);\r\n    vec3 nor = normalize(cross(dx,dy));\r\n\r\n    vec4 positionWC = normalize(czm_inverseView * positionEC);\r\n    vec3 normalWC = normalize(czm_inverseViewRotation * nor);\r\n    float dotNumWC = dot(positionWC.xyz,normalWC);\r\n    if(dotNumWC<=0.3){\r\n        gl_FragColor = mix(color,vec4(1.0),alpha*0.3);\r\n        return;\r\n    }\r\n    gl_FragColor = mix(color,vec4(1.0),dotNumWC*alpha);\r\n}"
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.WaterSpout = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = new a.Matrix4,
            l = new a.Cartesian3,
            u = new a.Quaternion,
            c = new a.HeadingPitchRoll,
            h = new a.TranslationRotationScale,
            d = new a.Cartesian3;
        t.WaterSpout = function () {
            function e(t, i) {
                r(this, e), t && (this.viewer = t, i = i || {}, this.image = i.image, this.startColor = a.defaultValue(i.startColor, a.Color.LIGHTCYAN.withAlpha(.3)), this.endColor = a.defaultValue(i.endColor, a.Color.WHITE.withAlpha(0)), this.startScale = a.defaultValue(i.startScale, 2), this.endScale = a.defaultValue(i.endScale, 4), this.minimumParticleLife = a.defaultValue(i.minimumParticleLife, 4.1), this.maximumParticleLife = a.defaultValue(i.maximumParticleLife, 1.1), this.minimumSpeed = a.defaultValue(i.minimumSpeed, 0), this.maximumSpeed = a.defaultValue(i.maximumSpeed, 0), this.particleSize = a.defaultValue(i.particleSize, 28), this.emissionRate = a.defaultValue(i.emissionRate, 100), this.lifetime = a.defaultValue(i.lifetime, 8), this.bursts = a.defaultValue(i.bursts, [new a.ParticleBurst({
                    time: 5,
                    minimum: 60,
                    maximum: 100
                })]), this.gravity = a.defaultValue(i.gravity, -11), this._show = a.defaultValue(i.show, !1), this.arrPS = [], this.viewer.scene.preUpdate.addEventListener(this._scene_preUpdateHandler, this))
            }
            return n(e, [{
                key: "add",
                value: function (e) {
                    function t(e, t) {
                        var r = new a.Cartesian3(-.8, -.5, 2);
                        a.Cartesian3.multiplyByScalar(r, .1, r);
                        var n = e.position;
                        a.Cartesian3.add(e.position, r, e.position), a.Cartesian3.normalize(n, d), a.Cartesian3.multiplyByScalar(d, i.gravity * t, d), e.velocity = a.Cartesian3.add(e.velocity, d, e.velocity)
                    }
                    for (var i = this, r = 0, n = e.length; r < n; r++) {
                        var o = e[r],
                            s = a.Cartesian3.fromDegrees(o[0], o[1], o[2]),
                            l = this.viewer.scene.primitives.add(new a.ParticleSystem({
                                image: this.image,
                                startColor: this.startColor,
                                endColor: this.endColor,
                                startScale: this.startScale,
                                endScale: this.endScale,
                                minimumParticleLife: this.minimumParticleLife,
                                maximumParticleLife: this.maximumParticleLife,
                                minimumSpeed: this.minimumSpeed,
                                maximumSpeed: this.maximumSpeed,
                                imageSize: new a.Cartesian2(this.particleSize, this.particleSize),
                                emissionRate: this.emissionRate,
                                bursts: this.bursts,
                                lifetime: this.lifetime,
                                emitter: new a.CircleEmitter(2),
                                emitterModelMatrix: this._computeEmitterModelMatrix(),
                                updateCallback: t,
                                show: this.show
                            }));
                        this.arrPS.push({
                            center: s,
                            particleSystem: l
                        })
                    }
                }
            }, {
                key: "_scene_preUpdateHandler",
                value: function () {
                    if (this.arrPS && 0 != this.arrPS.length)
                        for (var e = 0, t = this.arrPS.length; e < t; e++) {
                            var i = this.arrPS[e],
                                r = i.particleSystem;
                            r.modelMatrix = this._computeModelMatrix(i.center), r.emitterModelMatrix = this._computeEmitterModelMatrix()
                        }
                }
            }, {
                key: "_computeModelMatrix",
                value: function (e) {
                    var t = a.Transforms.eastNorthUpToFixedFrame(e),
                        i = a.Matrix3.fromHeadingPitchRoll(new a.HeadingPitchRoll(2.619728786416368, 0, 0)),
                        r = a.Matrix4.fromRotationTranslation(i, new a.Cartesian3(0, 0, -2));
                    return a.Matrix4.multiply(t, r, t), t
                }
            }, {
                key: "_computeEmitterModelMatrix",
                value: function () {
                    c = a.HeadingPitchRoll.fromDegrees(0, 0, 0, c), h.translation = a.Cartesian3.fromElements(0, 0, 0, l), h.rotation = a.Quaternion.fromHeadingPitchRoll(c, u), a.Matrix4.fromTranslationRotationScale(h, s);
                    var e = new a.Cartesian3(-2, -2, 2);
                    return a.Matrix4.multiplyByTranslation(s, e, s), s
                }
            }, {
                key: "updateVisible",
                value: function (e, t) {
                    this.arrPS[t].particleSystem.show = e
                }
            }, {
                key: "updateAllVisible",
                value: function (e) {
                    for (var t = 0, i = this.arrPS.length; t < i; t++) this.arrPS[t].particleSystem.show = e
                }
            }, {
                key: "clear",
                value: function () {
                    for (var e = 0, t = this.arrPS.length; e < t; e++) this.viewer.scene.primitives.remove(this.arrPS[e].particleSystem);
                    this.arrPS = []
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.preUpdate.removeEventListener(this._scene_preUpdateHandler, this), this.clear()
                }
            }, {
                key: "show",
                get: function () {
                    return this._show
                },
                set: function (e) {
                    this._show = e, this.updateAllVisible(this._show)
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            e = t.wutu.point2map(e);
            var i = a.Cartesian3.fromDegrees(e.x, e.y, e.z || 0),
                r = a.Math.toRadians(e.heading || 0),
                n = a.Math.toRadians(e.pitch || 0),
                o = a.Math.toRadians(e.roll || 0),
                s = new a.HeadingPitchRoll(r, n, o),
                l = e.converter || a.Transforms.eastNorthUpToFixedFrame,
                u = a.Transforms.headingPitchRollQuaternion(i, s, t.scene.globe.ellipsoid, l);
            return t.entities.add({
                name: e.name || "",
                position: i,
                orientation: u,
                model: e,
                tooltip: e.tooltip,
                popup: e.popup
            })
        }

        function n(e, t) {
            var i, r = t.viewer || window.viewer,
                n = new a.SampledPositionProperty,
                o = r.clock.currentTime,
                s = e.position.getValue(o);
            n.addSample(o, s);
            var l = t.position,
                u = t.time || 3;
            i = a.JulianDate.addSeconds(o, u, new a.JulianDate), n.addSample(i, l), e.position = n, r.clock.shouldAnimate = !0;
            var c = r.clock.multiplier;
            r.clock.multiplier = t.speed || 1, r.clock.currentTime = o.clone(), setTimeout(function () {
                e.position = l, r.clock.multiplier = c, t.onEnd && t.onEnd()
            }, 1e3 * u)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.rotate = void 0, t.createModel = r, t.move = n;
        var o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(28);
        t.rotate = {
            isStart: !1,
            viewer: null,
            start: function (e, t) {
                this.entity = e, this.viewer = t.viewer || window.viewer, this.time = this.viewer.clock.currentTime.clone(), this.hpr = (0, s.getHeadingPitchRollByOrientation)(this.entity.position._value, this.entity.orientation && this.entity.orientation._value), this.angle = t.step || 10, this.viewer.clock.shouldAnimate = !0, this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this), this.isStart = !0
            },
            clock_onTickHandler: function (e) {
                var t = a.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time),
                    i = a.Math.toRadians(t * this.angle) + this.hpr.heading,
                    r = new a.HeadingPitchRoll(i, this.hpr.pitch, this.hpr.roll);
                this.entity.orientation = a.Transforms.headingPitchRollQuaternion(this.entity.position._value, r)
            },
            stop: function () {
                this.isStart && (this.viewer && this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this), this.isStart = !1)
            }
        }
    }, function (e, t, i) {
        "use strict";

        function r(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Video3D = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(a),
            l = i(5),
            u = r(l),
            c = i(160),
            h = r(c),
            d = {
                LEFT: "Z",
                RIGHT: "-Z",
                TOP: "Y",
                BOTTOM: "-Y",
                ALONG: "X",
                INVERSE: "-X"
            },
            f = {
                font: "50px 楷体",
                fill: !0,
                fillColor: new s.Color(1, 1, 0, 1),
                stroke: !0,
                strokeWidth: 2,
                strokeColor: new s.Color(1, 1, 1, .8),
                backgroundColor: new s.Color(1, 1, 1, .1),
                textBaseline: "top",
                padding: 40
            },
            p = {
                Color: 1,
                Image: 2,
                Video: 3,
                Text: 4
            };
        (t.Video3D = function () {
            function e(t, i) {
                if (n(this, e), t) {
                    i || (i = {}), this.viewer = t, this._cameraPosition = i.cameraPosition, this._position = i.position, this.type = i.type, this.alpha = i.alpha || 1, this.color = i.color, this._debugFrustum = s.defaultValue(i.debugFrustum, !0), this._aspectRatio = i.aspectRatio || this._getWinWidHei();
                    var r = i.fov && s.Math.toRadians(i.fov);
                    if (this._camerafov = r || this.viewer.scene.camera.frustum.fov, this.videoTexture = this.texture = i.texture || new s.Texture({
                            context: this.viewer.scene.context,
                            source: {
                                width: 1,
                                height: 1,
                                arrayBufferView: new Uint8Array([255, 255, 255, 255])
                            },
                            flipY: !1
                        }), this._videoPlay = s.defaultValue(i.videoPlay, !0), this.defaultShow = s.defaultValue(i.show, !0), this.clearBlack = s.defaultValue(i.clearBlack, !1), this._rotateDeg = 1, this._dirObj = s.defaultValue(i.dirObj, void 0), this.text = s.defaultValue(i.text, void 0), this.textStyles = s.defaultValue(i.textStyles, f), this._disViewColor = s.defaultValue(i.disViewColor, new s.Color(0, 0, 0, .5)), !this.cameraPosition || !this.cameraPosition) return void console.log("初始化失败：请确认相机位置与视点位置正确！");
                    switch (i.dom && (this.dom = i.dom, this.dom instanceof HTMLElement && (this.dom = i.dom), i.dom instanceof u.default && i.dom.length && (this.dom = i.dom[0])), this.url = i.url, this.type) {
                        default:
                        case p.Video:
                            this.activeVideo(this.url);
                            break;
                        case p.Image:
                            this.activePicture(this.url), this.deActiveVideo();
                            break;
                        case p.Color:
                            this.activeColor(this.color), this.deActiveVideo();
                            break;
                        case p.Text:
                            this.activeText(this.text, this.textStyles), this.deActiveVideo()
                    }
                    this._createShadowMap(), this._getOrientation(), this._addCameraFrustum(), this._addPostProcess(), this.viewer.scene.primitives.add(this)
                }
            }
            return o(e, [{
                key: "rotateCamera",
                value: function (e, t) {
                    var i = s.defaultValue(t, this._rotateDeg);
                    switch (e) {
                        case d.LEFT:
                            break;
                        case d.RIGHT:
                            i *= -1;
                            break;
                        case d.TOP:
                            break;
                        case d.BOTTOM:
                            i *= -1;
                            break;
                        case d.ALONG:
                            break;
                        case d.INVERSE:
                            i *= -1
                    }
                    var r = this._computedNewViewDir(e, i);
                    this.viewer.scene.postProcessStages.remove(this.postProcess), this.viewer.scene.primitives.remove(this.cameraFrustum), this.viewShadowMap.destroy(), this.cameraFrustum.destroy(), this._resetCameraDir(r), this._getOrientation(), this._addCameraFrustum(), this._addPostProcess()
                }
            }, {
                key: "_resetCameraDir",
                value: function (e) {
                    e && e.up && e.right && e.direction && (this._dirObj = e, this._createShadowMap())
                }
            }, {
                key: "_computedNewViewDir",
                value: function (e, t) {
                    t = s.Math.toRadians(t);
                    var i = this.viewShadowMap._lightCamera,
                        r = s.clone(i.direction),
                        n = s.clone(i.right),
                        o = s.clone(i.up),
                        a = new s.Matrix3;
                    switch (e) {
                        case d.LEFT:
                        case d.RIGHT:
                            s.Matrix3.fromRotationZ(t, a);
                            break;
                        case d.TOP:
                        case d.BOTTOM:
                            s.Matrix3.fromRotationY(t, a);
                            break;
                        case d.ALONG:
                        case d.INVERSE:
                            s.Matrix3.fromRotationX(t, a)
                    }
                    var l = s.Transforms.eastNorthUpToFixedFrame(i.position),
                        u = s.Matrix4.inverse(l, new s.Matrix4),
                        c = s.Matrix4.multiplyByPointAsVector(u, r, new s.Cartesian3),
                        h = s.Matrix3.multiplyByVector(a, c, new s.Cartesian3),
                        f = s.Matrix4.multiplyByPointAsVector(l, h, new s.Cartesian3),
                        p = s.Matrix4.multiplyByPointAsVector(u, n, new s.Cartesian3),
                        m = s.Matrix3.multiplyByVector(a, p, new s.Cartesian3),
                        g = s.Matrix4.multiplyByPointAsVector(l, m, new s.Cartesian3),
                        v = s.Matrix4.multiplyByPointAsVector(u, o, new s.Cartesian3),
                        y = s.Matrix3.multiplyByVector(a, v, new s.Cartesian3);
                    return {
                        direction: f,
                        right: g,
                        up: s.Matrix4.multiplyByPointAsVector(l, y, new s.Cartesian3)
                    }
                }
            }, {
                key: "getPercentagePoint",
                value: function (e) {
                    if (e) {
                        var t = this.viewShadowMap._lightCamera._viewMatrix,
                            i = this.viewShadowMap._lightCamera.frustum.projectionMatrix,
                            r = new s.Cartesian4(e.x, e.y, e.z, 1),
                            n = s.Matrix4.multiply(i, t, new s.Matrix4),
                            o = s.Matrix4.multiplyByVector(n, r, new s.Cartesian4),
                            a = new s.Cartesian2(o.x / o.w, o.y / o.w);
                        return new s.Cartesian2(a.x / 2 + .5, a.y / 2 + .5)
                    }
                }
            }, {
                key: "_changeCameraFov",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postProcess), this.viewer.scene.primitives.remove(this.cameraFrustum), this._createShadowMap(), this._getOrientation(), this._addCameraFrustum(), this._addPostProcess()
                }
            }, {
                key: "_changeVideoWidHei",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postProcess), this.viewer.scene.primitives.remove(this.cameraFrustum), this._createShadowMap(), this._getOrientation(), this._addCameraFrustum(), this._addPostProcess()
                }
            }, {
                key: "_changeCameraPos",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postProcess), this.viewer.scene.primitives.remove(this.cameraFrustum), this.viewShadowMap.destroy(), this.cameraFrustum.destroy(), this._createShadowMap(!0), this._getOrientation(), this._addCameraFrustum(), this._addPostProcess()
                }
            }, {
                key: "_changeViewPos",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postProcess), this.viewer.scene.primitives.remove(this.cameraFrustum), this.viewShadowMap.destroy(), this.cameraFrustum.destroy(), this._createShadowMap(!0), this._getOrientation(), this._addCameraFrustum(), this._addPostProcess()
                }
            }, {
                key: "_switchShow",
                value: function () {
                    this.show ? !this.postProcess && this._addPostProcess() : (this.viewer.scene.postProcessStages.remove(this.postProcess), delete this.postProcess, this.postProcess = null)
                }
            }, {
                key: "activeVideo",
                value: function (e) {
                    var t;
                    t = this.dom ? this.dom : this._createVideoEle(e);
                    var i = this;
                    t && (this.type = p.Video, this.videoElement = t, t.addEventListener("canplaythrough", function () {
                        i.viewer.clock.onTick.addEventListener(i.activeVideoListener, i)
                    }))
                }
            }, {
                key: "activeVideoListener",
                value: function () {
                    try {
                        this._videoPlay && this.videoElement.paused && this.videoElement.play()
                    } catch (e) {}
                    this.videoTexture && this.videoTexture.destroy(), this.videoTexture = new s.Texture({
                        context: this.viewer.scene.context,
                        source: this.videoElement,
                        pixelFormat: s.PixelFormat.RGBA,
                        pixelDatatype: s.PixelDatatype.UNSIGNED_BYTE
                    })
                }
            }, {
                key: "deActiveVideo",
                value: function () {
                    this.viewer.clock.onTick.removeEventListener(this.activeVideoListener, this), delete this.activeVideoListener
                }
            }, {
                key: "activePicture",
                value: function (e) {
                    this.videoTexture = this.texture;
                    var t = this,
                        i = new Image;
                    i.onload = function () {
                        t.type = p.Image, t.videoTexture = new s.Texture({
                            context: t.viewer.scene.context,
                            source: i
                        })
                    }, i.onerror = function () {
                        console.log("图片加载失败：" + e)
                    }, i.src = e
                }
            }, {
                key: "activeColor",
                value: function (e) {
                    var t = this;
                    this.type = p.Color;
                    var i, r, n, o;
                    e ? (i = 255 * e.red, r = 255 * e.green, n = 255 * e.blue, o = 255 * e.alpha) : (i = 255 * Math.random(), r = 255 * Math.random(), n = 255 * Math.random(), o = 255 * Math.random()), t.videoTexture = new s.Texture({
                        context: t.viewer.scene.context,
                        source: {
                            width: 1,
                            height: 1,
                            arrayBufferView: new Uint8Array([i, r, n, o])
                        },
                        flipY: !1
                    })
                }
            }, {
                key: "activeText",
                value: function (e, t) {
                    var i = this;
                    this.type = p.Text, e && (t = t || {}, t.textBaseline = "top", this.textCanvas = s.writeTextToCanvas(e, t), i.videoTexture = new s.Texture({
                        context: i.viewer.scene.context,
                        source: this.textCanvas,
                        flipY: !0
                    }))
                }
            }, {
                key: "locate",
                value: function () {
                    var e = s.clone(this.cameraPosition),
                        t = s.clone(this.position);
                    if (this.viewer.camera.position = e, this._dirObj) return this.viewer.camera.direction = s.clone(this._dirObj.direction), this.viewer.camera.right = s.clone(this._dirObj.right), void(this.viewer.camera.up = s.clone(this._dirObj.up));
                    this.viewer.camera.direction = s.Cartesian3.subtract(t, e, new s.Cartesian3(0, 0, 0)), this.viewer.camera.up = s.Cartesian3.normalize(e, new s.Cartesian3(0, 0, 0))
                }
            }, {
                key: "_getOrientation",
                value: function () {
                    var e = this.cameraPosition,
                        t = this.position,
                        i = s.Cartesian3.normalize(s.Cartesian3.subtract(t, e, new s.Cartesian3), new s.Cartesian3),
                        r = s.Cartesian3.normalize(e, new s.Cartesian3),
                        n = new s.Camera(this.viewer.scene);
                    n.position = e, n.direction = i, n.up = r, i = n.directionWC, r = n.upWC;
                    var o = n.rightWC,
                        a = new s.Cartesian3,
                        l = new s.Matrix3,
                        u = new s.Quaternion;
                    o = s.Cartesian3.negate(o, a);
                    var c = l;
                    s.Matrix3.setColumn(c, 0, o, c), s.Matrix3.setColumn(c, 1, r, c), s.Matrix3.setColumn(c, 2, i, c);
                    var h = s.Quaternion.fromRotationMatrix(c, u);
                    return this.orientation = h, h
                }
            }, {
                key: "_createVideoEle",
                value: function (e) {
                    if (e) {
                        var t = document.createElement("SOURCE");
                        t.type = "video/mp4", t.src = e;
                        var i = document.createElement("SOURCE");
                        i.type = "video/quicktime", i.src = e;
                        var r = document.createElement("video");
                        return r.setAttribute("autoplay", !0), r.setAttribute("loop", !0), r.setAttribute("crossorigin", !0), r.appendChild(t), r.appendChild(i), r.style.display = "none", document.body.appendChild(r), r
                    }
                }
            }, {
                key: "_getWinWidHei",
                value: function () {
                    var e = this.viewer.scene;
                    return e.canvas.clientWidth / e.canvas.clientHeight
                }
            }, {
                key: "_createShadowMap",
                value: function (e) {
                    var t = this.cameraPosition,
                        i = this.position,
                        r = this.viewer.scene,
                        n = new s.Camera(r);
                    n.position = t, this._dirObj && !e ? (n.direction = this._dirObj.direction, n.right = this._dirObj.right, n.up = this._dirObj.up) : (n.direction = s.Cartesian3.subtract(i, t, new s.Cartesian3(0, 0, 0)), n.up = s.Cartesian3.normalize(t, new s.Cartesian3(0, 0, 0)));
                    var o = s.Cartesian3.distance(i, t);
                    this.viewDis = o, n.frustum = new s.PerspectiveFrustum({
                        fov: this.fov,
                        aspectRatio: this.aspectRatio,
                        near: .1,
                        far: 2 * o
                    });
                    this.viewShadowMap = new s.ShadowMap({
                        lightCamera: n,
                        enable: !1,
                        isPointLight: !1,
                        isSpotLight: !0,
                        cascadesEnabled: !1,
                        context: r.context,
                        pointLightRadius: o
                    })
                }
            }, {
                key: "_addCameraFrustum",
                value: function () {
                    var e = this;
                    this.cameraFrustum = new s.Primitive({
                        geometryInstances: new s.GeometryInstance({
                            geometry: new s.FrustumOutlineGeometry({
                                origin: e.cameraPosition,
                                orientation: e.orientation,
                                frustum: this.viewShadowMap._lightCamera.frustum,
                                _drawNearPlane: !0
                            }),
                            attributes: {
                                color: s.ColorGeometryInstanceAttribute.fromColor(new s.Color(0, .5, .5))
                            }
                        }),
                        appearance: new s.PerInstanceColorAppearance({
                            translucent: !1,
                            flat: !0
                        }),
                        asynchronous: !1,
                        show: this.debugFrustum && this.show
                    }), this.viewer.scene.primitives.add(this.cameraFrustum)
                }
            }, {
                key: "_addPostProcess",
                value: function () {
                    var e = this,
                        t = h.default,
                        i = e.viewShadowMap._isPointLight ? e.viewShadowMap._pointBias : e.viewShadowMap._primitiveBias;
                    this.show && (this.postProcess = new s.PostProcessStage({
                        fragmentShader: t,
                        uniforms: {
                            mixNum: function () {
                                return e.alpha
                            },
                            stcshadow: function () {
                                return e.viewShadowMap._shadowMapTexture
                            },
                            videoTexture: function () {
                                return e.videoTexture
                            },
                            _shadowMap_matrix: function () {
                                return e.viewShadowMap._shadowMapMatrix
                            },
                            shadowMap_lightPositionEC: function () {
                                return e.viewShadowMap._lightPositionEC
                            },
                            shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: function () {
                                var t = new s.Cartesian2;
                                return t.x = 1 / e.viewShadowMap._textureSize.x, t.y = 1 / e.viewShadowMap._textureSize.y, s.Cartesian4.fromElements(t.x, t.y, i.depthBias, i.normalShadingSmooth, this.combinedUniforms1)
                            },
                            shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: function () {
                                return s.Cartesian4.fromElements(i.normalOffsetScale, e.viewShadowMap._distance, e.viewShadowMap.maximumDistance, e.viewShadowMap._darkness, this.combinedUniforms2)
                            },
                            disViewColor: function () {
                                return e._disViewColor
                            },
                            clearBlack: function () {
                                return e.clearBlack
                            }
                        }
                    }), this.viewer.scene.postProcessStages.add(this.postProcess))
                }
            }, {
                key: "update",
                value: function (e) {
                    this.viewShadowMap && e.shadowMaps.push(this.viewShadowMap)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.postProcessStages.remove(this.postProcess), this.viewer.scene.primitives.remove(this.cameraFrustum), this.videoElement && this.videoElement.parentNode.removeChild(this.videoElement), delete this.videoElement, this.viewer.clock.onTick.removeEventListener(this.activeVideoListener, this), delete this.activeVideoListener, delete this.postProcess, delete this.viewShadowMap, delete this.color, delete this.viewDis, delete this.cameraPosition, delete this.position, delete this.alpha, delete this._camerafov, delete this._cameraPosition, delete this.videoTexture, delete this.cameraFrustum, delete this.dom, delete this._debugFrustum, delete this._position, delete this._aspectRatio, delete this.orientation, delete this.texture, delete this.type, delete this.videoTexture, delete this.url, this.viewer.scene.primitives.remove(this), delete this.viewer
                }
            }, {
                key: "alpha",
                get: function () {
                    return this._alpha
                },
                set: function (e) {
                    this._alpha = e
                }
            }, {
                key: "aspectRatio",
                get: function () {
                    return this._aspectRatio
                },
                set: function (e) {
                    this._aspectRatio = e, this._changeVideoWidHei()
                }
            }, {
                key: "debugFrustum",
                get: function () {
                    return this._debugFrustum
                },
                set: function (e) {
                    this._debugFrustum = e, this.cameraFrustum.show = e
                }
            }, {
                key: "fov",
                get: function () {
                    return this._camerafov
                },
                set: function (e) {
                    this._camerafov = s.Math.toRadians(e), this._changeCameraFov()
                }
            }, {
                key: "cameraPosition",
                get: function () {
                    return this._cameraPosition
                },
                set: function (e) {
                    e && (this._cameraPosition = e, this._changeCameraPos())
                }
            }, {
                key: "position",
                get: function () {
                    return this._position
                },
                set: function (e) {
                    e && (this._position = e, this._changeViewPos())
                }
            }, {
                key: "videoPlay",
                get: function () {
                    return this._videoPlay
                },
                set: function (e) {
                    this._videoPlay = Boolean(e), this.videoElement && (this.videoPlay ? this.videoElement.play() : this.videoElement.pause())
                }
            }, {
                key: "params",
                get: function () {
                    var e = {};
                    return e.type = this.type, this.type == p.Color ? e.color = this.color : e.url = this.url, e.position = this.position, e.cameraPosition = this.cameraPosition, e.fov = s.Math.toDegrees(this.fov), e.aspectRatio = this.aspectRatio, e.alpha = this.alpha, e.debugFrustum = this.debugFrustum, e.dirObj = this._dirObj, e
                }
            }, {
                key: "show",
                get: function () {
                    return this.defaultShow
                },
                set: function (e) {
                    this.defaultShow = Boolean(e), this._switchShow()
                }
            }, {
                key: "camera",
                get: function () {
                    return this.viewShadowMap._lightCamera
                }
            }, {
                key: "disViewColor",
                get: function () {
                    return this._disViewColor
                },
                set: function (e) {
                    e && (this._disViewColor = e, e.a || 0 == e.a || (this._disViewColor.a = 1))
                }
            }]), e
        }()).Type = p
    }, function (e, t) {
        e.exports = "\r\n\r\n\r\n\r\nuniform float mixNum;\r\nuniform sampler2D colorTexture;\r\nuniform sampler2D stcshadow; \r\nuniform sampler2D videoTexture;\r\nuniform sampler2D depthTexture;\r\nuniform mat4 _shadowMap_matrix; \r\nuniform vec4 shadowMap_lightPositionEC; \r\nuniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness; \r\nuniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth; \r\nuniform vec4 disViewColor;\r\nuniform bool clearBlack;\r\nvarying vec2 v_textureCoordinates;\r\nvec4 toEye(in vec2 uv, in float depth){\r\n    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\r\n    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\r\n    posInCamera =posInCamera / posInCamera.w;\r\n    return posInCamera;\r\n}\r\nfloat getDepth(in vec4 depth){\r\n    float z_window = czm_unpackDepth(depth);\r\n    z_window = czm_reverseLogDepth(z_window);\r\n    float n_range = czm_depthRange.near;\r\n    float f_range = czm_depthRange.far;\r\n    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\r\n}\r\nfloat _czm_sampleShadowMap(sampler2D shadowMap, vec2 uv){\r\n    return texture2D(shadowMap, uv).r;\r\n}\r\nfloat _czm_shadowDepthCompare(sampler2D shadowMap, vec2 uv, float depth){\r\n    return step(depth, _czm_sampleShadowMap(shadowMap, uv));\r\n}\r\nfloat _czm_shadowVisibility(sampler2D shadowMap, czm_shadowParameters shadowParameters){\r\n    float depthBias = shadowParameters.depthBias;\r\n    float depth = shadowParameters.depth;\r\n    float nDotL = shadowParameters.nDotL;\r\n    float normalShadingSmooth = shadowParameters.normalShadingSmooth;\r\n    float darkness = shadowParameters.darkness;\r\n    vec2 uv = shadowParameters.texCoords;\r\n    depth -= depthBias;\r\n    vec2 texelStepSize = shadowParameters.texelStepSize;\r\n    float radius = 1.0;\r\n    float dx0 = -texelStepSize.x * radius;\r\n    float dy0 = -texelStepSize.y * radius;\r\n    float dx1 = texelStepSize.x * radius;\r\n    float dy1 = texelStepSize.y * radius;\r\n    float visibility = \r\n    (\r\n    _czm_shadowDepthCompare(shadowMap, uv, depth)\r\n    +_czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, 0.0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, 0.0), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy1), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy1), depth) +\r\n    _czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy1), depth)\r\n    ) * (1.0 / 9.0)\r\n    ;\r\n    return visibility;\r\n}\r\nvec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\r\n    vec3 v01 = point -planeOrigin;\r\n    float d = dot(planeNormal, v01) ;\r\n    return (point - planeNormal * d);\r\n}\r\nfloat ptm(vec3 pt){\r\n    return sqrt(pt.x*pt.x + pt.y*pt.y + pt.z*pt.z);\r\n}\r\nvoid main() \r\n{ \r\n    const float PI = 3.141592653589793;\r\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\r\n    vec4 currD = texture2D(depthTexture, v_textureCoordinates);\r\n    if(currD.r>=1.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    \r\n    float depth = getDepth(currD);\r\n    vec4 positionEC = toEye(v_textureCoordinates, depth);\r\n    vec3 normalEC = vec3(1.0);\r\n    czm_shadowParameters shadowParameters; \r\n    shadowParameters.texelStepSize = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy; \r\n    shadowParameters.depthBias = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z; \r\n    shadowParameters.normalShadingSmooth = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w; \r\n    shadowParameters.darkness = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w; \r\n    shadowParameters.depthBias *= max(depth * 0.01, 1.0); \r\n    vec3 directionEC = normalize(positionEC.xyz - shadowMap_lightPositionEC.xyz); \r\n    float nDotL = clamp(dot(normalEC, -directionEC), 0.0, 1.0); \r\n    vec4 shadowPosition = _shadowMap_matrix * positionEC; \r\n    shadowPosition /= shadowPosition.w; \r\n    if (any(lessThan(shadowPosition.xyz, vec3(0.0))) || any(greaterThan(shadowPosition.xyz, vec3(1.0)))) \r\n    { \r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n    shadowParameters.texCoords = shadowPosition.xy; \r\n    shadowParameters.depth = shadowPosition.z; \r\n    shadowParameters.nDotL = nDotL; \r\n    float visibility = _czm_shadowVisibility(stcshadow, shadowParameters); \r\n\r\n    vec4 videoColor = texture2D(videoTexture,shadowPosition.xy);\r\n    if(clearBlack){\r\n        if(videoColor.r + videoColor.g + videoColor.b <0.01){\r\n            gl_FragColor = color;\r\n            return;\r\n        }\r\n    }\r\n    if(visibility==1.0){\r\n        gl_FragColor = mix(color,vec4(videoColor.xyz,1.0),mixNum*videoColor.a);\r\n    }else{\r\n        if(abs(shadowPosition.z-0.0)<0.01){\r\n            return;\r\n        }\r\n        if(clearBlack){\r\n            gl_FragColor = color;\r\n            return;\r\n        }\r\n        gl_FragColor = vec4(mix(color.rgb,disViewColor.rgb,disViewColor.a),disViewColor.a);\r\n    }\r\n} "
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Video2D = void 0;
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(a),
            l = i(5),
            u = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(l),
            c = {
                LEFT: "Z",
                RIGHT: "-Z",
                TOP: "Y",
                BOTTOM: "-Y",
                ALONG: "X",
                INVERSE: "-X"
            };
        t.Video2D = function () {
            function e(t, i, n) {
                if (r(this, e), t) {
                    this.viewer = t, n = s.defaultValue(n, {}), this.dom = s.defaultValue(i, null), this._play = !0, this._aspectRatio = s.defaultValue(n.aspectRatio, null), this._aspectRatio || (this._aspectRatio = this.viewer.scene.context.drawingBufferWidth / this.viewer.scene.context.drawingBufferHeight), this._fov = s.defaultValue(n.fov, this.viewer.scene.camera.frustum.fov), this._dis = s.defaultValue(n.dis, 10), this._stRotation = s.defaultValue(n.stRotation, 0), this._rotateCam = s.defaultValue(n.rotateCam, .05), this._frustumShow = s.defaultValue(n.frustumShow, !0), this._camera = s.defaultValue(n.camera, null);
                    if (!this.checkDom(this.dom)) return "string" == typeof this.dom && this.dom.constructor == String && (this._url = this.dom, this.dom = this._createVideoEle(this._url)), void console.log("传入了非DOM元素");
                    this.init()
                }
            }
            return o(e, [{
                key: "init",
                value: function () {
                    this.recordObj = this.record(), this.rectPos = this.computedPos(this.dis, this.fov, this.aspectRatio, this.recordObj);
                    var e = this.getOrientation(this.recordObj),
                        t = this.createFrustum(this.fov, this.aspectRatio, this.dis),
                        i = this.createFrustumGeo(t, e, this.recordObj.position);
                    this.frustumPri = this.createFrustumPri(i), this.addToScene()
                }
            }, {
                key: "reset",
                value: function () {
                    this.viewer.scene.primitives.remove(this.frustumPri), this.viewer.entities.remove(this.entity), this.rectPos = this.computedPos(this.dis, this.fov, this.aspectRatio, this.recordObj);
                    var e = this.getOrientation(this.recordObj),
                        t = this.createFrustum(this.fov, this.aspectRatio, this.dis),
                        i = this.createFrustumGeo(t, e, this.recordObj.position);
                    this.frustumPri = this.createFrustumPri(i), this.addToScene()
                }
            }, {
                key: "record",
                value: function () {
                    var e = {},
                        t = this._camera || this.viewer.scene.camera;
                    return e.direction = s.clone(t.direction), e.up = s.clone(t.up), e.right = s.clone(t.right), e.position = s.clone(t.position), e
                }
            }, {
                key: "addToScene",
                value: function () {
                    this.viewer.scene.primitives.add(this.frustumPri), this.entity = viewer.entities.add({
                        polygon: {
                            hierarchy: this.rectPos,
                            perPositionHeight: !0,
                            material: this.dom,
                            stRotation: this.stRotation
                        }
                    })
                }
            }, {
                key: "computedPos",
                value: function (e, t, i, r) {
                    var n = (this.viewer, r.position),
                        o = r.direction,
                        a = r.right,
                        l = r.up,
                        u = new s.Ray(n, o),
                        c = s.Ray.getPoint(u, e, new s.Cartesian3),
                        h = t / 2,
                        d = Math.tan(h),
                        f = e * d,
                        p = f / i,
                        m = Math.sqrt(f * f + p * p),
                        g = new s.Cartesian3,
                        v = new s.Ray(c, a),
                        y = s.Ray.getPoint(v, f, new s.Cartesian3),
                        _ = new s.Ray(y, l);
                    s.Ray.getPoint(_, p, g);
                    var w = new s.Cartesian3,
                        b = s.Cartesian3.negate(l, new s.Cartesian3),
                        C = new s.Ray(y, b);
                    s.Ray.getPoint(C, p, w);
                    var x = new s.Cartesian3,
                        P = s.Cartesian3.normalize(s.Cartesian3.subtract(c, g, new s.Cartesian3), new s.Cartesian3),
                        E = new s.Ray(c, P);
                    s.Ray.getPoint(E, m, x);
                    var M = new s.Cartesian3,
                        T = s.Cartesian3.normalize(s.Cartesian3.subtract(c, w, new s.Cartesian3), new s.Cartesian3),
                        S = new s.Ray(c, T);
                    return s.Ray.getPoint(S, m, M), this.reverse ? [x, M, g, w].reverse() : [x, M, g, w]
                }
            }, {
                key: "checkDom",
                value: function (e) {
                    if (e) return e instanceof u.default && e.length && (e = e[0], this.dom = e), "object" === ("undefined" == typeof HTMLElement ? "undefined" : n(HTMLElement)) ? e instanceof HTMLElement : e && "object" === (void 0 === e ? "undefined" : n(e)) && 1 === e.nodeType && "string" == typeof e.nodeName
                }
            }, {
                key: "_createVideoEle",
                value: function (e) {
                    if (e) {
                        this.videoId = "visualDomId";
                        var t = document.createElement("SOURCE");
                        t.type = "video/mp4", t.src = e;
                        var i = document.createElement("SOURCE");
                        i.type = "video/quicktime", i.src = e;
                        var r = document.createElement("VIDEO");
                        return r.setAttribute("autoplay", !0), r.setAttribute("loop", !0), r.setAttribute("crossorigin", !0), r.appendChild(t), r.appendChild(i), r.style.display = "none", document.body.appendChild(r), r
                    }
                }
            }, {
                key: "createFrustum",
                value: function (e, t, i) {
                    return new s.PerspectiveFrustum({
                        fov: e,
                        aspectRatio: t,
                        near: .1,
                        far: i
                    })
                }
            }, {
                key: "getOrientation",
                value: function (e) {
                    if (e) {
                        var t = e.direction,
                            i = e.up,
                            r = e.right,
                            n = new s.Cartesian3,
                            o = new s.Matrix3,
                            a = new s.Quaternion;
                        r = s.Cartesian3.negate(r, n);
                        var l = o;
                        s.Matrix3.setColumn(l, 0, r, l), s.Matrix3.setColumn(l, 1, i, l), s.Matrix3.setColumn(l, 2, t, l);
                        return s.Quaternion.fromRotationMatrix(l, a)
                    }
                }
            }, {
                key: "createFrustumGeo",
                value: function (e, t, i) {
                    return new s.FrustumOutlineGeometry({
                        frustum: e,
                        orientation: t,
                        origin: i
                    })
                }
            }, {
                key: "createFrustumPri",
                value: function (e) {
                    var t = new s.GeometryInstance({
                        geometry: e
                    });
                    return new s.Primitive({
                        geometryInstances: t,
                        appearance: new s.MaterialAppearance({
                            material: s.Material.fromType("Color"),
                            faceForward: !0
                        })
                    })
                }
            }, {
                key: "locate",
                value: function () {
                    this.viewer.camera.direction = s.clone(this.recordObj.direction), this.viewer.camera.right = s.clone(this.recordObj.right), this.viewer.camera.up = s.clone(this.recordObj.up), this.viewer.camera.position = s.clone(this.recordObj.position)
                }
            }, {
                key: "rotateCamera",
                value: function (e, t) {
                    var i = s.defaultValue(t, this._rotateCam);
                    switch (e) {
                        case c.LEFT:
                            break;
                        case c.RIGHT:
                            i *= -1;
                            break;
                        case c.TOP:
                            break;
                        case c.BOTTOM:
                            i *= -1;
                            break;
                        case c.ALONG:
                            break;
                        case c.INVERSE:
                            i *= -1
                    }
                    var r = this._computedNewViewDir(e, i);
                    this.recordObj.direction = r.direction, this.recordObj.up = r.up, this.recordObj.right = r.right, this.reset()
                }
            }, {
                key: "_computedNewViewDir",
                value: function (e, t) {
                    t = s.Math.toRadians(t);
                    var i = this.recordObj,
                        r = s.clone(i.direction),
                        n = s.clone(i.right),
                        o = s.clone(i.up),
                        a = new s.Matrix3;
                    switch (e) {
                        case c.LEFT:
                        case c.RIGHT:
                            s.Matrix3.fromRotationZ(t, a);
                            break;
                        case c.TOP:
                        case c.BOTTOM:
                            s.Matrix3.fromRotationY(t, a);
                            break;
                        case c.ALONG:
                        case c.INVERSE:
                            s.Matrix3.fromRotationX(t, a)
                    }
                    var l = s.Transforms.eastNorthUpToFixedFrame(i.position),
                        u = s.Matrix4.inverse(l, new s.Matrix4),
                        h = s.Matrix4.multiplyByPointAsVector(u, r, new s.Cartesian3),
                        d = s.Matrix3.multiplyByVector(a, h, new s.Cartesian3),
                        f = s.Matrix4.multiplyByPointAsVector(l, d, new s.Cartesian3),
                        p = s.Matrix4.multiplyByPointAsVector(u, n, new s.Cartesian3),
                        m = s.Matrix3.multiplyByVector(a, p, new s.Cartesian3),
                        g = s.Matrix4.multiplyByPointAsVector(l, m, new s.Cartesian3),
                        v = s.Matrix4.multiplyByPointAsVector(u, o, new s.Cartesian3),
                        y = s.Matrix3.multiplyByVector(a, v, new s.Cartesian3);
                    return {
                        direction: f,
                        right: g,
                        up: s.Matrix4.multiplyByPointAsVector(l, y, new s.Cartesian3)
                    }
                }
            }, {
                key: "destroy",
                value: function () {
                    this.viewer.scene.primitives.remove(this.frustumPri), this.viewer.entities.remove(this.entity), delete this.recordObj.direction, delete this.recordObj.right, delete this.recordObj.up, delete this.recordObj.position, delete this.recordObj, delete this.aspectRatio, delete this.fov, delete this.dis, delete this.dom, delete this.rectPos
                }
            }, {
                key: "play",
                get: function () {
                    return this._play
                },
                set: function (e) {
                    this._play = Boolean(e), this._play ? this.dom.play() : this.dom.pause()
                }
            }, {
                key: "aspectRatio",
                get: function () {
                    return this._aspectRatio
                },
                set: function (e) {
                    !(e = Number(e)) || e < 0 || (e < 1 && (e = 1), this._aspectRatio = e, this.reset())
                }
            }, {
                key: "fov",
                get: function () {
                    return this._fov
                },
                set: function (e) {
                    !(e = Number(e)) || e < 0 || (this._fov = e, this.reset())
                }
            }, {
                key: "dis",
                get: function () {
                    return this._dis
                },
                set: function (e) {
                    !(e = Number(e)) || e < 0 || (this._dis = e, this.reset())
                }
            }, {
                key: "stRotation",
                get: function () {
                    return this._stRotation
                },
                set: function (e) {
                    !(e = Number(e)) || e < 0 || (this._stRotation = e, this.entity.polygon.stRotation = e)
                }
            }, {
                key: "frustumShow",
                get: function () {
                    return this._frustumShow
                },
                set: function (e) {
                    e = Boolean(e), this._frustumShow = e, this.frustumPri.show = e
                }
            }, {
                key: "params",
                get: function () {
                    return {
                        fov: this.fov,
                        dis: this.dis,
                        stRotation: this.stRotation,
                        frustumShow: this.frustumShow,
                        aspectRatio: this.aspectRatio,
                        camera: {
                            position: this.recordObj.position,
                            direction: this.recordObj.direction,
                            up: this.recordObj.up,
                            right: this.recordObj.right
                        }
                    }
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.FlowEcharts = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(163),
            l = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(s),
            u = a.Math.toRadians(80),
            c = function () {
                function e(t, i) {
                    r(this, e), this._GLMap = t, this.dimensions = ["lng", "lat"], this._mapOffset = [0, 0], this._api = i
                }
                return n(e, [{
                    key: "setMapOffset",
                    value: function (e) {
                        this._mapOffset = e
                    }
                }, {
                    key: "getBMap",
                    value: function () {
                        return this._GLMap
                    }
                }, {
                    key: "dataToPoint",
                    value: function (e) {
                        var t = [99999, 99999],
                            i = a.Cartesian3.fromDegrees(e[0], e[1]);
                        if (!i) return t;
                        var r = this._GLMap.cartesianToCanvasCoordinates(i);
                        if (!r) return t;
                        var n = this._GLMap;
                        if (n.mode === a.SceneMode.SCENE3D) {
                            if (a.Cartesian3.angleBetween(n.camera.position, i) > u) return !1
                        }
                        return [r.x - this._mapOffset[0], r.y - this._mapOffset[1]]
                    }
                }, {
                    key: "pointToData",
                    value: function (e) {
                        var t = this._mapOffset,
                            e = this._bmap.project([e[0] + t[0], e[1] + t[1]]);
                        return [e.lng, e.lat]
                    }
                }, {
                    key: "getViewRect",
                    value: function () {
                        var e = this._api;
                        return new l.default.graphic.BoundingRect(0, 0, e.getWidth(), e.getHeight())
                    }
                }, {
                    key: "getRoamTransform",
                    value: function () {
                        return l.default.matrix.create()
                    }
                }]), e
            }();
        c.dimensions = ["lng", "lat"], c.create = function (e, t) {
            var i;
            e.eachComponent("GLMap", function (e) {
                var r = t.getZr().painter;
                if (r) {
                    var n = (r.getViewportRoot(), l.default.glMap);
                    i = new c(n, t), i.setMapOffset(e.__mapOffset || [0, 0]), e.coordinateSystem = i
                }
            }), e.eachSeries(function (e) {
                "GLMap" === e.get("coordinateSystem") && (e.coordinateSystem = i)
            })
        }, l.default && (l.default.registerCoordinateSystem("GLMap", c), l.default.registerAction({
            type: "GLMapRoam",
            event: "GLMapRoam",
            update: "updateLayout"
        }, function (e, t) {}), l.default.extendComponentModel({
            type: "GLMap",
            getBMap: function () {
                return this.__GLMap
            },
            defaultOption: {
                roam: !1
            }
        }), l.default.extendComponentView({
            type: "GLMap",
            init: function (e, t) {
                this.api = t, l.default.glMap.postRender.addEventListener(this.moveHandler, this)
            },
            moveHandler: function (e, t) {
                this.api.dispatchAction({
                    type: "GLMapRoam"
                })
            },
            render: function (e, t, i) {},
            dispose: function (e) {
                l.default.glMap.postRender.removeEventListener(this.moveHandler, this)
            }
        }));
        var h = 999;
        t.FlowEcharts = function () {
            function e(t, i) {
                r(this, e), this._viewer = t, this._overlay = this._createChartOverlay(), this._overlay.setOption(i)
            }
            return n(e, [{
                key: "_createChartOverlay",
                value: function () {
                    var e = this._viewer.scene;
                    e.canvas.setAttribute("tabIndex", 0);
                    var t = document.createElement("div");
                    return t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.width = e.canvas.clientWidth + "px", t.style.height = e.canvas.clientHeight + "px", t.style.pointerEvents = "none", t.style.zIndex = h--, t.setAttribute("id", "echarts"), t.setAttribute("class", "echartMap"), this._viewer.cesiumWidget.container.appendChild(t), this._echartsContainer = t, l.default.glMap = e, l.default.init(t)
                }
            }, {
                key: "dispose",
                value: function () {
                    this._echartsContainer && (this._viewer.cesiumWidget.container.removeChild(this._echartsContainer), this._echartsContainer = null), this._overlay && (this._overlay.dispose(), this._overlay = null)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.dispose()
                }
            }, {
                key: "updateOverlay",
                value: function (e) {
                    this._overlay && this._overlay.setOption(e)
                }
            }, {
                key: "getMap",
                value: function () {
                    return this._viewer
                }
            }, {
                key: "getOverlay",
                value: function () {
                    return this._overlay
                }
            }, {
                key: "show",
                value: function () {
                    this._echartsContainer && (this._echartsContainer.style.visibility = "visible")
                }
            }, {
                key: "hide",
                value: function () {
                    this._echartsContainer && (this._echartsContainer.style.visibility = "hidden")
                }
            }]), e
        }()
    }, function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_163__
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.MapVLayer = void 0;
        var n = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            o = i(0),
            a = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(o),
            s = i(165),
            l = 0;
        t.MapVLayer = function () {
            function e(t, i, n, o) {
                r(this, e), this.map = t, this.scene = t.scene, this.mapvBaseLayer = new s.MapVRenderer(t, i, n, this), this.mapVOptions = n, this.initDevicePixelRatio(), this.canvas = this._createCanvas(), this.render = this.render.bind(this), void 0 != o ? (this.container = o, o.appendChild(this.canvas)) : (this.container = t.container, this.addInnerContainer()), this.bindEvent(), this._reset()
            }
            return n(e, [{
                key: "initDevicePixelRatio",
                value: function () {
                    this.devicePixelRatio = window.devicePixelRatio || 1
                }
            }, {
                key: "addInnerContainer",
                value: function () {
                    this.container.appendChild(this.canvas)
                }
            }, {
                key: "bindEvent",
                value: function () {
                    var e = this;
                    this.innerMoveStart = this.moveStartEvent.bind(this), this.innerMoveEnd = this.moveEndEvent.bind(this), this.scene.camera.moveStart.addEventListener(this.innerMoveStart, this), this.scene.camera.moveEnd.addEventListener(this.innerMoveEnd, this);
                    var t = new a.ScreenSpaceEventHandler(this.canvas);
                    t.setInputAction(function (t) {
                        e.innerMoveEnd()
                    }, a.ScreenSpaceEventType.LEFT_UP), t.setInputAction(function (t) {
                        e.innerMoveEnd()
                    }, a.ScreenSpaceEventType.MIDDLE_UP), this.handler = t
                }
            }, {
                key: "unbindEvent",
                value: function () {
                    this.scene.camera.moveStart.removeEventListener(this.innerMoveStart, this), this.scene.camera.moveEnd.removeEventListener(this.innerMoveEnd, this), this.scene.postRender.removeEventListener(this._reset, this), this.handler && (this.handler.destroy(), this.handler = null)
                }
            }, {
                key: "moveStartEvent",
                value: function () {
                    this.mapvBaseLayer && this.mapvBaseLayer.animatorMovestartEvent(), this.scene.postRender.addEventListener(this._reset, this), console.log("mapv moveStartEvent")
                }
            }, {
                key: "moveEndEvent",
                value: function () {
                    this.scene.postRender.removeEventListener(this._reset, this), this.mapvBaseLayer && this.mapvBaseLayer.animatorMoveendEvent(), this._reset(), console.log("mapv moveEndEvent")
                }
            }, {
                key: "zoomStartEvent",
                value: function () {
                    this._unvisiable()
                }
            }, {
                key: "zoomEndEvent",
                value: function () {
                    this._unvisiable()
                }
            }, {
                key: "addData",
                value: function (e, t) {
                    void 0 != this.mapvBaseLayer && this.mapvBaseLayer.addData(e, t)
                }
            }, {
                key: "updateData",
                value: function (e, t) {
                    void 0 != this.mapvBaseLayer && this.mapvBaseLayer.updateData(e, t)
                }
            }, {
                key: "getData",
                value: function () {
                    return this.mapvBaseLayer && (this.dataSet = this.mapvBaseLayer.getData()), this.dataSet
                }
            }, {
                key: "removeData",
                value: function (e) {
                    void 0 != this.mapvBaseLayer && this.mapvBaseLayer && this.mapvBaseLayer.removeData(e)
                }
            }, {
                key: "removeAllData",
                value: function () {
                    void 0 != this.mapvBaseLayer && this.mapvBaseLayer.clearData()
                }
            }, {
                key: "_visiable",
                value: function () {
                    return this.canvas.style.display = "block"
                }
            }, {
                key: "_unvisiable",
                value: function () {
                    return this.canvas.style.display = "none"
                }
            }, {
                key: "_createCanvas",
                value: function () {
                    var e = document.createElement("canvas");
                    e.id = this.mapVOptions.layerid || "mapv" + l++, e.style.position = "absolute", e.style.top = "0px", e.style.left = "0px", e.style.pointerEvents = "none", e.style.zIndex = this.mapVOptions.zIndex || 100, e.width = parseInt(this.map.canvas.width), e.height = parseInt(this.map.canvas.height), e.style.width = this.map.canvas.style.width, e.style.height = this.map.canvas.style.height;
                    var t = this.devicePixelRatio;
                    return "2d" == this.mapVOptions.context && e.getContext(this.mapVOptions.context).scale(t, t), e
                }
            }, {
                key: "_reset",
                value: function () {
                    this.resizeCanvas(), this.fixPosition(), this.onResize(), this.render()
                }
            }, {
                key: "draw",
                value: function () {
                    this._reset()
                }
            }, {
                key: "show",
                value: function () {
                    this._visiable()
                }
            }, {
                key: "hide",
                value: function () {
                    this._unvisiable()
                }
            }, {
                key: "destroy",
                value: function () {
                    this.unbindEvent(), this.remove()
                }
            }, {
                key: "remove",
                value: function () {
                    void 0 != this.mapvBaseLayer && (this.removeAllData(), this.mapvBaseLayer.destroy(), this.mapvBaseLayer = void 0, this.canvas.parentElement.removeChild(this.canvas))
                }
            }, {
                key: "update",
                value: function (e) {
                    void 0 != e && this.updateData(e.data, e.options)
                }
            }, {
                key: "resizeCanvas",
                value: function () {
                    if (void 0 != this.canvas && null != this.canvas) {
                        var e = this.canvas;
                        e.style.position = "absolute", e.style.top = "0px", e.style.left = "0px", e.width = parseInt(this.map.canvas.width), e.height = parseInt(this.map.canvas.height), e.style.width = this.map.canvas.style.width, e.style.height = this.map.canvas.style.height
                    }
                }
            }, {
                key: "fixPosition",
                value: function () {}
            }, {
                key: "onResize",
                value: function () {}
            }, {
                key: "render",
                value: function () {
                    void 0 != this.mapvBaseLayer && this.mapvBaseLayer._canvasUpdate()
                }
            }]), e
        }()
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function n(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.MapVRenderer = void 0;
        var a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            s = function e(t, i, r) {
                null === t && (t = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(t, i);
                if (void 0 === n) {
                    var o = Object.getPrototypeOf(t);
                    return null === o ? void 0 : e(o, i, r)
                }
                if ("value" in n) return n.value;
                var a = n.get;
                if (void 0 !== a) return a.call(r)
            },
            l = i(0),
            u = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(l),
            c = i(166),
            h = c ? c.baiduMapLayer : null,
            d = h ? h.__proto__ : Function,
            f = u.Math.toRadians(80);
        t.MapVRenderer = function (e) {
            function t(e, i, o, a) {
                r(this, t);
                var s = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, i, o));
                return d ? (s.map = e, s.scene = e.scene, s.dataSet = i, o = o || {}, s.init(o), s.argCheck(o), s.initDevicePixelRatio(), s.canvasLayer = a, s.stopAniamation = !1, s.animation = o.animation, s.clickEvent = s.clickEvent.bind(s), s.mousemoveEvent = s.mousemoveEvent.bind(s), s.bindEvent(), s) : n(s)
            }
            return o(t, e), a(t, [{
                key: "initDevicePixelRatio",
                value: function () {
                    this.devicePixelRatio = window.devicePixelRatio || 1
                }
            }, {
                key: "clickEvent",
                value: function (e) {
                    var i = e.point;
                    s(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "clickEvent", this).call(this, i, e)
                }
            }, {
                key: "mousemoveEvent",
                value: function (e) {
                    var i = e.point;
                    s(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "mousemoveEvent", this).call(this, i, e)
                }
            }, {
                key: "addAnimatorEvent",
                value: function () {}
            }, {
                key: "animatorMovestartEvent",
                value: function () {
                    var e = this.options.animation;
                    this.isEnabledTime() && this.animator && (this.steps.step = e.stepsRange.start)
                }
            }, {
                key: "animatorMoveendEvent",
                value: function () {
                    this.isEnabledTime() && this.animator
                }
            }, {
                key: "bindEvent",
                value: function () {
                    this.map, this.options.methods && (this.options.methods.click, this.options.methods.mousemove)
                }
            }, {
                key: "unbindEvent",
                value: function () {
                    var e = this.map;
                    this.options.methods && (this.options.methods.click && e.off("click", this.clickEvent), this.options.methods.mousemove && e.off("mousemove", this.mousemoveEvent))
                }
            }, {
                key: "getContext",
                value: function () {
                    return this.canvasLayer.canvas.getContext(this.context)
                }
            }, {
                key: "init",
                value: function (e) {
                    this.options = e, this.initDataRange(e), this.context = this.options.context || "2d", this.options.zIndex && this.canvasLayer && this.canvasLayer.setZIndex && this.canvasLayer.setZIndex(this.options.zIndex), this.initAnimator()
                }
            }, {
                key: "_canvasUpdate",
                value: function (e) {
                    this.map;
                    var t = this.scene;
                    if (this.canvasLayer && !this.stopAniamation) {
                        var i = this.options.animation,
                            r = this.getContext();
                        if (this.isEnabledTime()) {
                            if (void 0 === e) return void this.clear(r);
                            "2d" === this.context && (r.save(), r.globalCompositeOperation = "destination-out", r.fillStyle = "rgba(0, 0, 0, .1)", r.fillRect(0, 0, r.canvas.width, r.canvas.height), r.restore())
                        } else this.clear(r);
                        if ("2d" === this.context)
                            for (var n in this.options) r[n] = this.options[n];
                        else r.clear(r.COLOR_BUFFER_BIT);
                        var o = {
                            transferCoordinate: function (e) {
                                var i = [99999, 99999],
                                    r = u.Cartesian3.fromDegrees(e[0], e[1]);
                                if (!r) return i;
                                var n = t.cartesianToCanvasCoordinates(r);
                                if (!n) return i;
                                if (t.mode === u.SceneMode.SCENE3D) {
                                    if (u.Cartesian3.angleBetween(t.camera.position, r) > f) return !1
                                }
                                return [n.x, n.y]
                            }
                        };
                        void 0 !== e && (o.filter = function (t) {
                            var r = i.trails || 10;
                            return !!(e && t.time > e - r && t.time < e)
                        });
                        var a = this.dataSet.get(o);
                        this.processData(a), "m" == this.options.unit && this.options.size, this.options._size = this.options.size;
                        var s = u.SceneTransforms.wgs84ToWindowCoordinates(t, u.Cartesian3.fromDegrees(0, 0));
                        this.drawContext(r, new c.DataSet(a), this.options, s), this.options.updateCallback && this.options.updateCallback(e)
                    }
                }
            }, {
                key: "updateData",
                value: function (e, i) {
                    var r = e;
                    r && r.get && (r = r.get()), void 0 != r && this.dataSet.set(r), s(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "update", this).call(this, {
                        options: i
                    })
                }
            }, {
                key: "addData",
                value: function (e, t) {
                    var i = e;
                    e && e.get && (i = e.get()), this.dataSet.add(i), this.update({
                        options: t
                    })
                }
            }, {
                key: "getData",
                value: function () {
                    return this.dataSet
                }
            }, {
                key: "removeData",
                value: function (e) {
                    if (this.dataSet) {
                        var t = this.dataSet.get({
                            filter: function (t) {
                                return null == e || "function" != typeof e || !e(t)
                            }
                        });
                        this.dataSet.set(t), this.update({
                            options: null
                        })
                    }
                }
            }, {
                key: "clearData",
                value: function () {
                    this.dataSet && this.dataSet.clear(), this.update({
                        options: null
                    })
                }
            }, {
                key: "draw",
                value: function () {
                    this.canvasLayer.draw()
                }
            }, {
                key: "clear",
                value: function (e) {
                    e && e.clearRect && e.clearRect(0, 0, e.canvas.width, e.canvas.height)
                }
            }, {
                key: "destroy",
                value: function () {
                    this.unbindEvent(), this.clear(this.getContext()), this.clearData(), this.animator && this.animator.stop(), this.animator = null, this.canvasLayer = null
                }
            }]), t
        }(d)
    }, function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_166__
    }, function (e, t, i) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function n(e, t, i) {
            var r = e.scene,
                n = r.camera;
            if (r.mode != s.SceneMode.MORPHING && (s.defined(i) || (i = new s.Cartesian3), s.defined(e.trackedEntity) ? i = e.trackedEntity.position.getValue(e.clock.currentTime, i) : (u.origin = n.positionWC, u.direction = n.directionWC, i = r.globe.pick(u, r, i)), s.defined(i))) return r.mode == s.SceneMode.SCENE2D || r.mode == s.SceneMode.COLUMBUS_VIEW ? (i = n.worldToCameraCoordinatesPoint(i, i), t && (i = r.globe.ellipsoid.cartographicToCartesian(r.mapProjection.unproject(i, l), i))) : t || (i = n.worldToCameraCoordinatesPoint(i, i)), i
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.ZoomNavigation = void 0;
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var r = t[i];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function (t, i, r) {
                    return i && e(t.prototype, i), r && e(t, r), t
                }
            }(),
            a = i(0),
            s = function (e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t.default = e, t
            }(a),
            l = new s.Cartographic,
            u = new s.Ray,
            c = new s.Cartesian3;
        t.ZoomNavigation = function () {
            function e(t, i) {
                r(this, e), this.viewer = t, this.relativeAmount = 2, i && (this.relativeAmount = 1 / this.relativeAmount)
            }
            return o(e, [{
                key: "activate",
                value: function () {
                    this.zoom(this.relativeAmount)
                }
            }, {
                key: "zoom",
                value: function (e) {
                    if (this.isActive = !0, s.defined(this.viewer)) {
                        var t = this.viewer.scene,
                            i = t.screenSpaceCameraController;
                        if (!i.enableInputs || !i.enableZoom) return;
                        var r, o = t.camera;
                        switch (t.mode) {
                            case s.SceneMode.MORPHING:
                                break;
                            case s.SceneMode.SCENE2D:
                                o.zoomIn(o.positionCartographic.height * (1 - this.relativeAmount));
                                break;
                            default:
                                var a;
                                if (a = s.defined(this.viewer.trackedEntity) ? new s.Cartesian3 : n(this.viewer, !1), s.defined(a)) r = {
                                    direction: o.direction,
                                    up: o.up
                                };
                                else {
                                    var l = new s.Ray(o.worldToCameraCoordinatesPoint(t.globe.ellipsoid.cartographicToCartesian(o.positionCartographic)), o.directionWC);
                                    a = s.IntersectionTests.grazingAltitudeLocation(l, t.globe.ellipsoid), r = {
                                        heading: o.heading,
                                        pitch: o.pitch,
                                        roll: o.roll
                                    }
                                }
                                var u = s.Cartesian3.subtract(o.position, a, c),
                                    h = s.Cartesian3.multiplyByScalar(u, e, u),
                                    d = s.Cartesian3.add(a, h, a);
                                s.defined(this.viewer.trackedEntity) || t.mode == s.SceneMode.COLUMBUS_VIEW ? o.position = d : o.flyTo({
                                    destination: d,
                                    orientation: r,
                                    duration: .5,
                                    convert: !1
                                })
                        }
                    }
                    this.isActive = !1
                }
            }]), e
        }()
    }])
});