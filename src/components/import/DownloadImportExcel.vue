<!--下载模板导入-->
<template>
  <div>
    <Modal v-model="showModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <Alert type="warning" show-icon>请下载导入模板并按照正确格式填写！</Alert>
      <div v-show="isLoad">
        <Spin >
          <Icon type="load-c" size=18 class="file-spin-icon-load"></Icon>
          <div>正在导入,请稍后...</div>
        </Spin>
      </div>
      <div>
        <Button  type="ghost" @click="_download">下载模板</Button>
      </div>

      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <label style="margin-bottom: 0">
          <Upload
            :action="importUrl"
            :on-success="_handelsuccess"
            :before-upload="_beupload"
            :on-progress="_handelprogress"
            :on-format-error="_formatError"
            :data="dataObj"
            :with-credentials="true"
            :show-upload-list="false"
            :format="format"
          >
            <Button type="primary" :disabled="isDisabled">导入</Button>
          </Upload>
        </label>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 导入模板
   */
  import global from '../../api/config'
  export default {
    components: {
    },
    data() {
      return {
        modalTitle: '',
        showModal: false,
        isLoad:false,
        isDisabled:false,
        dataObj:{
          file:'',
        },
        format: ['xlsx','xls'],
        importUrl:'',
        downloadUrl:'',
      }
    },
    methods: {
      _open(data) {
        this.modalTitle = data.title;
        this.showModal = true;
        this.isDisabled = false;
        this.isLoad = false;
        this.importUrl = global.baseURL + data.importUrl;
        this.downloadUrl=data.downloadUrl;
      },
      _download() {
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载模板？',
          onOk: () => {
            window.open(global.baseURL + this.downloadUrl, '_blank');
          }
        });
      },
      _cancel(){
        this.showModal = false;
      },
      _beupload(file) {
        this.dataObj.file = file.name;
      },
      _handelprogress(event, file, fileList) {
        this.isLoad = true;
        this.isDisabled = true;
      },
      _handelsuccess(response, file, fileList) { //上传成功
        if(response.success){
          this.isLoad = false;
          this.$Message.success('导入成功！');
          this.$emit("on-result-change");
          this.showModal = false;
          this.isDisabled = false;
        }else{
          this.isLoad = false;
          this.isDisabled = false;
          this.$Notice.error({
            title: response.msg,
            duration:10,
          });
        }
      },
      _formatError(file){
        this.$Notice.error({
          title: '文件格式不正确',
          duration:10,
          desc: '文件 ' + file.name + ' 格式不正确，请上传格式为 .xlsx、xls 的文件！'
        });
      },
    }
  }
</script>
