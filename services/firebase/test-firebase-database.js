const admin = require('firebase-admin');

const db = admin.database();
const ref = db.ref('users');

const readFirebaseDatabase = () => console.log(ref);

module.exports = readFirebaseDatabase;
