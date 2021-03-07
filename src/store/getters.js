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
};

export default getters;
