module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Ideas', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      businessId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Businesses',
          key: 'id',
          as: 'businessId',
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
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Under Construction'
      },
      reservationRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      endDate: {
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Ideas');
  }
};
