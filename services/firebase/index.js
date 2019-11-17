const admin = require('firebase-admin');

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;

const googleCredentials = require(GOOGLE_APPLICATION_CREDENTIALS);

const initializeFirebaseApp = () => admin.initializeApp({
  credential: admin.credential.cert(googleCredentials),
});

module.exports = initializeFirebaseApp;
