<template>
  <div>
    <Modal v-model="showDetailModal" title="耗材详情" :width="700">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>耗材编号</th>
            <td>{{this.obj.num}}</td>
            <th>耗材名称</th>
            <td>{{this.obj.name}}</td>
          </tr>
          <tr>
            <th>耗材类别</th>
            <td>{{this.obj.consumable}}</td>
            <th>仓库位置</th>
            <td>{{obj.storehouse}}</td>
          </tr>
          <tr>
            <th>库存量</th>
            <td>{{obj.stock}}</td>
            <th>计量单位</th>
            <td>{{this.obj.unit}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td  colspan="5">{{obj.remark}}</td>
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
