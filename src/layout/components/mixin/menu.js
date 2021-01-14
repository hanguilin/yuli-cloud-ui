export default {
  methods: {
    handleMenuSelect (index, indexPath) {
      // path为空的菜单（目录）
      const reg = /^empty-menu-item-/
      if (index && !reg.test(index)) {
        this.$router.push({
          path: index
        })
      }
    }
  }
}
