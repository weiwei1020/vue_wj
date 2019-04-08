<template>
  <div>
    <Modal v-model="showDetailModal" title="试验耗材分类表详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>分类名称</th>
            <td>{{obj.name}}</td>
          </tr>
          <!--<tr>
            <th>上级分类</th>
            <td>{{obj.parentName}}</td>
          </tr>-->
          <tr>
            <th>编号</th>
            <td>{{obj.num}}</td>
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
   * 试验耗材分类表详情
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
