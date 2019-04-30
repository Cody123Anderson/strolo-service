const Sequelize = require('sequelize');

const { sequelize } = require('../services/database');

const DealInstance = sequelize.define('DealInstance', {
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
  businessDescription: { allowNull: false, type: Sequelize.TEXT },
  businessWebsiteUrl: { allowNull: false, type: Sequelize.STRING },
  businessLogoUrl: { type: Sequelize.STRING },
  ideaTitle: { allowNull: false, type: Sequelize.STRING },
  ideaDescription: { allowNull: false, type: Sequelize.TEXT },
  ideaReservationRequired: { allowNull: false, type: Sequelize.BOOLEAN },
  dealTitle: { allowNull: false, type: Sequelize.STRING },
  dealDetails: { allowNull: false, type: Sequelize.STRING },
  dealRetailPrice: { allowNull: false, type: Sequelize.FLOAT },
  dealDiscountPrice: { allowNull: false, type: Sequelize.FLOAT },
  dealDiscountPercent: { allowNull: false, type: Sequelize.INTEGER },
  dealMaxRedemptions: { type: Sequelize.INTEGER },
  dealType: { allowNull: false, type: Sequelize.STRING },
  dealCleverPhrase: { allowNull: false, type: Sequelize.STRING },
  customCleverPhrase: { allowNull: true, type: Sequelize.TEXT },
  status: { allowNull: false, type: Sequelize.STRING },
  expirationDate: { allowNull: false, type: Sequelize.DATE },
  userFirstName: { allowNull: false, type: Sequelize.STRING },
  plusOneFirstName: { allowNull: false, type: Sequelize.STRING }
});

module.exports = DealInstance;
