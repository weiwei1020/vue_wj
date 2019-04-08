<template>
  <!--仓库-->
  <Modal v-model="showTreeModal">
    <p slot="header">仓库位置</p>
    <Form  onsubmit="return false">
      <Form-item>
        <Input v-model="key" placeholder="请输入关键字,回车查询" @on-enter="_search" style="width:100%" icon="ios-search-strong"></Input>
      </Form-item>
    </Form>
    <div class="treeHeight">
      <!--加载中-->
      <div class="demo-spin-container" v-show="isloading">
        <Spin fix size="large"></Spin>
      </div>
      <ul id="storeHose" class="ztree" v-show="isTree"></ul>
    </div>
    <div slot="footer">
      <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
      <Button @click="_ok" type="primary">提交</Button>
    </div>
  </Modal>
</template>
<script>
  /**
   * 添加编辑Ztree
   */
  var setting;
  var treeObj;
  export default {
    data() {
      return {
        showTreeModal: false,
        isloading:true,
        isTree:false,
        key: '',
        storehouseData:{
          chemicalId:'',
          storehouseIds:[]
        },
        searchId:''
      }
    },
    methods: {
      _openZtree(id) {
        this.showTreeModal = true;
        this.storehouseData.chemicalId = id;
        this._getZtree(id);
        this.key = '';
      },
      _getZtree(id) {
        this.searchId = id;
        this.isloading = true;
        this.isTree = false;
        setting = {
          data: {
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
            }
          },
          check:{
            enable:true,
            chkStyle: "checkbox",
            chkboxType: { "Y": "", "N": "" } //只选中自己
          },
          callback: {
            onClick: this.zTreeOnClick ,   //
          }
        };

        this.$store.dispatch('LmsStorehouse/treeListVO').then(() => {
          treeObj = $.fn.zTree.init($("#storeHose"), setting, this.$store.state.LmsStorehouse.treeList);
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
            this._getselectedIds(id); //回显选中的节点
            treeObj.expandAll(true);

          },300);
        });

      },
      zTreeOnClick(e, treeId, treeNode, clickFlag) {
        treeObj.checkNode(treeNode, !treeNode.checked, true);

      },
      _cancel(){
        this.showTreeModal = false;
      },
      _ok(){
        var nodesList = [];
        treeObj = $.fn.zTree.getZTreeObj("storeHose");
        var nodes = treeObj.getCheckedNodes(true);
        nodes.forEach(function(value, index, array) {
          nodesList.push(nodes[index].id);
        });
        this.storehouseData.storehouseIds = nodesList;
        this.$store.dispatch('LmsChemical/addStoreHose', this.storehouseData).then(() => {
          if (this.$store.state.LmsChemical.success) {
            this.$Message.success('仓库关联成功！');
            this.showTreeModal = false;
          }
        });
      },
      _getselectedIds(id){
        var STOREIDS= []; //仓库
        this.$store.dispatch('LmsChemical/getStoreHose', id).then(() => {
          var list = this.$store.state.LmsChemical.storeList;
          for(var i=0;i<list.length;i++){
            STOREIDS.push(list[i].storehouseId);
          }
          this._getselOrgIds(STOREIDS); //回显仓库树
        });
      },
      _getselOrgIds(STOREIDS){
        setTimeout(()=>{   //延时显示
          for(var j=0;j<STOREIDS.length;j++){
            treeObj.checkNode( treeObj.getNodeByParam( 'id',STOREIDS[j]), true);
          }
        },10)

      },
      _search(){ // tree查询
        if(this.key !=''){
          this.isloading = true;
          this.isTree = false;
          this.$store.dispatch('LmsStorehouse/treeListVOKey',this.key).then(() => {
            treeObj =  $.fn.zTree.init($("#storeHose"), setting, this.$store.state.LmsStorehouse.treeList);
            setTimeout(()=>{
              this.isloading = false;
              this.isTree = true;
              this._getselectedIds(this.searchId); //回显选中的节点
              treeObj.expandAll(true);
            },300);
          });

        }else{
          this. _getZtree(this.searchId);
        }
      },
    }
  }
</script>
