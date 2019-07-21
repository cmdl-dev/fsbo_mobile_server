const passport = require("passport");
const graphqlHTTP = require("express-graphql");
const { schema } = require("../graphql");

const graphql = graphqlHTTP(
  (req, res) =>
    new Promise((resolve, reject) => {
      const next = (user, info = {}) => {
        resolve({
          schema,
          graphiql: process.env.NODE_ENV === "development",
          context: {
            user: user || null
          }
        });
      };
      passport.authenticate("bearer", { session: false }, (err, user) => {
        next(user);
      })(req, res, next);
    })
);

module.exports = {
  graphql
};
