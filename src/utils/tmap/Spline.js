import * as turf from "@turf/turf";

export default class Spline {
    constructor({ delay = 3000 } = {}) {
        this.delay = delay;
    }
    points = [];
    update(point) {
        if (!point) {
            return;
        }
        this.points.push({
            timestamp: getTimestamp(),
            data: point,
        });
    }
    getCurrentPoint() {
        const now = getTimestamp() - this.delay;
        const index = this.points.findIndex((item) => item.timestamp >= now);
        const points = this.points.slice(index - 1, index + 1);
        if (points.length < 2) {
            return;
        }
        try {
            const line = turf.lineString(points.map((item) => item.data));
            const units = "kilometers";
            const length = turf.length(line, { units });
            const speed = length / (points[1].timestamp - points[0].timestamp);
            if (!speed) {
                return;
            }
            const [{ timestamp: prevTimestamp }] = points;
            const diffTime = now - prevTimestamp;
            const sliced = turf.lineSliceAlong(line, 0, speed * diffTime, {
                units,
            });
            return turf.coordAll(sliced)[1];
        } catch (e) {
            console.log(e);
        }
    }

    getCurrentLine() {
        const now = getTimestamp() - this.delay;
        const index = this.points.findIndex((item) => item.timestamp >= now);
        const beforePoints = this.points.slice(0, index === -1 ? this.points.length : index);
        return beforePoints
            .map((item) => item.data)
            .concat([this.getCurrentPoint()])
            .filter(Boolean);
    }
    start(cb) {
        const doIt = () => {
            this.timer = window.requestAnimationFrame(() => {
                cb(this.getCurrentLine());
                doIt();
            });
        };
        doIt();
    }
    stop() {
        if (this.timer) {
            window.cancelAnimationFrame(this.timer);
            this.timer = null;
        }
    }
}

function getTimestamp() {
    return Date.now();
}
