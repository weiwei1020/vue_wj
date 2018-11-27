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
      :row-class-name="tableRowClassName"
      v-loading="loading"
      @select-all="_selectAll"
      @selection-change="_selectRowChange"
      @row-click="_clickRow"
      ref="moveTable"
    >
      <el-table-column
        type="selection"
        width="55"
        fixed="left"
        align="center"
        v-if="hideCheckbox===undefined?true:false">
      </el-table-column>
      <slot></slot>
      <el-table-column
        :label="$t('operation')"
        align="center"
        :width="optColWidth"
        fixed="right" v-if="optColWidth?true:false">
        <template slot-scope="scope">
          <IconList :msg="iconMsg" @on-result-change="_iconClick" :rowData="scope.row"></IconList>
        </template>
      </el-table-column>
    </el-table>
    <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
          @on-page-size-change='_pageSizeChange'
          placement="top" show-elevator show-total show-sizer style="margin-top: 10px;"></Page>
  </div>
</template>

<script>
  import IconList from '../../components/base/IconList.vue'

  export default {
    components: {IconList},
    name: "page-table",
    props: {
      pageColumns: null,
      tableHeight: '300',
      hideCheckbox: null,
      optColWidth: null,
      getPage: null,
      iconMsg: null,
      warnKey: '',
    },
    data() {
      return {
        formId: '', //表单id
        loading: true,
        pageParams: {
          rows: 20,
        },
        selectIds: [],
        rowData: {},
      }
    },
    methods: {
      //选中行的同时选中checkbox
      _clickRow(row){
        this.$refs.moveTable.toggleRowSelection(row)
      },
      tableRowClassName({row, rowIndex}) {
        if (new Date(row[this.warnKey]) < new Date()) {
          return 'warning-row';
        } else {
          return '';
        }
      },
      _searchParams() {
        var data = this.$serialize(this.formId);
        return this.$extend(data, this.pageParams);
      },
      _page(formId, uri) {
        this.formId = formId;
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
      //多选
      _selectRowChange(data) {
        this.$emit("on-result-change", 'selectData', data);

      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      //操作列回调
      _iconClick(name, rowData) {
        this.$emit("on-result-change", 'iconClick', {name: name, rowData: rowData})
      },
    }
  }
</script>

