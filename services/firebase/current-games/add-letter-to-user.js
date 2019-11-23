const admin = require('firebase-admin');

let addLetterToUserInDatabase;

try {
  addLetterToUserInDatabase = async () => {
    const db = admin.firestore();
    const currentGamesRef = await db.collection('current_games');
    return currentGamesRef.get()
      .then((docs) => {
        const gameDocs = [];
        docs.forEach((doc) => gameDocs.push({
          ...doc.data(),
          game_id: doc.id,
        }));
        return gameDocs;
      })
      .catch((err) => err);
  };
} catch (e) {
  console.log('firebase not running');
}

module.exports = {
  addLetterToUserInDatabase,
};
