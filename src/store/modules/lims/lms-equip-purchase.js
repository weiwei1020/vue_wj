/**
 * 仪器采购订单表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    detail:'',
    fileList:{},
};

const actions = {
    async page({commit}, data) {
      await http.post('/slims/v1/equip_purchase/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/equip_purchase/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/equip_purchase/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
      await http.delete('/slims/v1/equip_purchase/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/equip_purchase/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async submit({commit}, ids) {
      await http.post('/slims/v1/equip_purchase/submit?ids=' + ids).then(function (resp) {
          commit('SUCCESS', resp);
        });
    },
    async approve({commit}, data) {
      await http.post('/slims/v1/equip_purchase/approve/' + data.id, data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async addDetail({commit}, data) {
      await http.post('/slims/v1/equip_purchase/addDetail/', data).then(function (resp) {
        commit('DETAIL', resp);
      });
    },
    async getTemp({commit}) {
      await http.get('/slims/v1/equip_purchase/getTemp/').then(function (resp) {
        commit('GET_BY_ID', resp);
      });
    },
    async getFileList({commit},data) {
      await http.post('/slims/v1/equip_file/list', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async deleteFileById({commit}, id) {
      await http.delete('/slims/v1/equip_purchase/deleteFile/?id=' + id).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
};

const mutations = {
    PAGE(state, resp) {
    state.page = resp;
    },
    DETAIL(state, resp) {
      state.detail = resp;
    },
    LIST(state, resp){
      state.fileList = resp;
    },
    GET_BY_ID(state, resp) {
        state.model = resp;
    },
    SUCCESS(state, resp) {
        state.success = resp;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
