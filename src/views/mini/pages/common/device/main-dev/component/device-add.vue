<template>
  <div>
    <el-dialog
      :title="$t('primaryDevice.addDevice')"
      v-model="$parent.addMainDevVisible"
      top="10vh"
      :width="locale == 'en' ? '1350px' : '1050px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="addDeviceDialog"
    >
      <el-steps :active="addActive" align-center finish-status="success" style="text-align: left">
        <template v-for="item in stepList">
          <el-step :title="item.name"></el-step>
        </template>
      </el-steps>

      <el-form
        v-show="addActive == 0"
        ref="form"
        :model="form"
        :rules="rules"
        :validate-on-rule-change="false"
        :label-width="locale == 'en' ? '190px' : '156px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <!-- 组织 -->
            <el-form-item :label="$t('primaryDevice.organization') + '：'" prop="organizationName">
              <el-input
                v-model="form.organizationName"
                :placeholder="$t('public.pleaseInputorganizationName')"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <!-- 域编码 -->
            <el-form-item
              :label="$t('Operations.DomaincodeName') + '：'"
              prop="domainCode"
              v-show="domainCodeShow"
            >
              <el-select
                :popper-append-to-body="false"
                v-model="form.domainCode"
                autocomplete="off"
                :placeholder="$t('public.domainNamePrompts')"
                @change="domainCodeChange"
                ref="Domaincode"
              >
                <el-option
                  v-for="(item, index) in domaincodelist"
                  :key="index"
                  :label="item.domainName"
                  :value="item.domainCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 网关IP -->
            <el-form-item
              :label="$t('primaryDevice.tasIp') + '：'"
              prop="tasIp"
              v-show="clusterTasShow"
            >
              <el-select
                :popper-append-to-body="false"
                v-model="form.tasIp"
                :placeholder="$t('public.tasIpPrompt')"
                @focus="changeTasIp"
              >
                <el-option
                  v-for="(item, index) in tasIplist"
                  :key="index"
                  :label="item.gatewayIp"
                  :value="item.gatewayIp"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 平台名称 -->
            <el-form-item :label="$t('public.platName') + '：'" prop="platId">
              <el-select
                :popper-append-to-body="false"
                v-model="form.platId"
                :placeholder="$t('public.pleaseInputplatName')"
                @change="platChange"
              >
                <template v-for="(item, index) in $parent.AddplatNameLists" :key="index">
                  <el-option
                    v-if="item.platType != 16"
                    :label="item.platName"
                    :value="item.platId"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>

            <!-- 集群编码 -->
            <el-form-item
              :label="$t('Operations.clusterName') + '：'"
              prop="clusterCode"
              v-show="clusterCodeShow"
            >
              <el-select
                :popper-append-to-body="false"
                v-model="form.clusterCode"
                :placeholder="$t('public.clusterCodePrompt')"
                @change="clusterCodeChange"
              >
                <el-option
                  v-for="(item, index) in clusterCodelist"
                  :key="index"
                  :label="item.clusterName"
                  :value="item.clusterCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 网关编码 -->
            <el-form-item
              :label="$t('primaryDevice.tasCode') + '：'"
              prop="tasCode"
              v-show="clusterTasShow"
            >
              <el-input
                v-model="form.tasCode"
                :placeholder="$t('public.chooseTasIpFirst')"
                readonly
                @focus="tasCodeFoucs"
              />
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('public.mainDevName') + '：'" prop="mainDevName">
              <el-input
                v-model="form.mainDevName"
                :placeholder="$t('public.pleaseInputMainDevName')"
                clearable
              ></el-input>
            </el-form-item>

            <!--设备序列号-->
            <el-form-item
              :label="$t('public.mainDevSn') + '：'"
              prop="mainDevSn"
              v-show="mainDevSnShow"
            >
              <el-input
                v-model="form.mainDevSn"
                :placeholder="$t('public.pleaseInputmainDevSn')"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 设备协议类型 -->
            <el-form-item :label="$t('primaryDevice.drive') + '：'" prop="drive">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.drive"
                :placeholder="$t('primaryDevice.pleaseInputDrive')"
                @change="driveChange"
                @focus="driveShow"
                :disabled="platType == TYPE_PLAT_NVR800"
              >
                <el-option
                  v-for="(item, index) in driveData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!--设备验证码  -->
            <el-form-item
              :label="$t('public.validateCode') + '：'"
              prop="validateCode"
              v-show="validateCodeShow"
            >
              <el-input
                v-model="form.validateCode"
                :placeholder="$t('public.pleaseInputvalidateCode')"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <!-- 前端注册密码 -->
            <el-form-item
              :label="$t('primaryDevice.puAccessPasswd') + '：'"
              prop="puAccessPasswd"
              v-if="puAccessPasswdShow"
            >
              <pwd-input
                v-model="form.puAccessPasswd"
                :placeholder="$t('public.puAccessPasswdPrompt')"
                strength
              />
            </el-form-item>
          </div>
          <div class="form-right">
            <!-- 互联编码 -->
            <el-form-item
              :label="$t('primaryDevice.accessInterconnectCode') + '：'"
              prop="accessInterconnectCode"
              v-show="interconnectCodeShow"
            >
              <el-input
                v-model="form.accessInterconnectCode"
                :placeholder="$t('primaryDevice.pleaseInputinterconnectCode')"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <!-- 设备类型 -->
            <el-form-item :label="$t('public.mainDevType') + '：'" prop="mainDevType">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.mainDevType"
                :placeholder="$t('public.pleaseInputMainDevType')"
                @change="mainDevTypeChange"
                :disabled="platType == TYPE_PLAT_NVR800 || form.drive == TYPE_DRIVE_HWSDK_ACREG"
              >
                <el-option
                  v-for="(item, index) in $parent.mainDevTypeData"
                  :key="index"
                  :label="item.mainDevName"
                  :value="item.AmainDev"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-right">
            <!-- 最大通道号 -->
            <el-form-item
              :label="$t('primaryDevice.maxVideoNum') + '：'"
              prop="maxVideoNum"
              v-show="maxVideoNumShow"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.maxVideoNum"
                :placeholder="$t('public.maxVideoNumPrompt')"
              >
                <el-option
                  v-for="(item, index) in maxVideoNumData"
                  :key="index"
                  :label="item.maxVideoName"
                  :value="item.maxVideoNum"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <!-- 厂商类型 -->
            <el-form-item :label="$t('public.manufacturer') + '：'" prop="manufacturer">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.manufacturer"
                :placeholder="$t('public.pleaseInputmanufacturer')"
                :disabled="platType == TYPE_PLAT_NVR800 || form.drive == TYPE_DRIVE_HWSDK_ACREG"
              >
                <el-option
                  v-for="(item, index) in $parent.manufacturerData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 智能属性 -->
            <el-form-item :label="$t('primaryDevice.imgType') + '：'" prop="imgType">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.imgType"
                :placeholder="$t('primaryDevice.pleaseInputImgType')"
              >
                <el-option
                  v-for="(item, index) in $parent.imgTypeAll"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 应用类型 -->
            <el-form-item :label="$t('public.applicationType') + '：'" prop="applicationType">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.applicationType"
                :placeholder="$t('public.pleaseInputApplicationType')"
              >
                <el-option
                  v-for="(item, index) in $parent.applicationData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-right">
            <!--摄像机类型  -->
            <el-form-item :label="$t('primaryDevice.ptzType') + '：'" prop="ptzType">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.ptzType"
                :placeholder="$t('public.ptzTypePrompt')"
              >
                <el-option
                  v-for="(item, index) in $parent.ptzTypeData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 网络接入类型 -->
            <el-form-item :label="$t('primaryDevice.networkType') + '：'" prop="networkType">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.networkType"
                :placeholder="$t('primaryDevice.pleaseInputnetworkType')"
              >
                <el-option
                  v-for="(item, index) in $parent.networkTypeData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <!-- 账号-->
            <el-form-item
              :label="$t('primaryDevice.puAccount') + '：'"
              prop="puAccount"
              v-show="puAccountPwdShow"
            >
              <el-input
                v-model="form.puAccount"
                :placeholder="$t('primaryDevice.pleaseInputpuAccount')"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('primaryDevice.puIp') + '：'"
              prop="puIp"
              v-show="puIpPortShow"
            >
              <el-input
                v-model="form.puIp"
                :placeholder="$t('primaryDevice.pleaseInputpuIp')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('public.longitude') + '：'" prop="longitude">
              <el-input
                ref="inputBlurLat"
                @focus="longlatFocus"
                v-model="form.longitude"
                :placeholder="$t('public.pleaseInputlongitude')"
                clearable
              ></el-input>
            </el-form-item>
            <!-- 安装地址 -->
            <el-form-item :label="$t('public.installLocate') + '：'" prop="installLocate">
              <el-input
                v-model="form.installLocate"
                :placeholder="$t('public.pleaseInputinstallLocate')"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item
              :label="$t('primaryDevice.puPasswd') + '：'"
              prop="puPasswd"
              v-show="puAccountPwdShow"
            >
              <pwd-input
                v-model="form.puPasswd"
                :placeholder="$t('public.puPasswdPrompt')"
                strength
              />
            </el-form-item>

            <el-form-item
              :label="$t('primaryDevice.puPort') + '：'"
              prop="puPort"
              v-show="puIpPortShow"
            >
              <el-input
                v-model="form.puPort"
                :placeholder="$t('primaryDevice.pleaseInputpuPort')"
                clearable
              ></el-input>
            </el-form-item>

            <!--纬度  -->
            <el-form-item :label="$t('public.latitude') + '：'" prop="latitude">
              <el-input
                ref="inputBlurLog"
                @focus="longlatFocus"
                v-model="form.latitude"
                :placeholder="$t('public.pleaseInputlatitude')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div v-show="platType == PLATFORM_TYPE.ADS" class="form-flex">
          <div class="form-left" style="margin: 0 0 24px 0px">
            <span
              style="display: inline-block"
              :style="locale == 'en' ? 'width:190px' : 'width:156px'"
            >
              {{ $t('primaryDevice.isPicAccess') + '：' }}
            </span>
            <el-switch
              v-model="isAccessImg"
              active-color="#0085d0"
              inactive-color="#dee2e6"
              @change="accessImg"
            />
          </div>
          <div class="form-right" />
        </div>

        <el-form-item :label="$t('public.remark') + '：'" prop="remark" class="padding40">
          <el-input
            v-model="form.remark"
            :placeholder="$t('public.pleaseInputremark')"
            type="textarea"
            maxlength="512"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 是否图片接入开关 -->
      <el-form
        v-show="addActive == 1 && platType == 15 && isAccessImg"
        ref="addMainDevPicForm"
        :model="addMainDevPicForm"
        :rules="picRules"
        label-width="180px"
        label-position="left"
      >
        <div>
          <div class="form-flex">
            <!-- 设备向平台注册密码 -->
            <div class="form-left">
              <!-- 互联编码 -->
              <el-form-item
                :label="$t('primaryDevice.interconnectCode') + '：'"
                prop="accessInterconnectCodeImg"
              >
                <el-input
                  v-model="addMainDevPicForm.accessInterconnectCodeImg"
                  :placeholder="$t('primaryDevice.pleaseInputinterconnectCode')"
                  @input="accessInterconnectCodeImgInput"
                />
              </el-form-item>
              <!-- 用户名 -->
              <el-form-item :label="$t('userManage.userName') + '：'" prop="accessUsername">
                <el-input
                  v-model="addMainDevPicForm.accessUsername"
                  :placeholder="$t('userManage.namePrompt')"
                />
              </el-form-item>
            </div>
            <div class="form-right">
              <!-- 智能卡口类型 -->
              <el-form-item :label="$t('deviceCamera.narrowType') + '：'" prop="narrowType">
                <el-select
                  v-model="addMainDevPicForm.narrowType"
                  clearable
                  :popper-append-to-body="false"
                  @change="narrowTypeChange"
                  :placeholder="$t('deviceCamera.chooseNarrowType')"
                >
                  <el-option
                    v-for="item of narrowTypeOption"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item :label="$t('public.password') + '：'" prop="puAccessPasswdImg">
                <el-input
                  v-model="addMainDevPicForm.puAccessPasswdImg"
                  :type="passws"
                  :placeholder="$t('public.puAccessPasswdPrompt')"
                  @input="puAccessPasswdImgInput"
                >
                  <template #suffix>
                    <img
                      :src="iconShows ? eye3 : eye"
                      alt
                      style="width: 20px; height: 20px; position: absolute; right: 2px; top: 8px"
                      @click="showPassword"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <!-- 设置图片存储天数 -->
          <div style="padding: 0 40px" v-if="isPicStorageDays">
            <div class="form-flex" style="margin: 0px 0px 24px 40px; font-weight: bold">
              {{ $t('deviceCamera.settingPicStorageDays') }}
            </div>
            <!-- 大图（天） -->
            <el-form-item :label="$t('deviceCamera.bigPicTTL') + '：'" prop="bigPicTTL">
              <el-input
                v-model="addMainDevPicForm.bigPicTTL"
                :placeholder="$t('deviceCamera.inputBigPicTTL')"
              ></el-input>
            </el-form-item>
            <!-- 小图及元数据存储天数 -->
            <el-form-item :label="$t('deviceCamera.metaDataTTL') + '：'" prop="metaDataTTL">
              <el-input
                v-model="addMainDevPicForm.metaDataTTL"
                :placeholder="$t('deviceCamera.inputMetaDataTTL')"
              ></el-input>
            </el-form-item>
            <!-- 违章图存天数储 -->
            <el-form-item :label="$t('deviceCamera.illegalPicTTL') + '：'" prop="illegalPicTTL">
              <el-input
                v-model="addMainDevPicForm.illegalPicTTL"
                :placeholder="$t('deviceCamera.inputIllegalPicTTL')"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <el-form
        v-if="
          (platType == PLATFORM_TYPE.ADS &&
            isAccessImg &&
            addActive == 2 &&
            platType != TYPE_PLAT_NVR800) ||
          (addActive == 1 && platType != TYPE_PLAT_NVR800)
        "
        ref="addMainDevVideoForm"
        :model="addMainDevVideoForm"
        label-width="135px"
        label-position="left"
        :rules="addMainDevVideoFormRules"
      >
        <div class="form-flex">
          <div class="form-left">
            <!-- 录像策略 -->
            <el-form-item
              :label="$t('public.recordPolicy') + '：'"
              prop="recordPolicyId"
              style="margin-left: 140px"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="addMainDevVideoForm.recordPolicyId"
                :placeholder="$t('public.pleaseInputRecordPolicy')"
                @change="recordPolicyIdChange"
              >
                <el-option
                  v-for="(item, index) in $parent.recordPolicyData"
                  :key="index"
                  :label="item.planName"
                  :value="item.planId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                addMainDevVideoForm.recordPolicyId &&
                ((platType === TYPE_PLAT_VPAAS && isSupported) || platType === PLATFORM_TYPE.ADS)
              "
              :label="$t('mainDevConfiguration.recordStoreDays') + '：'"
              prop="recordStoreDays"
            >
              <el-input
                v-model="addMainDevVideoForm.recordStoreDays"
                :placeholder="$t('public.pleaseInputrecordRemainDays')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item
              v-if="
                addMainDevVideoForm.recordPolicyId && platType === TYPE_PLAT_VPAAS && isSupported
              "
              :label="$t('mainDevConfiguration.storageNodeId') + ':'"
              prop="storageNodeId"
              style="margin-left: 140px"
            >
              <el-cascader
                style="width: 100%"
                v-model="addMainDevVideoForm.storageNodeId"
                :placeholder="$t('mainDevConfiguration.selectStorageNodeId')"
                :options="groupList"
                :props="{
                  children: 'mediaNodeList',
                  expandTrigger: 'hover'
                }"
              />
            </el-form-item>
            <el-form-item
              v-if="
                addMainDevVideoForm.recordPolicyId && platType === TYPE_PLAT_VPAAS && isSupported
              "
              :label="$t('frontParameterConfiguration.streamType') + '：'"
              prop="planStreamType"
            >
              <el-select
                v-model="addMainDevVideoForm.planStreamType"
                :placeholder="$t('frontParameterConfiguration.selectStreamType')"
              >
                <el-option
                  v-for="(item, index) in streamTypeList"
                  :key="index"
                  :label="item.name"
                  :value="parseInt(item.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <el-radio-group v-model="planType" @change="planTypeChange">
            <el-radio :label="0">{{ $t('analysisTask.weekPlan') }}</el-radio>
            <el-radio :label="1">{{ $t('analysisTask.dayPlan') }}</el-radio>
          </el-radio-group>
          <el-link
              :underline="false"
              type="primary"
              class="clear"
              @click="handleFullPlan"
          >
            {{ $t('analysisTask.fullPlan') }}
          </el-link>
          <el-link :underline="false" type="primary" class="clear" :icon="ElIconDelete">
            {{ $t('analysisTask.removeAll') }}
          </el-link>
        </div>
        <div class="form-flex">
          <!-- 网格时间选择控件 -->
          <time-grid-control
              ref="timeGridControl"
              id="time_grid_control"
          ></time-grid-control>
        </div>
        <div class="form-flex">
          <div class="form-left">
            <el-form-item label="计划录像留存期：">
              <el-input />
            </el-form-item>
          </div>
          <div class="form-right">
            <!-- 录像策略 -->
            <el-form-item
                label="计划录像使用码流："
                prop="recordPolicyId"
                style="margin-left: 140px"
            >
              <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="addMainDevVideoForm.recordPolicyId"
                  :placeholder="$t('public.pleaseInputRecordPolicy')"
                  @change="recordPolicyIdChange"
              >
                <el-option
                    v-for="(item, index) in $parent.recordPolicyData"
                    :key="index"
                    :label="item.planName"
                    :value="item.planId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="form-flex">
          <el-form-item label="是否指定存储节点：">
            <el-radio-group v-model="planType" @change="planTypeChange">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="form-flex">
          <el-form-item label="选择存储节点：">
            <div style="width: 100%;" class="flex justify-around">
              <el-form-item label-position="right" :inline="true" label="存储域">
                <el-select placeholder="请选择" size="small">
                  <el-option label="item.label" value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label-position="right" :inline="true" label="分组">
                <el-select placeholder="请选择" size="small">
                  <el-option label="item.label" value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="$parent.maskloading" >
                  搜索
                </el-button>
              </el-form-item>
            </div>
            <div style="width: 100%;">
              <el-table
                  ref="multipleTableRef"
                  :data="[{
                    name: '王小虎',
                    ip: '172.0.0.1',
                    freeSpace: '90%'
                  },{
                    name: '1',
                    ip: '172.0.0.1',
                    freeSpace: '90%'
                  }]"
                  style="width: 100%"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column property="name" label="节点名称" width="120"  show-overflow-tooltip />
                <el-table-column property="ip" label="节点IP" width="120"  show-overflow-tooltip />
                <el-table-column property="freeSpace" label="可用空间" />
                <el-table-column :label="$t('public.operating')" min-width="90">
                  <template #default="scope">
                    <span class="cell-operate" @click="storagePreview(scope.row)">
                      存储空间预览
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>

          <el-button type="primary" @click="previousStep" v-show="addActive == 1 || addActive == 2">
            {{ $t('alarmLinkage.previousStep') }}
          </el-button>
          <el-button
            type="primary"
            @click="nextStep"
            v-show="
              (addActive == 0 && platType != TYPE_PLAT_NVR800) ||
              (addActive == 0 && platType == PLATFORM_TYPE.ADS && !isAccessImg) ||
              (addActive == 1 && platType == PLATFORM_TYPE.ADS && isAccessImg)
            "
          >
            {{ $t('alarmLinkage.nextStep') }}
          </el-button>
          <el-button
            type="primary"
            @click="addMainDevSubmit"
            :loading="$parent.maskloading"
            v-show="
              addActive == 1 ||
              platType == TYPE_PLAT_NVR800 ||
              platType == TYPE_PLAT_NVR800 ||
              (addActive == 2 && platType == PLATFORM_TYPE.ADS && isAccessImg) ||
              (addActive == 1 && platType == PLATFORM_TYPE.ADS && !isAccessImg)
            "
          >
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <long-lat-map />
    <echart-dialog />
  </div>
