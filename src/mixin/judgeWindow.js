var judgeWindow = {
  data() {
    return {
      locale: '',
      screenFlag: true
    }
  },
  methods: {
    judgeWindow(size, val) {
      this.screenFlag = true
      if (window.innerWidth < size) {
        this.screenFlag = false
      }

      window.onresize = () => {
        if (window.innerWidth < size) {
          this.screenFlag = false
        } else {
          this.screenFlag = true
        }
      }
    }
  }
}

export default judgeWindow
