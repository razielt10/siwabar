"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "MenuFood",
    {
      name: { type: DataTypes.STRING(50), },
      menu_category_id: { type: DataTypes.INTEGER, },
      description: { type: DataTypes.STRING(300), },
      price: { type: DataTypes.INTEGER, },
      order : { type: DataTypes.INTEGER, }
    },
    {
      tableName: "menu_foods",
    }
  );

  Model.associate = function (models) {
    // associations can be defined here
    Model.belongsTo(models.MenuCategory, {
      as: "category",
      foreignKey: "menu_category_id",
    });
  };

  return Model;
};
