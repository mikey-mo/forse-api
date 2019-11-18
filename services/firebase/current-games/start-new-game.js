const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;

const db = admin.firestore();

const startNewGameInDatabase = async (gameId) => {
  const data = {
    game_started: Timestamp.fromDate(new Date()),
    status: 'PLAYING',
  };
  try {
    const gameRef = db.collection('current_games').doc(gameId);
    gameRef.update(data);
    return { status: 'success' };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  startNewGameInDatabase,
};
