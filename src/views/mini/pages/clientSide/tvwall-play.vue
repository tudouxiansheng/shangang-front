<template>
  <div>123</div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        url: 'tvwall-play',
      },
    }
  },

  mounted() {
    if (window.location.hash.slice(2) == 'tvwall-play') {
      window.webkitProc('switch_page_by_url', JSON.stringify(this.params))
    } else {
      window.webkitProc(
        'switch_page_by_url',
        JSON.stringify({
          url: 'realtime-play',
        })
      )
    }
  },
}
</script>
