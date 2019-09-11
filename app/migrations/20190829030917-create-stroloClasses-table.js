module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('stroloClasses', {
      stroloClassId: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      activityTypeId: {
        foreignKey: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      videoUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      videoImage: {
        type: Sequelize.STRING
      },
      instructorFirstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      instructorLastName: {
        type: Sequelize.STRING
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      difficultyLevel: {
        type: Sequelize.DECIMAL
      },
      goLiveAt: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable('stroloClasses');
  }
};