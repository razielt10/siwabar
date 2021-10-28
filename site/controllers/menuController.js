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

    
    newForm: (req, res) => {
        //return res.send(res.locals.user);
        db.MenuCategory.findAll({ where: { parent_id: null } }, { include : ['childCategories'] })
            .then(async function(categories) {
                for(cat of categories) {
                    cat.childs = await cat.getChildsCategories()
                }
                //const movieFavorites = user.favorites;
                return res.render('menu-food/form', { categories, errors: [], body: req.body });
            });
    },

    save: async (req, res) => {
        //antes deberia de revisar si está la cookie
        //deberia de validar datos
        console.log(req.body)
        let validation = validationResult(req)
            console.log(validation);

        if (!validation.isEmpty()) {
            return res.status(400).send({ errors: validation.mapped() });
        }

        const food = {
            name: req.body.name,
            menu_category_id: req.body.sub_category_id,
            description: req.body.description,
            price: req.body.price
        }

        db.MenuFood.create(food)
            .then(function(foodCreated){
                //redireccionar a listado de peliculas
                return res.status(201).send(foodCreated);
            }).catch(function(error){
                console.error(error);
                
                return res.status(400).send({ errors: error });
            });

        //return res.status(404).send({ errors: 'no message' })

    },

    
    logOut: (req, res) => {
        //esto no deberia de ir, sino el token
        let expires = new Date(Date.now() - 1);
        res.cookie('_rememberEmail_', '', { expires: expires });
        //el token lo deberia de manejar este servicio
        loginService.logOutSession(req, res);
    }
}