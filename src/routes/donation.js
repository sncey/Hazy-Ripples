const express = require("express");
const routes = express.Router();
const donationController = require("../controllers/donation");
const authentication = require("../middleware/authentication");

routes.get('/success', authentication.authMiddleware, donationController.success);
routes.get('/cancel', authentication.authMiddleware, donationController.cancel);
routes.post('/checkout', authentication.authMiddleware, donationController.checkout);
routes.get('/', authentication.authMiddleware, donationController.getDonations);
routes.get('/:id', authentication.authMiddleware, donationController.getDonationById);

module.exports = routes;