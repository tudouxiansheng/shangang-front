import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
export const ApplicationType = {
  person: 0,
  vehicle: 1
}

// 属性对应字典表key
export const AttributesDictMap = {
  plateColor: 'pcolorOption',
  carColor: 'vcolorOption',
  plateType: 'ptypeOption',
  carType: 'cartypeOption',
  recordTime: 'time',
  direc: 'direcOption',
  sunVisor: 'existOption',
  viceSunVisor: 'existOption',
  mainBelt: 'existOption',
  viceBelt: 'existOption',
  mainCall: 'existOption',
  carPendant: 'existOption',
  napkinBox: 'existOption',
  yearLogo: 'existOption',
  viceDriver: 'existOption',
  headOutSunroof: 'existOption',
  specialVehicleTypeIdx: 'specialVehicleTypeIdxOption',
  licensedVehicle: 'existOption',
  obscuredPlate: 'existOption',
  damagedVehicle: 'existOption',
  sunroof: 'existOption',
  roofRack: 'existOption',
  graffiti: 'existOption',
  spareTire: 'existOption',
  card: 'existOption',
  goods: 'existOption',
  gender: 'sexOption',
  age: 'ageOption',
  feature: 'featureOption',
  otype: 'oTypeOption',
  hair: 'hairOption',
  shape: 'shapeOption',
  upperStyle: 'upperStyleOption',
  lowerColor: 'colorOption',
  upperTexture: 'textureOption',
  lowerStyle: 'lowerStyleOption',
  headLightShape: 'headLightShapeOption',
  bicycleTricycle: 'bicycleTricycleOption',
  subBicycleTricycle: 'subBicycleTricycleOption',
  expression: 'expressionOption',
  view: 'viewOption',
  eyeglass: 'existOption',
  mouthmask: 'existOption',
  calling: 'existOption',
  mustache: 'existOption',
  hat: 'existOption',
  vehicleBrand: 'vehicleBrandList',
  vehicleSub: 'vehicleSubBrandList'
}

export const AttributesTitleMap = {
  cameraName: i18n.t('retrieval.captureCameraName'),
  plateNumber: i18n.t('retrieval.pnr'), // 车牌号
  plateColor: i18n.t('retrieval.pColor'), // 车牌颜色
  carColor: i18n.t('retrieval.vehicleColor'), // 车身颜色
  plateType: i18n.t('retrieval.pType'), // 车牌类型
  carType: i18n.t('retrieval.carType'), // 车辆类型
  recordTime: i18n.t('retrieval.captureTime'), // 抓拍时间
  direc: i18n.t('retrieval.direc'), // 驾驶方向
  sunVisor: i18n.t('retrieval.sunVisor'), // 主驾驶遮阳板
  viceSunVisor: i18n.t('retrieval.viceSunVisor'), // 副驾驶遮阳板
  mainBelt: i18n.t('retrieval.mainBelt'), // 主驾驶安全带
  viceBelt: i18n.t('retrieval.viceBelt'), // 副驾驶安全带
  mainCall: i18n.t('retrieval.mainCalling'), // 主驾驶打电话
  carPendant: i18n.t('retrieval.carPendant'), // 挂饰
  napkinBox: i18n.t('retrieval.napkinBox'), // 纸巾盒
  yearLogo: i18n.t('retrieval.yearLogo'), // 年检标
  viceDriver: i18n.t('retrieval.viceDriver'), // 副驾驶有人
  headOutSunroof: i18n.t('retrieval.headOutSunroof'), // 天窗站人
  specialVehicleTypeIdx: i18n.t('retrieval.specialCarType'), // 特殊车辆类型
  licensedVehicle: i18n.t('retrieval.hasPnr'), // 有无车牌
  obscuredPlate: i18n.t('retrieval.obscuredPlate'), // 车牌遮挡
  damagedVehicle: i18n.t('retrieval.damagedVehicle'), // 撞损车辆
  sunroof: i18n.t('retrieval.sunroof'), // 天窗
  roofRack: i18n.t('retrieval.roofRack'), // 行李架
  graffiti: i18n.t('retrieval.graffiti'), // 车身喷字
  spareTire: i18n.t('retrieval.spareTire'), // 备胎
  card: i18n.t('retrieval.card'), // 卡片
  goods: i18n.t('retrieval.goods'), // 摆件
  dconfidence: i18n.t('retrieval.similarity'), // 相似度
  gender: i18n.t('retrieval.gender'), // 性别
  age: i18n.t('retrieval.age'), // 年龄段
  eyeglass: i18n.t('retrieval.eyeglass'), // 眼镜
  mouthmask: i18n.t('retrieval.mouthMask'), // 口罩
  ageValue: i18n.t('retrieval.specificAge'), // 具体年龄
  hat: i18n.t('retrieval.hat'), // 帽子
  calling: i18n.t('retrieval.calling'), // 打电话
  expression: i18n.t('retrieval.expression'), // 表情
  mustache: i18n.t('retrieval.mustache'), // 胡子
  hair: i18n.t('retrieval.hair'), // 发型
  vehicleBrand: i18n.t('retrieval.vehicleBrand'), // 品牌
  vehicleSub: i18n.t('retrieval.vehicleSubBrand') // 子款
}

