const admin = require('firebase-admin');
const uuidv1 = require('uuid/v1');
const { Timestamp } = require('firebase-admin').firestore;


const db = admin.firestore();

const addShotToCurrentGameDatabase = async ({
  game_id: gameId,
  user_id: userId,
  match_id: matchId,
  activity_info: {
    distance,
    moving_time: movingTime,
    type,
    start_date: startDate,
    total_elevation_gain: elevationGain,
    map,
  },
}) => {
  try {
    const gameRef = await db.collection('current_games').doc(gameId);
    const gameData = await gameRef.get();
    const matchShotInfo = gameData.data().shots[matchId];
    const matchedShotId = uuidv1().replace(/-/g, '');
    const data = {
      shots: {
        ...gameData.data().shots,
        [matchId]: {
          ...matchShotInfo,
          matched_shot: matchedShotId,
        },
        [matchedShotId]: {
          distance,
          movingTime,
          type,
          player_id: userId,
          start_date: startDate,
          elevationGain,
          shot_added: Timestamp.fromDate(new Date()),
          map,
          match_shot: matchId,
        },
      },
    };
    try {
      gameRef.update(data);
      return { status: 'success' };
    } catch (e) {
      return { error: e };
    }
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  addShotToCurrentGameDatabase,
};
