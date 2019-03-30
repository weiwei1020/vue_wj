<template>
  <Modal v-model="isShow">
    <p slot="header">图片预览</p>
    <div style="text-align:center">
      <img :src="viewUrl"  style="width: 100%">
    </div>
  </Modal>
</template>
<script>
    /**
     * 仪器资产信息表详情
     */
    export default {
        data() {
            return {
              isShow: false,
              viewUrl:''
            }
        },
        methods: {
            _open(url) {
                this.isShow = true;
                this.viewUrl = url;
            },

        }
    }
</script>
