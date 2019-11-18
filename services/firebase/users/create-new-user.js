const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin').firestore;

const db = admin.firestore();

const createNewUserInDatabase = async ({
  user_info: {
    id: stravaId,
    firstname,
    lastname,
    city,
    country,
    sex,
    state,
    profile,
  },
}) => {
  const data = {
    avatar_uri: profile,
    city,
    country,
    last_name: lastname,
    first_name: firstname,
    sex,
    state,
    strava_id: stravaId,
    user_created: Timestamp.fromDate(new Date()),
  };
  try {
    const newUserRef = db.collection('users').doc(stravaId.toString());
    await newUserRef.set(data);
    return { status: 'success' };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  createNewUserInDatabase,
};
