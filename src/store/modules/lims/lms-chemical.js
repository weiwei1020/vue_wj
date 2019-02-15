/**
 * 试验耗材表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  page2: {},
  pageNoClass: {},
  unitList: {},
  storeList: {},
  pageInclude: {},
  pageExclude: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/chemical/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageRelSupplier({commit}, data) {
    // 供应商关联耗材分页列表
    await http.post('/slims/v1/chemical/rel_supplier_page/' + data.id, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },

  async pageExcludeRelSupplier({commit}, data) {
    // 供应商未关联耗材分页列表
    await http.post('/slims/v1/chemical/rel_supplier_exclude_page/' + data.id, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async addRelSupplier({commit}, data) {
    //console.log('data', data);
    await http.post('/slims/v1/chemical/rel_supplier/' + data.id + '?chemicalIds=' + data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/chemical/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async addChemical({commit}, data) {
    await http.post('/slims/v1/chemical/add_chemical/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/chemical/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteRelSupplierByIds({commit}, data) {
    // 删除供应商关联耗材
    await http.delete('/slims/v1/chemical/rel_supplier/' + data.id + '?chemicalIds=' + data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/chemical/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/chemical/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async pageClassifyChemical({commit}, data) {
    await http.post('/slims/v1/chemical/page_classify_chemical/' + data.classifyId, data.obj).then(function (resp) {
      commit('PAGE2', resp);
    });
  },
  async pageNoClassify({commit}, data) {
    await http.post('/slims/v1/chemical/page', data).then(function (resp) {
      commit('PAGE_NO_CLASS', resp);
    });
  },
  async pageChemicalBySupplier({commit}, data) {
    await http.post('/slims/v1/chemical/page_chemical_supplier/' + data.supplierId, data.obj).then(function (resp) {
      commit('PAGE2', resp);
    });
  },
  async pageChemicalByClass({commit}, data) {
    await http.post('/slims/v1/chemical/page_chemical_classify/' + data.classId, data.obj).then(function (resp) {
      commit('PAGE2', resp);
    });
  },
  async relPurchaseChemicalPrice({commit}, data) {
    await http.post('/slims/v1/chemical/supplier_chemical_price/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getUnit({commit}) { //单位
    await http.post('/slims/v1/unit/list').then(function (resp) {
      commit('UNITLIST', resp);
    });
  },
  async addStoreHose({commit}, data) { //关联仓库-添加
    await http.post('/slims/v1/chemical_rel_storehouse/' + data.chemicalId + '?storehouseIds=' + data.storehouseIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getStoreHose({commit}, id) { //关联仓库-回显
    await http.post('/slims/v1/chemical_rel_storehouse/list_rel_chemical/' + id).then(function (resp) {
      commit('STORElIST', resp);
    });
  },
  async getInclude({commit}, data) { //已归类 page
    await http.post('/slims/v1/chemical/page_include_classify/' + data.classifyId, data).then(function (resp) {
      commit('PAGE_CLASS_INCLUDE', resp);
    });
  },
  async getExclude({commit}, data) { //未归类 page
    await http.post('/slims/v1/chemical/page_exclude_classify/' + data.classifyId, data).then(function (resp) {
      commit('PAGE_CLASS_EXCLUDE', resp);
    });
  },
  async chemicalClass({commit}, data) { //提交至归类
    await http.post('/slims/v1/chemical_classify/rel_chemical_' + data.classifyId + '?chemicalIds=' + data.chemicalIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async chemicalClassDel({commit}, data) { //移除及批量移除已添加的归类
    await http.delete('/slims/v1/chemical_classify/rel_chemical_' + data.classifyId + '?chemicalIds=' + data.chemicalIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //获取修改历史
  async getRecordChangeById({commit}, data) {
    await http.post('/slims/v1/chemical_history/page?chemicalId=' + data.chemicalId,data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //耗材采购审批统计
  async getStatistic({commit}, data) {
    await http.post('/slims/v1/chemical_rel_purchase/pages',data).then(function (resp) {
      commit('PAGE', resp);
    });
  },

};


const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  PAGE2(state, resp) {
    state.page2 = resp;
  },
  PAGE_NO_CLASS(state, resp) {
    state.pageNoClass = resp;
  },
  PAGE_CLASS_INCLUDE(state, resp) {
    state.pageInclude = resp;
  },
  PAGE_CLASS_EXCLUDE(state, resp) {
    state.pageExclude = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  UNITLIST(state, resp) {
    state.unitList = resp;
  },
  STORElIST(state, resp) {
    state.storeList = resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
