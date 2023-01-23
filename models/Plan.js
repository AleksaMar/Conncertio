const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

/**
 * Mongoose schema - model podataka u kolekciji (nesto kao klasa)
 * Model apstrahuje kolekciju, pa mozemo i kroz model da pristupamo podacima, kreiramo nove, menjamo itd
 * vidi: https://mongoosejs.com/docs/schematypes.html za tipove
 * i ovo: https://mongoosejs.com/docs/ za info uopste
 */
//definisemo shemu
const planSchema = new mongoose.Schema({
   creator: String,
   eventid: ObjectId,
   note: String,
   usersid: Array,
   startLocation:[{_id:false,"latitude":Number, "longitude": Number,}]
});
//kompajliramo shemu u model
const Plan = mongoose.model('plans', planSchema);

//eksportujemo ono sto treba da bude javno vidljivo tamo gde se uradi require("models/Movie")
module.exports = Plan;