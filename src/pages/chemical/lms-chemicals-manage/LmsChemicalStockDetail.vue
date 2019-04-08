<template>
  <div>
    <Modal v-model="showUseDetailModal" title="试验耗材库存表详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>精度范围</th>
            <td>{{obj.accuracyRange}}</td>
          </tr>
          <tr>
            <th>证书编号</th>
            <td>{{obj.certificateNum}}</td>
          </tr>
          <tr>
            <th>试验耗材 ID</th>
            <td>{{obj.chemicalId}}</td>
          </tr>
          <tr>
            <th>企业 ID</th>
            <td>{{obj.companyId}}</td>
          </tr>
          <tr>
            <th>创建时间</th>
            <td>{{obj.ctime}}</td>
          </tr>
          <tr>
            <th>定值单位</th>
            <td>{{obj.definite}}</td>
          </tr>
          <tr>
            <th>定值日期</th>
            <td>{{obj.definiteDate}}</td>
          </tr>
          <tr>
            <th>0、正常 1、删除</th>
            <td>{{obj.deleted}}</td>
          </tr>
          <tr>
            <th>鉴定单位</th>
            <td>{{obj.detection}}</td>
          </tr>
          <tr>
            <th>出厂编号</th>
            <td>{{obj.factoryNum}}</td>
          </tr>
          <tr>
            <th>最后修改人 ID</th>
            <td>{{obj.lid}}</td>
          </tr>
          <tr>
            <th>最后修改时间</th>
            <td>{{obj.ltime}}</td>
          </tr>
          <tr>
            <th>设备管理员</th>
            <td>{{obj.manage}}</td>
          </tr>
          <tr>
            <th>计量类别</th>
            <td>{{obj.metering}}</td>
          </tr>
          <tr>
            <th>备品备件规格型号</th>
            <td>{{obj.model}}</td>
          </tr>
          <tr>
            <th>单价</th>
            <td>{{obj.price}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td>{{obj.remark}}</td>
          </tr>
          <tr>
            <th>标准值</th>
            <td>{{obj.standardValue}}</td>
          </tr>
          <tr>
            <th>库存</th>
            <td>{{obj.stock}}</td>
          </tr>
          <tr>
            <th>技术参数</th>
            <td>{{obj.technology}}</td>
          </tr>
          <tr>
            <th>密度</th>
            <td>{{obj.thickness}}</td>
          </tr>
          <tr>
            <th>使用范围</th>
            <td>{{obj.useRange}}</td>
          </tr>
          <tr>
            <th>使用地点</th>
            <td>{{obj.useSite}}</td>
          </tr>
          <tr>
            <th>已使用量</th>
            <td>{{obj.used}}</td>
          </tr>
          <tr>
            <th>有效期</th>
            <td>{{obj.validDate}}</td>
          </tr>
          <tr>
            <th>校验日期</th>
            <td>{{obj.verifyDate}}</td>
          </tr>
          <tr>
            <th>校验部门</th>
            <td>{{obj.verifyOrg}}</td>
          </tr>
          <tr>
            <th>检定周期(/月)</th>
            <td>{{obj.verifyPeriod}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 试验耗材库存表详情
   */
  export default {
    data() {
      return {
        obj: {},
        showUseDetailModal: false
      }
    },
    methods: {
      _open(obj) {
        this.showUseDetailModal = true;
        this.obj = obj;
      },
      _openUse(obj) {
        this.showUseDetailModal = true;
        this.obj = obj;
      },
      _openStorage(data) {
      //  alert(data);
      }
    }
  }
</script>
