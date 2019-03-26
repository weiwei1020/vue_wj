<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="1100">
      <p slot="header">{{modalTitle}}</p>
      <!--内容-->
      <div class="layout-content-padding">
        <div class="layout-content-main">
          <Row>
            <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border
                   highlight-row stripe :height="tableHeight" ></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" :page-size="getPage.size"  :current="getPage.current" @on-change="_pageChange"
                  @on-page-size-change='_pageSizeChange'
                  placement="top" show-elevator show-total show-sizer></Page>
            <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate"  :label-width="70" inline>
              <Form-item label="批注：" prop="remark" style="width: 73%">
                <Input name="remark" v-model="formObj.remark" placeholder="请输入批注" type="textarea" :rows="5"></Input>
              </Form-item>
              <Form-item label="通知人：" prop="idsPerson" style="width: 25%">
                <Select name="idsPerson" v-model="formObj.idsPerson" multiple :label-in-value="true" >
                  <Option v-for="item in pnameList" @click.native="getUser(item)" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
              </Form-item>
            </Form>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'
  import PageTable from '../../../components/table/PageTable'
  const defVal = {
    name: '',
    idsPerson:'',
    remark: '',
    ids:[],
  };
  export default {
    components: {
      BreadCrumbs,
      IconList,
      PageTable
    },
    data() {
      return {
        tableHeight: '330',
        modalTitle: '',
        showEditModal: false,
        formObj: defVal,
        ruleValidate: {
          remark: [{required: true, message: '批注不能为空', trigger: 'blur'}],
        },
        //  loading: true,
        pageParams: {
          rows: 20,
        },
        getPage: {},
        pageColumns: [
          {title: '批注人', key: 'username', width: 100, ellipsis: true},
          {title: '批注内容', key: 'remark', ellipsis: true},//todo 修改内容
          {title: 'idsPerson', key: 'testName', ellipsis: true,width: 160,},
          {title: '批注时间', key: 'ctime', width: 160, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
        ],
        contLength: 0,
        id:'',
        testId:'',
        pnameList:[
          {
            id: 1111111,
            name: '小明'
          },
          {
            id: 2222222222,
            name: '小美'
          },
          {
            id: 333333,
            name: '小happy'
          }
        ],
        names:[],
        NameData:[],
        pName:[],
      }
    },
     computed: {
       getPage() {
         return this.$store.state.LmsStaffLevel.page;
       }
     },
    mounted() {
    },
    methods: {
      _open(id) {
        this.showEditModal = true;
        this.modalTitle = '批注';
        this.id=id;
        this._page();
      },
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._search();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _page() {
        this.$store.dispatch('LmsStaffLevel/testChangeById', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsStaffLevel.page;
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
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form-order');
       // Object.assign(data, {testId:this.id,});
        return this.$extend(data, this.pageParams);
      },
      _ok(){
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            let data = this.$serialize('edit-form');
            data.idsPerson=this.formObj.idsPerson.join(',');
            this.$extend(data, {remark:this.formObj.remark});
              this.$store.dispatch('LmsStaffManage/process', data).then(() => {
                this._resultChange('添加成功!');
              });
          } else {
            //this.showEditModal = true;
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel(){
        this.showEditModal = false;
      },
      getUser(item){
        this.formObj.ids = item.id;
      },
    },
  }
</script>



