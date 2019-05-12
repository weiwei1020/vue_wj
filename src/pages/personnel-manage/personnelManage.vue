<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24">
            <Form id="search-form" style="height: 43px;" inline onsubmit="return false" :label-width="70">
              <label class="label-sign"></label>
              <Form-item class="width-22" label="人员名称:">
                <Input name="personName" placeholder="请输入人员名称" @on-enter="_search"/>
              </Form-item>
              <Form-item class="search-btn">
                <Button type="primary" @click="_search">搜索</Button>
              </Form-item>
            </Form>
          </Col>
          <!--操作-->
          <Col span="24">
            <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </Col>
          <Col span="24" >
            <ElementTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                          ref="pageTable" :getPage="getPage" hideCheckbox>
              <el-table-column
                show-overflow-tooltip
                sortable
                :prop="item.key"
                :label="item.title"
                :min-width="item.width"
                :fixed="item.fixed?item.fixed:undefined"
                v-for="item in pageColumns" :key="item.key"
                :render-header="headers">
                <template slot-scope="scope">
                  <span>{{scope.row[item.key]}}</span>
                </template>
              </el-table-column>
              <template slot="col">
                <el-table-column
                  label="操作"
                  align="center"
                  :width="140"
                  fixed="right">
                  <template slot-scope="scope">
                    <IconList
                      :msg="iconMsg" @on-result-change="_iconClick" :rowData="scope.row"></IconList>
                  </template>
                </el-table-column>
              </template>
            </ElementTable>
          </Col>
        </Row>
      </div>
    </div>
    <!--添加，编辑-->
    <personnelManageEdit ref="editModal"   @on-result-change="_search"></personnelManageEdit>
  </div>
</template>
<script>
  import personnelManageEdit from './personnelManageEdit'
  import IconList from '../../components/base/IconList.vue'
  import BreadCrumbs from '../../components/base/BreadCrumbs'

  export default {
    components: {
      personnelManageEdit,
      IconList,
      BreadCrumbs
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
        ],
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'trash-a', id: '', name: '删除'},
        ],
        selectIds: [],
        getPage:{},
        pageColumns: [
          {title: '人员名称', key: 'personName', width: 160, },
          {title: '年龄', key: 'personAge', width: 160, },
          {title: '性别', key: 'personGender', width: 160, },
          {title: '所属角色', key: 'personRoleName',  width: 200,},
        ],
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
        this.$refs.pageTable._page('search-form', 'PersonnelManage/page');
      },
      _search() {
        this.$refs.pageTable._pageChange(1);
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage =this.$store.state.PersonnelManage.page;
            break;
          case 'iconClick':
            this._iconClick(data.name, data.rowData);
            break;
          default :
            this._page();
        }
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
        }
      },
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true,data.personId);
            break;
          case '删除' :
            this._deleteById(data.personId);
            break;
        }
      },
      _editModal(edit,id){
        if (edit) {
          // 编辑
          this.$store.dispatch('PersonnelManage/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.PersonnelManage.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open();
        }
      },
      _deleteById(id,content){
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该人员？',
          onOk: () => {
            this.$store.dispatch('PersonnelManage/deleteById', id).then(() => {
              if (this.$store.state.PersonnelManage) {
                this.$Message.success('删除成功！');
                this._search();
                this.selectIds = [];
              }
            });
          }
        });
      },
    },
  }
</script>
