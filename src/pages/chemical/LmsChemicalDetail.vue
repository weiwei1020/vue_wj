<template>
  <div>
    <Modal v-model="showDetailModal" title="试验耗材详情表" :width="700">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>耗材名称</th>
            <td>{{this.obj.name}}</td>
            <th>耗材类别</th>
            <td>{{this.obj.category}}</td>
          </tr>
          <tr>
            <th>耗材编号</th>
            <td>{{this.obj.num}}</td>
            <th>密度</th>
            <td>{{obj.thickness}}</td>
          </tr>
          <tr>
            <th>不确定度</th>
            <td>{{obj.unsure}}</td>
            <th>制造厂商</th>
            <td>{{obj.manufacturer}}</td>
          </tr>
          <tr>
            <th>等级（纯度）</th>
            <td>{{obj.quality}}</td>
            <th>标准值</th>
            <td>{{obj.standard}}</td>
          </tr>
          <tr>
            <th>规格</th>
            <td>{{this.obj.spec}}</td>
            <th>计量方式</th>
            <td>{{this.obj.unit}}</td>
          </tr>
          <!--<tr>-->
          <!--<th>库存量</th>-->
          <!--<td colspan="3">{{obj.stock}}</td>-->
          <!--</tr>-->
          <tr>
            <th>转换率</th>
            <td>{{obj.exchange}}</td>
            <th>转换单位</th>
            <td colspan="3">{{obj.exunit}}</td>
            <!--<th>转换库存</th>-->
            <!--<td>{{obj.exstock}}</td>-->
          </tr>
          <tr>
            <th>仓库位置</th>
            <td>{{obj.storehouse}}</td>
            <th>备注</th>
            <td>{{obj.remark}}</td>
          </tr>
          <tr>
          </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 试验耗材详情表详情
   */
  export default {
    data() {
      return {
        obj: {},
        showDetailModal: false
      }
    },
    methods: {
      _open(obj) {
        this.showDetailModal = true;
        this.obj = obj;
      }
    }
  }
</script>
