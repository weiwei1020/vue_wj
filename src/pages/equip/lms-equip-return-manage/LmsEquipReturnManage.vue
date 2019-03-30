<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" class="margin-top-10">
          <Form id="search-form" class="margin-top-10" inline onsubmit="return false" :label-width="70" v-show="searchOpen">
            <label class="label-sign"></label>
            <Form-item class="search-item" label="关键词:">
              <Input name="name" placeholder="请输入关键词" @on-enter="_search"/>
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_search">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <!--操作-->
          <Col span="24" class="margin-bottom-10">
          <BtnList :msg="btn" :open="searchOpen" :showSearchBtn="true" class="contHide"
                   @on-result-change="_btnClick"></BtnList>
          </Col>
          <Col span="24">
          <ElementTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                        ref="pageTable" :getPage="getPage" :iconMsg="iconMsg" :warnKey="'testEndTime'">
            <el-table-column
              show-overflow-tooltip
              :prop="item.key"
              :label="item.title"
              :min-width="item.width"
              :fixed="item.fixed?item.fixed:undefined"
              v-for="item in pageColumns" :key="item.id">
              <template slot-scope="scope">
                <a v-if="item.key==='name'"
                   @click="_detailModal(scope.row.id)">{{scope.row[item.key]}}</a>
                <span v-else-if="item.key==='testEndTime'">{{scope.row[item.key]?$dateformat(scope.row[item.key],'yyyy-mm-dd HH:MM'):''}}</span>
                <span v-else-if="item.key==='dueDate'">{{scope.row[item.key]?$dateformat(scope.row[item.key],'yyyy-mm-dd'):''}}</span>
                <span v-else>{{scope.row[item.key]}}</span>
              </template>
            </el-table-column>
          </ElementTable>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 添加、编辑 -->
    <LmsEquipReturnManageEdit ref="editModal" @on-result-change="_search"></LmsEquipReturnManageEdit>
    <!-- 查看详情 -->
    <LmsEquipReturnManageDetail ref="detailModal"></LmsEquipReturnManageDetail>
  </div>
</template>
<script>
  import BreadCrumbs from '../../../components/base/BreadCrumbs';
  import BtnList from '../../../components/base/BtnList';
  import ElementTable from '../../../components/table/ElementTable';
  import LmsEquipReturnManageEdit from './LmsEquipReturnManageEdit';
  import LmsEquipReturnManageDetail from './LmsEquipReturnManageDetail';

  export default {
    components: {
      BreadCrumbs,
      BtnList,
      ElementTable,
      LmsEquipReturnManageEdit,
      LmsEquipReturnManageDetail
    },
    data() {
      return {
        btn: [
          {type: '', id: '', name: '归还'}
        ],
        searchOpen: true,
        getPage: {},
        iconMsg: [
        ],
        selectIds: [],
        pageColumns: [
          {title: '使用来源', key: 'useSource'},
          {title: '领用人', key: 'receiptor'},
          {title: '领用时间', key: 'receiveDate'},
          {title: '备注', key: 'remark'},
        ],
      }
    },
    computed: {
      tableHeight: function () {
        if (this.searchOpen) {
          return this.$tableHeight('tabSearch');
        } else {
          return this.$tableHeight('tabNoSearch');
        }
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
        this._page();
      },
      _judgePanel(val) {
        switch (val) {
          case 0 :
            this.tableHeight = this.$tableHeight('tabSearch');
            break;
          default:
            this.tableHeight = this.$tableHeight('tabNoSearch');
            break;
        }
      },
      _search() {
        this._page();
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsEquipReturnManage/page');
      },
      _search() {
        this.$refs.pageTable._pageChange(1);
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsEquipReturnManage.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          case 'iconClick':
            this._iconClick(data.name, data.rowData);
            break;
          default :
            this._page();
        }
      },
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true, data.id);
            break;
          case '删除' :
            this._deleteById(data.id);
            break;
        }
      },
      _btnClick(msg) {
        switch (msg) {
          case '归还' :
            this._returnEquip(false);
            break;
          case 'search' :
            this.searchOpen = !this.searchOpen;
            break;
        }
      },
      _returnEquip() {
        this.$Modal.info({
          title: '提示',
          content: this.selectIds
        });
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipReturnManage/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipReturnManage.success) {
                this._page();
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
        let ids = this.selectIds;
        if (ids.length === 0) {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(ids, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipReturnManage/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipReturnManage.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipReturnManage/getById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsEquipReturnManage.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open();
        }
      },
    }
  }
</script>
