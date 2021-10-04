import { Promise } from 'core-js';
import firebase from 'firebase/app';
import 'firebase/auth';
import { firestoreAction } from 'vuexfire';
import {
  gamesCollection,
  notificationsCollection,
  // playersCollection,
  roomsCollection,
  statusCollection,
  userDataCollection,
  usersCollection,
  friendsCollection,
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
              const myTimestamp = firebase.firestore.Timestamp.fromDate(
                new Date(),
              );
              userDataCollection
                .doc(response.user.uid)
                .set({
                  email: payload.email,
                  dob: firebase.firestore.FieldValue.serverTimestamp(),
                  sex: '',
                  createdAt: myTimestamp,
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
              const myTimestamp = firebase.firestore.Timestamp.fromDate(
                new Date(),
              );
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
                      createdAt: myTimestamp,
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
  // status
  bindUserStatusRef: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef('userStatus', statusCollection.doc(state.user.uid))),
  // games list
  bindGameRef({ commit }) {
    gamesCollection.get().then((querySnapshot) => {
      if (querySnapshot) {
        const documents = querySnapshot.docs.map((doc) => doc.data());
        commit('setGames', documents);
      }
    });
  },
  // room
  bindRoomDataRef: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef('roomData', roomsCollection.doc(state.roomId))),
  unbindRoomDataRef: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('roomData');
  }),
  setRoomUsersAction({ commit }, payload) {
    return new Promise((res, rej) => {
      const unsub = roomsCollection
        .doc(payload.roomId)
        .collection('activePlayers')
        .onSnapshot((querySnapshot) => {
          const userIds = [];
          querySnapshot.forEach((doc) => {
            const { uid, chatId } = doc.data();
            userIds.push({ uid, chatId });
          });

          const userArray = userIds.filter(
            (user) => user.uid !== payload.userId,
          );
          if (userArray.map((user) => user.uid).length > 0) {
            usersCollection
              .where(
                'userId',
                'in',
                userArray.map((user) => user.uid),
              )
              .get()
              .then((snap) => {
                // eslint-disable-next-line prefer-const
                let users = [];
                snap.forEach((userDoc) => {
                  const userData = userDoc.data();
                  const ids = userArray
                    .filter((user) => user.uid === userData.userId)
                    .map((x) => x.chatId);

                  usersCollection
                    .doc(userData.userId)
                    .collection('favGames')
                    .doc(payload.gameId)
                    .get()
                    .then((favDoc) => {
                      const { uname } = favDoc.data();
                      users.push({
                        avatar: userData.avatar,
                        username: userData.username,
                        userId: userData.userId,
                        chatId: ids[0],
                        uname,
                      });
                    })
                    .catch((err) => {
                      commit('setError', err.message);
                      rej(err);
                    });
                });
                commit('setRoomUsers', users);
                res();
              })
              .catch((error) => {
                commit('setError', error.message);
                rej();
              });
          }
        });
      commit('setRoomUsersListener', unsub);
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
  favGameAction({ commit }, uid) {
    return new Promise((res, rej) => {
      usersCollection
        .doc(uid)
        .collection('favGames')
        .get()
        .then((querySnapshot) => {
          const favGames = [];
          querySnapshot.forEach((doc) => {
            favGames.push(doc.data());
          });
          commit('setFavGames', favGames);
          res();
        })
        .catch(() => {
          rej();
        });
    });
  },
  notificationsAction({ commit, state }) {
    const query = notificationsCollection
      .where('isActive', '==', true)
      .where('to', '==', state.user.uid);
    query.onSnapshot((querySnapshot) => {
      const notifications = [];
      querySnapshot.forEach((doc) => {
        const {
          createdAt, from, title, message, type, id, to,
        } = doc.data();
        usersCollection
          .doc(from)
          .get()
          .then((user) => {
            if (user.exists) {
              const { username, tag, avatar } = user.data();
              notifications.push({
                username,
                tag,
                createdAt,
                avatar,
                from,
                to,
                title,
                message,
                type,
                id,
              });
            }
          });
      });
      commit('setNotifications', notifications);
    });
  },
  friendAction({ commit, state }) {
    return new Promise((res) => {
      friendsCollection
        .doc(state.user.uid)
        .collection('friends')
        .get()
        .then((snap) => {
          const friends = [];
          snap.forEach((friendDoc) => {
            const { chatId, createdAt, uid } = friendDoc.data();
            usersCollection
              .doc(uid)
              .get()
              .then((userDoc) => {
                const { avatar, tag, username } = userDoc.data();
                friends.push({
                  chatId,
                  createdAt,
                  uid,
                  avatar,
                  tag,
                  username,
                });
              });
          });
          commit('setFriends', friends);
          res();
        });
    });
  },
  friendStatusAction({ commit, state }) {
    const friends = JSON.parse(JSON.stringify(state.friends));
    console.log(friends);
    statusCollection
      .where('__name__', 'in', friends.map((x) => x.uid))
      .onSnapshot((querySnapshot) => {
        const states = [];
        querySnapshot.forEach((doc) => {
          // eslint-disable-next-line camelcase
          const data = doc.data();
          states.push({
            uid: doc.id,
            last_changed: data.last_changed,
            state: data.state,
          });
        });

        commit('setFriendStatus', states);
      });
  },
  // hostGameAction({ commit }, payload) {
  //   const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
  //   return new Promise((res, rej) => {
  //     roomsCollection
  //       .add({
  //         createdAt: myTimestamp,
  //         game: payload.game,
  //         players: payload.players,
  //         size: payload.size,
  //         full: false,
  //       })
  //       .then((docRef) => {
  //         commit('setRoomId', docRef.id);
  //         res();
  //       })
  //       .catch((error) => {
  //         rej(error);
  //       });
  //   });
  // },
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
