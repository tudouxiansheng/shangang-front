<template>
  <div class="searchResult">
    <div class="titleTop">
      <span class="title">检索结果</span>
      <img class="closeImg" src="../../../../../assets/vehicleApp/close.png" alt="" @click="close" />
    </div>
    <div class="tools">
      <div class="checkTool">
        <el-checkbox v-model="checkedAll" @change="isCheckedAll">全选</el-checkbox>
      </div>
      <div class="otherTools">
        <div @click="personTrack()">
          <img src="../../../../../assets/faceSearch/track.png" alt="" style="margin-right: 5px" />
          <span>生成轨迹</span>
        </div>
        <img @click="toExpansion" src="../../../../../assets/faceSearch/expansion.png" alt="" style="cursor: pointer" />
      </div>
    </div>
    <div class="dynamicTail">
      <ul>
        <li v-for="(item, index) in result" :key="index">
          <div class="captureImg">
            <img :src="item.detectUrl" alt="" />
          </div>
          <div class="captureInfo">
            <div class="detail">
              <p class="similar">相似度：{{ item.confidence ? item.confidence : 0 }}%</p>
              <p>设备名称: {{ item.cameraName }}</p>
              <p>发生时间: {{ item.captureTime }}</p>
              <p>发生位置: {{ item.snapLocation }}</p>
            </div>
            <div class="captureTool">
              <div class="checkedTool">
                <el-checkbox v-model="item.checked" @change="SingleCheck(item, index)"></el-checkbox>
              </div>
              <div @click="toSearchDetail(item)" style="cursor: pointer">
                <span class="toDetail">详情</span><img src="../../../../../assets/faceSearch/toDetail.png" alt="" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- <div v-if="ks==1">
      <button @click="toSearchDetai">开始</button>
    </div> -->
  </div>
</template>

