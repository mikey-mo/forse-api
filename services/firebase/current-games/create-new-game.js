const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;
const uuidv1 = require('uuid/v1');

const db = admin.firestore();

const createNewGameInDatabase = async ({
  players: {
    contender,
    challenger,
  },
  goal,
  initial_shot: {
    map,
    distance,
    total_elevation_gain: totalElevationGain,
    type: activityType,
    start_date: startDate,
    moving_time: movingTime,
    id,
  },
  shot_rules: shotRules,
}) => {
  const data = {
    players: {
      contender: {
        id: contender,
        letters: '',
      },
      challenger: {
        id: challenger,
        letters: '',
      },
    },
    goal,
    shots: {
      [uuidv1().replace(/-/g, '')]: {
        map,
        distance,
        start_date: Timestamp.fromDate(startDate),
        shot_added: Timestamp.fromDate(new Date()),
        total_elevation_gain: totalElevationGain,
        activity_type: activityType,
        moving_time: movingTime,
        strava_id: id,
        type: 'MATCH',
        rules: shotRules || null,
      },
    },
    game_initiated: Timestamp.fromDate(new Date()),
    status: 'INITIATED',
    player_id: challenger,
  };
  try {
    db.collection('current_games').doc().set(data);
    return { status: 'success' };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  createNewGameInDatabase,
};
