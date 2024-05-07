<template>
  <el-dialog
    :title="$t('metadata.metadataInfo')"
    v-model="dialogVisible"
    top="10vh"
    width="1200px"
    class="metadataDetailDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <div class="mainBox">
      <div class="leftBox">
        <div class="imgBox">
          <el-image
            v-if="form.thumbnailSrc2"
            style="height: 100%"
            :src="form.thumbnailSrc2"
            :preview-src-list="[form.thumbnailSrc2]"
          ></el-image>
        </div>
      </div>
      <div class="rightBox">
        <el-image
          v-if="$parent.pageType == 'metadata' && form.thumbnailSrc"
          fit="fill"
          style="height: 35%; width: 100%"
          :src="form.thumbnailSrc"
          :preview-src-list="[form.thumbnailSrc]"
        ></el-image>

        <ul>
          <li v-if="form.deviceName" class="content-item">
            <div style="display: flex">
              <span class="content-item-left">{{ $t('metadata.cameraID') }}：</span>
              <el-tooltip
                effect="light"
                :content="form.deviceId"
                placement="top-start"
                :disabled="form.deviceId == ''"
              >
                <span class="content-item-right" style="display: inline-block; width: 81%">
                  {{ form.deviceId }}
                </span>
              </el-tooltip>
            </div>
          </li>
          <li v-if="form.deviceName" class="content-item">
            <span class="content-item-left">{{ $t('metadata.cameraName') }}：</span>
            <span class="content-item-right">{{ form.deviceName }}</span>
          </li>
          <li v-if="form.algorithmName" class="content-item">
            <span class="content-item-left">{{ $t('metadata.algoName') }}：</span>
            <span class="content-item-right">{{ form.algorithmName }}</span>
          </li>
          <li v-if="form.taskName" class="content-item">
            <span class="content-item-left">{{ $t('metadata.taskName') }}：</span>
            <span class="content-item-right">{{ form.taskName }}</span>
          </li>
          <li class="content-item">
            <span class="content-item-left">{{ $t('metadata.snapTime') }}：</span>
            <span class="content-item-right">{{ form.captureTime }}</span>
          </li>
          <div
            :class="
              $parent.pageType == 'guard'
                ? 'ulListGuard'
                : form.deviceName
                ? 'ulListDev'
                : 'ulListTask'
            "
          >
            <li v-for="(item, index) in form.properties" :key="index" class="content-item">
              <span class="content-item-left">{{ item.name }}：</span>
              <span class="content-item-right">{{ setProperties(item) }}</span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {},
      rawForm: {
        thumbnailSrc: '',
        thumbnailSrc2: '',
        deviceName: '',
        deviceId: '',
        algorithmName: '',
        taskName: '',
        captureTime: '',
        properties: [],
        metadata: []
      }
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
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        // 避免缓存问题
        this.form = Object.assign({}, this.rawForm, this.$parent.dataForm)
        let attr = []
        for (let i = 0; i < this.form.properties.length; i++) {
          for (let key in this.form.metadata) {
            if (this.form.properties[i].key == key) {
              attr.push(this.form.properties[i])
              break
            }
          }
        }
        this.form.properties = attr
      })
    },

    dialogClosed() {
      this.dialogVisible = false
      this.$parent.dataForm = {}
    },

    setProperties(item) {
      let name = ''
      if (item.type == 'int' || item.type == 'text') {
        name = this.form.metadata[item.key]
      } else if (item.type == 'enum' || item.type == 'bool') {
        item.specs.forEach(item1 => {
          if (item1.value == this.form.metadata[item.key]) name = item1.name
        })
      }
      return name
    }
  }
}
</script>

<style lang="scss">
.metadataDetailDialog {
  .el-dialog__body {
    padding: 10px 20px 20px !important;
    overflow-y: auto;
    .mainBox {
      max-height: 610px;
      display: flex;
      justify-content: space-around;
      .leftBox {
        width: 68%;
        .imgBox {
          height: 100%;
          margin-bottom: 10px;
          text-align: center;
        }
      }
      .rightBox {
        width: 30%;
        .rightImg {
          display: flex;
          justify-content: space-between;
          .rightImgItem {
            width: 48%;
          }
          p {
            margin: 0 0 20px 0;
            text-align: center;
          }
        }
        .content-item {
          line-height: 24px;
          font-size: 16px;
          .content-item-left {
            display: inline-block;
            max-width: 230px;
          }
          .content-item-right {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .ulListGuard {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 352px;
        }
        .ulListDev {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 323px;
        }
        .ulListTask {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 277px;
        }
      }
    }
  }
}
</style>
