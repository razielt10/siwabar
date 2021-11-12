const express = require('express');
const {check, checkSchema, validationResult, body} = require('express-validator')
const authMdw = require('./../../middlewares/auth');
const controller = require('./../../controllers/menuController');

const router = express.Router();


router.post('/', [
    check('name').isLength({min:2}).withMessage('El titulo al menos debe tener 2 letras'),
    check('sub_category_id').isNumeric().withMessage('Debe seleccionar una categoria Dos'),
    check('price').isNumeric().withMessage('El Precio debe ser un numero'),
    //falta validar que no sea una imagen y lanzar el error
],  controller.saveApi);

router.put('/:id', [
    check('name').isLength({min:2}).withMessage('El titulo al menos debe tener 2 letras'),
    check('sub_category_id').isNumeric().withMessage('Debe seleccionar una categoria Dos'),
    check('price').isNumeric().withMessage('El Precio debe ser un numero'),
    //falta validar que no sea una imagen y lanzar el error
],  controller.editApi);

router.post('/reorder', [
    check('food_ids').isArray({min:2}).withMessage('Al menos debe de hacer dos items para reordenar'),
    check('sub_category_id').isLength({min:1}).withMessage('Falta la Sub Categoria'),
    //falta validar que no sea una imagen y lanzar el error
],  controller.reOrder);

module.exports = router;
