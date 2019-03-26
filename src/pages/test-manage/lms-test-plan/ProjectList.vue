<template>
  <div>
    <div>
      <div style="overflow: hidden;clear: both;">
        <p slot="title" style="width: 60%;display: inline-block;font-weight: bold;margin-bottom:0px;">项目列表</p>
      </div>
      <Form id="search-form" inline  onsubmit="return false" :label-width="70" v-show="searchOpen">
        <label class="label-sign"></label>
        <Form-item class="width-23"  label="项目名称:">
          <Input name="projectName" v-model="projectName" placeholder="请输入项目名称" style="width: 100px;" @on-enter="_search" ></Input>
          <input name="id" type="hidden">
        </Form-item>
        <Form-item class="marleft-70">
          <Button type="primary" @click="_search">搜索</Button>
          <Button type="success" @click="_refresh">刷新</Button>
        </Form-item>
      </Form>
    </div>
    <div >
      <BtnList :msg="btn" class="contHide" :showSearchBtn="true" @on-result-change="_btnClick"></BtnList>
    </div>
    <PageTable  :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
               ref="pageTable" :getPage="getPage">
    </PageTable>
    <!-- 添加、编辑 -->
    <LmsProjectTestEdit ref="testEditModal" @on-result-change="_search"></LmsProjectTestEdit>
    <!--文件-->
    <CertificateFile ref="fileModal"   @on-result-change="_search"></CertificateFile>
  </div>
</template>
<script>
  /**
   * 添加编辑Ztree
   */
  import LmsProjectTestEdit from './LmsProjectTestEdit.vue'
  import PageTable from '../../../components/table/PageTable'
  import CertificateFile from './CertificateFile.vue'

  var setting;
  export default {
      components: {
        PageTable,
        LmsProjectTestEdit,
        CertificateFile,
      },
    data() {
      return {
        searchOpen:false,
        btn: [
          {type: 'success', id: '', name: '添加'},
          {type: 'error', id: '', name: '删除'},
        ],
        iconMsg:[
          {type:'edit',id:'',name:'编辑'},
          {type:'close',id:'',name:'删除'},
          {type:'upload',id:'',name:'附件'},

        ],
        key:'',
        projectName:'',
        isloading:false,
        isTree:false,
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '项目名称', key: 'projectName',sortable:'true',
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
          {title: '备注 ', key: 'projectRemark',sortable:'true',},
          {title: '创建时间 ', key: 'ctime',sortable:'true',
            render: (h, params) => {
              return h('div', params.row.ctime ? this.$dateformat(params.row.ctime, "yyyy-mm-dd") : '');
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
          return this.$tableHeight('tabNoBtn');
        } else {
          return this.$tableHeight('search');
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
          this.$store.dispatch('LmsStaffLevel/getById', id).then(() => {
            this.$refs.testEditModal._open(this.$store.state.LmsStaffLevel.model);
          });
        } else {
          // 添加
          this.$refs.testEditModal._open();
        }
      },
      _iconClick(res,data){
        switch (res){
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
          case '附件' :
            this._fileModal(data.row.id);
            break;
        }
      },
     /* _fileManage(id){
        this.$refs.file._open(id);
      },*/
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsStaffLevel.page;
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
            this.$store.dispatch('LmsStaffLevel/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsStaffLevel.success) {
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
        this.$refs.pageTable._page('search-form', 'LmsStaffLevel/page');
      },
      _fileModal(id){
        this.$refs.fileModal._open(id);
      },
    }
  }
</script>
<style scoped>
  .ivu-card-body {
    padding-top: 12px !important;
  }
</style>

