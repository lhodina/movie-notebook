'use strict';
module.exports = (sequelize, DataTypes) => {
  const MovieCollection = sequelize.define('MovieCollection', {
    movieId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    collectionId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  MovieCollection.associate = function(models) {
    // associations can be defined here
  };
  return MovieCollection;
};
