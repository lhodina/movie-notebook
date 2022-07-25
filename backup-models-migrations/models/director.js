'use strict';
module.exports = (sequelize, DataTypes) => {
  const Director = sequelize.define('Director', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    movieId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Director.associate = function(models) {
    // associations can be defined here
    Director.hasMany(models.Movie, { foreignKey: 'directorId' });

    const columnMapping = {
      through: 'DirectorFavorite',
      otherKey: 'movieId',
      foreignKey: 'directorId'
    };

    Director.belongsToMany(models.Movie, columnMapping);
  };
  return Director;
};
