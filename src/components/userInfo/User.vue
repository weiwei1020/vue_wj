<template>
  <div>
    <Modal v-model="showUserModal" width="1000" class="zIndex-1100">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Row :gutter="16">
          <!--组织列表-->
          <Col span="8">
          <Card dis-hover class="card_tree">
            <p slot="title" style="width: 60%">组织列表</p>
            <div>
              <OrginZtree ref="orginZtree" @on-result-change="_orgData"></OrginZtree>
            </div>
          </Card>
          </Col>
          <!--人员列表-->
          <Col span="16">
          <Row :gutter="16">
            <!--查询-->
            <Col span="24">
            <Collapse style="margin-bottom: 10px;" class="coll-search">
              <Panel name="search">查询条件
                <p slot="content">
                <Form id="search-form-user" inline onsubmit="return false" :label-width="90">
                  <Form-item label="姓名:">
                    <Input name="realname" placeholder="请输入姓名" v-model="realname" @on-enter="_pageChange(1)" style="width:200px"></Input>
                    <input name="orgId" type="hidden">
                  </Form-item>
                  <Form-item class="marleft-90">
                    <Button type="primary" @click="_pageChange(1)">搜索</Button>
                  </Form-item>
                </Form>
                </p>
              </Panel>
            </Collapse>
            </Col>
            <!-- 表格 -->
            <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" disabled-hover
                   border :height="400" highlight-row class="tableClassName" @on-row-click="_rowChange"></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                  @on-page-size-change='_pageSizeChange'
                  placement="top" show-elevator show-total show-sizer></Page>
            </Col>
          </Row>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 选择人员(单选)
   */
  import OrginZtree from './OrginZtree.vue'

  export default {
    components: {
      OrginZtree,
    },
    data() {
      return {
        id: '',
        modalTitle: '选择人员',
        showUserModal: false,
        loading: true,
        pageParams: {
          rows: 20,
        },
        realname:'',
        getPage: {},
        pageColumns: [
          {
            title: '姓名', key: 'realname', width: 130, ellipsis: true,
          },
          {
            title: '性别', key: 'sex', width: 80, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.sex == 1 ? '女' : '男');
            }
          },
          {title: '手机号', key: 'mobile', ellipsis: true, width: 150,},
          {
            title: '状态', key: 'status', ellipsis: true, width: 80,
            render: (h, params) => {
              return h('div', params.row.status.display)
            }
          },
          {
            title: '电子邮箱', key: 'email', ellipsis: true, width: 198,
            render: (h, data) => {
              let operate = [];
              if (this.index === data.row._index) {
                operate.push(
                  h('div', [
                    h('strong', data.row.email),
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
                  h('div', data.row.email)
                );
              }
              return h('div', operate);
            }
          },
        ],
        index: '-1',
        currentRowData: {},
      }
    },
    methods: {
      _open(treeName) {
        this.showUserModal = true;
        this.$refs.orginZtree._getZtree(treeName);
        this.currentRowData = {};
        this.getPage = {};
        this.index = '-1';
        $("input[name=realname]").val('');
      },
      _page() {
        this.$store.dispatch('SysUser/userSelect', this._searchParams()).then(() => {
          this.getPage = this.$store.state.SysUser.userList;
          this.loading = false;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _pageSizeChange(rows) {
        if (rows !== this.pageParams.rows) {
          this.pageParams['rows'] = rows;
          this._page();
        }
      },
      _search() {
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('search-form-user');
        data.realname = this.realname
        return this.$extend(data, this.pageParams);
      },
      _orgData(data) {
        $("input[name=orgId]").val(data.id);
        this.index = '-1';
        this.currentRowData = {};
        this._page();
      },
      _rowChange(data, index) {
        this.currentRowData = data; //选中的行数据;
        this.index = index;
      },
      _cancel() {
        this.showUserModal = false;
      },
      _ok() {
        if (JSON.stringify(this.currentRowData) === '{}') {
          this.$Message.warning("请选择一条人员数据！")
        } else {
          this.$emit('on-result-change', this.currentRowData);
          this.showUserModal = false;
        }
      },
    }
  }
</script>
