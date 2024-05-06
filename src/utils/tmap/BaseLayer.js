import Event from "./Event";

export default class BaseLayer extends Event {
    constructor(map) {
        super();
        this.map = map;
        this.id = this._initId();
        this._initSource();
        map.on("click", this.id, (e) => {
            const [feature] = e.features;
            if (feature) {
                const { attr = "{}", ...style } = feature.properties;
                this.fire("click", {
                    style,
                    attr: JSON.parse(attr),
                });
            }
        });
    }

    destroy() {
        this.map.removeLayer(this.id);
        this.map.removeSource(this.id);
    }

    _initId() {
        return Math.random()
            .toString(36)
            .substr(-8);
    }

    _initSource() {
        this.map.addSource(this.id, {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [],
            },
        });
    }
}
