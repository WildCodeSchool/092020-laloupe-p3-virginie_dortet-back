const router=require('express').Router();
const emailRoutes = require('./email.routes');
const fundingRoutes = require('./funding.routes');

router.use('/emails', emailRoutes);
router.use('/fundings', fundingRoutes);

module.exports = router;
