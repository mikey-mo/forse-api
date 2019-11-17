const admin = require('firebase-admin');

const initializeApp = () => admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://forse-app.firebaseio.com',
});

module.exports = initializeApp;
