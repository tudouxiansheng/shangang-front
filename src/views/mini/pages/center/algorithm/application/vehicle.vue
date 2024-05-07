<template>
  <div
    class="capture_application"
    v-if="isRouterAlive"
    ref="vehicleApplication"
    v-loading="loading"
    :element-loading-text="$t('public.loading')"
  >
    <el-row class="full_height" :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="7" :xl="7" class="full_height">
        <el-tabs v-model="searchMode" stretch @tab-click="handleTabClick">
          <el-tab-pane
            v-if="locale != 'en'"
            :label="$t('retrieval.pictureRetrieval')"
            name="picture"
          />
          <el-tab-pane :label="$t('retrieval.conditionRetrieval')" name="condition" />
        </el-tabs>
        <el-form
          :class="['search_form', locale === 'en' && 'grid-cols-3']"
          ref="queryForm"
          :model="queryParams"
          label-position="top"
        >
          <div class="search_form_content" v-show="searchMode === 'picture'">
            <el-form-item class="search_picture">
              <photo-cropper
                ref="photoCropper"
                accept=".jpeg,.png,.jpg,.bmp,.gif"
                v-model:src="uploadImageList"
                :options="cropperOptions"
                :before-selected="beforeSelected"
                @change="handleUploadImageChange"
                :api="uploadApi"
              ></photo-cropper>
            </el-form-item>
            <el-form-item :label="$t('retrieval.selectTimePeriod')" required class="form-item-full">
              <el-radio-group class="diy_time" v-model="timeType" size="small" @change="setDIYTime">
                <el-radio-button :label="3">{{ $t('public.nearlyThreeDays') }}</el-radio-button>
                <el-radio-button :label="7">{{ $t('public.nearlySevenSays') }}</el-radio-button>
                <el-radio-button :label="30">{{ $t('public.nearly30Days') }}</el-radio-button>
              </el-radio-group>
              <el-date-picker
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                :shortcuts="
                  { disabledDate: disabledDate } && { disabledDate: disabledDate }.shortcuts
                "
                :disabled-date="
                  { disabledDate: disabledDate } && { disabledDate: disabledDate }.disabledDate
                "
                :cell-class-name="
                  { disabledDate: disabledDate } && { disabledDate: disabledDate }.cellClassName
                "
                style="width: 100%"
                v-model="timeRange"
                type="datetimerange"
                :clearable="false"
                value-format="YYYY-MM-DD HH:mm:ss"
                :range-separator="$t('public.to')"
                :start-placeholder="$t('public.startTimePrompt')"
                :end-placeholder="$t('public.endTimePrompt')"
                @change="pickerChange"
                popper-class="no-clear"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('retrieval.selectPlatform')" class="form-item-full" required>
              <el-select
                v-model="queryParams.platId"
                clearable
                :placeholder="$t('retrieval.selectPlatformPrompt')"
                @change="handleAccessPlatformIdChange"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="accessPlatformId"
              :label="$t('retrieval.selectSource')"
              class="form-item-flex"
            >
              <el-select class="newCamera" v-model="sourceType" @change="sourceTypeChange">
                <el-option
                  v-for="item in sourceTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                ref="selectACameraInput"
                v-if="sourceType === 1"
                @focus="handleOpenDeviceTool"
                v-model="contentName"
                :placeholder="$t('alarmList.selectACamera')"
                class="newCameras"
              >
                <template #suffix>
                  <svg-icon icon-class="add-input" class-name="el-input__icon" />
                </template>
              </el-input>
              <el-input
                v-if="sourceType === 3"
                v-model="contentName"
                :placeholder="$t('analysisTask.selectVideoFile')"
                class="newCameras"
              >
                <template #suffix>
                  <img src="@/assets/img/common/add.png" class="addIcon" alt="" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('retrieval.similarity')">
              <el-slider
                class="slider-similarity"
                v-model="queryParams.thresholds.confidenceThreshold"
                :min="1"
                :max="100"
                :step="1"
                show-stops
                show-input
              ></el-slider>
            </el-form-item>
          </div>
          <div class="search_form_content" v-show="searchMode === 'condition'">
            <el-form-item class="form-item-full">
              <template #label>
                <div>
                  <span>{{ $t('retrieval.pnr') }}</span>
                  <div>
                    <el-checkbox
                      style="margin-right: 10px"
                      v-model="searchUnknown"
                      :disabled="queryParams.attributes.plateSimilar === '1'"
                    >
                      {{ $t('retrieval.searchUnknown') }}
                    </el-checkbox>
                    <el-checkbox
                      v-model="queryParams.attributes.plateSimilar"
                      true-label="1"
                      false-label="0"
                      :disabled="searchUnknown"
                    >
                      {{ $t('retrieval.plateSimilar') }}
                    </el-checkbox>
                  </div>
                </div>
              </template>

              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('retrieval.pnrPrompt')"
                placement="right"
              >
                <el-input
                  v-model="queryParams.attributes.pnr"
                  clearable
                  :disabled="searchUnknown"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('retrieval.selectTimePeriod')" required class="form-item-full">
              <el-radio-group class="diy_time" v-model="timeType" size="small" @change="setDIYTime">
                <el-radio-button :label="3">{{ $t('public.nearlyThreeDays') }}</el-radio-button>
                <el-radio-button :label="7">{{ $t('public.nearlySevenSays') }}</el-radio-button>
                <el-radio-button :label="30">{{ $t('public.nearly30Days') }}</el-radio-button>
              </el-radio-group>
              <el-date-picker
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                :shortcuts="
                  { disabledDate: disabledDate } && { disabledDate: disabledDate }.shortcuts
                "
                :disabled-date="
                  { disabledDate: disabledDate } && { disabledDate: disabledDate }.disabledDate
                "
                :cell-class-name="
                  { disabledDate: disabledDate } && { disabledDate: disabledDate }.cellClassName
                "
                style="width: 100%"
                v-model="timeRange"
                type="datetimerange"
                :clearable="false"
                value-format="YYYY-MM-DD HH:mm:ss"
                :range-separator="$t('public.to')"
                :start-placeholder="$t('public.startTimePrompt')"
                :end-placeholder="$t('public.endTimePrompt')"
                @change="pickerChange"
                popper-class="no-clear"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('retrieval.selectPlatform')" class="form-item-full" required>
              <el-select
                v-model="queryParams.platId"
                clearable
                :placeholder="$t('retrieval.selectPlatformPrompt')"
                @change="handleAccessPlatformIdChange"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="accessPlatformId"
              :label="$t('retrieval.selectSource')"
              class="form-item-flex"
            >
              <el-select v-model="sourceType" @change="sourceTypeChange">
                <el-option
                  v-for="item in sourceTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                ref="selectACameraInputSecond"
                v-if="sourceType === 1"
                @focus="handleOpenDeviceTool"
                v-model="contentName"
                :placeholder="$t('alarmList.selectACamera')"
                class="newCameras"
              >
                <template #suffix>
                  <svg-icon icon-class="add-input" class-name="el-input__icon" />
                </template>
              </el-input>
              <el-input
                v-if="sourceType === 3"
                v-model="contentName"
                :placeholder="$t('analysisTask.selectVideoFile')"
                class="newCameras"
              >
                <template #suffix>
                  <img src="@/assets/img/common/add.png" class="addIcon" alt="" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('retrieval.vehicleColor')">
              <el-radio-group
                :class="['with_angle', locale === 'en' && 'grid-cols-2']"
                v-model="queryParams.attributes.colorList[0]"
                size="small"
              >
                <el-radio
                  v-for="(item, index) in vcolorOption"
                  :class="`v_color_${item.value}`"
                  :key="index"
                  :label="item.value"
                  border
                >
                  {{ item.name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="form-item-full" :label="$t('retrieval.vehicleBrand') + '：'">
              <el-select
                v-model="queryParams.attributes.vehicleBrand"
                @change="handleBrandChange"
                filterable
              >
                <el-option
                  key="unlimited"
                  :label="$t('deviceManagement.unlimited')"
                  :value="false"
                ></el-option>
                <el-option
                  v-for="(item, index) in vehicleBrandList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="
                queryParams.attributes.vehicleBrand !== undefined && vehicleSubList.length > 0
              "
              :label="$t('retrieval.vehicleSubBrand')"
            >
              <el-radio-group
                class="with_angle"
                v-model="queryParams.attributes.vehicleSub"
                size="small"
              >
                <el-radio key="unlimited" :label="undefined" border>
                  {{ $t('deviceManagement.unlimited') }}
                </el-radio>
                <el-radio
                  v-for="(item, index) in vehicleSubList"
                  :key="index"
                  :label="item.value"
                  border
                >
                  {{ item.name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('retrieval.carType')">
              <el-radio-group
                class="with_angle"
                v-model="queryParams.attributes.carType"
                size="small"
              >
                <el-radio
                  v-for="(item, index) in cartypeOption"
                  :key="index"
                  :label="item.value"
                  border
                >
                  <el-tooltip effect="dark" :content="item.name" placement="top">
                    <span class="radio-text">{{ item.name }}</span>
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 英文模式下不需要下列查询条件 -->
            <template v-if="locale !== 'en'">
              <el-form-item :label="$t('retrieval.specialCarType')">
                <el-radio-group
                  class="with_angle"
                  v-model="queryParams.attributes.specialVehicleTypeIdx"
                  size="small"
                >
                  <el-radio
                    v-for="(item, index) in specialVehicleTypeIdxOption"
                    :key="index"
                    :label="item.value"
                    border
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('retrieval.allPtype')">
                <el-radio-group
                  class="with_angle"
                  v-model="queryParams.attributes.pType"
                  size="small"
                >
                  <el-radio
                    v-for="(item, index) in ptypeOption"
                    :key="index"
                    :label="item.value"
                    border
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('retrieval.pColor')">
                <el-radio-group
                  :class="['with_angle', locale === 'en' && 'grid-cols-2']"
                  v-model="queryParams.attributes.pColor"
                  size="small"
                >
                  <el-radio
                    v-for="(item, index) in pcolorOption"
                    :class="`p_color_${item.value}`"
                    :key="index"
                    :label="item.value"
                    border
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="show_more" @click="showMore = !showMore">
                <span>{{ $t('retrieval.moreFeatures') }}</span>
                <el-icon v-if="showMore"><el-icon-arrow-up /></el-icon>
                <el-icon v-else><el-icon-arrow-down /></el-icon>
              </div>
            </template>

            <el-collapse-transition>
              <div v-show="showMore">
                <el-form-item :label="$t('retrieval.hasPnr')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.licensedVehicle"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.obscuredPlate')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.obscuredPlate"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.yearLogo')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.yearLogo"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.carPendant')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.carPendant"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.goods')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.goods"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.napkinBox')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.napkinBox"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.viceDriver')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.viceDriver"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.direc')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.direc"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in direcOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.mainCalling')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.mainCall"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.mainBelt')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.mainBelt"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.viceBelt')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.viceBelt"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.sunVisor')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.sunVisor"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.viceSunVisor')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.viceSunVisor"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.card')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.card"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.damagedVehicle')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.damagedVehicle"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.graffiti')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.graffiti"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.headOutSunroof')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.headOutSunroof"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.roofRack')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.roofRack"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.spareTire')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.spareTire"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('retrieval.sunroof')">
                  <el-radio-group
                    class="with_angle"
                    v-model="queryParams.attributes.sunroof"
                    size="small"
                  >
                    <el-radio
                      v-for="(item, index) in existOption"
                      :key="index"
                      :label="item.value"
                      border
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-collapse-transition>
          </div>
        </el-form>
        <div class="search_form_footer" ref="port">
          <el-button type="primary" @click="handleQuery">{{ $t('public.search') }}</el-button>
          <el-button @click="resetQuery">
            {{ $t('public.reset') }}
          </el-button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="16" :lg="17" :xl="17" class="full_height">
        <div class="result_container">
          <el-row>
            <el-col :span="12" class="tab-col">
              <el-button
                :class="queryParams.searchType === 1 && 'active'"
                type="primary"
                round
                @click="handleSearchTypeChange(1)"
              >
                {{ $t('retrieval.multiAlgorithmMode') }}
              </el-button>
              <el-button
                :class="queryParams.searchType === 0 && 'active'"
                type="primary"
                round
                @click="handleSearchTypeChange(0)"
              >
                {{ $t('retrieval.singleAlgorithmMode') }}
              </el-button>
            </el-col>
            <el-col :span="12" class="control-col">
              <span class="retrieval_time_period" v-if="tableData.length && !loading">
                {{ searchTimePeriod }}
              </span>
              <el-button type="primary" :disabled="!tableData.length" @click="trackHandle">
                {{ $t('retrieval.trajectoryAnalysis') }}
              </el-button>
              <el-dropdown style="margin-left: 10px" trigger="click" @command="handleExportCommand">
                <el-button type="primary" :disabled="!tableData.length">
                  {{ $t('retrieval.export') }}
                  <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="1">
                      {{ $t('retrieval.exportSelected') }}
                    </el-dropdown-item>
                    <el-dropdown-item command="2">
                      {{ $t('retrieval.exportPage') }}
                    </el-dropdown-item>
                    <el-dropdown-item command="3">{{ $t('retrieval.exportAll') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
          <el-row v-show="algorithmList.length > 0">
            <AlgorithmSelect
              :options="algorithmList"
              :modelData="queryParams.algorithmList"
              :type="queryParams.searchType"
              @valueChange="handleAlgorithmListChange"
            />
          </el-row>
          <el-row>
            <div class="check_all">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >
                {{ $t('retrieval.allSelect') }}
              </el-checkbox>

              <span>{{ $t('retrieval.selected') }}：{{ checkedData.length }}</span>
            </div>
          </el-row>
          <div class="flex flex-col flex-1 overflow-hidden">
            <div v-if="!loading && !tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt />
              <p>{{ $t('public.noData') }}</p>
            </div>

            <div class="table-cards-wrapper" v-if="!loading && tableData.length">
              <el-checkbox-group v-model="checkedData" @change="handleCheckedDataChange">
                <div class="table-cards">
                  <el-card
                    v-for="(item, index) in tableData"
                    :key="index"
                    :class="[checkedData.includes(item.pictureInfo.thirdFileId) && 'is-checked']"
                  >
                    <div class="card-header">
                      <el-checkbox
                        class="no-label"
                        :label="item.pictureInfo.thirdFileId"
                        :key="item.pictureInfo.thirdFileId"
                      />
                    </div>
                    <div class="img-content" @click="handleView(item)">
                      <el-image
                        fit="fill"
                        :src="item.pictureInfo.thumPicUrl"
                        :lazy="tableData.length > 8"
                        scroll-container=".table-cards-wrapper"
                      ></el-image>
                      <span class="img-tips">
                        <span v-if="searchMode === 'picture'">
                          {{ parseFloat(item.pictureInfo.dconfidence).toFixed(2) + '%' }}
                        </span>
                        <span>{{ relativeTime(parseInt(item.deviceInfo.recordTime)) }}</span>
                      </span>
                    </div>
                    <div class="guard-info">
                      <span class="guard-info-item">
                        <svg-icon icon-class="record-time" />
                        <span :title="formatTime(item.deviceInfo.recordTime)">
                          {{ formatTime(item.deviceInfo.recordTime) }}
                        </span>
                      </span>
                      <span class="guard-info-item">
                        <svg-icon icon-class="record-pnr" />
                        <span :title="item.attributes.lprInfo.plateNumber">
                          {{ item.attributes.lprInfo.plateNumber }}
                        </span>
                      </span>
                      <span class="guard-info-item">
                        <svg-icon icon-class="record-camera" />
                        <span :title="item.deviceInfo.cameraName">
                          {{ item.deviceInfo.cameraName }}
                        </span>
                      </span>
                    </div>
                  </el-card>
                </div>
              </el-checkbox-group>
            </div>

            <!--分页-->
            <Pager
              v-if="!loading && tableData.length"
              :total="total"
              :realTotal="realTotal"
              v-model:pageNum="queryParams.pageInfo.pageNum"
              v-model:limit="queryParams.pageInfo.pageSize"
              @pagination="getList"
              @continueSearch="handleContinueSearch"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <camera-selector
      :key="deviceToolKey"
      :title="$t('analysisTask.selectCamara')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      @cancel="cancleCameras"
      :device-type="1"
      :platform-id="accessPlatformId"
      :max="1000"
    />

    <Detail
      v-model:visible="viewProps.visible"
      :data="viewProps.data"
      :search-mode="searchMode"
      :search-image="queryParams.imageList.length === 1 ? uploadImageList[0] : ''"
      :data-type="dataType"
      @search="handleSearchImage"
      @toRepository="openRepositoryModal"
    />

    <ExportModal
      v-model:visible="exportModalVisible"
      :data="exportData"
      :export-data-type="dataType"
      :export-type="command"
      :totalNum="realTotal"
      :api="api"
      :queryParams="queryParamsFormattered"
    />

    <RepositoryModal
      v-model:visible="repositoryModalVisible"
      :data-type="dataType"
      :image="imageForRepository"
    />
  </div>
</template>

<script>
import { handleGetPreview } from '@/utils/common/preViewImg'
import { ArrowUp as ElIconArrowUp, ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import CameraSelector from '@components/cameraSelector'
import PhotoCropper from '@/components/photo-cropper'
import AlgorithmSelect from './components/algorithmSelect'
import Pager from './components/pager'
import Detail from './components/detail'
import ExportModal from './components/exportModal'
import RepositoryModal from './components/repositoryModal'
import { ApplicationType } from './constant'
import { mapActions, mapState } from 'vuex'
import { asyncPool } from '@/utils/common/utils'

export default {
  components: {
    CameraSelector,
    PhotoCropper,
    AlgorithmSelect,
    Pager,
    Detail,
    ExportModal,
    RepositoryModal,
    ElIconArrowUp,
    ElIconArrowDown
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      searchMode: 'picture',
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 200
        },
        platId: undefined,
        imageList: [],
        searchType: 1,
        algorithmList: [],
        cameraList: [],
        beginTime: undefined,
        endTime: undefined,
        thresholds: {
          confidenceThreshold: 80
        },
        attributes: {
          pnr: undefined,
          plateSimilar: '0',
          colorList: ['-1'],
          carType: '-1',
          vehicleSubType: undefined,
          specialVehicleTypeIdx: '-1',
          vehicleBrand: undefined,
          vehicleSub: undefined,
          pType: '-1',
          pColor: '-1',
          licensedVehicle: '-1',
          obscuredPlate: '-1',
          yearLogo: '-1',
          carPendant: '-1',
          goods: '-1',
          napkinBox: '-1',
          viceDriver: '-1',
          direc: '-1',
          mainCall: '-1',
          mainBelt: '-1',
          viceBelt: '-1',
          sunVisor: '-1',
          viceSunVisor: '-1',
          card: '-1',
          damagedVehicle: '-1',
          graffiti: '-1',
          headOutSunroof: '-1',
          roofRack: '-1',
          spareTire: '-1',
          sunroof: '-1'
        }
      },
      queryParamsFormattered: null,
      uploadImageList: [],
      uploadApi: '',
      searchUnknown: false,
      sourceType: 1,
      cropperOptions: {
        canMove: false,
        centerBox: true
      },
      timeType: 3,
      timeRange: [],
      contentName: undefined,
      dialogDeviceVisible: false,
      showMore: false,
      loading: false,
      tableData: [],
      total: 0,
      realTotal: 0,
      checkedData: [],
      checkAll: false,
      isIndeterminate: false,
      viewProps: {
        visible: false,
        data: {}
      },
      platformList: [],
      accessPlatformId: undefined,
      algorithmList: [],
      deviceToolKey: 0,
      exportModalVisible: false,
      exportData: [],
      dataType: ApplicationType.vehicle,
      repositoryModalVisible: false,
      imageForRepository: '',
      command: undefined,
      api: undefined,
      vehicleSubList: [],
      dayjs
    }
  },
  name: 'VehicleApplication',
  computed: {
    ...mapState({
      vcolorOption: state => state.dict['ars-retrieval-vcolor'],
      cartypeOption: state => state.dict['ars-retrieval-cartype'],
      specialVehicleTypeIdxOption: state => state.dict['ars-retrieval-specialVehicleType'],
      ptypeOption: state => state.dict['ars-retrieval-ptype'],
      pcolorOption: state => state.dict['ars-retrieval-pcolor'],
      existOption: state => state.dict['ars-retrieval-vehicle-exist'],
      direcOption: state => state.dict['ars-retrieval-direc'],
      vehicleBrandList: state => state.dict['ars-vehicle-brand'], //车辆品牌
      vehicleSubBrandList: state => state.dict['ars-vehicle-sub-brand'] //车辆子品牌
    }),
    sourceTypeList() {
      return [
        {
          name: this.$t('analysisTask.camera'),
          value: 1
        }
      ]
    },
    searchTimePeriod() {
      let { beginTime, endTime } = this.queryParams
      if (beginTime && endTime) {
        return `${this.$t('retrieval.searchTimePeriod')}${this.dayjs(beginTime).format(
          'YYYY/MM/DD HH:mm:ss'
        )}-${this.dayjs(endTime).format('YYYY/MM/DD HH:mm:ss')}`
      } else {
        return ''
      }
    }
  },
  created() {
    this.initSearchMode()
    this.getAccessPlatList()
  },
  mounted() {
    this.getDictionary()
    this.setDIYTime()
    window.addEventListener('resize', this.initWrapperHeight)
    this.initWrapperHeight()
    this.bindEvent()
  },
  beforeDestroy() {
    this.unBindEvent()
    window.removeEventListener('resize', this.initWrapperHeight)
  },
  methods: {
    initSearchMode() {
      this.searchMode = this.locale == 'en' ? 'condition' : 'picture'
    },
    bindEvent() {
      this.$bus.$on('webkit_notify', this.webkitNotify)
    },
    unBindEvent() {
      this.$bus.$off('webkit_notify')
    },
    async webkitNotify(e) {
      let { func, message } = e
      if (func == 'send_params') {
        this.checkAll = false
        this.isIndeterminate = false
        this.checkedData = []
        this.tableData = []
        this.resetQuery()
        if (this.locale == 'en') {
          this.searchMode = 'condition'
          let { lpn } = JSON.parse(message)
          this.queryParams.attributes.pnr = lpn
          this.searchUnknown = false
        } else {
          this.searchMode = 'picture'
          await this.$nextTick()
          this.$refs.photoCropper.imageSrc = []
          this.$refs.photoCropper.files = []
          this.$refs.photoCropper.previewSrcMap = []
          let { fileId } = JSON.parse(message)
          const { downloadUrl } = await this.$api.getDownloadUrl({
            fileId,
            netType: this.$getNetType()
          })
          this.queryParams.imageList = [
            {
              fileId: fileId
            }
          ]
          this.uploadImageList = [downloadUrl]
          await this.$nextTick()
          this.$refs.photoCropper.files = [
            {
              fileId: fileId,
              downloadUrl: downloadUrl
            }
          ]
        }
      }
    },
    beforeSelected(file) {
      const testType = /^image\/(jpeg|png|jpg|bmp|gif)$/.test(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!testType) {
        this.$message.error(this.$t('retrieval.imgFormatPrompt'))
      }
      if (!isLt5M) {
        this.$message.error(this.$t('retrieval.imgSizePrompt') + ' 5MB')
      }

      this.uploadApi =
        this.searchMode === 'picture'
          ? '/api/ars/intelligent-app/vehicle/searchByImage'
          : '/api/ars/intelligent-app/vehicle/searchByCondition'

      return testType && isLt5M
    },
    // 日期格式处理
    date_format(val) {
      this.queryParams.beginTime = val != null ? val[0] : undefined
      this.queryParams.endTime = val != null ? val[1] : undefined
    },
    dialogClosed() {},
    dialogOpen() {
      this.$nextTick(() => {
        
      })
    },
    getAccessPlatList() {
      this.$api.queryAccessPlatformList({ platformType: 19 }).then(res => {
        if (res && res.resultCode == 0) {
          this.platformList = res.platformList
          // 默认选择第一个平台
          if (this.platformList.length > 0) {
            this.queryParams.platId = this.platformList[0].platformId
            this.handleAccessPlatformIdChange(this.queryParams.platId)
          }
        }
      })
    },
    getAlgorithmList() {
      this.$api
        .queryNewAlgorithmList({
          accessId: this.queryParams.platId,
          algorithmType: 'VEHICLE_RECOGNIZE',
          pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.algorithmList = res.algorithmList
            if (this.algorithmList.length > 0) {
              // 默认多算法 全选
              this.queryParams.searchType = 1
              this.queryParams.algorithmList = this.algorithmList.map(item => item.algorithmId)
            }
          } else {
            this.algorithmList = []
          }
        })
        .catch(err => {
          this.algorithmList = []
        })
    },
    async getCameras(cameras) {
      this.contentName = cameras.map(item => item.name).join(',')
      this.queryParams.cameraList = cameras.map(item => item.id)
    },
    cancleCameras() {
      this.dialogDeviceVisible = false
    },
    ...mapActions('dict', ['getSysDictData', 'getFuzzyDictData']),
    getDictionary() {
      this.getSysDictData([
        'ars-retrieval-vcolor',
        'ars-retrieval-cartype',
        'ars-retrieval-specialVehicleType',
        'ars-retrieval-ptype',
        'ars-retrieval-pcolor',
        'ars-retrieval-vehicle-exist',
        'ars-retrieval-direc',
        'ars-vehicle-brand'
      ])
      this.getFuzzyDictData(['ars-vehicle-sub-brand'])
    },
    async getList() {
      // 判断startTime是否大于当前时间
      let beginTime = new Date(this.queryParams.beginTime).getTime()
      let now = new Date().getTime()
      if (beginTime > now) {
        this.$message.error(`${this.$t('retrieval.startTimePrompt')}`)
        return
      }
      this.loading = true
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedData = []
      let queryParams = this.$loadash.cloneDeep(this.queryParams)
      if (this.searchMode === 'condition') {
        if (this.searchUnknown) {
          queryParams.attributes.pnr = '-unknown-'
        }
        if (this.locale === 'en') {
          queryParams?.attributes?.plateSimilar && delete queryParams.attributes.plateSimilar
        }
        queryParams.thresholds && delete queryParams.thresholds
        queryParams.imageList && delete queryParams.imageList
      }
      if (this.searchMode === 'picture') {
        queryParams = {
          pageInfo: {
            pageNum: queryParams.pageInfo.pageNum,
            pageSize: queryParams.pageInfo.pageSize
          },
          platId: queryParams.platId,
          imageList: queryParams.imageList,
          beginTime: queryParams.beginTime,
          endTime: queryParams.endTime,
          cameraList: queryParams.cameraList,
          thresholds: {
            confidenceThreshold: queryParams.thresholds.confidenceThreshold + ''
          },
          algorithmList: queryParams.algorithmList,
          searchType: queryParams.searchType
        }
      }

      // 处理 queryParams.imageList File类型先上传
      if (queryParams.imageList && queryParams.imageList.length > 0) {
        const handleImage = async item => {
          if (item.fileId || item.url) {
            return item
          } else if (item.file) {
            let formData = new FormData()
            formData.append('file', item.file)
            formData.append('api', this.uploadApi)
            formData.append('netType', this.$getNetType())
            let res = await this.$api.uploadFileTemporary(formData)
            if (res.resultCode === 0) {
              return {
                fileId: res.fileId
              }
            }
          }
        }
        queryParams.imageList = await asyncPool(6, queryParams.imageList, handleImage)
      }

      // 处理 queryParams.attributes 里每一项 如果是 -1 就删除
      for (let key in queryParams.attributes) {
        if (queryParams.attributes[key] === '-1') {
          delete queryParams.attributes[key]
        }
        if (key === 'colorList' && queryParams.attributes[key][0] === '-1') {
          delete queryParams.attributes[key]
        }
      }
      let apiList = {
        picture: 'searchVehicleByImage',
        condition: 'searchVehicleByCondition'
      }
      const reset = () => {
        this.tableData = []
        this.total = 0
        this.realTotal = 0
      }
      this.$api[apiList[this.searchMode]](queryParams)
        .then(res => {
          if (res.resultCode === 0) {
            if (!res.resultList) {
              reset()
            } else {
              if (res.resultList[0]?.datas?.length > 0) {
                this.queryParamsFormattered = queryParams
                this.api = apiList[this.searchMode]
                res.resultList[0].datas.forEach(item => {
                  if (item?.pictureInfo.thumPicUrl) {
                    item.pictureInfo.thumPicUrl = handleGetPreview(item.pictureInfo.thumPicUrl)
                  }
                  if (item?.pictureInfo.picUrl) {
                    item.pictureInfo.picUrl = handleGetPreview(item.pictureInfo.picUrl)
                  }
                })
              this.tableData = res.resultList[0].datas
                this.total = res.pageInfo.totalNum > 10000 ? 10000 : res.pageInfo.totalNum
                this.realTotal = res.pageInfo.totalNum
              } else {
                reset()
              }
            }
          } else {
            reset()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleAccessPlatformIdChange(val) {
      if (val) {
        this.$api
          .getCameraPlat({
            accessId: val
          })
          .then(res => {
            if (res.resultCode == 0) {
              this.accessPlatformId = res.platId
              // 强制更新镜头选择组件
              this.deviceToolKey += 1
              // 获取平台算法
              this.getAlgorithmList()
            } else {
              this.queryParams.platId = undefined
              this.accessPlatformId = undefined
            }
          })
          .catch(err => {
            this.queryParams.platId = undefined
            this.accessPlatformId = undefined
          })
      } else {
        this.accessPlatformId = undefined
      }
      // 平台变化 情况已选择的镜头
      this.contentName = undefined
      this.queryParams.cameraList = []
    },
    handleCheckAllChange(val) {
      this.checkedData = val ? this.tableData.map(item => item.pictureInfo.thirdFileId) : []
      this.isIndeterminate = false
    },
    handleCheckedDataChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tableData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.pageNum = 1
      if (this.searchMode === 'picture') {
        if (this.queryParams.imageList.length === 0) {
          this.$message.error(`${this.$t('retrieval.uploadImagePrompt')}`)
          return
        }
      }
      if (!this.queryParams.platId) {
        this.$message.error(`${this.$t('retrieval.selectPlatformPrompt')}`)
        return
      }
      // 计算实际结束时间 判断endTime是否大于当前时间
      let endTime = new Date(this.timeRange[1]).getTime()
      let now = new Date()
      if (endTime > now) {
        this.queryParams.endTime = this.dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.endTimeStamp = new Date(this.queryParams.endTime).getTime()
      } else {
        this.queryParams.endTime = this.timeRange[1]
        this.endTimeStamp = endTime
      }
      this.getList()
    },
    handleTabClick(tab) {
      if (tab.name === 'condition') {
        if (this.queryParams.cameraList.length) {
          this.handleQuery()
        } else {
          this.checkAll = false
          this.isIndeterminate = false
          this.checkedData = []
          this.tableData = []
        }
      } else {
        this.checkAll = false
        this.isIndeterminate = false
        this.checkedData = []
        this.tableData = []
      }
    },
    handleUploadImageChange(files) {
      if (files && files.length > 0) {
        this.queryParams.imageList = files.map(item => {
          if (item instanceof File) {
            return { file: item }
          } else if (item.url) {
            return {
              url: item.url
            }
          } else {
            return {
              fileId: item.fileId
            }
          }
        })
      }
    },
    handleView(data) {
      this.viewProps.data = data
      this.viewProps.visible = true
    },
    /** 初始化容器高度 背景色问题 */
    initWrapperHeight() {
      this.$nextTick(function () {
        let mainCenter = document.getElementById('main-center')
        this.$refs.vehicleApplication.style.height = mainCenter.clientHeight + 'px'
      })
    },
    // 日期改变联动时间类型
    pickerChange(val) {
      this.timeType = ''
      this.date_format(val)
    },
    disabledDate(time) {
      let curDate = this.dayjs()
      let selDate = this.dayjs(time)
      if (curDate.year() < selDate.year()) {
        return true
      }
      if (curDate.year() === selDate.year() && curDate.month() < selDate.month()) {
        return true
      }
      return (
        curDate.year() === selDate.year() &&
        curDate.month() === selDate.month() &&
        curDate.date() < selDate.date()
      )
    },
    relativeTime(time) {
      return this.dayjs(time).fromNow()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 200
        },
        platId: undefined,
        imageList: [],
        searchType: this.queryParams.searchType,
        algorithmList: this.queryParams.algorithmList,
        beginTime: this.queryParams.beginTime,
        endTime: this.queryParams.endTime,
        cameraList: [],
        thresholds: {
          confidenceThreshold: 80
        },
        attributes: {
          pnr: undefined,
          plateSimilar: '0',
          colorList: ['-1'],
          carType: '-1',
          vehicleSubType: undefined,
          specialVehicleTypeIdx: '-1',
          vehicleBrand: undefined,
          vehicleSub: undefined,
          pType: '-1',
          pColor: '-1',
          licensedVehicle: '-1',
          obscuredPlate: '-1',
          yearLogo: '-1',
          carPendant: '-1',
          goods: '-1',
          napkinBox: '-1',
          viceDriver: '-1',
          direc: '-1',
          mainCall: '-1',
          mainBelt: '-1',
          viceBelt: '-1',
          sunVisor: '-1',
          viceSunVisor: '-1',
          card: '-1',
          damagedVehicle: '-1',
          graffiti: '-1',
          headOutSunroof: '-1',
          roofRack: '-1',
          spareTire: '-1',
          sunroof: '-1'
        }
      }
      this.timeType = 3
      this.setDIYTime()
      this.contentName = undefined
      this.$refs.photoCropper.reset()
      // 默认选择第一个平台
      if (this.platformList.length > 0) {
        this.queryParams.platId = this.platformList[0].platformId
        this.handleAccessPlatformIdChange(this.queryParams.platId)
      }
      this.$resetForm('queryForm')
    },
    setDIYTime() {
      if (!this.timeType) {
        return
      }
      this.timeRange = [
        this.dayjs()
          .subtract(this.timeType - 1, 'day')
          .format('YYYY-MM-DD') + ' 00:00:00',
        this.dayjs().format('YYYY-MM-DD') + ' 23:59:59'
      ]
      this.date_format(this.timeRange)
    },
    sourceTypeChange(val) {
      this.contentName = undefined
      this.queryParams.cameraList = []
    },
    handleOpenDeviceTool() {
      if (!this.queryParams.platId) {
        this.$message.warning(this.$t('retrieval.selectPlatformPrompt'))
        return
      }
      this.dialogDeviceVisible = true
      this.$refs.selectACameraInput.blur()
      this.$refs.selectACameraInputSecond.blur()
    },
    // 算法模式改变
    handleSearchTypeChange(type) {
      this.queryParams.searchType = type
      if (this.algorithmList.length === 0) {
        return
      }
      if (type === 0) {
        // 切换到单算法默认选中第一个算法
        this.queryParams.algorithmList = [this.algorithmList[0].algorithmId]
      }
      if (type === 1) {
        // 切换到多算法默认全选
        this.queryParams.algorithmList = this.algorithmList.map(item => item.algorithmId)
      }
      this.handleQuery()
    },
    // 选中算法改变
    handleAlgorithmListChange(val) {
      // 单算法
     this.queryParams.algorithmList = val
       if (this.queryParams.searchType === 0 && this.queryParams.algorithmList.length === 0) {
        this.$message.error(this.$t('retrieval.pleaseSelectAtLeastOneAlgorithm'))
        return
      }
      this.handleQuery()
    },
    formatTime(timeStamp) {
      return this.dayjs(parseInt(timeStamp)).format('YYYY-MM-DD HH:mm:ss')
    },
    handleContinueSearch() {
      const lastRecordTime = this.tableData[this.tableData.length - 1].deviceInfo.recordTime
      this.queryParams.endTime = this.formatTime(lastRecordTime)
      this.timeRange = [this.queryParams.beginTime, this.queryParams.endTime]
      this.handleQuery()
    },
    async handleExportCommand(command) {
      if (command === '1' && this.checkedData.length === 0) {
        this.$message.error(this.$t('retrieval.selectExportData'))
        return
      }
      this.command = command
      try {
        await this.$confirm(this.$t('retrieval.vehicleExportPrompt'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
      } catch {
        return
      }
      let data = []
      if (command === '1') {
        data = this.tableData.filter(item =>
          this.checkedData.includes(item.pictureInfo.thirdFileId)
        )
      } else if (command === '2') {
        data = this.tableData
      } else if (command === '3') {
        if (this.realTotal > 100000) {
          return this.$message.warning(this.$t('retrieval.maximumExportSupport'))
        }
        // 用于指定第一批第一张图片
        if (this.endTimeStamp) {
          this.queryParamsFormattered.precisionTime = this.endTimeStamp + ''
        }
      }
      this.exportData = this.normalizeExportData(data)
      this.exportModalVisible = true
    },
    async trackHandle() {
      if (this.checkedData.length === 0) {
        this.$message.error(this.$t('retrieval.selectAnalysisData'))
        return
      }
      if (this.checkedData.length > 128) {
        try {
          await this.$confirm(this.$t('retrieval.selectMost128'), this.$t('public.prompt'), {
            confirmButtonText: this.$t('public.confirm'),
            cancelButtonText: this.$t('public.cancel'),
            type: 'warning',
            closeOnClickModal: false
          })
          this.checkedData.splice(128)
        } catch {
          return
        }
      }
      let data = []
      data = this.tableData.filter(item => this.checkedData.includes(item.pictureInfo.thirdFileId))
      const locationFlag = data.some(
        item =>
          !item.deviceInfo.latitude ||
          item.deviceInfo.latitude == 'null' ||
          !item.deviceInfo.longitude ||
          item.deviceInfo.longitude == 'null'
      )
      if (locationFlag) {
        this.$message.error(this.$t('retrieval.selectLocationCamera'))
        return
      }
      this.$router.push({
        name: 'TrajectoryAnalysis',
        params: {
          deviceList: JSON.stringify(this.normalizeExportData(data)),
          type: 1
        }
      })
    },
    normalizeExportData(data) {
      let normalizeData = []
      data.forEach(item => {
        let obj = {}
        for (const itemKey in item) {
          Object.assign(obj, item[itemKey])
          if (itemKey === 'attributes') {
            for (const attrKey in item[itemKey]) {
              if (attrKey === 'lprInfo') {
                Object.assign(obj, item[itemKey][attrKey])
              }
            }
          }
        }
        normalizeData.push(obj)
      })
      return normalizeData
    },
    handleSearchImage({ pictureInfo, deviceInfo, attributes }) {
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedData = []
      this.tableData = []
      if (this.locale === 'en') {
        this.searchMode = 'condition'
        this.queryParams.attributes.pnr = attributes.lprInfo.plateNumber
        this.searchUnknown = false
      } else {
        this.searchMode = 'picture'
        const obj = {
          url: pictureInfo.thumPicUrl
        }
        this.queryParams.imageList = [obj]
        this.uploadImageList = [pictureInfo.thumPicUrl]
        this.$refs.photoCropper.previewSrcMap = []
        this.$nextTick(() => {
          this.$refs.photoCropper.files = [obj]
          this.handleQuery()
        })
      }
    },
    openRepositoryModal({ pictureInfo }) {
      this.imageForRepository = pictureInfo.thumPicUrl
      this.repositoryModalVisible = true
    },
    handleBrandChange(val) {
      this.queryParams.attributes.vehicleSub = undefined
      if (val) {
        this.$api
          .getDictionary({
            type: `ars-vehicle-sub-brand-${val}`
          })
          .then(res => {
            if (res) {
              this.vehicleSubList = res.dictionaryList || []
            }
          })
          .catch(err => {
            this.vehicleSubList = []
          })
      } else {
        this.vehicleSubList = []
      }
    }
  }
}
</script>

<style lang="scss">
@import './application.scss';
</style>
