const theFramework = require('the-framework');
const dotenv = require('dotenv');

const { cronCheckForLostShot } = require('./services/cron/check-for-lost-shot');

dotenv.config();

const initializeFirebaseApp = require('./services/firebase/index');

const { PORT } = process.env;

initializeFirebaseApp();

theFramework.startServer({
  // Optional method to check user token and return either a user object or null
  // if (token) {
  // Code to check token
  // }
  authenticationMethod: async () => null,
  apiDirectory: '/api', // Directory you will store your route files in
  userTokenHeader: 'x-user-token', // Header you will use for your user tokens
  port: PORT,
});

cronCheckForLostShot();
