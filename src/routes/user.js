const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');
const authentication = require('../middleware/authentication');

routes.post('/signin', userController.postSignin);
routes.post('/signup', userController.postSignup);
//TODO: ENABLE GOOGLE SIGNIN ROUTE
// routes.post('/googleSignin', userController.postGoogle);
routes.put('/', authentication.authMiddleware, userController.updateProfile);
routes.delete('/', authentication.authMiddleware, userController.deleteProfile);
routes.post('/signout', authentication.authMiddleware, userController.signout);
routes.get('/profile/:username',userController.profile);

module.exports = routes;