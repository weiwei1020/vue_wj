<template>
  <!--仓库-->
  <Modal v-model="showTreeModal">
    <p slot="header">仓库位置</p>
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

      <ul id="relStoreHose" class="ztree" v-show="isTree"></ul>
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
          storehouseIds:[],
          storehouseNames:[]
        }
      }
    },
    methods: {
      _openZtree() {
        this.showTreeModal = true;
        this._getZtree();
        this.key = '';
      },
      _getZtree() {
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
            onClick: this.zTreeOnClick ,
          }
        };
        this.$store.dispatch('LmsStorehouse/treeListVO').then(() => {
          treeObj = $.fn.zTree.init($("#relStoreHose"), setting, this.$store.state.LmsStorehouse.treeList);
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
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
        var nodesNames = [];
        treeObj = $.fn.zTree.getZTreeObj("relStoreHose");
        var nodes = treeObj.getCheckedNodes(true);
        nodes.forEach(function(value, index, array) {
          nodesList.push(nodes[index].id);
          nodesNames.push(nodes[index].name);
        });
        this.storehouseData.storehouseIds = nodesList;
        this.storehouseData.storehouseNames = nodesNames;
        this.$emit("on-result-change", this.storehouseData);   //向父及传递选中的数据
        this.showTreeModal = false;
      },
      _search(){ // tree查询
        if(this.key !=''){
          this.isloading = true;
          this.isTree = false;
          this.key = $.trim(this.key);
          this.$store.dispatch('LmsStorehouse/treeListVOKey',this.key).then(() => {
            treeObj =  $.fn.zTree.init($("#relStoreHose"), setting, this.$store.state.LmsStorehouse.treeList);
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

    }
  }
</script>
