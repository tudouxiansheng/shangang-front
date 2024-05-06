import BaseLayer from "./BaseLayer";

export default class Billboard extends BaseLayer {
    constructor(map, defaultStyle) {
        super(map);
        this._createLayer();
        this.defaultStyle = defaultStyle;
    }
    _createLayer() {
        this.map.addLayer({
            id: this.id,
            type: "circle",
            layout: {},
            paint: {
                "circle-color": ["get", "color"],
                "circle-radius": ["get", "radius"],
            },
            source: this.id,
        });
    }
    async setData(pots) {
        const positions = pots.map((item) => ({
            ...item,
            style: { ...this.defaultStyle, ...item.style },
        }));
        this.map.getSource(this.id).setData({
            type: "FeatureCollection",
            features: positions.map((item) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: item.position,
                },
                properties: {
                    ...item.style,
                    attr: item.attr,
                },
            })),
        });
    }
}
