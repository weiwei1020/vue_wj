<template>
  <div>
    <Modal v-model="showUserGroupModal">
      <p slot="header">{{modalTitle}}</p>
      <Row>
        <!--查询条件-->
        <Col span="24">
        <Form id="user-marshalling-form" onsubmit="return false">
          <Form-item>
            <Input name="name" placeholder="请输入客户名称,回车查询" style="width:100%"
                   @on-enter="_pageChange(1)" icon="ios-search-strong"></Input>
          </Form-item>
        </Form>
        </Col>
        <Col span="24" style="margin-bottom: 10px">
        <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small"
               border highlight-row disabled-hover
               :height="300"
               class="tableClassName" @on-row-click="_rowChange"
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
   * 选择客户(单选)
   */
  export default {
    components: {},
    data() {
      return {
        loading: true,
        pageParams: {rows: 20},
        pageColumns: [
          {title: '中文名称', key: 'cname', width: 150, fixed: 'left', ellipsis: true},
          {title: '信用等级', key: 'credit', width: 150, ellipsis: true},
          {
            title: '主联系人', key: 'contact', ellipsis: true,
            render: (h, data) => {
              let operate = [];
              if (this.index === data.row._index) {
                operate.push(
                  h('div', [
                    h('strong', data.row.contact),
                    h('Icon', {
                      style: {
                        float: 'right',
                      },
                      props: {
                        type: 'checkmark',
                        color: '#19be6b',
                        size: '17'
                      },
                    })
                  ])
                );
              } else {
                operate.push(
                  h('div', data.row.contact)
                );
              }
              return h('div', operate);
            }
          },
        ],
        getPage: {},
        showUserGroupModal: false,
        modalTitle: '',
        index: '-1',
        currentRowData: {},
      }
    },
    methods: {
      _open() {
        this.modalTitle= '选择客户';
        this._judge();
      },
      _judge(){
        this.showUserGroupModal = true;
        this.index = '-1';
        this.currentRowData = {};
        this._page();
      },
      _page() {
        this.$store.dispatch('LmsCustomer/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsCustomer.page;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('user-marshalling-form');
        return this.$extend(data, this.pageParams);
      },
      _search() {
        this._page();
      },
      _rowChange(data, index) {
        this.currentRowData = data; //选中的行数据;
        this.index = index;
      },
      _cancel() {
        this.showUserGroupModal = false;
      },
      _ok() {
        if (JSON.stringify(this.currentRowData) === '{}') {
          switch (this.modalTitle){
            case '选择客户':this.$Message.warning("请选择一条客户数据！");break;
          }
        } else {
          this.$emit('on-result-change', this.currentRowData);
          this.showUserGroupModal = false;
        }
      },
    }
  }
</script>
