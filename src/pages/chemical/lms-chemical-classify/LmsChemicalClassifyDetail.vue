<template>
  <div>
    <Modal v-model="showDetailModal" title="归类详情" class="zIndex-1100">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>归类名称</th>
            <td>{{obj.name}}</td>
          </tr>
          <tr>
            <th>归类库存量</th>
            <td>{{obj.stock}}</td>
          </tr>
          <tr>
            <th>计量方式</th>
            <td>{{obj.unit}}</td>
          </tr>
          <tr>
            <th>预警库存量</th>
            <td>{{obj.warning}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td>{{obj.remark}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 试验耗材归类表详情
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
