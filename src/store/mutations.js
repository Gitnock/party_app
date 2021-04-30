import { vuexfireMutations } from 'vuexfire';

const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  setError(state, payload) {
    state.error = payload;
  },
  setGame(state, payload) {
    state.currentGame = payload;
  },
  setRoom(state, payload) {
    state.room = payload;
  },
  ...vuexfireMutations,
};

export default mutations;
