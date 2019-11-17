const theFramework = require('the-framework');
const PORT = process.env.PORT;
const initializeApp = require('./services/firebase/index');
const dotenv = require('dotenv');
dotenv.config();

initializeApp();

theFramework.startServer({
  authenticationMethod: async (req, token) => {
      // Optional method to check user token and return either a user object or null (if you cannot authenticate your user)
      if (token) {
          // Code to check token
      }

      return null;
  },
  apiDirectory: "/api", // Directory you will store your route files in
  userTokenHeader: "x-user-token", // Header you will use for your user tokens
  port: PORT
});
