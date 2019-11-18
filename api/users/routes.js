const theFramework = require('the-framework');
const { fetchUserFromDatabase } = require('../../services/firebase/users/fetch-user-information');
const { createNewUserInDatabase } = require('../../services/firebase/users/create-new-user');

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
  '/create-user',
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
