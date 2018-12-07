const router = require('express').Router()
const userController = require('../controllers/userController')
const todoController = require('../controllers/todoController')
const midleware = require('../midleware/auth')

router.get('/', (req, res, next) => {
    res.send(`todo`)
})

router.post('/add',midleware.isLogin, todoController.addTodo)
router.put('/update/:id',midleware.isLogin, todoController.updateTodo)
router.get('/show',midleware.isLogin, todoController.findAllTodo)
router.get('/showOne/:id',midleware.isLogin, todoController.showOne)
router.delete('/delete/:id',midleware.isLogin, todoController.deleteTodo)

router.patch('/setfinish/:id',midleware.isLogin, todoController.setFinish)
router.patch('/setNotFinishYet/:id',midleware.isLogin, todoController.setNotFinishYet)


module.exports = router