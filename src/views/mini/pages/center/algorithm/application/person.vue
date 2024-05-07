<template>
  <div
    class="capture_application"
    v-if="isRouterAlive"
    ref="portraitApplication"
    v-loading="loading"
    :element-loading-text="$t('public.loading')"
  >
    <el-row class="full_height" :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="7" :xl="7" class="full_height">
        <el-tabs v-model="searchMode" stretch @tab-click="handleTabClick">
          <el-tab-pane :label="$t('retrieval.pictureRetrieval')" name="picture" />
          <el-tab-pane :label="$t('retrieval.conditionRetrieval')" name="condition" />
        </el-tabs>
        <el-form
          :class="['search_form', locale === 'en' && 'grid-cols-3']"
          ref="queryForm"
          :model="queryParams"
          :rules="queryRules"
          label-position="top"
        >
          <div class="search_form_content" v-show="searchMode === 'picture'">
            <el-form-item class="search_picture">
              <photo-cropper
                ref="photoCropper"
                v-model:src="uploadImageList"
                :options="cropperOptions"
                accept=".jpeg,.png,.jpg,.bmp,.gif"
                :before-selected="beforeSelected"
                @change="handleUploadImageChange"
                :api="uploadApi"
              ></photo-cropper>
            </el-form-item>
            <el-form-item :label="$t('retrieval.retrievalType')">
              <el-radio-group
                v-model="queryParams.partType"
                style="width: 100%"
                @change="getAlgorithmList"
              >
                <el-radio style="width: 50%" :label="0">
                  {{ $t('retrieval.faceRetrieval1') }}
                </el-radio>
                <el-radio v-if="!$projectEnv.includes('SIOP')" :label="1">
                  {{ $t('retrieval.humanRetrieval') }}
                </el-radio>
              </el-radio-group>
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
            <el-form-item v-show="queryParams.partType === 0">
              <template #label>
                <el-checkbox v-model="setQuality">
                  {{ $t('retrieval.quality') }}
                </el-checkbox>
              </template>

              <el-slider
                v-if="setQuality"
                class="slider-similarity"
                v-model="quality"
                :min="1"
                :max="100"
                :step="1"
                show-stops
                show-input
              ></el-slider>
            </el-form-item>
          </div>
          <div class="search_form_content" v-show="searchMode === 'condition'">
            <el-form-item :label="$t('retrieval.retrievalType')">
              <el-radio-group v-model="queryParams.partType" style="width: 100%">
                <el-radio style="width: 50%" :label="0">
                  {{ $t('retrieval.faceRetrieval1') }}
                </el-radio>
                <el-radio v-if="!$projectEnv.includes('SIOP')" :label="1">
                  {{ $t('retrieval.humanRetrieval') }}
                </el-radio>
              </el-radio-group>
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
            <!-- 中文模式下才展示 -->
            <template v-if="locale === 'zh'">
              <el-form-item :label="$t('retrieval.gender')">
                <el-radio-group
                  class="with_angle"
                  v-model="queryParams.attributes.gender"
                  size="small"
                >
                  <el-radio
                    v-for="(item, index) in sexOption"
                    v-show="item.value !== '0'"
                    :key="index"
                    :label="item.value"
                    border
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('retrieval.age')">
                <el-radio-group
                  class="with_angle"
                  v-model="queryParams.attributes.age"
                  size="small"
                >
                  <el-radio
                    v-for="(item, index) in ageOption"
                    v-show="item.value !== '0'"
                    :key="index"
                    :label="item.value"
                    border
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('retrieval.mouthMask')">
                <el-radio-group
                  class="with_angle"
                  v-model="queryParams.attributes.mouthmask"
                  size="small"
                >
                  <el-radio
                    v-for="(item, index) in existOption"
                    v-show="item.value !== '0'"
                    :key="index"
                    :label="item.value"
                    border
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('retrieval.eyeglass')">
                <el-radio-group
                  class="with_angle"
                  v-model="queryParams.attributes.eyeglass"
                  size="small"
                >
                  <el-radio
                    v-for="(item, index) in existOption"
                    v-show="item.value !== '0'"
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
                <el-icon><el-icon-arrow-up /></el-icon>
                <el-icon><el-icon-arrow-down /></el-icon>
              </div>
            </template>

            <el-collapse-transition>
              <div v-show="showMore">
                <div v-if="queryParams.partType === 0">
                  <el-form-item>
                    <template #label>
                      <el-checkbox v-model="setQuality1">
                        {{ $t('retrieval.quality') }}
                      </el-checkbox>
                    </template>

                    <el-slider
                      v-if="setQuality1"
                      v-model="queryParams.thresholds.qualityList"
                      :min="1"
                      :max="100"
                      range
                      :step="1"
                    ></el-slider>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.featureValue')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.feature"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in featureOption"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.specificAge')" prop="attributes.ageBegin">
                    <div class="age_box">
                      <el-input-number
                        v-model="queryParams.attributes.ageBegin"
                        controls-position="right"
                        :min="0"
                        :max="200"
                        :step="1"
                        :precision="0"
                      ></el-input-number>
                      <span>{{ $t('public.to') }}</span>
                      <el-input-number
                        v-model="queryParams.attributes.ageEnd"
                        controls-position="right"
                        :min="0"
                        :max="200"
                        :step="1"
                        :precision="0"
                      ></el-input-number>
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.expression')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.expression"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in expressionOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.mustache')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.mustache"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.hat')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.hat"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div v-if="queryParams.partType === 1">
                  <el-form-item :label="$t('retrieval.oType')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.otype"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in oTypeOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.featureValue')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.feature"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in featureOption"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <p class="form-item-group-title">
                    {{ $t('retrieval.hairAndShape') }}
                  </p>
                  <el-form-item :label="$t('retrieval.hair')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.hair"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in hairOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.shape')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.shape"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in shapeOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <p class="form-item-group-title">
                    {{ $t('retrieval.upperTitle') }}
                  </p>
                  <el-form-item :label="$t('retrieval.upperStyle')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.upperStyle"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in upperStyleOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.upperColor')">
                    <el-radio-group
                      :class="['with_angle', locale === 'en' && 'grid-cols-2']"
                      v-model="queryParams.attributes.upperColor"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in colorOption"
                        :class="`color_${item.value}`"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.upperTexture')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.upperTexture"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in textureOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <p class="form-item-group-title">
                    {{ $t('retrieval.lowerTitle') }}
                  </p>
                  <el-form-item :label="$t('retrieval.lowerStyle')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.lowerStyle"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in lowerStyleOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.lowerColor')">
                    <el-radio-group
                      :class="['with_angle', locale === 'en' && 'grid-cols-2']"
                      v-model="queryParams.attributes.lowerColor"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in colorOption"
                        :class="`color_${item.value}`"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <p class="form-item-group-title">
                    {{ $t('retrieval.accessories') }}
                  </p>
                  <el-form-item :label="$t('retrieval.hat')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.hat"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.carryBag')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.backpack"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.umbrella')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.umbrella"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.helmet')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.helmet"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.frontPack')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.frontpack"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.luggage')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.luggage"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <p class="form-item-group-title">
                    {{ $t('retrieval.humanBehavior') }}
                  </p>
                  <el-form-item :label="$t('retrieval.calling')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.calling"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.carry')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.carry"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.smoking')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.smoking"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.view')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.view"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in viewOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <p class="form-item-group-title">
                    {{ $t('retrieval.bicycleInfo') }}
                  </p>
                  <el-form-item :label="$t('retrieval.bicycleTricycle')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.bicycleTricycle"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in bicycleTricycleOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.subBicycleTricycle')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.subBicycleTricycle"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in subBicycleTricycleOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.cycleColor')">
                    <el-radio-group
                      :class="['with_angle', locale === 'en' && 'grid-cols-2']"
                      v-model="queryParams.attributes.cycleColor"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in colorOption"
                        :class="`color_${item.value}`"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.bikeHasPlate')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.bikeHasPlate"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.sunshade')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.sunshade"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.sunshadeColor')">
                    <el-radio-group
                      :class="['with_angle', locale === 'en' && 'grid-cols-2']"
                      v-model="queryParams.attributes.sunshadeColor"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in colorOption"
                        :class="`color_${item.value}`"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.overload')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.overload"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.carryGoods')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.carryGoods"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('retrieval.headLightShape')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.headLightShape"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in headLightShapeOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item :label="$t('retrieval.riderManNum')">
                    <el-input-number
                      v-model="queryParams.attributes.ridermanNum"
                      controls-position="right"
                      :min="1"
                    ></el-input-number>
                  </el-form-item>

                  <p class="form-item-group-title">
                    {{ $t('retrieval.vehicleInfo') }}
                  </p>
                  <el-form-item :label="$t('retrieval.motorLicensePlate')">
                    <el-radio-group
                      class="with_angle"
                      v-model="queryParams.attributes.motorLicensePlate"
                      size="small"
                    >
                      <el-radio
                        v-for="(item, index) in existOption"
                        v-show="item.value !== '0'"
                        :key="index"
                        :label="item.value"
                        border
                      >
                        {{ item.name }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
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
                        <svg-icon icon-class="location" />
                        <span :title="item.deviceInfo.location">
                          {{ item.deviceInfo.location }}
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
      :searchMode="searchMode"
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
      cuType: sessionStorage.getItem('cuType'),
      searchMode: 'picture',
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 200
        },
        platId: undefined,
        imageList: [],
        partType: 0,
        searchType: 1,
        algorithmList: [],
        beginTime: undefined,
        endTime: undefined,
        cameraList: [],
        thresholds: {
          confidenceThreshold: 80,
          qualityList: [undefined, undefined]
        },

        attributes: {
          hair: '-1',
          age: '-1',
          gender: '-1',
          mouthmask: '-1',
          eyeglass: '-1',
          ageBegin: undefined,
          ageEnd: undefined,
          expression: '-1',
          mustache: '-1',
          hat: '-1',
          feature: '-1',
          otype: '-1',
          shape: '-1',
          upperStyle: '-1',
          upperColor: '-1',
          upperTexture: '-1',
          lowerStyle: '-1',
          lowerColor: '-1',
          backpack: '-1',
          umbrella: '-1',
          helmet: '-1',
          frontpack: '-1',
          luggage: '-1',
          calling: '-1',
          carry: '-1',
          smoking: '-1',
          view: '-1',
          bicycleTricycle: '-1',
          subBicycleTricycle: '-1',
          cycleColor: '-1',
          bikeHasPlate: '-1',
          sunshade: '-1',
          sunshadeColor: '-1',
          overload: '-1',
          carryGoods: '-1',
          headLightShape: '-1',
          ridermanNum: undefined,
          motorLicensePlate: '-1'
        }
      },
      queryParamsFormattered: null,
      uploadImageList: [],
      uploadApi: '',
      sourceType: 1,
      cropperOptions: {
        canMove: false,
        centerBox: true
      },
      timeType: 3,
      timeRange: [],
      contentName: undefined,
      dialogDeviceVisible: false,
      setQuality: false,
      setQuality1: false,
      quality: undefined,
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
      dataType: ApplicationType.person,
      repositoryModalVisible: false,
      imageForRepository: '',
      command: undefined,
      api: undefined,
      dayjs
    }
  },
  name: 'TargetApplication',
  computed: {
    ...mapState({
      sexOption: state => state.dict['ars-retrieval-sex'],
      ageOption: state => state.dict['ars-retrieval-age'],
      existOption: state => state.dict['ars-retrieval-exist'],
      oTypeOption: state => state.dict['ars-retrieval-otype'],
      hairOption: state => state.dict['ars-retrieval-hair'],
      shapeOption: state => state.dict['ars-retrieval-shape'],
      upperStyleOption: state => state.dict['ars-retrieval-upperStyle'],
      colorOption: state => state.dict['ars-retrieval-color'],
      textureOption: state => state.dict['ars-retrieval-upperTexture'],
      lowerStyleOption: state => state.dict['ars-retrieval-lowerStyle'],
      headLightShapeOption: state => state.dict['ars-retrieval-headLightShape'],
      bicycleTricycleOption: state => state.dict['ars-retrieval-bicycleTricycle'],
      subBicycleTricycleOption: state => state.dict['ars-retrieval-subBicycleTricycle'],
      expressionOption: state => state.dict['ars-retrieval-expression'],
      viewOption: state => state.dict['ars-retrieval-view'],
      featureOption: state => state.dict['ars-retrieval-feature-exist']
    }),
    sourceTypeList() {
      return [
        {
          name: this.$t('analysisTask.camera'),
          value: 1
        }
      ]
    },
    queryRules() {
      const validateAge = (rule, value, callback) => {
        if (!this.queryParams.attributes.ageEnd) {
          if (!value) {
            callback()
          } else {
            callback(new Error(`${this.$t('retrieval.ageEndPrompt')}`))
          }
        } else {
          if (value > this.queryParams.attributes.ageEnd) {
            callback(new Error(`${this.$t('retrieval.ageEndPrompt')}`))
          } else {
            callback()
          }
        }
      }
      return {
        'attributes.ageBegin': [{ required: false, validator: validateAge, trigger: 'change' }]
      }
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
  watch: {
    setQuality(newV) {
      this.handleQualityChange(newV)
    },
    setQuality1(newV) {
      this.handleQualityChange(newV)
    }
  },
  mounted() {
    this.getAccessPlatList()
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
    ...mapActions('dict', ['getSysDictData']),
    getDictionary() {
      this.getSysDictData([
        'ars-retrieval-sex',
        'ars-retrieval-age',
        'ars-retrieval-exist',
        'ars-retrieval-otype',
        'ars-retrieval-hair',
        'ars-retrieval-shape',
        'ars-retrieval-upperStyle',
        'ars-retrieval-color',
        'ars-retrieval-upperTexture',
        'ars-retrieval-lowerStyle',
        'ars-retrieval-headLightShape',
        'ars-retrieval-bicycleTricycle',
        'ars-retrieval-subBicycleTricycle',
        'ars-retrieval-expression',
        'ars-retrieval-view',
        'ars-retrieval-feature-exist'
      ])
    },
    handleQualityChange(val) {
      if (val) {
        if (this.searchMode === 'picture') {
          this.quality = 1
        } else {
          this.queryParams.thresholds.qualityList[0] = 1
          this.queryParams.thresholds.qualityList[1] = 100
        }
      } else {
        if (this.searchMode === 'picture') {
          this.quality = undefined
        } else {
          this.queryParams.thresholds.qualityList[0] = undefined
          this.queryParams.thresholds.qualityList[1] = undefined
        }
      }
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
        this.searchMode = 'picture'
        this.checkAll = false
        this.isIndeterminate = false
        this.checkedData = []
        this.tableData = []
        this.resetQuery()
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
    },

    /** 初始化容器高度 背景色问题 */
    initWrapperHeight() {
      this.$nextTick(function () {
        let mainCenter = document.getElementById('main-center')
        this.$refs.portraitApplication.style.height = mainCenter.clientHeight + 'px'
      })
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
          ? '/api/ars/intelligent-app/face/searchByImage'
          : '/api/ars/intelligent-app/face/searchByCondition'
      return testType && isLt5M
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
      let now = new Date().getTime()
      if (endTime > now) {
        this.queryParams.endTime = this.dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.endTimeStamp = new Date(this.queryParams.endTime).getTime()
      } else {
        this.queryParams.endTime = this.timeRange[1]
        this.endTimeStamp = endTime
      }
      this.getList()
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
        partType: 0,
        beginTime: this.queryParams.beginTime,
        endTime: this.queryParams.endTime,
        cameraList: [],

        thresholds: {
          confidenceThreshold: 80,
          qualityList: [undefined, undefined]
        },

        attributes: {
          gender: '-1',
          age: '-1',
          mouthmask: '-1',
          eyeglass: '-1',
          feature: '-1',
          ageBegin: undefined,
          ageEnd: undefined,
          expression: '-1',
          mustache: '-1',
          hat: '-1',
          otype: '-1',
          hair: '-1',
          shape: '-1',
          upperStyle: '-1',
          upperColor: '-1',
          upperTexture: '-1',
          lowerStyle: '-1',
          lowerColor: '-1',
          backpack: '-1',
          umbrella: '-1',
          helmet: '-1',
          frontpack: '-1',
          luggage: '-1',
          calling: '-1',
          carry: '-1',
          smoking: '-1',
          view: '-1',
          bicycleTricycle: '-1',
          subBicycleTricycle: '-1',
          cycleColor: '-1',
          bikeHasPlate: '-1',
          sunshade: '-1',
          sunshadeColor: '-1',
          overload: '-1',
          carryGoods: '-1',
          headLightShape: '-1',
          ridermanNum: undefined,
          motorLicensePlate: '-1'
        }
      }
      this.quality = undefined
      this.timeType = 3
      this.setDIYTime()
      this.setQuality = false
      this.setQuality1 = false
      this.contentName = ''
      this.$refs.photoCropper.reset()
      // 默认选择第一个平台
      if (this.platformList.length > 0) {
        this.queryParams.platId = this.platformList[0].platformId
        this.handleAccessPlatformIdChange(this.queryParams.platId)
      }
      this.$resetForm('queryForm')
    },
    async getList() {
      // 判断startTime是否大于当前时间
      let beginTime = new Date(this.queryParams.beginTime).getTime()
      let now = new Date().getTime()
      if (beginTime > now) {
        this.$message.error(`${this.$t('retrieval.startTimePrompt')}`)
        return
      }
      const valid = await this.$refs.queryForm.validate().catch(err => err)
      if (valid !== true) return false
      this.loading = true
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedData = []
      let queryParams = this.$loadash.cloneDeep(this.queryParams)
      const reset = () => {
        this.tableData = []
        this.total = 0
        this.realTotal = 0
      }
      if (this.searchMode === 'picture') {
        queryParams = {
          pageInfo: {
            pageNum: queryParams.pageInfo.pageNum,
            pageSize: queryParams.pageInfo.pageSize
          },
          searchType: queryParams.searchType,
          platId: queryParams.platId,
          imageList: queryParams.imageList,

          beginTime: queryParams.beginTime,
          endTime: queryParams.endTime,
          cameraList: queryParams.cameraList,
          thresholds: {
            confidenceThreshold: queryParams.thresholds.confidenceThreshold,
            qualityLow: this.quality !== undefined ? this.quality : undefined,
            qualityHigh: this.quality !== undefined ? 100 : undefined
          },
          algorithmList: queryParams.algorithmList
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

        if (queryParams.partType === 1) {
          queryParams.thresholds.qualityLow && delete queryParams.thresholds.qualityLow
          queryParams.thresholds.qualityHigh && delete queryParams.thresholds.qualityHigh
          //目标整体图片检索
          let res = await this.$api.searchBodyByImage(queryParams)
          this.loading = false
          if (res.resultCode === 0) {
            if (res.resultList[0]?.datas?.length > 0) {
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
          } else {
            reset()
          }
        } else {
          queryParams.thresholds.qualityLow === null && delete queryParams.thresholds.qualityLow
          queryParams.thresholds.qualityHigh === null && delete queryParams.thresholds.qualityHigh
          //目标图片检索
          let res = await this.$api.searchFaceByImage(queryParams)
          this.loading = false
          if (res && res.resultCode === 0) {
            if (res.resultList[0]?.datas?.length > 0) {
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
          } else {
            reset()
          }
        }
      }

      if (this.searchMode === 'condition') {
        if (queryParams.partType === 0) {
          queryParams = {
            pageInfo: {
              pageNum: queryParams.pageInfo.pageNum,
              pageSize: queryParams.pageInfo.pageSize
            },
            searchType: queryParams.searchType,
            platId: queryParams.platId,

            beginTime: queryParams.beginTime,
            endTime: queryParams.endTime,
            cameraList: queryParams.cameraList,

            thresholds: {
              qualityLow: queryParams.thresholds.qualityList[0],
              qualityHigh: queryParams.thresholds.qualityList[1]
            },
            attributes: {
              gender: queryParams.attributes.gender,
              age: queryParams.attributes.age,
              mouthmask: queryParams.attributes.mouthmask,
              eyeglass: queryParams.attributes.eyeglass,
              feature: queryParams.attributes.feature,
              ageBegin: queryParams.attributes.ageBegin,
              ageEnd: queryParams.attributes.ageEnd,
              expression: queryParams.attributes.expression,
              mustache: queryParams.attributes.mustache,
              hat: queryParams.attributes.hat
            },
            algorithmList: queryParams.algorithmList
          }
          queryParams.thresholds.qualityLow === null && delete queryParams.thresholds.qualityLow
          queryParams.thresholds.qualityHigh === null && delete queryParams.thresholds.qualityHigh
          Object.keys(queryParams.thresholds).length === 0 && delete queryParams.thresholds
          //目标条件检索
          let res = await this.$api.searchFaceByCondition(queryParams)
          this.loading = false
          if (res.resultCode === 0) {
            if (!res.resultList) {
              reset()
            } else {
              if (res.resultList[0]?.datas?.length > 0) {
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
        } else {
          queryParams.partType && delete queryParams.partType
          queryParams.thresholds.qualityLow && delete queryParams.thresholds.qualityLow
          queryParams.thresholds.qualityHigh && delete queryParams.thresholds.qualityHigh
          queryParams.attributes.ageBegin && delete queryParams.attributes.ageBegin
          queryParams.attributes.ageEnd && delete queryParams.attributes.ageEnd
          queryParams.attributes.expression && delete queryParams.attributes.expression
          queryParams.attributes.mustache && delete queryParams.attributes.mustache
          queryParams.thresholds.confidenceThreshold &&
            delete queryParams.thresholds.confidenceThreshold
          queryParams.imageList && delete queryParams.imageList

          //目标整体条件检索
          let res = await this.$api.searchBodyByCondition(queryParams)
          this.loading = false
          if (res.resultCode === 0) {
            if (!res.resultList) {
              reset()
            } else {
              if (res.resultList[0]?.datas?.length > 0) {
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
        }
      }
      this.queryParamsFormattered = queryParams
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
    handleTabClick(tab) {
      this.queryParams.thresholds.qualityList[0] = undefined
      this.queryParams.thresholds.qualityList[1] = undefined
      this.quality = undefined
      if (tab.name === 'condition') {
        this.setQuality = false
        if (this.queryParams.cameraList.length) {
          this.getList()
        } else {
          this.checkAll = false
          this.isIndeterminate = false
          this.checkedData = []
          this.tableData = []
        }
      } else {
        this.setQuality1 = false
        this.checkAll = false
        this.isIndeterminate = false
        this.checkedData = []
        this.tableData = []
      }
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
    relativeTime(time) {
      return this.dayjs(time).fromNow()
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
    // 日期格式处理
    date_format(val) {
      this.queryParams.beginTime = val != null ? val[0] : undefined
      this.queryParams.endTime = val != null ? val[1] : undefined
    },
    async getCameras(cameras) {
      this.contentName = cameras.map(item => item.name).join(',')
      this.queryParams.cameraList = cameras.map(item => item.id)
    },
    cancleCameras() {
      this.dialogDeviceVisible = false
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
        await this.$confirm(this.$t('retrieval.exportPersonInfoPrompt'), this.$t('public.prompt'), {
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
        // 获取所有的数据
        if (this.searchMode === 'picture') {
          if (this.queryParams.partType === 1) {
            this.api = 'searchBodyByImage'
          } else {
            this.api = 'searchFaceByImage'
          }
        } else if (this.searchMode === 'condition') {
          if (this.queryParams.partType === 0) {
            this.api = 'searchFaceByCondition'
          } else {
            this.api = 'searchBodyByCondition'
          }
        }
        // 用于指定第一批第一张图片
        if (this.endTimeStamp) {
          this.queryParamsFormattered.precisionTime = this.endTimeStamp + ''
        }
      }
      this.exportData = this.normalizeExportData(data)
      this.exportModalVisible = true
    },
    normalizeExportData(data) {
      let normalizeData = []
      data.forEach(item => {
        let obj = {}
        for (const itemKey in item) {
          Object.assign(obj, item[itemKey])
        }
        normalizeData.push(obj)
      })
      return normalizeData
    },
    handleView(data) {
      this.viewProps.data = data
      this.viewProps.visible = true
    },
    dialogOpen() {
      this.$nextTick(() => {
        
      })
    },
    dialogClosed() {},
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
          algorithmType: this.queryParams.partType === 0 ? 'FACE_RECOGNIZE' : 'PERSON_RECOGNIZE',
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
          type: 0
        }
      })
    },
    handleSearchImage({ pictureInfo, deviceInfo }) {
      this.searchMode = 'picture'
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedData = []
      this.tableData = []
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
    },
    openRepositoryModal({ pictureInfo }) {
      this.imageForRepository = pictureInfo.thumPicUrl
      this.repositoryModalVisible = true
    }
  }
}
</script>

<style lang="scss">
@import './application.scss';
</style>