// 车辆导出字段
export const VehicleExportAttrs = [
  {
    label: AttributesTitleMap.cameraName,
    value: 'cameraName'
  },
  {
    label: AttributesTitleMap.plateNumber,
    value: 'plateNumber'
  },
  {
    label: AttributesTitleMap.plateColor,
    value: 'plateColor'
  },
  {
    label: AttributesTitleMap.carColor,
    value: 'carColor'
  },
  {
    label: AttributesTitleMap.plateType,
    value: 'plateType'
  },
  {
    label: AttributesTitleMap.carType,
    value: 'carType'
  },
  {
    label: AttributesTitleMap.recordTime,
    value: 'recordTime'
  },
  {
    label: AttributesTitleMap.direc,
    value: 'direc'
  },
  {
    label: AttributesTitleMap.sunVisor,
    value: 'sunVisor'
  },
  {
    label: AttributesTitleMap.viceSunVisor,
    value: 'viceSunVisor'
  },
  {
    label: AttributesTitleMap.mainBelt,
    value: 'mainBelt'
  },
  {
    label: AttributesTitleMap.viceBelt,
    value: 'viceBelt'
  },
  {
    label: AttributesTitleMap.mainCall,
    value: 'mainCall'
  },
  {
    label: AttributesTitleMap.carPendant,
    value: 'carPendant'
  },
  {
    label: AttributesTitleMap.napkinBox,
    value: 'napkinBox'
  },
  {
    label: AttributesTitleMap.yearLogo,
    value: 'yearLogo'
  },
  {
    label: AttributesTitleMap.viceDriver,
    value: 'viceDriver'
  },
  {
    label: AttributesTitleMap.headOutSunroof,
    value: 'headOutSunroof'
  },
  {
    label: AttributesTitleMap.specialVehicleTypeIdx,
    value: 'specialVehicleTypeIdx'
  },
  {
    label: AttributesTitleMap.licensedVehicle,
    value: 'licensedVehicle'
  },
  {
    label: AttributesTitleMap.obscuredPlate,
    value: 'obscuredPlate'
  },
  {
    label: AttributesTitleMap.damagedVehicle,
    value: 'damagedVehicle'
  },
  {
    label: AttributesTitleMap.sunroof,
    value: 'sunroof'
  },
  {
    label: AttributesTitleMap.roofRack,
    value: 'roofRack'
  },
  {
    label: AttributesTitleMap.graffiti,
    value: 'graffiti'
  },
  {
    label: AttributesTitleMap.spareTire,
    value: 'spareTire'
  },
  {
    label: AttributesTitleMap.card,
    value: 'card'
  },
  {
    label: AttributesTitleMap.goods,
    value: 'goods'
  },
  {
    label: AttributesTitleMap.vehicleBrand,
    value: 'vehicleBrand'
  },
  {
    label: AttributesTitleMap.vehicleSub,
    value: 'vehicleSub'
  }
]

// 车辆导出字段 - 英文
export const VehicleExportAttrsENG = [
  {
    label: AttributesTitleMap.cameraName,
    value: 'cameraName'
  },
  {
    label: AttributesTitleMap.plateNumber,
    value: 'plateNumber'
  },
  {
    label: AttributesTitleMap.carColor,
    value: 'carColor'
  },
  {
    label: AttributesTitleMap.carType,
    value: 'carType'
  },
  {
    label: AttributesTitleMap.vehicleBrand,
    value: 'vehicleBrand'
  },
  {
    label: AttributesTitleMap.vehicleSub,
    value: 'vehicleSub'
  },
  {
    label: AttributesTitleMap.recordTime,
    value: 'recordTime'
  }
]

//人像导出字段
export const PersonExportAttrs = [
  {
    label: AttributesTitleMap.cameraName,
    value: 'cameraName'
  },
  {
    label: AttributesTitleMap.recordTime,
    value: 'recordTime'
  },
  {
    label: AttributesTitleMap.dconfidence,
    value: 'dconfidence'
  },
  {
    label: AttributesTitleMap.gender,
    value: 'gender'
  },
  {
    label: AttributesTitleMap.age,
    value: 'age'
  },
  {
    label: AttributesTitleMap.eyeglass,
    value: 'eyeglass'
  },
  {
    label: AttributesTitleMap.mouthmask,
    value: 'mouthmask'
  },
  {
    label: AttributesTitleMap.ageValue,
    value: 'ageValue'
  },
  {
    label: AttributesTitleMap.hat,
    value: 'hat'
  },
  {
    label: AttributesTitleMap.expression,
    value: 'expression'
  },
  {
    label: AttributesTitleMap.mustache,
    value: 'mustache'
  },
  {
    label: AttributesTitleMap.hair,
    value: 'hair'
  }
]

// 人像导出字段 - 英文
export const PersonExportAttrsENG = [
  {
    label: AttributesTitleMap.cameraName,
    value: 'cameraName'
  },
  {
    label: AttributesTitleMap.recordTime,
    value: 'recordTime'
  },
  {
    label: AttributesTitleMap.dconfidence,
    value: 'dconfidence'
  }
]
