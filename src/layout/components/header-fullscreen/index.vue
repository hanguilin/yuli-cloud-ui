<template>
  <el-tooltip effect="dark" :content="active ? '退出全屏' : '全屏'" placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="toggle">
      <i v-if="active" class="fa fa-compress" aria-hidden="true"></i>
      <i v-else class="fa fa-arrows-alt" aria-hidden="true" style="font-size: 16px"></i>
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
