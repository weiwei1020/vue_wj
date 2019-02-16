<template>
  <div>
    <Modal v-model="showUserGroupModal">
      <p slot="header">{{modalTitle}}</p>
      <Row>
        <!--查询条件-->
        <Col span="24">
        <Form id="user-marshalling-form-multi" onsubmit="return false">
          <Form-item>
            <Input name="name" placeholder="请输入组名称,回车查询" style="width:100%"
                   @on-enter="_pageChange(1)" icon="ios-search-strong"></Input>
          </Form-item>
        </Form>
        </Col>
        <Col span="24" style="margin-bottom: 10px">
        <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small"
               border highlight-row  stripe :height="300"
               @on-selection-change="_selectRowChange" @on-select-all='_selectAll'
        ></Table>
        </Col>
        <Col span="24">
        <div style="float: left;padding-top:15px">共 {{getPage.total === undefined ? 0: getPage.total}} 条</div>
        <div style="float: left">
          <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                placement="top"  style="margin-top: 10px;" simple></Page>
        </div>
        <div style="clear: both"></div>
        </Col>
      </Row>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 选择用户编组、科室（多选）
   */

  export default {
    data() {
      return {
        loading: true,
        pageParams: {rows: 20},
        pageColumns: [
          {type:'selection',width:60,align:'center',fixed: 'left',},
          {title: '组名称', key: 'name', width: 120, ellipsis: true},
          {title: '描述', key: 'decp', width: 150, ellipsis: true},
          {title: '用户数', key: 'number', ellipsis: true,},
        ],
        getPage: {},
        showUserGroupModal: false,
        modalTitle: '',
        selectData:[],
      }
    },
    methods: {
      _openDepart() {
        this.modalTitle = '选择科室';
        this._judge();
      },
      _open() {
        this.modalTitle = '选择用户编组';
        this._judge();
      },
      _judge() {
        this.showUserGroupModal = true;
        this._page();
        this.selectData = [];
      },
      _page() {
        this.$store.dispatch('LmsMarshalManage/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsMarshalManage.page;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('user-marshalling-form-multi');
        return this.$extend(data, this.pageParams);
      },
      _search() {
        this._page();
      },
      //多选
      _selectRowChange(data) {
        var dataList = [];
        for (var i = 0; i < data.length; i++) {
          dataList.push(data[i]);
        }
        this.selectData = dataList;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _cancel() {
        this.showUserGroupModal = false;
      },
      _ok() {
        if (this.selectData.length === 0) {
          switch (this.modalTitle) {
            case '选择用户编组':
              this.$Message.warning("请至少选择一条编组数据！");
              break;
            case '选择科室':
              this.$Message.warning("请至少选择一条科室数据！");
              break;
          }
        } else {
          this.$emit('on-result-change', this.selectData);
          this.showUserGroupModal = false;
        }
      },
    }
  }
</script>
