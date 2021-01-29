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
             label-width="100px"
             @submit.native.prevent>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务名称"
                        prop="jobName">
            <el-input v-model="inputForm.jobName"
                      placeholder="任务名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务组名"
                        prop="jobGroup">
            <el-input v-model="inputForm.jobGroup"
                      placeholder="任务组名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调用目标类"
                        prop="targetClass">
            <el-input v-model="inputForm.targetClass"
                      placeholder="调用目标类"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="cron表达式"
                        prop="cron">
            <el-input v-model="inputForm.cron"
                      placeholder="cron表达式"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用"
                        prop="enabled">
            <el-select v-model="inputForm.enabled"
                       placeholder="请选择是否启用">
              <el-option v-for="item in $dict.getDictValueList('sys_flag')"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注"
                        prop="remark">
            <el-input v-model="inputForm.remark"
                      placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                v-if="method === 'table'">
          <el-form-item label="创建时间"
                        prop="createTime">
            <el-input v-model="inputForm.createTime"
                      placeholder="创建时间"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                v-if="method === 'table'">
          <el-form-item label="创建人"
                        prop="createBy">
            <el-input v-model="inputForm.createBy"
                      placeholder="创建人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                v-if="method === 'table'">
          <el-form-item label="更新时间"
                        prop="updateTime">
            <el-input v-model="inputForm.updateTime"
                      placeholder="更新时间"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                v-if="method === 'table'">
          <el-form-item label="更新人"
                        prop="updateBy">
            <el-input v-model="inputForm.updateBy"
                      placeholder="更新人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button v-if="method != 'table'"
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
        jobName: '',
        jobGroup: '默认组',
        targetClass: '',
        cron: '',
        enabled: '',
        createTime: '',
        createBy: '',
        updateTime: '',
        updateBy: '',
        remark: ''
      },
      dataRule: {
        jobName: [{ required: true, message: "任务名称不能为空", trigger: 'blur' }],
        jobGroup: [{ required: true, message: "任务组不能为空", trigger: 'blur' }],
        targetClass: [{ required: true, message: "目标类不能为空", trigger: 'blur' }],
        cron: [{ required: true, message: "触发周期不能为空", trigger: 'blur' }],
        enabled: [{ required: true, message: "是否启用不能为空", trigger: 'blur' }]
      }
    }
  },
  methods: {
    init (method, id) {
      this.method = method
      if (method === 'save') {
        this.title = '新增定时任务'
      } else if (method === 'update') {
        this.title = '编辑定时任务'
      } else if (method === 'info') {
        this.title = '查看定时任务'
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.id = id
        // 修改或者查看
        if (method === 'update' || method === 'info') {
          this.$http.get(`/quartz/sysQuartzJob/info/${this.inputForm.id}`).then(({ data }) => {
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
            request = this.$http.put('/quartz/sysQuartzJob/update', this.inputForm)
          } else {
            request = this.$http.post('/quartz/sysQuartzJob/save', this.inputForm)
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
