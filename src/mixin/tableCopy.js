var tableCopy = {
  data() {
    return {
      menuVisible: false, //复制粘贴
      copyText: '',
    }
  },
  methods: {
    // 表格单元格右击复制粘贴
    rowContextmenu(row, column, event) {
      if (event.path[0].innerText == '') return
      this.copyText = event.path[0].innerText
      this.menuVisible = false
      this.menuVisible = true
      // 阻止右键默认行为
      event.preventDefault()
      this.$nextTick(() => {
        this.init(event)
      })
    },
    init(event) {
      // console.log(event)
      // var el_table = document.getElementsByClassName("el-table")[0];
      // var contextmenu = document.createElement("div");
      // contextmenu.className = "contextmenu";
      // contextmenu.style.cssText += "position: absolute;background-color: #ecf5ff;width: 50px;font-size: 12px;color: #409eff;border-radius: 4px;z-index: 1000;line-height: 30px;text-align: center;";
      // el_table.appendChild(contextmenu);
      // console.log(contextmenu)
      let menu = document.querySelector('#contextmenu')
      let dev_table = document.querySelector('.dev_table')
      let leftNav = document.querySelector('.leftNav')
      let main_header = document.querySelector('.main-header')
      menu.style.top =
        event.clientY -
        dev_table.offsetTop -
        main_header.clientHeight +
        5 +
        'px'
      menu.style.left =
        event.clientX - dev_table.offsetLeft - leftNav.clientWidth + 5 + 'px'
      document.addEventListener('click', this.foo)
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      this.copyText = ''
      document.removeEventListener('click', this.foo)
    },
    copyContext() {
      this.$copyText(this.copyText).then(
        (e) => {},
        (e) => {}
      )
    },
  },
}

export default tableCopy
