const jwt = require('jsonwebtoken');



function adminTokenController(req, res) {
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;
  
      console.log(refreshToken);
  
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_ADMIN, (err, decoded) => {
        if (err) {
          return res.status(406).json({ message: 'Unauthorized' });
        } else {
          const accessToken = generateAccessToken(decoded.email, process.env.JWTSECRET_ADMIN, '10m');
          return res.json({ accessToken });
        }
      });
    } else {
      return res.status(406).json({ message: 'Unauthorized' });
    }
  }

const adminAuthenticateMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    console.log('Refresh token missing');
    return res.status(401).json({
      status: false,
      body: {
        message: 'Timed out. Login Again.',
      },
    });
  }

  if (!authHeader) {
    console.log('Authorization header missing');
    return res.status(401).json({
      status: false,
      body: {
        message: 'Auth headers not provided in the request.',
      },
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log('Invalid auth mechanism');
    return res.status(401).json({
      status: false,
      error: {
        message: 'Invalid auth mechanism.',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.log('Bearer token missing');
    return res.status(401).json({
      status: false,
      error: {
        message: 'Bearer token missing in the authorization headers.',
      },
    });
  }

  jwt.verify(token, process.env.JWTADMIN_TOKEN, (err, admin) => {
    if (err) {
      console.log('Invalid access token');
      return res.status(403).json({
        status: false,
        error: 'Invalid access token provided, please login again.',
      });
    }

    jwt.verify(refreshToken, process.env.REFRESHADMIN_TOKEN_SECRET, (refreshErr, refreshAdmin) => {
      if (refreshErr) {
        console.log('Invalid refresh token');
        return res.status(403).json({
          status: false,
          error: 'Invalid refresh access token provided, please login again.',
        });
      }

      req.admin = refreshAdmin;
      next();
    });
  });
};

module.exports = {
    adminAuthenticateMiddleware,
    adminTokenController
}
