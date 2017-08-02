module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('DealInstances', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: { model: 'Users', key: 'id', as: 'userId' },
        allowNull: false
      },
      businessId: {
        type: Sequelize.UUID,
        references: { model: 'Businesses', key: 'id', as: 'businessId' },
        allowNull: false
      },
      ideaId: {
        type: Sequelize.UUID,
        references: { model: 'Ideas', key: 'id', as: 'ideaId' },
        allowNull: false
      },
      dealId: {
        type: Sequelize.UUID,
        references: { model: 'Deals', key: 'id', as: 'dealId' },
        allowNull: false
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      businessName: { allowNull: false, type: Sequelize.STRING },
      businessDescription: { allowNull: false, type: Sequelize.STRING },
      businessWebsiteUrl: { allowNull: false, type: Sequelize.STRING },
      businessLogoUrl: { allowNull: false, type: Sequelize.STRING },
      ideaTitle: { allowNull: false, type: Sequelize.STRING },
      ideaDescription: { allowNull: false, type: Sequelize.STRING },
      ideaReservationRequired: { allowNull: false, type: Sequelize.BOOLEAN },
      dealTitle: { allowNull: false, type: Sequelize.STRING },
      dealDetails: { allowNull: false, type: Sequelize.STRING },
      dealRetailPrice: { allowNull: false, type: Sequelize.FLOAT },
      dealDiscountPrice: { allowNull: false, type: Sequelize.FLOAT },
      dealDiscountPercent: { allowNull: false, type: Sequelize.INTEGER },
      dealMaxRedemptions: { allowNull: false, type: Sequelize.INTEGER },
      dealType: { allowNull: false, type: Sequelize.STRING },
      status: { allowNull: false, type: Sequelize.STRING },
      expirationDate: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('DealInstances');
  }
};