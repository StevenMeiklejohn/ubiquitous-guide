var router = require('express').Router();

router.use('/v2', require('../v2/routes/index'));
router.use('/v1', require('../v1/routes/index'));

router.get('/', function (req, res) {
	res.sendFile('index.html', { root: __dirname + '/../docs/' })
});

router.use('/', require('../v1/routes/index'));

module.exports = router;