<template>
  <el-dialog
    :title="$t('deviceManagement.captureDetails')"
    v-model="$parent.detailDialogVisible"
    top="10vh"
    width="1200px"
    class="gat1400SnapDetail"
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
            fit="fill"
            style="width: 100%; max-height: 100%"
            :src="form.largeImageSrc"
            :preview-src-list="[form.largeImageSrc]"
          ></el-image>
        </div>
      </div>
      <div class="rightBox">
        <el-image
          fit="fill"
          style="height: 200px"
          :src="form.captureImageSrc"
          :preview-src-list="[form.captureImageSrc]"
        ></el-image>

        <ul>
          <li class="content-item">
            <div style="display: flex; margin-right: 20px">
              <span class="content-item-left" :style="{ width: locale == 'en' ? '120px' : '82px' }">
                {{ $t('deviceManagement.deviceID2') + ':' }}
              </span>
              <el-tooltip
                effect="light"
                :content="form.deviceId"
                placement="top-start"
                :disabled="form.deviceId == ''"
              >
                <span class="content-item-right" style="display: inline-block; width: 70%">
                  {{ form.deviceId }}
                </span>
              </el-tooltip>
            </div>
            <div style="display: inline-block">
              <span class="content-item-left" :style="{ width: locale == 'en' ? '120px' : '82px' }">
                {{ $t('deviceManagement.deviceName') + ':' }}
              </span>
              <span class="content-item-right">{{ form.deviceName }}</span>
            </div>
          </li>
          <li class="content-item" style="width: 100%">
            <span class="content-item-left" :style="{ width: locale == 'en' ? '120px' : '82px' }">
              {{ $t('deviceManagement.captureTime') + ':' }}
            </span>
            <span class="content-item-right">{{ form.captureTime }}</span>
          </li>
          <div
            style="font-weight: 700; margin-top: 10px; font-size: 16px"
            v-if="$parent.choosedDataType == 99"
          >
            {{ $t('deviceManagement.rawData') + ':' }}
          </div>
          <div>
            <li
              v-for="(value, key, index) in form.attributes"
              :key="index"
              class="content-item"
              style="width: 100%"
            >
              <span class="content-item-right">{{ setAttributes(key, value) }}</span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { faceAttr, personAttr, motorAttr, nonMotorAttr } from './snap.js'
import { getFormatDate } from '@/utils/common/mutil'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        largeImagePath: '',
        captureImagePath: '',
        deviceId: '',
        deviceName: '',
        captureTime: ''
      },

      attrList: []
    }
  },

  created() {},

  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.accessDetailVisible = false
      this.$parent.dataForm = {}
    },

    setAttributes(key, value) {
      if (this.$parent.choosedDataType == 99) {
        return key + ' : ' + value
      }
      let snapData = {}
      switch (this.$parent.choosedDataType) {
        case 1:
          snapData = faceAttr
          break
        case 2:
          snapData = personAttr
          break
        case 3:
          snapData = motorAttr
          break
        case 4:
          snapData = nonMotorAttr
          break
      }
      for (let i = 0; i < snapData.length; i++) {
        if (Object.keys(snapData[i][0]) == key) {
          if (snapData[i].length > 1) {
            return snapData[i][0][key] + ' : ' + this.setValue(value, snapData[i][1])
          } else {
            if (key != 'passTime') {
              return snapData[i][0][key] + ' : ' + value
            } else {
              //处理long格式日期
              return snapData[i][0][key] + ' : ' + getFormatDate(value)
            }
          }
        }
      }
    },

    setValue(value, arr) {
      let val = ''
      arr.filter(item => {
        if (item.value == value) {
          val = item.name
        }
      })
      return val
    }
  }
}
</script>

<style lang="scss">
.gat1400SnapDetail {
  .el-dialog__body {
    padding: 10px 20px 20px !important;
    max-height: none !important;

    .imgBox {
      height: 100%;
      margin-bottom: 10px;
      text-align: center;
    }

    .content-item {
      line-height: 24px;
      font-size: 16px;
      .content-item-left {
        display: inline-block;
        width: 12%;
        min-width: 82px;
      }
      .content-item-right {
        width: 75%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .mainBox {
    display: flex;
    justify-content: space-around;
  }
  .leftBox {
    width: 68%;
  }
  .rightBox {
    width: 30%;
  }
  .el-dialog__body {
    max-height: 480px !important;
  }
}
</style>
