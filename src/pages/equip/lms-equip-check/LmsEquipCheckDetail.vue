<template>
  <div>
    <Modal v-model="showDetailModal" title="详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>计划名称</th>
            <td>{{obj.name}}</td>
          </tr>
          <tr>
            <th>部门</th>
            <td>{{obj.orgName}}</td>
          </tr>
          <tr>
            <th>原因</th>
            <td>{{obj.applyReason}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td>{{obj.remark}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <Form :label-width="90" inline style="margin-top: 10px;margin-left: -50px" v-show="obj.lmsEquipFiles!=''">
        <Form-item label="附件">
          <div class="file-upload-list" v-for="item in obj.lmsEquipFiles">
            <div>
              <div class="file-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="_handleView(item)"></Icon>
                <Icon type="ios-cloud-download-outline" @click.native="_downloadFile(item)"></Icon>
              </div>
            </div>
            {{item.orginName }}
          </div>
        </Form-item>
      </Form>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="'https://obs.myhwclouds.com/lims/'+filePath" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
  /**
   * 详情
   */
  export default {
    data() {
      return {
        obj: {},
        showDetailModal: false,
        visible: false
      }
    },
    methods: {
      _open(obj) {
        this.showDetailModal = true;
        this.obj = obj;
      },
      _handleView(data) {
        this.filePath = data.filePath;
        let index1 = this.filePath.lastIndexOf(".");
        let index2 = this.filePath.length;
        let suffix = this.filePath.substring(index1 + 1, index2);//后缀名
        if (suffix == 'png' || suffix == 'jpg' || suffix == 'jpeg') {
          this.visible = true;
        } else {
          this.$Message.warning({
            content:'非图片文件无法查看，请下载查看',
            duration:3
          });
          this.visible = false;
        }
      },
      _downloadFile(file) {//下载文件
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载？',
          onOk: () => {
            var url = 'https://obs.myhwclouds.com/lims/' + file.filePath;
            window.open(url);
            return;
          }
        });
      },
    }
  }
</script>
