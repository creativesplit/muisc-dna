const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/dna");
mongoose.Promise = Promise;
module.exports = mongoose;