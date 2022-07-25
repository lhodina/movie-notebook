'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define('Collection', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    user_Id:{
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Collection.associate = function(models) {
    // associations can be defined here
    Collection.belongsTo(models.User, { foreignKey: 'user_Id' });

    // const columnMapping = {
    //   through: 'MovieCollection',
    //   otherKey: 'movieId',
    //   foreignKey: 'collectionId'
    // }

    // Collection.belongsToMany(models.Movie, columnMapping);
  };
  return Collection;
};
