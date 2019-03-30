<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row style="margin-top: 10px;">
          <!--查询条件-->
          <Col span="24">
          <div class="fl">
            <Form id="search-form" inline onsubmit="return false" :label-width="70">
              <label class="label-sign"></label>
              <Form-item label="分析仪器:">
                <Input v-model="equipName" placeholder="请选择分析仪器" class="width-170"
                       @on-click="_selectUser" icon="plus" @on-enter="_testSearch"></Input>
                <input name="equipId" type="hidden"/>
                <input name="equipName" type="hidden"/>
              </Form-item>
              <Form-item label="日期:" style="margin-left: -20px;">
                <DatePicker type="date" style="width:115px" v-model="beginDate" :editable="false"
                            @on-change="_beginDateChange"></DatePicker>
                <label class="line-color">——</label>
                <DatePicker type="date" style="width:115px" v-model="endDate" :editable="false"
                            @on-change="_endDateChange"></DatePicker>
                <input name="beginDate" type="hidden"/>
                <input name="endDate" type="hidden"/>
              </Form-item>
              <Form-item class="marginLeft-70">
                <Button type="primary" @click="_search" class="width-80">搜索</Button>
              </Form-item>
            </Form>
          </div>
          <div class="fr">
            <Button @click="_export" class="width-80">导出</Button>
          </div>
          <div class="clear"></div>
          </Col>
          <!--内容-->
          <Col span="24" style="margin-bottom: 10px">
          <Row :gutter="16">
            <Col span="14">
            <!--table-->
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border highlight-row
                   :height="tableHeight" @on-selection-change="_selectRowChange" @on-select-all='_selectAll'
                   class="tableClassName" @on-row-click="_rowChange"
            ></Table>
            <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                  @on-page-size-change='_pageSizeChange'
                  placement="top" show-elevator show-total show-sizer style="margin-top: 10px;"></Page>
            </Col>
            <Col span="10">
            <!--pie-->
            <Pie ref="testPieModal"></Pie>
            </Col>
          </Row>
          </Col>
        </Row>
      </div>
    </div>

    <Equip ref="equipModal" @on-result-change="_equipResult"></Equip>
  </div>
</template>

<script>
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import Pie from './Pie'
  import Equip from './Equip'
  import PageTable from '../../../components/table/PageTable'
  import {http} from '../../../api/http'

  export default {
    components: {
      BreadCrumbs,
      Pie,
      Equip,
      PageTable,
    },
    data() {
      return {
        loading:true,
        beginDate: new Date(),
        endDate: new Date(),
        equipName: '',
        equipId:'',
        tester: '',
        selectIds: [],
        tableHeight: '200',
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {title: '仪器名称', key: 'equipName', ellipsis: true, },
          {title: '仪器编号', key: 'equipNumber', ellipsis: true,},
          {title: '维修费用', key: 'allFee', ellipsis: true,},
          {title: '故障次数', key: 'playCount', ellipsis: true,},
        ],
        getPage: {},
        btnVal: 240,
        dVal: 57,
        typeList:[],
        pageParams: {
          rows: 20,
        },
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _beginDateChange(data){
        $('input[name=beginDate]').val(data);
        this.beginDate = data;
      },
      _dicSearch() {
        this.$store.dispatch('LmsBaseDict/getItem', '仪器故障原因').then(() => {
          this.typeList = this.$store.state.LmsBaseDict.item;
        });
      },
      _endDateChange(data){
        $('input[name=endDate]').val(data);
        this.endDate = data;
      },
      _contHide() {
        this.tableHeight = this.$tableHeight(0, this.btnVal, this.dVal);
        var date_ = new Date();
        var year = date_.getFullYear();
        var firstdate = year +  '-01' + '-01'
        this.beginDate = firstdate;
        $('input[name=beginDate]').val(firstdate);
        $('input[name=endDate]').val(this.$dateformat(new Date(), 'yyyy-mm-dd'));
        this._page();
        this._dicSearch()
      },
      _search(){
        this._page();
        this.$refs.testPieModal._openPie({equipName:this.equipName,equipId:this.equipId,beginDate:this.$dateformat(this.beginDate, 'yyyy-mm-dd'),
          endDate:this.$dateformat(this.endDate, 'yyyy-mm-dd')})
      },
      _page() {
        this.$store.dispatch('StatisticEquipRepair/pageAna', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.StatisticEquipRepair.page;
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
      //多选
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].equipId);
        }
        this.selectIds = idList;
        console.log(this.selectIds,'this.selectIds')
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        return this.$extend(data, this.pageParams);
      },
      _export() {
        var ids = this.selectIds;
        if (ids.length === 0) {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._exportByIds(ids, '确定导出 ' + ids.length + ' 条记录？');
        }
      },
      _exportByIds(ids, content) {

        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            let beginDate = this.$dateformat(this.beginDate, 'yyyy-mm-dd')
            let endDate = this.$dateformat(this.endDate, 'yyyy-mm-dd')
            http.open('/statistics/v1/equip_repair/export_equip_analysis?beginDate='+beginDate+
              '&endDate='+endDate+'&ids='+ids
            );
          }
        });
      },
      _rowChange(data){
        this.$refs.testPieModal._tableOpen(data)
      },
      _selectUser() {
        this.$refs.equipModal._open();
      },
      _equipResult(data) {
        this.equipName = data.name;
        $('input[name=equipId]').val(data.id);
        $('input[name=equipName]').val(data.name);
      },
      //人员回车查询（显示所有）
      _testSearch(){
        $('input[name=equipId]').val('');
        this._page();
      },
    }
  }
</script>
