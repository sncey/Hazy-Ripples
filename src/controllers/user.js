/**
 *  @swagger
 *    /user/signin:
 *        get:
 *            tags: [User]
 *            description: Use to sign in
 *            parameters:
 *              - in: path
 *                username: id
 *                schema:
 *                  type: integer
 *                required: true
 *                description: Numeric ID {id} of the book to delete
 *            responses:
 *              204:
 *                description: The book with the specified ID {id} was deleted successfully
 *              404:
 *                description: The book with the specified ID {id} was not found
 *                content:
 *                  application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: 'Could not find book with ID {id}'
 */
const UserModel = require('../db/models/user');
const bcrypt = require('bcrypt');
const userController = {};

userController.getSignin = (req, res) => {
    res.render('user/signin');
};

userController.getSignup = (req, res) => {
};

userController.postSignin =  async (req, res) => {
    const { username, password, rememberMe } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res
        .status(400)
        .render('user/signin', { error: 'Wrong username or password' });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return res
        .status(400)
        .render('user/signin', { error: 'Wrong username or password' });
    }
    
    req.session.user = user;
    if (rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 14;
    }
    res.setHeader('user', user.id);
    res.redirect('/user/authenticated');
};

userController.postSignup = (req, res) => {
};

userController.logout = (req, res) => {
};


module.exports = userController;