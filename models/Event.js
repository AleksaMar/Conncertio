const { Double } = require("mongodb");
const mongoose = require("mongoose");

/**
 * Mongoose schema - model podataka u kolekciji (nesto kao klasa)
 * Model apstrahuje kolekciju, pa mozemo i kroz model da pristupamo podacima, kreiramo nove, menjamo itd
 * vidi: https://mongoosejs.com/docs/schematypes.html za tipove
 * i ovo: https://mongoosejs.com/docs/ za info uopste
 */
//definisemo shemu
const eventSchema = new mongoose.Schema({
    name: String,
    location:[{_id:false,"latitude":Number, "longitude": Number,}],
    date: Date,
    creator: String,
    place: String,
    description: String,
    plansid: Array
});
//kompajliramo shemu u model
const Event = mongoose.model('events', eventSchema);

//eksportujemo ono sto treba da bude javno vidljivo tamo gde se uradi require("models/Movie")
module.exports = Event;