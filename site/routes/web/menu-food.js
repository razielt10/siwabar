var express = require('express');
var router = express.Router();

const authMdw = require('./../../middlewares/auth');

const controller = require('./../../controllers/menuController');

router.get('/', authMdw, controller.index);
router.get('/new', authMdw, controller.newForm);
router.get('/:id/edit', authMdw, controller.editForm);

module.exports = router;
