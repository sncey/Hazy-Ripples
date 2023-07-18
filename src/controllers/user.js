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

/**
 *  @swagger
 *    /api/user/signin:
 *     post:
 * tags: [User]
 *      description: Signin to the application
 * parameters:
 *  - in: body
 *   name: user
 *  description: The user to create.
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * rememberMe:
 * type: boolean
 *     responses:
 *      200:
 *      description: Successfully logged in
 *     400:
 *     description: Wrong username or password
 *   /api/user/signup:
 *    post:
 *    description: Signup to the application
 *   responses:
 *   200:
 *  description: Successfully signed up
 * 400:
 * description: Wrong username or password
 * /api/user/logout:
 * get:
 * description: Logout from the application
 * responses:
 * 200:
 * description: Successfully logged out
 * 400:
 * description: Wrong username or password
 * /api/user/authenticated:
 * get:
 * description: Check if the user is authenticated
 * responses:
 * 200:
 * description: Successfully authenticated
 * 400:
 * description: Wrong username or password
 */

const UserModel = require('../db/models/user');
const bcrypt = require('bcrypt');
const userController = {};

userController.getSignin = (req, res) => {
    res.json({ message: 'Signin page' });
};

userController.getSignup = (req, res) => {
    res.json({ message: 'Signup page' });
};

userController.postSignin =  async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res
        .status(400)
        .json({ error: 'Wrong username or password' });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return res
        .status(400)
        .json({ error: 'Wrong username or password' });
    }
    
    req.session.user = user;
    if (rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 14;
    }
    res.setHeader('user', user.id).json({ message: 'Logged in successfully' });
};

userController.postSignup = async (req, res) => {
    const {
        username,
        firstname,
        lastname,
        password,
        confirmPassword,
        email,
        age,
        gender,
        avatar,
    } = req.body;
    try {
        if (password !== confirmPassword) {
        return res
            .status(400)
            .render('user/signup', { error: 'passwords do not match' });
        }
        let user = await UserModel.findOne({ email });
        if (user) {
        return res
            .status(400)
            .render('user/signup', { error: `${email}: username already used` });
        }

        const password_hash = await bcrypt.hash(password, 10);
        console.log(password_hash)
        user = await UserModel.create({
            username,
            firstname,
            lastname,
            password_hash,
            email,
            age,
            gender,
            avatar,
        });

        // req.session.user = user;
        req.user= user;
        res.json({ message: 'signed up successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    } 
};

userController.updateProfile = async (req, res) => {
    const id = req.user.id;
    const {
        username,
        firstname,
        lastname,
        password,
        confirmPassword,
        age,
        gender,
        avatar,
    } = req.body;

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(id, {$set:req.body},{new: true});
        if (!updatedUser) {
          return res.status(422).json({message:'Blog post not found'});
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(422).send('Error updating the blog post');
    }

};

userController.deleteProfile = async (req, res) => {
    const id = req.session.user.id;
    try{
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(422).json({message:'Blog post not found'});
        }
        res.json(deletedUser);
    } catch (err) {
        res.status(422).send('Error deleting the blog post');
    }
};

userController.logout = (req, res) => {
    req.session.destroy();
    res.json({ message: 'logged out successfully' });
};

userController.authenticated = async (req, res) => {
    res.json({ message: 'authenticated successfully' });
};

module.exports = userController;