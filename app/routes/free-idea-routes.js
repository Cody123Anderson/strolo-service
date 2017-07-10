const freeIdeaController = require('../controllers/free-idea-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all freeideas */
  app.get('/freeideas', freeIdeaController.getAllFreeIdeas);

  /* READ all freeideas with a given status ('active' | 'inactive') */
  app.get('/freeideas/status/:status', freeIdeaController.getFreeIdeasForStatus);

  /* READ all freeideas within a certain range of a zipcode  */
  app.get('/freeideas/zip/:zip/range/:range', freeIdeaController.getFreeIdeasWithinRange);

  /* READ one freeidea by id  */
  app.get('/freeideas/:id', freeIdeaController.getFreeIdea);

  /* CREATE a freeIdea */
  app.post('/freeideas', adminAuthService.isAuthenticated, freeIdeaController.createFreeIdea);

  /* UPDATE a freeIdea */
  app.put('/freeideas/:id', adminAuthService.isAuthenticated, freeIdeaController.updateFreeIdea);

  /* Delete a freeIdea */
  app.delete('/freeideas/:id', adminAuthService.isAuthenticated, freeIdeaController.deleteFreeIdea);
}
