<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 20px">
            <Form id="search-form" inline onsubmit="return false" :label-width="70">
              <label class="label-sign"></label>
              <Form-item class="width-23" label="耗材名称:">
                <input name="purchaseType" v-model="purchaseType" type="hidden"/>
                <input name="status" v-model="status" type="hidden"/>
                <Input name="name" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
              </Form-item>
              <Form-item class="search-btn">
                <Button type="primary" @click="_formSearch">搜索</Button>
              </Form-item>
            </Form>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
            <ElementTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                          ref="pageTable" :getPage="getPage" hideCheckbox
                          :warnKey="'testEndTime'">
              <el-table-column
                show-overflow-tooltip
                :prop="item.key"
                :label="item.title"
                :min-width="item.width"
                :align="item.align"
                :fixed="item.fixed?item.fixed:undefined"
                v-for="item in pageColumns" :key="item.id">
                <template slot-scope="scope">
                  <span v-if="item.status">
                    <span v-if="scope.row[item.key]==0" class="yellow-color">
                      待审批
                    </span>
                    <span v-else-if="scope.row[item.key]==1" class="green-color">
                      已通过
                    </span>
                     <span v-else-if="scope.row[item.key]==2" class="red-color">
                      已驳回
                    </span>
                    <span v-else-if="scope.row[item.key]==3" class="yellow-color">
                      待归还
                    </span>
                  </span>
                  <span v-else>{{scope.row[item.key]}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                :width="180"
                fixed="right">
                <template slot-scope="scope">
                  <IconList :msg="scope.row.status =='3'?iconMsg:iconMsgDis" @on-result-change="_iconClick"
                            :rowData="scope.row"
                            :rowIndex="scope.$index"></IconList>
                </template>
              </el-table-column>
            </ElementTable>
          </Col>
        </Row>
      </div>
    </div>
    <!--添加进归还单-->
    <LmsChemicalReturnAdd ref="addModel" @on-result-change="_search"></LmsChemicalReturnAdd>
  </div>
</template>
<script>
  import ElementTable from '../../../components/table/ElementTable'
  import IconList from '../../../components/base/IconList.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import LmsChemicalReturnAdd from './LmsChemicalReturnAdd.vue'


  export default {
    components: {
      ElementTable,
      IconList,
      BreadCrumbs,
      LmsChemicalReturnAdd
    },
    data() {
      return {
        iconMsg: [
          { type: 'ios-undo', id: '', name: '归还' },
          { type: 'trash-b', id: '', name: '用尽' },

        ],
        iconMsgDis: [
          { type: 'ios-undo', id: '', name: '归还',disabled:true },
          { type: 'trash-b', id: '', name: '用尽',disabled:true },
        ],
        purchaseType:'1',
        status:'3',
        name:'',
        heightSearch: '',
        pageColumns: [
          {title: '领用单编号', key: 'purchaseNumber', width: 150, align: 'center', ellipsis: true,sortable:'true', fixed: 'left'},
          {title: '申请人', key: 'purchasePerson', width: 120, align: 'center', ellipsis: true,sortable:'true', },
          {title: '耗材名称', key: 'name', width: 180, align: 'center', ellipsis: true,sortable:'true', },
          {title: '领用数量', key: 'consunmableStock', width: 140, align: 'center', ellipsis: true,sortable:'true', },
          {title: '状态', key: 'status', width: 150,sortable:'true',status:true,
          },
          {title: '领用原因', key: 'reason', ellipsis: true, width: 350,sortable:'true',},
          {title: '备注', key: 'purchaseRemark', width: 180, align: 'center', ellipsis: true,sortable:'true', },
          {title: '创建时间', key: 'ctime', width: 160,sortable:'true',},
          {title: '最后修改时间', key: 'ltime', width: 160,sortable:'true',},
        ],
        noBtnVal: 250,
        dVal: 57,
        getPage: {}
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('search');
      }
    },
    mounted() {
      this._search();
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '归还':
            this._submitApprove(data);
            break;
          case '用尽':
            this._useUpById(data);
            break;
        }
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsChemicalApply/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _submitApprove(data) {
        this.$refs.addModel._open(data);
      },
      _useUpById(data) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定已用尽？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalReturn/useUpById', data).then(() => {
              if (this.$store.state.LmsChemicalReturn.success) {
                this._search();
                this.$Message.success('操作成功！');
              }
            });
          }
        });
      },
      _editModal(id) {
        // 编辑
        this.$store.dispatch('LmsChemicalApply/getById', id).then(() => {
          this.$refs.editModal._open(this.$store.state.LmsChemicalApply.model);
        });
      },
      _search() {
        this._page();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalApply.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
<style>
  .yellow-color{
    color:#F8BB2C;
  }
</style>
