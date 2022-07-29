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
    Director.hasMany(models.Movie, { foreignKey: 'directorId' });


    const directorFavMapping = {
      through: 'DirectorFavorite',
      otherKey: 'movieId',
      foreignKey: 'director_Id'
    };
    Director.belongsToMany(models.Movie, directorFavMapping);
  };
  return Director;
};
