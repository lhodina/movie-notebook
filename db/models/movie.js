'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    releaseDate: DataTypes.DATE,
    imageLink: DataTypes.STRING
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
  };
  return Movie;
};
