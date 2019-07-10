const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");
const bycrpt = require("bcrypt");
const { User } = require("../../models");

exports.UserType = new GraphQLObjectType({
  name: "User",
  description: "User of the platform",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) }
  })
});

exports.UserField = {
  type: this.UserType,
  description: "Single User",
  args: {
    email: { type: GraphQLString },
    id: { type: GraphQLInt }
  },
  resolve: async (_, args) => await User.findOne({ where: args })
};
exports.UsersField = {
  type: GraphQLList(this.UserType),
  description: "List of all users",
  resolve: async () => await User.findAll()
};

exports.AddUser = {
  type: this.UserType,
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
