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
  };
  return Critic;
};