<script>
// import moveMarker from '@/utils/moveMarker'
// import setLatLngs from '@/utils/bm.geometryutil'
import { AllcamMap } from '@/utils/map/AllcamMap.js'
import { faceTrack } from '@/utils/api.js'
import maps from '@/utils/secondMapConfig'
let BM
let map
export default {
  // props: ["pictureSearchResult"],
  data() {
    return {
      marker: [],
      index: '',
      selectAll: false,
      sum: 0,
      searchInfo2: sessionStorage.getItem('searchInfo3'),
      faceTracks: '',
      track: '',
      polyline2: [],
      polyline: '',
      m: '',
      cn: '',
      passed: '',
      passed2: '',
      ks: 0,
      track6: '',
      // 是否全选
      checkedAll: false,
      result: [],
      faceOrBody: 1, //1表示是从以图搜人到展开，2表示人体提交检索
    }
  },
  watch: {
    '$store.state.showSearchResult'(newval, olval) {
      console.log('newval', newval)

      if (this.$store.state.SearchResultArray) {
        this.result = this.$store.state.SearchResultArray
      }
      // if(this.$store.state.pictureSearchResult){
      //   this.result = this.$store.state.pictureSearchResult;
      // }

      console.log('this.result', this.result)
    },
  },
  created() {
    console.log('searchResult')
    this.initMap()
  },

  methods: {
    initMap() {
      maps.then(() => {
        BM = window.BM
        // BM.Config.HTTP_URL = 'http://' + this.mapIp + ':3000' //http://124.71.174.84:3000

        window.map = map
        BM.Marker.addInitHook(function () {
          this.moveOptions = {
            origin: null,
            timer: null,
            done: 0,
            path: null,
            length: 0,
          }
          this.setSpeed = function (speed) {
            console.log(11111111)
            this.moveOptions.speed = isNaN(parseFloat(speed)) || parseFloat(speed) <= 0 ? 200 : parseFloat(speed)
          }
          this.getSpeed = function () {
            console.log(22222222)
            return this.moveOptions.speed
          }
          this.moveAlong = function (path, speed) {
            console.log(33333333)
            path = path instanceof BM.Polyline ? path : new BM.Polyline(path)
            this.moveOptions.path = path
            this.moveOptions.length = BM.GeometryUtil.length(path)
            this.moveOptions.speed = isNaN(parseFloat(speed)) || parseFloat(speed <= 0) ? 200 : parseFloat(speed)

            this._move()
          }
          this.pauseMove = function () {
            console.log(444444444)
            clearInterval(this.moveOptions.timer)
            this.moveOptions.timer = null
          }
          this.resumeMove = function () {
            this._move()
          }
          this.stopMove = function () {
            this.pauseMove()
            this.moveOptions.done = 0
          }
          this._move = function () {
            console.log(555555, 'this.moveOptions', this.moveOptions.timer)
            if (this.moveOptions.timer) return
            let _t = this
            this.moveOptions.timer = setInterval(function () {
              let done = _t.moveOptions.done
              done += (_t.moveOptions.speed / 1000) * 20
              let radio = done / _t.moveOptions.length
              radio >= 1 ? ((radio = 0), (done = 0)) : true
              _t.moveOptions.done = done
              let p = BM.GeometryUtil.interpolateOnLine(_t._map, _t.moveOptions.path, radio)
              _t.setLatLng(p.latLng)
              let pre_p = _t.moveOptions.path.getLatLngs()[p.predecessor]
              if (pre_p) {
                let passed = _t.moveOptions.path.getLatLngs().slice(0, p.predecessor + 1)
                passed.push(p.latLng)
                _t.fire('update_position', {
                  path: passed,
                })
                let deg = BM.GeometryUtil.computeAngle(_t._map.project(pre_p), _t._map.project(p.latLng))
                _t._icon.style.transformOrigin = '50% 50%'
                _t._icon.style.transform += ' rotateZ(' + deg + 'deg)'
              }
            }, 20)
          }
          //
        })
        this.zdy(window.BM)
      })
    },
    destroyed() {
      // console.log('22222222222222222222');

      this.polyline.remove(this.map)
      this.track.remove(this.map)
      this.track.pauseMove()
      for (let i = 0; i < this.marker.length; i++) {
        this.marker[i].remove()
      }
    },
    // 关闭对话框
    close() {
      this.$store.commit('closeResult', true)
      this.polyline.remove(this.map)
      this.track.remove(this.map)
      this.track.pauseMove()
      for (let i = 0; i < this.marker.length; i++) {
        this.marker[i].remove()
      }
    },
    //以图搜人展开结果
    getPictureSearchResult() {
      this.result = this.$store.state.pictureSearchResult
    },
    // 全选按钮发生改变时
    isCheckedAll() {
      this.selectAll = !this.selectAll
      this.result.forEach((e) => {
        e.checked = this.selectAll
      })
    },
    SingleCheck(item, index) {
      this.index = index

      item.checked = !item.checked
      var checkedALL = this.result.every((e) => {
        return e.checked === true
      })
      this.selectAll = checkedALL
      if (!this.result[index].checked) {
        for (var i = 0; i < this.result.length; i++) {
          if (this.index == i) {
            this.faceTracks = this.result[i]
            console.log(this.faceTracks.captureUrl)
          }
        }

        this.$set(this.result, index, Object.assign(this.result[index], { checked: true }))
      } else {
        for (var i = 0; i < this.result.length; i++) {
          if (this.index == i) {
            this.faceTracks = this.result[i]
            console.log(this.faceTracks.captureUrl)
          }
        }
        this.$set(this.result, index, Object.assign(this.result[index], { checked: false }))
      }
    },

    objToArry(dataList) {
      let aaa = dataList.map((item) => {
        return [item.latitude, item.longitude]
      })
      return aaa
    },

    // 生成轨迹
    async personTrack() {
      if (sessionStorage.getItem('mapState') == 0) {
        if (this.$store.state.personId) {
          if (AllcamMap.map) {
            AllcamMap.map.removeTrack(this.$store.state.personId)
          }
        }
        let trackListInfo = [
          // {
          //   trackInfo: {
          //     hitTime: "2021-07-20 14:35:11",
          //     captureSmallImage:
          //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term20210717154951101UoTLk4xGGKI.jpeg?encrypt=1cTjddXsA00URIhXo9l5hw&expires=1627370457",
          //     site: "东门",
          //   },
          //   position: [120.7623831759058, 31.30366027501094, 5],
          // },
          // {
          //   trackInfo: {
          //     hitTime: "2021-07-20 13:41:22",
          //     captureSmallImage:
          //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000018/term2021071715303681458IDE2CzXiO.jpeg?encrypt=-XniUlXz43dBfQPrPVh_lg&expires=1627370996",
          //     site: "A1东",
          //   },
          //   position: [120.76279765947136, 31.303684782772738, 5],
          // },
          // {
          //   trackInfo: {
          //     hitTime: "2021-07-20 13:42:22",
          //     captureSmallImage:
          //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term202107171550367292AAI6ghLkjv.jpeg?encrypt=__42Hwt54_vVXtoLr57tGw&expires=1627370457",
          //     site: "A1东小路",
          //   },
          //   position: [120.763277249736, 31.303751939685476, 5],
          // },
          // {
          //   trackInfo: {
          //     hitTime: "2021-07-20 14:48:11",
          //     captureSmallImage:
          //       "http://121.37.187.55:10000/file/term/20210717/00000021071714010301000000000016/term202107171550367292AAI6ghLkjv.jpeg?encrypt=__42Hwt54_vVXtoLr57tGw&expires=1627370457",
          //     site: "A1东楼前",
          //   },
          //   position: [120.76321916254604, 31.303593925524474, 5],
          // },
        ]
        let trackList = [
          //  [120.7623831759058, 31.30366027501094, 5],
          //  [120.76279765947136, 31.303684782772738, 5],
          // [120.763277249736, 31.303751939685476, 5],
          // [120.76321916254604, 31.303593925524474, 5]
        ]
        let searchInfo2 = sessionStorage.getItem('searchInfo3')
        this.searchInfo2 = JSON.parse(searchInfo2)
        let data = {
          captureUrl: this.faceTracks.captureUrl,
          beginTime: this.searchInfo2.beginTime,
          endTime: this.searchInfo2.endTime,
        }
        faceTrack(data).then((res) => {
          if (res.resultCode == 0) {
            console.log(res, 'res')
            if (res.faceTrackInfos) {
              for (let i = 0; i < res.faceTrackInfos.length; i++) {
                trackList.push([res.faceTrackInfos[i].longitude, res.faceTrackInfos[i].latitude, 5])
                trackListInfo.push({
                  trackInfo: res.faceTrackInfos[i],
                  position: [res.faceTrackInfos[i].longitude, res.faceTrackInfos[i].latitude, 5],
                })
              }
              if (AllcamMap.map) {
                AllcamMap.map.showPersonTrack(res.personId, trackList, trackListInfo)
                this.$store.commit('personId', res.personId)
                this.$store.commit('closeExpan', true)
                this.$success('轨迹生成成功')
              }
            } else {
              this.$message.warning('该数据暂无轨迹')
            }
          }
        })
      } else {
        this.polyline2 = []
        this.sum = 0
        for (let i = 0; i < this.result.length; i++) {
          if (this.result[i].checked == true) {
            this.sum++
          }
        }
        console.log('123', this.track)
        if (this.track != '' && this.track != undefined) {
          this.polyline.remove(this.map)
          this.track.remove(this.map)
          this.track.pauseMove()
        }
        if (this.sum == 1) {
          console.log('dateValue', sessionStorage.getItem('searchInfo3'))
          let searchInfo2 = sessionStorage.getItem('searchInfo3')
          this.searchInfo2 = JSON.parse(searchInfo2)
          console.log('this.searchInfo2', this.searchInfo2)
          let data = {
            captureUrl: this.faceTracks.captureUrl,
            beginTime: this.searchInfo2.beginTime,
            endTime: this.searchInfo2.endTime,
          }
          console.log('data', data)
          faceTrack(data).then((res) => {
            if (res.resultCode == 0) {
              if (res.faceTrackInfos != undefined) {
                if (res.faceTrackInfos.length == 1) {
                  this.marker.push(
                    BM.marker([res.faceTrackInfos[0].latitude, res.faceTrackInfos[0].longitude], {
                      icon: BM.icon({
                        iconUrl: require('@/assets/行人.png'),
                        iconSize: [60, 60],
                      }),
                    }).addTo(window.map)
                  )
                }
                this.faceTrackInfos = res.faceTrackInfos
                this.polyline2 = this.objToArry(this.faceTrackInfos)
                console.log('data', this.polyline2)
              } else {
                this.$message.warning('该数据暂无轨迹')
              }
              console.log('res', res)
            }

            if (this.polyline2) {
              this.polyline = BM.polyline(this.polyline2).addTo(map)
              map.fitBounds(this.polyline.getBounds())
              this.track = BM.marker([30, 104], {
                icon: BM.icon({
                  iconUrl: require('@/assets/行人.png'),
                  iconAnchor: [25, 15],
                }),
              }).addTo(map)

              console.log(777777)
              sessionStorage.setItem('track', this.track)
              sessionStorage.setItem('marker', this.marker)
              this.toSearchDetai()
            }
          })
        } else {
          this.$message.warning('只能勾选一条数据生成轨迹')
        }
      }
    },
    toSearchDetai() {
      console.log('this.polyline', this.polyline)
      console.log('this.track', this.track)

      console.log(88888)
      this.track.moveAlong(this.polyline, 10, {
        replay: false,
      })
    },

    handleSelectionChange() {},
    // 跳转至检索详情
    toSearchDetail(item) {
      this.$store.commit('pictureSearchDetail', item)
    },
    // 跳转至展开
    toExpansion() {
      console.log('this.$store.state.pTab', this.$store.state.pTab)
      if (this.$store.state.pTab == 1) {
        this.$store.commit('exPictureToExpan', 1)
      } else if (this.$store.state.pTab == 3) {
        this.$store.commit('exPictureToExpan', 3)
      } else if (this.$store.state.pTab == 2) {
        this.$store.commit('exPictureToExpan', 2)
      }
    },
    zdy(BM) {
      'use strict'

      BM.Polyline._flat =
        BM.LineUtil.isFlat ||
        BM.Polyline._flat ||
        function (latlngs) {
          // true if it's a flat array of latlngs; false if nested
          return (
            !BM.Util.isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined')
          )
        }

      /**
       * @fileOverview  Geometry utilities for distances and linear referencing.
       * @name BM.GeometryUtil
       */

      BM.GeometryUtil = BM.extend(BM.GeometryUtil || {}, {
        /**
             Shortcut function for planar distance between two {BM.LatLng} at current zoom.

             @tutorial distance-length

             @param {BM.Map} map  map to be used for this method
             @param {BM.LatLng} latlngA geographical point A
             @param {BM.LatLng} latlngB geographical point B
             @returns {Number} planar distance
             */
        distance: function (map, latlngA, latlngB) {
          return map.latLngToLayerPoint(latlngA).distanceTo(map.latLngToLayerPoint(latlngB))
        },

        /**
             Shortcut function for planar distance between a {BM.LatLng} and a segment (A-B).
             @param {BM.Map} map  map to be used for this method
             @param {BM.LatLng} latlng - The position to search
             @param {BM.LatLng} latlngA geographical point A of the segment
             @param {BM.LatLng} latlngB geographical point B of the segment
             @returns {Number} planar distance
             */
        distanceSegment: function (map, latlng, latlngA, latlngB) {
          var p = map.latLngToLayerPoint(latlng),
            p1 = map.latLngToLayerPoint(latlngA),
            p2 = map.latLngToLayerPoint(latlngB)
          return BM.LineUtil.pointToSegmentDistance(p, p1, p2)
        },

        /**
             Shortcut function for converting distance to readable distance.
             @param {Number} distance distance to be converted
             @param {String} unit 'metric' or 'imperial'
             @returns {String} in yard or miles
             */
        readableDistance: function (distance, unit) {
          var isMetric = unit !== 'imperial',
            distanceStr
          if (isMetric) {
            // show metres when distance is < 1km, then show km
            if (distance > 1000) {
              distanceStr = (distance / 1000).toFixed(2) + ' km'
            } else {
              distanceStr = Math.ceil(distance) + ' m'
            }
          } else {
            distance *= 1.09361
            if (distance > 1760) {
              distanceStr = (distance / 1760).toFixed(2) + ' miles'
            } else {
              distanceStr = Math.ceil(distance) + ' yd'
            }
          }
          return distanceStr
        },

        /**
             Returns true if the latlng belongs to segment A-B
             @param {BM.LatLng} latlng - The position to search
             @param {BM.LatLng} latlngA geographical point A of the segment
             @param {BM.LatLng} latlngB geographical point B of the segment
             @param {?Number} [tolerance=0.2] tolerance to accept if latlng belongs really
             @returns {boolean}
             */
        belongsSegment: function (latlng, latlngA, latlngB, tolerance) {
          tolerance = tolerance === undefined ? 0.2 : tolerance
          var hypotenuse = latlngA.distanceTo(latlngB),
            delta = latlngA.distanceTo(latlng) + latlng.distanceTo(latlngB) - hypotenuse
          return delta / hypotenuse < tolerance
        },

        /**
         * Returns total length of line
         * @tutorial distance-length
         *
         * @param {BM.Polyline|Array<BM.Point>|Array<BM.LatLng>} coords Set of coordinates
         * @returns {Number} Total length (pixels for Point, meters for LatLng)
         */
        length: function (coords) {
          var accumulated = BM.GeometryUtil.accumulatedLengths(coords)
          console.log(99999)
          console.log('accumulated11111', accumulated)
          return accumulated.length > 0 ? accumulated[accumulated.length - 1] : 0
        },

        /**
         * Returns a list of accumulated length along a line.
         * @param {BM.Polyline|Array<BM.Point>|Array<BM.LatLng>} coords Set of coordinates
         * @returns {Array<Number>} Array of accumulated lengths (pixels for Point, meters for LatLng)
         */
        accumulatedLengths: function (coords) {
          if (typeof coords.getLatLngs == 'function') {
            coords = coords.getLatLngs()
          }
          if (coords.length === 0) return []
          var total = 0,
            lengths = [0]
          for (var i = 0, n = coords.length - 1; i < n; i++) {
            total += coords[i].distanceTo(coords[i + 1])
            lengths.push(total)
          }
          return lengths
        },
        /**
             Returns the closest point of a {BM.LatLng} on the segment (A-B)

             @tutorial closest

             @param {BM.Map} map  map to be used for this method
             @param {BM.LatLng} latlng - The position to search
             @param {BM.LatLng} latlngA geographical point A of the segment
             @param {BM.LatLng} latlngB geographical point B of the segment
             @returns {BM.LatLng} Closest geographical point
             */
        closestOnSegment: function (map, latlng, latlngA, latlngB) {
          var maxzoom = map.getMaxZoom()
          if (maxzoom === Infinity) maxzoom = map.getZoom()
          var p = map.project(latlng, maxzoom),
            p1 = map.project(latlngA, maxzoom),
            p2 = map.project(latlngB, maxzoom),
            closest = BM.LineUtil.closestPointOnSegment(p, p1, p2)
          return map.unproject(closest, maxzoom)
        },

        /**
             Returns the closest latlng on layer.

             Accept nested arrays

             @tutorial closest

             @param {BM.Map} map  map to be used for this method
             @param {Array<BM.LatLng>|Array<Array<BM.LatLng>>|BM.PolyLine|BM.Polygon} layer - Layer that contains the result
             @param {BM.LatLng} latlng - The position to search
             @param {?boolean} [vertices=false] - Whether to restrict to path vertices.
             @returns {BM.LatLng} Closest geographical point or null if layer param is incorrect
             */
        closest: function (map, layer, latlng, vertices) {
          var latlngs,
            mindist = Infinity,
            result = null,
            i,
            n,
            distance,
            subResult

          if (layer instanceof Array) {
            // if layer is Array<Array<T>>
            if (layer[0] instanceof Array && typeof layer[0][0] !== 'number') {
              // if we have nested arrays, we calc the closest for each array
              // recursive
              for (i = 0; i < layer.length; i++) {
                subResult = BM.GeometryUtil.closest(map, layer[i], latlng, vertices)
                if (subResult.distance < mindist) {
                  mindist = subResult.distance
                  result = subResult
                }
              }
              return result
            } else if (
              layer[0] instanceof BM.LatLng ||
              typeof layer[0][0] === 'number' ||
              typeof layer[0].lat === 'number'
            ) {
              // we could have a latlng as [x,y] with x & y numbers or {lat, lng}
              layer = BM.polyline(layer)
            } else {
              return result
            }
          }

          // if we don't have here a Polyline, that means layer is incorrect
          // see https://github.com/makinacorpus/.GeometryUtil/issues/23
          if (!(layer instanceof BM.Polyline)) return result

          // deep copy of latlngs
          latlngs = JSON.parse(JSON.stringify(layer.getLatLngs().slice(0)))

          // add the last segment for BM.Polygon
          if (layer instanceof BM.Polygon) {
            // add the last segment for each child that is a nested array
            var addLastSegment = function (latlngs) {
              if (BM.Polyline._flat(latlngs)) {
                latlngs.push(latlngs[0])
              } else {
                for (var i = 0; i < latlngs.length; i++) {
                  addLastSegment(latlngs[i])
                }
              }
            }
            addLastSegment(latlngs)
          }

          // we have a multi polygon / multi polyline / polygon with holes
          // use recursive to explore and return the good result
          if (!BM.Polyline._flat(latlngs)) {
            for (i = 0; i < latlngs.length; i++) {
              // if we are at the lower level, and if we have a BM.Polygon, we add the last segment
              subResult = BM.GeometryUtil.closest(map, latlngs[i], latlng, vertices)
              if (subResult.distance < mindist) {
                mindist = subResult.distance
                result = subResult
              }
            }
            return result
          } else {
            // Lookup vertices
            if (vertices) {
              for (i = 0, n = latlngs.length; i < n; i++) {
                var ll = latlngs[i]
                distance = BM.GeometryUtil.distance(map, latlng, ll)
                if (distance < mindist) {
                  mindist = distance
                  result = ll
                  result.distance = distance
                }
              }
              return result
            }

            // Keep the closest point of all segments
            for (i = 0, n = latlngs.length; i < n - 1; i++) {
              var latlngA = latlngs[i],
                latlngB = latlngs[i + 1]
              distance = BM.GeometryUtil.distanceSegment(map, latlng, latlngA, latlngB)
              if (distance <= mindist) {
                mindist = distance
                result = BM.GeometryUtil.closestOnSegment(map, latlng, latlngA, latlngB)
                result.distance = distance
              }
            }
            return result
          }
        },

        /**
             Returns the closest layer to latlng among a list of layers.

             @tutorial closest

             @param {BM.Map} map  map to be used for this method
             @param {Array<BM.ILayer>} layers Set of layers
             @param {BM.LatLng} latlng - The position to search
             @returns {object} ``{layer, latlng, distance}`` or ``null`` if list is empty;
             */
        closestLayer: function (map, layers, latlng) {
          var mindist = Infinity,
            result = null,
            ll = null,
            distance = Infinity

          for (var i = 0, n = layers.length; i < n; i++) {
            var layer = layers[i]
            if (layer instanceof BM.LayerGroup) {
              // recursive
              var subResult = BM.GeometryUtil.closestLayer(map, layer.getLayers(), latlng)
              if (subResult.distance < mindist) {
                mindist = subResult.distance
                result = subResult
              }
            } else {
              // Single dimension, snap on points, else snap on closest
              if (typeof layer.getLatLng == 'function') {
                ll = layer.getLatLng()
                distance = BM.GeometryUtil.distance(map, latlng, ll)
              } else {
                ll = BM.GeometryUtil.closest(map, layer, latlng)
                if (ll) distance = ll.distance // Can return null if layer has no points.
              }
              if (distance < mindist) {
                mindist = distance
                result = {
                  layer: layer,
                  latlng: ll,
                  distance: distance,
                }
              }
            }
          }
          return result
        },

        /**
             Returns the n closest layers to latlng among a list of input layers.

             @param {BM.Map} map -  map to be used for this method
             @param {Array<BM.ILayer>} layers - Set of layers
             @param {BM.LatLng} latlng - The position to search
             @param {?Number} [n=layers.length] - the expected number of output layers.
             @returns {Array<object>} an array of objects ``{layer, latlng, distance}`` or ``null`` if the input is invalid (empty list or negative n)
             */
        nClosestLayers: function (map, layers, latlng, n) {
          n = typeof n === 'number' ? n : layers.length

          if (n < 1 || layers.length < 1) {
            return null
          }

          var results = []
          var distance, ll

          for (var i = 0, m = layers.length; i < m; i++) {
            var layer = layers[i]
            if (layer instanceof BM.LayerGroup) {
              // recursive
              var subResult = BM.GeometryUtil.closestLayer(map, layer.getLayers(), latlng)
              results.push(subResult)
            } else {
              // Single dimension, snap on points, else snap on closest
              if (typeof layer.getLatLng == 'function') {
                ll = layer.getLatLng()
                distance = BM.GeometryUtil.distance(map, latlng, ll)
              } else {
                ll = BM.GeometryUtil.closest(map, layer, latlng)
                if (ll) distance = ll.distance // Can return null if layer has no points.
              }
              results.push({
                layer: layer,
                latlng: ll,
                distance: distance,
              })
            }
          }

          results.sort(function (a, b) {
            return a.distance - b.distance
          })

          if (results.length > n) {
            return results.slice(0, n)
          } else {
            return results
          }
        },

        /**
             * Returns all layers within a radius of the given position, in an ascending order of distance.
             @param {BM.Map} map  map to be used for this method
             @param {Array<ILayer>} layers - A list of layers.
             @param {BM.LatLng} latlng - The position to search
             @param {?Number} [radius=Infinity] - Search radius in pixels
             @return {object[]} an array of objects including layer within the radius, closest latlng, and distance
             */
        layersWithin: function (map, layers, latlng, radius) {
          radius = typeof radius == 'number' ? radius : Infinity

          var results = []
          var ll = null
          var distance = 0

          for (var i = 0, n = layers.length; i < n; i++) {
            var layer = layers[i]

            if (typeof layer.getLatLng == 'function') {
              ll = layer.getLatLng()
              distance = BM.GeometryUtil.distance(map, latlng, ll)
            } else {
              ll = BM.GeometryUtil.closest(map, layer, latlng)
              if (ll) distance = ll.distance // Can return null if layer has no points.
            }

            if (ll && distance < radius) {
              results.push({
                layer: layer,
                latlng: ll,
                distance: distance,
              })
            }
          }

          var sortedResults = results.sort(function (a, b) {
            return a.distance - b.distance
          })

          return sortedResults
        },

        /**
             Returns the closest position from specified {LatLng} among specified layers,
             with a maximum tolerance in pixels, providing snapping behaviour.

             @tutorial closest

             @param {BM.Map} map  map to be used for this method
             @param {Array<ILayer>} layers - A list of layers to snap on.
             @param {BM.LatLng} latlng - The position to snap
             @param {?Number} [tolerance=Infinity] - Maximum number of pixels.
             @param {?boolean} [withVertices=true] - Snap to layers vertices or segment points (not only vertex)
             @returns {object} with snapped {LatLng} and snapped {Layer} or null if tolerance exceeded.
             */
        closestLayerSnap: function (map, layers, latlng, tolerance, withVertices) {
          tolerance = typeof tolerance == 'number' ? tolerance : Infinity
          withVertices = typeof withVertices == 'boolean' ? withVertices : true

          var result = BM.GeometryUtil.closestLayer(map, layers, latlng)
          if (!result || result.distance > tolerance) return null

          // If snapped layer is linear, try to snap on vertices (extremities and middle points)
          if (withVertices && typeof result.layer.getLatLngs == 'function') {
            var closest = BM.GeometryUtil.closest(map, result.layer, result.latlng, true)
            if (closest.distance < tolerance) {
              result.latlng = closest
              result.distance = BM.GeometryUtil.distance(map, closest, latlng)
            }
          }
          return result
        },

        /**
             Returns the Point located on a segment at the specified ratio of the segment length.
             @param {BM.Point} pA coordinates of point A
             @param {BM.Point} pB coordinates of point B
             @param {Number} the length ratio, expressed as a decimal between 0 and 1, inclusive.
             @returns {BM.Point} the interpolated point.
             */
        interpolateOnPointSegment: function (pA, pB, ratio) {
          return BM.point(pA.x * (1 - ratio) + ratio * pB.x, pA.y * (1 - ratio) + ratio * pB.y)
        },

        /**
             Returns the coordinate of the point located on a line at the specified ratio of the line length.
             @param {BM.Map} map  map to be used for this method
             @param {Array<BM.LatLng>|BM.PolyLine} latlngs Set of geographical points
             @param {Number} ratio the length ratio, expressed as a decimal between 0 and 1, inclusive
             @returns {Object} an object with latLng ({LatLng}) and predecessor ({Number}), the index of the preceding vertex in the Polyline
             (-1 if the interpolated point is the first vertex)
             */
        interpolateOnLine: function (map, latLngs, ratio) {
          latLngs = latLngs instanceof BM.Polyline ? latLngs.getLatLngs() : latLngs
          var n = latLngs.length
          if (n < 2) {
            return null
          }

          // ensure the ratio is between 0 and 1;
          ratio = Math.max(Math.min(ratio, 1), 0)

          if (ratio === 0) {
            return {
              latLng: latLngs[0] instanceof BM.LatLng ? latLngs[0] : BM.latLng(latLngs[0]),
              predecessor: -1,
            }
          }
          if (ratio == 1) {
            return {
              latLng:
                latLngs[latLngs.length - 1] instanceof BM.LatLng
                  ? latLngs[latLngs.length - 1]
                  : BM.latLng(latLngs[latLngs.length - 1]),
              predecessor: latLngs.length - 2,
            }
          }

          // project the LatLngs as Points,
          // and compute total planar length of the line at max precision
          var maxzoom = map.getMaxZoom()
          if (maxzoom === Infinity) maxzoom = map.getZoom()
          var pts = []
          var lineLength = 0
          for (var i = 0; i < n; i++) {
            pts[i] = map.project(latLngs[i], maxzoom)
            if (i > 0) lineLength += pts[i - 1].distanceTo(pts[i])
          }

          var ratioDist = lineLength * ratio

          // follow the line segments [ab], adding lengths,
          // until we find the segment where the points should lie on
          var cumulativeDistanceToA = 0,
            cumulativeDistanceToB = 0
          for (var i = 0; cumulativeDistanceToB < ratioDist; i++) {
            var pointA = pts[i],
              pointB = pts[i + 1]

            cumulativeDistanceToA = cumulativeDistanceToB
            cumulativeDistanceToB += pointA.distanceTo(pointB)
          }

          if (pointA == undefined && pointB == undefined) {
            // Happens when line has no length
            var pointA = pts[0],
              pointB = pts[1],
              i = 1
          }

          // compute the ratio relative to the segment [ab]
          var segmentRatio =
            cumulativeDistanceToB - cumulativeDistanceToA !== 0
              ? (ratioDist - cumulativeDistanceToA) / (cumulativeDistanceToB - cumulativeDistanceToA)
              : 0
          var interpolatedPoint = BM.GeometryUtil.interpolateOnPointSegment(pointA, pointB, segmentRatio)
          return {
            latLng: map.unproject(interpolatedPoint, maxzoom),
            predecessor: i - 1,
          }
        },

        /**
             Returns a float between 0 and 1 representing the location of the
             closest point on polyline to the given latlng, as a fraction of total line length.
             (opposite of BM.GeometryUtil.interpolateOnLine())
             @param {BM.Map} map  map to be used for this method
             @param {BM.PolyLine} polyline Polyline on which the latlng will be search
             @param {BM.LatLng} latlng The position to search
             @returns {Number} Float between 0 and 1
             */
        locateOnLine: function (map, polyline, latlng) {
          var latlngs = polyline.getLatLngs()
          if (latlng.equals(latlngs[0])) return 0.0
          if (latlng.equals(latlngs[latlngs.length - 1])) return 1.0

          var point = BM.GeometryUtil.closest(map, polyline, latlng, false),
            lengths = BM.GeometryUtil.accumulatedLengths(latlngs),
            total_length = lengths[lengths.length - 1],
            portion = 0,
            found = false
          for (var i = 0, n = latlngs.length - 1; i < n; i++) {
            var l1 = latlngs[i],
              l2 = latlngs[i + 1]
            portion = lengths[i]
            if (BM.GeometryUtil.belongsSegment(point, l1, l2, 0.0001)) {
              portion += l1.distanceTo(point)
              found = true
              break
            }
          }
          if (!found) {
            throw 'Could not interpolate ' + latlng.toString() + ' within ' + polyline.toString()
          }
          return portion / total_length
        },

        /**
             Returns a clone with reversed coordinates.
             @param {BM.PolyLine} polyline polyline to reverse
             @returns {BM.PolyLine} polyline reversed
             */
        reverse: function (polyline) {
          return BM.polyline(polyline.getLatLngs().slice(0).reverse())
        },

        /**
             Returns a sub-part of the polyline, from start to end.
             If start is superior to end, returns extraction from inverted line.
             @param {BM.Map} map  map to be used for this method
             @param {BM.PolyLine} polyline Polyline on which will be extracted the sub-part
             @param {Number} start ratio, expressed as a decimal between 0 and 1, inclusive
             @param {Number} end ratio, expressed as a decimal between 0 and 1, inclusive
             @returns {Array<BM.LatLng>} new polyline
             */
        extract: function (map, polyline, start, end) {
          if (start > end) {
            return BM.GeometryUtil.extract(map, BM.GeometryUtil.reverse(polyline), 1.0 - start, 1.0 - end)
          }

          // Bound start and end to [0-1]
          start = Math.max(Math.min(start, 1), 0)
          end = Math.max(Math.min(end, 1), 0)

          var latlngs = polyline.getLatLngs(),
            startpoint = BM.GeometryUtil.interpolateOnLine(map, polyline, start),
            endpoint = BM.GeometryUtil.interpolateOnLine(map, polyline, end)
          // Return single point if start == end
          if (start == end) {
            var point = BM.GeometryUtil.interpolateOnLine(map, polyline, end)
            return [point.latLng]
          }
          // Array.slice() works indexes at 0
          if (startpoint.predecessor == -1) startpoint.predecessor = 0
          if (endpoint.predecessor == -1) endpoint.predecessor = 0
          var result = latlngs.slice(startpoint.predecessor + 1, endpoint.predecessor + 1)
          result.unshift(startpoint.latLng)
          result.push(endpoint.latLng)
          return result
        },

        /**
             Returns true if first polyline ends where other second starts.
             @param {BM.PolyLine} polyline First polyline
             @param {BM.PolyLine} other Second polyline
             @returns {bool}
             */
        isBefore: function (polyline, other) {
          if (!other) return false
          var lla = polyline.getLatLngs(),
            llb = other.getLatLngs()
          return lla[lla.length - 1].equals(llb[0])
        },

        /**
             Returns true if first polyline starts where second ends.
             @param {BM.PolyLine} polyline First polyline
             @param {BM.PolyLine} other Second polyline
             @returns {bool}
             */
        isAfter: function (polyline, other) {
          if (!other) return false
          var lla = polyline.getLatLngs(),
            llb = other.getLatLngs()
          return lla[0].equals(llb[llb.length - 1])
        },

        /**
             Returns true if first polyline starts where second ends or start.
             @param {BM.PolyLine} polyline First polyline
             @param {BM.PolyLine} other Second polyline
             @returns {bool}
             */
        startsAtExtremity: function (polyline, other) {
          if (!other) return false
          var lla = polyline.getLatLngs(),
            llb = other.getLatLngs(),
            start = lla[0]
          return start.equals(llb[0]) || start.equals(llb[llb.length - 1])
        },

        /**
             Returns horizontal angle in degres between two points.
             @param {BM.Point} a Coordinates of point A
             @param {BM.Point} b Coordinates of point B
             @returns {Number} horizontal angle
             */
        computeAngle: function (a, b) {
          return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
        },

        /**
             Returns slope (Ax+B) between two points.
             @param {BM.Point} a Coordinates of point A
             @param {BM.Point} b Coordinates of point B
             @returns {Object} with ``a`` and ``b`` properties.
             */
        computeSlope: function (a, b) {
          var s = (b.y - a.y) / (b.x - a.x),
            o = a.y - s * a.x
          return {
            a: s,
            b: o,
          }
        },

        /**
             Returns LatLng of rotated point around specified LatLng center.
             @param {BM.LatLng} latlngPoint: point to rotate
             @param {double} angleDeg: angle to rotate in degrees
             @param {BM.LatLng} latlngCenter: center of rotation
             @returns {BM.LatLng} rotated point
             */
        rotatePoint: function (map, latlngPoint, angleDeg, latlngCenter) {
          var maxzoom = map.getMaxZoom()
          if (maxzoom === Infinity) maxzoom = map.getZoom()
          var angleRad = (angleDeg * Math.PI) / 180,
            pPoint = map.project(latlngPoint, maxzoom),
            pCenter = map.project(latlngCenter, maxzoom),
            x2 = Math.cos(angleRad) * (pPoint.x - pCenter.x) - Math.sin(angleRad) * (pPoint.y - pCenter.y) + pCenter.x,
            y2 = Math.sin(angleRad) * (pPoint.x - pCenter.x) + Math.cos(angleRad) * (pPoint.y - pCenter.y) + pCenter.y
          return map.unproject(new BM.Point(x2, y2), maxzoom)
        },

        /**
             Returns the bearing in degrees clockwise from north (0 degrees)
             from the first BM.LatLng to the second, at the first LatLng
             @param {BM.LatLng} latlng1: origin point of the bearing
             @param {BM.LatLng} latlng2: destination point of the bearing
             @returns {float} degrees clockwise from north.
             */
        bearing: function (latlng1, latlng2) {
          var rad = Math.PI / 180,
            lat1 = latlng1.lat * rad,
            lat2 = latlng2.lat * rad,
            lon1 = latlng1.lng * rad,
            lon2 = latlng2.lng * rad,
            y = Math.sin(lon2 - lon1) * Math.cos(lat2),
            x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)

          var bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
          return bearing >= 180 ? bearing - 360 : bearing
        },

        /**
             Returns the point that is a distance and heading away from
             the given origin point.
             @param {BM.LatLng} latlng: origin point
             @param {float} heading: heading in degrees, clockwise from 0 degrees north.
             @param {float} distance: distance in meters
             @returns {BM.latLng} the destination point.
             Many thanks to Chris Veness at http://www.movable-type.co.uk/scripts/latlong.html
             for a great reference and examples.
             */
        destination: function (latlng, heading, distance) {
          heading = (heading + 360) % 360
          var rad = Math.PI / 180,
            radInv = 180 / Math.PI,
            R = 6378137, // approximation of Earth's radius
            lon1 = latlng.lng * rad,
            lat1 = latlng.lat * rad,
            rheading = heading * rad,
            sinLat1 = Math.sin(lat1),
            cosLat1 = Math.cos(lat1),
            cosDistR = Math.cos(distance / R),
            sinDistR = Math.sin(distance / R),
            lat2 = Math.asin(sinLat1 * cosDistR + cosLat1 * sinDistR * Math.cos(rheading)),
            lon2 = lon1 + Math.atan2(Math.sin(rheading) * sinDistR * cosLat1, cosDistR - sinLat1 * Math.sin(lat2))
          lon2 = lon2 * radInv
          lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2
          return BM.latLng([lat2 * radInv, lon2])
        },

        /**
             Returns the the angle of the given segment and the Equator in degrees,
             clockwise from 0 degrees north.
             @param {BM.Map} map:  map to be used for this method
             @param {BM.LatLng} latlngA: geographical point A of the segment
             @param {BM.LatLng} latlngB: geographical point B of the segment
             @returns {Float} the angle in degrees.
             */
        angle: function (map, latlngA, latlngB) {
          var pointA = map.latLngToContainerPoint(latlngA),
            pointB = map.latLngToContainerPoint(latlngB),
            angleDeg = (Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180) / Math.PI + 90
          angleDeg += angleDeg < 0 ? 360 : 0
          return angleDeg
        },

        /**
             Returns a point snaps on the segment and heading away from the given origin point a distance.
             @param {BM.Map} map:  map to be used for this method
             @param {BM.LatLng} latlngA: geographical point A of the segment
             @param {BM.LatLng} latlngB: geographical point B of the segment
             @param {float} distance: distance in meters
             @returns {BM.latLng} the destination point.
             */
        destinationOnSegment: function (map, latlngA, latlngB, distance) {
          var angleDeg = BM.GeometryUtil.angle(map, latlngA, latlngB),
            latlng = BM.GeometryUtil.destination(latlngA, angleDeg, distance)
          return BM.GeometryUtil.closestOnSegment(map, latlng, latlngA, latlngB)
        },
      })

      return BM.GeometryUtil
    },
  },
}
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: #f1fefe;
}

