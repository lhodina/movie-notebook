'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CriticFavorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      criticId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Critics' },
        onDelete: 'cascade'
      },
      movieId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Movies' }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CriticFavorites');
  }
};
