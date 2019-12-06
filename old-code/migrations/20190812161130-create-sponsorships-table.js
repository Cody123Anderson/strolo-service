module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sponsorships', {
      sponsorId: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      athleteId: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      startDate: {
        allowNull: false,
        type: Sequelize.STRING
      },
      endDate: {
        type: Sequelize.STRING
      },
      approvedAt: {
        type: Sequelize.STRING
      },
      cancelledAt: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('sponsorships');
  }
};
