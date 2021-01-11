import util from '@/libs/util.js'

export default {
  methods: {
    handleMenuSelect (index, indexPath) {
      if (/^https:\/\/|http:\/\//.test(index)) {
        util.open(index)
      } else {
        this.$router.push({
          path: index
        })
      }
    }
  }
}
