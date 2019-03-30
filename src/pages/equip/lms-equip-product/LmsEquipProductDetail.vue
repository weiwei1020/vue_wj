<template>
  <div>
    <Modal v-model="showDetailModal" title="仪器产品信息表详情" :width="800">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>供应商名称</th>
            <td>{{obj.supplierName}}</td>
            <th>仪器类别</th>
            <td>{{obj.className}}</td>
          </tr>
          <tr>
            <th>仪器名称</th>
            <td>{{obj.name}}</td>
            <th>规格型号</th>
            <td>{{obj.spec}}</td>
          </tr>
          <tr>
            <th>品牌</th>
            <td>{{obj.brand}}</td>
            <th>报价</th>
            <td>{{obj.price}}</td>
          </tr>
          <tr>
            <th>产地</th>
            <td>{{obj.productPlace}}</td>
            <th>计量类别</th>
            <td>{{obj.meterType}}</td>
          </tr>
          <tr>
            <th>不确定度</th>
            <td>{{obj.uncertainty}}</td>
            <th>精度</th>
            <td>{{obj.accuracy}}</td>
          </tr>
          <tr>
            <th>使用范围</th>
            <td>{{obj.range}}</td>
            <th>联系电话</th>
            <td>{{obj.tel}}</td>
          </tr>
          <tr>
            <th>技术参数</th>
            <td colspan="3">{{obj.techParamsText}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td colspan="3">{{obj.remark}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <Form :label-width="90" inline style="margin-top:10px;margin-left: -50px" v-show="obj.lmsEquipFiles!=''">
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
   * 仪器产品信息表详情
   */
  export default {
    data() {
      return {
        obj: {},
        showDetailModal: false,
        visible: false,
        defaultList: []
      }
    },
    methods: {
      _open(obj) {
        this.defaultList = [];
        this.showDetailModal = true;
        this.obj = obj;
        if (obj.images !== undefined && obj.images.length !== 0) {
          this.defaultList.push("https://lims.obs.myhwclouds.com/" + obj.images);
        }
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
