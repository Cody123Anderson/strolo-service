const _ = require('lodash');

const { User, Idea } = require('../models');
const { formatUser } = require('../models/user');
const { encodeUserToken } = require('../utils/jwt-token');
const { comparePasswords } = require('../utils/password');

exports.getUserFromToken = (req, res) => {
  const { email } = req.user;

  User.findOne({
    where: { email },
    attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetTokenExpiration']},
    include: [{ model: Idea, as: 'favorites', through: { attributes: [] } }]
  }).then(user => {
    return res.status(200).send({ user });
  }).catch(err => {
    console.error('Error in getUserFromToken controller: ', err);
    return res.status(500).send({
      error: 'unable to retrieve user',
      details: err
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      error: 'You must provide email and password'
    });
  }

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      comparePasswords(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).send({
            error: 'unable to process server request in user password comparison'
          });
        }

        if (isMatch) {
          // Valid email and password, give them a token
          res.status(200).send({
            token: encodeUserToken(user)
          });
        } else {
          // incorrect password
          return res.status(422).send({
            error: 'incorrect email/password combination'
          });
        }
      });
    } else {
      return res.status(422).send({
        error: 'incorrect email/password combination'
      });
    }
  }).catch(err => {
    console.error('Error in loginUser controller: ', err);
    return res.status(500).send({
      error: 'unable to authenticate user',
      details: err
    });
  });
};

exports.signupUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      error: 'You must provide email and password'
    });
  }

  // See if a user with given username already exists
  User.findOne({ where: { email } }).then(user => {
    if (!user) {
      formatUser(req.body).then(formattedUser => {
        User.create(formattedUser).then(user => {
          user = user.dataValues;

          delete user.password;

          return res.status(200).send({
            info: 'new user created successfully!',
            user: user,
            token: encodeUserToken(user)
          });
        }).catch(err => {
          console.error('error creating user: ', err);
          return res.status(500).send({
            error: 'server error creating user',
            details: err
          });
        });
      }).catch(err => {
        console.error('Error formatting user in signupUser controller: ', err);
        return res.status(500).send({
          error: 'unable to sign up user',
          details: err
        });
      });
    } else {
      // user already exists
      return res.status(422).send({
        error: 'email is already in use'
      });
    }
  }).catch(err => {
    console.error('Error in signupUser controller: ', err);
    return res.status(500).send({
      error: 'unable to sign up user',
      details: err
    });
  });
}

exports.updateUserFavorites = (req, res) => {
  const { user } = req;
  const { ideaId } = req.params;
  let favoriteIds = [];

  user.favorites.forEach(idea => {
    favoriteIds.push(idea.id);
  });

  const favoriteIndex = _.indexOf(favoriteIds, ideaId);

  if (favoriteIndex > -1) {
    favoriteIds.splice(favoriteIndex, 1);

    user.setFavorites(favoriteIds).then(() => {
      return res.status(200).send({
        info: 'user favorites updated successfully!'
      });
    }).catch(err => {
      console.error('error updating user favorites: ', err);
      return res.status(500).send({
        error: 'server error updating user favorites',
        details: err
      });
    });
  } else {
    user.addFavorite(ideaId).then(() => {
      return res.status(200).send({
        info: 'user favorites updated successfully!'
      });
    }).catch(err => {
      console.error('error updating user favorites: ', err);
      return res.status(500).send({
        error: 'server error updating user favorites',
        details: err
      });
    });
  }
}

exports.updateUser = (req, res) => {
  const email = req.user.email;

  formatUser(req.body).then(formattedUser => {
    User.update(formattedUser, { where: { email } }).then(() => {
      const updatedUser = Object.assign(req.user, formattedUser);

      delete updatedUser.password;
      delete updatedUser.passwordResetToken;
      delete updatedUser.passwordResetTokenExpiration;

      return res.status(200).send({
        info: 'user updated successfully!',
        user: updatedUser
      });
    }).catch(err => {
      console.error('error updating user: ', err);
      return res.status(500).send({
        error: 'server error updating user',
        details: err
      });
    });
  }).catch(err => {
    console.error('error updating user: ', err);
    return res.status(500).send({
      error: 'server error updating user',
      details: err
    });
  });
}
