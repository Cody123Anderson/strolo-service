module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Businesses', {
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
      description: {
        type: Sequelize.STRING
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
      },
      logoUrl: {
        type: Sequelize.STRING,
        isUrl: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Businesses');
  }
};
