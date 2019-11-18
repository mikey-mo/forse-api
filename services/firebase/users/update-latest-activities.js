const admin = require('firebase-admin');

const db = admin.firestore();

const updateUserActivitiesInDatabase = async ({
  user_id: userId,
  latest_activities: latestActivities,
}) => {
  const data = {
    latest_activities: latestActivities,
  };
  try {
    const userRef = db.collection('users').doc(userId.toString());
    userRef.update(data);
    return { status: 'success' };
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  updateUserActivitiesInDatabase,
};
