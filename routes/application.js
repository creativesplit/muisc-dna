const express = require('express');
const router = express.Router()



app.get('/', (req, res) => {
    res.render('/layout.hbs')
})


router.use('/', require('./application.js'));
router.use('/userTrack', require('./userTrack'));
router.use('/venue', require('./venue'));


module.exports = router;
