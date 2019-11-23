const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;

const calculateLetterToAdd = (opponent) => {
  const playerType = opponent.contender ? 'contender' : 'challenger';
  const { letters } = opponent[playerType];
  let newLetters;
  switch (letters) {
    case 'B':
      newLetters = 'BI';
      break;
    case 'BI':
      newLetters = 'BIK';
      break;
    case 'BIK':
      newLetters = 'BIKE';
      break;
    default:
      newLetters = 'B';
  }
  return {
    ...opponent,
    [playerType]: {
      ...opponent[playerType],
      letters: newLetters,
    },
  };
};

const getOpponentId = (playerId, players) => {
  const objectKeys = Object.keys(players);
  let opponent;
  objectKeys.forEach((key) => {
    if (players[key].id !== playerId) opponent = players[key].id;
  });
  return opponent;
};

const updatePlayerInfo = (playerId, players) => {
  const objectKeys = Object.keys(players);
  let opponent;
  objectKeys.forEach((key) => {
    if (players[key].id !== playerId) opponent = { [key]: players[key] };
  });
  const updatedOpponent = calculateLetterToAdd(opponent);
  const updatedPlayers = {
    ...players,
    ...updatedOpponent,
  };
  return updatedPlayers;
};

let addLetterToUserInDatabase;

try {
  addLetterToUserInDatabase = async (latestShotInfo) => {
    const db = admin.firestore();
    const {
      latestShot: {
        player_id: playerId,
      },
      gameId,
    } = latestShotInfo;
    const currentGameRef = await db.collection('current_games').doc(gameId);
    const currentGame = await currentGameRef.get();
    const { players } = currentGame.data();
    const opponentId = getOpponentId(playerId, players);
    const updatedPlayers = updatePlayerInfo(playerId, players);
    const data = {
      players: {
        ...players,
        ...updatedPlayers,
      },
      current_shot_maker: opponentId,
      latest_shot: {
        player_id: opponentId,
        shot_id: null,
        time: Timestamp.fromDate(new Date()),
      },
    };
    try {
      currentGameRef.update(data);
      return { status: 'success' };
    } catch (e) {
      return { error: e };
    }
  };
} catch (e) {
  console.log('firebase not running');
}

module.exports = {
  addLetterToUserInDatabase,
};
