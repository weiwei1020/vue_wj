<template>
    <div style="text-align: left;">
      <div class="cell-bg" style="padding: 8px" @click="_goto(path)">
        <div class="fl" v-if="url"><img :src="url" style="width:30px"></div>
        <div class="fl" style="line-height: 32px;margin-left: 15px;font-size: 13px;font-weight: 600">{{title}}</div>
        <div class="fr" style="line-height: 32px;margin-right: 20px;font-size: 13px;color:red;">{{content}}</div>
        <div class="clear"></div>
      </div>
    </div>
</template>

<script>
    export default {
      data(){
        return{
          title:'标题',
          content:'内容',
          url:'../../static/img/u42.png'
        }
      },
    }
</script>

<style scoped>

</style>
