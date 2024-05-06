/* eslint-disable no-mixed-spaces-and-tabs */
import { Cesium, wutu3d } from "./global";
import { Evented } from "./Event";
import dayjs from "dayjs";

/**
 * 获取CESIUM开始时钟
 * @param {String | Null} time 时间
 * @param {String | Null} date 日期
 */
function getDayTimeClock(time, date) {
	const dateString =
	  dayjs(date || new Date())
		.format("YYYY-MM-DD")
		.toString() +
	  "T" +
	  (time || "09:30:00");
	const startTime = Cesium.JulianDate.fromDate(new Date(dateString));
	return new Cesium.Clock({ startTime: startTime });
  }

/**
 * 获取CESIUM时钟ViewModel
 * @param {String} time 时间
 * @return {Cesium.ClockViewModel}
 */
function getClockViewModel(time) {
	const startTimeClock = getDayTimeClock(time);
	return new Cesium.ClockViewModel(startTimeClock);
}

const SINGLE_MAP_IMAGE = "./libs/map/Cesium/Assets/Textures/waterNormalsSmall.jpg";

function setEntityAttributes(entity, properties) {
    if(!entity || !properties) return;
    if(!entity.attribute.attr) {
        entity.attribute.attr = {};
    }
    for(const key in properties) {
        entity.attribute.attr[key] = properties[key];
    }
}

// function getEntityAttribute(entity, key) {
//     if(!entity || !key) return null;
//     if(!entity.attribute.attr) {
//         entity.attribute.attr = {};
//     }
//     return entity.attribute.attr[key];
// }

/**
 * Cartesian3转WGS84
 * @param {Cartesian3} point
 * @return {Object}
 */
function Cartesian3_to_WGS84(point) {
	if(!point) return null;
	var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z || 0.0);
	var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
	var lat = Cesium.Math.toDegrees(cartographic.latitude);
	var lng = Cesium.Math.toDegrees(cartographic.longitude);
	var alt = cartographic.height;
	return {
		x: lng,
		y: lat,
		z: alt
	};
}


/**
 * 地图主类
 * @extends {Evented}
 */
export class Map extends Evented {
	constructor(container, option) {
		super();
		this.option = {
			sceneModePicker: false, // 视图模型选择按钮
			fullscreenButton: false, // 全屏按钮
			homeButton: false,
			baseLayerPicker: false, // 底图选择按钮
			navigationHelpButton: false, // 导航工具按钮
			// 底图
			imageryProvider: null,
			// 背景色，只有在底图无效的情况下才有用
			backgroundColor: null,
			// 初始化视图值
			viewpoint: null,
			// 最大缩放限制
			maximumZoomDistance: null,
			// 最小缩放限制
			minimumZoomDistance: null,

			// 显示罗盘控件
			showCompass: false,

			// 当前时间
			currentTime: undefined,
		};
		Object.assign(this.option, option);


		// 视图控制器
		const viewer = this.viewer = this._initViewer(container);

		// 隐藏Cesium官网信息
		this.viewer._cesiumWidget._creditContainer.style.display = "none";

		if (!this.option.imageryProvider) {
			viewer.scene.skyBox = null;
			viewer.scene.sun.show = false;
			viewer.scene.moon.show = false;
			viewer.scene.globe.show = false;
			viewer.scene.backgroundColor = Cesium.Color.fromCssColorString(this.option.backgroundColor || "rgba(0, 13, 22, 1)");
			viewer.scene.globe.depthTestAgainstTerrain = false;
			viewer.scene.logarithmicDepthBuffer = false;
		}

		// 实始化地图初始点
		this.viewer.camera.flyHome = () => {
			this.option.viewpoint && this.setViewpoint(this.option.viewpoint, {
				duration: 1
			});
		};

		this.viewer.scene.globe.depthTestAgainstTerrain = false;

		// 安装指南针、罗盘插件
		if (Cesium.viewerCesiumNavigationMixin && this.option.showCompass) {
			const ops = {};
			ops.enableCompass = true; //罗盘
			ops.enableZoomControls = true; //缩放
			ops.enableDistanceLegend = true; //比例尺
			ops.enableCompassOuterRing = true; //指南针外环
			this.viewer.extend(Cesium.viewerCesiumNavigationMixin, ops);
		}


		// 三维瓦片模型集合
		this.models = [];
		this.tileModelCollection = new Cesium.PrimitiveCollection("tilemodel");
		this.viewer.scene.primitives.add(this.tileModelCollection);

		// 绘制工具
		this.measureTool = new wutu3d.analysi.Measure({
            viewer: viewer,
            removeScreenSpaceEvent: true,
            label: {
                "font_size": 18,
                "border_width": 4,
                "background": false,
            }
        });

		// 绘制工具
		this.plotDrawTool = new wutu3d.Draw(viewer, {hasEdit: false });

		// 交互
		this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		this._initEvent();

		this.popups = [];

		// 修改鼠标事件
		// this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
		// 	Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH
		// ];

		// this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
		// 	Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG
		// ];

		// 实始化地图视点
		if (this.option.viewpoint) {
			this.setViewpoint(this.option.viewpoint);
		}

	}

