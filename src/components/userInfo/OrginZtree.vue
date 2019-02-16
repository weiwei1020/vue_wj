<template>
    <div style="text-align: center;overflow-y: auto;height: 410px;">
      <ul :id="treeName" class="ztree"></ul>
    </div>
</template>
<script>
  /**
   * 组织Ztree
   */
  var treeObj;
  export default {
    data() {
      return {
        treeName:'' //区别tree id
      }
    },
    methods: {
      _getZtree(name) {
        this.treeName = name + 'OrginTree';
        var setting = {
          data: {
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
            }
          },
          callback: {
            onClick: this.zTreeOnClick,
          }
        };
        this.$store.dispatch('SysUser/orginTreeList').then(() => {
            $.fn.zTree.init($("#"+this.treeName), setting, this.$store.state.SysUser.treeList);
            treeObj = $.fn.zTree.getZTreeObj(this.treeName);
            treeObj.expandAll(true);
        });

      },
      zTreeOnClick(event, treeId, treeNode){
        this.$emit("on-result-change",treeNode);
      },
    }
  }
</script>
