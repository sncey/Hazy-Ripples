const express = require("express");
const routes = express.Router();
const userController = require("../controllers/user");
const authentication = require("../middleware/authentication");
const passport = require("../utils/googleAuth");
const googleCallbackMiddleware = require("../middleware/googleAuth");

routes.get("/", userController.getsignin);
routes.post(
  "/signin",
  authentication.isAuthenticated,
  userController.postSignin
);
routes.post(
  "/signup",
  authentication.isAuthenticated,
  userController.postSignup
);
routes.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/user.birthday.read",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
      "https://www.googleapis.com/auth/user.gender.read",
    ],
  })
);
routes.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallbackMiddleware
);
// Get user by ID
routes.get("/:userId", userController.getUserById);
routes.put("/", authentication.authMiddleware, userController.updateProfile);
routes.delete("/", authentication.authMiddleware, userController.deleteProfile);
routes.post("/signout", authentication.authMiddleware, userController.signout);
routes.get("/profile/:username", userController.profile);
routes.post("/forgotPassword", authentication.isAuthenticated, userController.forgotPassword);
routes.put("/resetPassword", authentication.isAuthenticated, userController.resetPassword);

module.exports = routes;
