const theFramework = require('the-framework');
const { fetchUserFromDatabase } = require('../../services/firebase/fetch-user-information');

theFramework.get(
  '/users/profile',
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
  // Takes 'params' as first and 'user' as second argument
  async (params) => ({ userInfo: await fetchUserFromDatabase(params.user_id) }),
);
