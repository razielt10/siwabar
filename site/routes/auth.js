const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const bcryptjs = require('bcryptjs');
const { check, validationResult, body } = require('express-validator')
const guestMdw = require('./../middlewares/guest');
const authMdw = require('./../middlewares/auth');
const controller = require('./../controllers/authController');
const db = require('./../database/models')

//configuro donde y como se van a llamar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = 'public/img/users/avatars';
        //ojo debe de estar creada la carpeta en public
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        //el nombre del archivo es interesante ya que debe ser un nombre unico y no reemplaze a otros archivos.
        return cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname);
        if (acceptedExtensions.includes(ext)) {
            //si es correcto subo la imagen
            cb(null, true);
        } else {
            //aqui guardo la imagen en el body
            req.file = file;
            //le digo que no la suba
            cb(null, false);
        }
    }
});


router.get('/login', guestMdw, controller.login);
router.post('/login', guestMdw, [
        check('password').isLength({ min: 4 })
        .withMessage('Invalid Password, min 4 characters').bail(),
        check('email').isEmail()
        .withMessage('Invalid Email')
        .custom((value, { req }) => {
            return db.User.findOne({ where: { email: value } }).then(user => {
                if (user == null) {
                    return Promise.reject('Wrong credentials');
                } else if (user && !bcryptjs.compareSync(req.body.password, user.password)) {
                    return Promise.reject('Wrong credentials');
                }
            })
        }),

    ],
    controller.loginPost);

router.get('/profile', authMdw, controller.profile);

router.post('/logout', authMdw, controller.logOut);

//juanca@juan.com
router.delete('/remove-favorite/:movie_id', async function(req, res) {
    //Guardar en la base de datos la pelicula que le gusta al usuario

    if (!req.session || !req.session.user) {
        return res.json({ status: 401, response: 'usuario no logeado' });
    }

    let user = await db.User.findByPk(req.session.user.id);

    let movie = await db.Movie.findByPk(req.params.movie_id);

    //uso el metodo magico remove seguido del alias que coloque en la ralacion
    user.removeFavorites(movie);

    //redirijo
    return res.redirect('/profile');
});

module.exports = router;