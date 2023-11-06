module.exports = function (req, res, next) {
  // set req.token to jwt if jwt is in headers. else set req.token to null.
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
  } else {
    req.token = null;
  }
  next();
};
