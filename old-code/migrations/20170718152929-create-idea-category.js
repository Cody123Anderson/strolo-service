module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('IdeaCategories', {
      ideaId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Ideas',
          key: 'id',
          as: 'ideaId'
        },
        allowNull: false
      },
      categoryId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Categories',
          key: 'id',
          as: 'categoryId'
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
      }
    });
  },
  down:(queryInterface) => {
    return queryInterface.dropTable('IdeaCategories');
  }
};
