'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserNote = sequelize.define('UserNote', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    movieId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'cascade'
    },
    review: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    watchedStatus: DataTypes.BOOLEAN
  }, {});
  UserNote.associate = function(models) {
    // associations can be defined here
    UserNote.belongsTo(models.User, { foreignKey: 'userId' });
    UserNote.belongsTo(models.Movie, { foreignKey: 'movieId' });
  };
  return UserNote;
};
