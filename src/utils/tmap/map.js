import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import Billboard from "./Billboard";
import Circle from "./Circle";
import Point from "./Point";
import Line from "./Line";

console.log(mapboxgl,'mapboxgl');
mapboxgl.Marker = class extends mapboxgl.Marker {
    constructor(props) {
        super(props);
    }

    _update(e) {
        super._update(e || {});
    }
};
export const Marker = mapboxgl.Marker;
export { mapboxgl };

mapboxgl.accessToken =
    "pk.eyJ1Ijoid3V0dS15YW5ndG9uZyIsImEiOiJja2hmcDV1c3AwdWY3MnhwamsybnhzeTJmIn0.2WcVdnE0Sqy1usQaXZh4IA";
export default class extends mapboxgl.Map {
    _originStyle = null;
    _baseApiUrl = "";
    floorOptions = [];
    floor = {};
    isLoad = false;

    constructor(options) {
        const defaultOptions = {
            localIdeographFontFamily: "Microsoft YaHei,simsun, Arial,sans-serif",
            transformRequest: (url) => this._transformRequest(url),
            maxZoom: 21,
        };
        super({
            ...options,
            ...defaultOptions,
        });
        this.once("load", () => {
            this.isLoad = true;
        });
    }

    loadMap(mapUrl) {
        this._baseApiUrl = mapUrl;
        console.log(mapUrl,'mapUrl');
        return Promise.all([
            this._loadStyle(mapUrl + "/newstyle.json"),
            this._loadFloorConfig(mapUrl + "/config.json"),
        ]).then(() => {
            if (!this.floorOptions.length) {
                this.setStyle(this._originStyle);
            }
        });
    }

    goFloor(floor) {
        if (this.floor === floor) {
            return;
        }
        this.floor = floor;
        const layers = this._originStyle.layers.filter(
            (layer) => !layer.id || this.floor.includes(layer.id),
        );
        this.setStyle({
            ...this._originStyle,
            layers,
        });
        const { bounds } = this.floorOptions.find((item) => item.value === this.floor) || {};
        if (bounds) {
            this.once(this.isLoad ? "render" : "load", () => {
                this.fitBounds(bounds, { padding: 200 });
            });
        }
    }

    async _loadStyle(url) {
        const { data } = await axios.get(url);
        this._originStyle = data;
    }

    async _loadFloorConfig(url) {
        try {
            const {
                data: {
                    floors,
                    default: { floor },
                },
            } = await axios.get(url);
            this.floorOptions = floors.map(({ layers, ...item }) => {
                return {
                    ...item,
                    value: layers,
                };
            });
            this.goFloor(
                (
                    this.floorOptions.find((item) => item.label === floor) ||
                    this.floorOptions[0] ||
                    {}
                ).value,
            );
        } catch (e) {
            console.warn(e);
        }
    }

    _transformRequest(url) {
        const reg1 = /wutu:\//;
        if (reg1.test(url) && this._baseApiUrl) {
            url = url.replace(reg1, this._baseApiUrl);
        }
        return {
            url,
        };
    }

    createLayer({ type, style }) {
        const FuncMap = {
            billboard: Billboard,
            circle: Circle,
            point: Point,
            line: Line,
        };
        return new FuncMap[type](this, style);
    }
}
