const getters = {
  getUser(state) {
    return state.user;
  },
  getUserStatus(state) {
    return state.userStatus;
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
  getFavGames(state) {
    return state.favGames;
  },
  getFavGamesSettings(state) {
    const games = [];
    state.favGames.forEach((game) => {
      const newGm = state.gamesList.filter((x) => x.gameId === game.gameId)[0];
      games.push({
        gameId: newGm.gameId,
        url_square: newGm.url_square,
        gameName: newGm.gameName,
        uname: game.uname,
      });
    });

    return games;
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
  getRoomUsersListener(state) {
    return state.roomUsersListener;
  },
};

export default getters;
