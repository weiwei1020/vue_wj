<template>
  <div>
    <div>
      <div style="overflow: hidden;clear: both;">
        <p slot="title" style="width: 60%;display: inline-block;font-weight: bold;margin-bottom:0px;">项目列表</p>
      </div>
      <Form id="search-form" inline style="height: 43px;" onsubmit="return false" :label-width="70" v-show="searchOpen">
        <label class="label-sign"></label>
        <Form-item class="width-23"  label="项目名称:">
          <Input name="projectName" v-model="projectName" placeholder="请输入项目名称" style="width: 100px;" @on-enter="_search" ></Input>
          <input name="projectPersonId" v-model="projectPersonId" type="hidden">
        </Form-item>
        <Form-item class="marleft-70">
          <Button type="primary" @click="_search">搜索</Button>
          <Button type="success" @click="_refresh">刷新</Button>
        </Form-item>
      </Form>
    </div>
    <div  v-bind:style="[searchOpen?'':styleObject]">
      <BtnList :msg="btn" class="contHide" :showSearchBtn="true" @on-result-change="_btnClick"></BtnList>
    </div>
    <PageTable  :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
               ref="pageTable" :getPage="getPage">
    </PageTable>
    <!-- 添加、编辑 -->
    <LmsProjectTestEdit ref="testEditModal" @on-result-change="_search"></LmsProjectTestEdit>
  </div>
</template>
<script>
  /**
   * 添加编辑Ztree
   */
  import LmsProjectTestEdit from './LmsProjectTestEdit.vue'
  import PageTable from '../../../components/table/PageTable'
  import IconList from "../../../components/base/IconList";

  var setting;
  export default {
      components: {
        PageTable,
        LmsProjectTestEdit,
      },
    data() {
      return {
        searchOpen:false,
        btn: [
          {type: 'success', id: '', name: '添加'},
          // {type: 'error', id: '', name: '删除'},
        ],
        iconMsg:[
          {type:'edit',id:'',name:'编辑'},
          {type:'close',id:'',name:'删除'},
        ],
        styleObject: {
          marginTop: '10px'
        },
        key:'',
        projectName:'',
        projectPersonId:localStorage.getItem('personId'),
        isTree:false,
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '项目名称', key: 'projectName',sortable:'true',width:120,
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailModal(data.row);
                    }
                  }
                }, data.row.projectName),
              ]);
            }
          },
      {title: '创建人 ', key: 'projectPerson',sortable:'true',width:120,},
      {title: '备注 ', key: 'projectRemark',sortable:'true',width:120,},
          {title: '创建时间 ', key: 'projectCtime',sortable:'true',width:140,
            render: (h, params) => {
              return h('div', params.row.projectCtime ? this.$dateformat(params.row.projectCtime, "yyyy-mm-dd") : '');
            }
          },
          {
            title: '操作', key: 'action', width: 150, fixed: 'right',align:'center',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this.iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res,data)
                      }
                    }
                  }),
                ]);
            }
          },
        ],
        getPage: {},
      }
    },
    computed: {
      tableHeight: function () {
        if (this.searchOpen) {
          return this.$tableHeight('search');
        } else {
          return this.$tableHeight('noSearch');
        }
      }
    },
    mounted(){
      this._page();
    },
    methods: {
      _refresh() { //刷新
        $('input[name=projectName]').val('');
        this._page();
      },
      _detailModal(data) {
        //向父级传参
        this.$emit("on-result-change",data);
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsTestProject/getById', id).then(() => {
            this.$refs.testEditModal._open(this.$store.state.LmsTestProject.model);
          });
        } else {
          // 添加
          this.$refs.testEditModal._open();
        }
      },
      _iconClick(res,data){
        switch (res){
          case '编辑' :
            this._editModal(true, data.row.projectId);
            break;
          case '删除' :
            this._deleteById(data.row.projectId);
            break;
        }
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsTestProject.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsTestProject/deleteByIds', ids.join(',')).then(() => {
              if (this.$store.state.LmsTestProject.success) {
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
      _btnClick(msg) { //列表返回的数据
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
          case '删除' :
            this._deleteSelected();
            break;
          case 'search':
            this.searchOpen = !this.searchOpen
            break
        }
      },
      _search() {
          this.$refs.pageTable._pageChange(1);
      },
      _levelData(result) {
        $('input[name=id]').val(result);
        this._formSearch();
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsTestProject/page');
      },
    }
  }
</script>
<style scoped>
  .ivu-card-body {
    padding-top: 12px !important;
  }
</style>

