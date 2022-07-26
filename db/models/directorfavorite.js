'use strict';
module.exports = (sequelize, DataTypes) => {
  const DirectorFavorite = sequelize.define('DirectorFavorite', {
    director_Id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    movie_Id: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  DirectorFavorite.associate = function(models) {
    // associations can be defined here
  };
  return DirectorFavorite;
};
