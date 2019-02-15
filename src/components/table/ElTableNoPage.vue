<template>
  <div>
    <el-table
      stripe
      border
      size="small"
      highlight-current-row
      :data="getPage.records"
      style="width: 100%;"
      :height="tableHeight"
      v-loading="loading"
      @select-all="_selectAll"
      @selection-change="_selectRowChange"
      @cell-click="_cellClick"
      @row-dblclick="_dbClickRow"
      ref="moveTable"
    >
      <el-table-column
        type="selection"
        width="55"
        fixed="left"
        align="center"
        v-if="hideCheckbox===undefined">
      </el-table-column>
      <slot></slot>
      <el-table-column
        label="操作"
        align="center"
        :width="optColWidth"
        fixed="right" v-if="optColWidth?true:false">
        <template slot-scope="scope">
          <IconList :msg="iconMsg" @on-result-change="_iconClick" :rowData="scope.row"></IconList>
        </template>
      </el-table-column>
      <slot name="col"></slot>
    </el-table>
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
      clickValue: null,
      dbClickRow:null
    },
    data() {
      return {
        loading: true,
        rowData: {},
        extendsData: {},//扩展数据，数据传不过来使用
      }
    },
    methods: {
      //点击单元格触发
      _cellClick(row, event, column) {
        if ((event.label === '操作')) {

        } else{
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
      _page(formId, uri,extendsData) {
        this.formId = formId;
        let data = this.$serialize(this.formId);
        if (extendsData) {
          this.extendsData = extendsData;
          Object.assign(data, this.extendsData);
        }
        this.$store.dispatch(uri, data).then(() => {
          this.loading = false;
          this.$emit("on-result-change", 'page', '')
        });
      },
      //多选
      _selectRowChange(data) {
        if (this.selectData !== undefined) {
          this.$emit("on-result-change", 'selectData', data);
        } else {
          var idList = [];
          for (var i = 0; i < data.length; i++) {
            idList.push(data[i].id);
          }
          if (this.hideCheckbox === undefined) {
            //有checkbox 则返回选中的id数组
            this.$emit("on-result-change", 'selectIds', idList);
          }
        }
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      //操作列回调
      _iconClick(name, rowData) {
        this.$emit("on-result-change", 'iconClick', {name: name, rowData: rowData})
      },
      //关闭loading
      _hideLoading() {
        this.loading = false;
      },
      //打开loading
      _showLoading() {
        this.loading = true;
      },
      //双击行操作
      _dbClickRow(row, event) {
        if(this.dbClickRow === undefined){
          //默认是有双击操作的，若此参数有值，则不返回
          this.$emit("on-result-change", 'dbSelect', row);
        }
      },
    }
  }
</script>

