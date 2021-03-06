<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card shadow="never">
          <el-tag closable
                  size="small"
                  style="margin-bottom:5px"
                  v-if="selectOfficeName"
                  :disable-transitions="false"
                  @close="handleNodeClose">
            {{selectOfficeName}}
          </el-tag>
          <el-input class="filter-input"
                    placeholder="输入关键字进行过滤"
                    size="small"
                    v-model="filterText">
          </el-input>
          <el-tree class="filter-tree"
                   :data="officeTreeData"
                   :props="{
              value: 'id',             // ID字段名
              label: 'name',         // 显示名称
              children: 'children'    // 子级字段名
            }"
                   default-expand-all
                   :filter-node-method="filterNode"
                   :expand-on-click-node="false"
                   @node-click="handleNodeClick"
                   ref="officeTree">
          </el-tree>
        </el-card>
      </el-col>

      <el-col :span="19">
        <el-card shadow="never">
          <el-form :inline="true"
                   v-show="isSearchCollapse"
                   class="query-form"
                   ref="searchForm"
                   :model="searchForm"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-form-item prop="username">
              <el-input size="small"
                        v-model="searchForm.username"
                        placeholder="账号"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="nickname">
              <el-input size="small"
                        v-model="searchForm.nickname"
                        placeholder="用户名"
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
          <el-form :inline="true"
                   v-show="isImportCollapse"
                   ref="importForm">
            <el-form-item>
              <el-button type="default"
                         @click="downloadTpl()"
                         size="small">下载模板</el-button>
            </el-form-item>
            <el-form-item prop="loginName">
              <el-upload class="upload-demo"
                         :action="`${this.$http.BASE_URL}/sys/user/import`"
                         :on-success="handleSuccess"
                         :before-upload="beforeUpload"
                         :show-file-list="true">
                <el-button size="small"
                           type="primary">点击上传</el-button>
                <div slot="tip"
                     class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
              </el-upload>
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
                          content="导入"
                          placement="top">
                <el-button type="default"
                           size="small"
                           icon="el-icon-upload2"
                           title="导入"
                           @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
              </el-tooltip>
              <el-tooltip class="item"
                          effect="dark"
                          content="导出"
                          placement="top">
                <el-button type="default"
                           size="small"
                           icon="el-icon-download"
                           title="导出"
                           @click="exportExcel()"></el-button>
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
                    @selection-change="selectionChangeHandle"
                    @sort-change="sortChangeHandle"
                    border
                    size="medium"
                    class="table"
                    height="650">
            <el-table-column type="index"
                             header-align="center"
                             align="center"
                             width="50">
            </el-table-column>
            <el-table-column type="selection"
                             header-align="center"
                             align="center"
                             width="50">
            </el-table-column>
            <el-table-column prop="avatar"
                             header-align="center"
                             align="center"
                             min-width="80"
                             label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.avatar ? scope.row.avatar : '/image/default-user.png'"
                     style="height:50px" />
              </template>
            </el-table-column>
            <el-table-column prop="username"
                             sortable="custom"
                             min-width="100"
                             show-overflow-tooltip
                             label="账号">
              <template slot-scope="scope">
                <el-link type="primary"
                         :underline="false"
                         @click="view(scope.row.id)">{{scope.row.username}}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="nickname"
                             sortable="custom"
                             min-width="100"
                             show-overflow-tooltip
                             label="用户名">
            </el-table-column>
            <el-table-column prop="office.name"
                             sortable="custom"
                             min-width="120"
                             show-overflow-tooltip
                             label="所属机构">
            </el-table-column>
            <el-table-column prop="email"
                             sortable="custom"
                             show-overflow-tooltip
                             min-width="80"
                             label="邮箱">
            </el-table-column>
            <el-table-column prop="telephone"
                             sortable="custom"
                             min-width="100"
                             show-overflow-tooltip
                             label="手机号">
            </el-table-column>
            <el-table-column prop="enabled"
                             label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.enabled === '0'"
                        size="small"
                        type="success">正常</el-tag>
                <el-tag v-else-if="scope.row.enabled === '1'"
                        size="small"
                        type="danger">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right"
                             header-align="center"
                             align="center"
                             width="200"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           icon="el-icon-view"
                           @click="view(scope.row.id)">查看</el-button>
                <el-button type="text"
                           size="small"
                           icon="el-icon-edit"
                           @click="edit(scope.row.id)">修改</el-button>
                <el-button type="text"
                           size="small"
                           icon="el-icon-delete"
                           @click="del(scope.row.id)">删除</el-button>
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
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <user-form ref="userForm"
               @refreshDataList="refreshList"></user-form>
  </div>
</template>

<script>
import UserForm from './UserForm'
export default {
  data () {
    return {
      searchForm: {
        nickname: '',
        username: '',
        office: {
          id: ''
        }
      },
      isShow: true,
      filterText: '',
      dataList: [],
      officeTreeData: [],
      current: 1,
      size: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isSearchCollapse: false,
      isImportCollapse: false,
      loading: false,
      selectOfficeName: ''
    }
  },
  components: {
    UserForm
  },
  activated () { },
  mounted () {
    this.refreshTree()
    this.refreshList()
  },
  watch: {
    filterText (val) {
      this.$refs.officeTree.filter(val)
    }
  },
  computed: {},
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http.get('/sys/user/page', {
        params: {
          current: this.current,
          size: this.size,
          orderBy: this.orderBy,
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
    refreshTree () {
      this.$http.get('/sys/office/tree').then(({ data }) => {
        if (data && data.code === 200) {
          this.officeTreeData = data.data
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
      if (obj.prop === 'office.name') {
        obj.prop = 'o.name'
      }
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
      this.$refs.userForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.userForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.userForm.init('view', id)
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
        this.$http.delete('/sys/user/delete', { params: { ids } }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success({
              dangerouslyUseHTMLString: true,
              message: data.msg
            })
            this.refreshList()
          }
          this.loading = false
        })
      })
    },
    // 导入
    importExcel () {
    },
    // 下载模板
    downloadTpl () {
      this.$utils.download('/sys/user/import/template')
    },
    handleSuccess (res, file) {
      if (res.success) {
        this.$message.success({
          dangerouslyUseHTMLString: true,
          message: res.msg
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    handleNodeClick (data) {
      this.searchForm.office.id = data.id
      this.selectOfficeName = '已选机构: ' + data.name
      this.refreshList()
    },
    handleNodeClose () {
      this.searchForm.office.id = ''
      this.selectOfficeName = ''
      this.refreshList()
    },
    beforeUpload (file) {
      const isExcel = file.name.indexOf('.xls') >= 0
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isExcel) {
        this.$message.error('只能上传excel文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
        return false
      }
      return true
    },
    exportExcel () {
      this.$utils.download('/sys/user/export')
    },
    resetSearch () {
      this.searchForm.office.id = ''
      this.selectOfficeName = ''
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-input {
  margin-bottom: 10px;
}
</style>