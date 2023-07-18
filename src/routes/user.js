const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');

const isAuthenticated = function (req, res, next) {
    next();
};

// i am not sure is we want middleware for the get signup and signin
routes.get('/signin', isAuthenticated, userController.getSignin);
routes.get('/signup', isAuthenticated, userController.getSignup);
routes.post('/signin', isAuthenticated, userController.postSignin);
routes.post('/signup', isAuthenticated, userController.postSignup);
routes.put('/profile', isAuthenticated, userController.updateProfile);
routes.delete('/profile', isAuthenticated, userController.deleteProfile);
routes.get('/logout', isAuthenticated, userController.logout);
routes.get('/authenticated', isAuthenticated, userController.authenticated);

module.exports = routes;