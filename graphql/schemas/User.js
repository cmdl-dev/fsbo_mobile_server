const { GraphQLString, GraphQLList, GraphQLNonNull } = require("graphql");
const { UserType } = require("./Types");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

//TODO: add params for Users

const UserField = {
  type: UserType,
  description: "Single User",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString }
  },
  resolve: (_, args) => {
    if (args.hasOwnProperty("token")) {
      return User.findOne({ where: { token: args.token } });
    } else {
      if (!args.hasOwnProperty("email") && !args.hasOwnProperty("password")) {
        throw new Error("Please include Email and passsword");
      }
      if (args.hasOwnProperty("email") || args.hasOwnProperty("password")) {
        throw new Error(
          !args.hasOwnProperty("email")
            ? "Please provide an Email"
            : "Please provide a Password"
        );
      }
      return User.findOne({ where: { email: args.email } })
        .then(user => {
          if (user) {
            const userObj = user.get({ plain: true });
            return Promise.all([
              Promise.resolve(userObj),
              bycrpt.compare(args.password, userObj.password)
            ]);
          } else {
            throw new Error("That user does not exist");
          }
        })
        .then(([userObj, result]) => {
          if (result) {
            return userObj;
          } else {
            throw new Error("That password does not match");
          }
        })
        .catch(error => {
          console.log(error);
          throw new Error(error);
        });
    }
  }
};
const UsersField = {
  type: new GraphQLList(UserType),
  description: "List of all users",
  resolve: () => User.findAll()
};

const AddUser = {
  type: UserType,
  description: "Add a User",
  args: {
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args) => {
    try {
      args.password = await bycrpt.hash(
        args.password,
        parseInt(process.env.SALTROUNDS)
      );
      args.token = await jwt.sign(
        {
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email
        },
        process.env.JWT_SECRET
      );
    } catch (e) {
      console.log(e);
      throw new Error("Something went wrong please try again");
    }
    return User.create(args)
      .then(() => User.findOrCreate({ where: { email: args.email } }))
      .then(([user, created]) => {
        return user.get({ plain: true });
      })
      .catch(error => {
        console.log(error);
        throw Error("That account already exists");
      });
  }
};
module.exports = {
  UserType,
  UserField,
  UsersField,
  AddUser
};
