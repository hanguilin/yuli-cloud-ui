<template>
  <el-dialog
    title="权限设置"
    :close-on-click-modal="false"
     v-dialogDrag
     width="350px"
    :visible.sync="visible">
    <el-form class="auth" :model="inputForm" status-icon v-loading="loading" ref="inputForm" @keyup.enter.native="inputFormSubmit()"
             @submit.native.prevent>
             <el-tabs type="border-card">
              <el-tab-pane>
                <span slot="label"><i class="fa fa-navicon"></i> 菜单权限</span>
                        <el-scrollbar style="height: 450px">
                          <el-tree
                            :data="menuList"
                            :props=" {
                                label: 'title',
                                children: 'children'
                              }"
                            node-key="id"
                            ref="menuListTree"
                            :default-expanded-keys="['1']"
                            :default-checked-keys="menuCheckedKeys"
                            show-checkbox>
                          </el-tree>
                        </el-scrollbar>
              </el-tab-pane>
              <el-tab-pane label="数据权限">
                 <span slot="label"><i class="fa fa-database"></i> 数据权限</span>
                    <el-scrollbar style="height: 450px">
                      <el-tree
                        :data="dataRuleList"
                        :props=" {
                          label: 'name',
                          children: 'children'
                        }"
                        node-key="id"
                        ref="dataRuleTree"
                        :default-expanded-keys="['1']"
                        :default-checked-keys="dataRuleCheckedKeys"
                        show-checkbox>
                      </el-tree>
                    </el-scrollbar>
              </el-tab-pane>
            </el-tabs>
    </el-form>
     <span slot="footer" class="dialog-footer">
      <el-button type="primary" icon="el-icon-check" size="small" plain @click="inputFormSubmit()" v-noMoreClick>保存</el-button>
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
      menuList: [],
      dataRuleList: [],
      menuCheckedKeys: [],
      dataRuleCheckedKeys: [],
      inputForm: {
        id: '',
        menuIds: '',
        dataRuleIds: ''
      }
    }
  },
  methods: {
    init (id) {
      this.inputForm.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.$refs.menuListTree.setCheckedKeys([])
        this.$refs.dataRuleTree.setCheckedKeys([])
        const p1 = this.$http.get('/sys/menu/tree')
        // const p2 = this.$http.get('/sys/dataRule/treeData')
        if (this.inputForm.id) {
          this.loading = true
          const p3 = this.$http.get(`/sys/role/info/${this.inputForm.id}`)
          Promise.all([p1, p3]).then((result) => {
            this.menuList = result[0].data.data
            // this.dataRuleList = result[1].data.treeData
            const data = result[1].data
            if (data && data.code === 200) {
              this.loading = false
              this.inputForm = this.$util.recover(this.inputForm, data.data)
              this.$refs.menuListTree.setCheckedKeys(data.data.menuIds.split(','))
              // this.$refs.dataRuleTree.setCheckedKeys(data.role.dataRuleIds.split(','))
            }
          })
        } else {
          Promise.all([p1]).then((result) => {
            this.menuList = result[0].data.treeData
            this.dataRuleList = result[1].data.treeData
            this.loading = false
          })
        }
      })
    },
    // 表单提交
    inputFormSubmit () {
      this.$refs.inputForm.validate((valid) => {
        this.inputForm.menuIds = this.$refs.menuListTree.getCheckedKeys().concat(this.$refs.menuListTree.getHalfCheckedKeys()).join(',')
        this.inputForm.dataRuleIds = this.$refs.dataRuleTree.getCheckedKeys().concat(this.$refs.dataRuleTree.getHalfCheckedKeys()).join(',')
        if (valid) {
          this.loading = true
          this.$http.put('/sys/roleMenu/update', this.inputForm).then(({ data }) => {
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

<style lang="scss" scoped>
  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
 .auth {
   margin-top: -30px;
   margin-right: -19px;
   margin-bottom: -30px;
   margin-left: -19px;
 }
  .el-scrollbar {
    height: 100%;
  }
</style>
