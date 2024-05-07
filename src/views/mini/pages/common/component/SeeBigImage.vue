<template>
  <div class="box">
    <el-dialog
      :title="
        parentPage != 'metadata' ? $t('alarmList.snapImgDetails') : $t('snapList.showOriginalImage')
      "
      v-model="$parent.ImageDialogVisible"
      top="10vh"
      width="500px"
      @closed="dialogClosed"
      @open="dialogOpen"
      class="seebigImgdialog"
      :close-on-click-modal="false"
      :modal="false"
      draggable
    >
      <div class="imgBox">
        <el-image
          v-if="form.urlSrc"
          fit="contain"
          style="width: 100%; height: 100%"
          :src="form.urlSrc"
          :preview-src-list="[form.urlSrc]"
        ></el-image>
      </div>
      <el-row :gutter="20" v-if="parentPage != 'metadata'">
        <el-col :span="12">
          <span class="devSty">{{ form.devName }}</span>
        </el-col>
        <el-col :span="10">
          <span style="color: #000">{{ form.snapTime }}</span>
        </el-col>
        <el-col :span="2">
          <el-icon @click="downImg(form)" style="color: #000; font-size: 18px"
            ><el-icon-download
          /></el-icon>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { Download as ElIconDownload } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconDownload
  },
  props: {
    parentPage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        url: '',
        devName: '',
        snapTime: '',
        contentName: '',
        urlSrc: ''
      },
      rawForm: {
        url: '',
        devName: '',
        snapTime: '',
        contentName: '',
        urlSrc: ''
      }
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = Object.assign({}, this.rawForm, this.$parent.rowData)
      })
    },

    dialogClosed() {
      this.$parent.ImageDialogVisible = false
      this.$parent.rowData = {}
      this.form = this.rawForm
    },

    // 下载图片
    downImg(row) {
      let param = {
        fileName: row.contentName,
        downloadUrl: row.urlSrc
      }
      window.webkitProc('snap_download', JSON.stringify(param))
    }
  }
}
</script>

<style lang="scss">
.seebigImgdialog {
  .el-dialog__body {
    padding: 10px 20px;
    .imgBox {
      height: 290px;
      margin-bottom: 10px;
    }
    .devSty {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      width: 100%;
      color: #000;
    }
  }
}
</style>
