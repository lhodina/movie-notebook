'use strict';
module.exports = (sequelize, DataTypes) => {
  const Critic = sequelize.define('Critic', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    }
  }, {});
  Critic.associate = function(models) {
    // associations can be defined here
    const criticFavMapping = {
      through: 'CriticFavorite',
      otherKey: 'movieId',
      foreignKey: 'criticId'
    };
    Critic.belongsToMany(models.Movie, criticFavMapping);

    const userMapping = {
      through: 'FavoriteCritic',
      otherKey: 'userId',
      foreignKey: 'criticId'
    };
    Critic.belongsToMany(models.User, userMapping);
  };
  return Critic;
};
