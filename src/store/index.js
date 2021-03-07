import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const initialState = () => ({ user: null, error: null, userProfile: {} });
export default new Vuex.Store({
  state: initialState(),
  mutations,
  actions,
  getters,
  modules: {},
});
