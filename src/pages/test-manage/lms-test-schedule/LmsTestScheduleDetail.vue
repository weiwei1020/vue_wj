<template>
    <div>
        <Modal v-model="showDetailModal" title="实验管理-人员排班详情">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                            <th>人员名称</th>
                            <td>{{obj.staffName}}</td>
                        </tr>
                        <tr>
                            <th>班次</th>
                            <td>{{obj.shift === 0 ? '早班' : obj.shift === 1 ? '中班' : '晚班'}}</td>
                        </tr>
                        <tr>
                            <th>排班开始日期</th>
                            <td>{{this.$dateformat(obj.scheduleStartTime,"yyyy-mm-dd HH:MM:ss")}}</td>
                        </tr>
                        <tr>
                          <th>排班结束日期</th>
                          <td>{{this.$dateformat(obj.scheduleEndTime,"yyyy-mm-dd HH:MM:ss")}}</td>
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
     * 实验管理-人员排班详情
     */
    var dateFormat = require('dateformat');

    export default {
        data() {
            return {
                obj: {},
                showDetailModal: false,

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
