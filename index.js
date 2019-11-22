const theFramework = require('the-framework');
const dotenv = require('dotenv');
const cron = require('node-cron');

const { fetchCurrentGamesFromDatabase } = require('./services/firebase/current-games/fetch-current-games');

dotenv.config();

const initializeFirebaseApp = require('./services/firebase/index');

const { PORT } = process.env;

initializeFirebaseApp();

let currentGames;

cron.schedule('* * * * * *', async () => {
  const games = await fetchCurrentGamesFromDatabase();
  currentGames = games;
  console.log('hey bitch', currentGames);
});

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
