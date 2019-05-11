<template>
  <!--耗材弹出树-->
  <Modal v-model="showTreeModal">
    <p slot="header">选择耗材类别</p>
    <Form  onsubmit="return false">
      <Form-item>
        <Input v-model="key" placeholder="请输入关键字,回车查询" @on-enter="_search" style="width:100%" icon="ios-search-strong"></Input>
      </Form-item>
    </Form>
    <div style="text-align: center;overflow-y: auto;height: 450px">
      <!--加载中-->
      <div class="demo-spin-container" v-show="isloading">
        <Spin fix size="large"></Spin>
      </div>
      <ul id="tree" class="ztree" v-show="isTree"></ul>
    </div>
    <div slot="footer">
      <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
      <Button @click="_ok" type="primary">确定</Button>
    </div>
  </Modal>
</template>
<script>
  /**
   * 添加编辑Ztree
   */
  var treeObj;
  var setting;
  export default {
    data() {
      return {
        key:'',
        showTreeModal: false,
        isloading:true,
        isTree:false,
        selNotes:[]
      }
    },
    methods: {
      _openZtree() {
        this.showTreeModal = true;
        this._getZtree();
      },
      _getZtree() {
        this.key = '';
        this.isloading = true;
        this.isTree = false;
        setting = {
          data: {
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
            },
            key: {
              name: "consumableSortName"
            }
          },
          check:{
            enable:true,
            chkStyle:"radio",
            radioType:'all',

          },
          callback: {
            onClick: this.zTreeOnClick    //  单击节点
          }
        };
        this.$store.dispatch('LmsChemicalCategory/list').then(() => {
          $.fn.zTree.init($("#tree"), setting, this.$store.state.LmsChemicalCategory.list);
          treeObj = $.fn.zTree.getZTreeObj("tree");
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
            treeObj.expandAll(true);
          },300);
        });
      },
      zTreeOnClick(event, treeId, treeNode) {
        treeObj.checkNode(treeNode,!treeNode.checked,true);
      },
      _search(){ // tree查询
        if(this.key !=''){
          this.isloading = true;
          this.isTree = false;
          this.$store.dispatch('LmsChemicalCategory/listKeyword',this.key).then(() => {
            treeObj =  $.fn.zTree.init($("#tree"), setting, this.$store.state.LmsChemicalCategory.list);
            setTimeout(()=>{
              this.isloading = false;
              this.isTree = true;
              treeObj.expandAll(true);
            },300);
          });

        }else{
          this. _getZtree();
        }
      },
      _cancel(){
        this.showTreeModal = false;
      },
      _ok(){
        this.selNotes = treeObj.getCheckedNodes(true);
        if(this.selNotes.length == 0){
          this.$Message.warning("请先选中耗材类别")
        }else{
          this.$emit("on-result-change", this.selNotes[0]);   //向父及传递数据
          this.showTreeModal = false;
        }
      },
    }
  }
</script>
