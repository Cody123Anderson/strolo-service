const passport = require('passport');

const freeIdeaController = require('../controllers/free-idea-controller');
// const adminPassportService = require('../services/passport-admin-service'); // Sets admin jwt, and local strategies

const requireAdminAuth = passport.authenticate('jwt', { session: false} );

module.exports = (app, passport) => {
  /* READ all freeideas */
  app.get('/freeideas', freeIdeaController.getAllFreeIdeas);

  /* READ all freeideas with a given status ('active' | 'innactive') */
  app.get('/freeideas/:status', freeIdeaController.getFreeIdeasForStatus);

  /* READ all freeideas within a certain range of a zipcode  */
  app.get('/freeideas/:zip/:range', freeIdeaController.getFreeIdeasWithinRange);

  /* CREATE a freeIdea */
  app.post('/freeideas', requireAdminAuth, freeIdeaController.postFreeIdea);

  /* UPDATE a freeIdea */
  app.put('/freeideas/:id', requireAdminAuth, freeIdeaController.putFreeIdea);

  /* Delete a freeIdea */
  app.delete('/freeideas/:id', requireAdminAuth, freeIdeaController.deleteFreeIdea);
}
