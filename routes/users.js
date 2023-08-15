const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users-contoller');

/* GET users listing. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/sign-up', usersController.userCreateGet);

router.post('/sign-up', usersController.userCreatePost);

module.exports = router;
