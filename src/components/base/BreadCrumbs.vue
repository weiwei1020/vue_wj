<template>
  <div class="ivu-breadcrumb breadcrumb_bg">
    <Breadcrumb>
      <Breadcrumb-item v-for="item in crumbs" :key="item">{{item}}</Breadcrumb-item>
    </Breadcrumb>
  </div>
</template>

<script>
  /**
   * 面包屑
   */
  export default {
    name: "bread-crumbs",
    props: {
      crumbs: null  //任何类型
    },
  }
</script>
