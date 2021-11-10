var express = require('express');
var router = express.Router();

const authMdw = require('./../middlewares/auth');

const dController = require('./../controllers/dashboardController');

//GET home page. 
router.get('/', function(req, res, next) {
    res.render('menu-ext/index');
});


router.get('/dashboard', authMdw, dController.index);

module.exports = router;
