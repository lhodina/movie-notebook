'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteCritic = sequelize.define('FavoriteCritic', {
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    criticId: {
      allowNull: false,
      type:DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    notes: {
      type:DataTypes.TEXT
    }
  }, {});
  FavoriteCritic.associate = function(models) {
    // associations can be defined here
  };
  return FavoriteCritic;
};
