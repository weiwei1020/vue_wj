/**
 * 相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_maintain_manage/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/equip_maintain_manage/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/equip_maintain_manage/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async abolish({commit}, ids) {
      await http.post('/slims/v1/equip_maintain_manage/abolish/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async submit({commit}, ids) {
      await http.post('/slims/v1/equip_maintain_manage/submit/?ids=' + ids).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/equip_maintain_manage/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
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