require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const DonationModel = require("../db/models/donation");
const sendEmail = require("../utils/email");
const donationTemplate = require("../emailTemplates/donation");
const jwt = require("jsonwebtoken");
const donationController = {};

donationController.checkout = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
            {
                price: 'price_1NZa86ITu5J53mzxc6LPDoCX',
                quantity: 1,
            },
            ],
            mode: 'payment',
            success_url: `${process.env.DOMAIN}/donation/success`,
            cancel_url: `${process.env.DOMAIN}/donation/cancel`,
        });

        const token = await jwt.sign(
            {
                sessionID: session.id,
                created: session.created,
                exp: Math.floor(Date.now() / 1000) + 3600, 
                iat: Math.floor(Date.now() / 1000), // Issued at date
            },
            process.env.JWT_SECRET
            
        );

        res.cookie('pSession', token, { httpOnly: true})
        res.redirect(303, session.url);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

donationController.success = async (req, res) => {
    const token = req.cookies.pSession;
    const emailText = donationTemplate(req.user.username);
    sendEmail(req.user.email, 'Thank You for Your Donation!', emailText);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    stripe.checkout.sessions.listLineItems(decodedToken.sessionID,
        async function(err, lineItems) {
            if (err) {
                console.error('Error retrieving line items:', err);
              } else {
                const donationDocuments = new DonationModel({ 
                    sessionID: decodedToken.sessionID,
                    amount: lineItems.data[0].amount_total,
                    donor: req.user._id,
                    date: decodedToken.created
                });
                await donationDocuments.save();
              }
        }
    );
    res.clearCookie('pSession');
    res.send('Success');
}

donationController.cancel = async (req, res) => {
    res.send('Cancelled');
}

donationController.getDonations = async (req, res) => {
    try {
        const donations = await DonationModel.find({}).populate({path: 'donor', match: { _id: req.user._id }});
        res.json(donations);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

donationController.getDonation = async (req, res) => {
    try {
        const donation = await DonationModel.findById(req.params.id).populate({path: 'donor', match: { _id: req.user._id }});
        res.json(donation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


module.exports = donationController;