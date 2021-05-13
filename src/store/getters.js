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
  getRoom(state) {
    return state.room;
  },
  getEmail(state) {
    return state.email;
  },
};

export default getters;
