const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;

const db = admin.firestore();

const startNewGameInDatabase = async (gameId) => {
  const startTimestamp = new Date();
  const deadlineDate = new Date();
  const deadlineTimestamp = new Date(deadlineDate.setDate(deadlineDate.getDate() + 7));
  const data = {
    game_started: Timestamp.fromDate(startTimestamp),
    game_deadline: Timestamp.fromDate(deadlineTimestamp),
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
