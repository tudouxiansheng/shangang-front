<template>
  <div class="screen">
    <div class="equipment">
      <!--头部的搜索框-->
      <div class="topContent">
        <div class="iotTitle">物联设备</div>
        <div class="device">
          <span class="devicename">设备类型：</span>
          <el-select v-model="deviceTypeName" clearable filterable placeholder="请选择设备类型" style="width: 100%">
            <el-option
              v-for="item in deviceDictionary"
              :key="item.deviceType"
              :label="item.deviceTypeName"
              :value="item.deviceType"
            ></el-option>
          </el-select>
        </div>
        <div class="device">
          <span class="devicename">设备名称：</span>
          <el-input v-model="deviceName" placeholder="请输入设备名称" clearable></el-input>
        </div>
        <div class="searchBtn">
          <div class="mybtn" @click="getAllIotDevice">查询</div>
          <!-- <div class="mybtn jiance">区域检测</div> -->
        </div>
      </div>
      <!--底部的设备列表-->
      <div class="bottomContent">
        <div class="listTop">
          <div class="mytitle">设备类型</div>
          <div class="totalsum">数量</div>
        </div>
        <div class="deviceNum">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(item, index) in scsDeviceInfoList" :key="index" :name="item.value">
              <template slot="title">
                <div class="mycollapse">
                  <div class="leftbox">
                    <div class="leftimg">
                      <img :src="'./static/ioticon/equipment/' + item.deviceType + '.png'" />
                    </div>
                    <div class="leftName">{{ item.deviceTypeName }}</div>
                  </div>
                  <div class="rightbox">
                    <div class="rightmynum">{{ item.total }}</div>
                    <div class="zhedie">
                      <i class="el-icon-arrow-up iconRight" v-if="activeNames.indexOf(item.value) != -1"></i>
                      <i class="el-icon-arrow-down iconRight" v-else></i>
                    </div>
                    <div class="sight" @click="clickEyes(index)">
                      <img class="iconRight" src="../../../../assets/socialResources/可见.png" v-if="item.showable" />
                      <img class="iconRight" src="../../../../assets/socialResources/不可见.png" v-else />
                    </div>
                  </div>
                </div>
              </template>
              <div>
                <ul class="resultUl">
                  <li class="liLeft">名称</li>
                  <li class="status">状态</li>
                  <li class="liRight">地址</li>
                </ul>
                <div class="infoListDiv">
                  <div
                    class="nameAddrDiv"
                    @click="navigateToIcon(item1)"
                    v-for="(item1, index1) in item.scsSubDeviceInfoList"
                    :key="index1"
                  >
                    <span class="colSpan device-name">{{ item1.deviceName }}</span>
                    <span class="colSpan online" v-if="item1.statusName == '在线'">{{ item1.statusName }}</span>
                    <span class="colSpan outline" v-else>{{ item1.statusName }}</span>
                    <span class="colSpan spanleft">{{ item1.installLocation ? item1.installLocation : '未知' }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <!--设备弹窗-->

      <div class="popup-wrapper mypop info" v-show="showDeviceInfo">
        <div style="font-size: 16px">
          设备详情
          <i
            class="el-icon-close"
            style="margin-left: 236px; font-size: 18px; cursor: pointer"
            @click="closeDeviceDetail"
          ></i>
        </div>
        <div class="wrapperIcon">
          <div style="flex: 1">安装位置:{{ deviceInfo.installLocation }}</div>
          <div style="flex: 1">设备状态: {{ deviceInfo.statusName }}</div>
          <div style="flex: 1">经纬度:{{ deviceInfo.longitude }},{{ deviceInfo.latitude }}</div>
          <div class="shipin" v-if="deviceInfo.deviceType == 0 || deviceInfo.deviceType == 1">
            <div class="nowshipin" @click="goToLive(deviceInfo)">实时视频</div>
            <div class="nowshipin huifang" @click="goToVideo(deviceInfo)">录像回放</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIotDeviceList, getAllDeviceList } from '../../../../utils/api'
