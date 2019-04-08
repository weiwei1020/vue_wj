<template>
  <div>
    <div>
      <Form inline onsubmit="return false">
        <Form-item style="width:100%">
          <Input v-model="key" placeholder="请输入关键字，回车查询" @on-enter="_search" style="width:100%" icon="ios-search-strong"></Input>
        </Form-item>
      </Form>
    </div>
    <!--加载中-->
    <div class="demo-spin-container spin-bg" v-show="isloading">
      <Spin fix size="large"></Spin>
    </div>
    <ul id="proTree" class="ztree tree_height" style="overflow-x: auto;" v-show="isTree"></ul>
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
        key: '',
        isloading:true,
        isTree:false
      }
    },
    mounted() {
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
            onClick: this.zTreeOnClick    //  双击节点
          }
        }

        this.$store.dispatch('LmsChemicalCategory/treeList').then(() => {
          $.fn.zTree.init($("#proTree"), setting, this.$store.state.LmsChemicalCategory.treeList);
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
          },300);
        });

      },
      zTreeOnClick(event, treeId, treeNode) {
        this.$emit("on-result-change", treeNode);   //向父及传递数据
      },
      _search() {
        if (this.key != '') {
          this.isloading = true;
          this.isTree = false;
          this.key = $.trim(this.key);
          this.$store.dispatch('LmsChemicalCategory/proTreeKeyword', this.key).then(() => {
            $.fn.zTree.init($("#proTree"), setting, this.$store.state.LmsChemicalCategory.treeList);
            setTimeout(()=>{
              this.isloading = false;
              this.isTree = true;
            },300);
          });

        } else {
          this._Ztree();
        }
      },

      _treeHeight() {
        $(".tree_height").height(document.documentElement.clientHeight-225)
      }
    }
  }
</script>
