<template>
  <el-dialog
    :title="
      repositoryId === ''
        ? isPersonRepo
          ? $t('repo.addPersonRepo')
          : $t('repo.addCarRepo')
        : isPersonRepo
        ? $t('repo.editPersonRepo')
        : $t('repo.editCarRepo')
    "
    v-model="dialogVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale === 'en' ? '120px' : '100px'"
      :rules="rules"
    >
      <el-form-item :label="$t('repo.name') + '：'" prop="repositoryName" class="long-error">
        <el-input
          v-model="form.repositoryName"
          :placeholder="$t('repo.inputName')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('repo.algo') + '：'" prop="algorithmId">
        <el-select
          v-model="form.algorithmId"
          clearable
          :popper-append-to-body="false"
          :placeholder="$t('repo.inputAlgo')"
          :disabled="repositoryId !== ''"
        >
          <el-option
            v-for="(item, index) in algorithmList"
            :key="index"
            :label="item.algorithmName"
            :value="item.algorithmId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('repo.typeOfControlWarehouse') + '：'" prop="repositoryType">
        <el-select v-model="form.repositoryType" :disabled="repositoryId !== ''">
          <el-option
            :label="$t('repo.blacklist')"
            :value="repoType === RepositoryTypeEnum.person ? 2 : 0"
          ></el-option>
          <el-option
            :label="$t('repo.whitelist')"
            :value="repoType === RepositoryTypeEnum.person ? 3 : 1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('repo.remark') + '：'" prop="remark">
        <el-input
          v-model="form.remark"
          :placeholder="$t('repo.inputRemark')"
          type="textarea"
          maxlength="256"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { repositoryType as RepositoryTypeEnum } from '@views/center/algorithm/repository/constant'
import { RepoNameRegx } from '@views/center/algorithm/repository/validator'
export default {
  name: 'repository-form',
  props: {
    repoType: {
      type: Number,
      default: RepositoryTypeEnum.person,
      required: true
    },
    repositoryId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        repositoryName: undefined,
        repositoryType: undefined, // 根据库类型设置默认黑白名单
        algorithmId: undefined,
        remark: undefined
      },
      algorithmList: [],
      loading: false,
      RepositoryTypeEnum: RepositoryTypeEnum
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    rules() {
      return {
        repositoryName: [
          {
            required: true,
            message: this.isPersonRepo
              ? this.$t('repo.inputPersonRepoName')
              : this.$t('repo.inputCarRepoName'),
            trigger: 'blur'
          },
          {
            pattern: RepoNameRegx,
            message: this.isPersonRepo
              ? this.$t('repo.personRepoRule')
              : this.$t('repo.carRepoNameRule'),
            trigger: 'blur'
          },
          {
            max: 64,
            message: this.$t('repo.repoNameLengthRule')
          }
        ],
        algorithmId: [
          {
            required: true,
            message: this.$t('repo.inputAlgo'),
            trigger: 'blur'
          }
        ],
        repositoryType: [
          {
            required: true,
            message: this.$t('algoGuard.selectTheTypeOfControlLibrary'),
            trigger: 'blur'
          }
        ]
      }
    },
    isPersonRepo() {
      return this.repoType === RepositoryTypeEnum.person
    }
  },
  mounted() {
    this.getAlgorithmList()
  },
  methods: {
    dialogOpen() {
      if (this.repositoryId !== '') {
        this.getRepositoryItemDetail()
      } else {
        this.form.repositoryType = this.isPersonRepo ? 2 : 0
      }
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.resetForm()
      this.dialogVisible = false
    },
    resetForm() {
      this.form = {
        repositoryName: undefined,
        repositoryType: undefined,
        algorithmId: undefined,
        remark: undefined
      }
      this.$resetForm('form')
    },
    async getRepositoryItemDetail() {
      const res = await this.$api[this.isPersonRepo ? 'getNewRepositoryInfo' : 'getNewCar']({
        repositoryId: this.repositoryId
      })
      if (res.resultCode !== 0) {
        this.dialogVisible = false
        return false
      }
      this.form = {
        repositoryId: res.repositoryId,
        repositoryName: res.repositoryName,
        repositoryType: res.repositoryType,
        algorithmId: res.algorithmId,
        remark: res.remark
      }
    },
    async submitForm() {
      const valid = await this.$refs.form.validate().catch(err => err)
      if (valid !== true) return false
      this.loading = true
      try {
        const form = JSON.parse(JSON.stringify(this.form))
        let res
        if (this.repositoryId === '') {
          // 新增
          res =
            await this.$api[this.isPersonRepo ? 'addNewRepositoryInfo_people' : 'addNewCar'](form)
        } else {
          // 编辑
          res =
            await this.$api[this.isPersonRepo ? 'modifyNewRepositoryInfo' : 'modifyNewCar'](form)
        }
        if (res.resultCode === 0) {
          this.$emit('success', this.form.repositoryType)
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message:
              this.repositoryId === ''
                ? this.$t('public.addSuccess')
                : this.$t('public.modifySuccess')
          })
        }
      } finally {
        this.loading = false
      }
    },
    // 获取算法接入列表
    async getAlgorithmList() {
      let data = {
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
        algorithmType: this.isPersonRepo ? 'FACE_RECOGNIZE' : 'VEHICLE_RECOGNIZE',
        netType: this.$getNetType()
      }
      const res = await this.$api.queryNewAlgorithmList(data)
      if (res.resultCode === 0) this.algorithmList = res.algorithmList
    }
  }
}
</script>
<style scoped>
.el-form-item.long-error {
  margin-bottom: 28px;
}
</style>
