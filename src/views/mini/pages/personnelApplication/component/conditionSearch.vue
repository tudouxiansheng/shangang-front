<template>
  <div class="personByConditionSearch">
    <el-form :model="searchInfo2" label-suffix="：">
      <el-form-item label="检索类型">
        <el-radio-group @change="changeType" v-model="searchInfo2.searchType">
          <el-radio label="1">人脸检索</el-radio>
          <el-radio label="2">人体检索</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="人员姓名" v-if="searchInfo2.searchType == 1">
        <el-input v-model="searchInfo2.personName" maxlength="20" placeholder="请输入人员姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" v-if="searchInfo2.searchType == 1">
        <el-input v-model="searchInfo2.credentialNumber" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="时间段">
        <el-radio-group v-model="timeType" size="small" @change="radioChange">
          <el-radio-button label="1">近三天</el-radio-button>
          <el-radio-button label="2">近七天</el-radio-button>
          <el-radio-button label="3">近一月</el-radio-button>
          <el-radio-button label="4">自定义</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          v-model="searchInfo2.beginTime"
          type="datetime"
          placeholder="开始时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          v-model="searchInfo2.endTime"
          type="datetime"
          placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="算法名称">
        <el-select v-model="searchInfo2.algorithmAccessId" style="width: 100%">
          <el-option
            v-for="(item, index) in algorithmAccessList"
            :key="index"
            :label="item.accessName"
            :value="item.accessId"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="摄像机">-->
      <!--        <el-radio-group v-model="searchInfo2.type">-->
      <!--          <el-radio label="1">全部</el-radio>-->
      <!--          <el-radio label="2">指定摄像机</el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
      <el-form-item label="摄像机">
        <el-input :placeholder="placeholder" @click.native="handleClickCamera">
          <img slot="suffix" src="../../../../../assets/vehicleApp/tree.png" class="tree-img" />
        </el-input>
      </el-form-item>
      <el-form-item label="性别" class="custom-form-item">
        <el-radio-group v-model="searchInfo2.gender">
          <el-radio-button label="-1">不限</el-radio-button>
          <el-radio-button label="1">男</el-radio-button>
          <el-radio-button label="2">女</el-radio-button>
          <el-radio-button label="0">未知</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄段" class="custom-form-item">
        <el-radio-group v-model="searchInfo2.age">
          <el-radio-button label="0">未知</el-radio-button>
          <el-radio-button label="1">儿童</el-radio-button>
          <el-radio-button label="2">少年</el-radio-button>
          <el-radio-button label="3">青年</el-radio-button>
          <el-radio-button label="4">中年</el-radio-button>
          <el-radio-button label="5">老年</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="口罩" class="custom-form-item">
        <el-radio-group v-model="searchInfo2.mouthMask">
          <el-radio-button label="-1">不限</el-radio-button>
          <el-radio-button label="1">戴口罩</el-radio-button>
          <el-radio-button label="2">未戴口罩</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="眼镜" class="custom-form-item">
        <el-radio-group v-model="searchInfo2.eyeGlass">
          <el-radio-button label="-1">不限</el-radio-button>
          <el-radio-button label="1">戴眼镜</el-radio-button>
          <el-radio-button label="2">未戴眼镜</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- <div class="block more" @click="moreProperty">
     <span style="margin-right: 5px">更多特性</span
     ><img
       v-if="morePropertyVisiable"
       src="../../../../../assets/faceSearch/more.png"
       alt=""
     />
     <img
       v-else
       src="../../../../../assets/faceSearch/more.png"
       alt=""
       style="transform: rotate(180deg)"
     />
   </div>
   <div class="moreProperty" v-if="morePropertyVisiable">
     <div class="block gender">
       <span class="name">具体年龄：</span>
       <div class="formItem">
         <el-date-picker
           style="width: 335px"
           v-model="dateValue1"
           type="daterange"
           range-separator="——"
           start-placeholder="开始年龄"
           end-placeholder="结束年龄"
           @change="changeDate"
         ></el-date-picker>
       </div>
     </div>
     <div class="block gender">
       <span class="name">表情：</span>
       <div class="formItem ageRange">
         <el-radio-group v-model="gender">
           <el-radio-button label="0">不限</el-radio-button>
           <el-radio-button label="1">笑脸</el-radio-button>
           <el-radio-button label="2">愤怒</el-radio-button>
           <el-radio-button label="3">悲伤</el-radio-button>
           <el-radio-button label="4">正常</el-radio-button>
           <el-radio-button label="5">惊讶</el-radio-button>
         </el-radio-group>
       </div>
     </div>
     <div class="block gender">
       <span class="name">帽子：</span>
       <div class="formItem kouzhao">
         <el-radio-group v-model="searchInfo2.hat">
           <el-radio-button label="-1">不限</el-radio-button>
           <el-radio-button label="1">戴帽子</el-radio-button>
           <el-radio-button label="2">未戴帽子</el-radio-button>
         </el-radio-group>
       </div>
     </div>
     <div class="block gender">
       <span class="name">胡子：</span>
       <div class="formItem ageRange">
         <el-radio-group v-model="gender">
           <el-radio-button label="0">不限</el-radio-button>
           <el-radio-button label="1">有</el-radio-button>
           <el-radio-button label="2">无</el-radio-button>
         </el-radio-group>
       </div>
     </div>
   </div> -->
      <el-form-item>
        <div class="btn-group">
          <el-button type="primary" class="btnPrimary" @click="getPeopleList2">检索</el-button>
          <el-button type="primary" class="btnPrimary btnReset" @click="resetSearchInfo2">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { DateDiff } from '@/utils/mutil'
