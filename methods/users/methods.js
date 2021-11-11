const tableName = "users";
const { db } = require("../../library/mongodb");

const insert = (data) => db.get().collection(tableName).insertOne(data);

const findOne = (condition, project = {}) =>
  db
    .get()
    .collection(tableName)
    .findOne(condition, { projection: project || {} });

const find = (condition, project = {}, page = {}, sort) =>
  db
    .get()
    .collection(tableName)
    .find(condition, { projection: project || {} })
    .sort(sort || {})
    .skip(page.skip || 0)
    .limit(page.limit || 20)
    .toArray();

const update = (condition, data) =>
  db.get().collection(tableName).updateOne(condition, data, { upsert: true });

const findOneAndUpdate = (condition, data) =>
  db.get().collection(tableName).findOneAndUpdate(condition, data, {
    upsert: true,
    returnNewDocument: true,
  });

const remove = (condition) => db.get().collection(tableName).remove(condition);

const aggregate = (condition) =>
  db.get().collection(tableName).aggregate(condition).toArray();

const count = (condition) =>
  db.get().collection(tableName).countDocuments(condition);

const deleteMultiple = (condition) =>
  db.get().collection(tableName).deleteMany(condition);

module.exports = {
  insert,
  findOne,
  find,
  update,
  findOneAndUpdate,
  remove,
  aggregate,
  count,
  deleteMultiple,
};
