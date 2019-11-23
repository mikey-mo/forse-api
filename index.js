const theFramework = require('the-framework');
const dotenv = require('dotenv');
const cron = require('node-cron');

const { fetchCurrentGamesFromDatabase } = require('./services/firebase/current-games/fetch-current-games');
const { addLetterToUserInDatabase } = require('./services/firebase/current-games/add-letter-to-user');

dotenv.config();

const initializeFirebaseApp = require('./services/firebase/index');

const { PORT } = process.env;

initializeFirebaseApp();

let currentGames;

cron.schedule('* * * * * *', async () => {
  const games = await fetchCurrentGamesFromDatabase();
  currentGames = games.filter((game) => game.status === 'PLAYING');
  if (currentGames.length) {
    const currentGameLatestShots = currentGames.map((latestShot) => {
      return ({ latestShot: latestShot.latest_shot, gameId: latestShot.game_id });
    });
    const timeNow = new Date().getTime();
    const latestShotTime = currentGameLatestShots[0].latestShot.time.toDate().getTime();
    const latestShotTimePlusDay = new Date(latestShotTime);
    latestShotTimePlusDay.setDate(latestShotTimePlusDay.getDate() + 2);
    if (timeNow >= latestShotTimePlusDay) {
      return addLetterToUserInDatabase(currentGameLatestShots[0]);
    }
  }
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
