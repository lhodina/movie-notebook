'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Collection, { foreignKey: 'userId' });
    User.hasMany(models.UserNote, { foreignKey: 'userId' });
    User.hasMany(models.Link, { foreignKey: 'userId' });

    const directorMapping = {
      through: 'FavoriteDirector',
      otherKey: 'directorId',
      foreignKey: 'userId'
    };
    User.belongsToMany(models.Director, directorMapping);

    const criticMapping = {
      through: 'FavoriteCritic',
      otherKey: 'criticId',
      foreignKey: 'userId'
    };
    User.belongsToMany(models.Critic, criticMapping);
  };
  return User;
};
