<style lang="scss" scoped>
.camera-algorithm-editor {
}
</style>
<template>
  <div
    class="camera-algorithm-editor"
    v-loading="loading"
    element-loading-text="加载数据中..."
    element-loading-spinner="el-icon-loading"
  >
    <div style="display: flex">
      <div style="flex: 1">
        <CameraTree1
          :selected-options="value || []"
          @update:selectedOptions="$emit('input', $event)"
          :focused-item.sync="currentCamera"
          canModify
          ref="camera"
          :dataOption="{
            dataType: 'camera',
            single: false,
            strictly: true,
            showAllSel: false,
          }"
          :disableIds="[]"
          :platType="is1800 ? 14 : 16"
        ></CameraTree1>
        <AlgorithmSelect
          style="margin-top: 38px"
          v-if="currentCamera"
          :value="currentCamera"
          @input="currentCamera = { ...$event }"
        />
      </div>
      <div style="flex: 1; padding-left: 88px">
        <CameraDrawer
          v-if="currentCamera"
          :key="currentCamera.id"
          :on-load-image="loadLiveImage"
          v-model="currentCamera.dashData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AlgorithmSelect from '../AlgorithmSelect/index.vue'
import CameraTree1 from '@components/CameraTree1'

export default {
  components: {
    AlgorithmSelect,
    CameraDrawer: () => import('@views/mini/pages/common/algorithm/intelligent-task/components/CameraDrawer/index.vue'),
    CameraTree1,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    is1800: {
      type: Boolean,
    },
  },
  watch: {
    EMIYA: function (val) {},
  },
  computed: {},
  data() {
    return {
      algorithmOptions: [],
      loading: false,
      currentCamera: null,
    }
  },
  async created() {},
  methods: {
    async loadLiveImage() {
      return (await this.$api.getCameraLiveCover({ cameraId: this.currentCamera.id })).base64
    },
  },
}

// [
// {
//   "id": "00000024022714010301000000000036",
//   "label": "周界7",
//   "type": "2",
//   "payload": {
//     "deviceId": "00000024022714010301000000000036",
//     "deviceName": "周界7",
//     "deviceType": 1,
//     "mainDevId": "00000024022714010303000000000035",
//     "type": 1,
//     "status": 1,
//     "deviceStatus": 0,
//     "organizationId": 2,
//     "platId": "0000000000001401",
//     "thirdId": "05443784947355940101",
//     "belongTenantId": "00000000000000000100000000000000",
//     "aiType": 0,
//     "ptzType": 1,
//     "parentId": "2"
//   },
//   "leaf": true,
//   "showType": "camera",
//   "dashData": [
//     {
//       "color": "#ff6b6b",
//       "coordinates": [
//         {
//           "x": 106,
//           "y": 68
//         },
//         {
//           "x": 324,
//           "y": 68
//         },
//         {
//           "x": 324,
//           "y": 165
//         },
//         {
//           "x": 106,
//           "y": 165
//         }
//       ],
//       "customType": "max"
//     }
//   ],
//   "customTemplates": {
//     "11": {
//       "json": "{id:1}aaaa"
//     }
//   },
//   "algorithmId": 2,
//   "algorithmTemplateId": 22
// },
//   {
//     "id": "00000024022714010301000000000038",
//     "label": "大门全景",
//     "type": "2",
//     "payload": {
//       "deviceId": "00000024022714010301000000000038",
//       "deviceName": "大门全景",
//       "deviceType": 3,
//       "mainDevId": "00000024022714010303000000000037",
//       "type": 1,
//       "status": 1,
//       "deviceStatus": 0,
//       "organizationId": 2,
//       "platId": "0000000000001401",
//       "thirdId": "05443784945779530101",
//       "belongTenantId": "00000000000000000100000000000000",
//       "longitude": 116.39126541990397,
//       "latitude": 39.90690296198505,
//       "altitude": 0,
//       "aiType": 0,
//       "ptzType": 3,
//       "parentId": "2"
//     },
//     "leaf": true,
//     "showType": "camera",
//     "customTemplates": {
//       "11": {
//         "json": "{id:1}abfdfdsfs"
//       }
//     },
//     "algorithmId": 1,
//     "algorithmTemplateId": 11
//   }
// ]
</script>
