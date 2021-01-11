<template>
  <el-select :value="valueTitle" :size="size"  :disabled="disabled" :clearable="clearable" :placeholder="placeholder" @clear="clearHandle">
    <el-option :value="valueTitle"  :label="valueTitle" class="options">
      <el-tree  id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="optionData"
        :show-checkbox="showCheckbox"
        :props="props"
        highlight-current
        :node-key="props.value"    
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick">
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'el-tree-select',
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id',             // ID字段名
          label: 'label',         // 显示名称
          children: 'children'    // 子级字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    data: {
      type: Array,
      default: () => { return [] }
    },
     /* 选项列表数据(树形结构的对象数组) */
    list: {
      type: Array,
      default: () => { return null }
    },
    /* 初始值 */
    value: {
      type: String,
      default: () => { return null }
    },
        /* 初始值 */
    url: {
      type: String,
      default: () => { return null }
    },
    disabled: {
      type: Boolean,
      dafault: () => { return false }
    },
    showCheckbox: {
      type: Boolean,
      dafault: () => { return false }
    },
    /* 初始值 */
    label: {
      type: String,
      default: () => { return null }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => { return true }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => { return false }
    },
    size: {
      type: String,
      default: () => { return 'default' }
    }
  },
  data () {
    return {
      valueId: this.value,    // 初始值
      valueTitle: this.label,
      defaultExpandedKey: [],
      placeholder: '请选择',
      valueData: this.data
    }
  },
  created () {
    if (this.url !== null) {
      this.placeholder = '加载数据中...'
      let interval = setInterval(() => {
        this.placeholder = this.placeholder + '.'
      }, 500)
      this.$http({
        url: this.url,
        method: 'get'
      }).then(({data}) => {
        this.valueData = data.treeData
        this.$nextTick(() => {
          this.initHandle()
          this.placeholder = '请选择'
          clearInterval(interval)
        })
      })
    } else {
      this.valueData = this.data
    }
  },
  methods: {
    // 初始化值
    initHandle () {
      if (this.valueId && this.valueId !== '0' && this.$refs.selectTree.getNode(this.valueId)) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
        this.defaultExpandedKey = [this.valueId]      // 设置默认展开
      }
      this.initScroll()
    },
    // 初始化滚动条
    initScroll () {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        if (scrollWrap) { scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;' }
        if (scrollBar) {
          scrollBar.forEach(ele => {
          // eslint-disable-next-line no-return-assign
            return ele.style.width = 0
          })
        }
      })
    },
    // 切换选项
    handleNodeClick (node) {
      if (node['disabled']) {
        this.$message.warning('不能选择根节点（' + node[this.props.label] + '）请重新选择。')
        return
      }
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('getValue', this.valueId, this.valueTitle, node)
      this.defaultExpandedKey = []
    },
    // 清除选中
    clearHandle () {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null, null, null)
    },
    /* 清空选中样式 */
    clearSelected () {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    }
  },
  watch: {
    value () {
      this.valueId = this.value
      if (this.value === '' || this.value === null || this.value === undefined) {
        this.clearHandle()
      } else {
        this.initHandle()
      }
    },
    data () {
      this.valueData = this.data
    }
  },
  computed: {
    optionData () {
      if (this.list) {
        let cloneData = JSON.parse(JSON.stringify(this.list))      // 对源数据深度克隆
        return cloneData.filter(father => {                      // 循环所有项，并添加children属性
          let branchArr = cloneData.filter(child => father.id === child.parentId)       // 返回每一项的子级数组
            // eslint-disable-next-line no-unused-expressions
          branchArr.length > 0 ? father.children = branchArr : ''   // 给父级添加一个children属性，并赋值
          return father.parentId === '0'      // 返回第一层
        })
      } else {
        return this.valueData
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-select{
    width: 100%;
  }
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
  /* 开发禁用 */
  /* .el-tree-node:focus>.el-tree-node__content{
    background-color:transparent;
    background-color: #f5f7fa;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .el-tree-node__content:hover{
    background-color: #f5f7fa;
  } */
</style>