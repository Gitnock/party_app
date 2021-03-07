import firebase from 'firebase/app';
import 'firebase/auth';
import { firestoreAction } from 'vuexfire';

const fb = require('../firebaseConfig.js');

const provider = new firebase.auth.GoogleAuthProvider();
const actions = {
  // Auth
  signUpAction({ commit }, payload) {
    firebase.auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        commit('setUser', response.user);
        fb.usersCollection
          .doc(response.user.uid)
          .set({
            name: payload.name,
            email: payload.email,
            tag: Math.floor(1000 + Math.random() * 9000),
            sex: '',
            dataofbirth: '',
            avatar: '',
            mfa_enabled: false,
            premiumType: '',
            flags: 0,
            userId: response.user.uid,
          })
          .then(() => {
          });
      })
      .catch((error) => {
        commit('setError', error.message);
      });
  },
  signInAction({ commit }, payload) {
    firebase.auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        commit('setUser', response.user);
      })
      .catch((error) => {
        commit('setError', error.message);
      });
  },
  signOutAction({ commit }) {
    firebase.auth()
      .signOut()
      .then(() => {
        commit('setUser', null);
      })
      .catch((error) => {
        commit('setError', error.message);
      });
  },
  googleAuthAction({ commit }) {
    firebase.auth()
      .signInWithPopup(provider)
      .then((data) => {
        const profile = data.user;
        const usersRef = fb.usersCollection.doc(data.user.uid);
        usersRef.get().then((snap) => {
          if (snap.exists) {
            commit('setUser', data.user);
          } else {
            usersRef
              .set({
                name: profile.displayName,
                email: profile.email,
                tag: Math.floor(1000 + Math.random() * 9000),
                sex: '',
                dataofbirth: '',
                avatar: profile.photoURL,
                mfa_enabled: false,
                premiumType: '',
                flags: 0,
                userId: profile.uid,
              })
              .then(() => {
                commit('setUser', data.user);
              });
          }
        });
      })
      .catch((error) => {
        commit('setError', error.message);
      });
  },
  // Profile
  bindUserProfileRef: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef('userProfile', fb.usersCollection.doc(state.user.uid))),
};

export default actions;
