// recuerden instalar con npm: nm install bcrypjs --save
const bcryptjs = require('bcryptjs');

const db = require('../database/models');
const loginService = require('../services/loginService');
const tokenService = require('../services/tokenService');

const { validationResult } = require('express-validator')


module.exports = {
    index: async(req, res) => {
        db.MenuFood.findAll({
            order : [
                ['menu_category_id', 'ASC'], ['order' , 'ASC']
            ],
            include : { all : true, nested : true} })
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
        db.MenuCategory.findAll({ where: { parent_id: null }, include : ['childsCategories'] })
            .then(function(categories) {
                return res.render('menu-food/form', { categories, menuFood: null, errors: [], body: req.body });
            })
            .catch(function(err) {
                console.log(err)
                res.redirect('/manu-food');
            });
    },

    saveApi: async (req, res) => {
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

    editForm : (req, res) => {
        menuCategories = db.MenuCategory.findAll({ where: { parent_id: null }, include : ['childsCategories'] })

        menuFood = db.MenuFood.findByPk(req.params.id, {include : { all : true, nested : true}})

        Promise.all([menuCategories, menuFood])
            .then(function(values) {
                return res.render('menu-food/form', { categories : values[0], menuFood : values[1], errors: [], body: req.body });
            }).catch(function(error){
                console.error(error);
                
                return res.status(400).send({ errors: error });
            });
    },

    editApi: async (req, res) => {
        //antes deberia de revisar si está la cookie
        //deberia de validar datos
        console.log(req.body)
        let validation = validationResult(req)
            console.log(validation);

        if (!validation.isEmpty()) {
            return res.status(400).send({ errors: validation.mapped() });
        }

        let food = await db.MenuFood.findByPk(req.params.id);

        food.name = req.body.name
        food.menu_category_id = req.body.sub_category_id,
        food.description = req.body.description,
        food.price = req.body.price

        food.save()
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