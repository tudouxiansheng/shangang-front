// import "./bm.geometryutil"
import '@/utils/secondMapConfig.js'
BM.Marker.addInitHook(function () {
    this.moveOptions = {
        origin: null,
        timer: null,
        done: 0,
        path: null,
        length: 0
    };
    this.setSpeed = function (speed) {
        console.log(11111111);
        this.moveOptions.speed = isNaN(parseFloat(speed)) || parseFloat(speed) <= 0 ? 200 : parseFloat(speed);
    };
    this.getSpeed = function () {
        console.log(22222222);
        return this.moveOptions.speed;
    };
    this.moveAlong = function (path, speed) {
        path = path instanceof BM.Polyline ? path : new BM.Polyline(path);
        this.moveOptions.path = path;
        this.moveOptions.length = BM.GeometryUtil.length(path);
        this.moveOptions.speed = isNaN(parseFloat(speed)) || parseFloat(speed <= 0) ? 200 : parseFloat(speed);
        this._move();
    };
    this.pauseMove = function () {

        clearInterval(this.moveOptions.timer);
        this.moveOptions.timer = null;
    };
    this.resumeMove = function () {
        this._move();
    };
    this.stopMove = function () {
        this.pauseMove();
        this.moveOptions.done = 0;
    };
    this._move = function () {
        console.log(555555);
        if (this.moveOptions.timer) return;
        let _t = this;
        this.moveOptions.timer = setInterval(function () {
            let done = _t.moveOptions.done;
            done += _t.moveOptions.speed / 1000 * 20;
            let radio = done / _t.moveOptions.length;
            radio >= 1 ? (radio = 0, done = 0) : true;
            _t.moveOptions.done = done;
            let p = BM.GeometryUtil.interpolateOnLine(_t._map, _t.moveOptions.path, radio);
            _t.setLatLng(p.latLng);
            let pre_p = _t.moveOptions.path.getLatLngs()[p.predecessor];
            if (pre_p) {
                let passed = _t.moveOptions.path.getLatLngs().slice(0, p.predecessor + 1);
                passed.push(p.latLng);
                _t.fire('update_position', {path: passed});
                let deg = BM.GeometryUtil.computeAngle(_t._map.project(pre_p), _t._map.project(p.latLng))
                _t._icon.style.transformOrigin = '50% 50%';
                _t._icon.style.transform += ' rotateZ(' + deg + 'deg)';
            }
        }, 20)
    }
//
});
