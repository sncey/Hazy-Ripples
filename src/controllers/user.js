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
const jwt = require('jsonwebtoken');
const userController = {};

function validatePasswordStrength(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

userController.googleSignin = (req, res) => {  
};

//edit error messages
userController.postSignin =  async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const jwtExp = rememberMe ? Math.floor(Date.now() / 1000) + 1209600 : Math.floor(Date.now() / 1000)+ 86400; // 14 days expiration : 1 day expiration
    try {
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

        const token = jwt.sign(
            {
                id: user,
                exp: jwtExp,
                iat: Math.floor(Date.now() / 1000), // Issued at date
            },
            process.env.JWT_SECRET
        );
        res.cookie('jwt', token, { httpOnly: true});
        res.json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
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
            .json({ error: 'passwords do not match' });
        }
        let user = await UserModel.findOne({ email });
        if (user) {
        return res
            .status(400)
            .json({ error: `${email}: username already used` });
        }
        const validPassword = validatePasswordStrength(password);
        if (!validPassword) {
            return res
                .status(400)
                .json({ error: 'password is not strong enough' });
        }
        const password_hash = await bcrypt.hash(password, 10);
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
        const token = jwt.sign(
            {
                id: user,
                exp:  Math.floor(Date.now() / 1000)+ 86400,
                iat: Math.floor(Date.now() / 1000), // Issued at date
            },
            process.env.JWT_SECRET
        );
        res.cookie('jwt', token, { httpOnly: true});
        res.json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    } 
};

userController.updateProfile = async (req, res) => {
    const user = req.user;
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
        const updatedUser = await UserModel.findById(user.id);
        if (!updatedUser) {
          return res.status(404).json({message:'User not found'});
        }
        const validPassword = validatePasswordStrength(password);
        if (!validPassword) {
            return res
                .status(400)
                .json({ error: 'password is not strong enough' });
        }
        if (password !== confirmPassword) {
            return res
            .status(400)
            .json({ error: 'passwords do not match' });
        }
        const password_hash = await bcrypt.hash(password, 10);
        user.username = username;
        user.firstname = firstname;
        user.lastname = lastname;
        user.age = age;
        user.gender=gender;
        user.avatar = avatar;
        user.password_hash = password_hash;
        await updatedUser.save();
        res.json({message:'User updated successfully'});
    } catch (err) {
        res.status(422).json({ error: err.message });
    }

};

userController.deleteProfile = async (req, res) => {
    const user = req.user
    try{
        const deletedUser = await UserModel.findByIdAndDelete(user.id);
        if (!deletedUser) {
          return res.status(422).json({message:'Blog post not found'});
        }
        res.clearCookie('jwt');
        // res.redirect('/api-docs');  we want to the user to be redirected to the api-docs page as a guest
        res.json(deletedUser);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
};

userController.signout = (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'logged out successfully' });
};

userController.authenticated = async (req, res) => {
    res.json({ message: 'authenticated successfully' });
};

module.exports = userController;


/user/event 