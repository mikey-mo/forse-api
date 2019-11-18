const admin = require('firebase-admin');

const db = admin.firestore();

const fetchUserFromDatabase = async (userId) => {
  const usersRef = db.collection('users');
  const user = await usersRef.doc(userId.toString()).get();
  const userData = user.data();
  return userData;
};

module.exports = {
  fetchUserFromDatabase,
};
