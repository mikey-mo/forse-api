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
  const addedShotTime = Timestamp.fromDate(new Date());
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
    latest_shot: {
      player_id: challenger,
      shot_id: null,
      time: addedShotTime,
      type: 'SET',
    },
    shots: {
      [uuidv1().replace(/-/g, '')]: {
        map,
        distance,
        start_date: Timestamp.fromDate(new Date(startDate)),
        shot_added: addedShotTime,
        total_elevation_gain: totalElevationGain,
        activity_type: activityType,
        moving_time: movingTime,
        strava_id: id,
        type: 'SET',
        rules: shotRules || null,
        player_id: challenger,
      },
    },
    game_initiated: addedShotTime,
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
  createNewGameInDatabase,
};
