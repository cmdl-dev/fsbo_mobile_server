"use strict";
module.exports = (sequelize, DataTypes) => {
  const leadUser = sequelize.define(
    "lead_user",
    {
      LeadId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      phase: DataTypes.INTEGER
    },
    {
      freezeTableName: true
    }
  );
  leadUser.associate = function(models) {
    // associations can be defined here
  };
  return leadUser;
};
