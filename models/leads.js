"use strict";
module.exports = (sequelize, DataTypes) => {
  const Leads = sequelize.define(
    "Leads",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING
    },
    {}
  );
  Leads.associate = function(models) {
    // associations can be defined here
    Leads.hasMany(models.House);
    Leads.belongsToMany(models.User, {
      through: models.lead_user,
      foreignKey: "leadId"
    });
  };
  return Leads;
};
