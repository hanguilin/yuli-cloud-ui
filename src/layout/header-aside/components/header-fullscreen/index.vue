<template>
  <el-tooltip effect="dark" :content="active ? '退出全屏' : '全屏'" placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="toggle">
      <fa-icon v-if="active" name="compress"/>
      <fa-icon v-else name="arrows-alt" style="font-size: 16px"/>
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('sys/fullscreen', [
      'active'
    ])
  },
  methods: {
    ...mapActions('sys/fullscreen', [
      'toggle'
    ])
  }
}
</script>
