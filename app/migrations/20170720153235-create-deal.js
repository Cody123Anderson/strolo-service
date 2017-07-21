module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Deals', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      ideaId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Ideas',
          key: 'id',
          as: 'ideaId',
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.STRING
      },
      retailPrice: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      discountPrice: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      discountPercent: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      maxRedemptions: {
        type: Sequelize.INTEGER
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Deals');
  }
};
