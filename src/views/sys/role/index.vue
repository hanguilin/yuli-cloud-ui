<template>
  <div>
    <el-form :inline="true"
             v-show="isSearchCollapse"
             ref="searchForm"
             class="query-form"
             :model="searchForm"
             @keyup.enter.native="refreshList()"
             @submit.native.prevent>
      <el-form-item prop="name">
        <el-input size="small"
                  v-model="searchForm.name"
                  placeholder="角色名（右模糊）"
                  clearable></el-input>
      </el-form-item>
      <el-form-item prop="enName">
        <el-input size="small"
                  v-model="searchForm.enName"
                  placeholder="角色英文名（右模糊）"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="refreshList()"
                   icon="el-icon-search"
                   size="small">查询</el-button>
        <el-button @click="resetSearch()"
                   icon="el-icon-delete"
                   size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-button v-if="hasPermission('sys:role:add')"
                 type="primary"
                 size="small"
                 icon="el-icon-plus"
                 @click="add()">新建</el-button>
      <el-button type="warning"
                 size="small"
                 icon="el-icon-edit-outline"
                 @click="edit()"
                 :disabled="dataListSelections.length != 1"
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
              size="medium"
              border
              @selection-change="selectionChangeHandle"
              class="table">
      <el-table-column header-align="center"
                       align="center"
                       type="selection"
                       width="50">
      </el-table-column>
      <el-table-column prop="name"
                       min-width="20%"
                       label="角色名称">
        <template slot-scope="scope">
          <el-link type="primary"
                   :underline="false"
                   @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="enName"
                       min-width="20%"
                       label="角色英文名称">
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="enabled"
                       min-width="20%"
                       label="是否可用">
        <template slot-scope="scope">
          <el-tag type="success"
                  v-if="scope.row.enabled === '0'">是</el-tag>
          <el-tag type="danger"
                  v-else-if="scope.row.enabled === '1'">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="remark"
                       min-width="20%"
                       label="备注">
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       min-width="20%"
                       label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit"
                     type="text"
                     size="mini"
                     @click="edit(scope.row.id)">修改</el-button>
          <el-button icon="el-icon-delete"
                     type="text"
                     size="mini"
                     @click="del(scope.row.id)">删除</el-button>
          <el-button icon="el-icon-setting"
                     type="text"
                     size="mini"
                     @click="showAuth(scope.row)">角色授权</el-button>
          <el-button icon="el-icon-user-solid"
                     type="text"
                     size="mini"
                     @click="showRight(scope.row)">分配用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="current"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="size"
                   :total="total"
                   background=""
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-drawer size="700px"
               :title="`用户列表，所属角色: ${this.roleUserTitle}`"
               :visible.sync="rightVisible"
               direction="rtl">
      <role-user-list :role-user-title="roleUserTitle"
                      :role-id="roleId"
                      ref="roleUserList"
                      @closeRight="closeRight"></role-user-list>
    </el-drawer>

    <auth-form :auth-form-title="roleUserTitle"
               :role-id="roleId"
               ref="authForm"></auth-form>

    <!-- 弹窗, 新增 / 修改 -->
    <role-form ref="roleForm"
               @refreshDataList="refreshList"></role-form>
  </div>
</template>

<script>
import RoleForm from './RoleForm'
import AuthForm from './AuthForm'
import RoleUserList from './RoleUserList'

export default {
  data () {
    return {
      searchForm: {
        name: '',
        enName: ''
      },
      dataList: [],
      current: 1,
      size: 10,
      total: 0,
      dataListSelections: [],
      isSearchCollapse: false,
      rightVisible: false,
      roleUserTitle: '',
      roleId: '',
      loading: false
    }
  },
  components: {
    RoleForm,
    AuthForm,
    RoleUserList
  },
  activated () { },
  mounted () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http.get('/sys/role/page', {
        params: {
          current: this.current,
          size: this.size,
          ...this.$util.filterParams(this.searchForm)
        }
      }).then(({ data }) => {
        console.log(data)
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
      this.$refs.roleForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.roleForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.roleForm.init('view', id)
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
        this.loading = true
        this.$http.delete('/sys/role/delete', { params: { ids } }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success(
              {
                dangerouslyUseHTMLString: true,
                message: data.msg
              }
            )
            this.refreshList()
          }
          this.loading = false
        })
      })
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    },
    showRight (row) {
      this.roleId = row.id
      this.rightVisible = true
      this.$nextTick(() => {
        this.$refs.roleUserList.refreshList()
        this.roleUserTitle = row.name
      })
    },
    closeRight () {
      this.rightVisible = false
    },
    showAuth (row) {
      this.roleId = row.id
      this.authVisible = true
      this.$nextTick(() => {
        this.$refs.authForm.init(row.id)
        this.roleUserTitle = row.name
      })
    }
  }
}
</script>
