<template>
  <div>
    <el-table
      stripe
      border
      size="small"
      highlight-current-row
      :data="getPage.records"
      style="width: 100%;margin-bottom: 10px"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
      @select-all="_selectAll"
      @selection-change="_selectRowChange"
      @row-click="_clickRow"
      @row-dblclick="_dbClickRow"
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
        label="操作"
        align="center"
        :width="optColWidth"
        fixed="right" v-if="optColWidth?true:false">
        <template slot-scope="scope">
          <IconList :msg="iconMsg" @on-result-change="_iconClick" :rowData="scope.row"></IconList>
        </template>
      </el-table-column>
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
    },
    data() {
      return {
        selectIds: [],
        rowData: {},
      }
    },
    methods: {
      //选中行的同时选中checkbox
      _clickRow(row) {
        this.$refs.moveTable.toggleRowSelection(row)
      },
      _page(formId, uri) {
        this.formId = formId;
        this.$store.dispatch(uri).then(() => {
          this.$emit("on-result-change", 'page', '')
        });
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

