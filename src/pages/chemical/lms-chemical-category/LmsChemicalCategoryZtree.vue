<template>
  <!--组织弹出树-->
  <Modal v-model="showTreeModal">
    <p slot="header">选择上级耗材分类</p>
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
        showTreeModal: false,
        key:'',
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
            chkStyle:"radio",
            radioType:'all',

          },
          callback: {
            onClick: this.zTreeOnClick    //  单击节点
          }
        };
        this.$store.dispatch('LmsChemicalCategory/treeListAll').then(() => {
          $.fn.zTree.init($("#tree"), setting, this.$store.state.LmsChemicalCategory.treeList);
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
          this.key = $.trim(this.key);
          this.$store.dispatch('LmsChemicalCategory/treeListAllKeyWord',this.key).then(() => {
            treeObj =  $.fn.zTree.init($("#tree"), setting, this.$store.state.LmsChemicalCategory.treeList);
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
        this.$emit("on-result-change", this.selNotes[0]);   //向父及传递数据
        this.showTreeModal = false;
      },
    }
  }
</script>
