const UserModel = require('../db/models/user');
const jwt = require('jsonwebtoken');
const userController = {};

const generateJWT = (user,jwtExp) => { 
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            exp: jwtExp,
            iat: Math.floor(Date.now() / 1000), // Issued at date
        },
        process.env.JWT_SECRET
    );
}

const checkErorrCode = (err,res) => {
    if (err.code === 11000) {
        return res
        .status(400)
        .json({ error: `${Object.keys(err.keyValue)} already used` });
    }
    return res.status(400).json({ error: err.message });
}

//TODO: ADD GOOGLE SIGNIN
userController.googleSignin = (req, res) => {  
};

userController.postSignin =  async (req, res) => {
    const { emailOrUsername, password, rememberMe } = req.body;
    const jwtExp = rememberMe ? Math.floor(Date.now() / 1000) + 1209600 : Math.floor(Date.now() / 1000) + 86400 ; // 14 days expiration : 1 day expiration
    try {
        const user = await UserModel.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
          });
        if (!user) {
            return res
            .status(400)
            .json({ error: 'Wrong username or password' });
        }
        const passwordMatches = await user.comparePassword(password, user.password_hash);
        if (!passwordMatches) {
            return res
            .status(400)
            .json({ error: 'Wrong username or password' });
        }
        const token = await generateJWT(user,jwtExp);
        res.cookie('jwt', token, { httpOnly: true});
        res.json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

userController.postSignup = async (req, res) => {
    const jwtExp = Math.floor(Date.now() / 1000) + 86400; // 1 day expiration
    const {
        username,
        firstname,
        lastname,
        password,
        confirmPassword,
        phoneNumber,
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
            .json({ error: `${email} already used` });
        }
        user = await UserModel.create({
            username,
            firstname,
            lastname,
            phoneNumber,
            password_hash: password,
            email,
            age,
            gender,
            avatar,
        });
        const token = await generateJWT(user,jwtExp);
        res.cookie('jwt', token, { httpOnly: true});
        res.json(token);
    } catch (err) {
        checkErorrCode(err,res);
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
        // const updatedUser = await UserModel.findById(user.id);
        if (password !== confirmPassword) {
            return res
            .status(400)
            .json({ error: 'passwords do not match' });
        }
        findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        if (!updatedUser) {
          return res.status(404).json({message:'User not found'});
        }
        // updatedUser.username = username;
        // updatedUser.firstname = firstname;
        // updatedUser.lastname = lastname;
        // updatedUser.age = age;
        // updatedUser.gender=gender;
        // updatedUser.avatar = avatar;
        // updatedUser.password_hash = password;
        // await updatedUser.save();
        res.json({message:'User updated successfully'});
    } catch (err) {
        checkErorrCode(err,res)
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
        res.redirect('http://localhost:3000/api-docs');
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
};

userController.signout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.redirect('http://localhost:3000/api-docs');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

userController.profile = async (req, res) => {
    const {username} = req.params;
    try {
        const profile = await UserModel.findOne({username});
        if (!profile) {
            return res.status(404).json({message:'User not found'});
        }
        res.json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = userController;