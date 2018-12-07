var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const midleware = require('../midleware/auth')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/all', userController.findAllUser)
router.get('/showAll', midleware.isLogin, userController.showAllUserTodos)
router.get('/profile',userController.viewProfile)
router.put('/edit',midleware.isLogin, userController.updateUser)
router.delete('/deleteProfile',midleware.isLogin, userController.deleteUser)




module.exports = router;
