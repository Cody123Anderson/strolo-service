module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('IdeaLocations', {
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
      locationId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Locations',
          key: 'id',
          as: 'locationId',
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
    return queryInterface.dropTable('IdeaLocations');
  }
};
