<template>
  <div>
    <el-dialog
      :title="$t('primaryDevice.addDevice')"
      v-model="$parent.addMainDevVisible"
      top="10vh"
      width="1350px"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="addDeviceDialogViewClass"
    >
      <el-steps :active="addActive" align-center finish-status="success" style="marginbottom: 15px">
        <el-step :title="$t('primaryDevice.basicInfo')"></el-step>
        <el-step :title="$t('primaryDevice.videoAcess')"></el-step>
        <el-step :title="$t('primaryDevice.imageAcess')"></el-step>
      </el-steps>

      <el-form
        v-show="addActive == 0"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="156px"
        label-position="left"
      >
        <div class="over">
          <div class="form-flex">
            <div class="form-left">
              <!-- 组织 -->
              <el-form-item :label="$t('public.organizationName') + '：'" prop="organizationName">
                <el-cascader
                  :key="areaCascaderKey"
                  v-model="form.organizationName"
                  :props="propsCasOrg"
                  clearable
                  @change="changeOrg"
                  ref="orgCascader"
                ></el-cascader>
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
                  <el-option
                    v-for="(item, index) in $parent.AddplatNameLists"
                    :key="index"
                    :label="item.platName"
                    :value="item.platId"
                  ></el-option>
                </el-select>
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
            </div>
          </div>

          <div class="form-flex">
            <div class="form-left"></div>
            <div class="form-right"></div>
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
                >
                  <el-option
                    v-for="(item, index) in $parent.manufacturerData"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-right">
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
          </div>

          <div class="form-flex">
            <div class="form-left">
              <el-form-item :label="$t('public.longitude') + '：'" prop="longitude">
                <el-input
                  ref="inputBlurLog"
                  @focus="longlatFocus"
                  v-model="form.longitude"
                  :placeholder="$t('public.pleaseInputlongitude')"
                  clearable
                ></el-input>
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

            <div class="form-right">
              <!--纬度  -->
              <el-form-item :label="$t('public.latitude') + '：'" prop="latitude">
                <el-input
                  ref="inputBlurLat"
                  @focus="longlatFocus"
                  v-model="form.latitude"
                  :placeholder="$t('public.pleaseInputlatitude')"
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
          </div>

          <el-form-item :label="$t('public.remark') + '：'" prop="remark" class="padding40">
            <el-input
              v-model="form.remark"
              :placeholder="$t('public.pleaseInputremark')"
              type="textarea"
              maxlength="256"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </el-form>

      <el-form
        v-show="addActive == 1"
        ref="addMainDevVideoForm"
        :model="form"
        :rules="rules"
        label-width="161px"
        label-position="left"
      >
        <div class="form-flex over">
          <div class="form-left">
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
            <el-form-item :label="$t('primaryDevice.tasIp') + '：'" prop="tasIp" v-show="tasIpShow">
              <el-select
                :popper-append-to-body="false"
                v-model="form.tasIp"
                :placeholder="$t('public.tasIpPrompt')"
                @focus="getTasIp()"
              >
                <el-option
                  v-for="(item, index) in tasIplist"
                  :key="index"
                  :label="item.gatewayIp"
                  :value="item.gatewayIp"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 设备类型 -->
            <el-form-item :label="$t('public.mainDevType') + '：'" prop="mainDevType">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.mainDevType"
                :placeholder="$t('public.pleaseInputMainDevType')"
                @change="mainDevChange"
              >
                <el-option
                  v-for="(item, index) in $parent.mainDevTypeData"
                  :key="index"
                  :label="item.mainDevName"
                  :value="item.AmainDev"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 前端注册密码 -->
            <el-form-item
              :label="$t('primaryDevice.puAccessPasswd') + '：'"
              prop="puAccessPasswd"
              v-show="puAccessPasswdShow"
            >
              <el-input
                v-model="form.puAccessPasswd"
                :type="passws"
                :placeholder="$t('public.puAccessPasswdPrompt')"
              >
                <template #suffix>
                  <i @click="showPassword">
                    <img
                      src="@/assets/img/common/EYE3.png"
                      alt
                      style="width: 20px; height: 20px; position: absolute; right: 2px; top: 8px"
                      v-if="iconShows"
                    />
                    <img
                      src="@/assets/img/common/eye.png"
                      alt
                      style="width: 20px; height: 20px; position: absolute; right: 2px; top: 8px"
                      v-if="!iconShows"
                    />
                  </i>
                </template>
              </el-input>
            </el-form-item>

            <!-- 账号-->
            <el-form-item
              :label="$t('primaryDevice.puAccount') + '：'"
              prop="puAccount"
              v-show="puAccountShow"
            >
              <el-input
                v-model="form.puAccount"
                :placeholder="$t('primaryDevice.pleaseInputpuAccount')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('primaryDevice.puIp') + '：'" prop="puIp">
              <el-input
                v-model="form.puIp"
                :placeholder="$t('primaryDevice.pleaseInputpuIp')"
                clearable
              ></el-input>
            </el-form-item>

            <!-- 录像策略 -->
            <el-form-item :label="$t('public.recordPolicy') + '：'" prop="recordPolicy">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="addMainDevVideoForm.recordPolicyId"
                :placeholder="$t('public.pleaseInputRecordPolicy')"
                @change="recordPolicyChange"
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

          <div class="form-right">
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
              v-show="tasCodeShow"
            >
              <el-select
                :popper-append-to-body="false"
                v-model="form.tasCode"
                :placeholder="$t('public.tasCodePrompt')"
                @focus="getTasIp()"
              >
                <el-option
                  v-for="(item, index) in tasIplist"
                  :key="index"
                  :label="item.gatewayId ? item.gatewayId : item.gatewayCode"
                  :value="item.gatewayId ? item.gatewayId : item.gatewayCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- NVR编码 -->
            <el-form-item
              :label="$t('primaryDevice.nvrCode') + '：'"
              prop="nvrCode"
              v-show="nvrCodeShow"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.nvrCode"
                :placeholder="$t('public.nvrCodePrompt')"
                @focus="getNvrCode()"
              >
                <el-option
                  v-for="(item, index) in getNvrCodelist"
                  :key="index"
                  :label="item.deviceCode"
                  :value="item.deviceCode"
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
                  v-for="(item, index) in $parent.maxVideoNumData"
                  :key="index"
                  :label="item.maxVideoName"
                  :value="item.maxVideoNum"
                ></el-option>
                <el-option
                  :label="$t('public.maxVideoName128')"
                  :value="128"
                  v-if="(form.drive == 'HIKSDK' && platType == 5) || form.drive == 'T28181'"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 设备协议类型 -->
            <el-form-item :label="$t('primaryDevice.drive') + '：'" prop="drive">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.drive"
                :placeholder="$t('primaryDevice.pleaseInputDrive')"
                @change="driveChange"
                @focus="driveShow"
              >
                <el-option
                  v-for="(item, index) in driveData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 互联编码 -->
            <el-form-item
              :label="$t('primaryDevice.interconnectCode') + '：'"
              prop="interconnectCode"
              v-show="interconnectCodeShow"
            >
              <el-input
                v-model="form.interconnectCode"
                :placeholder="$t('primaryDevice.pleaseInputinterconnectCode')"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('primaryDevice.puPasswd') + '：'"
              prop="puPasswd"
              v-show="puPasswdShow"
            >
              <el-input
                :type="passw"
                v-model="form.puPasswd"
                :placeholder="$t('public.puPasswdPrompt')"
              >
                <template #suffix>
                  <i @click="showPass">
                    <img
                      src="@/assets/img/common/EYE3.png"
                      alt
                      style="width: 20px; height: 20px; position: absolute; right: 2px; top: 8px"
                      v-if="iconShow"
                    />
                    <img
                      src="@/assets/img/common/eye.png"
                      alt
                      style="width: 20px; height: 20px; position: absolute; right: 2px; top: 8px"
                      v-if="!iconShow"
                    />
                  </i>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item
              :label="$t('primaryDevice.puPort') + '：'"
              prop="puPort"
              v-show="puPortShow"
            >
              <el-input
                v-model="form.puPort"
                :placeholder="$t('primaryDevice.pleaseInputpuPort')"
                clearable
              ></el-input>
            </el-form-item>

            <!-- 录像天数 -->
            <el-form-item
              :label="$t('public.recordRemainDays') + '：'"
              prop="recordRemainDays"
              v-show="recordRemainDaysShow"
            >
              <el-input
                v-model="addMainDevVideoForm.recordRemainDays"
                :placeholder="$t('public.pleaseInputrecordRemainDays')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <el-form
        v-show="addActive == 2"
        ref="addMainDevVideoForm"
        :model="form"
        :rules="rules"
        label-width="172px"
        label-position="left"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('primaryDevice.accessWay') + ':'"
              prop="accessWay"
              style="padding: 15px 0px 0px 20px"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.accessWay"
                :placeholder="$t('primaryDevice.selectAccessWay')"
              >
                <el-option
                  v-for="(item, index) in $parent.accessWayList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>

        <!-- //监控平台接入 -->
        <collapse-card
          :title="$t('primaryDevice.baseInfo')"
          v-model:collapse="show1"
          v-if="form.accessWay == 1"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.interconnectCode') + ':'" prop="apeID">
                <el-input
                  v-model="form.apeID"
                  :placeholder="$t('primaryDevice.pleaseInputinterconnectCode')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.devType') + ':'" prop="type">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.type"
                  :placeholder="$t('primaryDevice.selectDevType')"
                >
                  <el-option
                    v-for="(item, index) in $parent.typeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('deviceManagement.deviceModel') + ':'" prop="model">
                <el-input
                  v-model="form.model"
                  :placeholder="$t('deviceManagement.inputDeviceModel')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.acquisitionType') + ':'" prop="functionType">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.functionType"
                  :placeholder="$t('primaryDevice.selectAcquisitionType')"
                >
                  <el-option
                    v-for="(item, index) in $parent.functionTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.locationType') + ':'" prop="placeType">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.placeType"
                  :placeholder="$t('primaryDevice.selectLocationType')"
                >
                  <el-option
                    v-for="(item, index) in $parent.placeTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.administrativeArea') + ':'" prop="placeCode">
                <el-cascader
                  v-model="form.placeCode"
                  :props="propsCas"
                  clearable
                  :placeholder="$t('primaryDevice.selectAdministrativeArea')"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.installation') + ':'" prop="place">
                <el-input
                  v-model="form.place"
                  :placeholder="$t('primaryDevice.inputInstallation')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.captureDirection') + ':'" prop="capDirection">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.capDirection"
                  :placeholder="$t('primaryDevice.selectVaptureDirection')"
                >
                  <el-option
                    v-for="(item, index) in $parent.capDirectionList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('primaryDevice.areaDescription') + ':'"
                prop="monitorAreaDesc"
              >
                <el-input
                  v-model="form.monitorAreaDesc"
                  :placeholder="$t('primaryDevice.inputAreaDescription')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.publicSecurity') + ':'" prop="police">
                <el-input
                  v-model="form.police"
                  :placeholder="$t('primaryDevice.selectPublicSecurity')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('primaryDevice.organizationName') + ':'"
                prop="managementName"
              >
                <el-input
                  v-model="form.managementName"
                  :placeholder="$t('primaryDevice.inputOrganizationName')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.informationUnit') + ':'" prop="contact">
                <el-input
                  v-model="form.contact"
                  :placeholder="$t('primaryDevice.inputInformationUnit')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.installationTime') + ':'" prop="installTime">
                <el-date-picker
                  v-model="form.installTime"
                  type="datetime"
                  :placeholder="$t('primaryDevice.selectInstallationTime')"
                  size="medium"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>
        <collapse-card
          :title="$t('primaryDevice.networkingInformation')"
          v-model:collapse="show2"
          v-if="form.accessWay == 1"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.uploadMethod') + ':'" prop="uploadWay">
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.uploadWay"
                  :placeholder="$t('primaryDevice.selectUploadMethod')"
                >
                  <el-option
                    v-for="(item, index) in $parent.uploadWayList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.v4Address') + ':'" prop="ipAddr">
                <el-input
                  v-model="form.ipAddr"
                  :placeholder="$t('primaryDevice.inputV4Address')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.v6Address') + ':'" prop="ipv6Addr">
                <el-input
                  v-model="form.ipv6Addr"
                  :placeholder="$t('primaryDevice.inputV6Address')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.portNumber') + ':'" prop="port">
                <el-input
                  v-model="form.port"
                  :placeholder="$t('primaryDevice.inputPortNumber')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('primaryDevice.MACAddress') + ':'" prop="mac">
                <el-input
                  v-model="form.mac"
                  :placeholder="$t('primaryDevice.inputMACAddress')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('primaryDevice.authenticationMethod') + ':'"
                prop="authority"
              >
                <el-select
                  clearable
                  :popper-append-to-body="false"
                  v-model="form.authority"
                  :placeholder="$t('primaryDevice.selectAuthenticationMethod')"
                >
                  <el-option
                    v-for="(item, index) in $parent.authorityList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('primaryDevice.authenticateAccount') + ':'"
                prop="userId"
                v-if="form.authority && form.authority != '1'"
              >
                <el-input
                  v-model="form.userId"
                  :placeholder="$t('primaryDevice.inputAuthenticateAccount')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('primaryDevice.authenticationPassword') + ':'"
                prop="password"
                v-if="form.authority && form.authority != '1'"
              >
                <el-input
                  :type="passw"
                  v-model="form.password"
                  :placeholder="$t('primaryDevice.inputAuthenticationPassword')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>

        <!-- //视图库接入 -->
        <div style="padding-left: 20px" v-if="form.accessWay == 2">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备ID：" prop="accessWay">
                <el-input
                  v-model="form.recordRemainDays"
                  placeholder="请输入设备ID"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="视图库用户名：" prop="accessWay">
                <el-input
                  v-model="form.recordRemainDays"
                  placeholder="请输入视图库用户名"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="视图库密码：" prop="accessWay">
                <el-input
                  v-model="form.recordRemainDays"
                  placeholder="请输入视图库密码"
                  :type="passw"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="服务器地址：" prop="accessWay">
                <el-input
                  v-model="form.recordRemainDays"
                  placeholder="请输入服务器地址"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接入服务器Port：" prop="accessWay">
                <el-input
                  v-model="form.recordRemainDays"
                  placeholder="请输入接入服务器Port"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>

          <el-button type="primary" @click="previousStep" v-show="addActive == 1 || addActive == 2">
            {{ $t('alarmLinkage.previousStep') }}
          </el-button>
          <el-button type="primary" @click="nextStep" v-show="addActive == 0 || addActive == 1">
            {{ $t('alarmLinkage.nextStep') }}
          </el-button>
          <el-button
            type="primary"
            @click="addMainDevSubmit"
            :loading="$parent.maskloading"
            v-show="addActive == 2"
          >
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <long-lat-map />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import longlatmap from '@/components/long-lat-map'
import CollapseCard from '@/components/collapse-card.vue'
import { validateDeviceName } from '@/utils/common/validator'
export default {
  components: { 'long-lat-map': longlatmap, 'collapse-card': CollapseCard },
  data() {
    let _this = this
    return {
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
        nvrCode: '',

        drive: '', //设备协议类型
        interconnectCode: '', //互联编码
        puAccessPasswd: '', //前端设备注册密码
        registerType: '', //注册方式

        mainDevName: '', //设备名称

        mainDevSn: '', //序列号
        validateCode: '', //设备验证码

        mainDevType: '', //主设备类型
        maxVideoNum: '', //最大视频通道数

        model: '', //设备型号

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
        remark: '', //备注

        //新增 (视图库)
        accessWay: 1, //视图接入方式
        apeID: '',
        type: '',
        authority: '',
        userId: '',
        ipAddr: '',
        ipv6Addr: '',
        mac: '',
        port: '',
        place: '',
        placeCode: '',
        placeType: '',
        capDirection: '',
        monitorAreaDesc: '',
        police: '',
        managementName: '',
        contact: '',
        installTime: '',
        functionType: '',
        uploadWay: 1
      },
      addMainDevVideoForm: {
        recordPolicyId: '',
        recordRemainDays: ''
      },

      rules: {},
      videoRules: {},
      operatorRules: {},

      longlatMapVisible: false,

      domainCodeShow: false, //svn必选显影
      nvrCodeShow: false, //NVR显影
      tasIpShow: false, //网关Ip
      tasCodeShow: false, //网关编码
      clusterCodeShow: false, //集群编码
      driveData: [], // 设备协议类型
      platType: '', //平台类型
      domaincodelist: [], //域编码
      clusterCodelist: [], //集群编码
      tasIplist: [], //网关
      getNvrCodelist: [], //nvr编码
      maxVideoNumShow: false, //最大通道显示
      puAccessPasswdShow: false, //设备向平台注册密码
      interconnectCodeShow: false, //互联编码显示
      validateCodeShow: false, //设备验证码
      puPortShow: true, //端口显示
      puAccountShow: true, //前端账户显示
      puPasswdShow: true, //前端密码显示
      puIpShow: true, //前端ip显示
      mainDevSnShow: false, //设备序列号
      wayToRegister_show: false, //注册方式

      passw: 'password', //用于改变Input类型
      passws: 'password',
      iconShow: true,
      iconShows: true,

      recordRemainDaysShow: false, //录像天数显示

      //视图库主设备
      show1: true,
      show2: true,
      propsCas: {
        checkStrictly: true,
        lazy: true,
        value: 'areaCode',
        label: 'areaName',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level == 0) {
            setTimeout(function () {
              resolve([
                {
                  areaCode: '000000000000',
                  areaLevel: 0,
                  areaName: this.$t('primaryDevice.entireCountry'),
                  leaf: false
                }
              ])
            })
          } else {
            _this.$api.getAreaList({ areaCode: node.value }).then(res => {
              if (res.resultCode == 0) {
                const nodes = res.subAreaList.map(item => ({
                  ...item,
                  leaf: node.level >= 3
                }))
                resolve(nodes)
              }
            })
          }
        }
      },

      areaCascaderKey: 0,
      propsCasOrg: {
        checkStrictly: true,
        lazy: true,
        value: 'id',
        label: 'label',
        lazyLoad(node, resolve) {
          _this.$api
            .getOrganizationTree({
              withTenant: 2,
              type: 1,
              parentId: node.level == 0 ? null : node.data.id
            })
            .then(res => {
              if (res.resultCode == 0) {
                const nodes = res.nodeList.map(item => ({
                  ...item
                }))
                resolve(nodes)
              }
            })
        }
      }
    }
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
        nvrCode: '',
        mainDevName: '', //设备名称
        mainDevType: '', //主设备类型
        applicationType: '', //应用类型
        maxVideoNum: '', //最大视频通道数
        drive: '', //设备协议类型
        model: '', //设备型号
        ptzType: '', //摄像机类型
        interconnectCode: '', //互联编码
        platId: '', //平台名称
        networkType: '', //网络接入类型
        manufacturer: '', //设备提供商类型
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
        validateCode: '',

        //新增 (视图库)
        accessWay: 1, //视图接入方式
        type: '',
        authority: '',
        userId: '',
        ipAddr: '',
        ipv6Addr: '',
        mac: '',
        port: '',
        place: '',
        placeCode: '',
        placeType: '',
        capDirection: '',
        monitorAreaDesc: '',
        police: '',
        managementName: '',
        contact: '',
        installTime: '',
        functionType: ''
      }
      this.addMainDevVideoForm = {
        recordPolicyId: '',
        recordRemainDays: ''
      }
      this.videoRules.recordRemainDays[0].required = false
      this.recordRemainDaysShow = false

      this.driveData = []
      this.domainCodeShow = false
      this.nvrCodeShow = false //NVR显影
      this.tasIpShow = false //网关Ip
      this.tasCodeShow = false //网关编码
      this.clusterCodeShow = false //集群编码
      this.validateCodeShow = false
      this.interconnectCodeShow = false
      this.puAccessPasswdShow = false
      this.maxVideoNumShow = false
      this.wayToRegister_show = false
    },

    setFormRules() {
      var regApeID = /^[0-9]{20}$/
      var validateApeID = (rule, value, callback) => {
        if (value == '') {
          callback()
        } else if (!regApeID.test(value)) {
          callback(this.$t('primaryDevice.interconnectCodeError'))
        } else {
          callback(new Error())
        }
      }
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
      this.rules = {
        placeCode: [
          {
            required: true,
            message: this.$t('primaryDevice.selectAdministrativeArea'),
            trigger: 'change'
          }
        ],
        organizationName: [
          {
            required: true,
            message: this.$t('public.pleaseInputorganizationName'),
            trigger: 'change'
          }
        ],
        domainCode: [
          {
            required: false,
            message: this.$t('public.domainNamePrompts'),
            trigger: 'change'
          }
        ],
        tasIp: [
          {
            required: false,
            message: this.$t('public.tasIpPrompt'),
            trigger: 'change'
          }
        ],
        nvrCode: [
          {
            required: false,
            message: this.$t('public.nvrCodePrompt'),
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
            required: true,
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
        interconnectCode: [
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

        puAccount: [
          {
            required: true,
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
        puPort: [
          {
            required: false,
            message: this.$t('public.puPortPrompt'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
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
        clusterCode: [
          {
            required: false,
            message: this.$t('public.clusterCodePrompt'),
            trigger: 'change'
          }
        ],
        tasCode: [
          {
            required: false,
            message: this.$t('public.tasCodePrompt'),
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
            required: true,
            message: this.$t('public.pleaseInputvalidateCode'),
            trigger: 'change'
          }
        ],
        puAccessPasswd: [
          {
            required: true,
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
        manufacturer: [
          {
            required: true,
            message: this.$t('public.manufacturerPrompt'),
            trigger: 'change'
          }
        ],
        maxVideoNum: [
          {
            required: false,
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
        puPasswd: [
          {
            required: true,
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
        puIp: [
          {
            required: false,
            message: this.$t('public.puIpPrompt'),
            trigger: 'change'
          },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t("public.puIpError"),
            trigger: "blur",
          },
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

        //视图库接入
        place: [
          {
            required: false,
            message: this.$t('primaryDevice.inputInstallation'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('primaryDevice.length256'),
            trigger: 'change'
          }
        ],
        monitorAreaDesc: [
          {
            required: false,
            message: this.$t('primaryDevice.inputAreaDescription'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('primaryDevice.length256'),
            trigger: 'change'
          }
        ],
        police: [
          {
            required: false,
            message: this.$t('primaryDevice.selectPublicSecurity'),
            trigger: 'change'
          }
        ],
        contact: [
          {
            required: false,
            message: this.$t('primaryDevice.inputInformationUnit'),
            trigger: 'change'
          }
        ],
        managementName: [
          {
            required: false,
            message: this.$t('primaryDevice.inputOrganizationName'),
            trigger: 'change'
          }
        ],
        installTime: [
          {
            required: false,
            message: this.$t('primaryDevice.selectInstallationTime'),
            trigger: 'change'
          }
        ],
        ipAddr: [
          {
            required: true,
            message: this.$t('primaryDevice.inputV4Address'),
            trigger: 'change'
          },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t("primaryDevice.inputTurev4Address"),
            trigger: "change",
          },
        ],
        ipv6Addr: [
          {
            required: false,
            message: this.$t('primaryDevice.inputV6Address'),
            trigger: 'change'
          },
          {
            pattern:
              /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: this.$t('primaryDevice.inputTurev6Address'),
            trigger: 'change'
          }
        ],
        port: [
          {
            required: true,
            message: this.$t('primaryDevice.inputPortNumber'),
            trigger: 'change'
          },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('primaryDevice.portNumberFormat'),
            trigger: 'change'
          }
        ],
        mac: [
          {
            required: false,
            message: this.$t('primaryDevice.inputMACAddress'),
            trigger: 'change'
          },
          {
            pattern:
              /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/,
            message: this.$t('primaryDevice.inputTurevMACddress'),
            trigger: 'change'
          }
        ],
        userId: [
          {
            required: true,
            message: this.$t('primaryDevice.inputAuthenticateAccount'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('primaryDevice.inputAuthenticationPassword'),
            trigger: 'change'
          }
        ],
        apeID: [
          {
            required: false,
            validator: validateApeID,
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('primaryDevice.selectDeviceType'),
            trigger: 'change'
          }
        ],
        functionType: [
          {
            required: true,
            message: this.$t('primaryDevice.selectAcquisitionType'),
            trigger: 'change'
          }
        ]
      }
      this.videoRules = {
        recordRemainDays: [
          {
            required: false,
            trigger: 'change',
            message: this.$t('public.pleaseInputrecordRemainDays')
          },
          {
            pattern: /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/,
            message: this.$t('public.recordRemainDaysError'),
            trigger: 'change'
          }
        ]
      }

      this.rules.longitude = [
        {
          required: false,
          trigger: 'change',
          message: this.$t('primaryDevice.selectLongitude')
        },
        {
          pattern:
            /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
          message: this.$t('public.longitudeError1'),
          trigger: 'change'
        }
      ]
      this.rules.latitude = [
        {
          required: false,
          trigger: 'change',
          message: this.$t('primaryDevice.selectLatitude')
        },
        {
          pattern: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
          message: this.$t('public.latitudeError1'),
          trigger: 'change'
        }
      ]
      this.rules.applicationType = [
        {
          required: false,
          message: this.$t('public.pleaseInputApplicationType'),
          trigger: 'change'
        }
      ]
    },

    changeOrg(val) {},

    platChange(val) {
      this.form.domainCode = ''
      this.form.clusterCode = ''
      this.form.tasIp = ''
      this.form.tasCode = ''

      this.domaincodelist = []
      this.clusterCodelist = []
      this.tasIplist = []

      this.form.drive = ''

      this.form.mainDevSn = ''
      this.form.validateCode = ''
      this.mainDevSnShow = false
      this.validateCodeShow = false

      this.rules.mainDevSn[0].required = false
      this.rules.validateCode[0].required = false

      if (val) {
        this.$parent.platNameList.forEach(item => {
          if (item.platId == val) {
            this.platType = item.platType
          }
        })
        if (this.platType == 1) {
          this.driveData = [
            {
              name: this.$t('public.drive1'),
              value: this.$t('public.drive1')
            },
            {
              name: this.$t('public.drive2'),
              value: 'EHOME'
            }
          ]
        } else if (this.platType == 5) {
          this.driveData = [
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
        } else if (this.platType == 9) {
          this.driveData = [
            {
              name: this.$t('public.drive1'),
              value: this.$t('public.drive1')
            },
            {
              name: this.$t('public.drive3'),
              value: 'HIKSDK'
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
        } else if (this.platType == 10) {
          this.driveData = [
            {
              name: this.$t('public.drive3'),
              value: 'HIKSDK'
            },

            {
              name: this.$t('public.drive7'),
              value: '萤石云'
            }
          ]
        } else if (this.platType == 12) {
          this.driveData = [
            {
              name: this.$t('public.drive1'),
              value: this.$t('public.drive1')
            },
            {
              name: this.$t('public.drive8'),
              value: 'HOLO'
            },
            {
              name: this.$t('public.drive99'),
              value: 'OTHER'
            }
          ]
        } else {
          this.driveData = [
            {
              name: this.$t('public.drive1'),
              value: this.$t('public.drive1')
            },
            {
              name: this.$t('public.drive2'),
              value: 'EHOME'
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
              name: this.$t('public.drive5'),
              value: 'DHSDK'
            },
            {
              name: this.$t('public.drive6'),
              value: 'ONVIF'
            },
            {
              name: this.$t('public.drive7'),
              value: '萤石云'
            },
            {
              name: this.$t('public.drive8'),
              value: 'HOLO'
            },
            {
              name: this.$t('public.drive99'),
              value: 'OTHER'
            }
          ]
        }
      } else {
        this.driveData = []
      }

      this.puAccessPasswdShow = false
      this.form.puAccessPasswd = ''
      if (this.platType == 1) {
      } else if (this.platType == 2) {
        //nvs平台
        this.domainCodeShow = false
        this.rules.domainCode[0].required = false
      } else if (this.platType == 5) {
        //IVS平台
        this.puPortShow = true
        this.puAccountShow = true
        this.puPasswdShow = true
        this.puIpShow = true

        this.DomainCode()

        this.domainCodeShow = true
        this.rules.domainCode[0].required = true
      } else {
        if (this.platType == 10) {
          //萤石云平台
          this.mainDevSnShow = true
          this.validateCodeShow = true

          this.rules.mainDevSn[0].required = true
          this.rules.validateCode[0].required = true
        }
        //svs平台
        this.puPortShow = true
        this.puAccountShow = true
        this.puPasswdShow = true
        this.puIpShow = true

        this.nvrCodeShow = false
        this.rules.nvrCode[0].required = false

        this.domainCodeShow = false
        this.clusterCodeShow = false
        this.tasCodeShow = false
        this.tasIpShow = false

        this.rules.domainCode[0].required = false
        this.rules.clusterCode[0].required = false
        this.rules.tasIp[0].required = false
        this.rules.tasCode[0].required = false
      }
    },
    // 获取域编码
    async DomainCode() {
      let data = {
        platId: this.form.platId,
        isExDomain: 0, //本域或者外域，0：本域；1：外域
        pageInfo: { pageNum: 1, pageSize: 5000 }
      }

      await this.$api.getDomainCode(data).then(res => {
        if (res.resultCode == 0) {
          this.domaincodelist = res.domainList
        }
      })
    },

    domainCodeChange(val) {
      if (val !== '') {
        let data = {
          platId: this.form.platId,
          domainCode: val
        }

        this.form.clusterCode = ''
        this.$api.getClusterCode(data).then(res => {
          if (res.clusterList && res.clusterList.length) {
            this.clusterCodelist = res.clusterList

            this.clusterCodeShow = true
            this.tasIpShow = true
            this.tasCodeShow = true

            this.rules.clusterCode[0].required = true
            this.rules.tasIp[0].required = true
            this.rules.tasCode[0].required = true
          } else if (res.resultCode === 8 || (res.resultCode == 0 && res.clusterList.length == 0)) {
            this.nvrCodeShow = true
            this.rules.nvrCode[0].required = true
          }
        })
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
    },

    // 获取浮动网关IP
    getTasIp() {
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
          clusterCode: this.form.clusterCode
        }

        this.$api.getTasCode(data).then(res => {
          this.tasIplist = res.gatewayList
        })
      }
    },

    // 获取设备所属NVR编码
    getNvrCode() {
      if (this.form.domainCode == '') {
        this.$message({
          type: 'error',
          message: this.$t('public.domainNamePrompt')
        })
      } else {
        let data = {
          platId: this.form.platId,
          domainCode: this.form.domainCode
        }
        this.$api.getnvrCode(data).then(res => {
          this.getNvrCodelist = res.nvrList
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
    },
    driveChange(val) {
      this.wayToRegister_show = false
      this.form.registerType = ''

      this.rules.puPort[0].required = false
      this.rules.puAccount[0].required = false
      this.rules.puPasswd[0].required = false
      this.rules.puIp[0].required = false

      this.form.puAccount = ''
      this.form.puPasswd = ''
      this.form.puPort = ''
      this.form.puIp = ''

      this.validateCodeShow = false
      this.rules.validateCode[0].required = false
      this.form.validateCode = ''

      this.puAccessPasswdShow = false
      this.form.puAccessPasswd = ''
      this.rules.puAccessPasswd[0].required = false

      this.interconnectCodeShow = false
      this.form.interconnectCode = ''

      if (val == 'T28181') {
        // 账号密码端口IP非必填
        this.puAccessPasswdShow = true
        this.rules.puAccessPasswd[0].required = true

        if (this.platType == 5 || this.platType == 9) {
          this.interconnectCodeShow = true
        } else if (this.platType == 10) {
          this.puPortShow = false
          this.puAccountShow = false
          this.puPasswdShow = false
          this.puIpShow = false
        } else {
          this.interconnectCodeShow = true
          this.rules.puAccessPasswd[0].required = false
        }
      } else if (val == '萤石云' && this.platType == 10) {
        this.puPortShow = true
        this.puAccountShow = true
        this.puPasswdShow = true
        this.puIpShow = true

        this.rules.puPort[0].required = true
        this.rules.puAccount[0].required = true
        this.rules.puPasswd[0].required = true
        this.rules.puIp[0].required = true
      } else {
        if (val == 'HWSDK') {
          this.wayToRegister_change(0)
        } else if (val == 'HWSDK-ACREG') {
          this.wayToRegister_change(1)
        } else if (val == 'HOLO') {
          //好望云
          this.validateCodeShow = true
          this.rules.validateCode[0].required = true
        }
        this.puPortShow = true
        this.puAccountShow = true
        this.puPasswdShow = true
        this.puIpShow = true
        this.rules.puPort[0].required = true
        this.rules.puAccount[0].required = true
        this.rules.puPasswd[0].required = true
        this.rules.puIp[0].required = true
      }
    },

    wayToRegister_change(val) {
      this.form.puAccessPasswd = ''
      this.form.puAccount = ''
      this.form.puPasswd = ''
      this.form.puPort = ''
      this.form.puIp = ''

      if (val == 0) {
        this.interconnectCodeShow = false

        this.puAccessPasswdShow = false
        this.rules.puAccessPasswd[0].required = false

        this.rules.puPort[0].required = true
        this.rules.puAccount[0].required = true
        this.rules.puPasswd[0].required = true
        this.rules.puIp[0].required = true
      } else {
        this.interconnectCodeShow = true

        this.puAccessPasswdShow = true
        this.rules.puAccessPasswd[0].required = true

        this.rules.puPort[0].required = false
        this.rules.puAccount[0].required = false
        this.rules.puPasswd[0].required = false
        this.rules.puIp[0].required = false
      }
    },

    // 设备类型和最大通道联动显示
    mainDevChange(val) {
      this.form.maxVideoNum = ''
      if (val == 1) {
        this.maxVideoNumShow = true
        this.rules.maxVideoNum[0].required = true
      } else {
        this.maxVideoNumShow = false
        this.rules.maxVideoNum[0].required = false
      }
    },
    validateCodeInput(val) {
      this.$forceUpdate()
    },
    //密码的隐藏和显示
    showPass() {
      this.passw = this.passw == 'password' ? 'text' : 'password'
      this.iconShow = !this.iconShow
    },
    //前端注册密码的隐藏和显示
    showPassword() {
      this.passws = this.passws == 'password' ? 'text' : 'password'
      this.iconShows = !this.iconShows
    },

    // 获取经纬度
    longlatFocus() {
      this.longlatMapVisible = true
      this.$refs.inputBlurLat.blur()
      this.$refs.inputBlurLog.blur()
    },

    // 录像策略和天数显示
    recordPolicyChange(val) {
      this.form.recordRemainDays = ''

      if (val !== '') {
        this.recordRemainDaysShow = true
        this.videoRules.recordRemainDays[0].required = true
      } else {
        this.recordRemainDaysShow = false
        this.videoRules.recordRemainDays[0].required = false
      }
    },

    // 上一步
    previousStep() {
      if (this.addActive == 0) return
      this.addActive--
    },
    // 下一步
    nextStep() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.longitude && !this.form.latitude) {
            this.$message.warning(this.$t('public.pleaseInputlatitude'))
            return
          } else if (!this.form.longitude && this.form.latitude) {
            this.$message.warning(this.$t('public.pleaseInputlongitude'))
            return
          }

          if (this.addActive == 2) return
          this.addActive++
        }
      })
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
        interconnectCode: form.interconnectCode, //互联编码
        installLocate: form.installLocate, //设备具体安装地址
        remark: form.remark, //备注
        platId: form.platId, //平台Id
        model: form.model, //设备型号
        manufacturer: form.manufacturer, //设备提供商类型
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
          maxVideoNum: form.mainDevType == 3 ? 1 : form.maxVideoNum, //最大视频通道数
          domainCode: this.platType == 5 ? form.domainCode : null,
          clusterCode: this.platType == 5 ? form.clusterCode : null,
          tasIp: this.platType == 5 ? form.tasIp : null,
          tasCode: this.platType == 5 ? form.tasCode : null,
          nvrCode: this.platType == 5 ? form.nvrCode : null
        },
        cameraConfigInfo: {
          ptzType: parseInt(form.ptzType) //摄像机类型
        },
        registerType: this.form.drive == 'T28181' ? 1 : Number(form.registerType)
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
      this.$parent.maskloading = true
      this.$api.addMainDevInfo(data).then(async res => {
        // 第一步成功
        if (res.resultCode == 0) {
          // 第二步填值
          if (this.addMainDevVideoForm.recordPolicyId) {
            let obj = {
              mainDevId: res.mainDevId,
              recordPolicyId: this.addMainDevVideoForm.recordPolicyId
            }
            let res1 = this.$api.setRecordPolicyInfoByMainDevId(obj)
            // 第二步成功
            if (res1.resultCode == 0) {
            } else {
              this.$parent.addMainDevVisible = false
              this.$parent.maskloading = false
              if (res1.failList) {
                this.$parent.recordPolicyFailList = res1.failList
                this.$parent.recordPolicyDialogVisible = true
              }
              this.$parent.search_clear()
              this.$parent.getMainDevList()
            }
          }

          let obj2 = {
            organizationId: this.organizationId, //组织Id
            organizationName: this.$refs['orgCascader'].getCheckedNodes()[0].label, //组织名称
            name: form.mainDevName, //设备名称
            apeID: form.apeID, //互联编码
            type: form.type, //采集设备类型
            manufacturer: form.manufacturer, //设备厂商
            model: form.model, //设备型号
            authority: form.authority, //鉴权方式
            userId: form.authority != '1' && form.authority != '' ? this.form.userId : '', //鉴权账号
            ipAddr: form.ipAddr, //Ipv4地址
            ipv6Addr: form.ipv6Addr, //Ipv6地址
            mac: form.mac, //MAC地址
            port: form.port, //端口号
            place: form.place, //安装位置
            placeCode:
              typeof form.placeCode == 'string'
                ? form.placeCode
                : form.placeCode[form.placeCode.length - 1].substring(0, 6), //安装地点区域代码
            longitude: form.longitude, //经度
            latitude: form.latitude, //纬度
            placeType: form.placeType, //设备位置类型
            capDirection: form.capDirection === '' ? null : form.capDirection, //车辆抓拍方向
            monitorAreaDesc: form.monitorAreaDesc, //监视区域说明
            police: form.police, //所属辖区公安机关
            managementName: form.managementName, //管理单位名称
            contact: form.contact, //管理单位联系方式
            installTime: form.installTime, //设备安装时间

            functionType: form.functionType, //采集设备功能类型

            id: res.mainDevId
          }

          let res2 = await this.$api.addMonitorApe(obj2)
          this.successBack()
        } else {
          this.$parent.maskloading = false
        }
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
    }
  }
}
</script>

<style lang="scss">
.addDeviceDialogViewClass {
  max-height: 100vh;
  .over {
    margin-top: 15px;
    max-height: 50vh;
    overflow: auto;
  }

  .el-step.is-center .el-step__line {
    width: 266px;
    left: 201px;
    top: 33px;
  }
  .el-card__header {
    padding: 0px 20px 20px !important;
  }
  .el-cascader,
  .el-date-editor {
    width: 100%;
  }
}
</style>
