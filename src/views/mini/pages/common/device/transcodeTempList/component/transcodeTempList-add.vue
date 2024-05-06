<template>
  <el-dialog
    :title="
      $parent.operation
        ? $t('transcodeTemplate.addTransTemplate')
        : $t('transcodeTemplate.editTransTemplate')
    "
    v-model="$parent.dialogFormVisible"
    top="10vh"
    width="1100px"
    :close-on-click-modal="false"
    class="transcodeTempListAddDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-steps :active="active" align-center finish-status="success" style="margin-bottom: 20px">
      <el-step :title="$t('transcodeTemplate.templateBaseInfo')"></el-step>
      <el-step :title="$t('transcodeTemplate.videoParameterSet')"></el-step>
      <el-step :title="$t('transcodeTemplate.audioParameterSet')"></el-step>
      <el-step :title="$t('transcodeTemplate.complete')"></el-step>
    </el-steps>
    <el-form
      ref="form"
      :model="form"
      :rules="rules2"
      :label-width="$parent.locale == 'en' ? '222px' : '150px'"
      size="small"
      label-position="left"
    >
      <el-form-item
        :label="$t('transcodeTemplate.templateName') + '：'"
        prop="templateName"
        v-show="active == 0"
        class="labelWidth"
      >
        <el-input
          v-model="form.templateName"
          auto-complete="off"
          :placeholder="$t('transcodeTemplate.inputTemplateName')"
          style="width: 570px"
        />
      </el-form-item>

      <el-form-item
        :label="$t('transcodeTemplate.backgroundMusic') + '：'"
        prop="src"
        v-show="active == 0"
        class="labelWidth"
      >
        <el-select
          :popper-append-to-body="false"
          v-model="form.src"
          :placeholder="$t('transcodeTemplate.chooseBackGroundMusic')"
          style="width: 570px"
        >
          <el-option :label="$t('transcodeTemplate.noMusic')" value="0"></el-option>
          <el-option :label="$t('transcodeTemplate.Canon')" value="1"></el-option>
          <el-option :label="$t('transcodeTemplate.sky')" value="2"></el-option>
          <el-option :label="$t('transcodeTemplate.city')" value="3"></el-option>
          <el-option :label="$t('transcodeTemplate.cheer')" value="4"></el-option>
          <el-option label="Glare" value="5"></el-option>
          <el-option label="Endsass Horizon" value="6"></el-option>
          <el-option :label="$t('transcodeTemplate.sunshine')" value="7"></el-option>
          <el-option :label="$t('transcodeTemplate.silence')" value="8"></el-option>
          <el-option :label="$t('transcodeTemplate.highMountain')" value="9"></el-option>
          <el-option :label="$t('transcodeTemplate.doubleBridge')" value="10"></el-option>
          <el-option :label="$t('transcodeTemplate.spring')" value="11"></el-option>
          <el-option :label="$t('transcodeTemplate.loveDream')" value="12"></el-option>
          <el-option :label="$t('transcodeTemplate.fragrance')" value="13"></el-option>
          <el-option :label="$t('transcodeTemplate.moon')" value="14"></el-option>
          <el-option :label="$t('transcodeTemplate.market')" value="15"></el-option>
          <el-option :label="$t('transcodeTemplate.voice')" value="16"></el-option>
          <el-option label="Truth and Lies" value="17"></el-option>
          <el-option :label="$t('transcodeTemplate.border')" value="18"></el-option>
          <el-option :label="$t('transcodeTemplate.water')" value="19"></el-option>
          <el-option label="Childhood Memory" value="20"></el-option>
          <el-option :label="$t('transcodeTemplate.youAre')" value="21"></el-option>
          <el-option :label="$t('transcodeTemplate.rainMark')" value="22"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('transcodeTemplate.templateRemark') + '：'"
        prop="templateDesc"
        v-show="active == 0"
        class="labelWidth"
      >
        <el-input
          type="textarea"
          style="
            background: #f2f2f2;
            width: 570px;
            height: 60px;
            resize: none;
            xcolor: #262626;
            border-radius: 4px;
          "
          :placeholder="$t('transcodeTemplate.writeTemplateRemark')"
          v-model="form.templateDesc"
          class="zd_textarea"
        ></el-input>
      </el-form-item>

      <div style="display: flex">
        <div style="width: 48%">
          <el-form-item
            :label="$t('transcodeTemplate.videoCode') + '：'"
            prop="vcodec"
            v-show="active == 1"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.vcodec"
              :placeholder="$t('transcodeTemplate.chooseVideoCode')"
            >
              <el-option :label="$t('transcodeTemplate.passthrough')" value="copy"></el-option>
              <el-option label="H264" value="libx264"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('transcodeTemplate.fps') + '：'"
            prop="r"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-input
              v-model="form.r"
              :placeholder="$t('transcodeTemplate.oneToThirty')"
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('transcodeTemplate.ifBFrame') + '：'"
            style="margin-right: 0px !important"
            prop="bstrategy"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-radio v-model="form.bstrategy" label="0" size="small" text-color="#333">
              {{ $t('transcodeTemplate.close') }}
            </el-radio>
            <el-radio v-model="form.bstrategy" label="1" size="small" text-color="#333">
              {{ $t('transcodeTemplate.enable') }}
            </el-radio>
          </el-form-item>

          <el-form-item
            :label="$t('transcodeTemplate.referenceFrame') + '：'"
            prop="refs"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-input
              v-model="form.refs"
              :placeholder="$t('transcodeTemplate.oneToSix')"
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('transcodeTemplate.speedModel') + '：'"
            prop="presetv"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.presetv"
              :placeholder="$t('transcodeTemplate.chooseSpeedModel')"
            >
              <el-option label="ultrafast" value="ultrafast"></el-option>
              <el-option label="superfast" value="superfast"></el-option>
              <el-option label="veryfast" value="veryfast"></el-option>
              <el-option label="faster" value="faster"></el-option>
              <el-option label="fast" value="fast"></el-option>
              <el-option label="medium" value="medium"></el-option>
              <el-option label="slow" value="slow"></el-option>
              <el-option label="slower" value="slower"></el-option>
              <el-option label="veryslow" value="veryslow"></el-option>
              <el-option label="placebo" value="placebo"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="profile："
            prop="profilev"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.profilev"
              :placeholder="$t('transcodeTemplate.chooseProfile')"
            >
              <el-option label="Baseline" value="base"></el-option>
              <el-option label="Main" value="main"></el-option>
              <el-option label="High" value="high"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('transcodeTemplate.threshold') + '：'"
            style="margin-right: 0px !important"
            prop="scthreshold"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-radio v-model="form.scthreshold" label="0" size="small" text-color="#333">
              0
            </el-radio>
            <el-radio v-model="form.scthreshold" label="1" size="small" text-color="#333">
              1
            </el-radio>
          </el-form-item>
          <el-form-item label="GOP：" prop="g" v-show="active == 1 && form.vcodec == 'libx264'">
            <el-input v-model="form.g" :placeholder="$t('transcodeTemplate.oneToSixty')"></el-input>
          </el-form-item>
        </div>

        <div style="width: 48%">
          <el-form-item
            :label="$t('transcodeTemplate.resolution') + '：'"
            prop="s"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.s"
              :placeholder="$t('transcodeTemplate.chooseResolution')"
            >
              <el-option label="QCIF(176x144)" value="176x144"></el-option>
              <el-option label="CIF(352x288)" value="352x288"></el-option>
              <el-option label="HALF D1(704x288)" value="704x288"></el-option>
              <el-option label="D1 4CIF(720x480)" value="720x480"></el-option>
              <el-option label="HD(1280x720)" value="1280x720"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('transcodeTemplate.codeLevel') + '：'"
            prop="level"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.level"
              :placeholder="$t('transcodeTemplate.chooseCodeLevel')"
            >
              <el-option label="1" value="1"></el-option>
              <el-option label="1.1" value="1.1"></el-option>
              <el-option label="1.2" value="1.2"></el-option>
              <el-option label="1.3" value="1.3"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="2.1" value="2.1"></el-option>
              <el-option label="2.2" value="2.2"></el-option>
              <el-option label="3" value="3"></el-option>
              <el-option label="3.1" value="3.1"></el-option>
              <el-option label="3.2" value="3.2"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="4.1" value="4.1"></el-option>
              <el-option label="4.2" value="4.2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('transcodeTemplate.frameInterval') + '：'"
            prop="keyintmin"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-input
              v-model="form.keyintmin"
              :placeholder="$t('transcodeTemplate.oneToOneThousand')"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('transcodeTemplate.threadCount') + '：'"
            prop="threads"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-input
              v-model="form.threads"
              :placeholder="$t('transcodeTemplate.moreThanZero')"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('transcodeTemplate.kbs') + '：'"
            prop="minrate"
            v-show="active == 1 && form.vcodec == 'libx264'"
            class="kbs"
          >
            <div style="display: flex">
              <el-input
                v-model="form.minrate"
                :placeholder="$t('transcodeTemplate.moreThanZero')"
                style="width: 141px"
              ></el-input>
              <span style="margin: 0px 3px">~</span>
              <el-input
                v-model="form.maxrate"
                :placeholder="$t('transcodeTemplate.moreThanZero')"
                style="width: 141px"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('transcodeTemplate.filter') + '：'"
            prop="vf"
            v-show="active == 1 && form.vcodec == 'libx264'"
          >
            <el-input
              v-model="form.vf"
              :placeholder="$t('transcodeTemplate.notRequired')"
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <div style="display: flex">
        <div style="width: 48%">
          <el-form-item
            :label="$t('transcodeTemplate.audioParameterSet') + '：'"
            prop="an"
            v-show="active == 2"
            :label-width="locale == 'en' ? '453px' : '258px'"
          >
            <el-switch
              v-model="form.an"
              active-color="#0085d0"
              inactive-color="#dee2e6"
            ></el-switch>
          </el-form-item>

          <el-form-item
            :label="$t('transcodeTemplate.audioCode') + '：'"
            prop="acodec"
            v-show="active == 2 && form.an"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.acodec"
              :placeholder="$t('transcodeTemplate.chooseAudioCode')"
            >
              <el-option label="aac" value="aac"></el-option>
              <el-option label="libmp3lame" value="libmp3lame"></el-option>
              <el-option label="copy" value="copy"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('transcodeTemplate.channel') + '：'"
            prop="ac"
            v-show="active == 2 && form.an && form.acodec != 2"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.ac"
              :placeholder="$t('transcodeTemplate.chooseChannel')"
            >
              <el-option :label="$t('transcodeTemplate.auto')" value></el-option>
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="6" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('transcodeTemplate.kbps') + '：'"
            prop="ba"
            v-show="active == 2 && form.an && form.acodec != 2"
          >
            <el-input
              v-model="form.ba"
              :placeholder="$t('transcodeTemplate.moreThanOrEqualZero')"
            ></el-input>
          </el-form-item>
        </div>
        <div style="width: 48%">
          <el-form-item
            :label="$t('transcodeTemplate.samplingRate') + '：'"
            prop="ar"
            v-show="active == 2 && form.an && form.acodec != 2"
            style="margin-top: 47px"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.ar"
              :placeholder="$t('transcodeTemplate.chooseSamplingRate')"
            >
              <el-option :label="$t('transcodeTemplate.auto')" value></el-option>
              <el-option label="8000" value="8000"></el-option>
              <el-option label="11025" value="11025"></el-option>
              <el-option label="16000" value="16000"></el-option>
              <el-option label="22050" value="22050"></el-option>
              <el-option label="24000" value="24000"></el-option>
              <el-option label="32000" value="32000"></el-option>
              <el-option label="44100" value="44100"></el-option>
              <el-option label="48000" value="48000"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('transcodeTemplate.track') + '：'"
            prop="dispositiona"
            v-show="active == 2 && form.an && form.acodec != 2"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="form.dispositiona"
              :placeholder="$t('transcodeTemplate.chooseTrack')"
            >
              <el-option :label="$t('transcodeTemplate.auto')" value></el-option>
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>

      <div v-show="active == 3" style="text-align: center; margin-bottom: 55px">
        <h2>{{ $t('transcodeTemplate.setSucc') }}</h2>
        <p>{{ $t('transcodeTemplate.clickDetermineBtn') }}</p>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="previousStep" v-show="active > 0">
          {{ $t('alarmLinkage.previousStep') }}
        </el-button>
        <el-button type="primary" @click="nextStep" v-show="active < 3">
          {{ $t('alarmLinkage.nextStep') }}
        </el-button>
        <el-button type="primary" @click="submitForm" v-if="active == 3">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      form: {
        templateId: '',
        templateContent: '',
        remark: '',
        thirdTemplateId: '',
        daiding: '',
        yinpin: true,
        dangci: '',
        ifDangci: '',

        //模板
        ///////////////////////////////////第一页
        templateName: '', //模板名称
        src: '0', //背景音乐
        templateDesc: '', //模板描述
        ///////////////////////////////////第二页
        vcodec: 'copy', //视频编码
        r: '', //帧率(fps)
        bstrategy: '0', //是否开启B帧
        refs: '3', //参考帧数
        presetv: 'fast', //速度模式
        profilev: 'base', //profile
        scthreshold: '0', //场景阈值
        g: '', //GOP
        s: '176x144', //视频分辨率
        level: '3', //编码档次
        keyintmin: '', //关键帧间隔
        threads: '', //线程数
        minrate: '', //码率范围(kbs)小
        maxrate: '', //码率范围(kbs)大
        vf: '', //视频滤镜
        ///////////////////////////////////第三页
        an: true, //音频参数设置开关
        acodec: 'aac', //音频编码
        ac: '', //声道
        ba: '', //码率(kbps)
        ar: '', //采样率
        dispositiona: '' //音轨
      },
      locale: localStorage.getItem('locale'),

      rules2: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setFormRules()
      this.locale = localStorage.getItem('locale')
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      var validate_r = (rule, value, callback) => {
        if (this.active == 1 && this.form.vcodec == 'libx264') {
          if (value === '') {
            callback(new Error(this.$t('transcodeTemplate.inputFps')))
          } else {
            if (value < 1 || value > 30 || !/^\d{1,}$/.test(value)) {
              callback(new Error(this.$t('transcodeTemplate.fpsOneToThirty')))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }

      var validate_refs = (rule, value, callback) => {
        if (this.active == 1 && this.form.vcodec == 'libx264') {
          if (value === '') {
            callback(new Error(this.$t('transcodeTemplate.inputReferenceFrame')))
          } else {
            if (value < 1 || value > 6 || !/^\d{1,}$/.test(value)) {
              callback(new Error(this.$t('transcodeTemplate.referenceFrameOneToSix')))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }

      var validate_g = (rule, value, callback) => {
        if (this.active == 1 && this.form.vcodec == 'libx264') {
          if (value === '') {
            callback(new Error(this.$t('transcodeTemplate.inputGOP')))
          } else {
            if (value < 0 || value > 60 || !/^\d{1,}$/.test(value)) {
              callback(new Error(this.$t('transcodeTemplate.GOPZeroToSixty')))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }

      var validate_keyintmin = (rule, value, callback) => {
        if (this.active == 1 && this.form.vcodec == 'libx264') {
          if (value === '') {
            callback(new Error(this.$t('transcodeTemplate.inputFrameInterval')))
          } else {
            if (value < 0 || value > 1000 || !/^\d{1,}$/.test(value)) {
              callback(new Error(this.$t('transcodeTemplate.frameIntervalOneToOneThousand')))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }

      var validate_minrate = (rule, value, callback) => {
        if (this.active == 1 && this.form.vcodec == 'libx264') {
          if (this.form.minrate === '' || this.form.maxrate === '') {
            callback(new Error(this.$t('transcodeTemplate.inputKbs')))
          } else {
            if (
              this.form.minrate < 0 ||
              this.form.minrate == 0 ||
              this.form.maxrate < 0 ||
              this.form.maxrate == 0 ||
              !/^\d{1,}$/.test(this.form.minrate) ||
              !/^\d{1,}$/.test(this.form.maxrate)
            ) {
              callback(new Error(this.$t('transcodeTemplate.kbsMoreThanZero')))
            } else if (this.form.minrate > this.form.maxrate) {
              callback(new Error(this.$t('transcodeTemplate.kbsFail')))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }

      var validate_threads = (rule, value, callback) => {
        if (this.active == 1 && this.form.vcodec == 'libx264') {
          if (value === '') {
            callback(new Error(this.$t('transcodeTemplate.inputThreadCount')))
          } else {
            if (value < 0 || value == 0 || !/^\d{1,}$/.test(value)) {
              callback(new Error(this.$t('transcodeTemplate.threadCountMoreThanZero')))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }

      var validate_ba = (rule, value, callback) => {
        if (this.active == 2 && this.form.an && this.form.acodec != 2) {
          if (value === '') {
            callback(new Error(this.$t('transcodeTemplate.inputKbps')))
          } else {
            if (value < 0 || !/^\d{1,}$/.test(value)) {
              callback(new Error(this.$t('transcodeTemplate.kbpsMoreThanZero')))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }

      var validate_ac = (rule, value, callback) => {
        if (this.active == 2 && this.form.an && this.form.acodec != 2) {
          if (value === '') {
            callback()
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var validate_ar = (rule, value, callback) => {
        if (this.active == 2 && this.form.an && this.form.acodec != 2) {
          if (value === '') {
            callback()
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var validate_dispositiona = (rule, value, callback) => {
        if (this.active == 2 && this.form.an && this.form.acodec != 2) {
          if (value === '') {
            callback()
          } else {
            callback()
          }
        } else {
          callback()
        }
      }

      this.rules2 = {
        templateName: [
          {
            required: true,
            message: this.$t('transcodeTemplate.inputTemplateName'),
            trigger: 'blur'
          }
        ],
        src: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseBackGroundMusic'),
            trigger: 'blur'
          }
        ],
        vcodec: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseVideoCode'),
            trigger: 'blur'
          }
        ],
        r: [{ required: true, validator: validate_r, trigger: 'blur' }],
        bstrategy: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseIfEnableBFrame'),
            trigger: 'blur'
          }
        ],
        presetv: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseSpeedModel'),
            trigger: 'blur'
          }
        ],
        profilev: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseProfile'),
            trigger: 'blur'
          }
        ],
        scthreshold: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseThreshold'),
            trigger: 'blur'
          }
        ],
        s: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseResolution'),
            trigger: 'blur'
          }
        ],
        level: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseCodeLevel'),
            trigger: 'blur'
          }
        ],
        refs: [{ required: true, validator: validate_refs, trigger: 'blur' }],
        g: [{ required: true, validator: validate_g, trigger: 'blur' }],
        keyintmin: [{ required: true, validator: validate_keyintmin, trigger: 'blur' }],
        threads: [{ required: true, validator: validate_threads, trigger: 'blur' }],
        minrate: [{ required: true, validator: validate_minrate, trigger: 'blur' }],
        acodec: [
          {
            required: true,
            message: this.$t('transcodeTemplate.chooseAudioCode'),
            trigger: 'blur'
          }
        ],
        ac: [{ required: true, validator: validate_ac, trigger: 'blur' }],
        ar: [{ required: true, validator: validate_ar, trigger: 'blur' }],
        dispositiona: [{ required: true, validator: validate_dispositiona, trigger: 'blur' }],
        ba: [{ required: true, validator: validate_ba, trigger: 'blur' }]
      }
    },
    previousStep() {
      if (this.active > 0) this.active--
    },
    nextStep() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.active < 3) {
            this.active++
          }
        }
      })
    },
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.active = 0
      this.$parent.dataForm = {
        templateId: '',
        templateContent: '',
        remark: '',
        thirdTemplateId: '',
        daiding: '',
        yinpin: true,
        dangci: '',
        ifDangci: '',

        //模板
        ///////////////////////////////////第一页
        templateName: '', //模板名称
        src: '0', //背景音乐
        templateDesc: '', //模板描述
        ///////////////////////////////////第二页
        vcodec: 'copy', //视频编码
        r: '', //帧率(fps)
        bstrategy: '0', //是否开启B帧
        refs: '3', //参考帧数
        presetv: 'fast', //速度模式
        profilev: 'base', //profile
        scthreshold: '0', //场景阈值
        g: '', //GOP
        s: '176x144', //视频分辨率
        level: '3', //编码档次
        keyintmin: '', //关键帧间隔
        threads: '', //线程数
        minrate: '', //码率范围(kbs)小
        maxrate: '', //码率范围(kbs)大
        vf: '', //视频滤镜
        ///////////////////////////////////第三页
        an: true, //音频参数设置开关
        acodec: 'aac', //音频编码
        ac: '', //声道
        ba: '', //码率(kbps)
        ar: '', //采样率
        dispositiona: '' //音轨
      }
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let addObj = {
            transcodeTempletParam: {
              templetName: this.form.templateName,
              templetDesc: this.form.templateDesc,
              src: this.form.src,
              vcodec: this.form.vcodec,
              profilev: this.form.profilev,
              scthreshold: this.form.scthreshold,
              level: this.form.level,
              refs: this.form.refs,
              keyintmin: this.form.keyintmin,
              r: this.form.r,
              s: this.form.s,
              presetv: this.form.presetv,
              threads: this.form.threads,
              g: this.form.g,
              maxrate: this.form.maxrate,
              minrate: this.form.minrate,
              bstrategy: this.form.bstrategy,
              vf: this.form.vf
            }
          }

          if (this.form.an) {
            addObj.transcodeTempletParam.an = Number(this.form.an)
            addObj.transcodeTempletParam.acodec = this.form.acodec
            addObj.transcodeTempletParam.ac = this.form.ac
            addObj.transcodeTempletParam.ba = this.form.ba
            addObj.transcodeTempletParam.ar = this.form.ar
            addObj.transcodeTempletParam.dispositiona = this.form.dispositiona
          }
          if (this.$parent.operation) {
            this.$api.addTemplate(addObj).then(res => {
              if (res.resultCode == 0) {
                this.$parent.getTemplateList()
                this.$parent.dialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: this.$t('public.addSuccess')
                })
              }
            })
          } else {
            addObj.transcodeTempletParam.templetId = this.form.templateId

            this.$api.modifyTemplate(addObj).then(res => {
              if (res.resultCode == 0) {
                this.$parent.getTemplateList()
                this.$parent.dialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: this.$t('public.modifySuccess')
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.transcodeTempListAddDialog {
  .el-dialog__body {
    padding: 15px 30px 5px;

    .el-button {
      height: 32px;
    }

    //进度条
    .el-step__icon-inner {
      font-size: 20px;
    }

    .el-steps {
      width: 100%;
    }

    .el-step__icon.is-text {
      width: 68px;
      height: 68px;
      background: transparent;
    }

    .el-step.is-center .el-step__line {
      width: 169px;
      left: 64%;
      top: 33px;
    }

    .el-step__head.is-process .el-step__icon.is-text {
      border-color: #64befd !important;
      color: #64befd;
    }

    .el-step__title.is-process {
      color: #64befd;
    }

    .el-step__title.is-success {
      color: #ccc;
    }

    .el-icon-check:before {
      font-size: 25px;
      color: #fff;
    }

    .el-step__head.is-success .el-step__icon.is-text {
      border-color: #64befd !important;
      background: #64befd;
    }

    .el-step__head.is-success {
      border-color: #bfbfbf;
    }

    .kbs .el-input__inner {
      width: 97px;
    }

    .labelWidth .el-form-item__label {
      width: 240px !important;
    }
  }
}
</style>
