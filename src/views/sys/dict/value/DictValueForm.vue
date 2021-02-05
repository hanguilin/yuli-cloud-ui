<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             append-to-body
             v-dialogDrag
             :visible.sync="visible">
    <el-form :model="inputForm"
             :rules="dataRule"
             v-loading="loading"
             ref="inputForm"
             @keyup.enter.native="doSubmit()"
             label-width="80px"
             @submit.native.prevent>
      <el-form-item label="标签"
                    prop="label">
        <el-input v-model="inputForm.label"
                  placeholder="标签"></el-input>
      </el-form-item>
      <el-form-item label="键值"
                    prop="value">
        <el-input v-model="inputForm.value"
                  placeholder="键值"></el-input>
      </el-form-item>
      <el-form-item label="排序号"
                    prop="sort">
        <el-input-number :step="1"
                         v-model="inputForm.sort"
                         placeholder="排序号"></el-input-number>
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
export default {
  data () {
    return {
      visible: false,
      loading: false,
      method: '',
      title: '',
      inputForm: {
        id: '',
        typeId: '',
        label: '',
        value: '',
        sort: 1
      },
      dataRule: {
        label: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '键值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (method, obj) {
      this.method = method
      if (method === 'add') {
        this.title = '添加字典值'
      } else if (method === 'edit') {
        this.title = '编辑字典值'
      } else if (method === 'view') {
        this.title = '查看字典值'
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.id = obj.dictValueId
        this.inputForm.typeId = obj.dictTypeId
        this.inputForm.sort = obj.currentMaxSort ? obj.currentMaxSort + 1 : 1
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.$http({
            url: `/sys/dict/value/info/${this.inputForm.id}`,
            method: 'get',
            loading: false
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.inputForm = this.$util.recover(this.inputForm, data.data)
              this.inputForm.id = obj.dictValueId
            }
          })
        }
      })
    },
    // 表单提交
    doSubmit () {
      if (!this.groupId) {
        this.groupWrong = '请选择分组'
      }
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let request
          if (this.method === 'edit') {
            request = this.$http.put('/sys/dict/value/update', this.inputForm)
          } else {
            request = this.$http.post('/sys/dict/value/save', this.inputForm)
          }
          request.then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: data.msg,
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
