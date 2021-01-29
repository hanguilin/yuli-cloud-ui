<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             v-dialogDrag
             append-to-body
             :visible.sync="visible">
    <el-form :model="inputForm"
             :rules="dataRule"
             v-loading="loading"
             :class="method==='info'?'readonly':''"
             :disabled="method==='info'"
             ref="inputForm"
             @keyup.enter.native="doSubmit()"
             label-width="80px"
             @submit.native.prevent>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="inputForm.name"
                      placeholder="数据源名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注"
                        prop="remark">
            <el-input v-model="inputForm.remark"
                      placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="inputForm.username"
                      placeholder="数据源用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="inputForm.password"
                      placeholder="数据源密码"
                      show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="JdbcUrl"
                        prop="url">
            <el-input v-model="inputForm.url"
                      type="textarea"
                      placeholder="数据源JdbcUrl"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button v-if="method != 'info'"
                 type="primary"
                 @click="doSubmit()"
                 v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      loading: false,
      title: '',
      method: '',
      inputForm: {
        id: '',
        name: '',
        url: '',
        username: '',
        password: '',
        createTime: '',
        createBy: '',
        updateTime: '',
        updateBy: '',
        remark: ''
      },
      dataRule: {
        name: [{ required: true, message: '数据源名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: 'JdbcUrl不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init (method, id) {
      this.method = method
      if (method === 'save') {
        this.title = '新增数据源'
      } else if (method === 'update') {
        this.title = '编辑数据源'
      } else if (method === 'info') {
        this.title = '查看数据源'
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.id = id
        // 修改或者查看
        if (method === 'update' || method === 'info') {
          this.$http.get(`/codegen/genDatasourceConf/info/${this.inputForm.id}`).then(({ data }) => {
            if (data && data.code === 200) {
              this.inputForm = this.$util.recover(this.inputForm, data.data)
            }
          })
        }
      })
    },
    // 表单提交
    doSubmit () {
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let request
          if (this.method === 'update') {
            request = this.$http.put('/codegen/genDatasourceConf/update', this.inputForm)
          } else {
            request = this.$http.post('/codegen/genDatasourceConf/save', this.inputForm)
          }
          request.then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.visible = false
              this.$emit('refreshDataList')
            }
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
