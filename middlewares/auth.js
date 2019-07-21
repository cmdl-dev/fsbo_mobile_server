const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;

const { User, Leads } = require("../models");
exports.initBearerStrategy = () => {
  passport.use(
    new BearerStrategy((token, done) => {
      User.findOne({ where: { token }, include: [Leads] }).then(user => {
        return done(null, user || undefined);
      });
    })
  );
};
