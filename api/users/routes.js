const theFramework = require('the-framework');
const { fetchUserFromDatabase } = require('../../services/firebase/users/fetch-user-information');
const { createNewUserInDatabase } = require('../../services/firebase/users/create-new-user');
const { updateLatestUserActivitiesInDatabase } = require('../../services/firebase/users/update-latest-user-activities');

theFramework.get(
  '/users/:user_id',
  [
    {
      id: 'user_id',
      type: theFramework.INTEGER,
      required: true,
      description: 'user db id',
    },
  ],
  {
    description: 'gets user profile information',
    authRequired: false,
  },
  async ({ user_id: userId }) => fetchUserFromDatabase(userId),
);


theFramework.post(
  '/users/:user_id/latest-activities',
  [
    {
      id: 'user_id',
      type: theFramework.INTEGER,
      required: true,
      description: 'user information from strava',
    },
    {
      id: 'access_token',
      type: theFramework.STRING,
      required: true,
      descripition: 'access token for strava',
    },
  ],
  {
    description: 'latest activity based on user information from strava',
    authRequired: false,
  },
  async (params) => updateLatestUserActivitiesInDatabase(params),
);

theFramework.post(
  '/users/create',
  [
    {
      id: 'user_info',
      type: theFramework.OBJECT,
      required: true,
      description: 'user information from strava',
    },
  ],
  {
    description: 'create user profile information from strava',
    authRequired: false,
  },
  async (params) => createNewUserInDatabase(params),
);
