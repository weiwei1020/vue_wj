
<template>
  <div>
    <div>
      <Form  onsubmit="return false">
        <Form-item>
          <Input v-model="key" placeholder="请输入关键字,回车查询" @on-enter="_search" style="width:100%" icon="ios-search-strong"></Input>
        </Form-item>
      </Form>

    </div>
    <!--加载中-->
    <div class="demo-spin-container spin-bg" v-show="isloading">
      <Spin fix size="large"></Spin>
    </div>
    <ul id="equipLocationTree" class="ztree ztreePro tree_height"  v-show="isTree"  style="overflow-x: auto;" ></ul>
  </div>
</template>

<style>

</style>

<script>
  /**
   * 添加编辑Ztree
   */
  var setting;
  export default {
    data() {
      return {
        key:'',
        isloading:true,
        isTree:false
      }
    },
    mounted(){
      this._treeHeight();
    },
    methods: {
      _Ztree() {
        this.key='';
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
            onClick: this.zTreeOnClick
          }
        }

        this.$store.dispatch('LmsEquipLocation/getTree').then(() => {

          $.fn.zTree.init($("#equipLocationTree"), setting, this.$store.state.LmsEquipLocation.treeList);

          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
          },300);


        });

      },
      zTreeOnClick(event, treeId, treeNode) {
        var id = treeNode.id;
        if (!treeNode.isParent) { //子节点

          this.$emit("on-result-change", id,'id');
          return false;

        } else {  //父节点
          this.$emit("on-result-change", id,'pids');
          return true;
        }
      },
      _search(){
        if(this.key !=''){
          this.isloading = true;
          this.isTree = false;
          this.$store.dispatch('LmsEquipLocation/getTreeKeyword',this.key).then(() => {
            $.fn.zTree.init($("#equipLocationTree"), setting, this.$store.state.LmsEquipLocation.treeList);

            setTimeout(()=>{
              this.isloading = false;
              this.isTree = true;
            },300);
          });

        }else{
          this. _Ztree();
        }

      },
      _treeHeight(){
        $(".tree_height").height(document.documentElement.clientHeight-225)
      }
    }
  }
</script>

