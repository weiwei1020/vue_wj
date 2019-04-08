<template>
  <div >
    <div style="margin-top: 15px">
      <Form inline onsubmit="return false" v-show="isPur">
        <Form-item style="width:100%">
          <Input v-model="key" placeholder="请输入关键字，回车查询" @on-enter="_search" style="width:400px" icon="ios-search-strong"></Input>
        </Form-item>
      </Form>
      <div v-show="!isPur" class="tree_height2">
        <img :src="imgUrl">
      </div>
    </div>
    <ul id="purTree" class="ztree tree_height1" style="overflow-x: auto;" v-show="isPur"></ul>
    <!--保存-->
    <div class="saveDiv" style="height: 54px;">
      <Button type="primary" @click="_ok" style="width: 100px;" v-show="isPur">保 存</Button>
    </div>
  </div>
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
        idObj:{ //要提交的id数据
          id:'',
          idsList:[],
        },
        ORGLISTIDS:[],
        isPur:false,
        imgUrl:'http://static.patzn.com/img/noData.png',
      }
    },
    mounted() {
      this._treeHeight();
    },
    methods: {
      _openZtree(ID) {
        this._getZtree();
        this._getselPurIds(ID);
        this.idObj.id = ID;
        this.isPur = true;
      },
      _getZtree() {
        setting = {
          data: {
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
            }
          },
          check:{
            enable: true,
          },
          callback: {
            onClick: this.zTreeOnClick ,
          }
        }
        this.$store.dispatch('LmsChemicalCategory/treeListAll').then(() => {
          $.fn.zTree.init($("#purTree"), setting, this.$store.state.LmsChemicalCategory.treeList);
          treeObj = $.fn.zTree.getZTreeObj("purTree");
          treeObj.expandAll(true);
        });

      },
      zTreeOnClick(e, treeId, treeNode, clickFlag) {
        treeObj.checkNode(treeNode, !treeNode.checked, true);
      },
      _ok(){
        var nodesList=[];
        var nodes = treeObj.getCheckedNodes(true);
        for(var i=0; i< nodes.length; i++){
          nodesList.push(nodes[i].id)
        }
        this.idObj.idsList = nodesList;
        this.$store.dispatch('LmsChemicalCategory/roleCategory',this.idObj).then(() => {
          if (this.$store.state.LmsChemicalCategory.success) {
            this.$Message.success('保存成功！');
          }else{
            this.$Message.error('保存失败！');
          }
        });

      },
      _getselPurIds(ID){  //回显选中的节点树
        var PURIDS=[];
        this.$store.dispatch('LmsChemicalCategory/excludeRoleList',ID).then(() => {
          var purIds = this.$store.state.LmsChemicalCategory.include;
          for(var i=0;i<purIds.length;i++){
            PURIDS.push(purIds[i].id);
          }
          setTimeout(()=>{   //延时显示
            for(var j=0;j<PURIDS.length;j++){
              treeObj.checkNode( treeObj.getNodeByParam( 'id',PURIDS[j] ), true);
            }
          },10)

        });
      },
      _search() {
        if(this.key !=''){
          this.key = $.trim(this.key);
          this.$store.dispatch('LmsChemicalCategory/proTreeKeyword',this.key).then(() => {
            $.fn.zTree.init($("#purTree"), setting, this.$store.state.LmsChemicalCategory.treeList);
          });
        }else{
          this._getZtree();
        }
      },
      _treeHeight() {
        $(".tree_height1").height(window.screen.height - 450);
        $(".tree_height2").height(window.screen.height - 400);
      },
    }
  }
</script>
