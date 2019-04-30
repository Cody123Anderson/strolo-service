module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('IdeaTags', {
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
      tagId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Tags',
          key: 'id',
          as: 'tagId'
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
    return queryInterface.dropTable('IdeaTags');
  }
};
