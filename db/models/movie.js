'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    directorId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    yearReleased: DataTypes.INTEGER,
    imageLink: DataTypes.STRING
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
    Movie.belongsTo(models.Director, { foreignKey: 'directorId' });


    const collectionMapping = {
      through: 'MovieCollection',
      otherKey: 'collectionId',
      foreignKey: 'movieId'
    };
    Movie.belongsToMany(models.Collection, collectionMapping);


    const directorFavMapping = {
      through: 'DirectorFavorite',
      otherKey: 'director_Id',
      foreignKey: 'movie_Id'
    }
    Movie.belongsToMany(models.Director, directorFavMapping);


    const criticFavMapping = {
      through: 'CriticFavorite',
      otherKey: 'criticId',
      foreignKey: 'movieId'
    };
    Movie.belongsToMany(models.Critic, criticFavMapping);
  };
  return Movie;
};
