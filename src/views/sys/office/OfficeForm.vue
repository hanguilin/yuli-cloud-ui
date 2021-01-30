<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             v-dialogDrag
             :visible.sync="visible">
    <el-form :model="inputForm"
             :rules="dataRule"
             ref="inputForm"
             @keyup.enter.native="doSubmit()"
             label-width="80px"
             v-loading="loading"
             :class="method==='view'?'readonly':''"
             :disabled="method==='view'"
             @submit.native.prevent>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="上级机构"
                        prop="parentId">
            <SelectTree ref="officeTree"
                        :props="{
                value: 'id',             // ID字段名
                label: 'name',         // 显示名称
                children: 'children'    // 子级字段名
              }"
                        :url="`/sys/office/tree?extId=${inputForm.id}`"
                        :value="inputForm.parentId"
                        :clearable="true"
                        :accordion="true"
                        v-if="visible"
                        @getValue="(value) => {inputForm.parentId=value}" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构名称"
                        prop="name">
            <el-input v-model="inputForm.name"
                      placeholder="机构名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构类型"
                        prop="type">
            <el-select v-model="inputForm.type"
                       placeholder="请选择"
                       style="width: 100%;">
              <el-option v-for="item in $dict.getDictValueList('sys_office_type')"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可用"
                        prop="enabled">
            <el-select v-model="inputForm.enabled"
                       placeholder="请选择"
                       style="width: 100%;">
              <el-option v-for="item in $dict.getDictValueList('sys_flag')"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号"
                        prop="sort">
            <el-input-number style="width:100%"
                             :step="30"
                             v-model="inputForm.sort"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

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
import SelectTree from '@/components/treeSelect'
export default {
  data () {
    return {
      title: '',
      method: '',
      officeParentTreeData: [],
      areaTreeData: [],
      visible: false,
      loading: false,
      inputForm: {
        id: '0',
        name: '',
        parentId: '',
        sort: '30',
        code: '', // 机构编码
        type: '', // 机构类型（1：公司；2：部门；3：团队）
        address: '', // 联系地址
        zipCode: '', // 邮政编码
        master: '', // 负责人
        phone: '', // 电话
        fax: '', // 传真
        email: '', // 邮箱
        enabled: '', // 是否可用
        primaryPerson: {
          id: '',
          name: ''
        }, // 主负责人
        deputyPerson: {
          id: '',
          name: ''
        }// 副负责人
      },
      dataRule: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '机构类型不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '是否可用不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    SelectTree
  },
  methods: {
    init (method, obj) {
      this.inputForm.id = obj.id
      this.method = method
      if (method === 'add') {
        this.title = '新增机构'
      } else if (method === 'addChild') {
        this.title = '添加下级机构'
      } else if (method === 'edit') {
        this.title = '修改机构'
      } else if (method === 'view') {
        this.title = '查看机构'
      }

      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.parentId = obj.parentId
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.getInfo()
        }
      })
    },
    getInfo () {
      this.loading = true
      this.$http.get(`/sys/office/info/${this.inputForm.id}`).then(({ data }) => {
        this.inputForm = this.$util.recover(this.inputForm, data.data)
        this.loading = false
      })
    },
    // 表单提交
    doSubmit () {
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let request
          if (this.method === 'edit') {
            request = this.$http.put('/sys/office/update', this.inputForm)
          } else {
            request = this.$http.post('/sys/office/save', this.inputForm)
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
