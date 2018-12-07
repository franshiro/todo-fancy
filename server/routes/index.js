var express = require('express');
var router = express.Router();
const usersRoute = require('./users')
const todosRoute = require('./todos')
const midleware = require('../midleware/auth')
const userController = require('../controllers/userController')

router.get('/', function(req, res, next) {
  res.send('Welcome')
});
router.post('/signin/google', userController.signinGoogle)
router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

router.use('/users', usersRoute)
router.use('/todos', todosRoute)

/* GET home page. */

module.exports = router;