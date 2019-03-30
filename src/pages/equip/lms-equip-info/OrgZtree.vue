<template>
  <!--组织弹出树-->
  <Modal v-model="showTreeModal">
    <p slot="header">选择所属部门</p>
    <div class="treeHeight">
      <!--加载中-->
      <div class="demo-spin-container" v-show="isloading">
        <Spin fix size="large"></Spin>
      </div>
      <ul id="orgTree" class="ztree" v-show="isTree"></ul>
    </div>

    <div slot="footer"></div>
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
        isloading:true,
        isTree:false,
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
          callback: {
            onDblClick: this.zTreeOnDblClick    //  双击节点
          }
        };
        this.$store.dispatch('LmsStaffInfo/orgTreeList').then(() => {
          $.fn.zTree.init($("#orgTree"), setting, this.$store.state.LmsStaffInfo.orglist);
          treeObj = $.fn.zTree.getZTreeObj("orgTree");
          treeObj.expandAll(true);
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
          },300);

        });

      },
      zTreeOnDblClick(event, treeId, treeNode) {
        var data = {
          id: treeNode.id,
          name: treeNode.name,
          pids: treeNode.pids
        }
        this.$emit("on-result-change", data);   //向父及传递数据
        this.showTreeModal = false;
      },
    }
  }
</script>
