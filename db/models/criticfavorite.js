'use strict';
module.exports = (sequelize, DataTypes) => {
  const CriticFavorite = sequelize.define('CriticFavorite', {
    criticId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    movieId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  CriticFavorite.associate = function(models) {
    // associations can be defined here
  };
  return CriticFavorite;
};
