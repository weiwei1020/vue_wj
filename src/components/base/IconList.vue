<template>
  <div>
    <Tooltip v-for="item in msg" :content="item.name" :key="item.name" transfer>
        <span v-if="!item.upload">
          <span v-if="item.disabled">
            <Icon :type="item.type"
                  :id="item.id"
                  v-if="$showBtn(item.id)"
                  class="marRight-10 icons" size=20
                  :style="objStyle"></Icon>
          </span>
          <span v-else>
             <Icon :type="item.type"
                   :id="item.id"
                   v-if="$showBtn(item.id)"
                   class="marRight-10 icons" size=20
                   @click.native="_iconClick(item.name,item.componentName,rowIndex)" v-else></Icon>
          </span>
        </span>
      <span v-else>
           <Upload
             :action="item.action"
             :on-success="_handelsuccess"
             :before-upload="_beupload"
             :data="dataObj"
             :with-credentials="true"
             :show-upload-list="false"
           >
            <Icon :type="item.type"
                  :id="item.id"
                  class="marRight-10 icons" size=20></Icon>
          </Upload>
        </span>
    </Tooltip>
  </div>
</template>
<script>
  export default {
    props: {
      msg: null,  //任何类型
      id: null,
      rowData: null,
      rowIndex:null, //当前行的索引值
    },
    data() {
      return {
        objStyle: {
          color: '#999',
          cursor: 'not-allowed'
        }
      }
    },
    methods: {
      _iconClick(name,componentName,rowIndex) { //按钮点击事件
        this.$emit("on-result-change", name, this.rowData,componentName,rowIndex);
      },
    }
  }
</script>
