<template>
  <div>
    <el-dialog :title="title+typeList[inputForm.type]"
               :close-on-click-modal="false"
               v-dialogDrag
               :visible.sync="visible">
      <el-form :model="inputForm"
               v-loading="loading"
               :class="method==='view'?'readonly':''"
               :disabled="method==='view'"
               :rules="dataRule"
               ref="inputForm"
               @keyup.enter.native="doSubmit()"
               label-width="100px"
               @submit.native.prevent>
        <el-form-item label="菜单类型"
                      prop="type">
          <el-radio-group v-model="inputForm.type">
            <el-radio v-for="(type, index) in typeList"
                      :label="index.toString()"
                      :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单"
                      prop="parentId">
          <SelectTree ref="menuParentTree"
                      :props="{
                value: 'id',             // ID字段名
                label: 'title',         // 显示名称
                children: 'children'    // 子级字段名
              }"
                      :url="`/sys/menu/tree?extId=${inputForm.id}`"
                      :value="inputForm.parent.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {inputForm.parent.id=value}" />
        </el-form-item>
        <el-form-item :label="typeList[inputForm.type] + '名称'"
                      prop="title">
          <el-input maxlength="50"
                    v-model="inputForm.title"
                    :placeholder="typeList[inputForm.type] + '名称'"></el-input>
        </el-form-item>
        <el-form-item v-if="inputForm.type === '1' || inputForm.type === '2' || inputForm.type === '3'"
                      label="链接地址"
                      prop="path">
          <el-input maxlength="1000"
                    v-model="inputForm.path"
                    placeholder="请填写路由路径或者超链接"></el-input>
        </el-form-item>
        <el-form-item v-if="inputForm.type === '1' || inputForm.type === '2' || inputForm.type === '3'"
                      label="链接类型"
                      prop="target">
          <el-select v-model="inputForm.target"
                     placeholder="如果是路由路径请留空白，http链接或者外部链接请选择iframe"
                     clearable
                     style="width: 100%;">
            <el-option v-for="item in [{label: '系统页面', value: '0'}, {label: '外链', value: '1'}]"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="inputForm.type !== '2'  && inputForm.type !== '3'"
                      label="菜单图标"
                      prop="icon">
          <el-input v-model="inputForm.icon"
                    clearable
                    @focus="selectIcon"
                    placeholder="菜单图标名称"></el-input>
        </el-form-item>
        <el-form-item v-if="inputForm.type !== '2' && inputForm.type !== '3'"
                      label="可见"
                      prop="visible">
          <el-radio-group v-model="inputForm.visible">
            <el-radio v-for="item in [{ id: '1', label: '显示', value: '0' }, { id: '2', label: '隐藏', value: '1' }]"
                      :label="item.value"
                      :key="item.id">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="inputForm.type !== '0' && inputForm.type !== '3'"
                      label="授权标识"
                      prop="permission">
          <el-input v-model="inputForm.permission"
                    maxlength="50"
                    placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
        </el-form-item>
        <el-form-item label="排序号"
                      prop="sort">
          <el-input-number v-model="inputForm.sort"
                           :step="30"
                           controls-position="right"
                           :min="0"
                           label="排序号"></el-input-number>
        </el-form-item>
        <el-form-item label="备注"
                      prop="remark">
          <el-input v-model="inputForm.remark"
                    maxlength="200"
                    type="textarea"
                    :rows="2"
                    placeholder="备注"></el-input>
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
    <SelectIcon ref="icon"
                @getValue="value => inputForm.icon = value"></SelectIcon>
  </div>
</template>

<script>
import SelectIcon from '@/components/selectIcon'
import SelectTree from '@/components/treeSelect'
export default {
  data () {
    const validateUrl = (rule, value, callback) => {
      if (this.inputForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      method: '',
      title: '新增',
      typeList: ['目录', '菜单', '按钮', '路由'],
      menuList: [],
      inputForm: {
        id: '',
        type: '1',
        title: '',
        parent: {
          id: ''
        },
        path: '',
        permission: '',
        sort: 30,
        icon: '',
        remark: '',
        target: '0',
        visible: '0'
      },
      dataRule: {
        title: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        url: [
          { validator: validateUrl, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    SelectTree,
    SelectIcon
  },
  methods: {
    init (method, obj) {
      this.method = method
      this.inputForm.id = obj.id
      if (method === 'add') {
        this.title = '新增'
      } else if (method === 'addChild') {
        this.title = '添加下级'
      } else if (method === 'edit') {
        this.title = '修改'
      } else if (method === 'view') {
        this.title = '查看'
      }

      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.parent.id = obj.parent.id
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.$http.get(`/sys/menu/info/${this.inputForm.id}`).then(({ data }) => {
            this.inputForm = this.$util.recover(this.inputForm, data.data)
          })
        }
      })
      // this.getMenuTree(obj, method)
    },
    getMenuTree (obj, method) {
      this.$http.get('/sys/menu/tree', { params: { excludeId: this.inputForm.id } }).then(({ data }) => {
        this.menuList = data.data
        this.inputForm.parent.id = ''
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.menuParentTree.clearHandle()
          this.$refs.inputForm.resetFields()
          this.inputForm.parent.id = obj.parentId
        })
      }).then(() => {
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.$http.get(`/sys/menu/info/${this.inputForm.id}`).then(({ data }) => {
            this.inputForm = this.$util.recover(this.inputForm, data.data)
          })
        }
      })
    },
    selectIcon () {
      this.$refs.icon.visible = true
    },
    // 表单提交
    doSubmit () {
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.inputForm.type === '0') {
            this.inputForm.path = ''
          }
          if (this.inputForm.type === '2' || this.inputForm.type === '3') {
            this.inputForm.visible = '0'
          }

          let request
          if (this.method === 'edit') {
            request = this.$http.put('/sys/menu/update', this.inputForm)
          } else {
            request = this.$http.post('/sys/menu/save', this.inputForm)
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
<style>
</style>
