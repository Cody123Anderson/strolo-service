module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserFavorites', {
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
        allowNull: false
      },
      ideaId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Ideas',
          key: 'id',
          as: 'ideaId',
        },
        allowNull: false
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserFavorites');
  }
};
