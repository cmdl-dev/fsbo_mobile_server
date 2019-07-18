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
  description: "A single Lead that you have access to",
  args: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  },
  resolve: (_, args, context) => {
    if (!context.user) {
      throw new Error("You have to be logged in");
    }
    const yourLeads = context.user.Leads.filter(lead => {
      let temp = false;
      Object.keys(args).forEach(key => {
        if (args[key] === lead[key]) {
          temp = true;
        }
      });
      return temp && lead;
    });
    return yourLeads[0];
  }
};
const LeadsField = {
  type: new GraphQLList(LeadType),
  description: "All your Leads",
  args: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  },
  resolve: (_, args, context) => {
    if (!context.user) {
      throw new Error("You have to be logged in");
    }
    console.log(args);
    if (Object.keys(args).length === 0) {
      return context.user.Leads;
    }
    const yourLeads = context.user.Leads.filter(lead => {
      let temp = false;
      Object.keys(args).forEach(key => {
        if (args[key] === lead[key]) {
          temp = true;
        }
      });
      return temp && lead;
    });
    console.log(yourLeads);
    return yourLeads;
  }
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
  resolve: (_, context, args) => {
    if (!context.user) {
      throw new Error("You have to be logged in");
    }
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
