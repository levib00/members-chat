const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // set req.token to jwt if jwt is in headers. else set req.token to null.
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if (!bearerToken) {
      req.user = null;
      return next();
    }
    // eslint-disable-next-line consistent-return
    return jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        req.user = null;
        return next();
      }
      req.user = user;
      return next();
      // Continue to the next middleware or route handler
    });
  }
  req.user = null;
  return next();
};
