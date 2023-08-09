const jwt = require('jsonwebtoken');

const googleCallbackMiddleware = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('Failed to authenticate user');
    }
    const user = req.user;
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = currentTime + 14 * 24 * 60 * 60; // 14 days expiration

    const payload = {
      firstName: user.name,
      email: user.email,
      avatar: user.profilePicture,
      googleId: user.providerId,
      exp: expirationTime,
      iat: currentTime,
    };

    const jwtToken = jwt.sign(
      payload,
      process.env.JWT_SECRET
    );

    res.cookie('jwt', jwtToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    }); 
    res.redirect('http://localhost:3000/api-docs');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = googleCallbackMiddleware;
