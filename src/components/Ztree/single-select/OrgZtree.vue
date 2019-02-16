<template>
  <Modal v-model="showTreeModal">
    <p slot="header">选择组织</p>
    <div class="treeHeight">
      <!--加载中-->
      <div class="demo-spin-container" v-show="isloading">
        <Spin fix size="large"></Spin>
      </div>
      <ul id="Orgintree" class="ztree"></ul>
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
  export default {
    data() {
      return {
        showTreeModal: false,
        isloading: true,
      }
    },
    methods: {
      //传部门id回显，不传也不会报错
      _openZtree(orgId) {
        this.showTreeModal = true;
        this._getZtree(orgId);
      },
      _getZtree(orgId) {
        this.isloading = true;
        let setting = {
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
        this.$store.dispatch('SysOrg/orginTreeList').then(() => {
          treeObj=$.fn.zTree.init($("#Orgintree"), setting, this.$store.state.SysOrg.treeList);
          this.isloading = false;
          treeObj.expandAll(true);
          setTimeout(() => {
            if (orgId) {
              let node = treeObj.getNodeByParam('id', orgId, null);//根据id获取该节点；（第三个参数父节点，在指定父节点查找）
              treeObj.checkNode(node, true, false);//选中节点 第三个参数为是否勾选父节点
            }
          }, 300);
        });

      },
      zTreeOnClick(event, treeId, treeNode) {
        treeObj.checkNode(treeNode,!treeNode.checked,true);
      },
      _cancel(){
        this.showTreeModal = false;
      },
      _ok(){
        let selNotes = treeObj.getCheckedNodes(true);
        this.$emit("on-result-change", selNotes[0]);   //向父及传递数据
        this.showTreeModal = false;
      },
    }
  }
</script>
