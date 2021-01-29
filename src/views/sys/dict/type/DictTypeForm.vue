<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             v-dialogDrag
             append-to-body
             :visible.sync="visible">
    <el-form :model="inputForm"
             :rules="dataRule"
             v-loading="loading"
             :class="method==='view'?'readonly':''"
             :disabled="method==='view'"
             ref="inputForm"
             @keyup.enter.native="doSubmit()"
             label-width="80px"
             @submit.native.prevent>
      <el-form-item label="类型"
                    prop="type">
        <el-input v-model="inputForm.type"
                  maxlength="50"
                  placeholder="类型"></el-input>
      </el-form-item>
      <el-form-item label="描述"
                    prop="remark">
        <el-input type="textarea"
                  v-model="inputForm.remark"
                  maxlength="50"
                  placeholder="描述"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button v-if="method != 'view'"
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
        type: '',
        remark: ''
      },
      dataRule: {
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = '新增字典'
      } else if (method === 'edit') {
        this.title = '编辑字典'
      } else if (method === 'view') {
        this.title = '查看字典'
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.$http.get(`/sys/dict/type/info/${this.inputForm.id}`).then(({ data }) => {
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
          if (this.method === 'edit') {
            request = this.$http.put('/sys/dict/type/update', this.inputForm)
          } else {
            request = this.$http.post('/sys/dict/type/save', this.inputForm)
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
