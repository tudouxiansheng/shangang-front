<template>
  <!-- 算法分配 -->
  <div id="newAlgorithmAllocate" v-if="isRouterAlive" ref="allocateManage">
    <div class="tenantTableDiv">
      <p style="color: #fff; font-size: 16px">{{ $t('algoAllocate.tenantAlgo') }}</p>

      <div
        v-loading="topLoading"
        :element-loading-text="$t('public.loading')"
        
      >
        <div v-show="!topLoading && !tableData_tb.length" class="tableNOdata">
          <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
          <p>{{ $t('public.noData') }}</p>
        </div>
        <el-table
          v-loading="topLoading"
          :element-loading-text="$t('public.loading')"
          
          ref="tenantTable"
          :data="tableData_tb"
          style="width: 100%; margin-top: 20px"
          :row-class-name="tableRowClassName"
          class="elTable"
          border
          :max-height="tableHeight_tb"
          v-show="!topLoading && tableData_tb.length"
        >
          <template v-slot:empty>
            <span style="font-size: 14px">{{ dataText }}</span>
          </template>
          <el-table-column :label="$t('algoAllocate.algoName')" min-width="85">
            <template #default="{ row }">
              <span>{{ row.algorithmName }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoAllocate.algoStartTime')" min-width="80">
            <template #default="{ row }">
              <span>{{ row.validDateBegin }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoAllocate.algoStopTime')" min-width="80">
            <template #default="{ row }">
              <span>{{ row.validDateEnd }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoAllocate.maxChannel')" min-width="90">
            <template #default="{ row }">
              <span>{{ row.maxChannel }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoAllocate.allocatedChannel')" min-width="90">
            <template #default="{ row }">
              <span>{{ row.allocatedChannel }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoAllocate.runningTasks')" min-width="80">
            <template #default="{ row }">
              <span>{{ row.runningTasks }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('algoAllocate.availableChannel')" min-width="90">
            <template #default="{ row }">
              <span>{{ row.availableChannel }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination" v-show="!topLoading && tableData_tb.length">
          <div class="paging">
            <span>{{ $t('public.everyPageShows') }}</span>
            <el-select v-model="number_tb" @change="numberChange_tb">
              <el-option
                v-for="(item, index) in numberList_tb"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <span>{{ $t('public.records') }}</span>
          </div>
          <div>
            <el-pagination
              v-model:current-page="pageNum_tb"
              :page-size="pageSize_tb"
              layout="total, prev, pager, next, jumper"
              :total="totalNum_tb"
              @current-change="handleCurrentChange_tb"
              background
            />
          </div>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeName" style="margin-left: 20px">
      <el-tab-pane :label="$t('algoAllocate.subTenant')" name="tenant">
        {{ $t('algoAllocate.subTenant') }}
      </el-tab-pane>
    </el-tabs>
    <el-row style="padding-bottom: 20px" v-show="activeName == 'user'">
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-search-tree
            ref="lazyTree"
            @initList="initData"
            @nodeClick="treeNodeClick"
            :treeApi="operateApi"
            :searchApi="searchApi"
            :locateApi="localApi"
            :placeholderTitle="placeholderTitle"
          />
        </el-scrollbar>
      </el-col>
      <el-col :span="20" style="padding: 0 30px; padding-right: 20px">
        <div style="position: relative; min-height: 38px" class="btnMargin">
          <div>
            <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
              {{ $t('algoAllocate.addAllocate') }}
            </el-button>
            <el-button type="primary" @click="batchSave" v-if="PermissionManage">
              {{ $t('algoAllocate.save') }}
            </el-button>
            <el-button
              type="danger"
              @click="batchDelete"
              v-if="PermissionManage"
              :disabled="!multipleSelection.length"
            >
              {{ $t('algoAllocate.cancelAllocate') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container" style="position: absolute; top: 0px; right: -10px">
            <el-form
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
              ref="form"
              :model="searchForm"
              label-position="left"
              style="display: flex; flex-direction: row"
            >
              <el-form-item prop="adminLName">
                <el-input
                  v-model="searchForm.algorithmName"
                  auto-complete="off"
                  :placeholder="$t('algoAllocate.inputSearchAlgoName')"
                  clearable
                  @change="search_change"
                  class="inputMiddle"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFind" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change"></breadcrumb>
        <!-- 表格 -->

        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !ruleForm.tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            v-if="!loading && ruleForm.tableData.length"
          >
            <el-table
              v-loading="loading"
              :element-loading-text="$t('public.loading')"
              
              ref="multipleTable"
              :data="ruleForm.tableData"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              :cell-class-name="checkbox"
              class="elTable userTable"
              @selection-change="handleSelectionChange"
              border
            >
              <template v-slot:empty>
                <span style="font-size: 14px">{{ dataText }}</span>
              </template>
              <el-table-column label width="50" type="selection"></el-table-column>
              <el-table-column :label="$t('algoAllocate.algoName')" min-width="85">
                <template #default="{ row, $index }">
                  <div
                    @dblclick="row.operation ? nameDbclick(row) : ''"
                    style="width: 100%; hight: 100%"
                  >
                    <el-form-item
                      :prop="'tableData.' + $index + '.algorithmId'"
                      :rules="rules.algorithmId"
                      :class="
                        !row.isMaxChannelOK &&
                        !row.isEndTimeOK &&
                        !row.isStartTimeOK &&
                        !row.isNameOK
                          ? 'showBottom'
                          : ''
                      "
                      v-if="row.isNameOK && row.operation"
                    >
                      <el-select
                        v-if="row.isNameOK && row.operation"
                        v-model="row.algorithmId"
                        :placeholder="$t('algoAllocate.selectAlgo')"
                        ref="nameInput"
                        @change="changeName(row)"
                        @focus="focusName($index, row)"
                      >
                        <el-option
                          v-for="(item, index) in unAllocateAlogList"
                          :key="index"
                          :label="item.algorithmName"
                          :value="item.algorithmId"
                          :disabled="item.canNotChoose"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <span v-else>{{ row.algorithmName }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.algoStartTime')" min-width="80">
                <template #default="{ row, $index }">
                  <div @dblclick="startTimeDbclick(row)" style="width: 100%; hight: 100%">
                    <el-form-item
                      :prop="'tableData.' + $index + '.validDateBegin'"
                      :rules="rules.validDateBegin"
                      :class="
                        !row.isMaxChannelOK &&
                        !row.isEndTimeOK &&
                        !row.isStartTimeOK &&
                        !row.isNameOK
                          ? 'showBottom'
                          : ''
                      "
                      v-if="row.isStartTimeOK"
                    >
                      <el-date-picker
                        v-model="row.validDateBegin"
                        type="date"
                        :placeholder="$t('algoAllocate.selectTime')"
                        size="medium"
                        value-format="YYYY-MM-DD"
                        ref="startTimeInput"
                      ></el-date-picker>
                    </el-form-item>
                    <span v-else>{{ row.validDateBegin }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.algoStopTime')" min-width="80">
                <template #default="{ row, $index }">
                  <div @dblclick="endTimeDbclick(row)" style="width: 100%; hight: 100%">
                    <el-form-item
                      :prop="'tableData.' + $index + '.validDateEnd'"
                      :rules="rules.validDateEnd"
                      :class="
                        !row.isMaxChannelOK &&
                        !row.isEndTimeOK &&
                        !row.isStartTimeOK &&
                        !row.isNameOK
                          ? 'showBottom'
                          : ''
                      "
                      v-if="row.isEndTimeOK"
                    >
                      <el-date-picker
                        v-model="row.validDateEnd"
                        type="date"
                        :placeholder="$t('algoAllocate.selectTime')"
                        size="medium"
                        value-format="YYYY-MM-DD"
                        ref="endTimeInput"
                      ></el-date-picker>
                    </el-form-item>
                    <span v-else>{{ row.validDateEnd }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.maxChannel')" min-width="90">
                <template #default="{ row, $index }">
                  <div @dblclick="maxChannelDbclick(row)" style="width: 100%; hight: 100%">
                    <el-form-item
                      :prop="'tableData.' + $index + '.maxChannel'"
                      :rules="rules.maxChannel"
                      :class="
                        !row.isMaxChannelOK &&
                        !row.isEndTimeOK &&
                        !row.isStartTimeOK &&
                        !row.isNameOK
                          ? 'showBottom'
                          : ''
                      "
                      v-if="row.isMaxChannelOK"
                    >
                      <el-input
                        v-model="row.maxChannel"
                        :placeholder="$t('algoAllocate.inputChannel')"
                        ref="maxChannelInput"
                      ></el-input>
                    </el-form-item>
                    <span v-else>{{ row.maxChannel }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.runningTasks')" min-width="75">
                <template #default="{ row }">
                  <span>{{ row.runningTasks }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.operating')" min-width="110">
                <template #default="{ row, $index }">
                  <span
                    style="margin-right: 7px; color: #10a9ff; cursor: pointer"
                    @click="handleEdit($index, row)"
                    v-if="
                      PermissionManage &&
                      (!row.isNameOK ||
                        !row.isStartTimeOK ||
                        !row.isEndTimeOK ||
                        !row.isMaxChannelOK) &&
                      !row.operation
                    "
                  >
                    {{ $t('public.modify') }}
                  </span>
                  <span
                    style="margin-right: 7px; color: #10a9ff; cursor: pointer"
                    @click="handleSave(row)"
                    v-if="PermissionManage && !row.operation"
                  >
                    {{ $t('algoAllocate.save') }}
                  </span>
                  <span
                    style="margin-right: 7px; color: #f56c6c; cursor: pointer"
                    @click="handleDelete($index, row)"
                    v-if="PermissionManage && !row.operation"
                  >
                    {{ $t('algoAllocate.cancelAllocate') }}
                  </span>
                  <span
                    style="margin-right: 7px; color: #f56c6c; cursor: pointer"
                    @click="handleCancel($index, row)"
                    v-if="row.operation"
                  >
                    {{ $t('algoAllocate.cancelAdd') }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-form>

          <!--分页-->
          <div class="pagination" v-if="!loading && ruleForm.tableData.length">
            <div class="paging">
              <span>{{ $t('public.everyPageShows') }}</span>
              <el-select v-model="number" @change="numberChange">
                <el-option
                  v-for="(item, index) in numberList"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
              <span>{{ $t('public.records') }}</span>
            </div>
            <div>
              <el-pagination
                v-model:current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalNum"
                @current-change="handleCurrentChange"
                background
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row style="padding-bottom: 20px" v-show="activeName == 'tenant'">
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <lazy-search-tree
            ref="lazyTree_t"
            @initList="initData_t"
            @nodeClick="treeNodeClick_t"
            :treeApi="operateApi_t"
            :searchApi="searchApi_t"
            :locateApi="localApi_t"
          />
        </el-scrollbar>
      </el-col>
      <el-col :span="20" style="padding: 0 30px; padding-right: 20px">
        <div style="position: relative; min-height: 38px" class="btnMargin">
          <div>
            <el-button type="primary" @click="handleAdd_t" v-if="PermissionManage">
              {{ $t('algoAllocate.addAllocate') }}
            </el-button>
            <el-button type="primary" @click="batchSave_t" v-if="PermissionManage">
              {{ $t('algoAllocate.save') }}
            </el-button>
            <el-button
              type="danger"
              @click="batchDelete_t"
              v-if="PermissionManage"
              :disabled="!multipleSelection_t.length"
            >
              {{ $t('algoAllocate.cancelAllocate') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container" style="position: absolute; top: 0px; right: -10px">
            <el-form
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
              ref="form"
              :model="searchForm"
              label-position="left"
              style="display: flex; flex-direction: row"
            >
              <el-form-item prop="adminLName">
                <el-input
                  v-model="searchForm_t.algorithmName"
                  auto-complete="off"
                  :placeholder="$t('algoAllocate.inputSearchAlgoName')"
                  clearable
                  @change="search_change_t"
                  class="inputMiddle"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFind_t" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <breadcrumb ref="breadcrumb_t" @changeTree="tree_change_t"></breadcrumb>
        <!-- 表格 -->

        <div
          style="height: 600px"
          v-loading="loading_t"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-show="!loading_t && !ruleForm_t.tableData_t.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-form
            :model="ruleForm_t"
            :rules="rules_t"
            ref="ruleForm_t"
            label-width="100px"
            v-show="!loading_t && ruleForm_t.tableData_t.length"
          >
            <el-table
              v-loading="loading_t"
              :element-loading-text="$t('public.loading')"
              
              ref="multipleTable_t"
              :data="ruleForm_t.tableData_t"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              class="elTable tenantTable_t"
              :cell-class-name="checkbox"
              @selection-change="handleSelectionChange_t"
              border
            >
              <template v-slot:empty>
                <span style="font-size: 14px">{{ dataText }}</span>
              </template>
              <el-table-column label width="50" type="selection"></el-table-column>
              <el-table-column :label="$t('algoAllocate.algoName')" min-width="85">
                <template #default="{ row, $index }">
                  <div
                    @dblclick="row.operation_t ? nameDbclick_t(row) : ''"
                    style="width: 100%; hight: 100%"
                  >
                    <el-form-item
                      :prop="'tableData_t.' + $index + '.algorithmId'"
                      :rules="rules_t.algorithmId"
                      :class="
                        !row.isMaxChannelOK_t &&
                        !row.isEndTimeOK_t &&
                        !row.isStartTimeOK_t &&
                        !row.isNameOK_t
                          ? 'showBottom'
                          : ''
                      "
                      v-if="row.isNameOK_t && row.operation_t"
                    >
                      <el-select
                        v-model="row.algorithmId"
                        :placeholder="$t('algoAllocate.selectAlgo')"
                        ref="nameInput_t"
                        @change="changeName_t(row)"
                        @focus="focusName_t($index, row)"
                      >
                        <el-option
                          v-for="(item, index) in unAllocateAlogList_t"
                          :key="index"
                          :label="item.algorithmName"
                          :value="item.algorithmId"
                          :disabled="item.canNotChoose"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <span v-else>{{ row.algorithmName }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.algoStartTime')" min-width="80">
                <template #default="{ row, $index }">
                  <div @dblclick="startTimeDbclick_t(row)" style="width: 100%; hight: 100%">
                    <el-form-item
                      :prop="'tableData_t.' + $index + '.validDateBegin'"
                      :rules="rules_t.validDateBegin"
                      :class="
                        !row.isMaxChannelOK_t &&
                        !row.isEndTimeOK_t &&
                        !row.isStartTimeOK_t &&
                        !row.isNameOK_t
                          ? 'showBottom'
                          : ''
                      "
                      v-if="row.isStartTimeOK_t"
                    >
                      <el-date-picker
                        v-model="row.validDateBegin"
                        type="date"
                        :placeholder="$t('algoAllocate.selectTime')"
                        size="medium"
                        value-format="YYYY-MM-DD"
                        ref="startTimeInput_t"
                      ></el-date-picker>
                    </el-form-item>
                    <span v-else>{{ row.validDateBegin }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.algoStopTime')" min-width="80">
                <template #default="{ row, $index }">
                  <div @dblclick="endTimeDbclick_t(row)" style="width: 100%; hight: 100%">
                    <el-form-item
                      :prop="'tableData_t.' + $index + '.validDateEnd'"
                      :rules="rules_t.validDateEnd"
                      :class="
                        !row.isMaxChannelOK_t &&
                        !row.isEndTimeOK_t &&
                        !row.isStartTimeOK_t &&
                        !row.isNameOK_t
                          ? 'showBottom'
                          : ''
                      "
                      v-if="row.isEndTimeOK_t"
                    >
                      <el-date-picker
                        v-model="row.validDateEnd"
                        type="date"
                        :placeholder="$t('algoAllocate.selectTime')"
                        size="medium"
                        value-format="YYYY-MM-DD"
                        ref="endTimeInput_t"
                      ></el-date-picker>
                    </el-form-item>
                    <span v-else>{{ row.validDateEnd }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.maxChannel')" min-width="90">
                <template #default="{ row, $index }">
                  <div @dblclick="maxChannelDbclick_t(row)" style="width: 100%; hight: 100%">
                    <el-form-item
                      :prop="'tableData_t.' + $index + '.maxChannel'"
                      :rules="rules_t.maxChannel"
                      :class="
                        !row.isMaxChannelOK_t &&
                        !row.isEndTimeOK_t &&
                        !row.isStartTimeOK_t &&
                        !row.isNameOK_t
                          ? 'showBottom'
                          : 'long-error'
                      "
                      v-if="row.isMaxChannelOK_t"
                    >
                      <el-input
                        class="bottonSty"
                        v-model="row.maxChannel"
                        :placeholder="$t('algoAllocate.inputChannel')"
                        ref="maxChannelInput_t"
                      ></el-input>
                    </el-form-item>
                    <span v-else>{{ row.maxChannel }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.allocatedChannel')" min-width="75">
                <template #default="{ row }">
                  <span>{{ row.allocatedChannel }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.runningTasks')" min-width="75">
                <template #default="{ row }">
                  <span>{{ row.runningTasks }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('algoAllocate.availableChannel')" min-width="75">
                <template #default="{ row }">
                  <span>{{ row.availableChannel }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('public.operating')" min-width="115">
                <template #default="{ row, $index }">
                  <span
                    style="margin-right: 7px; color: #10a9ff; cursor: pointer"
                    @click="handleEdit_t($index, row)"
                    v-if="
                      PermissionManage &&
                      (!row.isNameOK_t ||
                        !row.isStartTimeOK_t ||
                        !row.isEndTimeOK_t ||
                        !row.isMaxChannelOK_t) &&
                      !row.operation_t
                    "
                  >
                    {{ $t('public.modify') }}
                  </span>
                  <span
                    style="margin-right: 7px; color: #10a9ff; cursor: pointer"
                    @click="handleSave_t(row)"
                    v-if="PermissionManage && !row.operation_t"
                  >
                    {{ $t('algoAllocate.save') }}
                  </span>
                  <span
                    style="margin-right: 7px; color: #f56c6c; cursor: pointer"
                    @click="handleDelete_t($index, row)"
                    v-if="PermissionManage && !row.operation_t"
                  >
                    {{ $t('algoAllocate.cancelAllocate') }}
                  </span>
                  <span
                    style="margin-right: 7px; color: #f56c6c; cursor: pointer"
                    @click="handleCancel_t($index, row)"
                    v-if="row.operation_t"
                  >
                    {{ $t('algoAllocate.cancelAdd') }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-form>

          <!--分页-->
          <div class="pagination" v-show="!loading_t && ruleForm_t.tableData_t.length">
            <div class="paging">
              <span>{{ $t('public.everyPageShows') }}</span>
              <el-select v-model="number_t" @change="numberChange_t">
                <el-option
                  v-for="(item, index) in numberList_t"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
              <span>{{ $t('public.records') }}</span>
            </div>
            <div>
              <el-pagination
                v-model:current-page="pageNum_t"
                :page-size="pageSize_t"
                layout="total, prev, pager, next, jumper"
                :total="totalNum_t"
                @current-change="handleCurrentChange_t"
                background
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import getLazyTree from '@/mixin/getLazyTree.js'
import treeBread from '@/mixin/treeBread.js'
import treeBread_t from './component/treeBread_t.js'
import LazySearchTree from '@/components/lazy-search-tree'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'AlgorithmAllocate',
  components: {
    breadcrumb,
    'lazy-search-tree': LazySearchTree
  },
  mixins: [getLazyTree, treeBread, treeBread_t],

  data() {
    return {
      isRouterAlive: true,
      maskloading: false, // 点击提交按钮后蒙版
      //用户权限判断
      PermissionManage: true,
      isSearch: false,

      //算法类型
      algorithmTypeList: [],

      topLoading: false,
      tableHeight_tb: 441,
      pageNum_tb: 1,
      pageSize_tb: 10,
      totalNum_tb: 0, // 总数量
      number_tb: 0,
      numberList_tb: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,
      tableData_tb: [],

      activeName: 'tenant',
      //  用户
      // 条件搜索
      searchForm: {
        algorithmName: ''
      },
      multipleSelection: [], //表格选中状态存放数组

      loading: false,
      dataText: '',
      ifUser: false,
      userId: '',
      unAllocateAlogList: [], //未分配的算法资源列表
      unAllocateAlogList_copy: [], //未分配的算法资源列表copy
      ifCanBatchSave: true,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      organizationId: 0,

      operation: 1, // true:添加, false:修改

      // 租户
      searchForm_t: {
        algorithmName: ''
      },
      isSearch_t: false,
      pageNum_t: 1,
      pageSize_t: 10,
      totalNum_t: 0, // 总数量
      number_t: 0,
      numberList_t: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      treeLoading_t: false,
      idArr_t: [],
      treeEmptyText_t: '',
      organizationId_t: 0,

      ifTenant: false,
      tenantId: '',
      loading_t: false,

      operation_t: 1, // true:添加, false:修改

      multipleSelection_t: [], //表格选中状态存放数组
      unAllocateAlogList_t: [], //未分配的算法资源列表
      unAllocateAlogList_copy_t: [], //未分配的算法资源列表copy
      ifCanBatchSave_t: true,

      //新增校验
      ruleForm: {
        tableData: []
      },
      ruleForm_t: {
        tableData_t: []
      },
      rules: {},
      rules_t: {},
      operateApi: 'getUserTree',
      searchApi: 'searchInUserTree',
      localApi: 'locateInUserTree',
      placeholderTitle: this.$t('public.pleaseEnterOrgOrUser'),
      operateApi_t: 'getTenantTree',
      searchApi_t: 'searchInTenantTree',
      localApi_t: 'locateInTenantTree'
    }
  },

  created() {
    this.setFormRules()
  },
  mounted() {
    //获取租户算法资源列表
    this.getTenantAlgoResource()
    this.setData()
  },
  activated() {
    
  },
  methods: {
    setData() {
      this.dataText = this.$t('public.noData')
    },
    setFormRules() {
      var regInt = /^\d+$/
      var validateMaxChannel = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('algoAllocate.maxChannelCantEmpty')))
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('algoAllocate.maxInt')))
        } else {
          callback()
        }
      }
      var validateMaxChannel_t = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('algoAllocate.maxChannelCantEmpty')))
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('algoAllocate.maxInt')))
        } else {
          callback()
        }
      }
      this.rules = {
        algorithmId: [
          { required: true, message: this.$t('algoAllocate.selectAlgo'), trigger: 'change' }
        ],
        validDateBegin: [
          { required: true, message: this.$t('algoAllocate.selectStartTime'), trigger: 'change' }
        ],
        validDateEnd: [
          { required: true, message: this.$t('algoAllocate.selectStopTime'), trigger: 'change' }
        ],
        maxChannel: [{ required: true, validator: validateMaxChannel, trigger: 'change' }]
      }
      this.rules_t = {
        algorithmId: [
          { required: true, message: this.$t('algoAllocate.selectAlgo'), trigger: 'change' }
        ],
        validDateBegin: [
          { required: true, message: this.$t('algoAllocate.selectStartTime'), trigger: 'change' }
        ],
        validDateEnd: [
          { required: true, message: this.$t('algoAllocate.selectStopTime'), trigger: 'change' }
        ],
        maxChannel: [
          {
            required: true,
            validator: validateMaxChannel_t,
            trigger: 'change'
          }
        ]
      }
    },

    //获取用户可分配的算法资源
    getUnAllocateAlogList() {
      this.$api
        .getUserAllocateAvailable({
          userId: this.userId
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.unAllocateAlogList = res.allocateAvailableList
            //复制一个未分配算法列表
            this.unAllocateAlogList_copy = JSON.parse(JSON.stringify(this.unAllocateAlogList))
          }
        })
    },
    //获取子租户可分配的算法资源
    getUnAllocateAlogList_t() {
      this.$api
        .getTenantAllocateAvailable({
          tenantId: this.tenantId
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.unAllocateAlogList_t = res.allocateAvailableList
            //复制一个未分配算法列表
            this.unAllocateAlogList_copy_t = JSON.parse(JSON.stringify(this.unAllocateAlogList_t))
          }
        })
    },

    //获取页面上方表格租户算法资源
    getTenantAlgoResource() {
      this.topLoading = true
      this.$api
        .getTenantAlgorithmResource({
          pageInfo: { pageNum: this.pageNum_tb, pageSize: this.pageSize_tb }
        })
        .then(res => {
          if (res.resultCode == 0) {
            //上方表格
            this.tableData_tb = res.algorithmList
            this.totalNum_tb = res.pageInfo.totalNum

            this.topLoading = false
          } else {
            this.topLoading = false
          }
        })
    },
    // 树加载完初始化表格
    async initData(list) {
      //初始化面包屑
      setTimeout(() => {
        this.$refs.breadcrumb.initBread(list)
      }, 100)
      this.idArr = [list[0].id]
      this.organizationId = list[0].payload.organizationId
    },
    // 点击树节点
    async treeNodeClick(obj) {
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)

      this.ruleForm.tableData = []
      if (obj.data.type == 2) {
        //用户
        this.ifUser = true
        this.userId = obj.data.payload.userId
        //获取可分配给用户的算法列表
        this.getUnAllocateAlogList()
        this.search_clear()
        this.getList()
      } else {
        this.ifUser = false
      }
      this.organizationId = obj.data.payload.organizationId
    },
    // 面包屑联动树
    tree_change(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },
    tree_change_t(data) {
      this.$refs.lazyTree_t.handleNodeClick(
        this.$refs.lazyTree_t.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree_t.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree_t.$refs.treeList.setCurrentKey(data.id)
    },
    loadNode_t(node, resolve) {
      if (node.level == 0) {
        this.getTree_t(node.level, '', resolve)
      } else {
        this.getTree_t(node.level, node.data.id, resolve)
      }
    },

    // 加载树
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getUserTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        this.initBread(res)

        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          this.organizationId = list[0].payload.organizationId
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
    },
    // 树加载完初始化表格
    async initData_t(list) {
      //初始化面包屑
      setTimeout(() => {
        this.$refs.breadcrumb_t.initBread(list)
      }, 100)
      this.idArr_t = [list[0].id]
      this.organizationId_t = list[0].payload.organizationId
    },
    // 点击树节点
    async treeNodeClick_t(obj) {
      //点击树联动面包屑
      this.$refs.breadcrumb_t.treeLinkBread(obj.data, obj.node)
      this.ruleForm_t.tableData_t = []

      if (obj.data.type == 2) {
        //租户
        this.ifTenant = true
        this.tenantId = obj.data.payload.tenantId
        //获取可分配给子租户的算法列表
        this.getUnAllocateAlogList_t()
        this.search_clear_t()
        this.getList_t()
      } else {
        this.ifTenant = false
      }
      this.organizationId = obj.data.payload.organizationId
    },
    async getTree_t(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getTenantTree(data).then(res => {
        list = res.nodeList || []
        //初始化面包屑
        this.initBread_t(res)

        this.treeLoading_t = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr_t = [list[0].id]
          this.$refs.treeList_t.setCurrentKey(list[0].id)
          this.organizationId_t = list[0].payload.organizationId
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText_t = this.$t('public.noData')
      }
    },
    // 点击树节点
    handleNodeClick(data, node, self) {
      //点击树联动面包屑
      this.treeLinkBread(data, node, self)

      this.ruleForm.tableData = []

      if (data.type == 2) {
        //用户
        this.ifUser = true
        this.userId = data.payload.userId
        //获取可分配给用户的算法列表
        this.getUnAllocateAlogList()
        this.search_clear()
        this.getList()
      } else {
        this.ifUser = false
      }
      this.organizationId = data.payload.organizationId
    },
    handleNodeClick_t(data, node, self) {
      //点击树联动面包屑
      this.treeLinkBread_t(data, node, self)

      this.ruleForm_t.tableData_t = []

      if (data.type == 2) {
        //租户
        this.ifTenant = true
        this.tenantId = data.payload.tenantId
        //获取可分配给子租户的算法列表
        this.getUnAllocateAlogList_t()
        this.search_clear_t()
        this.getList_t()
      } else {
        this.ifTenant = false
      }
      this.organizationId = data.payload.organizationId
    },

    focusName(index, row) {
      this.unAllocateAlogList = JSON.parse(JSON.stringify(this.unAllocateAlogList_copy))
      for (let i = 0; i < this.unAllocateAlogList.length; i++) {
        for (let j = 0; j < this.ruleForm.tableData.length; j++) {
          if (this.unAllocateAlogList[i].algorithmId == this.ruleForm.tableData[j].algorithmId) {
            this.unAllocateAlogList[i].canNotChoose = true
          }
        }
      }
    },
    focusName_t(index, row) {
      this.unAllocateAlogList_t = JSON.parse(JSON.stringify(this.unAllocateAlogList_copy_t))
      for (let i = 0; i < this.unAllocateAlogList_t.length; i++) {
        for (let j = 0; j < this.ruleForm_t.tableData_t.length; j++) {
          if (
            this.unAllocateAlogList_t[i].algorithmId == this.ruleForm_t.tableData_t[j].algorithmId
          ) {
            this.unAllocateAlogList_t[i].canNotChoose = true
          }
        }
      }
    },

    changeName(row) {
      row.isNameOK = false
      for (let i = 0; i < this.unAllocateAlogList.length; i++) {
        if (this.unAllocateAlogList[i].algorithmId == row.algorithmId) {
          row.algorithmName = this.unAllocateAlogList[i].algorithmName
        }
      }
    },
    changeName_t(row) {
      row.isNameOK_t = false
      for (let i = 0; i < this.unAllocateAlogList_t.length; i++) {
        if (this.unAllocateAlogList_t[i].algorithmId == row.algorithmId) {
          row.algorithmName = this.unAllocateAlogList_t[i].algorithmName
        }
      }
    },

    //点击表格(用户)
    nameDbclick(row) {
      row.isNameOK = true
      this.nameFocus()
    },
    nameFocus() {
      this.$nextTick(() => {
        this.$refs.nameInput.focus()
      })
    },
    nameinputBlur(row) {
      if (row.algorithmId == '') {
        row.isNameOK = true
      } else {
        row.isNameOK = false
      }
    },

    startTimeDbclick(row) {
      row.isStartTimeOK = true
      this.startTimeFocus()
    },
    startTimeFocus() {
      this.$nextTick(() => {
        this.$refs.startTimeInput.focus()
      })
    },
    startTimeinputBlur(row) {
      if (row.validDateBegin == '') {
        row.isStartTimeOK = true
      } else {
        row.isStartTimeOK = false
      }
    },

    endTimeDbclick(row) {
      row.isEndTimeOK = true
      this.endTimeFocus()
    },
    endTimeFocus() {
      this.$nextTick(() => {
        this.$refs.endTimeInput.focus()
      })
    },
    endTimeinputBlur(row) {
      if (row.validDateEnd == '') {
        row.isEndTimeOK = true
      } else {
        row.isEndTimeOK = false
      }
    },

    maxChannelDbclick(row) {
      row.isMaxChannelOK = true
      this.maxChannelFocus()
    },
    maxChannelFocus() {
      this.$nextTick(() => {
        this.$refs.maxChannelInput.focus()
      })
    },
    maxChannelinputBlur(row) {
      if (
        row.maxChannel == '' ||
        row.maxChannel == this.$t('algoAllocate.inputChannel') ||
        !/^\d+$/.test(row.maxChannel) ||
        row.maxChannel > 2147483647 ||
        row.maxChannel < 1
      ) {
        row.isMaxChannelOK = true
      } else {
        row.isMaxChannelOK = false
      }
    },

    //点击表格(租户)
    nameDbclick_t(row) {
      row.isNameOK_t = true
      this.nameFocus_t()
    },
    nameFocus_t() {
      this.$nextTick(() => {
        this.$refs.nameInput_t.focus()
      })
    },
    nameinputBlur_t(row) {
      if (row.algorithmId == '') {
        row.isNameOK_t = true
      } else {
        row.isNameOK_t = false
      }
    },

    startTimeDbclick_t(row) {
      row.isStartTimeOK_t = true
      this.startTimeFocus_t()
    },
    startTimeFocus_t() {
      this.$nextTick(() => {
        this.$refs.startTimeInput_t.focus()
      })
    },
    startTimeinputBlur_t(row) {
      if (row.validDateBegin == '') {
        row.isStartTimeOK_t = true
      } else {
        row.isStartTimeOK_t = false
      }
    },

    endTimeDbclick_t(row) {
      row.isEndTimeOK_t = true
      this.endTimeFocus_t()
    },
    endTimeFocus_t() {
      this.$nextTick(() => {
        this.$refs.endTimeInput_t.focus()
      })
    },
    endTimeinputBlur_t(row) {
      if (row.validDateEnd == '') {
        row.isEndTimeOK_t = true
      } else {
        row.isEndTimeOK_t = false
      }
    },

    maxChannelDbclick_t(row) {
      row.isMaxChannelOK_t = true
      this.maxChannelFocus_t()
    },
    maxChannelFocus_t() {
      this.$nextTick(() => {
        this.$refs.maxChannelInput_t.focus()
      })
    },
    maxChannelinputBlur_t(row) {
      if (
        row.maxChannel == '' ||
        row.maxChannel == this.$t('algoAllocate.inputChannel') ||
        !/^\d+$/.test(row.maxChannel) ||
        row.maxChannel > 2147483647 ||
        row.maxChannel < 1
      ) {
        row.isMaxChannelOK_t = true
      } else {
        row.isMaxChannelOK_t = false
      }
    },

    setAlgorithmType(val) {
      let name = ''
      this.algorithmTypeList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },

    //获取算法列表
    getList() {
      this.loading = true
      let uObj = {}
      uObj.algorithmName = this.searchForm.algorithmName
      uObj.userId = this.userId
      uObj.pageInfo = { pageNum: this.pageNum, pageSize: this.pageSize }
      this.$api.getUserAlgorithmList(uObj).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm.tableData = res.algorithmList
          this.totalNum = res.pageInfo.totalNum
          this.loading = false
        } else {
          this.ruleForm.tableData = []
          this.totalNum = 0
        }
        this.loading = false
      })
    },
    getList_t() {
      this.loading_t = true
      let tObj = {}
      tObj.algorithmName = this.searchForm_t.algorithmName
      tObj.tenantId = this.tenantId
      tObj.pageInfo = { pageNum: this.pageNum_t, pageSize: this.pageSize_t }
      this.$api.getTenantAlgorithmResource(tObj).then(res => {
        if (res.resultCode == 0) {
          this.ruleForm_t.tableData_t = res.algorithmList
          this.totalNum_t = res.pageInfo.totalNum
          this.loading_t = false
        } else {
          this.ruleForm_t.tableData_t = []
          this.totalNum_t = 0
        }
        this.loading_t = false
      })
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    checkbox(row) {
      if (row.row.operation) {
        return 'mycell'
      } else if (row.row.operation_t) {
        return 'mycell'
      }
    },

    //多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val.filter(item => {
        return !item.operation
      })
    },
    handleSelectionChange_t(val) {
      this.multipleSelection_t = val.filter(item => {
        return !item.operation_t
      })
    },

    // 分配
    handleAdd() {
      if (!this.ifUser) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.selectUser')
        })
        return
      }

      let addObj = {}
      addObj.algorithmId = ''
      addObj.algorithmName = ''
      addObj.validDateBegin = ''
      addObj.validDateEnd = ''
      addObj.maxChannel = ''
      addObj.isNameOK = true
      addObj.isStartTimeOK = true
      addObj.isEndTimeOK = true
      addObj.isMaxChannelOK = true

      addObj.operation = true
      this.ruleForm.tableData.push(addObj)
    },
    handleAdd_t() {
      if (!this.ifTenant) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.selectTenant')
        })
        return
      }

      let addObj = {}
      addObj.algorithmId = ''
      addObj.algorithmName = ''
      addObj.validDateBegin = ''
      addObj.validDateEnd = ''
      addObj.maxChannel = ''
      addObj.runningTasks = ''
      addObj.isNameOK_t = true
      addObj.isStartTimeOK_t = true
      addObj.isEndTimeOK_t = true
      addObj.isMaxChannelOK_t = true

      addObj.operation_t = true
      this.ruleForm_t.tableData_t.push(addObj)
    },

    search_change() {
      this.isSearch = false
    },
    search_change_t() {
      this.isSearch_t = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm.algorithmName = ''
      }
    },
    search_clear_t() {
      if (!this.isSearch_t) {
        this.searchForm_t.algorithmName = ''
      }
    },

    // 搜索
    handleFind() {
      if (!this.ifUser) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.selectUser')
        })
        return
      }
      this.pageNum = 1
      this.isSearch = true
      this.getList()
    },
    handleFind_t() {
      if (!this.ifTenant) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.selectTenant')
        })
        return
      }
      this.pageNum_t = 1
      this.isSearch_t = true
      this.getList_t()
    },

    // 修改
    async handleEdit(index, row) {
      row.isNameOK = true
      row.isStartTimeOK = true
      row.isEndTimeOK = true
      row.isMaxChannelOK = true
    },
    async handleEdit_t(index, row) {
      row.isNameOK_t = true
      row.isStartTimeOK_t = true
      row.isEndTimeOK_t = true
      row.isMaxChannelOK_t = true
    },

    //保存
    handleSave(row) {
      if (!row.algorithmId) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputAlgoNameFirst')
        })
        return
      }
      if (!row.validDateBegin) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputStartTimeFirst')
        })
        return
      }
      if (!row.validDateEnd) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputStopTimeFirst')
        })
        return
      }
      if (!row.maxChannel || row.maxChannel == this.$t('algoAllocate.inputChannel')) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputMaxChannelFirst')
        })
        return
      }
      if (!/^\d+$/.test(row.maxChannel) || row.maxChannel > 2147483647 || row.maxChannel < 1) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.maxInt')
        })
        return
      }

      if (row.operation) {
        let addObj = {}
        addObj.userId = this.userId
        addObj.algorithmResourceList = [
          {
            algorithmId: row.algorithmId,
            validDateBegin: row.validDateBegin,
            validDateEnd: row.validDateEnd,
            maxChannel: Number(row.maxChannel)
          }
        ]
        this.$api.allocateToUser(addObj).then(res => {
          if (res.resultCode == 0) {
            row.isNameOK = false
            row.isStartTimeOK = false
            row.isEndTimeOK = false
            row.isMaxChannelOK = false
            row.operation = false
            this.$message({
              type: 'success',
              message: this.$t('public.addSuccess')
            })
            this.getList()
            this.getTenantAlgoResource()
          }
        })
      } else {
        let editObj = {}
        editObj.userId = this.userId
        editObj.algorithmId = row.algorithmId
        editObj.validDateBegin = row.validDateBegin.substring(0, 10)
        editObj.validDateEnd = row.validDateEnd.substring(0, 10)
        editObj.maxChannel = Number(row.maxChannel)
        this.$api.modifyUserAllocateInfo(editObj).then(res => {
          if (res.resultCode == 0) {
            row.isNameOK = false
            row.isStartTimeOK = false
            row.isEndTimeOK = false
            row.isMaxChannelOK = false
            row.operation = false
            this.$message({
              type: 'success',
              message: this.$t('public.modifySuccess')
            })
            this.getList()
            this.getTenantAlgoResource()
          }
        })
      }
    },
    handleSave_t(row) {
      if (!row.algorithmId) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputAlgoNameFirst')
        })
        return
      }
      if (!row.validDateBegin) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputStartTimeFirst')
        })
        return
      }
      if (!row.validDateEnd) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputStopTimeFirst')
        })
        return
      }
      if (!row.maxChannel || row.maxChannel == this.$t('algoAllocate.inputChannel')) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.inputMaxChannelFirst')
        })
        return
      }
      if (!/^\d+$/.test(row.maxChannel) || row.maxChannel > 2147483647 || row.maxChannel < 1) {
        this.$message({
          type: 'warning',
          message: this.$t('algoAllocate.maxInt')
        })
        return
      }

      if (row.operation_t) {
        let addObj = {}
        addObj.tenantId = this.tenantId
        addObj.algorithmResourceList = [
          {
            algorithmId: row.algorithmId,
            validDateBegin: row.validDateBegin,
            validDateEnd: row.validDateEnd,
            maxChannel: Number(row.maxChannel)
          }
        ]
        this.$api.allocateToTenant(addObj).then(res => {
          if (res.resultCode == 0) {
            row.isNameOK_t = false
            row.isStartTimeOK_t = false
            row.isEndTimeOK_t = false
            row.isMaxChannelOK_t = false
            row.operation_t = false
            this.$message({
              type: 'success',
              message: this.$t('public.addSuccess')
            })
            this.getList_t()
            this.getTenantAlgoResource()
          }
        })
      } else {
        let editObj = {}
        editObj.tenantId = this.tenantId
        editObj.algorithmId = row.algorithmId
        editObj.validDateBegin = row.validDateBegin.substring(0, 10)
        editObj.validDateEnd = row.validDateEnd.substring(0, 10)
        editObj.maxChannel = Number(row.maxChannel)

        this.$api.modifyTenantAllocateInfo(editObj).then(res => {
          if (res.resultCode == 0) {
            row.isNameOK_t = false
            row.isStartTimeOK_t = false
            row.isEndTimeOK_t = false
            row.isMaxChannelOK_t = false
            row.operation_t = false
            this.$message({
              type: 'success',
              message: this.$t('public.modifySuccess')
            })
            this.getList_t()
            this.getTenantAlgoResource()
          }
        })
      }
    },
    //批量保存
    batchSave() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let batchObj = {}
          batchObj.userId = this.userId
          batchObj.algorithmResourceList = []
          for (let i = 0; i < this.ruleForm.tableData.length; i++) {
            if (this.ruleForm.tableData[i].operation) {
              if (
                !this.ruleForm.tableData[i].algorithmId ||
                !this.ruleForm.tableData[i].validDateBegin ||
                !this.ruleForm.tableData[i].validDateEnd ||
                !this.ruleForm.tableData[i].maxChannel
              ) {
                this.$message({
                  type: 'warning',
                  message: this.$t('algoAllocate.inputCompleteInfo')
                })
                return
              }
              batchObj.algorithmResourceList.push({
                algorithmId: this.ruleForm.tableData[i].algorithmId,
                validDateBegin: this.ruleForm.tableData[i].validDateBegin,
                validDateEnd: this.ruleForm.tableData[i].validDateEnd,
                maxChannel: Number(this.ruleForm.tableData[i].maxChannel)
              })
            }
          }

          if (!batchObj.algorithmResourceList.length) {
            this.$message({
              type: 'warning',
              message: this.$t('algoAllocate.applicationtype1')
            })
            return
          }

          this.$api.allocateToUser(batchObj).then(res => {
            if (res.resultCode == 0) {
              for (let i = 0; i < this.ruleForm.tableData.length; i++) {
                this.ruleForm.tableData[i].isNameOK = false
                this.ruleForm.tableData[i].isStartTimeOK = false
                this.ruleForm.tableData[i].isEndTimeOK = false
                this.ruleForm.tableData[i].isMaxChannelOK = false
                this.ruleForm.tableData[i].operation = false
                this.ruleForm.tableDatap[i] = this.ruleForm.tableData[i]
              }
              this.$message({
                type: 'success',
                message: this.$t('public.addSuccess')
              })
              this.getUnAllocateAlogList()
              this.getList()
              this.getTenantAlgoResource()
            }
          })
        }
      })
    },
    batchSave_t() {
      this.$refs['ruleForm_t'].validate(valid => {
        if (valid) {
          let batchObj = {}
          batchObj.tenantId = this.tenantId
          batchObj.algorithmResourceList = []
          for (let i = 0; i < this.ruleForm_t.tableData_t.length; i++) {
            if (this.ruleForm_t.tableData_t[i].operation_t) {
              if (
                !this.ruleForm_t.tableData_t[i].algorithmId ||
                !this.ruleForm_t.tableData_t[i].validDateBegin ||
                !this.ruleForm_t.tableData_t[i].validDateEnd ||
                !this.ruleForm_t.tableData_t[i].maxChannel
              ) {
                this.$message({
                  type: 'warning',
                  message: this.$t('algoAllocate.inputCompleteInfo')
                })
                return
              }
              batchObj.algorithmResourceList.push({
                algorithmId: this.ruleForm_t.tableData_t[i].algorithmId,
                validDateBegin: this.ruleForm_t.tableData_t[i].validDateBegin,
                validDateEnd: this.ruleForm_t.tableData_t[i].validDateEnd,
                maxChannel: Number(this.ruleForm_t.tableData_t[i].maxChannel)
              })
            }
          }

          if (!batchObj.algorithmResourceList.length) {
            this.$message({
              type: 'warning',
              message: this.$t('algoAllocate.applicationtype1')
            })
            return
          }

          this.$api.allocateToTenant(batchObj).then(res => {
            if (res.resultCode == 0) {
              for (let i = 0; i < this.ruleForm_t.tableData_t.length; i++) {
                this.ruleForm_t.tableData_t[i].isNameOK_t = false
                this.ruleForm_t.tableData_t[i].isStartTimeOK_t = false
                this.ruleForm_t.tableData_t[i].isEndTimeOK_t = false
                this.ruleForm_t.tableData_t[i].isMaxChannelOK_t = false
                this.ruleForm_t.tableData_t[i].operation_t = false
                this.ruleForm_t.tableData_t[i] = this.ruleForm_t.tableData_t[i]
              }
              this.$message({
                type: 'success',
                message: this.$t('public.addSuccess')
              })
              this.getUnAllocateAlogList_t()
              this.getList_t()
              this.getTenantAlgoResource()
            }
          })
        }
      })
    },

    // 取消分配
    handleDelete(index, row) {
      this.$confirm(this.$t('algoAllocate.ifCancelAlgo'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          let delObj = {}
          delObj.userId = this.userId
          delObj.algorithmIds = row.algorithmId.split(',')
          this.$api.cancelUserAllocate(delObj).then(res => {
            if (res.resultCode == 0) {
              this.getUnAllocateAlogList()
              this.getList()
              this.getTenantAlgoResource()
              this.$message({
                type: 'success',
                message: this.$t('algoAllocate.cancelSuccess')
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('algoAllocate.allocateCanceled')
          })
        })
    },
    handleDelete_t(index, row) {
      this.$confirm(this.$t('algoAllocate.ifCancelAlgo'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          let delObj = {}
          delObj.tenantId = this.tenantId
          delObj.algorithmIds = row.algorithmId.split(',')
          this.$api.cancelTenantAllocate(delObj).then(res => {
            if (res.resultCode == 0) {
              this.getUnAllocateAlogList_t()
              this.getList_t()
              this.getTenantAlgoResource()
              this.$message({
                type: 'success',
                message: this.$t('algoAllocate.cancelSuccess')
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('algoAllocate.allocateCanceled')
          })
        })
    },
    //批量删除
    batchDelete() {
      let delObj = {}
      delObj.userId = this.userId
      delObj.algorithmIds = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        delObj.algorithmIds.push(this.multipleSelection[i].algorithmId)
      }
      this.$confirm(
        this.$t('public.bulkDelPrompt1') +
          delObj.algorithmIds.length +
          this.$t('algoAllocate.cancelAlgoIf'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$api.cancelUserAllocate(delObj).then(res => {
            if (res.resultCode === 0) {
              this.getList()
              this.getTenantAlgoResource()
              this.$message({
                type: 'success',
                message: this.$t('algoAllocate.cancelSuccess')
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('algoAllocate.allocateCanceled')
          })
        })
    },
    batchDelete_t() {
      let delObj = {}
      delObj.tenantId = this.tenantId
      delObj.algorithmIds = []
      for (let i = 0; i < this.multipleSelection_t.length; i++) {
        delObj.algorithmIds.push(this.multipleSelection_t[i].algorithmId)
      }
      this.$confirm(
        this.$t('public.bulkDelPrompt1') +
          delObj.algorithmIds.length +
          this.$t('batchOperator.algorithm') +
          this.$t('public.bulkDelPrompt2'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$api.cancelTenantAllocate(delObj).then(res => {
            if (res.resultCode === 0) {
              this.getList_t()
              this.getTenantAlgoResource()
              this.$message({
                type: 'success',
                message: this.$t('algoAllocate.cancelSuccess')
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('algoAllocate.allocateCanceled')
          })
        })
    },

    //取消新增
    handleCancel(index, row) {
      this.ruleForm.tableData.splice(index, 1)
      for (let i = 0; i < this.unAllocateAlogList.length; i++) {
        if (this.unAllocateAlogList[i].algorithmId == row.algorithmId) {
          this.unAllocateAlogList[i].canNotChoose = false
        }
      }
    },
    handleCancel_t(index, row) {
      this.ruleForm_t.tableData_t.splice(index, 1)
      for (let i = 0; i < this.unAllocateAlogList_t.length; i++) {
        if (this.unAllocateAlogList_t[i].algorithmId == row.algorithmId) {
          this.unAllocateAlogList_t[i].canNotChoose = false
        }
      }
    },

    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.search_clear()
      this.getList()
    },

    numberChange_t(val) {
      this.pageSize_t = this.numberList_t[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum_t < this.pageSize_t * this.pageNum_t) {
        this.pageNum_t = 1
      }
      this.search_clear_t()
      this.getList_t()
    },

    numberChange_tb(val) {
      this.pageSize_tb = this.numberList_tb[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum_tb < this.pageSize_tb * this.pageNum_tb) {
        this.pageNum_tb = 1
      }
      this.getTenantAlgoResource()
    },

    // 分页输入跳转页数
    handleCurrentChange(val) {
      this.pageNum = val
      this.search_clear()
      this.getList()
    },

    handleCurrentChange_t(val) {
      this.pageNum_t = val
      this.search_clear_t()
      this.getList_t()
    },

    handleCurrentChange_tb(val) {
      this.pageNum_tb = val
      this.getTenantAlgoResource()
    }
  },
  computed: {
    iconStyUser(node) {
      return node => {
        if (node.type == 1 && node.payload.type == 1) {
          return 'aci-organization'
        } else if (node.type == 1 && node.payload.type == 2) {
          return 'aci-x006-folder'
        } else if (node.type == 2) {
          return 'aci-person'
        }
      }
    },
    iconStyTenant(node) {
      return node => {
        if (node.type == 1 && node.payload.type == 1) {
          return 'aci-organization'
        } else if (node.type == 1 && node.payload.type == 2) {
          return 'aci-x006-folder'
        } else if (node.type == 2) {
          return 'aci-organization'
        }
      }
    }
  }
}
</script>

<style lang="scss">
#newAlgorithmAllocate {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .tenantTableDiv {
    padding: 20px;
  }
  .el-tabs__item {
    color: #fff;
  }
  .el-tabs__content {
    display: none;
  }
  .el-tabs {
    padding-left: 16px;
    margin-left: -15px;
  }
  .el-tabs__item {
    background: none !important;
  }
  .el-tabs__item.is-active {
    color: #409eff !important;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .mycell .el-checkbox {
    display: none;
  }
  .el-select-dropdown__item.is-disabled:hover {
    background-color: #4d4d4d !important;
  }
  .userTable,
  .tenantTable_t {
    .el-form-item__content {
      margin-left: 0px !important;
    }
    .el-form-item.long-error {
      margin-bottom: 28px;
    }
  }
  .showBottom {
    margin-bottom: 0px !important;
  }
  .bottonSty {
    margin-top: 10px;
  }
}
</style>
