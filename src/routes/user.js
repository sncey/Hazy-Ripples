const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');
const authenticated = require('../middleware/authentication');

routes.post('/signin', userController.postSignin);
routes.post('/signup', userController.postSignup);
//TODO: ENABLE GOOGLE SIGNIN ROUTE
// routes.post('/googleSignin', userController.postGoogle);
routes.put('/', authenticated.authMiddleware, userController.updateProfile);
routes.delete('/', authenticated.authMiddleware, userController.deleteProfile);
routes.post('/signout', authenticated.authMiddleware, userController.signout);
routes.get('/profile/:username',userController.profile);

module.exports = routes;