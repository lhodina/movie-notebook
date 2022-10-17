'use strict';
module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define('Link', {
    userId: DataTypes.INTEGER,
    table: DataTypes.STRING,
    linkText: DataTypes.STRING,
    url: DataTypes.TEXT
  }, {});
  Link.associate = function(models) {
    // associations can be defined here
    Link.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Link;
};
