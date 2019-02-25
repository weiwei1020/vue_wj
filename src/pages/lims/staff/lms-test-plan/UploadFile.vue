<template>
  <div>
    <div>
      <Upload
        :action="action"
        :on-success="_handelsuccess"
        :before-upload="_beupload"
        :on-progress="_handelprogress"
        :data="dataObj"
        :with-credentials="true"
        :show-upload-list="false"
      >
        <Button type="success">导入文件</Button>
      </Upload>
    </div>
    <div v-show="isLoad">
      <Spin fix>
        <Icon type="load-c" size=18 class="file-spin-icon-load"></Icon>
        <div>正在上传,请稍后...</div>
      </Spin>
    </div>
  </div>
</template>
<script>
  /**
   * 添加编辑文件夹表
   */
  import global from '../../../../api/config'

  export default {
    data() {
      return {
        action: '',
        dataObj: {
          file: '',
          projectId: ''
        },
        isLoad: false, //是否显示loading...
        projectId: '' //合同id
      }
    },
    methods: {
      _open(id) {
        this.isLoad = false;
        this.projectId = id;
        this.action = global.baseURL + '/slims/v1/staff_plan_attachment/' + this.projectId;
      },
      _beupload(file) {
        this.dataObj.file = file.name;
      },
      _handelprogress(event, file, fileList) {
        this.isLoad = true;
      },
      _handelsuccess(response, file, fileList) { //上传成功
        if (response.success) {
          this.isLoad = false;
          this.$Message.success('上传成功！');
          this.$emit("on-result-change");
        } else {
          this.isLoad = true;
          this.$Message.error(response.msg);
        }
      },

    }
  }
</script>
