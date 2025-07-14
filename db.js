const { MongoClient } = require('mongodb');

// Connection String עבור MongoDB Atlas

const dbURI = 'mongodb+srv://Eden:edta123@ecom.tyino.mongodb.net/MyBookDatabase?retryWrites=true&w=majority&appName=Ecom';

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(dbURI)
      .then((client) => {
        dbConnection = client.db();
        console.log('✅ מחובר ל-MongoDB Atlas');
        return cb();
      })
      .catch((err) => {
        console.error('שגיאה בחיבור ל-MongoDB Atlas:', err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
