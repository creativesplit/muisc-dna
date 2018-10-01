const express = require('express');
const router = express.Router()





// router.use('/', require('./application.js'));
router.use('/userTrack', require('./userTrack'));
router.use('/venue', require('./venue'));


module.exports = router;
