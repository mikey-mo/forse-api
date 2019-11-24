const cron = require('node-cron');

const { fetchCurrentGamesFromDatabase } = require('../firebase/current-games/fetch-current-games');
const { addLetterToUserInDatabase } = require('../firebase/current-games/add-letter-to-user');

const cronCheckForLostShots = () => {
  cron.schedule('* * * * *', async () => {
    const games = await fetchCurrentGamesFromDatabase();
    const currentGames = games.filter((game) => game.status === 'PLAYING');
    if (currentGames.length) {
      const currentGameLatestShots = currentGames.map((latestShot) => ({
        latestShot: latestShot.latest_shot,
        gameId: latestShot.game_id,
      }));
      const timeNow = new Date().getTime();
      const latestShotTime = currentGameLatestShots[0].latestShot.time.toDate().getTime();
      const latestShotTimePlusDay = new Date(latestShotTime);
      latestShotTimePlusDay.setDate(latestShotTimePlusDay.getDate() + 2);
      if (timeNow >= latestShotTimePlusDay) {
        return addLetterToUserInDatabase(currentGameLatestShots[0]);
      }
    }
    return null;
  });
};

module.exports = { cronCheckForLostShots };
