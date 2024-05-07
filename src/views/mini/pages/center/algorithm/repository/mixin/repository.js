import { photoStateOption, repositoryType as RepositoryTypeEnum } from '../constant'
import { getBlobByGET } from '@/utils/common/download'
import { handleGetPreview } from '@/utils/common/preViewImg'
import { sStorage } from '@/utils/common/store'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      objectFormDialogVisible: false,
      objectViewDialogVisible: false,
      currentObjectId: '',
      initialFile: undefined,
      isIndeterminate: false,
      checkAll: false,
      checkedData: [],
      batchDialogVisible: false, //批量操作对话框
      batchData: [],
      operate: '', //批量操作
      batchApi: '', //批量操作接口
      multipleSelectionMany: [],
      importFormDialogVisible: false,
      batchOperationDialogTitle: '',
      operations: [],
      doBatchOperation: () => {},
      customErrorColumn: []
    }
  },
  computed: {
    isPersonRepo() {
      return this.pageType === RepositoryTypeEnum.person
    },
    ...mapState({
      photoStateOption: state => state.dict['ars-repo-picture-photoState'] //特征提取结果
    })
  },
  mounted() {
    window.addEventListener('resize', this.initWrapperHeight)
    this.initWrapperHeight()
    this.getDictionaryList()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.initWrapperHeight)
  },
  activated() {
    this.routeIn()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    getDictionaryList() {
      this.getSysDictData(['ars-repo-picture-photoState'])
    },
    /**
     * @description 获取当前布控库布控对象列表
     */
    async getRepositoryItemList() {
      if (!this.pageType) return false
      this.loading = true
      try {
        const queryParams = JSON.parse(JSON.stringify(this.queryParams))
        const listKey = this.isPersonRepo ? 'personList' : 'vehicleList'
        const res = await this.$api[
          this.isPersonRepo ? 'getRepositoryPersonList' : 'getRepositoryVehicleList'
        ]({
          repositoryId: this.currentRepositoryId,
          ...queryParams
        })
        if (res[listKey] && res[listKey].length > 0) {
          this.tableData = res[listKey].map(item => {
            const attr = this.isPersonRepo ? 'faceList' : 'vehiclePhotos'
            item[attr][0].previewPhotoPath = handleGetPreview(item[attr][0].photoPath)
            return item
          })
          this.total = res.pageInfo.totalNum
        } else {
          this.tableData = []
          this.total = 0
        }
        this.checkedData = []
        this.isIndeterminate = false
        this.checkAll = false
      } finally {
        this.loading = false
      }
    },
    onRepoItemEditSuccess() {
      if (this.initialFile instanceof File) {
        this.initialFile = undefined
      }
      this.getRepositoryItemList()
    },
    handleCheckAllChange(val) {
      this.checkedData = val ? this.tableData : []
      this.isIndeterminate = false
    },
    handleCheckedDataChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tableData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length
    },
    /**
     * @description 新增布控对象
     * */
    handleAddObject(file) {
      if (!this.pageType) return false
      this.currentObjectId = ''
      if (file instanceof File) {
        this.initialFile = file
      }
      this.objectFormDialogVisible = true
    },
    /**
     * @description 编辑布控对象
     * */
    handleEditObject(row) {
      if (!this.pageType) return false
      const fieldKey = this.isPersonRepo ? 'personId' : 'vehicleId'
      this.currentObjectId = row[fieldKey]
      this.objectFormDialogVisible = true
    },
    /**
     * @description 批量删除布控对象
     * */
    async handleDelObject(row) {
      if (!this.pageType) return false
      const fieldKey = this.isPersonRepo ? 'personId' : 'vehicleId'
      let flag
      if (this.isPersonRepo) {
        if (this.locale === 'en' && !row[fieldKey] && this.checkedData.length !== 1) {
          flag = 'repo.deleteTargetPrompts'
        } else {
          flag = 'repo.deleteTargetPrompt'
        }
      } else {
        if (this.locale === 'en' && !row[fieldKey] && this.checkedData.length !== 1) {
          flag = 'repo.deleteVehiclePrompts'
        } else {
          flag = 'repo.deleteVehiclePrompt'
        }
      }
      try {
        await this.$confirm(
          this.$t(flag, {
            num: row[fieldKey] ? 1 : this.checkedData.length
          }),
          this.$t('public.prompt'),
          {
            confirmButtonText: this.$t('public.confirm'),
            cancelButtonText: this.$t('public.cancel'),
            type: 'warning'
          }
        )
        let formData
        if (row[fieldKey]) {
          formData = {
            fieldKey: row[fieldKey],
            repositoryId: this.currentRepositoryId
          }
          formData = JSON.parse(JSON.stringify(formData).replace(/fieldKey/g, fieldKey))
          const res =
            await this.$api[this.isPersonRepo ? 'deleteNewPersonInfo' : 'deleteNewVehicleInfo'](
              formData
            )
          if (res.resultCode === 0) {
            this.$message({
              type: 'success',
              message: this.isPersonRepo
                ? this.$t('repo.delPersonSucc')
                : this.$t('repo.delCarSucc')
            })
            this.queryParams.pageInfo.pageNum = 1
            this.getRepositoryItemList()
          }
        } else {
          formData = this.checkedData.map(item => {
            return {
              fieldKey: item[fieldKey],
              repositoryId: this.currentRepositoryId
            }
          })
          formData = JSON.parse(JSON.stringify(formData).replace(/fieldKey/g, fieldKey))
          this.operate = this.$t('public.batchDeletionContent')
          this.batchApi = this.isPersonRepo ? 'deleteNewPersonInfo' : 'deleteNewVehicleInfo'
          this.batchData = this.checkedData
          this.multipleSelectionMany = formData
          this.batchDialogVisible = true
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: this.$t('public.canceledDelete')
        })
      }
    },
    async beforeBatchOperate(obj) {
      if (obj.transfer) {
        return obj
      }
      if (obj.patchPicture && obj.patchPicture.length > 0) {
        let patchPicture = []
        for (let i = 0; i < obj.patchPicture.length; i++) {
          let file
          if (obj.patchPicture[i] instanceof File) {
            file = obj.patchPicture[i]
          } else {
            const blob = await getBlobByGET(obj.patchPicture[i])
            file = new File(
              [blob],
              `${new Date().getTime() + Math.round(Math.random() * 10)}.${blob.type.split('/')[1]}`,
              {
                type: blob.type
              }
            )
          }
          const imageFormData = new FormData()
          imageFormData.append('file', file)
          imageFormData.append(
            'api',
            this.isPersonRepo ? '/api/ars/repository/person/add' : '/api/ars/repository/vehicle/add'
          )
          imageFormData.append('netType', this.$getNetType())
          const res = await this.$api.uploadFile(imageFormData)
          if (res.fileId) {
            patchPicture.push(res.fileId)
          }
        }
        obj.patchPicture = patchPicture
      }
      return obj
    },
    async handleImportObject(data, imagesFile) {
      if (!this.pageType) return false
      let formData = data.map(item => {
        return Object.keys(item)
          .filter(key => item[key] !== null && item[key] !== undefined)
          .reduce((acc, key) => ({ ...acc, [key]: item[key] }), {})
      })
      try {
        for (const [index, row] of formData.entries()) {
          if (!row.patchPicture) {
            row.patchPicture = imagesFile[index].name
          }
          let imagePaths = row.patchPicture.split(';').filter(i => i)
          row.patchPicture = []
          for (let i = 0; i < imagePaths.length; i++) {
            let image = imagesFile.find(item => item.name === imagePaths[i])
            row.patchPicture.push(image)
          }
          row.repositoryId = this.currentRepositoryId
          if (row.age) {
            row.age = Number(row.age)
          }
          if (row.gender) {
            row.gender = Number(row.gender)
          }
          if (row.credentialType) {
            row.credentialType = Number(row.credentialType)
          }
          if (row.vehicleType) {
            row.vehicleType = Number(row.vehicleType)
          }
          if (row.vehicleColor) {
            row.vehicleColor = Number(row.vehicleColor)
          }
          if (row.vehicleBrand) {
            row.vehicleBrand = Number(row.vehicleBrand)
          }
          if (row.vehicleSub) {
            row.vehicleSub = Number(row.vehicleSub)
          }
        }
        this.operations = formData
        this.batchOperationDialogTitle = this.$t('public.batchImport')
        this.customErrorColumn = this.isPersonRepo
          ? [
              {
                prop: 'name',
                label: this.$t('repo.fullName'),
                minWidth: '130'
              }
            ]
          : [
              {
                prop: 'lpn',
                label: this.$t('repo.license'),
                minWidth: '130'
              }
            ]
        this.doBatchOperation = this.isPersonRepo
          ? this.$api.batchAddNewPerson
          : this.$api.batchAddNewVehicle
        this.$nextTick(() => {
          this.$refs.batchOperation.batchOperation()
        })
      } catch (e) {
        this.$message.error(this.$t('repo.importFailed'))
      }
    },
    getPhotoPath(photoPath) {
      return photoPath
    },
    handleView(row) {
      if (!this.pageType) return false
      const fieldKey = this.isPersonRepo ? 'personId' : 'vehicleId'
      this.currentObjectId = row[fieldKey]
      this.objectViewDialogVisible = true
    },
    formatPhotoState(val) {
      return this.selectDictLabel(this.photoStateOption, String(val), {
        key: 'name',
        value: 'value'
      })
    },
    routeIn() {
      if (Object.keys(this.$route.params).length > 0) {
        const { repositoryId, repositoryType, file } = this.$route.params
        this.$nextTick(() => {
          this.$refs.repositoryList.loadSpecifyRepo(repositoryType, repositoryId)
          this.handleAddObject(file)
        })
      }
    },
    /** 初始化容器高度 背景色问题 */
    initWrapperHeight() {
      let timer = setTimeout(() => {
        this.$nextTick(function () {
          let mainCenter = document.getElementById('main-center')
          if (this.$refs.controlRepository.style) {
            this.$refs.controlRepository.style.height = mainCenter.clientHeight + 'px'
          }
          clearTimeout(timer)
        })
      }, 20)
    }
  }
}
