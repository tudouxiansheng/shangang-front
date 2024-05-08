<template>
  <div
    class="task-add"
    v-loading="imgLoad"
    element-loading-text="获取设备图像中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 返回主页面按钮 -->
    <el-button size="large" type="primary" @click="backTo">{{ $t('public.back') }}</el-button>
    <div class="task-add_content flex flex-between">
      <div class="left-form">
        <el-form
          ref="addform"
          :model="formData"
          :rules="formRules"
          class="addForm"
          inline
          label-suffix="："
          label-position="right"
        >
          <!-- 任务名称 -->
          <el-form-item :label="$t('IntelligentTask.Form.taskName')" prop="taskName">
            <!-- 新增 -->
            <el-input
              v-if="!editFlag"
              v-model="formData.taskName"
              :placeholder="$t('public.input', { type: $t('IntelligentTask.Form.taskName') })"
            ></el-input>
            <!-- 编辑 -->
            <span v-else>{{ formData.taskName }}</span>
          </el-form-item>
          <!-- 任务类型 -->
          <el-form-item :label="$t('IntelligentTask.Form.taskType')" prop="taskType">
            <el-radio-group v-model="formData.taskType" @change="taskTypeChg">
              <el-radio v-for="item in taskTypeList" :key="item.value" :label="item.value" :disabled="editFlag">{{
                item.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="!!formData.taskType">
            <!-- 摄像机范围 -->
            <el-form-item :label="$t('IntelligentTask.Form.cameraScope')" prop="cameraList">
              <!-- 新增 -->
              <!-- 目标识别 -->
              <template v-if="!editFlag">
                <CameraTree
                  v-show="formData.taskType == 2"
                  canModify
                  ref="camera1"
                  :dataOption="{
                    dataType: 'camera',
                    single: false,
                    strictly: true,
                    showAllSel: false,
                  }"
                  :disableIds="disableIds"
                  :platType="is1800 ? 14 : 16"
                ></CameraTree>
                <!-- 行为分析 -->
                <CameraTree
                  v-show="formData.taskType == 0"
                  canModify
                  ref="camera2"
                  :dataOption="{ dataType: 'camera', single: true, strictly: true }"
                  @nodeCheck="nodeCheck"
                  :disableIds="disableIds2"
                  :platType="is1800 ? 14 : 16"
                ></CameraTree>
                <!-- 人体特征 -->
                <CameraTree
                  v-show="formData.taskType == 4"
                  canModify
                  ref="camera3"
                  :dataOption="{
                    dataType: 'camera',
                    single: false,
                    strictly: true,
                    showAllSel: false,
                  }"
                  :disableIds="disableIds3"
                  :platType="is1800 ? 14 : 16"
                ></CameraTree>
              </template>
              <template v-else>
                <!-- 编辑 -->
                <CameraTree style="width: 50%" :canModify="false" :repalyIdArr="cameraIds2"></CameraTree>
              </template>
            </el-form-item>
            <!-- 目标识别 算法名称 -->
            <el-form-item
              v-show="['2', '4'].includes(formData.taskType)"
              :label="$t('IntelligentTask.Form.algorithmType')"
              prop="algorithmId"
            >
              <el-cascader
                style="width: 100%"
                v-model="shareScope"
                :options="scopeList"
                :props="{
                  value: 'value',
                  label: 'label',
                }"
                collapse-tags
                clearable
                filterable
                :placeholder="$t('analysisTask.selectAlgoSearch')"
              ></el-cascader>
            </el-form-item>
            <!-- 行为分析 行为类型 -->
            <el-form-item
              v-show="formData.taskType == 0 && cameraIds2.length"
              :label="$t('IntelligentTask.Form.actionType')"
              prop="alarmType"
            >
              <div class="algo-list flex flex-wrap">
                <div
                  :class="actionType == item.alarmType ? 'active' : ''"
                  v-for="item in actionTypes"
                  :key="item.alarmType"
                  @click="algoChoose(item)"
                >
                  {{ item.alarmName }}
                  <div class="check" @click.stop>
                    <el-checkbox v-model="item.enabled"></el-checkbox>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 检测类型 -->
            <el-form-item v-show="formData.taskType == 0 && cameraIds2.length" label="排除检测类型">
              <el-radio-group v-model="attributes.uiObjTypeFilterFlag">
                <el-radio label="5">{{ '人体检测' }}</el-radio>
                <el-radio label="2">{{ '车辆检测' }}</el-radio>
                <el-radio label="0">{{ '不过滤' }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item :label="$t('IntelligentTask.Form.remark')" prop="remark">
                <el-input
                    type="textarea"
                    v-model="formData.remark"
                    :rows="2"
                    maxlength="100"
                    show-word-limit
                    clearable
                    :placeholder="$t('IntelligentTask.Form.inputRemark')"
                />
            </el-form-item> -->
          </template>
        </el-form>
      </div>
      <div class="right-form" v-if="formData.taskType == 0 && cameraIds2.length">
        <!-- 操作栏 -->
        <div class="opration" v-show="!!this.actionType">
          <el-button type="text" :disabled="!imgloaded || offline" @click="drawFn('max')" class="table-btn_warn"
            >绘制最大目标</el-button
          >
          <el-button type="text" :disabled="!imgloaded || offline" @click="drawFn('min')" class="table-btn_info"
            >绘制最小目标</el-button
          >
          <el-button type="text" :disabled="!imgloaded || offline" v-show="isArea" @click="drawFn('polygon')"
            >绘制区域</el-button
          >
          <el-button type="text" :disabled="!imgloaded || offline" @click="drawFn('full')" v-show="isArea"
            >全屏</el-button
          >
          <template v-if="!isArea">
            <el-button type="text" :disabled="!imgloaded || offline" @click="drawFn('line')" class="table-btn_warn"
              >越线绘制</el-button
            >
            <el-select
              v-model="direction"
              @change="handleChangeDirection"
              placeholder="请选择"
              style="width: 100px; margin: 0 10px"
            >
              <el-option label="双向" :value="1"></el-option>
              <el-option label="A-B" :value="2"></el-option>
              <el-option label="B-A" :value="3"></el-option>
            </el-select>
          </template>
          <el-button type="text" @click="drawFn('back')" v-show="isArea" class="table-btn_warn">撤销区域</el-button>
          <el-button type="text" @click="drawFn('back')" v-show="!isArea" class="table-btn_warn">撤销越线</el-button>
          <el-button type="text" @click="drawFn('clear')" class="table-btn_warn">清空</el-button>
          <el-button type="text" @click="refreshImg" :disabled="imgLoad" style="float: right">刷新</el-button>
        </div>
        <!-- 视频弹窗 -->
        <div
          class="real-time-video flex"
          ref="DrawROIbox"
          v-loading="imgLoad"
          element-loading-spinner="el-icon-loading"
        >
          <img v-if="offline" :src="imgOffLine" class="off-img" alt="" />
          <img v-else :src="cameraImg" alt="" />
          <DrawROI ref="DrawROI" :canvasWidth="drawWidth" :canvasHeight="drawHeight" @drawEnd="drawEnd"></DrawROI>
        </div>
        <div class="params-set" v-show="!!actionType">
          <!-- 入侵检测 越线检测 区域进入检测 区域离开检测 徘徊检测 快速移动检测 -->
          <div class="params-set_content">
            <span class="label">参数设置</span>
            <div class="flex" style="width: 100%">
              <!-- max 100 -->
              <div class="flex" style="width: 50%">
                <span class="label">灵敏度</span>
                <el-input @change="sensitivityChg" v-model="attributes.uiSensitivity"></el-input>
              </div>
              <!-- max 1200 -->
              <div class="flex" style="width: 50%">
                <span class="label">告警检测间隔(秒)</span>
                <el-input @change="intervalChg" v-model="attributes.uiIntervalTime"> </el-input>
              </div>
            </div>
            <div class="flex">
              <span class="label">识别模式</span>
              <el-select v-model="attributes.enTargetMode">
                <el-option label="目标中心" value="0"></el-option>
                <el-option label="底部中心" value="1"></el-option>
                <el-option label="顶部中心" value="2"></el-option>
              </el-select>
            </div>
            <!-- 徘徊检测 max: 600 -->
            <div class="flex" v-show="actionType == 'ALARM_REGION_WANDERING'">
              <span class="label">持续时间</span>
              <el-input @change="durationChg" v-model="attributes.uiLimitedTime"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center">
      <el-button @click="backTo">取消</el-button>
      <el-button type="primary" @click="submitTask" :loading="maskloading">确定</el-button>
    </div>
  </div>
</template>

<script>
const CameraTree = () => import('@/components/CameraTree1')
const DrawROI = () => import('@/components/DrawROI')
export default {
  components: {
    CameraTree,
    DrawROI,
  },
  props: {
    taskTypeList: {
      type: Array,
      default: () => [
        { label: '目标识别', value: '2' },
        { label: '行为分析', value: '0' },
        { label: '人体特征', value: '4' },
      ],
    },
    actionTypes: {
      type: Array,
      default: () => [
        { alarmName: '入侵检测', alarmType: 'PERIMETER_INTRUSION_ALERT', type: 'BEH_INVASION_RULE', enabled: false },
        { alarmName: '越线检测', alarmType: 'ALARM_OFF_LINE', type: 'BEH_TRIPWIRE_RULE', enabled: false },
        { alarmName: '区域进入检测', alarmType: 'ZONE_ENTRY_ALARM', type: 'BEH_ENTER_RULE', enabled: false },
        { alarmName: '区域离开检测', alarmType: 'ZONE_DEPARTURE_WARNING', type: 'BEH_EXIT_RULE', enabled: false },
        { alarmName: '徘徊检测', alarmType: 'ALARM_REGION_WANDERING', type: 'BEH_WANDER_RULE', enabled: false },
        { alarmName: '快速移动检测', alarmType: 'FAST_MOVING_ALERT', type: 'BEH_FASTMOVE_RULE', enabled: false },
      ],
    },
    // algorithmList: {
    //     type: Array,
    // },
    is1800: {
      type: Boolean,
      default: true,
    },
    dataInfo: {
      type: Object,
    },
  },
  watch: {
    'attributes.uiIntervalTime': function (val) {
      if (!!this.act_ts) this.actTypeDatas['iss_alg_config'][this.act_ts].uiIntervalTime = val
    },
    'attributes.uiLimitedTime': function (val) {
      if (!!this.act_ts) this.actTypeDatas['iss_alg_config'][this.act_ts].uiLimitedTime = val
    },
    'attributes.uiSensitivity': function (val) {
      if (!!this.act_ts) this.actTypeDatas['iss_alg_config'][this.act_ts].uiSensitivity = val
    },
    'attributes.enTargetMode': function (val) {
      if (!!this.act_ts) this.actTypeDatas['iss_alg_config'][this.act_ts].enTargetMode = val
    },
    'attributes.uiObjTypeFilterFlag': function (val) {
      if (!!this.act_ts) this.actTypeDatas['iss_alg_config'][this.act_ts].uiObjTypeFilterFlag = val
    },
  },
  data() {
    return {
      editFlag: false,
      actionType: '', //当前行为类型所匹配的告警类型
      act_ts: '', //当前行为类型所匹配的类型字段
      imgloaded: false,
      offline: false,
      formData: {
        taskName: '',
        taskType: '2',
        algorithmId: '',
        cameraList: 'null',
        content: '', //流地址
        remark: '',
        streamType: 1,
        analyzeMode: 1,
        taskId: '',
      },
      formRules: {
        taskName: [
          {
            required: true,
            message: this.$t('length.required'),
            transform: (value) => value?.trim(), //不计算前后空格
            trigger: 'change',
          },
          {
            max: 30,
            message: this.$t('length.less30'),
            trigger: 'change',
          },
        ],
        taskType: [
          {
            required: true,
            message: this.$t('length.required'),
            trigger: 'change',
          },
        ],
        algorithmId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.shareScope.length) {
                callback(new Error(this.$t('length.required')))
              } else {
                callback()
              }
            },
            trigger: 'change',
          },
        ],
        alarmType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.actionTypes.some((a) => a.enabled)) {
                callback(new Error(this.$t('length.required')))
              } else {
                callback()
              }
            },
          },
        ],
        cameraList: [
          {
            required: true,
            validator: (rule, value, callback) => {
              this.$nextTick(() => {
                let list
                if (this.formData.taskType == '2') {
                  // 目标识别
                  list = this.$refs.camera1.getSaveData()
                  if (!list.length) callback(new Error(this.$t('length.required')))
                  callback()
                } else if (this.formData.taskType == '4') {
                  // 目标识别
                  list = this.$refs.camera3.getSaveData()
                  if (!list.length) callback(new Error(this.$t('length.required')))
                  callback()
                } else {
                  list = this.$refs.camera2.getSaveData()
                  if (!list.length) callback(new Error(this.$t('length.required')))
                  callback()
                }
              })
            },
          },
        ],
        content: [
          {
            required: true,
            message: this.$t('IntelligentTask.Form.inputStreamAddress'),
            trigger: 'blur',
          },
          {
            max: 100,
            message: this.$t('IntelligentTask.Message.wordMax'),
          },
        ],
      },
      maskloading: false,
      cameraIds: [], //目标识别的摄像机
      cameraIds2: [], //行为分析的摄像机
      scopeList: [], //级联数据
      scopeList1: [], //级联数据 目标识别
      scopeList2: [], //级联数据 人体特征
      shareScope: [],
      attributes: {},
      oriWidth: 0,
      oriHeight: 0,
      drawWidth: 0,
      drawHeight: 0,
      imgLoad: false,
      cameraImg: '', //摄像机实时图片
      imgOffLine: require('../assets/cameraOff.png'),
      imgScale: {
        x: 0,
        y: 0,
      },
      coordsArr: {
        max: null,
        min: null,
      },
      replayCoords: [],
      isArea: true,
      direction: 1,
      linesArr: [],
      disableIds: [],
      disableIds2: [],
      disableIds3: [],
    }
  },
  created() {
    this.getScope()
    this.formData.taskType = '2'
    this.actTypeDatas = {
      parameters: {
        analyze_mode: '200',
        channel_width: '', //摄像机分辨率
        channel_height: '720', //摄像机分辨率
      },
      iss_alg_config: {
        // 全局属性
        BEH_GLOBAL_ALARM: {
          iWidth: '1280', //摄像机分辨率
          iHeight: '720', //摄像机分辨率
          uiMaxTargetNum: '30', //区域内可处理的最大目标数量
          enObjDetect: '2', //工作模式，0低，1中，2高，3较低，4最低(灵敏度)
          stMinSize_iWidth: '22', //最小运动目标宽
          stMinSize_iHeight: '44', //最小运动目标高
          stMaxSize_iWidth: '156', //最大运动目标宽
          stMaxSize_iHeight: '236', //最大运动目标宽
        },
        // 入侵规则
        BEH_INVASION_RULE: {
          enable: '1', //是否启用
          uiObjTypeFilterFlag: '0', //排除目标类型，0不过滤2-过滤车辆5-过滤目标整体-
          uiIntervalTime: '1', //告警间隔，最大1200s
          enTargetMode: '0', //位置获取方式，0目标中心，1底部中心，2顶部中心
          uiSensitivity: '50', //灵敏度
          area: [], //区域 最大四个
        },
        // 越线检测
        BEH_TRIPWIRE_RULE: {
          enable: '0',
          uiObjTypeFilterFlag: '0',
          uiIntervalTime: '1',
          enTargetMode: '0',
          uiSensitivity: '50',
          uiLineNum: '1',
        },
        // 区域进入检测
        BEH_ENTER_RULE: {
          enable: '0',
          uiObjTypeFilterFlag: '0',
          uiIntervalTime: '1',
          enTargetMode: '0',
          uiSensitivity: '50',
        },
        // 区域离开检测
        BEH_EXIT_RULE: {
          enable: '0',
          uiObjTypeFilterFlag: '0',
          uiIntervalTime: '1',
          enTargetMode: '0',
          uiSensitivity: '50',
        },
        // 快速移动检测
        BEH_FASTMOVE_RULE: {
          enable: '0',
          uiObjTypeFilterFlag: '0',
          uiIntervalTime: '1',
          enTargetMode: '0',
          uiSensitivity: '50',
        },
        // 徘徊检测
        BEH_WANDER_RULE: {
          enable: '0',
          uiObjTypeFilterFlag: '0',
          uiIntervalTime: '1',
          enTargetMode: '0',
          uiSensitivity: '50',
          uiLimitedTime: '1',
        },
      },
    } //行为数据
    this.$api.getTaskedCameraId({ type: this.is1800 ? 1 : 2 }).then((res) => {
      if (this.is1800) {
        this.disableIds = res.camera1800IdList || []
        this.disableIds2 = res.camera1800IdList || []
      } else {
        this.disableIds = res.camera3800IdList || []
        this.disableIds2 = res.camera3800TypeIdList || []
      }
      this.disableIds3 = res.humanList || []
    })
    // 编辑的行为分析数据回显 只有1800的平台下的行为分析任务才存在编辑
    if (this.dataInfo !== null) {
      this.editFlag = true
      this.formData.taskName = this.dataInfo.taskName
      this.formData.content = this.dataInfo.content
      this.formData.taskType = this.dataInfo.taskType
      this.formData.taskId = this.dataInfo.taskId
      this.$nextTick(() => {
        this.cameraIds2 = [{ id: this.dataInfo.content, type: 2 }]
        this.refreshImg()
        this.actionType = this.actionTypes.find((a) => a.type == this.dataInfo.detectionType.split(',')[0])?.alarmType
        let types = this.dataInfo.detectionType.split(',')
        this.act_ts = types[0]
        this.actTypeDatas = JSON.parse(JSON.stringify(this.dataInfo.dashData))
        let iss_alg_config = this.actTypeDatas.iss_alg_config
        if (this.act_ts == 'BEH_TRIPWIRE_RULE') {
          // 判断 回显 绘制线段的操作栏的按钮
          this.isArea = false
          // 绘制线需要回显方向
          let end = iss_alg_config.bEH_TRIPWIRE_RULE.line.slice(-1)
          if (end == 0) {
            this.direction = 1
          } else if (end == 1) {
            this.direction = 3
          } else {
            this.direction = 2
          }
        }
        iss_alg_config.BEH_ENTER_RULE = iss_alg_config.bEH_ENTER_RULE
        iss_alg_config.BEH_EXIT_RULE = iss_alg_config.bEH_EXIT_RULE
        iss_alg_config.BEH_FASTMOVE_RULE = iss_alg_config.bEH_FASTMOVE_RULE
        iss_alg_config.BEH_GLOBAL_ALARM = iss_alg_config.bEH_GLOBAL_ALARM
        iss_alg_config.BEH_INVASION_RULE = iss_alg_config.bEH_INVASION_RULE
        iss_alg_config.BEH_TRIPWIRE_RULE = iss_alg_config.bEH_TRIPWIRE_RULE
        iss_alg_config.BEH_WANDER_RULE = iss_alg_config.bEH_WANDER_RULE
        delete iss_alg_config.bEH_ENTER_RULE
        delete iss_alg_config.bEH_EXIT_RULE
        delete iss_alg_config.bEH_FASTMOVE_RULE
        delete iss_alg_config.bEH_GLOBAL_ALARM
        delete iss_alg_config.bEH_INVASION_RULE
        delete iss_alg_config.bEH_TRIPWIRE_RULE
        delete iss_alg_config.bEH_WANDER_RULE
        this.attributes = iss_alg_config[this.act_ts]
        this.$nextTick(() => {
          this.oriWidth = iss_alg_config.BEH_GLOBAL_ALARM.iWidth
          this.oriHeight = iss_alg_config.BEH_GLOBAL_ALARM.iHeight
          this.drawWidth = this.$refs.DrawROIbox.clientWidth
          this.drawHeight = this.$refs.DrawROIbox.clientHeight
          this.imgScale.x = this.drawWidth / this.oriWidth
          this.imgScale.y = this.drawHeight / this.oriHeight
          this.computeArea('BEH_GLOBAL_ALARM', iss_alg_config.BEH_GLOBAL_ALARM)
          types.forEach((t) => {
            this.computeArea(t, iss_alg_config[t])
          })
          this.replayArea()
        })
      })
    }
  },
  methods: {
    // 回退到主页面
    backTo() {
      this.$confirm('退出页面后不会保存页面数据', '提示', {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false,
      }).then(() => {
        this.$emit('back')
        // 清除hostsdk 等信息和其他缓存数据
      })
    },
    // 任务类型改变
    taskTypeChg(val) {
      this.shareScope = []
      if (val == 2) {
        //目标
        this.scopeList = this.scopeList1
      } else if (val == 4) {
        // 人体检测
        this.scopeList = this.scopeList2
      } else if (val == 0) {
        //行为
      }
    },
    //根据接入获取算法列表
    async getScope() {
      let res = await this.$api.getAlgorithmAccessList({
        pageInfo: { pageNum: 1, pageSize: 100 },
      })
      if (res.resultCode == 0) {
        let algorithmAccessList = res.algorithmAccessList || []
        let options = []
        algorithmAccessList.forEach((item) => {
          options.push({
            value: item.accessId,
            label:
              item.status == 1
                ? item.accessName + '(' + this.$t('public.statustype1') + ')'
                : item.accessName + '(' + this.$t('public.statustype2') + ')',
            children: [],
          })
          //判断接入在离线
          if (item.status == 0) {
            if (!this.accessOfflineList) this.accessOfflineList = []
            this.accessOfflineList.push(item.accessId)
          }
        })

        for (let i = 0; i < options.length; i++) {
          let searchObj = {
            pageInfo: {
              pageNum: 1,
            },
            // accessId: options[i].value,
            algorithmAccessId: options[i].value,
          }
          // 分权分域
          let resp = await this.$api.getTenantAlgorithmResource(searchObj)
          for (let j = 0; j < resp.algorithmList.length; j++) {
            const item = resp.algorithmList[j]
            options[i].children.push({
              value: item.algorithmId,
              label: item.algorithmName,
              maxChannel: item.maxChannel,
              algorithmType: item.algorithmType, //BODY_RECOGNIZE,VEHICLE_RECOGNIZE,FACE_RECOGNIZE
            })
          }
        }

        for (let a = 0; a < options.length; a++) {
          if (!options[a].children.length) {
            // options[a].disabled = true;
            delete options[a]
          }
        }
        this.scopeList1 = JSON.parse(JSON.stringify(options)).map((op) => {
          op.children = op.children.filter((o) => o.algorithmType != 'BODY_RECOGNIZE' && o.algorithmType != 'OTHER')
          return op
        })
        this.scopeList2 = JSON.parse(JSON.stringify(options)).map((op) => {
          op.children = op.children.filter((o) => o.algorithmType == 'BODY_RECOGNIZE' || o.algorithmType == 'OTHER')
          return op
        })
        this.scopeList = this.scopeList1
      }
    },
    /**
     * 选择摄像机回调，用于请求摄像机的实时图片
     * data 摄像机数据
     * isCheck 是否勾选
     */
    nodeCheck(data, isCheck) {
      this.cameraImg = ''
      if (isCheck) {
        this.imgScale.x = 0
        this.imgScale.y = 0
        this.cameraIds2 = [{ id: data.id, type: 2, label: data.label }]
        this.offline = false
        if (data.payload.status == 2) this.offline = true
        else this.refreshImg()
        this.$nextTick(() => {
          this.drawWidth = this.$refs.DrawROIbox.clientWidth
          this.drawHeight = this.$refs.DrawROIbox.clientHeight
          this.actionType = this.actionTypes[0]?.alarmType
          this.act_ts = this.actionTypes[0]?.type
          this.attributes = this.actTypeDatas['iss_alg_config']['BEH_INVASION_RULE']
        })
      } else {
        this.cameraIds2 = []
      }
    },
    // 刷新摄像机图片
    refreshImg() {
      this.imgLoad = true
      this.$api.getCameraLiveCover({ cameraId: this.cameraIds2[0].id }).then((res) => {
        this.imgLoad = false
        if (res?.resultCode == 0) {
          if (res.cameraId != this.cameraIds2[0].id) return
          if (res.base64) {
            this.cameraImg = res.base64
            this.imgloaded = true
            this.replayArea()
            if (!this.imgScale.x) {
              let img = new Image()
              img.src = res.base64
              img.crossOrigin = 'anonymous'
              img.onload = (ev) => {
                this.oriWidth = ev.target.width
                this.oriHeight = ev.target.height
                this.imgScale.x = this.drawWidth / this.oriWidth
                this.imgScale.y = this.drawHeight / this.oriHeight
              }
              img.onerror = () => {
                this.imgScale.x = this.drawWidth / 1920
                this.imgScale.y = this.drawHeight / 1080
              }
            }
          } else {
            this.cameraImg = ''
            this.imgloaded = false
          }
        } else {
          this.imgloaded = false
        }
      })
    },
    // 图形绘制完成的回调函数
    drawEnd(drawType) {
      // 缓存图形
      let coords = this.$refs.DrawROI.handleSave()
      if (coords.find((c) => c.customType == 'max')) {
        this.coordsArr['max'] = coords.find((c) => c.customType == 'max')
      }
      if (coords.find((c) => c.customType == 'min')) {
        this.coordsArr['min'] = coords.find((c) => c.customType == 'min')
      }
      // 判断最大和最小区域是否满足条件 ，最大区域的高要大于最小区域的高 最大区域的宽要大于最小区域的宽
      this.judgeMaxMin()
      console.log(this.coordsArr)
      let type = this.actionTypes.find((a) => a.alarmType == this.actionType).type
      this.coordsArr[type] = coords.filter((c) => c.customType != 'max' && c.customType != 'min')
      if (drawType == 1) {
        if (this.is1800) {
          //1800 可以绘制4个区域
          if (this.coordsArr[type].length >= 4) this.$refs.DrawROI.startDraw = false
        } else {
          //3800 可以绘制1个区域
          if (this.coordsArr[type].length >= 1) this.$refs.DrawROI.startDraw = false
        }
      } else if (drawType == 2) {
        this.$refs.DrawROI.startDraw = false
      } else if (drawType == 3) {
        if (type == 'BEH_TRIPWIRE_RULE') {
          if (this.coordsArr[type].length > 1) {
            this.linesArr.push(this.coordsArr[type][1])
            this.coordsArr[type].shift()
            this.replayArea()
          } else {
            this.linesArr.push(this.coordsArr[type][0])
          }
        }
      }
    },
    // 触发图形事件
    drawFn(type) {
      this.$refs.DrawROI.startDraw = true
      let optType = this.actionTypes.find((a) => a.alarmType == this.actionType).type
      switch (type) {
        case 'max':
          this.coordsArr['max'] = null
          this.$refs.DrawROI.handleChangeDrawType(2, '#ff6b6b', type)
          break
        case 'min':
          this.coordsArr['min'] = null
          this.$refs.DrawROI.handleChangeDrawType(2, '#65BC4C', type)
          break
        case 'polygon':
          if (this.is1800) {
            if (this.coordsArr[optType]?.length >= 4) {
              this.$refs.DrawROI.startDraw = false
              this.$message.info('区域绘制已达到限制')
            }
          } else {
            if (this.coordsArr[optType]?.length >= 1) {
              this.$refs.DrawROI.startDraw = false
              this.$message.info('区域绘制已达到限制')
            }
          }
          this.$refs.DrawROI.handleChangeDrawType(1, '#409EFF', type)
          break
        case 'line':
          this.$refs.DrawROI.handleChangeDrawType(3, '#ff6b6b', type)
          break
        case 'full':
          if (this.is1800) {
            if (this.coordsArr[optType]?.length >= 4) {
              this.$message.info('区域绘制已达到限制')
              this.$refs.DrawROI.startDraw = false
            }
          } else {
            if (this.coordsArr[optType]?.length >= 1) {
              this.$refs.DrawROI.startDraw = false
              this.$message.info('区域绘制已达到限制')
            }
          }
          this.$refs.DrawROI.handleDrawAllCanvas('#409EFF')
          break
        case 'back':
          this.$refs.DrawROI.startDraw = false
          if (optType == 'BEH_TRIPWIRE_RULE') {
            this.linesArr.pop()
            if (this.linesArr.length) {
              this.coordsArr[optType] = [this.linesArr[this.linesArr.length - 1]]
            } else {
              this.coordsArr[optType] = null
            }
            this.replayArea()
          } else {
            if (this.coordsArr[optType]?.length) {
              this.coordsArr[optType].pop()
            }
          }
          break
        case 'clear':
          this.coordsArr['max'] = null
          this.coordsArr['min'] = null
          this.coordsArr[optType] = []
          break
      }
      this.replayArea()
    },
    // 选择行为类型，切换图形和事件等
    algoChoose(data) {
      this.actionType = data.alarmType
      this.act_ts = data.type
      this.attributes = this.actTypeDatas['iss_alg_config'][data.type]
      if (data.type == 'BEH_TRIPWIRE_RULE') {
        this.isArea = false
        this.$refs.DrawROI.direction = this.direction
      } else {
        this.isArea = true
        // 如果大于四个区域
      }
      this.$refs.DrawROI.startDraw = false
      this.replayArea()
    },
    // 切换行为类型回显已经绘制的图形
    replayArea() {
      this.replayCoords = []
      let optType = this.actionTypes.find((a) => a.alarmType == this.actionType).type
      if (this.coordsArr['max']) this.replayCoords.push({ ...this.coordsArr['max'] })
      if (this.coordsArr['min']) this.replayCoords.push({ ...this.coordsArr['min'] })
      if (this.coordsArr[optType] && this.coordsArr[optType].length)
        this.replayCoords = this.replayCoords.concat(this.coordsArr[optType])
      if (this.$refs.DrawROI) {
        if (
          optType == 'BEH_TRIPWIRE_RULE' &&
          (!this.$refs.DrawROI.direction || this.$refs.DrawROI.direction != this.direction)
        ) {
          this.$refs.DrawROI.direction = this.direction
          this.replayArea()
        }
        this.$refs.DrawROI.handleClear()
        this.$refs.DrawROI.allCoordinates = this.replayCoords || []
        this.$refs.DrawROI.drawAllLines() //回显区域
        this.$refs.DrawROI.fillAllArea() //回显区域
      }
    },
    // 改变箭头方位
    handleChangeDirection(val) {
      this.$refs.DrawROI.direction = val
      this.replayArea()
      // this.$refs.DrawROI.drawLineWithVerticalLine(val)
    },
    // 灵敏度
    sensitivityChg(val) {
      if (Number.isNaN(Number(val))) this.attributes.uiSensitivity = '50'
      else {
        if (Number(val) < 1) {
          this.attributes.uiSensitivity = '1'
        } else if (Number(val) > 100) {
          this.attributes.uiSensitivity = '100'
        } else {
          this.attributes.uiSensitivity = Math.floor(Number(val)) + ''
        }
      }
    },
    // 告警检测间隔
    intervalChg(val) {
      if (Number.isNaN(Number(val))) this.attributes.uiIntervalTime = '1'
      else {
        if (Number(val) < 1) {
          this.attributes.uiIntervalTime = '1'
        } else if (Number(val) > 1200) {
          this.attributes.uiIntervalTime = '1200'
        } else {
          this.attributes.uiIntervalTime = Math.floor(Number(val)) + ''
        }
      }
    },
    // 持续时间
    durationChg(val) {
      if (Number.isNaN(Number(val))) this.attributes.uiLimitedTime = '1'
      else {
        if (Number(val) < 1) {
          this.attributes.uiLimitedTime = '1'
        } else if (Number(val) > 600) {
          this.attributes.uiLimitedTime = '600'
        } else {
          this.attributes.uiLimitedTime = Math.floor(Number(val)) + ''
        }
      }
    },
    // 提交任务
    submitTask() {
      // 判断是目标识别/行为分析还是行为分析
      let vaild = true
      let camerasArray
      if (this.formData.taskType != 0) {
        //目标识别
        this.$refs.addform.validateField(['taskName', 'cameraList', 'algorithmId'], (msg) => {
          if (!!msg) vaild = false
        })
        if (vaild) {
          // 校验通过
          if (this.formData.taskType == 2) camerasArray = this.$refs.camera1.getSaveData()
          if (this.formData.taskType == 4) camerasArray = this.$refs.camera3.getSaveData()
          if (!camerasArray.length) return
          // 添加逻辑
          let data = {
            sourceType: 1,
            streamType: 1,
            analyzeMode: 1,
            taskType: this.formData.taskType,
            taskName: this.formData.taskName,
            deviceIdNameList: camerasArray.map((c) => c.id + '-' + c.label),
            deviceIdPlatIdList: camerasArray.map((c) => c.id + '-' + c.platId), //平台
            algorithmIds: [this.shareScope[1]],
            detectionType: this.shareScope[1],
            periodList: [
              {
                dayType: 0,
                startTime: '00:00:00',
                endTime: '23:59:59',
              },
            ],
          }
          this.maskloading = true
          this.$api.addNewTaskInfo(data).then((res) => {
            this.maskloading = false
            if (res.resultCode === 0) {
              this.$message.success(this.$t('public.addSuccess'))
              this.$emit('back')
            } else {
              this.$message.error('添加智能分析任务失败！')
            }
          })
        }
      } else {
        if (this.editFlag) {
          this.$refs.addform.validateField(['alarmType'], (msg) => {
            if (!!msg) vaild = false
          })
        } else {
          //行为分析
          this.$refs.addform.validateField(['taskName', 'cameraList', 'alarmType'], (msg) => {
            if (!!msg) vaild = false
          })
        }
        if (vaild) {
          // 校验通过
          // 添加逻辑
          if (!this.coordsArr['max'] || !this.coordsArr['min']) {
            if (!this.judgeMaxMin()) return this.$message.warning('请完成最大最小目标绘制！')
          } else {
            if (!this.judgeMaxMin()) return
          }
          // 组装json
          this.makeJson()
            .then(() => {
              let Obj = {}
              // 由于后端需要 改变json字段 BEH 为 bEH
              Obj.parameters = { ...this.actTypeDatas.parameters }
              Obj.iss_alg_config = {
                bEH_ENTER_RULE: {
                  ...this.actTypeDatas.iss_alg_config.BEH_ENTER_RULE,
                },
                bEH_EXIT_RULE: {
                  ...this.actTypeDatas.iss_alg_config.BEH_EXIT_RULE,
                },
                bEH_FASTMOVE_RULE: {
                  ...this.actTypeDatas.iss_alg_config.BEH_FASTMOVE_RULE,
                },
                bEH_INVASION_RULE: {
                  ...this.actTypeDatas.iss_alg_config.BEH_INVASION_RULE,
                },
                bEH_TRIPWIRE_RULE: {
                  ...this.actTypeDatas.iss_alg_config.BEH_TRIPWIRE_RULE,
                },
                bEH_WANDER_RULE: {
                  ...this.actTypeDatas.iss_alg_config.BEH_WANDER_RULE,
                },
                bEH_GLOBAL_ALARM: {
                  ...this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM,
                },
              }
              console.log(Obj, '12311111111111111111')
              let data
              if (!this.editFlag) {
                camerasArray = this.$refs.camera2.getSaveData()
                // 添加逻辑
                data = {
                  sourceType: 1,
                  streamType: 1,
                  analyzeMode: 1,
                  taskType: 0,
                  taskName: this.formData.taskName,
                  content: camerasArray[0].id,
                  accessId: camerasArray[0].platId,
                  dashData: Obj,
                  detectionType: this.actionTypes
                    .filter((a) => a.enabled)
                    .map((item) => item.type)
                    .join(','),
                  periodList: [
                    {
                      dayType: 0,
                      startTime: '00:00:00',
                      endTime: '23:59:59',
                    },
                  ],
                }
                this.maskloading = true
                this.$api.addNewTaskInfo(data).then((res) => {
                  this.maskloading = false
                  if (res.resultCode === 0) {
                    this.$message.success(this.$t('public.addSuccess'))
                    this.$emit('back')
                  } else {
                    this.$message.error('添加智能分析任务失败！')
                  }
                })
              } else {
                // 编辑
                data = {
                  taskId: this.dataInfo.taskId,
                  dashData: Obj,
                  detectionType: this.actionTypes
                    .filter((a) => a.enabled)
                    .map((item) => item.type)
                    .join(','),
                }
                this.maskloading = true
                this.$api.modifyNewTaskInfo(data).then((res) => {
                  this.maskloading = false
                  if (res.resultCode === 0) {
                    this.$message.success(this.$t('public.modifySuccess'))
                    this.$emit('back')
                  } else {
                    this.$message.error('编辑智能分析任务失败！')
                  }
                })
              }
            })
            .catch(() => {
              this.$message.warning('存在未完成的区域绘制')
            })
        }
      }
    },
    // 判断最大最小目标
    judgeMaxMin() {
      // 判断逻辑
      if (this.coordsArr['max'] && this.coordsArr['min']) {
        let max_W = this.coordsArr['max'].coordinates[2].x - this.coordsArr['max'].coordinates[0].x
        let max_H = this.coordsArr['max'].coordinates[2].y - this.coordsArr['max'].coordinates[0].y
        let min_W = this.coordsArr['min'].coordinates[2].x - this.coordsArr['min'].coordinates[0].x
        let min_H = this.coordsArr['min'].coordinates[2].y - this.coordsArr['min'].coordinates[0].y
        if (max_W <= min_W || max_H <= min_H) {
          this.$message.warning('最大目标长宽必须大于最小目标长宽')
          return false
        }
        // 更新最大目标和最小目标值
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.stMinSize_iWidth = Math.floor(min_W / this.imgScale.x) + '' //最小运动目标宽
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.stMinSize_iHeight = Math.floor(min_H / this.imgScale.y) + '' //最小运动目标高
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.stMaxSize_iWidth = Math.floor(max_W / this.imgScale.x) + '' //最大运动目标宽
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.stMaxSize_iHeight = Math.floor(max_H / this.imgScale.y) + '' //最大运动目标高
        return true
      }
      return false
    },
    // 组装JSON
    makeJson() {
      return new Promise((resolve, reject) => {
        this.actTypeDatas.parameters.channel_width = this.oriWidth + '' //摄像机分辨率
        this.actTypeDatas.parameters.channel_height = this.oriHeight + '' //摄像机分辨率
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.iWidth = this.oriWidth + '' //摄像机分辨率
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.iHeight = this.oriHeight + '' //摄像机分辨率
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.uiMaxTargetNum = '30' //区域内可处理的最大目标数量
        this.actTypeDatas.iss_alg_config.BEH_GLOBAL_ALARM.enObjDetect = '2' //工作模式，0低，1中，2高，3较低，4最低(灵敏度)
        let BEH_INVASION_RULE = this.actTypeDatas.iss_alg_config.BEH_INVASION_RULE
        let BEH_TRIPWIRE_RULE = this.actTypeDatas.iss_alg_config.BEH_TRIPWIRE_RULE
        let BEH_FASTMOVE_RULE = this.actTypeDatas.iss_alg_config.BEH_FASTMOVE_RULE
        let BEH_WANDER_RULE = this.actTypeDatas.iss_alg_config.BEH_WANDER_RULE
        let item = null
        // 入侵检测
        item = this.actionTypes.find((act) => act.type == 'BEH_INVASION_RULE')
        BEH_INVASION_RULE.enable = '0'
        if (item.enabled) {
          BEH_INVASION_RULE.enable = '1'
          if (!this.coordsArr['BEH_INVASION_RULE'].length) reject()
        }
        BEH_INVASION_RULE.area = this.coordsArr['BEH_INVASION_RULE']?.map((coord) => {
          return coord.coordinates.map((c) => {
            return this.translatePos(c.x, c.y, 'save')
          })
        })
        // 入侵检测 --end
        // 越线检测
        item = this.actionTypes.find((act) => act.type == 'BEH_TRIPWIRE_RULE')
        BEH_TRIPWIRE_RULE.enable = '0'
        if (item.enabled) {
          BEH_TRIPWIRE_RULE.enable = '1'
          if (!this.coordsArr['BEH_TRIPWIRE_RULE'].length) reject()
        }
        let area = this.coordsArr['BEH_TRIPWIRE_RULE']?.map((coord) => {
          return coord.coordinates.map((c) => {
            return this.translatePos(c.x, c.y, 'save')
          })
        })[0]
        if (area?.length) {
          let str = '1,'
          str += area.map((a) => a.x + ',' + a.y).join(',')
          if (this.direction == 1) {
            str += ',0'
          } else if (this.direction == 2) {
            str += ',2'
          } else {
            str += ',1'
          }
          BEH_TRIPWIRE_RULE.line = str
          console.log(str)
        } else {
          BEH_TRIPWIRE_RULE.line = ''
        }
        // 越线检测 --end
        // 徘徊检测
        item = this.actionTypes.find((act) => act.type == 'BEH_FASTMOVE_RULE')
        BEH_FASTMOVE_RULE.enable = '0'
        if (item.enabled) {
          BEH_FASTMOVE_RULE.enable = '1'
          if (!this.coordsArr['BEH_FASTMOVE_RULE'].length) reject()
        }
        BEH_FASTMOVE_RULE.area = this.coordsArr['BEH_FASTMOVE_RULE']?.map((coord) => {
          return coord.coordinates.map((c) => {
            return this.translatePos(c.x, c.y, 'save')
          })
        })
        // 徘徊检测 --end
        // 快速移动检测
        item = this.actionTypes.find((act) => act.type == 'BEH_WANDER_RULE')
        BEH_WANDER_RULE.enable = '0'
        if (item.enabled) {
          BEH_WANDER_RULE.enable = '1'
          if (!this.coordsArr['BEH_WANDER_RULE'].length) reject()
        }
        BEH_WANDER_RULE.area = this.coordsArr['BEH_WANDER_RULE']?.map((coord) => {
          return coord.coordinates.map((c) => {
            return this.translatePos(c.x, c.y, 'save')
          })
        })
        // 快速移动检测 --end
        if (this.is1800) {
          let BEH_ENTER_RULE = this.actTypeDatas.iss_alg_config.BEH_ENTER_RULE
          let BEH_EXIT_RULE = this.actTypeDatas.iss_alg_config.BEH_EXIT_RULE
          // 区域进入检测
          item = this.actionTypes.find((act) => act.type == 'BEH_ENTER_RULE')
          BEH_ENTER_RULE.enable = '0'
          if (item.enabled) {
            BEH_ENTER_RULE.enable = '1'
            if (!this.coordsArr['BEH_ENTER_RULE'].length) reject()
          }
          BEH_ENTER_RULE.area = this.coordsArr['BEH_ENTER_RULE']?.map((coord) => {
            return coord.coordinates.map((c) => {
              return this.translatePos(c.x, c.y, 'save')
            })
          })
          // 区域进入检测 --end
          // 区域离开检测
          item = this.actionTypes.find((act) => act.type == 'BEH_EXIT_RULE')
          BEH_EXIT_RULE.enable = '0'
          if (item.enabled) {
            BEH_EXIT_RULE.enable = '1'
            if (!this.coordsArr['BEH_EXIT_RULE'].length) reject()
          }
          BEH_EXIT_RULE.area = this.coordsArr['BEH_EXIT_RULE']?.map((coord) => {
            return coord.coordinates.map((c) => {
              return this.translatePos(c.x, c.y, 'save')
            })
          })
          // 区域离开检测 --end
        }
        resolve()
      })
    },
    translatePos(x, y, type) {
      if (type == 'save') {
        return {
          x: Math.floor(x / this.imgScale.x),
          y: Math.floor(y / this.imgScale.y),
        }
      } else if (type == 'replay') {
        return {
          x: Math.floor(x * this.imgScale.x),
          y: Math.floor(y * this.imgScale.y),
        }
      }
    },
    // 编辑任务时 计算点位回显
    computeArea(type, data) {
      if (type == 'BEH_GLOBAL_ALARM') {
        // 可回显 最大和最小目标
        // 最大目标区域
        let st_x1 = Math.floor((this.oriWidth / 2 - data.stMaxSize_iWidth / 2) * this.imgScale.x)
        let ed_x1 = Math.floor((this.oriWidth / 2 + data.stMaxSize_iWidth / 2) * this.imgScale.x)
        let st_y1 = Math.floor((this.oriHeight / 2 - data.stMaxSize_iHeight / 2) * this.imgScale.y)
        let ed_y1 = Math.floor((this.oriHeight / 2 + data.stMaxSize_iHeight / 2) * this.imgScale.y)
        this.coordsArr['max'] = {
          color: '#ff6b6b',
          customType: 'max',
          coordinates: [
            {
              x: st_x1,
              y: st_y1,
            },
            {
              x: st_x1,
              y: ed_y1,
            },
            {
              x: ed_x1,
              y: ed_y1,
            },
            {
              x: ed_x1,
              y: st_y1,
            },
          ],
        }

        let st_x2 = Math.floor((this.oriWidth / 2 - data.stMinSize_iWidth / 2) * this.imgScale.x)
        let ed_x2 = Math.floor((this.oriWidth / 2 + data.stMinSize_iWidth / 2) * this.imgScale.x)
        let st_y2 = Math.floor((this.oriHeight / 2 - data.stMinSize_iHeight / 2) * this.imgScale.y)
        let ed_y2 = Math.floor((this.oriHeight / 2 + data.stMinSize_iHeight / 2) * this.imgScale.y)
        this.coordsArr['min'] = {
          color: '#65BC4C',
          customType: 'min',
          coordinates: [
            {
              x: st_x2,
              y: st_y2,
            },
            {
              x: st_x2,
              y: ed_y2,
            },
            {
              x: ed_x2,
              y: ed_y2,
            },
            {
              x: ed_x2,
              y: st_y2,
            },
          ],
        }
      } else {
        if (type == 'BEH_TRIPWIRE_RULE') {
          let lines = data.line.split(',')
          let d1 = lines.slice(-1)[0]
          if (d1 == 0) {
            // 双向
            this.direction = 1
          } else if (d1 == 1) {
            // A->B
            this.direction = 3
          } else {
            // B->A
            this.direction = 2
          }
          let pos = lines.slice(1, -1)
          // 越线
          this.coordsArr[type] = [
            {
              color: '#ff6b6b',
              customType: 'line',
              coordinates: [
                {
                  x: Math.floor(pos[0] * this.imgScale.x),
                  y: Math.floor(pos[1] * this.imgScale.y),
                },
                {
                  x: Math.floor(pos[2] * this.imgScale.x),
                  y: Math.floor(pos[3] * this.imgScale.y),
                },
              ],
            },
          ]
        } else {
          // 区域
          this.coordsArr[type] = []
          data.area.forEach((item) => {
            this.coordsArr[type].push({
              color: '#409EFF',
              customType: 'polygon',
              coordinates: item.map((m) => {
                return {
                  x: Math.floor(m.x * this.imgScale.x),
                  y: Math.floor(m.y * this.imgScale.y),
                }
              }),
            })
          })
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.task-add {
  width: 100%;
  height: 100%;
  color: #fff;
  &_content {
    width: 100%;
    height: calc(100% - 88px);
    .left-form {
      width: 50%;
      .algo-list {
        width: 100%;
        color: #fff;
        > div {
          position: relative;
          padding: 0 25px;
          width: fit-content;
          background: #4d4d4d;
          margin-right: 15px;
          margin-bottom: 15px;
          cursor: pointer;
          user-select: none;
          height: 45px;
          line-height: 45px;
          position: relative;
          .check {
            position: absolute;
            top: -10px;
            right: 5px;
          }
          // .el-checkbox {
          //     position: absolute;
          //     top: -10px;
          //     right: 5px;
          // }
          &.active {
            background: #134b71;
            // color: #147cca;
            // &::after {
            //     content: '';
            //     position: absolute;
            //     top: 2px;
            //     right: 2px;
            //     background-image: url('~@/assets/images/common/check.png');
            //     background-size: 100% 100%;
            //     width: 12px;
            //     height: 12px;
            //     display: inline-block;
            // }
          }
        }
      }
    }
    .right-form {
      width: 45%;
      height: 100%;
      .opration {
        height: 40px;
        width: 640px;
      }
      .real-time-video {
        width: 640px;
        height: 400px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 1px;
          top: 1px;
        }
        img.off-img {
          width: 100px;
          height: 100px;
          left: calc(50% - 50px);
          top: calc(50% - 50px);
        }
        .draw-roi-wrapper {
          z-index: 2;
        }
      }

      .params-set {
        width: 100%;
        height: calc(100% - 400px);
        padding-top: 20px;
        &_content {
          > div {
            width: 40%;
            height: 40px;
            margin-bottom: 20px;
            .el-input {
              width: 100px;
            }
          }
          .label {
            min-width: 120px;
            text-align: right;
            height: 40px;
            line-height: 40px;
            &::after {
              content: '：';
            }
          }
        }
      }
    }
    ::v-deep .el-form {
      margin-top: 20px;
      .el-form-item {
        width: 100%;
      }
      .el-textarea__inner {
        background: #4d4d4d;
        height: 60;
        border: 1px solid #4d4d4d;
        color: #fff;
      }
    }
    ::v-deep .el-checkbox {
      .el-checkbox__label {
        color: #fff;
      }
    }
  }
}
</style>
