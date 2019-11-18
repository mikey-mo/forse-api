const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;

const db = admin.firestore();

const creatNewGameInDatabase = async ({ players, goal, initial_shot: initialShot }) => {
  const data = {
    players: {
      contender: {
        id: players.contender,
        letters: '',
      },
      challenger: {
        id: players.challenger,
        letters: '',
      },
    },
    goal,
    shots: [initialShot],
    game_initiated: Timestamp.fromDate(new Date()),
    status: 'INITIATED',
  };
  try {
    db.collection('current_games').doc().set(data);
    return { status: 'success' };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  creatNewGameInDatabase,
};
