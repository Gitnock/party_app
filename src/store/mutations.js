import { vuexfireMutations } from 'vuexfire';

const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  setError(state, payload) {
    state.error = payload;
  },
  ...vuexfireMutations,
};

export default mutations;
