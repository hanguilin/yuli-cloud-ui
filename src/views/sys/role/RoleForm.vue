<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    width="700px"
    :visible.sync="visible">
    <el-form :model="inputForm" status-icon :rules="dataRule" v-loading="loading" ref="inputForm" @keyup.enter.native="inputFormSubmit()"
             label-width="120px" @submit.native.prevent>
       <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item label="角色名称" prop="name" :rules="[
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ]">
            <el-input v-model="inputForm.name" placeholder="角色名称" maxlength="50"></el-input>
            <input type="hidden" v-model="inputForm.oldName"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="英文名称" prop="enName" :rules="[
            {required: true, message: '角色英文名称不能为空', trigger: 'blur'}
          ]">
            <el-input v-model="inputForm.enName" maxlength="50" placeholder="角色英文名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否系统数据" prop="system" :rules="[
            {required: true, message: '是否系统数据不能为空', trigger: 'blur'}
          ]">
            <el-select v-model="inputForm.system" placeholder="请选择"  style="width: 100%;">
              <el-option
                v-for="item in [{ id: '1', label: '是', value: '0' }, { id: '2', label: '否', value: '1' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="help-block">“是”代表此数据只有超级管理员能进行修改</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否可用" prop="enabled" :rules="[
            {required: true, message: '是否可用不能为空', trigger: 'blur'}
          ]">
            <el-select v-model="inputForm.enabled" placeholder="请选择"  style="width: 100%;">
              <el-option
                v-for="item in [{ id: '1', label: '是', value: '0' }, { id: '2', label: '否', value: '1' }]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="help-block">“是”代表此数据可用，“否”则表示此数据不可用</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="inputForm.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="inputFormSubmit()" v-noMoreClick>确定</el-button>
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
      inputForm: {
        id: '',
        name: '',
        enName: '',
        remark: '',
        system: '0',
        enabled: '0'
      },
      dataRule: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: '角色英文名称不能为空', trigger: 'blue' }
        ]
      }
    }
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = '新建角色'
      } else if (method === 'edit') {
        this.title = '修改角色'
      } else if (method === 'view') {
        this.title = '查看角色'
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.detail()
      })
    },
    detail () {
      if (this.inputForm.id) {
        this.loading = true
        this.$http.get(`/sys/role/info/${this.inputForm.id}`).then(({ data }) => {
          if (data && data.code === 200) {
            this.loading = false
            this.inputForm = this.$util.recover(this.inputForm, data.data)
          }
        })
      }
    },
    // 表单提交
    inputFormSubmit () {
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let request
          if (this.method === 'edit') {
            request = this.$http.put('/sys/role/update', this.inputForm)
          } else {
            request = this.$http.post('/sys/role/save', this.inputForm)
          }
          request.then(({ data }) => {
            if (data && data.code === 200) {
              this.$message.success(data.msg)
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