.searchResult {
  ::-webkit-scrollbar-track {
    background-color: #1e2c45 !important;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #2e4c90 !important;
    border-radius: 3px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    // background-color: #2e4c90 !important;
    background-color: #00ccff !important;
    border-radius: 3px;
  }

  pointer-events: auto;
  position: fixed;
  width: 480px;
  background: rgba(20, 47, 72, 0.65);
  border-radius: 8px;
  padding: 15px;

  .titleTop {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .title {
      color: #1efffc;
    }

    .closeImg {
      cursor: pointer;
      width: 10px;
      height: 10px;
    }
  }

  .tools {
    position: relative;
    margin-top: 30px;

    .checkTool {
      position: absolute;
      left: 0;
    }

    .otherTools {
      position: absolute;
      right: 0;

      div {
        display: inline-block;
      }

      img {
        margin-left: 30px;
        vertical-align: middle;
      }
    }
  }

  .dynamicTail {
    padding-top: 30px;

    ul {
      height: 78vh;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;

      li {
        display: flex;
        align-items: center;
        padding: 15px;
        width: 450px;
        height: 145px;
        background-color: rgba(32, 75, 116, 0.65);
        margin-bottom: 25px;

        .captureImg {
          display: inline-block;
          width: 100px;
          height: 100px;
          margin-right: 10px;

          img {
            width: 100%;
            height: 100%;
            vertical-align: top;
          }
        }

        .captureInfo {
          display: flex;
          justify-content: space-between;
          width: 305px;
          height: 100px;

          .detail {
            display: inline-block;

            p {
              line-height: 25px;
            }

            .similar {
              color: #1efffc;
            }
          }

          .captureTool {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: right;

            .toDetail {
              margin-right: 5px;
              color: #1efffc;
            }
          }
        }
      }
    }
  }
}

.el-checkbox__inner {
  width: 20px;
  height: 20px;
}

.el-checkbox__inner::after {
  height: 10px;
  left: 8px;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #edf6f7;
}
</style>
