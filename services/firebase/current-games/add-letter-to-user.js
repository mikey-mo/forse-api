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
  const updatedOpponent = { ...opponent };
  if (newLetters === 'BIKE') updatedOpponent.game_over = true;
  return {
    ...updatedOpponent,
    [playerType]: {
      ...opponent[playerType],
      letters: newLetters,
    },
  };
};

const gameCompletedInDatabase = async (gameInfo, gameId, db) => {
  const completedGameRef = await db.collection('completed_games').doc(gameId);
  const data = {
    ...gameInfo,
    status: 'COMPLETE',
  };
  try {
    await completedGameRef.set(data);
  } catch (e) {
    return { error: e };
  }
  return { status: 'succes' };
};

const getOpponentId = (playerId, players) => {
  const objectKeys = Object.keys(players);
  let opponent;
  objectKeys.forEach((key) => {
    if ((key !== 'game_over') && (players[key].id !== playerId)) {
      opponent = players[key].id;
    }
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
  if (updatedOpponent.gameOver) {
    return {
      gameOver: updatedOpponent.gameOver,
      winner: playerId,
    };
  }
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
    const { gameId } = latestShotInfo;
    const currentGameRef = await db.collection('current_games').doc(gameId);
    const currentGame = await currentGameRef.get();
    const {
      current_shot_maker: currentShotMaker,
      players,
      latest_shot: {
        type: latestShotType,
      },
    } = currentGame.data();
    const updatedPlayers = updatePlayerInfo(currentShotMaker, players);
    const data = {
      players: {
        ...players,
        ...updatedPlayers,
      },
      latest_shot: {
        player_id: currentShotMaker,
        shot_id: null,
        time: Timestamp.fromDate(new Date()),
        type: 'MISS',
      },
    };
    if (latestShotType === 'MISS') {
      data.current_shot_maker = getOpponentId(currentShotMaker, players);
    }

    try {
      await currentGameRef.update(data);
    } catch (e) {
      return { error: e };
    }

    if (updatedPlayers.game_over) {
      await gameCompletedInDatabase({
        ...currentGame.data(),
        ...data,
        winning_player: updatedPlayers.winner,
      }, gameId, db);
      await currentGameRef.delete();
      return { status: 'success' };
    }
    return { status: 'success' };
  };
} catch (e) {
  console.log('firebase not running');
}

module.exports = {
  addLetterToUserInDatabase,
};
