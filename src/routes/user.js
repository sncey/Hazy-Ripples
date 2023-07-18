const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');

routes.get('/signin', userController.getSignin);
routes.get('/signup', userController.getSignup);
routes.post('/signin', userController.postSignin);
routes.post('/signup', userController.postSignup);
routes.get('/logout', userController.logout);

module.exports = routes;