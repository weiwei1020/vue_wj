<template>
  <div>
    <Row>
      <!--查询条件-->
      <Col span="24">
      <Form :id="keyUserName" onsubmit="return false">
        <Form-item>
          <Input name="realname" placeholder="请输入姓名,回车查询" v-model="realname"
                 style="width:100%" @on-enter="_pageChange(1)" icon="ios-search-strong"></Input>
        </Form-item>
      </Form>
      <Form :id="keyMaName">
        <input name="groupId" type="hidden">
      </Form>
      </Col>
      <Col span="24" style="margin-bottom: 10px">
      <el-table
        stripe
        border
        size="small"
        highlight-current-row
        :data="getPage.records"
        style="width: 100%"
        :height="305"
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
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :prop="item.key"
          :label="item.title"
          :min-width="item.width"
          v-for="item in pageColumns" :key="item.key">
          <template slot-scope="scope">
            <span v-if="item.sex">{{scope.row.sex === 1 ? '女' : '男'}}</span>
            <span v-else>{{scope.row[item.key]}}</span>
          </template>
        </el-table-column>
      </el-table>
      </Col>
      <Col span="24">
      <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange"
            placement="top" show-total></Page>
      </Col>
    </Row>
  </div>
</template>
<script>
  /**
   * 待选人员
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
        getPage: {},
        selectData: [],
        type: 0,
        realname: '',
        keyUserName: '',
        keyMaName: ''
      }
    },
    methods: {
      //选中行的同时选中checkbox
      _clickRow(row) {
        this.$refs.moveTable.toggleRowSelection(row)
      },
      _open(id, keyUserName) {
        this.orgId = id;
        if (keyUserName === undefined) {
          this.keyUserName = 'search-user-info';
        } else {
          this.keyUserName = keyUserName;
        }
        this.selectData = [];
        this.type = 1;
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize(this.keyUserName);
        data.orgId = this.orgId;
        if (this.realname !== '') {
          data.realname = this.realname;
        }
        return this.$extend(data, this.pageParams);
      },
      _page() {
        this.$store.dispatch('SysUser/pageFlowExcludeMemberShip', this._searchParams()).then(() => {
          this.getPage = this.$store.state.SysUser.page;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        if (this.type === 1) {
          this._page();
        }
      },
      _selectRowChange(data) {
        let selectData = [];
        for (var i = 0; i < data.length; i++) {
          selectData.push(data[i])
        }
        this.selectData = selectData;
        this.$emit("on-result-change", this.selectData, this.type);
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      //重置
      _refresh() {
        this.getPage = {};
        this.realname = '';
      },
      //双击行操作
      _dbClickRow(row, event) {
        this.selectData = [row];
        this.$emit("on-result-change", this.selectData, this.type, 'add');
      },
    }
  }
</script>
