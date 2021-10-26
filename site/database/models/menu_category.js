"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {

  const Model = sequelize.define(
    "MenuCategory",
    {
      name: { type: DataTypes.STRING(50), },
      parent_id: { type: DataTypes.INTEGER, },
    },
    {
      tableName: "menu_categories",
    }
  );

  Model.associate = function (models) {
    // associations can be defined here
    Model.belongsTo(models.MenuCategory, {
      as: "parentCategory",
      foreignKey: "parent_id",
      otherKey: "id",
    });

    Model.hasMany(models.MenuCategory, {
      as: "childsCategories",
      foreignKey: "id",
      otherKey: "parent_id",
    });
  };

  return Model;
};
