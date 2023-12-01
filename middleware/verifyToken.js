const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // set req.token to jwt if jwt is in headers. else set req.token to null.
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if (!bearerToken) {
      return res.status(403).json({ error: 'You are not signed in.' });
    }
    // eslint-disable-next-line consistent-return
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = user;
      // Continue to the next middleware or route handler
    });
  } else {
    req.user = null;
  }
  return next();
};
