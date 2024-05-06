<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        url: 'record-playback',
      },
    }
  },

  mounted() {
    if (window.location.hash.slice(2) == 'record-playback') {
      if (window.webkitProc) {
        window.webkitProc('switch_page_by_url', JSON.stringify(this.params))
      }
    } else {
      if (window.webkitProc) {
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: 'realtime-play',
          })
        )
      }
    }
  },
}
</script>
