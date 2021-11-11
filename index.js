const Hapi = require("hapi");
const Joi = require("joi");
const mongo = require("mongodb");
const usersModel = require("./methods/users");
const followModel = require("./methodss/follow");
const mongodb = require("./library/mongodb");
const ObjectId = require("mongodb");
const { ObjectID } = require("bson");
const { date } = require("joi");
const { users } = require("./methods/users");
const { follow } = require("./methodss/follow");

const server = Hapi.server({
  port: 3007,
  host: "localhost",
});

server.route({
  method: "POST",
  path: "/post",
  // options: {
  //   validate: {
  //     payload: schema,
  //   },
  // },
  handler: async (request, h) => {
    const schema = Joi.object({
      firstname: Joi.string().min(5).max(10).required(),
      lastname: Joi.string().min(5).max(9).required(),
      area: Joi.string().min(5).max(20),
      city: Joi.string().min(6).max(25).required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      Zipcode: Joi.number().required(),
      lat: Joi.number().required(),
      long: Joi.number().required(),
    });
    schema.validate({});

    console.log(">>>>>", request.payload);
    try {
      console.log(request.payload);
      var userInfo = {
        firstname: request.payload.firstname,
        lastname: request.payload.lastname,
        // Address: {
        //   area: request.payload.area,
        //   city: request.payload.city,
        //   state: request.payload.state,
        //   country: request.payload.country,
        //   Zipcode: request.payload.Zipcode,
        //   lat: request.payload.lat,
        //   long: request.payload.long,
        // },
        Address: request.payload.Address,
      };

      await usersModel.insert(userInfo);

      return schema.validate(userInfo);
    } catch (err) {
      console.log(err);
      return err;
    }
  },
});

server.route({
  method: "GET",
  path: "/get",
  handler: async (request, h) => {
    try {
      console.log(">>>>>", request.query._id);
      const userInfo = await usersModel.findOne({
        _id: ObjectID(request.query._id),
      });
      return userInfo;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
});

server.route({
  method: "PATCH",
  path: "/patch",
  handler: async (request, h) => {
    console.log(">>>>>", request.payload);
    const userInfo = await usersModel.update(
      { _id: ObjectID(request.payload._id) },
      { $set: { Address: request.payload.Address } }
    );
    return userInfo;
  },
});

server.route({
  method: "PUT",
  path: "/put",
  handler: async (request, h) => {
    console.log(">>>>", request.payload);
    const userInfo = await usersModel.findOneAndUpdate(
      { _id: ObjectID(request.payload._id) },
      { $set: { pincode: request.payload.pincode } }
    );
    return userInfo;
  },
});

server.route({
  method: "DELETE",
  path: "/delete",
  handler: async (request, h) => {
    console.log(">>>>", request.payload);
    const userInfo = await usersModel.remove({
      _id: ObjectID(request.payload._id),
    });
    return userInfo;
  },
});

server.route({
  method: "GET",
  path: "/get1",
  handler: async (request, h) => {
    try {
      console.log(">>>>>", request.query);
      const followerInfo = await followModel.aggregate([
        { $match: { FolloweeId: "FollowerId" } },
        {
          $lookup: {
            from: "users",
            localField: "FollowerId",
            foreignField: "FolloweeId",
            as: "follow",
          },
        },
        {
          $unwind: "$follow",
        },
      ]);
      return followerInfo;
    } catch (err) {
      console.log("<<<<", err);
      return err;
    }
  },
});

const startServer = () => {
  mongodb.connect();
  server.start();
};

startServer();
console.log("Server running on %s", server.info.uri);
