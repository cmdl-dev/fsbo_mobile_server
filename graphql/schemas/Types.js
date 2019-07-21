const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");
const { House, Leads, User } = require("../../models");

const LeadType = new GraphQLObjectType({
  name: "Lead",
  description: "Information for the lead of for the user",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLNonNull(GraphQLString) },
    houseId: { type: GraphQLInt },
    houses: {
      type: new GraphQLList(HouseType),
      resolve: lead =>
        Leads.findOne({ where: { id: lead.id }, include: [House] }).then(
          lead => {
            return lead.Houses;
          }
        )
    }
  })
});

const HouseType = new GraphQLObjectType({
  name: "House",
  description: "Information for each house",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    streetAddress: { type: GraphQLNonNull(GraphQLString) },
    city: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLNonNull(GraphQLString) },
    zip: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLString },
    owner: {
      type: LeadType,
      resolve: house =>
        House.findOne({ where: { id: house.id }, include: [Leads] }).then(
          house => {
            return house.Lead;
          }
        )
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User of the platform",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    token: { type: GraphQLNonNull(GraphQLString) },
    leads: {
      type: new GraphQLList(LeadType),
      resolve: user =>
        User.findOne({ where: { id: user.id }, include: [Leads] }).then(
          user => {
            return user.Leads;
          }
        )
    }
  })
});
module.exports = {
  LeadType,
  HouseType,
  UserType
};
