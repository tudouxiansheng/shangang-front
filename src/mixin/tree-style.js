// 树的高度设置

var treeStyle = {
  methods: {
    setTreeStyle() {
      this.$nextTick(() => {
        const cuType = sessionStorage.getItem('cuType')
        const flavor = this.$store.state.flavor['flavorObj']
        const orgTree = document.getElementById('orgTree')
        const searchOrgTree = document.querySelector('.orgTreeOut #orgTree')
        if (orgTree) {
          if (cuType == 4) {
            if (flavor.complaintsHotline != '' || flavor.complaintsEmail != '') {
              orgTree.style.height = 'calc(100vh - 110px)'
              if (searchOrgTree) searchOrgTree.style.height = 'calc(100vh - 165px)'
            } else {
              orgTree.style.height = 'calc(100vh - 90px)'
              if (searchOrgTree) searchOrgTree.style.height = 'calc(100vh - 144px)'
            }
          } else if (cuType == 1) {
            if (flavor.complaintsHotline != '' || flavor.complaintsEmail != '') {
              orgTree.style.height = 'calc(100vh - 60px)'
              if (searchOrgTree) searchOrgTree.style.height = 'calc(100vh - 115px)'
            } else {
              orgTree.style.height = 'calc(100vh - 40px)'
              if (searchOrgTree) searchOrgTree.style.height = 'calc(100vh - 95px)'
            }
          }
        }
      })
    }
  }
}
export default treeStyle
