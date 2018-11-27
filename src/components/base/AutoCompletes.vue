<template>
  <div>
    <Dropdown trigger="click" @on-click="_dropDown" style="width:100%;"
              placement="bottom">
      <Input :name="name" v-model="value"
             :placeholder="placeholder"
             icon="ios-search"
             @on-change="_query"
             @on-blur="_inputBlur"
             @on-focus="_inputFocus"
             style="width:100%"
             :class="{'iview-input-error':showError === ''}"/>
      <DropdownMenu slot="list" style="max-height: 200px;overflow: auto">
        <DropdownItem v-for="(item,index) in downData" :key="index" :name="item">{{showKey?item[showKey]:item}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    props: {
      name: null,
      showKey: null,
      value: null,
      placeholder: null,
      downData: null,
      //当此值为空时，显示红框
      showError: null,
      blur:null,
      focus:null,
    },
    data() {
      return {
        selectObj: {}
      }
    },
    mounted() {
    },
    methods: {
      //选择
      _dropDown(data) {
        this.$emit("on-result-change", 'select', data);
        if (this.showKey) {
          this.value = data[this.showKey];
        } else {
          this.value = data;
        }
        this.selectObj = data
      },
      //查询
      _query() {
        if (this.showKey) {
          let obj = {};
          obj[this.showKey] = this.value;
          this.$emit("on-result-change", 'query', obj);
        } else {
          this.$emit("on-result-change", 'query', this.value);
        }
      },
      _inputBlur() {
        if (this.value&&this.blur!==undefined) {//失去焦点有值时触发
          this.$emit("on-result-change", 'blur');
        }
      },
      _inputFocus(){
        if(this.focus!==undefined){
          this.$emit('on-result-change','focus');
        }
      }
    },
  }
</script>
<style>
  .iview-input-error .ivu-input {
    border: 1px solid #eb6877 !important;
  }
</style>
