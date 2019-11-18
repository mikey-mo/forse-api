const theFramework = require('the-framework');
const { fetchCurrentGameFromDatabase } = require('../../services/firebase/fetch-current-game-information');
const { creatNewGameInDatabase } = require('../../services/firebase/create-new-game');

theFramework.get(
  '/current-games/:game_id',
  [
    {
      id: 'game_id',
      type: theFramework.STRING,
      required: true,
      description: 'get game by id',
    },
  ],
  {
    description: 'gets current game information',
    authRequired: false,
  },
  async ({ game_id: gameId }) => ({ userInfo: await fetchCurrentGameFromDatabase(gameId) }),
);

theFramework.post(
  '/create-game',
  [
    {
      id: 'players',
      type: theFramework.OBJECT,
      required: true,
      description: 'challenger and contender ids',
    },
    {
      id: 'goal',
      type: theFramework.STRING,
      required: true,
      description: 'goal letters to win game',
    },
    {
      id: 'initial_shot',
      type: theFramework.OBJECT,
      required: true,
      description: 'initial shot to start game',
    },
  ],
  {
    description: 'initiates a game session',
    authRequired: false,
  },
  async (params) => creatNewGameInDatabase(params),
);
