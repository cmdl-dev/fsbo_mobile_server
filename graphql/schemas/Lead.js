const {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");
const { LeadType } = require("./Types");
const { Leads, lead_user } = require("../../models");

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
    phase: { type: GraphQLInt }
  },
  resolve: (_, args, context) => {
    if (!context.user) {
      throw new Error("You have to be logged in");
    }
    if (Object.keys(args).length === 0) {
      return context.user.Leads;
    }
    // NOTE: DO i need this?
    // const yourLeads = context.user.Leads.filter(lead => {
    //   let temp = false;
    //   Object.keys(args).forEach(key => {
    //     if (args[key] === lead[key]) {
    //       temp = true;
    //     }
    //   });
    //   return temp && lead;
    // });
    const yourLeads = context.user.Leads.filter(
      lead => lead.lead_user.phase === args.phase
    );
    return yourLeads;
  }
};
const ChangeLead = {
  type: LeadType,
  description: "Change the phase for your lead",
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    to: { type: GraphQLNonNull(GraphQLInt) }
  },
  resolve: (_, args, context) => {
    if (!context.user) {
      throw new Error("You have to be logged in");
    }
    // Get the lead from your context leads,
    const yourLead = context.user.Leads.filter(lead => lead.id === args.id)[0];
    return lead_user
      .update(
        { phase: args.to },
        {
          where: { leadId: yourLead.lead_user.leadId, userId: context.user.id },
          returning: true
        }
      )
      .then(() => {
        return yourLead;
      })
      .catch(error => {
        throw new Error(error);
      });
    // We have your lead information
    // Now we have to find that lead in the pivot table

    // console.log(yourLeads.get({ plain: true }));
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
  AddLead,
  ChangeLead
};
