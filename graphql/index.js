const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const { UserField, UsersField, AddUser } = require("./schemas/User");
const { HouseField, HousesField, AddHouse } = require("./schemas/House");
const {
  LeadField,
  LeadsField,
  AddLead,
  ChangeLead
} = require("./schemas/Lead");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    user: { ...UserField },
    users: { ...UsersField },
    house: { ...HouseField },
    houses: { ...HousesField },
    lead: { ...LeadField },
    leads: { ...LeadsField }
  })
});
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutuation",
  fields: () => ({
    AddUser: { ...AddUser },
    AddHouse: { ...AddHouse },
    AddLead: { ...AddLead },
    ChangeLead: { ...ChangeLead }
  })
});
exports.schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
