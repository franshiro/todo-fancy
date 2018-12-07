const User = require('../models/user')
const Todo = require('../models/todo')
const jwt = require('jsonwebtoken')
const axios = require('axios')
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

class userController{

    static signinGoogle(req,res){
        let googleToken = req.body.googleToken
        // console.log(googleToken)
        const ticket = new Promise((resolve, reject)=> {
            client.verifyIdToken({
            idToken: googleToken,
            audience: CLIENT_ID
          }, (err, data) => {
            if(!err){
              const payload = data.getPayload();
              const userid = payload['sub'];
              resolve(userid)
            } else {
              reject(err)
            }
          })
        })
        .then(userid => {
            // console.log(userid)
            axios({
                method : 'POST',
                url : `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`,
            })
            .then(response => {
                let data  = response.data
                User.findOne({email : data.email})
                .then(user => {
                    // console.log(user)
                    let token = jwt.sign({
                        id : user.id,
                        email : user.email,
                        name : user.name,
                        isGoogle : user.isGoogle
                    }, process.env.SECRET)
                    if(user){
                        res.status(200).json({token})
                    }
                    else{
                        User.create({
                            name : data.name,
                            email : data.email,
                            password : data.sub,
                            isGoogle : true
                        })
                        .then(createUser => {
                            res.status(200).json({token})
                        })
                    }
                })
            })
          })
          .catch(err => {
            console.log(err)
          })

    }

    static signup(req, res){
        User.create({
            email : req.body.email,
            password : req.body.password,
            name : req.body.name
        })
        .then(user => {
            res.status(200).json({message : `Created account succsess`})
        })
        .catch(err => {
            res.status(500).json({
                message : `email has been use, try another email`
            })
        })

    }

    static signin(req, res){
        User.findOne({
            email : req.body.email,
            password : req.body.password
        })
        .then(user => {
            if(user){
                let token = jwt.sign({
                    id : user.id,
                    email : user.email,
                    name : user.name,
                    isGoogle : user.isGoogle
                }, process.env.SECRET)
                res.status(200).json({token})
            }
            else{
                res.status(200).json({message : 'Email or Password is Incorrect'})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({err})
        })
    }

    static updateUser(req, res){
        User.findByIdAndUpdate(req.login.id,
            {
                password : req.body.password,
                name : req.body.name
            })
            .then(() => {
                res.status(200).json({message : `Update success`})
            })
            .then(err => {
                res.status(500).json({err})
            })

    }

    static findAllUser(req, res){
        User.find()
        .then(users => {
            res.status(200).json({users})
        })
        .catch(err => {
            res.status(500).json({err})
        })

    }

    static viewProfile(req, res){
        User.findOne({ _id : req.login.id})
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({
                message : err
            })
        })
    }

    static deleteUser(req, res){
        User.findOneAndDelete(req.login.id)
        .then(() => {
            res.status(200).json({messasge : `Delete success`})
        })
        .catch(err => {
            res.status(500).json({message : err})
        })

    }
    static showAllUserTodos(req, res){
        User.findOne({ _id : req.login.id})
        .populate('todo')
        .exec()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({
                message : err
            })
        })
    }
}

module.exports = userController