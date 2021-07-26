import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';

const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_MEASUREMENT_ID,
};

firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const { currentUser } = auth;
const rtDb = firebase.database();
const storage = firebase.storage();
const getFireApp = firebase.app();

// emulator
// if (window.location.hostname === 'localhost') {
//   db.useEmulator('localhost', 8080);
//   auth.useEmulator('http://localhost:9099');
//   storage.useEmulator('localhost', 9199);
//   firebase.functions().useEmulator('localhost', 5001);
// }

// firebase collections
const usersCollection = db.collection('users');
const userDataCollection = db.collection('userData');
const friendsCollection = db.collection('friends');
const gamesCollection = db.collection('games');
const playersCollection = db.collection('players');
const roomsCollection = db.collection('rooms');
const notificationsCollection = db.collection('notifications');
const friendChatCollection = db.collection('friendChat');

export {
  db,
  rtDb,
  auth,
  currentUser,
  usersCollection,
  friendsCollection,
  gamesCollection,
  playersCollection,
  roomsCollection,
  notificationsCollection,
  friendChatCollection,
  storage,
  userDataCollection,
  getFireApp,
};