</template>

<script>
import {
  InfoFilled as ElIconInfo,
  ArrowDown as ElIconArrowDown,
  ArrowUp as ElIconArrowUp,
  Delete as ElIconDelete
} from '@element-plus/icons-vue'
import { mapActions, mapState } from 'vuex'

import longlatmap from '@/components/long-lat-map'
import { validateDeviceName } from '@/utils/common/validator'
import { PLATFORM_TYPE } from '@/enums/platformEnum'
import { DEVICE_TYPE, DRIVE_TYPE } from '@/enums/deviceEnum'
import { getMaxVideoChannels } from '../data'
import TimeGridControl from "@components/time-grid-control.vue"
import echartDialog from "./echart-dialog"

export default {
  components: {TimeGridControl, 'long-lat-map': longlatmap, 'echart-dialog': echartDialog },
  data() {
    let reg = /^(0|[1-9]\d*)$/ //非负整数
    let validatePic = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error(this.$t('deviceCamera.inputInteger')))
      } else if (Number(value) > 365) {
        callback(new Error(this.$t('deviceCamera.input365')))
      } else {
        callback()
      }
    }
    return {
      planType: 0,
      timeOperation: 0,
      timeSpanList: [],
      ElIconDelete,
      echartDialogVisible: false,

      locale: localStorage.getItem('locale'),
      dialogClose: false,

      addActive: 0,
      organizationId: '',

      form: {
        organizationName: '',

        platId: '', //平台名称
        domainCode: '',
        clusterCode: '',
        tasIp: '',
        tasCode: '',

        drive: '', //设备协议类型
        accessInterconnectCode: '', //互联编码
        puAccessPasswd: '', //前端设备注册密码
        registerType: '', //注册方式

        mainDevName: '', //设备名称

        mainDevSn: '', //序列号
        validateCode: '', //设备验证码

        mainDevType: '', //主设备类型
        maxVideoNum: '', //最大视频通道数

        model: '', //设备型号
        imgType: '', //智能属性
        ptzType: '', //摄像机类型
        applicationType: '', //应用类型
        networkType: '', //网络接入类型
        manufacturer: '', //设备提供商类型

        puAccount: '', //设备登录账号
        puPasswd: '', //设备登陆密码
        puPort: '', //前端设备端口
        puIp: '', //前端设置IP

        longitude: '', //设备经度
        latitude: '', //设备纬度
        installLocate: '', //设备具体安装地址
        remark: '' //备注
      },
      addMainDevVideoForm: {
        recordPolicyId: '',
        recordStoreDays: undefined,
        planStreamType: undefined,
        storageNodeId: undefined
      },
      addMainDevPicForm: {
        accessInterconnectCodeImg: '',
        puAccessPasswdImg: '',
        accessUsername: '',
        narrowType: '',
        bigPicTTL: 0,
        metaDataTTL: 0,
        illegalPicTTL: 0
      },
      longlatMapVisible: false,
      driveData: [], // 设备协议类型
      platType: '', //平台类型
      domaincodelist: [], //域编码
      clusterCodelist: [], //集群编码
      tasIplist: [], //网关
      PLATFORM_TYPE: PLATFORM_TYPE,
      TYPE_PLAT_NVR800: PLATFORM_TYPE.NVR800,
      TYPE_DRIVE_HWSDK_ACREG: DRIVE_TYPE.HWSDK_ACREG,
      TYPE_PLAT_VPAAS: PLATFORM_TYPE.VPAAS,
      addMainDevVideoFormRules: {
        recordStoreDays: [
          {
            required: true,
            message: this.$t('deviceCamera.VideoDays'),
            trigger: 'change'
          },
          {
            pattern: /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/,
            message: this.$t('public.recordRemainDaysError'),
            trigger: 'change'
          }
        ],
        planStreamType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectStreamType'),
            trigger: 'change'
          }
        ],
        storageNodeId: [
          {
            required: true,
            message: this.$t('mainDevConfiguration.selectStorageNodeId'),
            trigger: 'change'
          }
        ]
      },
      groupList: [],
      isSupported: false,
      passws: 'password',
      isPicStorageDays: true,
      iconShows: false,
      eye3: require('@/assets/img/common/EYE3.png'),
      eye: require('@/assets/img/common/eye.png'),
      stepList: [
        { name: this.$t('primaryDevice.basicInfo') },
        { name: this.$t('primaryDevice.videoInfo') }
      ],
      //是否接入图片
      isAccessImg: false,
      picRules: {
        accessInterconnectCodeImg: [
          //required: false,唯一性弱
          {
            required: false,
            message: this.$t('public.pleaseInputMainDevType'),
            trigger: 'change'
          },
          {
            pattern: /[0-9]{20}$/,
            message: this.$t('primaryDevice.interconnectCodeError')
          }
        ],
        puAccessPasswdImg: [
          {
            required: true,
            message: this.$t('public.puAccessPasswdPrompt'),
            trigger: 'change'
          },
          {
            pattern: /^[a-zA-z]{1}[\w!@#$%^&*]{5,15}$/,
            message: this.$t('public.puAccessPasswdError'),
            trigger: 'blur'
          }
        ],
        accessUsername: [
          {
            required: true,
            message: this.$t('userManage.namePrompt'),
            trigger: 'change'
          }
        ],
        narrowType: [
          {
            required: true,
            message: this.$t('deviceCamera.chooseNarrowType'),
            trigger: 'change'
          }
        ],
        bigPicTTL: [
          {
            required: false,
            validator: validatePic,
            trigger: 'change'
          }
        ],
        metaDataTTL: [
          {
            required: false,
            validator: validatePic,
            trigger: 'change'
          }
        ],
        illegalPicTTL: [
          {
            required: false,
            validator: validatePic,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      narrowTypeOption: state => state.dict['narrowType_Option']
    }),
    ...mapState({
      streamTypeList: state => state.dict['stream-type']
    }),
    rules() {
      const validatePuAccessPasswd = (rule, value, callback) => {
        let reg1 = /^[a-zA-z](.*)/,
          reg2 = /(.*)[_!@#$%^&*](.*)/,
          reg3 = /(.*)\d+(.*)/
        if (!(reg1.test(value) && reg2.test(value) && reg3.test(value))) {
          callback(new Error(this.$t('public.puAccessPasswdError')))
        } else {
          callback()
        }
      }
      return {
        organizationName: [
          {
            required: true,
            message: this.$t('public.pleaseInputorganizationName'),
            trigger: 'change'
          }
        ],
        domainCode: [
          {
            // IVS和VPAAS平台域编码必填
            required: this.domainCodeShow,
            message: this.$t('public.domainNamePrompts'),
            trigger: 'change'
          }
        ],
        clusterCode: [
          {
            required: this.platType == (PLATFORM_TYPE.IVS || PLATFORM_TYPE.ADS),
            message: this.$t('public.clusterCodePrompt'),
            trigger: 'change'
          }
        ],
        tasIp: [
          {
            required: this.platType == PLATFORM_TYPE.IVS,
            message: this.$t('public.tasIpPrompt'),
            trigger: 'change'
          }
        ],
        tasCode: [
          {
            required: this.platType == PLATFORM_TYPE.IVS,
            message: this.$t('public.chooseTasIpFirst'),
            trigger: 'change'
          }
        ],
        mainDevName: [
          {
            required: true,
            message: this.$t('public.pleaseInputMainDevName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ],
        mainDevSn: [
          {
            // 萤石云平台必填
            required: this.mainDevSnShow,
            message: this.$t('public.pleaseInputmainDevSn'),
            trigger: 'change'
          }
        ],
        drive: [
          {
            required: true,
            message: this.$t('public.drivePrompt'),
            trigger: 'change'
          }
        ],
        accessInterconnectCode: [
          {
            required: false,
            message: this.$t('public.pleaseInputMainDevType'),
            trigger: 'change'
          },
          {
            pattern: /^[0-9]{20}$/,
            message: this.$t('primaryDevice.interconnectCodeError')
          }
        ],
        mainDevType: [
          {
            required: true,
            message: this.$t('public.pleaseInputMainDevType'),
            trigger: 'change'
          }
        ],
        installLocate: [
          {
            max: 512,
            message: this.$t('public.installLocateError'),
            trigger: 'blur'
          }
        ],
        platId: [
          {
            required: true,
            message: this.$t('public.platNamePrompt'),
            trigger: 'change'
          }
        ],
        ptzType: [
          {
            required: true,
            message: this.$t('public.ptzTypePrompt'),
            trigger: 'change'
          }
        ],
        validateCode: [
          {
            required: this.validateCodeShow,
            message: this.$t('public.pleaseInputvalidateCode'),
            trigger: 'change'
          }
        ],
        puAccessPasswd: [
          {
            required: this.puAccessPasswdShow,
            message: this.$t('public.puAccessPasswdPrompt'),
            trigger: 'change'
          },
          {
            validator: validatePuAccessPasswd,
            trigger: 'change'
          },
          {
            min: 6,
            max: 16,
            message: this.$t('public.puAccessPasswdError'),
            trigger: 'change'
          }
        ],
        maxVideoNum: [
          {
            required: this.maxVideoNumShow,
            message: this.$t('public.maxVideoNumPrompt'),
            trigger: 'change'
          }
        ],
        networkType: [
          {
            required: false,
            message: this.$t('public.networkTypePrompt'),
            trigger: 'change'
          }
        ],
        puIp: [
          {
            // 前端IP 非（T28181或设备向平台注册的HWSDK设备）必填
            required: this.puIpPortRequired,
            message: this.$t('public.puIpPrompt'),
            trigger: 'change'
          },
          {
            pattern:
              /^-?((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
            message: this.$t('public.puIpError'),
            trigger: 'blur'
          }
        ],
        puPort: [
          {
            required: this.puIpPortRequired,
            message: this.$t('public.puPortPrompt'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'blur'
          }
        ],
        puAccount: [
          {
            required: this.puAccountRequired,
            message: this.$t('public.puAccountPrompt'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 32,
            message: this.$t('public.puAccountError'),
            trigger: 'blur'
          }
        ],
        puPasswd: [
          {
            required: this.puAccountRequired,
            message: this.$t('public.puPasswdPrompt'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 128,
            message: this.$t('public.puPasswdError'),
            trigger: 'blur'
          }
        ],
        model: [
          {
            required: true,
            message: this.$t('public.modelPrompt'),
            trigger: 'change'
          }
        ],
        longitude: [
          {
            pattern:
              /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.longitudeError1'),
            trigger: 'change'
          }
        ],
        latitude: [
          {
            pattern: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.latitudeError1'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            max: 512,
            message: this.$t('public.installLocateError'),
            trigger: 'blur'
          }
        ],

        manufacturer: [
          {
            required: this.platType == PLATFORM_TYPE.VPAAS || this.platType == PLATFORM_TYPE.ADS,
            message: this.$t('public.manufacturerPrompt'),
            trigger: 'change'
          }
        ]
      }
    },
    maxVideoNumData() {
      if (this.platType == PLATFORM_TYPE.IVS && this.form.drive == DRIVE_TYPE.HIKSDK) {
        // IVS平台下，海康sdk驱动，最大视频通道数为128
        return getMaxVideoChannels(128)
      } else {
        return getMaxVideoChannels()
      }
    },
    maxVideoNumShow() {
      // 主设备类型为NVR时，显示最大视频通道数
      return this.form.mainDevType == DEVICE_TYPE.NVR
    },
    mainDevSnShow() {
      // 萤石云平台，显示设备序列号
      return this.platType == PLATFORM_TYPE.EZVIZ
    },
    validateCodeShow() {
      // 萤石云平台、好望云平台，显示设备验证码
      return this.platType == PLATFORM_TYPE.EZVIZ || this.platType == DRIVE_TYPE.HOLO
    },
    puIpPortShow() {
      // 萤石云平台、T28181协议不显示设备ip和端口
      // 华为主动注册协议不显示设备ip和端口
      return (
        !(this.platType == PLATFORM_TYPE.EZVIZ && this.form.drive == DRIVE_TYPE.T28181) &&
        this.form.drive != DRIVE_TYPE.HWSDK_ACREG
      )
    },
    puIpPortRequired() {
      return this.form.drive != DRIVE_TYPE.T28181 && this.form.drive != DRIVE_TYPE.HWSDK_ACREG
    },
    puAccountPwdShow() {
      return !(this.platType == PLATFORM_TYPE.EZVIZ && this.form.drive == DRIVE_TYPE.T28181)
    },
    puAccountRequired() {
      return this.form.drive != DRIVE_TYPE.T28181
    },
    puAccessPasswdShow() {
      return this.form.drive == DRIVE_TYPE.T28181
    },
    domainCodeShow() {
      // IVS、VPAAS平台，显示域编码
      return (
        this.platType == PLATFORM_TYPE.IVS ||
        this.platType == PLATFORM_TYPE.VPAAS ||
        this.platType == PLATFORM_TYPE.ADS
      )
    },
    clusterTasShow() {
      return this.clusterCodelist.length > 0 && this.platType !== PLATFORM_TYPE.ADS
    },
    clusterCodeShow() {
      return this.clusterCodelist.length > 0
    },
    interconnectCodeShow() {
      // 国标协议非萤石云平台，显示互联编码
      // 华为主动注册协议，显示互联编码
      return (
        (this.form.drive == DRIVE_TYPE.T28181 && this.platType != PLATFORM_TYPE.EZVIZ) ||
        this.form.drive == DRIVE_TYPE.HWSDK_ACREG
      )
    }
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    dialogOpen() {
      this.getSysDictData(['stream-type'])
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        Object.assign(this.form, {
          organizationName: this.$parent.organizationName
        })
        this.organizationId = this.$parent.organizationId
      })
    },
    dialogClosed() {
      this.$parent.addMainDevVisible = false
      this.addActive = 0
      this.organizationId = ''
      this.form = {
        organizationName: '',
        domainCode: '',
        clusterCode: '',
        tasIp: '',
        tasCode: '',
        mainDevName: '', //设备名称
        mainDevType: '', //主设备类型
        applicationType: '', //应用类型
        maxVideoNum: '', //最大视频通道数
        drive: '', //设备协议类型
        model: '', //设备型号
        ptzType: '', //摄像机类型
        accessInterconnectCode: '', //互联编码
        platId: '', //平台名称
        networkType: '', //网络接入类型
        manufacturer: '', //设备提供商类型
        imgType: '', // 智能属性
        puIp: '', //前端设置IP
        puPort: '', //前端设备端口
        puAccount: '', //设备登录账号
        puPasswd: '', //设备登陆密码
        longitude: '', //设备经度
        latitude: '', //设备纬度
        installLocate: '', //设备具体安装地址
        puAccessPasswd: '', //前端设备注册密码
        remark: '', //备注
        registerType: '',
        validateCode: ''
      }
      this.addMainDevVideoForm = {
        recordPolicyId: '',
        recordStoreDays: undefined,
        planStreamType: undefined,
        storageNodeId: undefined
      }
      this.addMainDevPicForm = {
        accessInterconnectCodeImg: '',
        puAccessPasswdImg: '',
        accessUsername: '',
        narrowType: '',
        bigPicTTL: 0,
        metaDataTTL: 0,
        illegalPicTTL: 0
      }
      this.isAccessImg = false

      this.driveData = []

      this.platType = ''
      this.stepList = [
        { name: this.$t('primaryDevice.basicInfo') },
        { name: this.$t('primaryDevice.videoInfo') }
      ]
    },
    async platChange(val) {
      this.form.domainCode = ''
      this.form.clusterCode = ''
      this.form.tasIp = ''
      this.form.tasCode = ''
      this.form.drive = ''
      this.form.mainDevSn = ''
      this.form.validateCode = ''
      this.form.mainDevType = ''
      this.form.maxVideoNum = ''
      this.form.manufacturer = ''
      this.form.imgType = ''
      this.form.puAccessPasswd = ''
      this.domaincodelist = []
      this.clusterCodelist = []
      this.tasIplist = []

      if (val) {
        // 选择平台后，获取平台类型
        const { platType } = this.$parent.platNameList.find(item => item.platId === val) || {}
        this.platType = platType
        if (this.platType == PLATFORM_TYPE.NVR800) {
          this.stepList = [{ name: this.$t('primaryDevice.basicInfo') }]
        } else if (this.platType == PLATFORM_TYPE.ADS) {
          this.rules.manufacturer[0].required = true
          this.stepList = [
            { name: this.$t('primaryDevice.basicInfo') },
            { name: this.$t('primaryDevice.videoInfo') }
          ]
        } else {
          this.stepList = [
            { name: this.$t('primaryDevice.basicInfo') },
            { name: this.$t('primaryDevice.videoInfo') }
          ]
        }
        // 获取平台支持的协议
        await this.$api
          .getDictionary({
            type: 'access-device-protocol-' + this.platType
          })
          .then(res => {
            this.driveData = res.dictionaryList
          })
      } else {
        // 未选择平台，清空协议列表
        this.driveData = []
      }

      if (
        this.platType == PLATFORM_TYPE.IVS ||
        this.platType == PLATFORM_TYPE.VPAAS ||
        this.platType == PLATFORM_TYPE.ADS
      ) {
        //IVS平台、VPAAS平台获取域编码
        this.DomainCode()
      }

      if (this.platType == PLATFORM_TYPE.NVR800) {
        // NVR800平台
        this.form.drive = DRIVE_TYPE.HWSDK
        this.form.mainDevType = DEVICE_TYPE.NVR
        this.form.manufacturer = 'HUAWEI'
      }
    },
    // 获取域编码
    async DomainCode() {
      if (this.platType == PLATFORM_TYPE.ADS) {
        let data = {
          platId: this.form.platId,
          organizationId: this.organizationId
        }

        await this.$api.getPlatRegionList(data).then(res => {
          if (res.resultCode == 0) {
            this.domaincodelist = []
            res.regionInfoList.forEach(element => {
              this.domaincodelist.push({
                domainCode: element.regionCode,
                domainName: element.regionName
              })
            })
          }
        })
      } else {
        let data = {
          platId: this.form.platId,
          organizationId: this.organizationId,
          pageInfo: { pageNum: 1, pageSize: 5000 }
        }
        if (this.platType == PLATFORM_TYPE.IVS) {
          data.isExDomain = 0 //本域或者外域，0：本域；1：外域
        } else if (this.platType == PLATFORM_TYPE.VPAAS) {
          data.vpaasType = 1 // 本域
        }
        await this.$api.getDomainCode(data).then(res => {
          if (res.resultCode == 0) {
            this.domaincodelist = res.domainList
          }
        })
      }
    },

    async domainCodeChange(val) {
      if (this.platType == PLATFORM_TYPE.ADS) {
        let data = {
          regionCode: val,
          organizationId: this.organizationId
        }
        if (val !== '') {
          this.form.clusterCode = ''
          this.$api.getRegionDomainList(data).then(res => {
            if (res.domainBaseInfoList && res.domainBaseInfoList.length) {
              this.clusterCodelist = []
              res.domainBaseInfoList.forEach(element => {
                this.clusterCodelist.push({
                  clusterCode: element.domainCode,
                  clusterName: element.domainName
                })
              })
            } else if (
              res.resultCode === 8 ||
              (res.resultCode == 0 && res.domainBaseInfoList.length == 0)
            ) {
              this.clusterCodelist = []
              this.$alert(this.$t('primaryDevice.clusterGateway'), this.$t('public.prompt'), {
                confirmButtonText: this.$t('public.confirm')
              })
            }
          })
        }
        //清空浮动网关IP和编码
        this.form.tasIp = ''
        this.form.tasCode = ''
      } else {
        if (this.platType === PLATFORM_TYPE.VPAAS) {
          this.groupList = []
          this.$refs.addMainDevVideoForm.resetFields()
        }
        if (this.platType != PLATFORM_TYPE.IVS) {
          return
        }
        if (val !== '') {
          let data = {
            platId: this.form.platId,
            domainCode: val,
            organizationId: this.organizationId
          }

          this.form.clusterCode = ''
          this.form.tasIp = ''
          this.form.tasCode = ''
          this.$api.getClusterCode(data).then(res => {
            if (res.clusterList) {
              this.clusterCodelist = res.clusterList
            }
          })
        }
      }
    },

    // 获取集群编码
    clusterCodeChange() {
      if (this.form.domainCode == '') {
        this.$message({
          type: 'error',
          message: this.$t('public.domainNamePrompt')
        })
      }
      let data = {
        domainCode: this.form.clusterCode,
        regionCode: this.form.domainCode
      }
      if (this.platType == PLATFORM_TYPE.ADS) {
        this.$api.getProtocolListByDomain(data).then(res => {
          if (res.protocolList && res.protocolList.length) {
            let driveData = [
              {
                name: this.$t('public.drive1'),
                value: this.$t('public.drive1')
              },
              {
                name: this.$t('public.drive3'),
                value: 'HIKSDK'
              },
              {
                name: this.$t('public.drive4'),
                value: 'HWSDK'
              },
              {
                name: this.$t('public.drive9'),
                value: 'HWSDK-ACREG'
              },
              {
                name: this.$t('public.drive5'),
                value: 'DHSDK'
              },
              {
                name: this.$t('public.drive6'),
                value: 'ONVIF'
              }
            ]
            this.driveData = driveData.filter(item => res.protocolList.includes(item.value))
          }
        })
        return
      }

      //清空浮动网关IP和编码
      if (this.form.domainCode == '') {
        this.$message({
          type: 'error',
          message: this.$t('public.domainNamePrompt')
        })
      } else if (this.form.clusterCode == '') {
        this.$message({
          type: 'error',
          message: this.$t('public.clusterCodepriority')
        })
      } else {
        let data = {
          platId: this.form.platId,
          domainCode: this.form.domainCode,
          clusterCode: this.form.clusterCode,
          organizationId: this.organizationId
        }

        this.$api.getTasCode(data).then(res => {
          this.tasIplist = res.gatewayList
          this.form.tasIp = res.gatewayList.length ? res.gatewayList[0].gatewayIp : ''

          if (this.form.tasIp) {
            for (let i = 0; i < this.tasIplist.length; i++) {
              if (this.form.tasIp == this.tasIplist[i].gatewayIp) {
                this.form.tasCode = this.tasIplist[i].gatewayId
                break
              }
            }
          }
        })
      }
    },

    //改变浮动网关IP来获取浮动网关编码
    changeTasIp() {
      if (this.form.tasIp) {
        for (let i = 0; i < this.tasIplist.length; i++) {
          if (this.form.tasIp == this.tasIplist[i].gatewayIp) {
            this.form.tasCode = this.tasIplist[i].gatewayId
            break
          }
        }
      }
    },
    //聚焦浮动网关编码
    tasCodeFoucs() {
      if (!this.form.tasCode) {
        this.$message({
          type: 'error',
          message: this.$t('public.chooseTasIpFirst')
        })
      }
    },
    // 设备协议类型选择判断互联编码是否显示
    driveShow() {
      if (this.form.platId == '') {
        this.$message({
          type: 'error',
          message: this.$t('public.platNamePrompt1')
        })
      }
      if (
        this.platType == PLATFORM_TYPE.ADS &&
        (this.form.domainCode == '' || this.form.clusterCode == '')
      ) {
        this.$message({
          type: 'error',
          message: this.$t('public.preferTheDomain')
        })
        this.driveData = []
      }
    },
    driveChange(val) {
      if (this.platType == PLATFORM_TYPE.ADS) {
        let data = {
          domainCode: this.form.clusterCode,
          regionCode: this.form.domainCode,
          protocolCode: val
        }
        this.$api.checkUpperLimit(data).then(res => {
          if (res.resultCode !== 0) {
            this.form.drive = ''
          }
        })
      }
      this.form.registerType = ''
      this.form.puAccount = ''
      this.form.puPasswd = ''
      this.form.puPort = ''
      this.form.puIp = ''
      this.form.validateCode = ''
      this.form.puAccessPasswd = ''
      this.form.accessInterconnectCode = ''

      if (val == DRIVE_TYPE.HWSDK_ACREG) {
        this.form.mainDevType = DEVICE_TYPE.IPC
        this.form.manufacturer = 'HUAWEI'
      }
      switch (val) {
        case DRIVE_TYPE.HWSDK:
          this.form.puPort = 6060
          break
        case DRIVE_TYPE.HIKSDK:
          this.form.puPort = 8000
          break
        case DRIVE_TYPE.DHSDK:
          this.form.puPort = 37777
          break
        case DRIVE_TYPE.ONVIF:
          this.form.puPort = 80
          break
        default:
          this.form.puPort = undefined
          break
      }
    },
    // 设备类型和最大通道联动显示
    mainDevTypeChange(val) {
      this.form.maxVideoNum = ''
    },
    validateCodeInput(val) {
      this.$forceUpdate()
    },
    //前端注册密码的隐藏和显示
    showPassword() {
      this.passws = this.passws == 'password' ? 'text' : 'password'
      this.iconShows = !this.iconShows
    },
    //智能卡口类型
    narrowTypeChange(item) {
      if (item === 0) {
        this.isPicStorageDays = false
      } else {
        this.isPicStorageDays = true
      }
    },
    // 设备向平台注册密码联动图片接入密码
    puAccessPasswdInput(val) {
      this.addMainDevPicForm.puAccessPasswdImg = val
      this.form.puAccessPasswd = val
    },
    puAccessPasswdImgInput(val) {
      this.form.puAccessPasswd = val
      this.addMainDevPicForm.puAccessPasswdImg = val
    },
    accessInterconnectCodeInput(val) {
      this.addMainDevPicForm.accessInterconnectCodeImg = val
      this.form.accessInterconnectCode = val
    },
    accessInterconnectCodeImgInput(val) {
      this.form.accessInterconnectCode = val
      this.addMainDevPicForm.accessInterconnectCodeImg = val
    },
    accessImg(value) {
      if (!value) {
        this.addMainDevPicForm.accessUsername = ''
        this.stepList = [
          { name: this.$t('primaryDevice.basicInfo') },
          { name: this.$t('primaryDevice.videoInfo') }
        ]
      } else {
        this.addMainDevPicForm.puAccessPasswdImg = this.form.puAccessPasswd
        this.addMainDevPicForm.accessInterconnectCodeImg = this.form.accessInterconnectCode
        if (this.platType == 15) {
          this.stepList = [
            { name: this.$t('primaryDevice.basicInfo') },
            { name: this.$t('deviceCamera.picAccessInfo') },
            { name: this.$t('primaryDevice.videoInfo') }
          ]
        }
      }
    },
    // 获取经纬度
    longlatFocus() {
      this.longlatMapVisible = true
      this.$refs.inputBlurLat.blur()
      this.$refs.inputBlurLog.blur()
    },
    async recordPolicyIdChange(val) {
      if (this.platType === PLATFORM_TYPE.VPAAS && val && this.form.domainCode) {
        const params = {
          domainCode: this.form.domainCode,
          nodeAbility: 2
        }
        const res = await this.$api.getMediaNodeList(params)
        if (res.resultCode === 0) {
          if (res.groupList && res.groupList.length && res.groupList[0].mediaNodeList) {
            const groupList = res.groupList
            groupList.forEach(item1 => {
              item1.label = item1.groupId
              item1.value = item1.groupId
              item1.mediaNodeList.forEach(item2 => {
                item2.value = item2.nodeId
                item2.label = `${item2.serverIp}(${item2.taskCount}/${item2.maxTask})`
              })
            })
            this.groupList = groupList
            this.isSupported = true
          } else {
            this.isSupported = false
            this.addMainDevVideoForm.recordPolicyId = undefined
            return this.$message(this.$t('primaryDevice.unsupportedTip'))
          }
        }
      }
    },
    // 上一步
    previousStep() {
      if (this.addActive == 0) return
      this.addActive--
    },
    // 下一步
    nextStep() {
      function validateFun(that, val) {
        return that.$refs[val].validate(valid1 => {
          if (valid1) {
            that.addActive++
          }
        })
      }

      switch (this.addActive) {
        case 0:
          this.$refs['form'].validate(valid => {
            if (valid) {
              if (this.form.longitude && !this.form.latitude) {
                this.$message.warning(this.$t('public.pleaseInputlatitude'))
                return
              } else if (!this.form.longitude && this.form.latitude) {
                this.$message.warning(this.$t('public.pleaseInputlongitude'))
                return
              }
              this.addActive++
            }
          })
          break
        case 1:
          if (this.platType == PLATFORM_TYPE.ADS && this.isAccessImg) {
            validateFun(this, 'addMainDevPicForm')
          } else {
            this.addActive++
          }
          break
      }
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs?.timeGridControl.time_initialize(
              this.planType,
              this.timeOperation,
              this.timeSpanList
          )
        })
      }, 20)
    },
    // 添加确认按钮事件
    addMainDevSubmit() {
      this.$refs['addMainDevVideoForm'].validate(valid => {
        if (valid) {
          this.addSubmit()
        }
      })
    },
    addSubmit() {
      let form = this.form
      let data = {
        organizationId: this.organizationId, //组织Id
        mainDevName: form.mainDevName, //设备名称
        applicationType: form.applicationType, //应用类型
        mainDevType: parseInt(form.mainDevType), //设备类型
        mainDevSn: form.mainDevSn, //设备序列号
        validateCode: form.validateCode, //设备验证码
        simNum: null, //SIM卡号
        longitude: form.longitude, //经度
        latitude: form.latitude, //纬度
        drive: this.form.drive, //设备协议类型
        installLocate: form.installLocate, //设备具体安装地址
        remark: form.remark, //备注
        platId: form.platId, //平台Id
        model: form.model, //设备型号
        manufacturer: form.manufacturer, //设备提供商类型
        imgType: form.imgType, // 智能属性
        //设备网络信息
        mainDevNetworkInfo: {
          networkType: parseInt(form.networkType) //网络接入类型
        },
        mainDevConfigInfo: {
          puAccount: form.puAccount,
          puPasswd: form.puPasswd,
          puIp: form.puIp,
          puPort: form.puPort,
          puAccessPasswd: form.puAccessPasswd,
          maxVideoNum: form.mainDevType == DEVICE_TYPE.IPC ? 1 : form.maxVideoNum, //最大视频通道数
          domainCode:
            this.platType == PLATFORM_TYPE.IVS ||
            this.platType == PLATFORM_TYPE.VPAAS ||
            this.platType == PLATFORM_TYPE.ADS
              ? form.domainCode
              : null,
          clusterCode:
            this.platType == PLATFORM_TYPE.IVS || this.platType == PLATFORM_TYPE.ADS
              ? form.clusterCode
              : null,
          tasIp: this.platType == PLATFORM_TYPE.IVS ? form.tasIp : null,
          tasCode: this.platType == PLATFORM_TYPE.IVS ? form.tasCode : null
        },
        cameraConfigInfo: {
          ptzType: parseInt(form.ptzType) //摄像机类型
        },
        mainDevApeAccessInfo: {
          accessUsername: this.addMainDevPicForm.accessUsername //用户名
        },
        narrowType: this.addMainDevPicForm.narrowType, //智能卡口类型（2022/2/21）
        registerType: this.form.drive == DRIVE_TYPE.T28181 ? 1 : Number(form.registerType)
      }

      if (form.accessInterconnectCode !== '' && form.accessInterconnectCode !== null) {
        data.mainDevAccessInfo = {
          accessInterconnectCode: form.accessInterconnectCode
        }
      }

      if (form.puPasswd !== '' && form.puPasswd !== null) {
        data.mainDevConfigInfo.puPasswd = form.puPasswd
      }
      if (form.validateCode !== '' && form.validateCode !== null) {
        data.validateCode = form.validateCode
      }
      if (form.puAccessPasswd !== '' && form.puAccessPasswd !== null) {
        data.mainDevConfigInfo.puAccessPasswd = form.puAccessPasswd
      }
      let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
      if (timeSpanList.length === 0) {
        this.$message.error(`${this.$t('analysisTask.selectPeriodPrompt')}`)
        return false
      }
      let periodList = []
      if (this.$refs.timeGridControl) {
        for (let i = 0; i < timeSpanList.length; i++) {
          let item = timeSpanList[i]
          periodList.push({
            dayType: item.dayType,
            startTime: item.startTime.substring(0, 5),
            endTime: item.stopTime.substring(0, 5)
          })
        }
      }

      this.$parent.maskloading = true
      this.$api
        .addMainDevInfo(data, 120000)
        .then(async res => {
          // 第一步成功
          if (res.resultCode == 0) {
            let resPic
            //（是否图片接入）
            if (this.platType == PLATFORM_TYPE.ADS && this.isPicStorageDays && this.isAccessImg) {
              let objPic = {
                mainDevId: res.mainDevId,
                bigPicTTL: parseInt(this.addMainDevPicForm.bigPicTTL),
                metaDataTTL: parseInt(this.addMainDevPicForm.metaDataTTL),
                illegalPicTTL: parseInt(this.addMainDevPicForm.illegalPicTTL)
              }
              resPic = await this.$api.modifyCameraImagTTL(objPic)
              if (resPic.failList && resPic.failList.length > 0) {
                resPic.failList.forEach(data => {
                  data.resultCode = resPic.resultCode
                  data.resultDesc = resPic.resultDesc
                })
                this.$parent.imageFailList = resPic.failList
                this.$parent.imageDialogVisible = true
              }
            }
            // 第二步填值
            if (this.addMainDevVideoForm.recordPolicyId) {
              let obj = {
                mainDevId: res.mainDevId,
                recordPolicyId: this.addMainDevVideoForm.recordPolicyId,
                recordStoreDays: this.addMainDevVideoForm.recordStoreDays,
                planStreamType: this.addMainDevVideoForm.planStreamType,
                storageNodeId:
                  this.addMainDevVideoForm.storageNodeId &&
                  this.addMainDevVideoForm.storageNodeId[1]
              }
              let res1 = await this.$api.setRecordPolicyInfoByMainDevId(obj)
              // 第二步成功
              if (res1.resultCode == 0) {
                this.successBack()
              } else {
                this.$parent.addMainDevVisible = false
                this.$parent.maskloading = false
                if (res1.failList) {
                  this.$parent.recordPolicyFailList = res1.failList
                  this.$parent.recordPolicyDialogVisible = true
                }
                this.$parent.search_clear()
                this.$parent.getMainDevList()
                // 展开失败列表
              }
            } else {
              this.successBack()
            }
          } else {
            this.$parent.maskloading = false
            this.$alert(res.resultDesc, this.$t('public.prompt'), {
              confirmButtonText: this.$t('public.confirm'),
              type: 'warning'
            })
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: this.$t('batchOperator.requestTimeOut')
          })
          this.$parent.maskloading = false
        })
    },
    successBack() {
      this.$message({
        type: 'success',
        message: this.$t('public.addSuccess')
      })
      this.$parent.addMainDevVisible = false
      this.$parent.search_clear()
      this.$parent.getMainDevList()
      this.$parent.maskloading = false
    },

    //选择周计划或日计划
    planTypeChange(val) {
      this.$refs.timeGridControl.planTypeChange(val)
    },
    handleFullPlan() {
      Array.from(document.querySelectorAll('.plug-timer-grid tbody tr th')).forEach(th => {
        let timer = setTimeout(() => {
          th.click()
          clearTimeout(timer)
        }, 200)
      })
    },
    storagePreview (row) {
      this.echartDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
.addDeviceDialog {
  .el-step.is-center .el-step__line {
    top: 33px;
  }
  .clear {
    margin-left: 20px;
  }
}
#main-dev .el-step__icon.is-text {
  background: #fff !important;
}
</style>
