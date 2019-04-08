<template>
  <Select v-model="value" clearable @on-change="_selectChange" placeholder="请选择耗材类别">
    <Option v-for="category in getCategoryList" :value="category.id" :key="category.name">{{category.name}}</Option>
  </Select>
</template>
<script>
  export default {
    props: ["value"],
    computed: {
      getCategoryList() {
        return this.$store.state.LmsChemicalCategory.list;
      }
    },
    mounted() {
      this.$store.dispatch('LmsChemicalCategory/listCurrentUser');
    },
    methods: {
      _selectChange(data) {
        this.$emit("on-result-change", data)
      }
    }
  }
</script>
