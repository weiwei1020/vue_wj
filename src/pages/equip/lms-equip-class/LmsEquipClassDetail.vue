<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器分类信息表详情">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                            <th>类别名</th>
                            <td>{{obj.name}}</td>
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
     * 仪器分类信息表详情
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
