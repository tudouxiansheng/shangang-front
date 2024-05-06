<template>
  <!-- 收藏夹添加/修改节点 -->
  <el-dialog
    :title="$parent.operation ? $t('favorite.addFavorite') : $t('favorite.editFavorite')"
    :visible.sync="$parent.dialogFormVisible"
    top="10vh"
    width="500px"
    :close-on-click-modal="false"
    class="favorite-dialog"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    v-dialogDrag
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="$parent.locale == 'en' ? '120px' : '100px'"
      label-position="right"
    >
      <el-form-item :label="$t('favorite.favoriteName') + '：'" prop="favoriteName">
        <el-input v-model="form.favoriteName" :placeholder="$t('favorite.namePrompt')" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('gis.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
          {{ $t('gis.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        favoriteName: '', // 名称
      },

      rules: {},
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setFormRules()
    },
  },
  mounted() {
    this.setFormRules()
  },

  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.form = Object.assign({}, this.form, this.$parent.dataForm)
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    },

    setFormRules() {
      var reg = /[\s!#$%^&*()<>\\]+/
      // 验证名称
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('favorite.namePrompt')))
        } else {
          if (reg.test(value)) {
            callback(new Error(this.$t('gis.nameError1')))
          }
          callback()
        }
      }

      this.rules = {
        favoriteName: [
          {
            required: true,
            validator: validateUsername,
            trigger: 'blur',
          },
          {
            min: 1,
            max: 32,
            message: this.$t('gis.nameError2'),
            trigger: 'blur',
          },
        ],
      }
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$parent.maskloading = true

          let data = {
            favoriteName: this.form.favoriteName,
          }

          if (!this.$parent.operation) {
            Object.assign(data, {
              favoriteId: this.form.favoriteId,
            })
            // 编辑收藏夹
            this.$api.modifyFavoriteInfo(data).then((res) => {
              this.successResult(res, this.$t('gis.modifySuccess'))
            })
          } else {
            Object.assign(data, {
              parentId: this.form.favoriteId,
            })

            // 添加收藏夹
            this.$api.addFavoriteInfo(data).then((res) => {
              this.successResult(res, this.$t('gis.addSuccess'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title,
        })
        this.$parent.favoriteRefresh()
      }
      this.$parent.maskloading = false
    },
  },
}
</script>

<style lang="scss">
.favorite-dialog {
  .el-dialog__body {
    padding: 15px 40px 5px;
  }
}
</style>
