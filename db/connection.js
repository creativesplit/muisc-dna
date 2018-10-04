const mongoose = require('mongoose');
if (process.env.NODE_ENV == 'production') {
    mongoose.connect(process.env.MLAB)
  } else {
    mongoose.connect('mongodb://localhost/music-dna'), {useNewUrlParser: true }
  }
 
mongoose.Promise = Promise;
module.exports = mongoose;