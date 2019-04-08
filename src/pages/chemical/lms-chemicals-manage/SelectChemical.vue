<!--
<template>
  <Select clearable @on-change="_selectChange" placeholder="请选择耗材大类">
    <Option v-for="chemicalType in getSystem" :value="chemicalType.id" :key="chemicalType.name">{{chemicalType.name}}</Option>
  </Select>
</template>
<script>
  export default {
    computed: {
      getSystem() {
        return this.$store.state.SysSystem.list;
      }
    },
    mounted() {
      this.$store.dispatch('SysSystem/listIdName');
    },
    methods: {
      _selectChange(data) {
        this.$emit("on-result-change", data)
      }
    }
  }
</script>
-->
