<template>
  <el-dialog :title="title"
             :close-on-click-modal="false"
             v-dialogDrag
             append-to-body
             :visible.sync="visible">
    <el-tabs v-model="activeName"
             v-highlight
             type="card"
             @tab-click="handleClick">
      <el-tab-pane :label="item"
                   :name="'name_' + index"
                   v-for="(item, index) in template"
                   :key="index">
        <pre><code :class="item.endsWith('vue') ? 'html' : 'java'">{{result[item]}}</code></pre>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'name_0',
      // 模板写死，方便排序
      template: ['Controller.java', 'Service.java', 'ServiceImpl.java', 'Mapper.java', 'Entity.java', 'Index.vue', 'Form.vue'],
      visible: false,
      title: '代码模板',
      result: {}
    }
  },
  methods: {
    init (result) {
      this.visible = true
      this.result = result
    },
    handleClick () { }
  }
}
</script>

<style>
</style>