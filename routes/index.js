const router=require('express').Router();
const emailRoutes = require('./email.routes');
const imageRoutes = require('./image.routes');
const useradminRoutes = require('./useradmin.routes');
const livreRoutes = require('./livre.routes');

router.use('/emails', emailRoutes);
router.use('/images', imageRoutes);
router.use('/useradmin', useradminRoutes);
router.use('/livres', livreRoutes);

module.exports = router;
