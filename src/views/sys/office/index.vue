<template>
  <div>
    <el-button-group>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
    </el-button-group>
    <el-table 
      :data="dataList"
      size="medium"
      v-loading = "loading"
      row-key="id"
      class="table"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        header-align="center"
        show-overflow-tooltip
        align="center"
        min-width="20%"
        label="机构名称">
        <template slot-scope="scope">
          <el-link  type="primary" :underline="false" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        min-width="15%"
        prop="type"
        align="center"
        label="机构类型">
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        min-width="15%"
        label="排序号">
        <template slot-scope="scope">
          <el-input-number size="small" v-model="scope.row.sort" @change="sortChange(scope.row)" :step="30"  :min="0" :max="10000" label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="enabled"
        header-align="center"
        align="center"
        min-width="10%"
        show-overflow-tooltip
        label="是否可用">
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              v-if="scope.row.type === '0' || scope.row.type === '1'"
              @change="statusChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="1">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        min-width="20%"
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        min-width="20%"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
          <el-button type="text" icon="el-icon-circle-plus-outline" size="small" @click="addChild(scope.row.id, scope.row.name)">添加下级机构</el-button>
        </template>
      </el-table-column>
    </el-table >
    <!-- 弹窗, 新增 / 修改 -->
    <OfficeForm ref="officeForm" @refreshDataList="refreshList"></OfficeForm>
  </div>
</template>

<script>
import OfficeForm from './form'
export default {
  data () {
    return {
      loading: false,
      dataList: []
    }
  },
  components: {
    OfficeForm
  },
  activated () {},
  mounted () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http.get('/sys/office/tree').then(({ data }) => {
        this.dataList = data.data
        this.loading = false
      })
    },
     // 新增下级
    addChild (id, name) {
      this.$refs.officeForm.init('addChild', {id: '', parentId: id })
    },
     // 新增
    add () {
      this.$refs.officeForm.init('add', {id: '', parentId: ''})
    },
    // 修改
    edit (id) {
      this.$refs.officeForm.init('edit', {id: id, parentId: ''})
    },
    // 查看
    view (id) {
      this.$refs.officeForm.init('view', {id: id, parentId: ''})
    },
    // 删除
    del (id) {
      this.$confirm(`确定删除该记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http.delete('/sys/office/delete', { params: { id } }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
            this.loading = false
            this.refreshList()
          }
        })
      })
    },
    statusChange (row) {
      this.loading = true
      this.$http.put('/sys/office/update', { id: row.id, enabled: row.enabled }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 1500
          })
        }
        this.loading = false
        this.refreshList()
      })
    },
    sortChange (row) {
      this.loading = true
      this.$http.put('/sys/office/update', { id: row.id, sort: row.sort }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 1500
          })
        }
        this.loading = false
        this.refreshList()
      })
    }
  }
}
</script>
