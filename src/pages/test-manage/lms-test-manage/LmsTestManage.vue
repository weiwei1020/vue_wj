<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" class="martop-20">
          <Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
           <!-- <Form-item class="width-22" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option value="TECHNOLOGY_CHECK">未开始</Option>
                <Option value="TECHNOLOGY_CHECK_PASS">进行中</Option>
                <Option value="TECHNOLOGY_CHECK_BACK">已结束</Option>
                <Option value="TECHNOLOGY_CHECK_BACK">已结束</Option>
                <Option value="TECHNOLOGY_CHECK_BACK">已暂停</Option>
                <Option value="TECHNOLOGY_CHECK_BACK">已中止</Option>
              </Select>
            </Form-item>-->
            <Form-item class="width-22" label="创建人:">
              <Input name="uname" placeholder="请输入创建人" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="实验人员:">
              <Input name="names" placeholder="请输入实验人员" @on-enter="_search"/>
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_search">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <Table :loading='loading' :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
                 stripe
                 @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
          </Col>
          <!--分页-->
          <Col span="24">
          <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange"
                @on-page-size-change='_pageSizeChange'
                placement="top" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <!--文件-->
    <CertificateFile ref="fileModal"   @on-result-change="_search"></CertificateFile>
    <!--批注-->
    <LmsPostil ref="postilModal"   @on-result-change="_search"></LmsPostil>
  </div>
</template>
<script>
  import global from '../../../api/config'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import CertificateFile from './CertificateFile.vue'
  import LmsPostil from './LmsPostil'

  export default {
    components: {
      BtnList,
      BreadCrumbs,
      IconList,
      CertificateFile,
      LmsPostil
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'equip-order-query-export', name: '导出'},
        ],
        iconMsg: [
          {type: 'play', id: '', name: '开始'},
          {type: 'pause', id: '', name: '暂停'},
          {type: 'record', id: '', name: '中止'},
          {type: 'stop', id: '', name: '结束'},
          {type: 'upload', id: '', name: '附件维护'},
          {type: 'compose', id: '', name: '批注'},
        ],
        loading: true,
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        getPage:{},
        pageColumns: [
          {
            title: '状态', key: 'status', "width": 100, "ellipsis": true,sortable:'true',
            render: (h, data) => {
              let status = {"0": "未开始", "1": "进行中", "2": "已暂停", "3": "已中止","4": "已结束"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {
                  }, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status == '0' ? 'gray ' : data.row.status == '1' ? '#6FBA2C' : data.row.status == '2' ? '#F8BB2C' : data.row.status == '3' ? 'red' : '#00a0e9'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
        //  {title: '状态', key: 'status', align: 'center', width: 120,sortable:'true',},
          {title: '项目名', key: 'projectName', align: 'center', width: 250,sortable:'true',},
          {title: '实验名', key: 'testName', align: 'center', width: 250,sortable:'true',},
          {title: '实验开始时间', key: 'beginDate', align: 'center', width: 200,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.beginDate?this.$dateformat(params.row.beginDate, "yyyy-mm-dd HH:MM:ss"):'');
            }},
          {title: '实验结束时间', key: 'endDate', align: 'center', width: 200,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.endDate?this.$dateformat(params.row.endDate, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '实际开始时间', key: 'actualStartDate', align: 'center', width: 200,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.actualStartDate?this.$dateformat(params.row.actualStartDate, "yyyy-mm-dd HH:MM:ss"):'');
            }},
          {
            title: '实际结束时间', key: 'actualEndDate', align: 'center', "width": 200, ellipsis: true,sortable:'true',
            render: (h, params) => {
              return h('div', params.row.actualEndDate?this.$dateformat(params.row.actualEndDate, "yyyy-mm-dd HH:MM:ss"):'');
            }
          },
          {title: '创建人', key: 'username', align: 'center', "width": 160},
          {
            title: '操作', key: 'action', width: 190, fixed: 'right', align: 'center',
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
        equipId:'',
        testId:'',
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('noBtn');
      }
    },
    mounted() {
      this._page();
    },
    methods: {
      _page() {
        this.$store.dispatch('LmsStaffManage/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsStaffManage.page;
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
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        return this.$extend(data, this.pageParams);
      },
      _btnClick(msg) {
        switch (msg) {
          case '导出' :
            this._export();
            break;
        }
      },
      _export(){
        alert('导出')
      },
      _iconClick(res, data) {
        switch (res) {
          case '开始' :
            this._start(data.row.id);
            break;
          case '暂停' :
            this._pause(data.row.id);
            break;
          case '中止' :
            this._suspend(data.row.id);
            break;
          case '结束' :
            this._finish(data.row.id);
            break;
          case '附件维护' :
            this._file(data.row.id);
            break;
          case '批注' :
            this._postil(data.row.id);
            break;
        }
      },
      _start(id,content){
        this.testId=id;
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定开始该实验？',
          onOk: () => {
            this.$store.dispatch('LmsStaffManage/startByIds', id).then(() => {
              if (this.$store.state.LmsStaffManage.success) {
                this.$Message.success('实验已开始！');
                this._search();
                this.selectIds = [];
              }
            });
          }
        });
      },
      _pause(id,content){
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定暂停该实验？',
          onOk: () => {
            this.$store.dispatch('LmsStaffManage/pauseByIds', id).then(() => {
              if (this.$store.state.LmsStaffManage.success) {
                this.$Message.success('实验已暂停！');
                this._search();
                this.selectIds = [];
              }
            });
          }
        });
      },
      _suspend(id,content){
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定中止该实验？',
          onOk: () => {
            this.$store.dispatch('LmsStaffManage/suspendByIds', id).then(() => {
              if (this.$store.state.LmsStaffManage.success) {
                this.$Message.success('实验已中止！');
                this._search();
                this.selectIds = [];
              }
            });
          }
        });
      },
      _finish(id,content){
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定结束该实验？',
          onOk: () => {
            this.$store.dispatch('LmsStaffManage/finishByIds', id).then(() => {
              if (this.$store.state.LmsStaffManage.success) {
                this.$Message.success('实验已结束！');
                this._search();
                this.selectIds = [];
              }
            });
          }
        });
      },
      _file(id){
        this.$refs.fileModal._open(id);
      },
      _postil(id){
        this.$refs.postilModal._open(id);
      },
    },
  }
</script>
