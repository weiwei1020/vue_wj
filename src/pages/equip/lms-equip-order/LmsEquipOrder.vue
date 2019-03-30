<template>
  <div>
    <!--&lt;!&ndash; 面包屑 &ndash;&gt;
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>-->
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 0px;">
          <!--<Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="width-22" label="仪器名称:">
              <Input name="name" placeholder="请输仪器名称" @on-enter="_search"/>
            </Form-item>
            <Form-item class="width-22" label="仪器编号:">
              <Input name="equipNum" placeholder="请输仪器编号" @on-enter="_search"/>
            </Form-item>
            &lt;!&ndash;<Form-item class="width-22" label="状态:">
              <Select name="status" clearable placeholder="请选择状态">
                <Option v-for="item in statusList" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </Form-item>&ndash;&gt;
            <Form-item class="width-22" label="预约时间:">
              <DatePicker type="datetimerange" placement="bottom-end" placeholder="请选择预约时间" style="width:100%"
                          @on-change="_getDate"></DatePicker>
              <input type="hidden" name="queryStartDate" v-model="queryStartDate">
              <input type="hidden" name="queryEndDate" v-model="queryEndDate">
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_search">搜索</Button>
            </Form-item>
          </Form>-->
          </Col>
          <!--操作-->
          <!--<Col span="24" style="margin-bottom: 10px;">
          <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </Col>-->
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :loading='loading' :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
                 stripe
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
    <!-- 添加、编辑 -->
    <!--<LmsEquipOrderEdit ref="editModal" @on-result-change="_search"></LmsEquipOrderEdit>-->
    <!-- 查看详情 -->
    <!-- 采购详情 -->
    <LmsEquipOrderDetail ref="LmsEquipOrderDetail" @on-result-change="_search"></LmsEquipOrderDetail>
    <!-- 修改记录 -->
    <LmsEquipOrderChangeDetail ref="LmsEquipOrderChangeDetail" @on-result-change="_search"></LmsEquipOrderChangeDetail>
  <!--  &lt;!&ndash; 开始 &ndash;&gt;
    <LmsEquipOrderStart ref="startOrderModal" @on-result-change="_search"></LmsEquipOrderStart>
    &lt;!&ndash; 保养 &ndash;&gt;
    <LmsEquipOrderFinish ref="finishOrderModal" @on-result-change="_search"></LmsEquipOrderFinish>-->
  </div>
