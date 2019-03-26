<template>
  <div>
    <Row>
      <!--查询-->
      <Col span="24">
        <Form id="search-form" inline onsubmit="return false" :label-width="70">
          <label class="label-sign"></label>
          <Form-item class="width-23" label="实验名称:">
            <Input name="testName" placeholder="请输入实验名称" @on-enter="_formSearch"/>
          </Form-item>
          <Form-item class="search-btn">
            <Button type="primary" @click="_formSearch">搜索</Button>
          </Form-item>
        </Form>
      </Col>
      <Col span="24">
        <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                   ref="pageTable" :getPage="getPage">
        </PageTable>
      </Col>
    </Row>
    <LmsStaffScheduleDetail ref="detailModal"></LmsStaffScheduleDetail>
  </div>
</template>
<script>
  import LmsStaffScheduleEdit from './LmsStaffScheduleEdit.vue'
  import LmsStaffScheduleDetail from './LmsStaffScheduleDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsStaffScheduleEdit,
      LmsStaffScheduleDetail,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'staff-schedule-add', name: '添加'},
          {type: 'error', id: 'staff-schedule-batch-delete', name: '删除'},
        ],
        heightSearch: '',
        tableHeight: '300',
        selectIds: [],
        pageColumns: [
          {title: '实验名称', key: 'testName',"width": 200, sortable: 'true',},
          {title: '实验人员', key: 'uname',"width": 200, sortable: 'true',},
          {
            title: '开始时间', key: 'beginDate', "width": 200, sortable: 'true',
            render: (h, params) => {
              let date = params.row.beginDate ? this.$dateformat(params.row.beginDate, "yyyy-mm-dd HH:MM:ss") : '';
              return h('div', date);
            }
          },
          {
            title: '结束时间', key: 'endDate', "width": 200, sortable: 'true',
            render: (h, params) => {
              let date = params.row.endDate ? this.$dateformat(params.row.endDate, "yyyy-mm-dd HH:MM:ss") : '';
              return h('div', date);
            }
          },
          {title: '备注', key: 'remark',  sortable: 'true',},
        ],
        getPage: {},
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 57,
        scheduleStartTime: '',
        scheduleEndTime: '',
      }
    },
    methods: {
      _dateResult(date) {
        this.scheduleStartTime = date[0];
        this.scheduleEndTime = date[1];
      },
      _open() {
        this._initCont();
      },
      _initCont() {
        this.contLength = $(".contHide").find('button').length;
        if (this.contLength) {
          this.tableHeight = this.$newTableHeight('tabBtn');
        } else {
          this.tableHeight = this.$newTableHeight('tabNoBtn');
        }
        this._page();
      },

      _page() {
        // this._shiftChange('');
        this.$refs.pageTable._page('search-form', 'LmsStaffSchedule/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsStaffSchedule/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsStaffSchedule.model);
        });
      },
      _search() {
        this._page();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsStaffSchedule.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
