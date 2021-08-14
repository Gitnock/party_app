const getters = {
  getUser(state) {
    return state.user;
  },
  isUserAuth(state) {
    return !!state.user;
  },
  getError(state) {
    return state.error;
  },
  getProfile(state) {
    return state.userProfile;
  },
  getGames(state) {
    return state.gamesList;
  },
  getGame(state) {
    return state.currentGame;
  },
  getRoomId(state) {
    return state.roomId;
  },
  getEmail(state) {
    return state.email;
  },
  getRoomUsers(state) {
    return state.roomUsers;
  },
  getRoomData(state) {
    return state.roomData;
  },
};

export default getters;
