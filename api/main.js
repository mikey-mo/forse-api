const theFramework = require('the-framework');

theFramework.get(
  '/hello',
  [
    {
      id: 'name',
      type: theFramework.STRING,
      required: true,
      description: 'Your name',
    },
  ],
  {
    description: 'Says hello',
    authRequired: false,
  },
  // Params is an object of processed parameters
  // user is the logged in user, if there is one
  // Takes 'user' as second argument
  async (params) => ({ message: `Hello ${params.name}` }),
);
