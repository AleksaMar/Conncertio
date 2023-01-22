const mongoose = require("mongoose");

/**
 * Mongoose schema - model podataka u kolekciji (nesto kao klasa)
 * Model apstrahuje kolekciju, pa mozemo i kroz model da pristupamo podacima, kreiramo nove, menjamo itd
 * vidi: https://mongoosejs.com/docs/schematypes.html za tipove
 * i ovo: https://mongoosejs.com/docs/ za info uopste
 */
//definisemo shemu
const movieSchema = new mongoose.Schema({
    _id: String,
    title: String,
    directors: Array,
    birth: Date
});
//kompajliramo shemu u model
const Movie = mongoose.model('movies', movieSchema);

//eksportujemo ono sto treba da bude javno vidljivo tamo gde se uradi require("models/Movie")
module.exports = Movie;
