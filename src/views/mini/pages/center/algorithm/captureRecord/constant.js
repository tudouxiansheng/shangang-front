import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
export const CaptureType = {
  person: 1,
  vehicle: 2
}

// 属性对应字典表key
export const AttributesDictMap = {
  plateNumber: 'text',
  plateColor: 'pcolorOption',
  carColor: 'vcolorOption',
  plateType: 'ptypeOption',
  carType: 'cartypeOption',
  direc: 'direcOption',
  sunVisor: 'vehicleExistOption',
  viceSunVisor: 'vehicleExistOption',
  mainBelt: 'vehicleExistOption',
  viceBelt: 'vehicleExistOption',
  mainCall: 'vehicleExistOption',
  carPendant: 'vehicleExistOption',
  napkinBox: 'vehicleExistOption',
  yearLogo: 'vehicleExistOption',
  viceDriver: 'vehicleExistOption',
  headOutSunroof: 'vehicleExistOption',
  specialVehicleTypeIdx: 'specialVehicleTypeIdxOption',
  licensedVehicle: 'vehicleExistOption',
  obscuredPlate: 'vehicleExistOption',
  damagedVehicle: 'vehicleExistOption',
  sunroof: 'vehicleExistOption',
  roofRack: 'vehicleExistOption',
  graffiti: 'vehicleExistOption',
  spareTire: 'vehicleExistOption',
  card: 'vehicleExistOption',
  goods: 'vehicleExistOption',
  gender: 'sexOption',
  age: 'ageOption',
  feature: 'existOption',
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
  hat: 'existOption'
}

export const AttributesTitleMap = {
  plateNumber: i18n.t('retrieval.pnr'), // 车牌号
  plateColor: i18n.t('retrieval.pColor'), // 车牌颜色
  carColor: i18n.t('retrieval.vehicleColor'), // 车身颜色
  plateType: i18n.t('retrieval.pType'), // 车牌类型
  carType: i18n.t('retrieval.carType'), // 车辆类型
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
  hair: i18n.t('retrieval.hair') // 发型
}
