<template>
  <div>
    <Row>
      <!--查询条件-->
      <Col span="24" style="margin-bottom: 10px;">
      <div style="margin-top: 49px;">
        <el-table
          stripe
          border
          size="small"
          highlight-current-row
          :data="getPage"
          style="width: 100%"
          :height="350"
          @select-all="_selectAll"
          @selection-change="_selectRowChange"
          @row-click="_clickRow"
          ref="moveTable"
        >
          <el-table-column
            type="selection"
            width="55"
            fixed="left"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            :prop="item.key"
            :label="item.title"
            :min-width="item.width"
            v-for="item in pageColumns" :key="item.id">
            <template slot-scope="scope">
              <span v-if="item.sex">{{scope.row.sex === 1 ? '女' : '男'}}</span>
              <span v-else>{{scope.row[item.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      </Col>

    </Row>
  </div>
</template>
<script>
  /**
   * 已选人员
   */
  export default {
    data() {
      return {
        pageParams: {rows: 20},
        pageColumns: [
          {title: '用户名', key: 'username', width: 150,},
          {title: '姓名', key: 'realname', width: 100,},
          {title: '性别', key: 'sex', sex: true,},
        ],
        getPage: [],
        selectIds: []
      }
    },
    methods: {
      //选中行的同时选中checkbox
      _clickRow(row) {
        this.$refs.moveTable.toggleRowSelection(row)
      },
      //添加
      _open(data) {
        //userId 与 id

        for (let i = 0; i < data.length; i++) {
          if (data[i].userId === undefined) {
            data[i].userId = data[i].id;
          }
          this.getPage.push(data[i]);
        }
        this.getPage = this.$uniqueArrayItem(this.getPage,'userId');
        this.$emit('on-result-change', this.getPage, [])
      },
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
        this.$emit('on-result-change', this.getPage, this.selectIds)
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _delData() {
        for (let j = 0; j < this.selectIds.length; j++) {
          for (let i = 0; i < this.getPage.length; i++) {
            if (this.getPage[i].id === this.selectIds[j]) {
              this.getPage.splice(i, 1)
            }
          }
        }
        this.$emit('on-result-change', this.getPage, [])
      },
      //清空
      _empty() {
        this.getPage = [];
        this.selectIds = [];
      },
    }
  }
</script>
