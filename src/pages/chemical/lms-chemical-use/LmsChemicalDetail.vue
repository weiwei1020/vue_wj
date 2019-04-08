<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1000">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <!--<Collapse style="margin-bottom: 10px;" class="coll-search">
          <Panel>查询条件
            <p slot="content">
            <Form id="edit-form-chemical-purchase" inline onsubmit="return false" :label-width="90">
             &lt;!&ndash; <Form-item class="width-23" label="耗材编号:">
                <Input  name="chemicalNum" placeholder="请输入耗材编号" @on-enter="_search"></Input>
              </Form-item>&ndash;&gt;
              <Form-item class="width-23" label="耗材名称:">
                <Input  name="chemicalName" placeholder="请输入耗材名称" @on-enter="_search"></Input>
              </Form-item>
              <Form-item class="marleft-90">
                <Button type="primary" @click="_search">搜索</Button>
              </Form-item>
            </Form>
            </p>
          </Panel>
        </Collapse>-->
        <Row>
          <Col span="24" style="margin-bottom: 10px;">
         <!-- <div v-show="delBtn">
            <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </div>-->
          </Col>
          <!-- 采购单基本信息 -->
          <Col span="24" style="margin-bottom: 10px">
          <table class="tableClass">
            <tbody>
            <tr>
              <th>订单编号</th>
              <td>{{purchaseOrder.num}}</td>
             <!-- <th>状态</th>
              <td>{{purchaseOrder.status == 0 ? '禁用' : '正常'}}</td>-->
              <th>创建时间</th>
              <td>{{this.$dateformat(purchaseOrder.ctime, "yyyy-mm-dd HH:MM")}}</td>
            </tr>
            <tr>
              <th>申请原因</th>
              <td colspan="5">{{purchaseOrder.remark}}</td>
            </tr>
            </tbody>
          </table>
          </Col>
          <!-- 表格 -->
          <Col span="24">
          <Table :loading="loading" :columns="pageColumns" :data="formObj.records" size="small" border highlight-row
                 stripe :height="300" @on-selection-change="_selectRowChange" @on-select-all='_selectAll'></Table>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_recall" id="recallApproveBtn" type="danger">驳回审批</Button>
        <Button @click="_pass" id="submitApproveBtn" type="success">通过审批</Button>
      </div>
    </Modal>
    <!-- 通过原因 -->
    <LmsChemicalApproveEdit ref="approveModal" @on-result-change="_search"></LmsChemicalApproveEdit>
    <!-- 驳回原因 -->
    <LmsChemicalDelEdit ref="delModal" @on-result-change="_search"></LmsChemicalDelEdit>
  </div>
</template>
<script>
  import BtnList from '../../../components/base/BtnList.vue'
  import LmsChemicalApproveEdit from './LmsChemicalApproveEdit.vue'
  import LmsChemicalDelEdit from './LmsChemicalDelEdit.vue'


  export default {
    components: {
      BtnList,
      LmsChemicalApproveEdit,
      LmsChemicalDelEdit,
    },
    data() {
      return {
        btn:[
          {type:'error',id:'',name:'批量移除'},
        ],
        btnObj:{ //按钮权限
          save:'',
          del:''
        },
        delBtn:false,
        loading: true,
        purchaseOrder: {},
        orderStatus: 0,
        queryData: {},
        formObj: {},
        quantity: '',
        remark: '',
        modalTitle: '',
        showEditModal: false,
        min: 1,
        selectIds: [],
        DATA: {},
        pageColumns: [],
      }
    },
    methods: {
      _page() {
        this.queryData.orderReceiveId = this.purchaseOrder.id;
        this.queryData.obj = this._searchParams();
        this.$store.dispatch('LmsChemicalUse/purchaseChemicalPage', this.queryData).then(() => {
          this.loading = false;
          this.formObj = this.$store.state.LmsChemicalUse.page;
        });
      },
      //驳回
      _recall(){
            this.$store.dispatch('LmsChemicalUse/getById', [this.purchaseOrder.id]).then(() => {
              this.$refs.delModal._open(this.$store.state.LmsChemicalUse.model);
              this.showEditModal = false;
              this.$emit("on-result-change");
            });
      },
      //通过
      _pass(){
            this.$store.dispatch('LmsChemicalUse/getById', [this.purchaseOrder.id]).then(() => {
              this.$refs.approveModal._open(this.$store.state.LmsChemicalUse.model);
              this.showEditModal = false;
              this.$emit("on-result-change");
            });
      },
      _delModal(id) {
        // 驳回原因
        this.$store.dispatch('LmsChemicalUseOrder/getById', id).then(() => {
          this.$refs.delModal._open(this.$store.state.LmsChemicalUse.model);
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(obj) {
        this.purchaseOrder = obj;
       let status = obj.status;
        // 待审批显示 " 提交审批 " 按钮
        if (status == '0') {
          $('#submitApproveBtn').show();
          $('#recallApproveBtn').show();
        } else {
          $('#submitApproveBtn').hide();
          $('#recallApproveBtn').hide();
        }
        let pageColumns = [];
        this.showEditModal = true;
        this.modalTitle = '采购单详情';
        pageColumns.push({title: '耗材编号', key: 'chemicalNumber', width: 150,ellipsis: true,});
        pageColumns.push({title: '耗材名称', key: 'chemicalName', ellipsis: true, });
        pageColumns.push({title: '规格', key: 'spec', width: 100, ellipsis: true});
        pageColumns.push({title: '申请数量', key: 'stockNumber', width: 150, ellipsis: true});
      /*  pageColumns.push({title: '剩余量', key: 'surplusQuantity', width: 150, ellipsis: true});*/
        this.pageColumns = pageColumns;
        // 刷新界面
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('edit-form-chemical-purchase');
        return this.$extend(data);
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
        this._page();
        this.$emit("on-result-change");
      },
    }
  }
</script>
