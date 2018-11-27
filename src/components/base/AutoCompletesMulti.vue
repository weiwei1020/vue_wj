<template>
  <div>
    <Dropdown trigger="click" @on-click="_dropDown" style="width:100%;"
              placement="bottom">
      <div style="width:100%" class="multiSel">
        <Tag v-for="(item,index) in selectList" :key="index" :name="item" @on-close="_handleClose" class="selTag"
             closable color="green">
          {{selectKey?item[selectKey]:item}}
        </Tag>
        <Input :placeholder="placeholder" v-model="params" @on-change="_query" @on-focus="_query">
        </Input>
      </div>
      <DropdownMenu slot="list" style="max-height: 200px;overflow: auto" :transfer="true">
        <DropdownItem v-for="(item,index) in downData" :key="index" :name="item">{{showKey?item[showKey]:item}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

  </div>
</template>
<!--搜索 多选-->
<style>
  .multiSel {
    border: 1px solid #dddee1;
    border-radius: 4px;
    width: 100%;
    background: #ffffff;
  }

  .multiSel .ivu-input {
    width: 140px !important;
    border: none !important;
  }

  .multiSel .ivu-input:focus {
    border: none !important;
    box-shadow: none !important;
  }

  .selTag {
    max-width: 150px;
  }

  .selTag .ivu-tag {
    line-height: 18px !important;
  }

  .selTag .ivu-tag-text {
    max-width: 110px !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    float: left;
  }
</style>
<script>
  export default {
    props: {
      placeholder: null,
      downData: null,
      selectList: null,
      showKey: null,
      selectKey:null
    },
    data() {
      return {
        params: '',
      }
    },
    mounted() {
    },
    methods: {
      _handleClose(event, data) {
        let index = -1;
        if(this.selectKey){
          index = this.selectList.findIndex(item => item[this.selectKey] === data[this.selectKey]);
        }else{
          index = this.selectList.indexOf(data);
        }
        this.selectList.splice(index, 1);
        this.$emit("on-result-change", 'delete', data);
      },
      //选择
      _dropDown(data) {
        if(this.selectKey){
          if(!this.selectList.find(item => item[this.selectKey] ===  data[this.showKey])){
            this.selectList.push(data);
            this.$emit("on-result-change", 'add', data);
          }
        }else{
          if (!this.selectList.find(item => item === (this.showKey ? data[this.showKey] : data))) {
            //如果有值就不添加
            this.selectList.push(this.showKey ? data[this.showKey] : data);
            this.$emit("on-result-change", 'add', data);
          }
        }
        this.params = '';
      },
      //查询
      _query() {
        this.$emit("on-result-change", 'query', this.params);
      },
      // _addInputValue(flag) {
      //   if (this.params&&!flag&&this.blur!==undefined) {//失去焦点有值时触发
      //     if(!this.selectList.find(item=>item===this.params)){//如果有值就不添加
      //       this.selectList.push(this.params);
      //       this.$emit("on-result-change", 'add', this.params);
      //     }
      //     this.params='';
      //   }
      // },
    },
  }
</script>
<style>
  .iview-input-error .ivu-input {
    border: 1px solid #eb6877 !important;
  }
</style>
