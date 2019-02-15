<template>
  <div>
    <el-table
      stripe
      border
      size="small"
      highlight-current-row
      :data="getPage.records"
      style="width: 100%"
      :height="tableHeight"
      :default-sort="{prop: 'date', order: 'descending'}"
      v-loading="loading"
      @row-click="_rowClickChange"
      @row-dblclick="_dbClickRow"
      ref="moveTable">
      <el-table-column label="" width="60">
        <template slot-scope="scope">
          <div style="text-align: center !important;margin-right: -10px">
            <el-radio :label="scope.row.id?scope.row.id:scope.row.uid" v-model="templateRadio"
                      @change.native="_getTemplateRow(scope.row)">&nbsp
            </el-radio>
          </div>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
          @on-page-size-change='_pageSizeChange' :page-size-opts="pageSizeOpts"
          placement="top" :show-elevator="hideElevator===undefined"
          :show-total="hideTotal===undefined" :show-sizer="hideSizer===undefined"
          style="margin-top: 10px;"></Page>
  </div>
</template>

<script>
  /*radio-table(单选)*/
  export default {
    name: "page-table",
    props: {
      pageColumns: null,
      tableHeight: '300',
      hideCheckbox: null,
      optColWidth: null,
      getPage: null,
      iconMsg: null,
      hideElevator: null,
      hideTotal: null,
      hideSizer: null,
    },
    data() {
      return {
        formId: '', //表单id
        loading: false,
        isRowClick: false,
        pageParams: {
          rows: 20,
        },
        extendsData: {},//扩展数据，数据传不过来使用
        rowData: {},
        pageSizeOpts: [20, 50, 100, 200, 500],
        templateRadio: '',
      }
    },
    methods: {
      _getTemplateRow(row) {
        this.$emit('on-result-change', 'radioSelect', row);
      },
      _searchParams() {
        let data = this.$serialize(this.formId);
        Object.assign(data, this.extendsData);
        return this.$extend(data, this.pageParams);
      },
      _page(formId, uri, extendsData) {
        this.loading = true;
        this.formId = formId;
        this.templateRadio = '';
        if (extendsData) {
          this.extendsData = extendsData;
        }
        this.$store.dispatch(uri, this._searchParams()).then(() => {
          this.loading = false;
          this.$emit("on-result-change", 'page', '')
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
      //点击单元格触发
      _rowClickChange(row) {
        this.templateRadio = row.id ? row.id : row.uid;
        this.$emit('on-result-change', 'radioSelect', row);
      },
      //双击行操作
      _dbClickRow(row, event) {
        this.$emit("on-result-change", 'dbSelect', row);
      },
      //取消loading
      _hideLoading() {
        this.loading = false;
      },
      //清空数据
      _clear() {
        this.templateRadio = '';
      },
    }
  }
</script>
