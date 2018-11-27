<template>
  <div>
    <div style="float: left;padding-top:10px">{{$t('Page.total')}} {{getPage.total === undefined ? 0: getPage.total}} {{$t('Page.piece')}}</div>
    <div style="float: left">
      <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
            placement="top" style="margin-top: 10px;" simple></Page>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script>
  export default {
    name: "page",
    props: {
      getPage: null
    },
    methods: {
      _pageChange(page) {
        this.$emit('on-result-change', page)
      },
    },
  }
</script>
