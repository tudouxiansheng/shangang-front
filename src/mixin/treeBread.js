// 懒加载树，默认展开两层
var treeBread = {
  data() {
    return {
      leftCode: '',
      leftCodeSplice: '',
      rightCode: '',
      rightCodeSplice: '',
      breadcrumbList: [], //面包屑数组
      breadcrumbList_copy: []
    }
  },
  methods: {
    //初始化面包屑
    initBread(res) {
      if (!this.breadcrumbList.length) {
        this.breadcrumbList.push({
          ...res.nodeList[0]
        })
      }
    },
    treeLinkBread(data, node, self) {
      this.breadcrumbList = []
      this.breadcrumbList.unshift(data)
      this.getAllParent(node.parent)
      this.getBreadCopy()
    },
    treeLinkBread_lane(data, node, self) {
      this.breadcrumbList = []
      this.breadcrumbList.unshift(data)
      this.getAllParent(node.parent)

      this.breadcrumbList.splice(0, 1)

      this.getBreadCopy()
    },
    getAllParent(node) {
      if (node.data) {
        this.breadcrumbList.unshift({
          ...node.data
        })
      }
      if (node.parent) {
        this.getAllParent(node.parent)
      }
    },
    getBreadCopy() {
      this.breadcrumbList_copy = JSON.parse(JSON.stringify(this.breadcrumbList))

      let breadcrumbList_noPoint = this.breadcrumbList.filter(item => {
        return item.id != '· · ·'
      })
      if (breadcrumbList_noPoint.length > 9) {
        this.rightCodeSplice = this.breadcrumbList.length - 1 - 6
        this.breadcrumbList.splice(6, this.breadcrumbList.length - 1 - 6)

        this.leftCode = 1
        this.leftCodeSplice = 0
        this.rightCode = 6

        this.breadcrumbList.splice(this.breadcrumbList.length - 1, 0, {
          label: '· · ·',
          id: '>>'
        })
      }
    },
    //点击面包屑
    clickBread(data) {
      let breadcrumbList_noPoint1 = JSON.parse(JSON.stringify(this.breadcrumbList_copy))
      let chooseI

      for (let i = 0; i < this.breadcrumbList.length; i++) {
        if (this.breadcrumbList[i].id == data.id) {
          if (i != this.breadcrumbList.length - 1) {
            this.breadcrumbList.splice(i + 1, this.breadcrumbList.length - 1 - i)
          }
        }
      }

      for (let i = 0; i < breadcrumbList_noPoint1.length; i++) {
        if (breadcrumbList_noPoint1[i].id == data.id) {
          chooseI = i
        }
      }

      if (
        (this.breadcrumbList.length < 9 || this.breadcrumbList.length == 9) &&
        this.breadcrumbList[1] &&
        this.breadcrumbList[1].id == '<<'
      ) {
        this.breadcrumbList = breadcrumbList_noPoint1.splice(0, chooseI + 1)
      }
      let expandKeys = []
      for (let j = 0; j < this.breadcrumbList.length; j++) {
        expandKeys.push(this.breadcrumbList[j].id)
      }

      try {
        this.idArr = expandKeys
        this.organizationId = data.id
      } catch (e) {}
      this.$refs.treeList.setCurrentKey(data.id)

      try {
        typeof eval(this.search_clear) === 'function' ? this.search_clear() : false
      } catch (e) {}

      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },
    //点击省略号
    clickBreadPoint(data) {
      let breadcrumbList_noPoint = JSON.parse(JSON.stringify(this.breadcrumbList_copy))

      if (data.id == '<<' && this.leftCodeSplice > 0) {
        --this.leftCodeSplice
        ++this.rightCodeSplice

        breadcrumbList_noPoint.splice(this.leftCode, this.leftCodeSplice)
        breadcrumbList_noPoint.splice(this.rightCode, this.rightCodeSplice)
        breadcrumbList_noPoint.splice(1, 0, {
          label: '· · ·',
          id: '<<'
        })
        breadcrumbList_noPoint.splice(breadcrumbList_noPoint.length - 1, 0, {
          label: '· · ·',
          id: '>>'
        })

        this.breadcrumbList = breadcrumbList_noPoint

        if (this.leftCodeSplice == 0) {
          breadcrumbList_noPoint.splice(1, 1)
          this.breadcrumbList = breadcrumbList_noPoint
        } else {
          this.outBread(1)
          this.overBread(1)
        }
      } else if (data.id == '>>' && this.rightCodeSplice > 0) {
        ++this.leftCodeSplice
        --this.rightCodeSplice

        breadcrumbList_noPoint.splice(this.leftCode, this.leftCodeSplice)
        breadcrumbList_noPoint.splice(this.rightCode, this.rightCodeSplice)
        breadcrumbList_noPoint.splice(1, 0, {
          label: '· · ·',
          id: '<<'
        })
        breadcrumbList_noPoint.splice(breadcrumbList_noPoint.length - 1, 0, {
          label: '· · ·',
          id: '>>'
        })

        this.breadcrumbList = breadcrumbList_noPoint

        if (this.rightCodeSplice == 0) {
          breadcrumbList_noPoint.splice(breadcrumbList_noPoint.length - 2, 1)
          this.breadcrumbList = breadcrumbList_noPoint
        }
      }
    },
    //变换前进后退样式
    overBread(index) {
      if (index == 1) {
        this.breadcrumbList[index].label = '<<'
        this.breadcrumbList[index].id = '<<'
      } else {
        this.breadcrumbList[index].label = '>>'
        this.breadcrumbList[index].id = '>>'
      }
    },
    outBread(index) {
      if (index == 1) {
        this.breadcrumbList[index].label = '· · ·'
        this.breadcrumbList[index].id = '<<'
      } else {
        this.breadcrumbList[index].label = '· · ·'
        this.breadcrumbList[index].id = '>>'
      }
    }
  }
}

export default treeBread
