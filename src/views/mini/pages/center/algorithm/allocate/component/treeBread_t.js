// 面包屑,因为分配页面有两个树,所以引入两个面包屑,以免两个面包屑的数据和页面效果互相影响
var treeBread_t = {
  data() {
    return {
      leftCode_t: '',
      leftCodeSplice_t: '',
      rightCode_t: '',
      rightCodeSplice_t: '',
      breadcrumbList_t: [], //面包屑数组
      breadcrumbList_copy: []
    }
  },
  methods: {
    //初始化面包屑
    initBread_t(res) {
      if (!this.breadcrumbList_t.length) {
        this.breadcrumbList_t.push({
          ...res.nodeList[0]
        })
      }
    },
    treeLinkBread_t(data, node, self) {
      this.breadcrumbList_t = []
      this.breadcrumbList_t.unshift(data)
      this.getAllParent_t(node.parent)
      this.getBreadCopy_t()
    },
    getAllParent_t(node) {
      if (node.data) {
        this.breadcrumbList_t.unshift({
          ...node.data
        })
      }
      if (node.parent) {
        this.getAllParent_t(node.parent)
      }
    },
    getBreadCopy_t() {
      this.breadcrumbList_copy = JSON.parse(JSON.stringify(this.breadcrumbList_t))

      let breadcrumbList_noPoint = this.breadcrumbList_t.filter(item => {
        return item.id != '· · ·'
      })
      if (breadcrumbList_noPoint.length > 9) {
        this.rightCodeSplice_t = this.breadcrumbList_t.length - 1 - 6
        this.breadcrumbList_t.splice(6, this.breadcrumbList_t.length - 1 - 6)

        this.leftCode_t = 1
        this.leftCodeSplice_t = 0
        this.rightCode_t = 6

        this.breadcrumbList_t.splice(this.breadcrumbList_t.length - 1, 0, {
          label: '· · ·',
          id: '>>'
        })
      }
    },
    //点击面包屑
    clickBread_t(data) {
      let breadcrumbList_noPoint1 = JSON.parse(JSON.stringify(this.breadcrumbList_copy))
      let chooseI

      for (let i = 0; i < this.breadcrumbList_t.length; i++) {
        if (this.breadcrumbList_t[i].id == data.id) {
          if (i != this.breadcrumbList_t.length - 1) {
            this.breadcrumbList_t.splice(i + 1, this.breadcrumbList_t.length - 1 - i)
          }
        }
      }

      for (let i = 0; i < breadcrumbList_noPoint1.length; i++) {
        if (breadcrumbList_noPoint1[i].id == data.id) {
          chooseI = i
        }
      }

      if (
        (this.breadcrumbList_t.length < 9 || this.breadcrumbList_t.length == 9) &&
        this.breadcrumbList_t[1] &&
        this.breadcrumbList_t[1].id == '<<'
      ) {
        this.breadcrumbList_t = breadcrumbList_noPoint1.splice(0, chooseI + 1)
      }
      let expandKeys = []
      for (let j = 0; j < this.breadcrumbList_t.length; j++) {
        expandKeys.push(this.breadcrumbList_t[j].id)
      }

      try {
        this.idArr_t = expandKeys
        this.organizationId_t = data.id
      } catch (e) {}
      this.$refs.treeList_t.setCurrentKey(data.id)

      try {
        typeof eval(this.search_clear) === 'function' ? this.search_clear_t() : false
      } catch (e) {}

      this.handleNodeClick_t(
        this.$refs.treeList_t.getNode(data.id).data,
        this.$refs.treeList_t.getNode(data.id)
      )
      this.$refs.treeList_t.setCurrentKey(data.id)
    },
    //点击省略号
    clickBreadPoint_t(data) {
      let breadcrumbList_noPoint = JSON.parse(JSON.stringify(this.breadcrumbList_copy))

      if (data.id == '<<' && this.leftCodeSplice_t > 0) {
        --this.leftCodeSplice_t
        ++this.rightCodeSplice_t

        breadcrumbList_noPoint.splice(this.leftCode_t, this.leftCodeSplice_t)
        breadcrumbList_noPoint.splice(this.rightCode_t, this.rightCodeSplice_t)
        breadcrumbList_noPoint.splice(1, 0, {
          label: '· · ·',
          id: '<<'
        })
        breadcrumbList_noPoint.splice(breadcrumbList_noPoint.length - 1, 0, {
          label: '· · ·',
          id: '>>'
        })

        this.breadcrumbList_t = breadcrumbList_noPoint

        if (this.leftCodeSplice_t == 0) {
          breadcrumbList_noPoint.splice(1, 1)
          this.breadcrumbList_t = breadcrumbList_noPoint
        } else {
          this.outBread_t(1)
          this.overBread_t(1)
        }
      } else if (data.id == '>>' && this.rightCodeSplice_t > 0) {
        ++this.leftCodeSplice_t
        --this.rightCodeSplice_t

        breadcrumbList_noPoint.splice(this.leftCode_t, this.leftCodeSplice_t)
        breadcrumbList_noPoint.splice(this.rightCode_t, this.rightCodeSplice_t)
        breadcrumbList_noPoint.splice(1, 0, {
          label: '· · ·',
          id: '<<'
        })
        breadcrumbList_noPoint.splice(breadcrumbList_noPoint.length - 1, 0, {
          label: '· · ·',
          id: '>>'
        })

        this.breadcrumbList_t = breadcrumbList_noPoint

        if (this.rightCodeSplice_t == 0) {
          breadcrumbList_noPoint.splice(breadcrumbList_noPoint.length - 2, 1)
          this.breadcrumbList_t = breadcrumbList_noPoint
        }
      }
    },
    //变换前进后退样式
    overBread_t(index) {
      if (index == 1) {
        this.breadcrumbList_t[index].label = '<<'
        this.breadcrumbList_t[index].id = '<<'
      } else {
        this.breadcrumbList_t[index].label = '>>'
        this.breadcrumbList_t[index].id = '>>'
      }
    },
    outBread_t(index) {
      if (index == 1) {
        this.breadcrumbList_t[index].label = '· · ·'
        this.breadcrumbList_t[index].id = '<<'
      } else {
        this.breadcrumbList_t[index].label = '· · ·'
        this.breadcrumbList_t[index].id = '>>'
      }
    }
  }
}

export default treeBread_t
