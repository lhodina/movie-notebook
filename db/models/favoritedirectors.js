'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteDirector = sequelize.define('FavoriteDirector', {
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    directorId: {
      allowNull: false,
      type:DataTypes.INTEGER,
      onDelete: 'cascade'
    }
  }, {});
  FavoriteDirector.associate = function(models) {
    // associations can be defined here
  };
  return FavoriteDirector;
};
