'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define('Collection', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    userId:{
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Collection.associate = function(models) {
    // associations can be defined here
    Collection.belongsTo(models.User, { foreignKey: 'userId' });


    const collectionMapping = {
      through: 'MovieCollection',
      otherKey: 'movieId',
      foreignKey: 'collectionId'
    }
    Collection.belongsToMany(models.Movie, collectionMapping);
  };
  return Collection;
};
