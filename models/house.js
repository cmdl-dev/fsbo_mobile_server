"use strict";
module.exports = (sequelize, DataTypes) => {
  const House = sequelize.define(
    "House",
    {
      streetAddress: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zip: DataTypes.STRING,
      price: DataTypes.STRING,
      leadId: DataTypes.INTEGER
    },
    {}
  );
  House.associate = function(models) {
    // associations can be defined here
    House.belongsTo(models.Leads);
  };
  return House;
};
