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
  setFavGames(state, payload) {
    state.favGames = payload;
  },
  setRoomId(state, payload) {
    state.roomId = payload;
  },
  setEmail(state, payload) {
    state.email = payload;
  },
  setRoomUsers(state, payload) {
    state.roomUsers = payload;
  },
  setRoomUsersListener(state, payload) {
    state.roomUsersListener = payload;
  },
  setNotifications(state, payload) {
    state.notifications = payload;
  },
  setSentFriendNotifications(state, payload) {
    state.sentFriendNotifications = payload;
  },
  setFriends(state, payload) {
    state.friends = payload;
  },
  setFriendStatus(state, payload) {
    state.friendStatus = payload;
  },
  ...vuexfireMutations,
};

export default mutations;
