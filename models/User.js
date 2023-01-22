const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

/**
 * Mongoose schema - model podataka u kolekciji (nesto kao klasa)
 * Model apstrahuje kolekciju, pa mozemo i kroz model da pristupamo podacima, kreiramo nove, menjamo itd
 * vidi: https://mongoosejs.com/docs/schematypes.html za tipove
 * i ovo: https://mongoosejs.com/docs/ za info uopste
 */
//definisemo shemu
const userSchema = new mongoose.Schema({
    _id: String,
    pass:String,
    name: String,
    surname: String,
    birthYear: Number,
    telnum: String,
    city: String,
    picture: String
});
//kompajliramo shemu u model
const User = mongoose.model('users', userSchema);

//eksportujemo ono sto treba da bude javno vidljivo tamo gde se uradi require("models/Movie")
module.exports = User;