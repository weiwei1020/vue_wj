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
              <Form id="search-form" inline onsubmit="return false" :label-width="70" >
                <label class="label-sign"></label>
                <Form-item  class="width-22" label="计划名称:">
                  <Input name="checkName" placeholder="请输入计划名称"  @on-enter="_formSearch"/>
                </Form-item>
                <Form-item  class="width-22" label="状态:">
                  <Select  name="status" clearable placeholder="请选择状态">
                    <Option  value="0">审批通过</Option >
                    <Option  value="1">提交实施</Option >
                  </Select>
                </Form-item>
                <Form-item class="search-btn">
                  <Button type="primary" @click="_formSearch">搜索</Button>
                </Form-item>
              </Form>
          </Col>
          <!--操作-->
          </Col>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                     ref="pageTable" :getPage="getPage">

          </PageTable>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 添加、编辑 -->
    <LmsEquipCheckManageEdit ref="editModal" @on-result-change="_search"></LmsEquipCheckManageEdit>
    <!-- 查看详情 -->
    <LmsEquipCheckManageDetail ref="detailModal"></LmsEquipCheckManageDetail>
  </div>
</template>
<script>
  import LmsEquipCheckManageEdit from './LmsEquipCheckManageEdit.vue'
  import LmsEquipCheckManageDetail from './LmsEquipCheckManageDetail.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  var dateFormat = require('dateformat');

  export default {
    components: {
      LmsEquipCheckManageEdit,
      LmsEquipCheckManageDetail,
      PageTable,
      BreadCrumbs
    },
    data() {
      return {
        btnObj:{ //按钮权限
          check:'equip-check-manage-check',
        },
        panelVal:'',
        heightSearch: '',
        loading:true,
        tableHeight: '',
        selectIds: [],
        pageParams: {
          rows: 20,

        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center',fixed:'left'},
          {
            title: '状态', key: 'status',  "width": 160, "ellipsis": true,fixed:'left',
            render: (h, data) => {
              var status = {"0": "审批通过", "1": "提交实施"};
              let operate = [];
              if(data.row.status == undefined){
                operate.push(
                  h('div', {
                  }, '无')
                );
              }else{
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status == 0  ? '#F8BB2C' : data.row.status == 1 ? '#00a0e9' : ''
                    }
                  }, status[data.row.status]?status[data.row.status]:'')
                );
              }
              return h('div', operate);
            }
          },
          {title: '计划名称', key: 'checkName', width: 160,fixed:'left'},
          {title: '组织部门', key: 'orgName', width: 160},
          {title: '申请原因', key: 'applyReason', width: 160},
          {
            title: '申请时间', key: 'applyTime', "width": 160,
            render: (h, params) => {
              let applyTime='';
              if(params.row.applyTime!=undefined){
                applyTime=dateFormat(params.row.applyTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', applyTime);
            }
          },
          {title: '申请人', key: 'applyName', width: 160},
          {title: '中心主任意见', key: 'firstStepAdvice', width: 160},
          {
            title: '中心主任审批时间', key: 'firstStepTime', "width": 160,
            render: (h, params) => {
              let firstStepTime='';
              if(params.row.firstStepTime!=undefined){
                firstStepTime=dateFormat(params.row.firstStepTime, "yyyy-mm-dd HH:MM:ss")
              }
              return h('div', firstStepTime);
            }
          },
          {title: '中心主任', key: 'firstStepName', width: 160},
          {title: '实施过程', key: 'process', width: 160},
          {title: '备注', key: 'remark', width: 160},
          {title: '操作', key: 'action', width: 70, align: 'center', fixed:'right',
            render: (h, data) => {
              let operate = [];
              let btnCheck =
                h('Tooltip', {
                  props: {
                    content: '核查',
                    key: '核查',
                    transfer: true
                  }
                }, [
                  h('div', {
                    on: {
                      click: () => {
                        this._editModal(true, data.row.id);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'checkmark',
                      size: 20,
                    },
                    class:'icons',
                    style: {marginRight: '10px',marginTop:'3px'},
                    attrs: {id: this.btnObj.check}, //添加自定义属性
                  })
                  ])
                ]);
              if(data.row.status==0){
                if(this.$showBtn(this.btnObj.check)){
                  operate.push(btnCheck);
                }
              }
              return h('div',operate.length > 0 ? operate : '--');
            }
          }
        ],
        getPage:{},
        contLength: null,
        noBtnVal: 250,
        btnVal: 290,
        dVal: 57
      }
    },
    mounted() {
      this._contHide(); //判断‘添加’一栏是否隐藏
    },
    methods: {
      _contHide(){
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
        this._page();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        switch (this.contLength) {
          case 0 :
            this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
            break;
          default:
            this.tableHeight = this.$tableHeight(val, this.btnVal, this.dVal);
        }
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsEquipCheckManage/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _search() {
        this._page();
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipCheckManage/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipCheckManage.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open();
        }
      },
      _tableResultChange(msg,data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsEquipCheckManage.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
