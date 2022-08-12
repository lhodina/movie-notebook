'use strict';
module.exports = (sequelize, DataTypes) => {
  const Director = sequelize.define('Director', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    }
  }, {});
  Director.associate = function(models) {
    // associations can be defined here
    Director.hasMany(models.Movie, { as: 'directedMovies', foreignKey: 'directorId' });

    const directorFavMapping = {
      as: 'directorFavorites',
      through: 'DirectorFavorite',
      otherKey: 'movieId',
      foreignKey: 'director_Id'
    };
    Director.belongsToMany(models.Movie, directorFavMapping);


    const userMapping = {
      through: 'FavoriteDirector',
      otherKey: 'userId',
      foreignKey: 'directorId'
    };
    Director.belongsToMany(models.User, userMapping);
  };
  return Director;
};
