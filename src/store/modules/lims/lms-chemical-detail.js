/**
 * 试验耗材详情表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {}
};

const actions = {
    page({commit}, data) {
        http.post('/slims/v1/chemical_detail/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    /*查询分表的主表*/
    pageMain({commit}, data) {
      http.post('/slims/v1/chemical/page', data).then(function (resp) {
        commit('PAGE', resp);
      });
    },
    async add({commit}, data) {
        await http.post('/slims/v1/chemical_detail/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async addTwo({commit}, data) {
      await http.post('/slims/v1/chemical_detail/two', data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async edit({commit}, data) {
        await http.put('/slims/v1/chemical_detail/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },

  async editCommonly({commit}, data) {
    await http.put('/slims/v1/chemical_detail/editCommonly/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },

    async deleteByIds({commit}, ids) {
        await http.delete('/slims/v1/chemical_detail/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
  /**
   * 删除一般化学品的主附表
   * @param commit
   * @param ids
   * @returns {Promise.<void>}
   */
  async deleteCommonlyByIds({commit}, ids) {
    await http.delete('/slims/v1/chemical_detail/deleteCommonly/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
    async getById({commit}, id) {
        await http.get('/slims/v1/chemical_detail/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    /**
     * 获取一般化学品主表信息
     */
    async getCommonlyById({commit}, id) {
      await http.get('/slims/v1/chemical_detail/commonly_vo/' + id).then(function (resp) {
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
