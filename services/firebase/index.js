const admin = require('firebase-admin');

const initializeFirebaseApp = () => admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://forse-app.firebaseio.com',
});

module.exports = initializeFirebaseApp;
