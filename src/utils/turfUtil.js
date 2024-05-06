import * as turf from "@turf/turf";
/**
 * 获取两点距离
 * @param {Array} from [-75.343, 39.984]
 * @param {Array} to [-75.343, 39.984]
 * @param {String} units
 * @returns {*}
 */
export const getDistance = function (from, to, units = "meters") {
    let f = turf.point(from);
    let t = turf.point(to);
    return turf.distance(f, t, {
        units
    });
}