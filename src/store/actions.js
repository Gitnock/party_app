import firebase from 'firebase/app';
import 'firebase/auth';
import { firestoreAction } from 'vuexfire';
import {
  gamesCollection,
  usersCollection,
} from '../firebaseConfig';

const provider = new firebase.auth.GoogleAuthProvider();
const actions = {
  // Auth
  signUpAction({ commit }, payload) {
    return new Promise((res, rej) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit('setUser', response.user);
          usersCollection
            .doc(response.user.uid)
            .set({
              username: payload.username,
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
              res();
            });
        })
        .catch((error) => {
          commit('setError', error.message);
          rej(error);
        });
    });
  },
  signInAction({ commit }, payload) {
    return new Promise((res, rej) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit('setUser', response.user);
          res();
        })
        .catch((error) => {
          commit('setError', error.message);
          rej(error);
        });
    });
  },
  signOutAction({ commit }) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        commit('setUser', null);
      })
      .catch((error) => {
        commit('setError', error.message);
      });
  },
  googleAuthAction({ commit }) {
    return new Promise((res, rej) => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((data) => {
          const profile = data.user;
          const usersRef = usersCollection.doc(data.user.uid);
          usersRef.get().then((snap) => {
            if (snap.exists) {
              commit('setUser', data.user);
              res();
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
                  res();
                });
            }
          });
        })
        .catch((error) => {
          commit('setError', error.message);
          rej(error);
        });
    });
  },
  // Profile
  bindUserProfileRef: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef('userProfile', usersCollection.doc(state.user.uid))),
  // games list
  bindGameRef: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('gamesList', gamesCollection)),
};

export default actions;