import { AllcamMap } from '../../../../utils/map/AllcamMap'
import VideoScreen from "@/mixin/VideoScreen" //查看视频
export default {
  mixins:[VideoScreen],
  data() {
    return {
      deviceTypeName: '',
      deviceName: '', //设备名称
      activeNames: [],
      deviceType: [],
      scsDeviceInfoList: [], //所有物联设备集合
      deviceDictionary: [], //设备字典树
      showDeviceInfo: false,
      deviceInfo: {}, //点击单个设备详情
    }
  },
  created() {
    //获取所有物联设备
    this.getAllIotDevice()
    //获取所有物联设备字典
    this.getAllDeviceDictionary()
  },
  methods: {
    //折叠面板激活
    handleChange() {},
    //物联监控字典树
    getAllDeviceDictionary() {
      getAllDeviceList({}).then((res) => {
        console.log(res, 'res')
        if (res.resultCode == 0) {
          this.deviceDictionary = res.deviceTypeList
        }
      })
    },
    //点击眼
    clickEyes(index) {
      console.log(index, this.scsDeviceInfoList[index].deviceType)
      if (this.scsDeviceInfoList[index].showable) {
        this.$set(
          this.scsDeviceInfoList,
          index,
          Object.assign(this.scsDeviceInfoList[index], {
            showable: false,
          })
        )
        if (AllcamMap.map) {
          AllcamMap.map.displayIcon(this.scsDeviceInfoList[index].deviceType, false)
        }
      } else {
        this.$set(
          this.scsDeviceInfoList,
          index,
          Object.assign(this.scsDeviceInfoList[index], {
            showable: true,
          })
        )
        if (AllcamMap.map) {
          AllcamMap.map.displayIcon(this.scsDeviceInfoList[index].deviceType, true)
        }
      }
    },
    //获取所有物联设备
    getAllIotDevice() {
      getIotDeviceList({
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
        organizationId: 0,
        deviceName: this.deviceName,
        deviceType: this.deviceTypeName,
      }).then((res) => {
        console.log(res)
        if (res.resultCode == 0) {
          this.scsDeviceInfoList = res.scsDeviceInfoList
          for (let i = 0; i < this.scsDeviceInfoList.length; i++) {
            Object.assign(this.scsDeviceInfoList[i], {
              showable: true,
            })
            if (AllcamMap.map) {
              AllcamMap.map.loadIotDeviceIcon(this.scsDeviceInfoList[i].scsSubDeviceInfoList, true)
            }
          }
        }
      })
    },
    //定位到图标
    navigateToIcon(deviceInfo) {
      console.log(deviceInfo, '单个设备信息')
      if (AllcamMap.map) {
        let entities = AllcamMap.map.plotDrawTool.getEntitys()
        let target = AllcamMap.map.getPlotById(deviceInfo.deviceId)
        AllcamMap.map.viewer.flyTo(target)
      }
      this.showDeviceInfo = true
      this.deviceInfo = deviceInfo
    },
    //关闭设备详情
    closeDeviceDetail() {
      this.showDeviceInfo = false
    },
  },
}
</script>

<style lang="scss">
.equipment {
  pointer-events: auto;
  width: 450px;
  min-height: 90%;
  height: 89.8vh;
  position: absolute;
  right: 19px;
  margin-top: 16px;
  background: url('../../../../assets/buildingSeting/background.png') no-repeat;
  background-size: 100% 100%;

  .topContent {
    padding: 22px 21px 0 18px;
    display: flex;
    flex-direction: column;

    .iotTitle {
      font-size: 16px;
      font-weight: bold;
      color: #1efffc;
    }

    .device {
      display: flex;
      line-height: 40px;
      margin-top: 17px;

      .devicename {
        font-size: 14px;
        font-weight: 400;
        width: 120px;
        color: #edf6f7;
      }
    }

    .searchBtn {
      display: flex;
      margin-top: 24px;
      justify-content: center;

      .mybtn {
        width: 160px;
        height: 40px;
        line-height: 40px;
        background: #00ccff;
        border-radius: 4px;
        color: white;
        text-align: center;
      }

      .jiance {
        margin-left: 13px;
      }
    }
  }

  .bottomContent {
    margin-top: 38px;
    width: 100%;
    overflow-y: hidden;
    max-height: 700px;
    padding: 10px;

    .listTop {
      display: flex;
      font-size: 14px;
      color: #1efffc;

      .mytitle {
        flex: 1;
        text-align: center;
      }

      .totalsum {
        flex: 1;
        text-align: center;
      }
    }

    .deviceNum {
      margin-top: 23px;
      overflow-y: scroll;
      max-height: 600px;

      .el-collapse-item__header.is-active {
        border-bottom-color: #ebeef5;
      }

      .el-collapse-item__content {
        color: #edf6f7;
        padding-bottom: 0px;
      }

      .el-collapse-item__wrap {
        background-color: transparent;
        color: #fff;
        border: none;
      }

      .el-collapse {
        border: none;
      }

      .el-collapse-item {
        margin: 0px 0px 24px;
      }

      .el-collapse-item__arrow {
        display: none;
      }

      .el-collapse-item__header {
        height: 36px;
        line-height: 36px;
        background: rgba(0, 204, 255, 0.5);
        color: #edf6f7;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        border: none;
        position: relative;
      }

      .mycollapse {
        width: 100%;
        height: 36px;
        display: flex;

        .leftbox {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          margin-left: 50px;

          .leftimg {
            line-height: 36px;
            display: flex;
            align-items: center;

            img {
              width: 17px;
              height: 17px;
            }
          }

          .leftName {
            margin-left: 10px;
          }
        }

        .rightbox {
          flex: 1;
          display: flex;

          .rightmynum {
            flex: 2;
            text-align: right;
          }

          .zhedie {
            flex: 1;
            text-align: center;
          }

          .sight {
            flex: 1;
            text-align: center;

            img {
              width: 19px;
            }
          }
        }
      }

      .resultUl {
        display: flex;
        color: #1efffc;

        .liLeft {
          flex: 2;
          text-align: center;
        }

        .liRight {
          flex: 1;
          text-align: center;
        }

        .status {
          flex: 1;
          text-align: center;
        }
      }

      .infoListDiv {
        margin-top: 10px;

        .nameAddrDiv {
          display: flex;
          font-size: 12px;
          line-height: 30px;
        }

        .colSpan {
          flex: 1;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          text-overflow: ellipsis;
          padding-left: 10px;
          box-sizing: border-box;
          &.device-name {
            flex: 2;
          }
        }

        .online {
          color: #2bdca7;
        }
        .outline {
          color: #f08282;
        }
      }
    }
  }

  .info {
    position: absolute;
    top: 116px;
    right: 614px;

    .wrapperIcon {
      flex: 1;
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      .shipin {
        display: flex;

        .nowshipin {
          width: 69px;
          background: #00ccff;
          border-radius: 5px;
          line-height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .huifang {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
