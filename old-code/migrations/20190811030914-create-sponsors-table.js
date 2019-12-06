module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sponsors', {
      sponsorId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      createdByAthleteId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      measurementUnits: {
        type: Sequelize.STRING
      },
      logoUrl: {
        type: Sequelize.STRING
      },
      maxDailyContribution: {
        type: Sequelize.DECIMAL
      },
      maxMonthlyContribution: {
        type: Sequelize.DECIMAL
      },
      maxYearlyContribution: {
        type: Sequelize.DECIMAL
      },
      dayStreak100Bonus: {
        type: Sequelize.DECIMAL
      },
      dayStreak365Bonus: {
        type: Sequelize.DECIMAL
      },
      status: {
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
    return queryInterface.dropTable('sponsors');
  }
};
