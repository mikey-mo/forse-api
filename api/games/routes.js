const theFramework = require('the-framework');
const { fetchCurrentGameFromDatabase } = require('../../services/firebase/current-games/fetch-game-information');
const { addShotToCurrentGameDatabase } = require('../../services/firebase/current-games/add-shot-to-game');
const { createNewGameInDatabase } = require('../../services/firebase/current-games/create-new-game');
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
  '/current-games/:game_id/add-shot',
  [
    {
      id: 'game_id',
      type: theFramework.STRING,
      required: true,
      description: 'game id to add shot to',
    },
    {
      id: 'match_id',
      type: theFramework.STRING,
      required: true,
      description: 'id to match shot to',
    },
    {
      id: 'activity_info',
      type: theFramework.OBJECT,
      required: true,
      description: 'activity info to add for shot',
    },
    {
      id: 'user_id',
      type: theFramework.INTEGER,
      required: true,
      description: 'user id to add shot with',
    },
    {
      id: 'shot_rules',
      type: theFramework.OBJECT || null,
      required: false,
      description: 'rules for shot',
    },
    {
      id: 'shot_type',
      type: theFramework.STRING || null,
      required: false,
      description: 'type for shot',
    },
  ],
  {
    description: 'adds shot to current game',
    authRequired: false,
  },
  async (params) => addShotToCurrentGameDatabase(params),
);

theFramework.post(
  '/current-games/:game_id/start-game',
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
  '/current-games/create',
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
      description: 'inital shot to start game',
    },
    {
      id: 'shot_rules',
      type: theFramework.OBJECT,
      required: true,
      description: 'rules for initial shot',
    },
  ],
  {
    description: 'initiates a game session',
    authRequired: false,
  },
  async (params) => createNewGameInDatabase(params),
);
