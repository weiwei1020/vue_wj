<template>
  <div style="overflow-x: auto;" class="tree_height">
    <div>
      <Form  inline>
        <Form-item style="width:100%">
          <Input v-model="key" placeholder="请输入耗材类别，回车查询" @on-enter="_search" style="width:100%"></Input>
        </Form-item>
      </Form>
    </div>
    <ul id="Roletree" class="ztree"></ul>
  </div>
</template>
<script>
  /**
   * 添加编辑Ztree
   */
  var setting;
  export default {
    data() {
      return {
        key:'',
      }
    },
    mounted(){
      this._treeHeight();
    },
    methods: {
      _Ztree() {
        setting = {
          data: {
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
            }
          },
          callback: {
            onClick: this.zTreeOnClick    //  单击节点
          }
        }
        this.$store.dispatch('SysRole/roleTreeList').then(() => {
          $.fn.zTree.init($("#Roletree"), setting, this.$store.state.SysRole.list);
        });

      },
      zTreeOnClick(event, treeId, treeNode) {
          this.$emit("on-result-change", treeNode);   //向父及传递数据
      },
      _search(){
        if(this.key.length >0){

          var treeObj = $.fn.zTree.getZTreeObj("Roletree");
          var node = treeObj.getNodesByParamFuzzy("name", this.key);
          $.fn.zTree.init($("#Roletree"), setting, node);

        }else{
          this. _Ztree();
        }
      },
      _treeHeight(){
        $(".tree_height").height(window.screen.height-350)
      }
    }
  }
</script>