	/**
	 * 计算并合并交互事件
	 * @private
	 * @param {Object} evt
	 */


	/**
	 * 初始化事件
	 * @private
	 */
	_initEvent() {
		// this.viewer.wutu3d.keyboardRoam.bind({
        //     speedRatio: 150,    //平移步长，值越大步长越小。
        //     dirStep: 25,        //相机原地旋转步长，值越大步长越小。
        //     rotateStep: 1.0,    //相机围绕目标点旋转速率，0.3 - 2.0
        //     minPitch: 0.1,      //最小仰角  0 - 1
        //     maxPitch: 0.95,     //最大仰角  0 - 1
		// });
		const viewer = this.viewer;
		const plotDrawTool = this.plotDrawTool;
		const _mergeEvt = (event) => {
			let position = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
			let pick = viewer.scene.pick(event.position);
            if (Cesium.defined(pick) && pick.id && pick.id instanceof Cesium.Entity) {
				event.entity = pick.id;
			} else {
				event.entity = null;
			}
			event.editPlot = plotDrawTool.getCurrentEntity();
			event.cartesian3 = position;
			event.latLngPosition = Cartesian3_to_WGS84(position);
		}

		this.handler.setInputAction((evt) => {
			_mergeEvt(evt);
			this.fire("click", evt);
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		this.handler.setInputAction((evt) => {
			_mergeEvt(evt);
			this.fire("contextmenu", evt);
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

		// this.plotDrawTool.on(wutu3d.draw.event.DrawStop, (e) => {
		// 	this.fire("drawStop", e);
		// });

		// this.plotDrawTool.on(wutu3d.draw.event.DrawAddPoint, (e) => {
		// 	this.fire("drawUpdate", e);
		// });

		// this.plotDrawTool.on(wutu3d.draw.event.DrawRemovePoint, (e) => {
		// 	this.fire("drawUpdate", e);
		// });

		// this.plotDrawTool.on(wutu3d.draw.event.EditMovePoint, (e) => {
		// 	this.fire("drawUpdate", e);
		// });

	}

	/**
	 * 根据模型ID获取模型
	 * @param {String} id 模型ID
	 * @return {Object|undefined}
	 */
	getModel(id) {
		return this.models.filter((d) => d.id === id)[0];
	}

	/**
	 * 定位至模型
	 * @param {String} id 模型ID
	 */
	flyToModel(id) {
		const model = this.getModel(id);
		if (!model || !model.model) return;
		this.viewer.flyTo(model.model);
	}

	/**
	 * 添加模型
	 * @param {Object} param 模型参数
	 * @param {String} param.id 模型ID
	 * @param {String} param.name 模型名称
	 * @param {String} param.link 模型链接地址
	 * @param {String} param.visible 模型可见度
	 * @param {String} param.maximumScreenSpaceError 模型精度，1最高，越大越模糊，默认为4
	 * @param {String} param.modifyZ 模型Z值高度修复，默认为0
	 * @return {Object}
	 */
	addModel({
		id,
		name,
		link,
		visible,
		maximumScreenSpaceError,
		modifyZ,
		loaded,
		focus,
		modelMatrix,
	} = {}) {
		var tileset = this.tileModelCollection.add(
			new Cesium.Cesium3DTileset({
				url: link,
				show: visible === undefined ? true : !!visible,
				maximumScreenSpaceError: maximumScreenSpaceError || 4,
				// maximumNumberOfLoadedTiles: 3000,
				// maximumMemoryUsage: 1024,
				modelMatrix: Cesium.Matrix4.fromArray(
                    modelMatrix || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
				)
			})
		);
		tileset.readyPromise.then((tileset) => {
			if (modifyZ && !modelMatrix) {
				var boundingSphere = tileset.boundingSphere;
				var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
				var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
				var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, modifyZ || 0);
				var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
				tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
			}
			if (focus) {
				this.viewer.flyTo(tileset);
			}
			// viewer.zoomTo(tileset);
		}).otherwise(function () {});

		tileset.allTilesLoaded.addEventListener(() => {
			loaded && loaded(tileset);
		});

		var _model = {
			name,
			id: id || Cesium.createGuid(),
			link: link,
			model: tileset,
			visible: visible === undefined ? true : !!visible,
			modelMatrix: modelMatrix,
		};
		this.models.push(_model);
		return _model;
	}

	/**
	 * 根据模型ID删除模型
	 * @param {String} id 模型ID
	 * @return this
	 */
	removeModel(id) {
		const model = this.models.filter((d) => d.id === id)[0];
		if (model && model.model) {
			if (
				model.model instanceof Cesium.Cesium3DTileset &&
				this.tileModelCollection.contains(model.model)
			) {
				this.tileModelCollection.remove(model.model);
			}
			this.models = this.models.filter((d) => d.id !== id);
		}
		return this;
	}
	/**
	 * 设置模型可见度
	 * @param {String} id 模型ID
	 * @param {Boolean} visible  可见性
	 * @return this
	 */
	setModelVisible(id, visible) {
		const model = this.models.filter((d) => d.id === id)[0];
		if (model && model.model) {
			if (model.model instanceof Cesium.Cesium3DTileset) {
				model.model.show = visible;
			}
			for (let i = 0; i < this.models.length; i++) {
				let md = this.models[i];
				if (md.id === model.id) {
					md.visible = visible;
				}
			}
		}
		return this;
	}

	addPopup(popup, id) {
		id = id || Cesium.createGuid();
		this.popups.push({id, popup});
	}

	removePopup(id) {
		for(let i = 0; i < this.popups.length; i++) {
			const popup = this.popups[i];
			if(popup.id === id && popup.popup) {
				popup.popup.destroy();
			}
		}
	}

	clearPopup() {
		this.popups.forEach((popup) => {
			popup.popup && popup.popup.destroy();
		});
		this.popups = [];
	}

	/**
	 * 获取视图中心值
	 * @return {Object} {x, y, z, heading, roll, pitch}
	 */
	getViewPoint() {
		const viewer = this.viewer;
		return wutu3d.point.getCameraView(viewer, true);
	}

	/**
	 * 设置视图中心
	 * @param {Object} viewpoint {x, y, z, heading, roll, pitch}
	 */
	setViewpoint(viewpoint, options) {
		if(viewpoint) {
			this.viewer.wutu3d.centerAt(viewpoint, options);
		}
	}

	/**
	 * 初始化视图控制器
	 * @private
	 * @param {String|HTMLElement} container 地图DIV容器
	 * @return {Cesium.Viewer}
	 */
	_initViewer(container) {
		const {
			sceneModePicker,
			vrButton,
			baseLayerPicker,
			fullscreenButton,
			navigationHelpButton,
			imageryProvider,
			homeButton,
			currentTime,
		} = this.option;
		let viewer = new Cesium.Viewer(container || 'map', {
			geocoder: false,
			homeButton: homeButton,
			sceneModePicker: sceneModePicker,
			fullscreenButton: fullscreenButton,
			vrButton: vrButton,
			baseLayerPicker: baseLayerPicker,
			infoBox: false,
			selectionIndicator: false,
			animation: false,
			timeline: false,
			shouldAnimate: true,
			clockViewModel: currentTime ? getClockViewModel(currentTime) : undefined,
			navigationHelpButton: navigationHelpButton,
			navigationInstructionsInitiallyVisible: false,
			imageryProvider: imageryProvider ||
				new Cesium.SingleTileImageryProvider({
					url: SINGLE_MAP_IMAGE,
				}),
			contextOptions: {
				webgl: {
					alpha: true,
				},
			},
		});

		viewer.wutu3d = new wutu3d.ViewerEx(viewer, {
            contextmenu: false,
            center: this.option.viewpoint || undefined,
			mouseZoom: false,
			contextmenuItems: [],
        });

		return viewer;
	}

	_plusEntity(entity) {
		if(!entity) return;
		let attr = entity.attribute && entity.attribute.attr;
		let style = entity.attribute && entity.attribute.style;
		//解决模型穿透
		// if(entity.billboard) {
		// 	entity.billboard.translucencyByDistance = undefined;
		// 	entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
		// 	entity.billboard.eyeOffset = new Cesium.Cartesian3(0, 0, -10);
		// }
		// if(entity.label) {
		// 	entity.label.translucencyByDistance = undefined;
		// 	entity.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
		// 	entity.label.eyeOffset = new Cesium.Cartesian3(0, 0, -10);
		// }
		if(style && attr.animateLine) {
			entity.polyline.material =  new wutu3d.LineFlowMaterial({//动画线材质
				color: Cesium.Color.fromCssColorString(style.color || "#ff0000"),
				duration: style.duration || 10000, //时长，控制速度
				url: style.image || './images/texture/route.png'
			});
		}
		if(style && attr.wave) {
			entity.ellipse.material = new wutu3d.CircleWaveMaterial({
				duration: style.duration, //动画时长，单位：毫秒
				color: Cesium.Color.fromCssColorString(style.color),
				gradient: style.gradient || 0,
				count: style.count || 2,
			});
		}
	}

	/**
	 * 开启编辑
	 * @param {Boolean} editable
	 */
	setPlotEditable(editable) {
		const pt = this.plotDrawTool;
		pt.hasEdit(editable);
		if(!editable) {
			pt.stopDraw();
			pt.stopEditing();
		}
	}

	/**
	 * 是否编辑中
	 */
	isPlotEditing() {
		return this.plotDrawTool._hasEdit;
	}

	/**
	 * 开始绘制
	 * @param {Object} drawOption 绘制参数，详见说明user.md
	 * @param {Function} callback 绘制完成时加回调
	 */
	startDraw(drawOption, callback) {
		let option = {
			success: (entity) => {
				setEntityAttributes(entity, {
					id: entity.id,
				});
				this._plusEntity(entity);
				callback && callback(entity);
			},
			...drawOption
		}
		this.plotDrawTool.startDraw(option)
	}

	/**
	 * 通过代码添加点位
	 * @param {Object} drawOption 绘制选项
	 * @param {Array} position 位置坐标
	 */
	createPlot(drawOption, position) {
		if(!drawOption || !drawOption.type || !drawOption.style || !position || position[0] === undefined || position.length < 2) return null;
		var entity = this.plotDrawTool.attributeToEntity(drawOption, wutu3d.draw.util.lonlat2cartesian(
			[position[0], position[1], position[2] || 0]
		));
		setEntityAttributes(entity, {
			id: entity.id,
		});
		this._plusEntity(entity);
		return entity;
	}

	/**
	 * 获取对象
	 * @param {String} id 对象ID
	 */
	getPlotById(id) {
		return this.plotDrawTool.getEntityById(id);
	}

	/**
	 * 更新对象样式
	 * @param {String} id 对象ID
	 * @param {Object} style 样式对象
	 */
	updatePlotStyle(id, style) {
		if(!id || !style) return;
		const entity = this.getPlotById(id);
		if(!entity || !entity.attribute) return;
		const attribute = entity.attribute;
		let type = attribute.type;
		if(type === "circle") {
			type = "ellipse";
		}
		if(wutu3d.draw.attr[type]) {
			wutu3d.draw.attr[type].style2Entity(style, entity[type]);
			this._plusEntity(entity);
		}
	}

	/**
	 * 更新样式属性
	 * @param {String} id 对象ID
	 * @param {Object} attrs
	 */
	updatePlotAttribute(id, attrs) {
		const entity = this.getPlotById(id);
		setEntityAttributes(entity, attrs);
	}

	/**
	 * 删除绘制对象
	 * @param {String} id 对象ID
	 */
	deletePlot(id) {
		const entity = this.getPlotById(id);
		entity && this.plotDrawTool.deleteEntity(entity);
	}

	/**
	 * 加载GeoJSON
	 * @param {GeoJSON} geojson
	 */
	loadGeoJSON(geojson) {
		this.plotDrawTool.loadJson(geojson);
		const entities = this.plotDrawTool.getEntitys();
		for(let i = 0; i < entities.length; i++) {
			this._plusEntity(entities[i]);
		}
	}

	/**
	 * 将绘制对象转为Geojson数据
	 */
	toGeoJSON() {
		return this.plotDrawTool.toGeoJSON();
	}

	// 清除所有绘制对象
	clearAllPlots() {
		console.log('清楚所有图标');
		let pt = this.plotDrawTool;
		pt.stopEditing();
		pt.clearDraw();
		pt.deleteAll();
	}


}
