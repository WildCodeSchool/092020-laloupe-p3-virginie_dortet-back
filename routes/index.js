const router=require('express').Router();
const emailRoutes = require('./email.routes');

router.use('/emails', emailRoutes);

module.exports = router;
