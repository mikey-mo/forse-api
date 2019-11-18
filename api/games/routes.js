const theFramework = require('the-framework');
const { fetchCurrentGameFromDatabase } = require('../../services/firebase/current-games/fetch-current-game-information');
const { creatNewGameInDatabase } = require('../../services/firebase/current-games/create-new-game');
const { startNewGameInDatabase } = require('../../services/firebase/current-games/start-new-game');

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
  async ({ game_id: gameId }) => fetchCurrentGameFromDatabase(gameId),
);

theFramework.post(
  '/start-game/:game_id',
  [
    {
      id: 'game_id',
      type: theFramework.STRING,
      required: true,
      description: 'start game by id',
    },
  ],
  {
    description: 'starts current game between two users',
    authRequired: false,
  },
  async ({ game_id: gameId }) => ({ userInfo: await startNewGameInDatabase(gameId) }),
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
