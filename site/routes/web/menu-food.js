var express = require('express');
var router = express.Router();

const authMdw = require('./../../middlewares/auth');

const controller = require('./../../controllers/menuController');


router.get('/', controller.index);
router.get('/new', controller.newForm);

module.exports = router;
