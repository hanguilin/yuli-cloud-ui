<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             v-dialogDrag
             append-to-body
             :visible.sync="visible">
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="columnName"
                       label="字段名">
      </el-table-column>
      <el-table-column prop="columnKey"
                       label="key类型">
      </el-table-column>
      <el-table-column prop="columnType"
                       label="数据类型">
      </el-table-column>
      <el-table-column prop="extra"
                       label="额外信息">
      </el-table-column>
      <el-table-column prop="columnComment"
                       label="注释">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      visible: false,
      tableData: []
    }
  },
  methods: {
    init (tableName, dsName) {
      this.title = tableName
      this.visible = true
      this.getFieldInfo(tableName, dsName)
    },
    getFieldInfo (tableName, dsName) {
      this.$http.get('/codegen/table/column', { params: { tableName, dsName } }).then(({ data }) => {
        if (data.code === 200) {
          this.tableData = data.data
        }
      })
    }
  }
}
</script>

<style>
</style>