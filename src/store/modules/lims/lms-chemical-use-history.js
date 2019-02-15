/**
 * 试验耗材分类表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
    treeList:{},
    include:{},
    exclude:{}
};

const actions = {
    async page({commit}, data) {
      await http.post('/slims/v1/chemical_receive/page_get_y', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  async addPros({commit}, ids) {//添加到归还单(多条)
    await http.post('/slims/v1/chemical_receive/give/' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async removePros({commit}, ids) {//移除用尽耗材
    await http.post('/slims/v1/chemical_receive/exhaust/' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async givePush({commit}, data) {//归还单审批
    await http.post('/slims/v1/chemical_receive/give_push',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deletePurIds({commit}, ids) {//归还单删除
    await http.post('/slims/v1/chemical_receive/give_out/'+ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async chemicalPageTemp({commit}, data) {
    await http.post('/slims/v1/chemical_give/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async addUse({commit}, data) {
    await http.post('/slims/v1/chemical_receive/cause', data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async UseHistoryById({commit}, data) {
    await http.post('/slims/v1/chemical_receive_cause/page?receiveId='+data.receiveId).then(function (resp) {
      commit('PAGE', resp);
    });
  },

    //已用尽
  async UseUpPage({commit}, data) {
      await http.post('/slims/v1/chemical_receive/page_exhaust', data).then(function (resp) {
        commit('PAGE', resp);
      });
    },
  async returnPage({commit}, data) {
      await http.post('/slims/v1/chemical_give/page_My', data).then(function (resp) {
        commit('PAGE', resp);
      });
    },






    async addReceiveOne({commit}, data) {//添加到申请单
      await http.post('/slims/v1/chemical_receive/add_receiveOne?ChemicalId=' + data.id,data.obj).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async add({commit}, data) {
        await http.post('/slims/v1/chemical_category/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.put('/slims/v1/chemical_category/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteById({commit}, id) {
        await http.delete('/slims/v1/chemical_category/' + id).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
        await http.get('/slims/v1/chemical_category/vo_' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    //角色耗材分类管理
    async includePage({commit}, data) {
      await  http.post('/slims/v1/chemical_category/list_include_role/'+ data).then(function (resp) {
          commit('INCLUDE_PAGE', resp);
      });
    },
    async  excludePage({commit}, data) {
      await http.post('/slims/v1/chemical_category/list_exclude_role/'+ data).then(function (resp) {
        commit('EXCLUDE_PAGE', resp);
      });
    },
    async  list({commit}, data) {
      await http.post('/slims/v1/chemical_category/list', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async  listKeyword({commit}, data) { //tree查询
      await http.post('/slims/v1/chemical_category/list?name='+data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async  listCurrentUser({commit}, data) {
      await http.post('/slims/v1/chemical_category/list_current_user', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async addRole({commit}, data) {
      await http.post('/slims/v1/chemical_category/role_category/'+data.roleId+'?categoryIds='+data.categoryIds).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async deleteAll({commit}, data) {
      await http.delete('/slims/v1/chemical_category/role_category/' + data.roleId+'?categoryIds='+data.categoryIds).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async treeList({commit}) { //耗材分类树
      await http.get('/slims/v1/chemical_category/category_tree').then(function (resp) {
        commit('TREE_LIST', resp);
      });
    },
    async proTreeKeyword({commit},data) { //耗材分类树
      await http.get('/slims/v1/chemical_category/category_tree?name=' + data).then(function (resp) {
        commit('TREE_LIST', resp);
      });
    },
    async treeListAll({commit}) { //耗材分类树（弹出）
      await http.get('/slims/v1/chemical_category/category_tree_all').then(function (resp) {
        commit('TREE_LIST', resp);
      });
    },
    async treeListAllKeyWord({commit},data) { //耗材分类树search(弹出)
      await http.get('/slims/v1/chemical_category/category_tree_all?name=' + data).then(function (resp) {
        commit('TREE_LIST', resp);
      });
    },
    async roleCategory({commit},data) { //添加角色和耗材
      await http.post('/slims/v1/chemical_category/role_category/'+data.id+'?categoryIds='+data.idsList).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async excludeRoleList({commit},id) { //回显耗材
      await http.post('/slims/v1/chemical_category/list_include_role/'+id).then(function (resp) {
        commit('INCLUDE', resp);
      });
    },

};

const mutations = {
    PAGE(state, resp) {
        state.page = resp;
    },
    LIST(state, resp) {
      state.list = resp;
    },
    INCLUDE_PAGE(state, resp) {
      state.include = resp;
    },
    EXCLUDE_PAGE(state, resp) {
      state.exclude = resp;
    },
    GET_BY_ID(state, resp) {
        state.model = resp;
    },
    SUCCESS(state, resp) {
        state.success = resp;
    },
    TREE_LIST(state, resp) {
      state.treeList = resp;
    },
    INCLUDE(state, resp) {
      state.include = resp;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
