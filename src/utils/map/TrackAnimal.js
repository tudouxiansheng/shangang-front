import {
    getDistance
} from "../turfUtil.js"
export default class TrackAnimal {
    constructor(viewer) {
        this.viewer = viewer;
        this._dataSource = new Cesium.CustomDataSource("modelSource");
        this.viewer.dataSources.add(this._dataSource);
        this._entity = this._dataSource.entities;
        this.line = []; //轨迹排序数据
        this.car3Points = []; //轨迹点的迪卡三坐标集合
        this.timeArray = []; //各轨迹点的迪卡三坐标时间数据
        this.startTime = ""; //动画开始时间
        this.endTime = ""; //动画结束时间
        this.start = ""; //动画开始时间对象
        this.stop = ""; //动画结束时间对象
        this.curEn = null; //当前动画实体
        this.state = 0; //播放状态 0:初始化 1：播放中 2：结束
        this._evt = {}
        // setTimeout(() => {
        //     this.init()
        // }, 1000)
        // document.addEventListener('keydown', (e) => {
        //     if (e.keyCode == 32) {
        //         this.animalPlay()
        //     }
        // })
    }
    /**
     * 初始化
     * @param {*} lineData 线路数据
     * @param {*} type 人/车 0/1
     */
    init(type = 0, lineData) {
        this.viewer.clock.shouldAnimate = false;
      this.viewer.scene.light = new Cesium.DirectionalLight({
        direction: new Cesium.Cartesian3(0.354925, -0.890918, -0.283358)
      });
        this.line = this.getLine(lineData);
        // this.timeArray = this.line.map(l => l.hitTime); //时间数据 //使用数据时间
        // this.startTime = this.timeArray[0]; //开始时间
        // this.endTime = this.timeArray.slice(-1)[0] //结束时间
        // this.start = Cesium.JulianDate.fromDate(new Date(this.startTime)) //动画时间
        // this.stop = Cesium.JulianDate.fromDate(new Date(this.endTime)) //动画时间
        let positions = this.getPoints(this.line);
        this.car3Points = this.getCar3Position(positions);
        this.timeArray = this.getSpeedTime(positions, 15); //自定义处理数据时间
        this.startTime = this.timeArray[0]; //开始时间
        this.endTime = this.timeArray.slice(-1)[0] //结束时间
        this.start = Cesium.JulianDate.fromDate(new Date(this.startTime)) //动画时间
        this.stop = Cesium.JulianDate.fromDate(new Date(this.endTime)) //动画时间

        let img = ['./static/images/track-staff.png', './static/images/track-car.png'];

        this.loadModel(img[type], type)
    }
    /**
     * 加载模型
     * @param {*} url 模型地址
     * @param {*} type 0/1 人/车
     * @param {*} options 其他参数
     */
    loadModel(url, type, options = {}) {
        // //弧度的航向分量。
        // var heading = Cesium.Math.toRadians(135);
        // //弧度的螺距分量。
        // var pitch = 0;
        // //滚动分量（以弧度为单位）
        // var roll = 0;
        // //HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
        // var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        // var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        //     _position,
        //     hpr
        // )
        var juliaProperty = this.JuliaDateLine(this.car3Points, this.timeArray)
        let option = {
            // point: {
            //     color: Cesium.Color.fromCssColorString("rgb(22, 181, 254)"),
            //     outlineColor: Cesium.Color.BlACK,
            //     pixelSize: 30
            // },
            attr: {
                id: this.getGuid()
            },
            position: juliaProperty,
            orientation: new Cesium.VelocityOrientationProperty(juliaProperty),
            path: {
                resolution: 60,
                leadTime: 0,
                material: new Cesium.PolylineGlowMaterialProperty({
                    // glowPower: 0.1,
                    color: Cesium.Color.fromCssColorString("rgb(22, 181, 254)"),
                }),
                width: 20,
            },
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: this.start,
                    stop: this.stop
                }),
            ]),
            billboard: {
                image: url,
                width: 42, // default: undefined
                height: 42, // default: undefined
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                // disableDepthTestDistance: Infinity,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            }
        }
        this.curEn = this._entity.add(option)
        // this.viewer.flyTo(this.curEn)
        // this.viewer.trackedEntity = this.curEn;
        this.curEn.trackEn = this.loadTrack();
        this.curEn.trackPoints = this.loadTrackPoints(type);
    }
    /**
     * 轨迹虚线
     * @returns
     */
    loadTrack() {
        return this._entity.add({
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            polyline: {
                material: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.fromCssColorString("rgb(22, 181, 254)"),
                }),
                // width: 3,
                positions: this.car3Points,
                width: 20,
                // material: new wutu3d.LineFlowMaterial({ //动画线材质
                //     color: Cesium.Color.fromCssColorString("rgb(22, 181, 254)"),
                //     duration: 3000,
                //     url: "./static/images/texture/red.png"
                // }),
            }
        })
    }
    /**
     * 轨迹点位
     * @returns []
     */
    loadTrackPoints(type) {
        this.pointsObj = {}
        var arr = []
        this.car3Points.forEach((point, i) => {
            // let key = this.line[i].longitude + this.line[i].latitude;
            let key = this.line[i].cameraId;
            if (!this.pointsObj[key]) this.pointsObj[key] = [];
            this.pointsObj[key].push(i)
            // if(pointsObj[point.x])
            arr.push(this._entity.add({
                position: point,
                label: {
                    text: i + 1 + '',
                    font: "60px",
                    // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    color: Cesium.Color.fromCssColorString("#ffffff"),
                    pixelOffset: new Cesium.Cartesian2(0, -76),
                    backgroundColor: Cesium.Color.BLACK,
                    eyeOffset: new Cesium.Cartesian3(0, 0, -10)
                },
                // point: {
                //     pixelSize: 5,
                //     color: Cesium.Color.AQUA,
                //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                // },
                billboard: {
                    image: "./static/images/trackP.png",
                    width: 42, // default: undefined
                    height: 96, // default: undefined
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    // disableDepthTestDistance: Infinity,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                },
                attribute: {
                    attr: {
                        type: type == 0 ? 'trackPoint' : 'cartrackPoint',
                        trackListInfo: this.line[i],
                    },
                    // type:type == 0 ? 'trackPoint' : 'cartrackPoint',
                    type: "billboard",
                    index: i,
                    indexArr: this.pointsObj[key]
                }
            }))
        })
        // 隐藏相同点位之前的点数字
        Object.keys(this.pointsObj).forEach(k => {
            var indexs = this.pointsObj[k].slice(0, -1)
            indexs.forEach(ins => {
                arr[ins].show = false
            })
        })
        return arr
    }
    /**
     * 动画播放
     */
    animalPlay() {
        this.state = 1;
        var _this = this;
        this._evt["getState"].forEach(f => f(_this.state));
        this.curEn.show = true
        this.curEn.path.leadTime = 0;
        delete this.curEn.path.trailTime
        this.viewer.clock.startTime = this.start.clone(); //开始时间new Date("2020-2-1 00:00:00")(可以是时间戳)
        this.viewer.clock.stopTime = this.stop.clone(); //结束时间new Date("2020-2-1 00:00:00")(可以是时间戳)
        this.viewer.clock.currentTime = this.start.clone(); //当前时间
        // this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //到末尾时间再次循环
        this.viewer.clock.multiplier = 1; //乘数（值越大，时间轴速度越快）
        this.viewer.clock.shouldAnimate = true; //乘数（值越大，时间轴速度越快）

        this.curEn.trackEn.show = false
        this.curEn.trackPoints.forEach((t, i) => {
            if (i != 0) t.show = false
        }); //隐藏弹框
        let _trackPoints = _this.curEn.trackPoints;
        let index = 1;
        var showTrackPoint = this.viewer.clock.onTick.addEventListener((e) => {
            let _t = new Date(e.currentTime.toString()).getTime()
            if (_t > this.timeArray[index] - 100) {
                _trackPoints[index].show = true
                if (index == _trackPoints[index].attribute.index) {
                    let index2 = _trackPoints[index].attribute.indexArr.findIndex((item) => item == index)
                    let _en = _trackPoints[_trackPoints[index].attribute.indexArr[index2 - 1]]
                    if (_en && _en.label) _en.show = false;
                }
                index++;
                // 移除监听 播放完毕
                if (index == _trackPoints.length) {
                    this.removeAnimation()
                    this.viewer.clock.onTick.removeEventListener(showTrackPoint)
                    this.state = 0
                    this._evt["getState"].forEach(f => f(this.state));
                }
                _trackPoints[index]
            }
        })
        document.addEventListener('visibilitychange', this.clockOper.call(this))
        // document.addEventListener('visibilitychange', ()=> { // 浏览器切换事件
        //     if (document.visibilityState === 'hidden') { // 离开当前tab标签
        //         this.viewer.clock.shouldAnimate = false
        //     } else { // 回到当前tab标签
        //         this.viewer.clock.shouldAnimate = true
        //     }
        // });
    }
    // 开启或关闭时间
    clockOper() {
        // 浏览器切换事件
        if (document.visibilityState === 'hidden') { // 离开当前tab标签
            this.viewer.clock.shouldAnimate = false
        } else { // 回到当前tab标签
            this.viewer.clock.shouldAnimate = true
        }
    }
    /**
     * 移除动画
     */
    removeAnimation() {
        // this.curEn.path.trailTime = 0;
        this.curEn.show = false
        this.curEn.trackEn.show = true
        document.removeEventListener('visibilitychange', this.clockOper.call(this))
    }
    /**
     * 功能清除
     */
    removeAll() {
        this._entity.removeAll()
        this.state = 0;
        this.line = []; //轨迹排序数据
        this.car3Points = []; //轨迹点的迪卡三坐标集合
        this.timeArray = []; //各轨迹点的迪卡三坐标时间数据
        this.startTime = ""; //动画开始时间
        this.endTime = ""; //动画结束时间
        this.start = ""; //动画开始时间对象
        this.stop = ""; //动画结束时间对象
        this.curEn = null; //当前动画实体
        document.removeEventListener('visibilitychange', this.clockOper.call(this))
    }
    /**
     * 测试数据
     * @returns
     */
    getLine(line) {
        line = line || [{
                "altitude": -0.09199218894316348,
                "captureImagePath": "http://10.0.10.25:1160/imgu?Action=Download&NvrCode=71b71340397d413bb1473f194e5c1ee1&PictureID=MDMjMDAwMiOuFQmuJhQ3rJrcs57V5%2BW1uhV9HeGJGTOfzeMyJMGRi%2B4kDVolHPKUZYu8Ek0%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "detectImagePath": "http://10.0.10.25:1160/imgu?Action=Download&NvrCode=71b71340397d413bb1473f194e5c1ee1&PictureID=MDMjMDAwMiO1LGEyCtu6LHF06A3bKeIYBv%2ByduwiFTKzjEck7WHFdTeJgSq6igogk64j%2Bw%3D%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "deviceId": "00000022062905010301000000017547",
                "deviceName": "11号仓东南角向西（近景）",
                "hitTime": "2022-07-01 09:46:21",
                "latitude": 40.360003812887776,
                "longitude": 115.90802774705571
            }, {
                "altitude": -0.09199218894316348,
                "captureImagePath": "http://10.0.10.25:1160/imgu?Action=Download&NvrCode=71b71340397d413bb1473f194e5c1ee1&PictureID=MDMjMDAwMiOuFQmuJhQ3rJrcs57V5%2BW1uhV9HeGJGTOfzeMyJMGRi%2B4kDVolHPKUZYu8Ek0%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "detectImagePath": "http://10.0.10.25:1160/imgu?Action=Download&NvrCode=71b71340397d413bb1473f194e5c1ee1&PictureID=MDMjMDAwMiO1LGEyCtu6LHF06A3bKeIYBv%2ByduwiFTKzjEck7WHFdTeJgSq6igogk64j%2Bw%3D%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "deviceId": "00000022062905010301000000017547",
                "deviceName": "11号仓东南角向西（近景）",
                "hitTime": "2022-07-01 09:46:50",
                "latitude": 40.36001937489669,
                "longitude": 115.9070242955776
            },
            {
                "altitude": -0.1097390979844766,
                "captureImagePath": "http://10.0.10.24:1185/imgu?Action=Download&NvrCode=e0063cda99854d9694f6e74259545bb5&PictureID=MDMjMDAwMiPVJjYpV0DOyO%2FtAoJWYfncxOCuT4WBMNjW%2Bzi2JPshrha1gk%2BVJL8jIjvHFDA%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "detectImagePath": "http://10.0.10.24:1185/imgu?Action=Download&NvrCode=e0063cda99854d9694f6e74259545bb5&PictureID=MDMjMDAwMiPVLs%2FHSqFQTZgvz%2B9roY90iDJjpTKlbIA00igpJOe%2FtU2o2WXxdYag5NSSX%2FA%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "deviceId": "00000022062905010301000000017646",
                "deviceName": "12号仓西北角向北（近景）",
                "hitTime": "2022-07-01 09:48:37",
                "latitude": 40.360679183858636,
                "longitude": 115.90703369288146
            },
            {
                "altitude": -0.10212393576845673,
                "captureImagePath": "http://10.0.10.24:1172/imgu?Action=Download&NvrCode=a33799492ea44101a44e06ab98fb6b31&PictureID=MDMjMDAwMiMdLdS1e6jmgcim0lYduDYH4O1C2vBB1LeyOFS2JMnWFeAY12TmtW4DVGvrP0Y%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "detectImagePath": "http://10.0.10.24:1172/imgu?Action=Download&NvrCode=a33799492ea44101a44e06ab98fb6b31&PictureID=MDMjMDAwMiMgmayxhJncz8lPTIQUMJaZWHA%2Fm70eZKuFYAYkAYOrpHHVqgrUABgUk9uL6A%3D%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "deviceId": "00000022062905010301000000017519",
                "deviceName": "10号库西北向北（近景）",
                "hitTime": "2022-07-01 09:50:52",
                "latitude": 40.36113125528347,
                "longitude": 115.90700993130318
            },
            {
                "altitude": -0.10072925725321111,
                "captureImagePath": "http://10.0.10.24:1185/imgu?Action=Download&NvrCode=e0063cda99854d9694f6e74259545bb5&PictureID=MDMjMDAwMiO4aV9KezjxjP4sicCgwdJfVgoI9Epn22HO%2BxPlJFqdF2i8OJKmr8DkPV2Rf5s%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "detectImagePath": "http://10.0.10.24:1185/imgu?Action=Download&NvrCode=e0063cda99854d9694f6e74259545bb5&PictureID=MDMjMDAwMiN0TN2K1%2FQMedERtqXmi1tRtzOGN0f1f0MyjyTHUHv2pnLktf791fCUdKeQ&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "deviceId": "00000022062905010301000000017507",
                "deviceName": "8号库西北向北（近景）",
                "hitTime": "2022-07-01 09:52:07",
                "latitude": 40.361597944938104,
                "longitude": 115.90699018210306
            },
            {
                "altitude": -0.1069830850513597,
                "captureImagePath": "http://10.0.10.24:1172/imgu?Action=Download&NvrCode=a33799492ea44101a44e06ab98fb6b31&PictureID=MDMjMDAwMiMj0nLfe6duS8OQZbfCf7m7GB51DUzc7ih5QXAk40cR72uZ1ilDAky%2FJ9rVqQ%3D%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "detectImagePath": "http://10.0.10.24:1172/imgu?Action=Download&NvrCode=a33799492ea44101a44e06ab98fb6b31&PictureID=MDMjMDAwMiMr7tF2biOtVph57yzubryNorPzLpmshJHZOtnsJKt5owe7wlTL1dy54fBFjRk%3D&auth_type=vcm&vcm_domain=0046a5cc909c4140b0e24901dce512bc",
                "deviceId": "00000022062905010301000000017542",
                "deviceName": "6号库西北向北（近景）",
                "hitTime": "2022-07-01 09:54:20",
                "latitude": 40.36205681755781,
                "longitude": 115.90696880730084
            }
        ]
        return line.sort((a, b) => {
            return new Date(a.hitTime) - new Date(b.hitTime)
        })
    }
    /**
     * 获取轨迹的点位
     * @param {*} array
     * @returns
     */
    getPoints(array) {
        return array.map(l => {
            return {
                lnt: l.longitude,
                lat: l.latitude,
                height: (l.altitude || 0) + 7
            }
        })
    }
    /**
     * 处理点位数据
     * @param {*} array
     * @returns 迪卡三坐标数组
     */
    getCar3Position(array) {
        return array.map(p => this.transLonToCar3([p.lnt, p.lat], p.height))
    }
    /**
     * 根据距离计算时间比例
     * @param {*} position
     * @param {*} n 时间总长
     * @returns
     */
    getSpeedTime(position, n = 10) {
        // let len = position.length - 1;
        let arr = []
        for (let i = 0; i < position.length - 1; i++) {
            arr.push([position[i], position[i + 1]])
        }
        let dis = []
        arr.forEach(a => {
            dis.push(getDistance([a[0].lnt, a[0].lat], [a[1].lnt, a[1].lat]) || 25) //如果没距离取25，保证不消失
        })
        let all = dis.reduce((first, cur) =>
            first + cur, 0)
        let curTime = new Date().getTime();
        let times = [curTime];
        let _time = curTime
        dis.forEach(d => {
            _time = parseInt(_time + ((d * n) / all) * 1000)
            times.push(_time);
        })
        return times
    }

    /**
     * 处理动画时间
     * @param {*} positions
     * @param {*} times
     */
    JuliaDateLine(positions, times) {
        let _time = times
        if (times.length == 2) { //开始结束时间
            _time = this.splitTime(times, positions.length)
        }
        if (_time.length == positions.length) { //一一对应
            let time2 = _time.map(t => Cesium.JulianDate.fromDate(new Date(t)));
            let property = new Cesium.SampledPositionProperty();
            property.addSamples(time2, positions); //某组时刻对应的某组坐标
            return property;
        }
    }
    /**
     * 如果只有起点和终点时间 均匀分割时间
     * @param {*} time
     * @param {*} n
     * @returns 新的时间数组
     */
    splitTime(time, n) {
        var st = new Date(time[0]).getTime()
        var ed = new Date(time[1]).getTime()
        var t = (ed - st) / (n - 1)
        var time2 = []
        for (var i = 0; i < n; i++) {
            time2.push(st + i * t)
        }
        return time2
    }
    /**
     * 获取随机id
     * @returns uuid
     */
    getGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**
     * 转换经纬度为迪卡三坐标
     */
    transLonToCar3() {
        let arr = arguments[0];
        let height = arguments[1];
        if (Array.isArray(arr)) {
            if (arr.length == 2) {
                // 一个点位
                return Cesium.Cartesian3.fromDegrees(arr[0], arr[1], height)
            } else {
                // 一组点位 [[],[]]
                let pts = []
                arr.forEach(a => {
                    pts.push(a[0])
                    pts.push(a[1])
                })
                return Cesium.Cartesian3.fromDegreesArray(pts)
            }
        }
    }
    /**
     * 迪卡三坐标转经纬度
     * @param {Number} x
     * @return {Number} y
     */
    carToCartographic() {
        if (!cartesian3) {
            return undefined;
        }
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lon = Cesium.Math.toDegrees(cartographic.longitude);
        var alt = cartographic.height;
        return {
            lat,
            lon,
            height: alt,
        };
    }
    /**
     * 注册函数
     * @param {*} type
     * @param {*} fn
     */
    on(type, fn) {
        if (!this._evt[type]) this._evt[type] = [];
        if (this._evt[type].indexOf(fn) === -1) {
            this._evt[type].push(fn)
        }
    }
}
