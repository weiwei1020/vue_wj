<template>
  <div>
    <!--表格-->
    <div style="position: relative">
      <div>
        <el-table
          v-loading="loading"
          stripe
          border
          size="small"
          ref="moveTable"
          highlight-current-row
          :data="getPage.records"
          style="width: 100%"
          :height="tableHeight"
          :default-sort="{prop: 'date', order: 'descending'}"
          element-loading-text="拼命加载中..."
          element-loading-spinner="el-icon-loading"
          @select-all="_selectAll"
          @selection-change="_selectRowChange"
          @row-dblclick="_dbClickRow"
          @cell-click="_cellClick"
        >
          <el-table-column
            v-if="showCheckBox!==undefined&&showCheckBox!==false"
            type="selection"
            width="55"
            fixed="left"
            align="center"
          />
          <slot />
          <el-table-column
            v-if="(iconMsg !== undefined &&iconMsg.length) > 0?(optColWidth?true:false):false"
            label="操作"
            align="center"
            :width="optColWidth"
            fixed="right"
          >
            <template slot-scope="scope">
              <icon-list :msg="iconMsg" :row-data="scope.row" @on-result-change="_iconClick" />
            </template>
          </el-table-column>
          <slot name="col" />
        </el-table>
      </div>
      <!--自定义表格列-->
      <div style="position: absolute;right:0;top:0;z-index:2000">
        <slot name="setting" />
      </div>
    </div>
    <Page
      v-if="hidePage===undefined"
      :total="getPage.total"
      :page-size="getPage.size"
      :current="getPage.current"
      :page-size-opts="pageSizeOpts"
      placement="top"
      :show-elevator="hideElevator===undefined"
      :show-total="hideTotal===undefined"
      :show-sizer="hideSizer===undefined"
      style="margin-top: 10px;"
      @on-change="_pageChange"
      @on-page-size-change="_pageSizeChange"
    />
  </div>
</template>

<script>
export default {
  props: [
    'pageColumns',
    'tableHeight',
    'showCheckBox',
    'optColWidth',
    'getPage',
    'iconMsg',
    'warnKey',
    'selectData',
    'hideElevator',
    'hideTotal',
    'hidePage',
    'hideSizer',
    'click',
    'tableName'
  ],
  data() {
    return {
      formId: '', // 表单id
      loading: true,
      pageParams: {
        page: 1,
        rows: this.$pageParams()
      },
      rowData: {},
      pageSizeOpts: this.$pageSizeOpts()
    }
  },
  methods: {
    // 点击单元格触发
    _cellClick(row, event, column) {
      if (event.label !== '操作') {
        this._rowClickChange(row)
      }
    },
    _rowClickChange(row) {
      if (this.click === undefined) {
        // 默认选中该行数据
        this.$refs.moveTable.toggleRowSelection(row)
      } else {
        // 有click参数时执行
        this.$emit('on-result-change', 'click', row)
      }
    },
    _clearSelection() {
      this.$refs.moveTable.clearSelection()
    },
    // 初始化加载
    _initTable() {
      this.loading = false
    },
    _pageChange(page) {
      this.pageParams.page = page
      this._pageParamsChange()
    },
    _pageSizeChange(rows) {
      if (rows !== this.pageParams.rows) {
        this.pageParams.rows = rows
        this._pageParamsChange()
      }
    },
    _pageParamsChange() {
      this.$emit('on-result-change', 'page', '')
    },
    _searchParams() {
      this.loading = true
      const data = {}
      if (this.hidePage !== undefined) {
        // 不分页
        return data
      } else {
        // 分页
        return this.pageParams
      }
    },
    // 多选
    _selectRowChange(data) {
      // 默认返回的是id数组
      if (this.showCheckBox !== undefined) {
        // 有checkbox 默认返回选中的id数组
        if (this.selectData === undefined) {
          const idList = []
          for (let i = 0; i < data.length; i++) {
            idList.push(data[i].id)
          }
          this.$emit('on-result-change', 'selectIds', idList)
        } else {
          // 有selectData参数时执行
          this.$emit('on-result-change', 'selectData', data)
        }
      }
    },
    _selectAll: function(data) {
      this._selectRowChange(data)
    },
    // 操作列回调
    _iconClick(name, rowData) {
      this.$emit('on-result-change', 'iconClick', {
        name: name,
        rowData: rowData
      })
    },
    // 双击行操作
    _dbClickRow(row, event) {
      this.$emit('on-result-change', 'dbSelect', row)
    },
    _hideLoading() {
      this.loading = false
    }
  }
}
</script>
