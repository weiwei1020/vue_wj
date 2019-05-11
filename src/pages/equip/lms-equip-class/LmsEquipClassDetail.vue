<template>
    <div>
        <Modal v-model="showDetailModal" title="仪器分类信息表详情">
            <div class="maxHeight">
                <table class="tableClass">
                    <tbody>
                        <tr>
                            <th>类别名称</th>
                            <td>{{obj.apparatusSortName}}</td>
                        </tr>
                        <tr>
                            <th>描述</th>
                            <td>{{obj.apparatusSortRemark}}</td>
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
