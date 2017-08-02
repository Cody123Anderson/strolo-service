const ideaController = require('../controllers/idea-controller');
const { isAdminAuthenticated } = require('../middleware/admin-auth');

module.exports = (app, passport) => {
  /* READ all ideas */
  app.get('/ideas', ideaController.getAllIdeas);

  /* READ all ideas with a given status ('active' | 'inactive' | 'deleted') */
  app.get('/ideas/status/:status', ideaController.getIdeasForStatus);

  /* READ all ideas for a business by id  */
  app.get(
    '/ideas/business/:businessId',
    ideaController.getIdeasForBusiness
  );

  /* READ all ideas within a certain mile radius of a zipcode  */
  app.get('/ideas/zip/:zip/radius/:miles', ideaController.getIdeasWithinRadius);

  /* READ one idea by id  */
  app.get('/ideas/:id', ideaController.getIdea);

  /* READ one idea by id for a user  */
  app.get('/ideas/:ideaId/user/:userId', ideaController.getIdeaForUser);

  /* CREATE an idea */
  app.post('/ideas', isAdminAuthenticated, ideaController.createIdea);

  /* UPDATE an idea */
  app.put('/ideas/:id', isAdminAuthenticated, ideaController.updateIdea);

  /* Delete an idea */
  app.delete('/ideas/:id', isAdminAuthenticated, ideaController.deleteIdea);
}
