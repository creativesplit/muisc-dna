const mongoose = require("../db/connection");
const Schema = mongoose.Schema;

const UserTrack = new Schema({
    'artist': String,
    'title': String,
    'genre': String,
    'popularity': Number,
    'explicit': Boolean,
    'affinity': Number
})






module.exports = mongoose.model("UserTrack", UserTrack);