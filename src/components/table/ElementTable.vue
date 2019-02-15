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
      @select-all="_selectAll"
      @selection-change="_selectRowChange"
      @cell-click="_cellClick"
      @row-dblclick="_dbClickRow"
      :cell-class-name="_tableCellClassName"
      ref="moveTable">
      <el-table-column
        type="selection"
        width="55"
        fixed="left"
        align="center"
        v-if="hideCheckbox===undefined || hideCheckbox === false">
      </el-table-column>
      <slot></slot>
      <el-table-column
        label="操作"
        align="center"
        :width="optColWidth"
        fixed="right" v-if="optColWidth?true:false">
        <template slot-scope="scope">
          <IconList :msg="iconMsg" @on-result-change="_iconClick" :rowData="scope.row"
                    :rowIndex="scope.$index"></IconList>
        </template>
      </el-table-column>
      <slot name="col"></slot>
    </el-table>
    <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
          @on-page-size-change='_pageSizeChange' :page-size-opts="pageSizeOpts"
          placement="top" :show-elevator="hideElevator===undefined"
          :show-total="hideTotal===undefined" :show-sizer="hideSizer===undefined"
          style="margin-top: 10px;"></Page>
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
      selectData: null,
      hideElevator: null,
      hideTotal: null,
      hideSizer: null,
      clickValue: null,//单击返回值
      noWarning: null, //不显示警告提示

      isReport: null,//判断是否是报告
      isDataInput:null,//判断数据录入
    },
    data() {
      return {
        formId: '', //表单id
        loading: false,
        isRowClick: false,
        pageParams: {
          rows: this.$defRow,
        },
        extendsData: {},//扩展数据，数据传不过来使用
        rowData: {},
        pageSizeOpts: [20, 50, 100, 200, 500],
      }
    },
    methods: {
      //点击单元格触发
      _cellClick(row, event, column) {
        if ((event.label === '操作')) {

        } else {
          this._rowClickChange(row);
        }
      },
      _rowClickChange(row) {
        if (this.clickValue === undefined) {
          //默认选中该行数据
          this.$refs.moveTable.toggleRowSelection(row);
        } else {
          //有clickValue参数时执行
          this.$emit('on-result-change', 'select', row);
        }
      },
      _checkAll() {
        this.$refs.moveTable.toggleAllSelection();
      },
      _tableCellClassName({row, column, rowIndex, columnIndex}) {
        if (this.isReport !== undefined) {
          //报告管理
          if (column.property ==='sampleProgress'&&row['sampleProgress'] && row.sampleProgress.indexOf('退回') !== -1) {//含有退回就变红
            return 'cell-red';
          }
        } else if(this.isDataInput !== undefined){
          if (column.property ==='name'&&row['progress'] && row.progress.display.indexOf('退回') !== -1) {//含有退回就变红
            return 'cell-red';
          }
        }else {
          //其他列表状态
          if (column.property === 'progress') {

            if (undefined===row['progress']){
              return 'cell-blue-color';
            } else if (undefined!=row['progress']&&undefined!=row['progress'].display ){
              if (row['progress'].display.indexOf('退回') !== -1){
                return 'cell-red-color';
              }else{
                return 'cell-blue-color';
              }
            }else if(undefined!=row['progress']){
              if (row['progress'].indexOf('退回') !== -1){
                return 'cell-red-color';
              }else{
                return 'cell-blue-color';
              }
            }else{
              return 'cell-blue-color';
            }

          } else if (column.property === 'status') {

            if (row['status'] &&row.status.display!=undefined&&row.status.display.indexOf('退回') !== -1) {
              return 'cell-red-color';
            } else {
              return 'cell-blue-color';
            }
          } else {
            return ''
          }
        }
      },
      _searchParams() {
        let data = this.$serialize(this.formId);
        Object.assign(data, this.extendsData);
        return this.$extend(data, this.pageParams);
      },
      _page(formId, uri, extendsData) {
        this.loading = true;
        this.formId = formId;
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
      //多选
      _selectRowChange(data) {
        //默认返回的是id数组
        if (this.selectData === undefined) {
          let idList = [];
          for (let i = 0; i < data.length; i++) {
            idList.push(data[i].id);
          }
          if (this.hideCheckbox === undefined || this.hideCheckbox === false) {
            //有checkbox 则返回选中的id数组
            this.$emit("on-result-change", 'selectIds', idList);
          }
        } else {
          //有selectData参数时执行
          this.$emit("on-result-change", 'selectData', data);
        }
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      //操作列回调
      _iconClick(name, rowData, componentName, rowIndex) {
        this.$emit("on-result-change", 'iconClick', {
          name: name,
          rowData: rowData,
          componentName: componentName,
          rowIndex: rowIndex
        });
      },
      //双击行操作
      _dbClickRow(row, event) {
        this.$emit("on-result-change", 'dbSelect', row);
      },
      //关闭loading
      _hideLoading() {
        this.loading = false;
      },
      //打开loading
      _showLoading() {
        this.loading = true;
      },
    }
  }
</script>
