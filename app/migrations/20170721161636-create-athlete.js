module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('athletes', {
      athleteId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      profileImageUrl: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      passwordResetToken: {
        type: Sequelize.STRING
      },
      passwordResetExpiration: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.STRING
      },
      measurementUnits: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('athletes');
  }
};
