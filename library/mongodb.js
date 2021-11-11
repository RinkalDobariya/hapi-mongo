const { MongoClient } = require("mongodb");

let client = null;
let clientMongo;
const connect = async () => {
  if (client != null) return;
  clientMongo = await MongoClient.connect("mongodb://localhost:27017/hapimdb", {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(`MongoDB error connecting`, err.message);
    throw Error("Mongodb is not connected!");
  });
  console.log("MongoDB connected successfully -------------");
  client = clientMongo.db();
};

var db = {};
db.get = () => {
  if (client != null) return client;
  throw Error("Mongodb is not connected!");
};

const close = () => {
  clientMongo.close();
};
module.exports = { connect, db, close };
