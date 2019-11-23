const admin = require('firebase-admin');
const uuidv1 = require('uuid/v1');
const { Timestamp } = require('firebase-admin').firestore;


const db = admin.firestore();

const addShotToCurrentcurrentGameDatabase = async ({
  game_id: gameId,
  user_id: userId,
  match_id: matchId,
  activity_info: {
    distance,
    moving_time: movingTime,
    type: activityType,
    start_date: startDate,
    total_elevation_gain: elevationGain,
    map,
  },
  shot_type: shotType,
  shot_rules: shotRules,
}) => {
  try {
    const currentGameRef = await db.collection('current_games').doc(gameId);
    const currentGameData = await currentGameRef.get();
    const matchShotInfo = currentGameData.data().shots[matchId];
    const matchedShotId = uuidv1().replace(/-/g, '');
    const data = {
      shots: {
        ...currentGameData.data().shots,
        [matchId]: {
          ...matchShotInfo,
          matched_shot: matchedShotId,
        },
        [matchedShotId]: {
          distance,
          moving_time: movingTime,
          activity_type: activityType,
          player_id: userId,
          start_date: Timestamp.fromDate(new Date(startDate)),
          total_elevation_gain: elevationGain,
          shot_added: Timestamp.fromDate(new Date()),
          map,
          match_shot: matchId,
          type: shotType,
          rules: shotRules,
        },
      },
    };
    try {
      currentGameRef.update(data);
      return { status: 'success' };
    } catch (e) {
      return { error: e };
    }
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  addShotToCurrentcurrentGameDatabase,
};
