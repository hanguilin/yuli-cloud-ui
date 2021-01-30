<template>
  <div>
    <el-form :inline="true"
             v-show="isSearchCollapse"
             class="query-form"
             ref="searchForm"
             :model="searchForm"
             @keyup.enter.native="refreshList()"
             @submit.native.prevent>
      <el-form-item prop="jobName">
        <el-input size="small"
                  v-model="searchForm.jobName"
                  placeholder="请输入任务名"></el-input>
      </el-form-item>
      <el-form-item prop="jobGroup">
        <el-input size="small"
                  v-model="searchForm.jobGroup"
                  placeholder="请输入任务组"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="refreshList()"
                   size="small">查询</el-button>
        <el-button @click="resetSearch()"
                   size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-button v-if="hasPermission('quartz:sysQuartzJob:save')"
                 type="primary"
                 size="small"
                 icon="el-icon-plus"
                 @click="add()">新建</el-button>
      <el-button v-if="hasPermission('quartz:sysQuartzJob:update')"
                 type="warning"
                 size="small"
                 icon="el-icon-edit-outline"
                 @click="update()"
                 :disabled="dataListSelections.length !== 1"
                 plain>修改</el-button>
      <el-button v-if="hasPermission('quartz:sysQuartzJob:delete')"
                 type="danger"
                 size="small"
                 icon="el-icon-delete"
                 @click="del"
                 :disabled="dataListSelections.length <= 0"
                 plain>删除
      </el-button>
      <el-button-group class="pull-right">
        <el-tooltip class="item"
                    effect="dark"
                    content="搜索"
                    placement="top">
          <el-button type="default"
                     size="small"
                     icon="el-icon-search"
                     @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
          </el-button>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    content="刷新"
                    placement="top">
          <el-button type="default"
                     size="small"
                     icon="el-icon-refresh"
                     @click="refreshList">
          </el-button>
        </el-tooltip>
      </el-button-group>
    </el-row>
    <el-table :data="dataList"
              v-loading="loading"
              border
              size="medium"
              @selection-change="selectionChangeHandle"
              class="table">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column prop="jobName"
                       label="任务名称"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="jobGroup"
                       label="任务组名"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="targetClass"
                       label="调用目标类"
                       width="300"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="cron"
                       label="cron表达式"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enabled"
                       label="是否启用"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-value="0"
                     inactive-value="1"
                     @change="handleSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="remark"
                       label="备注">
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       width="250"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('quartz:sysQuartzJob:update')"
                     type="text"
                     size="small"
                     icon="el-icon-video-play"
                     @click="execute(scope.row.id)">执行一次
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button v-if="hasPermission('quartz:sysQuartzJob:info')"
                     type="text"
                     size="small"
                     @click="info(scope.row.id)">查看
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button v-if="hasPermission('quartz:sysQuartzJob:update')"
                     type="text"
                     size="small"
                     @click="update(scope.row.id)">修改
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button v-if="hasPermission('quartz:sysQuartzJob:delete')"
                     type="text"
                     size="small"
                     @click="del(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="current"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="size"
                   :total="total"
                   background
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 增、改、查 -->
    <SysQuartzJobForm ref="sysQuartzJobForm"
                      @refreshDataList="refreshList"></SysQuartzJobForm>

  </div>
</template>

<script>
import SysQuartzJobForm from './SysQuartzJobForm'

export default {
  data () {
    return {
      searchForm: {
        jobName: '',
        jobGroup: ''
      },
      dataList: [],
      current: 1,
      size: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isSearchCollapse: false,
      loading: false
    }
  },
  components: {
    SysQuartzJobForm
  },
  activated () { },
  mounted () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http.get('/quartz/sysQuartzJob/page', {
        params: {
          current: this.current,
          size: this.size,
          ...this.$util.filterParams(this.searchForm)
        }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.data.records
          this.total = data.data.total
          this.loading = false
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.size = val
      this.current = 1
      this.refreshList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.current = val
      this.refreshList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增
    add () {
      this.$refs.sysQuartzJobForm.init('save', '')
    },
    // 修改
    update (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.sysQuartzJobForm.init('update', id)
    },
    // 查看
    info (id) {
      this.$refs.sysQuartzJobForm.init('info', id)
    },
    // 删除
    del (id) {
      const ids = id || this.dataListSelections.map(item => {
        return item.id
      }).join(',')
      this.$confirm('确定删除所选项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/quartz/sysQuartzJob/delete', { params: { ids } }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success(data.msg)
            this.refreshList()
          }
        })
      })
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    },
    handleSwitch (row) {
      this.loading = true
      this.$http.put('/quartz/sysQuartzJob/update', { id: row.id, enabled: row.enabled }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 1500
          })
        }
        this.refreshList()
        this.loading = false
      })
    },
    execute (id) {
      this.loading = true
      this.$http.get('/quartz/sysQuartzJob/once', { params: { id } }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 1500
          })
        }
        this.loading = false
      })
    }
  }
}
</script>