</template>
<script>
  //import LmsEquipOrderStart from './LmsEquipOrderStart.vue'
  //import LmsEquipOrderFinish from './LmsEquipOrderFinish.vue'
  //import LmsEquipOrderEdit from './LmsEquipOrderEdit.vue'
  import LmsEquipOrderDetail from './LmsEquipOrderDetail.vue'
  import LmsEquipOrderChangeDetail from './LmsEquipOrderChangeDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
     // LmsEquipOrderStart,
      //LmsEquipOrderFinish,
     // LmsEquipOrderEdit,
      LmsEquipOrderDetail,
      LmsEquipOrderChangeDetail,
      BtnList,
      BreadCrumbs,
      IconList
    },
    data() {
      return {
        btn: [
          /*{type: 'success', id: 'equip-order-submit', name: '撤回'},
         {type: '', id: 'equip-order-batch-delete', name: '删除'},
        {type: '', id: 'equip-order-abolish', name: '废止'},
         {type: 'success', id: 'equip-order-add', name: '添加'},*/

        ],
        statusList:[
          {value:'DRAFT',label:'待审批'},
          {value:'TECHNOLOGY_CHECK',label:'已审批'},
        /*  {value:'TECHNOLOGY_CHECK_PASS',label:'技术主管审批通过'},
          {value:'TECHNOLOGY_CHECK_BACK',label:'技术主管审批不通过'},
          {value:'CHECK_END',label:'审批完成'},
          {value:'WAIT_USE',label:'待使用'},
          {value:'USING',label:'使用中'},
          {value:'USE_END',label:'使用完成'},
          {value:'SUBMITTED',label:'已提交'},
          {value:'ABOLISH',label:'废止'},*/
        ],
        equiptatusList:[
          {value:'0',label:'闲置'},
          {value:'1',label:'在用'},
          {value:'2',label:'保养中'},
          {value:'3',label:'维修中'},
          {value:'4',label:'已报废'},
        ],
       /* adviceList:[
          {value:'0',label:'驳回'},
          {value:'1',label:'同意'},
        ],*/
        loading: true,
        tableHeight: '',
        selectIds: [],
        pageParams: {
          rows: 20,
        },
        queryStartDate: '',
        queryEndDate: '',
        selectData: [],
        pageColumns: [
          {
            title: '申请状态', key: 'status', "width": 150, align: 'center',"ellipsis": true,sortable:'true',
            render: (h, data) => {
              return h('div', data.row.status.display);
            }
          },
          {
            title: '仪器名称', key: 'names',  align: 'center', ellipsis: true,sortable:'true',
          },
          {title: '申请人', key: 'applyName', width: 100, align: 'center', ellipsis: true,sortable:'true',},
         {
            title: '申请时间', key: 'applyTime', "width": 180, align: 'center',sortable:'true',
            render: (h, params) => {
              return h('div', params.row.applyTime ? this.$dateformat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '操作', key: 'action', width: 200, align: 'center',
            render: (h, data) => {
               let recallObj={type: 'reply', id: '', name: '撤回'};
              let infoObj= {type: 'android-document', id: '', name: '详细信息'};
              let historyObj={type:'document',id:'',name:'修改记录'};
              let iconMsg = [];
              if (data.row.status.value === 'TECHNOLOGY_CHECK') {
                iconMsg.push(recallObj);
                iconMsg.push(infoObj);
                iconMsg.push(historyObj);

              }
              return h('div',  [
                h(IconList, {
                  props: {msg: iconMsg},
                  on: {
                    'on-result-change': (res) => {
                      this._iconClick(res, data)
                    }
                  }
                },),
              ]);
            }
          }
        ],
        contLength: 0,
        getPage:{},
      }
    },
    mounted() {
      this._initCont(); //判断‘添加’一栏是否隐藏
    },
    methods: {
      _initCont() {
        this.contLength = $(".contHide").find('button').length;
        if (this.contLength) {
          this.tableHeight = this.$newTableHeight('btn');
        } else {
          this.tableHeight = this.$newTableHeight('noBtn');
        }
        this._search();
      },
      _iconClick(res, data){
        switch (res) {
          case '撤回' :
            this.recallOrderByGroupId(data.row.groupId);
            break;
         /* case '删除' :
            this._deleteById(data.row.groupId);
            break;*/
          case '详细信息':
            this._orderDetail(data.row.groupId);
            break;
          case '修改记录':
            this._changeDetail(data.row.groupId);
            break;
        }
      },
      _orderDetail(id){
        this.$refs.LmsEquipOrderDetail._open(id);
      },
      _changeDetail(id){
        this.$refs.LmsEquipOrderChangeDetail._open(id);
      },
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
      },
      _page() {
        this.$store.dispatch('LmsEquipOrder/applyPage', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage= this.$store.state.LmsEquipOrder.page;
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
        let idList = [];
        for (let i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectData = data;
        this.selectIds = idList;
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/deleteOrderByGroupId', ids).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._search();
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },
      _deleteById(id) {
        // 删除一条记录
        this._deleteByIds([id]);
      },
      _deleteSelected() {
        // 批量删除
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(ids, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipOrder/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipOrder.model);
        });
      },
      recallOrderByGroupId(groupId,content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定撤回该申请？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/recallOrderByGroupId', groupId).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
                this._search();
                this.$Message.success('撤回成功！');
              }
            });
          }
        });
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        data.status='TECHNOLOGY_CHECK';
        return this.$extend(data, this.pageParams);
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
          case '删除':
            this._deleteSelected();
            break;
        }
      },

    },
  }
</script>
