<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             v-dialogDrag
             append-to-body
             :visible.sync="visible"
             width="40%">
    <el-form :model="inputForm"
             v-loading="loading"
             :rules="dataRule"
             ref="inputForm"
             @keyup.enter.native="doSubmit()"
             label-width="100px"
             @submit.native.prevent>
      <el-form-item label="表名"
                    prop="tableName">
        <el-input v-model="inputForm.tableName"
                  disabled></el-input>
      </el-form-item>
      <el-form-item label="上级菜单"
                    prop="parentId">
        <SelectTree ref="menuParentTree"
                    :props="{
                value: 'id',             // ID字段名
                label: 'title',         // 显示名称
                children: 'children'    // 子级字段名
              }"
                    url='/sys/menu/tree'
                    :value="inputForm.parentId"
                    :clearable="true"
                    :accordion="true"
                    @getValue="(value) => {inputForm.parentId=value}" />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary"
                 @click="doSubmit()"
                 v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SelectTree from '@/components/treeSelect'
export default {
  data () {
    return {
      title: '生成菜单',
      visible: false,
      loading: false,
      inputForm: {
        tableName: '',
        parentId: ''
      },
      dataRule: {
        tableName: [{ required: true, message: '表名不能为空', trigger: 'blur' }]
      }
    }
  },
  components: {
    SelectTree
  },
  methods: {
    init (tableName) {
      this.inputForm.tableName = tableName
      this.visible = true
    },
    doSubmit () {
      this.loading = true
      this.$http.post(`/codegen/gen/createMenu?tableName=${this.inputForm.tableName}&parentId=${this.inputForm.parentId}`).then(({ data }) => {
        this.loading = false
        if (data.code === 200) {
          this.$message.success('创建成功')
          this.visible = false
        }
      })
    }
  }
}
</script>

<style>
</style>