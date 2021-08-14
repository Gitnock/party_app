import firebase from 'firebase/app';
import 'firebase/auth';
import { firestoreAction } from 'vuexfire';
import {
  gamesCollection,
  // playersCollection,
  roomsCollection,
  userDataCollection,
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
          response.user.sendEmailVerification().then(() => {
            // Email verification sent!
            console.log('Email sent');
          });
          usersCollection
            .doc(response.user.uid)
            .set({
              username: payload.username,
              tag: Math.floor(1000 + Math.random() * 9000),
              avatar: '',
              mfa_enabled: false,
              premiumType: '',
              flags: 0,
              userId: response.user.uid,
            })
            .then(() => {
              response.user.updateProfile({
                displayName: payload.username,
              });
              userDataCollection
                .doc(response.user.uid)
                .set({
                  email: payload.email,
                  dob: firebase.firestore.FieldValue.serverTimestamp(),
                  sex: '',
                })
                .then(() => {
                  res();
                })
                .catch((err) => {
                  rej(err);
                });
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
    return new Promise((res, rej) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit('setUser', null);
          res();
        })
        .catch((error) => {
          commit('setError', error.message);
          rej(error);
        });
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
                  username: profile.displayName,
                  tag: Math.floor(1000 + Math.random() * 9000),
                  avatar: profile.photoURL,
                  mfa_enabled: false,
                  premiumType: '',
                  flags: 0,
                  userId: profile.uid,
                })
                .then(() => {
                  commit('setUser', data.user);
                  userDataCollection
                    .doc(data.user.uid)
                    .set({
                      email: profile.email,
                      dob: firebase.firestore.FieldValue.serverTimestamp(),
                      sex: '',
                    })
                    .then(() => {
                      res();
                    })
                    .catch((err) => {
                      rej(err);
                    });
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
  // room
  bindRoomDataRef: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef('roomData', roomsCollection.doc(state.roomId))),
  setRoomUsersAction({ commit }, payload) {
    return new Promise((res, rej) => {
      roomsCollection
        .doc(payload.roomId)
        .get()
        .then((doc) => {
          const data = doc.data();
          const userArray = data.players.filter(
            (uid) => uid !== payload.userId,
          );
          // const gameId = data.game;
          usersCollection
            .where('userId', 'in', userArray)
            .get()
            .then((snap) => {
              // eslint-disable-next-line prefer-const
              let users = [];
              snap.forEach((userDoc) => {
                const userData = userDoc.data();
                users.push({
                  avatar: userData.avatar,
                  username: userData.username,
                  userId: userData.userId,
                });
              });
              commit('setRoomUsers', users);
              res();
            })
            .catch((error) => {
              commit('setError', error.message);
              rej();
            });
        });
    });
  },
  setRoomIdAction({ commit }, payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('setRoomId', payload);
        resolve();
      }, 1000);
    });
  },
  hostGameAction({ commit }, payload) {
    const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
    return new Promise((res, rej) => {
      roomsCollection
        .add({
          createdAt: myTimestamp,
          game: payload.game,
          players: payload.players,
          size: payload.size,
          full: false,
        })
        .then((docRef) => {
          commit('setRoomId', docRef.id);
          res();
        })
        .catch((error) => {
          rej(error);
        });
    });
  },
  // joinGameAction({ commit }, payload) {
  //   const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
  //   const playerRef = playersCollection.doc();
  //   const playerId = playerRef.id;
  //   return new Promise((res, rej) => {
  //     playersCollection
  //       .doc(playerId)
  //       .set({
  //         userId: payload.userId,
  //         game: payload.game,
  //         createdAt: myTimestamp,
  //         size: payload.size,
  //       })
  //       .then(() => {
  //         playersCollection.doc(playerId).onSnapshot((snap) => {
  //           const { roomId } = snap.data();
  //           if (roomId !== '') {
  //             roomsCollection.doc(roomId).onSnapshot((snapShot) => {
  //               const isfull = snapShot.data().full;
  //               if (isfull) {
  //                 commit('setRoom', roomId );
  //                 res();
  //               }
  //             });
  //           }
  //         });
  //       }).catch((error) => {
  //         rej(error);
  //       });
  //   });
  // },
};

export default actions;
