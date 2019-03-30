<template>
  <div>
    <!--内容-->
    <Row>
      <!-- 表格 -->
      <Col span="24" style="margin-bottom: 10px">
      <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
             stripe :height="tableHeight"></Table>
      </Col>
      <!--分页-->
      <Col span="24">
      <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange"
            @on-page-size-change='_pageSizeChange'
            placement="top" show-elevator show-total show-sizer></Page>
      </Col>
    </Row>
  </div>
</template>
<script>

  let dateFormat = require('dateformat');
  export default {
    components: {},
    data() {
      return {
        equipId: '',
        loading: false,
        showDocumentModal: false,
        tableHeight: '550',
        selectIds: [],
        getPage: [],
        pageParams: {
          rows: 10,
        },
        pageColumns: [
          {type: 'index', width: 60, align: 'center', title: '序号', fixed: "left"},
          {title: '文件名称', key: 'documentName', width: 210, align: 'center', ellipse: true,},
          {
            title: '文件类型', key: 'type', width: 210, align: 'center', ellipse: true,
            render: (h, params) => {
              if (params.row.type === '0') {
                return '保养';
              } else if (params.row.type === '1') {
                return '报告单';
              } else if (params.row.type === '2') {
                return '说明书';
              } else {
                return '';
              }
            }
          },
          {title: '计划名称', key: 'planName', width: 210, align: 'center', ellipse: true,},
          {title: '申请原因', key: 'applyReason', width: 210, align: 'center', ellipse: true,},
          {title: '申请人姓名', key: 'applyName', width: 210, align: 'center', ellipse: true,},
          {
            title: '创建时间', key: 'createTime', width: 210, align: 'center', ellipse: true,
            render: (h, params) => {
              let createTime = '';
              if (params.row.createTime !== undefined) {
                createTime = dateFormat(params.row.createTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', createTime);
            }
          },
          {
            title: '操作', key: 'action', width: 90, align: 'center', fixed: 'right',
            render: (h, data) => {
              let operate = [];
              operate.push(
                h('Button', {
                  props: {type: 'success', size: 'small'},
                  on: {
                    click: () => {
                      this._download(data.row.documentPath);
                    }
                  }
                }, '下载')
              );
              return h('div', operate.length > 0 ? operate : '--');
            }
          }
        ],
      }
    },

    methods: {
      _tabOpen(equipId) {
        this.equipId = equipId;
        this.loading = true;
        this._page();
      },
      _download(path) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载？',
          onOk: () => {
            window.open('https://obs.myhwclouds.com/lims/' + path, '_blank');
          }
        });
      },
      _page() {
        this.$store.dispatch('LmsEquipInfo/documentList', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipInfo.docList;
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
        let data = this.$serialize('search-doc-form');
        data = this.$extend(data, {equipId: this.equipId});
        return this.$extend(data, this.pageParams);
      },
    },
  }
</script>