import { AllcamMap } from '../../../../../utils/map/AllcamMap'
import { bodysearchByCondition, facesearchByCondition, algorithmAccess } from '@/utils/api.js'
import Dayjs from '../../../../../utils/Dayjs'
export default {
  props: {
    choseDeviceList: {
      type: Array,
      default() {
        return []
      },
    },
    camernum: {
      type: Number,
    },
  },
  data() {
    return {
      // 静态（以图搜人）查询参数
      searchInfo2: {
        personName: '',
        credentialNumber: '',
        confidenceThreshold: '80',
        cameraList: [],
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
        gender: -1, //性别
        age: 0, //年龄
        mouthMask: -1, //口罩
        eyeGlass: -1, //眼镜
        threshold: 80,
        searchType: '1', //1人脸检索  //2人体检索
        imageQuality: 80,
        timeType: '',
        beginTime: '',
        endTime: '',
        algorithmAccessId: '',
      },

      // 控制更多特性的显示与隐藏
      morePropertyVisiable: false,
      dateValue: [],
      placeholder: '请选择摄像机',
      timeType: '4',
      algorithmAccessList: [],
    }
  },
  created() {
    this.radioChange()
    this.getAlgorithmAccess()
  },
  methods: {
    // 时间按钮发生变化时
    radioChange() {
      let s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
      let e = Dayjs().format('YYYY-MM-DD 23:59:59')
      // 如果是近三天
      if (this.timeType == '1') {
        s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD 23:59:59')
      }
      // 如果是近七天
      else if (this.timeType == '2') {
        s = Dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD 23:59:59')
      }
      // 如果是近一个月
      else if (this.timeType == '3') {
        s = Dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD 23:59:59')
      } else {
        s = ''
        e = ''
      }
      this.searchInfo2.beginTime = s
      this.searchInfo2.endTime = e
    },
    changeType() {
      console.log(this.searchInfo2.searchType)
      this.$store.commit('changepTab', Number(this.searchInfo2.searchType) + 1)
      if (this.$store.state.personId) {
        if (AllcamMap.map) {
          AllcamMap.map.removeTrack(this.$store.state.personId)
        }
      }
    },
    //重置
    resetSearchInfo2() {
      this.camernum = 0
      for (let [k, v] of Object.entries(this.searchInfo2)) {
        if (this.searchInfo2[k] instanceof Array) {
          this.searchInfo2[k] = []
        } else {
          this.searchInfo2[k] = ''
        }
      }
      this.placeholder = '请选择摄像机'
      this.dateValue = []
    },
    //检索
    getPeopleList2() {
      if (DateDiff(this.searchInfo2.beginTime, this.searchInfo2.endTime) > 30) {
        this.$message.warning('以图搜人时间间隔不能大于30天')
        return
      }
      // 根据id去重
      console.log(' this.searchInfo2', this.searchInfo2)
      this.searchInfo2.cameraList = []
      let hash = {}
      const data2 = this.choseDeviceList.reduce((preVal, curVal) => {
        hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
        return preVal
      }, [])
      console.log(data2, 'data2', 'cameraid')
      //data2是过滤之后的cameraid
      for (let i = 0; i < data2.length; i++) {
        this.searchInfo2.cameraList.push(data2[i].id)
      }
      if (this.choseDeviceList.length) {
        if (this.searchInfo2.algorithmAccessId) {
          if (this.searchInfo2.beginTime && this.searchInfo2.endTime) {
            if (this.searchInfo2.searchType == 1) {
              //人脸
              if (this.searchInfo2.credentialNumber != '') {
                let reg15 = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
                if (!reg15.test(this.searchInfo2.credentialNumber)) {
                  this.$alert('请输入正确的手机号码', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                  })
                  return
                }
              } else if (this.searchInfo2.credentialNumber == '' && this.searchInfo2.personName == '') {
                this.searchInfo2.confidenceThreshold = ''
              }
              this.$store.commit('personConditionSearch', this.searchInfo2)
              sessionStorage.setItem('searchInfo3', JSON.stringify(this.searchInfo2))
              facesearchByCondition(this.searchInfo2).then((res) => {
                console.log(res, 'res')
                if (res.resultCode == 0) {
                  //展开结果
                  this.$emit('showfaceConditionSearchResult')
                  this.$emit('result', res)
                  this.$store.commit('facesearchByCondition', res.resultList)
                  setTimeout(() => {
                    if (this.$store.state.facesearchByConditionArray.length > 0) {
                      this.$store.commit('exPictureToExpan', 2)
                    }
                  }, 0)
                }
              })

              this.$store.commit('exPictureToExpan', 2)
            } else {
              ;(this.searchInfo2.credentialNumber = ''),
                (this.searchInfo2.personName = ''),
                (this.searchInfo2.confidenceThreshold = ''),
                //人体
                //首先把分页信息告诉vuex
                sessionStorage.setItem('searchInfo3', JSON.stringify(this.searchInfo2))
              this.$store.commit('personConditionSearch', this.searchInfo2)
              //告诉父组件，父组件去告诉子组件方法
              this.$emit('showfaceConditionSearchResult')
              bodysearchByCondition(this.$store.state.searchInfo2).then((res) => {
                if (res.resultCode == 0) {
                  this.$emit('result', res)
                  this.$store.commit('bodysearchByCondition', res.resultList)
                  this.$store.commit('exPictureToExpan', 3)
                }
              })
              this.$store.commit('exPictureToExpan', 3)
            }
          } else {
            this.$alert('请选择开始时间和结束时间', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
            })
          }
        } else {
          this.$alert('请选择算法', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
          })
        }
      } else {
        this.$alert('请选择摄像机', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        })
      }
    },
    // 修改时间格式
    // 更多特性
    moreProperty() {
      this.morePropertyVisiable = !this.morePropertyVisiable
    },
    handleClickCamera() {
      this.$emit('showCamerBox')
    },
    //获取算法
    getAlgorithmAccess() {
      let data = {
        pageInfo: { pageNum: 1, pageSize: 10 },
      }
      algorithmAccess(data).then((res) => {
        if (res.resultCode == 0) {
          this.algorithmAccessList = res.algorithmAccessList
        }
      })
    },
  },
  watch: {
    camernum: function (newValue, oldValue) {
      if (newValue > 0) {
        this.placeholder = `已选择${newValue}台摄像机`
      } else {
        this.placeholder = `请选择摄像机`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  width: 300px;
  padding-top: 20px;
  align-items: center;
  justify-content: center;
  .btn {
    flex: 1;
  }
  .checkleft {
    margin-right: 20px;
  }
  .btnPrimary {
    width: 100%;
    height: 40px;
    background: #00ccff;
    border-radius: 4px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }
}
.bottom-tools {
  display: flex;
  align-content: center;
  justify-content: center;
  margin-top: 40px;
}
.tree-img {
  width: 18px;
  height: 18px;
  position: absolute;
  right: 6px;
  top: 8px;
}
.personByConditionSearch {
  .custom-form-item {
    ::v-deep.el-radio-group .el-radio-button__inner {
      width: 100%;
      line-height: 14px;
      margin-top: 5px;
      border: 1px solid #7ea5c9;
    }
    ::v-deep.el-radio-group .el-radio-button {
      margin-right: 5px;
      margin-bottom: 5px;
      &:first-child .el-radio-button__inner {
        border-radius: 0;
      }
      &:last-child .el-radio-button__inner {
        border-radius: 0;
      }
    }
  }

  ::v-deep.el-form {
    .el-form-item__label {
      width: 100px;
    }
    .el-form-item__content {
      margin-left: 100px;
    }
  }
  .jiansuo {
    display: flex;
  }
  .more {
    padding-top: 10px;
    text-align: right;
    color: #00ccff;
    font-size: 12px;
    cursor: pointer;
  }
  .timetap {
    margin-top: 43px;
    display: flex;
  }
}

.moreProperty {
  height: 94px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.componentPos {
  right: 530px;
  top: 80px;
}
.componentPos1 {
  right: 530px;
  top: 50%;
  transform: translateY(-50%);
}

#sex .el-radio-group .el-radio-button__inner {
  width: 60px !important;
}
#sex .el-radio-button {
  width: 60px !important;
  margin-right: 7px !important;
}
#sex .el-radio-group .el-radio-button .el-radio-button__inner {
  border-radius: 4px;
}

.ageRange .el-radio-group .el-radio-button__inner {
  width: 60px !important;
}
.ageRange .el-radio-button {
  width: 60px !important;
  margin-right: 7px !important;
  margin-bottom: 7px;
}
.ageRange .el-radio-group .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 4px;
}
.ageRange .el-radio-group .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 4px;
}
.ageRange .el-radio-group {
  display: flex;
  flex-wrap: wrap;
}
.kouzhao .el-radio-group .el-radio-button__inner {
}
.kouzhao .el-radio-button {
  margin-right: 7px !important;
}
.kouzhao .el-radio-button:nth-child(3) {
}
.kouzhao .el-radio-group .el-radio-button:last-child .el-radio-button__inner {
}
.kouzhao .el-radio-group .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 4px;
}
.kouzhao .el-radio-group .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 4px;
}
.kouzhao .el-radio-button--small .el-radio-button__inner {
  border-radius: 4px;
}
.ageRange .el-radio-button--small .el-radio-button__inner {
  border-radius: 4px;
}
.personByConditionSearch .time22 .el-radio-group .el-radio-button__inner {
  width: 110px !important;
}
</style>
