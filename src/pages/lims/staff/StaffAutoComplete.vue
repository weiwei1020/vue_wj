<template>
  <div>
    <Dropdown trigger="click" @on-click="_dropDown" style="width:100%;" placement="bottom">
      <Input v-model="value"
             :placeholder="placeholder"
             icon="ios-search"
             @on-change="_query"
             style="width:100%"/>
      <DropdownMenu slot="list" style="max-height: 200px;overflow: auto">
        <DropdownItem v-for="item in downData" :key="item" :name="item">{{item.name}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    props: {
      name: null,
      value: null,
      placeholder: null,
      downData: null,
      list:null
    },
    data() {
      return {}
    },
    mounted() {

    },
    methods: {
      //选择
      _dropDown(data) {
        this.$emit("on-result-change", 'select', data);
        this.value = data;
      },
      //查询
      _query() {
        this.$emit("on-result-change", 'query', this.value)
      },
    },
  }
</script>

