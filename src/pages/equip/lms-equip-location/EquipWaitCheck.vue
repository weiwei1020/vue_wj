<template>
  <div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <Col span="24" style="margin-top: 10px;">
          <Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="search-item" label="申请时间:">
              <DatePicker type="datetimerange" placement="bottom-start" placeholder="请选择申请时间"
                          style="width:100%;" @on-change="_getDate"></DatePicker>
              <input type="hidden" name="queryStartDate" v-model="queryStartDate">
              <input type="hidden" name="queryEndDate" v-model="queryEndDate">
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_pageChange(1)">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <!--操作-->
          <!--<Col span="24" style="margin-bottom: 10px;">
          <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </Col>-->
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border
                 highlight-row stripe
                 @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
          </Col>
          <!--分页-->
          <Col span="24">
          <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 查看详情 -->
    <LmsEquipOrderDetail ref="LmsEquipOrderDetail"   @on-result-change="_search"></LmsEquipOrderDetail>
  </div>
</template>
<script>
  import LmsEquipOrderDetail from './LmsEquipOrderDetail.vue'
  import IconList from '../../../components/base/IconList.vue'

  export default {
    components: {
      IconList,
      LmsEquipOrderDetail,
    },
    data() {
      return {
        iconMsg: [
          /* {type: 'edit', id: 'equip-info-edit', name: '编辑'},*/
          {type: 'android-document', id: '', name: '详细信息'},
          {type: 'checkmark', id: '', name: '同意'},
          {type: 'close', id: '', name: '驳回'},
        ],
        loading: true,
        status: '',
        tableHeight: '600',
        classId: '',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {title: '仪器名称', key: 'names', align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '意见', key: 'advice', width: 220, ellipsis: true,
            render: (h, data) => {
              return h("Input", {
                props: {
                  type: "text",

                  value: data.row.reason,
                },
                on: {
                  'on-blur': (event,) => {
                    data.row.reason = event.target.value;
                    this._cellChange(data.row._index, event.target.value, 'reason');
                  },
                }
              })
            }
          },
          {title: '申请人', key: 'applyName', width: 150, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '申请时间', key: 'applyTime', width: 200, align: 'center', ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '操作', key: 'action', width: 160, align: 'center',fixed: 'right',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this.iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res, data)
                      }
                    }
                  },),
                ]);
            }
          },
        ],
        getPage: {},
        contLength: 0,
        queryStartDate: '',
        queryEndDate: '',
      }
    },

    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '详细信息' :
            this._editModal(data.row.groupId);//编辑
            break;
          case '同意' :
            this._pass(data.row);
            break;
          case '驳回' :
            this._back(data.row);
            break;
        }
      },
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
      },
      _pass(data) {
       /* if (data.reason == undefined) {
          this.$Message.warning('意见不能为空！');
        } else {*/

          this.$Modal.confirm({
            title: '提示',
            content: '确定同意该申请？',
            onOk: () => {
              this.$store.dispatch('LmsEquipLocation/passOrder', {
                audit:1,
                groupId: data.groupId,
                reason: '通过',
              }).then(() => {
                if (this.$store.state.LmsEquipLocation.success) {
                  this.$Message.success('操作成功！');
                  this._search();
                }
              });
            }
          });
      },
      _back(data) {
        /*if (data.reason == undefined) {
          this.$Message.warning('意见不能为空！');
        } else */
          this.$Modal.confirm({
            title: '提示',
            content: '确定驳回该申请？',
            onOk: () => {
              this.$store.dispatch('LmsEquipLocation/passOrder', {
                audit:0,
                groupId: data.groupId,
                reason: data.reason
              }).then(() => {
                if (this.$store.state.LmsEquipLocation.success) {
                  this.$Message.success('驳回成功！');
                  this._search();
                }
              });
            }
          });

      },
      _initCont() {
        // this.contLength = $(".contHide").find('button').length;
        // if (this.contLength) {
        //   this.tableHeight = this.$newTableHeight('tabBtn');
        // } else {
        //   this.tableHeight = this.$newTableHeight('tabNoBtn');
        // }
        this._page();
      },
      _open() {
        this._initCont();
      },
      _page() {
        this.$store.dispatch('LmsEquipLocation/auditPage', this._searchParams()).then(() => {
          this.loading = false;
           this.getPage = this.$store.state.LmsEquipLocation.page;
          //this.getPage.records=[{names:'1231'}]
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
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
        this.selectObj = data;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _editModal(id) {
        this.$refs.LmsEquipOrderDetail._open(id);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        let data = this.$serialize('search-form');
        data.status = 'TECHNOLOGY_CHECK';
        return this.$extend(data, this.pageParams);
      },
      _orderModal() {
        if (this.selectObj.length > 1) {
          this.$Message.warning({
            content: '请选择一条项目',
            duration: 3
          });
        } else if (this.selectObj.length === 0) {
          this.$refs.orderModal._open();
        } else {
          this.$refs.orderModal._addEquip(this.selectObj[0]);
        }
      },
      _changeModal() {
        if (this.selectIds.length > 0) {
          this.$refs.chengeModal._addEquip(this.selectIds);
        } else {
          this.$refs.chengeModal._open();
        }
      },
    },
  }
</script>
