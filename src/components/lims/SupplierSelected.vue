<template>
  <Select name="supplierIds"
    v-model="supplierList"
    multiple
    filterable
    remote
    :remote-method="remoteSupplier"
    :loading="loading" style="width:100%">
    <Option v-for="(option, index) in options" :value="option.id" :key="index">{{option.name}}</Option>
  </Select>
</template>
<script>
  export default {
    data() {
      return {
        supplierList: [],
        options: [],
        loading: false
      }
    },
    methods: {
      remoteSupplier(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$store.dispatch('LmsSupplier/getListByName', query).then(() => {
              this.options = this.$store.state.LmsSupplier.list;
            });
          }, 200);
        } else {
          this.options = [];
        }
      }
    }
  }
</script>
