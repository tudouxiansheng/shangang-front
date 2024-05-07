import { i18n as i18nn } from '@/i18n'
const i18n = i18nn.global
export const repositoryType = {
  person: 1,
  vehicle: 2
}

export const repositoryNatureType = {
  personBlack: 2,
  personWhite: 3,
  vehicleBlack: 0,
  vehicleWhite: 1
}

export const headerText = {
  patchPicture: i18n.t('repo.patchPicture'),
  name: i18n.t('repo.fullName'),
  bornTime: i18n.t('repo.birthday'),
  country: i18n.t('repo.country'),
  credentialType: i18n.t('repo.IDType'),
  credentialNumber: i18n.t('repo.IDNum'),
  gender: i18n.t('repo.gender'),
  nationality: i18n.t('repo.nation'),
  occupation: i18n.t('repo.occupation'),
  age: i18n.t('repo.age'),
  phoneNum: i18n.t('repo.phoneNum'),
  ownerName: i18n.t('repo.carOwnerName'),
  lpn: i18n.t('repo.license'),
  vehicleType: i18n.t('repo.carType'),
  vehicleColor: i18n.t('repo.carColor'),
  vehicleBrand: i18n.t('repo.brand'),
  vehicleSub: i18n.t('repo.carSub'),
  vehicleYear: i18n.t('repo.yearType'),
  remark: i18n.t('repo.remark'),
  errorMessage: i18n.t('repo.errorMessage')
}

export const imageContentType = ['image/jpeg', 'image/png']

export const photoStateOption = [
  {
    name: i18n.t('repo.featureExtractionSuccess'),
    value: 0
  },
  {
    name: i18n.t('repo.featureInExtraction'),
    value: 1
  },
  {
    name: i18n.t('repo.featureExtractionPending'),
    value: 4
  },
  {
    name: i18n.t('repo.featureExtractionFailure'),
    value: 7
  },
  {
    name: i18n.t('repo.featureExtractionError'),
    value: 9
  }
]

export const genderList = [
  {
    name: i18n.t('repo.man'),
    value: 1
  },
  {
    name: i18n.t('repo.woman'),
    value: 2
  },
  {
    name: i18n.t('repo.unknown'),
    value: 0
  }
]
