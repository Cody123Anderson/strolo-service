module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BusinessUsers', {
      businessId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Businesses',
          key: 'id',
          as: 'businessId'
        },
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
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
  down:(queryInterface) => {
    return queryInterface.dropTable('BusinessUsers');
  }
};
