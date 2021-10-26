// recuerden instalar con npm: nm install bcrypjs --save
const bcryptjs = require('bcryptjs');

const db = require('../database/models');
const loginService = require('../services/loginService');
const tokenService = require('../services/tokenService');

const { validationResult } = require('express-validator')


module.exports = {
    index: async(req, res) => {
        db.MenuFood.findAll()
            .then(function(foods) {
                res.render('menu-food/index', { data: foods, body: {} });
                return
            })
            .catch(function(err) {
                console.log(err)
                res.render('menu-food/index', { data: [], body: {} });
            });
    },

    loginPost: (req, res) => {
        //antes deberia de revisar si está la cookie
        //deberia de validar datos
        let validation = validationResult(req)
            //console.log(validation);

        if (!validation.isEmpty()) {
            //return res.send(validation.mapped());
            return res.render('auth/login', { errors: validation.mapped(), body: req.body });
        }

        //logear al usuario
        db.User.findOne({ where: { email: req.body.email } })
            .then(async(user) => {
                //ahora voy a guardar la cookie de mantenerme logeado
                if (req.body.mantenerme) {
                    let expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
                    res.cookie('_rememberEmail_', req.body.email, { expires: expires });
                    //aqui si creo la cookie y que expire en 90 dias
                    await tokenService.generateToken(res, user);
                }

                loginService.loginUser(req, res, user);

                console.log('me estoy logeando');
                return res.redirect('/profile');
            }).catch((error) => {
                console.error(error);
                return res.redirect('login');
            })

    },
    profile: (req, res) => {
        //return res.send(res.locals.user);
        db.User.findByPk(res.locals.user.id)
            .then(function(user) {
                //console.log(user.favorites);
                //const movieFavorites = user.favorites;
                return res.redirect('/dashboard');
            });
    },
    
    logOut: (req, res) => {
        //esto no deberia de ir, sino el token
        let expires = new Date(Date.now() - 1);
        res.cookie('_rememberEmail_', '', { expires: expires });
        //el token lo deberia de manejar este servicio
        loginService.logOutSession(req, res);
    }
}