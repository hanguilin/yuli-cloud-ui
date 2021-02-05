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
          <el-form-item label="表名"
                        prop="tableName">
            <el-input disabled
                      v-model="inputForm.tableName"
                      placeholder="表名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包名"
                        prop="packageName">
            <el-input v-model="inputForm.packageName"
                      placeholder="包名，不建议修改"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模块名"
                        prop="moduleName">
            <el-input v-model="inputForm.moduleName"
                      placeholder="模块名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子模块名"
                        prop="subModuleName">
            <el-input v-model="inputForm.subModuleName"
                      placeholder="子模块名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者"
                        prop="author">
            <el-input v-model="inputForm.author"
                      placeholder="作者"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功能描述"
                        prop="comment">
            <el-input v-model="inputForm.comment"
                      placeholder="如保存'用户信息'成功"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表前缀"
                        prop="tablePrefix">
            <el-input v-model="inputForm.tablePrefix"
                      placeholder="生成Java类名称时，会去掉表前缀"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网关前缀"
                        prop="gateWayPrefix">
            <el-input v-model="inputForm.gateWayPrefix"
                      placeholder="使用网关时，设置的服务访问前缀"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代码版本"
                        prop="projectVersion">
            <el-input v-model="inputForm.projectVersion"
                      placeholder="代码版本，默认1.0"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button v-if="method != 'info'"
                 type="success"
                 @click="doPreview()"
                 v-noMoreClick>预览</el-button>
      <el-button v-if="method != 'info'"
                 type="primary"
                 @click="doSubmit()"
                 v-noMoreClick>确定</el-button>
    </span>
    <PreviewForm ref="previewForm" />
  </el-dialog>
</template>

<script>
import PreviewForm from './PreviewForm'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      title: '代码生成',
      method: '',
      dsName: '',
      inputForm: {
        tableName: '',
        packageName: 'cn.javayuli.cloud',
        moduleName: '',
        subModuleName: '',
        author: '',
        comment: '',
        tablePrefix: '',
        gateWayPrefix: '',
        projectVersion: '1.0'
      },
      dataRule: {
        tableName: [{ required: true, message: '表名不能为空', trigger: 'blur' }],
        packageName: [{ required: true, message: '包名不能为空', trigger: 'blur' }],
        moduleName: [{ required: true, message: '模块名不能为空', trigger: 'blur' }]
      }
    }
  },
  components: {
    PreviewForm
  },
  methods: {
    init (tableName, dsName) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.tableName = tableName
        this.dsName = dsName
        this.$http.get('/codegen/gen/recently', { params: { tableName: this.inputForm.tableName } }).then(({ data }) => {
          if (data && data.code === 200 && data.data) {
            this.inputForm = this.$util.recover(this.inputForm, data.data)
          }
        })
      })
    },
    // 表单提交
    doSubmit () {
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http({
            method: 'post',
            url: '/codegen/gen/code',
            data: { ...this.inputForm, dsName: this.dsName },
            responseType: 'blob'
          }).then((res) => {
            if (res.status === 200) {
              this.$util.download(res)
              this.visible = false
              this.$emit('refreshDataList')
            }
            this.loading = false
          })
        }
      })
    },
    doPreview () {
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http.post('/codegen/gen/preview', { ...this.inputForm, dsName: this.dsName }).then(({ data }) => {
            if (data.code === 200) {
              this.$refs.previewForm.init(data.data)
            }
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
