const {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require("graphql");
const { HouseType } = require("./Types");
const { House } = require("../../models");

const HouseField = {
  type: HouseType,
  description: "Single house",
  args: {
    streetAddress: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
    price: { type: GraphQLString }
  },
  resolve: (_, args) => House.findOne({ where: args })
};
const HousesField = {
  type: new GraphQLList(HouseType),
  description: "List of all Houses",
  args: {
    streetAddress: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
    price: { type: GraphQLString }
  },
  resolve: (_, args) => House.findAll({ where: args })
};

const AddHouse = {
  type: HouseType,
  description: "Add a House",
  args: {
    streetAddress: { type: GraphQLNonNull(GraphQLString) },
    city: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLNonNull(GraphQLString) },
    zip: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLString) },
    leadId: { type: GraphQLNonNull(GraphQLInt) }
  },
  resolve: (_, args) => {
    return House.create(args)
      .then(() => House.findOrCreate({ where: args }))
      .then(([house, created]) => {
        return house.get({ plain: true });
      })
      .catch(error => {
        console.log(error);
        throw Error("That house already exists");
      });
  }
};

module.exports = {
  HouseType,
  HouseField,
  HousesField,
  AddHouse
};
