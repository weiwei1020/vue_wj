<template>
  <div>
    <Row>
      <!--查询条件-->
      <Col span="24">
      <Form :id="id" onsubmit="return false">
        <Form-item>
          <Input name="realname" placeholder="请输入姓名,回车查询" v-model="realname"
                 style="width:100%" @on-enter="_pageChange(1)" icon="ios-search-strong"
                 @on-click="_pageChange(1)"></Input>
          <input name="orgId" type="hidden">
        </Form-item>
      </Form>
      <Form :id="marshalling">
        <input name="groupId" type="hidden">
        <input name="realname" type="hidden" v-model="realname">
      </Form>
      </Col>
      <Col span="24" style="margin-bottom: 10px">
      <Table :loading="loading" :columns="pageColumns" :data="getPage.records"
             size="small" border highlight-row stripe
             :height="300"
             @on-selection-change="_selectRowChange" @on-select-all='_selectAll'
      ></Table>
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
   * 用户编组
   */
  export default {
    components: {},
    data() {
      return {
        loading: true,
        pageParams: {rows: 20},
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},

          {
            title: '姓名', key: 'realname', ellipsis: true,width:100,
          },
          {
            title: '用户名', key: 'username',  ellipsis: true,width:120
          },
          {
            title: '性别', key: 'sex', ellipsis: true, width: 140,
            render: (h, params) => {
              return h('div', params.row.sex === 1 ? '女' : '男');
            }
          },
        ],
        getPage: {},
        selectIds: [],
        selectData: [],
        type: 0,
        realname: '',
        id: 'user-check-form',
        marshalling: 'search-marshalling'
      }
    },
    methods: {
      _open(id) {
        $("input[name=orgId]").val(id);
        this.selectIds = [];
        this.$emit("on-result-change", this.selectIds);
        this.type = 1;
        this._page();
      },
      _openClear(data) {
        $("input[name=realname]").val('');
        this.id += data
        this.marshalling += data
      },
      _marshallingOpen(data) {
        $("input[name=groupId]").val(data);
        this.selectIds = [];
        this.type = 2;
        this.$emit("on-result-change", this.selectIds);
        this._page1();
      },
      _page() {
        this.$store.dispatch('SysUser/userSelect', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.SysUser.userList;
        });
      },
      _page1() {
        this.$store.dispatch('LmsMarshalManage/userPage', this._searchParams1()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsMarshalManage.userPage;
        });
      },
      _searchParams1() {
        var data = this.$serialize(this.marshalling);
        return this.$extend(data, this.pageParams);
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        if (this.type == 1) {
          this._page();
        } else {
          this._page1();
        }
      },
      _searchParams() {
        var data = this.$serialize(this.id);
        return this.$extend(data, this.pageParams);
      },
      _search() {
        this._page();
      },
      _selectRowChange(data) {
        var idList = [];
        let selectData = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
          selectData.push(data[i])
        }
        this.selectIds = idList;
        this.selectData = selectData;
        this.$emit("on-result-change", this.selectData)
        this.$emit("on-type-change", this.type)
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _refresh() {
        this.getPage.records = []
      },
      _deleteAll() {
        this.getPage = {}
        this.loading = true
      }

    }
  }
</script>
