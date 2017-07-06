const ideaController = require('../controllers/idea-controller');
const adminAuthService = require('../services/admin-auth');

module.exports = (app, passport) => {
  /* READ all ideas */
  app.get('/ideas', ideaController.getAllIdeas);

  /* READ all ideas with a given status ('active' | 'inactive' | 'deleted') */
  app.get('/ideas/status/:status', ideaController.getIdeasForStatus);

  /* READ all ideas within a certain range of a zipcode  */
  app.get('/ideas/zip/:zip/range/:range', ideaController.getIdeasWithinRange);

  /* READ one idea by id  */
  app.get('/ideas/:id', ideaController.getIdea);

  /* CREATE an idea */
  app.post('/ideas', adminAuthService.isAuthenticated, ideaController.createIdea);

  /* UPDATE an idea */
  app.put('/ideas/:id', adminAuthService.isAuthenticated, ideaController.updateIdea);

  /* Delete an idea */
  app.delete('/ideas/:id', adminAuthService.isAuthenticated, ideaController.deleteIdea);
}