
<template>
  <!--上级类别弹出树-->
  <Modal v-model="showTreeModal">
    <p slot="header">选择位置</p>
    <div class="treeHeight">
      <!--加载中-->
      <div class="demo-spin-container" v-show="isloading">
        <Spin fix size="large"></Spin>
      </div>

      <ul id="locationTree" class="ztree" v-show="isTree"></ul>
    </div>
    <div slot="footer">
      <!--<Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>-->
      <!--<Button @click="_ok" type="primary">确定</Button>-->
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
      }
    },
    methods: {
      _openZtree(pid) {
        this.showTreeModal = true;
        this._getZtree(pid);
      },
      _getZtree(pid) {
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
            onClick: this.zTreeOnDblClick    //  双击节点
          }
        };

        this.$store.dispatch('LmsEquipAudit/list').then(() => {
          treeObj=$.fn.zTree.init($("#locationTree"), setting, this.$store.state.LmsEquipAudit.list);
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
            if(pid){
              let node = treeObj.getNodeByParam('id',pid,null);//根据id获取该节点；（第三个参数父节点，在指定父节点查找）
              treeObj.checkNode(node, true, false);//选中节点 第三个参数为是否勾选父节点
              treeObj.expandAll(true);//展开节点
            }
          },300);
        });

      },
      zTreeOnDblClick(event, treeId, treeNode) {
        var data = {
          id: treeNode.id,
          name: treeNode.name,
        }
        this.$emit("on-result-change", data);   //向父及传递数据
        this.showTreeModal = false;
      },
      _cancel(){
        this.showTreeModal=false;
      }
    }
  }
</script>

