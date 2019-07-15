const {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");
const { LeadType } = require("./Types");
const { Leads } = require("../../models");

const LeadField = {
  type: LeadType,
  description: "Single lead",
  args: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  },
  resolve: (_, args) => Leads.findOne({ where: args })
};
const LeadsField = {
  type: new GraphQLList(LeadType),
  description: "List of all leads",
  args: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  },
  resolve: (_, args) => Leads.findAll({ where: args })
};

const AddLead = {
  type: LeadType,
  description: "Add a Lead",
  args: {
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (_, args) => {
    return Leads.create(args)
      .then(() => Leads.findOrCreate({ where: args }))
      .then(([lead, created]) => {
        return lead.get({ plain: true });
      })
      .catch(error => {
        console.log(error);
        throw Error("That house already exists");
      });
  }
};

module.exports = {
  LeadType,
  LeadField,
  LeadsField,
  AddLead
};
