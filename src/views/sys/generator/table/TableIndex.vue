<template>
  <div>
    <el-form :inline="true"
             v-show="isSearchCollapse"
             class="query-form"
             ref="searchForm"
             :model="searchForm"
             @keyup.enter.native="refreshList()"
             @submit.native.prevent>
      <el-form-item prop="dsName">
        <el-select size="small"
                   v-model="searchForm.dsName"
                   placeholder="请选择数据源">
          <el-option v-for="item in dsList"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
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
      <el-table-column prop="tableName"
                       label="名称">
      </el-table-column>
      <el-table-column prop="tableComment"
                       label="注释">
      </el-table-column>
      <el-table-column prop="createTime"
                       label="创建时间">
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       width="250"
                       label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('generator:genDatasourceConf:info')"
                     type="text"
                     size="small"
                     @click="genCode(scope.row.tableName)">生成代码
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button v-if="hasPermission('generator:genDatasourceConf:update')"
                     type="text"
                     size="small"
                     @click="openCreateMenuForm(scope.row.tableName)">创建菜单
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button v-if="hasPermission('generator:genDatasourceConf:update')"
                     type="text"
                     size="small"
                     @click="openfieldForm(scope.row.tableName)">字段详情
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
    <TableForm ref="tableForm"
               @refreshDataList="refreshList"></TableForm>
    <!-- 代码生成表单 -->
    <GenCodeForm ref="genCodeForm"
                 @refreshDataList="refreshList"></GenCodeForm>
    <!-- 字段表单 -->
    <FieldForm ref="fieldForm" />
    <!-- 创建菜单表单 -->
    <CreateMenuForm ref="createMenuForm" />
  </div>
</template>

<script>
import TableForm from './TableForm'
import GenCodeForm from './GenCodeForm'
import FieldForm from './FieldForm'
import CreateMenuForm from './CreateMenuForm'

export default {
  data () {
    return {
      searchForm: {
        dsName: ''
      },
      dsList: [],
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
    TableForm,
    GenCodeForm,
    FieldForm,
    CreateMenuForm
  },
  activated () { },
  mounted () {
    this.getDatasourceNameList()
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http.get('/codegen/table/page', {
        params: {
          ...this.searchForm,
          current: this.current,
          size: this.size
        }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.data.records
          this.total = data.data.total
          this.loading = false
        }
      })
    },
    // 获取数据源名称
    getDatasourceNameList () {
      this.$http.get('/codegen/genDatasourceConf/nameList').then(({ data }) => {
        if (data && data.code === 200) {
          this.dsList = data.data
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
    // 生成代码
    genCode (tableName) {
      this.$refs.genCodeForm.init(tableName, this.searchForm.dsName || 'master')
    },
    // 新增
    add () {
      this.$refs.tableForm.init('save', '')
    },
    // 修改
    update (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.tableForm.init('update', id)
    },
    // 查看
    info (id) {
      this.$refs.tableForm.init('info', id)
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
        this.$http.delete('/codegen/genDatasourceConf/delete', { params: { ids } }).then(({ data }) => {
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
    openfieldForm (tableName) {
      this.$refs.fieldForm.init(tableName, this.searchForm.dsName)
    },
    openCreateMenuForm (tableName) {
      this.$http.get('/codegen/gen/recently', { params: { tableName } }).then(({ data }) => {
        if (data && data.code === 200) {
          if (!data.data || data.data.length < 1) {
            this.$message.error('请先生成代码')
          } else {
            this.$refs.createMenuForm.init(tableName)
          }
        }
      })
    }
  }
}
</script>
