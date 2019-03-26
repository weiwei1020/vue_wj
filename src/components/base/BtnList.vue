<template>
  <div>
    <div style="position: relative;" class="btn-width">
      <span v-for="item in msg">
        <span v-if="item.upload">
          <label style="margin-bottom: 0;" class="marRight-5"
                 :key="item.name" v-if="$showBtn(item.id)">
          <Upload
            :action="item.action"
            :on-success="_handelsuccess"
            :before-upload="_beupload"
            :data="dataObj"
            :with-credentials="true"
            :show-upload-list="false">
            <Button style="margin-bottom: 10px">{{item.name}}</Button>
          </Upload>
        </label>
        </span>
        <span v-else>
           <Button :type="item.type"
                   :id="item.id"
                   v-if="$showBtn(item.id)"
                   :key="item.name"
                   :class="item.type !==''?'marRight-5':'marRight-5 no-type-btn'"
                   style="margin-bottom: 10px"
                   @click="_btnClick(item.name,item.componentName)"
           >{{item.name}}
          </Button>
        </span>
      </span>
      <slot name="processTask"></slot>
      <span class="fold" v-if="showSearchBtn === undefined ? false : true">
        <div v-if="open" @click="_btnClick('search')">
          <img src="http://static.patzn.com/img/no-search.png">
          <span class="no-search-bg-span">收起搜索</span>
        </div>
        <div v-else @click="_btnClick('search')">
          <img src="http://static.patzn.com/img/search.png">
          <span class="search-bg-span">条件搜索</span>
        </div>
      </span>
    </div>
  </div>
</template>
<style scoped>
  .no-type-btn:hover {
    background: #00A0E9;
    border-color: #00A0E9;
  }

  .fold {
    display: inline-block;
    position: absolute;
    /*top: 0;*/
    right: 0
  }

  .fold img {
    margin-top: -2px
  }

  .fold span {
    cursor: pointer;
    line-height: 36px;
    font-size: 13px;
  }

  .fold span:hover {
    color: #00a8ff;
  }

  .search-bg-span {
    color: #00a0e9;
  }

  .no-search-bg-span {
    color: #999999;
  }
</style>
<script>
  export default {
    props: {
      msg: null,  //任何类型
      open: false,
      showSearchBtn: null
    },
    data() {
      return {
        //上传提交的参数
        dataObj: {
          file: ''
        }
      }
    },
    methods: {
      _btnClick(name, componentName) { //按钮点击事件
        this.$emit("on-result-change", name, componentName);
      },
      //导入
      _beupload(file) {
        this.dataObj.file = file.name;
      },
      _handelsuccess(response, file, fileList) {
        //上传成功
        if (response.success) {
          this.$Message.success('上传成功！');
        } else {
          this.$Message.warning(response.msg);
        }
        this.$emit("on-result-change", 'upload');
      },
    }
  }
</script>
