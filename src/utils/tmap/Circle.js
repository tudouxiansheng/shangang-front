import Color from "color";
import BaseLayer from "./BaseLayer";

export default class Billboard extends BaseLayer {
    constructor(map, defaultStyle) {
        super(map);
        this._createLayer();
        this._loadImage(defaultStyle);
    }
    _createLayer() {
        this.map.addLayer({
            id: this.id,
            type: "symbol",
            layout: {
                "icon-image": this.id,
                "icon-allow-overlap": true,
            },
            source: this.id,
        });
    }
    _loadImage({ size = 50, color: col = "rgba(30, 140, 244, 1)", duration = 1000 }) {
        const map = this.map;
        const color = Color(col);
        const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd() {
                const canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext("2d");
            },

            render() {
                const t = (performance.now() % duration) / duration;

                const radius = (size / 2) * 0.3;
                const outerRadius = (size / 2) * 0.7 * t + radius;
                const context = this.context;

                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                context.fillStyle = color.alpha(0.5).string();
                context.fill();

                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                context.fillStyle = col;
                context.strokeStyle = "transparent";
                context.lineWidth = 0;
                context.fill();
                context.stroke();
                this.data = context.getImageData(0, 0, this.width, this.height).data;
                map.triggerRepaint();

                return true;
            },
        };
        this.map.addImage(this.id, pulsingDot);
    }
    async setData(positions) {
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
