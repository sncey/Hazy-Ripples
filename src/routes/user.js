const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');
const authentication = require('../middleware/authentication');
const passport = require('../utils/googleAuth')
const googleCallbackMiddleware = require('../middleware/googleAuth')

routes.get('/', userController.getsignin);
routes.post('/signin',authentication.isAuthenticated, userController.postSignin);
routes.post('/signup',authentication.isAuthenticated, userController.postSignup);
//TODO: ENABLE GOOGLE SIGNIN ROUTE
routes.get(
    '/google',
    passport.authenticate('google', { scope: ['openid','email', 'profile'] })
  );
routes.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    googleCallbackMiddleware
);
// routes.post('/googleSignin', userController.postGoogle);
routes.put('/', authentication.authMiddleware, userController.updateProfile);
routes.delete('/', authentication.authMiddleware, userController.deleteProfile);
routes.post('/signout', authentication.authMiddleware, userController.signout);
routes.get('/profile/:username',userController.profile);

module.exports = routes;