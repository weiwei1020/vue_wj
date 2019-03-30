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
            <Form id="search-form-fee" inline onsubmit="return false" :label-width="70">
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
              <Form-item style="width: 26%" label="故障类型:">
                <Select style="width:100%" clearable filterable v-model="breakdown" @on-change="_breakdownChange">
                  <Option v-for="item in typeList" :value="item.name" :key="item.name">{{ item.name}}</Option>
                </Select>
                <input name="breakdown" type="hidden"/>
              </Form-item>
              <Form-item class="marginLeft-70">
                <Button type="primary" @click="_formSearch" class="width-80">搜索</Button>
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
            <Col span="10">
            <!--pie-->
            <Pie ref="testPieModal" @on-result-change="_pieResult"></Pie>
            </Col>
            <Col span="14">
            <!--table-->
            <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                       ref="pageTable" :getPage="getPage">

            </PageTable>
            </Col>
          </Row>
          </Col>
        </Row>
      </div>
    </div>
    <!--选择人员-->
    <Equip ref="equipModal" @on-result-change="_equipResult"></Equip>
  </div>
</template>

<script>
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import Pie from './Pie'
  import Equip from '../lms-equip-repair-analyse/Equip'
  import PageTable from '../../../components/table/PageTable'
  import {http} from '../../../api/http'
  export default {
    components: {
      BreadCrumbs,
      Pie,
      Equip,
      PageTable
    },
    data() {
      return {
        beginDate: new Date(),
        endDate: new Date(),
        groupName: '',
        equipName: '',
        tableHeight: '200',
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {title: '仪器名称', key: 'equipName', ellipsis: true,},
          {title: '仪器编号', key: 'equipNumber', ellipsis: true,},
          {title: '维修费用', key: 'repairFee', ellipsis: true,},
          {title: '故障原因', key: 'breakdown', ellipsis: true,},
          {title: '维修人员', key: 'repairerNames', ellipsis: true,},
          {
            title: '维修时间', width: 150, key: 'repairStartTimeAct', align: 'center',
            render: (h, params) => {
              if (!params.row.repairStartTimeAct) {
                return '';
              }
              return h('div', this.$dateformat(params.row.repairStartTimeAct, "yyyy-mm-dd"));
            },
          },
        ],
        getPage: {},
        btnVal: 240,
        dVal: 57,
        typeList: [],
        breakdown: '',
        selectIds:[]
      }
    },
    mounted() {
      this._contHide();

    },
    methods: {
      _beginDateChange(data) {
        $('input[name=beginDate]').val(data);
        this.beginDate = data;
      },
      _breakdownChange(data) {
        $('input[name=breakdown]').val(data);
      },
      _dicSearch() {
        this.$store.dispatch('LmsBaseDict/getItem', '仪器故障原因').then(() => {
          this.typeList = this.$store.state.LmsBaseDict.item;
        });
      },
      _pieResult(data){
        $('input[name=breakdown]').val(data);
        this._pageFeeAnalyse();
      },
      _endDateChange(data) {
        $('input[name=endDate]').val(data);
        this.endDate = data;
      },
      _contHide() {
        this.tableHeight = this.$tableHeight(0, this.btnVal, this.dVal);
        var date_ = new Date();
        var year = date_.getFullYear();
        var firstdate = year + '-01' + '-01'
        this.beginDate = firstdate;
        $('input[name=beginDate]').val(firstdate);
        $('input[name=endDate]').val(this.$dateformat(new Date(), 'yyyy-mm-dd'));
        this._dicSearch();
        this._pageFeeAnalyse();
        this.$refs.testPieModal._open({beginDate: firstdate, endDate: this.$dateformat(new Date(), 'yyyy-mm-dd')})
      },
      _pageFeeAnalyse() {
        this.$refs.pageTable._page('search-form-fee', 'StatisticEquipRepair/page');
      },
      _formSearch() {
        this._pageFeeAnalyse();
        this.$refs.testPieModal._openPie({
          equipName: this.equipName, equipId: this.equipId, beginDate: this.$dateformat(this.beginDate, 'yyyy-mm-dd'),
          endDate: this.$dateformat(this.endDate, 'yyyy-mm-dd'), breakdown: this.breakdown
        })
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.StatisticEquipRepair.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
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
            http.open('/statistics/v1/equip_repair/export_equip_repair_fee?ids='+ids
            );
          }
        });
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
      _testSearch() {
        $('input[name=equipId]').val('');
        this._page();
      },
    }
  }
</script>
