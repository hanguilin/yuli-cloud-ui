<template>
  <div style="padding:10px">
    <el-row>
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 @click="add()">新建</el-button>
      <el-button type="danger"
                 size="small"
                 icon="el-icon-delete"
                 @click="del()"
                 :disabled="dataListSelections.length <= 0">删除
      </el-button>
    </el-row>
    <el-table :data="dataList"
              v-loading="loading"
              border
              size="medium"
              height="500px"
              @selection-change="selectionChangeDictHandle"
              class="table">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column prop="label"
                       label="标签">
        <template slot-scope="scope">
          <el-link type="primary"
                   :underline="false"
                   @click="edit(scope.row.id)">{{scope.row.label}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="value"
                       show-overflow-tooltip
                       label="键值">
      </el-table-column>
      <el-table-column prop="sort"
                       label="排序">
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       align="center"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <dict-value-form ref="dictValueForm"
                     @refreshDataList="refreshList"></dict-value-form>
  </div>
</template>

<script>
import DictValueForm from './form'

export default {
  data () {
    return {
      dataList: [],
      dictTypeId: '',
      current: 1,
      size: -1,
      total: 0,
      dataListSelections: [],
      loading: false
    }
  },
  props: ['dictTypeTitle'],
  components: {
    DictValueForm
  },
  methods: {
    // 获取数据列表
    refreshList (dictTypeId) {
      this.loading = true
      if (dictTypeId) {
        this.dictTypeId = dictTypeId
      }
      this.$http.get('/sys/dict/value/page', {
        params: {
          current: this.current,
          size: this.size,
          typeId: this.dictTypeId
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
    sizeChangeDictHandle (val) {
      this.size = val
      this.current = 1
      this.refreshList()
    },
    // 当前页
    currentChangeDictHandle (val) {
      this.current = val
      this.refreshList()
    },
    // 多选
    selectionChangeDictHandle (val) {
      this.dataListSelections = val
    },
    // 新增
    add () {
      this.dictVisible = true
      this.$nextTick(() => {
        this.$refs.dictValueForm.init('add', { dictValueId: '', dictTypeId: this.dictTypeId })
      })
    },
    // 修改
    edit (id) {
      this.dictVisible = true
      this.$nextTick(() => {
        this.$refs.dictValueForm.init('edit', { dictValueId: id, dictTypeId: this.dictTypeId })
      })
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
        this.$http.delete('/sys/dict/value/delete', {
          params: { ids }
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
            this.refreshList()
          }
        })
      })
    },
    closeRight () {
      this.$emit('closeRight')
    }
  }
}
</script>
