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
  setGames(state, payload) {
    state.gamesList = payload;
  },
  setRoom(state, payload) {
    state.room = payload;
  },
  setEmail(state, payload) {
    state.email = payload;
  },
  setRoomUsers(state, payload) {
    state.roomUsers = payload;
  },
  ...vuexfireMutations,
};

export default mutations;
