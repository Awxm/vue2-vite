// 数据转换
function dataDictionarty(data) {
  //  首先解构出一个数据解构
  const batchData = { code: {}, module: {} };
  for (let i = 0; i < data.length; i++) {
    const { dictCode } = data[i];
    batchData.code[dictCode] = data[i];
  }
  return batchData;
}

const state = {
  dataDictionarty_module: null,
  dataDictionarty_code: null,
};

const mutations = {
  SET_DATADICTIONARTY_MODULE: (state, module) => {
    state.dataDictionarty_module = module;
  },
  SET_DATADICTIONARTY_CODE: (state, code) => {
    state.dataDictionarty_code = code;
  },
};

const actions = {
  dataDictionarty({ commit }, data) {
    const { code: dataDictionarty_code, module: dataDictionarty_module } = dataDictionarty(data);
    commit('SET_DATADICTIONARTY_CODE', dataDictionarty_code);
    commit('SET_DATADICTIONARTY_MODULE', dataDictionarty_module);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
