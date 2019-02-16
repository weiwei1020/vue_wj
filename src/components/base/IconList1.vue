<template>
  <div style="display:flex;flex-direction:row;">
    <div  v-if="iconNormalList.length > 0" style="flex: 1">
      <Tooltip v-for="item in iconNormalList" :content="item.name" :key="item.name" transfer>
        <Icon :type="item.type"
              :id="item.id"
              v-if="$showBtn(item.id)"
              class="marRight-10 icons" size=20
              @click.native="_iconClick(item.name) "></Icon>
      </Tooltip>
    </div>
    <div style="flex: 1" v-if="iconUploadList.length > 0">
      <Tooltip v-for="item in iconUploadList" :content="item.name" :key="item.name" transfer>
        <span style="display: inline-block" class="marRight-10" v-if="$showBtn(item.id)" @click="_clickUpload(item.rowId)">
          <Upload
            :action="item.action"
            :on-success="_handelsuccess"
            :before-upload="_beupload"
            :data="dataObj"
            :with-credentials="true"
            :show-upload-list="false"
          >
            <Icon :type="item.type"
                  :id="item.id"
                  class="icons" size=20></Icon>
          </Upload>
        </span>
      </Tooltip>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      msg: null,  //任何类型
      id: null,
    },
    data() {
      return {
        //正常
        iconNormalList: [],
        //上传
        iconUploadList: [],
        //上传提交的参数
        dataObj: {
          file: '',
          id: ''
        }
      }
    },
    mounted() {
      this._btn();
    },
    methods: {
      _btn() {
        let iconUploadList = [];
        let iconNormalList = [];
        for (let i = 0; i < this.msg.length; i++) {
          if (this.msg[i].upload === true) {
            iconUploadList.push(this.msg[i])
          } else {
            iconNormalList.push(this.msg[i])
          }
        }
        this.iconUploadList = iconUploadList;
        this.iconNormalList = iconNormalList;
      },
      _iconClick(name) { //按钮点击事件
        this.$emit("on-result-change", name);
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
      _clickUpload(rowId) {
        this.dataObj.id = rowId;
      },
    }
  }
</script>
