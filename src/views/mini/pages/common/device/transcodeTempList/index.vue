<template>
  <!-- 转码模板 -->
  <div id="transcodeTempList" v-if="isRouterAlive" ref="transcodeTempList">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div class="btnMargin">
          <div>
            <el-button type="primary" @click="goBack">{{ $t('public.return') }}</el-button>
            <el-button type="primary" @click="handleAdd">
              {{ $t('transcodeTemplate.addTransTemplate') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input
              v-model="searchForm.templateName"
              class="inputMiddle"
              :placeholder="$t('transcodeTemplate.inputTemplateName')"
              @keyup.enter.native="handleFind"
              style="width: 200px"
            />

            <el-button type="primary" @click="handleFind" class="miniBtn">
              {{ $t('public.search') }}
            </el-button>
          </div>
        </div>
        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            style="margin-top: 20px"
            max-height="630"
            :row-class-name="tableRowClassName"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>

            <el-table-column
              :label="$t('transcodeTemplate.templateID')"
              min-width="70"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.templateId }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('transcodeTemplate.templateName')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.templateName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('transcodeTemplate.templateType')"
              min-width="80"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setTemplateType(row.templateType) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('transcodeTemplate.templateDescribe')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.templateDesc }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.createTime')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.createDate }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.updateTime')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.lastDate }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="90">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleEdit(row)">
                  {{ $t('public.modify') }}
                </span>
                <span
                  style="margin-right: 7px; cursor: pointer; color: #f56c6c"
                  @click="handleDelete(row)"
                >
                  {{ $t('public.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
          />
        </div>
      </el-col>
    </el-row>

    <transcodeTempList-add></transcodeTempList-add>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import transcodeTempListAdd from './component/transcodeTempList-add'

export default {
  name: 'TranscodeTemplate',
  components: {
    'transcodeTempList-add': transcodeTempListAdd
  },
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),

      // 条件搜索
      searchForm: {
        templateName: ''
      },

      // 表格数据
      tableData: [],
      dataText: '',
      loading: false,

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      operation: true, // true:新增, false:编辑
      dialogFormVisible: false, // 添加或者编辑
      dataForm: {} // 添加修改框表单
    }
  },
  mounted() {
    this.getTemplateList()
  },
  activated() {
    
  },
  methods: {
    // 获取模板列表
    getTemplateList() {
      this.dataText = ''
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchInfo: {
          templateName: this.searchForm.templateName,
          transcodeType: 1
        }
      }

      this.$api.queryTemplateList(obj).then(res => {
        if (res.templateList && res.templateList.length) {
          this.tableData = res.templateList
          this.totalNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
          })
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },
    setTemplateType(val) {
      if (val == 0) {
        return this.$t('transcodeTemplate.allTransCode')
      } else if (val == 1) {
        return this.$t('transcodeTemplate.cameraTransCode')
      } else if (val == 2) {
        return this.$t('transcodeTemplate.liveAddreTransCode')
      } else if (val == 3) {
        return this.$t('transcodeTemplate.oggLineFileTransCode')
      } else {
        return ''
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 返回镜头转码转码
    goBack() {
      this.$router.push({
        path: '/device/transcode'
      })
    },

    // 添加
    handleAdd() {
      this.dataForm = {
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
      this.operation = true
      this.dialogFormVisible = true
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getTemplateList()
    },

    //删除
    handleDelete(row) {
      this.$confirm(this.$t('transcodeTemplate.foreverDelTemplate'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api.delTemplate({ templateId: row.templateId }).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.bulkDelSuccess')
              })
              this.getTemplateList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    // 编辑
    async handleEdit(row) {
      let obj = { templateId: row.templateId }
      const res = await this.$api.getTranscodeTemplateById(obj)
      if (res.resultCode != 0) return
      this.dataForm.templateId = row.templateId
      this.dataForm.templateName = res.transcodeTemplateInfo.templateName
      this.dataForm.templateDesc = res.transcodeTemplateInfo.templateDesc

      res.transcodeTemplateInfo.templateParams.forEach(item => {
        if (item.name == 'src') {
          if (item.value.substring(2, 6) == '0000') {
            this.dataForm.src = '0'
          } else if (item.value.substring(2, 6) == '0001') {
            this.dataForm.src = '1'
          } else if (item.value.substring(2, 6) == '0002') {
            this.dataForm.src = '2'
          } else if (item.value.substring(2, 6) == '0003') {
            this.dataForm.src = '3'
          } else if (item.value.substring(2, 6) == '0004') {
            this.dataForm.src = '4'
          } else if (item.value.substring(2, 6) == '0005') {
            this.dataForm.src = '5'
          } else if (item.value.substring(2, 6) == '0006') {
            this.dataForm.src = '6'
          } else if (item.value.substring(2, 6) == '0007') {
            this.dataForm.src = '7'
          } else if (item.value.substring(2, 6) == '0008') {
            this.dataForm.src = '8'
          } else if (item.value.substring(2, 6) == '0009') {
            this.dataForm.src = '9'
          } else if (item.value.substring(2, 6) == '0010') {
            this.dataForm.src = '10'
          } else if (item.value.substring(2, 6) == '0011') {
            this.dataForm.src = '11'
          } else if (item.value.substring(2, 6) == '0012') {
            this.dataForm.src = '12'
          } else if (item.value.substring(2, 6) == '0013') {
            this.dataForm.src = '13'
          } else if (item.value.substring(2, 6) == '0014') {
            this.dataForm.src = '14'
          } else if (item.value.substring(2, 6) == '0015') {
            this.dataForm.src = '15'
          } else if (item.value.substring(2, 6) == '0016') {
            this.dataForm.src = '16'
          } else if (item.value.substring(2, 6) == '0017') {
            this.dataForm.src = '17'
          } else if (item.value.substring(2, 6) == '0018') {
            this.dataForm.src = '18'
          } else if (item.value.substring(2, 6) == '0019') {
            this.dataForm.src = '19'
          } else if (item.value.substring(2, 6) == '0020') {
            this.dataForm.src = '20'
          } else if (item.value.substring(2, 6) == '0021') {
            this.dataForm.src = '21'
          } else if (item.value.substring(2, 6) == '0022') {
            this.dataForm.src = '22'
          }
        }

        if (item.name == 'vcodec') {
          this.dataForm.vcodec = item.value
        }

        if (item.name == 'r') {
          this.dataForm.r = item.value
        }

        if (item.name == 'b_strategy') {
          this.dataForm.bstrategy = item.value
        }

        if (item.name == 'refs') {
          this.dataForm.refs = item.value
        }

        if (item.name == 'preset:v') {
          this.dataForm.presetv = item.value
        }

        if (item.name == 'profile:v') {
          this.dataForm.profilev = item.value
        }

        if (item.name == 'sc_threshold') {
          this.dataForm.scthreshold = item.value
        }

        if (item.name == 'g') {
          this.dataForm.g = item.value
        }

        if (item.name == 's') {
          this.dataForm.s = item.value
        }

        if (item.name == 'level') {
          this.dataForm.level = item.value
        }

        if (item.name == 'keyint_min') {
          this.dataForm.keyintmin = item.value
        }

        if (item.name == 'threads') {
          this.dataForm.threads = item.value
        }

        if (item.name == 'minrate') {
          this.dataForm.minrate = item.value
        }

        if (item.name == 'maxrate') {
          this.dataForm.maxrate = item.value
        }

        if (item.name == 'vf') {
          this.dataForm.vf = item.value
        }

        if (item.name == 'an') {
          this.dataForm.an = Boolean(item.value)
        } else {
          this.dataForm.an = true
        }

        if (item.name == 'acodec') {
          this.dataForm.acodec = item.value
        }

        if (item.name == 'ac') {
          this.dataForm.ac = item.value
        }

        if (item.name == 'b:a') {
          this.dataForm.ba = item.value
        }

        if (item.name == 'ar') {
          this.dataForm.ar = item.value
        }

        if (item.name == 'disposition:a') {
          this.dataForm.dispositiona = item.value
        }
      })

      this.operation = false
      this.dialogFormVisible = true
    },
    // 分页
    getListByPage() {
      this.getTemplateList()
    }
  }
}
</script>

<style lang="scss">
#transcodeTempList {
  width: 100%;
  height: 100%;
  .btnMargin {
    display: flex;
    justify-content: space-between;
  }
}
</style>
