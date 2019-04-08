<template>
  <div>
    <Modal v-model="chemicalStockUserecordModal" title="耗材出入库记录" width="1000">
      <Row>
        <!--查询-->
        <Col span="24">
        <Form id="search-form" inline onsubmit="return false" :label-width="90">
          <label class="label-sign"></label>
          <Form-item label="出入库量:">
            <Input v-model="stock" placeholder="请输入出入库量" @on-enter="_pageChange(1)" style="width:180px"></Input>
          </Form-item>
          <Form-item label="状态:">
            <Select v-model="type" clearable filterable style="width:180px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="备注:">
            <Input v-model="remark" placeholder="请输入备注" @on-enter="_pageChange(1)" style="width:180px"></Input>
          </Form-item>
          <Form-item class="marleft-90">
            <Button type="primary" @click="_pageChange(1)">搜索</Button>
          </Form-item>
        </Form>
        </Col>
        <!-- 表格 -->
        <Col span="24" style="margin-bottom: 10px">
        <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small"
               border highlight-row stripe :height="300"></Table>
        </Col>
        <!--分页-->
        <Col span="24">
        <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange"
              @on-page-size-change='_pageSizeChange'
              placement="top" show-elevator show-total show-sizer></Page>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true,
        chemicalStockUserecordModal: false,
        chemicalId: '',
        stockId: '',
        selectIds: [],
        pageParams: {
          rows: 20,

        },
        pageColumns: [
          {
            title: '状态', key: 'type', width: 120,
            render: (h, params) => {
              let text = '归还', color = 'blue';
              if (params.row.type == 0) {
                text = '入库';
                color = 'green';
              } else if (params.row.type == 1) {
                text = '出库';
                color = 'yellow';
              }
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {title: '耗材名称', key: 'chemicalName', width: 100, ellipsis: true,},
          {title: '耗材类别', key: 'chemicalCategory', width: 100, ellipsis: true,},
          {
            title: '出入库量', key: 'stock', width: 120, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.stock + ' / ' + params.row.unit);
            }
          },
          {
            title: '转换量', key: 'exstock', width: 120, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.exstock + ' / ' + params.row.exunit);
            }
          },
          {
            title: '备注', key: 'remark', ellipsis: true,
            render: (h, data) => {
              if (data.row.type == 1) { //出库显示科室、登记人
                let operate = [];
                operate.push(
                  h('span', {
                    style: {'color': '#19be6b', 'marginRight': '10px'}
                  }, '科室:' + data.row.department + ';')
                );
                operate.push(
                  h('span', {
                    style: {'color': '#ed3f14', 'marginRight': '10px'}
                  }, '登记人:' + data.row.registrant + ';')
                );
                operate.push(
                  h('span', {
                    style: {'color': '#1c2438'}
                  }, '备注:' + data.row.remark)
                );
                return h('div', operate);
              } else {
                return h('div', data.row.remark);
              }
            }
          },
          {
            title: '操作时间', key: 'ctime', width: 160,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM"));
            }
          },
        ],
        getPage: {},
        statusList: [
          {value: 0, name: '入库'},
          {value: 1, name: '出库'},
          {value: 2, name: '归还'},
        ],
        stock: '',
        type: '',
        remark: '',
      }
    },
    methods: {
      _open(chemicalId, stockId) {
        this.chemicalId = chemicalId;
        this.stockId = stockId;
        this.chemicalStockUserecordModal = true;
        this._page();
      },
      _page() {
        this.$store.dispatch('LmsChemicalUserecord/pageByChemicalId', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsChemicalUserecord.page;
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
        var data = this.$serialize('search-form');
        data.chemicalId = this.chemicalId;
        if (this.stockId !== '') {
          data.stockId = this.stockId;
        }
        if (this.stock !== '') {
          data.stock = this.stock;
        }
        if (this.type !== '') {
          data.type = this.type;
        }
        if (this.remark !== '') {
          data.remark = this.remark;
        }
        return this.$extend(data, this.pageParams);
      }
    },
  }
</script>
