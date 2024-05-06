export default {
  data() {
    return {
      scale: 1,
      bgx: 0,
      bgy: 0,
      dragSx: 0,
      dragSy: 0,
      dragEx: 0,
      dragEy: 0,
    }
  },
  methods: {
    wheel(event) {
      const minL = 1,
        maxL = 20

      // e.deltaY 滚轮向前-100，向后+100
      this.scale += event.deltaY * -0.01
      this.scale = Math.min(Math.max(minL, this.scale), maxL)

      this.popupClose()
    },
    dragstart(event) {
      const { x, y } = event
      this.dragSx = x
      this.dragSy = y
    },
    dragend(event) {
      const { x, y } = event
      this.dragEx = x
      this.dragEy = y

      this.bgx += (this.dragEx - this.dragSx) * this.scale
      this.bgy += (this.dragEy - this.dragSy) * this.scale
    },
  },
}
