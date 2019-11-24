const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;

const db = admin.firestore();

const startNewGameInDatabase = async ({ game_id: gameId, user_id: userId }) => {
  const deadlineDate = new Date();
  const deadlineTimestamp = new Date(deadlineDate.setDate(deadlineDate.getDate() + 7));
  const data = {
    current_shot_maker: userId,
    game_started: Timestamp.fromDate(new Date()),
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
