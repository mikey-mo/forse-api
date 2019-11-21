const admin = require('firebase-admin');
const moment = require('moment');

const fetchLatestUserActivities = require('../../strava/activities/fetch-latest-activities');

const db = admin.firestore();

const dateRangeFilter = (startDate) => {
  const currentDate = new Date();
  const previousDateSetup = new Date();
  const activityDate = new Date(startDate);
  const tenDaysPreviousDate = new Date(previousDateSetup.setDate(previousDateSetup.getDate() - 7));

  return moment(activityDate).isBetween(tenDaysPreviousDate, currentDate, 'days');
};

const updateLatestUserActivitiesInDatabase = async ({
  user_id: userId,
  access_token: accessToken,
}) => {
  try {
    const { body } = await fetchLatestUserActivities(accessToken);
    const filteredActivities = body.filter(
      (activity) => (dateRangeFilter(activity.start_date) === true) && activity,
    ).slice(0, 10);
    const data = {
      latest_activities: filteredActivities,
    };
    try {
      const userRef = db.collection('users').doc(userId.toString());
      userRef.update(data);
      return { status: 'success' };
    } catch (e) {
      return { error: e };
    }
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  updateLatestUserActivitiesInDatabase,
};
