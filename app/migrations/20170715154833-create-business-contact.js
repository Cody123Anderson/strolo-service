module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('BusinessContacts', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        isEmail: true
      },
      phone: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('BusinessContacts');
  }
};
