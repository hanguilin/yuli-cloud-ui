<template>
  <el-button class="d2-mr btn-text can-hover" type="text" @click="handleClick">
    <i class="fa fa-search" style="font-size: 18px" aria-hidden="true"></i>
  </el-button>
</template>

<script>
export default {
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>
