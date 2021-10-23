// recuerden instalar con npm: nm install bcrypjs --save
const bcryptjs = require('bcryptjs');

const db = require('./../../database/models');

const { validationResult } = require('express-validator')

module.exports = {
    registerUser: (req, res) => {
        //aqui deberia de validar los datos, que no esten vacios
        let validation = validationResult(req)
        console.log(validation.mapped());

        if (!validation.isEmpty()) {
            return res.status(400).send(validation.mapped());
            //return res.render('auth/register', { errors: validation.mapped(), body: req.body });
        }

    
        //creo el objeto usuario, deberia de tener una funcion constructora para eso
        let usuario = {
                email: req.body.email,
                name: req.body.name,
                password: bcryptjs.hashSync(req.body.password, 5), //aqui encripto la pass
            }
            //console.log(usuario);
            //guardo en BD
        db.User.create(usuario)
            .then(function(user) {
                //TODO: pasar a un servicio
                //loginService.loginUser(req, res, user);

                //enviar a otro html que se registro exitosamente
                //return res.redirect('/profile');
                return res.status(201).send(user);
            })
            .catch(function(error) {
                console.error(error);
                //TO-DO make error general in an div, res.locals....
                return res.status(400).send(error);
            })
    }
}