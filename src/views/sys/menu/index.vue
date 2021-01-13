<template>
  <div>
    <el-row>
      <el-button type="primary"
                 icon="el-icon-plus"
                 size="small"
                 @click="add()">新增</el-button>
    </el-row>
    <el-table class="table"
              v-loading="loading"
              :data="dataList"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="title"
                       header-align="center"
                       show-overflow-tooltip
                       align="center"
                       min-width="15%"
                       label="名称">
        <template slot-scope="scope">
          <el-link type="primary"
                   :underline="false"
                   @click="edit(scope.row.id)">{{scope.row.title}}</el-link>
        </template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       min-width="8%"
                       label="图标">
        <template slot-scope="scope">
          <i v-if="scope.row.icon"
             :class="scope.row.icon"
             aria-hidden="true"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type"
                       header-align="center"
                       align="center"
                       min-width="8%"
                       label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'"
                  size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === '1'"
                  size="small"
                  type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === '2'"
                  size="small"
                  type="info">按钮</el-tag>
          <el-tag v-else-if="scope.row.type === '3'"
                  size="small"
                  type="info">路由</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort"
                       header-align="center"
                       align="center"
                       min-width="15%"
                       label="排序号">
        <template slot-scope="scope">
          <el-input-number size="small"
                           v-model="scope.row.sort"
                           @change="sortChange(scope.row)"
                           :step="30"
                           :min="0"
                           :max="10000"
                           label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="visible"
                       header-align="center"
                       align="center"
                       min-width="9%"
                       show-overflow-tooltip
                       label="是否显示">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.visible"
                     v-if="scope.row.type === '0' || scope.row.type === '1'"
                     @change="statusChange(scope.row)"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-value="0"
                     inactive-value="1">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="path"
                       header-align="center"
                       align="center"
                       min-width="15%"
                       :show-overflow-tooltip="true"
                       label="菜单路由">
      </el-table-column>
      <el-table-column prop="permission"
                       header-align="center"
                       align="center"
                       min-width="15%"
                       :show-overflow-tooltip="true"
                       label="权限标识">
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       min-width="15%"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="showRight(scope.row)">数据规则
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown size="small"
                       @command="handleCommand">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{method:'view', id:scope.row.id}">
                查看
              </el-dropdown-item>
              <el-dropdown-item :command="{method:'edit', id:scope.row.id}">
                修改
              </el-dropdown-item>
              <el-dropdown-item :command="{method:'del', id:scope.row.id}">
                删除
              </el-dropdown-item>
              <el-dropdown-item :command="{method:'addChild', row:scope.row}">
                添加下级菜单
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer size="700px"
               :title="`数据规则列表，所属菜单: ${this.dataRuleTitle}`"
               :visible.sync="rightVisible"
               direction="rtl">
      <data-rule-list ref="dataRuleList"
                      @closeRight="closeRight"></data-rule-list>
    </el-drawer>

    <!-- 新增、修改、查看 -->
    <MenuForm ref="menuForm"
              @refreshDataList="refreshList"></MenuForm>
  </div>
</template>

<script>
import MenuForm from './form'
export default {
  data () {
    return {
      rightVisible: false,
      loading: false,
      dataRuleTitle: '',
      dataList: []
    }
  },
  components: {
    MenuForm
  },
  mounted () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http.get('/sys/menu/tree').then(({ data }) => {
        this.loading = false
        this.dataList = data.data
      })
    },
    // 新增下级
    addChild (row) {
      this.$refs.menuForm.init('addChild', { id: '', parent: { id: row.id } })
    },
    // 新增
    add () {
      this.$refs.menuForm.init('add', { id: '', parent: { id: '' } })
    },
    // 修改
    edit (id) {
      this.$refs.menuForm.init('edit', { id: id, parent: { id: '' } })
    },
    // 查看
    view (id) {
      this.$refs.menuForm.init('view', { id: id, parent: { id: '' } })
    },
    handleCommand (command) {
      if (command.method === 'view') {
        this.view(command.id)
      } else if (command.method === 'edit') {
        this.edit(command.id)
      } else if (command.method === 'del') {
        this.del(command.id)
      } else if (command.method === 'addChild') {
        this.addChild(command.row)
      }
    },
    // 删除
    del (id) {
      this.$confirm('确定删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http.delete(`/sys/menu/delete/?ids=${id}`).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
            this.refreshList()
          }
          this.loading = false
        })
      })
    },
    statusChange (row) {
      this.loading = true
      this.$http.put('/sys/menu/update', { id: row.id, visible: row.visible }).then(({ data }) => {
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
      this.$http.put('/sys/menu/update', { id: row.id, sort: row.sort }).then(({ data }) => {
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
    showRight (row) {
      this.rightVisible = true
      this.$nextTick(() => {
        this.$refs.dataRuleList.refreshList(row.id)
        this.dataRuleTitle = row.name
      })
    },
    closeRight () {
      this.rightVisible = false
    }
  }
}
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 12px;
  font-weight: 500;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
