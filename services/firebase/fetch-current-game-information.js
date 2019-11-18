const admin = require('firebase-admin');

const db = admin.firestore();

const fetchCurrentGameFromDatabase = async (gameId) => {
  const currentGamesRef = db.collection('current_games');
  const currentGame = await currentGamesRef.doc(gameId.toString()).get();
  const currentGameData = currentGame.data();
  return currentGameData;
};

module.exports = {
  fetchCurrentGameFromDatabase,
};
