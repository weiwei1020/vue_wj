<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <Row>
          <Col span="10">
          <div  v-show="isTree">
            <div>
              <ProjectList ref="projectList" @on-result-change="_levelData"></ProjectList>
            </div>
          </div>
          </Col>
          <Col span="1">
          <div>
            <span>&nbsp;&nbsp;</span>
          </div>
          </Col>
          <Col span="13">
          <div>
            <div >
              <p slot="title" style="width: 60%;display: inline-block;font-weight: bold;margin-bottom:0px;">{{projectTitle+'实验安排列表'}}</p>
            </div>
            <Row>
              <!--查询-->
              <Col span="24" style="margin-top: 20px">
              <Form id="search-form1" inline onsubmit="return false" :label-width="70">
                <label class="label-sign"></label>
                <Form-item class="width-23" label="实验名称:">
                  <Input name="testName" placeholder="请输入实验名称" style="width: 100px;" @on-enter="_formSearch"></Input>
                  <input name="projectId" type="hidden">
                </Form-item>
                <Form-item class="search-btn" style="margin-left: 20px;">
                  <Button type="primary" @click="_formSearch">搜索</Button>
                </Form-item>
              </Form>
              </Col>
              <!--操作-->
              <Col span="24" style="margin-bottom: 14px;">
              <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
              </Col>
              <Col span="24" style="margin-bottom: 10px">
              <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                         ref="pageTable" :getPage="getPage">

              </PageTable>
              </Col>
            </Row>
          </div>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 添加、编辑 -->
    <LmsStaffLevelEdit ref="editModal" @on-result-change="_search"></LmsStaffLevelEdit>
    <!-- 查看详情 -->
    <LmsStaffLevelDetail ref="detailModal"></LmsStaffLevelDetail>
    <!--实验修改记录-->
    <LmsTestChangeQuery ref="changeModal"></LmsTestChangeQuery>
    <!--实验修改记录ById-->
    <LmsTestChangeQueryById ref="changeModalById"></LmsTestChangeQueryById>
    <!--实验人员-->
    <LmsManagePeopleList ref="peopleListModal" @on-result-change="_search"></LmsManagePeopleList>
  </div>
</template>
<script>
  import LmsStaffLevelEdit from './LmsStaffLevelEdit.vue'
  import LmsStaffLevelDetail from './LmsStaffLevelDetail.vue'
  import LmsTestChangeQuery from './LmsTestChangeQuery.vue'
  import LmsTestChangeQueryById from './LmsTestChangeQueryById.vue'
  import ProjectList from './ProjectList.vue'
  import BtnList from '../../../../components/base/BtnList.vue'
  import PageTable from '../../../../components/table/PageTable'
  import BreadCrumbs from '../../../../components/base/BreadCrumbs'
  import IconList from '../../../../components/base/IconList1.vue'
  import User from '../../../../components/user-info-multi-workflow/AssignPerson'
  import LmsManagePeopleList from './LmsManagePeopleList'

  export default {
    components: {
      LmsStaffLevelEdit,
      LmsStaffLevelDetail,
      LmsTestChangeQuery,
      LmsTestChangeQueryById,
      ProjectList,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
      User,
      LmsManagePeopleList,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
          {type: 'error', id: '', name: '删除'},
          {id: '', name: '实验修改记录'},

        ],
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
          {type: 'person', id: '', name: '人员维护'},
          {type: 'document', id: '', name: '实验修改记录'},
        ],
        heightSearch: '',
        tableHeight: '600',
        selectIds: [],
        pids: '',
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '实验名称', key: 'testName', sortable: 'true',
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailModal(data.row.id);
                    }
                  }
                }, data.row.testName),
              ]);
            }, width: 160
          },
          {title: '创建人', key: 'remark', sortable: 'true', width: 120},
          {title: '备注', key: 'remark', sortable: 'true', width: 160},
          {
            title: '计划开始时间 ', key: 'beginDate', sortable: 'true', width: 160,
            render: (h, params) => {
              return h('div', params.row.beginDate ? this.$dateformat(params.row.beginDate, "yyyy-mm-dd HH" + ':00:00') : '');
            }
          },
          {
            title: '计划结束时间 ', key: 'endDate', width: 160, sortable: 'true', render: (h, params) => {
              return h('div', params.row.endDate ? this.$dateformat(params.row.endDate, "yyyy-mm-dd HH" + ':00:00') : '');
            }
          },
          {
            title: '操作', key: 'action', width: 140, fixed: 'right', align: 'center',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this.iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res, data)
                      }
                    }
                  },),
                ]);
            }
          },
        ],
        isTree: true,
        getPage: {
          records: [
            {testName:'111',remark:'111',beginDate:'111',endDate:'111',}
          ]
        },
        contLength: null,
        noBtnVal: 250,
        btnVal: 292,
        dVal: 57,
        project: '',
        projectTitle:'',
      }
    },
    mounted() {
      this._contHide(); //判断‘添加’一栏是否隐藏
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
          case '人员维护' :
            this._userManageById(data.row.id);
            break;
          case '实验修改记录' :
            this._changeModelById(data.row.id);
            break;
        }
      },
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
        this._search();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
       // this.treeStyleObj.height = document.documentElement.clientHeight - 110 + 'px';
        switch (this.contLength) {
          case 0 :
            this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
            break;
          default:
            this.tableHeight = this.$tableHeight(val, this.btnVal, this.dVal);
        }
      },
      _page() {
       this.$refs.pageTable._page('search-form1', 'LmsStaffStatus/Testpage');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _search() {
        this._page();
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsStaffStatus/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsStaffStatus.success) {
                this._search();
                this.$Message.success('删除成功！');
                this.selectIds = [];
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
      _userManageById(id){
        this.$refs.peopleListModal._open(id)

      },
      _changeModelById(id) {
        this.$refs.changeModalById._open(id);
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsStaffStatus/getTestById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsStaffStatus.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsStaffStatus/getTestById', id).then(() => {
            this.$refs.editModal._open(this.$store.state.LmsStaffStatus.model);
          });
        } else {
          // 添加
          var data = new Object();
          data.projectId = $('input[name=projectId]').val();
          data.projectName = this.project.projectName;
          this.$refs.editModal._open(data);
        }
      },
      _levelData(result) {
        this.project = result;
        this.projectTitle=result.projectName+'——';
        $('input[name=projectId]').val(result.id);
        this._formSearch();
      },
      _btnClick(msg) { //列表返回的数据
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
          case '删除' :
            this._deleteSelected();
            break;
          case '实验修改记录' :
            this._changeModel();
            break;
        }
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage ={
              records: [
                {testName:'111',remark:'111',beginDate:'111',endDate:'111',}
              ]
            }; //this.$store.state.LmsStaffStatus.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
      _changeModel() {
        this.$refs.changeModal._open();
      },

    },
  }
</script>
<style scoped>
  .ivu-card-body {
    padding-top: 12px !important;
  }
</style>
