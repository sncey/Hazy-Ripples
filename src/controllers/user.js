const UserModel = require("../db/models/user");
const AccountModel = require("../db/models/account");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const resetPasswordTemplate = require("../emailTemplates/resetPassword");
const welcomeTemplate = require("../emailTemplates/welcome");

const userController = {};

const generateJWT = (user, jwtExp) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      exp: jwtExp,
      iat: Math.floor(Date.now() / 1000), // Issued at date
    },
    process.env.JWT_SECRET
  );
};

const checkErorrCode = (err, res) => {
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ error: `${Object.keys(err.keyValue)} already used` });
  }
  return res.status(400).json({ error: err.message });
};

userController.getsignin = (req, res) => {
  res.json({ message: "signin" });
};

userController.postSignin = async (req, res) => {
  const { emailOrUsername, password, rememberMe } = req.body;
  const jwtExp = rememberMe
    ? Math.floor(Date.now() / 1000) + 1209600
    : Math.floor(Date.now() / 1000) + 86400; // 14 days expiration : 1 day expiration
  try {
    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    })
    if (!user) {
      return res.status(400).json({ error: "Wrong username or password" });
    }
    const account = await AccountModel.findOne({user: user._id})
    if (!account) {
      return res.status(400).json({ error: "Couldn't find your account" });
    }
    const passwordMatches = await account.comparePassword(
      password,
      account.password_hash
    );
    if (!passwordMatches) {
      return res.status(400).json({ error: "Wrong username or password" });
    }
    const token = await generateJWT(user, jwtExp);
    res.cookie("jwt", token, { httpOnly: false });
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
    birthday,
    gender,
    avatar,
  } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "passwords do not match" });
    }
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: `${email} already used` });
    }
    user = await UserModel.create({
      username,
      firstname,
      lastname,
      phoneNumber,
      email,
      phoneNumber,
      birthday,
      gender,
      avatar,
    });
    // console.log("user: ",user)
    // user = await user.save();
    try {
      // Save the user
      // user = await user.save();
      // console.log(user)
      const account = new AccountModel({
        user: user._id,
        password_hash: password,
      });
      // console.log("account: ",account)
      // Save the account
      await account.save();
      
    } catch (err) {
      // Handle the error during account creation
      await user.deleteOne(); // Rollback the user creation if account creation fails
      throw err;
    }

    const token = await generateJWT(user, jwtExp);
    const emailText = welcomeTemplate(user.username);
    sendEmail(email, "Welcome onboard", emailText);
    res.cookie("jwt", token, { httpOnly: false });
    res.json(token);
  } catch (err) {
    checkErorrCode(err, res);
  }
};

userController.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user by the provided user ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is found, send the user data in the response
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching user", error });
  }
};

userController.updateProfile = async (req, res) => {
  const user = req.user;
  const {
    password,
    confirmPassword,
    phoneNumber,
    birthday,
    username,
    firstname,
    lastname,
    gender,
    avatar,
  } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "passwords do not match" });
    }
    const updatedUser = await UserModel.findById(user.id);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    updatedUser.username = username;
    updatedUser.firstname = firstname;
    updatedUser.lastname = lastname;
    updatedUser.phoneNumber = phoneNumber;
    updatedUser.birthday = birthday;
    updatedUser.gender = gender;
    updatedUser.avatar = avatar;

    await updatedUser.save();
    if (password && confirmPassword) {
      const updatedAccount = await AccountModel.findOne({ user: user.id });
      updatedAccount?.set("password_hash", password);
      await updatedAccount?.save();
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    checkErorrCode(err, res);
  }
};

userController.deleteProfile = async (req, res) => {
  const user = req.user;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(user.id);
    if (!deletedUser) {
      return res.status(422).json({ message: "Blog post not found" });
    }
    await AccountModel.findOneAndDelete({ user: user.id });
    res.clearCookie("jwt");
    res.redirect("http://localhost:3000/api-docs");
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
};

userController.signout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.redirect("http://localhost:3000/api-docs");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

userController.profile = async (req, res) => {
  const { username } = req.params;
  try {
    const profile = await UserModel.findOne({ username });
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

userController.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const emailText = resetPasswordTemplate(token, user.username);
    sendEmail(email, "Reset Password", emailText);
    res.json({ message: "Email sent successfully", jwttoken: token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

userController.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const token = req.query.token;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "passwords do not match" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;
    const user = await UserModel.findOne({ email }).populate("account");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.account) {
      return res.status(404).json({ message: "Sign in with google" });
    }
    user.account.password_hash = password;
    await user.account.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = userController;
