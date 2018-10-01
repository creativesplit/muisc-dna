const mongoose = require("../db/connection");
const Schema = mongoose.Schema;

const Venue = new Schema({
    'genre': String,
    'location': String,
    'calendar': String
})


module.exports = mongoose.model("Venue", Venue) 