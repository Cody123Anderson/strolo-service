module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('activitytypes', {
      activityTypeId: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rewardsEffortLevel: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.STRING
      }
    }, {
      timestamps: false
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('activitytypes');
  }
};