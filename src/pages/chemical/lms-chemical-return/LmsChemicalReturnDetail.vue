<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Row>
          <!-- 采购单基本信息 -->
          <Col span="24" style="margin-bottom: 10px">
          <table class="tableClass">
            <tbody>
            <tr>
              <th>归还单编号</th>
              <td>{{purchaseOrder.giveNum}}</td>
              <th>创建时间</th>
              <td>{{this.$dateformat(purchaseOrder.ctime, "yyyy-mm-dd HH:MM")}}</td>
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
        <Button @click="_recall" id="recallApproveBtn" type="danger">驳回归还申请</Button>
        <Button @click="_ok" id="submitApproveBtn" type="success">归还入库</Button>
      </div>
    </Modal>
    <!-- 驳回原因 -->
    <LmsChemicalDelEdit ref="delModal" @on-result-change="_search"></LmsChemicalDelEdit>
  </div>
</template>
<script>
  import BtnList from '../../../components/base/BtnList.vue'
  import LmsChemicalDelEdit from './LmsChemicalDelEdit.vue'


  export default {
    components: {
      BtnList,
      LmsChemicalDelEdit,
    },
    data() {
      return {
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
        this.queryData.id = this.purchaseOrder.id;
        this.queryData.obj = this._searchParams();
        this.$store.dispatch('LmsChemicalReturn/purchaseChemicalPage', this.queryData).then(() => {
          this.loading = false;
          this.formObj = this.$store.state.LmsChemicalReturn.page;
        });
      },
      //驳回
      _recall(){
        this.$store.dispatch('LmsChemicalReturn/getById', [this.purchaseOrder.id]).then(() => {
          this.$refs.delModal._open(this.$store.state.LmsChemicalReturn.model);
          this.showEditModal = false;
          this.$emit("on-result-change");
        });
      },
      _ok(){
            let data = this.$serialize('edit-form');
            data.id = this.purchaseOrder.id;
            data.status=1;
            this.$store.dispatch('LmsChemicalReturn/approval', data).then(() => {
              if (this.$store.state.LmsChemicalReturn.success) {
                this._resultChange('已归还入库！');
              }
            });
      },
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalReturn.success) {
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(data) {
        this.purchaseOrder = data;
        let status = data.status;
        $('#recallApproveBtn').show();
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
        this.modalTitle = '归还单详情';
        pageColumns.push({title: '耗材名称', key: 'chemicalName', width: 160,ellipsis: true,});
        pageColumns.push({title: '归还数量', key: 'giveQuantity', ellipsis: true,});
        pageColumns.push({title: '归还时间', key: 'ctime', width: 200, ellipsis: true,dateTime: true,
          render: (h, params) => {
            return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
          }
        });
      /*  pageColumns.push({title: '归还量', key: 'price', width: 200, ellipsis: true});//todo*/
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
