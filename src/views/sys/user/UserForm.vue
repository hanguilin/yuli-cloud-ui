<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             v-dialogDrag
             :visible.sync="visible">
    <el-form :model="inputForm"
             :rules="dataRule"
             ref="inputForm"
             @keyup.enter.native="doSubmit()"
             label-width="120px"
             v-loading="loading"
             :class="method==='view'?'readonly':''"
             :disabled="method==='view'"
             @submit.native.prevent>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="登录名"
                          prop="username"
                          :rules="usernameValidator ? dataRule.username : [{required: true, message: '登录名不能为空'}]">
              <el-input v-model="inputForm.username"
                        maxlength="20"
                        placeholder="请填写账号"></el-input>
            </el-form-item>
            <el-form-item label="用户名"
                          prop="nickname">
              <el-input v-model="inputForm.nickname"
                        placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="avatar"
                          label="头像">
              <el-upload class="avatar-uploader"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=avatar`"
                         :headers="{token: $util.cookies.get('token')}"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeAvatarUpload"
                         :show-file-list="false">
                <img v-if="inputForm.avatar"
                     :src="inputForm.avatar"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码:"
                        prop="password"
                        :rules="inputForm.id?[]:[{required: true, message:'密码不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.password"
                      maxlength="18"
                      placeholder="若不修改，请留空"
                      show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码"
                        prop="confirmPassword"
                        :rules="inputForm.id ? [] : dataRule.confirmPassword">
            <el-input v-model="inputForm.confirmPassword"
                      maxlength="18"
                      placeholder=""
                      show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机"
                        prop="telephone"
                        :rules="[{validator:validator.isMobile, trigger:'blur'}]">
            <el-input v-model="inputForm.telephone"
                      maxlength="50"
                      placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱"
                        prop="email"
                        :rules="[{type:'email', message:'请输入正确的邮箱地址', trigger:'blur'}]">
            <el-input v-model="inputForm.email"
                      maxlength="50"
                      placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="office.id"
                        label="机构">
            <SelectTree ref="officeTree"
                        :props="{
                   value: 'id',             // ID字段名
                   label: 'name',         // 显示名称
                   children: 'children'    // 子级字段名
                 }"
                        :url="`/sys/office/tree`"
                        :value="inputForm.office.id"
                        :clearable="true"
                        :accordion="true"
                        @getValue="(value, label) => {inputForm.office.id=value, inputForm.office.name=label}" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否允许登录"
                        prop="enabled">
            <el-radio-group v-model="inputForm.enabled">
              <el-radio v-for="item in [{id: '1', label: '是', value: '0'}, {id: '2', label: '否', value: '1'}]"
                        :label="item.value"
                        :key="item.id">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色"
                        prop="roleIdList">
            <el-checkbox-group v-model="inputForm.roleIdList">
              <el-checkbox v-for="role in roleList"
                           :label="role.id"
                           :key="role.id">{{role.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注"
                        prop="remark">
            <el-input type="textarea"
                      v-model="inputForm.remarks"
                      maxlength="200"
                      placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary"
                 v-if="method != 'view'"
                 @click="doSubmit()"
                 v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SelectTree from '@/components/treeSelect'
export default {
  data () {
    var comparePass = (rule, value, callback) => {
      if (value !== this.inputForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('登录名不能为空'))
      } else {
        this.$http.get('/sys/user/exist', { params: { id: this.inputForm.id, username: value } }).then(({ data }) => {
          if (data && data.code === 200) {
            if (data.data) {
              callback(new Error('登录名已存在'))
            } else {
              callback()
            }
          } else {
            callback(new Error('接口出错'))
          }
        })
      }
    }
    return {
      visible: false,
      loading: false,
      title: '',
      method: '',
      roleList: [],
      inputForm: {
        id: '',
        office: {
          id: '',
          name: ''
        },
        roleIdList: [],
        username: '', // 登录名
        oldUsername: '', //username备份，修改时比较
        nickname: '', // 姓名
        email: '', // 邮箱
        telephone: '', // 电话
        loginIp: '', // 最后登陆IP
        loginDate: '', // 最后登陆日期
        enabled: '0', // 是否允许登陆
        avatar: '', // 头像
        qrCode: '', // 二维码
        oldLoginName: '', // 原登录名
        password: '', // 新密码
        confirmPassword: '',
        sign: '', // 签名
        oldLoginIp: '', // 上次登陆IP
        oldLoginDate: '', // 上次登陆日期,
        remark: '' // 备注
      },
      dataRule: {
        'office.id': [{ required: true, message: '机构不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        username: [{ validator: validateUsername, required: true, trigger: 'blur' }],
        roleIdList: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: comparePass, trigger: 'blur' }]
      }
    }
  },
  components: {
    SelectTree
  },
  computed: {
    usernameValidator () {
      return this.inputForm.oldUsername !== this.inputForm.username
    }
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = '新建用户'
        this.inputForm.office.name = ''
      } else if (method === 'edit') {
        this.title = '修改用户'
      } else if (method === 'view') {
        this.title = '查看用户'
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.oldUsername = ''
        this.$http.get('/sys/role/page', {
          params: {
            current: 1,
            size: -1
          }
        }).then(({ data }) => {
          this.roleList = data.data.records
        })
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.$http.get(`/sys/user/info/${this.inputForm.id}`).then(({ data }) => {
            this.inputForm = this.$util.recover(this.inputForm, data.data)
            this.inputForm.oldUsername = this.inputForm.username
          })
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.inputForm.avatar = res.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type.indexOf('image/') >= 0
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像只能是图片格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    // 表单提交
    doSubmit () {
      this.$refs.inputForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let request
          if (this.method === 'edit') {
            request = this.$http({
              url: '/sys/user/update',
              method: 'put',
              headers: { arrayFormat: 'repeat' },
              data: this.inputForm
            })
          } else {
            request = this.$http({
              url: '/sys/user/save',
              method: 'post',
              headers: { arrayFormat: 'repeat' },
              data: this.inputForm
            })
          }
          request.then(({ data }) => {
            if (data && data.code === 200) {
              this.visible = false
              this.$message.success(data.msg)
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
<style scoped="scoped">
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px !important;
  text-align: center;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
