const express = require('express');
const router = express.Router();
const path = require('path');
const { check, validationResult, body } = require('express-validator')
const controller = require('./../../controllers/api/authController');
const db = require('./../../database/models')

//uso el upload como segundo parametro de la ruta, asi suba primero la imagen y luego vaya al controlador
//uso el metodo .single y le paso el nombre del imput file para trabajar solo con ese archivo
router.post('/',
    /* validar los datos que vienen del formulario */
    [
        check('name').isLength({ min: 2 }).withMessage('Name is invalid, at least 2 characters'),
        check('email').isEmail().withMessage('Invalid Email')
        .custom(function(value) {
            //validar en la base de datos que no exista
            return db.User.findOne({ where: { email: value } }).then(user => {
                if (user != null) {
                    return Promise.reject('The email already in use');
                }
            })
        }),
        check('password', 'Invalid Password, min 4 characters').isLength({ min: 4 }).bail(),
    ],
    controller.registerUser);


module.exports = router;