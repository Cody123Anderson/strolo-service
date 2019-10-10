module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sponsoractivities', {
      sponsorId: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      activityId: {
        primaryKey: true,
        type: Sequelize.STRING
      }
    }, {
      timestamps: false
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('sponsoractivities');
  }
};
