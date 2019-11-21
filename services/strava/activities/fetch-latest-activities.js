const request = require('superagent');

const fetchLatestUserActivities = async (accessToken) => request.get(
  'https://www.strava.com/api/v3/athlete/activities',
).set('Authorization', `Bearer ${accessToken}`);

module.exports = fetchLatestUserActivities;
