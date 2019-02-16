<template>
  <div class="btn-width">
    <Button :type="item.type"
            :key="item.name"
            @click="_footerClick(item.name,index)"
            :loading="loading === true && currentIndex === index"
            v-for="(item,index) in footer"

    >{{item.name}}<!-- v-if="item.id === undefined || item.id === '' ? true : $showBtn(item.id) "-->
    </Button>
  </div>
</template>

<script>
  export default {
    props: {
      footer: null,  //任何类型
    },
    data() {
      return {
        loading: false,
        currentIndex: -1
      }
    },
    methods: {
      _hideLoading() {
        this.loading = false;
        this.currentIndex = -1;
      },
      _footerClick(name, index) {
        this.currentIndex = index;
        this.$emit('on-result-change', name);
        if (name === '取消'||name==='cancel') {
          this.loading = false;
        } else {
          this.loading = true;
          //点击完的5秒钟之后，取消loading
          setTimeout(()=>{
            this.loading = false;
          },5000);
        }
      },
    }
  }
</script>
