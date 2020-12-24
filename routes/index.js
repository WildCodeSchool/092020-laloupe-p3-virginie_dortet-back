const router=require('express').Router();
const emailRoutes = require('./email.routes');
const imageRoutes = require('./image.routes');

router.use('/emails', emailRoutes);
router.use('/images', imageRoutes);

module.exports = router;
