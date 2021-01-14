<template>
  <div>

    <el-form :inline="true"
             v-show="isSearchCollapse"
             class="query-form"
             ref="searchForm"
             :model="searchForm"
             @keyup.enter.native="refreshList()"
             @submit.native.prevent>
      <el-form-item prop="type">
        <el-input size="small"
                  v-model="searchForm.type"
                  placeholder="类型"
                  clearable></el-input>
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
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 @click="add()">新建</el-button>
      <el-button type="warning"
                 size="small"
                 icon="el-icon-edit-outline"
                 @click="edit()"
                 :disabled="dataListSelections.length !== 1"
                 plain>修改</el-button>
      <el-button type="danger"
                 size="small"
                 icon="el-icon-delete"
                 @click="del()"
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
              @sort-change="sortChangeHandle"
              class="table">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column prop="type"
                       sortable="custom"
                       label="类型">
        <template slot-scope="scope">
          <el-link type="primary"
                   :underline="false"
                   @click="edit(scope.row.id)">{{scope.row.type}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="remark"
                       label="描述">
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       width="250"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="view(scope.row.id)">查看
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text"
                     size="small"
                     @click="edit(scope.row.id)">修改
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text"
                     size="small"
                     @click="del(scope.row.id)">
            删除
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text"
                     size="small"
                     @click="showRight(scope.row)">
            管理键值
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

    <!-- 弹窗, 新增 / 修改 -->
    <dict-type-form ref="dictTypeForm"
                    @refreshDataList="refreshList"></dict-type-form>
    <el-drawer size="700px"
               :title="`数据字典值列表，所属类型: ${dictTypeTitle}`"
               :visible.sync="rightVisible"
               direction="rtl">
      <dict-value-list :dict-type-title="dictTypeTitle"
                       ref="dictValueList"
                       @closeRight="closeRight"></dict-value-list>
    </el-drawer>

  </div>
</template>

<script>
import DictTypeForm from './form'
import DictValueList from '../value'

export default {
  data () {
    return {
      searchForm: {
        type: ''
      },
      dataList: [],
      current: 1,
      size: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isSearchCollapse: false,
      dictTypeTitle: '',
      rightVisible: false,
      loading: false
    }
  },
  components: {
    DictTypeForm,
    DictValueList
  },
  activated () { },
  mounted () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http.get('/sys/dict/type/page', {
        params: {
          current: this.current,
          size: this.size,
          type: this.searchForm.type,
          orderBy: this.orderBy
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
    // 排序
    sortChangeHandle (obj) {
      if (obj.order === 'ascending') {
        this.orderBy = obj.prop + ' asc'
      } else if (obj.order === 'descending') {
        this.orderBy = obj.prop + ' desc'
      } else {
        this.orderBy = ''
      }
      this.refreshList()
    },
    // 新增
    add () {
      this.$refs.dictTypeForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.dictTypeForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.dictTypeForm.init('view', id)
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
        this.$http.delete('/sys/dict/type/delete', { params: { ids } }).then(({ data }) => {
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
    showRight (row) {
      this.rightVisible = true
      this.$nextTick(() => {
        this.$refs.dictValueList.refreshList(row.id)
        this.dictTypeTitle = row.type
      })
    },
    closeRight () {
      this.rightVisible = false
    }
  }
}
</script>
