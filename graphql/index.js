const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const { UserField, UsersField, AddUser } = require("./schemas/User");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    user: { ...UserField },
    users: { ...UsersField }
  })
});
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutuation",
  fields: () => ({
    AddUser: { ...AddUser }
  })
});
exports.schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
