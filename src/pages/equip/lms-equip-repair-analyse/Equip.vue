<template>
  <div>
    <Modal v-model="showUserModal" width="1000">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Row :gutter="16">
          <!--人员列表-->
          <Col span="24">
          <!--查询-->
          <Col span="24">
          <Form id="search-form-equip" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item label="仪器名称:">
              <Input name="name" placeholder="请输入仪器名称" @on-enter="_pageChange(1)" style="width:200px"></Input>
            </Form-item>
            <Form-item class="marleft-70">
              <Button type="primary" @click="_pageChange(1)">搜索</Button>
            </Form-item>
          </Form>
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

  export default {
    components: {},
    data() {
      return {
        id: '',
        modalTitle: '选择人员',
        showUserModal: false,
        loading: true,
        pageParams: {
          rows: 20,
        },
        getPage: {},
        pageColumns: [
          {
            title: '仪器名称', key: 'name', ellipsis: true,
          },
          {
            title: '仪器编号', key: 'equipNum', ellipsis: true,
            render: (h, data) => {
              let operate = [];
              if (this.index === data.row._index) {
                operate.push(
                  h('div', [
                    h('strong', data.row.equipNum),
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
                  h('div', data.row.equipNum)
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
      _open() {
        this.showUserModal = true;
        this.currentRowData = {};
        this.index = '-1';
        this._page();

      },
      _page() {
        this.$store.dispatch('LmsEquipInfo/page', this._searchParams()).then(() => {
          this.getPage = this.$store.state.LmsEquipInfo.page;
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
        var data = this.$serialize('search-form-equip');
        return this.$extend(data, this.pageParams);
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
