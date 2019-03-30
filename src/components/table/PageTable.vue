<template>
  <div>
    <Table :loading="loading" :columns="pageColumns" :data="getPage.records"
           size="small" border highlight-row
           stripe :height="tableHeight"
           @on-selection-change="_selectRowChange" @on-select-all='_selectAll'
    >

    </Table>
    <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
          @on-page-size-change='_pageSizeChange'
          placement="top" show-elevator show-total show-sizer style="margin-top: 10px;margin-bottom: 0px;"></Page>
  </div>
</template>

<script>
  export default {
    name: "page-table",
    props: {
      pageColumns: null,
      tableHeight: '300',
      getPage: null,
    },
    data() {
      return {
        formId: '', //表单id
        loading: true,
        pageParams: {
          rows: 20,
        },
        selectIds: [],
      }
    },
    methods: {
      _searchParams() {
        var data = this.$serialize(this.formId);
        return this.$extend(data, this.pageParams);
      },
      _page(formId, uri) {
        this.formId = formId;
        this.$store.dispatch(uri, this._searchParams()).then(() => {
          this.loading = false;
          this.$emit("on-result-change", 'page','')
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._pageParamsChange();
      },
      _pageSizeChange(rows) {
        if (rows !== this.pageParams.rows) {
          this.pageParams['rows'] = rows;
          this._pageParamsChange();
        }
      },
      _pageParamsChange() {
        this.$emit("on-result-change");
      },
      //多选
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
        this.$emit("on-result-change", 'selectIds', this.selectIds)
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
    }
  }
</script>

