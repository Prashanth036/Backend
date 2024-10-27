const jwt = require('jsonwebtoken');

const generateAccessToken = (username, secret, time, userId) => {
  return jwt.sign({
    username, userId
  },
    secret,
    {
      expiresIn: time
    }
  );
}

function tokenController(req, res) {
  if (req.cookies?.jwt) {

    const refreshToken = req.cookies.jwt;

    console.log(refreshToken)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {

        return res.status(406).json({ message: 'Unauthorized' });
      } else {
        const accessToken = generateAccessToken(decoded.username, process.env.JWTSECRET, "10m")
        return res.json({ accessToken });
      }
    });
  } else {
    return res.status(406).json({ message: 'Unauthorized' });
  }
}

const isAuthenticateMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    console.log("Refresh token missing");
    return res.status(401).json({
      status: false,
      body: {
        message: 'Timed out. Login Again.'
      }
    });
  }

  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).json({
      status: false,
      body: {
        message: 'Auth headers not provided in the request.'
      }
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log("Invalid auth mechanism");
    return res.status(401).json({
      status: false,
      error: {
        message: 'Invalid auth mechanism.'
      }
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.log("Bearer token missing");
    return res.status(401).json({
      status: false,
      error: {
        message: 'Bearer token missing in the authorization headers.'
      }
    });
  }
  // console.log(authHeader)
  jwt.verify(token, process.env.JWTSECRET, (err, user) => {
    if (err) {
      console.log("Invalid access token");
      return res.status(403).json({
        status: false,
        error: 'Invalid access token provided, please login again.'
      });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshUser) => {
      if (refreshErr) {
        console.log("Invalid refresh token");
        return res.status(403).json({
          status: false,
          error: 'Invalid refresh access token provided, please login again.'
        });
      }

      req.user = refreshUser;
      next();
    });
  });
}




module.exports = {
  generateAccessToken,
  tokenController,
  isAuthenticateMiddleware
};
