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
            type: "symbol",
            layout: {
                "icon-image": "{image}",
                "icon-size": ["get", "scale"],
                "icon-allow-overlap": true,
            },
            source: this.id,
        });
    }
    _loadImage(positions) {
        return Promise.all(
            positions.map(({ style: { image } }) => {
                return new Promise((resolve) => {
                    if (!this.map.hasImage(image)) {
                        this.map.loadImage(image, (error, data) => {
                            if (error) throw error;
                            if (!this.map.hasImage(image)) {
                                this.map.addImage(image, data);
                            }
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            }),
        );
    }
    async setData(pots) {
        const positions = pots.map((item) => ({
            ...item,
            style: { ...this.defaultStyle, ...item.style },
        }));
        await this._loadImage(positions);
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
