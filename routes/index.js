const router=require('express').Router();
const emailRoutes = require('./email.routes');
const newsRoutes = require('./news.routes');

router.use('/emails', emailRoutes);
router.use('/news', newsRoutes);

module.exports = router;
