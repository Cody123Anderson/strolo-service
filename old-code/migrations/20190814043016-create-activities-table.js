module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('activities', {
      activityId: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      activityTypeId: {
        foreignKey: true,
        type: Sequelize.STRING
      },
      athleteId: {
        foreignKey: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false
      },
      inputMethod: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sourceActivityId: {
        type: Sequelize.STRING
      },
      startTime: {
        type: Sequelize.STRING
      },
      endTime: {
        type: Sequelize.STRING
      },
      durationSeconds: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      distance: {
        type: Sequelize.DECIMAL
      },
      measurementUnits: {
        type: Sequelize.STRING
      },
      elevationGained: {
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
    return queryInterface.dropTable('activities');
  }
};