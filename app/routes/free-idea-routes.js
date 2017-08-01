const freeIdeaController = require('../controllers/free-idea-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

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
  app.post('/freeideas', isAdminAuthenticated, freeIdeaController.createFreeIdea);

  /* UPDATE a freeIdea */
  app.put('/freeideas/:id', isAdminAuthenticated, freeIdeaController.updateFreeIdea);

  /* Delete a freeIdea */
  app.delete('/freeideas/:id', isAdminAuthenticated, freeIdeaController.deleteFreeIdea);
}
