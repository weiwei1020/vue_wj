/**
 * 相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    orgList: {},
    fileList:{},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_check/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
        await http.post('/slims/v1/equip_check/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.put('/slims/v1/equip_check/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
        await http.delete('/slims/v1/equip_check/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
        await http.get('/slims/v1/equip_check/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async submit({commit}, ids) {
      await http.post('/slims/v1/equip_check/submit?ids=' + ids).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async approve({commit}, data) {
      await http.post('/slims/v1/equip_check/approve/' + data.id, data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async deleteFileById({commit}, id) {//删除附件
      await http.delete('/slims/v1/equip_check/deleteFile/?id=' + id).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async getTemp({commit}, id) {
      await http.get('/slims/v1/equip_check/getTemp/').then(function (resp) {
        commit('GET_BY_ID', resp);
      });
    },
    async getFileList({commit},data) {
      await http.post('/slims/v1/equip_file/list',data).then(function (resp) {
        commit('LIST', resp);
      });
    },
};

const mutations = {
    PAGE(state, resp) {
        state.page = resp;
    },
    GET_BY_ID(state, resp) {
        state.model = resp;
    },
    LIST(state, resp){
      state.fileList = resp;
    },
    SUCCESS(state, resp) {
        state.success = resp;
    },
    ORG_TREE(state, resp){
      state.orglist = resp;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
