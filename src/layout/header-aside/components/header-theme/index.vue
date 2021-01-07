<template>
  <div>
    <el-tooltip
      effect="dark"
      content="主题"
      placement="bottom">
      <el-button
        class="d2-ml-0 d2-mr btn-text can-hover"
        type="text"
        @click="dialogVisible = true">
        <fa-icon
          name="diamond"
          style="font-size: 16px"/>
      </el-button>
    </el-tooltip>
    <el-dialog
      title="主题"
      width="600px"
      :visible.sync="dialogVisible"
      :append-to-body="true">
      <yuli-list style="margin-top: -25px;"/>
    </el-dialog>
  </div>
</template>

<script>
import themeList from './components/yuli-theme-list'
export default {
  components: {
    'yuli-list': themeList
  },
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
