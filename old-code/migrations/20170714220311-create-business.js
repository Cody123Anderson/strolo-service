module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Businesses', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'active'
      },
      websiteUrl: {
        type: Sequelize.STRING,
        isUrl: true
      },
      billingAddress: {
        type: Sequelize.STRING
      },
      billingCity: {
        type: Sequelize.STRING
      },
      billingState: {
        type: Sequelize.STRING
      },
      billingZip: {
        type: Sequelize.STRING
      },
      stripeToken: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Businesses');
  }
};